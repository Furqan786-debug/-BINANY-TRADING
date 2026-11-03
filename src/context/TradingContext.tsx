import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import {
  Asset,
  Position,
  ClosedTrade,
  Transaction,
  SupportTicket,
  NotificationItem,
  AuditLog,
  PlatformConfig,
  PaymentMethodConfig,
  OrderSide,
  OrderType,
  CandleData,
  TicketCategory,
  TicketPriority,
  TransactionType,
  TradeResultModalData,
} from '../types';
import { INITIAL_ASSETS } from '../data/mockAssets';
import { useAuth } from './AuthContext';

interface PlaceOrderParams {
  side: OrderSide;
  orderType: OrderType;
  amountUsd: number;
  leverage: number;
  limitPrice?: number;
  takeProfit?: number;
  stopLoss?: number;
  durationSeconds?: number;
  targetProfitPercent?: number; // 10% to 200% chosen by trader
}

interface TradingContextType {
  assets: Asset[];
  selectedAsset: Asset;
  setSelectedAsset: (asset: Asset) => void;
  activeTimeframe: string;
  setActiveTimeframe: (tf: string) => void;
  chartType: 'candlestick' | 'line';
  setChartType: (type: 'candlestick' | 'line') => void;
  showIndicators: { sma20: boolean; ema50: boolean; volume: boolean };
  setShowIndicators: React.Dispatch<React.SetStateAction<{ sma20: boolean; ema50: boolean; volume: boolean }>>;
  positions: Position[]; // Current user positions
  allPositions: Position[]; // All platform positions (for Admin Live Show)
  closedTrades: ClosedTrade[];
  allClosedTrades: ClosedTrade[];
  transactions: Transaction[];
  tickets: SupportTicket[];
  notifications: NotificationItem[];
  auditLogs: AuditLog[];
  paymentMethods: PaymentMethodConfig[];
  platformConfig: PlatformConfig;
  updatePlatformConfig: (updates: Partial<PlatformConfig>) => void;
  
  // Trade Actions
  placeOrder: (params: PlaceOrderParams) => { success: boolean; message?: string };
  closePosition: (positionId: string, reason?: 'manual' | 'take_profit' | 'stop_loss') => void;
  adminClosePosition: (positionId: string, note?: string) => void;
  adminForceTradeOutcome: (positionId: string, outcome: 'win' | 'loss') => void;
  adminSetPositionOutcomePreset: (positionId: string, outcome: 'win' | 'loss') => void;
  resetDemoBalance: () => void;
  toggleFavorite: (assetId: string) => void;
  tradeResultModal: TradeResultModalData | null;
  closeTradeResultModal: () => void;
  triggerTradeResultModal: (data: TradeResultModalData) => void;
  
  // Payment Methods Management (Admin)
  addPaymentMethod: (method: Omit<PaymentMethodConfig, 'id'>) => void;
  updatePaymentMethod: (id: string, updates: Partial<PaymentMethodConfig>) => void;
  deletePaymentMethod: (id: string) => void;
  togglePaymentMethod: (id: string) => void;
  
  // Banking / Transfers (Deposit & Draw)
  submitDeposit: (amount: number, methodId: string, proofNote?: string, proofAttachment?: string) => { success: boolean; reference: string };
  submitWithdrawal: (amount: number, methodId: string, payoutDetails: string) => { success: boolean; message?: string };
  adminTransferFunds: (targetUserId: string, amount: number, note: string, method: string) => { success: boolean; message?: string };
  adminApproveTransaction: (txId: string, adminNote?: string) => void;
  adminRejectTransaction: (txId: string, note?: string) => void;
  
  // Support Actions
  createTicket: (subject: string, category: TicketCategory, priority: TicketPriority, initialMessage: string) => void;
  replyTicket: (ticketId: string, message: string) => void;
  updateTicketStatus: (ticketId: string, status: 'open' | 'in_progress' | 'resolved') => void;
  
  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  addNotification: (title: string, message: string, type?: NotificationItem['type'], linkTab?: string, targetUserId?: string) => void;
  
  // Metrics & Export
  totalPortfolioValue: number;
  totalUnrealizedPnl: number;
  totalRealizedPnl: number;
  exportHistoryCsv: () => void;
}

const DEFAULT_PAYMENT_METHODS: PaymentMethodConfig[] = [
  {
    id: 'pm-usdt-trc20',
    name: 'USDT (TRC-20)',
    category: 'crypto',
    accountTitle: 'TradePro Corporate Vault',
    accountNumber: 'TYd38HkaP9xLzM874BvwQ219KjnKspZ4Tq',
    networkOrBank: 'TRON TRC-20',
    instructions: 'Send USDT strictly via TRC-20 network. Minimum confirmation 1 block. Paste your transaction hash in notes.',
    minAmount: 50,
    maxAmount: 500000,
    fee: '0.00%',
    processingTime: 'Instant - 15 Mins',
    enabled: true,
    forDeposit: true,
    forWithdrawal: true,
  },
  {
    id: 'pm-usdt-erc20',
    name: 'USDT (ERC-20 / ETH)',
    category: 'crypto',
    accountTitle: 'TradePro Multi-Sig Treasury',
    accountNumber: '0x71C94b8eA364b638A072fD0E891C3E2931D45b88',
    networkOrBank: 'Ethereum ERC-20',
    instructions: 'Send USDT via Ethereum network. Gas fees paid by sender.',
    minAmount: 100,
    maxAmount: 1000000,
    fee: '0.00%',
    processingTime: '5 - 30 Mins',
    enabled: true,
    forDeposit: true,
    forWithdrawal: true,
  },
  {
    id: 'pm-bank-swift',
    name: 'Bank Wire / SWIFT / SEPA',
    category: 'bank',
    accountTitle: 'TradePro Financial Global Ltd',
    accountNumber: 'GB29NWBK60161331926819',
    networkOrBank: 'NatWest Bank International / BIC: NWBKGB2L',
    instructions: 'Include your unique User ID in the wire transfer reference. Retain wire receipt for fast confirmation.',
    minAmount: 500,
    maxAmount: 2000000,
    fee: '$0',
    processingTime: '1 - 24 Hours',
    enabled: true,
    forDeposit: true,
    forWithdrawal: true,
  },
  {
    id: 'pm-local-pay',
    name: 'Instant Mobile Wallet / Regional Pay',
    category: 'wallet',
    accountTitle: 'TradePro Regional Agent Hub',
    accountNumber: '+92 300 1234567 / 03001234567',
    networkOrBank: 'EasyPaisa / JazzCash / Raast',
    instructions: 'Transfer exact amount to the authorized corporate wallet number. Submit screenshot or TID in reference.',
    minAmount: 20,
    maxAmount: 25000,
    fee: '0%',
    processingTime: '5 - 15 Mins',
    enabled: true,
    forDeposit: true,
    forWithdrawal: true,
  },
  {
    id: 'pm-paypal-card',
    name: 'Visa / Mastercard / PayPal',
    category: 'card',
    accountTitle: 'TradePro Merchant Gateway',
    accountNumber: 'payments@tradepro.io',
    networkOrBank: 'Stripe & PayPal Enterprise Gateway',
    instructions: 'Secure 3D-Secure verified gateway. Instant account balance credit upon card confirmation.',
    minAmount: 50,
    maxAmount: 50000,
    fee: '0%',
    processingTime: 'Instant',
    enabled: true,
    forDeposit: true,
    forWithdrawal: false,
  },
];

const PRESET_ALL_POSITIONS: Position[] = [
  {
    id: 'pos-101',
    userId: 'TP-849201',
    userName: 'Sarah Lin',
    assetId: 'btc-usd',
    symbol: 'BTC/USD',
    side: 'buy',
    size: 0.15,
    amountUsd: 1422.75,
    leverage: 10,
    entryPrice: 94500.0,
    currentPrice: 94850.25,
    liquidationPrice: 85500.0,
    takeProfit: 98000.0,
    stopLoss: 92000.0,
    unrealizedPnl: 52.53,
    unrealizedPnlPercent: 3.69,
    openedAt: '2026-03-02T04:30:00Z',
  },
  {
    id: 'pos-102',
    userId: 'TP-849201',
    userName: 'Sarah Lin',
    assetId: 'xau-usd',
    symbol: 'XAU/USD',
    side: 'buy',
    size: 2.0,
    amountUsd: 274.26,
    leverage: 20,
    entryPrice: 2735.0,
    currentPrice: 2742.6,
    liquidationPrice: 2610.0,
    takeProfit: 2780.0,
    stopLoss: 2710.0,
    unrealizedPnl: 15.2,
    unrealizedPnlPercent: 5.54,
    openedAt: '2026-03-02T03:15:00Z',
  },
  {
    id: 'pos-103',
    userId: 'TP-391024',
    userName: 'David Zhao',
    assetId: 'nvda',
    symbol: 'NVDA',
    side: 'buy',
    size: 50.0,
    amountUsd: 710.75,
    leverage: 10,
    entryPrice: 139.8,
    currentPrice: 142.15,
    liquidationPrice: 127.0,
    unrealizedPnl: 117.5,
    unrealizedPnlPercent: 16.53,
    openedAt: '2026-03-02T02:10:00Z',
  },
  {
    id: 'pos-104',
    userId: 'TP-552199',
    userName: 'Elena Rostova',
    assetId: 'eur-usd',
    symbol: 'EUR/USD',
    side: 'sell',
    size: 100000,
    amountUsd: 2168.4,
    leverage: 50,
    entryPrice: 1.0865,
    currentPrice: 1.0842,
    liquidationPrice: 1.105,
    unrealizedPnl: 230.0,
    unrealizedPnlPercent: 10.6,
    openedAt: '2026-03-02T05:00:00Z',
  },
];

const PRESET_CLOSED_TRADES: ClosedTrade[] = [
  {
    id: 'tr-9921',
    userId: 'TP-849201',
    userName: 'Sarah Lin',
    assetId: 'btc-usd',
    symbol: 'BTC/USD',
    side: 'buy',
    size: 0.12,
    leverage: 10,
    entryPrice: 91400.0,
    exitPrice: 94250.0,
    realizedPnl: 342.0,
    realizedPnlPercent: 31.18,
    openedAt: '2026-03-01T10:14:00Z',
    closedAt: '2026-03-01T14:22:00Z',
    closeReason: 'take_profit',
  },
  {
    id: 'tr-9922',
    userId: 'TP-849201',
    userName: 'Sarah Lin',
    assetId: 'nvda',
    symbol: 'NVDA',
    side: 'buy',
    size: 15,
    leverage: 5,
    entryPrice: 136.5,
    exitPrice: 142.15,
    realizedPnl: 84.75,
    realizedPnlPercent: 20.69,
    openedAt: '2026-03-01T11:30:00Z',
    closedAt: '2026-03-01T16:05:00Z',
    closeReason: 'manual',
  },
  {
    id: 'tr-9923',
    userId: 'TP-849201',
    userName: 'Sarah Lin',
    assetId: 'eur-usd',
    symbol: 'EUR/USD',
    side: 'sell',
    size: 50000,
    leverage: 50,
    entryPrice: 1.0872,
    exitPrice: 1.0842,
    realizedPnl: 150.0,
    realizedPnlPercent: 13.84,
    openedAt: '2026-02-28T08:00:00Z',
    closedAt: '2026-02-28T18:40:00Z',
    closeReason: 'manual',
  },
];

const PRESET_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1001',
    userId: 'TP-849201',
    userName: 'Sarah Lin',
    userEmail: 'trader@tradepro.io',
    type: 'deposit',
    amount: 10000.0,
    method: 'Initial Trading Starter',
    reference: 'DEP-849102',
    status: 'approved',
    createdAt: '2026-01-15T09:25:00Z',
    reviewedAt: '2026-01-15T09:26:00Z',
    reviewedBy: 'System Treasury',
  },
  {
    id: 'tx-1002',
    userId: 'TP-849201',
    userName: 'Sarah Lin',
    userEmail: 'trader@tradepro.io',
    type: 'deposit',
    amount: 5000.0,
    method: 'USDT (TRC-20)',
    reference: 'DEP-773190',
    status: 'approved',
    createdAt: '2026-02-14T11:10:00Z',
    reviewedAt: '2026-02-14T11:15:00Z',
    reviewedBy: 'Marcus Vance (Admin)',
  },
  {
    id: 'tx-1003',
    userId: 'TP-391024',
    userName: 'David Zhao',
    userEmail: 'david.zhao@quantlabs.sg',
    type: 'deposit',
    amount: 2500.0,
    method: 'Bank Wire / SWIFT',
    reference: 'DEP-331092',
    status: 'pending',
    createdAt: '2026-03-02T04:45:00Z',
    accountDetails: 'Wire from DBS Bank Singapore',
  },
  {
    id: 'tx-1004',
    userId: 'TP-849201',
    userName: 'Sarah Lin',
    userEmail: 'trader@tradepro.io',
    type: 'withdrawal',
    amount: 1500.0,
    method: 'USDT (TRC-20)',
    reference: 'WTH-921045',
    status: 'pending',
    createdAt: '2026-03-02T05:10:00Z',
    accountDetails: 'Payout to: TYd38HkaP9xLzM874BvwQ219KjnKspZ4Tq',
  },
];

const PRESET_TICKETS: SupportTicket[] = [
  {
    id: 'TICK-4401',
    userId: 'TP-849201',
    userName: 'Sarah Lin',
    userEmail: 'trader@tradepro.io',
    subject: 'Question on order execution and leverage tiers',
    category: 'trading',
    priority: 'medium',
    status: 'resolved',
    createdAt: '2026-02-20T10:00:00Z',
    updatedAt: '2026-02-20T11:30:00Z',
    messages: [
      {
        id: 'msg-1',
        senderId: 'TP-849201',
        senderName: 'Sarah Lin',
        senderRole: 'user',
        message: 'Hello, what is the maximum position size for 50x leverage on BTC/USD?',
        createdAt: '2026-02-20T10:00:00Z',
      },
      {
        id: 'msg-2',
        senderId: 'TP-000001',
        senderName: 'Marcus Vance',
        senderRole: 'admin',
        message: 'Hi Sarah, maximum position size at 50x is $500,000 notional with automated liquidation protection at 95% margin depletion.',
        createdAt: '2026-02-20T11:30:00Z',
      },
    ],
  },
  {
    id: 'TICK-4402',
    userId: 'TP-391024',
    userName: 'David Zhao',
    userEmail: 'david.zhao@quantlabs.sg',
    subject: 'Request for instant bank transfer confirmation',
    category: 'deposit_withdrawal',
    priority: 'high',
    status: 'open',
    createdAt: '2026-03-01T15:00:00Z',
    updatedAt: '2026-03-01T15:00:00Z',
    messages: [
      {
        id: 'msg-3',
        senderId: 'TP-391024',
        senderName: 'David Zhao',
        senderRole: 'user',
        message: 'I submitted deposit #DEP-331092 via wire transfer, please confirm when reviewed.',
        createdAt: '2026-03-01T15:00:00Z',
      },
    ],
  },
];

const PRESET_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'TP-849201',
    title: 'Order Filled',
    message: 'Your BUY market order for BTC/USD was filled at $94,850.25.',
    type: 'trade',
    read: false,
    createdAt: '2026-03-02T04:30:00Z',
    linkTab: 'trade',
  },
  {
    id: 'notif-2',
    userId: 'TP-849201',
    title: 'Take Profit Executed',
    message: 'Closed NVDA Long at $142.15 with +$84.75 profit.',
    type: 'trade',
    read: true,
    createdAt: '2026-03-01T16:05:00Z',
    linkTab: 'history',
  },
  {
    id: 'notif-3',
    userId: 'TP-849201',
    title: 'Deposit Credited',
    message: 'Deposit of $5,000.00 approved and credited to your trading account.',
    type: 'deposit',
    read: true,
    createdAt: '2026-02-14T11:15:00Z',
    linkTab: 'portfolio',
  },
];

const PRESET_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    action: 'USER_LOGIN',
    performedBy: 'Sarah Lin (trader@tradepro.io)',
    role: 'user',
    details: 'Authenticated from terminal session',
    timestamp: '2026-03-02T04:00:00Z',
  },
  {
    id: 'log-2',
    action: 'ORDER_EXECUTION',
    performedBy: 'Sarah Lin (trader@tradepro.io)',
    role: 'user',
    details: 'Opened LONG position BTC/USD, Size 0.15 BTC, Leverage 10x',
    timestamp: '2026-03-02T04:30:00Z',
  },
  {
    id: 'log-3',
    action: 'ADMIN_TRANSACTION_REVIEW',
    performedBy: 'Marcus Vance (admin@tradepro.io)',
    role: 'admin',
    targetUser: 'Sarah Lin (TP-849201)',
    details: 'Approved deposit of $5,000.00 (Ref: DEP-773190)',
    timestamp: '2026-02-14T11:15:00Z',
  },
];

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export const TradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, updateProfile, users, adminAdjustUserBalance } = useAuth();

  const [assets, setAssets] = useState<Asset[]>(() => {
    const saved = localStorage.getItem('tradepro_assets');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_ASSETS;
  });

  const [selectedAssetId, setSelectedAssetId] = useState<string>('btc-usd');
  const [activeTimeframe, setActiveTimeframe] = useState<string>('15m');
  const [chartType, setChartType] = useState<'candlestick' | 'line'>('candlestick');
  const [showIndicators, setShowIndicators] = useState({
    sma20: true,
    ema50: false,
    volume: true,
  });

  const [positions, setPositions] = useState<Position[]>(() => {
    const saved = localStorage.getItem('tradepro_all_positions');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return PRESET_ALL_POSITIONS;
  });

  const [closedTrades, setClosedTrades] = useState<ClosedTrade[]>(() => {
    const saved = localStorage.getItem('tradepro_closed_trades');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return PRESET_CLOSED_TRADES;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('tradepro_transactions');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return PRESET_TRANSACTIONS;
  });

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodConfig[]>(() => {
    const saved = localStorage.getItem('tradepro_payment_methods');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return DEFAULT_PAYMENT_METHODS;
  });

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('tradepro_tickets');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return PRESET_TICKETS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('tradepro_notifications');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return PRESET_NOTIFICATIONS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('tradepro_audit_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return PRESET_AUDIT_LOGS;
  });

  const [platformConfig, setPlatformConfig] = useState<PlatformConfig>(() => {
    const saved = localStorage.getItem('tradepro_head_config');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return {
      platformName: 'BINANY TRADING International',
      currencySymbol: '$',
      currencyCode: 'USD',
      maintenanceMode: false,
      defaultStartingBalance: 10000,
      maxLeverageAllowed: 100,
      simulatedExecutionDelayMs: 65,
      allowNewRegistrations: true,
      minDepositAmount: 20,
      minWithdrawalAmount: 50,
      depositBonusPercent: 5,
      headDepositNotice: 'All payments must reference your Trader Account ID. Instant manual review provided by Finance Desk.',
      marketVolatilityMultiplier: 1.0,
    };
  });

  const [tradeResultModal, setTradeResultModal] = useState<TradeResultModalData | null>(null);
  const closeTradeResultModal = () => setTradeResultModal(null);
  const triggerTradeResultModal = (data: TradeResultModalData) => setTradeResultModal(data);

  // Auto-settle candle trades when countdown expires
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      positions.forEach((pos) => {
        if (pos.expiryTime && now >= pos.expiryTime) {
          // If admin marked or preset WIN, settle as win; otherwise automatically settle as default loss
          if (pos.adminOutcomeOverride === 'win') {
            adminForceTradeOutcome(pos.id, 'win');
          } else {
            adminForceTradeOutcome(pos.id, 'loss');
          }
        }
      });
    }, 400);
    return () => clearInterval(timer);
  }, [positions]);

  // Persistent storage
  useEffect(() => {
    localStorage.setItem('tradepro_assets', JSON.stringify(assets));
  }, [assets]);
  useEffect(() => {
    localStorage.setItem('tradepro_all_positions', JSON.stringify(positions));
  }, [positions]);
  useEffect(() => {
    localStorage.setItem('tradepro_closed_trades', JSON.stringify(closedTrades));
  }, [closedTrades]);
  useEffect(() => {
    localStorage.setItem('tradepro_transactions', JSON.stringify(transactions));
  }, [transactions]);
  useEffect(() => {
    localStorage.setItem('tradepro_payment_methods', JSON.stringify(paymentMethods));
  }, [paymentMethods]);
  useEffect(() => {
    localStorage.setItem('tradepro_tickets', JSON.stringify(tickets));
  }, [tickets]);
  useEffect(() => {
    localStorage.setItem('tradepro_notifications', JSON.stringify(notifications));
  }, [notifications]);
  useEffect(() => {
    localStorage.setItem('tradepro_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);
  useEffect(() => {
    localStorage.setItem('tradepro_head_config', JSON.stringify(platformConfig));
  }, [platformConfig]);

  const selectedAsset = assets.find((a) => a.id === selectedAssetId) || assets[0];

  const setSelectedAsset = (asset: Asset) => {
    setSelectedAssetId(asset.id);
  };

  const addNotification = useCallback((
    title: string,
    message: string,
    type: NotificationItem['type'] = 'system',
    linkTab?: string,
    targetUserId?: string
  ) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: targetUserId || currentUser?.id || 'guest',
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString(),
      linkTab,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  }, [currentUser?.id]);

  const logAudit = useCallback((action: string, details: string, targetUser?: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      action,
      performedBy: currentUser ? `${currentUser.name} (${currentUser.email})` : 'System',
      role: currentUser?.role || 'system',
      targetUser,
      details,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  }, [currentUser]);

  // High-Frequency Real-Time Candlestick Motion Engine (Smooth active continuous motion)
  useEffect(() => {
    const interval = setInterval(() => {
      setAssets((prevAssets) => {
        return prevAssets.map((asset) => {
          const vol =
            (asset.category === 'crypto'
              ? 0.0009
              : asset.category === 'forex'
              ? 0.0002
              : asset.category === 'stocks'
              ? 0.0005
              : 0.0003) * platformConfig.marketVolatilityMultiplier;

          // Brownian sub-tick oscillation
          const deltaFactor = 1 + (Math.random() - 0.496) * vol;
          const newPrice = Number((asset.price * deltaFactor).toFixed(asset.precision));
          const diff = newPrice - asset.price;
          const newChange24h = Number((asset.change24h + (diff / asset.price) * 8).toFixed(2));
          const newHigh = Math.max(asset.high24h, newPrice);
          const newLow = Math.min(asset.low24h, newPrice);

          const updatedCandles = [...asset.candles];
          const lastCandle = updatedCandles[updatedCandles.length - 1];
          const nowSec = Math.floor(Date.now() / 1000);

          if (lastCandle && nowSec - lastCandle.time < 180) {
            // Continually move and pulse current candle in real-time motion
            updatedCandles[updatedCandles.length - 1] = {
              ...lastCandle,
              high: Math.max(lastCandle.high, newPrice),
              low: Math.min(lastCandle.low, newPrice),
              close: newPrice,
              volume: lastCandle.volume + Math.floor(Math.random() * 250 + 20),
            };
          } else {
            // Advance bar
            updatedCandles.push({
              time: nowSec,
              open: newPrice,
              high: newPrice,
              low: newPrice,
              close: newPrice,
              volume: Math.floor(Math.random() * 4000 + 500),
            });
            if (updatedCandles.length > 120) updatedCandles.shift();
          }

          const updatedSparkline = [...asset.sparkline.slice(1), newPrice];

          return {
            ...asset,
            price: newPrice,
            change24h: newChange24h,
            high24h: newHigh,
            low24h: newLow,
            candles: updatedCandles,
            sparkline: updatedSparkline,
          };
        });
      });
    }, 900); // 900ms smooth continuous live tick motion

    return () => clearInterval(interval);
  }, [platformConfig.marketVolatilityMultiplier]);

  // Update all positions unrealized PnL in real time with price motion
  useEffect(() => {
    setPositions((prevPositions) => {
      let changed = false;
      const updated = prevPositions.map((pos) => {
        const asset = assets.find((a) => a.id === pos.assetId);
        if (!asset) return pos;

        const currentPrice = asset.price;
        const targetPct = pos.targetProfitPercent || 30;
        const targetAmt = pos.targetProfitAmount || Number(((pos.amountUsd * targetPct) / 100).toFixed(2));

        let pnl: number;
        let pnlPercent: number;

        if (pos.adminOutcomeOverride === 'win') {
          // Admin granted WIN: position reflects target profit
          pnl = targetAmt;
          pnlPercent = targetPct;
        } else if (pos.adminOutcomeOverride === 'loss') {
          // Default: trade is automatically in trade loss as requested
          pnl = -Number((pos.amountUsd * 0.85).toFixed(2));
          pnlPercent = -85;
        } else {
          pnl = pos.side === 'buy'
            ? (currentPrice - pos.entryPrice) * pos.size
            : (pos.entryPrice - currentPrice) * pos.size;
          pnlPercent = (pnl / pos.amountUsd) * 100;
        }

        if (pos.currentPrice === currentPrice && pos.unrealizedPnl === Number(pnl.toFixed(2))) {
          return pos;
        }

        changed = true;
        return {
          ...pos,
          currentPrice,
          unrealizedPnl: Number(pnl.toFixed(2)),
          unrealizedPnlPercent: Number(pnlPercent.toFixed(2)),
        };
      });

      return changed ? updated : prevPositions;
    });
  }, [assets]);

  // Auto TP / SL triggers
  useEffect(() => {
    positions.forEach((pos) => {
      const asset = assets.find((a) => a.id === pos.assetId);
      if (!asset) return;

      if (pos.takeProfit) {
        if ((pos.side === 'buy' && asset.price >= pos.takeProfit) || (pos.side === 'sell' && asset.price <= pos.takeProfit)) {
          closePosition(pos.id, 'take_profit');
          return;
        }
      }

      if (pos.stopLoss) {
        if ((pos.side === 'buy' && asset.price <= pos.stopLoss) || (pos.side === 'sell' && asset.price >= pos.stopLoss)) {
          closePosition(pos.id, 'stop_loss');
          return;
        }
      }

      // Liquidation threshold
      if (pos.unrealizedPnl <= -pos.amountUsd * 0.95) {
        closePosition(pos.id, 'stop_loss');
      }
    });
  }, [assets]);

  // Order Placement
  const placeOrder = (params: PlaceOrderParams): { success: boolean; message?: string } => {
    if (!currentUser) {
      return { success: false, message: 'Please sign in or create an account to trade.' };
    }

    if (currentUser.status === 'suspended') {
      return { success: false, message: 'Account is currently suspended. Trading is disabled.' };
    }

    if (params.amountUsd <= 0) {
      return { success: false, message: 'Please enter a valid margin amount.' };
    }

    if (params.amountUsd > currentUser.demoBalance) {
      return {
        success: false,
        message: `Insufficient funds. Available: $${currentUser.demoBalance.toLocaleString('en-US', {
          minimumFractionDigits: 2,
        })}`,
      };
    }

    const currentPrice = selectedAsset.price;
    const notionalValue = params.amountUsd * params.leverage;
    const size = Number((notionalValue / currentPrice).toFixed(4));
    const marginRatio = 1 / params.leverage;
    const liqPrice =
      params.side === 'buy'
        ? currentPrice * (1 - marginRatio * 0.9)
        : currentPrice * (1 + marginRatio * 0.9);

    const nowSec = Math.floor(Date.now() / 1000);
    // User chosen profit percent between 10% and 200% (default 30%)
    const targetProfitPercent = Math.min(200, Math.max(10, params.targetProfitPercent ?? 30));
    const targetProfitAmount = Number(((params.amountUsd * targetProfitPercent) / 100).toFixed(2));

    const newPosition: Position = {
      id: `pos-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      assetId: selectedAsset.id,
      symbol: selectedAsset.symbol,
      side: params.side,
      size,
      amountUsd: params.amountUsd,
      leverage: params.leverage,
      entryPrice: currentPrice,
      currentPrice,
      liquidationPrice: Number(liqPrice.toFixed(selectedAsset.precision)),
      takeProfit: params.takeProfit,
      stopLoss: params.stopLoss,
      unrealizedPnl: -Number((params.amountUsd * 0.85).toFixed(2)),
      unrealizedPnlPercent: -85,
      openedAt: new Date().toISOString(),
      candleTime: nowSec,
      durationSeconds: params.durationSeconds,
      expiryTime: params.durationSeconds ? Date.now() + params.durationSeconds * 1000 : undefined,
      targetProfitPercent,
      targetProfitAmount,
      adminOutcomeOverride: 'loss', // Automatically included in trade loss by default
    };

    updateProfile({
      demoBalance: Number((currentUser.demoBalance - params.amountUsd).toFixed(2)),
    });

    setPositions((prev) => [newPosition, ...prev]);

    logAudit(
      'ORDER_EXECUTION',
      `Placed ${params.side === 'buy' ? 'UP' : 'DOWN'} trade on ${selectedAsset.symbol} - Margin: $${params.amountUsd}, Target Profit: ${targetProfitPercent}% ($${targetProfitAmount})`
    );

    addNotification(
      'Trade Placed',
      `Placed ${params.side === 'buy' ? 'UP (▲)' : 'DOWN (▼)'} trade on ${selectedAsset.symbol}. Target Profit: +${targetProfitPercent}% (+$${targetProfitAmount.toFixed(2)}).`,
      'trade',
      'trade'
    );

    return { success: true };
  };

  // Admin forces Win or Loss outcome on any trade (Live Show / Admin Controls)
  const adminForceTradeOutcome = useCallback((positionId: string, outcome: 'win' | 'loss') => {
    setPositions((prev) => {
      const pos = prev.find((p) => p.id === positionId);
      if (!pos) return prev;

      const targetProfitPercent = pos.targetProfitPercent || 30;
      const targetProfitAmount = pos.targetProfitAmount || Number(((pos.amountUsd * targetProfitPercent) / 100).toFixed(2));

      if (outcome === 'win') {
        // WIN Payout: User receives full margin back PLUS selected profit!
        const totalPayout = Number((pos.amountUsd + targetProfitAmount).toFixed(2));
        adminAdjustUserBalance(pos.userId, totalPayout);

        const closed: ClosedTrade = {
          id: `tr-${Date.now()}`,
          userId: pos.userId,
          userName: pos.userName,
          assetId: pos.assetId,
          symbol: pos.symbol,
          side: pos.side,
          size: pos.size,
          leverage: pos.leverage,
          entryPrice: pos.entryPrice,
          exitPrice: pos.side === 'buy' ? pos.entryPrice * 1.012 : pos.entryPrice * 0.988,
          realizedPnl: targetProfitAmount,
          realizedPnlPercent: targetProfitPercent,
          targetProfitPercent,
          openedAt: pos.openedAt,
          closedAt: new Date().toISOString(),
          closeReason: 'admin_win',
        };

        setClosedTrades((closedPrev) => [closed, ...closedPrev]);

        // Trigger Big Celebration Modal
        setTradeResultModal({
          isOpen: true,
          isWin: true,
          symbol: pos.symbol,
          side: pos.side,
          amountUsd: pos.amountUsd,
          pnl: targetProfitAmount,
          pnlPercent: targetProfitPercent,
          entryPrice: pos.entryPrice,
          exitPrice: pos.side === 'buy' ? pos.entryPrice * 1.012 : pos.entryPrice * 0.988,
          closeReason: 'Trade Won — Target Profit Paid',
          targetProfitPercent,
        });

        addNotification(
          'Trade WON! Profit Credited',
          `🎉 WIN! Payout of $${totalPayout.toFixed(2)} (+${targetProfitPercent}% profit: +$${targetProfitAmount.toFixed(2)}) has been credited to your balance!`,
          'trade',
          'portfolio',
          pos.userId
        );

        logAudit('ADMIN_FORCE_WIN', `Admin paid WIN to ${pos.userName || pos.userId} for ${pos.symbol}: +$${targetProfitAmount} (${targetProfitPercent}%)`, pos.userId);
      } else {
        // LOSS: Margin is lost
        const closed: ClosedTrade = {
          id: `tr-${Date.now()}`,
          userId: pos.userId,
          userName: pos.userName,
          assetId: pos.assetId,
          symbol: pos.symbol,
          side: pos.side,
          size: pos.size,
          leverage: pos.leverage,
          entryPrice: pos.entryPrice,
          exitPrice: pos.side === 'buy' ? pos.entryPrice * 0.988 : pos.entryPrice * 1.012,
          realizedPnl: -pos.amountUsd,
          realizedPnlPercent: -100,
          targetProfitPercent,
          openedAt: pos.openedAt,
          closedAt: new Date().toISOString(),
          closeReason: 'admin_loss',
        };

        setClosedTrades((closedPrev) => [closed, ...closedPrev]);

        // Trigger Big Loss Notification Modal
        setTradeResultModal({
          isOpen: true,
          isWin: false,
          symbol: pos.symbol,
          side: pos.side,
          amountUsd: pos.amountUsd,
          pnl: -pos.amountUsd,
          pnlPercent: -100,
          entryPrice: pos.entryPrice,
          exitPrice: pos.side === 'buy' ? pos.entryPrice * 0.988 : pos.entryPrice * 1.012,
          closeReason: 'Trade Completed — Loss',
          targetProfitPercent,
        });

        addNotification(
          'Trade Settled (Loss)',
          `Your ${pos.symbol} ${pos.side === 'buy' ? 'UP' : 'DOWN'} trade expired. Realized loss: -$${pos.amountUsd.toFixed(2)}.`,
          'trade',
          'portfolio',
          pos.userId
        );

        logAudit('ADMIN_FORCE_LOSS', `Admin settled trade as LOSS for ${pos.userName || pos.userId} (${pos.symbol})`, pos.userId);
      }

      return prev.filter((p) => p.id !== positionId);
    });
  }, [adminAdjustUserBalance, addNotification, logAudit]);

  const adminSetPositionOutcomePreset = (positionId: string, outcome: 'win' | 'loss') => {
    setPositions((prev) =>
      prev.map((p) => {
        if (p.id === positionId) {
          return {
            ...p,
            adminOutcomeOverride: outcome,
          };
        }
        return p;
      })
    );
    logAudit('ADMIN_PRESET_OUTCOME', `Admin set outcome preset for trade ${positionId} to ${outcome.toUpperCase()}`);
  };

  // Close Position
  const closePosition = (positionId: string, reason: 'manual' | 'take_profit' | 'stop_loss' = 'manual') => {
    const pos = positions.find((p) => p.id === positionId);
    if (!pos) return;

    if (pos.adminOutcomeOverride === 'win') {
      adminForceTradeOutcome(pos.id, 'win');
    } else {
      adminForceTradeOutcome(pos.id, 'loss');
    }
  };

  // Admin closes any position
  const adminClosePosition = (positionId: string, note?: string) => {
    const pos = positions.find((p) => p.id === positionId);
    if (!pos) return;
    if (pos.adminOutcomeOverride === 'win') {
      adminForceTradeOutcome(pos.id, 'win');
    } else {
      adminForceTradeOutcome(pos.id, 'loss');
    }
  };

  const resetDemoBalance = () => {
    if (!currentUser) return;
    updateProfile({ demoBalance: platformConfig.defaultStartingBalance });
    setPositions((prev) => prev.filter((p) => p.userId !== currentUser.id));
    addNotification('Account Balance Reset', `Your balance has been restored to $${platformConfig.defaultStartingBalance.toLocaleString()}.`, 'system', 'dashboard');
    logAudit('BALANCE_RESET', `User reset balance to $${platformConfig.defaultStartingBalance}`);
  };

  const toggleFavorite = (assetId: string) => {
    setAssets((prev) => prev.map((a) => (a.id === assetId ? { ...a, isFavorite: !a.isFavorite } : a)));
  };

  // Payment Methods Admin Controls
  const addPaymentMethod = (method: Omit<PaymentMethodConfig, 'id'>) => {
    const newMethod: PaymentMethodConfig = {
      ...method,
      id: `pm-${Date.now()}`,
    };
    setPaymentMethods((prev) => [...prev, newMethod]);
    logAudit('PAYMENT_METHOD_CREATED', `Admin added payment method: ${method.name}`);
  };

  const updatePaymentMethod = (id: string, updates: Partial<PaymentMethodConfig>) => {
    setPaymentMethods((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
    logAudit('PAYMENT_METHOD_UPDATED', `Admin updated payment method: ${id}`);
  };

  const deletePaymentMethod = (id: string) => {
    setPaymentMethods((prev) => prev.filter((m) => m.id !== id));
    logAudit('PAYMENT_METHOD_DELETED', `Admin deleted payment method: ${id}`);
  };

  const togglePaymentMethod = (id: string) => {
    setPaymentMethods((prev) => prev.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m)));
  };

  // Submit deposit
  const submitDeposit = (amount: number, methodId: string, proofNote?: string, proofAttachment?: string): { success: boolean; reference: string } => {
    if (!currentUser) return { success: false, reference: '' };
    const methodObj = paymentMethods.find((m) => m.id === methodId);
    const methodName = methodObj?.name || 'Standard Transfer';
    const reference = `DEP-${Math.floor(100000 + Math.random() * 900000)}`;

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      type: 'deposit',
      amount,
      method: methodName,
      paymentMethodId: methodId,
      accountDetails: proofNote || `Payment to: ${methodObj?.accountNumber || 'Official Account'}`,
      proofAttachment: proofAttachment,
      reference,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setTransactions((prev) => [newTx, ...prev]);
    addNotification(
      'Deposit Request Received',
      `Deposit request of $${amount.toLocaleString()} via ${methodName} submitted (Ref: ${reference}).`,
      'deposit',
      'deposit'
    );
    logAudit('DEPOSIT_SUBMITTED', `User submitted deposit: $${amount} via ${methodName}`);
    return { success: true, reference };
  };

  // Submit withdrawal (Draw)
  const submitWithdrawal = (amount: number, methodId: string, payoutDetails: string): { success: boolean; message?: string } => {
    if (!currentUser) return { success: false, message: 'Sign in required' };
    if (amount < platformConfig.minWithdrawalAmount) {
      return { success: false, message: `Minimum withdrawal amount is $${platformConfig.minWithdrawalAmount}.` };
    }
    if (amount > currentUser.demoBalance) {
      return { success: false, message: 'Withdrawal amount exceeds available account balance.' };
    }

    const methodObj = paymentMethods.find((m) => m.id === methodId);
    const methodName = methodObj?.name || 'Withdrawal Transfer';
    const reference = `WTH-${Math.floor(100000 + Math.random() * 900000)}`;

    // Place in escrow
    updateProfile({ demoBalance: Number((currentUser.demoBalance - amount).toFixed(2)) });

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      type: 'withdrawal',
      amount,
      method: methodName,
      paymentMethodId: methodId,
      accountDetails: payoutDetails,
      reference,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setTransactions((prev) => [newTx, ...prev]);
    addNotification(
      'Withdrawal Request Submitted',
      `Withdrawal request of $${amount.toLocaleString()} placed in review queue (Ref: ${reference}).`,
      'deposit',
      'withdraw'
    );
    logAudit('WITHDRAWAL_SUBMITTED', `Withdrawal requested: $${amount} via ${methodName}`);
    return { success: true };
  };

  // Admin Direct Transfer (Head payment transfer from admin to user)
  const adminTransferFunds = (targetUserId: string, amount: number, note: string, method: string): { success: boolean; message?: string } => {
    const targetUser = users.find((u) => u.id === targetUserId);
    if (!targetUser) return { success: false, message: 'Target user not found.' };

    adminAdjustUserBalance(targetUserId, amount);

    const ref = `TRF-${Math.floor(100000 + Math.random() * 900000)}`;
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      userId: targetUserId,
      userName: targetUser.name,
      userEmail: targetUser.email,
      type: 'admin_transfer',
      amount,
      method,
      reference: ref,
      status: 'approved',
      adminNote: note,
      createdAt: new Date().toISOString(),
      reviewedAt: new Date().toISOString(),
      reviewedBy: currentUser?.name || 'Head Admin',
    };

    setTransactions((prev) => [newTx, ...prev]);
    addNotification(
      'Funds Transferred by Administration',
      `Admin credited $${amount.toLocaleString()} to your account via ${method}. Ref: ${ref}. Note: ${note}`,
      'deposit',
      'portfolio',
      targetUserId
    );

    logAudit('ADMIN_DIRECT_TRANSFER', `Admin transferred $${amount} to user ${targetUser.name} (${targetUserId})`, targetUserId);
    return { success: true };
  };

  // Admin approves transaction (Deposit or Withdrawal/Draw)
  const adminApproveTransaction = (txId: string, adminNote?: string) => {
    const tx = transactions.find((t) => t.id === txId);
    if (!tx) return;

    const reviewedAt = new Date().toISOString();
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === txId
          ? {
              ...t,
              status: 'approved' as const,
              reviewedAt,
              reviewedBy: currentUser?.name || 'Admin',
              adminNote: adminNote || t.adminNote,
            }
          : t
      )
    );

    if (tx.type === 'deposit') {
      adminAdjustUserBalance(tx.userId, tx.amount);
      addNotification(
        'Deposit Approved',
        `Your deposit of $${tx.amount.toLocaleString()} has been approved and credited! Ref: ${tx.reference}`,
        'deposit',
        'portfolio',
        tx.userId
      );
    } else if (tx.type === 'withdrawal') {
      addNotification(
        'Withdrawal Request Processed',
        `Your withdrawal of $${tx.amount.toLocaleString()} has been approved and disbursed. Ref: ${tx.reference}`,
        'deposit',
        'withdraw',
        tx.userId
      );
    }

    logAudit(
      'ADMIN_TX_APPROVED',
      `Approved ${tx.type.toUpperCase()} #${tx.reference} for user ${tx.userName} ($${tx.amount})`,
      tx.userId
    );
  };

  // Admin rejects transaction
  const adminRejectTransaction = (txId: string, note?: string) => {
    const tx = transactions.find((t) => t.id === txId);
    if (!tx) return;

    const reviewedAt = new Date().toISOString();
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === txId
          ? { ...t, status: 'rejected' as const, reviewedAt, reviewedBy: currentUser?.name || 'Admin', adminNote: note }
          : t
      )
    );

    // If withdrawal was rejected, refund the funds back to user
    if (tx.type === 'withdrawal') {
      adminAdjustUserBalance(tx.userId, tx.amount);
    }

    addNotification(
      'Transaction Rejected',
      `Your ${tx.type} of $${tx.amount.toLocaleString()} was rejected: ${note || 'Administrative review'}.`,
      'deposit',
      'portfolio',
      tx.userId
    );

    logAudit(
      'ADMIN_TX_REJECTED',
      `Rejected ${tx.type.toUpperCase()} #${tx.reference} for user ${tx.userName}: ${note || ''}`,
      tx.userId
    );
  };

  // Support Tickets
  const createTicket = (
    subject: string,
    category: TicketCategory,
    priority: TicketPriority,
    initialMessage: string
  ) => {
    if (!currentUser) return;
    const ticketId = `TICK-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const newTicket: SupportTicket = {
      id: ticketId,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      subject,
      category,
      priority,
      status: 'open',
      createdAt: now,
      updatedAt: now,
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderRole: currentUser.role,
          message: initialMessage,
          createdAt: now,
        },
      ],
    };

    setTickets((prev) => [newTicket, ...prev]);
    addNotification('Ticket Created', `Your support ticket #${ticketId} has been submitted.`, 'support', 'support');
    logAudit('TICKET_CREATED', `User created support ticket #${ticketId}: "${subject}"`);
  };

  const replyTicket = (ticketId: string, message: string) => {
    if (!currentUser || !message.trim()) return;
    const now = new Date().toISOString();

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const newMsg = {
            id: `msg-${Date.now()}`,
            senderId: currentUser.id,
            senderName: currentUser.name,
            senderRole: currentUser.role,
            message: message.trim(),
            createdAt: now,
          };
          const nextStatus = currentUser.role === 'admin' ? 'in_progress' : t.status;
          return {
            ...t,
            status: nextStatus,
            updatedAt: now,
            messages: [...t.messages, newMsg],
          };
        }
        return t;
      })
    );

    addNotification('Ticket Reply Added', `Reply sent for ticket #${ticketId}.`, 'support', 'support');
  };

  const updateTicketStatus = (ticketId: string, status: 'open' | 'in_progress' | 'resolved') => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status, updatedAt: new Date().toISOString() } : t))
    );
    logAudit('TICKET_STATUS_UPDATED', `Ticket #${ticketId} status changed to ${status}`);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const updatePlatformConfig = (updates: Partial<PlatformConfig>) => {
    setPlatformConfig((prev) => ({ ...prev, ...updates }));
    logAudit('HEAD_CONFIG_UPDATED', 'Administrator updated global platform head parameters');
  };

  // Metrics
  const userPositions = positions.filter((p) => p.userId === currentUser?.id);
  const userClosedTrades = closedTrades.filter((t) => t.userId === currentUser?.id);
  const totalUnrealizedPnl = userPositions.reduce((acc, p) => acc + p.unrealizedPnl, 0);
  const totalMarginUsed = userPositions.reduce((acc, p) => acc + p.amountUsd, 0);
  const totalPortfolioValue = (currentUser?.demoBalance || 0) + totalMarginUsed + totalUnrealizedPnl;
  const totalRealizedPnl = userClosedTrades.reduce((acc, t) => acc + t.realizedPnl, 0);

  // CSV Export
  const exportHistoryCsv = () => {
    const headers = ['Trade ID,Symbol,Side,Leverage,Size,Entry Price,Exit Price,Realized PnL ($),Realized PnL (%),Close Reason,Opened At,Closed At\n'];
    const rows = userClosedTrades.map((t) =>
      `"${t.id}","${t.symbol}","${t.side.toUpperCase()}",${t.leverage},${t.size},${t.entryPrice},${t.exitPrice},${t.realizedPnl},${t.realizedPnlPercent}%,"${t.closeReason}","${t.openedAt}","${t.closedAt}"`
    );
    const blob = new Blob([headers.concat(rows.join('\n')).join('')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `tradepro_trade_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <TradingContext.Provider
      value={{
        assets,
        selectedAsset,
        setSelectedAsset,
        activeTimeframe,
        setActiveTimeframe,
        chartType,
        setChartType,
        showIndicators,
        setShowIndicators,
        positions: userPositions,
        allPositions: positions, // For admin live show
        closedTrades: userClosedTrades,
        allClosedTrades: closedTrades,
        transactions,
        tickets,
        notifications,
        auditLogs,
        paymentMethods,
        platformConfig,
        updatePlatformConfig,
        placeOrder,
        closePosition,
        adminClosePosition,
        adminForceTradeOutcome,
        adminSetPositionOutcomePreset,
        resetDemoBalance,
        toggleFavorite,
        tradeResultModal,
        closeTradeResultModal,
        triggerTradeResultModal,
        addPaymentMethod,
        updatePaymentMethod,
        deletePaymentMethod,
        togglePaymentMethod,
        submitDeposit,
        submitWithdrawal,
        adminTransferFunds,
        adminApproveTransaction,
        adminRejectTransaction,
        createTicket,
        replyTicket,
        updateTicketStatus,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotifications,
        addNotification,
        totalPortfolioValue,
        totalUnrealizedPnl,
        totalRealizedPnl,
        exportHistoryCsv,
      }}
    >
      {children}
    </TradingContext.Provider>
  );
};

export const useTrading = () => {
  const context = useContext(TradingContext);
  if (!context) {
    throw new Error('useTrading must be used within a TradingProvider');
  }
  return context;
};
