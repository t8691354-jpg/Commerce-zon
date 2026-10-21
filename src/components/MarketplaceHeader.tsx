import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Search, MapPin, Store, Warehouse, Bot, Activity, Map, ChevronDown, Wallet, ShieldCheck, Package, Settings, UserCheck, Globe, CreditCard, Truck, RotateCcw, Headphones, Bell, BarChart3, ShieldAlert, X, Loader2, Scale } from 'lucide-react';
import { CommerceZonRole } from './CommerceZonSettingsModal';
import { SearchAutocompleteDropdown } from './search/SearchAutocompleteDropdown';
import { AutocompleteSuggestion } from '../types/search';
import { useI18n } from '../i18n/I18nContext';
import { LanguageCurrencySelectorModal } from './localization/LanguageCurrencySelectorModal';
import { MarketplaceMode, MarketplaceModeDefinition } from '../types/marketplaceModes';
import { MarketplaceSwitcherDropdown } from './navigation/MarketplaceSwitcherDropdown';
import { UpcomingMarketplaceModal } from './navigation/UpcomingMarketplaceModal';

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
  marketplaceMode?: MarketplaceMode;
  onSelectMarketplaceMode?: (mode: MarketplaceMode) => void;
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
  marketplaceMode = 'physical',
  onSelectMarketplaceMode,
}) => {
  const { activeLanguageDef, activeCurrencyDef, activeCountryDef, t, isRTL } = useI18n();
  const [isLocalizationModalOpen, setIsLocalizationModalOpen] = useState(false);
  const [upcomingModalDef, setUpcomingModalDef] = useState<MarketplaceModeDefinition | null>(null);
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);
  const [isAutocompleteLoading, setIsAutocompleteLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const abortControllerRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced Autocomplete Fetching (250ms with request cancellation)
  useEffect(() => {
    const trimmed = searchTerm.trim();
    if (trimmed.length < 1) {
      setSuggestions([]);
      setIsAutocompleteOpen(false);
      setIsAutocompleteLoading(false);
      return;
    }

    setIsAutocompleteLoading(true);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products/search/autocomplete?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.suggestions || []);
          setIsAutocompleteOpen(true);
          setSelectedIndex(-1);
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Autocomplete fetch error:', err);
        }
      } finally {
        setIsAutocompleteLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchTerm]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isAutocompleteOpen || suggestions.length === 0) {
      if (e.key === 'Enter') {
        setIsAutocompleteOpen(false);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        e.preventDefault();
        handleSelectSuggestion(suggestions[selectedIndex]);
      } else {
        setIsAutocompleteOpen(false);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsAutocompleteOpen(false);
    }
  };

  const handleSelectSuggestion = (item: AutocompleteSuggestion) => {
    setIsAutocompleteOpen(false);
    setSelectedIndex(-1);
    if (item.type === 'category' && item.category) {
      setSelectedCategory(item.category);
      setSearchTerm('');
      onSearchSubmit();
    } else {
      setSearchTerm(item.title);
      setTimeout(() => {
        onSearchSubmit();
      }, 50);
    }
  };

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

        {/* 3-Dots Marketplace Switcher (1. Physical, 2. Digital, 3. Freelancer, 4. AI) */}
        <div className="flex items-center">
          <MarketplaceSwitcherDropdown
            currentMode={marketplaceMode}
            onSelectMode={(mode) => onSelectMarketplaceMode?.(mode)}
            onOpenUpcomingModal={(def) => setUpcomingModalDef(def)}
          />
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

        {/* Primary Search Bar with Real-time Autocomplete Dropdown */}
        <div className="relative flex-1 max-w-2xl mx-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsAutocompleteOpen(false);
              onSearchSubmit();
            }}
            className="flex items-center h-10 rounded-md overflow-hidden bg-white shadow-inner focus-within:ring-2 focus-within:ring-[#f3a847]"
          >
            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                if (searchTerm.trim()) {
                  setTimeout(() => onSearchSubmit(), 50);
                }
              }}
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
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (suggestions.length > 0) setIsAutocompleteOpen(true);
              }}
              placeholder="Search Commerce Zon by name, brand, SKU or AI intent..."
              className="flex-1 px-3 py-2 text-xs text-slate-900 focus:outline-none placeholder-slate-500 font-medium"
            />

            {/* Loading Indicator */}
            {isAutocompleteLoading && (
              <div className="pr-2 text-amber-500 flex items-center">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              </div>
            )}

            {/* Clear Search Button */}
            {searchTerm && !isAutocompleteLoading && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setSuggestions([]);
                  setIsAutocompleteOpen(false);
                  inputRef.current?.focus();
                }}
                className="pr-2 text-slate-400 hover:text-slate-700 transition"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Search Button */}
            <button
              type="submit"
              className="bg-[#febd69] hover:bg-[#f3a847] text-slate-900 px-4 h-full flex items-center justify-center transition font-bold"
              title="Search Commerce Zone"
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>

          {/* Autocomplete Suggestions Dropdown Component */}
          <SearchAutocompleteDropdown
            isOpen={isAutocompleteOpen}
            suggestions={suggestions}
            isLoading={isAutocompleteLoading}
            query={searchTerm}
            selectedIndex={selectedIndex}
            onSelectSuggestion={handleSelectSuggestion}
            onClose={() => setIsAutocompleteOpen(false)}
          />
        </div>

        {/* Right Section Controls */}
        <div className="flex items-center space-x-3">
          {/* Part 16: Language & Currency Quick Selector Button */}
          <div
            onClick={() => setIsLocalizationModalOpen(true)}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 hover:border hover:border-white rounded-lg cursor-pointer text-white bg-slate-900/80 border border-slate-700 transition"
            title="Change Language, Currency & Shipping Destination (Part 16)"
          >
            <span className="text-sm">{activeLanguageDef.flag}</span>
            <span className="font-extrabold text-[11px] text-[#febd69] font-mono">{activeCurrencyDef.code}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </div>

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

          {/* Enterprise Performance Engineering & Scale (Part 5) */}
          <button
            onClick={() => setActiveTab('performance_scale')}
            className={`px-3 py-1 rounded text-xs font-black transition flex items-center space-x-1.5 ${
              activeTab === 'performance_scale'
                ? 'bg-[#febd69] text-slate-950 shadow-lg font-black'
                : 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-500/40'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-300" />
            <span>Performance & Scale (Part 5)</span>
          </button>

          {/* Enterprise AI Platform (Part 4) */}
          <button
            onClick={() => setActiveTab('ai_gateway')}
            className={`px-3 py-1 rounded text-xs font-black transition flex items-center space-x-1.5 ${
              activeTab === 'ai_gateway'
                ? 'bg-[#febd69] text-slate-950 shadow-lg font-black'
                : 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/50 hover:bg-indigo-500/40'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-indigo-300" />
            <span>AI Platform (Part 4)</span>
          </button>

          {/* IAM & Enterprise Security Portal (Part 3) */}
          <button
            onClick={() => setActiveTab('security_iam')}
            className={`px-3 py-1 rounded text-xs font-black transition flex items-center space-x-1.5 ${
              activeTab === 'security_iam'
                ? 'bg-[#febd69] text-slate-950 shadow-lg font-black'
                : 'bg-amber-500/30 text-[#febd69] border border-amber-500/50 hover:bg-amber-500/40'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#febd69]" />
            <span>IAM & Security (Part 3)</span>
          </button>

          {/* Enterprise Marketplace Core (Part 6) */}
          <button
            onClick={() => setActiveTab('marketplace_core')}
            className={`px-3 py-1 rounded text-xs font-black transition flex items-center space-x-1.5 ${
              activeTab === 'marketplace_core'
                ? 'bg-[#febd69] text-slate-950 shadow-lg font-black'
                : 'bg-amber-500/30 text-[#febd69] border border-amber-500/50 hover:bg-amber-500/40'
            }`}
          >
            <Store className="w-3.5 h-3.5 text-[#febd69]" />
            <span>Marketplace Core (Part 6)</span>
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
            <span>{t('nav.returnsAndOrders', 'Returns & Orders')}</span>
          </button>

          {/* Part 15: Trust, Safety & Dispute Resolution */}
          <button
            onClick={() => setActiveTab('trust_safety')}
            className={`px-3 py-1 rounded text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'trust_safety'
                ? 'bg-[#37475a] text-[#febd69] border border-[#febd69]'
                : 'text-slate-200 hover:border hover:border-white'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-[#febd69]" />
            <span>{t('nav.disputesAndTrust', 'Disputes & Trust')}</span>
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
            <span>{t('nav.sellerCentral', 'Seller Central')}</span>
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
            <span>{t('nav.fulfillment', 'Fulfillment (FBA)')}</span>
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
            <span>{t('nav.adminConsole', 'Admin Console')}</span>
          </button>

          {/* Part 16: Internationalization & Regional Currency Hub */}
          <button
            onClick={() => setIsLocalizationModalOpen(true)}
            className="px-3 py-1 rounded text-xs font-bold transition flex items-center space-x-1.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-500/30"
            title="Global Marketplace Localization, Multi-Currency & i18n (Part 16)"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span>{activeLanguageDef.flag} {activeCurrencyDef.code} (Part 16)</span>
          </button>
        </div>


        {/* Server Status Badge */}
        <div className="hidden md:flex items-center space-x-2 text-[11px] text-slate-300 font-mono pl-4">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Commerce Zon Cloud API: {serverStatus ? 'Online (3000)' : 'Connecting...'}</span>
        </div>
      </div>

      {/* Part 16 Localization Modal */}
      <LanguageCurrencySelectorModal
        isOpen={isLocalizationModalOpen}
        onClose={() => setIsLocalizationModalOpen(false)}
      />

      {/* Upcoming Marketplace Roadmap Modal (Mode 3 Freelancer & Mode 4 AI) */}
      <UpcomingMarketplaceModal
        mode={upcomingModalDef}
        isOpen={!!upcomingModalDef}
        onClose={() => setUpcomingModalDef(null)}
        onNotifyMe={(email) => {
          console.log(`Subscribed ${email} to ${upcomingModalDef?.title} notifications.`);
        }}
      />
    </header>
  );
};



