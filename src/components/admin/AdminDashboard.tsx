import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTrading } from '../../context/TradingContext';
import { AccountStatus, UserRole, SupportTicket, PaymentMethodConfig, Position } from '../../types';
import {
  Users,
  Shield,
  ShieldAlert,
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Sliders,
  DollarSign,
  FileText,
  LifeBuoy,
  Settings,
  Database,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  PlusCircle,
  CreditCard,
  Building2,
  Coins,
  Send,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  UserPlus,
  Eye,
  Lock,
  ArrowDownLeft,
  ArrowUpRight
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    users,
    adminLoginWithPassword,
    adminCreateUser,
    adminUpdateUserStatus,
    adminAdjustUserBalance,
    adminToggleUserRole,
    adminUpdateUser,
    adminDeleteUser,
  } = useAuth();

  const {
    transactions,
    tickets,
    auditLogs,
    assets,
    allPositions,
    allClosedTrades,
    paymentMethods,
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    togglePaymentMethod,
    platformConfig,
    updatePlatformConfig,
    adminClosePosition,
    adminForceTradeOutcome,
    adminSetPositionOutcomePreset,
    adminTransferFunds,
    adminApproveTransaction,
    adminRejectTransaction,
    updateTicketStatus,
    replyTicket,
  } = useTrading();

  const [activeAdminTab, setActiveAdminTab] = useState<
    'liveshow' | 'users' | 'payments' | 'approvals' | 'transfer' | 'tickets' | 'headsettings' | 'audit'
  >('liveshow');

  // Search & Filter
  const [userSearch, setUserSearch] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState<string>('all');
  const [liveShowFilter, setLiveShowFilter] = useState<string>('all');

  // Modals state
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState<PaymentMethodConfig | null>(null);
  const [inspectUser, setInspectUser] = useState<any | null>(null);
  const [inspectAmount, setInspectAmount] = useState<string>('1000');
  const [liveNotice, setLiveNotice] = useState<string>('');

  // Payment proof image modal & transaction approval modal
  const [viewProofModal, setViewProofModal] = useState<{
    isOpen: boolean;
    imageUrl: string;
    txRef: string;
    userName: string;
    amount: number;
    method: string;
  } | null>(null);

  const [approvalModal, setApprovalModal] = useState<{
    isOpen: boolean;
    txId: string;
    txRef: string;
    userName: string;
    amount: number;
    type: 'approve' | 'reject';
    note: string;
  } | null>(null);

  // Direct Admin Transfer state (Head Payment Transfer)
  const [transferTargetUserId, setTransferTargetUserId] = useState<string>(users[0]?.id || '');
  const [transferAmount, setTransferAmount] = useState<string>('1000');
  const [transferMethod, setTransferMethod] = useState<string>('Corporate Treasury Direct Wire');
  const [transferNote, setTransferNote] = useState<string>('Disbursed from Master Treasury Desk');
  const [transferSuccess, setTransferSuccess] = useState<string>('');

  // Add User Form state
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('user');
  const [newUserStatus, setNewUserStatus] = useState<AccountStatus>('active');
  const [newUserBalance, setNewUserBalance] = useState<string>('10000');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserCountry, setNewUserCountry] = useState('Global');
  const [newUserNotes, setNewUserNotes] = useState('');

  // Payment Method Form state
  const [pmName, setPmName] = useState('');
  const [pmCategory, setPmCategory] = useState<PaymentMethodConfig['category']>('crypto');
  const [pmAccountTitle, setPmAccountTitle] = useState('');
  const [pmAccountNumber, setPmAccountNumber] = useState('');
  const [pmNetwork, setPmNetwork] = useState('');
  const [pmInstructions, setPmInstructions] = useState('');
  const [pmMinAmount, setPmMinAmount] = useState<string>('50');
  const [pmMaxAmount, setPmMaxAmount] = useState<string>('100000');
  const [pmFee, setPmFee] = useState('0%');
  const [pmProcessingTime, setPmProcessingTime] = useState('15 Mins');
  const [pmForDeposit, setPmForDeposit] = useState(true);
  const [pmForWithdrawal, setPmForWithdrawal] = useState(true);

  // Support ticket admin state
  const [selectedAdminTicket, setSelectedAdminTicket] = useState<SupportTicket | null>(null);
  const [adminTicketReply, setAdminTicketReply] = useState('');

  // Approval review modal note
  const [approvalNote, setApprovalNote] = useState('');

  // MRG company portal unlock state
  const [mrgUnlockPass, setMrgUnlockPass] = useState('');
  const [mrgUnlockError, setMrgUnlockError] = useState('');
  const [mrgUnlockLoading, setMrgUnlockLoading] = useState(false);

  const handleMrgUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setMrgUnlockError('');
    if (!mrgUnlockPass.trim()) {
      setMrgUnlockError('Please enter the MRG company admin password.');
      return;
    }
    setMrgUnlockLoading(true);
    const res = await adminLoginWithPassword(mrgUnlockPass.trim());
    setMrgUnlockLoading(false);
    if (!res.success) {
      setMrgUnlockError(res.message || 'Incorrect password for MRG company. Access denied.');
    }
  };

  // Protect view with MRG company password gate
  if (currentUser?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-center p-6">
        <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900/90 border border-purple-500/40 shadow-2xl backdrop-blur-md text-left">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">MRG company</h2>
              <span className="text-xs text-purple-400 font-mono">Administrative Security Portal</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 mb-5 leading-relaxed">
            Access to MRG company console is password-protected. Enter the administrator credentials to manage live trades, user balances, and platform parameters.
          </p>

          <form onSubmit={handleMrgUnlock} className="flex flex-col gap-3.5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                MRG company Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-purple-400" />
                <input
                  type="password"
                  required
                  value={mrgUnlockPass}
                  onChange={(e) => setMrgUnlockPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-purple-800/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                />
              </div>
            </div>

            {mrgUnlockError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
                {mrgUnlockError}
              </div>
            )}

            <button
              type="submit"
              disabled={mrgUnlockLoading}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 mt-1"
            >
              <Shield className="w-4 h-4" />
              <span>{mrgUnlockLoading ? 'Verifying...' : 'Unlock MRG company Portal'}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.id.toLowerCase().includes(userSearch.toLowerCase());
    const matchesStatus = userStatusFilter === 'all' || u.status === userStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered live show trades
  const filteredLiveTrades = allPositions.filter((pos) => {
    if (liveShowFilter === 'all') return true;
    if (liveShowFilter === 'buy') return pos.side === 'buy';
    if (liveShowFilter === 'sell') return pos.side === 'sell';
    return pos.symbol.toLowerCase().includes(liveShowFilter.toLowerCase());
  });

  // Calculate live show statistics
  const totalLiveMargin = allPositions.reduce((acc, p) => acc + p.amountUsd, 0);
  const totalLivePnl = allPositions.reduce((acc, p) => acc + p.unrealizedPnl, 0);
  const pendingTransactions = transactions.filter((t) => t.status === 'pending');
  const openTickets = tickets.filter((t) => t.status !== 'resolved');

  // Submit Add User
  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    const res = adminCreateUser({
      name: newUserName,
      email: newUserEmail,
      password: newUserPassword,
      role: newUserRole,
      status: newUserStatus,
      demoBalance: parseFloat(newUserBalance) || 10000,
      phone: newUserPhone,
      country: newUserCountry,
      adminNotes: newUserNotes,
    });

    if (res.success) {
      setShowAddUserModal(false);
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserNotes('');
    }
  };

  // Submit Add / Edit Payment Method
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pmName.trim() || !pmAccountNumber.trim()) return;

    const payload = {
      name: pmName.trim(),
      category: pmCategory,
      accountTitle: pmAccountTitle.trim() || 'TradePro Treasury',
      accountNumber: pmAccountNumber.trim(),
      networkOrBank: pmNetwork.trim(),
      instructions: pmInstructions.trim(),
      minAmount: parseFloat(pmMinAmount) || 10,
      maxAmount: parseFloat(pmMaxAmount) || 100000,
      fee: pmFee.trim() || '0%',
      processingTime: pmProcessingTime.trim() || 'Instant',
      enabled: true,
      forDeposit: pmForDeposit,
      forWithdrawal: pmForWithdrawal,
    };

    if (editingPayment) {
      updatePaymentMethod(editingPayment.id, payload);
      setEditingPayment(null);
    } else {
      addPaymentMethod(payload);
    }

    setShowPaymentModal(false);
    resetPaymentForm();
  };

  const resetPaymentForm = () => {
    setPmName('');
    setPmCategory('crypto');
    setPmAccountTitle('');
    setPmAccountNumber('');
    setPmNetwork('');
    setPmInstructions('');
    setPmMinAmount('50');
    setPmMaxAmount('100000');
    setPmFee('0%');
    setPmProcessingTime('15 Mins');
    setPmForDeposit(true);
    setPmForWithdrawal(true);
  };

  const startEditPayment = (pm: PaymentMethodConfig) => {
    setEditingPayment(pm);
    setPmName(pm.name);
    setPmCategory(pm.category);
    setPmAccountTitle(pm.accountTitle);
    setPmAccountNumber(pm.accountNumber);
    setPmNetwork(pm.networkOrBank || '');
    setPmInstructions(pm.instructions || '');
    setPmMinAmount(pm.minAmount.toString());
    setPmMaxAmount(pm.maxAmount.toString());
    setPmFee(pm.fee);
    setPmProcessingTime(pm.processingTime);
    setPmForDeposit(pm.forDeposit);
    setPmForWithdrawal(pm.forWithdrawal);
    setShowPaymentModal(true);
  };

  // Submit Direct Transfer (Head Payment Transfer to User)
  const handleDirectTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(transferAmount);
    if (!amt || amt <= 0 || !transferTargetUserId) return;

    const res = adminTransferFunds(transferTargetUserId, amt, transferNote, transferMethod);
    if (res.success) {
      setTransferSuccess(`Successfully credited $${amt.toLocaleString()} to user ID: ${transferTargetUserId}`);
      setTimeout(() => setTransferSuccess(''), 5000);
    }
  };

  const handleAdminReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdminTicket || !adminTicketReply.trim()) return;
    replyTicket(selectedAdminTicket.id, adminTicketReply.trim());
    setAdminTicketReply('');
    const updated = tickets.find((t) => t.id === selectedAdminTicket.id);
    if (updated) setSelectedAdminTicket(updated);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/60 border border-slate-800 backdrop-blur-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-white tracking-tight">
              MRG company Master Administration & Control
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 font-mono text-[10px] font-bold uppercase">
              MRG company Master
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            MRG company Portal — Live trade monitoring, user funding, withdrawal authorization, payment channels, and system parameters
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddUserModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-sm cursor-pointer transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New User</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Live Open Trades</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
            {allPositions.length} Positions
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Live Active Margin: ${totalLiveMargin.toLocaleString()}</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Pending Payouts / Draws</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-400 mt-1">
            {pendingTransactions.length} Pending
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Deposits & Customer Draws</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Payment Gateways</span>
            <CreditCard className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black font-mono text-blue-400 mt-1">
            {paymentMethods.length} Methods
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Enabled for user deposits & draws</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Registered User Base</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black font-mono text-purple-400 mt-1">
            {users.length} Users
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Active: {users.filter((u) => u.status === 'active').length}</span>
        </div>
      </div>

      {/* Admin Navigation Bar */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveAdminTab('liveshow')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeAdminTab === 'liveshow' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Live Trades Show ({allPositions.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('users')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeAdminTab === 'users' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Users Directory ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('payments')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeAdminTab === 'payments' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Payment Gateways ({paymentMethods.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('approvals')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeAdminTab === 'approvals' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Draws & Deposits ({pendingTransactions.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('transfer')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeAdminTab === 'transfer' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Send className="w-3.5 h-3.5 text-amber-400" />
          <span>Head Transfer to User</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('tickets')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeAdminTab === 'tickets' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
          }`}
        >
          <LifeBuoy className="w-3.5 h-3.5" />
          <span>Support Desk ({openTickets.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('headsettings')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeAdminTab === 'headsettings' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Head Platform Settings</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('audit')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeAdminTab === 'audit' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Audit Logs</span>
        </button>
      </div>

      {/* TAB 1: LIVE TRADES SHOW ("Live Show") */}
      {activeAdminTab === 'liveshow' && (
        <div className="p-5 rounded-2xl bg-slate-900/60 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 backdrop-blur-sm flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Live Show — Platform Real-Time Trades Stream
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time mark-to-market positions across all traders with live price ticks and instant close authorization
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-slate-400">
                Net Floating PnL:{' '}
                <strong className={totalLivePnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                  {totalLivePnl >= 0 ? '+' : ''}${totalLivePnl.toFixed(2)}
                </strong>
              </span>
              <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
                {(['all', 'buy', 'sell'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setLiveShowFilter(filter)}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase transition-colors ${
                      liveShowFilter === filter ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {filteredLiveTrades.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No active open positions on the platform currently.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono tabular-nums text-xs">
                <thead>
                  <tr className="text-[10px] text-slate-400 uppercase border-b border-slate-800">
                    <th className="pb-2">Trader Account</th>
                    <th className="pb-2">Asset & Direction</th>
                    <th className="pb-2 text-right">Margin Invested</th>
                    <th className="pb-2 text-right">Target Profit %</th>
                    <th className="pb-2 text-right">Potential Payout</th>
                    <th className="pb-2 text-center">Outcome Status</th>
                    <th className="pb-2 text-right">Floating PnL</th>
                    <th className="pb-2 text-center">Admin Decision Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {filteredLiveTrades.map((pos) => {
                    const isUp = pos.unrealizedPnl >= 0;
                    const targetPct = pos.targetProfitPercent || 30;
                    const targetProfitAmount = pos.targetProfitAmount || Number(((pos.amountUsd * targetPct) / 100).toFixed(2));
                    const totalPayout = Number((pos.amountUsd + targetProfitAmount).toFixed(2));
                    const isSlatedWin = pos.adminOutcomeOverride === 'win';

                    return (
                      <tr key={pos.id} className="hover:bg-slate-800/25 transition-colors">
                        <td className="py-3 font-sans">
                          <span className="font-bold text-white block">{pos.userName || pos.userId}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{pos.userId}</span>
                        </td>
                        <td className="py-3 font-sans">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-100">{pos.symbol}</span>
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-black font-mono uppercase ${
                                pos.side === 'buy' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                              }`}
                            >
                              {pos.side === 'buy' ? '▲ UP' : '▼ DOWN'}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono block mt-0.5">@ ${pos.entryPrice.toLocaleString()}</span>
                        </td>
                        <td className="py-3 text-right text-white font-bold">${pos.amountUsd.toFixed(2)}</td>
                        <td className="py-3 text-right text-emerald-400 font-bold">
                          +{targetPct}% <span className="text-slate-400 text-[10px] block">(+${targetProfitAmount.toFixed(2)})</span>
                        </td>
                        <td className="py-3 text-right text-emerald-300 font-black text-sm font-mono">
                          ${totalPayout.toFixed(2)}
                        </td>
                        <td className="py-3 text-center">
                          {isSlatedWin ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              Slated: WIN
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                              Slated: LOSS (Default)
                            </span>
                          )}
                        </td>
                        <td className={`py-3 text-right font-bold ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isUp ? '+' : ''}${pos.unrealizedPnl.toFixed(2)} ({isUp ? '+' : ''}{pos.unrealizedPnlPercent.toFixed(1)}%)
                        </td>
                        <td className="py-3 text-center font-sans">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Make WIN & Pay User Immediately */}
                            <button
                              type="button"
                              onClick={() => {
                                adminForceTradeOutcome(pos.id, 'win');
                                setLiveNotice(`🎉 Successfully paid WIN to ${pos.userName || pos.userId}: +$${targetProfitAmount.toFixed(2)} profit (Total payout $${totalPayout.toFixed(2)}) credited to balance!`);
                                setTimeout(() => setLiveNotice(''), 5000);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-[11px] cursor-pointer shadow-sm shadow-emerald-600/30 transition-all flex items-center gap-1"
                              title="Immediately pay user their selected profit and credit their balance"
                            >
                              <span>Pay WIN (+{targetPct}%)</span>
                            </button>

                            {/* Make LOSS Immediately */}
                            <button
                              type="button"
                              onClick={() => {
                                adminForceTradeOutcome(pos.id, 'loss');
                                setLiveNotice(`Settled ${pos.symbol} trade as LOSS for ${pos.userName || pos.userId}`);
                                setTimeout(() => setLiveNotice(''), 4000);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white font-bold text-[11px] cursor-pointer border border-rose-500/30 transition-all"
                              title="Force this trade to settle as a loss"
                            >
                              <span>Make LOSS</span>
                            </button>

                            {/* Toggle Preset without closing yet */}
                            <button
                              type="button"
                              onClick={() => {
                                const nextOutcome = isSlatedWin ? 'loss' : 'win';
                                adminSetPositionOutcomePreset(pos.id, nextOutcome);
                                setLiveNotice(`Preset for ${pos.userName}'s trade updated to ${nextOutcome.toUpperCase()}`);
                                setTimeout(() => setLiveNotice(''), 4000);
                              }}
                              className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono cursor-pointer border border-slate-700 transition-colors"
                              title="Flip outcome preset between Win and Loss"
                            >
                              {isSlatedWin ? 'Set to Loss' : 'Set to Win'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: USERS DIRECTORY ("User Add, Details, ID & Notes") */}
      {activeAdminTab === 'users' && (
        <div className="p-5 rounded-2xl bg-slate-900/60 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 backdrop-blur-sm flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search by Trader ID, Name, or Email..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={userStatusFilter}
                onChange={(e) => setUserStatusFilter(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="pending">Pending Only</option>
                <option value="suspended">Suspended Only</option>
              </select>

              <button
                onClick={() => setShowAddUserModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-sm cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add User</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono tabular-nums text-xs">
              <thead>
                <tr className="text-[10px] text-slate-400 uppercase border-b border-slate-800">
                  <th className="pb-2">User ID</th>
                  <th className="pb-2">Trader Name</th>
                  <th className="pb-2">Email</th>
                  <th className="pb-2">Role</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2 text-right">Account Balance</th>
                  <th className="pb-2">Admin Notes</th>
                  <th className="pb-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/20">
                    <td className="py-3 font-bold text-blue-400">{u.id}</td>
                    <td className="py-3 font-sans font-bold text-slate-200">
                      <div className="flex items-center gap-2">
                        <img
                          src={u.avatarUrl}
                          alt={u.name}
                          className="w-6 h-6 rounded-md object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span>{u.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-slate-400 font-sans">{u.email}</td>
                    <td className="py-3 font-sans">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.role === 'admin' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 font-sans">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : u.status === 'pending'
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'bg-rose-500/10 text-rose-400'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3 text-right font-bold text-slate-100">
                      ${u.demoBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 font-sans text-slate-400 max-w-xs truncate text-[11px]">
                      {u.adminNotes || '—'}
                    </td>
                    <td className="py-3 text-right font-sans">
                      <button
                        onClick={() => {
                          adminAdjustUserBalance(u.id, 1000);
                        }}
                        className="px-2 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white text-xs font-semibold cursor-pointer border border-emerald-500/30 mr-1.5 transition-colors"
                        title="Add $1,000 to user account to activate"
                      >
                        + Credit $1k
                      </button>
                      <button
                        onClick={() => {
                          setInspectUser(u);
                          setInspectAmount('1000');
                        }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-blue-400 text-xs font-semibold cursor-pointer border border-slate-700"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PAYMENT GATEWAYS ("Admin Himself Can Add Any Payment Method, Anyone Can Change It") */}
      {activeAdminTab === 'payments' && (
        <div className="p-5 rounded-2xl bg-slate-900/60 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 backdrop-blur-sm flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Corporate Payment Methods & Gateway Configuration
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Add, customize, edit account numbers, instructions, and toggle gateways for customer deposits and payouts
              </p>
            </div>
            <button
              onClick={() => {
                resetPaymentForm();
                setEditingPayment(null);
                setShowPaymentModal(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Payment Method</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            {paymentMethods.map((pm) => (
              <div
                key={pm.id}
                className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                  pm.enabled ? 'bg-slate-900/70 border-slate-700/80' : 'bg-slate-900/30 border-slate-800 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-white">{pm.name}</span>
                    <button
                      onClick={() => togglePaymentMethod(pm.id)}
                      className={`text-xs px-2 py-0.5 rounded font-mono font-bold uppercase cursor-pointer ${
                        pm.enabled ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                      }`}
                    >
                      {pm.enabled ? 'Active' : 'Disabled'}
                    </button>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 block w-max mb-3">
                    {pm.category} · {pm.networkOrBank || 'Direct'}
                  </span>

                  <div className="flex flex-col gap-1.5 text-xs text-slate-300">
                    <div>
                      <span className="text-slate-500 text-[11px] block">Beneficiary Title:</span>
                      <strong className="text-slate-200">{pm.accountTitle}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Address / IBAN / Account #:</span>
                      <span className="font-mono text-emerald-400 break-all select-all text-[11px] block bg-slate-950/80 p-2 rounded-lg border border-slate-800">
                        {pm.accountNumber}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                      <span>Min: ${pm.minAmount}</span>
                      <span>Max: ${pm.maxAmount.toLocaleString()}</span>
                      <span>Fee: {pm.fee}</span>
                      <span>Time: {pm.processingTime}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                    {pm.forDeposit && <span className="bg-slate-800 px-1.5 py-0.5 rounded text-blue-400 font-bold">Deposit</span>}
                    {pm.forWithdrawal && <span className="bg-slate-800 px-1.5 py-0.5 rounded text-purple-400 font-bold">Draw</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEditPayment(pm)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-white transition-colors cursor-pointer"
                      title="Edit Gateway"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deletePaymentMethod(pm.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400 hover:text-white transition-colors cursor-pointer"
                      title="Delete Gateway"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: DRAWS & DEPOSITS QUEUE ("Customer Draws & Admin Happy With Request") */}
      {activeAdminTab === 'approvals' && (
        <div className="p-5 rounded-2xl bg-slate-900/60 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 backdrop-blur-sm flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Customer Deposits & Payout Draws Approval Queue
            </h3>
            <p className="text-xs text-slate-400">
              When a customer requests a draw or submits a deposit, review and authorize or attach transfer receipts
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono tabular-nums text-xs">
              <thead>
                <tr className="text-[10px] text-slate-400 uppercase border-b border-slate-800">
                  <th className="pb-2">Reference</th>
                  <th className="pb-2">Customer</th>
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Gateway & Account Details</th>
                  <th className="pb-2 text-right">Amount</th>
                  <th className="pb-2 text-center">Status</th>
                  <th className="pb-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-800/20">
                    <td className="py-3 text-slate-300 font-bold">{tx.reference}</td>
                    <td className="py-3 font-sans">
                      <span className="font-bold text-white block">{tx.userName}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{tx.userId}</span>
                    </td>
                    <td className="py-3 font-sans">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          tx.type === 'deposit'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : tx.type === 'withdrawal'
                            ? 'bg-rose-500/10 text-rose-400'
                            : 'bg-blue-500/10 text-blue-400'
                        }`}
                      >
                        {tx.type === 'withdrawal' ? 'DRAW (Payout)' : tx.type}
                      </span>
                    </td>
                    <td className="py-3 text-slate-300 font-sans max-w-xs">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 truncate">
                          <span className="font-bold block text-slate-200">{tx.method}</span>
                          <span className="text-[11px] text-slate-400 font-mono block truncate">{tx.accountDetails || '—'}</span>
                        </div>
                        {tx.proofAttachment && (
                          <button
                            type="button"
                            onClick={() =>
                              setViewProofModal({
                                isOpen: true,
                                imageUrl: tx.proofAttachment!,
                                txRef: tx.reference,
                                userName: tx.userName,
                                amount: tx.amount,
                                method: tx.method,
                              })
                            }
                            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-500/15 hover:bg-blue-500 text-blue-400 hover:text-white text-[10px] font-sans font-bold cursor-pointer border border-blue-500/30 shrink-0 transition-colors"
                            title="Inspect payment slip / screenshot"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Slip Photo</span>
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="py-3 text-right font-bold text-white text-sm">
                      ${tx.amount.toLocaleString()}
                    </td>
                    <td className="py-3 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          tx.status === 'approved'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : tx.status === 'pending'
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'bg-rose-500/10 text-rose-400'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 text-right font-sans">
                      {tx.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setApprovalModal({
                                isOpen: true,
                                txId: tx.id,
                                txRef: tx.reference,
                                userName: tx.userName,
                                amount: tx.amount,
                                type: 'approve',
                                note: 'Approved and authorized by Treasury Desk',
                              });
                            }}
                            className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              setApprovalModal({
                                isOpen: true,
                                txId: tx.id,
                                txRef: tx.reference,
                                userName: tx.userName,
                                amount: tx.amount,
                                type: 'reject',
                                note: 'Payment receipt not verified or information mismatch',
                              });
                            }}
                            className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold cursor-pointer transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-mono">
                          {tx.adminNote || `By ${tx.reviewedBy || 'Admin'}`}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: HEAD PAYMENT TRANSFER TO USER ("Admin transfers payment to user") */}
      {activeAdminTab === 'transfer' && (
        <div className="p-6 rounded-2xl bg-slate-900/60 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 backdrop-blur-sm max-w-2xl flex flex-col gap-5">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Send className="w-4 h-4 text-amber-400" />
              Direct Head Payment Transfer to User
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Directly credit any customer account with official reference, treasury channel, and automated push notification
            </p>
          </div>

          {transferSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{transferSuccess}</span>
            </div>
          )}

          <form onSubmit={handleDirectTransfer} className="flex flex-col gap-4 text-xs">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Select Recipient Customer</label>
              <select
                value={transferTargetUserId}
                onChange={(e) => setTransferTargetUserId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.id}) — Balance: ${u.demoBalance.toLocaleString()} — {u.email}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Transfer Amount (USD)</label>
              <input
                type="number"
                min="1"
                step="any"
                required
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Funding Channel / Payment Method Head</label>
              <select
                value={transferMethod}
                onChange={(e) => setTransferMethod(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
              >
                <option value="Corporate Treasury Direct Wire">Corporate Treasury Direct Wire</option>
                <option value="USDT TRC-20 Master Vault">USDT TRC-20 Master Vault</option>
                <option value="Regional Cash Settlement Agent">Regional Cash Settlement Agent</option>
                <option value="Trading Performance Bonus Allocation">Trading Performance Bonus Allocation</option>
                <option value="Dispute Resolution Credit">Dispute Resolution Credit</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Official Transfer Note / Reason</label>
              <textarea
                rows={2}
                value={transferNote}
                onChange={(e) => setTransferNote(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer mt-2"
            >
              Execute Direct Head Payment Transfer (${transferAmount})
            </button>
          </form>
        </div>
      )}

      {/* TAB 6: SUPPORT DESK */}
      {activeAdminTab === 'tickets' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[460px]">
          <div className="lg:col-span-5 p-4 rounded-2xl bg-slate-900/60 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 backdrop-blur-sm flex flex-col">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              All Inquiries ({tickets.length})
            </h3>
            <div className="flex flex-col gap-2 overflow-y-auto max-h-[420px]">
              {tickets.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedAdminTicket(t)}
                  className={`p-3 rounded-xl text-left border cursor-pointer transition-all ${
                    selectedAdminTicket?.id === t.id
                      ? 'bg-blue-600/15 border-blue-500 text-white'
                      : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-200 text-xs">{t.userName}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        t.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                  <span className="text-xs text-slate-300 font-medium block truncate">{t.subject}</span>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 font-mono">
                    <span>{t.id} · {t.priority.toUpperCase()}</span>
                    <span>{new Date(t.updatedAt).toLocaleDateString()}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900/60 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 backdrop-blur-sm flex flex-col">
            {selectedAdminTicket ? (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="font-bold text-sm text-slate-100">{selectedAdminTicket.subject}</h3>
                    <span className="text-xs text-slate-400">
                      User: {selectedAdminTicket.userName} ({selectedAdminTicket.userEmail}) · ID: {selectedAdminTicket.userId}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const next = selectedAdminTicket.status === 'resolved' ? 'open' : 'resolved';
                      updateTicketStatus(selectedAdminTicket.id, next);
                      setSelectedAdminTicket({ ...selectedAdminTicket, status: next });
                    }}
                    className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
                  >
                    {selectedAdminTicket.status === 'resolved' ? 'Reopen Ticket' : 'Mark Resolved'}
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto py-3 flex flex-col gap-2.5">
                  {selectedAdminTicket.messages.map((m) => (
                    <div
                      key={m.id}
                      className={`p-3 rounded-xl text-xs max-w-[85%] ${
                        m.senderRole === 'admin'
                          ? 'ml-auto bg-blue-600 text-white'
                          : 'mr-auto bg-slate-800 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 text-[10px] opacity-75 mb-1 font-mono">
                        <span>{m.senderName} ({m.senderRole})</span>
                        <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="whitespace-pre-wrap">{m.message}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAdminReply} className="flex gap-2 pt-3 border-t border-slate-800">
                  <input
                    type="text"
                    value={adminTicketReply}
                    onChange={(e) => setAdminTicketReply(e.target.value)}
                    placeholder="Type official administrative reply to user..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer"
                  >
                    Reply
                  </button>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 text-xs">
                <span>Select a ticket to view and reply to the trader.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 7: HEAD PLATFORM SETTINGS ("Head Setting Option") */}
      {activeAdminTab === 'headsettings' && (
        <div className="p-6 rounded-2xl bg-slate-900/60 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 backdrop-blur-sm flex flex-col gap-6 max-w-3xl">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Settings className="w-4 h-4 text-purple-400" />
              Global Head Platform Settings & Financial Rules
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Configure baseline limits, deposit notices, leverage thresholds, and volatility multipliers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Platform Brand Name</label>
              <input
                type="text"
                value={platformConfig.platformName}
                onChange={(e) => updatePlatformConfig({ platformName: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Default Starting Balance ($)</label>
              <input
                type="number"
                value={platformConfig.defaultStartingBalance}
                onChange={(e) => updatePlatformConfig({ defaultStartingBalance: parseFloat(e.target.value) || 10000 })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Minimum Deposit Amount ($)</label>
              <input
                type="number"
                value={platformConfig.minDepositAmount}
                onChange={(e) => updatePlatformConfig({ minDepositAmount: parseFloat(e.target.value) || 20 })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Minimum Withdrawal / Draw Amount ($)</label>
              <input
                type="number"
                value={platformConfig.minWithdrawalAmount}
                onChange={(e) => updatePlatformConfig({ minWithdrawalAmount: parseFloat(e.target.value) || 50 })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Deposit Bonus Percentage (%)</label>
              <input
                type="number"
                value={platformConfig.depositBonusPercent}
                onChange={(e) => updatePlatformConfig({ depositBonusPercent: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Maximum Leverage Ceiling</label>
              <select
                value={platformConfig.maxLeverageAllowed}
                onChange={(e) => updatePlatformConfig({ maxLeverageAllowed: parseInt(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
              >
                <option value={20}>20x</option>
                <option value={50}>50x</option>
                <option value={100}>100x</option>
                <option value={200}>200x</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-300 mb-1 font-medium">Head Deposit Banner Notice</label>
              <textarea
                rows={2}
                value={platformConfig.headDepositNotice}
                onChange={(e) => updatePlatformConfig({ headDepositNotice: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-xs"
              />
            </div>

            <div className="md:col-span-2 flex items-center justify-between p-4 rounded-xl bg-slate-800/40 border border-slate-700">
              <div>
                <span className="font-bold text-slate-200 block">Allow New User Registrations</span>
                <span className="text-slate-400 text-[11px]">Toggle public account creation</span>
              </div>
              <button
                type="button"
                onClick={() => updatePlatformConfig({ allowNewRegistrations: !platformConfig.allowNewRegistrations })}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs cursor-pointer ${
                  platformConfig.allowNewRegistrations ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                }`}
              >
                {platformConfig.allowNewRegistrations ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: AUDIT LOGS */}
      {activeAdminTab === 'audit' && (
        <div className="p-5 rounded-2xl bg-slate-900/60 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 backdrop-blur-sm flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Immutable System Audit Logs
            </h3>
            <p className="text-xs text-slate-400">
              Chronological log of administrative actions, user orders, balance adjustments, and payments
            </p>
          </div>

          <div className="overflow-x-auto max-h-[460px]">
            <table className="w-full text-left font-mono tabular-nums text-xs">
              <thead>
                <tr className="text-[10px] text-slate-400 uppercase border-b border-slate-800">
                  <th className="pb-2">Timestamp</th>
                  <th className="pb-2">Action</th>
                  <th className="pb-2">Performed By</th>
                  <th className="pb-2">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/20">
                    <td className="py-3 text-slate-500 text-[11px] whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-blue-400 font-bold text-[10px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 text-slate-300 font-sans">{log.performedBy}</td>
                    <td className="py-3 text-slate-400 font-sans max-w-md truncate">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD USER MODAL */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-blue-400" />
                Add New User to Platform
              </h3>
              <button onClick={() => setShowAddUserModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Trader Full Name</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Tariq Khan"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Email Address</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="tariq@invest.pk"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Initial Trading Balance ($)</label>
                <input
                  type="number"
                  required
                  value={newUserBalance}
                  onChange={(e) => setNewUserBalance(e.target.value)}
                  placeholder="10000"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Role</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="user">Trader (User)</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Status</label>
                  <select
                    value={newUserStatus}
                    onChange={(e) => setNewUserStatus(e.target.value as AccountStatus)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Country / Phone</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newUserCountry}
                    onChange={(e) => setNewUserCountry(e.target.value)}
                    placeholder="Country"
                    className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                  <input
                    type="text"
                    value={newUserPhone}
                    onChange={(e) => setNewUserPhone(e.target.value)}
                    placeholder="+92 300 0000000"
                    className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Admin Notes (Internal)</label>
                <input
                  type="text"
                  value={newUserNotes}
                  onChange={(e) => setNewUserNotes(e.target.value)}
                  placeholder="Notes for desk review..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 font-bold text-white rounded-xl cursor-pointer"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD / EDIT PAYMENT METHOD MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white">
                {editingPayment ? 'Edit Payment Method' : 'Add New Payment Method'}
              </h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handlePaymentSubmit} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Gateway Name</label>
                <input
                  type="text"
                  required
                  value={pmName}
                  onChange={(e) => setPmName(e.target.value)}
                  placeholder="e.g. USDT (TRC-20), EasyPaisa, Chase Wire"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Category</label>
                  <select
                    value={pmCategory}
                    onChange={(e) => setPmCategory(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="crypto">Cryptocurrency</option>
                    <option value="bank">Bank Wire / SWIFT</option>
                    <option value="wallet">Mobile Wallet (EasyPaisa/JazzCash)</option>
                    <option value="card">Debit / Credit Card</option>
                    <option value="custom">Custom Gateway</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Network / Bank Name</label>
                  <input
                    type="text"
                    value={pmNetwork}
                    onChange={(e) => setPmNetwork(e.target.value)}
                    placeholder="TRC-20 / NatWest / EasyPaisa"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Beneficiary / Account Title</label>
                <input
                  type="text"
                  required
                  value={pmAccountTitle}
                  onChange={(e) => setPmAccountTitle(e.target.value)}
                  placeholder="e.g. TradePro Corporate Treasury"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  Official Account Number / Wallet Address / IBAN
                </label>
                <textarea
                  rows={2}
                  required
                  value={pmAccountNumber}
                  onChange={(e) => setPmAccountNumber(e.target.value)}
                  placeholder="Paste wallet address, IBAN, or account number..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Special Instructions for Customers</label>
                <textarea
                  rows={2}
                  value={pmInstructions}
                  onChange={(e) => setPmInstructions(e.target.value)}
                  placeholder="Send screenshot, include User ID in reference, etc."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Min Deposit ($)</label>
                  <input
                    type="number"
                    value={pmMinAmount}
                    onChange={(e) => setPmMinAmount(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Max Limit ($)</label>
                  <input
                    type="number"
                    value={pmMaxAmount}
                    onChange={(e) => setPmMaxAmount(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Fee</label>
                  <input
                    type="text"
                    value={pmFee}
                    onChange={(e) => setPmFee(e.target.value)}
                    placeholder="0%"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Processing Time</label>
                  <input
                    type="text"
                    value={pmProcessingTime}
                    onChange={(e) => setPmProcessingTime(e.target.value)}
                    placeholder="5-15 Mins"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pmForDeposit}
                    onChange={(e) => setPmForDeposit(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>Enable for Deposits</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pmForWithdrawal}
                    onChange={(e) => setPmForWithdrawal(e.target.checked)}
                    className="rounded text-purple-600"
                  />
                  <span>Enable for Draws / Payouts</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800 mt-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 font-bold text-white rounded-xl cursor-pointer"
                >
                  {editingPayment ? 'Save Gateway' : 'Add Gateway'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: MANAGE USER INSPECTION MODAL */}
      {inspectUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <h3 className="text-base font-bold text-white">{inspectUser.name}</h3>
                <span className="text-xs font-mono text-blue-400">ID: {inspectUser.id} · {inspectUser.email}</span>
              </div>
              <button onClick={() => setInspectUser(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="flex flex-col gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 block text-xs">Account Balance:</span>
                  <span className="text-2xl font-bold font-mono text-emerald-400">
                    ${inspectUser.demoBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-700/60">
                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-2 text-slate-400 font-mono">$</span>
                    <input
                      type="number"
                      value={inspectAmount}
                      onChange={(e) => setInspectAmount(e.target.value)}
                      placeholder="1000"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-7 pr-3 py-1.5 font-mono text-xs text-white focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => {
                      const amt = parseFloat(inspectAmount) || 1000;
                      adminAdjustUserBalance(inspectUser.id, amt);
                      setInspectUser({ ...inspectUser, demoBalance: inspectUser.demoBalance + amt });
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer transition-colors"
                  >
                    + Credit
                  </button>
                  <button
                    onClick={() => {
                      const amt = parseFloat(inspectAmount) || 1000;
                      adminAdjustUserBalance(inspectUser.id, -amt);
                      setInspectUser({ ...inspectUser, demoBalance: Math.max(0, inspectUser.demoBalance - amt) });
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer transition-colors"
                  >
                    - Debit
                  </button>
                </div>

                <div className="flex gap-1.5">
                  {[500, 1000, 5000, 10000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        adminAdjustUserBalance(inspectUser.id, preset);
                        setInspectUser({ ...inspectUser, demoBalance: inspectUser.demoBalance + preset });
                      }}
                      className="px-2 py-0.5 rounded bg-slate-700/70 hover:bg-slate-700 text-emerald-400 text-[10px] font-mono cursor-pointer transition-colors"
                    >
                      +${preset >= 1000 ? `${preset / 1000}k` : preset}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Account Status</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['active', 'pending', 'suspended'] as AccountStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        adminUpdateUserStatus(inspectUser.id, st);
                        setInspectUser({ ...inspectUser, status: st });
                      }}
                      className={`py-2 rounded-xl font-bold capitalize transition-colors ${
                        inspectUser.status === st ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Admin Notes on this User</label>
                <textarea
                  rows={2}
                  value={inspectUser.adminNotes || ''}
                  onChange={(e) => {
                    const notes = e.target.value;
                    setInspectUser({ ...inspectUser, adminNotes: notes });
                    adminUpdateUser(inspectUser.id, { adminNotes: notes });
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    adminDeleteUser(inspectUser.id);
                    setInspectUser(null);
                  }}
                  className="text-rose-400 hover:text-rose-300 text-xs font-semibold cursor-pointer"
                >
                  Delete Account
                </button>
                <button
                  type="button"
                  onClick={() => setInspectUser(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: VIEW PAYMENT PROOF PHOTO LIGHTBOX */}
      {viewProofModal && viewProofModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">Payment Receipt Proof</h3>
                <span className="text-xs text-slate-400 font-mono">
                  Ref: {viewProofModal.txRef} · {viewProofModal.userName} (${viewProofModal.amount.toLocaleString()} via {viewProofModal.method})
                </span>
              </div>
              <button
                onClick={() => setViewProofModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-auto my-4 flex items-center justify-center bg-slate-950 p-2 rounded-xl border border-slate-800">
              <img
                src={viewProofModal.imageUrl}
                alt={`Proof for ${viewProofModal.txRef}`}
                className="max-h-[60vh] max-w-full rounded-lg object-contain shadow-md"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setViewProofModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: APPROVE / REJECT TRANSACTION MODAL */}
      {approvalModal && approvalModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <h3 className="text-base font-bold text-white">
                  {approvalModal.type === 'approve' ? 'Authorize & Approve Transaction' : 'Reject Transaction'}
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  Ref: {approvalModal.txRef} · {approvalModal.userName} (${approvalModal.amount.toLocaleString()})
                </span>
              </div>
              <button onClick={() => setApprovalModal(null)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>

            <div className="flex flex-col gap-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1.5 font-medium">
                  {approvalModal.type === 'approve'
                    ? 'Official Confirmation Note / Bank Tx Reference'
                    : 'Reason for Rejection (Visible to Trader)'}
                </label>
                <textarea
                  rows={3}
                  value={approvalModal.note}
                  onChange={(e) => setApprovalModal({ ...approvalModal, note: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setApprovalModal(null)}
                  className="px-4 py-2 text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (approvalModal.type === 'approve') {
                      adminApproveTransaction(approvalModal.txId, approvalModal.note);
                    } else {
                      adminRejectTransaction(approvalModal.txId, approvalModal.note);
                    }
                    setApprovalModal(null);
                  }}
                  className={`px-5 py-2 font-bold text-white rounded-xl cursor-pointer ${
                    approvalModal.type === 'approve'
                      ? 'bg-emerald-600 hover:bg-emerald-500'
                      : 'bg-rose-600 hover:bg-rose-500'
                  }`}
                >
                  {approvalModal.type === 'approve' ? 'Confirm Approval & Credit' : 'Confirm Rejection'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
