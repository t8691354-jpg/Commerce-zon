/**
 * Enterprise Financial System Repository Interface
 * Storage contracts for Payments, Wallets, Double-Entry Ledger, Settlements & Refunds
 */

import { PaymentEntity, PaymentStatus } from './PaymentEntity';
import { LedgerJournalHeader } from './DoubleEntryLedger';
import { EnterpriseWalletAccount } from './WalletEngine';
import { EnterpriseWithdrawalRequest, RefundRecord } from '../../types/paymentWalletArchitecture';

export interface FinancialSearchFilter {
  query?: string;
  status?: string;
  entityId?: string;
  provider?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface IFinancialRepository {
  // Payments
  savePayment(payment: PaymentEntity): Promise<PaymentEntity>;
  findPaymentById(id: string): Promise<PaymentEntity | null>;
  findPaymentsByCustomer(customerId: string): Promise<PaymentEntity[]>;
  findAllPayments(filter?: FinancialSearchFilter): Promise<PaymentEntity[]>;
  updatePaymentStatus(id: string, status: PaymentStatus, note?: string): Promise<PaymentEntity | null>;

  // Wallet
  getWalletByEntityId(entityId: string): Promise<EnterpriseWalletAccount | null>;
  saveWallet(wallet: EnterpriseWalletAccount): Promise<EnterpriseWalletAccount>;
  findAllWallets(): Promise<EnterpriseWalletAccount[]>;

  // Double-Entry Ledger
  postJournalHeader(header: LedgerJournalHeader): Promise<LedgerJournalHeader>;
  findAllJournalHeaders(filter?: FinancialSearchFilter): Promise<LedgerJournalHeader[]>;
  verifyLedgerIntegrity(): Promise<{ isBalanced: boolean; totalDebits: number; totalCredits: number; journalCount: number }>;

  // Payouts & Settlements
  savePayoutRequest(request: EnterpriseWithdrawalRequest): Promise<EnterpriseWithdrawalRequest>;
  findAllPayoutRequests(): Promise<EnterpriseWithdrawalRequest[]>;

  // Refunds
  saveRefund(refund: RefundRecord): Promise<RefundRecord>;
  findAllRefunds(): Promise<RefundRecord[]>;
}
