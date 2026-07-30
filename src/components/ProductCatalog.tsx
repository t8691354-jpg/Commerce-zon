import React, { useState } from 'react';
import { Product, ProductCategory } from '../types/domain';
import { Search, Sparkles, Filter, Store, ShieldCheck, Star, Truck, Check, ShoppingCart, X } from 'lucide-react';

interface ProductCatalogProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onAISearch: (prompt: string) => Promise<void>;
  aiSearching: boolean;
  aiExplanation?: string;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchTerm: string;
  setSearchTerm: (s: string) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  onAddToCart,
  onAISearch,
  aiSearching,
  aiExplanation,
  selectedCategory,
  setSelectedCategory,
  searchTerm,
  setSearchTerm,
}) => {
  const [useAISemantic, setUseAISemantic] = useState(false);
  const [selectedProductModal, setSelectedProductModal] = useState<Product | null>(null);
  const [buyQuantity, setBuyQuantity] = useState<number>(1);
  const [addedNotification, setAddedNotification] = useState<string | null>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    if (useAISemantic) {
      onAISearch(searchTerm);
    }
  };

  const handleAddToCartWithNotify = (prod: Product, qty: number = 1) => {
    for (let i = 0; i < qty; i++) {
      onAddToCart(prod);
    }
    setAddedNotification(`Added ${qty}x "${prod.title}" to your Commerce Zon Cart!`);
    setTimeout(() => setAddedNotification(null), 3500);
  };

  const categories: { label: string; value: ProductCategory | 'all' }[] = [
    { label: 'All Departments', value: 'all' },
    { label: 'Computing & Laptops', value: 'computing' },
    { label: 'Robotics & Automation', value: 'robotics' },
    { label: 'Electronics & Audio', value: 'electronics' },
    { label: 'Industrial Equipment', value: 'industrial' },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Toast Notification */}
      {addedNotification && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#131921] border-2 border-[#febd69] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 animate-bounce">
          <Check className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-bold">{addedNotification}</span>
        </div>
      )}

      {/* Commerce Zon Official Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#131921] via-[#232f3e] to-[#131921] border border-[#37475a] p-6 shadow-2xl text-white">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-[#febd69]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center space-x-2">
              <span className="bg-[#febd69] text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-widest">
                OFFICIAL PRIME MARKETPLACE
              </span>
              <span className="text-xs text-amber-300 font-extrabold flex items-center space-x-1">
                <Truck className="w-3.5 h-3.5" />
                <span>FREE One-Day Express Delivery</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
              Welcome to <span className="text-[#febd69]">Commerce Zone</span>
            </h1>

            <p className="text-xs text-slate-300 leading-relaxed">
              Shop top enterprise electronics, robotics, and computing equipment with <strong>Commerce Zone Pay Wallet</strong> — featuring 1-click checkout and 2% instant cashback on all orders!
            </p>
          </div>

          {/* Quick Perks Badge Cards */}
          <div className="grid grid-cols-2 gap-3 w-full md:w-auto shrink-0">
            <div className="bg-[#131921]/90 border border-[#37475a] p-3 rounded-xl flex items-center space-x-3">
              <div className="p-2 bg-[#febd69] text-slate-950 rounded-lg font-bold">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <div className="text-[11px]">
                <div className="font-bold text-white">1-Click Fast Checkout</div>
                <div className="text-[10px] text-slate-400">Zero extra fees</div>
              </div>
            </div>

            <div className="bg-[#131921]/90 border border-[#37475a] p-3 rounded-xl flex items-center space-x-3">
              <div className="p-2 bg-emerald-500 text-slate-950 rounded-lg font-bold">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-[11px]">
                <div className="font-bold text-white">2% Cashback Rewards</div>
                <div className="text-[10px] text-emerald-400 font-bold">Commerce Zone Pay</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Commerce Zon Department & Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <Filter className="w-4 h-4 text-[#febd69] shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === cat.value
                  ? 'bg-[#febd69] text-slate-950 shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* AI Semantic Toggle Switch */}
        <div className="flex items-center space-x-3 text-xs w-full md:w-auto justify-between md:justify-end">
          <button
            onClick={() => {
              setUseAISemantic(!useAISemantic);
              if (!useAISemantic && searchTerm.trim()) {
                onAISearch(searchTerm);
              }
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 border ${
              useAISemantic
                ? 'bg-sky-600 text-white border-sky-400 shadow-md'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{useAISemantic ? 'Gemini AI Intent ON' : 'Enable AI Assistant'}</span>
          </button>

          <span className="text-slate-400 text-xs font-mono">
            <strong className="text-white">{products.length}</strong> items found
          </span>
        </div>
      </div>

      {/* AI Explanation Bar */}
      {aiExplanation && (
        <div className="p-3 bg-[#1e293b] border-l-4 border-[#febd69] rounded-r-xl text-xs text-slate-200 flex items-start space-x-2 shadow">
          <Sparkles className="w-4 h-4 text-[#febd69] mt-0.5 shrink-0" />
          <div>
            <span className="font-bold text-[#febd69]">Commerce Zon Gemini Recommendation Insight: </span>
            {aiExplanation}
          </div>
        </div>
      )}

      {/* Commerce Zon Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {products.map((product, idx) => {
          const listPrice = Math.round(product.price.amount * 1.22 * 100) / 100;
          const discountPct = Math.round(((listPrice - product.price.amount) / listPrice) * 100);

          return (
            <div
              key={product.id}
              className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-[#febd69] transition-all duration-200 flex flex-col justify-between group shadow-lg relative"
            >
              {/* Top Commerce Zon Badge */}
              <div className="p-3 pb-0 flex items-center justify-between">
                {idx % 2 === 0 ? (
                  <span className="bg-[#002f36] text-[#00a8e1] border border-[#005f73] px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
                    Commerce Zon's <span className="text-white font-bold">Choice</span>
                  </span>
                ) : (
                  <span className="bg-[#131921] text-amber-400 border border-[#37475a] px-2 py-0.5 rounded text-[10px] font-bold">
                    #1 Best Seller
                  </span>
                )}

                {/* Seller Tag */}
                <span className="text-[10px] text-slate-400 flex items-center space-x-1 font-mono">
                  <Store className="w-3 h-3 text-slate-500" />
                  <span className="truncate max-w-[100px]">{product.merchant.name}</span>
                </span>
              </div>

              {/* Product Image */}
              <div
                onClick={() => setSelectedProductModal(product)}
                className="relative h-44 p-4 bg-slate-950 flex items-center justify-center cursor-pointer group-hover:opacity-95 transition"
              >
                <img
                  src={product.images?.[0] || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80'}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300"
                />
              </div>

              {/* Product Info Section */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  {/* Category & SKU */}
                  <div className="text-[10px] font-mono text-slate-400 flex justify-between">
                    <span>ASIN: B0{product.sku.slice(0, 7)}</span>
                    <span className="uppercase text-slate-500">{product.category}</span>
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => setSelectedProductModal(product)}
                    className="text-xs font-bold text-slate-100 group-hover:text-[#febd69] transition line-clamp-2 cursor-pointer leading-snug"
                  >
                    {product.title}
                  </h3>

                  {/* Star Rating */}
                  <div className="flex items-center space-x-1 text-xs">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[#007185] hover:underline font-bold text-[11px] cursor-pointer">
                      {product.rating || 4.8}
                    </span>
                    <span className="text-slate-400 text-[10px]">({product.reviewCount || 128})</span>
                  </div>

                  {/* Commerce Zon Price Display */}
                  <div className="pt-1">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-xs text-red-400 font-bold">-{discountPct}%</span>
                      <span className="text-lg font-extrabold text-white font-mono">
                        ${product.price.amount.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Typical price: <span className="line-through">${listPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Prime Shipping Badge */}
                  <div className="flex items-center space-x-1 text-[11px] text-slate-300 pt-1">
                    <span className="font-extrabold italic text-[#00a8e1]">prime</span>
                    <span className="font-semibold text-slate-200">FREE One-Day</span>
                  </div>

                  <div className="text-[10px] text-emerald-400 font-medium flex items-center space-x-1">
                    <Truck className="w-3 h-3" />
                    <span>Get it by <strong>Tomorrow, 2 PM</strong></span>
                  </div>
                </div>

                {/* Commerce Zon Buy Buttons */}
                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <button
                    onClick={() => handleAddToCartWithNotify(product, 1)}
                    className="w-full py-2 bg-[#ffd814] hover:bg-[#f7ca00] text-slate-950 font-bold text-xs rounded-full border border-[#fcd200] transition shadow active:scale-98 flex items-center justify-center space-x-1.5"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    onClick={() => {
                      onAddToCart(product);
                      setSelectedProductModal(product);
                    }}
                    className="w-full py-1.5 bg-[#ffa41c] hover:bg-[#fa8900] text-slate-950 font-bold text-xs rounded-full border border-[#ff8f00] transition shadow active:scale-98"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Commerce Zon Buy Box Product Modal */}
      {selectedProductModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto font-sans">
            <button
              onClick={() => setSelectedProductModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 p-2 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
              {/* Product Media Gallery */}
              <div className="lg:col-span-5 space-y-4">
                <div className="h-72 bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-center">
                  <img
                    src={selectedProductModal.images?.[0] || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80'}
                    alt={selectedProductModal.title}
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs space-y-1">
                  <div className="text-slate-400">Sold by Merchant:</div>
                  <div className="font-bold text-amber-400 flex items-center space-x-1.5">
                    <Store className="w-4 h-4" />
                    <span>{selectedProductModal.merchant.name}</span>
                    {selectedProductModal.merchant.isVerified && (
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 pt-1">
                    Seller Rating: ⭐ {selectedProductModal.merchant.rating} / 5.0 (Verified Vendor)
                  </div>
                </div>
              </div>

              {/* Center Main Info */}
              <div className="lg:col-span-4 space-y-3">
                <span className="text-xs text-[#007185] hover:underline cursor-pointer font-semibold">
                  Visit the {selectedProductModal.merchant.name} Store
                </span>

                <h2 className="text-base font-bold text-white leading-snug">
                  {selectedProductModal.title}
                </h2>

                {/* Rating */}
                <div className="flex items-center space-x-2 text-xs">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[#007185] font-bold">4.8 out of 5 stars</span>
                </div>

                <div className="border-t border-b border-slate-800 py-3 my-2 space-y-2">
                  <div className="text-2xl font-extrabold text-white font-mono">
                    ${selectedProductModal.price.amount.toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-400">
                    Includes FREE Commerce Zon Prime Delivery & FREE Returns
                  </div>
                </div>

                {/* Description Bullet Points */}
                <div className="space-y-1 text-xs text-slate-300">
                  <div className="font-bold text-white mb-1">About this item:</div>
                  <p className="leading-relaxed text-slate-400">
                    {selectedProductModal.description}
                  </p>
                </div>
              </div>

              {/* Right Side Commerce Zon Buy Box */}
              <div className="lg:col-span-3 bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="text-xl font-black text-white font-mono">
                    ${selectedProductModal.price.amount.toFixed(2)}
                  </div>

                  <div className="text-xs text-emerald-400 font-bold flex items-center space-x-1">
                    <Check className="w-4 h-4" />
                    <span>In Stock ({selectedProductModal.totalStock} units)</span>
                  </div>

                  <div className="text-[11px] text-slate-300 space-y-1 border-t border-slate-800 pt-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Ships from:</span>
                      <span className="font-semibold text-white">Commerce Zon FBA Hub</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Sold by:</span>
                      <span className="font-semibold text-amber-400 truncate max-w-[110px]">
                        {selectedProductModal.merchant.name}
                      </span>
                    </div>
                  </div>

                  {/* Quantity Dropdown */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Quantity:</label>
                    <select
                      value={buyQuantity}
                      onChange={(e) => setBuyQuantity(parseInt(e.target.value) || 1)}
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#febd69]"
                    >
                      {[1, 2, 3, 4, 5, 10].map((q) => (
                        <option key={q} value={q}>
                          {q}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Buy Box Actions */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      handleAddToCartWithNotify(selectedProductModal, buyQuantity);
                      setSelectedProductModal(null);
                    }}
                    className="w-full py-2 bg-[#ffd814] hover:bg-[#f7ca00] text-slate-950 font-bold text-xs rounded-full border border-[#fcd200] transition shadow"
                  >
                    Add to Cart
                  </button>

                  <button
                    onClick={() => {
                      handleAddToCartWithNotify(selectedProductModal, buyQuantity);
                      setSelectedProductModal(null);
                    }}
                    className="w-full py-2 bg-[#ffa41c] hover:bg-[#fa8900] text-slate-950 font-bold text-xs rounded-full border border-[#ff8f00] transition shadow"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

