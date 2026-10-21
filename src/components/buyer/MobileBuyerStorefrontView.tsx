import React, { useState } from 'react';
import {
  Search,
  MapPin,
  ShoppingCart,
  Sparkles,
  Heart,
  Star,
  Plus,
  Flame,
  ArrowRight,
  SlidersHorizontal,
  Package,
  Code,
  Briefcase,
  Bot,
  Truck,
  ShieldCheck,
  Tag,
  Clock,
  ChevronRight,
  TrendingUp,
  User,
  ShoppingBag,
  Bell
} from 'lucide-react';
import { Product } from '../../types/domain';
import { MarketplaceMode } from '../../types/marketplaceModes';

interface MobileBuyerStorefrontViewProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onOpenCart: () => void;
  cartCount: number;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSearchSubmit: () => void;
  deliverLocation: string;
  marketplaceMode: MarketplaceMode;
  onSelectMarketplaceMode: (mode: MarketplaceMode) => void;
  onNavigateOrders?: () => void;
  onOpenSettings?: () => void;
  walletBalance?: number;
}

const CATEGORIES = [
  { id: 'all', name: 'All Items', icon: '🛍️' },
  { id: 'electronics', name: 'Electronics', icon: '🎧' },
  { id: 'computing', name: 'Computing', icon: '💻' },
  { id: 'fashion', name: 'Fashion', icon: '👟' },
  { id: 'home', name: 'Home Living', icon: '🛋️' },
  { id: 'robotics', name: 'Robotics', icon: '🤖' },
  { id: 'industrial', name: 'Industrial', icon: '⚙️' },
];

const DEALS_BANNERS = [
  {
    id: 1,
    title: 'Summer Mega Fest',
    subtitle: 'Up to 60% OFF on Audio & Gadgets',
    tag: 'LIMITED TIME',
    gradient: 'from-amber-500 via-orange-600 to-rose-700',
    btnText: 'Shop Deals',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 2,
    title: 'Commerce Zon Express',
    subtitle: 'Next-Day Delivery guaranteed on Prime orders',
    tag: 'FREE SHIPPING',
    gradient: 'from-indigo-600 via-blue-700 to-sky-600',
    btnText: 'Explore Prime',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 3,
    title: 'Top Digital Code & SaaS',
    subtitle: 'Zero Shipping, Instant Access in 1 Click',
    tag: 'INSTANT DELIVERY',
    gradient: 'from-emerald-600 via-teal-700 to-cyan-700',
    btnText: 'Browse Digital',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop&q=80'
  }
];

export const MobileBuyerStorefrontView: React.FC<MobileBuyerStorefrontViewProps> = ({
  products,
  onAddToCart,
  onOpenCart,
  cartCount,
  selectedCategory,
  setSelectedCategory,
  searchTerm,
  setSearchTerm,
  onSearchSubmit,
  deliverLocation,
  marketplaceMode,
  onSelectMarketplaceMode,
  onNavigateOrders,
  onOpenSettings,
  walletBalance = 2450.00
}) => {
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeBottomNav, setActiveBottomNav] = useState<'home' | 'categories' | 'orders' | 'cart' | 'profile'>('home');

  const toggleFavorite = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const currentBanner = DEALS_BANNERS[activeBannerIdx];

  return (
    <div className="w-full flex flex-col bg-slate-950 text-slate-100 font-sans pb-24 select-none">
      {/* 1. Mobile Top Brand & Location Strip (Reference 1) */}
      <div className="px-4 pt-3 pb-2 bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800/80 sticky top-0 z-30 backdrop-blur-md bg-opacity-95">
        <div className="flex items-center justify-between mb-2">
          {/* Logo & Slogan */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#febd69] to-amber-600 flex items-center justify-center font-black text-slate-950 text-base shadow-lg shadow-amber-500/20">
              CZ
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-white text-sm tracking-tight">Commerce</span>
                <span className="font-black text-[#febd69] text-sm">Zone</span>
                <span className="text-[9px] bg-amber-400/20 text-[#febd69] px-1.5 py-0.2 rounded font-black border border-amber-400/30">
                  PRIME
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Everything delivered directly</p>
            </div>
          </div>

          {/* Quick Actions (Settings & Cart) */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition"
              title="Settings & Profile"
            >
              <User className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition shadow-lg shadow-amber-500/20"
              title="Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-slate-950">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Deliver Location Pill */}
        <div className="flex items-center justify-between py-1 px-2.5 bg-slate-900/90 border border-slate-800/80 rounded-xl text-xs text-slate-300 mb-2">
          <div className="flex items-center space-x-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-[#febd69] shrink-0" />
            <span className="text-[11px] text-slate-400">Deliver to:</span>
            <span className="text-[11px] font-bold text-white truncate max-w-[170px]">{deliverLocation}</span>
          </div>
          <span className="text-[10px] text-amber-400 font-bold hover:underline cursor-pointer" onClick={onOpenSettings}>
            Change
          </span>
        </div>

        {/* 2. Prominent Mobile Search Bar (Reference 1) */}
        <div className="relative flex items-center">
          <div className="absolute left-3 text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search products, brands, or deals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit()}
            className="w-full pl-9 pr-20 py-2.5 bg-slate-900 border border-slate-700/80 rounded-2xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#febd69] transition"
          />
          <button
            onClick={onSearchSubmit}
            className="absolute right-1.5 px-3 py-1.5 bg-[#febd69] hover:bg-amber-400 text-slate-950 font-black text-[11px] rounded-xl transition"
          >
            Find
          </button>
        </div>
      </div>

      {/* 3. Marketplace 4-Mode Quick Switcher Strip */}
      <div className="px-4 py-2.5 bg-slate-900/40 border-b border-slate-800/60 overflow-x-auto no-scrollbar">
        <div className="flex items-center space-x-2 min-w-max">
          <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider pr-1">
            Markets:
          </span>
          <button
            onClick={() => onSelectMarketplaceMode('physical')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              marketplaceMode === 'physical'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>1. Physical Goods</span>
          </button>

          <button
            onClick={() => onSelectMarketplaceMode('digital')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              marketplaceMode === 'digital'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>2. Digital Assets</span>
            <span className="text-[9px] px-1 bg-white/20 text-white rounded">NEW</span>
          </button>

          <button
            onClick={() => onSelectMarketplaceMode('freelancer')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              marketplaceMode === 'freelancer'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>3. Freelancers</span>
            <span className="text-[9px] px-1 bg-emerald-400/20 text-emerald-300 rounded font-bold">LIVE</span>
          </button>

          <button
            onClick={() => onSelectMarketplaceMode('ai')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              marketplaceMode === 'ai'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>4. AI Marketplace</span>
          </button>
        </div>
      </div>

      <div className="px-4 py-3 space-y-5">
        {/* 4. Promotional Hero Carousel Banner (Reference 1) */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
          <div className={`p-5 bg-gradient-to-r ${currentBanner.gradient} flex items-center justify-between text-white relative`}>
            <div className="space-y-2 z-10 max-w-[65%]">
              <span className="text-[9px] font-black tracking-widest uppercase bg-black/30 px-2 py-0.5 rounded-full border border-white/20">
                {currentBanner.tag}
              </span>
              <h2 className="text-lg font-black leading-tight drop-shadow">
                {currentBanner.title}
              </h2>
              <p className="text-[11px] text-white/90 font-medium leading-relaxed">
                {currentBanner.subtitle}
              </p>
              <button
                onClick={() => {
                  if (activeBannerIdx === 2) onSelectMarketplaceMode('digital');
                }}
                className="mt-1 px-4 py-1.5 bg-white text-slate-950 font-black text-xs rounded-xl hover:bg-slate-100 transition shadow-md flex items-center space-x-1.5"
              >
                <span>{currentBanner.btnText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <img
              src={currentBanner.image}
              alt=""
              className="w-28 h-28 object-cover rounded-2xl shadow-xl border-2 border-white/20 transform rotate-2 hover:rotate-0 transition shrink-0"
            />
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-2 right-4 flex space-x-1 z-20">
            {DEALS_BANNERS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveBannerIdx(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  activeBannerIdx === i ? 'w-5 bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 5. Horizontal Categories Strip with Icons */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
              <span>Categories</span>
            </h3>
            <span className="text-[10px] text-amber-400 font-bold hover:underline cursor-pointer">
              See all (14)
            </span>
          </div>

          <div className="flex items-center space-x-2.5 overflow-x-auto no-scrollbar py-1">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-2xl min-w-[70px] border transition ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-400 text-white ring-1 ring-amber-400/50'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span className="text-xl mb-1">{cat.icon}</span>
                  <span className="text-[10px] font-bold truncate max-w-[65px]">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 6. Flash Deals / Trending Offers Row */}
        <div className="p-3 bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-purple-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg">
              <Flame className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-white text-xs">Flash Sale</span>
                <span className="text-[9px] bg-rose-500 text-white font-black px-1.5 rounded">HOT</span>
              </div>
              <p className="text-[10px] text-slate-400">Prime early bird discount ending in 02h 45m</p>
            </div>
          </div>
          <div className="flex items-center text-xs font-mono font-bold text-amber-400 space-x-1">
            <Clock className="w-3.5 h-3.5" />
            <span>02:45:19</span>
          </div>
        </div>

        {/* 7. Recommended Products Grid (Reference 1) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-white">Recommended For You</h3>
              <p className="text-[10px] text-slate-400">Based on trending buyer activity</p>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              {products.length} Items Available
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {products.map((product) => {
              const isFav = favorites.includes(product.id);
              const priceUSD = product.price.amount;
              const originalPrice = Math.round(priceUSD * 1.25);

              return (
                <div
                  key={product.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-2.5 flex flex-col justify-between hover:border-slate-700 transition relative group shadow-lg"
                >
                  {/* Top Badges & Wishlist */}
                  <div className="relative w-full aspect-square bg-slate-950 rounded-xl overflow-hidden mb-2">
                    <img
                      src={product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80'}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />

                    {/* Discount badge */}
                    <span className="absolute top-2 left-2 bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                      -20%
                    </span>

                    {/* Wishlist button */}
                    <button
                      onClick={(e) => toggleFavorite(product.id, e)}
                      className={`absolute top-2 right-2 p-1.5 rounded-full transition backdrop-blur-md ${
                        isFav
                          ? 'bg-rose-500 text-white'
                          : 'bg-black/40 text-slate-300 hover:text-white'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Product Details */}
                  <div className="space-y-1 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-1 text-[10px] text-amber-400 mb-0.5">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="font-bold">4.8</span>
                        <span className="text-slate-500">(128)</span>
                      </div>
                      <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                        {product.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 truncate">
                        By {product.merchant?.name || 'Verified Vendor'}
                      </p>
                    </div>

                    <div className="pt-2">
                      <div className="flex items-baseline space-x-1.5">
                        <span className="text-sm font-black text-amber-400 font-mono">
                          ${priceUSD.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-slate-500 line-through font-mono">
                          ${originalPrice}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80">
                        <div className="flex items-center space-x-1 text-[9px] text-emerald-400 font-bold">
                          <Truck className="w-3 h-3" />
                          <span>Prime FREE</span>
                        </div>

                        <button
                          onClick={() => onAddToCart(product)}
                          className="p-1.5 bg-[#febd69] hover:bg-amber-400 text-slate-950 rounded-xl font-bold transition shadow-md flex items-center justify-center"
                          title="Add to Cart"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 8. Trusted Top Sellers Showcase (Reference 1) */}
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Trusted Official Stores</h4>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">100% Verified</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { name: 'OmniTech Pro', rating: '4.9★', deals: '42 items', icon: '⚡' },
              { name: 'AeroCraft Direct', rating: '5.0★', deals: '18 items', icon: '✈️' },
              { name: 'DevMatrix Labs', rating: '4.8★', deals: '95 items', icon: '💎' },
            ].map((store, i) => (
              <div
                key={i}
                className="p-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-center space-y-1 hover:border-slate-700 transition"
              >
                <div className="text-xl">{store.icon}</div>
                <div className="text-[11px] font-bold text-white truncate">{store.name}</div>
                <div className="text-[9px] text-amber-400 font-mono">{store.rating}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 9. Bottom Navigation Bar matching Mobile Reference 1 */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 border-t border-slate-800 backdrop-blur-xl py-2 px-4 flex items-center justify-around text-slate-400 max-w-md mx-auto">
        <button
          onClick={() => setActiveBottomNav('home')}
          className={`flex flex-col items-center space-y-0.5 transition ${
            activeBottomNav === 'home' ? 'text-[#febd69]' : 'hover:text-slate-200'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px] font-bold">Store</span>
        </button>

        <button
          onClick={() => onSelectMarketplaceMode('digital')}
          className={`flex flex-col items-center space-y-0.5 transition ${
            marketplaceMode === 'digital' ? 'text-indigo-400' : 'hover:text-slate-200'
          }`}
        >
          <Code className="w-5 h-5" />
          <span className="text-[10px] font-bold">Digital</span>
        </button>

        <button
          onClick={() => onSelectMarketplaceMode('freelancer')}
          className={`flex flex-col items-center space-y-0.5 transition ${
            marketplaceMode === 'freelancer' ? 'text-emerald-400' : 'hover:text-slate-200'
          }`}
        >
          <Briefcase className="w-5 h-5" />
          <span className="text-[10px] font-bold">Talent</span>
        </button>

        <button
          onClick={() => {
            setActiveBottomNav('orders');
            if (onNavigateOrders) onNavigateOrders();
          }}
          className={`flex flex-col items-center space-y-0.5 transition ${
            activeBottomNav === 'orders' ? 'text-[#febd69]' : 'hover:text-slate-200'
          }`}
        >
          <Truck className="w-5 h-5" />
          <span className="text-[10px] font-bold">Orders</span>
        </button>

        <button
          onClick={onOpenCart}
          className="relative flex flex-col items-center space-y-0.5 text-slate-400 hover:text-white transition"
        >
          <ShoppingCart className="w-5 h-5 text-[#febd69]" />
          {cartCount > 0 && (
            <span className="absolute -top-1 right-2 bg-rose-600 text-white text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
          <span className="text-[10px] font-bold text-[#febd69]">Cart</span>
        </button>
      </div>
    </div>
  );
};
