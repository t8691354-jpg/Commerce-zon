# Commerce Zon Enterprise Financial Architecture (Part 8 Specification)

## System Overview
The Commerce Zon Financial Platform is an enterprise-grade, domain-driven financial system built to support multi-party payments, seller payouts, multi-bucket wallets, immutable double-entry ledger accounting, automated refunds, promotional discounts, sentinel fraud guard, regional tax compliance, and multi-currency formatting.

---

## 1. Domain Architecture & Key Entities

### Payment Entity (`PaymentEntity`)
- Unique Identifier format: `pay-YYYYMMDD-XXXX`
- Payment States: `PENDING`, `AUTHORIZED`, `PROCESSING`, `SUCCESSFUL`, `FAILED`, `CANCELLED`, `REFUNDED`, `PARTIALLY_REFUNDED`, `EXPIRED`.
- Supports idempotency keys, fraud risk scores, and detailed audit history attempts.

### Provider Gateway Abstraction (`IPaymentGatewayAdapter`)
- Provider-independent payment layer isolating business logic from external processors.
- Adapters implemented:
  - `CommerceZonPayAdapter`: Zero-fee native internal wallet engine.
  - `StripeGatewayAdapter`: Global credit card processing.
  - `PayPalGatewayAdapter`: Digital checkout and wallet platform.
  - Factory pattern (`PaymentGatewayFactory`) enables seamless switching and dynamic adapter registration.

---

## 2. Multi-Bucket Wallet Architecture (`WalletEngine`)
Every entity (Buyer, Seller, Affiliate, Platform Treasury) operates an isolated multi-bucket wallet:

1. **Available Balance**: Unrestricted withdrawable / spendable liquid funds.
2. **Pending Balance**: Inbound clearing funds or payout requests processing.
3. **Reserved Balance**: 14-day holdback escrow buffer for dispute & return protection.
4. **Reward Balance**: Cashback rewards earned from store promotions.
5. **Promotional Credits**: Non-withdrawable gift vouchers and platform credits.
6. **Total Balance**: Sum total across all buckets.

---

## 3. Double-Entry Accounting Ledger (`DoubleEntryLedgerEngine`)
- **Immutable Rule**: Past ledger journal lines are strictly immutable and can never be modified or deleted.
- **Balanced Journal Invariant**: $\sum \text{Debits} = \sum \text{Credits}$.
- **Chart of Accounts**:
  - `1000_GATEWAY_CLEARING`: Asset account for inbound clearing funds.
  - `1100_PLATFORM_ESCROW`: Asset account for platform escrow custody.
  - `2000_BUYER_WALLET_LIABILITY`: Liability account for customer wallet balances.
  - `2100_SELLER_UNSETTLED_EARNINGS`: Liability account for seller holdbacks.
  - `2200_SELLER_WITHDRAWABLE_PAYABLE`: Liability account for seller payout balances.
  - `4000_MARKETPLACE_COMMISSION_REVENUE`: Revenue account for marketplace commissions.
  - `5000_TAX_PAYABLE_RESERVE`: Liability account for tax remittance.

---

## 4. Financial Refund & Reversal Engine
- Supports full and partial refunds.
- Automatically posts a **Double-Entry Reversal Journal Header** balancing debit and credit shares between seller holdbacks, platform commission revenue, and gateway clearing.

---

## 5. Seller Settlements & Payout Workflow (`SellerSettlementEngine`)
- **14-Day Holdback Release**: Automated cron job transitions holdback funds from `reservedBalance` to `availableBalance` upon return window expiry.
- **Payout Disbursement**: Seller requests payout $\rightarrow$ funds move from `availableBalance` to `pendingBalance` $\rightarrow$ Admin approves payout $\rightarrow$ funds disbursed via bank transfer $\rightarrow$ `pendingBalance` debited.

---

## 6. Sentinel Fraud Guard (`FinancialFraudEngine`)
- **Velocity Checks**: Flag rapid sequential attempts within 15s.
- **Duplicate Charge Guard**: Detect identical transaction payloads within 60s.
- **Cross-Border Mismatch**: Detect shipping vs billing country discrepancy.
- **Risk Score Scale**: 0–100 with automated `ALLOW`, `REVIEW`, or `BLOCK` recommendations.

---

## 7. Tax & Multi-Currency Engine (`TaxAndCurrencyEngine`)
- **Regional Rules**: Automated calculation for US Sales Tax (State-specific), EU/UK VAT (20%), Canada HST/GST (13%), and India GST (18%).
- **Multi-Currency**: ISO 4217 Currency conversion and formatting for USD, EUR, GBP, CAD, JPY, PKR, INR.
