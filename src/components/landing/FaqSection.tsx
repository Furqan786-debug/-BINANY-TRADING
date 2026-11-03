import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is the BINANY TRADING platform?',
      a: 'BINANY TRADING is a professional institutional multi-asset trading platform designed for high-frequency market analysis and trading. Registered accounts can analyze candlestick charts, execute long and short orders, and monitor real-time returns.',
    },
    {
      q: 'Do I need to deposit money to use BINANY TRADING?',
      a: 'Registered traders can deposit funds through supported secure gateways or receive treasury allocation to unlock real-time execution across global pairs.',
    },
    {
      q: 'What asset classes can I trade on BINANY TRADING?',
      a: 'You can trade simulated contracts across four major asset categories: Digital Assets (BTC, ETH, SOL), Forex Currency Pairs (EUR/USD, GBP/USD, USD/JPY), Global Equities (Apple, NVIDIA, Tesla), and Commodities & Indices (Gold Spot, Crude Oil, S&P 500).',
    },
    {
      q: 'How does leverage work on the platform?',
      a: 'You can select custom profit ratios from 10% to 200% and leverage from 1x up to 100x depending on the asset class. BINANY TRADING automatically calculates and warns you of liquidation risk in real time.',
    },
    {
      q: 'Can I export my trading history?',
      a: 'Yes, you can download a full, audit-grade CSV statement of your settled trades from either the Trading Terminal or the Portfolio History page at any time.',
    },
  ];

  return (
    <section id="faq" className="py-20 px-6 lg:px-12 bg-slate-950 border-t border-slate-900">
      <div className="max-w-4xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 block mb-1">
            Common Inquiries
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Clear answers regarding demo trading, virtual capital, execution modeling, and platform security.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex items-center justify-between w-full p-5 text-left font-semibold text-sm text-slate-100 hover:text-blue-400 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
