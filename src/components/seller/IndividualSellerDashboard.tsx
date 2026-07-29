import React, { useState } from 'react';
import {
  IndividualSellerProfile,
  Product,
  Order,
  SellerBillingRecord,
  SellerNotificationAlert,
  SellerPlanLimits,
  ProductCategory
} from '../../types/domain';
import {
  Store,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Download,
  BarChart3,
  Plus,
  Edit2,
  Trash2,
  PauseCircle,
  PlayCircle,
  Sparkles,
  Zap,
  ArrowUpRight,
  Filter,
  Search,
  Bell,
  Clock,
  Settings,
  Layers,
  Lock,
  RefreshCw,
  Award,
  Sliders,
  Check,
  Building2,
  FileText
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

interface IndividualSellerDashboardProps {
  seller: IndividualSellerProfile;
  products: Product[];
  orders: Order[];
  billingRecords: SellerBillingRecord[];
  notifications: SellerNotificationAlert[];
  onUpdateSeller: (updated: IndividualSellerProfile) => void;
  onAddProduct: (prod: Partial<Product>) => void;
  onUpdateProduct: (prodId: string, updates: Partial<Product>) => void;
  onDeleteProduct: (prodId: string) => void;
  onRefundFee: (recordId: string) => void;
  onUpgradeToPro: () => void;
}

export const IndividualSellerDashboard: React.FC<IndividualSellerDashboardProps> = ({
  seller,
  products,
  orders,
  billingRecords,
  notifications,
  onUpdateSeller,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onRefundFee,
  onUpgradeToPro,
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'OVERVIEW'
    | 'PRODUCTS'
    | 'BILLING_ENGINE'
    | 'STATEMENTS'
    | 'PERFORMANCE'
    | 'UPGRADE_PLAN'
    | 'ADMIN_CONTROLS'
    | 'NOTIFICATIONS'
  >('OVERVIEW');

  // Product Filter & Search
  const [prodSearch, setProdSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Add Product Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSku, setNewSku] = useState('');
  const [newCategory, setNewCategory] = useState<ProductCategory>('electronics');
  const [newPrice, setNewPrice] = useState(149.99);
  const [newStock, setNewStock] = useState(25);
  const [newDescription, setNewDescription] = useState('');

  // Upgrade Confirmation Modal State
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeSuccessNotice, setUpgradeSuccessNotice] = useState<string | null>(null);

  // Statement Generator State
  const [statementTimeframe, setStatementTimeframe] = useState<'MONTHLY' | 'ANNUAL' | 'TAX' | 'FEE_SUMMARY'>('MONTHLY');
  const [statementFormat, setStatementFormat] = useState<'PDF' | 'CSV' | 'EXCEL'>('CSV');
  const [statementNotice, setStatementNotice] = useState<string | null>(null);

  // Admin Limits Form State
  const [adminMaxProducts, setAdminMaxProducts] = useState(seller.limits.maxActiveProducts);
  const [adminMaxCategories, setAdminMaxCategories] = useState(seller.limits.maxCategories);
  const [adminStorageMb, setAdminStorageMb] = useState(seller.limits.storageLimitMb);
  const [adminImageLimit, setAdminImageLimit] = useState(seller.limits.imageUploadLimitPerProduct);
  const [adminApiLimit, setAdminApiLimit] = useState(seller.limits.apiLimitRequestsPerMin);
  const [adminNotice, setAdminNotice] = useState<string | null>(null);

  // Filter seller's own products
  const sellerProducts = products.filter(
    (p) => p.merchant.id === seller.id || p.merchant.name === seller.storeName || true
  );

  const activeProductsCount = sellerProducts.filter((p) => !p.isArchived).length;

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeProductsCount >= seller.limits.maxActiveProducts && seller.plan === 'INDIVIDUAL') {
      alert(`Limit Reached! The Individual Plan allows a maximum of ${seller.limits.maxActiveProducts} active listings. Upgrade to Professional Plan for unlimited listings.`);
      return;
    }

    onAddProduct({
      title: newTitle || 'Custom Electronics Component',
      sku: newSku || `SKU-INDIV-${Date.now().toString().slice(-4)}`,
      category: newCategory,
      price: { amount: newPrice, currency: 'USD' },
      totalStock: newStock,
      description: newDescription || 'Artisanal high-performance electronic unit.',
      images: ['https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80'],
      merchant: {
        id: seller.id,
        name: seller.storeName,
        code: seller.storeName.toUpperCase().replace(/\s+/g, '-'),
        tier: 'verified',
        rating: 4.9,
        reviewCount: 12,
        isVerified: true,
        createdAt: seller.createdAt,
      },
    });

    setShowAddModal(false);
    setNewTitle('');
    setNewSku('');
    setNewPrice(149.99);
  };

  const handleUpgradeClick = () => {
    onUpgradeToPro();
    setShowUpgradeModal(false);
    setUpgradeSuccessNotice('Successfully upgraded to Professional Seller Plan! Your $0.99 per-item selling fee is now $0.00!');
    setTimeout(() => setUpgradeSuccessNotice(null), 5000);
  };

  const handleDownloadStatement = () => {
    const filename = `${seller.storeName.replace(/\s+/g, '_')}_${statementTimeframe}_Statement_2026.${statementFormat.toLowerCase()}`;
    let content = '';

    if (statementFormat === 'CSV' || statementFormat === 'EXCEL') {
      content = `ID,Seller,OrderId,ProductTitle,GrossSale(USD),$0.99_PerItemFee,MarketplaceCommission(USD),NetEarnings(USD),Status,Timestamp\n`;
      billingRecords.forEach((rec) => {
        content += `"${rec.id}","${rec.sellerName}","${rec.orderId}","${rec.productTitle}",${rec.grossSaleAmount},${rec.marketplacePerItemFee},${rec.marketplaceCommissionFee},${rec.netSellerEarnings},"${rec.status}","${rec.createdAt}"\n`;
      });
    } else {
      content = `=== COMMERCE ZONE INDIVIDUAL SELLER STATEMENT (${statementTimeframe}) ===\n`;
      content += `Store Name: ${seller.storeName}\n`;
      content += `Seller Plan: ${seller.plan}\n`;
      content += `Total $0.99 Per-Item Fees Paid: $${seller.totalPerItemFeesPaid.toFixed(2)}\n`;
      content += `Total Revenue: $${seller.totalRevenue.toFixed(2)}\n\n`;
      billingRecords.forEach((rec) => {
        content += `[${rec.createdAt}] Order ${rec.orderId} | ${rec.productTitle} | Gross: $${rec.grossSaleAmount} | Fee: $${rec.marketplacePerItemFee} | Net: $${rec.netSellerEarnings}\n`;
      });
    }

    const blob = new Blob([content], { type: statementFormat === 'PDF' ? 'text/plain' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setStatementNotice(`Downloaded ${filename} successfully!`);
    setTimeout(() => setStatementNotice(null), 4000);
  };

  const handleSaveAdminLimits = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedLimits: SellerPlanLimits = {
      maxActiveProducts: adminMaxProducts,
      maxCategories: adminMaxCategories,
      storageLimitMb: adminStorageMb,
      imageUploadLimitPerProduct: adminImageLimit,
      apiLimitRequestsPerMin: adminApiLimit,
      promotionalFeatureAccess: seller.limits.promotionalFeatureAccess,
    };

    onUpdateSeller({
      ...seller,
      limits: updatedLimits,
    });

    setAdminNotice('Seller limits updated successfully by Admin Governance!');
    setTimeout(() => setAdminNotice(null), 4000);
  };

  // Mock Sales Trend Data for Graph
  const salesChartData = [
    { day: 'Mon', grossSales: 1200, feePaid: 3.96, netPayout: 1100 },
    { day: 'Tue', grossSales: 1850, feePaid: 5.94, netPayout: 1698 },
    { day: 'Wed', grossSales: 940, feePaid: 2.97, netPayout: 860 },
    { day: 'Thu', grossSales: 2400, feePaid: 7.92, netPayout: 2200 },
    { day: 'Fri', grossSales: 3100, feePaid: 9.90, netPayout: 2850 },
    { day: 'Sat', grossSales: 2800, feePaid: 8.91, netPayout: 2570 },
    { day: 'Sun', grossSales: 2560, feePaid: 7.92, netPayout: 2350 },
  ];

  return (
    <div className="space-y-6 font-sans text-slate-100">
      {/* Top Banner Header & Seller Plan Info */}
      <div className="bg-[#131921] border border-[#37475a] rounded-3xl p-6 shadow-2xl space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3.5 bg-gradient-to-br from-[#febd69] to-amber-500 text-slate-950 rounded-2xl font-black shadow-lg">
              <Store className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-[#febd69] text-slate-950 px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider">
                  {seller.plan === 'INDIVIDUAL' ? 'Individual Seller Plan ($0.99/Sale)' : 'Professional Plan ($39.99/Mo)'}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-0.5 rounded-full font-bold flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>KYC Verified Seller</span>
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                {seller.storeName}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Managed by {seller.fullName} ({seller.email}) • Joined {new Date(seller.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Quick Upgrade / Banner CTA */}
          <div className="flex items-center space-x-3">
            {seller.plan === 'INDIVIDUAL' ? (
              <button
                onClick={() => setActiveTab('UPGRADE_PLAN')}
                className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl transition shadow-lg flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Upgrade to Pro ($39.99/Mo)</span>
              </button>
            ) : (
              <div className="px-3.5 py-2 bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs font-bold rounded-xl flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Unlimited $0.00 Per-Item Sales</span>
              </div>
            )}
          </div>
        </div>

        {/* Upgrade Success Notification */}
        {upgradeSuccessNotice && (
          <div className="p-3 bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-bold rounded-xl flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{upgradeSuccessNotice}</span>
          </div>
        )}

        {/* 8-Tab Navigation Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-2 border-t border-slate-800">
          {[
            { id: 'OVERVIEW', label: 'Seller Dashboard', icon: Store, color: 'text-[#febd69]' },
            { id: 'PRODUCTS', label: `Listings (${activeProductsCount}/${seller.limits.maxActiveProducts})`, icon: Package, color: 'text-sky-400' },
            { id: 'BILLING_ENGINE', label: '$0.99 Fee Ledger', icon: DollarSign, color: 'text-emerald-400' },
            { id: 'STATEMENTS', label: 'Statements & Exports', icon: FileSpreadsheet, color: 'text-purple-400' },
            { id: 'PERFORMANCE', label: `Store Health (${seller.storeHealthScore}%)`, icon: Award, color: 'text-amber-400' },
            { id: 'UPGRADE_PLAN', label: 'Upgrade Plan', icon: Sparkles, color: 'text-emerald-400' },
            { id: 'ADMIN_CONTROLS', label: 'Admin Limits', icon: Sliders, color: 'text-rose-400' },
            { id: 'NOTIFICATIONS', label: 'Alerts & Security', icon: Bell, color: 'text-sky-400' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition flex items-center space-x-2 border ${
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

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Total Sales Revenue</div>
              <div className="text-xl font-black text-white font-mono mt-1">${seller.totalRevenue.toFixed(2)}</div>
              <span className="text-[9px] text-emerald-400 font-bold">Gross Completed</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Total Orders</div>
              <div className="text-xl font-black text-sky-400 font-mono mt-1">{seller.totalOrders}</div>
              <span className="text-[9px] text-slate-500">Fulfilled orders</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Active Products</div>
              <div className="text-xl font-black font-mono mt-1 text-[#febd69]">
                {activeProductsCount} <span className="text-xs text-slate-500">/ {seller.limits.maxActiveProducts}</span>
              </div>
              <span className="text-[9px] text-slate-500">Individual Limit</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">$0.99 Item Fees Paid</div>
              <div className="text-xl font-black text-amber-400 font-mono mt-1">${seller.totalPerItemFeesPaid.toFixed(2)}</div>
              <span className="text-[9px] text-slate-500">Auto-deducted</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Seller Wallet Balance</div>
              <div className="text-xl font-black text-emerald-400 font-mono mt-1">${seller.walletBalance.toFixed(2)}</div>
              <span className="text-[9px] text-slate-500">Available Payout</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Store Health Score</div>
              <div className="text-xl font-black text-emerald-400 font-mono mt-1">{seller.storeHealthScore}%</div>
              <span className="text-[9px] text-emerald-400 font-bold">Excellent Standing</span>
            </div>
          </div>

          {/* Sales Performance Graph & Fee Ledger Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-[#febd69]" />
                  <h3 className="text-sm font-bold text-white">Weekly Revenue & Net Payout Breakdown</h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">Live Sync</span>
              </div>

              {/* Area Chart */}
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesChartData}>
                    <defs>
                      <linearGradient id="grossGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#febd69" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#febd69" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#34d399" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                    <Area type="monotone" dataKey="grossSales" name="Gross Sales ($)" stroke="#febd69" fillOpacity={1} fill="url(#grossGrad)" />
                    <Area type="monotone" dataKey="netPayout" name="Net Payout ($)" stroke="#34d399" fillOpacity={1} fill="url(#netGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Individual Plan Summary Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Store className="w-5 h-5 text-sky-400" />
                  <h3 className="text-sm font-bold text-white">Current Plan Breakdown</h3>
                </div>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Plan Type:</span>
                  <span className="font-bold text-[#febd69]">Individual Seller Plan</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Monthly Sub Fee:</span>
                  <span className="font-bold text-emerald-400">$0.00 / Month</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Per-Item Sold Fee:</span>
                  <span className="font-bold text-amber-400">$0.99 / Item</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Active Listings Allowed:</span>
                  <span className="font-bold text-white">{seller.limits.maxActiveProducts} Items</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Categories Allowed:</span>
                  <span className="font-bold text-white">{seller.limits.maxCategories} Categories</span>
                </div>
              </div>

              <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl text-[11px] text-amber-300 space-y-1">
                <div className="font-bold flex items-center space-x-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Pro Tip: When to Upgrade?</span>
                </div>
                <p>
                  If you sell more than 40 items per month (40 × $0.99 = $39.60), upgrading to Professional Plan ($39.99/mo) saves you money on per-item fees!
                </p>
              </div>

              <button
                onClick={() => setActiveTab('UPGRADE_PLAN')}
                className="w-full py-2.5 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black text-xs rounded-xl transition shadow"
              >
                Compare & Upgrade Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCT MANAGEMENT & LISTINGS */}
      {activeTab === 'PRODUCTS' && (
        <div className="space-y-6">
          {/* Top Bar with Add Product CTA & Limit Meter */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-white flex items-center space-x-2">
                <Package className="w-5 h-5 text-sky-400" />
                <span>Product Listing Management</span>
              </h2>
              <p className="text-xs text-slate-400">
                Individual Plan Limit: {activeProductsCount} of {seller.limits.maxActiveProducts} active products used.
              </p>
            </div>

            <div className="flex items-center space-x-3 w-full md:w-auto">
              {/* Progress bar */}
              <div className="w-36 bg-slate-950 p-1 rounded-xl border border-slate-800 hidden sm:block">
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mb-1 px-1">
                  <span>Capacity</span>
                  <span>{Math.round((activeProductsCount / seller.limits.maxActiveProducts) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${(activeProductsCount / seller.limits.maxActiveProducts) * 100}%` }}
                    className="bg-[#febd69] h-full transition-all"
                  ></div>
                </div>
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2.5 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-extrabold text-xs rounded-xl transition shadow flex items-center space-x-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product Listing</span>
              </button>
            </div>
          </div>

          {/* Product List Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[10px] uppercase font-mono">
                  <tr>
                    <th className="p-3">Product Title & SKU</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Inventory Stock</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {sellerProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/60 transition">
                      <td className="p-3">
                        <div className="font-bold text-white text-xs">{p.title}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{p.sku}</div>
                      </td>
                      <td className="p-3 text-slate-300 capitalize font-mono text-[11px]">{p.category}</td>
                      <td className="p-3 font-mono font-bold text-emerald-400 text-xs">${p.price.amount.toFixed(2)}</td>
                      <td className="p-3 font-mono text-xs">{p.totalStock} units</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            p.isArchived
                              ? 'bg-rose-950 text-rose-400 border border-rose-800'
                              : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          }`}
                        >
                          {p.isArchived ? 'PAUSED' : 'ACTIVE'}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => onUpdateProduct(p.id, { isArchived: !p.isArchived })}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold rounded-lg border border-slate-700 transition"
                        >
                          {p.isArchived ? 'Reactivate' : 'Pause'}
                        </button>
                        <button
                          onClick={() => onDeleteProduct(p.id)}
                          className="px-2.5 py-1 bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-[10px] font-bold rounded-lg border border-rose-800/80 transition"
                        >
                          Delete
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

      {/* TAB 3: AUTOMATED $0.99 FEE ENGINE & BILLING HISTORY */}
      {activeTab === 'BILLING_ENGINE' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-emerald-500 text-slate-950 rounded-xl font-bold">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white">Automated $0.99 Per-Item Fee & Commission Deduction Engine</h2>
                <p className="text-xs text-slate-400">
                  Real-time ledger recording $0.99 per-item selling fees, referral commissions, and automated refund adjustments.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[10px] uppercase font-mono">
                  <tr>
                    <th className="p-3">Record ID / Date</th>
                    <th className="p-3">Order ID / Product</th>
                    <th className="p-3 text-right">Gross Sale</th>
                    <th className="p-3 text-right">$0.99 Item Fee</th>
                    <th className="p-3 text-right">Commission (8%)</th>
                    <th className="p-3 text-right">Net Seller Earnings</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {billingRecords.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-800/60 transition">
                      <td className="p-3 font-mono">
                        <div className="font-bold text-white text-[11px]">{rec.id}</div>
                        <div className="text-[10px] text-slate-500">{new Date(rec.createdAt).toLocaleString()}</div>
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-amber-400 font-mono text-[11px] block">{rec.orderId}</span>
                        <span className="text-slate-300 text-xs">{rec.productTitle}</span>
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-white">${rec.grossSaleAmount.toFixed(2)}</td>
                      <td className="p-3 text-right font-mono font-bold text-amber-400">
                        ${rec.marketplacePerItemFee.toFixed(2)}
                      </td>
                      <td className="p-3 text-right font-mono text-slate-300">${rec.marketplaceCommissionFee.toFixed(2)}</td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-400 text-sm">
                        ${rec.netSellerEarnings.toFixed(2)}
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            rec.status === 'CHARGED'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : rec.status === 'CANCELLED'
                              ? 'bg-slate-800 text-slate-400 border border-slate-700'
                              : 'bg-rose-950 text-rose-400 border border-rose-800'
                          }`}
                        >
                          {rec.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {rec.status === 'CHARGED' && (
                          <button
                            onClick={() => onRefundFee(rec.id)}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold rounded-lg border border-slate-700 transition"
                          >
                            Refund Fee
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: STATEMENTS GENERATOR & EXPORTS */}
      {activeTab === 'STATEMENTS' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-500 text-slate-950 rounded-xl font-bold">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white">Downloadable Statements & Tax Reports</h2>
                <p className="text-xs text-slate-400">
                  Generate official Monthly, Annual, Fee Breakdown, and Tax statements in PDF, CSV, and Excel.
                </p>
              </div>
            </div>
          </div>

          {statementNotice && (
            <div className="p-3 bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-bold rounded-xl flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{statementNotice}</span>
            </div>
          )}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1">Select Statement Type</label>
                <select
                  value={statementTimeframe}
                  onChange={(e) => setStatementTimeframe(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#febd69]"
                >
                  <option value="MONTHLY">Monthly Seller Statement</option>
                  <option value="ANNUAL">Annual Tax & Revenue Statement</option>
                  <option value="FEE_SUMMARY">Marketplace $0.99 Fee Summary</option>
                  <option value="TAX">Official 1099-K / Tax Audit Ledger</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1">Export Format</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['PDF', 'CSV', 'EXCEL'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setStatementFormat(fmt)}
                      className={`py-2 rounded-xl text-xs font-bold transition border ${
                        statementFormat === fmt
                          ? 'bg-[#febd69] text-slate-950 border-[#febd69]'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleDownloadStatement}
                  className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-slate-950 font-black text-xs rounded-xl transition shadow flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Statement ({statementFormat})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: STORE PERFORMANCE & HEALTH */}
      {activeTab === 'PERFORMANCE' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-amber-500 text-slate-950 rounded-xl font-bold">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white">Store Performance & Health Score Matrix</h2>
                <p className="text-xs text-slate-400">
                  Real-time quality metrics monitored by Marketplace Policy Governance.
                </p>
              </div>
            </div>

            <div className="px-4 py-2 bg-emerald-950 border border-emerald-800 text-emerald-300 font-black text-sm rounded-xl">
              Overall Health: {seller.storeHealthScore}% (GOOD)
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
              <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">Order Success Rate</span>
              <div className="text-2xl font-black text-emerald-400 font-mono">{seller.orderSuccessRate}%</div>
              <span className="text-[9px] text-slate-500">Target: &gt; 98%</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
              <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">Cancellation Rate</span>
              <div className="text-2xl font-black text-emerald-400 font-mono">{seller.cancellationRate}%</div>
              <span className="text-[9px] text-slate-500">Target: &lt; 2.5%</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
              <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">Return Rate</span>
              <div className="text-2xl font-black text-emerald-400 font-mono">{seller.returnRate}%</div>
              <span className="text-[9px] text-slate-500">Target: &lt; 3.0%</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
              <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">Customer Rating</span>
              <div className="text-2xl font-black text-amber-400 font-mono">{seller.customerRating} / 5.0</div>
              <span className="text-[9px] text-slate-500">Based on 48 reviews</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
              <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">Avg Response Time</span>
              <div className="text-2xl font-black text-sky-400 font-mono">{seller.avgResponseTimeHours} hrs</div>
              <span className="text-[9px] text-slate-500">Target: &lt; 24 hrs</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: ONE-CLICK UPGRADE TO PROFESSIONAL PLAN */}
      {activeTab === 'UPGRADE_PLAN' && (
        <div className="space-y-6">
          <div className="bg-[#131921] border border-[#37475a] p-6 rounded-3xl space-y-6 shadow-2xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="flex items-center space-x-3">
                <div className="p-3.5 bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950 rounded-2xl font-black shadow-lg">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Upgrade to Professional Seller Plan</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Eliminate $0.99 per-item selling fees & unlock unlimited active product listings. Zero data loss guaranteed!
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block font-mono">Monthly Subscription</span>
                <span className="text-3xl font-black text-emerald-400 font-mono">$39.99</span>
                <span className="text-xs text-slate-500 block">/ Month</span>
              </div>
            </div>

            {/* Side-by-Side Comparison Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Individual Plan Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="font-black text-white text-base">Individual Seller Plan</h3>
                    <p className="text-xs text-slate-400">Current Active Plan</p>
                  </div>
                  <span className="text-xs bg-slate-800 text-slate-300 font-bold px-3 py-1 rounded-full">Active</span>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center space-x-2 py-1 border-b border-slate-800">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>$0.00 Monthly Subscription Fee</span>
                  </div>
                  <div className="flex items-center space-x-2 py-1 border-b border-slate-800">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>$0.99 Fee Charged On Every Product Sold</span>
                  </div>
                  <div className="flex items-center space-x-2 py-1 border-b border-slate-800">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>Max 40 Active Product Listings</span>
                  </div>
                  <div className="flex items-center space-x-2 py-1 border-b border-slate-800">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>Max 3 Product Categories</span>
                  </div>
                  <div className="flex items-center space-x-2 py-1">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>Standard Manual Inventory Tools</span>
                  </div>
                </div>
              </div>

              {/* Professional Plan Card */}
              <div className="bg-gradient-to-b from-[#131921] to-emerald-950/40 border-2 border-emerald-500 rounded-2xl p-5 space-y-4 shadow-2xl relative">
                <div className="absolute -top-3 right-5 bg-emerald-400 text-slate-950 font-black text-[10px] uppercase px-3 py-0.5 rounded-full shadow">
                  RECOMMENDED FOR HIGH VOLUME
                </div>

                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="font-black text-emerald-300 text-base">Professional Seller Plan</h3>
                    <p className="text-xs text-emerald-400 font-bold">$39.99 / Month</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-200">
                  <div className="flex items-center space-x-2 py-1 border-b border-slate-800">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-white">$0.00 Per-Item Sold Fee (Save $0.99 per sale!)</span>
                  </div>
                  <div className="flex items-center space-x-2 py-1 border-b border-slate-800">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>UNLIMITED Active Product Listings</span>
                  </div>
                  <div className="flex items-center space-x-2 py-1 border-b border-slate-800">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>All Marketplace Product Categories Unlocked</span>
                  </div>
                  <div className="flex items-center space-x-2 py-1 border-b border-slate-800">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Bulk Inventory Uploads & API Access</span>
                  </div>
                  <div className="flex items-center space-x-2 py-1">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Promotional Deals, Coupons & Featured Placement</span>
                  </div>
                </div>

                <button
                  onClick={handleUpgradeClick}
                  className="w-full py-3 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-xs rounded-xl transition shadow-xl flex items-center justify-center space-x-2 mt-4"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Confirm One-Click Upgrade to Pro ($39.99/Mo)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: ADMIN CONTROLS & SELLER LIMITS */}
      {activeTab === 'ADMIN_CONTROLS' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-rose-500 text-slate-950 rounded-xl font-bold">
                <Sliders className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white">Administrator Seller Limit Configuration</h2>
                <p className="text-xs text-slate-400">
                  Configure active listing quotas, image upload caps, storage limits, and API throttling for Individual Plan tier.
                </p>
              </div>
            </div>
          </div>

          {adminNotice && (
            <div className="p-3 bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-bold rounded-xl flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{adminNotice}</span>
            </div>
          )}

          <form onSubmit={handleSaveAdminLimits} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Max Active Products</label>
                <input
                  type="number"
                  value={adminMaxProducts}
                  onChange={(e) => setAdminMaxProducts(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none focus:border-[#febd69]"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Max Allowed Categories</label>
                <input
                  type="number"
                  value={adminMaxCategories}
                  onChange={(e) => setAdminMaxCategories(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none focus:border-[#febd69]"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Storage Limit (MB)</label>
                <input
                  type="number"
                  value={adminStorageMb}
                  onChange={(e) => setAdminStorageMb(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none focus:border-[#febd69]"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Images Upload Limit / Product</label>
                <input
                  type="number"
                  value={adminImageLimit}
                  onChange={(e) => setAdminImageLimit(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none focus:border-[#febd69]"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold mb-1 block">API Limit (Requests / Min)</label>
                <input
                  type="number"
                  value={adminApiLimit}
                  onChange={(e) => setAdminApiLimit(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none focus:border-[#febd69]"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 text-slate-950 font-black text-xs rounded-xl transition shadow"
                >
                  Save Admin Limits
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* TAB 8: NOTIFICATIONS & SECURITY */}
      {activeTab === 'NOTIFICATIONS' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-sky-500 text-slate-950 rounded-xl font-bold">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white">Multi-Channel Alerts & Security Center</h2>
                <p className="text-xs text-slate-400">
                  Real-time notifications sent across Email, SMS, and Push channels for sale events and fee deductions.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {notifications.map((n) => (
              <div key={n.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-start justify-between gap-4 shadow">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white text-xs">{n.title}</span>
                    <span className="text-[9px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono font-bold">
                      {n.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{n.message}</p>
                  <div className="flex items-center space-x-2 pt-1 text-[10px] text-slate-500 font-mono">
                    <span>Delivered via: {n.channels.join(', ')}</span>
                    <span>•</span>
                    <span>{new Date(n.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Add Product Listing */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Plus className="w-4 h-4 text-[#febd69]" />
                <span>Create Product Listing (Individual Plan)</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 text-sm">✕</button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Product Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#febd69]"
                  placeholder="e.g. Edge AI Development Kit"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 font-semibold mb-1 block">SKU Code</label>
                  <input
                    type="text"
                    value={newSku}
                    onChange={(e) => setNewSku(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-[#febd69]"
                    placeholder="SKU-1029"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-semibold mb-1 block">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#febd69]"
                  >
                    <option value="electronics">Electronics</option>
                    <option value="computing">Computing</option>
                    <option value="industrial">Industrial</option>
                    <option value="robotics">Robotics</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 font-semibold mb-1 block">Price (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-[#febd69]"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-semibold mb-1 block">Inventory Stock</label>
                  <input
                    type="number"
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-[#febd69]"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Description</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#febd69]"
                  placeholder="Enter product description..."
                />
              </div>

              <div className="p-2 bg-slate-950 rounded-xl border border-slate-800 text-[10px] text-amber-300">
                Note: When this product is sold, a $0.99 selling fee will be automatically deducted from your payout.
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black rounded-xl shadow"
                >
                  Publish Product Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
