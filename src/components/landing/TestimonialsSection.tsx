import React from 'react';
import { Star, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Sarah Lin',
      role: 'Senior Portfolio Strategist',
      org: 'Apex Alpha Partners',
      avatar: '/assets/images/avatar_trader_sarah_1793624992270.jpg',
      quote:
        'The precision of the candlestick terminal and the responsiveness of the simulated order book allowed our analysts to stress-test high-leverage hedging models across Bitcoin and S&P 500 without risking real treasury capital.',
      metric: 'Tested 140+ algorithmic setups in demo sandbox',
    },
    {
      name: 'Marcus Vance',
      role: 'Chief Risk Officer',
      org: 'Vance Quantitative Fund',
      avatar: '/assets/images/avatar_trader_marcus_1793624992948.jpg',
      quote:
        'Having an institutional-grade platform with realistic slippage, full margin calculations, and verifiable audit trails makes BINANY TRADING the best trading environment we have evaluated to date.',
      metric: 'Zero slippage hallucination on large simulated fills',
    },
  ];

  return (
    <section className="py-20 px-6 lg:px-12 bg-slate-950/60 border-t border-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 block mb-1">
            Verified Trader Feedback (Sample Demo Cases)
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Trusted by Systematic Traders
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Read representative feedback from quantitative traders and portfolio managers practicing on our sandbox.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 mb-4 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                  <span className="text-slate-500 text-xs ml-2 font-mono">Sample Review</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed italic mb-6">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-700 shadow-md"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="font-bold text-sm text-white block">{t.name}</span>
                    <span className="text-xs text-slate-400 block">{t.role}</span>
                    <span className="text-[11px] text-blue-400 block">{t.org}</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 max-w-[140px] text-right hidden sm:block">
                  {t.metric}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
