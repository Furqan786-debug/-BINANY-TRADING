import React from 'react';
import { useTrading } from '../../context/TradingContext';
import { useAuth } from '../../context/AuthContext';
import {
  Wallet,
  TrendingUp,
  Activity,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  PlusCircle,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface UserDashboardProps {
  onNavigate: (tab: string) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ onNavigate }) => {
  const {
    currentUser,
  } = useAuth();

  const {
    assets,
    setSelectedAsset,
    positions,
    closedTrades,
    totalPortfolioValue,
    totalUnrealizedPnl,
    totalRealizedPnl,
    resetDemoBalance,
  } = useTrading();

  const winningTrades = closedTrades.filter((t) => t.realizedPnl > 0).length;
  const winRate = closedTrades.length > 0 ? ((winningTrades / closedTrades.length) * 100).toFixed(1) : '68.4';
  const dailyPnl = totalUnrealizedPnl + 124.50;
  const dailyPnlPercent = ((dailyPnl / (totalPortfolioValue || 1)) * 100).toFixed(2);

  const favorites = assets.filter((a) => a.isFavorite);

  return (
    <div className="flex flex-col gap-6">
      {/* Top Welcome / Account Kicker Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-blue-950/40 border border-slate-800 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <img
            src={currentUser?.avatarUrl || '/assets/images/avatar_trader_sarah_1793624992270.jpg'}
            alt={currentUser?.name}
            className="w-14 h-14 rounded-xl object-cover border border-slate-700 shadow-md"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white tracking-tight">
                Welcome back, {currentUser?.name || 'Trader'}
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                {currentUser?.id}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                KYC Level 2 Verified
              </span>
              <span>·</span>
              <span>Account Status: <strong className="text-emerald-400 capitalize">{currentUser?.status || 'Active'}</strong></span>
              <span>·</span>
              <span className="text-blue-400 font-mono font-semibold">Live Real-Time Market Feeds</span>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('trade')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer"
          >
            <Activity className="w-4 h-4" />
            <span>Open Terminal</span>
          </button>
          <button
            onClick={() => onNavigate('deposit')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors border border-slate-700 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>Deposit</span>
          </button>
          <button
            onClick={resetDemoBalance}
            title="Reset Trading Balance"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Portfolio Value */}
        <div className="p-4 rounded-xl bg-slate-900/60 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Total Portfolio Value</span>
            <Wallet className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black font-mono tabular-nums text-slate-900 dark:text-white">
            ${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-mono mt-2">
            <span className={Number(dailyPnlPercent) >= 0 ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
              {Number(dailyPnlPercent) >= 0 ? '+' : ''}${dailyPnl.toFixed(2)} ({Number(dailyPnlPercent) >= 0 ? '+' : ''}{dailyPnlPercent}%)
            </span>
            <span className="text-slate-500">24h P&L</span>
          </div>
        </div>

        {/* Available Trading Balance */}
        <div className="p-4 rounded-xl bg-slate-900/60 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Available Balance</span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">
              Cash
            </span>
          </div>
          <div className="text-2xl font-black font-mono tabular-nums text-slate-900 dark:text-white">
            ${(currentUser?.demoBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            Free margin available for trading
          </div>
        </div>

        {/* Open Positions & Unrealized PnL */}
        <div className="p-4 rounded-xl bg-slate-900/60 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Open Positions ({positions.length})</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono tabular-nums text-slate-900 dark:text-white">
            <span className={totalUnrealizedPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
              {totalUnrealizedPnl >= 0 ? '+' : ''}${totalUnrealizedPnl.toFixed(2)}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            Live unrealized floating P&L
          </div>
        </div>

        {/* Win Rate & Total Realized */}
        <div className="p-4 rounded-xl bg-slate-900/60 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Win Rate</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black font-mono tabular-nums text-slate-900 dark:text-white">
            {winRate}%
          </div>
          <div className="flex items-center gap-1 text-[11px] font-mono mt-2">
            <span className={totalRealizedPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
              {totalRealizedPnl >= 0 ? '+' : ''}${totalRealizedPnl.toFixed(2)}
            </span>
            <span className="text-slate-500">Realized PnL</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Watchlist & Open Positions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Watchlist & Featured Markets (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Featured Trading Markets
                </h3>
                <p className="text-xs text-slate-500">Real-time simulated multi-asset prices and 24h performance</p>
              </div>
              <button
                onClick={() => onNavigate('markets')}
                className="text-xs text-blue-500 hover:text-blue-400 flex items-center gap-1 font-medium"
              >
                <span>All Markets</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono tabular-nums text-xs">
                <thead>
                  <tr className="text-[10px] text-slate-400 uppercase border-b border-slate-800/60">
                    <th className="pb-2">Asset</th>
                    <th className="pb-2 text-right">Price</th>
                    <th className="pb-2 text-right">24h Change</th>
                    <th className="pb-2 text-right">24h Volume</th>
                    <th className="pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/30 text-xs">
                  {assets.slice(0, 6).map((asset) => {
                    const isUp = asset.change24h >= 0;
                    return (
                      <tr key={asset.id} className="hover:bg-slate-800/20 transition-colors">
                        <td className="py-3 font-sans">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-slate-100">{asset.symbol}</span>
                            <span className="text-[10px] text-slate-500 hidden sm:inline">{asset.name}</span>
                          </div>
                        </td>
                        <td className="py-3 text-right font-bold text-slate-900 dark:text-slate-100">
                          ${asset.price.toLocaleString(undefined, { minimumFractionDigits: asset.precision })}
                        </td>
                        <td className="py-3 text-right">
                          <span
                            className={`inline-flex items-center gap-0.5 font-semibold ${
                              isUp ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {isUp ? '+' : ''}{asset.change24h.toFixed(2)}%
                          </span>
                        </td>
                        <td className="py-3 text-right text-slate-500">
                          ${(asset.volume24h / 1000000).toFixed(0)}M
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedAsset(asset);
                              onNavigate('trade');
                            }}
                            className="px-2.5 py-1 rounded-md bg-blue-600/10 hover:bg-blue-600 text-blue-500 hover:text-white font-sans text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Trade
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Live Active Positions Summary (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 backdrop-blur-sm flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Active Demo Positions
                </h3>
                <p className="text-xs text-slate-500">Live mark-to-market positions</p>
              </div>
              <button
                onClick={() => onNavigate('portfolio')}
                className="text-xs text-blue-500 hover:text-blue-400 flex items-center gap-1 font-medium"
              >
                <span>View Portfolio</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {positions.length === 0 ? (
              <div className="flex flex-col items-center justify-center flex-1 py-10 text-center">
                <Activity className="w-8 h-8 text-slate-600 mb-2" />
                <span className="text-xs text-slate-400 font-medium">No open positions</span>
                <p className="text-[11px] text-slate-500 max-w-xs mt-1">
                  Practice your trading strategy by opening a simulated position on Bitcoin, Gold, or S&P 500.
                </p>
                <button
                  onClick={() => onNavigate('trade')}
                  className="mt-3 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition-colors"
                >
                  Start Demo Trading
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5 divide-y divide-slate-800/40">
                {positions.map((pos) => {
                  const isUp = pos.unrealizedPnl >= 0;
                  return (
                    <div key={pos.id} className="pt-2.5 first:pt-0 flex items-center justify-between font-mono text-xs">
                      <div>
                        <div className="flex items-center gap-1.5 font-sans">
                          <span className="font-bold text-slate-200">{pos.symbol}</span>
                          <span
                            className={`text-[9px] font-bold px-1 rounded uppercase ${
                              pos.side === 'buy' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                            }`}
                          >
                            {pos.side} {pos.leverage}x
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500">
                          Entry: ${pos.entryPrice.toLocaleString()} · Size: {pos.size}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold tabular-nums ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isUp ? '+' : ''}${pos.unrealizedPnl.toFixed(2)}
                        </div>
                        <span className={`text-[10px] ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                          ({isUp ? '+' : ''}{pos.unrealizedPnlPercent.toFixed(2)}%)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
