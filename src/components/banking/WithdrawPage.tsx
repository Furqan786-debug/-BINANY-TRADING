import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { useAuth } from '../../context/AuthContext';
import { ArrowUpRight, ShieldCheck, AlertCircle, CheckCircle2, Clock, Wallet } from 'lucide-react';

export const WithdrawPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { transactions, submitWithdrawal, paymentMethods, platformConfig } = useTrading();

  const withdrawalMethods = paymentMethods.filter((m) => m.enabled && m.forWithdrawal);
  const [selectedMethodId, setSelectedMethodId] = useState<string>(withdrawalMethods[0]?.id || '');
  const [payoutAddress, setPayoutAddress] = useState<string>('');
  const [accountBeneficiary, setAccountBeneficiary] = useState<string>(currentUser?.name || '');
  const [amount, setAmount] = useState<string>('500');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  const selectedMethod = paymentMethods.find((m) => m.id === selectedMethodId) || withdrawalMethods[0];
  const availableBalance = currentUser?.demoBalance || 0;
  const userWithdrawals = transactions.filter((t) => t.userId === currentUser?.id && t.type === 'withdrawal');

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const numAmt = parseFloat(amount);
    if (!numAmt || numAmt <= 0) {
      setErrorMsg('Please specify a valid withdrawal amount.');
      return;
    }

    if (numAmt < platformConfig.minWithdrawalAmount) {
      setErrorMsg(`Minimum withdrawal amount is $${platformConfig.minWithdrawalAmount}.`);
      return;
    }

    if (numAmt > availableBalance) {
      setErrorMsg(`Withdrawal amount exceeds available account balance ($${availableBalance.toLocaleString()}).`);
      return;
    }

    if (!payoutAddress.trim()) {
      setErrorMsg('Please provide your destination wallet address, IBAN, or account identifier.');
      return;
    }

    const details = `Beneficiary: ${accountBeneficiary.trim()} | Destination: ${payoutAddress.trim()}`;
    const res = submitWithdrawal(numAmt, selectedMethod?.id || 'standard', details);

    if (!res.success) {
      setErrorMsg(res.message || 'Withdrawal request failed');
    } else {
      setSuccessMsg(`Withdrawal request of $${numAmt.toLocaleString()} placed in queue for finance authorization.`);
      setPayoutAddress('');
      setTimeout(() => setSuccessMsg(''), 8000);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Withdraw Funds
          </h1>
          <p className="text-xs text-slate-500">
            Submit a secure payout request to your external bank account or cryptocurrency wallet
          </p>
        </div>
        <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <span className="text-slate-400">Available Balance: </span>
          <strong className="font-mono text-emerald-400 font-bold">
            ${availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </strong>
        </div>
      </div>

      {/* Main Withdrawal Form Card */}
      <div className="p-6 rounded-2xl bg-slate-900/60 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
        <form onSubmit={handleWithdraw} className="flex flex-col gap-6">
          {/* 1. Method Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              1. Select Payout Channel
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {withdrawalMethods.map((method) => {
                const isSelected = selectedMethod?.id === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => {
                      setSelectedMethodId(method.id);
                      setErrorMsg('');
                    }}
                    className={`flex flex-col p-4 rounded-xl text-left transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600/15 border-blue-500 text-slate-100 shadow-sm ring-1 ring-blue-500/50'
                        : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-xs text-white">{method.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-700/50 text-emerald-400">
                        {method.fee} Fee
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono truncate">{method.networkOrBank || 'Direct'}</span>
                    <span className="text-[10px] text-slate-500 mt-2 font-mono">
                      Settlement: {method.processingTime}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Beneficiary & Destination Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                2. Beneficiary Full Name
              </label>
              <input
                type="text"
                required
                value={accountBeneficiary}
                onChange={(e) => setAccountBeneficiary(e.target.value)}
                placeholder="Account Holder Name"
                className="w-full bg-slate-800/70 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                3. Payout Destination Address / IBAN
              </label>
              <input
                type="text"
                required
                value={payoutAddress}
                onChange={(e) => setPayoutAddress(e.target.value)}
                placeholder={
                  selectedMethod?.category === 'crypto'
                    ? 'e.g. TRC20 Wallet Address (T...)'
                    : selectedMethod?.category === 'wallet'
                    ? 'e.g. Mobile Account Number (+92...)'
                    : 'e.g. IBAN / Account Number'
                }
                className="w-full bg-slate-800/70 border border-slate-700 rounded-xl px-4 py-2 text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* 4. Amount */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                4. Withdrawal Amount (USD)
              </label>
              <span className="text-xs text-slate-500">
                Min: <strong className="text-slate-300 font-mono">${platformConfig.minWithdrawalAmount}</strong> · Max: <strong className="text-emerald-400 font-mono">${availableBalance.toLocaleString()}</strong>
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-slate-400 font-mono text-sm">$</span>
              <input
                type="number"
                min={platformConfig.minWithdrawalAmount}
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-800/70 border border-slate-700 rounded-xl pl-8 pr-16 py-2.5 text-sm font-mono tabular-nums text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setAmount(availableBalance.toString())}
                className="absolute right-3 top-2.5 px-2 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-[10px] font-mono text-blue-400 cursor-pointer"
              >
                MAX
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Notice */}
          {successMsg && (
            <div className="flex items-center gap-2 p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-emerald-400 text-xs leading-relaxed">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <div>
                <strong className="block text-white font-bold mb-0.5">Withdrawal Request Received</strong>
                {successMsg}
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 font-bold text-white text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <ArrowUpRight className="w-4 h-4 text-white" />
            <span>Submit Withdrawal Request (${amount})</span>
          </button>
        </form>
      </div>

      {/* Withdrawal Transaction History */}
      <div className="p-6 rounded-2xl bg-slate-900/60 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
          Withdrawal Request History
        </h3>

        {userWithdrawals.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-xs">
            No withdrawal requests on record yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono tabular-nums text-xs">
              <thead>
                <tr className="text-[10px] text-slate-400 uppercase border-b border-slate-800">
                  <th className="pb-2">Reference</th>
                  <th className="pb-2">Method & Details</th>
                  <th className="pb-2 text-right">Amount</th>
                  <th className="pb-2 text-center">Status</th>
                  <th className="pb-2 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {userWithdrawals.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-800/20">
                    <td className="py-3 text-slate-300 font-bold">{tx.reference}</td>
                    <td className="py-3 text-slate-300 font-sans">
                      <span className="font-bold block text-white">{tx.method}</span>
                      <span className="text-[11px] text-slate-500 font-mono block truncate max-w-xs">{tx.accountDetails}</span>
                    </td>
                    <td className="py-3 text-right font-bold text-rose-400">-${tx.amount.toLocaleString()}</td>
                    <td className="py-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          tx.status === 'approved'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : tx.status === 'pending'
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'bg-rose-500/10 text-rose-400'
                        }`}
                      >
                        {tx.status === 'approved' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : tx.status === 'pending' ? (
                          <Clock className="w-3 h-3" />
                        ) : (
                          <AlertCircle className="w-3 h-3" />
                        )}
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 text-right text-slate-500 text-[11px]">
                      {new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
