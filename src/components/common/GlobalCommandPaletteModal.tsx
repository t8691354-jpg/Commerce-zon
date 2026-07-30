import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  ShoppingBag,
  Package,
  Users,
  Store,
  Warehouse,
  HelpCircle,
  FileText,
  DollarSign,
  Settings,
  ShieldCheck,
  Tag,
  Truck,
  Database,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface GlobalCommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: any) => void;
}

export const GlobalCommandPaletteModal: React.FC<GlobalCommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickLinks = [
    { title: 'Global Product Catalog & Search', category: 'Catalog', tab: 'catalog', icon: ShoppingBag, desc: 'Search 182,000 live marketplace SKUs' },
    { title: 'Vendor & Seller Store Portal', category: 'Seller', tab: 'vendor', icon: Store, desc: 'Manage products, inventory & orders' },
    { title: 'Order Management System (OMS)', category: 'Orders', tab: 'orders', icon: Package, desc: 'Track & fulfill customer purchases' },
    { title: 'Multi-Warehouse Inventory & Allocation', category: 'Logistics', tab: 'warehouses', icon: Warehouse, desc: 'Monitor 4 global warehouse hubs' },
    { title: 'Fulfillment by Commerce Zon (FBA) Desk', category: 'FBA', tab: 'fba', icon: Package, desc: 'FBA shipments & inbound receiving' },
    { title: 'Commerce Zone Pay Wallet & Cards', category: 'Finance', tab: 'wallet', icon: DollarSign, desc: 'Balance, virtual cards & withdrawals' },
    { title: 'Payments & Stripe Processing', category: 'Finance', tab: 'payments', icon: DollarSign, desc: 'Stripe transactions & refund desk' },
    { title: 'Delivery Fleet & Logistics Dispatch', category: 'Delivery', tab: 'logistics', icon: Truck, desc: 'Fleet routing & proof of delivery' },
    { title: 'Customer Support & Ticketing Desk', category: 'Support', tab: 'support', icon: HelpCircle, desc: 'CS tickets & live chat assistance' },
    { title: 'Returns & RMA Management', category: 'Support', tab: 'returns', icon: FileText, desc: 'Manage buyer returns & refunds' },
    { title: 'AI Search & Recommendation Engine', category: 'AI', tab: 'ai_engine', icon: Sparkles, desc: 'Gemini 2.5 Flash neural search' },
    { title: 'Business Intelligence & BI Analytics', category: 'Analytics', tab: 'bi_analytics', icon: Settings, desc: 'Executive charts, GMV & cohort reports' },
    { title: 'Security & AI Fraud Detection Desk', category: 'Security', tab: 'security_fraud', icon: ShieldCheck, desc: 'Fraud risk scoring & IP blocking' },
    { title: 'Super Admin Control Panel (Module 20)', category: 'Super Admin', tab: 'super_admin', icon: Database, desc: 'Master executive command center' },
  ];

  const filteredLinks = quickLinks.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase()) ||
      item.desc.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-16 px-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Header */}
        <div className="p-4 border-b border-slate-800 flex items-center space-x-3 bg-slate-950/60">
          <Search className="w-5 h-5 text-amber-400" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command or search orders, products, sellers, support, settings..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-none text-slate-100 placeholder-slate-500 focus:outline-none text-sm font-mono"
          />
          <button
            onClick={onClose}
            className="p-1 bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg text-xs transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-3 overflow-y-auto space-y-2 divide-y divide-slate-800/40">
          {filteredLinks.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs font-mono">
              No matching commands or modules found for "{query}".
            </div>
          ) : (
            filteredLinks.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.tab}
                  onClick={() => {
                    onNavigateTab(item.tab);
                    onClose();
                  }}
                  className="w-full pt-2 first:pt-0 text-left p-3 rounded-2xl hover:bg-slate-800/60 transition flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-slate-950 border border-slate-800 text-amber-400 rounded-xl group-hover:border-amber-500/50 transition">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-100 text-xs">{item.title}</span>
                        <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-400 rounded font-mono">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">{item.desc}</p>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition" />
                </button>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 text-[11px] text-slate-500 font-mono flex justify-between items-center px-5">
          <span>Press <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px]">ESC</kbd> to exit</span>
          <span className="text-amber-400 font-bold">10 Role Portals • 20 Master Modules</span>
        </div>
      </div>
    </div>
  );
};
