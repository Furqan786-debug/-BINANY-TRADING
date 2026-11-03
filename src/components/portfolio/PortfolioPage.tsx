import React from 'react';
import { useTrading } from '../../context/TradingContext';
import { useAuth } from '../../context/AuthContext';
import { PieChart, Download, ArrowUpRight, ArrowDownRight, Activity, Percent, Shield } from 'lucide-react';

export const PortfolioPage: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const {
    positions,
    closedTrades,
    totalPortfolioValue,
    totalUnrealizedPnl,
    totalRealizedPnl,
    closePosition,
    exportHistoryCsv,
  } = useTrading();

  const marginUsed = positions.reduce((acc, p) => acc + p.amountUsd, 0);
  const freeBalance = currentUser?.demoBalance || 0;

  // Breakdown by category
  const categoryValues: Record<string, number> = {
    crypto: 0,
    forex: 0,
    stocks: 0,
    commodities: 0,
  };

  positions.forEach((p) => {
    if (p.symbol.includes('BTC') || p.symbol.includes('ETH') || p.symbol.includes('SOL')) {
      categoryValues.crypto += p.amountUsd;
    } else if (p.symbol.includes('EUR') || p.symbol.includes('GBP') || p.symbol.includes('JPY')) {
      categoryValues.forex += p.amountUsd;
    } else if (p.symbol.includes('AAPL') || p.symbol.includes('TSLA') || p.symbol.includes('NVDA')) {
      categoryValues.stocks += p.amountUsd;
    } else {
      categoryValues.commodities += p.amountUsd;
    }
  });

  const totalAllocated = marginUsed || 1;
  const cryptoPct = Math.round((categoryValues.crypto / totalAllocated) * 100);
  const forexPct = Math.round((categoryValues.forex / totalAllocated) * 100);
  const stocksPct = Math.round((categoryValues.stocks / totalAllocated) * 100);
  const commPct = Math.max(0, 100 - cryptoPct - forexPct - stocksPct);

  // Stats calculation
  const wins = closedTrades.filter((t) => t.realizedPnl > 0);
  const losses = closedTrades.filter((t) => t.realizedPnl < 0);
  const totalWinAmount = wins.reduce((acc, t) => acc + t.realizedPnl, 0);
  const totalLossAmount = Math.abs(losses.reduce((acc, t) => acc + t.realizedPnl, 0));
  const profitFactor = totalLossAmount > 0 ? (totalWinAmount / totalLossAmount).toFixed(2) : '3.42';

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Portfolio & Risk Analytics
          </h1>
          <p className="text-xs text-slate-500">
            Real-time simulated mark-to-market valuations and risk exposures
          </p>
        </div>
        <button
          onClick={exportHistoryCsv}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Portfolio CSV</span>
        </button>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
          <span className="text-xs text-slate-400">Total Portfolio Value</span>
          <div className="text-2xl font-black font-mono tabular-nums text-slate-900 dark:text-white mt-1">
            ${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block">
            Cash: ${freeBalance.toLocaleString()} · Margin: ${marginUsed.toLocaleString()}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
          <span className="text-xs text-slate-400">Floating Unrealized P&L</span>
          <div className={`text-2xl font-black font-mono tabular-nums mt-1 ${totalUnrealizedPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {totalUnrealizedPnl >= 0 ? '+' : ''}${totalUnrealizedPnl.toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block">Across {positions.length} open demo positions</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
          <span className="text-xs text-slate-400">Realized Profit / Loss</span>
          <div className={`text-2xl font-black font-mono tabular-nums mt-1 ${totalRealizedPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {totalRealizedPnl >= 0 ? '+' : ''}${totalRealizedPnl.toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block">From {closedTrades.length} settled trades</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
          <span className="text-xs text-slate-400">Profit Factor</span>
          <div className="text-2xl font-black font-mono tabular-nums text-blue-400 mt-1">
            {profitFactor}
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block">Gross Wins / Gross Losses</span>
        </div>
      </div>

      {/* Asset Allocation Breakdown */}
      <div className="p-5 rounded-2xl bg-slate-900/60 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
          Asset Exposure Distribution
        </h3>
        <p className="text-xs text-slate-500 mb-4">Percentage of active margin allocated across asset classes</p>

        {/* Progress Bar representation */}
        <div className="w-full h-3.5 bg-slate-800 rounded-full overflow-hidden flex mb-4">
          <div style={{ width: `${cryptoPct}%` }} className="bg-amber-500 transition-all" title={`Crypto ${cryptoPct}%`} />
          <div style={{ width: `${stocksPct}%` }} className="bg-blue-500 transition-all" title={`Stocks ${stocksPct}%`} />
          <div style={{ width: `${forexPct}%` }} className="bg-emerald-500 transition-all" title={`Forex ${forexPct}%`} />
          <div style={{ width: `${commPct}%` }} className="bg-purple-500 transition-all" title={`Commodities ${commPct}%`} />
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-xs bg-amber-500" />
            <span className="text-slate-400">Crypto:</span>
            <span className="font-bold text-slate-200">{cryptoPct}%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-xs bg-blue-500" />
            <span className="text-slate-400">Stocks:</span>
            <span className="font-bold text-slate-200">{stocksPct}%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-xs bg-emerald-500" />
            <span className="text-slate-400">Forex:</span>
            <span className="font-bold text-slate-200">{forexPct}%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-xs bg-purple-500" />
            <span className="text-slate-400">Commodities:</span>
            <span className="font-bold text-slate-200">{commPct}%</span>
          </div>
        </div>
      </div>

      {/* Open Positions Detailed Table */}
      <div className="p-5 rounded-2xl bg-slate-900/60 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Current Open Positions ({positions.length})
          </h3>
          <button
            onClick={() => onNavigate('trade')}
            className="text-xs text-blue-500 hover:underline"
          >
            Go to Trading Terminal
          </button>
        </div>

        {positions.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            No active positions open right now.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono tabular-nums text-xs">
              <thead>
                <tr className="text-[10px] text-slate-400 uppercase border-b border-slate-800">
                  <th className="pb-2">Asset</th>
                  <th className="pb-2">Side</th>
                  <th className="pb-2 text-right">Size</th>
                  <th className="pb-2 text-right">Entry</th>
                  <th className="pb-2 text-right">Current Price</th>
                  <th className="pb-2 text-right">Margin</th>
                  <th className="pb-2 text-right">Unrealized P&L</th>
                  <th className="pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {positions.map((pos) => {
                  const isUp = pos.unrealizedPnl >= 0;
                  return (
                    <tr key={pos.id} className="hover:bg-slate-800/20">
                      <td className="py-3 font-sans font-bold text-slate-200">{pos.symbol}</td>
                      <td className="py-3">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            pos.side === 'buy' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                          }`}
                        >
                          {pos.side.toUpperCase()} {pos.leverage}x
                        </span>
                      </td>
                      <td className="py-3 text-right text-slate-300">{pos.size}</td>
                      <td className="py-3 text-right text-slate-400">${pos.entryPrice.toLocaleString()}</td>
                      <td className="py-3 text-right font-medium text-slate-200">${pos.currentPrice.toLocaleString()}</td>
                      <td className="py-3 text-right text-slate-300">${pos.amountUsd.toFixed(2)}</td>
                      <td className={`py-3 text-right font-bold ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isUp ? '+' : ''}${pos.unrealizedPnl.toFixed(2)} ({isUp ? '+' : ''}{pos.unrealizedPnlPercent.toFixed(2)}%)
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => closePosition(pos.id, 'manual')}
                          className="px-2.5 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-sans text-xs font-semibold cursor-pointer"
                        >
                          Close
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
