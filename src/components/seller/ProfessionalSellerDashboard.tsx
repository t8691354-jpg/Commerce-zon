import React, { useState } from 'react';
import {
  ProfessionalSellerProfile,
  Product,
  Order,
  ProSellerInvoice,
  ProStaffMember,
  ProMarketingCampaign,
  ProApiKeyConfig,
  ProWebhookConfig,
  StaffRole,
  SellerNotificationAlert,
} from '../../types/domain';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Building2,
  Zap,
  CreditCard,
  DollarSign,
  TrendingUp,
  Users,
  Package,
  ShoppingCart,
  ShieldCheck,
  Award,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Download,
  FileText,
  Plus,
  Trash2,
  Edit,
  Eye,
  Key,
  Webhook,
  Megaphone,
  Palette,
  MessageSquare,
  Star,
  Settings,
  ArrowUpRight,
  ArrowDownRight,
  Lock,
  Layers,
  Search,
  Filter,
  BarChart3,
  Clock,
  ChevronRight,
  Sliders,
  Send,
  X,
  Printer,
  Sparkles,
  Database,
  Radio,
  FileSpreadsheet,
} from 'lucide-react';

interface Props {
  seller: ProfessionalSellerProfile;
  products: Product[];
  orders: Order[];
  invoices: ProSellerInvoice[];
  notifications: SellerNotificationAlert[];
  onUpdateSeller: (updated: ProfessionalSellerProfile) => void;
  onAddProduct: (prodPartial: Partial<Product>) => void;
  onDeleteProduct: (prodId: string) => void;
  onDowngradeToIndividual: () => void;
}

const REVENUE_ANALYTICS_DATA = [
  { period: 'Jan', revenue: 42000, profit: 18400, orders: 120 },
  { period: 'Feb', revenue: 58000, profit: 26100, orders: 180 },
  { period: 'Mar', revenue: 64000, profit: 29800, orders: 210 },
  { period: 'Apr', revenue: 71000, profit: 34500, orders: 245 },
  { period: 'May', revenue: 89000, profit: 42800, orders: 310 },
  { period: 'Jun', revenue: 95000, profit: 46200, orders: 340 },
  { period: 'Jul', revenue: 112000, profit: 54900, orders: 410 },
];

const GEOGRAPHIC_SALES_DATA = [
  { country: 'United States', sales: 245000, pct: '49.7%' },
  { country: 'Germany & EU', sales: 112000, pct: '22.7%' },
  { country: 'United Kingdom', sales: 68000, pct: '13.8%' },
  { country: 'Japan & APAC', sales: 48000, pct: '9.7%' },
  { country: 'Canada', sales: 19800, pct: '4.1%' },
];

const CATEGORY_PERFORMANCE = [
  { name: 'Precision Robotics', value: 210000, color: '#febd69' },
  { name: 'Industrial IoT', value: 145000, color: '#38bdf8' },
  { name: 'Cybernetic Sensors', value: 98000, color: '#34d399' },
  { name: 'Automation Parts', value: 39800, color: '#a78bfa' },
];

export const ProfessionalSellerDashboard: React.FC<Props> = ({
  seller,
  products,
  orders,
  invoices,
  notifications,
  onUpdateSeller,
  onAddProduct,
  onDeleteProduct,
  onDowngradeToIndividual,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    | 'subscription'
    | 'products'
    | 'inventory'
    | 'orders'
    | 'analytics'
    | 'marketing'
    | 'branding'
    | 'team'
    | 'api_webhooks'
    | 'support'
    | 'admin_controls'
  >('subscription');

  const [timeframe, setTimeframe] = useState<'7d' | '30d' | 'ytd'>('30d');

  // Modals
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showAddCampaignModal, setShowAddCampaignModal] = useState(false);
  const [showAddApiKeyModal, setShowAddApiKeyModal] = useState(false);
  const [showAddWebhookModal, setShowAddWebhookModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<ProSellerInvoice | null>(null);

  // Forms
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<StaffRole>('MANAGER');

  const [newCampTitle, setNewCampTitle] = useState('');
  const [newCampType, setNewCampType] = useState<ProMarketingCampaign['type']>('COUPON');
  const [newCampCode, setNewCampCode] = useState('');
  const [newCampPct, setNewCampPct] = useState(10);

  const [newKeyName, setNewKeyName] = useState('');
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [newWebhookEvent, setNewWebhookEvent] = useState<ProWebhookConfig['event']>('ORDER_CREATED');

  // Admin config override states
  const [adminPrice, setAdminPrice] = useState(36.00);
  const [adminGraceDays, setAdminGraceDays] = useState(7);
  const [adminSubStatus, setAdminSubStatus] = useState(seller.subscription.status);

  // Branding Form
  const [brandDesc, setBrandDesc] = useState(seller.branding.description);
  const [brandAbout, setBrandAbout] = useState(seller.branding.aboutPageText);

  // Filter & Search
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  // Bulk selections
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // Toast / Status Message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Renew Subscription Action
  const handleRenewNow = () => {
    const nextBilling = new Date();
    nextBilling.setMonth(nextBilling.getMonth() + 1);

    const newInvoice: ProSellerInvoice = {
      id: `inv-pro-${Date.now()}`,
      invoiceNumber: `INV-PRO-${Math.floor(100000 + Math.random() * 900000)}`,
      sellerId: seller.id,
      sellerName: seller.businessName,
      planName: 'Professional Seller Plan',
      billingPeriod: `${new Date().toLocaleDateString()} - ${nextBilling.toLocaleDateString()}`,
      subtotal: seller.monthlyPrice,
      taxAmount: 0.00,
      totalAmount: seller.monthlyPrice,
      status: 'PAID',
      paymentMethod: seller.subscription.paymentMethod,
      issuedAt: new Date().toISOString(),
      paidAt: new Date().toISOString(),
    };

    const updatedSeller: ProfessionalSellerProfile = {
      ...seller,
      subscription: {
        ...seller.subscription,
        status: 'ACTIVE',
        lastPaymentDate: new Date().toISOString(),
        nextBillingDate: nextBilling.toISOString(),
      },
    };

    onUpdateSeller(updatedSeller);
    invoices.unshift(newInvoice);
    showToast('Subscription renewed successfully! $36.00 invoice generated.');
  };

  const handleToggleAutoRenew = () => {
    const updated = {
      ...seller,
      subscription: {
        ...seller.subscription,
        autoRenew: !seller.subscription.autoRenew,
      },
    };
    onUpdateSeller(updated);
    showToast(
      updated.subscription.autoRenew
        ? 'Auto-renewal enabled ($36/mo).'
        : 'Auto-renewal cancelled. Subscription active until billing period ends.'
    );
  };

  const handleAddStaff = () => {
    if (!newStaffName || !newStaffEmail) return;
    const newMember: ProStaffMember = {
      id: `staff-${Date.now()}`,
      name: newStaffName,
      email: newStaffEmail,
      role: newStaffRole,
      permissions: ['PRODUCTS_WRITE', 'ORDERS_WRITE'],
      status: 'ACTIVE',
      addedAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    };
    onUpdateSeller({
      ...seller,
      staff: [...seller.staff, newMember],
    });
    setNewStaffName('');
    setNewStaffEmail('');
    setShowAddStaffModal(false);
    showToast(`Staff member ${newStaffName} (${newStaffRole}) added successfully.`);
  };

  const handleAddCampaign = () => {
    if (!newCampTitle) return;
    const now = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const newCamp: ProMarketingCampaign = {
      id: `camp-${Date.now()}`,
      title: newCampTitle,
      type: newCampType,
      discountCode: newCampCode || 'PRODISCOUNT10',
      discountPercentage: newCampPct,
      startDate: now.toISOString(),
      endDate: nextMonth.toISOString(),
      status: 'ACTIVE',
      salesGenerated: 0,
      clicks: 0,
      conversions: 0,
    };
    onUpdateSeller({
      ...seller,
      campaigns: [...seller.campaigns, newCamp],
    });
    setNewCampTitle('');
    setNewCampCode('');
    setShowAddCampaignModal(false);
    showToast(`Marketing Campaign "${newCampTitle}" created!`);
  };

  const handleAddApiKey = () => {
    if (!newKeyName) return;
    const newKey: ProApiKeyConfig = {
      id: `key-${Date.now()}`,
      keyName: newKeyName,
      apiKey: `pk_live_pro_${Math.random().toString(36).substring(2, 18)}`,
      permissions: ['ALL'],
      rateLimitPerMin: 1000,
      createdAt: new Date().toISOString(),
      lastUsedAt: new Date().toISOString(),
      status: 'ACTIVE',
    };
    onUpdateSeller({
      ...seller,
      apiKeys: [...seller.apiKeys, newKey],
    });
    setNewKeyName('');
    setShowAddApiKeyModal(false);
    showToast(`API Key "${newKeyName}" generated.`);
  };

  const handleAddWebhook = () => {
    if (!newWebhookUrl) return;
    const newWh: ProWebhookConfig = {
      id: `wh-${Date.now()}`,
      event: newWebhookEvent,
      targetUrl: newWebhookUrl,
      secret: `whsec_${Math.random().toString(36).substring(2, 12)}`,
      status: 'ACTIVE',
      lastTriggered: new Date().toISOString(),
    };
    onUpdateSeller({
      ...seller,
      webhooks: [...seller.webhooks, newWh],
    });
    setNewWebhookUrl('');
    setShowAddWebhookModal(false);
    showToast(`Webhook for ${newWebhookEvent} added.`);
  };

  const handleSaveBranding = () => {
    onUpdateSeller({
      ...seller,
      branding: {
        ...seller.branding,
        description: brandDesc,
        aboutPageText: brandAbout,
      },
    });
    showToast('Store branding & About Page updated.');
  };

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.sku.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredOrders = orders.filter((o) =>
    o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.customerName.toLowerCase().includes(orderSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-amber-500 text-slate-950 font-extrabold px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2 animate-bounce">
          <Sparkles className="w-5 h-5 fill-current" />
          <span className="text-xs">{toastMessage}</span>
        </div>
      )}

      {/* Enterprise Pro Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 border border-slate-800 p-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start space-x-4">
            <img
              src={seller.branding.logoUrl}
              alt="Logo"
              className="w-16 h-16 rounded-xl object-cover bg-slate-900 border-2 border-amber-500/40 shadow-lg shrink-0"
            />
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 bg-[#febd69] text-slate-950 font-black text-[10px] rounded-md tracking-wider">
                  PROFESSIONAL SELLER PLAN
                </span>
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold text-[10px] rounded-md border border-emerald-500/30 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>ACTIVE ($36/MO)</span>
                </span>
                <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 font-bold text-[10px] rounded-md border border-blue-500/30">
                  NO $0.99 PER-ITEM FEE
                </span>
              </div>
              <h2 className="text-xl font-black text-white mt-1.5">{seller.storeName}</h2>
              <p className="text-xs text-slate-400 flex items-center space-x-2 mt-0.5">
                <span>{seller.businessName}</span>
                <span>•</span>
                <span className="text-amber-300 font-medium">VAT/Tax ID: {seller.taxIdVat}</span>
                <span>•</span>
                <span className="text-emerald-400 font-medium">KYC Verified</span>
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800/80 backdrop-blur">
            <div className="px-2 border-r border-slate-800">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Monthly Fee</div>
              <div className="text-sm font-black text-[#febd69]">$36.00 / mo</div>
            </div>
            <div className="px-2 border-r border-slate-800">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Active Products</div>
              <div className="text-sm font-black text-white flex items-center space-x-1">
                <span>{products.length}</span>
                <span className="text-[10px] text-emerald-400 font-normal">(∞ Unlimited)</span>
              </div>
            </div>
            <div className="px-2 border-r border-slate-800">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Wallet Balance</div>
              <div className="text-sm font-black text-emerald-400">${seller.walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            </div>
            <div className="px-2">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Store Rating</div>
              <div className="text-sm font-black text-amber-300 flex items-center space-x-1">
                <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                <span>{seller.storeRating} / 5.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Tab Module Navigation */}
      <div className="bg-[#1e293b] p-1.5 border border-slate-800 rounded-xl flex items-center space-x-1 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('subscription')}
          className={`px-3.5 py-2 rounded-lg flex items-center space-x-2 transition ${
            activeSubTab === 'subscription'
              ? 'bg-[#febd69] text-slate-950 shadow-md font-black'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>$36/Mo Subscription & Billing</span>
        </button>

        <button
          onClick={() => setActiveSubTab('products')}
          className={`px-3.5 py-2 rounded-lg flex items-center space-x-2 transition ${
            activeSubTab === 'products'
              ? 'bg-[#febd69] text-slate-950 shadow-md font-black'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Unlimited Catalog</span>
        </button>

        <button
          onClick={() => setActiveSubTab('inventory')}
          className={`px-3.5 py-2 rounded-lg flex items-center space-x-2 transition ${
            activeSubTab === 'inventory'
              ? 'bg-[#febd69] text-slate-950 shadow-md font-black'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Multi-Warehouse Inventory</span>
        </button>

        <button
          onClick={() => setActiveSubTab('orders')}
          className={`px-3.5 py-2 rounded-lg flex items-center space-x-2 transition ${
            activeSubTab === 'orders'
              ? 'bg-[#febd69] text-slate-950 shadow-md font-black'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Batch Fulfillment</span>
        </button>

        <button
          onClick={() => setActiveSubTab('analytics')}
          className={`px-3.5 py-2 rounded-lg flex items-center space-x-2 transition ${
            activeSubTab === 'analytics'
              ? 'bg-[#febd69] text-slate-950 shadow-md font-black'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Pro Analytics & BI</span>
        </button>

        <button
          onClick={() => setActiveSubTab('marketing')}
          className={`px-3.5 py-2 rounded-lg flex items-center space-x-2 transition ${
            activeSubTab === 'marketing'
              ? 'bg-[#febd69] text-slate-950 shadow-md font-black'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>Promotions & Ads</span>
        </button>

        <button
          onClick={() => setActiveSubTab('branding')}
          className={`px-3.5 py-2 rounded-lg flex items-center space-x-2 transition ${
            activeSubTab === 'branding'
              ? 'bg-[#febd69] text-slate-950 shadow-md font-black'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Store Customizer</span>
        </button>

        <button
          onClick={() => setActiveSubTab('team')}
          className={`px-3.5 py-2 rounded-lg flex items-center space-x-2 transition ${
            activeSubTab === 'team'
              ? 'bg-[#febd69] text-slate-950 shadow-md font-black'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Team & Staff RBAC</span>
        </button>

        <button
          onClick={() => setActiveSubTab('api_webhooks')}
          className={`px-3.5 py-2 rounded-lg flex items-center space-x-2 transition ${
            activeSubTab === 'api_webhooks'
              ? 'bg-[#febd69] text-slate-950 shadow-md font-black'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>APIs & Webhooks</span>
        </button>

        <button
          onClick={() => setActiveSubTab('admin_controls')}
          className={`px-3.5 py-2 rounded-lg flex items-center space-x-2 transition ${
            activeSubTab === 'admin_controls'
              ? 'bg-[#febd69] text-slate-950 shadow-md font-black'
              : 'text-[#febd69] hover:bg-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Admin Controls</span>
        </button>
      </div>

      {/* MODULE 1: SUBSCRIPTION MANAGEMENT & AUTOMATED BILLING ENGINE */}
      {activeSubTab === 'subscription' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Subscription Status Card */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-amber-500/20 text-[#febd69] rounded-xl border border-amber-500/30">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">Professional Seller Subscription Engine</h3>
                    <p className="text-xs text-slate-400">Automated recurring billing at $36.00/month</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-black text-xs rounded-lg flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>STATUS: {seller.subscription.status}</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Monthly Subscription Fee</div>
                  <div className="text-2xl font-black text-white">$36.00 <span className="text-xs text-slate-400 font-normal">/ month</span></div>
                  <div className="text-[10px] text-emerald-400 font-semibold flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Per-Item Fee: $0.00 (Standard $0.99 Waived!)</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Next Billing Cycle</div>
                  <div className="text-sm font-bold text-amber-300 font-mono">
                    {new Date(seller.subscription.nextBillingDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center justify-between">
                    <span>Auto-Renewal:</span>
                    <span className={`font-bold ${seller.subscription.autoRenew ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {seller.subscription.autoRenew ? 'ENABLED' : 'DISABLED'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Controls */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={handleRenewNow}
                  className="px-4 py-2.5 bg-gradient-to-r from-[#febd69] to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs flex items-center space-x-2 transition shadow-md"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Renew Subscription Now ($36.00)</span>
                </button>

                <button
                  onClick={handleToggleAutoRenew}
                  className={`px-4 py-2.5 border font-bold rounded-xl text-xs flex items-center space-x-2 transition ${
                    seller.subscription.autoRenew
                      ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-rose-300'
                      : 'bg-emerald-500/20 hover:bg-emerald-500/30 border-emerald-500/40 text-emerald-300'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>{seller.subscription.autoRenew ? 'Cancel Auto-Renewal' : 'Enable Auto-Renewal'}</span>
                </button>

                <button
                  onClick={onDowngradeToIndividual}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold rounded-xl text-xs flex items-center space-x-2 transition"
                >
                  <ArrowDownRight className="w-4 h-4 text-slate-400" />
                  <span>Downgrade to Individual Plan ($0/Mo)</span>
                </button>
              </div>
            </div>

            {/* Payment Method & Grace Period Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <h3 className="text-sm font-black text-white flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-amber-400" />
                <span>Primary Payment Method</span>
              </h3>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-white">{seller.subscription.cardBrand || 'Corporate Card'}</div>
                  <span className="px-2 py-0.5 bg-slate-800 text-slate-300 font-mono text-[10px] rounded">DEFAULT</span>
                </div>
                <div className="text-base font-mono text-amber-300">
                  •••• •••• •••• {seller.subscription.cardLast4 || '4242'}
                </div>
                <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800">
                  <span>Payment Gateway: Stripe Enterprise</span>
                  <span className="text-emerald-400 font-bold">256-Bit SSL</span>
                </div>
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-1">
                <div className="text-xs font-bold text-amber-300 flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>7-Day Grace Period Policy</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  In case of payment retries or card expiry, your seller features remain 100% active for 7 days before temporary suspension.
                </p>
              </div>
            </div>
          </div>

          {/* Invoices & Billing History Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-slate-800 text-amber-400 rounded-xl">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Subscription Invoices & Receipts</h3>
                  <p className="text-xs text-slate-400">Automatic PDF generation and tax records</p>
                </div>
              </div>
              <button
                onClick={() => showToast('Exporting all invoices to CSV...')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg border border-slate-700 flex items-center space-x-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export History CSV</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
                  <tr>
                    <th className="p-3">Invoice No</th>
                    <th className="p-3">Billing Period</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Payment Method</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-3 font-mono font-bold text-amber-300">{inv.invoiceNumber}</td>
                      <td className="p-3 text-slate-300">{inv.billingPeriod}</td>
                      <td className="p-3 font-bold text-white">${inv.totalAmount.toFixed(2)}</td>
                      <td className="p-3 text-slate-400">{inv.paymentMethod}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold rounded">
                          {inv.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold rounded-lg transition inline-flex items-center space-x-1"
                        >
                          <Printer className="w-3 h-3" />
                          <span>View Invoice</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 2: UNLIMITED CATALOG MANAGEMENT */}
      {activeSubTab === 'products' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-black text-white flex items-center space-x-2">
                  <Package className="w-5 h-5 text-amber-400" />
                  <span>Enterprise Unlimited Product Catalog</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  No listing caps • Unlimited high-resolution image & video hosting
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    onAddProduct({
                      title: 'Industrial Heavy Duty Cybernetic Servo Motor X9',
                      sku: `SKU-SERVO-${Math.floor(1000 + Math.random() * 9000)}`,
                      price: { amount: 850.00, currency: 'USD' },
                      totalStock: 120,
                      description: 'Enterprise grade robotic servo motor built for high torque applications.',
                      images: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'],
                    })
                  }
                  className="px-4 py-2 bg-[#febd69] hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center space-x-1.5 transition shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Listing</span>
                </button>

                <button
                  onClick={() => showToast('Simulating Bulk CSV Product Import...')}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>Bulk CSV Import</span>
                </button>
              </div>
            </div>

            {/* Search & Filter */}
            <div className="flex items-center space-x-3 bg-slate-950 p-2 rounded-xl border border-slate-800">
              <Search className="w-4 h-4 text-slate-400 ml-2" />
              <input
                type="text"
                placeholder="Search products by title, SKU or category..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="bg-transparent border-none text-xs text-white placeholder-slate-500 focus:outline-none w-full"
              />
            </div>

            {/* Product Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
                  <tr>
                    <th className="p-3">Product</th>
                    <th className="p-3">SKU</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3">Per-Item Selling Fee</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-3 flex items-center space-x-3">
                        <img
                          src={p.images?.[0] || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80'}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover bg-slate-950 border border-slate-800 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-white line-clamp-1">{p.title}</div>
                          <div className="text-[10px] text-slate-400 uppercase font-mono">{p.category}</div>
                        </div>
                      </td>
                      <td className="p-3 font-mono text-slate-300">{p.sku}</td>
                      <td className="p-3 font-bold text-amber-300">${p.price.amount.toFixed(2)}</td>
                      <td className="p-3 font-bold text-emerald-400">{p.totalStock} units</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-extrabold text-[10px] rounded border border-emerald-500/30">
                          $0.00 (PRO WAIVED)
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => showToast(`Editing product ${p.sku}...`)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteProduct(p.id)}
                          className="p-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-lg transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 3: MULTI-WAREHOUSE INVENTORY */}
      {activeSubTab === 'inventory' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
              <div className="text-xs font-bold text-slate-400 uppercase">Available Stock</div>
              <div className="text-2xl font-black text-emerald-400">14,850 Units</div>
              <div className="text-[10px] text-slate-400">Across 3 Enterprise Regional Warehouses</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
              <div className="text-xs font-bold text-slate-400 uppercase">Reserved In-Flight Stock</div>
              <div className="text-2xl font-black text-amber-400">1,240 Units</div>
              <div className="text-[10px] text-slate-400">Locked in active customer carts & checkout</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
              <div className="text-xs font-bold text-slate-400 uppercase">Incoming Shipment Stock</div>
              <div className="text-2xl font-black text-blue-400">5,000 Units</div>
              <div className="text-[10px] text-slate-400">En route to Fulfillment Hub West</div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-black text-white flex items-center space-x-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Multi-Warehouse Batch & Serial Tracker</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
                  <tr>
                    <th className="p-3">Warehouse Hub</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Available</th>
                    <th className="p-3">Reserved</th>
                    <th className="p-3">Barcode Serial Format</th>
                    <th className="p-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  <tr className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-bold text-white">US West Coast Hub (San Jose)</td>
                    <td className="p-3 text-slate-300">California, USA</td>
                    <td className="p-3 font-bold text-emerald-400">8,200</td>
                    <td className="p-3 text-amber-300">650</td>
                    <td className="p-3 font-mono text-slate-400">EAN-13 / GS1-128</td>
                    <td className="p-3 text-right">
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded">OPERATIONAL</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-bold text-white">US East Coast Hub (NJ)</td>
                    <td className="p-3 text-slate-300">New Jersey, USA</td>
                    <td className="p-3 font-bold text-emerald-400">4,100</td>
                    <td className="p-3 text-amber-300">410</td>
                    <td className="p-3 font-mono text-slate-400">EAN-13 / UPC-A</td>
                    <td className="p-3 text-right">
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded">OPERATIONAL</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-bold text-white">EU Central Logistics Hub</td>
                    <td className="p-3 text-slate-300">Frankfurt, Germany</td>
                    <td className="p-3 font-bold text-emerald-400">2,550</td>
                    <td className="p-3 text-amber-300">180</td>
                    <td className="p-3 font-mono text-slate-400">EAN-13 / Code39</td>
                    <td className="p-3 text-right">
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded">OPERATIONAL</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 4: BATCH FULFILLMENT & ORDERS */}
      {activeSubTab === 'orders' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-black text-white flex items-center space-x-2">
                  <ShoppingCart className="w-5 h-5 text-amber-400" />
                  <span>Batch Order Fulfillment & Label Printing</span>
                </h3>
                <p className="text-xs text-slate-400">High volume order management and shipping tracking</p>
              </div>

              <button
                onClick={() => showToast('Batch generating shipping labels for 12 orders...')}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black rounded-xl text-xs flex items-center space-x-1.5 transition shadow"
              >
                <Printer className="w-4 h-4" />
                <span>Bulk Print Shipping Labels</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
                  <tr>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Total Amount</th>
                    <th className="p-3">Fulfillment Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-3 font-mono font-bold text-amber-300">{o.id}</td>
                      <td className="p-3 text-white font-bold">{o.customerName}</td>
                      <td className="p-3 font-bold text-emerald-400">${o.total.amount.toFixed(2)}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold text-[10px] rounded">
                          {o.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => showToast(`Printing packing slip for ${o.id}...`)}
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold rounded-lg transition"
                        >
                          Print Label
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 5: PRO ANALYTICS & BI */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-slate-900 p-4 border border-slate-800 rounded-2xl">
            <h3 className="text-base font-black text-white flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-amber-400" />
              <span>Professional Sales & Revenue BI Analytics</span>
            </h3>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => showToast('Exporting Analytics PDF Report...')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center space-x-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Report PDF</span>
              </button>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h4 className="text-xs font-bold text-slate-300 uppercase">Monthly Revenue vs Net Operating Profit ($)</h4>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_ANALYTICS_DATA}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#febd69" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#febd69" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34d399" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="period" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="revenue" stroke="#febd69" fillOpacity={1} fill="url(#colorRev)" name="Gross Revenue ($)" />
                  <Area type="monotone" dataKey="profit" stroke="#34d399" fillOpacity={1} fill="url(#colorProf)" name="Net Profit ($)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Breakdown & Geographic Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <h4 className="text-xs font-bold text-slate-300 uppercase">Sales by Category Distribution</h4>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={CATEGORY_PERFORMANCE} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {CATEGORY_PERFORMANCE.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <h4 className="text-xs font-bold text-slate-300 uppercase">Geographic Market Breakdown</h4>
              <div className="space-y-3">
                {GEOGRAPHIC_SALES_DATA.map((geo, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                    <span className="font-bold text-white">{geo.country}</span>
                    <div className="flex items-center space-x-3">
                      <span className="text-slate-400 font-mono">${geo.sales.toLocaleString()}</span>
                      <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 font-black text-[10px] rounded">
                        {geo.pct}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 6: MARKETING & PROMOTIONS */}
      {activeSubTab === 'marketing' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white flex items-center space-x-2">
                  <Megaphone className="w-5 h-5 text-amber-400" />
                  <span>Promotions, Coupons & Sponsored Ads Engine</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Exclusive marketing tools for Professional Sellers</p>
              </div>

              <button
                onClick={() => setShowAddCampaignModal(true)}
                className="px-4 py-2 bg-[#febd69] hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center space-x-1.5 transition shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Create Marketing Campaign</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {seller.campaigns.map((camp) => (
                <div key={camp.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold rounded">
                      {camp.type}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded">
                      {camp.status}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white line-clamp-1">{camp.title}</h4>
                    {camp.discountCode && (
                      <div className="text-xs font-mono font-bold text-amber-300 mt-1">Code: {camp.discountCode} ({camp.discountPercentage}% OFF)</div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 pt-2 border-t border-slate-800">
                    <div>Clicks: <span className="text-white font-bold">{camp.clicks}</span></div>
                    <div>Sales: <span className="text-emerald-400 font-bold">${camp.salesGenerated.toLocaleString()}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODULE 7: TEAM & STAFF RBAC */}
      {activeSubTab === 'team' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white flex items-center space-x-2">
                  <Users className="w-5 h-5 text-amber-400" />
                  <span>Seller Team & Role-Based Access Control (RBAC)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Manage staff sub-accounts with granular permissions</p>
              </div>

              <button
                onClick={() => setShowAddStaffModal(true)}
                className="px-4 py-2 bg-[#febd69] hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center space-x-1.5 transition shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Add Staff Member</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
                  <tr>
                    <th className="p-3">Staff Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Assigned Role</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {seller.staff.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-3 font-bold text-white flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-full bg-amber-500/20 text-[#febd69] font-black flex items-center justify-center text-xs">
                          {st.name.charAt(0)}
                        </div>
                        <span>{st.name}</span>
                      </td>
                      <td className="p-3 text-slate-300">{st.email}</td>
                      <td className="p-3 font-mono font-bold text-amber-300">{st.role}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold text-[10px] rounded">
                          {st.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => showToast(`Revoked access for ${st.name}`)}
                          className="px-2 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[10px] font-bold rounded transition"
                        >
                          Revoke
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 8: APIS & WEBHOOKS */}
      {activeSubTab === 'api_webhooks' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* API Keys */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-white flex items-center space-x-2">
                  <Key className="w-4 h-4 text-amber-400" />
                  <span>Marketplace REST API Keys</span>
                </h3>
                <button
                  onClick={() => setShowAddApiKeyModal(true)}
                  className="px-3 py-1.5 bg-[#febd69] hover:bg-amber-400 text-slate-950 font-extrabold rounded-lg text-xs"
                >
                  Generate Key
                </button>
              </div>

              <div className="space-y-3">
                {seller.apiKeys.map((key) => (
                  <div key={key.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{key.keyName}</span>
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded">
                        ACTIVE ({key.rateLimitPerMin} RPM)
                      </span>
                    </div>
                    <div className="text-xs font-mono text-amber-300 bg-slate-900 p-2 rounded border border-slate-800 truncate">
                      {key.apiKey}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Webhooks */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-white flex items-center space-x-2">
                  <Webhook className="w-4 h-4 text-amber-400" />
                  <span>Real-Time Webhook Endpoints</span>
                </h3>
                <button
                  onClick={() => setShowAddWebhookModal(true)}
                  className="px-3 py-1.5 bg-[#febd69] hover:bg-amber-400 text-slate-950 font-extrabold rounded-lg text-xs"
                >
                  Add Webhook
                </button>
              </div>

              <div className="space-y-3">
                {seller.webhooks.map((wh) => (
                  <div key={wh.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 font-mono text-[10px] font-bold rounded">
                        {wh.event}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">Secret: {wh.secret}</span>
                    </div>
                    <div className="text-xs font-mono text-slate-300 truncate">{wh.targetUrl}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 9: STORE CUSTOMIZER BRANDING */}
      {activeSubTab === 'branding' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-base font-black text-white flex items-center space-x-2">
            <Palette className="w-5 h-5 text-amber-400" />
            <span>Storefront Theme & Branding Customizer</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Store Description Banner Headline</label>
              <textarea
                value={brandDesc}
                onChange={(e) => setBrandDesc(e.target.value)}
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">About Store Page Custom Story</label>
              <textarea
                value={brandAbout}
                onChange={(e) => setBrandAbout(e.target.value)}
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              onClick={handleSaveBranding}
              className="px-5 py-2.5 bg-[#febd69] hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs transition"
            >
              Save Store Branding
            </button>
          </div>
        </div>
      )}

      {/* MODULE 10: MARKETPLACE ADMIN CONTROLS OVERRIDE */}
      {activeSubTab === 'admin_controls' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
            <div className="p-3 bg-amber-500/20 text-[#febd69] rounded-xl border border-amber-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Marketplace Administrator Controls</h3>
              <p className="text-xs text-slate-400">Manage Pro seller pricing, grace periods, and forced status overrides</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <label className="block text-xs font-bold text-slate-300">Set Pro Subscription Price ($/Mo)</label>
              <input
                type="number"
                value={adminPrice}
                onChange={(e) => setAdminPrice(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white font-bold"
              />
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <label className="block text-xs font-bold text-slate-300">Grace Period (Days)</label>
              <input
                type="number"
                value={adminGraceDays}
                onChange={(e) => setAdminGraceDays(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white font-bold"
              />
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <label className="block text-xs font-bold text-slate-300">Account Subscription Status</label>
              <select
                value={adminSubStatus}
                onChange={(e) => setAdminSubStatus(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white font-bold"
              >
                <option value="ACTIVE">ACTIVE ($36/mo)</option>
                <option value="TRIAL">TRIAL (14 Days Free)</option>
                <option value="SUSPENDED">SUSPENDED (Billing Hold)</option>
                <option value="EXPIRED">EXPIRED</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                onUpdateSeller({
                  ...seller,
                  monthlyPrice: adminPrice,
                  subscription: {
                    ...seller.subscription,
                    status: adminSubStatus,
                    gracePeriodDays: adminGraceDays,
                  },
                });
                showToast(`Admin rules updated: $${adminPrice}/mo | Status: ${adminSubStatus}`);
              }}
              className="px-5 py-2.5 bg-[#febd69] hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs transition"
            >
              Apply Admin Override Rules
            </button>

            <button
              onClick={() => showToast('Refunding latest $36.00 fee to Pro Seller Wallet...')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold rounded-xl text-xs border border-slate-700 transition"
            >
              Issue $36 Subscription Refund
            </button>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD STAFF */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white">Add Staff Member</h3>
              <button onClick={() => setShowAddStaffModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  placeholder="e.g. Sarah Connor"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={newStaffEmail}
                  onChange={(e) => setNewStaffEmail(e.target.value)}
                  placeholder="e.g. sarah@company.com"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Assigned Role</label>
                <select
                  value={newStaffRole}
                  onChange={(e) => setNewStaffRole(e.target.value as StaffRole)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                >
                  <option value="MANAGER">MANAGER</option>
                  <option value="INVENTORY_MANAGER">INVENTORY MANAGER</option>
                  <option value="CUSTOMER_SUPPORT">CUSTOMER SUPPORT</option>
                  <option value="FINANCE_MANAGER">FINANCE MANAGER</option>
                  <option value="MARKETING_MANAGER">MARKETING MANAGER</option>
                </select>
              </div>
            </div>
            <div className="pt-2 flex justify-end space-x-2">
              <button onClick={() => setShowAddStaffModal(false)} className="px-3 py-1.5 bg-slate-800 text-xs font-bold text-slate-300 rounded-lg">Cancel</button>
              <button onClick={handleAddStaff} className="px-4 py-1.5 bg-[#febd69] text-xs font-black text-slate-950 rounded-lg">Create Staff Account</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD MARKETING CAMPAIGN */}
      {showAddCampaignModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white">Create Marketing Campaign</h3>
              <button onClick={() => setShowAddCampaignModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Campaign Title</label>
                <input
                  type="text"
                  value={newCampTitle}
                  onChange={(e) => setNewCampTitle(e.target.value)}
                  placeholder="e.g. Summer Robotics Flash Sale"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Type</label>
                <select
                  value={newCampType}
                  onChange={(e) => setNewCampType(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                >
                  <option value="COUPON">COUPON CODE</option>
                  <option value="SPONSORED_PRODUCT">SPONSORED PRODUCT ADS</option>
                  <option value="FLASH_SALE">FLASH SALE</option>
                  <option value="BUNDLE">BUNDLE DISCOUNT</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Discount Code</label>
                <input
                  type="text"
                  value={newCampCode}
                  onChange={(e) => setNewCampCode(e.target.value)}
                  placeholder="PROSUMMER15"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono uppercase"
                />
              </div>
            </div>
            <div className="pt-2 flex justify-end space-x-2">
              <button onClick={() => setShowAddCampaignModal(false)} className="px-3 py-1.5 bg-slate-800 text-xs font-bold text-slate-300 rounded-lg">Cancel</button>
              <button onClick={handleAddCampaign} className="px-4 py-1.5 bg-[#febd69] text-xs font-black text-slate-950 rounded-lg">Launch Campaign</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: INVOICE DETAIL VIEW */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-[#febd69]" />
                <h3 className="text-sm font-black text-white">Official Tax Invoice</h3>
              </div>
              <button onClick={() => setSelectedInvoice(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Invoice Number</div>
                  <div className="font-mono font-bold text-amber-300 text-sm">{selectedInvoice.invoiceNumber}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Status</div>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold text-[10px] rounded">
                    {selectedInvoice.status}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-800 text-slate-300">
                  <span>Merchant:</span>
                  <span className="font-bold text-white">{selectedInvoice.sellerName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800 text-slate-300">
                  <span>Subscription Plan:</span>
                  <span className="font-bold text-white">{selectedInvoice.planName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800 text-slate-300">
                  <span>Billing Period:</span>
                  <span className="font-mono text-slate-300">{selectedInvoice.billingPeriod}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800 text-slate-300">
                  <span>Subtotal:</span>
                  <span className="font-bold text-white">${selectedInvoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 text-base font-black text-amber-300 pt-2 border-t border-slate-700">
                  <span>Total Amount Paid:</span>
                  <span>${selectedInvoice.totalAmount.toFixed(2)} USD</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button
                onClick={() => {
                  showToast(`Receipt PDF for ${selectedInvoice.invoiceNumber} downloaded.`);
                  setSelectedInvoice(null);
                }}
                className="px-4 py-2 bg-[#febd69] text-xs font-black text-slate-950 rounded-xl flex items-center space-x-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD API KEY */}
      {showAddApiKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white">Generate API Key</h3>
              <button onClick={() => setShowAddApiKeyModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Key Description / System Name</label>
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g. ERP Inventory System Key"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
              />
            </div>
            <div className="pt-2 flex justify-end space-x-2">
              <button onClick={() => setShowAddApiKeyModal(false)} className="px-3 py-1.5 bg-slate-800 text-xs font-bold text-slate-300 rounded-lg">Cancel</button>
              <button onClick={handleAddApiKey} className="px-4 py-1.5 bg-[#febd69] text-xs font-black text-slate-950 rounded-lg">Generate Secret Key</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: ADD WEBHOOK */}
      {showAddWebhookModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white">Register Webhook Endpoint</h3>
              <button onClick={() => setShowAddWebhookModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Event Type</label>
                <select
                  value={newWebhookEvent}
                  onChange={(e) => setNewWebhookEvent(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                >
                  <option value="ORDER_CREATED">ORDER_CREATED</option>
                  <option value="STOCK_LOW">STOCK_LOW</option>
                  <option value="INVENTORY_SYNC">INVENTORY_SYNC</option>
                  <option value="PAYMENT_RECEIVED">PAYMENT_RECEIVED</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Target Endpoint URL</label>
                <input
                  type="text"
                  value={newWebhookUrl}
                  onChange={(e) => setNewWebhookUrl(e.target.value)}
                  placeholder="https://api.yourdomain.com/webhooks"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono"
                />
              </div>
            </div>
            <div className="pt-2 flex justify-end space-x-2">
              <button onClick={() => setShowAddWebhookModal(false)} className="px-3 py-1.5 bg-slate-800 text-xs font-bold text-slate-300 rounded-lg">Cancel</button>
              <button onClick={handleAddWebhook} className="px-4 py-1.5 bg-[#febd69] text-xs font-black text-slate-950 rounded-lg">Add Webhook</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
