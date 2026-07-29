import React, { useState, useEffect } from 'react';
import { MarketplaceHeader } from './components/MarketplaceHeader';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductCatalogMasterModule } from './components/catalog/ProductCatalogMasterModule';
import { WarehouseInventoryView } from './components/WarehouseInventoryView';
import { AIServicesPanel } from './components/AIServicesPanel';
import { RoadmapView } from './components/RoadmapView';
import { EventInspectorView } from './components/EventInspectorView';
import { VendorStorePortal } from './components/VendorStorePortal';
import { CommerceZoneWalletView } from './components/CommerceZoneWalletView';
import { CommerceZonOrdersView } from './components/CommerceZonOrdersView';
import { OrderManagementMasterModule } from './components/orders/OrderManagementMasterModule';
import { PaymentGatewayMasterModule } from './components/payments/PaymentGatewayMasterModule';
import { DropshippingMasterModule } from './components/dropshipping/DropshippingMasterModule';
import { FBAMasterModule } from './components/fba/FBAMasterModule';
import { LogisticsMasterModule } from './components/logistics/LogisticsMasterModule';
import { ReturnsMasterModule } from './components/returns/ReturnsMasterModule';
import { SupportMasterModule } from './components/support/SupportMasterModule';
import { NotificationMasterModule } from './components/notifications/NotificationMasterModule';
import { AiEngineMasterModule } from './components/aiEngine/AiEngineMasterModule';
import { BiAnalyticsMasterModule } from './components/biAnalytics/BiAnalyticsMasterModule';
import { SecurityMasterModule } from './components/securityFraud/SecurityMasterModule';
import { SuperAdminMasterModule } from './components/superAdmin/SuperAdminMasterModule';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CommerceZonSettingsModal, CommerceZonRole } from './components/CommerceZonSettingsModal';
import { RolePortalHeaderBar, PortalRole } from './components/common/RolePortalHeaderBar';
import { GlobalCommandPaletteModal } from './components/common/GlobalCommandPaletteModal';
import { UniversalSettingsCenter } from './components/common/UniversalSettingsCenter';
import { UniversalNotificationCenter } from './components/common/UniversalNotificationCenter';
import { UnifiedFileManager } from './components/common/UnifiedFileManager';
import { CentralLogsCenter } from './components/common/CentralLogsCenter';
import { AffiliatePortalView } from './components/portals/AffiliatePortalView';
import { SupplierPortalView } from './components/portals/SupplierPortalView';
import { DeliveryPartnerPortalView } from './components/portals/DeliveryPartnerPortalView';
import { Product, Warehouse, Order, AuditLog, MasterPhase, Merchant, WalletState, WalletCard, WithdrawalRequest } from './types/domain';
import { MOCK_PRODUCTS, MOCK_WAREHOUSES, MOCK_ORDERS, MOCK_AUDIT_LOGS, MOCK_MERCHANTS, INITIAL_WALLET_STATE, MOCK_INDIVIDUAL_SELLER, MOCK_PROFESSIONAL_SELLER, MOCK_PRO_INVOICES } from './data/mockData';
import { MASTER_ROADMAP } from './data/roadmapData';
import { ShoppingBag, X, CheckCircle2, ShieldCheck, Activity, Terminal, Wallet, CreditCard, Sparkles, Zap, Lock } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    | 'catalog'
    | 'vendor'
    | 'warehouses'
    | 'fba'
    | 'ai'
    | 'roadmap'
    | 'events'
    | 'wallet'
    | 'orders'
    | 'admin'
    | 'payments'
    | 'dropshipping'
    | 'logistics'
    | 'returns'
    | 'support'
    | 'notifications'
    | 'ai_engine'
    | 'bi_analytics'
    | 'security_fraud'
    | 'super_admin'
    | 'settings_center'
    | 'file_manager'
    | 'logs_center'
    | 'affiliate'
    | 'supplier'
    | 'delivery'
  >('catalog');

  const [currentPortal, setCurrentPortal] = useState<PortalRole>('buyer');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);


  // Commerce Zon Role & Customization State
  const [currentRole, setCurrentRole] = useState<CommerceZonRole>('BUYER');
  const [deliverLocation, setDeliverLocation] = useState<string>('New York 10001, US');
  const [currency, setCurrency] = useState<string>('USD');
  const [primeMember, setPrimeMember] = useState<boolean>(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Core State
  const [merchants, setMerchants] = useState<Merchant[]>(MOCK_MERCHANTS);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [warehouses, setWarehouses] = useState<Warehouse[]>(MOCK_WAREHOUSES);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);
  const [roadmap, setRoadmap] = useState<MasterPhase[]>(MASTER_ROADMAP);

  // Commerce Zone Pay Wallet State
  const [wallet, setWallet] = useState<WalletState>(INITIAL_WALLET_STATE);

  const [paymentMethod, setPaymentMethod] = useState<'WALLET' | 'CARD'>('WALLET');

  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [serverStatus, setServerStatus] = useState<boolean>(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [aiSearching, setAiSearching] = useState<boolean>(false);
  const [aiExplanation, setAiExplanation] = useState<string>('');

  // Order Placement Modal Feedback
  const [orderSuccess, setOrderSuccess] = useState<{ order: Order; cashback: number; paidByWallet: boolean } | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Initial load from server API if available
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const healthRes = await fetch('/api/health');
        if (healthRes.ok) {
          setServerStatus(true);
        }

        const prodRes = await fetch('/api/products');
        if (prodRes.ok) {
          const data = await prodRes.json();
          if (data.products && data.products.length > 0) {
            setProducts(data.products);
          }
        }

        const whRes = await fetch('/api/warehouses');
        if (whRes.ok) {
          const data = await whRes.json();
          if (data.warehouses) setWarehouses(data.warehouses);
        }

        const auditRes = await fetch('/api/audit-logs');
        if (auditRes.ok) {
          const data = await auditRes.json();
          if (data.auditLogs) setAuditLogs(data.auditLogs);
        }
      } catch (err) {
        console.warn('Backend API connection initializing or dev fallback active:', err);
      }
    };

    fetchInitialData();
  }, []);

  // Filter products locally or via category selection
  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) {
      return false;
    }
    if (searchTerm.trim() && !aiExplanation) {
      const q = searchTerm.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Execute Server-Side AI Semantic Search
  const handleAISearch = async (prompt: string) => {
    setAiSearching(true);
    try {
      const res = await fetch('/api/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.matchedProducts) {
        setProducts(data.matchedProducts);
      }
      if (data.aiExplanation) {
        setAiExplanation(data.aiExplanation);
      }
    } catch (err) {
      console.error('AI search failed', err);
    } finally {
      setAiSearching(false);
    }
  };

  // Add to procurement cart
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  // Wallet Handlers
  const handleTopUpWallet = (amount: number, description: string) => {
    setWallet((prev) => ({
      ...prev,
      balance: prev.balance + amount,
      transactions: [
        {
          id: `tx-${Date.now()}`,
          type: 'TOPUP',
          amount,
          description,
          timestamp: new Date().toISOString(),
          status: 'COMPLETED',
        },
        ...prev.transactions,
      ],
    }));

    const log: AuditLog = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorType: 'MOCK_USER',
      actorId: 'user-1',
      action: 'WALLET_TOPUP',
      domain: 'SECURITY',
      details: `Commerce Zone Pay Wallet topped up with $${amount.toFixed(2)} USD. New balance: $${(wallet.balance + amount).toFixed(2)} USD.`,
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  const handleAddWalletCard = (card: WalletCard) => {
    setWallet((prev) => ({
      ...prev,
      cards: [...prev.cards, card],
    }));
  };

  const handleRedeemGiftCard = (code: string): boolean => {
    if (code.toUpperCase().includes('ZONE') || code.toUpperCase().includes('COMMERCE') || code.length >= 6) {
      handleTopUpWallet(50.00, `Commerce Zon Gift Voucher (${code.toUpperCase()})`);
      return true;
    }
    return false;
  };

  const handleToggleAutoPay = () => {
    setWallet((prev) => ({
      ...prev,
      autoPayEnabled: !prev.autoPayEnabled,
    }));
  };

  const handleRequestWithdrawal = (req: Partial<WithdrawalRequest>) => {
    const newReq: WithdrawalRequest = {
      id: `wth-${Date.now()}`,
      userId: req.userId || 'usr-1',
      userName: req.userName || 'User',
      userRole: req.userRole || 'SELLER',
      amount: req.amount || 100,
      currency: 'USD',
      payoutMethod: req.payoutMethod || 'BANK_TRANSFER',
      accountDetails: req.accountDetails || 'Default Bank Account',
      status: 'PENDING',
      fraudRiskScore: req.fraudRiskScore || 2,
      requestedAt: new Date().toISOString(),
      adminNote: req.adminNote || 'Awaiting admin single-click signature',
    };

    setWallet((prev) => ({
      ...prev,
      withdrawals: [newReq, ...prev.withdrawals],
      sellerWallet:
        req.userRole === 'SELLER'
          ? {
              ...prev.sellerWallet,
              withdrawableBalance: Math.max(0, prev.sellerWallet.withdrawableBalance - (req.amount || 0)),
            }
          : prev.sellerWallet,
      affiliateWallet:
        req.userRole === 'AFFILIATE'
          ? {
              ...prev.affiliateWallet,
              withdrawableBalance: Math.max(0, prev.affiliateWallet.withdrawableBalance - (req.amount || 0)),
            }
          : prev.affiliateWallet,
      notifications: [
        {
          id: `notif-${Date.now()}`,
          title: 'Withdrawal Request Submitted',
          message: `Payout request for $${(req.amount || 0).toFixed(2)} USD submitted for admin review.`,
          type: 'WITHDRAWAL',
          read: false,
          timestamp: new Date().toISOString(),
          amount: req.amount,
        },
        ...prev.notifications,
      ],
    }));
  };

  const handleApproveWithdrawal = (id: string) => {
    setWallet((prev) => {
      const target = prev.withdrawals.find((w) => w.id === id);
      if (!target) return prev;

      const updatedWithdrawals = prev.withdrawals.map((w) =>
        w.id === id ? { ...w, status: 'APPROVED' as const, processedAt: new Date().toISOString() } : w
      );

      const payoutTx = {
        id: `tx-${Date.now()}`,
        userId: target.userId,
        userName: target.userName,
        walletType: (target.userRole === 'SELLER' ? 'SELLER' : target.userRole === 'AFFILIATE' ? 'AFFILIATE' : 'BUYER') as any,
        type: 'WITHDRAWAL' as const,
        amount: -target.amount,
        currency: 'USD' as const,
        description: `Approved Payout via ${target.payoutMethod} (${target.accountDetails})`,
        timestamp: new Date().toISOString(),
        status: 'COMPLETED' as const,
        referenceId: `WTH-APPROVED-${id}`,
      };

      return {
        ...prev,
        withdrawals: updatedWithdrawals,
        transactions: [payoutTx, ...prev.transactions],
        notifications: [
          {
            id: `notif-${Date.now()}`,
            title: 'Withdrawal Approved & Paid',
            message: `Payout #${id} for $${target.amount.toFixed(2)} USD released to ${target.accountDetails}.`,
            type: 'WITHDRAWAL',
            read: false,
            timestamp: new Date().toISOString(),
            amount: target.amount,
          },
          ...prev.notifications,
        ],
      };
    });
  };

  const handleRejectWithdrawal = (id: string, note?: string) => {
    setWallet((prev) => {
      const target = prev.withdrawals.find((w) => w.id === id);
      if (!target) return prev;

      const updatedWithdrawals = prev.withdrawals.map((w) =>
        w.id === id ? { ...w, status: 'REJECTED' as const, adminNote: note || 'Rejected by Admin Security' } : w
      );

      return {
        ...prev,
        withdrawals: updatedWithdrawals,
        sellerWallet:
          target.userRole === 'SELLER'
            ? { ...prev.sellerWallet, withdrawableBalance: prev.sellerWallet.withdrawableBalance + target.amount }
            : prev.sellerWallet,
        affiliateWallet:
          target.userRole === 'AFFILIATE'
            ? { ...prev.affiliateWallet, withdrawableBalance: prev.affiliateWallet.withdrawableBalance + target.amount }
            : prev.affiliateWallet,
        notifications: [
          {
            id: `notif-${Date.now()}`,
            title: 'Withdrawal Rejected',
            message: `Withdrawal request #${id} was rejected. Funds restored to withdrawable balance.`,
            type: 'WITHDRAWAL',
            read: false,
            timestamp: new Date().toISOString(),
          },
          ...prev.notifications,
        ],
      };
    });
  };

  const handleFreezeWalletToggle = () => {
    setWallet((prev) => ({
      ...prev,
      adminWallet: {
        ...prev.adminWallet,
        frozenWalletsCount: prev.adminWallet.frozenWalletsCount === 0 ? 1 : 0,
      },
      buyerWallet: {
        ...prev.buyerWallet,
        isFrozen: !prev.buyerWallet.isFrozen,
      },
    }));
  };

  const handleManualAdjustment = (type: 'CREDIT' | 'DEBIT', amount: number, note: string) => {
    const adjAmt = type === 'CREDIT' ? amount : -amount;
    setWallet((prev) => ({
      ...prev,
      balance: Math.max(0, prev.balance + adjAmt),
      buyerWallet: {
        ...prev.buyerWallet,
        walletBalance: Math.max(0, prev.buyerWallet.walletBalance + adjAmt),
      },
      transactions: [
        {
          id: `tx-${Date.now()}`,
          userId: 'usr-mock-enterprise-01',
          userName: 'AeroSpace Global Procurement',
          walletType: 'BUYER',
          type: 'MANUAL_ADJUSTMENT',
          amount: adjAmt,
          currency: 'USD',
          description: `Admin Manual Ledger ${type}: ${note}`,
          timestamp: new Date().toISOString(),
          status: 'COMPLETED',
          referenceId: `ADJ-${Date.now()}`,
          auditNote: note,
        },
        ...prev.transactions,
      ],
    }));
  };

  const handleConvertPoints = (pointsToConvert: number) => {
    const cashCredit = pointsToConvert / 100;
    setWallet((prev) => ({
      ...prev,
      balance: prev.balance + cashCredit,
      buyerWallet: {
        ...prev.buyerWallet,
        walletBalance: prev.buyerWallet.walletBalance + cashCredit,
        rewardPoints: Math.max(0, prev.buyerWallet.rewardPoints - pointsToConvert),
        rewardBalance: prev.buyerWallet.rewardBalance + cashCredit,
      },
      transactions: [
        {
          id: `tx-${Date.now()}`,
          userId: 'usr-mock-enterprise-01',
          userName: 'AeroSpace Global Procurement',
          walletType: 'BUYER',
          type: 'REWARD_CREDIT',
          amount: cashCredit,
          currency: 'USD',
          description: `Converted ${pointsToConvert} Reward Points to $${cashCredit.toFixed(2)} Wallet Cash`,
          timestamp: new Date().toISOString(),
          status: 'COMPLETED',
          referenceId: `PTS-CONV-${Date.now()}`,
        },
        ...prev.transactions,
      ],
    }));
  };

  // Submit Order & Process Payment with Commerce Zone Pay
  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setCheckoutError(null);

    const subtotal = cart.reduce((sum, item) => sum + item.product.price.amount * item.quantity, 0);
    const estimatedTotal = Math.round((subtotal * 1.08) * 100) / 100;

    // Check balance if paying via Commerce Zone Pay Wallet
    if (paymentMethod === 'WALLET' && wallet.balance < estimatedTotal) {
      setCheckoutError(`Insufficient Commerce Zone Wallet Balance ($${wallet.balance.toFixed(2)} USD). Top up your wallet or switch payment method.`);
      return;
    }

    const payload = {
      items: cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
      customerName: 'Alexander Vance (Commerce Zone Member)',
      customerEmail: 'alexander@commercezone.mock',
      paymentMethod: paymentMethod === 'WALLET' ? 'COMMERCE_ZONE_PAY_WALLET' : 'CREDIT_CARD',
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        const createdOrder: Order = data.order;

        // Process Wallet Payment & Cashback Rewards
        let cashbackEarnedOnOrder = 0;
        if (paymentMethod === 'WALLET') {
          cashbackEarnedOnOrder = Math.round(createdOrder.total.amount * 0.02 * 100) / 100;

          setWallet((prev) => ({
            ...prev,
            balance: prev.balance - createdOrder.total.amount + cashbackEarnedOnOrder,
            cashbackEarned: prev.cashbackEarned + cashbackEarnedOnOrder,
            transactions: [
              {
                id: `tx-${Date.now()}-c`,
                type: 'CASHBACK',
                amount: cashbackEarnedOnOrder,
                description: `2% Cashback Reward for Order ${createdOrder.orderNumber}`,
                timestamp: new Date().toISOString(),
                status: 'COMPLETED',
              },
              {
                id: `tx-${Date.now()}`,
                type: 'PURCHASE',
                amount: createdOrder.total.amount,
                description: `Payment for Order ${createdOrder.orderNumber} via Commerce Zone Pay`,
                timestamp: new Date().toISOString(),
                status: 'COMPLETED',
              },
              ...prev.transactions,
            ],
          }));
        }

        setOrderSuccess({
          order: createdOrder,
          cashback: cashbackEarnedOnOrder,
          paidByWallet: paymentMethod === 'WALLET',
        });

        setOrders((prev) => [createdOrder, ...prev]);
        setCart([]);
        setIsCartOpen(false);

        // Refresh products to reflect inventory updates
        const prodRes = await fetch('/api/products');
        if (prodRes.ok) {
          const pData = await prodRes.json();
          setProducts(pData.products);
        }
      }
    } catch (err) {
      console.error('Order checkout error:', err);
      setCheckoutError('Failed to process checkout. Please try again.');
    }
  };

  const handleAddMerchant = (newMerchant: Merchant) => {
    setMerchants((prev) => [newMerchant, ...prev]);
    const log: AuditLog = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorType: 'MOCK_MERCHANT',
      actorId: newMerchant.id,
      action: 'MERCHANT_STORE_CREATED',
      domain: 'SECURITY',
      details: `New Commerce Zone Vendor Store registered: "${newMerchant.name}" (Code: ${newMerchant.code}).`,
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    const log: AuditLog = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorType: 'MOCK_MERCHANT',
      actorId: newProduct.merchant.id,
      action: 'PRODUCT_LISTED',
      domain: 'INVENTORY',
      details: `Vendor "${newProduct.merchant.name}" listed product "${newProduct.title}" ($${newProduct.price.amount}) with ${newProduct.totalStock} units on Commerce Zone.`,
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  const handleSelectPortal = (portal: PortalRole) => {
    setCurrentPortal(portal);
    switch (portal) {
      case 'buyer': setActiveTab('catalog'); break;
      case 'seller': setActiveTab('vendor'); break;
      case 'affiliate': setActiveTab('affiliate'); break;
      case 'supplier': setActiveTab('supplier'); break;
      case 'warehouse': setActiveTab('warehouses'); break;
      case 'delivery': setActiveTab('delivery'); break;
      case 'support': setActiveTab('support'); break;
      case 'finance': setActiveTab('wallet'); break;
      case 'super_admin': setActiveTab('super_admin'); break;
    }
  };

  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.product.price.amount * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-[#febd69] selection:text-slate-950">
      {/* Top Enterprise Role Portal Header Strip */}
      <RolePortalHeaderBar
        currentPortal={currentPortal}
        onSelectPortal={handleSelectPortal}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onNavigateTab={setActiveTab}
        activeTab={activeTab}
      />

      {/* Header Bar */}
      <MarketplaceHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        serverStatus={serverStatus}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearchSubmit={() => {
          if (searchTerm.trim()) {
            handleAISearch(searchTerm);
          }
        }}
        walletBalance={wallet.balance}
        deliverLocation={deliverLocation}
        currentRole={currentRole}
        currency={currency}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Command Palette Search Modal */}
      <GlobalCommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigateTab={setActiveTab}
      />

      {/* Primary Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'catalog' && (
          <ProductCatalogMasterModule
            products={products}
            onAddToCart={handleAddToCart}
            onAISearch={handleAISearch}
            aiSearching={aiSearching}
            aiExplanation={aiExplanation}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onUpdateProduct={(updatedProd) =>
              setProducts((prev) => prev.map((p) => (p.id === updatedProd.id ? updatedProd : p)))
            }
          />
        )}

        {activeTab === 'settings_center' && (
          <UniversalSettingsCenter />
        )}

        {activeTab === 'file_manager' && (
          <UnifiedFileManager />
        )}

        {activeTab === 'logs_center' && (
          <CentralLogsCenter />
        )}

        {activeTab === 'affiliate' && (
          <AffiliatePortalView />
        )}

        {activeTab === 'supplier' && (
          <SupplierPortalView />
        )}

        {activeTab === 'delivery' && (
          <DeliveryPartnerPortalView />
        )}

        {activeTab === 'orders' && (
          <OrderManagementMasterModule />
        )}

        {activeTab === 'payments' && (
          <PaymentGatewayMasterModule
            walletBalance={wallet.balance}
            onTopUpWallet={handleTopUpWallet}
            cartItems={cart.map((i) => ({
              id: i.product.id,
              productTitle: i.product.title,
              sku: i.product.sku,
              unitPrice: i.product.price.amount,
              quantity: i.quantity,
              merchantName: i.product.merchant.name,
              imageUrl: i.product.images?.[0],
            }))}
          />
        )}

        {activeTab === 'dropshipping' && (
          <DropshippingMasterModule />
        )}

        {activeTab === 'fba' && (
          <FBAMasterModule />
        )}

        {activeTab === 'logistics' && (
          <LogisticsMasterModule />
        )}

        {activeTab === 'returns' && (
          <ReturnsMasterModule />
        )}

        {activeTab === 'support' && (
          <SupportMasterModule />
        )}

        {activeTab === 'notifications' && (
          <NotificationMasterModule />
        )}

        {activeTab === 'ai_engine' && (
          <AiEngineMasterModule />
        )}

        {activeTab === 'bi_analytics' && (
          <BiAnalyticsMasterModule />
        )}

        {activeTab === 'security_fraud' && (
          <SecurityMasterModule />
        )}

        {activeTab === 'super_admin' && (
          <SuperAdminMasterModule />
        )}

        {activeTab === 'wallet' && (
          <CommerceZoneWalletView
            wallet={wallet}
            onTopUp={handleTopUpWallet}
            onAddCard={handleAddWalletCard}
            onRedeemGiftCard={handleRedeemGiftCard}
            onToggleAutoPay={handleToggleAutoPay}
            onRequestWithdrawal={handleRequestWithdrawal}
            onApproveWithdrawal={handleApproveWithdrawal}
            onRejectWithdrawal={handleRejectWithdrawal}
            onFreezeWalletToggle={handleFreezeWalletToggle}
            onManualAdjustment={handleManualAdjustment}
            onConvertPoints={handleConvertPoints}
          />
        )}

        {activeTab === 'vendor' && (
          <VendorStorePortal
            merchants={merchants}
            products={products}
            orders={orders}
            onAddMerchant={handleAddMerchant}
            onAddProduct={handleAddProduct}
          />
        )}

        {activeTab === 'warehouses' && (
          <WarehouseInventoryView warehouses={warehouses} products={products} />
        )}

        {activeTab === 'ai' && <AIServicesPanel />}

        {activeTab === 'roadmap' && <RoadmapView roadmap={roadmap} />}

        {activeTab === 'events' && <EventInspectorView auditLogs={auditLogs} />}

        {activeTab === 'admin' && (
          <AdminDashboard
            products={products}
            orders={orders}
            warehouses={warehouses}
            merchants={merchants}
            wallet={wallet}
            auditLogs={auditLogs}
            individualSeller={MOCK_INDIVIDUAL_SELLER}
            proSeller={MOCK_PROFESSIONAL_SELLER}
            proInvoices={MOCK_PRO_INVOICES}
            onUpdateProduct={(updatedProd) =>
              setProducts((prev) => prev.map((p) => (p.id === updatedProd.id ? updatedProd : p)))
            }
            onUpdateOrder={(updatedOrder) =>
              setOrders((prev) => prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)))
            }
            onUpdateWallet={(updatedWallet) => setWallet(updatedWallet)}
          />
        )}

      </main>


      {/* System Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 px-4 sm:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="font-extrabold text-white flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-[#febd69]" />
              <span>Commerce Zone Marketplace & Financial Infrastructure Platform</span>
            </div>
            <p className="text-slate-500">
              Commerce Zon-Style Commerce Zon Pay Wallet • Clean Architecture • Gemini 3.6 AI Engine • Multi-Warehouse Stock Engine
            </p>
          </div>

          <div className="flex items-center space-x-4 text-slate-400">
            <span className="flex items-center space-x-1 text-emerald-400 font-bold">
              <Wallet className="w-4 h-4" />
              <span>Wallet Active: ${wallet.balance.toFixed(2)} USD</span>
            </span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center space-x-1">
              <Activity className="w-4 h-4 text-blue-400" />
              <span>Audit Trail: {auditLogs.length} Events</span>
            </span>
          </div>
        </div>
      </footer>

      {/* Shopping Cart & Commerce Zone Pay Checkout Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end font-sans">
          <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 p-6 flex flex-col justify-between shadow-2xl h-full overflow-y-auto">
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-[#febd69] text-lg">Commerce Zone</span>
                  <h2 className="text-base font-bold text-white">Shopping Cart</h2>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="py-12 text-center text-slate-500 space-y-2">
                  <div className="text-4xl">🛒</div>
                  <p className="text-xs font-semibold">Your Commerce Zone Cart is empty.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-xl text-xs text-emerald-300 font-semibold flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Qualifies for FREE Commerce Zone Express Fulfillment!</span>
                  </div>

                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between space-x-3"
                    >
                      <img src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80'} alt="" className="w-12 h-12 rounded object-cover bg-slate-900 shrink-0" />
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="font-bold text-white text-xs truncate">{item.product.title}</div>
                        <div className="text-[10px] text-slate-400">Vendor: {item.product.merchant.name}</div>
                        <div className="text-xs text-emerald-400 font-bold font-mono">
                          ${item.product.price.amount.toFixed(2)}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-950 font-mono bg-[#febd69] px-2 py-0.5 rounded-full">
                          Qty: {item.quantity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-4 border-t border-slate-800 space-y-4">
                {/* Select Payment Method */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 space-y-3">
                  <div className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                    <Wallet className="w-4 h-4 text-[#febd69]" />
                    <span>Select Payment Method</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('WALLET')}
                      className={`p-2.5 rounded-xl border text-left flex flex-col space-y-1 transition ${
                        paymentMethod === 'WALLET'
                          ? 'bg-[#131921] border-[#febd69] text-white shadow'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-[11px] text-[#febd69]">Commerce Zone Pay</span>
                        <Zap className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <span className="font-mono text-[10px] text-emerald-400 font-bold">
                        Bal: ${wallet.balance.toFixed(2)}
                      </span>
                      <span className="text-[9px] text-amber-300 font-semibold">+2% Cashback</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('CARD')}
                      className={`p-2.5 rounded-xl border text-left flex flex-col space-y-1 transition ${
                        paymentMethod === 'CARD'
                          ? 'bg-[#131921] border-[#febd69] text-white shadow'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[11px]">Saved Card</span>
                        <CreditCard className="w-3.5 h-3.5 text-sky-400" />
                      </div>
                      <span className="font-mono text-[10px] text-slate-400">
                        {wallet.cards[0]?.cardNumberMasked || 'Card **** 4829'}
                      </span>
                      <span className="text-[9px] text-slate-500">Standard Pay</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                    <span className="font-mono text-white">${cartSubtotal.toFixed(2)} USD</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Shipping & Handling</span>
                    <span className="font-mono text-emerald-400">FREE</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Estimated Tax (8%)</span>
                    <span className="font-mono text-white">
                      ${(cartSubtotal * 0.08).toFixed(2)} USD
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-slate-800">
                    <span>Order Total</span>
                    <span className="font-mono text-amber-400">
                      ${(cartSubtotal * 1.08).toFixed(2)} USD
                    </span>
                  </div>
                  {paymentMethod === 'WALLET' && (
                    <div className="text-[11px] text-emerald-400 font-bold text-right">
                      🎁 You will earn +${((cartSubtotal * 1.08) * 0.02).toFixed(2)} cashback!
                    </div>
                  )}
                </div>

                {checkoutError && (
                  <div className="p-3 bg-red-950/80 border border-red-800 text-red-300 rounded-xl text-xs font-semibold">
                    {checkoutError}
                  </div>
                )}

                <button
                  onClick={handleCheckout}
                  className="w-full py-3 bg-[#ffd814] hover:bg-[#f7ca00] text-slate-950 font-extrabold text-xs rounded-full border border-[#fcd200] transition shadow-lg flex items-center justify-center space-x-2"
                >
                  <Lock className="w-4 h-4 text-slate-900" />
                  <span>Pay ${(cartSubtotal * 1.08).toFixed(2)} via Commerce Zone</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Order Completion Modal */}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-white">Order Confirmed on Commerce Zone!</h3>
              <p className="text-xs text-slate-400 font-mono">Order #: {orderSuccess.order.orderNumber}</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs space-y-2.5">
              <div className="flex justify-between text-slate-400">
                <span>Payment Method:</span>
                <span className="text-[#febd69] font-bold">
                  {orderSuccess.paidByWallet ? 'Commerce Zone Pay Wallet' : 'Credit Card'}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Total Amount Paid:</span>
                <span className="text-emerald-400 font-mono font-bold">
                  ${orderSuccess.order.total.amount.toLocaleString()} USD
                </span>
              </div>
              {orderSuccess.cashback > 0 && (
                <div className="p-2 bg-emerald-950 border border-emerald-800 rounded-lg text-emerald-300 font-bold text-center text-xs flex items-center justify-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>+$${orderSuccess.cashback.toFixed(2)} Cashback Credited to Wallet!</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setOrderSuccess(null)}
              className="w-full py-2.5 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 text-xs font-extrabold rounded-xl transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {/* Commerce Zon Settings & Role Switcher Modal */}
      <CommerceZonSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentRole={currentRole}
        onRoleChange={(newRole) => {
          setCurrentRole(newRole);
          if (newRole === 'SELLER') setActiveTab('vendor');
          else if (newRole === 'WAREHOUSE') setActiveTab('warehouses');
          else if (newRole === 'ADMIN') setActiveTab('ai');
          else setActiveTab('catalog');
        }}
        currentCurrency={currency}
        onCurrencyChange={(curr) => setCurrency(curr)}
        deliverLocation={deliverLocation}
        onDeliverLocationChange={(loc) => setDeliverLocation(loc)}
        primeMember={primeMember}
        onTogglePrime={() => setPrimeMember(!primeMember)}
      />
    </div>
  );
}

