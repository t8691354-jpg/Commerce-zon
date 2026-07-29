import React from 'react';
import { MOCK_AFFILIATE_METRICS } from '../../data/mockBiAnalytics';
import { Users, MousePointer, DollarSign, Award, Share2, TrendingUp } from 'lucide-react';

export const BiAffiliateAnalyticsView: React.FC = () => {
  const totalClicks = MOCK_AFFILIATE_METRICS.reduce((acc, curr) => acc + curr.totalClicks, 0);
  const totalCommission = MOCK_AFFILIATE_METRICS.reduce((acc, curr) => acc + curr.commissionEarned, 0);
  const totalRevenue = MOCK_AFFILIATE_METRICS.reduce((acc, curr) => acc + curr.affiliateRevenue, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
          <span className="text-xs text-slate-400">Total Associate Clicks</span>
          <p className="text-2xl font-black text-slate-100 font-mono">{(totalClicks / 1e6).toFixed(1)}M</p>
          <p className="text-xs text-emerald-400 font-semibold">+15.1% YoY Traffic</p>
        </div>
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
          <span className="text-xs text-slate-400">Affiliate Driven Revenue</span>
          <p className="text-2xl font-black text-amber-400 font-mono">${(totalRevenue / 1e6).toFixed(1)}M</p>
          <p className="text-xs text-slate-400">5.5% avg referral fee rate</p>
        </div>
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
          <span className="text-xs text-slate-400">Commissions Paid</span>
          <p className="text-2xl font-black text-emerald-400 font-mono">${(totalCommission / 1e6).toFixed(2)}M</p>
          <p className="text-xs text-emerald-400 font-semibold">100% On-Time Payouts</p>
        </div>
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
          <span className="text-xs text-slate-400">Blended Conversion Rate</span>
          <p className="text-2xl font-black text-blue-400 font-mono">5.82%</p>
          <p className="text-xs text-slate-400">Top publisher: Wirecutter (6.82%)</p>
        </div>
      </div>

      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          Top Performing Associate Publishers & Influencer Networks
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_AFFILIATE_METRICS.map((aff) => (
            <div key={aff.affiliateId} className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-100 text-sm">{aff.affiliateName}</h4>
                  <p className="text-xs text-slate-400">{aff.referralSource} • Top Campaign: {aff.topCampaign}</p>
                </div>
                <span className="font-mono text-xs px-2 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded font-bold">
                  {aff.conversionRatePct}% Conv
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-400 text-[10px]">Traffic Clicks</span>
                  <p className="font-bold text-slate-200 mt-0.5">{(aff.totalClicks / 1e6).toFixed(2)}M</p>
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-400 text-[10px]">GMV Driven</span>
                  <p className="font-bold text-amber-400 mt-0.5">${(aff.affiliateRevenue / 1e6).toFixed(1)}M</p>
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-400 text-[10px]">Commission</span>
                  <p className="font-bold text-emerald-400 mt-0.5">${(aff.commissionEarned / 1e3).toFixed(0)}K</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
