import React from 'react';
import { MOCK_MARKETING_METRICS } from '../../data/mockBiAnalytics';
import { Megaphone, Target, MousePointer, Award, Percent, DollarSign } from 'lucide-react';

export const BiMarketingAnalyticsView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
          <span className="text-xs text-slate-400">Total Campaign Revenue</span>
          <p className="text-2xl font-black text-amber-400 font-mono">$51,520,000</p>
          <p className="text-xs text-emerald-400 font-semibold">+28.4% Return on Ad Spend</p>
        </div>
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
          <span className="text-xs text-slate-400">Blended CAC</span>
          <p className="text-2xl font-black text-slate-100 font-mono">$18.40</p>
          <p className="text-xs text-emerald-400 font-semibold">Reduced by $1.80 MoM</p>
        </div>
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
          <span className="text-xs text-slate-400">Average Click-Through Rate</span>
          <p className="text-2xl font-black text-blue-400 font-mono">9.08%</p>
          <p className="text-xs text-slate-400">Top push CTR: 16.19%</p>
        </div>
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
          <span className="text-xs text-slate-400">Total Conversions</span>
          <p className="text-2xl font-black text-emerald-400 font-mono">638,000</p>
          <p className="text-xs text-slate-400">Across 4 key promo channels</p>
        </div>
      </div>

      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-amber-400" />
          Active Growth Marketing & Campaign Performance Matrix
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_MARKETING_METRICS.map((mkt) => (
            <div key={mkt.campaignId} className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-100 text-sm">{mkt.campaignName}</h4>
                  <p className="text-xs text-slate-400">{mkt.type} • ID: {mkt.campaignId}</p>
                </div>
                <span className="text-xs font-bold px-2 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded font-mono">
                  ${(mkt.revenueGenerated / 1e6).toFixed(2)}M Rev
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-400 text-[10px]">Impressions</span>
                  <p className="font-bold text-slate-200 mt-0.5">{(mkt.impressions / 1e6).toFixed(1)}M</p>
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-400 text-[10px]">CTR %</span>
                  <p className="font-bold text-blue-400 mt-0.5">{mkt.ctrPct}%</p>
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-400 text-[10px]">Conversions</span>
                  <p className="font-bold text-emerald-400 mt-0.5">{(mkt.conversions / 1e3).toFixed(0)}K</p>
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-400 text-[10px]">CAC ($)</span>
                  <p className="font-bold text-amber-400 mt-0.5">${mkt.cac.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
