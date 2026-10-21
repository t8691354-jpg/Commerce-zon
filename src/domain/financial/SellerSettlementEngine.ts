/**
 * Enterprise Seller Settlement & Payout Engine
 * Manages Seller Holdbacks, Unsettled Earnings, Payout Requests, and Automatic Releases
 */

import { EnterpriseSellerWallet, HoldPeriodRecord, EnterpriseWithdrawalRequest } from '../../types/paymentWalletArchitecture';
import { SellerSettlementRecord } from '../../types/oms';
import { WalletEngine, EnterpriseWalletAccount } from './WalletEngine';
import { logger } from '../../infrastructure/logging/Logger';

export class SellerSettlementEngine {
  /**
   * Processes automatic release of holdbacks whose 14-day hold period has expired.
   */
  public static processHoldbackReleases(
    holdRecords: HoldPeriodRecord[],
    sellerWallets: EnterpriseWalletAccount[]
  ): { releasedCount: number; totalReleasedAmount: number } {
    const now = new Date();
    let releasedCount = 0;
    let totalReleasedAmount = 0;

    for (const hold of holdRecords) {
      if (hold.status === 'LOCKED') {
        const unlockDate = new Date(hold.unlocksAt);
        if (now >= unlockDate) {
          hold.status = 'UNLOCKED';
          hold.unlockedAt = now.toISOString();

          // Move funds from reservedBalance to availableBalance in seller wallet
          const wallet = sellerWallets.find((w) => w.entityId === hold.sellerId);
          if (wallet) {
            WalletEngine.transferBetweenBuckets(wallet, 'reservedBalance', 'availableBalance', hold.netSellerAmount);
          }

          releasedCount++;
          totalReleasedAmount += hold.netSellerAmount;
          logger.info(
            `[SettlementEngine] Released 14-day holdback $${hold.netSellerAmount} for Order ${hold.orderId} (Seller: ${hold.sellerId}).`,
            'SettlementEngine'
          );
        }
      }
    }

    return { releasedCount, totalReleasedAmount: Math.round(totalReleasedAmount * 100) / 100 };
  }

  /**
   * Creates a new Withdrawal Payout Request for a seller.
   */
  public static createPayoutRequest(
    sellerWallet: EnterpriseWalletAccount,
    requestedAmount: number,
    payoutMethod: 'BANK_TRANSFER' | 'PAYPAL' | 'STRIPE_EXPRESS' | 'CRYPTO',
    accountDetails: string
  ): EnterpriseWithdrawalRequest {
    if (sellerWallet.isFrozen) {
      throw new Error(`Payout requested failed: Wallet is frozen due to administrative review.`);
    }

    if (sellerWallet.balances.availableBalance < requestedAmount) {
      throw new Error(
        `Insufficient available balance ($${sellerWallet.balances.availableBalance.toFixed(
          2
        )}). Requested payout: $${requestedAmount.toFixed(2)}.`
      );
    }

    // Debit available balance, place in pending balance while payout is processing
    WalletEngine.transferBetweenBuckets(sellerWallet, 'availableBalance', 'pendingBalance', requestedAmount);

    const payoutReq: EnterpriseWithdrawalRequest = {
      id: `wd-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      sellerId: sellerWallet.entityId,
      sellerName: sellerWallet.ownerName,
      userRole: sellerWallet.entityType === 'AFFILIATE' ? 'AFFILIATE' : 'SELLER',
      amount: requestedAmount,
      currency: 'USD',
      payoutMethod,
      accountDetails,
      status: 'PENDING',
      fraudRiskScore: Math.floor(Math.random() * 15),
      requestedAt: new Date().toISOString(),
    };

    logger.audit(
      `Payout request ${payoutReq.id} created for ${sellerWallet.ownerName} ($${requestedAmount} via ${payoutMethod}).`,
      'SettlementEngine'
    );

    return payoutReq;
  }

  /**
   * Approves & Executes a Payout Request.
   */
  public static approvePayout(
    payoutReq: EnterpriseWithdrawalRequest,
    sellerWallet: EnterpriseWalletAccount,
    adminName: string = 'Financial Admin'
  ): void {
    if (payoutReq.status !== 'PENDING') {
      throw new Error(`Payout request is already in state "${payoutReq.status}".`);
    }

    payoutReq.status = 'PAID';
    payoutReq.approvedAt = new Date().toISOString();
    payoutReq.paidAt = new Date().toISOString();
    payoutReq.payoutTxId = `po_bank_${Date.now()}`;

    // Debit pending balance in seller wallet
    WalletEngine.debitBucket(sellerWallet, 'pendingBalance', payoutReq.amount);

    logger.audit(
      `Payout ${payoutReq.id} approved and disbursed by ${adminName} ($${payoutReq.amount} to ${sellerWallet.ownerName}).`,
      'SettlementEngine'
    );
  }
}
