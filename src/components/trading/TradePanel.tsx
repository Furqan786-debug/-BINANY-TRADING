import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { useAuth } from '../../context/AuthContext';
import { OrderSide, OrderType } from '../../types';
import { ArrowUp, ArrowDown, Clock, Zap, AlertTriangle, Sliders, Percent, DollarSign } from 'lucide-react';

export const TradePanel: React.FC = () => {
  const { selectedAsset, placeOrder } = useTrading();
  const { currentUser } = useAuth();

  // Mode: 'candle' | 'margin'
  const [tradeStyle, setTradeStyle] = useState<'candle' | 'margin'>('candle');

  // Trade inputs
  const [tradeAmount, setTradeAmount] = useState<string>('100');
  // Profit selection from 10% to 200% (User can choose profit of his choice)
  const [profitPercent, setProfitPercent] = useState<number>(30); // Default 30% ($30 on $100)
  const [candleDuration, setCandleDuration] = useState<number>(30); // 30s or 60s
  
  // Margin mode states
  const [marginSide, setMarginSide] = useState<OrderSide>('buy');
  const [leverage, setLeverage] = useState<number>(10);

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successNotice, setSuccessNotice] = useState<string>('');

  const availableBalance = currentUser?.demoBalance || 0;
  const numAmount = parseFloat(tradeAmount) || 0;

  // Real-time profit calculations
  const expectedProfitUsd = Number(((numAmount * profitPercent) / 100).toFixed(2));
  const totalPayoutUsd = Number((numAmount + expectedProfitUsd).toFixed(2));

  const PROFIT_PRESETS = [10, 20, 30, 50, 80, 100, 150, 200];
  const AMOUNT_PRESETS = ['25', '50', '100', '250', '500'];

  // Submit direct UP or DOWN trade
  const handleExecuteTrade = (side: OrderSide) => {
    setErrorMessage('');
    setSuccessNotice('');

    if (numAmount <= 0) {
      setErrorMessage('Please enter a valid trade amount.');
      return;
    }

    if (numAmount > availableBalance) {
      setErrorMessage(`Insufficient funds. Your balance: $${availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`);
      return;
    }

    const res = placeOrder({
      side,
      orderType: 'market',
      amountUsd: numAmount,
      leverage: tradeStyle === 'margin' ? leverage : 1,
      durationSeconds: candleDuration,
      targetProfitPercent: profitPercent,
    });

    if (!res.success) {
      setErrorMessage(res.message || 'Execution error');
    } else {
      setSuccessNotice(
        `Trade placed on ${selectedAsset.symbol}! Direction: ${side === 'buy' ? '▲ UP' : '▼ DOWN'} · Target Profit: +${profitPercent}% (+$${expectedProfitUsd.toFixed(2)})`
      );
      setTimeout(() => setSuccessNotice(''), 4500);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/70 dark:bg-slate-950/90 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden backdrop-blur-sm p-4 text-xs select-none">
      {/* Top Mode Selector: Fast Candle Trade vs Margin Order */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900/90 rounded-xl mb-3 border border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => {
            setTradeStyle('candle');
            setErrorMessage('');
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
            tradeStyle === 'candle'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-300" />
          <span>Quick Candle Trade</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setTradeStyle('margin');
            setErrorMessage('');
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
            tradeStyle === 'margin'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Margin Multiplier</span>
        </button>
      </div>

      {/* Available Balance display */}
      <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs mb-3">
        <span className="text-slate-400 font-medium">Available Balance:</span>
        <strong className="font-mono text-emerald-400 font-bold text-sm">
          ${availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </strong>
      </div>

      <div className="flex flex-col gap-3.5 flex-1 overflow-y-auto pr-0.5">
        {/* Trade Amount Input */}
        <div>
          <div className="flex items-center justify-between text-slate-400 font-semibold mb-1">
            <span>Trade Amount</span>
            <span className="font-mono text-[11px] text-slate-500">Min $5 · Max Balance</span>
          </div>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono font-bold">$</span>
            <input
              type="number"
              min="5"
              step="any"
              value={tradeAmount}
              onChange={(e) => setTradeAmount(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-8 pr-4 py-2.5 font-mono font-bold text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="100.00"
            />
          </div>
          {/* Quick Amount Presets */}
          <div className="grid grid-cols-5 gap-1.5 mt-2">
            {AMOUNT_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setTradeAmount(preset)}
                className={`py-1.5 rounded-lg border font-mono text-[11px] font-bold cursor-pointer transition-all ${
                  tradeAmount === preset
                    ? 'bg-blue-600/30 border-blue-500 text-blue-300'
                    : 'bg-slate-800/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                ${preset}
              </button>
            ))}
          </div>
        </div>

        {/* PROFIT SELECTION: 10% to 200% */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-emerald-400" />
              Target Profit Percentage
            </span>
            <span className="font-mono text-emerald-400 font-black text-sm bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              +{profitPercent}%
            </span>
          </div>

          <p className="text-[10px] text-slate-400 mb-2">
            Choose your desired profit from 10% up to 200%. On ${numAmount || 100}, you gain +${expectedProfitUsd.toFixed(2)}.
          </p>

          {/* Slider from 10% to 200% */}
          <div className="flex items-center gap-2 mb-2.5">
            <input
              type="range"
              min="10"
              max="200"
              step="5"
              value={profitPercent}
              onChange={(e) => setProfitPercent(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          {/* Quick Profit Percentage Chips */}
          <div className="grid grid-cols-4 gap-1.5">
            {PROFIT_PRESETS.map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => setProfitPercent(pct)}
                className={`py-1 rounded-md text-[10px] font-mono font-bold cursor-pointer transition-all ${
                  profitPercent === pct
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-xs'
                    : 'bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                +{pct}%
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Profit & Payout Calculation Box */}
        <div className="p-3 rounded-xl bg-gradient-to-br from-slate-950 to-slate-900 border border-emerald-500/25 flex flex-col gap-1.5 font-mono">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>Invested Margin:</span>
            <span className="text-white font-bold">${numAmount.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-emerald-400 text-xs">
            <span>Target Profit (+{profitPercent}%):</span>
            <span className="font-bold">+${expectedProfitUsd.toFixed(2)}</span>
          </div>
          <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-300 font-semibold">Total Payout:</span>
            <span className="text-emerald-300 font-black text-sm">${totalPayoutUsd.toFixed(2)}</span>
          </div>
        </div>

        {/* Candle Duration Options */}
        {tradeStyle === 'candle' ? (
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="font-semibold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                Candle Expiry Time
              </span>
              <span className="text-blue-400 font-mono font-bold">{candleDuration} Seconds</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCandleDuration(30)}
                className={`py-2 rounded-xl font-mono font-bold text-xs border cursor-pointer transition-all ${
                  candleDuration === 30
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-xs'
                    : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                30 Seconds
              </button>
              <button
                type="button"
                onClick={() => setCandleDuration(60)}
                className={`py-2 rounded-xl font-mono font-bold text-xs border cursor-pointer transition-all ${
                  candleDuration === 60
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-xs'
                    : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                60 Seconds (1m Candle)
              </button>
            </div>
          </div>
        ) : (
          /* Margin Mode Leverage */
          <div>
            <div className="flex justify-between text-slate-400 mb-1">
              <span>Leverage Multiplier</span>
              <span className="font-mono text-blue-400 font-bold">{leverage}x</span>
            </div>
            <div className="grid grid-cols-5 gap-1">
              {[1, 5, 10, 20, 50].map((lev) => (
                <button
                  key={lev}
                  type="button"
                  onClick={() => setLeverage(lev)}
                  className={`py-1.5 rounded-lg font-mono text-[11px] cursor-pointer transition-colors ${
                    leverage === lev
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {lev}x
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Feedback Messages */}
        {errorMessage && (
          <div className="flex items-center gap-1.5 p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successNotice && (
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs">
            {successNotice}
          </div>
        )}

        {/* Direct UP and DOWN Trade Action Buttons (No confusing names!) */}
        <div className="flex flex-col gap-2.5 mt-auto pt-2">
          {/* UP Button */}
          <button
            type="button"
            onClick={() => handleExecuteTrade('buy')}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 active:scale-[0.99] text-white font-bold shadow-lg shadow-emerald-600/25 flex items-center justify-between cursor-pointer transition-all border border-emerald-400/30 group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-700/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ArrowUp className="w-5 h-5 text-white stroke-[3]" />
              </div>
              <div className="text-left">
                <span className="text-base font-black tracking-wide block leading-tight">▲ UP</span>
                <span className="text-[10px] text-emerald-100 font-mono">Prediction: Next Movement UP</span>
              </div>
            </div>
            <div className="text-right font-mono">
              <span className="text-xs font-bold text-emerald-100 block">+{profitPercent}% Profit</span>
              <span className="text-xs font-black text-white">+${expectedProfitUsd.toFixed(2)}</span>
            </div>
          </button>

          {/* DOWN Button */}
          <button
            type="button"
            onClick={() => handleExecuteTrade('sell')}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 active:scale-[0.99] text-white font-bold shadow-lg shadow-rose-600/25 flex items-center justify-between cursor-pointer transition-all border border-rose-400/30 group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-700/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ArrowDown className="w-5 h-5 text-white stroke-[3]" />
              </div>
              <div className="text-left">
                <span className="text-base font-black tracking-wide block leading-tight">▼ DOWN</span>
                <span className="text-[10px] text-rose-100 font-mono">Prediction: Next Movement DOWN</span>
              </div>
            </div>
            <div className="text-right font-mono">
              <span className="text-xs font-bold text-rose-100 block">+{profitPercent}% Profit</span>
              <span className="text-xs font-black text-white">+${expectedProfitUsd.toFixed(2)}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
