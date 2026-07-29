/**
 * Enterprise Wallet & Payment Architecture Domain Types
 * Clean Adapter Pattern & Immutable Double-Entry Ledger System
 */

export type TransactionStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SUCCESS'
  | 'FAILED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED'
  | 'DISPUTED'
  | 'CANCELLED';

export type LedgerEntryType =
  | 'ORDER_PAID'
  | 'COMMISSION_DEDUCTED'
  | 'REFUND_ISSUED'
  | 'WITHDRAWAL_REQUESTED'
  | 'WITHDRAWAL_PAID'
  | 'WITHDRAWAL_REJECTED'
  | 'ADJUSTMENT'
  | 'MANUAL_CREDIT'
  | 'MANUAL_DEBIT'
  | 'WALLET_UNLOCKED';

export type LedgerBucket = 'LOCKED' | 'AVAILABLE' | 'PENDING' | 'WITHDRAWN' | 'TREASURY' | 'ESCROW';

export interface WalletLedgerEntry {
  id: string; // ledg_...
  transactionId: string; // tx_...
  timestamp: string;
  entityType: 'SELLER' | 'BUYER' | 'ADMIN' | 'AFFILIATE';
  entityId: string;
  type: LedgerEntryType;
  direction: 'CREDIT' | 'DEBIT' | 'TRANSFER';
  amount: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'PKR' | 'JPY' | 'INR';
  fromBucket?: LedgerBucket;
  toBucket?: LedgerBucket;
  balanceBefore: number;
  balanceAfter: number;
  orderId?: string;
  description: string;
  metadata?: Record<string, any>;
}

export interface EnterpriseSellerWallet {
  merchantId: string;
  merchantName: string;
  totalBalance: number; // locked + available + pending
  lockedBalance: number; // 14-day holdback escrow balance
  availableBalance: number; // withdrawable balance
  pendingBalance: number; // unsettled payments
  withdrawnBalance: number; // lifetime payouts paid out
  lifetimeEarnings: number; // cumulative gross sales
  commissionDeducted: number;
  currency: 'USD';
  isFrozen: boolean;
}

export interface HoldPeriodRecord {
  id: string; // hold_...
  orderId: string;
  sellerId: string;
  amount: number;
  commissionAmount: number;
  netSellerAmount: number;
  currency: 'USD';
  lockedAt: string;
  unlocksAt: string; // ISO timestamp (lockedAt + lockPeriodDays)
  holdPeriodDays: number; // Default 14 days
  status: 'LOCKED' | 'UNLOCKED' | 'REFUNDED' | 'DISPUTED';
  unlockedAt?: string;
  refundedAt?: string;
  disputedAt?: string;
}

export interface PaymentSession {
  id: string; // ps_...
  paymentIntentId: string; // pi_mock_... or pi_stripe_...
  orderId: string;
  buyerId: string;
  buyerEmail: string;
  sellerId: string;
  amount: number;
  currency: 'USD';
  status: 'REQUIRES_PAYMENT_METHOD' | 'REQUIRES_CONFIRMATION' | 'PROCESSING' | 'SUCCEEDED' | 'CANCELLED';
  provider: 'MOCK' | 'STRIPE_CONNECT' | 'ADYEN' | 'PAYPAL';
  clientSecret: string;
  createdAt: string;
  expiresAt: string;
}

export interface PaymentTransactionRecord {
  id: string; // tx_...
  paymentIntentId: string;
  chargeId: string; // ch_...
  orderId: string;
  buyerId: string;
  sellerId: string;
  grossAmount: number;
  commissionAmount: number;
  netSellerAmount: number;
  currency: 'USD';
  status: TransactionStatus;
  provider: 'MOCK' | 'STRIPE_CONNECT' | 'ADYEN' | 'PAYPAL';
  createdAt: string;
  refundedAmount?: number;
  disputeId?: string;
}

export type WithdrawalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID' | 'CANCELLED';

export interface EnterpriseWithdrawalRequest {
  id: string; // wd_...
  sellerId: string;
  sellerName: string;
  userRole: 'SELLER' | 'AFFILIATE' | 'BUYER';
  amount: number;
  currency: 'USD';
  payoutMethod: 'BANK_TRANSFER' | 'PAYPAL' | 'STRIPE_EXPRESS' | 'CRYPTO';
  accountDetails: string;
  status: WithdrawalStatus;
  fraudRiskScore: number; // 0-100
  requestedAt: string;
  approvedAt?: string;
  paidAt?: string;
  rejectedAt?: string;
  adminNote?: string;
  payoutTxId?: string; // po_...
}

export interface CommissionRule {
  id: string;
  name: string;
  targetType: 'GLOBAL' | 'CATEGORY' | 'PRODUCT' | 'VENDOR';
  targetValue?: string; // category name, product id, or vendor id
  percentage: number; // e.g., 8.5 for 8.5%
  flatFee: number; // e.g. 0.30 per sale
  isActive: boolean;
  updatedAt: string;
}

export interface RefundRecord {
  id: string; // ref_...
  transactionId: string;
  orderId: string;
  sellerId: string;
  buyerId: string;
  amount: number;
  reason: 'BUYER_RETURN' | 'CANCELLED_BEFORE_SHIP' | 'DEFECTIVE' | 'SELLER_DISPUTE' | 'ADMIN_OVERRIDE';
  wasLocked: boolean; // whether refunded from locked or available balance
  createdAt: string;
  refundTxId: string;
}

export interface DisputeRecord {
  id: string; // disp_...
  orderId: string;
  transactionId: string;
  sellerId: string;
  buyerId: string;
  amount: number;
  reason: string;
  status: 'NEEDS_RESPONSE' | 'UNDER_REVIEW' | 'WON' | 'LOST';
  openedAt: string;
  resolvedAt?: string;
  evidenceNotes?: string;
}

export type WebhookEventType =
  | 'payment_intent.succeeded'
  | 'payment_intent.payment_failed'
  | 'charge.refunded'
  | 'charge.dispute.created'
  | 'transfer.created'
  | 'payout.paid';

export interface WebhookLog {
  id: string; // evt_...
  eventType: WebhookEventType;
  provider: 'MOCK' | 'STRIPE_CONNECT';
  payload: Record<string, any>;
  processedAt: string;
  status: 'SUCCESS' | 'FAILED';
  errorMessage?: string;
}

export interface PaymentArchitectureSettings {
  lockPeriodDays: number; // default 14
  autoReleaseEnabled: boolean;
  globalCommissionPct: number; // default 8.5
  flatFeeUSD: number; // default 0.30
  activeProvider: 'MOCK' | 'STRIPE_CONNECT';
  stripePublishableKey?: string;
  stripeConnectAccountId?: string;
  allowEarlyUnlockByAdmin: boolean;
}
