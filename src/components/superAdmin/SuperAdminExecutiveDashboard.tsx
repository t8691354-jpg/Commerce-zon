import React, { useState } from 'react';
import { MOCK_REVENUE_METRICS, MOCK_SYSTEM_HEALTH } from '../../data/mockSuperAdmin';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  ShoppingBag,
  Store,
  Truck,
  ShieldCheck,
  Activity,
  Cpu,
  CreditCard,
  CheckCircle2,
  RefreshCw,
  Zap,
  Globe,
} from 'lucide-react';

export const SuperAdminExecutiveDashboard: React.FC = () => {
  const [metrics] = useState(MOCK_REVENUE_METRICS);
  const [systemHealth] = useState(MOCK_SYSTEM_HEALTH);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '1y'>('30d');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Time Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-lg font-black text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            Super Admin Executive Command Center
          </h2>
          <p className="text-xs text-slate-400">
            Real-time global telemetry across all 20 marketplace operational modules
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {(['24h', '7d', '30d', '1y'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  timeRange === range
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={handleRefresh}
            className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl transition"
            title="Refresh Telemetry Data"
          >
            <RefreshCw className={`w-4 h-4 text-amber-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-gradient-to-br from-slate-900 to-amber-950/30 border border-amber-500/30 rounded-2xl space-y-2 shadow-xl">
          <div className="flex justify-between items-center text-xs text-amber-400 font-bold">
            <span>Total Marketplace GMV</span>
            <DollarSign className="w-4 h-4" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-100 font-mono">
            ${(metrics.totalRevenue / 1000000).toFixed(1)}M
          </p>
          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
            <span>Daily: ${(metrics.dailyRevenue / 1000).toFixed(1)}k</span>
            <span className="text-emerald-400 font-bold">+14.2% YoY</span>
          </div>
        </div>

        <div className="p-5 bg-gradient-to-br from-slate-900 to-emerald-950/30 border border-emerald-500/30 rounded-2xl space-y-2 shadow-xl">
          <div className="flex justify-between items-center text-xs text-emerald-400 font-bold">
            <span>Total Completed Orders</span>
            <ShoppingBag className="w-4 h-4" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-100 font-mono">
            {(metrics.ordersCount / 1000000).toFixed(2)}M
          </p>
          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
            <span>Fulfillment Rate: 99.4%</span>
            <span className="text-emerald-400 font-bold">+8.9%</span>
          </div>
        </div>

        <div className="p-5 bg-gradient-to-br from-slate-900 to-blue-950/30 border border-blue-500/30 rounded-2xl space-y-2 shadow-xl">
          <div className="flex justify-between items-center text-xs text-blue-400 font-bold">
            <span>Active Platform Users</span>
            <Users className="w-4 h-4" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-100 font-mono">
            {(metrics.activeUsersCount / 1000000).toFixed(2)}M
          </p>
          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
            <span>10 User Archetypes</span>
            <span className="text-blue-400 font-bold">182 Countries</span>
          </div>
        </div>

        <div className="p-5 bg-gradient-to-br from-slate-900 to-purple-950/30 border border-purple-500/30 rounded-2xl space-y-2 shadow-xl">
          <div className="flex justify-between items-center text-xs text-purple-400 font-bold">
            <span>Platform Health Score</span>
            <ShieldCheck className="w-4 h-4" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
            {metrics.platformHealthScore}%
          </p>
          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
            <span>AI Status: Operational</span>
            <span className="text-emerald-400 font-bold">0 Active Outages</span>
          </div>
        </div>
      </div>

      {/* System Infrastructure Live Health Grid */}
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
            Live Platform Services & AI Engine Status
          </h3>
          <span className="text-xs font-mono text-emerald-400 font-bold">7 Core Clusters Operational</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {systemHealth.map((sh) => (
            <div key={sh.name} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-start">
                <span className="font-bold text-slate-200 text-xs">{sh.name}</span>
                <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded font-bold font-mono">
                  {sh.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">{sh.value}</p>
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Latency: {sh.latencyMs}ms</span>
                <span className="text-emerald-400">Uptime: {sh.uptimePct}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Trends & Activity Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            Marketplace Revenue & Net Commission Earned
          </h3>
          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
              <span className="text-slate-300">Net Platform Commission Fee Revenue:</span>
              <span className="text-amber-400 font-bold text-sm">
                ${(metrics.commissionEarned / 1000000).toFixed(2)}M
              </span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
              <span className="text-slate-300">Seller Monthly Subscriptions (Pro Tier):</span>
              <span className="text-emerald-400 font-bold text-sm">$3.84M</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
              <span className="text-slate-300">FBA Warehouse Storage & Logistics Fees:</span>
              <span className="text-blue-400 font-bold text-sm">$5.21M</span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-400" />
            Global User Distribution & Region Load
          </h3>
          <div className="space-y-3 font-mono text-xs">
            <div className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>North America (us-east-1 / us-west-2):</span>
                <span className="text-amber-400 font-bold">54% Load (693k Users)</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '54%' }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Europe & UK (eu-west-1 / eu-central-1):</span>
                <span className="text-emerald-400 font-bold">28% Load (359k Users)</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '28%' }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Asia-Pacific (ap-southeast-1 / ap-northeast-1):</span>
                <span className="text-purple-400 font-bold">18% Load (232k Users)</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '18%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
