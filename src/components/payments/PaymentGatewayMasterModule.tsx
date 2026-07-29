import React, { useState } from 'react';
import { CheckoutMultiStepFlow } from './CheckoutMultiStepFlow';
import { GatewayProviderSettingsView } from './GatewayProviderSettingsView';
import { TransactionLedgerView } from './TransactionLedgerView';
import { SubscriptionBillingEngineView } from './SubscriptionBillingEngineView';
import { CashOnDeliveryEngineView } from './CashOnDeliveryEngineView';
import { RefundsAndChargebacksView } from './RefundsAndChargebacksView';
import { FraudDetectionShieldView } from './FraudDetectionShieldView';
import { TaxAndCurrencyEngineView } from './TaxAndCurrencyEngineView';
import { PaymentNotificationsView } from './PaymentNotificationsView';
import { PaymentReportsAndExportView } from './PaymentReportsAndExportView';
import { TransactionRecord } from '../../types/payments';
import {
  CreditCard,
  Lock,
  DollarSign,
  CalendarClock,
  Banknote,
  RotateCcw,
  ShieldAlert,
  Globe,
  Bell,
  BarChart3,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

interface PaymentGatewayMasterModuleProps {
  walletBalance: number;
  onTopUpWallet?: (amount: number) => void;
  cartItems?: Array<{
    id: string;
    productTitle: string;
    sku: string;
    unitPrice: number;
    quantity: number;
    merchantName: string;
    imageUrl?: string;
  }>;
}

export const PaymentGatewayMasterModule: React.FC<PaymentGatewayMasterModuleProps> = ({
  walletBalance,
  onTopUpWallet,
  cartItems,
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'CHECKOUT'
    | 'GATEWAYS'
    | 'TRANSACTIONS'
    | 'SUBSCRIPTIONS'
    | 'COD_ENGINE'
    | 'REFUNDS_DISPUTES'
    | 'FRAUD_SHIELD'
    | 'TAX_CURRENCY'
    | 'NOTIFICATIONS'
    | 'REPORTS'
  >('CHECKOUT');

  const navItems = [
    { id: 'CHECKOUT', label: '6-Step Checkout Flow', icon: CreditCard },
    { id: 'GATEWAYS', label: 'Gateway Gateways & Fees', icon: Sliders },
    { id: 'TRANSACTIONS', label: 'Transaction Ledger', icon: DollarSign },
    { id: 'SUBSCRIPTIONS', label: 'Subscription Billing', icon: CalendarClock },
    { id: 'COD_ENGINE', label: 'Cash on Delivery (COD)', icon: Banknote },
    { id: 'REFUNDS_DISPUTES', label: 'Refunds & Disputes', icon: RotateCcw },
    { id: 'FRAUD_SHIELD', label: 'Sentinel Fraud Guard', icon: ShieldAlert },
    { id: 'TAX_CURRENCY', label: 'Tax & Multi-Currency', icon: Globe },
    { id: 'NOTIFICATIONS', label: 'Payment Notifications', icon: Bell },
    { id: 'REPORTS', label: 'Financial Reports', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 lg:p-6 space-y-6 font-sans">
      {/* Module 10 Master Header */}
      <div className="bg-[#131921] border border-[#37475a] p-6 rounded-2xl shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-widest">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>MODULE 10: ENTERPRISE PAYMENT GATEWAY & CHECKOUT SYSTEM</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Amazon-Grade Payment Gateway, Multi-Step Checkout & Billing Subsystem
          </h1>
          <p className="text-xs text-slate-400 max-w-3xl">
            256-bit tokenized checkout pipeline, multi-gateway router (Stripe, PayPal, Adyen, Wallet), 3DS 2.0 OTP, recurring seller subscriptions, COD risk rules, Sentinel AI fraud shield & tax compliance engine.
          </p>
        </div>

        <div className="flex items-center space-x-3 font-mono text-xs">
          <div className="bg-[#232f3e] px-4 py-2 rounded-xl border border-[#37475a] text-center">
            <span className="text-slate-400 text-[10px] uppercase block">Wallet Balance</span>
            <span className="text-emerald-400 font-extrabold text-sm">${walletBalance.toFixed(2)} USD</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-[#131921] border border-[#37475a] p-2 rounded-2xl shadow-xl overflow-x-auto flex items-center space-x-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 whitespace-nowrap ${
                isActive
                  ? 'bg-[#febd69] text-slate-950 font-black shadow-lg'
                  : 'text-slate-300 hover:bg-[#232f3e] hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-[#febd69]'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab View Rendering */}
      <div>
        {activeTab === 'CHECKOUT' && (
          <CheckoutMultiStepFlow
            walletBalance={walletBalance}
            onTopUpWallet={onTopUpWallet}
            cartItems={cartItems}
          />
        )}

        {activeTab === 'GATEWAYS' && <GatewayProviderSettingsView />}

        {activeTab === 'TRANSACTIONS' && <TransactionLedgerView />}

        {activeTab === 'SUBSCRIPTIONS' && <SubscriptionBillingEngineView />}

        {activeTab === 'COD_ENGINE' && <CashOnDeliveryEngineView />}

        {activeTab === 'REFUNDS_DISPUTES' && <RefundsAndChargebacksView />}

        {activeTab === 'FRAUD_SHIELD' && <FraudDetectionShieldView />}

        {activeTab === 'TAX_CURRENCY' && <TaxAndCurrencyEngineView />}

        {activeTab === 'NOTIFICATIONS' && <PaymentNotificationsView />}

        {activeTab === 'REPORTS' && <PaymentReportsAndExportView />}
      </div>
    </div>
  );
};
