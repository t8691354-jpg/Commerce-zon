import { IWalletRepository, WalletEntity, WalletTransactionEntity } from '../../domain/wallet/IWalletRepository';
import { getPrismaClient } from '../database/prismaClient';
import { logger } from '../logging/Logger';

export class WalletRepository implements IWalletRepository {
  private inMemoryWallets: WalletEntity[] = [
    {
      id: 'wlet-buyer-01',
      userId: 'usr-03',
      balance: 1450.0,
      frozenBalance: 0.0,
      currency: 'USD',
      transactions: [
        { id: 'tx-101', walletId: 'wlet-buyer-01', amount: 500, type: 'DEPOSIT', status: 'COMPLETED', description: 'Initial Deposit', createdAt: new Date().toISOString() },
      ],
    },
    {
      id: 'wlet-seller-01',
      sellerId: 'merch-01',
      balance: 48920.5,
      frozenBalance: 1200.0,
      currency: 'USD',
      transactions: [
        { id: 'tx-201', walletId: 'wlet-seller-01', amount: 1280, type: 'ORDER_PAYMENT', status: 'COMPLETED', description: 'Payout Order #ORD-9921', createdAt: new Date().toISOString() },
      ],
    },
  ];

  async findByUserId(userId: string): Promise<WalletEntity | null> {
    const prisma = getPrismaClient();
    if (prisma) {
      try {
        const w = await prisma.wallet.findUnique({
          where: { userId },
          include: { transactions: true },
        });
        if (w) {
          return {
            id: w.id,
            userId: w.userId || undefined,
            sellerId: w.sellerId || undefined,
            balance: w.balance,
            frozenBalance: w.frozenBalance,
            currency: w.currency,
            transactions: w.transactions.map((t) => ({
              id: t.id,
              walletId: t.walletId,
              amount: t.amount,
              type: t.type as WalletTransactionEntity['type'],
              status: t.status,
              description: t.description,
              createdAt: t.createdAt.toISOString(),
            })),
          };
        }
      } catch (err) {
        logger.error('Prisma wallet lookup failed', 'WalletRepository', { error: String(err) });
      }
    }
    return this.inMemoryWallets.find((w) => w.userId === userId) || null;
  }

  async findBySellerId(sellerId: string): Promise<WalletEntity | null> {
    const prisma = getPrismaClient();
    if (prisma) {
      try {
        const w = await prisma.wallet.findUnique({
          where: { sellerId },
          include: { transactions: true },
        });
        if (w) {
          return {
            id: w.id,
            userId: w.userId || undefined,
            sellerId: w.sellerId || undefined,
            balance: w.balance,
            frozenBalance: w.frozenBalance,
            currency: w.currency,
            transactions: w.transactions.map((t) => ({
              id: t.id,
              walletId: t.walletId,
              amount: t.amount,
              type: t.type as WalletTransactionEntity['type'],
              status: t.status,
              description: t.description,
              createdAt: t.createdAt.toISOString(),
            })),
          };
        }
      } catch (err) {
        logger.error('Prisma wallet lookup failed', 'WalletRepository', { error: String(err) });
      }
    }
    return this.inMemoryWallets.find((w) => w.sellerId === sellerId) || null;
  }

  async transfer(fromWalletId: string, toWalletId: string, amount: number, description: string): Promise<boolean> {
    const prisma = getPrismaClient();
    if (prisma) {
      try {
        await prisma.$transaction(async (tx) => {
          const sender = await tx.wallet.findUnique({ where: { id: fromWalletId } });
          if (!sender || sender.balance < amount) throw new Error('Insufficient wallet funds');

          await tx.wallet.update({
            where: { id: fromWalletId },
            data: { balance: { decrement: amount } },
          });

          await tx.walletTransaction.create({
            data: {
              walletId: fromWalletId,
              amount: -amount,
              type: 'WITHDRAWAL',
              description: `Transfer Out: ${description}`,
              status: 'COMPLETED',
            },
          });

          await tx.wallet.update({
            where: { id: toWalletId },
            data: { balance: { increment: amount } },
          });

          await tx.walletTransaction.create({
            data: {
              walletId: toWalletId,
              amount: amount,
              type: 'DEPOSIT',
              description: `Transfer In: ${description}`,
              status: 'COMPLETED',
            },
          });
        });
        logger.audit(`Transfer of $${amount} completed from ${fromWalletId} to ${toWalletId}`, 'WalletRepository');
        return true;
      } catch (err) {
        logger.error('Prisma wallet transfer transaction failed', 'WalletRepository', { error: String(err) });
        return false;
      }
    }

    const from = this.inMemoryWallets.find((w) => w.id === fromWalletId);
    const to = this.inMemoryWallets.find((w) => w.id === toWalletId);

    if (from && to && from.balance >= amount) {
      from.balance -= amount;
      to.balance += amount;
      from.transactions.unshift({
        id: `tx-${Date.now()}-out`,
        walletId: fromWalletId,
        amount: -amount,
        type: 'WITHDRAWAL',
        status: 'COMPLETED',
        description: `Transfer Out: ${description}`,
        createdAt: new Date().toISOString(),
      });
      to.transactions.unshift({
        id: `tx-${Date.now()}-in`,
        walletId: toWalletId,
        amount,
        type: 'DEPOSIT',
        status: 'COMPLETED',
        description: `Transfer In: ${description}`,
        createdAt: new Date().toISOString(),
      });
      return true;
    }
    return false;
  }

  async credit(walletId: string, amount: number, description: string, type: WalletTransactionEntity['type'] = 'DEPOSIT'): Promise<WalletEntity | null> {
    const w = this.inMemoryWallets.find((item) => item.id === walletId);
    if (w) {
      w.balance += amount;
      w.transactions.unshift({
        id: `tx-${Date.now()}`,
        walletId,
        amount,
        type,
        status: 'COMPLETED',
        description,
        createdAt: new Date().toISOString(),
      });
      return { ...w };
    }
    return null;
  }

  async debit(walletId: string, amount: number, description: string, type: WalletTransactionEntity['type'] = 'WITHDRAWAL'): Promise<WalletEntity | null> {
    const w = this.inMemoryWallets.find((item) => item.id === walletId);
    if (w && w.balance >= amount) {
      w.balance -= amount;
      w.transactions.unshift({
        id: `tx-${Date.now()}`,
        walletId,
        amount: -amount,
        type,
        status: 'COMPLETED',
        description,
        createdAt: new Date().toISOString(),
      });
      return { ...w };
    }
    return null;
  }
}

export const walletRepository = new WalletRepository();
