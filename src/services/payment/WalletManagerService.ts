/**
 * Enterprise Wallet Manager & Double-Entry Ledger Engine
 * Implements strict financial balance tracking, 14-day holdback escrow logic,
 * automatic release scheduling, commission rule resolution, and audit ledger generation.
 */

import {
  WalletState,
  WalletNotification,
} from '../../types/domain';
import {
  WalletLedgerEntry,
  EnterpriseSellerWallet,
  HoldPeriodRecord,
  PaymentTransactionRecord,
  EnterpriseWithdrawalRequest,
  CommissionRule,
  RefundRecord,
  DisputeRecord,
  WebhookLog,
  WebhookEventType,
  PaymentArchitectureSettings,
} from '../../types/paymentWalletArchitecture';
import { MockPaymentProviderAdapter, StripeConnectAdapter, IPaymentProviderAdapter } from './PaymentProviderAdapter';

export const INITIAL_COMMISSION_RULES: CommissionRule[] = [
  {
    id: 'rule-global-default',
    name: 'Global Default Platform Fee',
    targetType: 'GLOBAL',
    percentage: 8.5,
    flatFee: 0.30,
    isActive: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rule-cat-robotics',
    name: 'Robotics & Automation Special Fee',
    targetType: 'CATEGORY',
    targetValue: 'robotics',
    percentage: 5.0,
    flatFee: 0.50,
    isActive: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rule-cat-electronics',
    name: 'Consumer Electronics Tier',
    targetType: 'CATEGORY',
    targetValue: 'electronics',
    percentage: 7.5,
    flatFee: 0.30,
    isActive: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rule-vendor-apex',
    name: 'Apex Robotics Preferred Vendor Tier',
    targetType: 'VENDOR',
    targetValue: 'merch-01',
    percentage: 4.5,
    flatFee: 0.25,
    isActive: true,
    updatedAt: new Date().toISOString(),
  },
];

export const DEFAULT_WALLET_SETTINGS: PaymentArchitectureSettings = {
  lockPeriodDays: 14,
  autoReleaseEnabled: true,
  globalCommissionPct: 8.5,
  flatFeeUSD: 0.30,
  activeProvider: 'MOCK',
  allowEarlyUnlockByAdmin: true,
};

export class WalletManagerService {
  private adapter: IPaymentProviderAdapter;

  constructor(adapter?: IPaymentProviderAdapter) {
    this.adapter = adapter || new MockPaymentProviderAdapter();
  }

  setProvider(providerName: 'MOCK' | 'STRIPE_CONNECT', apiKey?: string, webhookSecret?: string) {
    if (providerName === 'STRIPE_CONNECT') {
      this.adapter = new StripeConnectAdapter(apiKey, webhookSecret);
    } else {
      this.adapter = new MockPaymentProviderAdapter();
    }
  }

  getProviderName(): string {
    return this.adapter.getProviderName();
  }

  /**
   * Resolve Commission Rate based on rule precedence:
   * Vendor > Product > Category > Global
   */
  public calculateCommission(
    grossAmount: number,
    category?: string,
    productId?: string,
    sellerId?: string,
    rules: CommissionRule[] = INITIAL_COMMISSION_RULES
  ): { commissionAmount: number; netSellerAmount: number; ruleAppliedName: string } {
    let activeRule = rules.find((r) => r.isActive && r.targetType === 'GLOBAL') || {
      name: 'Fallback Global Fee',
      percentage: 8.5,
      flatFee: 0.30,
    };

    if (category) {
      const catRule = rules.find((r) => r.isActive && r.targetType === 'CATEGORY' && r.targetValue?.toLowerCase() === category.toLowerCase());
      if (catRule) activeRule = catRule;
    }

    if (productId) {
      const prodRule = rules.find((r) => r.isActive && r.targetType === 'PRODUCT' && r.targetValue === productId);
      if (prodRule) activeRule = prodRule;
    }

    if (sellerId) {
      const vendorRule = rules.find((r) => r.isActive && r.targetType === 'VENDOR' && r.targetValue === sellerId);
      if (vendorRule) activeRule = vendorRule;
    }

    const percentageFee = (grossAmount * activeRule.percentage) / 100;
    const flatFee = activeRule.flatFee || 0;
    const totalCommission = Math.min(grossAmount, Math.round((percentageFee + flatFee) * 100) / 100);
    const netSellerAmount = Math.max(0, Math.round((grossAmount - totalCommission) * 100) / 100);

    return {
      commissionAmount: totalCommission,
      netSellerAmount,
      ruleAppliedName: activeRule.name,
    };
  }

  /**
   * Execute double-entry ledger entry generator
   */
  public createLedgerEntry(params: Omit<WalletLedgerEntry, 'id' | 'timestamp'>): WalletLedgerEntry {
    return {
      id: `ledg_${Math.random().toString(36).substring(2, 11)}`,
      timestamp: new Date().toISOString(),
      ...params,
    };
  }

  /**
   * Process Order Payment Flow:
   * - Funds placed directly into Locked Escrow Balance (14-day policy)
   * - Commission deducted & recorded in Admin Treasury
   * - Double-entry ledger entries created
   * - Lock period record created
   */
  public processOrderPayment(
    params: {
      orderId: string;
      buyerId: string;
      buyerName: string;
      sellerId: string;
      sellerName: string;
      grossAmount: number;
      category?: string;
      productId?: string;
      lockPeriodDays?: number;
    },
    currentState: WalletState,
    rules: CommissionRule[] = INITIAL_COMMISSION_RULES,
    existingHolds: HoldPeriodRecord[] = [],
    existingLedger: WalletLedgerEntry[] = []
  ): {
    updatedWalletState: WalletState;
    newHoldRecord: HoldPeriodRecord;
    newLedgerEntries: WalletLedgerEntry[];
    newNotification: WalletNotification;
  } {
    const lockDays = params.lockPeriodDays ?? 14;
    const now = new Date();
    const unlocksAt = new Date(now.getTime() + lockDays * 24 * 60 * 60 * 1000).toISOString();

    const { commissionAmount, netSellerAmount, ruleAppliedName } = this.calculateCommission(
      params.grossAmount,
      params.category,
      params.productId,
      params.sellerId,
      rules
    );

    const txId = `tx_${Math.random().toString(36).substring(2, 11)}`;

    // 1. Create Hold Period Record
    const newHoldRecord: HoldPeriodRecord = {
      id: `hold_${Math.random().toString(36).substring(2, 11)}`,
      orderId: params.orderId,
      sellerId: params.sellerId,
      amount: params.grossAmount,
      commissionAmount,
      netSellerAmount,
      currency: 'USD',
      lockedAt: now.toISOString(),
      unlocksAt,
      holdPeriodDays: lockDays,
      status: 'LOCKED',
    };

    // 2. Double-Entry Ledger Entries
    const sellerLedgerEntry = this.createLedgerEntry({
      transactionId: txId,
      entityType: 'SELLER',
      entityId: params.sellerId,
      type: 'ORDER_PAID',
      direction: 'CREDIT',
      amount: netSellerAmount,
      currency: 'USD',
      toBucket: 'LOCKED',
      balanceBefore: currentState.sellerWallet.reservedBalance || 0,
      balanceAfter: (currentState.sellerWallet.reservedBalance || 0) + netSellerAmount,
      orderId: params.orderId,
      description: `Order ${params.orderId} funds placed in 14-day holdback escrow (${ruleAppliedName})`,
      metadata: { grossAmount: params.grossAmount, commissionAmount, lockDays },
    });

    const commissionLedgerEntry = this.createLedgerEntry({
      transactionId: txId,
      entityType: 'ADMIN',
      entityId: 'admin-treasury',
      type: 'COMMISSION_DEDUCTED',
      direction: 'CREDIT',
      amount: commissionAmount,
      currency: 'USD',
      toBucket: 'TREASURY',
      balanceBefore: currentState.adminWallet.commissionRevenue,
      balanceAfter: currentState.adminWallet.commissionRevenue + commissionAmount,
      orderId: params.orderId,
      description: `Commission collected on ${params.orderId} via ${ruleAppliedName}`,
      metadata: { grossAmount: params.grossAmount, sellerId: params.sellerId },
    });

    const newLedgerEntries = [sellerLedgerEntry, commissionLedgerEntry];

    // 3. Update Wallet State safely
    const updatedSellerWallet = {
      ...currentState.sellerWallet,
      pendingBalance: currentState.sellerWallet.pendingBalance + netSellerAmount,
      reservedBalance: (currentState.sellerWallet.reservedBalance || 0) + netSellerAmount,
      totalSettled: currentState.sellerWallet.totalSettled + netSellerAmount,
      commissionDeducted: currentState.sellerWallet.commissionDeducted + commissionAmount,
    };

    const updatedAdminWallet = {
      ...currentState.adminWallet,
      marketplaceRevenue: currentState.adminWallet.marketplaceRevenue + params.grossAmount,
      commissionRevenue: currentState.adminWallet.commissionRevenue + commissionAmount,
      platformProfit: currentState.adminWallet.platformProfit + commissionAmount,
    };

    const newNotification: WalletNotification = {
      id: `notif_${Math.random().toString(36).substring(2, 9)}`,
      title: 'Payment Received (Funds Locked)',
      message: `Payment of $${params.grossAmount.toFixed(2)} received for ${params.orderId}. Net $${netSellerAmount.toFixed(2)} locked in 14-day buyer protection escrow.`,
      type: 'PAYMENT_SUCCESS',
      read: false,
      timestamp: now.toISOString(),
      amount: params.grossAmount,
    };

    const updatedNotifications = [newNotification, ...(currentState.notifications || [])];

    const updatedWalletState: WalletState = {
      ...currentState,
      sellerWallet: updatedSellerWallet,
      adminWallet: updatedAdminWallet,
      notifications: updatedNotifications,
    };

    return {
      updatedWalletState,
      newHoldRecord,
      newLedgerEntries,
      newNotification,
    };
  }

  /**
   * Automatic or Manual Unlock Scheduler:
   * Releases locked funds to available withdrawable balance when hold period expires.
   */
  public processHoldUnlocks(
    holds: HoldPeriodRecord[],
    currentState: WalletState,
    forceUnlockOrderId?: string
  ): {
    updatedState: WalletState;
    updatedHolds: HoldPeriodRecord[];
    unlockedCount: number;
    unlockedTotal: number;
    newLedgerEntries: WalletLedgerEntry[];
    newNotifications: WalletNotification[];
  } {
    const now = new Date();
    let unlockedCount = 0;
    let unlockedTotal = 0;
    const newLedgerEntries: WalletLedgerEntry[] = [];
    const newNotifications: WalletNotification[] = [];

    const updatedHolds = holds.map((hold) => {
      const isExpired = new Date(hold.unlocksAt) <= now;
      const isForced = forceUnlockOrderId && hold.orderId === forceUnlockOrderId;

      if (hold.status === 'LOCKED' && (isExpired || isForced)) {
        unlockedCount++;
        unlockedTotal += hold.netSellerAmount;

        const txId = `tx_unlock_${Math.random().toString(36).substring(2, 11)}`;
        const ledger = this.createLedgerEntry({
          transactionId: txId,
          entityType: 'SELLER',
          entityId: hold.sellerId,
          type: 'WALLET_UNLOCKED',
          direction: 'TRANSFER',
          amount: hold.netSellerAmount,
          currency: 'USD',
          fromBucket: 'LOCKED',
          toBucket: 'AVAILABLE',
          balanceBefore: currentState.sellerWallet.availableBalance,
          balanceAfter: currentState.sellerWallet.availableBalance + hold.netSellerAmount,
          orderId: hold.orderId,
          description: `Holdback released for Order ${hold.orderId}. Net $${hold.netSellerAmount.toFixed(2)} unlocked for payout.`,
        });
        newLedgerEntries.push(ledger);

        const notif: WalletNotification = {
          id: `notif_unlock_${Math.random().toString(36).substring(2, 9)}`,
          title: 'Funds Released & Available',
          message: `$${hold.netSellerAmount.toFixed(2)} from Order ${hold.orderId} released from escrow to your withdrawable balance.`,
          type: 'PAYMENT_SUCCESS',
          read: false,
          timestamp: now.toISOString(),
          amount: hold.netSellerAmount,
        };
        newNotifications.push(notif);

        return {
          ...hold,
          status: 'UNLOCKED' as const,
          unlockedAt: now.toISOString(),
        };
      }

      return hold;
    });

    if (unlockedCount === 0) {
      return {
        updatedState: currentState,
        updatedHolds: holds,
        unlockedCount: 0,
        unlockedTotal: 0,
        newLedgerEntries: [],
        newNotifications: [],
      };
    }

    const updatedSellerWallet = {
      ...currentState.sellerWallet,
      availableBalance: currentState.sellerWallet.availableBalance + unlockedTotal,
      withdrawableBalance: currentState.sellerWallet.withdrawableBalance + unlockedTotal,
      reservedBalance: Math.max(0, (currentState.sellerWallet.reservedBalance || 0) - unlockedTotal),
      pendingBalance: Math.max(0, currentState.sellerWallet.pendingBalance - unlockedTotal),
    };

    const updatedState: WalletState = {
      ...currentState,
      sellerWallet: updatedSellerWallet,
      notifications: [...newNotifications, ...(currentState.notifications || [])],
    };

    return {
      updatedState,
      updatedHolds,
      unlockedCount,
      unlockedTotal,
      newLedgerEntries,
      newNotifications,
    };
  }

  /**
   * Refund Engine:
   * Handles refund requests during or after hold period.
   * If locked: deducts from locked balance.
   * If unlocked: deducts from available balance.
   */
  public processRefund(
    params: {
      transactionId: string;
      orderId: string;
      sellerId: string;
      buyerId: string;
      amount: number;
      reason: 'BUYER_RETURN' | 'CANCELLED_BEFORE_SHIP' | 'DEFECTIVE' | 'SELLER_DISPUTE' | 'ADMIN_OVERRIDE';
    },
    currentState: WalletState,
    holds: HoldPeriodRecord[]
  ): {
    updatedState: WalletState;
    updatedHolds: HoldPeriodRecord[];
    refundRecord: RefundRecord;
    newLedgerEntries: WalletLedgerEntry[];
    newNotification: WalletNotification;
  } {
    const now = new Date().toISOString();

    const matchingHold = holds.find((h) => h.orderId === params.orderId || h.id === params.transactionId);
    const wasLocked = matchingHold ? matchingHold.status === 'LOCKED' : true;
    const refundTxId = `tx_refund_${Math.random().toString(36).substring(2, 11)}`;

    const refundRecord: RefundRecord = {
      id: `ref_${Math.random().toString(36).substring(2, 11)}`,
      transactionId: params.transactionId,
      orderId: params.orderId,
      sellerId: params.sellerId,
      buyerId: params.buyerId,
      amount: params.amount,
      reason: params.reason,
      wasLocked,
      createdAt: now,
      refundTxId,
    };

    const ledgerSeller = this.createLedgerEntry({
      transactionId: refundTxId,
      entityType: 'SELLER',
      entityId: params.sellerId,
      type: 'REFUND_ISSUED',
      direction: 'DEBIT',
      amount: params.amount,
      currency: 'USD',
      fromBucket: wasLocked ? 'LOCKED' : 'AVAILABLE',
      balanceBefore: currentState.sellerWallet.availableBalance,
      balanceAfter: wasLocked
        ? currentState.sellerWallet.availableBalance
        : Math.max(0, currentState.sellerWallet.availableBalance - params.amount),
      orderId: params.orderId,
      description: `Refund of $${params.amount.toFixed(2)} processed for Order ${params.orderId} (${params.reason})`,
    });

    const ledgerBuyer = this.createLedgerEntry({
      transactionId: refundTxId,
      entityType: 'BUYER',
      entityId: params.buyerId,
      type: 'REFUND_ISSUED',
      direction: 'CREDIT',
      amount: params.amount,
      currency: 'USD',
      toBucket: 'AVAILABLE',
      balanceBefore: currentState.buyerWallet.walletBalance,
      balanceAfter: currentState.buyerWallet.walletBalance + params.amount,
      orderId: params.orderId,
      description: `Refund credit of $${params.amount.toFixed(2)} received for Order ${params.orderId}`,
    });

    const newLedgerEntries = [ledgerSeller, ledgerBuyer];

    // Update Seller Wallet
    const updatedSellerWallet = {
      ...currentState.sellerWallet,
      availableBalance: wasLocked
        ? currentState.sellerWallet.availableBalance
        : Math.max(0, currentState.sellerWallet.availableBalance - params.amount),
      withdrawableBalance: wasLocked
        ? currentState.sellerWallet.withdrawableBalance
        : Math.max(0, currentState.sellerWallet.withdrawableBalance - params.amount),
      reservedBalance: wasLocked
        ? Math.max(0, (currentState.sellerWallet.reservedBalance || 0) - params.amount)
        : currentState.sellerWallet.reservedBalance,
      refundAdjustments: currentState.sellerWallet.refundAdjustments + params.amount,
    };

    // Update Buyer Wallet
    const updatedBuyerWallet = {
      ...currentState.buyerWallet,
      walletBalance: currentState.buyerWallet.walletBalance + params.amount,
      refundBalance: currentState.buyerWallet.refundBalance + params.amount,
    };

    // Update Admin Wallet
    const updatedAdminWallet = {
      ...currentState.adminWallet,
      refundAdjustments: currentState.adminWallet.refundAdjustments + params.amount,
    };

    const newNotification: WalletNotification = {
      id: `notif_ref_${Math.random().toString(36).substring(2, 9)}`,
      title: 'Refund Processed',
      message: `Refund of $${params.amount.toFixed(2)} completed for Order ${params.orderId}. Funds credited to Buyer Wallet.`,
      type: 'REFUND',
      read: false,
      timestamp: now,
      amount: params.amount,
    };

    const updatedHolds = holds.map((h) => {
      if (h.orderId === params.orderId) {
        return {
          ...h,
          status: 'REFUNDED' as const,
          refundedAt: now,
        };
      }
      return h;
    });

    const updatedState: WalletState = {
      ...currentState,
      sellerWallet: updatedSellerWallet,
      buyerWallet: updatedBuyerWallet,
      adminWallet: updatedAdminWallet,
      notifications: [newNotification, ...(currentState.notifications || [])],
    };

    return {
      updatedState,
      updatedHolds,
      refundRecord,
      newLedgerEntries,
      newNotification,
    };
  }

  /**
   * Request Withdrawal:
   * Validates available balance & puts funds into PENDING status.
   */
  public requestWithdrawal(
    params: {
      sellerId: string;
      sellerName: string;
      userRole?: 'SELLER' | 'AFFILIATE' | 'BUYER';
      amount: number;
      payoutMethod: 'BANK_TRANSFER' | 'PAYPAL' | 'STRIPE_EXPRESS' | 'CRYPTO';
      accountDetails: string;
    },
    currentState: WalletState
  ): {
    updatedState: WalletState;
    withdrawalRequest: EnterpriseWithdrawalRequest;
    newLedgerEntry: WalletLedgerEntry;
    newNotification: WalletNotification;
  } {
    const available = currentState.sellerWallet.availableBalance;
    if (params.amount > available) {
      throw new Error(`Insufficient available balance ($${available.toFixed(2)}). Cannot request withdrawal of $${params.amount.toFixed(2)}.`);
    }

    const now = new Date().toISOString();
    const withdrawalId = `wth_${Math.random().toString(36).substring(2, 9)}`;
    const txId = `tx_wd_req_${Math.random().toString(36).substring(2, 9)}`;

    const withdrawalRequest: EnterpriseWithdrawalRequest = {
      id: withdrawalId,
      sellerId: params.sellerId,
      sellerName: params.sellerName,
      userRole: params.userRole || 'SELLER',
      amount: params.amount,
      currency: 'USD',
      payoutMethod: params.payoutMethod,
      accountDetails: params.accountDetails,
      status: 'PENDING',
      fraudRiskScore: Math.floor(Math.random() * 15),
      requestedAt: now,
      adminNote: 'Standard seller payout request pending admin sign-off.',
    };

    const newLedgerEntry = this.createLedgerEntry({
      transactionId: txId,
      entityType: 'SELLER',
      entityId: params.sellerId,
      type: 'WITHDRAWAL_REQUESTED',
      direction: 'TRANSFER',
      amount: params.amount,
      currency: 'USD',
      fromBucket: 'AVAILABLE',
      toBucket: 'PENDING',
      balanceBefore: available,
      balanceAfter: available - params.amount,
      description: `Withdrawal request of $${params.amount.toFixed(2)} created (${params.payoutMethod})`,
    });

    const updatedSellerWallet = {
      ...currentState.sellerWallet,
      availableBalance: available - params.amount,
      withdrawableBalance: available - params.amount,
      pendingBalance: currentState.sellerWallet.pendingBalance + params.amount,
    };

    const newNotification: WalletNotification = {
      id: `notif_wd_${Math.random().toString(36).substring(2, 9)}`,
      title: 'Withdrawal Requested',
      message: `Your payout request for $${params.amount.toFixed(2)} via ${params.payoutMethod} has been submitted for verification.`,
      type: 'WITHDRAWAL',
      read: false,
      timestamp: now,
      amount: params.amount,
    };

    const updatedState: WalletState = {
      ...currentState,
      sellerWallet: updatedSellerWallet,
      withdrawals: [
        {
          id: withdrawalRequest.id,
          userId: withdrawalRequest.sellerId,
          userName: withdrawalRequest.sellerName,
          userRole: withdrawalRequest.userRole as any,
          amount: withdrawalRequest.amount,
          currency: withdrawalRequest.currency,
          payoutMethod: withdrawalRequest.payoutMethod as any,
          accountDetails: withdrawalRequest.accountDetails,
          status: 'PENDING',
          fraudRiskScore: withdrawalRequest.fraudRiskScore,
          requestedAt: withdrawalRequest.requestedAt,
          adminNote: withdrawalRequest.adminNote,
        },
        ...(currentState.withdrawals || []),
      ],
      notifications: [newNotification, ...(currentState.notifications || [])],
    };

    return {
      updatedState,
      withdrawalRequest,
      newLedgerEntry,
      newNotification,
    };
  }

  /**
   * Process Payout / Approve / Reject Withdrawal
   */
  public async processWithdrawalAction(
    withdrawalId: string,
    action: 'APPROVE' | 'REJECT' | 'PAY',
    adminNote: string | undefined,
    currentState: WalletState
  ): Promise<{
    updatedState: WalletState;
    payoutResult?: any;
    newLedgerEntry: WalletLedgerEntry;
    newNotification: WalletNotification;
  }> {
    const withdrawalIndex = currentState.withdrawals.findIndex((w) => w.id === withdrawalId);
    if (withdrawalIndex === -1) {
      throw new Error(`Withdrawal request ${withdrawalId} not found.`);
    }

    const targetWithdrawal = currentState.withdrawals[withdrawalIndex];
    const now = new Date().toISOString();
    let updatedStatus: any = targetWithdrawal.status;
    let payoutResult: any = null;

    if (action === 'APPROVE' || action === 'PAY') {
      payoutResult = await this.adapter.createPayout({
        withdrawalRequestId: withdrawalId,
        sellerId: targetWithdrawal.userId,
        amount: targetWithdrawal.amount,
        payoutMethod: targetWithdrawal.payoutMethod,
        accountDetails: targetWithdrawal.accountDetails,
      });

      updatedStatus = 'PAID';
    } else if (action === 'REJECT') {
      updatedStatus = 'REJECTED';
    }

    const txId = `tx_wd_action_${Math.random().toString(36).substring(2, 9)}`;

    const newLedgerEntry = this.createLedgerEntry({
      transactionId: txId,
      entityType: 'SELLER',
      entityId: targetWithdrawal.userId,
      type: action === 'REJECT' ? 'WITHDRAWAL_REJECTED' : 'WITHDRAWAL_PAID',
      direction: action === 'REJECT' ? 'CREDIT' : 'DEBIT',
      amount: targetWithdrawal.amount,
      currency: 'USD',
      fromBucket: 'PENDING',
      toBucket: action === 'REJECT' ? 'AVAILABLE' : 'WITHDRAWN',
      balanceBefore: currentState.sellerWallet.pendingBalance,
      balanceAfter: Math.max(0, currentState.sellerWallet.pendingBalance - targetWithdrawal.amount),
      description: `Withdrawal ${withdrawalId} marked as ${updatedStatus} (${adminNote || 'Processed by Treasury Admin'})`,
    });

    const updatedSellerWallet = { ...currentState.sellerWallet };
    if (action === 'REJECT') {
      updatedSellerWallet.availableBalance += targetWithdrawal.amount;
      updatedSellerWallet.withdrawableBalance += targetWithdrawal.amount;
      updatedSellerWallet.pendingBalance = Math.max(0, updatedSellerWallet.pendingBalance - targetWithdrawal.amount);
    } else {
      updatedSellerWallet.pendingBalance = Math.max(0, updatedSellerWallet.pendingBalance - targetWithdrawal.amount);
      updatedSellerWallet.withdrawnBalance = (updatedSellerWallet.withdrawnBalance || 0) + targetWithdrawal.amount;
    }

    const newNotification: WalletNotification = {
      id: `notif_wd_act_${Math.random().toString(36).substring(2, 9)}`,
      title: action === 'REJECT' ? 'Withdrawal Rejected' : 'Payout Dispatched',
      message:
        action === 'REJECT'
          ? `Your withdrawal request of $${targetWithdrawal.amount.toFixed(2)} was rejected. Reason: ${adminNote || 'Verification check'}`
          : `Payout of $${targetWithdrawal.amount.toFixed(2)} has been successfully dispatched via ${targetWithdrawal.payoutMethod}.`,
      type: 'WITHDRAWAL',
      read: false,
      timestamp: now,
      amount: targetWithdrawal.amount,
    };

    const updatedWithdrawals = [...currentState.withdrawals];
    updatedWithdrawals[withdrawalIndex] = {
      ...targetWithdrawal,
      status: updatedStatus,
      processedAt: now,
      adminNote: adminNote || targetWithdrawal.adminNote,
    };

    const updatedState: WalletState = {
      ...currentState,
      sellerWallet: updatedSellerWallet,
      withdrawals: updatedWithdrawals,
      notifications: [newNotification, ...(currentState.notifications || [])],
    };

    return {
      updatedState,
      payoutResult,
      newLedgerEntry,
      newNotification,
    };
  }
}
