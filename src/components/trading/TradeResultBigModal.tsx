import React, { useEffect } from 'react';
import { useTrading } from '../../context/TradingContext';
import { Trophy, TrendingUp, TrendingDown, ArrowRight, X, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';

export const TradeResultBigModal: React.FC = () => {
  const { tradeResultModal, closeTradeResultModal } = useTrading();

  useEffect(() => {
    // Auto-focus escape key listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && tradeResultModal?.isOpen) {
        closeTradeResultModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tradeResultModal, closeTradeResultModal]);

  if (!tradeResultModal || !tradeResultModal.isOpen) return null;

  const { isWin, symbol, side, amountUsd, pnl, pnlPercent, entryPrice, exitPrice } = tradeResultModal;
  const absPnl = Math.abs(pnl);
  const absPercent = Math.abs(pnlPercent);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-lg rounded-3xl p-8 border text-center shadow-2xl transition-all transform scale-100 overflow-hidden ${
          isWin
            ? 'bg-gradient-to-b from-emerald-950/90 via-slate-900 to-slate-950 border-emerald-500/50 shadow-emerald-500/20'
            : 'bg-gradient-to-b from-rose-950/80 via-slate-900 to-slate-950 border-rose-500/50 shadow-rose-500/20'
        }`}
      >
        {/* Glow halo in background */}
        <div
          className={`absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-[100px] pointer-events-none ${
            isWin ? 'bg-emerald-500/25' : 'bg-rose-500/25'
          }`}
        />

        {/* Close button */}
        <button
          onClick={closeTradeResultModal}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Big Icon */}
        <div className="relative mx-auto mb-5 flex items-center justify-center">
          <div
            className={`w-24 h-24 rounded-3xl flex items-center justify-center shadow-lg ${
              isWin
                ? 'bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white ring-8 ring-emerald-500/20 shadow-emerald-500/30'
                : 'bg-gradient-to-tr from-rose-600 to-rose-400 text-white ring-8 ring-rose-500/20 shadow-rose-500/30'
            }`}
          >
            {isWin ? (
              <Trophy className="w-12 h-12 animate-bounce" />
            ) : (
              <TrendingDown className="w-12 h-12" />
            )}
          </div>
        </div>

        {/* Big Result Badge */}
        <div className="flex items-center justify-center gap-1.5 mb-2">
          {isWin && <Sparkles className="w-4 h-4 text-emerald-400" />}
          <span
            className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider font-mono ${
              isWin
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}
          >
            {isWin ? 'PROFITABLE TRADE SETTLED' : 'TRADE CLOSED'}
          </span>
        </div>

        {/* Big Headline */}
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
          {isWin ? '🎉 TRADE WON!' : 'TRADE RESULT'}
        </h2>

        {/* Big Profit / Loss Number */}
        <div
          className={`text-4xl sm:text-5xl font-mono font-black tabular-nums my-4 tracking-tight ${
            isWin ? 'text-emerald-400 drop-shadow-[0_0_25px_rgba(16,185,129,0.4)]' : 'text-rose-400'
          }`}
        >
          {isWin ? '+' : '-'}${absPnl.toFixed(2)}
          <span className="text-lg sm:text-xl font-bold ml-2 font-sans opacity-90">
            ({isWin ? '+' : '-'}{absPercent.toFixed(1)}%)
          </span>
        </div>

        {/* Trade Details Summary Box */}
        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 text-xs font-mono mb-6 text-left space-y-2">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-500 font-sans">Market / Asset:</span>
            <span className="font-bold text-white font-sans">{symbol}</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-500 font-sans">Direction:</span>
            <span
              className={`font-bold uppercase ${
                side === 'buy' ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {side === 'buy' ? '▲ UP' : '▼ DOWN'}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-500 font-sans">Invested Margin:</span>
            <span className="font-bold text-slate-200">${amountUsd.toFixed(2)}</span>
          </div>
          {isWin && (
            <div className="flex items-center justify-between text-emerald-400">
              <span className="text-slate-500 font-sans">Total Credited to Balance:</span>
              <span className="font-bold text-emerald-300 text-sm font-mono">+${(amountUsd + absPnl).toFixed(2)}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-500 font-sans">Entry Price:</span>
            <span className="text-slate-200">${entryPrice.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-500 font-sans">Settlement Exit Price:</span>
            <span className={`font-bold ${isWin ? 'text-emerald-400' : 'text-slate-200'}`}>
              ${exitPrice.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Primary CTA button */}
        <button
          onClick={closeTradeResultModal}
          className={`w-full py-4 rounded-2xl font-bold text-white text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all ${
            isWin
              ? 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 shadow-emerald-600/30 hover:scale-[1.01]'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
          }`}
        >
          <span>{isWin ? 'Collect Profit & Continue Trading' : 'Place Next Trade'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
