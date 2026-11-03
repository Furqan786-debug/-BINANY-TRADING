import React from 'react';
import { ShieldAlert } from 'lucide-react';

interface FooterProps {
  onOpenLegal: (type: 'terms' | 'privacy' | 'risk' | 'contact') => void;
  onGoToTerminal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal, onGoToTerminal }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-xs text-slate-400">
      {/* Risk Warning Strip */}
      <div className="bg-slate-900/60 border-b border-slate-900 py-6 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto flex items-start gap-4">
          <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed text-slate-400">
            <strong className="text-slate-200 block mb-1">
              FINANCIAL RISK DISCLOSURE & DEMO SANDBOX NOTICE:
            </strong>
            Trading financial instruments, including leveraged derivatives, foreign exchange, and digital assets, involves substantial risk of loss and is not suitable for all investors. BINANY TRADING operates exclusively in a simulated virtual demonstration environment. Virtual balances ($10,000 starter demo) and simulated executions do not represent real-market execution, liquidity, or guaranteed returns. Past simulated performance is not indicative of future market results. Live customer deposits are strictly disabled pending licensing.
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
        {/* Brand Column */}
        <div className="col-span-2">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-black text-xs">
              BT
            </div>
            <span className="font-extrabold text-base tracking-tight text-white">BINANY TRADING</span>
          </div>
          <p className="text-xs text-slate-400 max-w-sm leading-relaxed mb-4">
            Next-generation institutional multi-asset trading platform with real-time candlestick charts, order depth analysis, and virtual risk-free demo trading.
          </p>
          <span className="text-[10px] font-mono text-slate-500 block">
            Build v4.2.0 · Professional Edition
          </span>
        </div>

        {/* Column 2: Markets */}
        <div>
          <span className="font-bold text-white uppercase tracking-wider text-[11px] block mb-3">
            Asset Classes
          </span>
          <ul className="flex flex-col gap-2">
            <li><a href="#markets" className="hover:text-blue-400 transition-colors">Cryptocurrencies</a></li>
            <li><a href="#markets" className="hover:text-blue-400 transition-colors">Forex Majors</a></li>
            <li><a href="#markets" className="hover:text-blue-400 transition-colors">Global Equities</a></li>
            <li><a href="#markets" className="hover:text-blue-400 transition-colors">Commodities & Gold</a></li>
            <li><a href="#markets" className="hover:text-blue-400 transition-colors">Indices (S&P 500)</a></li>
          </ul>
        </div>

        {/* Column 3: Platform */}
        <div>
          <span className="font-bold text-white uppercase tracking-wider text-[11px] block mb-3">
            Platform
          </span>
          <ul className="flex flex-col gap-2">
            <li>
              <button onClick={onGoToTerminal} className="hover:text-blue-400 transition-colors text-left">
                Demo Terminal
              </button>
            </li>
            <li><a href="#features" className="hover:text-blue-400 transition-colors">Features</a></li>
            <li><a href="#how-it-works" className="hover:text-blue-400 transition-colors">How It Works</a></li>
            <li><a href="#security" className="hover:text-blue-400 transition-colors">Security Sandbox</a></li>
            <li><a href="#faq" className="hover:text-blue-400 transition-colors">Trading FAQ</a></li>
          </ul>
        </div>

        {/* Column 4: Legal & Compliance */}
        <div>
          <span className="font-bold text-white uppercase tracking-wider text-[11px] block mb-3">
            Compliance
          </span>
          <ul className="flex flex-col gap-2">
            <li>
              <button onClick={() => onOpenLegal('terms')} className="hover:text-blue-400 transition-colors text-left">
                Terms of Service
              </button>
            </li>
            <li>
              <button onClick={() => onOpenLegal('privacy')} className="hover:text-blue-400 transition-colors text-left">
                Privacy Policy
              </button>
            </li>
            <li>
              <button onClick={() => onOpenLegal('risk')} className="hover:text-blue-400 transition-colors text-left">
                Risk Disclosure
              </button>
            </li>
            <li>
              <button onClick={() => onOpenLegal('contact')} className="hover:text-blue-400 transition-colors text-left">
                Contact Desk
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-slate-900/80 py-6 px-6 lg:px-12 text-center text-[11px] text-slate-500">
        © 2026 BINANY TRADING International Financial Technologies Inc. All rights reserved. Real-Time Trading Platform.
      </div>
    </footer>
  );
};
