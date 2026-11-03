import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, Clock, ArrowDownLeft, RefreshCw } from 'lucide-react';

interface AccountActivationWaitingProps {
  onGoToDeposit: () => void;
}

export const AccountActivationWaiting: React.FC<AccountActivationWaitingProps> = ({ onGoToDeposit }) => {
  const { currentUser } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 py-12 max-w-2xl mx-auto text-center">
      {/* Visual Badge */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto ring-8 ring-amber-500/5">
          <Clock className="w-10 h-10 animate-pulse" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-amber-400">
          <ShieldAlert className="w-4 h-4" />
        </div>
      </div>

      {/* Status Pill */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-mono font-semibold mb-4">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
        <span>ACCOUNT REGISTERED · AWAITING ADMIN BALANCE ALLOCATION</span>
      </div>

      {/* Main Headline */}
      <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3">
        Account Awaiting Balance Allocation
      </h1>

      {/* Description */}
      <p className="text-sm text-slate-400 leading-relaxed max-w-lg mb-8">
        Welcome to BINANY TRADING, <strong className="text-slate-200">{currentUser?.name}</strong>. Your account has been registered successfully. Trading terminals and order execution will unlock as soon as an administrator allocates balance to your account.
      </p>

      {/* Account Info Box */}
      <div className="w-full bg-slate-900/80 rounded-2xl p-5 border border-slate-800 text-left text-xs mb-8 space-y-3 font-mono">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
          <span className="text-slate-500 font-sans">Trader Account ID:</span>
          <span className="text-blue-400 font-bold select-all">{currentUser?.id}</span>
        </div>
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
          <span className="text-slate-500 font-sans">Registered Email:</span>
          <span className="text-slate-300">{currentUser?.email}</span>
        </div>
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
          <span className="text-slate-500 font-sans">Trading Balance:</span>
          <span className="text-amber-400 font-bold">$0.00 (Pending Allocation)</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500 font-sans">Account Status:</span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] uppercase font-bold">
            Verified & Active
          </span>
        </div>
      </div>

      {/* Action Options */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md">
        <button
          onClick={onGoToDeposit}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
        >
          <ArrowDownLeft className="w-4 h-4" />
          <span>Deposit Funds (Submit Payment Proof)</span>
        </button>
      </div>

      {/* Live Polling Note */}
      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-8">
        <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-400" />
        <span>Listening for incoming treasury allocation in real time...</span>
      </div>
    </div>
  );
};
