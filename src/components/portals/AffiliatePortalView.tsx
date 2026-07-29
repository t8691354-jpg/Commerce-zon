import React, { useState } from 'react';
import {
  Share2,
  DollarSign,
  TrendingUp,
  Link,
  Copy,
  Check,
  Users,
  Award,
  BarChart3,
  Download,
  Calendar,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

export const AffiliatePortalView: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const referralLink = 'https://commercezone.enterprise/ref?aff=AMZ-PRIME-8842';

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const campaigns = [
    { name: 'Quantum Headphones Launch', rate: '12% Commission', clicks: 4280, conversions: 312, earnings: '$1,872.00' },
    { name: 'Summer Prime Tech Expo', rate: '8.5% Commission', clicks: 8910, conversions: 540, earnings: '$3,240.50' },
    { name: 'Enterprise Robotics & Automation', rate: '15% B2B Bonus', clicks: 1200, conversions: 48, earnings: '$4,120.00' },
  ];

  return (
    <div className="p-6 bg-slate-950 text-slate-100 min-h-screen space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl">
            <Share2 className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-100 tracking-tight">Affiliate & Influencer Earnings Hub</h1>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Referral link performance • Real-time attribution tracking & automated wallet payouts
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition flex items-center space-x-2 shadow-lg shadow-emerald-500/10">
            <DollarSign className="w-4 h-4" />
            <span>Withdraw $9,232.50 Earnings</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-2">
          <span className="text-[10px] text-slate-400 font-mono uppercase">Total Earnings (YTD)</span>
          <div className="text-2xl font-black text-emerald-400">$9,232.50</div>
          <div className="text-[10px] text-emerald-400 font-mono flex items-center space-x-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>+24.8% vs last month</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-2">
          <span className="text-[10px] text-slate-400 font-mono uppercase">Total Clicks</span>
          <div className="text-2xl font-black text-slate-100">14,390</div>
          <div className="text-[10px] text-slate-400 font-mono">Conversion rate: 6.25%</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-2">
          <span className="text-[10px] text-slate-400 font-mono uppercase">Orders Referred</span>
          <div className="text-2xl font-black text-amber-400">900 Orders</div>
          <div className="text-[10px] text-slate-400 font-mono">Average order value: $148.00</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-2">
          <span className="text-[10px] text-slate-400 font-mono uppercase">Affiliate Tier</span>
          <div className="text-2xl font-black text-amber-400 flex items-center space-x-2">
            <Award className="w-6 h-6 text-amber-400" />
            <span>PLATINUM</span>
          </div>
          <div className="text-[10px] text-amber-400 font-mono">12% Base commission rate unlocked</div>
        </div>
      </div>

      {/* Referral Link & Campaign Generator */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
        <div className="font-bold text-slate-100 text-sm flex items-center space-x-2">
          <Link className="w-4 h-4 text-emerald-400" />
          <span>Your Master Referral Link</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            readOnly
            value={referralLink}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-amber-400 font-mono focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold rounded-xl text-xs transition flex items-center justify-center space-x-2"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Referral Link'}</span>
          </button>
        </div>
      </div>

      {/* Active Campaigns Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden font-mono">
        <div className="p-4 bg-slate-950 border-b border-slate-800 font-bold text-slate-200 text-xs">
          Active Referral Campaigns
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/50 text-slate-400 font-bold border-b border-slate-800">
              <tr>
                <th className="p-4">Campaign Name</th>
                <th className="p-4">Commission Rate</th>
                <th className="p-4">Total Clicks</th>
                <th className="p-4">Conversions</th>
                <th className="p-4">Earnings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {campaigns.map((c, i) => (
                <tr key={i} className="hover:bg-slate-800/40">
                  <td className="p-4 font-bold text-slate-100">{c.name}</td>
                  <td className="p-4 text-amber-400 font-bold">{c.rate}</td>
                  <td className="p-4 text-slate-300">{c.clicks}</td>
                  <td className="p-4 text-emerald-400 font-bold">{c.conversions}</td>
                  <td className="p-4 text-slate-100 font-bold">{c.earnings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
