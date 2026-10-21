/**
 * Enterprise Financial Repository Implementation
 * Handles in-memory & persistent storage of Payments, Wallets, Double-Entry Ledger, Settlements & Refunds
 */

import { IFinancialRepository, FinancialSearchFilter } from '../../domain/financial/IFinancialRepository';
import { PaymentEntity, PaymentStatus } from '../../domain/financial/PaymentEntity';
import { LedgerJournalHeader } from '../../domain/financial/DoubleEntryLedger';
import { EnterpriseWalletAccount } from '../../domain/financial/WalletEngine';
import { EnterpriseWithdrawalRequest, RefundRecord } from '../../types/paymentWalletArchitecture';
import { logger } from '../logging/Logger';

export class FinancialRepository implements IFinancialRepository {
  private payments: PaymentEntity[] = [
    {
      id: 'pay-20260730-8910',
      orderId: 'ord-1001',
      orderNumber: 'ORD-US-20260730-9901',
      customerId: 'cust-901',
      customerEmail: 'procurement@aerospace.io',
      sellerId: 'merch-01',
      amount: 1450.0,
      currency: 'USD',
      paymentMethod: 'COMMERCE_ZON_PAY',
      gatewayProvider: 'COMMERCE_ZON_PAY',
      status: 'SUCCESSFUL',
      attempts: [
        {
          attemptId: 'att-01',
          timestamp: new Date().toISOString(),
          gateway: 'COMMERCE_ZON_PAY',
          status: 'SUCCESSFUL',
        },
      ],
      metadata: { taxAmount: 116.0, shippingFee: 25.0 },
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      settledAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
    {
      id: 'pay-20260730-4491',
      orderId: 'ord-1002',
      orderNumber: 'ORD-US-20260730-8812',
      customerId: 'cust-902',
      customerEmail: 'purchasing@cloudnet.org',
      sellerId: 'merch-02',
      amount: 3200.0,
      currency: 'USD',
      paymentMethod: 'CREDIT_CARD',
      gatewayProvider: 'STRIPE',
      status: 'SUCCESSFUL',
      attempts: [
        {
          attemptId: 'att-02',
          timestamp: new Date().toISOString(),
          gateway: 'STRIPE',
          status: 'SUCCESSFUL',
        },
      ],
      metadata: { taxAmount: 256.0, shippingFee: 25.0 },
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      settledAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
  ];

  private wallets: EnterpriseWalletAccount[] = [
    {
      id: 'wlet-buyer-01',
      entityId: 'cust-901',
      entityType: 'BUYER',
      ownerName: 'AeroSpace Global Procurement',
      balances: {
        availableBalance: 2450.0,
        pendingBalance: 0.0,
        reservedBalance: 0.0,
        rewardBalance: 150.0,
        promotionalCredits: 50.0,
        totalBalance: 2650.0,
        currency: 'USD',
      },
      isFrozen: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'wlet-seller-01',
      entityId: 'merch-01',
      entityType: 'SELLER',
      ownerName: 'Apex Electronics Inc.',
      balances: {
        availableBalance: 48920.5,
        pendingBalance: 1450.0,
        reservedBalance: 1200.0, // 14-day holdback
        rewardBalance: 0.0,
        promotionalCredits: 0.0,
        totalBalance: 51570.5,
        currency: 'USD',
      },
      isFrozen: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'wlet-seller-02',
      entityId: 'merch-02',
      entityType: 'SELLER',
      ownerName: 'Quantum Components LLC',
      balances: {
        availableBalance: 84200.0,
        pendingBalance: 3200.0,
        reservedBalance: 4500.0,
        rewardBalance: 0.0,
        promotionalCredits: 0.0,
        totalBalance: 91900.0,
        currency: 'USD',
      },
      isFrozen: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'wlet-treasury-01',
      entityId: 'platform-treasury',
      entityType: 'TREASURY',
      ownerName: 'Commerce Zon Platform Treasury',
      balances: {
        availableBalance: 1245000.0,
        pendingBalance: 46500.0,
        reservedBalance: 85000.0,
        rewardBalance: 0.0,
        promotionalCredits: 0.0,
        totalBalance: 1376500.0,
        currency: 'USD',
      },
      isFrozen: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  private journals: LedgerJournalHeader[] = [
    {
      journalId: 'jnl-20260730-001',
      transactionId: 'pay-20260730-8910',
      referenceId: 'ord-1001',
      eventType: 'ORDER_PAYMENT_CAPTURED',
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
      isBalanced: true,
      postedBy: 'SYSTEM_FINANCIAL_ENGINE',
      lines: [
        {
          id: 'line-001-1',
          accountCode: '1000_GATEWAY_CLEARING',
          accountName: 'Gateway Clearing Account',
          direction: 'DEBIT',
          amount: 1450.0,
          currency: 'USD',
          memo: 'Inbound customer payment gross charge for Order ord-1001',
        },
        {
          id: 'line-001-2',
          accountCode: '2100_SELLER_UNSETTLED_EARNINGS',
          accountName: 'Seller Unsettled Holdback',
          direction: 'CREDIT',
          amount: 1189.0,
          currency: 'USD',
          memo: 'Seller net proceeds queued in 14-day holdback escrow for Order ord-1001',
        },
        {
          id: 'line-001-3',
          accountCode: '4000_MARKETPLACE_COMMISSION_REVENUE',
          accountName: 'Marketplace Commission Revenue',
          direction: 'CREDIT',
          amount: 145.0,
          currency: 'USD',
          memo: 'Commerce Zon platform fee commission earned for Order ord-1001',
        },
        {
          id: 'line-001-4',
          accountCode: '5000_TAX_PAYABLE_RESERVE',
          accountName: 'Tax Payable Reserve',
          direction: 'CREDIT',
          amount: 116.0,
          currency: 'USD',
          memo: 'Sales tax collected for remittance for Order ord-1001',
        },
      ],
    },
  ];

  private payouts: EnterpriseWithdrawalRequest[] = [
    {
      id: 'wd-9001',
      sellerId: 'merch-01',
      sellerName: 'Apex Electronics Inc.',
      userRole: 'SELLER',
      amount: 12500.0,
      currency: 'USD',
      payoutMethod: 'BANK_TRANSFER',
      accountDetails: 'JPMorgan Chase (****8829)',
      status: 'PAID',
      fraudRiskScore: 4,
      requestedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      approvedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      paidAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      payoutTxId: 'po_bank_9921',
    },
  ];

  private refunds: RefundRecord[] = [
    {
      id: 'ref-3001',
      transactionId: 'tx-old-100',
      orderId: 'ord-881',
      sellerId: 'merch-01',
      buyerId: 'cust-901',
      amount: 150.0,
      reason: 'BUYER_RETURN',
      wasLocked: true,
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      refundTxId: 'rfd_tx_9001',
    },
  ];

  // Payments
  async savePayment(payment: PaymentEntity): Promise<PaymentEntity> {
    const existingIndex = this.payments.findIndex((p) => p.id === payment.id);
    if (existingIndex >= 0) {
      this.payments[existingIndex] = payment;
    } else {
      this.payments.unshift(payment);
    }
    return JSON.parse(JSON.stringify(payment));
  }

  async findPaymentById(id: string): Promise<PaymentEntity | null> {
    const p = this.payments.find((item) => item.id === id || item.orderId === id || item.orderNumber === id);
    return p ? JSON.parse(JSON.stringify(p)) : null;
  }

  async findPaymentsByCustomer(customerId: string): Promise<PaymentEntity[]> {
    return this.payments.filter((p) => p.customerId === customerId);
  }

  async findAllPayments(filter?: FinancialSearchFilter): Promise<PaymentEntity[]> {
    let result = [...this.payments];

    if (filter) {
      if (filter.status && filter.status !== 'ALL') {
        result = result.filter((p) => p.status === filter.status);
      }
      if (filter.entityId) {
        result = result.filter((p) => p.customerId === filter.entityId || p.sellerId === filter.entityId);
      }
      if (filter.provider) {
        result = result.filter((p) => p.gatewayProvider === filter.provider);
      }
      if (filter.query) {
        const q = filter.query.toLowerCase();
        result = result.filter(
          (p) =>
            p.id.toLowerCase().includes(q) ||
            p.orderNumber.toLowerCase().includes(q) ||
            p.customerEmail.toLowerCase().includes(q)
        );
      }
    }

    return result;
  }

  async updatePaymentStatus(id: string, status: PaymentStatus, note?: string): Promise<PaymentEntity | null> {
    const p = this.payments.find((item) => item.id === id);
    if (!p) return null;
    p.status = status;
    p.updatedAt = new Date().toISOString();
    return JSON.parse(JSON.stringify(p));
  }

  // Wallet
  async getWalletByEntityId(entityId: string): Promise<EnterpriseWalletAccount | null> {
    const w = this.wallets.find((item) => item.entityId === entityId || item.id === entityId);
    return w ? w : null;
  }

  async saveWallet(wallet: EnterpriseWalletAccount): Promise<EnterpriseWalletAccount> {
    const idx = this.wallets.findIndex((w) => w.id === wallet.id || w.entityId === wallet.entityId);
    if (idx >= 0) {
      this.wallets[idx] = wallet;
    } else {
      this.wallets.push(wallet);
    }
    return wallet;
  }

  async findAllWallets(): Promise<EnterpriseWalletAccount[]> {
    return [...this.wallets];
  }

  // Double-Entry Ledger
  async postJournalHeader(header: LedgerJournalHeader): Promise<LedgerJournalHeader> {
    this.journals.unshift(header);
    logger.audit(`[FinancialLedger] Posted balanced Journal ${header.journalId} (${header.eventType}).`, 'FinancialLedger');
    return JSON.parse(JSON.stringify(header));
  }

  async findAllJournalHeaders(filter?: FinancialSearchFilter): Promise<LedgerJournalHeader[]> {
    let list = [...this.journals];
    if (filter && filter.query) {
      const q = filter.query.toLowerCase();
      list = list.filter(
        (j) =>
          j.journalId.toLowerCase().includes(q) ||
          j.transactionId.toLowerCase().includes(q) ||
          j.referenceId.toLowerCase().includes(q) ||
          j.eventType.toLowerCase().includes(q)
      );
    }
    return list;
  }

  async verifyLedgerIntegrity(): Promise<{ isBalanced: boolean; totalDebits: number; totalCredits: number; journalCount: number }> {
    let totalDebits = 0;
    let totalCredits = 0;

    for (const j of this.journals) {
      for (const line of j.lines) {
        if (line.direction === 'DEBIT') {
          totalDebits += line.amount;
        } else {
          totalCredits += line.amount;
        }
      }
    }

    totalDebits = Math.round(totalDebits * 100) / 100;
    totalCredits = Math.round(totalCredits * 100) / 100;

    return {
      isBalanced: totalDebits === totalCredits,
      totalDebits,
      totalCredits,
      journalCount: this.journals.length,
    };
  }

  // Payouts & Settlements
  async savePayoutRequest(request: EnterpriseWithdrawalRequest): Promise<EnterpriseWithdrawalRequest> {
    const idx = this.payouts.findIndex((p) => p.id === request.id);
    if (idx >= 0) {
      this.payouts[idx] = request;
    } else {
      this.payouts.unshift(request);
    }
    return JSON.parse(JSON.stringify(request));
  }

  async findAllPayoutRequests(): Promise<EnterpriseWithdrawalRequest[]> {
    return [...this.payouts];
  }

  // Refunds
  async saveRefund(refund: RefundRecord): Promise<RefundRecord> {
    this.refunds.unshift(refund);
    return JSON.parse(JSON.stringify(refund));
  }

  async findAllRefunds(): Promise<RefundRecord[]> {
    return [...this.refunds];
  }
}

export const financialRepository = new FinancialRepository();
