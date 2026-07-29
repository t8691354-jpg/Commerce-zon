import React, { useState } from 'react';
import {
  ShoppingBag,
  Store,
  Share2,
  PackageCheck,
  Warehouse,
  Truck,
  Headphones,
  DollarSign,
  ShieldCheck,
  Search,
  Command,
  Bell,
  Settings,
  Folder,
  Terminal,
  ChevronDown,
  Layers,
  Sparkles,
} from 'lucide-react';

export type PortalRole =
  | 'buyer'
  | 'seller'
  | 'affiliate'
  | 'supplier'
  | 'warehouse'
  | 'delivery'
  | 'support'
  | 'finance'
  | 'super_admin';

interface RolePortalHeaderBarProps {
  currentPortal: PortalRole;
  onSelectPortal: (portal: PortalRole) => void;
  onOpenCommandPalette: () => void;
  onNavigateTab: (tab: any) => void;
  activeTab: string;
}

export const RolePortalHeaderBar: React.FC<RolePortalHeaderBarProps> = ({
  currentPortal,
  onSelectPortal,
  onOpenCommandPalette,
  onNavigateTab,
  activeTab,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const portals = [
    { id: 'buyer' as PortalRole, name: 'Buyer Marketplace Portal', icon: ShoppingBag, color: 'text-amber-400', badge: 'PRIME' },
    { id: 'seller' as PortalRole, name: 'Seller & Merchant Central', icon: Store, color: 'text-amber-300', badge: 'MERCHANT' },
    { id: 'affiliate' as PortalRole, name: 'Affiliate & Referral Hub', icon: Share2, color: 'text-emerald-400', badge: 'EARN' },
    { id: 'supplier' as PortalRole, name: 'Supplier & B2B Procurement', icon: PackageCheck, color: 'text-blue-400', badge: 'SUPPLY' },
    { id: 'warehouse' as PortalRole, name: 'Warehouse & FBA Logistics', icon: Warehouse, color: 'text-sky-400', badge: 'FBA' },
    { id: 'delivery' as PortalRole, name: 'Delivery & Fleet Partner Desk', icon: Truck, color: 'text-purple-400', badge: 'FLEET' },
    { id: 'support' as PortalRole, name: 'Customer Support & Help Desk', icon: Headphones, color: 'text-[#febd69]', badge: 'CS-DESK' },
    { id: 'finance' as PortalRole, name: 'Finance, Wallet & Settlement', icon: DollarSign, color: 'text-emerald-300', badge: 'FINANCE' },
    { id: 'super_admin' as PortalRole, name: 'Super Admin Executive Command', icon: ShieldCheck, color: 'text-rose-400', badge: 'MOD-20' },
  ];

  const activePortalObj = portals.find((p) => p.id === currentPortal) || portals[0];

  return (
    <div className="bg-[#0f172a] text-slate-100 border-b border-slate-800 shadow-xl font-sans">
      {/* Top Enterprise Role Portal Selector Strip */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Active Portal Dropdown Selector */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2.5 px-3 py-1.5 bg-slate-900 border border-slate-700 hover:border-amber-400/60 rounded-xl transition cursor-pointer"
          >
            <div className="p-1 bg-slate-950 rounded-lg border border-slate-800">
              <activePortalObj.icon className={`w-4 h-4 ${activePortalObj.color}`} />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider">Active Portal View</span>
              <span className="font-extrabold text-white text-xs flex items-center space-x-1">
                <span>{activePortalObj.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
              </span>
            </div>
            <span className="text-[9px] font-mono font-bold px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full">
              {activePortalObj.badge}
            </span>
          </button>

          {/* Role Selection Menu */}
          {isDropdownOpen && (
            <div className="absolute top-12 left-0 z-50 w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 space-y-1 divide-y divide-slate-800/60">
              <div className="px-3 py-1.5 text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                Switch Independent Role Portal
              </div>
              <div className="pt-1 space-y-1 max-h-96 overflow-y-auto">
                {portals.map((p) => {
                  const Icon = p.icon;
                  const isSel = p.id === currentPortal;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        onSelectPortal(p.id);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl transition flex items-center justify-between ${
                        isSel
                          ? 'bg-amber-500/10 border border-amber-500/40 text-amber-400 font-bold'
                          : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={`w-4 h-4 ${p.color}`} />
                        <span className="text-xs font-semibold">{p.name}</span>
                      </div>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 bg-slate-950 text-slate-400 rounded">
                        {p.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Command Palette Trigger Search */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center space-x-3 px-4 py-1.5 bg-slate-900/90 border border-slate-800 hover:border-amber-400/50 rounded-xl text-slate-400 text-xs font-mono transition flex-1 max-w-md shadow-inner"
        >
          <Search className="w-3.5 h-3.5 text-amber-400" />
          <span className="truncate flex-1 text-left text-slate-400">Search orders, SKUs, sellers, tickets, logs...</span>
          <span className="flex items-center space-x-1 px-1.5 py-0.5 bg-slate-950 border border-slate-800 text-slate-400 rounded text-[10px]">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </span>
        </button>

        {/* Global Utilities Quick Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigateTab('file_manager')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition flex items-center space-x-1.5 border ${
              activeTab === 'file_manager'
                ? 'bg-amber-500 text-slate-950 font-bold border-amber-500'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
            title="Unified File Manager"
          >
            <Folder className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Assets</span>
          </button>

          <button
            onClick={() => onNavigateTab('logs_center')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition flex items-center space-x-1.5 border ${
              activeTab === 'logs_center'
                ? 'bg-amber-500 text-slate-950 font-bold border-amber-500'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
            title="Central Telemetry Audit Logs"
          >
            <Terminal className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden md:inline">Logs</span>
          </button>

          <button
            onClick={() => onNavigateTab('notifications')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition flex items-center space-x-1.5 border ${
              activeTab === 'notifications'
                ? 'bg-amber-500 text-slate-950 font-bold border-amber-500'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
            title="Central Notification Center"
          >
            <Bell className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden md:inline">Alerts</span>
          </button>

          <button
            onClick={() => onNavigateTab('settings_center')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition flex items-center space-x-1.5 border ${
              activeTab === 'settings_center'
                ? 'bg-amber-500 text-slate-950 font-bold border-amber-500'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
            title="Universal Settings Center"
          >
            <Settings className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
