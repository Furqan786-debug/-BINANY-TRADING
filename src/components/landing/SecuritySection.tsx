import React from 'react';
import { ShieldCheck, Lock, FileCheck, Eye, KeyRound } from 'lucide-react';

export const SecuritySection: React.FC = () => {
  return (
    <section id="security" className="py-20 px-6 lg:px-12 bg-slate-950 border-t border-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 block mb-1">
            Security & Governance
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Institutional Trust Architecture
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Every layer of the BINANY TRADING infrastructure is architected for transparent compliance, role-based safeguards, and verifiable execution integrity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-2">Virtual Sandbox Isolation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Demonstration trading operations are strictly sandboxed from live payment rails. No user deposits or payment credentials are collected in demo mode, guaranteeing zero capital exposure.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <KeyRound className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-2">Cryptographic Access & 2FA</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              All user accounts feature unique User IDs, hashed password credentials, optional two-factor authentication simulation, and granular role-based permissions.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-2">Immutable Audit Logging</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              All transactions, order placements, and administrative account changes produce an audit record logged in the system ledger for complete governance transparency.
            </p>
          </div>
        </div>

        {/* Regulatory Disclosure banner */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="text-xs text-slate-300">
              <strong className="text-white block font-semibold mb-0.5">Regulatory Transparency Disclosure</strong>
              BINANY TRADING operates under strict demonstration protocols. Live trading and real-money deposits remain disabled until full jurisdictional licenses are completed.
            </div>
          </div>
          <span className="text-[10px] font-mono px-3 py-1 rounded bg-slate-800 text-slate-400 shrink-0 whitespace-nowrap">
            ISO-Compliant Sandbox Spec
          </span>
        </div>
      </div>
    </section>
  );
};
