import React, { useState, useEffect } from 'react';
import { useTrading } from '../../context/TradingContext';

interface OrderBookEntry {
  price: number;
  size: number;
  total: number;
  depthPercent: number;
}

interface RecentTrade {
  id: string;
  price: number;
  size: number;
  time: string;
  side: 'buy' | 'sell';
}

export const OrderBook: React.FC = () => {
  const { selectedAsset } = useTrading();
  const [activeTab, setActiveTab] = useState<'orderbook' | 'trades'>('orderbook');
  const [asks, setAsks] = useState<OrderBookEntry[]>([]);
  const [bids, setBids] = useState<OrderBookEntry[]>([]);
  const [recentTrades, setRecentTrades] = useState<RecentTrade[]>([]);

  // Generate realistic order book depth based on current selected asset price
  useEffect(() => {
    const generateBook = () => {
      const p = selectedAsset.price;
      const step = p * 0.0004;

      const rawAsks: OrderBookEntry[] = [];
      let askAccum = 0;
      for (let i = 7; i >= 1; i--) {
        const price = Number((p + i * step).toFixed(selectedAsset.precision));
        const size = Number((Math.random() * (p > 1000 ? 1.8 : 50) + 0.1).toFixed(4));
        askAccum += size;
        rawAsks.push({
          price,
          size,
          total: Number(askAccum.toFixed(4)),
          depthPercent: 0,
        });
      }
      // Calculate depth %
      rawAsks.forEach((a) => {
        a.depthPercent = Math.min(100, Math.round((a.total / (askAccum || 1)) * 100));
      });

      const rawBids: OrderBookEntry[] = [];
      let bidAccum = 0;
      for (let i = 1; i <= 7; i++) {
        const price = Number((p - i * step).toFixed(selectedAsset.precision));
        const size = Number((Math.random() * (p > 1000 ? 1.8 : 50) + 0.1).toFixed(4));
        bidAccum += size;
        rawBids.push({
          price,
          size,
          total: Number(bidAccum.toFixed(4)),
          depthPercent: 0,
        });
      }
      rawBids.forEach((b) => {
        b.depthPercent = Math.min(100, Math.round((b.total / (bidAccum || 1)) * 100));
      });

      setAsks(rawAsks);
      setBids(rawBids);
    };

    generateBook();
    const interval = setInterval(generateBook, 2400);
    return () => clearInterval(interval);
  }, [selectedAsset.id, selectedAsset.price]);

  // Generate stream of recent trades
  useEffect(() => {
    const initTrades: RecentTrade[] = [];
    const now = new Date();
    for (let i = 12; i >= 0; i--) {
      const side: 'buy' | 'sell' = Math.random() > 0.48 ? 'buy' : 'sell';
      const offset = (Math.random() - 0.5) * selectedAsset.price * 0.001;
      const p = Number((selectedAsset.price + offset).toFixed(selectedAsset.precision));
      const s = Number((Math.random() * (selectedAsset.price > 1000 ? 0.8 : 30) + 0.05).toFixed(4));
      const t = new Date(now.getTime() - i * 3500);
      initTrades.push({
        id: `rt-${i}-${Date.now()}`,
        price: p,
        size: s,
        time: t.toTimeString().split(' ')[0],
        side,
      });
    }
    setRecentTrades(initTrades);

    const tradeInterval = setInterval(() => {
      const side: 'buy' | 'sell' = Math.random() > 0.49 ? 'buy' : 'sell';
      const offset = (Math.random() - 0.48) * selectedAsset.price * 0.0006;
      const p = Number((selectedAsset.price + offset).toFixed(selectedAsset.precision));
      const s = Number((Math.random() * (selectedAsset.price > 1000 ? 0.9 : 45) + 0.05).toFixed(4));
      const t = new Date().toTimeString().split(' ')[0];

      setRecentTrades((prev) => [
        {
          id: `rt-${Date.now()}`,
          price: p,
          size: s,
          time: t,
          side,
        },
        ...prev.slice(0, 20),
      ]);
    }, 2800);

    return () => clearInterval(tradeInterval);
  }, [selectedAsset.id]);

  return (
    <div className="flex flex-col h-full bg-slate-900/60 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800/80 overflow-hidden backdrop-blur-sm text-xs">
      {/* Header Tabs */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('orderbook')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              activeTab === 'orderbook'
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Order Book
          </button>
          <button
            onClick={() => setActiveTab('trades')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              activeTab === 'trades'
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Market Trades
          </button>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">
          Spread: {selectedAsset.spread}
        </span>
      </div>

      {activeTab === 'orderbook' ? (
        <div className="flex flex-col flex-1 p-2 font-mono tabular-nums overflow-hidden select-none">
          {/* Column Titles */}
          <div className="grid grid-cols-3 text-[10px] text-slate-400 uppercase font-semibold pb-1.5 px-1 border-b border-slate-200/50 dark:border-slate-800/50">
            <span>Price (USD)</span>
            <span className="text-right">Size</span>
            <span className="text-right">Total</span>
          </div>

          {/* Asks (Sell Orders - Red) */}
          <div className="flex flex-col justify-end gap-[1px] my-1">
            {asks.map((ask, idx) => (
              <div
                key={`ask-${idx}`}
                className="relative grid grid-cols-3 py-0.5 px-1 text-[11px] hover:bg-slate-800/30 rounded cursor-pointer transition-colors"
              >
                <div
                  className="absolute right-0 top-0 bottom-0 bg-rose-500/10 dark:bg-rose-500/15 pointer-events-none rounded-xs"
                  style={{ width: `${ask.depthPercent}%` }}
                />
                <span className="text-rose-500 dark:text-rose-400 font-medium z-10">
                  {ask.price.toLocaleString(undefined, { minimumFractionDigits: selectedAsset.precision })}
                </span>
                <span className="text-right text-slate-600 dark:text-slate-300 z-10">{ask.size}</span>
                <span className="text-right text-slate-400 dark:text-slate-500 z-10">{ask.total}</span>
              </div>
            ))}
          </div>

          {/* Center Spread / Current Price Indicator */}
          <div className="flex items-center justify-between px-2 py-1.5 my-1 bg-slate-100 dark:bg-slate-900/90 rounded border border-slate-200 dark:border-slate-800">
            <span
              className={`font-bold text-sm tracking-tight ${
                selectedAsset.change24h >= 0 ? 'text-emerald-500' : 'text-rose-500'
              }`}
            >
              ${selectedAsset.price.toLocaleString(undefined, { minimumFractionDigits: selectedAsset.precision })}
            </span>
            <span className="text-[10px] text-slate-500 font-sans">
              24h High: {selectedAsset.high24h.toLocaleString()}
            </span>
          </div>

          {/* Bids (Buy Orders - Green) */}
          <div className="flex flex-col gap-[1px] my-1">
            {bids.map((bid, idx) => (
              <div
                key={`bid-${idx}`}
                className="relative grid grid-cols-3 py-0.5 px-1 text-[11px] hover:bg-slate-800/30 rounded cursor-pointer transition-colors"
              >
                <div
                  className="absolute right-0 top-0 bottom-0 bg-emerald-500/10 dark:bg-emerald-500/15 pointer-events-none rounded-xs"
                  style={{ width: `${bid.depthPercent}%` }}
                />
                <span className="text-emerald-500 dark:text-emerald-400 font-medium z-10">
                  {bid.price.toLocaleString(undefined, { minimumFractionDigits: selectedAsset.precision })}
                </span>
                <span className="text-right text-slate-600 dark:text-slate-300 z-10">{bid.size}</span>
                <span className="text-right text-slate-400 dark:text-slate-500 z-10">{bid.total}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Recent Trades Stream */
        <div className="flex flex-col flex-1 p-2 font-mono tabular-nums overflow-y-auto">
          <div className="grid grid-cols-3 text-[10px] text-slate-400 uppercase font-semibold pb-1.5 px-1 border-b border-slate-200/50 dark:border-slate-800/50">
            <span>Price</span>
            <span className="text-right">Amount</span>
            <span className="text-right">Time</span>
          </div>
          <div className="flex flex-col gap-1 mt-1">
            {recentTrades.map((t) => (
              <div
                key={t.id}
                className="grid grid-cols-3 py-1 px-1 text-[11px] rounded hover:bg-slate-800/20"
              >
                <span className={t.side === 'buy' ? 'text-emerald-500 font-medium' : 'text-rose-500 font-medium'}>
                  {t.price.toLocaleString(undefined, { minimumFractionDigits: selectedAsset.precision })}
                </span>
                <span className="text-right text-slate-700 dark:text-slate-300">{t.size}</span>
                <span className="text-right text-slate-400 text-[10px]">{t.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
