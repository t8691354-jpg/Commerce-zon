import React from 'react';
import { MOCK_SELLER_METRICS } from '../../data/mockBiAnalytics';
import { Store, ShieldCheck, Award, AlertTriangle, TrendingUp, CheckCircle, PackageCheck } from 'lucide-react';

export const BiSellerAnalyticsView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
          <span className="text-xs text-slate-400">Total Active Sellers</span>
          <p className="text-2xl font-black text-slate-100">184,200</p>
          <p className="text-xs text-emerald-400 font-semibold">+8.5% YoY Growth</p>
        </div>
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
          <span className="text-xs text-slate-400">Professional vs Individual</span>
          <p className="text-2xl font-black text-amber-400">82% / 18%</p>
          <p className="text-xs text-slate-400">Pro Tier ($39.99/mo fee)</p>
        </div>
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
          <span className="text-xs text-slate-400">Avg Cancellation Rate</span>
          <p className="text-2xl font-black text-emerald-400">0.28%</p>
          <p className="text-xs text-emerald-400 font-semibold">Below 1.0% threshold</p>
        </div>
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
          <span className="text-xs text-slate-400">Fulfillment Efficiency</span>
          <p className="text-2xl font-black text-blue-400">98.4%</p>
          <p className="text-xs text-slate-400">FBA + Verified MFN</p>
        </div>
      </div>

      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Store className="w-5 h-5 text-amber-400" />
              Top Marketplace Merchant Scorecard & Analytics
            </h3>
            <p className="text-xs text-slate-400">Revenue, profitability, order volume, return rates, and inventory health</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="py-3 px-4">Seller Name & Tier</th>
                <th className="py-3 px-4">Revenue</th>
                <th className="py-3 px-4">Profitability</th>
                <th className="py-3 px-4">Order Volume</th>
                <th className="py-3 px-4">Cancellation</th>
                <th className="py-3 px-4">Return Rate</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Fulfilment Eff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {MOCK_SELLER_METRICS.map((s) => (
                <tr key={s.sellerId} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-sans font-bold text-slate-100">
                    <div>{s.sellerName}</div>
                    <span className="text-[10px] text-amber-400 font-mono">{s.tier} • {s.sellerId}</span>
                  </td>
                  <td className="py-3 px-4 text-amber-400 font-bold">${(s.revenue / 1e6).toFixed(1)}M</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">{s.profitabilityPct}%</td>
                  <td className="py-3 px-4 text-slate-200">{s.orderVolume.toLocaleString()}</td>
                  <td className="py-3 px-4 text-slate-300">{s.cancellationRatePct}%</td>
                  <td className="py-3 px-4 text-rose-300">{s.returnRatePct}%</td>
                  <td className="py-3 px-4 text-amber-300 font-bold">{s.customerRating}★</td>
                  <td className="py-3 px-4 text-blue-400 font-bold">{s.fulfilmentEfficiencyPct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
