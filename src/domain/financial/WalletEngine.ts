/**
 * Enterprise Multi-Bucket Wallet Engine
 * Manages Available, Pending, Reserved (Holdback), Reward & Promotional Credit Balances
 */

export interface WalletBalanceBuckets {
  availableBalance: number;    // Unrestricted withdrawable / spendable funds
  pendingBalance: number;      // Unsettled inbound clearing payments
  reservedBalance: number;     // 14-day holdback escrow buffer for returns/disputes
  rewardBalance: number;       // Cashback rewards earned
  promotionalCredits: number;  // Promotional gift credits
  totalBalance: number;        // Sum of all active balances
  currency: 'USD' | 'EUR' | 'GBP' | 'PKR' | 'INR' | 'JPY' | 'CAD';
}

export interface EnterpriseWalletAccount {
  id: string; // wlet-...
  entityId: string; // buyerId, sellerId, or affiliateId
  entityType: 'BUYER' | 'SELLER' | 'AFFILIATE' | 'TREASURY';
  ownerName: string;
  balances: WalletBalanceBuckets;
  isFrozen: boolean;
  freezeReason?: string;
  createdAt: string;
  updatedAt: string;
}

export class WalletEngine {
  /**
   * Recalculates total balance across all buckets safely.
   */
  public static calculateTotalBalance(b: WalletBalanceBuckets): number {
    const total = b.availableBalance + b.pendingBalance + b.reservedBalance + b.rewardBalance + b.promotionalCredits;
    return Math.round(total * 100) / 100;
  }

  /**
   * Credits funds to a specific bucket.
   */
  public static creditBucket(
    wallet: EnterpriseWalletAccount,
    bucket: keyof Omit<WalletBalanceBuckets, 'totalBalance' | 'currency'>,
    amount: number
  ): void {
    if (amount <= 0) return;
    wallet.balances[bucket] = Math.round((wallet.balances[bucket] + amount) * 100) / 100;
    wallet.balances.totalBalance = this.calculateTotalBalance(wallet.balances);
    wallet.updatedAt = new Date().toISOString();
  }

  /**
   * Debits funds from a specific bucket safely with balance checks.
   */
  public static debitBucket(
    wallet: EnterpriseWalletAccount,
    bucket: keyof Omit<WalletBalanceBuckets, 'totalBalance' | 'currency'>,
    amount: number
  ): boolean {
    if (amount <= 0) return true;
    if (wallet.balances[bucket] < amount) {
      return false; // Insufficient balance in specified bucket
    }
    wallet.balances[bucket] = Math.round((wallet.balances[bucket] - amount) * 100) / 100;
    wallet.balances.totalBalance = this.calculateTotalBalance(wallet.balances);
    wallet.updatedAt = new Date().toISOString();
    return true;
  }

  /**
   * Transfers funds between buckets (e.g. Reserved Holdback -> Available Balance after 14 days).
   */
  public static transferBetweenBuckets(
    wallet: EnterpriseWalletAccount,
    fromBucket: keyof Omit<WalletBalanceBuckets, 'totalBalance' | 'currency'>,
    toBucket: keyof Omit<WalletBalanceBuckets, 'totalBalance' | 'currency'>,
    amount: number
  ): boolean {
    if (this.debitBucket(wallet, fromBucket, amount)) {
      this.creditBucket(wallet, toBucket, amount);
      return true;
    }
    return false;
  }
}
