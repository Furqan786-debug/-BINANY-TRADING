import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { Asset, AssetCategory } from '../../types';
import { ArrowUpRight, ArrowDownRight, ChevronRight, TrendingUp } from 'lucide-react';

interface FeaturedMarketsProps {
  onSelectAsset: (asset: Asset) => void;
}

export const FeaturedMarkets: React.FC<FeaturedMarketsProps> = ({ onSelectAsset }) => {
  const { assets } = useTrading();
  const [activeCategory, setActiveCategory] = useState<'all' | AssetCategory>('all');

  const filtered = assets.filter((a) => (activeCategory === 'all' ? true : a.category === activeCategory));

  return (
    <section id="markets" className="py-20 px-6 lg:px-12 bg-slate-950/60 border-t border-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 block mb-1">
              Real-Time Asset Quotes
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Featured Global Markets
            </h2>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            {(['all', 'crypto', 'forex', 'stocks', 'commodities'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition-colors cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Markets Grid / Table */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono tabular-nums text-xs">
              <thead>
                <tr className="text-[10px] text-slate-400 uppercase border-b border-slate-800 bg-slate-900/60">
                  <th className="py-3 px-4 font-sans">Asset</th>
                  <th className="py-3 px-4 text-right">Last Price</th>
                  <th className="py-3 px-4 text-right">24h Change</th>
                  <th className="py-3 px-4 text-right">24h High</th>
                  <th className="py-3 px-4 text-right">24h Low</th>
                  <th className="py-3 px-4 text-right">24h Volume</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {filtered.slice(0, 8).map((asset) => {
                  const isUp = asset.change24h >= 0;
                  return (
                    <tr key={asset.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-sans">
                        <div className="flex items-center gap-2.5">
                          <span className="font-extrabold text-sm text-white">{asset.symbol}</span>
                          <span className="text-slate-400 text-xs hidden sm:inline">{asset.name}</span>
                          <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                            {asset.category}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-100 text-sm">
                        ${asset.price.toLocaleString(undefined, { minimumFractionDigits: asset.precision })}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span
                          className={`inline-flex items-center gap-0.5 font-bold ${
                            isUp ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                          {isUp ? '+' : ''}{asset.change24h.toFixed(2)}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-400">
                        ${asset.high24h.toLocaleString(undefined, { minimumFractionDigits: asset.precision })}
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-400">
                        ${asset.low24h.toLocaleString(undefined, { minimumFractionDigits: asset.precision })}
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-400">
                        ${(asset.volume24h / 1000000).toFixed(1)}M
                      </td>
                      <td className="py-3.5 px-4 text-right font-sans">
                        <button
                          onClick={() => onSelectAsset(asset)}
                          className="px-3.5 py-1.5 rounded-lg bg-blue-600/15 hover:bg-blue-600 text-blue-400 hover:text-white font-semibold text-xs transition-colors cursor-pointer"
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
    </section>
  );
};
