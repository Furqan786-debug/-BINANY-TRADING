import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, CreditCard, Building2, Coins, ArrowDownLeft, CheckCircle2, Clock, AlertCircle, Copy, Check } from 'lucide-react';

export const DepositPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { transactions, submitDeposit, paymentMethods, platformConfig } = useTrading();

  const activeMethods = paymentMethods.filter((m) => m.enabled && m.forDeposit);
  const [selectedMethodId, setSelectedMethodId] = useState<string>(activeMethods[0]?.id || '');
  const [depositAmount, setDepositAmount] = useState<string>('500');
  const [proofNote, setProofNote] = useState<string>('');
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [proofImageName, setProofImageName] = useState<string>('');
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [copiedAccount, setCopiedAccount] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const selectedMethod = paymentMethods.find((m) => m.id === selectedMethodId) || activeMethods[0];
  const userDeposits = transactions.filter((t) => t.userId === currentUser?.id && t.type === 'deposit');

  const handleCopyAccount = () => {
    if (selectedMethod?.accountNumber) {
      navigator.clipboard.writeText(selectedMethod.accountNumber);
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2000);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('File size must be under 5MB.');
      return;
    }
    setProofImageName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setProofImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const amt = parseFloat(depositAmount);

    if (!amt || amt <= 0) {
      setErrorMessage('Please enter a valid deposit amount.');
      return;
    }

    if (selectedMethod && amt < selectedMethod.minAmount) {
      setErrorMessage(`Minimum deposit for ${selectedMethod.name} is $${selectedMethod.minAmount}.`);
      return;
    }

    if (selectedMethod && amt > selectedMethod.maxAmount) {
      setErrorMessage(`Maximum deposit limit is $${selectedMethod.maxAmount.toLocaleString()}.`);
      return;
    }

    const res = submitDeposit(amt, selectedMethod?.id || 'standard', proofNote, proofImage || undefined);
    if (res.success) {
      setSubmittedRef(res.reference);
      setProofNote('');
      setProofImage(null);
      setProofImageName('');
      setTimeout(() => setSubmittedRef(null), 10000);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Deposit Funds
          </h1>
          <p className="text-xs text-slate-500">
            Select a verified corporate payment gateway to fund your trading account
          </p>
        </div>
        <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <span className="text-slate-400">Trading Balance: </span>
          <strong className="font-mono text-emerald-400 font-bold">
            ${(currentUser?.demoBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </strong>
        </div>
      </div>

      {/* Head Notice if configured by Admin */}
      {platformConfig.headDepositNotice && (
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-blue-400" />
          <div className="leading-relaxed">
            <strong className="block font-bold text-white mb-0.5">Finance Desk Notice:</strong>
            {platformConfig.headDepositNotice}
          </div>
        </div>
      )}

      {/* Main Deposit Form Card */}
      <div className="p-6 rounded-2xl bg-slate-900/60 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
        <form onSubmit={handleDeposit} className="flex flex-col gap-6">
          {/* 1. Payment Method Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              1. Select Payment Method
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {activeMethods.map((method) => {
                const isSelected = selectedMethod?.id === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => {
                      setSelectedMethodId(method.id);
                      setErrorMessage('');
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
                        Fee: {method.fee}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono truncate">{method.networkOrBank || method.accountTitle}</span>
                    <span className="text-[10px] text-slate-500 mt-2 font-mono">
                      Speed: {method.processingTime}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Corporate Account Details & QR Code Display */}
          {selectedMethod && (
            <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 text-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-blue-400" />
                  Official Recipient Gateway ({selectedMethod.name})
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Min: ${selectedMethod.minAmount} · Max: ${selectedMethod.maxAmount.toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-3 border-t border-slate-700/60">
                {/* QR Code Container */}
                <div className="md:col-span-4 flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <div className="relative group p-1 bg-white rounded-lg shadow-sm">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                        selectedMethod.accountNumber
                      )}&bgcolor=FFFFFF&color=0B0F19`}
                      alt={`QR code for ${selectedMethod.name}`}
                      className="w-32 h-32 rounded object-contain"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-2 font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Scan with Wallet / Banking App</span>
                  </span>
                </div>

                {/* Account Details */}
                <div className="md:col-span-8 flex flex-col justify-between gap-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-400 text-[11px] block">Account Title / Organization:</span>
                      <span className="font-semibold text-slate-100 text-xs">{selectedMethod.accountTitle}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px] block">Network / Routing / Bank:</span>
                      <span className="font-semibold text-slate-100 text-xs">{selectedMethod.networkOrBank || 'Direct'}</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-slate-400 text-[11px]">Payment Address / IBAN / Account Number:</span>
                      <button
                        type="button"
                        onClick={handleCopyAccount}
                        className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                      >
                        {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedAccount ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 font-mono text-xs text-emerald-400 break-all select-all">
                      {selectedMethod.accountNumber}
                    </div>
                  </div>

                  {selectedMethod.instructions && (
                    <div className="pt-2 border-t border-slate-700/40 text-[11px] text-slate-400 leading-relaxed">
                      <strong className="text-slate-300">Instructions: </strong>
                      {selectedMethod.instructions}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 2. Amount Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                2. Deposit Amount (USD)
              </label>
              {platformConfig.depositBonusPercent > 0 && (
                <span className="text-[11px] text-emerald-400 font-mono font-semibold">
                  +{platformConfig.depositBonusPercent}% Funding Bonus Enabled
                </span>
              )}
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-slate-400 font-mono text-sm">$</span>
              <input
                type="number"
                min={selectedMethod?.minAmount || 10}
                step="any"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full bg-slate-800/70 border border-slate-700 rounded-xl pl-8 pr-4 py-2.5 text-sm font-mono tabular-nums text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="500.00"
              />
            </div>
            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {[100, 250, 500, 1000, 2500, 5000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setDepositAmount(preset.toString())}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs transition-colors cursor-pointer"
                >
                  +${preset.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Transaction Reference & Photo / Screenshot Upload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                3. Reference / Transaction Hash
              </label>
              <input
                type="text"
                value={proofNote}
                onChange={(e) => setProofNote(e.target.value)}
                placeholder="e.g. TXID: 0x98f4b... or Sender Name / Slip Ref"
                className="w-full bg-slate-800/70 border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Enter your transaction hash, bank slip number, or sender ID.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                4. Upload Payment Screenshot / Receipt Photo
              </label>
              
              {!proofImage ? (
                <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-xl bg-slate-850/50 hover:bg-slate-800 cursor-pointer transition-all text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mb-1.5">
                    <ArrowDownLeft className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium text-slate-200">Click to upload payment screenshot</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">PNG, JPG, JPEG up to 5MB</span>
                </label>
              ) : (
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                  <div className="flex items-center gap-3">
                    <img
                      src={proofImage}
                      alt="Payment Slip Proof"
                      className="w-12 h-12 rounded-lg object-cover border border-slate-600"
                    />
                    <div className="text-left text-xs">
                      <span className="font-bold text-emerald-400 block flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Photo Receipt Attached
                      </span>
                      <span className="text-[11px] text-slate-400 truncate block max-w-[160px]">
                        {proofImageName || 'payment_proof.jpg'}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setProofImage(null);
                      setProofImageName('');
                    }}
                    className="px-2.5 py-1 rounded bg-rose-500/15 hover:bg-rose-500 text-rose-400 hover:text-white text-xs transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Error Notice */}
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Feedback */}
          {submittedRef && (
            <div className="flex items-center gap-2 p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-emerald-400 text-xs leading-relaxed">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <div>
                <strong className="block text-white font-bold mb-0.5">Deposit Request Transmitted with Proof</strong>
                Reference code <strong>{submittedRef}</strong> submitted with payment receipt photo. The Finance Desk is reviewing your transfer and your balance will update immediately upon authorization.
              </div>
            </div>
          )}

          {/* Submit CTA */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 font-bold text-white text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>Confirm & Submit Deposit (${depositAmount})</span>
          </button>
        </form>
      </div>

      {/* Deposit Transaction History */}
      <div className="p-6 rounded-2xl bg-slate-900/60 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
          Deposit Transaction Records
        </h3>

        {userDeposits.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-xs">
            No deposit transactions found yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono tabular-nums text-xs">
              <thead>
                <tr className="text-[10px] text-slate-400 uppercase border-b border-slate-800">
                  <th className="pb-2">Reference</th>
                  <th className="pb-2">Payment Gateway</th>
                  <th className="pb-2 text-right">Amount</th>
                  <th className="pb-2 text-center">Status</th>
                  <th className="pb-2 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {userDeposits.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-800/20">
                    <td className="py-3 text-slate-300 font-bold">{tx.reference}</td>
                    <td className="py-3 text-slate-400 font-sans">{tx.method}</td>
                    <td className="py-3 text-right font-bold text-emerald-400">+${tx.amount.toLocaleString()}</td>
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
