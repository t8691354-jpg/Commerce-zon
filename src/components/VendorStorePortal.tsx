import React, { useState } from 'react';
import { Merchant, Product, Order, ProductCategory, IndividualSellerProfile, SellerBillingRecord, SellerNotificationAlert, ProfessionalSellerProfile, ProSellerInvoice } from '../types/domain';
import { IndividualSellerDashboard } from './seller/IndividualSellerDashboard';
import { IndividualSellerRegistrationModal } from './seller/IndividualSellerRegistrationModal';
import { ProfessionalSellerDashboard } from './seller/ProfessionalSellerDashboard';
import { ProfessionalSellerRegistrationModal } from './seller/ProfessionalSellerRegistrationModal';
import { SellerAnalyticsDashboard } from './seller/SellerAnalyticsDashboard';
import { SellerCenterMasterModule } from './seller/SellerCenterMasterModule';
import { MOCK_INDIVIDUAL_SELLER, MOCK_SELLER_BILLING_RECORDS, MOCK_SELLER_NOTIFICATIONS, MOCK_PROFESSIONAL_SELLER, MOCK_PRO_INVOICES } from '../data/mockData';
import {
  Store,
  Plus,
  Sparkles,
  Package,
  DollarSign,
  ShoppingCart,
  CheckCircle2,
  Building2,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  Filter,
  Search,
  Edit2,
  RefreshCw,
  Truck,
  Box,
  BarChart3,
  Layers,
  Clock,
  ChevronRight,
  Zap,
  Tag
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
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

interface VendorStorePortalProps {
  merchants: Merchant[];
  products: Product[];
  orders: Order[];
  onAddMerchant: (newMerchant: Merchant) => void;
  onAddProduct: (newProduct: Product) => void;
}

// Generate Mock Sales Performance History Data for the Selected Store
const generateSalesHistory = (merchantCode: string) => {
  const dates = ['Jul 19', 'Jul 20', 'Jul 21', 'Jul 22', 'Jul 23', 'Jul 24', 'Jul 25'];
  const baseFactor = merchantCode.length * 150;
  return dates.map((date, idx) => ({
    date,
    revenue: Math.round(baseFactor + (idx * 280) + Math.sin(idx) * 400 + 1200),
    orders: Math.round(12 + idx * 3 + (idx % 2 === 0 ? 5 : -2)),
    units: Math.round(18 + idx * 4 + (idx % 2 === 0 ? 8 : 1)),
  }));
};

const CATEGORY_COLORS = ['#febd69', '#38bdf8', '#818cf8', '#34d399', '#f472b6'];

export const VendorStorePortal: React.FC<VendorStorePortalProps> = ({
  merchants,
  products,
  orders,
  onAddMerchant,
  onAddProduct,
}) => {
  const [selectedMerchantId, setSelectedMerchantId] = useState<string>(merchants[0]?.id || '');
  const [showCreateStoreModal, setShowCreateStoreModal] = useState<boolean>(false);
  const [showAddProductModal, setShowAddProductModal] = useState<boolean>(false);

  // Active Tab within Seller Central
  const [activeVendorSubTab, setActiveVendorSubTab] = useState<'seller_center' | 'analytics' | 'overview' | 'listings' | 'orders' | 'health' | 'individual_plan' | 'pro_plan'>('seller_center');
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | 'ytd'>('7d');

  // Module 5: Individual Seller Plan States
  const [indivSeller, setIndivSeller] = useState<IndividualSellerProfile>(MOCK_INDIVIDUAL_SELLER);
  const [billingRecords, setBillingRecords] = useState<SellerBillingRecord[]>(MOCK_SELLER_BILLING_RECORDS);
  const [sellerNotifs, setSellerNotifs] = useState<SellerNotificationAlert[]>(MOCK_SELLER_NOTIFICATIONS);
  const [showIndivRegModal, setShowIndivRegModal] = useState<boolean>(false);

  // Module 6: Professional Seller Plan ($36/mo) States
  const [proSeller, setProSeller] = useState<ProfessionalSellerProfile>(MOCK_PROFESSIONAL_SELLER);
  const [proInvoices, setProInvoices] = useState<ProSellerInvoice[]>(MOCK_PRO_INVOICES);
  const [showProRegModal, setShowProRegModal] = useState<boolean>(false);

  // Search & Filters for Listings
  const [listingSearch, setListingSearch] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Editable Product States for Quick Listing Management
  const [editableStock, setEditableStock] = useState<{ [productId: string]: number }>({});
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);

  // New Store Form State
  const [newStoreName, setNewStoreName] = useState<string>('');
  const [newStoreCode, setNewStoreCode] = useState<string>('');
  const [newStoreTier, setNewStoreTier] = useState<'standard' | 'verified' | 'enterprise' | 'flagship'>('verified');

  // New Product Form State
  const [prodTitle, setProdTitle] = useState<string>('');
  const [prodSku, setProdSku] = useState<string>('');
  const [prodCategory, setProdCategory] = useState<ProductCategory>('electronics');
  const [prodPrice, setProdPrice] = useState<number>(199.99);
  const [prodStock, setProdStock] = useState<number>(50);
  const [prodImage, setProdImage] = useState<string>('https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80');
  const [prodDescription, setProdDescription] = useState<string>('');
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);

  // Order Fulfillment State
  const [orderFulfillmentStatus, setOrderFulfillmentStatus] = useState<{ [orderId: string]: string }>({});

  const activeMerchant = merchants.find((m) => m.id === selectedMerchantId) || merchants[0];
  const merchantProducts = products.filter((p) => p.merchant.id === activeMerchant?.id);

  // Filter orders containing items from this merchant
  const merchantOrders = orders.filter((o) =>
    o.items.some((item) => item.merchantId === activeMerchant?.id)
  );

  const totalMerchantRevenue = merchantOrders.reduce((sum, o) => {
    const merchantItems = o.items.filter((item) => item.merchantId === activeMerchant?.id);
    return sum + merchantItems.reduce((acc, item) => acc + item.totalPrice.amount, 0);
  }, 0);

  const totalUnitsSold = merchantOrders.reduce((sum, o) => {
    const merchantItems = o.items.filter((item) => item.merchantId === activeMerchant?.id);
    return sum + merchantItems.reduce((acc, item) => acc + item.quantity, 0);
  }, 0);

  const salesData = generateSalesHistory(activeMerchant?.code || 'STORE');

  // Listing category distribution for charts
  const categoryData = Object.entries(
    merchantProducts.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number })
  ).map(([name, value]) => ({ name: name.toUpperCase(), value }));

  const handleStockUpdate = (productId: string, delta: number) => {
    const current = editableStock[productId] !== undefined
      ? editableStock[productId]
      : (merchantProducts.find(p => p.id === productId)?.totalStock || 0);
    const updated = Math.max(0, current + delta);
    setEditableStock((prev) => ({ ...prev, [productId]: updated }));
  };

  const handleCreateStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoreName.trim()) return;

    const created: Merchant = {
      id: `merch-${Date.now()}`,
      name: newStoreName.trim(),
      code: newStoreCode.trim().toUpperCase() || `STORE-${Math.floor(100 + Math.random() * 900)}`,
      tier: newStoreTier,
      rating: 5.0,
      reviewCount: 1,
      isVerified: true,
      createdAt: new Date().toISOString(),
    };

    onAddMerchant(created);
    setSelectedMerchantId(created.id);
    setShowCreateStoreModal(false);
    setNewStoreName('');
    setNewStoreCode('');
  };

  const handleAiAutoListing = async () => {
    if (!prodTitle.trim()) return;
    setIsAiGenerating(true);
    try {
      const res = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `Generate product description and bullet specs for Commerce Zon Seller listing title: ${prodTitle} in category ${prodCategory}` }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.recommendations && data.recommendations.length > 0) {
          const rec = data.recommendations[0];
          setProdDescription(rec.reason || `Official ${prodTitle} - Engineered with high-grade components for reliable commercial performance.`);
          if (rec.suggestedPrice) setProdPrice(rec.suggestedPrice);
        } else {
          setProdDescription(`Official Commerce Zon ${prodTitle} - Built for high durability with fast Commerce Zon Prime fulfillment.`);
        }
      }
    } catch (err) {
      console.warn('AI listing error:', err);
      setProdDescription(`Official ${prodTitle} - High quality product listed on ${activeMerchant.name}.`);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodTitle.trim()) return;

    const newProd: Product = {
      id: `prod-vendor-${Date.now()}`,
      title: prodTitle.trim(),
      slug: prodTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      sku: prodSku.trim().toUpperCase() || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      description: prodDescription.trim() || `Official product from ${activeMerchant.name}`,
      category: prodCategory,
      tags: [prodCategory, 'vendor-store', activeMerchant.code.toLowerCase()],
      price: { amount: prodPrice, currency: 'USD' },
      merchant: activeMerchant,
      images: [prodImage],
      rating: 5.0,
      reviewCount: 1,
      variants: [],
      warehouseStock: [
        {
          warehouseId: 'wh-01',
          warehouseName: 'Commerce Zon East Coast Fulfillment Center',
          code: 'WH-US-EAST',
          quantity: prodStock,
          reserved: 0,
          reorderLevel: 10,
        },
      ],
      totalStock: prodStock,
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAddProduct(newProd);
    setShowAddProductModal(false);
    setProdTitle('');
    setProdSku('');
    setProdDescription('');
  };

  // Filter listings
  const filteredListings = merchantProducts.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(listingSearch.toLowerCase()) || p.sku.toLowerCase().includes(listingSearch.toLowerCase());
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 font-sans text-slate-100">
      {/* Commerce Zon Seller Central Top Header Bar */}
      <div className="bg-[#131921] border border-[#37475a] rounded-2xl p-6 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 bg-[#febd69] text-slate-950 rounded-2xl font-extrabold shadow-md">
            <Store className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-[#febd69] uppercase tracking-wider">Commerce Zon Seller Central</span>
              <span className="text-slate-600">•</span>
              <h2 className="text-xl font-black text-white">{activeMerchant?.name}</h2>
              {activeMerchant?.isVerified && (
                <span className="flex items-center space-x-1 text-[11px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Brand</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Store ID: <span className="font-mono text-slate-200">{activeMerchant?.id}</span> | Code: <span className="font-mono text-[#febd69] font-bold">{activeMerchant?.code}</span> | Tier: <span className="uppercase text-slate-300 font-semibold">{activeMerchant?.tier}</span>
            </p>
          </div>
        </div>

        {/* Store Control Switcher & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Store Switcher */}
          <div className="flex items-center space-x-2 bg-[#232f3e] border border-[#37475a] rounded-xl px-3 py-2">
            <Building2 className="w-4 h-4 text-[#febd69]" />
            <select
              value={selectedMerchantId}
              onChange={(e) => setSelectedMerchantId(e.target.value)}
              className="bg-transparent text-xs text-white font-bold focus:outline-none cursor-pointer"
            >
              {merchants.map((m) => (
                <option key={m.id} value={m.id} className="bg-[#131921] text-white">
                  {m.name} ({m.tier.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowProRegModal(true)}
            className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs flex items-center space-x-1.5 transition shadow-lg"
          >
            <Building2 className="w-4 h-4 text-slate-950" />
            <span>Register Pro Seller ($36/Mo)</span>
          </button>

          <button
            onClick={() => setShowIndivRegModal(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition"
          >
            <Zap className="w-4 h-4 text-[#febd69]" />
            <span>Register Individual ($0/Mo)</span>
          </button>

          <button
            onClick={() => setShowCreateStoreModal(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition"
          >
            <Plus className="w-4 h-4 text-[#febd69]" />
            <span>Register Brand Vendor</span>
          </button>

          <button
            onClick={() => setShowAddProductModal(true)}
            className="px-4 py-2 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-extrabold rounded-xl text-xs flex items-center space-x-1.5 transition shadow-lg shadow-amber-950/50"
          >
            <Package className="w-4 h-4" />
            <span>List New Product</span>
          </button>
        </div>
      </div>

      {/* Seller Central Module Navigation Tabs */}
      <div className="bg-[#1e293b] p-1.5 border border-slate-800 rounded-xl flex items-center space-x-2 overflow-x-auto">
        <button
          onClick={() => setActiveVendorSubTab('seller_center')}
          className={`px-4 py-2 rounded-lg text-xs font-extrabold flex items-center space-x-2 transition shrink-0 ${
            activeVendorSubTab === 'seller_center'
              ? 'bg-[#febd69] text-slate-950 shadow-md'
              : 'text-amber-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Store className="w-4 h-4 text-[#febd69]" />
          <span>Seller Center & Operations (Part 14)</span>
        </button>

        <button
          onClick={() => setActiveVendorSubTab('analytics')}
          className={`px-4 py-2 rounded-lg text-xs font-extrabold flex items-center space-x-2 transition shrink-0 ${
            activeVendorSubTab === 'analytics'
              ? 'bg-[#febd69] text-slate-950 shadow-md'
              : 'text-amber-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-[#febd69]" />
          <span>Seller Intelligence & Analytics</span>
        </button>

        <button
          onClick={() => setActiveVendorSubTab('pro_plan')}
          className={`px-4 py-2 rounded-lg text-xs font-extrabold flex items-center space-x-2 transition ${
            activeVendorSubTab === 'pro_plan'
              ? 'bg-[#febd69] text-slate-950 shadow-md'
              : 'text-amber-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4 text-[#febd69]" />
          <span>Professional Seller Plan ($36/Mo)</span>
        </button>

        <button
          onClick={() => setActiveVendorSubTab('individual_plan')}
          className={`px-4 py-2 rounded-lg text-xs font-extrabold flex items-center space-x-2 transition ${
            activeVendorSubTab === 'individual_plan'
              ? 'bg-[#febd69] text-slate-950 shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Individual Plan ($0.99/Sale)</span>
        </button>

        <button
          onClick={() => setActiveVendorSubTab('overview')}
          className={`px-4 py-2 rounded-lg text-xs font-extrabold flex items-center space-x-2 transition ${
            activeVendorSubTab === 'overview'
              ? 'bg-[#febd69] text-slate-950 shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Sales & Graphical Performance</span>
        </button>

        <button
          onClick={() => setActiveVendorSubTab('listings')}
          className={`px-4 py-2 rounded-lg text-xs font-extrabold flex items-center space-x-2 transition ${
            activeVendorSubTab === 'listings'
              ? 'bg-[#febd69] text-slate-950 shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Manage Product Listings ({merchantProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveVendorSubTab('orders')}
          className={`px-4 py-2 rounded-lg text-xs font-extrabold flex items-center space-x-2 transition ${
            activeVendorSubTab === 'orders'
              ? 'bg-[#febd69] text-slate-950 shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Fulfillment Queue ({merchantOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveVendorSubTab('health')}
          className={`px-4 py-2 rounded-lg text-xs font-extrabold flex items-center space-x-2 transition ${
            activeVendorSubTab === 'health'
              ? 'bg-[#febd69] text-slate-950 shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Account Health & FBA Metrics</span>
        </button>
      </div>

      {/* PART 14: SELLER CENTER, VENDOR OPERATIONS & MULTI-SELLER MANAGEMENT */}
      {activeVendorSubTab === 'seller_center' && (
        <SellerCenterMasterModule
          merchants={merchants}
          allProducts={products}
          onAddMerchant={onAddMerchant}
          onAddProduct={onAddProduct}
        />
      )}

      {/* PART 13: SELLER INTELLIGENCE, PRODUCT PERFORMANCE & MARKETPLACE ANALYTICS */}
      {activeVendorSubTab === 'analytics' && (
        <SellerAnalyticsDashboard
          activeMerchant={activeMerchant}
          allMerchants={merchants}
          onSelectMerchant={setSelectedMerchantId}
          onNavigateToListings={() => setActiveVendorSubTab('listings')}
          onNavigateToOrders={() => setActiveVendorSubTab('orders')}
        />
      )}

      {/* MODULE 6: PROFESSIONAL SELLER PLAN DASHBOARD & SYSTEM ($36/MO) */}
      {activeVendorSubTab === 'pro_plan' && (
        <ProfessionalSellerDashboard
          seller={proSeller}
          products={products}
          orders={orders}
          invoices={proInvoices}
          notifications={sellerNotifs}
          onUpdateSeller={(updated) => setProSeller(updated)}
          onAddProduct={(prodPartial) => onAddProduct(prodPartial as any)}
          onDeleteProduct={(prodId) => {
            // Product deleted callback
          }}
          onDowngradeToIndividual={() => {
            setActiveVendorSubTab('individual_plan');
          }}
        />
      )}

      {/* MODULE 5: INDIVIDUAL SELLER PLAN DASHBOARD & SYSTEM */}
      {activeVendorSubTab === 'individual_plan' && (
        <IndividualSellerDashboard
          seller={indivSeller}
          products={products}
          orders={orders}
          billingRecords={billingRecords}
          notifications={sellerNotifs}
          onUpdateSeller={(updated) => setIndivSeller(updated)}
          onAddProduct={(prodPartial) => {
            onAddProduct(prodPartial as any);
            setIndivSeller((prev) => ({ ...prev, activeProductsCount: prev.activeProductsCount + 1 }));
          }}
          onUpdateProduct={(prodId, updates) => {
            // Update local product state wrapper if needed
          }}
          onDeleteProduct={(prodId) => {
            setIndivSeller((prev) => ({ ...prev, activeProductsCount: Math.max(0, prev.activeProductsCount - 1) }));
          }}
          onRefundFee={(recordId) => {
            setBillingRecords((prev) =>
              prev.map((r) => (r.id === recordId ? { ...r, status: 'REFUNDED' as const } : r))
            );
            setIndivSeller((prev) => ({
              ...prev,
              totalPerItemFeesPaid: Math.max(0, prev.totalPerItemFeesPaid - 0.99),
            }));
            setSellerNotifs((prev) => [
              {
                id: `notif-${Date.now()}`,
                sellerId: indivSeller.id,
                title: '$0.99 Fee Refunded',
                message: `Marketplace per-item fee of $0.99 for record ${recordId} was refunded to your seller wallet.`,
                type: 'FEE_DEDUCTED',
                channels: ['EMAIL', 'PUSH'],
                read: false,
                createdAt: new Date().toISOString(),
              },
              ...prev,
            ]);
          }}
          onUpgradeToPro={() => {
            setIndivSeller((prev) => ({
              ...prev,
              plan: 'PROFESSIONAL',
              planFeePerSale: 0.00,
              monthlySubscriptionPrice: 39.99,
              limits: {
                ...prev.limits,
                maxActiveProducts: 10000,
                maxCategories: 50,
                storageLimitMb: 50000,
                imageUploadLimitPerProduct: 20,
                apiLimitRequestsPerMin: 1000,
                promotionalFeatureAccess: true,
              },
            }));
            setSellerNotifs((prev) => [
              {
                id: `notif-${Date.now()}`,
                sellerId: indivSeller.id,
                title: 'Upgraded to Professional Plan',
                message: 'Your account is now on the Professional Plan ($39.99/mo). Per-item selling fee reduced from $0.99 to $0.00!',
                type: 'UPGRADE_AVAILABLE',
                channels: ['EMAIL', 'SMS', 'PUSH'],
                read: false,
                createdAt: new Date().toISOString(),
              },
              ...prev,
            ]);
          }}
        />
      )}


      {/* TAB 1: GRAPHICAL SALES & REVENUE PERFORMANCE CENTER */}
      {activeVendorSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metric Snapshot Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span>Gross Revenue</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono">
                ${(totalMerchantRevenue + 4820.50).toFixed(2)}
              </div>
              <div className="flex items-center space-x-1 text-[11px] text-emerald-400 font-semibold">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+18.4% vs last week</span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span>Units Shipped & Sold</span>
                <Package className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {totalUnitsSold + 142} <span className="text-xs font-normal text-slate-400">units</span>
              </div>
              <div className="flex items-center space-x-1 text-[11px] text-sky-400 font-semibold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Buy Box Win Rate: 96.2%</span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span>Active Listings</span>
                <Box className="w-4 h-4 text-[#febd69]" />
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {merchantProducts.length} <span className="text-xs font-normal text-slate-400">Products</span>
              </div>
              <div className="flex items-center space-x-1 text-[11px] text-amber-400 font-semibold">
                <Zap className="w-3.5 h-3.5" />
                <span>All FBA In-Stock</span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span>Seller Feedback Rating</span>
                <Store className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono">
                ⭐ {activeMerchant?.rating || 5.0} <span className="text-xs font-normal text-slate-400">/ 5.0</span>
              </div>
              <div className="text-[11px] text-slate-400 font-semibold">
                Based on {activeMerchant?.reviewCount || 184} verified ratings
              </div>
            </div>
          </div>

          {/* Sales Performance Area & Bar Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Primary Revenue Trend Chart */}
            <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-[#febd69]" />
                    <span>Sales & Revenue Growth Chart</span>
                  </h3>
                  <p className="text-xs text-slate-400">Daily Commerce Zon revenue tracking and units ordered</p>
                </div>

                <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                  <button
                    onClick={() => setTimeframe('7d')}
                    className={`px-2.5 py-1 rounded font-bold transition ${
                      timeframe === '7d' ? 'bg-[#febd69] text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    7 Days
                  </button>
                  <button
                    onClick={() => setTimeframe('30d')}
                    className={`px-2.5 py-1 rounded font-bold transition ${
                      timeframe === '30d' ? 'bg-[#febd69] text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    30 Days
                  </button>
                  <button
                    onClick={() => setTimeframe('ytd')}
                    className={`px-2.5 py-1 rounded font-bold transition ${
                      timeframe === 'ytd' ? 'bg-[#febd69] text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    YTD
                  </button>
                </div>
              </div>

              <div className="h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#febd69" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#febd69" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                      formatter={(val: any) => [`$${val.toLocaleString()}`, 'Daily Revenue']}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#febd69" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Breakdown Donut / Pie Chart */}
            <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-sky-400" />
                  <span>Category Inventory Mix</span>
                </h3>

                {categoryData.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-500">
                    No products listed to visualize category breakdown.
                  </div>
                ) : (
                  <div className="h-56 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={75}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                        />
                        <Legend wrapperStyle={{ fontSize: '11px', color: '#cbd5e1' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-1">
                <div className="text-slate-400">Top Performing Category:</div>
                <div className="font-bold text-[#febd69] uppercase font-mono">
                  {categoryData[0]?.name || 'ELECTRONICS'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVE PRODUCT LISTING MANAGEMENT SUITE */}
      {activeVendorSubTab === 'listings' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Package className="w-5 h-5 text-[#febd69]" />
                <span>Active Product Listings ({filteredListings.length})</span>
              </h3>
              <p className="text-xs text-slate-400">Manage pricing, FBA inventory quantities, and product catalog details</p>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {/* Listing Search */}
              <div className="relative flex-1 md:w-64">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search SKU or Title..."
                  value={listingSearch}
                  onChange={(e) => setListingSearch(e.target.value)}
                  className="w-full bg-slate-950 text-xs text-white pl-9 pr-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-[#febd69]"
                />
              </div>

              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-slate-950 text-xs text-slate-200 border border-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:border-[#febd69]"
              >
                <option value="all">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="computing">Computing</option>
                <option value="robotics">Robotics</option>
                <option value="industrial">Industrial</option>
              </select>

              <button
                onClick={() => setShowAddProductModal(true)}
                className="px-3 py-2 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-bold rounded-xl text-xs transition"
              >
                + Add Listing
              </button>
            </div>
          </div>

          {filteredListings.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-3">
              <Package className="w-10 h-10 mx-auto text-slate-700" />
              <p className="text-xs">No product listings found matching your search.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
                    <th className="p-3">Product Info</th>
                    <th className="p-3">SKU / ASIN</th>
                    <th className="p-3">Price ($ USD)</th>
                    <th className="p-3">Stock Units</th>
                    <th className="p-3">FBA Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredListings.map((p) => {
                    const currentStock = editableStock[p.id] !== undefined ? editableStock[p.id] : p.totalStock;

                    return (
                      <tr key={p.id} className="hover:bg-slate-800/40 transition">
                        <td className="p-3 flex items-center space-x-3">
                          <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80'} alt="" className="w-12 h-12 rounded-lg object-cover bg-slate-950 border border-slate-800 shrink-0" />
                          <div>
                            <div className="font-bold text-white line-clamp-1">{p.title}</div>
                            <div className="text-[10px] text-slate-400 uppercase font-mono">{p.category}</div>
                          </div>
                        </td>

                        <td className="p-3 font-mono font-bold text-amber-400">{p.sku}</td>

                        <td className="p-3 font-mono text-emerald-400 font-bold">
                          ${p.price.amount.toFixed(2)}
                        </td>

                        <td className="p-3">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleStockUpdate(p.id, -5)}
                              className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center justify-center"
                            >
                              -
                            </button>
                            <span className="font-mono font-bold text-white min-w-[32px] text-center">
                              {currentStock}
                            </span>
                            <button
                              onClick={() => handleStockUpdate(p.id, 10)}
                              className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>
                        </td>

                        <td className="p-3">
                          <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                            Prime Eligible
                          </span>
                        </td>

                        <td className="p-3 text-right">
                          <button
                            onClick={handleAiAutoListing}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg text-[11px] font-bold transition flex items-center space-x-1 ml-auto"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>AI Optimize</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: REAL-TIME ORDER FULFILLMENT QUEUE */}
      {activeVendorSubTab === 'orders' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5 text-blue-400" />
                <span>Vendor Order Fulfillment Queue ({merchantOrders.length})</span>
              </h3>
              <p className="text-xs text-slate-400">Process multi-merchant orders and dispatch FBA inventory</p>
            </div>
          </div>

          {merchantOrders.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No orders received yet for this store. Place an order in the Marketplace tab to test multi-vendor fulfillment!
            </div>
          ) : (
            <div className="space-y-4">
              {merchantOrders.map((order) => {
                const vendorItems = order.items.filter((item) => item.merchantId === activeMerchant?.id);
                const vendorSubtotal = vendorItems.reduce((acc, it) => acc + it.totalPrice.amount, 0);

                return (
                  <div key={order.id} className="bg-slate-950 border border-slate-800/80 rounded-xl p-5 text-xs space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-900 pb-2">
                      <div className="flex items-center space-x-3">
                        <span className="font-mono font-bold text-[#febd69] text-sm">{order.orderNumber}</span>
                        <span className="text-slate-400">• {new Date(order.createdAt).toLocaleString()}</span>
                      </div>
                      <span className="bg-blue-950 text-blue-300 border border-blue-800 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        Fulfillment: {order.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-slate-400 font-semibold mb-1">Customer Shipping Address:</div>
                        <div className="text-white font-bold">{order.customerName}</div>
                        <div className="text-slate-400">{order.customerEmail}</div>
                      </div>

                      <div className="bg-slate-900/80 p-3 rounded-lg space-y-1">
                        <div className="flex justify-between text-slate-400">
                          <span>Vendor Gross Items Subtotal:</span>
                          <span className="font-mono text-white font-bold">${vendorSubtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Commerce Zon Referral Fee (12%):</span>
                          <span className="font-mono text-red-400">-${(vendorSubtotal * 0.12).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-slate-200 font-bold pt-1 border-t border-slate-800">
                          <span>Net Merchant Payout:</span>
                          <span className="font-mono text-emerald-400">${(vendorSubtotal * 0.88).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1 pt-2 border-t border-slate-900">
                      <div className="text-slate-400 font-semibold text-[11px]">Ordered Store Items:</div>
                      {vendorItems.map((it) => (
                        <div key={it.id} className="flex justify-between text-slate-300 bg-slate-900 p-2 rounded">
                          <span>{it.quantity}x {it.productTitle}</span>
                          <span className="font-mono text-emerald-400">${it.totalPrice.amount.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: ACCOUNT HEALTH & FBA METRICS */}
      {activeVendorSubTab === 'health' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Commerce Zon Seller Account Health</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-xl text-emerald-300 font-bold flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Account Health Rating: Excellent (1,000 / 1,000 Points)</span>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-slate-300">
                  <span>Order Defect Rate (ODR):</span>
                  <span className="font-mono text-emerald-400 font-bold">0.04% (Target &lt; 1%)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Late Dispatch Rate:</span>
                  <span className="font-mono text-emerald-400 font-bold">0.00% (Target &lt; 4%)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Valid Tracking Rate (VTR):</span>
                  <span className="font-mono text-emerald-400 font-bold">100.0% (Target &gt; 95%)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Truck className="w-5 h-5 text-sky-400" />
              <span>Fulfillment by Commerce Zon (FBA) Capacity</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between font-bold">
                <span className="text-slate-300">East Coast FBA Warehouse Usage</span>
                <span className="text-[#febd69]">2,450 / 10,000 Cubic Feet</span>
              </div>

              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-gradient-to-r from-emerald-500 to-[#febd69] h-full w-[24.5%]"></div>
              </div>

              <p className="text-slate-400 text-[11px]">
                Your storage limits automatically expand as your Commerce Zon sell-through rate stays high.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE VENDOR STORE */}
      {showCreateStoreModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Store className="w-5 h-5 text-[#febd69]" />
                <span>Register Vendor Store</span>
              </h3>
              <button onClick={() => setShowCreateStoreModal(false)} className="text-slate-400 hover:text-white text-lg">✕</button>
            </div>

            <form onSubmit={handleCreateStore} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Store Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nexus Electronics Store"
                  value={newStoreName}
                  onChange={(e) => setNewStoreName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#febd69]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Store Code</label>
                <input
                  type="text"
                  placeholder="e.g. NEXUS-STORE"
                  value={newStoreCode}
                  onChange={(e) => setNewStoreCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#febd69]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Merchant Tier</label>
                <select
                  value={newStoreTier}
                  onChange={(e) => setNewStoreTier(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#febd69]"
                >
                  <option value="standard">Standard Merchant</option>
                  <option value="verified">Verified Vendor</option>
                  <option value="enterprise">Enterprise Merchant</option>
                  <option value="flagship">Flagship Brand Partner</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateStoreModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-extrabold rounded-xl text-xs transition"
                >
                  Launch Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD PRODUCT TO STORE */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Package className="w-5 h-5 text-[#febd69]" />
                <span>Add Product to {activeMerchant.name}</span>
              </h3>
              <button onClick={() => setShowAddProductModal(false)} className="text-slate-400 hover:text-white text-lg">✕</button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wireless Noise-Canceling Headphones"
                  value={prodTitle}
                  onChange={(e) => setProdTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#febd69]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Category</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value as ProductCategory)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#febd69]"
                  >
                    <option value="electronics">Electronics</option>
                    <option value="computing">Computing</option>
                    <option value="fashion">Fashion</option>
                    <option value="industrial">Industrial</option>
                    <option value="robotics">Robotics</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">SKU Code</label>
                  <input
                    type="text"
                    placeholder="e.g. HEADPHONE-PRO"
                    value={prodSku}
                    onChange={(e) => setProdSku(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#febd69]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Price ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#febd69]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Initial Stock Units</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={prodStock}
                    onChange={(e) => setProdStock(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#febd69]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Product Image URL</label>
                <input
                  type="text"
                  value={prodImage}
                  onChange={(e) => setProdImage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#febd69]"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">Description</label>
                  <button
                    type="button"
                    onClick={handleAiAutoListing}
                    disabled={isAiGenerating || !prodTitle}
                    className="text-[11px] text-[#febd69] hover:text-amber-300 font-semibold flex items-center space-x-1"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isAiGenerating ? 'animate-spin' : ''}`} />
                    <span>{isAiGenerating ? 'AI Generating...' : 'Gemini Auto-Write Description'}</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={prodDescription}
                  onChange={(e) => setProdDescription(e.target.value)}
                  placeholder="Product bullet points, features, and specs..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#febd69]"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-extrabold rounded-xl text-xs transition"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Individual Seller Registration Modal */}
      <IndividualSellerRegistrationModal
        isOpen={showIndivRegModal}
        onClose={() => setShowIndivRegModal(false)}
        onRegisterSuccess={(newProfile) => {
          setIndivSeller(newProfile);
          setActiveVendorSubTab('individual_plan');
        }}
      />
      {/* Professional Seller Registration Modal ($36/Mo) */}
      <ProfessionalSellerRegistrationModal
        isOpen={showProRegModal}
        onClose={() => setShowProRegModal(false)}
        onRegisterSuccess={(newProfile) => {
          setProSeller(newProfile);
          setActiveVendorSubTab('pro_plan');
        }}
      />
    </div>
  );
};

