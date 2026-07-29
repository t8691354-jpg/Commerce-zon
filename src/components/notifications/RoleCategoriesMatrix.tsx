import React, { useState } from 'react';
import { 
  Users, ShoppingBag, Store, Share2, Truck, Package, ShieldAlert, 
  Send, Layers, CheckCircle2, Zap, ArrowRight, ExternalLink
} from 'lucide-react';
import { NotificationRole } from '../../types/notifications';
import { ROLE_CATEGORIES } from '../../data/mockNotificationsData';

interface Props {
  onSelectCategoryForTrigger: (role: NotificationRole, category: string) => void;
}

export const RoleCategoriesMatrix: React.FC<Props> = ({ onSelectCategoryForTrigger }) => {
  const [activeRoleTab, setActiveRoleTab] = useState<NotificationRole>('Buyer');

  const roleMeta: Record<NotificationRole, { title: string; desc: string; icon: any; color: string }> = {
    Buyer: {
      title: 'Buyer (Customer)',
      desc: 'Order tracking, payment updates, delivery alerts, wishlist & coupons',
      icon: ShoppingBag,
      color: 'text-sky-400 bg-sky-500/10 border-sky-500/30'
    },
    Seller: {
      title: 'Seller (Merchant)',
      desc: 'Order receipts, stock warnings, settlements, return requests & health',
      icon: Store,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
    },
    Affiliate: {
      title: 'Affiliate Partner',
      desc: 'Commission payouts, bonus milestones & campaign conversions',
      icon: Share2,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
    },
    Supplier: {
      title: 'Supplier & OEM',
      desc: 'Purchase order receipts, inventory requisitions & payment advice',
      icon: Package,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/30'
    },
    Warehouse: {
      title: 'Warehouse & FBA',
      desc: 'Inbound stock, picking batches, packing cutoffs & low shelf alerts',
      icon: Layers,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/30'
    },
    DeliveryPartner: {
      title: 'Delivery Partner',
      desc: 'Route dispatch, package assignment, driver updates & return pickups',
      icon: Truck,
      color: 'text-amber-300 bg-amber-400/10 border-amber-400/30'
    },
    Administrator: {
      title: 'System Administrator',
      desc: 'Security alerts, fraud detection, database backups & server health',
      icon: ShieldAlert,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/30'
    }
  };

  const rolesList: NotificationRole[] = [
    'Buyer', 'Seller', 'Affiliate', 'Supplier', 'Warehouse', 'DeliveryPartner', 'Administrator'
  ];

  return (
    <div className="space-y-6">
      {/* Role Navigation Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {rolesList.map((r) => {
          const MetaIcon = roleMeta[r].icon;
          const isActive = activeRoleTab === r;
          const count = ROLE_CATEGORIES[r]?.length || 0;

          return (
            <button
              key={r}
              onClick={() => setActiveRoleTab(r)}
              className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                isActive
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-lg'
                  : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <MetaIcon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-black ${
                  isActive ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-slate-300'
                }`}>
                  {count}
                </span>
              </div>
              <div className="text-xs font-bold leading-tight">{r}</div>
            </button>
          );
        })}
      </div>

      {/* Role Category Details Grid */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
          <div className={`p-2.5 rounded-lg border ${roleMeta[activeRoleTab].color}`}>
            {React.createElement(roleMeta[activeRoleTab].icon, { className: 'w-5 h-5' })}
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{roleMeta[activeRoleTab].title} Categories</h3>
            <p className="text-xs text-slate-400">{roleMeta[activeRoleTab].desc}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {ROLE_CATEGORIES[activeRoleTab]?.map((cat, idx) => (
            <div
              key={cat}
              className="p-3.5 bg-slate-950/80 rounded-lg border border-slate-800 hover:border-amber-500/40 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-white">{cat}</span>
                  <span className="text-[10px] font-mono text-slate-500">#{idx + 1}</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Default channels: Email, Push, In-App. High priority real-time event.
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Active Routing
                </span>

                <button
                  onClick={() => onSelectCategoryForTrigger(activeRoleTab, cat)}
                  className="px-2.5 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30 text-[11px] flex items-center space-x-1"
                >
                  <Zap className="w-3 h-3" />
                  <span>Test Event</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
