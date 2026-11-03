import React from 'react';
import { useTrading } from '../../context/TradingContext';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const MarketTickerBar: React.FC = () => {
  const { assets, setSelectedAsset } = useTrading();

  return (
    <div className="w-full bg-slate-950/90 border-b border-slate-800/80 overflow-x-auto py-2 px-6 flex items-center gap-6 font-mono text-xs tabular-nums select-none scrollbar-none">
      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider whitespace-nowrap">
        Live Markets:
      </span>
      {assets.slice(0, 8).map((asset) => {
        const isUp = asset.change24h >= 0;
        return (
          <div
            key={asset.id}
            className="flex items-center gap-2 whitespace-nowrap cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setSelectedAsset(asset)}
          >
            <span className="font-bold text-slate-200 font-sans">{asset.symbol}</span>
            <span className="text-slate-300 font-medium">
              ${asset.price.toLocaleString(undefined, { minimumFractionDigits: asset.precision })}
            </span>
            <span
              className={`flex items-center text-[11px] font-semibold ${
                isUp ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {isUp ? '+' : ''}{asset.change24h.toFixed(2)}%
            </span>
            <span className="text-slate-700">·</span>
          </div>
        );
      })}
    </div>
  );
};
