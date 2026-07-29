import React, { useState } from 'react';
import {
  MOCK_EXECUTIVE_KPIS,
  MOCK_REVENUE_TRENDS,
  MOCK_CATEGORY_REVENUE,
  MOCK_GEOGRAPHIC_SALES,
} from '../../data/mockBiAnalytics';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ShoppingBag,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Layers,
  Globe,
  PieChart as PieIcon,
  BarChart2,
  CheckCircle2,
  Filter,
} from 'lucide-react';

interface Props {
  timeframe: string;
}

export const BiExecutiveDashboardView: React.FC<Props> = ({ timeframe }) => {
  const [selectedKpiCategory, setSelectedKpiCategory] = useState<'all' | 'financial' | 'operations' | 'growth' | 'customers'>('all');
  const [activeDashboardTab, setActiveDashboardTab] = useState<'revenue' | 'growth' | 'health' | 'scorecard'>('revenue');

  const filteredKpis = MOCK_EXECUTIVE_KPIS.filter(
    (kpi) => selectedKpiCategory === 'all' || kpi.category === selectedKpiCategory
  );

  const maxRevenue = Math.max(...MOCK_REVENUE_TRENDS.map((t) => t.gmv));

  return (
    <div className="space-y-6">
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">KPI Filter:</span>
          {(['all', 'financial', 'operations', 'growth', 'customers'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedKpiCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition ${
                selectedKpiCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="text-xs text-slate-400 font-mono">
          Showing <span className="text-amber-400 font-bold">{filteredKpis.length}</span> Executive KPIs | Timeframe: <span className="text-emerald-400 font-semibold">{timeframe.toUpperCase()}</span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredKpis.map((kpi) => (
          <div
            key={kpi.id}
            className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 hover:border-amber-500/40 rounded-xl p-4 transition-all duration-200 shadow-lg relative overflow-hidden group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400 mb-1">{kpi.label}</p>
                <h3 className="text-xl font-black text-slate-100 tracking-tight">{kpi.value}</h3>
              </div>
              <div
                className={`flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                  kpi.isPositive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}
              >
                {kpi.isPositive ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                {kpi.changePct > 0 ? `+${kpi.changePct}%` : `${kpi.changePct}%`}
              </div>
            </div>

            {/* Target & Description */}
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/60 pt-2">
              <span className="truncate max-w-[170px]" title={kpi.description}>
                {kpi.description}
              </span>
              <span className="text-slate-500 font-mono">Target: <strong className="text-slate-300">{kpi.target}</strong></span>
            </div>

            {/* Mini Sparkline Bar representation */}
            <div className="mt-3 flex items-end space-x-1 h-6 pt-1">
              {kpi.sparkline.map((val, idx) => {
                const maxVal = Math.max(...kpi.sparkline);
                const heightPct = Math.round((val / (maxVal || 1)) * 100);
                return (
                  <div
                    key={idx}
                    style={{ height: `${heightPct}%` }}
                    className={`flex-1 rounded-t transition-all ${
                      kpi.isPositive ? 'bg-amber-500/60 group-hover:bg-amber-400' : 'bg-rose-500/60 group-hover:bg-rose-400'
                    }`}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Executive Sub-Dashboards */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-400" />
              Executive BI Dashboard Views
            </h2>
            <p className="text-xs text-slate-400">Deep-dive financial trends, customer metrics, and platform scorecards</p>
          </div>
          <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {[
              { id: 'revenue', label: 'Revenue Trends', icon: TrendingUp },
              { id: 'growth', label: 'Sales & Categories', icon: BarChart2 },
              { id: 'health', label: 'Marketplace Health', icon: Globe },
              { id: 'scorecard', label: 'Performance Scorecard', icon: CheckCircle2 },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveDashboardTab(tab.id as any)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    activeDashboardTab === tab.id
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab 1: Revenue Trends */}
        {activeDashboardTab === 'revenue' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-200">GMV vs. Net Marketplace Revenue (2026 Trailing)</h3>
                    <p className="text-xs text-slate-400">Comparing gross throughput against 15% marketplace monetization</p>
                  </div>
                  <div className="flex items-center space-x-3 text-xs">
                    <span className="flex items-center text-amber-400"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 mr-1.5 inline-block" />GMV ($)</span>
                    <span className="flex items-center text-emerald-400"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400 mr-1.5 inline-block" />Net Profit ($)</span>
                  </div>
                </div>

                {/* SVG Visual Bar & Line Chart */}
                <div className="space-y-3 pt-2">
                  {MOCK_REVENUE_TRENDS.map((point) => (
                    <div key={point.date} className="space-y-1">
                      <div className="flex justify-between text-xs font-mono text-slate-300">
                        <span>{point.date}</span>
                        <span>
                          GMV: <strong className="text-amber-400">${(point.gmv / 1e6).toFixed(1)}M</strong> | Rev: <strong className="text-blue-400">${(point.revenue / 1e6).toFixed(1)}M</strong> | Profit: <strong className="text-emerald-400">${(point.netProfit / 1e6).toFixed(2)}M</strong>
                        </span>
                      </div>
                      <div className="w-full bg-slate-900 h-4 rounded-full overflow-hidden flex">
                        <div
                          style={{ width: `${(point.gmv / maxRevenue) * 75}%` }}
                          className="bg-gradient-to-r from-amber-600 to-amber-400 h-full rounded-l"
                          title={`GMV: $${point.gmv.toLocaleString()}`}
                        />
                        <div
                          style={{ width: `${(point.netProfit / maxRevenue) * 75}%` }}
                          className="bg-emerald-500 h-full rounded-r"
                          title={`Profit: $${point.netProfit.toLocaleString()}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Summary Breakdown */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  Monetization Summary
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex justify-between">
                    <span className="text-slate-400">Total Trailing GMV</span>
                    <span className="font-bold text-slate-100">$1,482,930,400</span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex justify-between">
                    <span className="text-slate-400">Blended Take Rate</span>
                    <span className="font-bold text-amber-400">15.00%</span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex justify-between">
                    <span className="text-slate-400">Gross Fee Income</span>
                    <span className="font-bold text-blue-400">$222,439,560</span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex justify-between">
                    <span className="text-slate-400">Cloud & Logistics Cost</span>
                    <span className="font-bold text-rose-400">-$157,629,360</span>
                  </div>
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex justify-between">
                    <span className="font-bold text-emerald-300">Net Profit Margin</span>
                    <span className="font-black text-emerald-400 text-sm">$64,810,200 (29.1%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Sales & Categories */}
        {activeDashboardTab === 'growth' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-200 flex items-center justify-between">
                <span>Revenue Share by Product Category</span>
                <PieIcon className="w-4 h-4 text-amber-400" />
              </h3>
              <div className="space-y-3">
                {MOCK_CATEGORY_REVENUE.map((cat) => (
                  <div key={cat.category} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-200">{cat.category}</span>
                      <span className="text-slate-400">
                        ${(cat.revenue / 1e6).toFixed(1)}M ({cat.sharePct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${cat.sharePct}%` }}
                        className="bg-amber-500 h-full rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-200 flex items-center justify-between">
                <span>Top Regional Hubs (Geographic GMV)</span>
                <Globe className="w-4 h-4 text-blue-400" />
              </h3>
              <div className="space-y-2.5">
                {MOCK_GEOGRAPHIC_SALES.map((geo) => (
                  <div key={geo.city} className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-200">{geo.city}, {geo.country}</p>
                      <p className="text-slate-400">{geo.buyers.toLocaleString()} Buyers • Top: {geo.topCategory}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-amber-400">${(geo.revenue / 1e6).toFixed(1)}M</p>
                      <p className="text-slate-500 font-mono">{geo.orders.toLocaleString()} orders</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Marketplace Health */}
        {activeDashboardTab === 'health' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase">
                <CheckCircle2 className="w-4 h-4" />
                <span>Buyer Health Index</span>
              </div>
              <p className="text-2xl font-black text-slate-100">98.4 / 100</p>
              <p className="text-xs text-slate-400">Low cart abandonment, high NPS (78), 68.4% repeat buyers.</p>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center space-x-2 text-blue-400 font-bold text-xs uppercase">
                <CheckCircle2 className="w-4 h-4" />
                <span>Seller Quality Index</span>
              </div>
              <p className="text-2xl font-black text-slate-100">96.8 / 100</p>
              <p className="text-xs text-slate-400">184,200 active sellers, &lt;0.5% cancellation, 98.2% FBA accuracy.</p>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center space-x-2 text-purple-400 font-bold text-xs uppercase">
                <CheckCircle2 className="w-4 h-4" />
                <span>Infrastructure & AI Health</span>
              </div>
              <p className="text-2xl font-black text-slate-100">99.99% Uptime</p>
              <p className="text-xs text-slate-400">Spark analytics, ClickHouse engine, and Redis clusters nominal.</p>
            </div>
          </div>
        )}

        {/* Tab 4: Performance Scorecard */}
        {activeDashboardTab === 'scorecard' && (
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-200">Balanced Marketplace Scorecard</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-slate-400">Order Delivery Velocity</span>
                <p className="text-lg font-bold text-slate-100 mt-1">1.8 Days Avg</p>
                <p className="text-emerald-400 text-[11px] mt-0.5">85% Same-Day / Next-Day</p>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-slate-400">Customer CSAT</span>
                <p className="text-lg font-bold text-slate-100 mt-1">4.86 / 5.0</p>
                <p className="text-emerald-400 text-[11px] mt-0.5">Based on 1.2M ratings</p>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-slate-400">Payment Gateway SLA</span>
                <p className="text-lg font-bold text-slate-100 mt-1">99.98% Success</p>
                <p className="text-emerald-400 text-[11px] mt-0.5">142ms Avg Latency</p>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-slate-400">Platform Fraud Rate</span>
                <p className="text-lg font-bold text-slate-100 mt-1">0.002%</p>
                <p className="text-emerald-400 text-[11px] mt-0.5">Automated AI Blocked</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
