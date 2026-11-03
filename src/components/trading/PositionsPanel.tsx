import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { useAuth } from '../../context/AuthContext';
import { ArrowUpRight, ArrowDownRight, XCircle, RotateCcw, Download } from 'lucide-react';

export const PositionsPanel: React.FC = () => {
  const { positions, closedTrades, closePosition, resetDemoBalance, exportHistoryCsv, totalPortfolioValue } = useTrading();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'positions' | 'history'>('positions');

  const marginUsed = positions.reduce((acc, p) => acc + p.amountUsd, 0);
  const freeMargin = (currentUser?.demoBalance || 0);
  const marginLevel = marginUsed > 0 ? ((totalPortfolioValue / marginUsed) * 100).toFixed(1) : '∞';

  return (
    <div className="flex flex-col h-full bg-slate-900/60 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800/80 overflow-hidden backdrop-blur-sm text-xs">
      {/* Header bar with tabs & quick metrics */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('positions')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              activeTab === 'positions'
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Open Positions ({positions.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              activeTab === 'history'
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Closed Trades ({closedTrades.length})
          </button>
        </div>

        {/* Account Margin & Equity Strip */}
        <div className="flex items-center gap-4 text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400">
          <span>
            Equity: <strong className="text-slate-900 dark:text-slate-100 font-bold">${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
          </span>
          <span className="hidden sm:inline">
            Used Margin: <strong className="text-slate-700 dark:text-slate-300">${marginUsed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
          </span>
          <span className="hidden md:inline">
            Free Margin: <strong className="text-emerald-500">${freeMargin.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
          </span>
          <span className="hidden lg:inline">
            Margin Level: <strong className="text-blue-500">{marginLevel}%</strong>
          </span>
          <button
            onClick={resetDemoBalance}
            title="Reset Virtual Demo Balance to $10,000"
            className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-blue-500 transition-colors ml-2"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Funds</span>
          </button>
          {activeTab === 'history' && (
            <button
              onClick={exportHistoryCsv}
              className="flex items-center gap-1 text-[10px] text-blue-500 hover:underline transition-colors"
            >
              <Download className="w-3 h-3" />
              <span>Export CSV</span>
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-x-auto overflow-y-auto min-h-[160px] p-2">
        {activeTab === 'positions' ? (
          positions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-8 text-slate-400 dark:text-slate-500">
              <span className="text-sm font-medium">No Open Positions</span>
              <span className="text-[11px] text-slate-500 mt-1">
                Select an asset and place a simulated buy or sell order to begin practice trading.
              </span>
            </div>
          ) : (
            <table className="w-full text-left font-mono tabular-nums border-collapse">
              <thead>
                <tr className="text-[10px] text-slate-400 uppercase border-b border-slate-200/60 dark:border-slate-800/60">
                  <th className="py-2 px-2">Asset</th>
                  <th className="py-2 px-2">Side</th>
                  <th className="py-2 px-2">Leverage</th>
                  <th className="py-2 px-2 text-right">Size</th>
                  <th className="py-2 px-2 text-right">Entry Price</th>
                  <th className="py-2 px-2 text-right">Mark Price</th>
                  <th className="py-2 px-2 text-right">Est. Liq</th>
                  <th className="py-2 px-2 text-right">Margin</th>
                  <th className="py-2 px-2 text-right">Unrealized P&L</th>
                  <th className="py-2 px-2 text-center">TP / SL</th>
                  <th className="py-2 px-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-[11px]">
                {positions.map((pos) => {
                  const isProfit = pos.unrealizedPnl >= 0;
                  return (
                    <tr key={pos.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="py-2.5 px-2 font-sans font-semibold text-slate-800 dark:text-slate-100">
                        {pos.symbol}
                      </td>
                      <td className="py-2.5 px-2">
                        <span
                          className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            pos.side === 'buy'
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : 'bg-rose-500/10 text-rose-500'
                          }`}
                        >
                          {pos.side === 'buy' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {pos.side.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-blue-500 font-semibold">{pos.leverage}x</td>
                      <td className="py-2.5 px-2 text-right text-slate-700 dark:text-slate-300">{pos.size}</td>
                      <td className="py-2.5 px-2 text-right text-slate-500 dark:text-slate-400">${pos.entryPrice.toLocaleString()}</td>
                      <td className="py-2.5 px-2 text-right font-medium text-slate-800 dark:text-slate-200">
                        ${pos.currentPrice.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-2 text-right text-amber-500">
                        ${pos.liquidationPrice.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-2 text-right text-slate-600 dark:text-slate-300">
                        ${pos.amountUsd.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-2 text-right font-bold">
                        <span className={isProfit ? 'text-emerald-500' : 'text-rose-500'}>
                          {isProfit ? '+' : ''}${pos.unrealizedPnl.toFixed(2)} ({isProfit ? '+' : ''}{pos.unrealizedPnlPercent.toFixed(2)}%)
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-center text-[10px] text-slate-400">
                        {pos.takeProfit ? `TP: ${pos.takeProfit}` : '-'} / {pos.stopLoss ? `SL: ${pos.stopLoss}` : '-'}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <button
                          onClick={() => closePosition(pos.id, 'manual')}
                          className="px-2 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-medium text-[10px] transition-colors cursor-pointer"
                        >
                          Close
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )
        ) : (
          /* Closed Trades Tab */
          closedTrades.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-8 text-slate-400">
              <span className="text-sm font-medium">No Closed Trades</span>
            </div>
          ) : (
            <table className="w-full text-left font-mono tabular-nums border-collapse">
              <thead>
                <tr className="text-[10px] text-slate-400 uppercase border-b border-slate-200/60 dark:border-slate-800/60">
                  <th className="py-2 px-2">Symbol</th>
                  <th className="py-2 px-2">Side</th>
                  <th className="py-2 px-2 text-right">Size</th>
                  <th className="py-2 px-2 text-right">Entry</th>
                  <th className="py-2 px-2 text-right">Exit</th>
                  <th className="py-2 px-2 text-right">Realized P&L</th>
                  <th className="py-2 px-2 text-center">Reason</th>
                  <th className="py-2 px-2 text-right">Closed At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-[11px]">
                {closedTrades.map((trade) => {
                  const isProfit = trade.realizedPnl >= 0;
                  return (
                    <tr key={trade.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="py-2.5 px-2 font-sans font-semibold text-slate-800 dark:text-slate-100">
                        {trade.symbol}
                      </td>
                      <td className="py-2.5 px-2">
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            trade.side === 'buy'
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : 'bg-rose-500/10 text-rose-500'
                          }`}
                        >
                          {trade.side.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-right text-slate-700 dark:text-slate-300">{trade.size}</td>
                      <td className="py-2.5 px-2 text-right text-slate-500 dark:text-slate-400">${trade.entryPrice.toLocaleString()}</td>
                      <td className="py-2.5 px-2 text-right text-slate-800 dark:text-slate-200">${trade.exitPrice.toLocaleString()}</td>
                      <td className="py-2.5 px-2 text-right font-bold">
                        <span className={isProfit ? 'text-emerald-500' : 'text-rose-500'}>
                          {isProfit ? '+' : ''}${trade.realizedPnl.toFixed(2)} ({isProfit ? '+' : ''}{trade.realizedPnlPercent.toFixed(2)}%)
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-center text-[10px] text-slate-400 capitalize">
                        {trade.closeReason.replace('_', ' ')}
                      </td>
                      <td className="py-2.5 px-2 text-right text-[10px] text-slate-400">
                        {new Date(trade.closedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )
        )}
      </div>
    </div>
  );
};
