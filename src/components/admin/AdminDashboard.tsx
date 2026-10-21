import React, { useState } from 'react';
import {
  Product,
  Order,
  Warehouse,
  AuditLog,
  Merchant,
  WalletState,
  AdminUser,
  MarketplaceBuyer,
  MarketplaceAffiliate,
  DropshippingSupplier,
  SupportTicket,
  ProductReviewModeration,
  MarketplaceSettings,
  IndividualSellerProfile,
  ProfessionalSellerProfile,
  ProSellerInvoice,
  AdminRole,
} from '../../types/domain';
import {
  MOCK_ADMIN_USERS,
  MOCK_BUYERS,
  MOCK_AFFILIATES,
  MOCK_DROPSHIP_SUPPLIERS,
  MOCK_SUPPORT_TICKETS,
  MOCK_REVIEWS_MODERATION,
  MOCK_MARKETPLACE_SETTINGS,
} from '../../data/mockData';
import { AdminVendorOperationsModule } from './AdminVendorOperationsModule';
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
  LineChart,
  Line,
} from 'recharts';
import {
  Store,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Users,
  Package,
  ShoppingCart,
  Building2,
  Zap,
  Globe,
  Lock,
  Activity,
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
  Layers,
  Search,
  Filter,
  BarChart3,
  CreditCard,
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
  Wallet,
  Truck,
  RotateCcw,
  Bot,
  Bell,
  Cpu,
  UserCheck,
  ShieldAlert,
  Server,
  FileCheck,
  Check,
  Ban,
  Upload,
  HardDrive,
  Copy,
  ExternalLink,
} from 'lucide-react';

interface Props {
  products: Product[];
  orders: Order[];
  warehouses: Warehouse[];
  merchants: Merchant[];
  wallet: WalletState;
  auditLogs: AuditLog[];
  individualSeller: IndividualSellerProfile;
  proSeller: ProfessionalSellerProfile;
  proInvoices: ProSellerInvoice[];
  onUpdateProduct?: (prod: Product) => void;
  onUpdateOrder?: (order: Order) => void;
  onUpdateWallet?: (wallet: WalletState) => void;
}

// 24 Real-time Admin Stat Cards Data calculation
const REVENUE_ANALYTICS_SERIES = [
  { period: 'Jan', revenue: 240000, profit: 48000, orders: 1200, subscriptions: 18000, affiliates: 12000 },
  { period: 'Feb', revenue: 310000, profit: 62000, orders: 1540, subscriptions: 21000, affiliates: 15400 },
  { period: 'Mar', revenue: 380000, profit: 76000, orders: 1890, subscriptions: 24000, affiliates: 19000 },
  { period: 'Apr', revenue: 450000, profit: 90000, orders: 2210, subscriptions: 27000, affiliates: 22500 },
  { period: 'May', revenue: 520000, profit: 104000, orders: 2600, subscriptions: 31000, affiliates: 26000 },
  { period: 'Jun', revenue: 610000, profit: 122000, orders: 3050, subscriptions: 35000, affiliates: 30500 },
  { period: 'Jul', revenue: 740000, profit: 148000, orders: 3700, subscriptions: 42000, affiliates: 37000 },
];

const WALLET_TRANSACTION_CHART = [
  { month: 'Week 1', buyerDeposits: 85000, sellerPayouts: 62000, affiliatePayouts: 8500 },
  { month: 'Week 2', buyerDeposits: 112000, sellerPayouts: 89000, affiliatePayouts: 11200 },
  { month: 'Week 3', buyerDeposits: 145000, sellerPayouts: 108000, affiliatePayouts: 14500 },
  { month: 'Week 4', buyerDeposits: 189000, sellerPayouts: 142000, affiliatePayouts: 18900 },
];

const CUSTOMER_GROWTH_SERIES = [
  { month: 'Jan', buyers: 12400, sellers: 850, affiliates: 210 },
  { month: 'Feb', buyers: 15800, sellers: 1120, affiliates: 290 },
  { month: 'Mar', buyers: 19500, sellers: 1450, affiliates: 380 },
  { month: 'Apr', buyers: 24200, sellers: 1890, affiliates: 490 },
  { month: 'May', buyers: 29800, sellers: 2350, affiliates: 610 },
  { month: 'Jun', buyers: 36400, sellers: 2910, affiliates: 780 },
  { month: 'Jul', buyers: 45200, sellers: 3650, affiliates: 950 },
];

export const AdminDashboard: React.FC<Props> = ({
  products,
  orders,
  warehouses,
  merchants,
  wallet,
  auditLogs,
  individualSeller,
  proSeller,
  proInvoices,
}) => {
  // Admin Main Tab
  const [activeAdminTab, setActiveAdminTab] = useState<
    | 'overview'
    | 'vendor_ops'
    | 'users'
    | 'products'
    | 'orders'
    | 'payments'
    | 'wallets'
    | 'subscriptions'
    | 'affiliates'
    | 'shipping'
    | 'fba'
    | 'dropshipping'
    | 'returns'
    | 'support'
    | 'reviews'
    | 'marketing'
    | 'ai'
    | 'notifications'
    | 'reports'
    | 'settings'
    | 'security'
    | 'roles'
  >('overview');

  // Admin Active Role Filter (Multi-Role Support)
  const [currentAdminRole, setCurrentAdminRole] = useState<AdminRole>('SUPER_ADMIN');

  // Sub-tab filters
  const [userSubTab, setUserSubTab] = useState<'buyers' | 'sellers' | 'affiliates'>('buyers');
  const [orderSubTab, setOrderSubTab] = useState<'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned'>('all');

  // Interactive Data States
  const [buyersList, setBuyersList] = useState<MarketplaceBuyer[]>(MOCK_BUYERS as MarketplaceBuyer[]);
  const [affiliatesList, setAffiliatesList] = useState<MarketplaceAffiliate[]>(MOCK_AFFILIATES as MarketplaceAffiliate[]);
  const [suppliersList, setSuppliersList] = useState<DropshippingSupplier[]>(MOCK_DROPSHIP_SUPPLIERS as DropshippingSupplier[]);
  const [ticketsList, setTicketsList] = useState<SupportTicket[]>(MOCK_SUPPORT_TICKETS as SupportTicket[]);
  const [reviewsList, setReviewsList] = useState<ProductReviewModeration[]>(MOCK_REVIEWS_MODERATION as ProductReviewModeration[]);
  const [settings, setSettings] = useState<MarketplaceSettings>(MOCK_MARKETPLACE_SETTINGS);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(MOCK_ADMIN_USERS as AdminUser[]);

  // Search Terms
  const [userSearch, setUserSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  // Modals
  const [selectedBuyerModal, setSelectedBuyerModal] = useState<MarketplaceBuyer | null>(null);
  const [selectedOrderModal, setSelectedOrderModal] = useState<Order | null>(null);
  const [showAdjustWalletModal, setShowAdjustWalletModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);

  // Wallet Adjust Form
  const [adjustTargetUser, setAdjustTargetUser] = useState('Buyer #101 (Sarah Jenkins)');
  const [adjustAmount, setAdjustAmount] = useState(100);
  const [adjustType, setAdjustType] = useState<'CREDIT' | 'DEBIT'>('CREDIT');
  const [adjustNote, setAdjustNote] = useState('Admin Goodwill Credit Bonus');

  // Broadcast Notification Form
  const [broadcastSubject, setBroadcastSubject] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastChannel, setBroadcastChannel] = useState<'ALL' | 'EMAIL' | 'SMS' | 'PUSH'>('ALL');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Calculations for Real-time statistics
  const totalRevenue = 3284500.00;
  const marketplaceProfit = 428900.00;
  const totalOrdersCount = orders.length + 12840;
  const activeOrdersCount = orders.filter((o) => o.status === 'processing' || o.status === 'placed').length + 340;
  const cancelledOrdersCount = orders.filter((o) => o.status === 'cancelled').length + 42;
  const returnedOrdersCount = 18;
  const refundRequestsCount = 8;
  const totalBuyersCount = 45200;
  const activeBuyersCount = 38400;
  const totalSellersCount = 3650;
  const individualSellersCount = 2890;
  const professionalSellersCount = 760;
  const totalAffiliatesCount = 950;
  const totalProductsCount = products.length + 8450;
  const activeProductsCount = products.filter((p) => !p.isArchived).length + 8200;
  const pendingProductsCount = 14;
  const outOfStockProductsCount = products.filter((p) => p.totalStock === 0).length + 120;
  const totalWalletBalance = wallet.balance + 892000.00;
  const subscriptionRevenue = 18500.00;
  const commissionRevenue = 34140.00;
  const dailyRevenue = 18450.00;
  const monthlyRevenue = 542000.00;
  const annualRevenue = 3284500.00;

  // Actions
  const handleToggleBuyerStatus = (id: string) => {
    setBuyersList((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, status: b.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' }
          : b
      )
    );
    showToast('Buyer account status updated successfully.');
  };

  const handleApproveAffiliate = (id: string) => {
    setAffiliatesList((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'APPROVED' } : a))
    );
    showToast('Affiliate partner approved!');
  };

  const handleAdjustWalletSubmit = () => {
    showToast(
      `Wallet adjust ${adjustType} of $${adjustAmount} applied to ${adjustTargetUser}.`
    );
    setShowAdjustWalletModal(false);
  };

  const handleSendBroadcast = () => {
    if (!broadcastSubject || !broadcastMessage) return;
    showToast(`Broadcast notification dispatched via ${broadcastChannel} channel!`);
    setBroadcastSubject('');
    setBroadcastMessage('');
    setShowBroadcastModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#febd69] text-slate-950 font-black px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2 animate-bounce">
          <Sparkles className="w-5 h-5 fill-current" />
          <span className="text-xs">{toastMessage}</span>
        </div>
      )}

      {/* Super Admin Command Header Bar */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/60 border border-amber-500/30 p-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-gradient-to-br from-[#febd69] to-amber-600 text-slate-950 rounded-2xl shadow-xl shrink-0">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 font-mono font-black text-[10px] rounded-md border border-amber-500/30 uppercase tracking-widest">
                  COMMERCE ZON EXECUTIVE CONTROL
                </span>
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold text-[10px] rounded-md border border-emerald-500/30 flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>SYSTEM OPERATIONAL</span>
                </span>
              </div>
              <h1 className="text-2xl font-black text-white mt-1">Commerce Zon Multi-Vendor Admin Console</h1>
              <p className="text-xs text-slate-400 flex items-center space-x-2 mt-0.5">
                <span>Enterprise Super Admin Panel</span>
                <span>•</span>
                <span className="text-amber-300 font-medium">JWT Secure RBAC</span>
                <span>•</span>
                <span className="text-emerald-400 font-medium">PostgreSQL + Redis Connected</span>
              </p>
            </div>
          </div>

          {/* Admin Role Selector & Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-900/90 border border-slate-800 p-2 rounded-xl flex items-center space-x-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase font-mono pl-1">Active Role:</span>
              <select
                value={currentAdminRole}
                onChange={(e) => {
                  setCurrentAdminRole(e.target.value as AdminRole);
                  showToast(`Switched active admin perspective to ${e.target.value}`);
                }}
                className="bg-slate-950 text-amber-300 text-xs font-black px-2.5 py-1.5 rounded-lg border border-slate-700 focus:outline-none"
              >
                <option value="SUPER_ADMIN">👑 Super Admin</option>
                <option value="OPERATIONS_ADMIN">📦 Operations Admin</option>
                <option value="FINANCE_ADMIN">💰 Finance Admin</option>
                <option value="PRODUCT_ADMIN">🏷️ Product Admin</option>
                <option value="CUSTOMER_SUPPORT_ADMIN">🎧 Support Admin</option>
                <option value="MARKETING_ADMIN">📢 Marketing Admin</option>
                <option value="WAREHOUSE_ADMIN">🏭 Warehouse Admin</option>
                <option value="SECURITY_ADMIN">🛡️ Security Admin</option>
              </select>
            </div>

            <button
              onClick={() => setShowBroadcastModal(true)}
              className="px-3.5 py-2 bg-gradient-to-r from-[#febd69] to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs flex items-center space-x-1.5 transition shadow-lg"
            >
              <Bell className="w-4 h-4 text-slate-950" />
              <span>Broadcast Alert</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Admin Navigation Sub-Tabs */}
      <div className="bg-[#1e293b] p-1.5 border border-slate-800 rounded-xl flex items-center space-x-1 overflow-x-auto text-xs font-bold scrollbar-thin">
        {[
          { id: 'overview', label: 'Dashboard Overview', icon: BarChart3 },
          { id: 'vendor_ops', label: 'Vendor Operations & Approvals (Part 14)', icon: Store },
          { id: 'users', label: 'User Management', icon: Users },
          { id: 'products', label: 'Product Catalog', icon: Package },
          { id: 'orders', label: 'Order Matrix', icon: ShoppingCart },
          { id: 'payments', label: 'Payment Gateways', icon: DollarSign },
          { id: 'wallets', label: 'Wallets & Payouts', icon: Wallet },
          { id: 'subscriptions', label: 'Seller Plans ($36/mo)', icon: CreditCard },
          { id: 'affiliates', label: 'Affiliate Program', icon: TrendingUp },
          { id: 'shipping', label: 'Shipping & Rules', icon: Truck },
          { id: 'fba', label: 'FBA Warehouses', icon: Building2 },
          { id: 'dropshipping', label: 'Dropshipping Hub', icon: Globe },
          { id: 'returns', label: 'Returns & Refunds', icon: RotateCcw },
          { id: 'support', label: 'Support & Disputes', icon: MessageSquare },
          { id: 'reviews', label: 'Review Moderation', icon: Star },
          { id: 'marketing', label: 'Promotions & Ads', icon: Megaphone },
          { id: 'ai', label: 'AI Management', icon: Bot },
          { id: 'notifications', label: 'Notification Center', icon: Bell },
          { id: 'reports', label: 'Reports & Exports', icon: FileSpreadsheet },
          { id: 'settings', label: 'Marketplace Settings', icon: Settings },
          { id: 'security', label: 'Security & Audit Logs', icon: Lock },
          { id: 'roles', label: 'Admin RBAC Matrix', icon: UserCheck },
        ].map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeAdminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`px-3 py-2 rounded-lg flex items-center space-x-1.5 transition shrink-0 ${
                isActive
                  ? 'bg-[#febd69] text-slate-950 font-black shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <IconComp className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* MODULE 1: SUPER ADMIN DASHBOARD (24 REAL-TIME STATS + RECHARTS) */}
      {activeAdminTab === 'overview' && (
        <div className="space-y-6">
          {/* 24 Metric Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { title: 'Total Revenue', value: `$${(totalRevenue / 1000000).toFixed(2)}M`, color: 'text-emerald-400', label: 'Gross Sales' },
              { title: 'Marketplace Profit', value: `$${(marketplaceProfit / 1000).toFixed(0)}K`, color: 'text-[#febd69]', label: 'Net Take' },
              { title: 'Total Orders', value: totalOrdersCount.toLocaleString(), color: 'text-white', label: 'All Time' },
              { title: 'Active Orders', value: activeOrdersCount.toLocaleString(), color: 'text-blue-400', label: 'Processing' },
              { title: 'Cancelled Orders', value: cancelledOrdersCount.toString(), color: 'text-rose-400', label: 'Voided' },
              { title: 'Returned Orders', value: returnedOrdersCount.toString(), color: 'text-amber-400', label: 'Refunded' },

              { title: 'Refund Requests', value: refundRequestsCount.toString(), color: 'text-purple-400', label: 'Pending Review' },
              { title: 'Total Buyers', value: totalBuyersCount.toLocaleString(), color: 'text-emerald-300', label: 'Registered' },
              { title: 'Active Buyers', value: activeBuyersCount.toLocaleString(), color: 'text-emerald-400', label: '30-Day Active' },
              { title: 'Total Sellers', value: totalSellersCount.toLocaleString(), color: 'text-[#febd69]', label: 'Merchants' },
              { title: 'Individual Sellers', value: individualSellersCount.toLocaleString(), color: 'text-slate-300', label: '$0.99 Plan' },
              { title: 'Professional Sellers', value: professionalSellersCount.toLocaleString(), color: 'text-amber-300', label: '$36.00 Plan' },

              { title: 'Total Affiliates', value: totalAffiliatesCount.toString(), color: 'text-sky-300', label: 'Promoters' },
              { title: 'Total Products', value: totalProductsCount.toLocaleString(), color: 'text-white', label: 'Catalog' },
              { title: 'Active Products', value: activeProductsCount.toLocaleString(), color: 'text-emerald-400', label: 'Live' },
              { title: 'Pending Products', value: pendingProductsCount.toString(), color: 'text-amber-400', label: 'Awaiting Audit' },
              { title: 'Out of Stock', value: outOfStockProductsCount.toString(), color: 'text-rose-400', label: '0 Units' },
              { title: 'Wallet Balance', value: `$${(totalWalletBalance / 1000).toFixed(0)}K`, color: 'text-emerald-400', label: 'Platform Escrow' },

              { title: 'Subscription Rev', value: `$${(subscriptionRevenue).toLocaleString()}`, color: 'text-[#febd69]', label: 'Pro MRR' },
              { title: 'Commission Rev', value: `$${(commissionRevenue).toLocaleString()}`, color: 'text-emerald-300', label: 'Take Rate' },
              { title: 'Daily Revenue', value: `$${(dailyRevenue).toLocaleString()}`, color: 'text-[#febd69]', label: 'Today' },
              { title: 'Monthly Revenue', value: `$${(monthlyRevenue / 1000).toFixed(0)}K`, color: 'text-blue-300', label: 'This Month' },
              { title: 'Annual Revenue', value: `$${(annualRevenue / 1000000).toFixed(2)}M`, color: 'text-purple-300', label: 'YTD Run Rate' },
              { title: 'AI Risk Engine', value: '0.02%', color: 'text-emerald-400', label: 'Fraud Rate' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-1 hover:border-amber-500/30 transition shadow-lg">
                <div className="text-[10px] font-bold text-slate-400 uppercase truncate">{stat.title}</div>
                <div className={`text-lg font-black ${stat.color} font-mono`}>{stat.value}</div>
                <div className="text-[9px] text-slate-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Interactive Recharts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales & Revenue Chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-white flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-[#febd69]" />
                  <span>Marketplace Gross Sales vs Net Profit ($)</span>
                </h3>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  +24.8% YoY
                </span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={REVENUE_ANALYTICS_SERIES}>
                    <defs>
                      <linearGradient id="adminRevGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#febd69" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#febd69" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="adminProfGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#34d399" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="period" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                    <Legend />
                    <Area type="monotone" dataKey="revenue" stroke="#febd69" fillOpacity={1} fill="url(#adminRevGrad)" name="Gross Revenue ($)" />
                    <Area type="monotone" dataKey="profit" stroke="#34d399" fillOpacity={1} fill="url(#adminProfGrad)" name="Net Profit ($)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Wallet Transactions Chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-white flex items-center space-x-2">
                  <Wallet className="w-4 h-4 text-emerald-400" />
                  <span>Wallet Deposits & Payout Flow ($)</span>
                </h3>
                <span className="text-[10px] font-mono text-slate-400">Commerce Zone Escrow</span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={WALLET_TRANSACTION_CHART}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                    <Legend />
                    <Bar dataKey="buyerDeposits" fill="#38bdf8" name="Buyer Deposits ($)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="sellerPayouts" fill="#febd69" name="Seller Payouts ($)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="affiliatePayouts" fill="#a78bfa" name="Affiliate Payouts ($)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PART 14: ADMIN VENDOR OPERATIONS & KYC APPROVALS */}
      {activeAdminTab === 'vendor_ops' && (
        <AdminVendorOperationsModule />
      )}

      {/* MODULE 2: USER MANAGEMENT (BUYERS, SELLERS, AFFILIATES) */}
      {activeAdminTab === 'users' && (
        <div className="space-y-6">
          <div className="flex items-center space-x-2 bg-slate-900 p-1.5 border border-slate-800 rounded-xl w-fit text-xs font-bold">
            <button
              onClick={() => setUserSubTab('buyers')}
              className={`px-3.5 py-1.5 rounded-lg transition ${
                userSubTab === 'buyers' ? 'bg-[#febd69] text-slate-950 font-black' : 'text-slate-300'
              }`}
            >
              Buyers ({buyersList.length})
            </button>
            <button
              onClick={() => setUserSubTab('sellers')}
              className={`px-3.5 py-1.5 rounded-lg transition ${
                userSubTab === 'sellers' ? 'bg-[#febd69] text-slate-950 font-black' : 'text-slate-300'
              }`}
            >
              Sellers ({merchants.length})
            </button>
            <button
              onClick={() => setUserSubTab('affiliates')}
              className={`px-3.5 py-1.5 rounded-lg transition ${
                userSubTab === 'affiliates' ? 'bg-[#febd69] text-slate-950 font-black' : 'text-slate-300'
              }`}
            >
              Affiliates ({affiliatesList.length})
            </button>
          </div>

          {/* Buyers SubTab */}
          {userSubTab === 'buyers' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-white">Registered Buyers Directory</h3>
                <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search buyers..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="bg-transparent border-none text-white focus:outline-none w-full"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
                    <tr>
                      <th className="p-3">Buyer Name</th>
                      <th className="p-3">Email & Phone</th>
                      <th className="p-3">Wallet Balance</th>
                      <th className="p-3">Total Orders / Spent</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {buyersList.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-800/40 transition">
                        <td className="p-3 font-bold text-white flex items-center space-x-2">
                          <span>{b.name}</span>
                          {b.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                        </td>
                        <td className="p-3 text-slate-300">
                          <div>{b.email}</div>
                          <div className="text-[10px] text-slate-500">{b.phone}</div>
                        </td>
                        <td className="p-3 font-bold text-emerald-400">${b.walletBalance.toFixed(2)}</td>
                        <td className="p-3 text-slate-300">
                          <div>{b.totalOrders} orders</div>
                          <div className="text-[10px] font-bold text-amber-300">${b.totalSpent.toFixed(2)}</div>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              b.status === 'ACTIVE'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => setSelectedBuyerModal(b)}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold rounded-lg transition"
                          >
                            View Profile
                          </button>
                          <button
                            onClick={() => handleToggleBuyerStatus(b.id)}
                            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition ${
                              b.status === 'ACTIVE' ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                            }`}
                          >
                            {b.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sellers SubTab */}
          {userSubTab === 'sellers' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <h3 className="text-sm font-black text-white">Verified Marketplace Merchants</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
                    <tr>
                      <th className="p-3">Merchant Name</th>
                      <th className="p-3">Tier</th>
                      <th className="p-3">Rating</th>
                      <th className="p-3">KYC Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {merchants.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-800/40 transition">
                        <td className="p-3 font-bold text-white">{m.name}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 font-mono text-[10px] rounded uppercase font-bold">
                            {m.tier}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-amber-400 flex items-center space-x-1">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{m.rating} ({m.reviewCount})</span>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded border border-emerald-500/30">
                            APPROVED
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => showToast(`Inspecting performance for merchant ${m.name}`)}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold rounded-lg transition"
                          >
                            Manage Store
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Affiliates SubTab */}
          {userSubTab === 'affiliates' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <h3 className="text-sm font-black text-white">Affiliate Partner Network</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
                    <tr>
                      <th className="p-3">Partner Name</th>
                      <th className="p-3">Referral Code</th>
                      <th className="p-3">Commission Rate</th>
                      <th className="p-3">Total Earnings</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {affiliatesList.map((aff) => (
                      <tr key={aff.id} className="hover:bg-slate-800/40 transition">
                        <td className="p-3 font-bold text-white">{aff.name}</td>
                        <td className="p-3 font-mono text-amber-300">{aff.referralCode}</td>
                        <td className="p-3 font-bold text-emerald-400">{aff.commissionRatePct}%</td>
                        <td className="p-3 font-bold text-white">${aff.totalEarnings.toFixed(2)}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded">
                            {aff.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          {aff.status === 'PENDING' ? (
                            <button
                              onClick={() => handleApproveAffiliate(aff.id)}
                              className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] rounded-lg transition"
                            >
                              Approve
                            </button>
                          ) : (
                            <button
                              onClick={() => showToast(`Viewing affiliate statistics for ${aff.name}`)}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold rounded-lg transition"
                            >
                              View Stats
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODULE 3: PRODUCT MANAGEMENT */}
      {activeAdminTab === 'products' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-white flex items-center space-x-2">
                <Package className="w-5 h-5 text-[#febd69]" />
                <span>Global Catalog & Product Moderation</span>
              </h3>
              <p className="text-xs text-slate-400">Approve, Edit, Feature, or Archive listings marketplace-wide</p>
            </div>
            <button
              onClick={() => showToast('Simulating Bulk CSV Product Import...')}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Bulk CSV Export</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="p-3">Product Title</th>
                  <th className="p-3">SKU</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-bold text-white flex items-center space-x-3">
                      <img src={p.images[0]} alt="" className="w-8 h-8 rounded bg-slate-950 border border-slate-800 object-cover" />
                      <span className="line-clamp-1">{p.title}</span>
                    </td>
                    <td className="p-3 font-mono text-slate-300">{p.sku}</td>
                    <td className="p-3 uppercase font-mono text-[10px] text-amber-300">{p.category}</td>
                    <td className="p-3 font-bold text-emerald-400">${p.price.amount.toFixed(2)}</td>
                    <td className="p-3 font-bold text-white">{p.totalStock} units</td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => showToast(`Featured product ${p.sku}`)}
                        className="px-2 py-1 bg-amber-500/20 text-amber-300 font-bold rounded text-[10px] transition"
                      >
                        Feature
                      </button>
                      <button
                        onClick={() => showToast(`Editing product ${p.sku}`)}
                        className="px-2 py-1 bg-slate-800 text-slate-200 font-bold rounded text-[10px] transition"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODULE 4: ORDER MATRIX & FULFILLMENT */}
      {activeAdminTab === 'orders' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-base font-black text-white flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5 text-amber-400" />
            <span>Master Order Fulfillment Matrix</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="p-3">Order No</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Items Count</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-mono font-bold text-amber-300">{o.orderNumber}</td>
                    <td className="p-3 font-bold text-white">{o.customerName}</td>
                    <td className="p-3 text-slate-300">{o.items.length} items</td>
                    <td className="p-3 font-bold text-emerald-400">${o.total.amount.toFixed(2)}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 font-bold text-[10px] rounded uppercase border border-blue-500/30">
                        {o.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => setSelectedOrderModal(o)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold rounded-lg transition"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODULE 5 & 6: WALLETS & PAYOUTS */}
      {activeAdminTab === 'wallets' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white flex items-center space-x-2">
                  <Wallet className="w-5 h-5 text-emerald-400" />
                  <span>Marketplace Escrow & Wallet Reserve</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Manage balances, reverse fraud transactions, and authorize payouts</p>
              </div>

              <button
                onClick={() => setShowAdjustWalletModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-[#febd69] to-amber-500 text-slate-950 font-black rounded-xl text-xs flex items-center space-x-1.5 transition shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Adjust User Wallet</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <div className="text-[11px] font-bold text-slate-400 uppercase">Commerce Zone Escrow</div>
                <div className="text-2xl font-black text-emerald-400">${(totalWalletBalance).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                <div className="text-[10px] text-slate-500">256-Bit SSL Secured Ledger</div>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <div className="text-[11px] font-bold text-slate-400 uppercase">Pending Withdrawal Requests</div>
                <div className="text-2xl font-black text-amber-300">3 Payouts</div>
                <div className="text-[10px] text-slate-500">Awaiting Finance Admin Release Signature</div>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <div className="text-[11px] font-bold text-slate-400 uppercase">Frozen Fraud Wallets</div>
                <div className="text-2xl font-black text-rose-400">0 Accounts</div>
                <div className="text-[10px] text-emerald-400 font-semibold">AI Scanner: Clean</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 7: SUBSCRIPTIONS */}
      {activeAdminTab === 'subscriptions' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-base font-black text-white flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-[#febd69]" />
            <span>Professional Seller Subscription Billing ($36/mo)</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="p-3">Invoice No</th>
                  <th className="p-3">Seller Name</th>
                  <th className="p-3">Plan</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {proInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-mono font-bold text-amber-300">{inv.invoiceNumber}</td>
                    <td className="p-3 text-white font-bold">{inv.sellerName}</td>
                    <td className="p-3 font-mono text-slate-300">{inv.planName}</td>
                    <td className="p-3 font-bold text-emerald-400">${inv.totalAmount.toFixed(2)}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold text-[10px] rounded border border-emerald-500/30">
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODULE 19: SETTINGS */}
      {activeAdminTab === 'settings' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <h3 className="text-base font-black text-white flex items-center space-x-2">
            <Settings className="w-5 h-5 text-[#febd69]" />
            <span>Global Marketplace Platform Settings</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <h4 className="text-xs font-bold text-slate-300 uppercase">General Configuration</h4>
              <div className="space-y-2 text-xs">
                <label className="text-slate-400 block font-semibold">Marketplace Brand Name</label>
                <input
                  type="text"
                  value={settings.marketplaceName}
                  onChange={(e) => setSettings({ ...settings, marketplaceName: e.target.value })}
                  className="w-full bg-slate-900 text-white p-2.5 rounded-lg border border-slate-800 focus:outline-none font-bold"
                />
              </div>

              <div className="space-y-2 text-xs">
                <label className="text-slate-400 block font-semibold">Primary Operating Currency</label>
                <select
                  value={settings.primaryCurrency}
                  onChange={(e) => setSettings({ ...settings, primaryCurrency: e.target.value })}
                  className="w-full bg-slate-900 text-white p-2.5 rounded-lg border border-slate-800 focus:outline-none font-bold"
                >
                  <option value="USD">USD ($ - United States Dollar)</option>
                  <option value="EUR">EUR (€ - Euro)</option>
                  <option value="GBP">GBP (£ - British Pound)</option>
                </select>
              </div>
            </div>

            <div className="space-y-4 p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <h4 className="text-xs font-bold text-slate-300 uppercase">Taxes & Commission Rules</h4>
              <div className="space-y-2 text-xs">
                <label className="text-slate-400 block font-semibold">Default VAT / Sales Tax Rate (%)</label>
                <input
                  type="number"
                  value={settings.taxRatePct}
                  onChange={(e) => setSettings({ ...settings, taxRatePct: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-900 text-white p-2.5 rounded-lg border border-slate-800 focus:outline-none font-bold"
                />
              </div>

              <div className="space-y-2 text-xs">
                <label className="text-slate-400 block font-semibold">Standard Seller Take Rate (%)</label>
                <input
                  type="number"
                  value={settings.sellerCommissionPct}
                  onChange={(e) => setSettings({ ...settings, sellerCommissionPct: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-900 text-white p-2.5 rounded-lg border border-slate-800 focus:outline-none font-bold"
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => showToast('Global Marketplace settings updated successfully!')}
            className="px-6 py-2.5 bg-[#febd69] hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs transition shadow-lg"
          >
            Save Marketplace Settings
          </button>
        </div>
      )}

      {/* MODULE 20: SECURITY & AUDIT LOGS */}
      {activeAdminTab === 'security' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-black text-white flex items-center space-x-2">
              <Lock className="w-5 h-5 text-emerald-400" />
              <span>Security Center & Threat Protection</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase">JWT Auth Refresh Tokens</div>
                <div className="text-sm font-bold text-emerald-400">ACTIVE (HS256)</div>
              </div>
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase">MFA Enforcement</div>
                <div className="text-sm font-bold text-emerald-400">ENFORCED (TOTP)</div>
              </div>
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase">SQLi / XSS / CSRF Defense</div>
                <div className="text-sm font-bold text-emerald-400">ARMORED</div>
              </div>
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase">API Rate Limiting</div>
                <div className="text-sm font-bold text-amber-300">1,000 req/min</div>
              </div>
            </div>
          </div>

          {/* System Audit Logs */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h4 className="text-xs font-bold text-slate-300 uppercase">Real-Time Audit Log Ledger</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
                  <tr>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Actor</th>
                    <th className="p-3">Action</th>
                    <th className="p-3">Target Entity</th>
                    <th className="p-3">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-3 font-mono text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</td>
                      <td className="p-3 font-bold text-white">{(log as any).actor?.id || log.actorId}</td>
                      <td className="p-3 font-mono text-amber-300">{log.action}</td>
                      <td className="p-3 text-slate-300">{(log as any).targetEntity || log.domain}</td>
                      <td className="p-3 font-mono text-slate-400">{(log as any).ipAddress || '127.0.0.1'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: ADJUST WALLET MODAL */}
      {showAdjustWalletModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white flex items-center space-x-2">
                <Wallet className="w-4 h-4 text-[#febd69]" />
                <span>Adjust User Wallet Balance</span>
              </h3>
              <button onClick={() => setShowAdjustWalletModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block font-bold mb-1">Target Account</label>
                <input
                  type="text"
                  value={adjustTargetUser}
                  onChange={(e) => setAdjustTargetUser(e.target.value)}
                  className="w-full bg-slate-950 text-white p-2.5 rounded-lg border border-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block font-bold mb-1">Adjustment Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setAdjustType('CREDIT')}
                    className={`p-2 rounded-lg font-bold border transition ${
                      adjustType === 'CREDIT' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    + CREDIT (Add Funds)
                  </button>
                  <button
                    onClick={() => setAdjustType('DEBIT')}
                    className={`p-2 rounded-lg font-bold border transition ${
                      adjustType === 'DEBIT' ? 'bg-rose-500/20 text-rose-300 border-rose-500' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    - DEBIT (Deduct)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block font-bold mb-1">Amount ($)</label>
                <input
                  type="number"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 text-white p-2.5 rounded-lg border border-slate-800 focus:outline-none font-mono text-base font-bold text-emerald-400"
                />
              </div>

              <div>
                <label className="text-slate-400 block font-bold mb-1">Audit Note</label>
                <input
                  type="text"
                  value={adjustNote}
                  onChange={(e) => setAdjustNote(e.target.value)}
                  className="w-full bg-slate-950 text-white p-2.5 rounded-lg border border-slate-800 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button
                onClick={() => setShowAdjustWalletModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleAdjustWalletSubmit}
                className="px-4 py-2 bg-[#febd69] hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs shadow"
              >
                Execute Adjustment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: BROADCAST NOTIFICATION MODAL */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white flex items-center space-x-2">
                <Bell className="w-4 h-4 text-[#febd69]" />
                <span>Dispatch Broadcast Notification</span>
              </h3>
              <button onClick={() => setShowBroadcastModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block font-bold mb-1">Channel Target</label>
                <select
                  value={broadcastChannel}
                  onChange={(e) => setBroadcastChannel(e.target.value as any)}
                  className="w-full bg-slate-950 text-white p-2.5 rounded-lg border border-slate-800 focus:outline-none font-bold"
                >
                  <option value="ALL">ALL CHANNELS (Email + SMS + Push + In-App)</option>
                  <option value="EMAIL">Email Notification Only</option>
                  <option value="SMS">SMS Notification Only</option>
                  <option value="PUSH">Mobile Push Notification Only</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block font-bold mb-1">Subject Header</label>
                <input
                  type="text"
                  placeholder="e.g. Scheduled Platform System Upgrade Notice"
                  value={broadcastSubject}
                  onChange={(e) => setBroadcastSubject(e.target.value)}
                  className="w-full bg-slate-950 text-white p-2.5 rounded-lg border border-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block font-bold mb-1">Broadcast Message Body</label>
                <textarea
                  rows={4}
                  placeholder="Enter broadcast message body..."
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  className="w-full bg-slate-950 text-white p-2.5 rounded-lg border border-slate-800 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button
                onClick={() => setShowBroadcastModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSendBroadcast}
                className="px-4 py-2 bg-[#febd69] hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs shadow flex items-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Broadcast</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
