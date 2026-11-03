import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { Star, ChevronDown, Search, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Asset } from '../../types';

export const AssetTickerHeader: React.FC = () => {
  const { assets, selectedAsset, setSelectedAsset, toggleFavorite } = useTrading();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'crypto' | 'forex' | 'stocks' | 'commodities'>('all');

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = filterCategory === 'all' || asset.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  const isUp = selectedAsset.change24h >= 0;

  return (
    <div className="relative flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-slate-900/80 dark:bg-slate-950/90 rounded-xl border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
      {/* Left: Asset Selector trigger & basic info */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => toggleFavorite(selectedAsset.id)}
          className="text-slate-400 hover:text-amber-400 transition-colors p-1"
          title="Toggle Favorite"
        >
          <Star
            className={`w-4 h-4 ${
              selectedAsset.isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-500'
            }`}
          />
        </button>

        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-left transition-colors cursor-pointer border border-slate-700/50"
        >
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-slate-100 font-sans tracking-tight">
                {selectedAsset.symbol}
              </span>
              <span className="text-[10px] text-slate-400 uppercase font-mono px-1 rounded bg-slate-700/40">
                {selectedAsset.category}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 block -mt-0.5 truncate max-w-[140px]">
              {selectedAsset.name}
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </button>

        {/* Live Price and 24h change */}
        <div className="flex items-baseline gap-2 pl-2 border-l border-slate-700/50">
          <span
            className={`font-mono text-lg font-extrabold tabular-nums tracking-tight ${
              isUp ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            ${selectedAsset.price.toLocaleString(undefined, { minimumFractionDigits: selectedAsset.precision })}
          </span>
          <div
            className={`flex items-center text-xs font-mono font-semibold tabular-nums ${
              isUp ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            <span>{isUp ? '+' : ''}{selectedAsset.change24h.toFixed(2)}%</span>
          </div>
        </div>
      </div>

      {/* Right: 24h High, 24h Low, 24h Volume */}
      <div className="hidden sm:flex items-center gap-5 text-xs font-mono tabular-nums text-slate-400">
        <div>
          <span className="text-[10px] uppercase text-slate-500 block">24h High</span>
          <span className="text-slate-200">
            ${selectedAsset.high24h.toLocaleString(undefined, { minimumFractionDigits: selectedAsset.precision })}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase text-slate-500 block">24h Low</span>
          <span className="text-slate-200">
            ${selectedAsset.low24h.toLocaleString(undefined, { minimumFractionDigits: selectedAsset.precision })}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase text-slate-500 block">24h Volume</span>
          <span className="text-slate-200">
            ${(selectedAsset.volume24h / 1000000).toFixed(1)}M
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase text-slate-500 block">Max Lev</span>
          <span className="text-blue-400 font-semibold">{selectedAsset.maxLeverage}x</span>
        </div>
      </div>

      {/* Asset Search & Selection Modal Dropdown */}
      {dropdownOpen && (
        <div className="absolute top-full left-0 mt-2 w-96 max-w-[95vw] bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden text-xs">
          {/* Search Input */}
          <div className="p-3 border-b border-slate-800">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search symbol or name..."
                autoFocus
                className="w-full bg-slate-800/80 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            {/* Category tabs */}
            <div className="flex items-center gap-1 mt-2 overflow-x-auto">
              {(['all', 'crypto', 'forex', 'stocks', 'commodities'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-2 py-1 rounded text-[10px] font-medium capitalize transition-colors ${
                    filterCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* List of Assets */}
          <div className="max-h-64 overflow-y-auto divide-y divide-slate-800/40">
            {filteredAssets.map((asset) => {
              const assetUp = asset.change24h >= 0;
              return (
                <button
                  key={asset.id}
                  onClick={() => {
                    setSelectedAsset(asset);
                    setDropdownOpen(false);
                  }}
                  className={`flex items-center justify-between w-full px-3 py-2.5 hover:bg-slate-800/70 text-left transition-colors ${
                    selectedAsset.id === asset.id ? 'bg-slate-800/40' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Star
                      className={`w-3.5 h-3.5 ${
                        asset.isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(asset.id);
                      }}
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-200">{asset.symbol}</span>
                        <span className="text-[9px] uppercase px-1 rounded bg-slate-800 text-slate-400">
                          {asset.category}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block truncate max-w-[120px]">
                        {asset.name}
                      </span>
                    </div>
                  </div>

                  <div className="text-right font-mono tabular-nums">
                    <div className="font-semibold text-slate-200">
                      ${asset.price.toLocaleString(undefined, { minimumFractionDigits: asset.precision })}
                    </div>
                    <div className={`text-[10px] ${assetUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {assetUp ? '+' : ''}{asset.change24h.toFixed(2)}%
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
