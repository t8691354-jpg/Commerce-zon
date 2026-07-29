import React, { useState } from 'react';
import { WalletState, WalletTransaction, WalletCard, WithdrawalRequest } from '../types/domain';
import {
  WalletLedgerEntry,
  HoldPeriodRecord,
  CommissionRule,
  WebhookLog,
  WebhookEventType,
  PaymentArchitectureSettings,
} from '../types/paymentWalletArchitecture';
import { WalletManagerService, INITIAL_COMMISSION_RULES, DEFAULT_WALLET_SETTINGS } from '../services/payment/WalletManagerService';
import { WebhookService } from '../services/payment/WebhookService';

import { BuyerWalletPanel } from './wallet/BuyerWalletPanel';
import { SellerWalletPanel } from './wallet/SellerWalletPanel';
import { AffiliateWalletPanel } from './wallet/AffiliateWalletPanel';
import { AdminWalletPanel } from './wallet/AdminWalletPanel';
import { StatementsAndAnalyticsPanel } from './wallet/StatementsAndAnalyticsPanel';
import { SecurityAndCurrencyPanel } from './wallet/SecurityAndCurrencyPanel';
import { HoldbackEscrowPanel } from './wallet/HoldbackEscrowPanel';
import { DoubleEntryLedgerPanel } from './wallet/DoubleEntryLedgerPanel';
import { CommissionEnginePanel } from './wallet/CommissionEnginePanel';
import { WebhookSimulatorPanel } from './wallet/WebhookSimulatorPanel';

import {
  Wallet,
  Store,
  Users,
  Building,
  BarChart3,
  ShieldCheck,
  Bell,
  Lock,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Filter,
  DollarSign,
  Info,
  Layers,
  Zap,
  Percent,
  FileText,
  X,
  RefreshCw,
} from 'lucide-react';

interface CommerceZoneWalletViewProps {
  wallet: WalletState;
  onTopUp: (amount: number, description: string) => void;
  onAddCard: (card: WalletCard) => void;
  onRedeemGiftCard: (code: string) => boolean;
  onToggleAutoPay: () => void;
  onRequestWithdrawal: (req: Partial<WithdrawalRequest>) => void;
  onApproveWithdrawal: (id: string) => void;
  onRejectWithdrawal: (id: string, note?: string) => void;
  onFreezeWalletToggle: () => void;
  onManualAdjustment: (type: 'CREDIT' | 'DEBIT', amount: number, note: string) => void;
  onConvertPoints: (points: number) => void;
}

export const CommerceZoneWalletView: React.FC<CommerceZoneWalletViewProps> = ({
  wallet,
  onTopUp,
  onAddCard,
  onRedeemGiftCard,
  onToggleAutoPay,
  onRequestWithdrawal,
  onApproveWithdrawal,
  onRejectWithdrawal,
  onFreezeWalletToggle,
  onManualAdjustment,
  onConvertPoints,
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'BUYER'
    | 'SELLER'
    | 'HOLDBACK_ESCROW'
    | 'DOUBLE_ENTRY_LEDGER'
    | 'COMMISSION_ENGINE'
    | 'WEBHOOK_SIMULATOR'
    | 'ADMIN'
    | 'AFFILIATE'
    | 'STATEMENTS'
    | 'SECURITY'
  >('SELLER');

  const [activeTxFilter, setActiveTxFilter] = useState<string>('ALL');
  const [selectedTxDetail, setSelectedTxDetail] = useState<WalletTransaction | null>(null);

  // Multi-Currency State
  const [activeCurrency, setActiveCurrency] = useState<'USD' | 'EUR' | 'PKR' | 'GBP' | 'JPY' | 'INR'>('USD');
  const [pinProtected, setPinProtected] = useState<boolean>(wallet.pinProtected ?? true);
  const [showNotifications, setShowNotifications] = useState(false);

  // Enterprise Wallet Engine Service
  const [walletService] = useState(() => new WalletManagerService());
  const [lockPeriodDays, setLockPeriodDays] = useState<number>(14);
  const [commissionRules, setCommissionRules] = useState<CommissionRule[]>(INITIAL_COMMISSION_RULES);

  // 14-Day Holdback Records State
  const [holds, setHolds] = useState<HoldPeriodRecord[]>([
    {
      id: 'hold_8801',
      orderId: 'ORD-2026-07-8801',
      sellerId: 'merch-01',
      amount: 14500.00,
      commissionAmount: 652.75,
      netSellerAmount: 13847.25,
      currency: 'USD',
      lockedAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
      unlocksAt: new Date(Date.now() + 10 * 24 * 3600 * 1000).toISOString(),
      holdPeriodDays: 14,
      status: 'LOCKED',
    },
    {
      id: 'hold_7704',
      orderId: 'ORD-2026-07-7704',
      sellerId: 'merch-02',
      amount: 4200.00,
      commissionAmount: 315.30,
      netSellerAmount: 3884.70,
      currency: 'USD',
      lockedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      unlocksAt: new Date(Date.now() + 12 * 24 * 3600 * 1000).toISOString(),
      holdPeriodDays: 14,
      status: 'LOCKED',
    },
    {
      id: 'hold_6601',
      orderId: 'ORD-2026-07-6601',
      sellerId: 'merch-02',
      amount: 1250.00,
      commissionAmount: 94.05,
      netSellerAmount: 1155.95,
      currency: 'USD',
      lockedAt: new Date(Date.now() - 16 * 24 * 3600 * 1000).toISOString(),
      unlocksAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      holdPeriodDays: 14,
      status: 'UNLOCKED',
      unlockedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    },
  ]);

  // Double-Entry Ledger Entries State
  const [ledgerEntries, setLedgerEntries] = useState<WalletLedgerEntry[]>([
    {
      id: 'ledg_1001',
      transactionId: 'tx_8801',
      timestamp: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
      entityType: 'SELLER',
      entityId: 'merch-01',
      type: 'ORDER_PAID',
      direction: 'CREDIT',
      amount: 13847.25,
      currency: 'USD',
      toBucket: 'LOCKED',
      balanceBefore: 0,
      balanceAfter: 13847.25,
      orderId: 'ORD-2026-07-8801',
      description: 'Order ORD-2026-07-8801 payment held in 14-day buyer protection escrow',
    },
    {
      id: 'ledg_1002',
      transactionId: 'tx_8801',
      timestamp: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
      entityType: 'ADMIN',
      entityId: 'admin-treasury',
      type: 'COMMISSION_DEDUCTED',
      direction: 'CREDIT',
      amount: 652.75,
      currency: 'USD',
      toBucket: 'TREASURY',
      balanceBefore: 33487.25,
      balanceAfter: 34140.00,
      orderId: 'ORD-2026-07-8801',
      description: 'Platform commission collected via Apex Robotics Preferred Vendor Tier (4.5%)',
    },
    {
      id: 'ledg_1003',
      transactionId: 'tx_unlock_6601',
      timestamp: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      entityType: 'SELLER',
      entityId: 'merch-02',
      type: 'WALLET_UNLOCKED',
      direction: 'TRANSFER',
      amount: 1155.95,
      currency: 'USD',
      fromBucket: 'LOCKED',
      toBucket: 'AVAILABLE',
      balanceBefore: 13694.05,
      balanceAfter: 14850.00,
      orderId: 'ORD-2026-07-6601',
      description: '14-day hold expired. Order ORD-2026-07-6601 net funds released to Available Balance.',
    },
  ]);

  // Webhook Logs State
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>(() => WebhookService.getLogs());

  // Currency Rates Matrix
  const CURRENCY_RATES: Record<string, { rate: number; symbol: string; name: string }> = {
    USD: { rate: 1.0, symbol: '$', name: 'US Dollar' },
    PKR: { rate: 278.5, symbol: 'Rs', name: 'Pakistani Rupee' },
    EUR: { rate: 0.92, symbol: '€', name: 'Euro' },
    GBP: { rate: 0.78, symbol: '£', name: 'British Pound' },
    JPY: { rate: 154.2, symbol: '¥', name: 'Japanese Yen' },
    INR: { rate: 83.4, symbol: '₹', name: 'Indian Rupee' },
  };

  const currentRate = CURRENCY_RATES[activeCurrency].rate;
  const currentSymbol = CURRENCY_RATES[activeCurrency].symbol;
  const unreadNotifCount = wallet.notifications?.filter((n) => !n.read).length || 0;

  const filteredTransactions = wallet.transactions.filter((tx) => {
    if (activeTxFilter === 'ALL') return true;
    return tx.type === activeTxFilter;
  });

  // Action Handlers for Escrow & Webhooks
  const handleTriggerAutoRelease = () => {
    const res = walletService.processHoldUnlocks(holds, wallet);
    if (res.unlockedCount > 0) {
      setHolds(res.updatedHolds);
      setLedgerEntries((prev) => [...res.newLedgerEntries, ...prev]);
    }
  };

  const handleForceUnlockOrder = (orderId: string) => {
    const res = walletService.processHoldUnlocks(holds, wallet, orderId);
    if (res.unlockedCount > 0) {
      setHolds(res.updatedHolds);
      setLedgerEntries((prev) => [...res.newLedgerEntries, ...prev]);
    }
  };

  const handleIssueRefund = (orderId: string, sellerId: string, amount: number) => {
    const res = walletService.processRefund(
      {
        transactionId: `tx_ref_${orderId}`,
        orderId,
        sellerId,
        buyerId: 'usr-buyer-01',
        amount,
        reason: 'BUYER_RETURN',
      },
      wallet,
      holds
    );

    setHolds(res.updatedHolds);
    setLedgerEntries((prev) => [...res.newLedgerEntries, ...prev]);
  };

  const handleTriggerWebhook = (eventType: WebhookEventType, payload?: any) => {
    const log = WebhookService.simulateWebhook(eventType, payload);
    setWebhookLogs([log, ...webhookLogs]);
  };

  const handleAddCommissionRule = (rule: Omit<CommissionRule, 'id' | 'updatedAt'>) => {
    const newRule: CommissionRule = {
      ...rule,
      id: `rule_${Math.random().toString(36).substring(2, 9)}`,
      updatedAt: new Date().toISOString(),
    };
    setCommissionRules((prev) => [newRule, ...prev]);
  };

  const handleToggleCommissionRule = (id: string) => {
    setCommissionRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r))
    );
  };

  return (
    <div className="space-y-6 font-sans text-slate-100">
      {/* Top Header Banner & Navigation Tabs */}
      <div className="bg-[#131921] border border-[#37475a] rounded-2xl p-6 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3.5 bg-gradient-to-br from-[#febd69] to-amber-500 text-slate-950 rounded-2xl font-black shadow-lg">
              <Wallet className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-[#febd69] uppercase tracking-wider">Enterprise Commerce Zone Pay</span>
                <span className="text-slate-600">•</span>
                <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-0.5 rounded-full font-bold flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>256-Bit Double-Entry Engine</span>
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Enterprise Multi-Role Wallet & Escrow Architecture
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Unified 14-day holdback escrow, adapter-based payment gateway, and double-entry ledger.
              </p>
            </div>
          </div>

          {/* Quick Notification Bell & Active Currency Selector */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl transition cursor-pointer"
              title="Real-time Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#131921]">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {/* Currency Pill */}
            <div className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-emerald-400 flex items-center space-x-1.5">
              <span>{activeCurrency} ({currentSymbol})</span>
            </div>
          </div>
        </div>

        {/* 10 Sub-Tab Navigation Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-2 border-t border-slate-800">
          {[
            { id: 'SELLER', label: 'Seller Wallet', icon: Store, color: 'text-emerald-400' },
            { id: 'HOLDBACK_ESCROW', label: '14-Day Escrow', icon: Lock, color: 'text-sky-400' },
            { id: 'DOUBLE_ENTRY_LEDGER', label: 'Ledger Audit', icon: FileText, color: 'text-amber-400' },
            { id: 'COMMISSION_ENGINE', label: 'Commission Engine', icon: Percent, color: 'text-teal-400' },
            { id: 'WEBHOOK_SIMULATOR', label: 'Webhook Engine', icon: Zap, color: 'text-purple-400' },
            { id: 'ADMIN', label: 'Admin Treasury', icon: Building, color: 'text-yellow-400' },
            { id: 'BUYER', label: 'Buyer Wallet', icon: Wallet, color: 'text-[#febd69]' },
            { id: 'AFFILIATE', label: 'Affiliate Wallet', icon: Users, color: 'text-purple-400' },
            { id: 'STATEMENTS', label: 'Analytics', icon: BarChart3, color: 'text-sky-400' },
            { id: 'SECURITY', label: 'Security & Rates', icon: ShieldCheck, color: 'text-emerald-400' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition flex items-center space-x-2 border cursor-pointer ${
                  isActive
                    ? 'bg-[#232f3e] border-[#febd69] text-white shadow-lg'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${tab.color}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Panels */}
      {activeTab === 'SELLER' && (
        <SellerWalletPanel
          seller={wallet.sellerWallet}
          onRequestWithdrawal={onRequestWithdrawal}
          currencyRate={currentRate}
          currencySymbol={currentSymbol}
        />
      )}

      {activeTab === 'HOLDBACK_ESCROW' && (
        <HoldbackEscrowPanel
          holds={holds}
          lockPeriodDays={lockPeriodDays}
          onUpdateLockPeriodDays={setLockPeriodDays}
          onTriggerAutoRelease={handleTriggerAutoRelease}
          onForceUnlockOrder={handleForceUnlockOrder}
          onIssueRefund={handleIssueRefund}
          currencySymbol={currentSymbol}
          currencyRate={currentRate}
        />
      )}

      {activeTab === 'DOUBLE_ENTRY_LEDGER' && (
        <DoubleEntryLedgerPanel
          entries={ledgerEntries}
          currencySymbol={currentSymbol}
          currencyRate={currentRate}
        />
      )}

      {activeTab === 'COMMISSION_ENGINE' && (
        <CommissionEnginePanel
          rules={commissionRules}
          onAddRule={handleAddCommissionRule}
          onToggleRule={handleToggleCommissionRule}
          currencySymbol={currentSymbol}
          currencyRate={currentRate}
        />
      )}

      {activeTab === 'WEBHOOK_SIMULATOR' && (
        <WebhookSimulatorPanel
          onTriggerWebhook={handleTriggerWebhook}
          logs={webhookLogs}
        />
      )}

      {activeTab === 'BUYER' && (
        <BuyerWalletPanel
          wallet={wallet}
          onTopUp={onTopUp}
          onAddCard={onAddCard}
          onRedeemGiftCard={onRedeemGiftCard}
          onConvertPoints={onConvertPoints}
          onToggleAutoPay={onToggleAutoPay}
          currencyRate={currentRate}
          currencySymbol={currentSymbol}
        />
      )}

      {activeTab === 'AFFILIATE' && (
        <AffiliateWalletPanel
          affiliate={wallet.affiliateWallet}
          onRequestWithdrawal={onRequestWithdrawal}
          currencyRate={currentRate}
          currencySymbol={currentSymbol}
        />
      )}

      {activeTab === 'ADMIN' && (
        <AdminWalletPanel
          admin={wallet.adminWallet}
          withdrawals={wallet.withdrawals}
          transactions={wallet.transactions}
          onApproveWithdrawal={onApproveWithdrawal}
          onRejectWithdrawal={onRejectWithdrawal}
          onFreezeWalletToggle={onFreezeWalletToggle}
          onManualAdjustment={onManualAdjustment}
          currencyRate={currentRate}
          currencySymbol={currentSymbol}
        />
      )}

      {activeTab === 'STATEMENTS' && (
        <StatementsAndAnalyticsPanel
          wallet={wallet}
          currencyRate={currentRate}
          currencySymbol={currentSymbol}
        />
      )}

      {activeTab === 'SECURITY' && (
        <SecurityAndCurrencyPanel
          wallet={wallet}
          activeCurrency={activeCurrency}
          onCurrencyChange={(curr) => setActiveCurrency(curr)}
          currencyRates={CURRENCY_RATES}
          pinProtected={pinProtected}
          onTogglePinProtection={() => setPinProtected(!pinProtected)}
        />
      )}

      {/* Global Transaction History & Ledger Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-black text-white flex items-center space-x-2">
              <Clock className="w-4 h-4 text-[#febd69]" />
              <span>Unified Real-Time Transaction Ledger & Audit Timeline</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Complete immutable transaction logs with IP addresses, reference numbers & audit notes.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-1">
            {['ALL', 'WALLET_PAYMENT', 'CASHBACK_CREDIT', 'SELLER_SETTLEMENT', 'AFFILIATE_COMMISSION', 'REFUND', 'DEPOSIT', 'WITHDRAWAL'].map((flt) => (
              <button
                key={flt}
                onClick={() => setActiveTxFilter(flt)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono uppercase transition border cursor-pointer ${
                  activeTxFilter === flt
                    ? 'bg-[#febd69] text-slate-950 border-[#febd69]'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                {flt.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[10px] uppercase font-mono">
              <tr>
                <th className="p-3">Tx ID / Date</th>
                <th className="p-3">Wallet / User</th>
                <th className="p-3">Type</th>
                <th className="p-3">Description</th>
                <th className="p-3 text-right">Amount</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {filteredTransactions.map((tx) => {
                const isNegative = tx.amount < 0;
                return (
                  <tr key={tx.id} className="hover:bg-slate-800/60 transition">
                    <td className="p-3 font-mono">
                      <div className="font-bold text-white text-[11px]">{tx.id}</div>
                      <div className="text-[10px] text-slate-500">
                        {new Date(tx.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="p-3 font-mono">
                      <span className="text-[10px] bg-slate-800 text-slate-300 font-bold px-1.5 py-0.5 rounded">
                        {tx.walletType}
                      </span>
                      <div className="text-[11px] font-medium text-slate-300 mt-0.5">{tx.userName}</div>
                    </td>
                    <td className="p-3 font-mono text-[10px] font-bold text-amber-400">
                      {tx.type}
                    </td>
                    <td className="p-3 text-slate-300 max-w-xs truncate">
                      {tx.description}
                    </td>
                    <td className={`p-3 text-right font-mono font-bold text-sm ${isNegative ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {isNegative ? '-' : '+'}{currentSymbol}{(Math.abs(tx.amount) * currentRate).toFixed(2)}
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded text-[10px] font-mono font-bold">
                        {tx.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedTxDetail(tx)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold rounded-lg border border-slate-700 transition cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Detail Inspector Modal */}
      {selectedTxDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Info className="w-4 h-4 text-[#febd69]" />
                <span>Transaction Metadata & Audit Log</span>
              </h3>
              <button onClick={() => setSelectedTxDetail(null)} className="text-slate-400 text-sm cursor-pointer">✕</button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300 font-mono">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Transaction ID:</span>
                <span className="text-white font-bold">{selectedTxDetail.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Wallet Type:</span>
                <span className="text-amber-400 font-bold">{selectedTxDetail.walletType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Amount:</span>
                <span className="text-emerald-400 font-bold">${selectedTxDetail.amount.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Reference Number:</span>
                <span className="text-slate-300">{selectedTxDetail.referenceId || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">IP Address:</span>
                <span className="text-slate-300">{selectedTxDetail.ipAddress || '192.168.1.100'}</span>
              </div>
              <div className="py-1">
                <span className="text-slate-500 block mb-1">Audit Log Note:</span>
                <div className="bg-slate-950 p-2 rounded-lg text-slate-300 border border-slate-800">
                  {selectedTxDetail.auditNote || '256-Bit Cryptographic signature verified.'}
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedTxDetail(null)}
              className="w-full py-2 bg-slate-800 text-white font-bold rounded-xl text-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Notifications Drawer */}
      {showNotifications && (
        <div className="fixed inset-y-0 right-0 z-50 w-80 bg-slate-900 border-l border-slate-800 p-5 shadow-2xl space-y-4 font-sans">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Bell className="w-4 h-4 text-[#febd69]" />
              <span>Real-Time Notifications</span>
            </h3>
            <button onClick={() => setShowNotifications(false)} className="text-slate-400 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[80vh]">
            {wallet.notifications.map((n) => (
              <div key={n.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>{n.title}</span>
                  <span className="text-[9px] text-slate-500 font-mono">
                    {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">{n.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
