/**
 * Enterprise Financial Application Facade Service
 * Orchestrates Payments, Multi-Bucket Wallets, Double-Entry Ledger, Fraud Guard, Tax & Settlements
 */

import { IFinancialRepository, FinancialSearchFilter } from '../../domain/financial/IFinancialRepository';
import { financialRepository } from '../../infrastructure/repositories/FinancialRepository';
import { PaymentEntity, PaymentNumberGenerator, PaymentStatus } from '../../domain/financial/PaymentEntity';
import { PaymentGatewayFactory } from '../../domain/financial/GatewayAdapters';
import { DoubleEntryLedgerEngine, LedgerJournalHeader } from '../../domain/financial/DoubleEntryLedger';
import { WalletEngine, EnterpriseWalletAccount } from '../../domain/financial/WalletEngine';
import { SellerSettlementEngine } from '../../domain/financial/SellerSettlementEngine';
import { PromotionEngine, CouponValidationResult } from '../../domain/financial/PromotionEngine';
import { FinancialFraudEngine, FraudRiskEvaluation } from '../../domain/financial/FinancialFraudEngine';
import { TaxAndCurrencyEngine, TaxCalculationResult } from '../../domain/financial/TaxAndCurrencyEngine';
import { EnterpriseWithdrawalRequest, RefundRecord } from '../../types/paymentWalletArchitecture';
import { logger } from '../../infrastructure/logging/Logger';
import { eventBus } from '../../lib/eventBus';

export interface PaymentProcessDTO {
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerEmail: string;
  sellerId?: string;
  amount: number;
  currency?: 'USD' | 'EUR' | 'GBP' | 'PKR' | 'INR' | 'JPY' | 'CAD';
  paymentMethod: 'COMMERCE_ZON_PAY' | 'CREDIT_CARD' | 'PAYPAL' | 'STRIPE' | 'BANK_WIRE' | 'CASH_ON_DELIVERY';
  couponCode?: string;
  shippingCountry?: string;
  billingCountry?: string;
  idempotencyKey?: string;
}

export class FinancialService {
  private idempotencyCache = new Map<string, PaymentEntity>();

  constructor(private repo: IFinancialRepository = financialRepository) {}

  /**
   * Enterprise Payment Processing Engine:
   * 1. Check Idempotency Key
   * 2. Evaluate Fraud Risk
   * 3. Validate & Apply Promotional Coupons
   * 4. Calculate Regional Taxes
   * 5. Dispatch to Provider Gateway Adapter
   * 6. Record Double-Entry Journal Ledger
   * 7. Update Seller / Treasury Wallets
   * 8. Publish Domain Event
   */
  async processPayment(dto: PaymentProcessDTO): Promise<{ payment: PaymentEntity; fraudEvaluation: FraudRiskEvaluation; tax: TaxCalculationResult; coupon?: CouponValidationResult }> {
    // 1. Idempotency Check
    if (dto.idempotencyKey && this.idempotencyCache.has(dto.idempotencyKey)) {
      logger.info(`[FinancialService] Returned cached payment for idempotency key "${dto.idempotencyKey}".`, 'FinancialService');
      const cached = this.idempotencyCache.get(dto.idempotencyKey)!;
      return {
        payment: cached,
        fraudEvaluation: { riskScore: 0, riskLevel: 'LOW', passedVelocityCheck: true, isDuplicatePayment: true, reasons: [], recommendation: 'ALLOW' },
        tax: TaxAndCurrencyEngine.calculateTax(dto.amount, dto.shippingCountry || 'USA'),
      };
    }

    // 2. Fraud Risk Check
    const fraudEvaluation = FinancialFraudEngine.evaluatePaymentRisk({
      customerId: dto.customerId,
      amount: dto.amount,
      paymentMethod: dto.paymentMethod,
      idempotencyKey: dto.idempotencyKey,
      shippingCountry: dto.shippingCountry,
      billingCountry: dto.billingCountry,
    });

    if (fraudEvaluation.recommendation === 'BLOCK') {
      logger.error(`[FinancialService] Payment BLOCKED due to high fraud risk score (${fraudEvaluation.riskScore}).`, 'FinancialService');
      throw new Error(`Payment declined by Sentinel Fraud Shield: ${fraudEvaluation.reasons.join(' | ')}`);
    }

    // 3. Coupon Validation
    let couponResult: CouponValidationResult | undefined;
    let netAmountToCharge = dto.amount;

    if (dto.couponCode) {
      couponResult = PromotionEngine.validateCoupon(dto.couponCode, dto.amount);
      if (couponResult.isValid) {
        netAmountToCharge = Math.max(0, dto.amount - couponResult.discountAmount);
      }
    }

    // 4. Tax Calculation
    const tax = TaxAndCurrencyEngine.calculateTax(netAmountToCharge, dto.shippingCountry || 'USA');
    const grossTotalCharge = netAmountToCharge + tax.taxAmount + 25.0; // Charge = Net + Tax + Shipping

    // 5. Gateway Execution via Adapter Factory
    const providerId = dto.paymentMethod === 'COMMERCE_ZON_PAY' ? 'COMMERCE_ZON_PAY' : dto.paymentMethod === 'PAYPAL' ? 'PAYPAL' : 'STRIPE';
    const adapter = PaymentGatewayFactory.getAdapter(providerId);

    const paymentId = PaymentNumberGenerator.generatePaymentId();
    const gatewayResponse = await adapter.processPayment({
      paymentId,
      orderId: dto.orderId,
      amount: grossTotalCharge,
      currency: dto.currency || 'USD',
      customerEmail: dto.customerEmail,
      paymentMethod: dto.paymentMethod,
      idempotencyKey: dto.idempotencyKey,
    });

    const paymentStatus: PaymentStatus = gatewayResponse.success ? 'SUCCESSFUL' : 'FAILED';

    const paymentEntity: PaymentEntity = {
      id: paymentId,
      orderId: dto.orderId,
      orderNumber: dto.orderNumber,
      customerId: dto.customerId,
      customerEmail: dto.customerEmail,
      sellerId: dto.sellerId || 'merch-01',
      amount: Math.round(grossTotalCharge * 100) / 100,
      currency: dto.currency || 'USD',
      paymentMethod: dto.paymentMethod,
      gatewayProvider: adapter.providerName,
      status: paymentStatus,
      attempts: [
        {
          attemptId: `att-${Date.now()}`,
          timestamp: new Date().toISOString(),
          gateway: adapter.providerName,
          status: paymentStatus,
          errorMessage: gatewayResponse.errorMessage,
        },
      ],
      metadata: {
        idempotencyKey: dto.idempotencyKey,
        riskScore: fraudEvaluation.riskScore,
        taxAmount: tax.taxAmount,
        shippingFee: 25.0,
        couponCodeApplied: dto.couponCode,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      settledAt: gatewayResponse.success ? new Date().toISOString() : undefined,
    };

    const savedPayment = await this.repo.savePayment(paymentEntity);

    if (dto.idempotencyKey) {
      this.idempotencyCache.set(dto.idempotencyKey, savedPayment);
    }

    // 6. Record Double-Entry Journal Entry if Payment Succeeded
    if (paymentStatus === 'SUCCESSFUL') {
      const commissionAmount = Math.round(netAmountToCharge * 0.10 * 100) / 100;
      const sellerNetAmount = Math.round((netAmountToCharge - commissionAmount) * 100) / 100;

      const journalHeader = DoubleEntryLedgerEngine.createOrderPaymentJournal({
        journalId: PaymentNumberGenerator.generateJournalId(),
        transactionId: savedPayment.id,
        orderId: dto.orderId,
        grossAmount: grossTotalCharge,
        sellerNetAmount,
        commissionAmount,
        taxAmount: tax.taxAmount,
        currency: dto.currency || 'USD',
      });

      await this.repo.postJournalHeader(journalHeader);

      // Credit Seller Wallet Reserved Balance (14-day holdback)
      const sellerWallet = await this.repo.getWalletByEntityId(dto.sellerId || 'merch-01');
      if (sellerWallet) {
        WalletEngine.creditBucket(sellerWallet, 'reservedBalance', sellerNetAmount);
        await this.repo.saveWallet(sellerWallet);
      }
    }

    // 7. Publish Event
    eventBus.publish({
      id: `evt-pay-${Date.now()}`,
      eventType: paymentStatus === 'SUCCESSFUL' ? 'PaymentSucceeded' : 'PaymentFailed',
      domain: 'PAYMENT',
      aggregateId: savedPayment.id,
      timestamp: new Date().toISOString(),
      payload: {
        paymentId: savedPayment.id,
        orderId: dto.orderId,
        amount: savedPayment.amount,
        status: paymentStatus,
        provider: adapter.providerName,
      },
      actor: { type: 'MOCK_USER', id: dto.customerId },
    });

    logger.audit(`[FinancialService] Processed Payment ${savedPayment.id} ($${savedPayment.amount}) - Status: ${paymentStatus}`, 'FinancialService');

    return { payment: savedPayment, fraudEvaluation, tax, coupon: couponResult };
  }

  // Wallet Management
  async getWallet(entityId: string): Promise<EnterpriseWalletAccount> {
    let wallet = await this.repo.getWalletByEntityId(entityId);
    if (!wallet) {
      // Initialize default wallet if not exists
      wallet = {
        id: `wlet-${entityId}`,
        entityId,
        entityType: entityId.startsWith('merch-') ? 'SELLER' : 'BUYER',
        ownerName: entityId.startsWith('merch-') ? `Verified Merchant (${entityId})` : `Registered Buyer (${entityId})`,
        balances: {
          availableBalance: entityId.startsWith('merch-') ? 10000.0 : 500.0,
          pendingBalance: 0.0,
          reservedBalance: 0.0,
          rewardBalance: 25.0,
          promotionalCredits: 10.0,
          totalBalance: entityId.startsWith('merch-') ? 10000.0 : 535.0,
          currency: 'USD',
        },
        isFrozen: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await this.repo.saveWallet(wallet);
    }
    return wallet;
  }

  async topUpWallet(entityId: string, amount: number): Promise<EnterpriseWalletAccount> {
    const wallet = await this.getWallet(entityId);
    WalletEngine.creditBucket(wallet, 'availableBalance', amount);
    await this.repo.saveWallet(wallet);
    
    // Post Double Entry Journal for TopUp
    const journalHeader: LedgerJournalHeader = {
      journalId: PaymentNumberGenerator.generateJournalId(),
      transactionId: `topup-${Date.now()}`,
      referenceId: entityId,
      eventType: 'WALLET_TOPUP',
      timestamp: new Date().toISOString(),
      isBalanced: true,
      postedBy: 'CUSTOMER_SELF_TOPUP',
      lines: [
        {
          id: `line-topup-1`,
          accountCode: '1000_GATEWAY_CLEARING',
          accountName: 'Gateway Clearing Account',
          direction: 'DEBIT',
          amount,
          currency: 'USD',
          memo: `Wallet top-up for ${wallet.ownerName}`,
        },
        {
          id: `line-topup-2`,
          accountCode: '2000_BUYER_WALLET_LIABILITY',
          accountName: 'Buyer Wallet Liability Account',
          direction: 'CREDIT',
          amount,
          currency: 'USD',
          memo: `Credit customer available wallet balance for ${wallet.ownerName}`,
        },
      ],
    };
    await this.repo.postJournalHeader(journalHeader);

    logger.audit(`[FinancialService] Wallet ${wallet.id} topped up by $${amount}.`, 'FinancialService');
    return wallet;
  }

  // Double-Entry Ledger Verification
  async verifyLedgerIntegrity() {
    return this.repo.verifyLedgerIntegrity();
  }

  async getAllLedgerJournals(filter?: FinancialSearchFilter) {
    return this.repo.findAllJournalHeaders(filter);
  }

  // Payouts & Settlements
  async requestSellerPayout(sellerId: string, amount: number, payoutMethod: 'BANK_TRANSFER' | 'PAYPAL' | 'STRIPE_EXPRESS' | 'CRYPTO', accountDetails: string): Promise<EnterpriseWithdrawalRequest> {
    const sellerWallet = await this.getWallet(sellerId);
    const payoutReq = SellerSettlementEngine.createPayoutRequest(sellerWallet, amount, payoutMethod, accountDetails);
    await this.repo.saveWallet(sellerWallet);
    return this.repo.savePayoutRequest(payoutReq);
  }

  async approveSellerPayout(payoutId: string, adminName: string = 'Financial Admin'): Promise<EnterpriseWithdrawalRequest> {
    const payouts = await this.repo.findAllPayoutRequests();
    const req = payouts.find((p) => p.id === payoutId);
    if (!req) throw new Error(`Payout request ${payoutId} not found.`);

    const sellerWallet = await this.getWallet(req.sellerId);
    SellerSettlementEngine.approvePayout(req, sellerWallet, adminName);

    await this.repo.saveWallet(sellerWallet);
    await this.repo.savePayoutRequest(req);

    // Post Double Entry Ledger Journal for Payout
    const journalHeader: LedgerJournalHeader = {
      journalId: PaymentNumberGenerator.generateJournalId(),
      transactionId: req.id,
      referenceId: req.sellerId,
      eventType: 'SELLER_PAYOUT_EXECUTED',
      timestamp: new Date().toISOString(),
      isBalanced: true,
      postedBy: adminName,
      lines: [
        {
          id: `line-po-1`,
          accountCode: '2200_SELLER_WITHDRAWABLE_PAYABLE',
          accountName: 'Seller Payable Account',
          direction: 'DEBIT',
          amount: req.amount,
          currency: 'USD',
          memo: `Debit seller withdrawable balance for payout ${req.id}`,
        },
        {
          id: `line-po-2`,
          accountCode: '1000_GATEWAY_CLEARING',
          accountName: 'Gateway Clearing Account',
          direction: 'CREDIT',
          amount: req.amount,
          currency: 'USD',
          memo: `Bank wire disbursement to ${req.sellerName} (${req.accountDetails})`,
        },
      ],
    };

    await this.repo.postJournalHeader(journalHeader);

    return req;
  }

  async getAllPayouts() {
    return this.repo.findAllPayoutRequests();
  }

  // Refunds
  async processRefund(payload: { paymentId: string; amount: number; reason: string }): Promise<RefundRecord> {
    const payment = await this.repo.findPaymentById(payload.paymentId);
    if (!payment) throw new Error(`Payment ${payload.paymentId} not found.`);

    const adapter = PaymentGatewayFactory.getAdapter(payment.gatewayProvider);
    const gatewayRef = await adapter.refundPayment(payment.id, payload.amount, payload.reason);

    payment.status = payload.amount >= payment.amount ? 'REFUNDED' : 'PARTIALLY_REFUNDED';
    await this.repo.savePayment(payment);

    const refundRecord: RefundRecord = {
      id: `ref-${Date.now()}`,
      transactionId: payment.id,
      orderId: payment.orderId,
      sellerId: payment.sellerId || 'merch-01',
      buyerId: payment.customerId,
      amount: payload.amount,
      reason: 'BUYER_RETURN',
      wasLocked: true,
      createdAt: new Date().toISOString(),
      refundTxId: gatewayRef.providerTransactionId,
    };

    await this.repo.saveRefund(refundRecord);

    // Post Reversal Ledger Journal
    const reversalJournal = DoubleEntryLedgerEngine.createRefundReversalJournal({
      journalId: PaymentNumberGenerator.generateJournalId(),
      transactionId: payment.id,
      orderId: payment.orderId,
      refundAmount: payload.amount,
      sellerRefundShare: Math.round(payload.amount * 0.90 * 100) / 100,
      commissionRefundShare: Math.round(payload.amount * 0.10 * 100) / 100,
      currency: payment.currency,
    });

    await this.repo.postJournalHeader(reversalJournal);

    return refundRecord;
  }

  async getAllRefunds() {
    return this.repo.findAllRefunds();
  }

  // Financial Reports Aggregation
  async getFinancialReportsSummary() {
    const allPayments = await this.repo.findAllPayments();
    const allWallets = await this.repo.findAllWallets();
    const allPayouts = await this.repo.findAllPayoutRequests();
    const allRefunds = await this.repo.findAllRefunds();
    const ledgerIntegrity = await this.repo.verifyLedgerIntegrity();

    let grossVolume = 0;
    let successfulCount = 0;
    let failedCount = 0;

    allPayments.forEach((p) => {
      if (p.status === 'SUCCESSFUL') {
        grossVolume += p.amount;
        successfulCount++;
      } else if (p.status === 'FAILED') {
        failedCount++;
      }
    });

    let totalCustomerWallets = 0;
    let totalSellerWallets = 0;

    allWallets.forEach((w) => {
      if (w.entityType === 'BUYER') totalCustomerWallets += w.balances.availableBalance;
      if (w.entityType === 'SELLER') totalSellerWallets += w.balances.totalBalance;
    });

    return {
      grossVolume: Math.round(grossVolume * 100) / 100,
      totalPaymentsProcessed: allPayments.length,
      successfulCount,
      failedCount,
      successRatePct: allPayments.length > 0 ? Math.round((successfulCount / allPayments.length) * 100) : 100,
      totalCustomerWalletsBalance: Math.round(totalCustomerWallets * 100) / 100,
      totalSellerWalletsBalance: Math.round(totalSellerWallets * 100) / 100,
      totalPayoutsDisbursed: allPayouts.filter((p) => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0),
      totalRefundsProcessed: allRefunds.reduce((sum, r) => sum + r.amount, 0),
      ledgerIntegrity,
    };
  }
}

export const financialService = new FinancialService();
