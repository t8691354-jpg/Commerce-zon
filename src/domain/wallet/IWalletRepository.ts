export interface WalletTransactionEntity {
  id: string;
  walletId: string;
  amount: number;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'ORDER_PAYMENT' | 'ORDER_REFUND' | 'COMMISSION_FEE' | 'SELLER_PAYOUT' | 'BONUS_CREDIT';
  status: string;
  description: string;
  createdAt: string;
}

export interface WalletEntity {
  id: string;
  userId?: string;
  sellerId?: string;
  balance: number;
  frozenBalance: number;
  currency: string;
  transactions: WalletTransactionEntity[];
}

export interface IWalletRepository {
  findByUserId(userId: string): Promise<WalletEntity | null>;
  findBySellerId(sellerId: string): Promise<WalletEntity | null>;
  transfer(fromWalletId: string, toWalletId: string, amount: number, description: string): Promise<boolean>;
  credit(walletId: string, amount: number, description: string, type?: WalletTransactionEntity['type']): Promise<WalletEntity | null>;
  debit(walletId: string, amount: number, description: string, type?: WalletTransactionEntity['type']): Promise<WalletEntity | null>;
}
