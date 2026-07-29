import React, { useState } from 'react';
import { MOCK_PROMOTIONS } from '../../data/mockSuperAdmin';
import { PromotionCampaign } from '../../types/superAdmin';
import { Tag, Plus, CheckCircle2, Percent, Calendar, Users, Zap } from 'lucide-react';

export const PromotionsDealsManagementView: React.FC = () => {
  const [promotions, setPromotions] = useState<PromotionCampaign[]>(MOCK_PROMOTIONS);
  const [notification, setNotification] = useState<string | null>(null);

  const handleCreatePromo = () => {
    const newPromo: PromotionCampaign = {
      id: `PRM-${Math.floor(200 + Math.random() * 800)}`,
      title: 'Flash Flash Cyber Monday Promo',
      code: 'CYBER25',
      type: 'Flash Sale',
      discountPct: 25,
      startDate: '2026-08-01',
      endDate: '2026-08-05',
      targetUserSegment: 'All Buyers',
      usageCount: 0,
      usageLimit: 25000,
      status: 'Active',
    };
    setPromotions([newPromo, ...promotions]);
    setNotification('New promotional campaign code created & synced to shopping cart engine.');
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-6">
      {notification && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Tag className="w-5 h-5 text-amber-400" />
              Promotions, Lightning Deals & Coupon Campaign Manager
            </h3>
            <p className="text-xs text-slate-400">
              Manage sitewide discounts, coupon codes, flash sales, referral credits, and user segment targeting
            </p>
          </div>

          <button
            onClick={handleCreatePromo}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Campaign</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {promotions.map((p) => (
            <div key={p.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 font-bold">{p.id}</span>
                  <h4 className="font-bold text-slate-100 text-sm">{p.title}</h4>
                  {p.code && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/40 font-mono text-xs font-bold rounded">
                      CODE: {p.code}
                    </span>
                  )}
                </div>

                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] rounded font-bold">
                  {p.status}
                </span>
              </div>

              <div className="space-y-1.5 text-[11px] font-mono text-slate-400 bg-slate-900 p-3 rounded-xl border border-slate-800">
                <div className="flex justify-between">
                  <span>Type: <strong className="text-slate-200">{p.type}</strong></span>
                  <span>Discount: <strong className="text-emerald-400">{p.discountPct}% OFF</strong></span>
                </div>
                <div className="flex justify-between">
                  <span>Target: <strong className="text-blue-400">{p.targetUserSegment}</strong></span>
                  <span>Used: <strong className="text-amber-400">{p.usageCount.toLocaleString()} / {p.usageLimit.toLocaleString()}</strong></span>
                </div>
                <div className="text-[10px] text-slate-500 pt-1">
                  Valid: {p.startDate} to {p.endDate}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
