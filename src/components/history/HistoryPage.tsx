import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { Download, Filter, Search, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const { closedTrades, exportHistoryCsv } = useTrading();
  const [filterAsset, setFilterAsset] = useState<string>('all');
  const [filterSide, setFilterSide] = useState<string>('all');
  const [filterOutcome, setFilterOutcome] = useState<string>('all');

  const filteredTrades = closedTrades.filter((t) => {
    const matchesAsset = filterAsset === 'all' || t.symbol === filterAsset;
    const matchesSide = filterSide === 'all' || t.side === filterSide;
    const matchesOutcome =
      filterOutcome === 'all'
        ? true
        : filterOutcome === 'profit'
        ? t.realizedPnl >= 0
        : t.realizedPnl < 0;
    return matchesAsset && matchesSide && matchesOutcome;
  });

  const totalFilteredPnl = filteredTrades.reduce((acc, t) => acc + t.realizedPnl, 0);
  const totalVolume = filteredTrades.reduce((acc, t) => acc + t.size * t.exitPrice, 0);

  const uniqueSymbols = Array.from(new Set(closedTrades.map((t) => t.symbol)));

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Trading History & Statements
          </h1>
          <p className="text-xs text-slate-500">
            Audit-grade record of simulated order fills and realized executions
          </p>
        </div>
        <button
          onClick={exportHistoryCsv}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV Statement</span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-400">Total Settled Trades</span>
          <div className="text-2xl font-black font-mono tabular-nums text-slate-900 dark:text-white mt-1">
            {filteredTrades.length}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Simulated demo order records</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-400">Net Realized P&L</span>
          <div
            className={`text-2xl font-black font-mono tabular-nums mt-1 ${
              totalFilteredPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {totalFilteredPnl >= 0 ? '+' : ''}${totalFilteredPnl.toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Cumulative realized outcome</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-400">Simulated Turnover</span>
          <div className="text-2xl font-black font-mono tabular-nums text-blue-400 mt-1">
            ${totalVolume.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Aggregate trading volume</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 p-3 bg-slate-900/60 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Filter className="w-3.5 h-3.5" />
          <span>Filters:</span>
        </div>

        {/* Asset dropdown */}
        <select
          value={filterAsset}
          onChange={(e) => setFilterAsset(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none"
        >
          <option value="all">All Assets</option>
          {uniqueSymbols.map((sym) => (
            <option key={sym} value={sym}>
              {sym}
            </option>
          ))}
        </select>

        {/* Side dropdown */}
        <select
          value={filterSide}
          onChange={(e) => setFilterSide(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none"
        >
          <option value="all">All Sides</option>
          <option value="buy">BUY (Long)</option>
          <option value="sell">SELL (Short)</option>
        </select>

        {/* Outcome dropdown */}
        <select
          value={filterOutcome}
          onChange={(e) => setFilterOutcome(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none"
        >
          <option value="all">All Outcomes</option>
          <option value="profit">Profitable Only</option>
          <option value="loss">Losses Only</option>
        </select>

        {(filterAsset !== 'all' || filterSide !== 'all' || filterOutcome !== 'all') && (
          <button
            onClick={() => {
              setFilterAsset('all');
              setFilterSide('all');
              setFilterOutcome('all');
            }}
            className="text-[11px] text-blue-500 hover:underline ml-auto"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Trades Table */}
      <div className="p-5 rounded-2xl bg-slate-900/60 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
        {filteredTrades.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs">
            No matching trade history found with current filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono tabular-nums text-xs">
              <thead>
                <tr className="text-[10px] text-slate-400 uppercase border-b border-slate-800">
                  <th className="pb-2">Trade ID</th>
                  <th className="pb-2">Symbol</th>
                  <th className="pb-2">Side</th>
                  <th className="pb-2 text-right">Size</th>
                  <th className="pb-2 text-right">Entry</th>
                  <th className="pb-2 text-right">Exit</th>
                  <th className="pb-2 text-right">Realized P&L</th>
                  <th className="pb-2 text-center">Close Reason</th>
                  <th className="pb-2 text-right">Execution Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {filteredTrades.map((t) => {
                  const isProfit = t.realizedPnl >= 0;
                  return (
                    <tr key={t.id} className="hover:bg-slate-800/20">
                      <td className="py-3 text-slate-500 text-[11px]">{t.id}</td>
                      <td className="py-3 font-sans font-bold text-slate-200">{t.symbol}</td>
                      <td className="py-3">
                        <span
                          className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            t.side === 'buy' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                          }`}
                        >
                          {t.side === 'buy' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {t.side.toUpperCase()} {t.leverage}x
                        </span>
                      </td>
                      <td className="py-3 text-right text-slate-300">{t.size}</td>
                      <td className="py-3 text-right text-slate-400">${t.entryPrice.toLocaleString()}</td>
                      <td className="py-3 text-right text-slate-200 font-medium">${t.exitPrice.toLocaleString()}</td>
                      <td className="py-3 text-right font-bold">
                        <span className={isProfit ? 'text-emerald-400' : 'text-rose-400'}>
                          {isProfit ? '+' : ''}${t.realizedPnl.toFixed(2)} ({isProfit ? '+' : ''}{t.realizedPnlPercent.toFixed(2)}%)
                        </span>
                      </td>
                      <td className="py-3 text-center text-[10px] text-slate-400 capitalize">
                        {t.closeReason.replace('_', ' ')}
                      </td>
                      <td className="py-3 text-right text-[11px] text-slate-400">
                        {new Date(t.closedAt).toLocaleDateString()} {new Date(t.closedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
