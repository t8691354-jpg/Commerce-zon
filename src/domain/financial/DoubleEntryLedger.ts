/**
 * Enterprise Double-Entry Accounting Ledger Engine
 * Immutable Journal with Balanced Debit and Credit Lines
 */

export type AccountCode =
  | '1000_GATEWAY_CLEARING'        // Asset: Inbound funds from Stripe/PayPal/Bank
  | '1100_PLATFORM_ESCROW'         // Asset: Escrow funds held in platform custody
  | '2000_BUYER_WALLET_LIABILITY'  // Liability: Customer wallet balances (due on demand)
  | '2100_SELLER_UNSETTLED_EARNINGS' // Liability: Seller earnings locked in holdback
  | '2200_SELLER_WITHDRAWABLE_PAYABLE' // Liability: Seller earnings ready for payout
  | '4000_MARKETPLACE_COMMISSION_REVENUE' // Revenue: Platform commission income
  | '5000_TAX_PAYABLE_RESERVE';    // Liability: Sales Tax/VAT reserve

export type LedgerLineDirection = 'DEBIT' | 'CREDIT';

export interface LedgerJournalLine {
  id: string; // line-...
  accountCode: AccountCode;
  accountName: string;
  direction: LedgerLineDirection;
  amount: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'PKR' | 'INR' | 'JPY' | 'CAD';
  memo: string;
}

export interface LedgerJournalHeader {
  journalId: string; // jnl-YYYYMMDD-XXXX
  transactionId: string; // pay-... or tx-...
  referenceId: string; // orderId, refundId, or withdrawalId
  eventType:
    | 'ORDER_PAYMENT_CAPTURED'
    | 'COMMISSION_EARNED'
    | 'TAX_RESERVED'
    | 'HOLDBACK_RELEASED'
    | 'REFUND_PROCESSED'
    | 'SELLER_PAYOUT_EXECUTED'
    | 'WALLET_TOPUP'
    | 'ADMIN_ADJUSTMENT';
  timestamp: string;
  lines: LedgerJournalLine[];
  isBalanced: boolean;
  postedBy: string;
}

export class DoubleEntryLedgerEngine {
  /**
   * Validates that the sum of all DEBIT lines strictly equals the sum of all CREDIT lines.
   */
  public static validateJournalBalance(lines: LedgerJournalLine[]): { isBalanced: boolean; totalDebits: number; totalCredits: number } {
    let totalDebits = 0;
    let totalCredits = 0;

    for (const line of lines) {
      if (line.direction === 'DEBIT') {
        totalDebits += line.amount;
      } else {
        totalCredits += line.amount;
      }
    }

    // Round to 2 decimal places to avoid floating point precision issues
    totalDebits = Math.round(totalDebits * 100) / 100;
    totalCredits = Math.round(totalCredits * 100) / 100;

    return {
      isBalanced: totalDebits === totalCredits,
      totalDebits,
      totalCredits,
    };
  }

  /**
   * Creates balanced Journal Header for an Inbound Order Payment.
   * Debits Inbound Gateway Clearing Account ($100),
   * Credits Seller Unsettled Earnings ($82),
   * Credits Marketplace Commission Revenue ($10),
   * Credits Tax Payable Reserve ($8).
   */
  public static createOrderPaymentJournal(params: {
    journalId: string;
    transactionId: string;
    orderId: string;
    grossAmount: number;
    sellerNetAmount: number;
    commissionAmount: number;
    taxAmount: number;
    currency?: 'USD' | 'EUR' | 'GBP' | 'PKR' | 'INR' | 'JPY' | 'CAD';
  }): LedgerJournalHeader {
    const currency = params.currency || 'USD';
    const lines: LedgerJournalLine[] = [
      {
        id: `line-${Date.now()}-1`,
        accountCode: '1000_GATEWAY_CLEARING',
        accountName: 'Gateway Clearing Account',
        direction: 'DEBIT',
        amount: params.grossAmount,
        currency,
        memo: `Inbound customer payment gross charge for Order ${params.orderId}`,
      },
      {
        id: `line-${Date.now()}-2`,
        accountCode: '2100_SELLER_UNSETTLED_EARNINGS',
        accountName: 'Seller Unsettled Holdback',
        direction: 'CREDIT',
        amount: params.sellerNetAmount,
        currency,
        memo: `Seller net proceeds queued in 14-day holdback escrow for Order ${params.orderId}`,
      },
      {
        id: `line-${Date.now()}-3`,
        accountCode: '4000_MARKETPLACE_COMMISSION_REVENUE',
        accountName: 'Marketplace Commission Revenue',
        direction: 'CREDIT',
        amount: params.commissionAmount,
        currency,
        memo: `Commerce Zon platform fee commission earned for Order ${params.orderId}`,
      },
    ];

    if (params.taxAmount > 0) {
      lines.push({
        id: `line-${Date.now()}-4`,
        accountCode: '5000_TAX_PAYABLE_RESERVE',
        accountName: 'Tax Payable Reserve',
        direction: 'CREDIT',
        amount: params.taxAmount,
        currency,
        memo: `Sales tax collected for remittance for Order ${params.orderId}`,
      });
    }

    const { isBalanced } = this.validateJournalBalance(lines);

    return {
      journalId: params.journalId,
      transactionId: params.transactionId,
      referenceId: params.orderId,
      eventType: 'ORDER_PAYMENT_CAPTURED',
      timestamp: new Date().toISOString(),
      lines,
      isBalanced,
      postedBy: 'SYSTEM_FINANCIAL_ENGINE',
    };
  }

  /**
   * Creates a Reversal Journal Header for a Refund.
   */
  public static createRefundReversalJournal(params: {
    journalId: string;
    transactionId: string;
    orderId: string;
    refundAmount: number;
    sellerRefundShare: number;
    commissionRefundShare: number;
    currency?: 'USD' | 'EUR' | 'GBP' | 'PKR' | 'INR' | 'JPY' | 'CAD';
  }): LedgerJournalHeader {
    const currency = params.currency || 'USD';
    const lines: LedgerJournalLine[] = [
      {
        id: `line-${Date.now()}-r1`,
        accountCode: '2100_SELLER_UNSETTLED_EARNINGS',
        accountName: 'Seller Unsettled Holdback',
        direction: 'DEBIT',
        amount: params.sellerRefundShare,
        currency,
        memo: `Debit seller holdback balance for refund reversal on Order ${params.orderId}`,
      },
      {
        id: `line-${Date.now()}-r2`,
        accountCode: '4000_MARKETPLACE_COMMISSION_REVENUE',
        accountName: 'Marketplace Commission Revenue',
        direction: 'DEBIT',
        amount: params.commissionRefundShare,
        currency,
        memo: `Reverse platform commission for refund on Order ${params.orderId}`,
      },
      {
        id: `line-${Date.now()}-r3`,
        accountCode: '1000_GATEWAY_CLEARING',
        accountName: 'Gateway Clearing Account',
        direction: 'CREDIT',
        amount: params.refundAmount,
        currency,
        memo: `Outbound refund credit to buyer original payment method / wallet for Order ${params.orderId}`,
      },
    ];

    const { isBalanced } = this.validateJournalBalance(lines);

    return {
      journalId: params.journalId,
      transactionId: params.transactionId,
      referenceId: params.orderId,
      eventType: 'REFUND_PROCESSED',
      timestamp: new Date().toISOString(),
      lines,
      isBalanced,
      postedBy: 'SYSTEM_FINANCIAL_ENGINE',
    };
  }
}
