import React from 'react';
import { ShoppingCart, Search, MapPin, Store, Warehouse, Bot, Activity, Map, ChevronDown, Wallet, ShieldCheck, Package, Settings, UserCheck, Globe, CreditCard, Truck, RotateCcw, Headphones, Bell, BarChart3, ShieldAlert } from 'lucide-react';
import { CommerceZonRole } from './CommerceZonSettingsModal';

interface MarketplaceHeaderProps {
  activeTab: any;
  setActiveTab: (tab: any) => void;
  cartCount: number;

  onOpenCart: () => void;
  serverStatus: boolean;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  onSearchSubmit: () => void;
  walletBalance: number;
  deliverLocation: string;
  currentRole: CommerceZonRole;
  currency: string;
  onOpenSettings: () => void;
}

export const MarketplaceHeader: React.FC<MarketplaceHeaderProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  onOpenCart,
  serverStatus,
  selectedCategory,
  setSelectedCategory,
  searchTerm,
  setSearchTerm,
  onSearchSubmit,
  walletBalance,
  deliverLocation,
  currentRole,
  currency,
  onOpenSettings,
}) => {
  const getRoleLabel = () => {
    switch (currentRole) {
      case 'BUYER': return 'Prime Customer';
      case 'SELLER': return 'Seller Central';
      case 'WAREHOUSE': return 'FBA Manager';
      case 'ADMIN': return 'System Executive';
    }
  };

  return (
    <header className="sticky top-0 z-40 font-sans shadow-lg">
      {/* Top Main Dark Commerce Zon Header Bar (#131921) */}
      <div className="bg-[#131921] text-white px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Commerce Zone Logo */}
        <div className="flex items-center space-x-3 cursor-pointer select-none" onClick={() => setActiveTab('catalog')}>
          <div className="flex flex-col">
            <div className="flex items-center space-x-1">
              <span className="text-xl font-black tracking-tight text-white">Commerce</span>
              <span className="text-xl font-black tracking-tight text-[#febd69]">Zone</span>
              <span className="text-[10px] font-extrabold text-[#febd69] bg-[#232f3e] px-1.5 py-0.5 rounded border border-[#37475a] uppercase tracking-wider ml-1">
                Pay
              </span>
            </div>
            <div className="w-20 h-1 -mt-0.5 rounded-full bg-gradient-to-r from-[#febd69] via-amber-400 to-[#f3a847]"></div>
          </div>
        </div>

        {/* Deliver To Location Selector */}
        <div
          onClick={onOpenSettings}
          className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 hover:border hover:border-white rounded cursor-pointer text-slate-300"
          title="Click to change delivery region & zip code"
        >
          <MapPin className="w-4 h-4 text-[#febd69]" />
          <div className="flex flex-col text-[11px] leading-tight">
            <span className="text-slate-400 text-[10px]">Deliver to</span>
            <span className="font-bold text-white max-w-[110px] truncate">{deliverLocation}</span>
          </div>
        </div>

        {/* Primary Search Bar */}
        <div className="flex-1 max-w-2xl mx-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSearchSubmit();
            }}
            className="flex items-center h-10 rounded-md overflow-hidden bg-white shadow-inner focus-within:ring-2 focus-within:ring-[#f3a847]"
          >
            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#f3f3f3] text-slate-800 text-xs font-semibold px-3 h-full border-r border-slate-300 focus:outline-none cursor-pointer hover:bg-slate-200"
            >
              <option value="all">All Departments</option>
              <option value="electronics">Electronics</option>
              <option value="computing">Computing & Laptops</option>
              <option value="robotics">Robotics & Automation</option>
              <option value="industrial">Industrial Equipment</option>
            </select>

            {/* Input Field */}
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Commerce Zon or ask Gemini AI..."
              className="flex-1 px-3 py-2 text-xs text-slate-900 focus:outline-none placeholder-slate-500 font-medium"
            />

            {/* Search Button */}
            <button
              type="submit"
              className="bg-[#febd69] hover:bg-[#f3a847] text-slate-900 px-4 h-full flex items-center justify-center transition font-bold"
              title="Search Commerce Zone"
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>
        </div>

        {/* Right Section Controls */}
        <div className="flex items-center space-x-3">
          {/* Commerce Zone Pay Wallet Button */}
          <div
            onClick={() => setActiveTab('wallet')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border cursor-pointer transition ${
              activeTab === 'wallet'
                ? 'bg-[#febd69] text-slate-950 border-[#febd69] font-black'
                : 'bg-[#232f3e] text-white border-[#37475a] hover:border-amber-400'
            }`}
          >
            <Wallet className="w-4 h-4 text-emerald-400" />
            <div className="flex flex-col text-[10px] leading-tight">
              <span className="text-slate-300 font-mono text-[9px] uppercase">Wallet</span>
              <span className="font-extrabold font-mono text-xs text-emerald-400">
                {currency === 'USD' ? '$' : currency === 'PKR' ? '₨ ' : '€'}
                {walletBalance.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Commerce Zon Returns & Orders Quick Link */}
          <div
            onClick={() => setActiveTab('orders')}
            className={`flex flex-col px-2.5 py-1 hover:border hover:border-white rounded cursor-pointer text-left transition ${
              activeTab === 'orders' ? 'border border-[#febd69] bg-[#232f3e]' : ''
            }`}
          >
            <span className="text-[10px] text-slate-300">Returns</span>
            <span className="font-bold text-xs text-[#febd69] flex items-center space-x-1">
              <Package className="w-3.5 h-3.5 text-white" />
              <span>& Orders</span>
            </span>
          </div>

          {/* Account Role & Settings Button */}
          <div
            onClick={onOpenSettings}
            className="flex items-center space-x-1.5 px-2.5 py-1 hover:border hover:border-white rounded cursor-pointer text-left bg-slate-900/60 border border-slate-700"
            title="Commerce Zon Settings & Role Switcher"
          >
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-400 font-mono uppercase">Role: {getRoleLabel()}</span>
              <span className="font-bold text-xs text-white flex items-center space-x-1">
                <Settings className="w-3.5 h-3.5 text-[#febd69]" />
                <span className="hidden sm:inline">Settings</span>
              </span>
            </div>
          </div>

          {/* Cart */}
          <div
            onClick={onOpenCart}
            className="flex items-center space-x-1 px-3 py-1 hover:border hover:border-white rounded cursor-pointer text-white relative"
          >
            <div className="relative">
              <ShoppingCart className="w-7 h-7 text-white" />
              <span className="absolute -top-1 left-2.5 bg-[#f08804] text-slate-950 font-black text-xs px-1.5 py-0.2 rounded-full min-w-[18px] text-center">
                {cartCount}
              </span>
            </div>
            <span className="font-bold text-xs hidden sm:inline text-[#febd69]">Cart</span>
          </div>
        </div>
      </div>

      {/* Commerce Zone Secondary Navigation Bar (#232f3e) */}
      <div className="bg-[#232f3e] text-white px-4 py-1.5 border-t border-[#37475a] flex items-center justify-between overflow-x-auto text-xs whitespace-nowrap">
        <div className="flex items-center space-x-1">
          {/* All Mega Menu Settings Trigger */}
          <button
            onClick={onOpenSettings}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-[#febd69] rounded text-xs font-black transition flex items-center space-x-1 border border-slate-700"
          >
            <span>☰ All</span>
            <span className="text-white text-[10px] font-normal">(Roles & Region)</span>
          </button>

          {/* Marketplace Catalog Tab */}
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3 py-1 rounded text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'catalog'
                ? 'bg-[#37475a] text-white border border-[#febd69]'
                : 'text-slate-200 hover:border hover:border-white'
            }`}
          >
            <span>Commerce Zon Catalog</span>
          </button>

          {/* Commerce Zone Wallet Tab */}
          <button
            onClick={() => setActiveTab('wallet')}
            className={`px-3 py-1 rounded text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'wallet'
                ? 'bg-[#febd69] text-slate-950 shadow'
                : 'text-emerald-400 hover:border hover:border-white'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Commerce Zone Wallet</span>
          </button>

          {/* Payment Gateway & Checkout System (Module 10) */}
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-3 py-1 rounded text-xs font-black transition flex items-center space-x-1.5 ${
              activeTab === 'payments'
                ? 'bg-emerald-500 text-slate-950 shadow-lg font-black'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Payments & Checkout (Mod 10)</span>
          </button>

          {/* Dropshipping Management System (Module 11) */}
          <button
            onClick={() => setActiveTab('dropshipping')}
            className={`px-3 py-1 rounded text-xs font-black transition flex items-center space-x-1.5 ${
              activeTab === 'dropshipping'
                ? 'bg-[#febd69] text-slate-950 shadow-lg font-black'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Dropshipping System (Mod 11)</span>
          </button>

          {/* FBA Fulfillment System (Module 12) */}
          <button
            onClick={() => setActiveTab('fba')}
            className={`px-3 py-1 rounded text-xs font-black transition flex items-center space-x-1.5 ${
              activeTab === 'fba'
                ? 'bg-[#febd69] text-slate-950 shadow-lg font-black'
                : 'bg-blue-500/20 text-blue-300 border border-blue-500/40 hover:bg-blue-500/30'
            }`}
          >
            <Warehouse className="w-3.5 h-3.5 text-blue-400" />
            <span>FBA System (Mod 12)</span>
          </button>

          {/* Shipping & Logistics Management System (Module 13) */}
          <button
            onClick={() => setActiveTab('logistics')}
            className={`px-3 py-1 rounded text-xs font-black transition flex items-center space-x-1.5 ${
              activeTab === 'logistics'
                ? 'bg-[#febd69] text-slate-950 shadow-lg font-black'
                : 'bg-purple-500/20 text-purple-300 border border-purple-500/40 hover:bg-purple-500/30'
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-purple-400" />
            <span>Logistics (Mod 13)</span>
          </button>

          {/* Returns, Refunds & Exchange System (Module 14) */}
          <button
            onClick={() => setActiveTab('returns')}
            className={`px-3 py-1 rounded text-xs font-black transition flex items-center space-x-1.5 ${
              activeTab === 'returns'
                ? 'bg-[#febd69] text-slate-950 shadow-lg font-black'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
            <span>Returns & Refunds (Mod 14)</span>
          </button>

          {/* Customer Support, Help Center & Live Chat System (Module 15) */}
          <button
            onClick={() => setActiveTab('support')}
            className={`px-3 py-1 rounded text-xs font-black transition flex items-center space-x-1.5 ${
              activeTab === 'support'
                ? 'bg-[#febd69] text-slate-950 shadow-lg font-black'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
            }`}
          >
            <Headphones className="w-3.5 h-3.5 text-amber-400" />
            <span>Support & Live Chat (Mod 15)</span>
          </button>

          {/* Enterprise Notification & Communication System (Module 16) */}
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-3 py-1 rounded text-xs font-black transition flex items-center space-x-1.5 ${
              activeTab === 'notifications'
                ? 'bg-[#febd69] text-slate-950 shadow-lg font-black'
                : 'bg-sky-500/20 text-sky-300 border border-sky-500/40 hover:bg-sky-500/30'
            }`}
          >
            <Bell className="w-3.5 h-3.5 text-sky-400" />
            <span>Notifications & Comm (Mod 16)</span>
          </button>

          {/* AI Search, Recommendation & Personalization Engine (Module 17) */}
          <button
            onClick={() => setActiveTab('ai_engine')}
            className={`px-3 py-1 rounded text-xs font-black transition flex items-center space-x-1.5 ${
              activeTab === 'ai_engine'
                ? 'bg-[#febd69] text-slate-950 shadow-lg font-black'
                : 'bg-purple-500/20 text-purple-300 border border-purple-500/40 hover:bg-purple-500/30'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Search & Rec (Mod 17)</span>
          </button>

          {/* Business Intelligence, Analytics & Reporting System (Module 18) */}
          <button
            onClick={() => setActiveTab('bi_analytics')}
            className={`px-3 py-1 rounded text-xs font-black transition flex items-center space-x-1.5 ${
              activeTab === 'bi_analytics'
                ? 'bg-[#febd69] text-slate-950 shadow-lg font-black'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
            <span>BI & Analytics (Mod 18)</span>
          </button>

          {/* Security, Fraud Detection & Compliance System (Module 19) */}
          <button
            onClick={() => setActiveTab('security_fraud')}
            className={`px-3 py-1 rounded text-xs font-black transition flex items-center space-x-1.5 ${
              activeTab === 'security_fraud'
                ? 'bg-[#febd69] text-slate-950 shadow-lg font-black'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Security & Fraud (Mod 19)</span>
          </button>

          {/* Super Admin Control Panel & Platform Management (Module 20) */}
          <button
            onClick={() => setActiveTab('super_admin')}
            className={`px-3 py-1 rounded text-xs font-black transition flex items-center space-x-1.5 ${
              activeTab === 'super_admin'
                ? 'bg-[#febd69] text-slate-950 shadow-lg font-black'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Super Admin (Mod 20)</span>
          </button>

          {/* Commerce Zon Orders */}
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1 rounded text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'orders'
                ? 'bg-[#37475a] text-white border border-[#febd69]'
                : 'text-slate-200 hover:border hover:border-white'
            }`}
          >
            <Package className="w-3.5 h-3.5 text-amber-300" />
            <span>Returns & Orders</span>
          </button>

          {/* Commerce Zon Seller Store Portal */}
          <button
            onClick={() => setActiveTab('vendor')}
            className={`px-3 py-1 rounded text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'vendor'
                ? 'bg-[#37475a] text-white border border-[#febd69]'
                : 'text-amber-300 hover:border hover:border-white'
            }`}
          >
            <Store className="w-3.5 h-3.5 text-[#febd69]" />
            <span>Seller Central</span>
          </button>

          {/* Warehouses & FBA */}
          <button
            onClick={() => setActiveTab('warehouses')}
            className={`px-3 py-1 rounded text-xs font-semibold transition flex items-center space-x-1.5 ${
              activeTab === 'warehouses'
                ? 'bg-[#37475a] text-white border border-[#febd69]'
                : 'text-slate-200 hover:border hover:border-white'
            }`}
          >
            <Warehouse className="w-3.5 h-3.5 text-blue-300" />
            <span>Fulfillment (FBA)</span>
          </button>

          {/* AI Services */}
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-3 py-1 rounded text-xs font-semibold transition flex items-center space-x-1.5 ${
              activeTab === 'ai'
                ? 'bg-[#37475a] text-white border border-[#febd69]'
                : 'text-slate-200 hover:border hover:border-white'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-sky-300" />
            <span>Gemini AI Engine</span>
          </button>

          {/* Master Roadmap */}
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-3 py-1 rounded text-xs font-semibold transition flex items-center space-x-1.5 ${
              activeTab === 'roadmap'
                ? 'bg-[#37475a] text-white border border-[#febd69]'
                : 'text-slate-200 hover:border hover:border-white'
            }`}
          >
            <Map className="w-3.5 h-3.5 text-indigo-300" />
            <span>Roadmap</span>
          </button>

          {/* Event Inspector */}
          <button
            onClick={() => setActiveTab('events')}
            className={`px-3 py-1 rounded text-xs font-semibold transition flex items-center space-x-1.5 ${
              activeTab === 'events'
                ? 'bg-[#37475a] text-white border border-[#febd69]'
                : 'text-slate-200 hover:border hover:border-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-300" />
            <span>Event Bus</span>
          </button>

          {/* Super Admin Control Console */}
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-3 py-1 rounded text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'admin'
                ? 'bg-[#febd69] text-slate-950 font-black shadow-lg'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400 fill-current" />
            <span>Admin Console</span>
          </button>
        </div>


        {/* Server Status Badge */}
        <div className="hidden md:flex items-center space-x-2 text-[11px] text-slate-300 font-mono pl-4">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Commerce Zon Cloud API: {serverStatus ? 'Online (3000)' : 'Connecting...'}</span>
        </div>
      </div>
    </header>
  );
};



