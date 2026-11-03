import React from 'react';
import { UserPlus, Wallet, TrendingUp, ShieldCheck } from 'lucide-react';

interface HowItWorksProps {
  onStartTrading: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onStartTrading }) => {
  const steps = [
    {
      step: 'Step 1',
      title: 'Create Your Account',
      desc: 'Register in seconds with email and password to receive your unique Trader ID and secure account credentials.',
      icon: UserPlus,
    },
    {
      step: 'Step 2',
      title: 'Receive $10,000 Virtual Capital',
      desc: 'New accounts are automatically credited with $10,000 in simulated demo funds. Zero real-money deposit is required.',
      icon: Wallet,
    },
    {
      step: 'Step 3',
      title: 'Analyze Charts & Place Orders',
      desc: 'Utilize institutional candlestick charts, select your preferred leverage, set Take Profit / Stop Loss, and execute trades.',
      icon: TrendingUp,
    },
    {
      step: 'Step 4',
      title: 'Analyze & Refine Strategy',
      desc: 'Monitor real-time mark-to-market positions, track your win rate, and export audit-ready CSV trade history statements.',
      icon: ShieldCheck,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 px-6 lg:px-12 bg-slate-950/60 border-t border-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 block mb-1">
            Simple 4-Step Onboarding
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            How BINANY TRADING Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            From zero to placing your first simulated order on global markets in under sixty seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="relative p-6 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                    {s.step}
                  </span>
                  <Icon className="w-5 h-5 text-slate-400" />
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{s.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={onStartTrading}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            Launch Interactive Demo Platform
          </button>
        </div>
      </div>
    </section>
  );
};
