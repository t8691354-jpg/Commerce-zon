import React, { useState } from 'react';
import {
  MOCK_CATEGORY_REVENUE,
  MOCK_GEOGRAPHIC_SALES,
  MOCK_SELLER_METRICS,
} from '../../data/mockBiAnalytics';
import {
  TrendingUp,
  Clock,
  Globe,
  Store,
  Layers,
  BarChart,
  DollarSign,
  Calendar,
} from 'lucide-react';

interface Props {
  globalTimeframe: string;
}

export const BiSalesAnalyticsView: React.FC<Props> = () => {
  const [timeGranularity, setTimeGranularity] = useState<'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual'>('monthly');
  const [salesTab, setSalesTab] = useState<'timeframe' | 'category' | 'geography' | 'peak_hours'>('timeframe');

  // Peak shopping hours mock distribution (24 hours)
  const peakHoursData = [
    { hour: '00:00', orders: 12400 },
    { hour: '02:00', orders: 8200 },
    { hour: '04:00', orders: 6100 },
    { hour: '06:00', orders: 14200 },
    { hour: '08:00', orders: 38900 },
    { hour: '10:00', orders: 74200 },
    { hour: '12:00', orders: 98400 },
    { hour: '14:00', orders: 112000 },
    { hour: '16:00', orders: 94100 },
    { hour: '18:00', orders: 88200 },
    { hour: '20:00', orders: 128400 }, // Peak
    { hour: '22:00', orders: 64200 },
  ];

  const maxPeakOrders = Math.max(...peakHoursData.map((d) => d.orders));

  return (
    <div className="space-y-6">
      {/* Sub-navigation Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-slate-200">Sales Analytics Breakdown:</span>
          {[
            { id: 'timeframe', label: 'Time Horizon Trends' },
            { id: 'category', label: 'Category & Brand Revenue' },
            { id: 'geography', label: 'Geographic Country & City' },
            { id: 'peak_hours', label: 'Peak Shopping Hours' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSalesTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                salesTab === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Granularity Picker */}
        <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <Calendar className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
          {(['daily', 'weekly', 'monthly', 'quarterly', 'annual'] as const).map((g) => (
            <button
              key={g}
              onClick={() => setTimeGranularity(g)}
              className={`px-2.5 py-1 rounded text-[11px] capitalize transition ${
                timeGranularity === g
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Main View 1: Time Horizon Trends */}
      {salesTab === 'timeframe' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Sales Trajectory ({timeGranularity.toUpperCase()} Mode)
              </h3>
              <p className="text-xs text-slate-400">
                Aggregated sales volume and marketplace commission revenues
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400">Avg Daily GMV</span>
                <p className="text-lg font-bold text-amber-400 mt-1">$49.4M / day</p>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400">Orders / Day</span>
                <p className="text-lg font-bold text-slate-100 mt-1">614,000</p>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400">YoY Growth Rate</span>
                <p className="text-lg font-bold text-emerald-400 mt-1">+18.4%</p>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400">Net Take Rate</span>
                <p className="text-lg font-bold text-blue-400 mt-1">15.0%</p>
              </div>
            </div>

            {/* Visual Simulated Sales Bar Graph */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <span className="text-xs font-semibold text-slate-300">Sales Breakdown Matrix ({timeGranularity})</span>
              <div className="space-y-2">
                {[
                  { label: 'Q1 2026', gmv: 353000000, rev: 52950000, growth: '+14.2%' },
                  { label: 'Q2 2026', gmv: 435000000, rev: 65250000, growth: '+19.8%' },
                  { label: 'Q3 2026 (Est)', gmv: 495000000, rev: 74250000, growth: '+22.1%' },
                  { label: 'Q4 2026 (Peak)', gmv: 680000000, rev: 102000000, growth: '+28.5%' },
                ].map((row) => (
                  <div key={row.label} className="p-3 bg-slate-900 rounded-lg border border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-200">{row.label}</p>
                      <p className="text-slate-400">Growth: <span className="text-emerald-400 font-bold">{row.growth}</span></p>
                    </div>
                    <div className="text-right font-mono">
                      <p className="text-amber-400 font-bold">${(row.gmv / 1e6).toFixed(1)}M GMV</p>
                      <p className="text-blue-400">${(row.rev / 1e6).toFixed(2)}M Rev</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Sellers Breakdown */}
          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Store className="w-4 h-4 text-amber-400" />
              Top Seller Revenue Contributors
            </h3>
            <div className="space-y-3 text-xs">
              {MOCK_SELLER_METRICS.map((sel) => (
                <div key={sel.sellerId} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-200">{sel.sellerName}</p>
                    <p className="text-slate-400">{sel.tier} • Rating {sel.customerRating}★</p>
                  </div>
                  <div className="text-right font-mono">
                    <p className="text-amber-400 font-bold">${(sel.revenue / 1e6).toFixed(1)}M</p>
                    <p className="text-emerald-400">{sel.profitabilityPct}% Margin</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main View 2: Category & Brand */}
      {salesTab === 'category' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              Marketplace Category Revenue Share
            </h3>
            <div className="space-y-3">
              {MOCK_CATEGORY_REVENUE.map((cat) => (
                <div key={cat.category} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-200">{cat.category}</span>
                    <span className="text-emerald-400 font-bold">{cat.growthPct > 0 ? `+${cat.growthPct}% YoY` : `${cat.growthPct}%`}</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono text-slate-400">
                    <span>Revenue: <strong className="text-amber-400">${(cat.revenue / 1e6).toFixed(1)}M</strong></span>
                    <span>Orders: <strong className="text-slate-200">{cat.orders.toLocaleString()}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <BarChart className="w-4 h-4 text-blue-400" />
              Top Global Brand Performance
            </h3>
            <div className="space-y-3 text-xs">
              {[
                { brand: 'Anker Tech', revenue: 48200000, marketShare: '11.4%', rating: 4.88 },
                { brand: 'Commerce Zon Basics', revenue: 94200000, marketShare: '22.4%', rating: 4.65 },
                { brand: 'Sony Electronics', revenue: 82400000, marketShare: '19.6%', rating: 4.91 },
                { brand: 'Philips Consumer', revenue: 38200000, marketShare: '9.1%', rating: 4.74 },
                { brand: 'Logitech Gear', revenue: 42100000, marketShare: '10.0%', rating: 4.82 },
              ].map((b) => (
                <div key={b.brand} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-200">{b.brand}</p>
                    <p className="text-slate-400">Market Share: {b.marketShare}</p>
                  </div>
                  <div className="text-right font-mono">
                    <p className="text-amber-400 font-bold">${(b.revenue / 1e6).toFixed(1)}M</p>
                    <p className="text-emerald-400">{b.rating}★ Rating</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main View 3: Geography */}
      {salesTab === 'geography' && (
        <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-400" />
              Geographic Sales Heatmap & Revenue distribution
            </h3>
            <p className="text-xs text-slate-400">Country and Metro City level transaction breakdown</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {MOCK_GEOGRAPHIC_SALES.map((geo) => (
              <div key={geo.city} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-200">{geo.city}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                    {geo.country}
                  </span>
                </div>
                <p className="text-xl font-black text-amber-400 font-mono">${(geo.revenue / 1e6).toFixed(1)}M</p>
                <div className="text-xs text-slate-400 space-y-1 pt-1 border-t border-slate-800/80">
                  <p>Orders: <strong className="text-slate-200">{geo.orders.toLocaleString()}</strong></p>
                  <p>Buyers: <strong className="text-slate-200">{geo.buyers.toLocaleString()}</strong></p>
                  <p>Top Category: <span className="text-amber-300">{geo.topCategory}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main View 4: Peak Hours */}
      {salesTab === 'peak_hours' && (
        <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              24-Hour Peak Shopping Traffic Analysis
            </h3>
            <p className="text-xs text-slate-400">Hourly order checkout distribution to optimize server auto-scaling and warehouse dispatches</p>
          </div>

          <div className="space-y-3">
            {peakHoursData.map((item) => (
              <div key={item.hour} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300 font-bold">{item.hour} UTC</span>
                  <span className="text-amber-400">{item.orders.toLocaleString()} orders</span>
                </div>
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${(item.orders / maxPeakOrders) * 100}%` }}
                    className={`h-full rounded-full transition-all ${
                      item.orders > 100000 ? 'bg-amber-400 shadow-lg' : 'bg-blue-500'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
