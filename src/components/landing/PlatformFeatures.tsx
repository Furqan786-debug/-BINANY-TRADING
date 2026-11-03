import React from 'react';
import { BarChart2, ShieldCheck, Zap, Layers, RefreshCw, Smartphone } from 'lucide-react';

export const PlatformFeatures: React.FC = () => {
  const features = [
    {
      num: '01',
      title: 'Institutional Candlestick Engine',
      desc: 'Powered by TradingView Lightweight Charts with multi-timeframe resolution (1m to 1D), moving averages (SMA 20, EMA 50), and volume depth histograms.',
      icon: BarChart2,
    },
    {
      num: '02',
      title: 'Risk-Free Virtual Sandboxing',
      desc: 'Practice with $10,000 in virtual trading capital. Experience live mark-to-market valuations, flexible leverage up to 100x, and realistic liquidation pricing without capital exposure.',
      icon: RefreshCw,
    },
    {
      num: '03',
      title: 'Sub-85ms Order Simulation',
      desc: 'Engineered for high-frequency order placement with real-time bid/ask depth spread and automated Take Profit and Stop Loss order triggers.',
      icon: Zap,
    },
    {
      num: '04',
      title: 'Multi-Asset Market Coverage',
      desc: 'Seamlessly trade major currency pairs (EUR/USD, GBP/USD), mega-cap equities (Apple, NVIDIA, Tesla), commodities (Gold, Crude Oil), and digital assets (Bitcoin, Ethereum, Solana).',
      icon: Layers,
    },
    {
      num: '05',
      title: 'Enterprise Audit & Ledger Security',
      desc: 'Every trade execution, balance adjustment, and administrative approval is logged in an immutable system audit trail with cryptographic session validation.',
      icon: ShieldCheck,
    },
    {
      num: '06',
      title: 'Universal Responsive Workflow',
      desc: 'Optimized high-density interface crafted for desktop multi-monitor trading desks as well as mobile and tablet touch viewports with zero layout breakage.',
      icon: Smartphone,
    },
  ];

  return (
    <section id="features" className="py-20 px-6 lg:px-12 bg-slate-950 border-t border-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 block mb-1">
            Engineered For Performance
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Institutional-Grade Capabilities
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Built from the ground up to give ambitious traders the exact toolset and analytics used by leading quantitative firms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.num}
                className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-sm font-bold text-blue-500">{f.num}.</span>
                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 group-hover:bg-blue-600/10 group-hover:border-blue-500/30 transition-colors">
                    <Icon className="w-5 h-5 text-blue-400" />
                  </div>
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
