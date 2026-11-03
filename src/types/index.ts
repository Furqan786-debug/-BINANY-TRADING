export type UserRole = 'user' | 'admin';
export type AccountStatus = 'active' | 'pending' | 'suspended';
export type AssetCategory = 'crypto' | 'forex' | 'stocks' | 'commodities';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
  avatarUrl: string;
  phone?: string;
  country?: string;
  kycTier: 'tier1' | 'tier2' | 'tier3';
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  demoBalance: number; // Current trading cash balance
  initialDemoBalance: number;
  adminNotes?: string;
  createdAt: string;
}

export interface CandleData {
  time: number; // Unix timestamp in seconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  category: AssetCategory;
  price: number;
  change24h: number; // percentage
  change24hAmount: number;
  high24h: number;
  low24h: number;
  volume24h: number; // in USD
  precision: number;
  spread: number;
  maxLeverage: number;
  isFavorite?: boolean;
  sparkline: number[];
  candles: CandleData[];
}

export type OrderSide = 'buy' | 'sell';
export type OrderType = 'market' | 'limit';

export interface Position {
  id: string;
  userId: string;
  userName?: string;
  assetId: string;
  symbol: string;
  side: OrderSide;
  size: number; // units of asset
  amountUsd: number; // margin used
  leverage: number;
  entryPrice: number;
  currentPrice: number;
  liquidationPrice: number;
  takeProfit?: number;
  stopLoss?: number;
  unrealizedPnl: number;
  unrealizedPnlPercent: number;
  openedAt: string;
  candleTime?: number;
  durationSeconds?: number;
  expiryTime?: number;
  targetProfitPercent?: number; // 10% to 200% chosen by trader
  targetProfitAmount?: number; // USD profit if won: amountUsd * targetProfitPercent / 100
  adminOutcomeOverride?: 'win' | 'loss' | 'pending'; // Default: 'loss' until admin decides/pays
}

export interface TradeResultModalData {
  isOpen: boolean;
  isWin: boolean;
  symbol: string;
  side: OrderSide;
  amountUsd: number;
  pnl: number;
  pnlPercent: number;
  entryPrice: number;
  exitPrice: number;
  closeReason?: string;
  targetProfitPercent?: number;
}

export interface ClosedTrade {
  id: string;
  userId: string;
  userName?: string;
  assetId: string;
  symbol: string;
  side: OrderSide;
  size: number;
  leverage: number;
  entryPrice: number;
  exitPrice: number;
  realizedPnl: number;
  realizedPnlPercent: number;
  targetProfitPercent?: number;
  openedAt: string;
  closedAt: string;
  closeReason: 'manual' | 'take_profit' | 'stop_loss' | 'liquidation' | 'admin_closed' | 'admin_win' | 'admin_loss' | 'expired_outcome';
}

export type TransactionType = 'deposit' | 'withdrawal' | 'admin_transfer' | 'bonus';
export type TransactionStatus = 'pending' | 'approved' | 'rejected';

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  type: TransactionType;
  amount: number;
  method: string;
  paymentMethodId?: string;
  accountDetails?: string;
  proofAttachment?: string;
  reference: string;
  status: TransactionStatus;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  adminNote?: string;
}

export interface PaymentMethodConfig {
  id: string;
  name: string;
  category: 'crypto' | 'bank' | 'wallet' | 'card' | 'custom';
  accountTitle: string;
  accountNumber: string; // IBAN, Wallet Address, or Phone
  networkOrBank?: string; // e.g. TRC-20, ERC-20, Chase Bank, EasyPaisa, JazzCash
  instructions: string;
  minAmount: number;
  maxAmount: number;
  fee: string;
  processingTime: string;
  enabled: boolean;
  forDeposit: boolean;
  forWithdrawal: boolean;
}

export type TicketCategory = 'trading' | 'account' | 'deposit_withdrawal' | 'technical' | 'general';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketStatus = 'open' | 'in_progress' | 'resolved';

export interface TicketMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  message: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'trade' | 'deposit' | 'security' | 'support' | 'system';
  read: boolean;
  createdAt: string;
  linkTab?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  performedBy: string;
  role: string;
  targetUser?: string;
  details: string;
  timestamp: string;
}

export interface PlatformConfig {
  platformName: string;
  currencySymbol: string;
  currencyCode: string;
  maintenanceMode: boolean;
  defaultStartingBalance: number;
  maxLeverageAllowed: number;
  simulatedExecutionDelayMs: number;
  allowNewRegistrations: boolean;
  minDepositAmount: number;
  minWithdrawalAmount: number;
  depositBonusPercent: number;
  headDepositNotice: string;
  marketVolatilityMultiplier: number;
}
