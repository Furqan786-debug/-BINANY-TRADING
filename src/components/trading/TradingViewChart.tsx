import React, { useEffect, useRef, useState } from 'react';
import {
  createChart,
  ColorType,
  IChartApi,
  ISeriesApi,
  CandlestickData,
  LineData,
  HistogramData,
  Time,
  CandlestickSeries,
  LineSeries,
  HistogramSeries,
} from 'lightweight-charts';
import { useTrading } from '../../context/TradingContext';
import { useTheme } from '../../context/ThemeContext';
import { BarChart3, LineChart, TrendingUp, SlidersHorizontal, RefreshCw } from 'lucide-react';

export const TradingViewChart: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const lineSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);
  const smaSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const emaSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);

  const {
    selectedAsset,
    activeTimeframe,
    setActiveTimeframe,
    chartType,
    setChartType,
    showIndicators,
    setShowIndicators,
    positions,
    closePosition,
  } = useTrading();

  const { theme } = useTheme();
  const [hoveredData, setHoveredData] = useState<{
    time?: string;
    open?: number;
    high?: number;
    low?: number;
    close?: number;
    change?: number;
  }>({});

  const timeframes = ['1m', '5m', '15m', '30m', '1H', '4H', '1D'];

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Dispose old chart if exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.remove();
      chartInstanceRef.current = null;
    }

    const isDark = theme === 'dark';
    const backgroundColor = isDark ? '#0B0F19' : '#FFFFFF';
    const textColor = isDark ? '#94A3B8' : '#64748B';
    const gridColor = isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(226, 232, 240, 0.8)';
    const upColor = '#10B981';
    const downColor = '#EF4444';

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight || 420,
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor: textColor,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: gridColor },
        horzLines: { color: gridColor },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: isDark ? 'rgba(148, 163, 184, 0.4)' : 'rgba(100, 116, 139, 0.4)',
          width: 1,
          style: 2,
        },
        horzLine: {
          color: isDark ? 'rgba(148, 163, 184, 0.4)' : 'rgba(100, 116, 139, 0.4)',
          width: 1,
          style: 2,
        },
      },
      rightPriceScale: {
        borderColor: gridColor,
        scaleMargins: {
          top: 0.1,
          bottom: showIndicators.volume ? 0.22 : 0.08,
        },
      },
      timeScale: {
        borderColor: gridColor,
        timeVisible: true,
        secondsVisible: false,
      },
    });

    chartInstanceRef.current = chart;

    // Format candle data for lightweight-charts
    const sortedCandles = [...selectedAsset.candles].sort((a, b) => a.time - b.time);
    const formattedCandles: CandlestickData[] = sortedCandles.map((c) => ({
      time: c.time as Time,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }));

    if (chartType === 'candlestick') {
      const candleSeries = chart.addSeries(CandlestickSeries, {
        upColor: upColor,
        downColor: downColor,
        borderVisible: false,
        wickUpColor: upColor,
        wickDownColor: downColor,
      });
      candleSeries.setData(formattedCandles);
      candleSeriesRef.current = candleSeries;
    } else {
      const lineSeries = chart.addSeries(LineSeries, {
        color: '#3B82F6',
        lineWidth: 2,
      });
      const lineData: LineData[] = formattedCandles.map((c) => ({
        time: c.time as Time,
        value: c.close,
      }));
      lineSeries.setData(lineData);
      lineSeriesRef.current = lineSeries;
    }

    // Volume histogram
    if (showIndicators.volume) {
      const volumeSeries = chart.addSeries(HistogramSeries, {
        color: 'rgba(59, 130, 246, 0.3)',
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: '', // Overlay scale
      });
      volumeSeries.priceScale().applyOptions({
        scaleMargins: {
          top: 0.8,
          bottom: 0,
        },
      });

      const volumeData: HistogramData[] = sortedCandles.map((c) => ({
        time: c.time as Time,
        value: c.volume,
        color: c.close >= c.open ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)',
      }));
      volumeSeries.setData(volumeData);
      volumeSeriesRef.current = volumeSeries;
    }

    // SMA 20 Overlay
    if (showIndicators.sma20 && sortedCandles.length >= 20) {
      const smaData: LineData[] = [];
      for (let i = 19; i < sortedCandles.length; i++) {
        const slice = sortedCandles.slice(i - 19, i + 1);
        const sum = slice.reduce((acc, curr) => acc + curr.close, 0);
        smaData.push({
          time: sortedCandles[i].time as Time,
          value: Number((sum / 20).toFixed(selectedAsset.precision)),
        });
      }
      const smaSeries = chart.addSeries(LineSeries, {
        color: '#F59E0B',
        lineWidth: 1,
        title: 'SMA 20',
      });
      smaSeries.setData(smaData);
      smaSeriesRef.current = smaSeries;
    }

    // EMA 50 Overlay
    if (showIndicators.ema50 && sortedCandles.length >= 50) {
      const emaData: LineData[] = [];
      const k = 2 / (50 + 1);
      let ema = sortedCandles.slice(0, 50).reduce((acc, curr) => acc + curr.close, 0) / 50;
      emaData.push({ time: sortedCandles[49].time as Time, value: Number(ema.toFixed(selectedAsset.precision)) });

      for (let i = 50; i < sortedCandles.length; i++) {
        ema = sortedCandles[i].close * k + ema * (1 - k);
        emaData.push({
          time: sortedCandles[i].time as Time,
          value: Number(ema.toFixed(selectedAsset.precision)),
        });
      }
      const emaSeries = chart.addSeries(LineSeries, {
        color: '#8B5CF6',
        lineWidth: 1,
        title: 'EMA 50',
      });
      emaSeries.setData(emaData);
      emaSeriesRef.current = emaSeries;
    }

    chart.timeScale().fitContent();

    // Crosshair move handler
    chart.subscribeCrosshairMove((param) => {
      if (!param || !param.time) {
        setHoveredData({});
        return;
      }

      if (candleSeriesRef.current) {
        const data = param.seriesData.get(candleSeriesRef.current) as CandlestickData | undefined;
        if (data) {
          const change = ((data.close - data.open) / data.open) * 100;
          setHoveredData({
            open: data.open,
            high: data.high,
            low: data.low,
            close: data.close,
            change,
          });
        }
      }
    });

    // Resize observer
    const handleResize = () => {
      if (chartContainerRef.current && chartInstanceRef.current) {
        chartInstanceRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight || 420,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    const observer = new ResizeObserver(() => handleResize());
    observer.observe(chartContainerRef.current);

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      if (chartInstanceRef.current) {
        chartInstanceRef.current.remove();
        chartInstanceRef.current = null;
      }
    };
  }, [selectedAsset.id, theme, chartType, showIndicators]);

  const priceLineRef = useRef<any>(null);

  // Update latest candle and dynamic price line in real time without recreating entire chart
  useEffect(() => {
    if (!selectedAsset.candles.length) return;
    const lastCandle = selectedAsset.candles[selectedAsset.candles.length - 1];

    if (candleSeriesRef.current && chartType === 'candlestick') {
      candleSeriesRef.current.update({
        time: lastCandle.time as Time,
        open: lastCandle.open,
        high: lastCandle.high,
        low: lastCandle.low,
        close: lastCandle.close,
      });

      // Update or create live floating price line
      const isUp = lastCandle.close >= lastCandle.open;
      const lineColor = isUp ? '#10B981' : '#EF4444';

      if (!priceLineRef.current) {
        priceLineRef.current = candleSeriesRef.current.createPriceLine({
          price: lastCandle.close,
          color: lineColor,
          lineWidth: 2,
          lineStyle: 2, // Dashed
          axisLabelVisible: true,
          title: 'LIVE',
        });
      } else {
        priceLineRef.current.applyOptions({
          price: lastCandle.close,
          color: lineColor,
        });
      }
    }

    if (lineSeriesRef.current && chartType === 'line') {
      lineSeriesRef.current.update({
        time: lastCandle.time as Time,
        value: lastCandle.close,
      });
    }
  }, [selectedAsset.price, chartType]);

  const currentAssetPositions = positions.filter((p) => p.assetId === selectedAsset.id);
  const posPriceLinesRef = useRef<{ [key: string]: any }>({});

  // Sync entry price lines on the candle series for every open trade on this asset
  useEffect(() => {
    if (!candleSeriesRef.current || chartType !== 'candlestick') return;

    const currentIds = new Set(currentAssetPositions.map((p) => p.id));
    // Clean removed lines
    Object.keys(posPriceLinesRef.current).forEach((id) => {
      if (!currentIds.has(id)) {
        try {
          candleSeriesRef.current?.removePriceLine(posPriceLinesRef.current[id]);
        } catch (e) {
          // ignore
        }
        delete posPriceLinesRef.current[id];
      }
    });

    // Add or update lines
    currentAssetPositions.forEach((pos) => {
      const isProfit = pos.unrealizedPnl >= 0;
      const title = `${pos.side.toUpperCase()} $${pos.amountUsd} (${isProfit ? '+' : ''}$${pos.unrealizedPnl.toFixed(2)})`;
      if (!posPriceLinesRef.current[pos.id]) {
        posPriceLinesRef.current[pos.id] = candleSeriesRef.current!.createPriceLine({
          price: pos.entryPrice,
          color: pos.side === 'buy' ? '#10B981' : '#EF4444',
          lineWidth: 2,
          lineStyle: 1, // Dotted on entry candle level
          axisLabelVisible: true,
          title,
        });
      } else {
        posPriceLinesRef.current[pos.id].applyOptions({
          price: pos.entryPrice,
          color: pos.side === 'buy' ? '#10B981' : '#EF4444',
          title,
        });
      }
    });
  }, [currentAssetPositions, chartType]);

  const latestCandle = selectedAsset.candles[selectedAsset.candles.length - 1] || {
    open: selectedAsset.price,
    high: selectedAsset.high24h,
    low: selectedAsset.low24h,
    close: selectedAsset.price,
  };

  const displayOpen = hoveredData.open ?? latestCandle.open;
  const displayHigh = hoveredData.high ?? latestCandle.high;
  const displayLow = hoveredData.low ?? latestCandle.low;
  const displayClose = hoveredData.close ?? latestCandle.close;
  const displayChange = hoveredData.change ?? ((displayClose - displayOpen) / displayOpen) * 100;
  const isUp = displayClose >= displayOpen;

  return (
    <div className="flex flex-col h-full bg-slate-900/60 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800/80 overflow-hidden backdrop-blur-sm">
      {/* Chart Top Controls & OHLC bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 text-xs bg-slate-50/50 dark:bg-slate-900/40">
        {/* Left: Timeframe pills */}
        <div className="flex items-center gap-1">
          {/* Live pulsing motion indicator */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[10px] text-emerald-400 font-mono font-bold mr-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>LIVE</span>
          </div>

          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setActiveTimeframe(tf)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                activeTimeframe === tf
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/60'
              }`}
            >
              {tf}
            </button>
          ))}
          <div className="w-[1px] h-4 bg-slate-300 dark:bg-slate-700 mx-1" />
          {/* Chart Type Toggle */}
          <button
            onClick={() => setChartType(chartType === 'candlestick' ? 'line' : 'candlestick')}
            title="Toggle Chart Type"
            className={`p-1.5 rounded transition-colors ${
              chartType === 'candlestick'
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {chartType === 'candlestick' ? <BarChart3 className="w-3.5 h-3.5" /> : <LineChart className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Middle: Live OHLC Display */}
        <div className="hidden lg:flex items-center gap-3 font-mono text-[11px] tabular-nums text-slate-500 dark:text-slate-400">
          <span>
            O: <span className="text-slate-900 dark:text-slate-200">{displayOpen.toLocaleString(undefined, { minimumFractionDigits: selectedAsset.precision })}</span>
          </span>
          <span>
            H: <span className="text-slate-900 dark:text-slate-200">{displayHigh.toLocaleString(undefined, { minimumFractionDigits: selectedAsset.precision })}</span>
          </span>
          <span>
            L: <span className="text-slate-900 dark:text-slate-200">{displayLow.toLocaleString(undefined, { minimumFractionDigits: selectedAsset.precision })}</span>
          </span>
          <span>
            C:{' '}
            <span className={isUp ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-rose-600 dark:text-rose-400 font-semibold'}>
              {displayClose.toLocaleString(undefined, { minimumFractionDigits: selectedAsset.precision })}
            </span>
          </span>
          <span className={`font-semibold ${isUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            ({isUp ? '+' : ''}{displayChange.toFixed(2)}%)
          </span>
        </div>

        {/* Right: Indicators Toggles */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => setShowIndicators((prev) => ({ ...prev, sma20: !prev.sma20 }))}
            className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
              showIndicators.sma20
                ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            SMA 20
          </button>
          <button
            onClick={() => setShowIndicators((prev) => ({ ...prev, ema50: !prev.ema50 }))}
            className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
              showIndicators.ema50
                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            EMA 50
          </button>
          <button
            onClick={() => setShowIndicators((prev) => ({ ...prev, volume: !prev.volume }))}
            className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
              showIndicators.volume
                ? 'bg-blue-500/10 text-blue-500 border border-blue-500/30'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            VOL
          </button>
          <button
            onClick={() => {
              if (chartInstanceRef.current) chartInstanceRef.current.timeScale().fitContent();
            }}
            title="Reset Chart Zoom"
            className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Chart Canvas Container */}
      <div className="relative flex-1 min-h-[380px] w-full" ref={chartContainerRef}>
        {/* Floating Active Trades on Candle HUD Overlay */}
        {currentAssetPositions.length > 0 && (
          <div className="absolute top-3 left-4 z-20 flex flex-wrap gap-2 pointer-events-auto max-w-full">
            {currentAssetPositions.map((pos) => {
              const isProfit = pos.unrealizedPnl >= 0;
              const timeLeftSec = pos.expiryTime
                ? Math.max(0, Math.ceil((pos.expiryTime - Date.now()) / 1000))
                : null;
              return (
                <div
                  key={pos.id}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border backdrop-blur-md shadow-xl text-xs font-mono transition-all animate-in fade-in ${
                    pos.side === 'buy'
                      ? 'bg-slate-900/90 border-emerald-500/50 text-emerald-300 ring-1 ring-emerald-500/20'
                      : 'bg-slate-900/90 border-rose-500/50 text-rose-300 ring-1 ring-rose-500/20'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        pos.side === 'buy' ? 'bg-emerald-400' : 'bg-rose-400'
                      } animate-pulse`}
                    />
                    <span>{pos.side === 'buy' ? '▲ UP' : '▼ DOWN'} (+{pos.targetProfitPercent || 30}%)</span>
                  </div>
                  <span className="text-slate-400 font-sans">${pos.amountUsd.toFixed(0)} @ ${pos.entryPrice.toLocaleString()}</span>
                  <span className={`font-bold ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isProfit ? '+' : ''}${pos.unrealizedPnl.toFixed(2)}
                  </span>
                  {timeLeftSec !== null && (
                    <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold">
                      ⏳ {timeLeftSec}s
                    </span>
                  )}
                  <button
                    onClick={() => closePosition(pos.id, 'manual')}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-sans font-semibold cursor-pointer border border-slate-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Subtle watermark in bottom left */}
        <div className="absolute bottom-3 left-4 pointer-events-none z-10 flex items-center gap-2 opacity-30 select-none">
          <span className="font-bold text-xs tracking-wider text-slate-500">TRADEPRO</span>
          <span className="text-[10px] font-mono text-slate-600">{selectedAsset.symbol} · {activeTimeframe}</span>
        </div>
      </div>
    </div>
  );
};
