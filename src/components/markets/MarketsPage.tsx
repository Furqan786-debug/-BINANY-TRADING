import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { Asset, AssetCategory } from '../../types';
import { Search, Star, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

interface MarketsPageProps {
  onNavigateTrade: (asset: Asset) => void;
}

export const MarketsPage: React.FC<MarketsPageProps> = ({ onNavigateTrade }) => {
  const { assets, toggleFavorite } = useTrading();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | AssetCategory | 'favorites'>('all');

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.symbol.toLowerCase().includes(search.toLowerCase()) ||
      asset.name.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all'
        ? true
        : selectedCategory === 'favorites'
        ? !!asset.isFavorite
        : asset.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Live Global Financial Markets
          </h1>
          <p className="text-xs text-slate-500">
            Real-time simulated quotes across major currency pairs, global equities, digital assets, and commodities
          </p>
        </div>
      </div>

      {/* Controls & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-900/60 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {[
            { id: 'all', label: 'All Markets' },
            { id: 'crypto', label: 'Cryptocurrency' },
            { id: 'forex', label: 'Forex' },
            { id: 'stocks', label: 'Equities / Stocks' },
            { id: 'commodities', label: 'Commodities & Indices' },
            { id: 'favorites', label: 'Favorites ★' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search symbol or company..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Markets Table */}
      <div className="p-5 rounded-2xl bg-slate-900/60 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono tabular-nums text-xs">
            <thead>
              <tr className="text-[10px] text-slate-400 uppercase border-b border-slate-800">
                <th className="pb-3 w-8"></th>
                <th className="pb-3">Market</th>
                <th className="pb-3 text-right">Price (USD)</th>
                <th className="pb-3 text-right">24h Change</th>
                <th className="pb-3 text-right">24h High</th>
                <th className="pb-3 text-right">24h Low</th>
                <th className="pb-3 text-right">24h Volume</th>
                <th className="pb-3 text-right">Max Leverage</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {filteredAssets.map((asset) => {
                const isUp = asset.change24h >= 0;
                return (
                  <tr key={asset.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="py-3">
                      <button
                        onClick={() => toggleFavorite(asset.id)}
                        className="text-slate-600 hover:text-amber-400 transition-colors"
                      >
                        <Star
                          className={`w-3.5 h-3.5 ${
                            asset.isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="py-3 font-sans">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-200">{asset.symbol}</span>
                        <span className="text-slate-400 text-xs hidden sm:inline">{asset.name}</span>
                        <span className="text-[9px] uppercase font-mono px-1 rounded bg-slate-800 text-slate-400">
                          {asset.category}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-right font-bold text-slate-100">
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
                    <td className="py-3 text-right text-slate-400">
                      ${asset.high24h.toLocaleString(undefined, { minimumFractionDigits: asset.precision })}
                    </td>
                    <td className="py-3 text-right text-slate-400">
                      ${asset.low24h.toLocaleString(undefined, { minimumFractionDigits: asset.precision })}
                    </td>
                    <td className="py-3 text-right text-slate-400">
                      ${(asset.volume24h / 1000000).toFixed(1)}M
                    </td>
                    <td className="py-3 text-right text-blue-400 font-semibold">{asset.maxLeverage}x</td>
                    <td className="py-3 text-right font-sans">
                      <button
                        onClick={() => onNavigateTrade(asset)}
                        className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors cursor-pointer"
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
  );
};
