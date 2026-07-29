import React from 'react';
import { MOCK_CUSTOMER_SEGMENTS } from '../../data/mockBiAnalytics';
import {
  Users,
  Heart,
  TrendingUp,
  UserCheck,
  UserPlus,
  RefreshCw,
  Award,
  Smile,
  ShieldCheck,
  PieChart,
} from 'lucide-react';

export const BiCustomerAnalyticsView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Top Customer KPIs Header Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>New vs Returning</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-slate-100">31.6% / 68.4%</p>
          <p className="text-xs text-emerald-400 font-semibold">+4.2% returning buyers YoY</p>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Avg Customer Lifetime Value</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-amber-400 font-mono">$648.20</p>
          <p className="text-xs text-slate-400">36-month trailing discounted model</p>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Overall Retention Rate</span>
            <RefreshCw className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-black text-slate-100">81.4%</p>
          <p className="text-xs text-emerald-400 font-semibold">Churn rate down to 3.8%</p>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>CSAT / Net Promoter Score</span>
            <Smile className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-black text-slate-100">NPS +78</p>
          <p className="text-xs text-purple-400 font-semibold">4.88/5 CSAT rating avg</p>
        </div>
      </div>

      {/* Customer Segment Analysis */}
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-amber-400" />
              Customer Micro-Segmentation & Behavioral Cohorts
            </h3>
            <p className="text-xs text-slate-400">Comparing purchase frequency, retention, and basket size across customer tiers</p>
          </div>
          <span className="text-xs font-mono px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full font-bold">
            14.8M Active Buyers Evaluated
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {MOCK_CUSTOMER_SEGMENTS.map((seg) => (
            <div key={seg.segmentName} className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    {seg.segmentName}
                  </h4>
                  <p className="text-xs text-slate-400">{seg.customerCount.toLocaleString()} Total Customers</p>
                </div>
                <span className="font-mono text-sm font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                  CLV: ${seg.avgClv}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-400 text-[11px]">Retention Rate</span>
                  <p className="font-bold text-emerald-400 mt-0.5">{seg.retentionRatePct}%</p>
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-400 text-[11px]">Churn Rate</span>
                  <p className="font-bold text-rose-400 mt-0.5">{seg.churnRatePct}%</p>
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-400 text-[11px]">Avg Basket Size</span>
                  <p className="font-bold text-slate-200 mt-0.5">${seg.avgBasketSize}</p>
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-400 text-[11px]">Orders / Month</span>
                  <p className="font-bold text-blue-400 mt-0.5">{seg.purchaseFrequency}x</p>
                </div>
              </div>

              {/* Progress Bar for retention */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>Retention Health Index</span>
                  <span className="text-emerald-400 font-bold">{seg.retentionRatePct}%</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div style={{ width: `${seg.retentionRatePct}%` }} className="bg-emerald-500 h-full rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prime Membership & Loyalty Breakdown */}
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-400" />
          Prime Membership & Loyalty Program Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400">Total Prime Members</span>
            <p className="text-xl font-bold text-slate-100">8,920,000</p>
            <p className="text-blue-400">60.1% of active customer base</p>
          </div>
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400">Prime Renewal Rate</span>
            <p className="text-xl font-bold text-emerald-400">96.2%</p>
            <p className="text-slate-400">Annual recurring subscription stability</p>
          </div>
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400">Spend Multiplier</span>
            <p className="text-xl font-bold text-amber-400">3.4x</p>
            <p className="text-slate-400">Prime members spend 3.4x vs non-Prime</p>
          </div>
        </div>
      </div>
    </div>
  );
};
