import React, { useState } from 'react';
import {
  Home,
  Package,
  ShoppingBag,
  TrendingUp,
  Store,
  Plus,
  Search,
  Bell,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  DollarSign,
  Tag,
  Truck,
  FileCode,
  ShieldCheck,
  ChevronRight,
  Filter,
  X,
  RefreshCw,
  Wallet
} from 'lucide-react';
import { Product, Order } from '../../types/domain';

interface MobileSellerPortalViewProps {
  products: Product[];
  orders: Order[];
  walletBalance: number;
  onAddProduct: (prod: any) => void;
  onNavigateHome?: () => void;
}

export const MobileSellerPortalView: React.FC<MobileSellerPortalViewProps> = ({
  products,
  orders,
  walletBalance,
  onAddProduct,
  onNavigateHome
}) => {
  // 5 bottom navigation tabs matching Reference 2
  const [activeBottomNav, setActiveBottomNav] = useState<'home' | 'products' | 'orders' | 'earnings' | 'store'>('home');
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [productType, setProductType] = useState<'PHYSICAL' | 'DIGITAL'>('PHYSICAL');

  // Add Product Form State
  const [title, setTitle] = useState('');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('electronics');
  const [price, setPrice] = useState(120);
  const [stock, setStock] = useState(50);
  const [weightKg, setWeightKg] = useState(1.2);
  const [fileFormat, setFileFormat] = useState('ZIP (.ts, .docker)');
  const [version, setVersion] = useState('1.0.0');
  const [imagePreview, setImagePreview] = useState('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80');

  // Stats calculation
  const totalSales = orders.reduce((sum, o) => sum + o.total.amount, 34890);
  const pendingOrders = orders.filter(o => o.status === 'placed' || o.status === 'processing');
  const completedOrders = orders.filter(o => o.status === 'delivered');

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !sku.trim()) return;

    const newProd: any = {
      id: `prod-${Date.now()}`,
      title,
      sku,
      description,
      category,
      price: { amount: price, currency: 'USD' },
      stock,
      shippingWeightKg: productType === 'PHYSICAL' ? weightKg : 0,
      images: [imagePreview],
      merchant: { id: 'merch-01', name: 'Apex Electronics Labs', isVerified: true },
      type: productType,
      isDigital: productType === 'DIGITAL',
      digitalDetails: productType === 'DIGITAL' ? { fileFormat, version } : undefined
    };

    onAddProduct(newProd);
    setIsAddProductModalOpen(false);
    setTitle('');
    setSku('');
    setDescription('');
    alert(`Product "${title}" (${productType}) successfully listed to Commerce Zone!`);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 font-sans relative">
      {/* Top Mobile App Header */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-black text-xs shadow-md">
            CZ
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Seller Central</div>
            <h2 className="text-sm font-black text-white">Apex Electronics Store</h2>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsAddProductModalOpen(true)}
            className="p-2 rounded-xl bg-[#febd69] text-slate-950 hover:bg-[#f3a847] transition shadow-md"
            title="Add Product"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>

      {/* Main Tab Screen Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {/* TAB 1: HOME (Matching Reference 2 dashboard) */}
        {activeBottomNav === 'home' && (
          <div className="space-y-4 animate-fade-in">
            {/* Quick Stat Tiles */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Total Revenue</span>
                <span className="text-xl font-black font-mono text-emerald-400 mt-0.5 block">
                  ${totalSales.toLocaleString()}
                </span>
                <span className="text-[9px] text-slate-500 font-mono mt-1 block">+18.5% this month</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Available Balance</span>
                <span className="text-xl font-black font-mono text-[#febd69] mt-0.5 block">
                  ${walletBalance.toFixed(2)}
                </span>
                <span className="text-[9px] text-emerald-400 font-mono mt-1 block">Ready for payout</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Total Listings</span>
                <span className="text-xl font-black font-mono text-white mt-0.5 block">
                  {products.length}
                </span>
                <span className="text-[9px] text-slate-500 font-mono mt-1 block">Physical & Digital</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Pending Orders</span>
                <span className="text-xl font-black font-mono text-amber-400 mt-0.5 block">
                  {pendingOrders.length}
                </span>
                <span className="text-[9px] text-amber-300 font-mono mt-1 block">Requires dispatch</span>
              </div>
            </div>

            {/* Sales Trend Sparkline Card */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase font-mono">Monthly Sales Trend</span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">▲ 24% Growth</span>
              </div>
              <div className="h-20 w-full flex items-end space-x-1.5 pt-2">
                {[35, 45, 30, 60, 55, 75, 65, 80, 95, 85, 110, 125].map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-gradient-to-t from-amber-500 to-[#febd69] rounded-t-sm transition-all"
                      style={{ height: `${(val / 130) * 100}%` }}
                    ></div>
                    <span className="text-[7px] text-slate-500 font-mono">{i + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Orders List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold font-mono uppercase text-slate-400">Recent Customer Orders</h3>
                <button
                  onClick={() => setActiveBottomNav('orders')}
                  className="text-[11px] text-[#febd69] font-bold"
                >
                  View All
                </button>
              </div>

              {orders.slice(0, 3).map((order) => (
                <div
                  key={order.id}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-mono font-bold text-white">#{order.orderNumber}</span>
                    <div className="text-[10px] text-slate-400">{order.customerName} • {order.items.length} items</div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-emerald-400">${order.total.amount}</span>
                    <span className={`text-[9px] block font-mono font-bold ${
                      order.status === 'delivered' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS */}
        {activeBottomNav === 'products' && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono uppercase text-slate-400">
                Inventory Catalog ({products.length})
              </span>
              <button
                onClick={() => setIsAddProductModalOpen(true)}
                className="px-3 py-1.5 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-bold text-xs rounded-xl transition flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Add Product</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <img
                      src={p.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80'}
                      alt={p.title}
                      className="w-full h-24 rounded-xl object-cover bg-slate-950"
                    />
                    <div className="text-xs font-bold text-white line-clamp-1">{p.title}</div>
                    <div className="text-[10px] text-slate-400 font-mono">SKU: {p.sku}</div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                    <span className="text-xs font-mono font-black text-[#febd69]">
                      ${p.price.amount}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {p.totalStock ?? 0} in stock
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS */}
        {activeBottomNav === 'orders' && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono uppercase text-slate-400">
                Order Fulfillment Queue ({orders.length})
              </span>
            </div>

            <div className="space-y-2.5">
              {orders.map((o) => (
                <div key={o.id} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-white">Order #{o.orderNumber}</span>
                      <div className="text-[10px] text-slate-400 font-mono">{new Date(o.createdAt).toLocaleDateString()}</div>
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      o.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}>
                      {o.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-950 text-[11px] text-slate-300 space-y-1">
                    {o.items.map((item, i) => (
                      <div key={i} className="flex justify-between">
                        <span className="truncate max-w-[180px]">{item.productTitle} × {item.quantity}</span>
                        <span className="font-mono text-emerald-400">${item.totalPrice.amount}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Total: <strong className="text-white">${o.total.amount} USD</strong></span>
                    <button
                      onClick={() => alert(`Tracking dispatch label printed for order #${o.orderNumber}`)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-[#febd69] font-bold rounded-lg transition"
                    >
                      Print Label
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: EARNINGS */}
        {activeBottomNav === 'earnings' && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-slate-800 space-y-3">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Total Payouts Released</span>
              <div className="text-2xl font-black font-mono text-emerald-400">$88,700.00 USD</div>
              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 font-mono">Commission Rate</span>
                  <span className="text-xs font-bold text-white block">8.5% Standard</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-mono">Pending Escrow</span>
                  <span className="text-xs font-bold text-amber-400 block">$4,320.00</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold font-mono uppercase text-white">Withdrawal Methods</h4>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2.5">
                  <Wallet className="w-4 h-4 text-emerald-400" />
                  <div>
                    <span className="font-bold text-white block">Commerce Zone Pay Wallet</span>
                    <span className="text-[10px] text-slate-500">Instant 0% fee transfer</span>
                  </div>
                </div>
                <button
                  onClick={() => alert(`Transferred balance to Commerce Zone Pay Wallet!`)}
                  className="px-3 py-1.5 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-bold rounded-lg text-xs"
                >
                  Withdraw
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: STORE */}
        {activeBottomNav === 'store' && (
          <div className="space-y-4 animate-fade-in text-xs">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-white font-bold text-base border border-slate-700">
                  AE
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center space-x-1.5">
                    <span>Apex Electronics Labs</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">ID: MERCH-APEX-01</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <div className="flex justify-between text-slate-400">
                  <span>KYC Status</span>
                  <span className="text-emerald-400 font-bold font-mono">VERIFIED</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Seller Tier</span>
                  <span className="text-amber-400 font-bold font-mono">PRO SELLER</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Dispatch Origin</span>
                  <span className="text-white">Texas Warehouse Facility 01</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5 Bottom Navigation Bar (Matching Reference 2 & 3) */}
      <div className="absolute bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 px-2 py-2 flex items-center justify-around z-20">
        <button
          onClick={() => setActiveBottomNav('home')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition ${
            activeBottomNav === 'home' ? 'text-[#febd69] font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[9px] mt-0.5">Home</span>
        </button>

        <button
          onClick={() => setActiveBottomNav('products')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition ${
            activeBottomNav === 'products' ? 'text-[#febd69] font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Package className="w-5 h-5" />
          <span className="text-[9px] mt-0.5">Products</span>
        </button>

        <button
          onClick={() => setIsAddProductModalOpen(true)}
          className="flex flex-col items-center p-2 rounded-2xl bg-[#febd69] text-slate-950 font-black shadow-lg -mt-4 ring-4 ring-slate-950"
          title="Add New Listing"
        >
          <Plus className="w-6 h-6 stroke-[3]" />
        </button>

        <button
          onClick={() => setActiveBottomNav('orders')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition ${
            activeBottomNav === 'orders' ? 'text-[#febd69] font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[9px] mt-0.5">Orders</span>
        </button>

        <button
          onClick={() => setActiveBottomNav('earnings')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition ${
            activeBottomNav === 'earnings' ? 'text-[#febd69] font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-5 h-5" />
          <span className="text-[9px] mt-0.5">Earnings</span>
        </button>
      </div>

      {/* Add Product Modal (Unified Physical vs Digital Listing Engine) */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Plus className="w-4 h-4 text-[#febd69]" />
                <span>Add Product Listing</span>
              </h3>
              <button
                onClick={() => setIsAddProductModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Segmented Type Switcher: Physical vs Digital */}
            <div className="p-3 bg-slate-950/60 border-b border-slate-800">
              <div className="grid grid-cols-2 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setProductType('PHYSICAL')}
                  className={`py-1.5 rounded-lg transition ${
                    productType === 'PHYSICAL' ? 'bg-[#febd69] text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Physical Product
                </button>
                <button
                  type="button"
                  onClick={() => setProductType('DIGITAL')}
                  className={`py-1.5 rounded-lg transition ${
                    productType === 'DIGITAL' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Digital Product / License
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateProduct} className="p-4 space-y-3 overflow-y-auto text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Ergonomic Mechanical Keyboard"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-[#febd69]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">SKU / Code</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="SKU-MECH-01"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-[#febd69]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Price ($ USD)</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-[#febd69]"
                  />
                </div>
              </div>

              {productType === 'PHYSICAL' ? (
                /* Physical Product Specific Fields */
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={stock}
                      onChange={(e) => setStock(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Weight (Kg)</label>
                    <input
                      type="number"
                      step={0.1}
                      min={0.1}
                      required
                      value={weightKg}
                      onChange={(e) => setWeightKg(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs"
                    />
                  </div>
                </div>
              ) : (
                /* Digital Product Specific Fields */
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">File Format</label>
                    <input
                      type="text"
                      required
                      value={fileFormat}
                      onChange={(e) => setFileFormat(e.target.value)}
                      placeholder="ZIP (.ts, .fig)"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Version</label>
                    <input
                      type="text"
                      required
                      value={version}
                      onChange={(e) => setVersion(e.target.value)}
                      placeholder="v1.0.0"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="High quality specs and feature details..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-[#febd69]"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-bold rounded-xl text-xs transition"
                >
                  Submit Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
