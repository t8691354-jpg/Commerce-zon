import React from 'react';
import { MOCK_FINANCIAL_METRICS } from '../../data/mockBiAnalytics';
import { DollarSign, PieChart, TrendingUp, CreditCard, Shield, Scale } from 'lucide-react';

export const BiFinancialAnalyticsView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
          <span className="text-xs text-slate-400">Gross Fee Monetization</span>
          <p className="text-2xl font-black text-amber-400 font-mono">$222,439,560</p>
          <p className="text-xs text-emerald-400 font-semibold">+21.2% YoY Growth</p>
        </div>
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
          <span className="text-xs text-slate-400">Seller Referral Commissions</span>
          <p className="text-2xl font-black text-slate-100 font-mono">$148.2M</p>
          <p className="text-xs text-slate-400">66.6% share of platform rev</p>
        </div>
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
          <span className="text-xs text-slate-400">Ad Network Platform Revenue</span>
          <p className="text-2xl font-black text-emerald-400 font-mono">$21.4M</p>
          <p className="text-xs text-emerald-400 font-semibold">+34.5% Sponsored Search</p>
        </div>
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
          <span className="text-xs text-slate-400">FBA Fulfillment Services</span>
          <p className="text-2xl font-black text-blue-400 font-mono">$42.1M</p>
          <p className="text-xs text-slate-400">Storage & picking fees</p>
        </div>
      </div>

      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-6">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-amber-400" />
          Revenue Streams & Operating P&L Architecture
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Revenue Breakdown</h4>
            <div className="space-y-3 font-mono text-xs">
              {MOCK_FINANCIAL_METRICS.map((fin) => (
                <div key={fin.revenueType} className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                  <div className="flex justify-between font-sans font-bold text-slate-200">
                    <span>{fin.revenueType}</span>
                    <span className="text-emerald-400">+{fin.growthYoyPct}%</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Amount: <strong className="text-amber-400">${(fin.amount / 1e6).toFixed(2)}M</strong></span>
                    <span>Share: <strong className="text-slate-200">{fin.shareOfTotalPct}%</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Operating Expenses & Profitability</h4>
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex justify-between">
                <span className="text-slate-400 font-sans">Cloud Infra & Spark Compute</span>
                <span className="text-rose-400 font-bold">$28,400,000</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex justify-between">
                <span className="text-slate-400 font-sans">Fulfillment Hub Operations</span>
                <span className="text-rose-400 font-bold">$84,200,000</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex justify-between">
                <span className="text-slate-400 font-sans">Customer Support & Refund Reserve</span>
                <span className="text-rose-400 font-bold">$24,500,000</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex justify-between">
                <span className="text-slate-400 font-sans">Marketing & Associate Payouts</span>
                <span className="text-rose-400 font-bold">$20,529,360</span>
              </div>
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex justify-between font-sans">
                <span className="font-bold text-emerald-300">Net Operating Profit</span>
                <span className="font-black text-emerald-400 text-sm">$64,810,200 (29.1%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
