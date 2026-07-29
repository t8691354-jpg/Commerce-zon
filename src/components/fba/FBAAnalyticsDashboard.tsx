import React from 'react';
import {
  TrendingUp,
  BarChart2,
  PieChart,
  Activity,
  Warehouse,
  Boxes,
  Clock,
  CheckCircle2,
  Users,
  ShieldCheck,
} from 'lucide-react';

export const FBAAnalyticsDashboard: React.FC = () => {
  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <BarChart2 className="w-4 h-4 text-[#febd69]" />
            <span>FBA WAREHOUSE & LOGISTICS INTELLIGENCE ANALYTICS</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Real-Time Fulfilment Telemetry & Productivity Dashboards</h2>
          <p className="text-xs text-slate-400 mt-1">
            Cubic capacity utilization, picking wave velocity, scale weight verification accuracy & carrier transit SLA metrics
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300">
            Analytics Refresh Rate: <strong className="text-emerald-400">Live (500ms)</strong>
          </div>
        </div>
      </div>

      {/* Analytics KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg space-y-1">
          <span className="text-slate-500 text-[10px] uppercase block">Picking Accuracy</span>
          <span className="text-xl font-black text-emerald-400">99.85%</span>
          <span className="text-[9px] text-slate-400 block">+0.12% vs last week</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg space-y-1">
          <span className="text-slate-500 text-[10px] uppercase block">Packing Weight Accuracy</span>
          <span className="text-xl font-black text-sky-400">99.92%</span>
          <span className="text-[9px] text-emerald-400 block">Digital Scale Audit</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg space-y-1">
          <span className="text-slate-500 text-[10px] uppercase block">Avg Order Dock-to-Truck Time</span>
          <span className="text-xl font-black text-[#febd69]">42 Mins</span>
          <span className="text-[9px] text-slate-400 block">Dock SLA &lt; 60 Mins</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg space-y-1">
          <span className="text-slate-500 text-[10px] uppercase block">Inventory Turnover Ratio</span>
          <span className="text-xl font-black text-emerald-400">8.4x / Year</span>
          <span className="text-[9px] text-sky-400 block">High-Velocity Goods</span>
        </div>
      </div>

      {/* Visual Telemetry Charts Representation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs font-mono">
        {/* Hourly Pick Velocity Chart */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center justify-between">
            <span>Hourly Pick & Pack Velocity (Units / Hour)</span>
            <span className="text-emerald-400 text-[10px]">Peak Velocity: 1,840 Units/Hr</span>
          </h3>

          <div className="space-y-3 pt-2">
            {[
              { hour: '06:00 EST', units: 420, max: 2000, color: 'bg-sky-500' },
              { hour: '09:00 EST', units: 1450, max: 2000, color: 'bg-[#febd69]' },
              { hour: '12:00 EST', units: 1840, max: 2000, color: 'bg-emerald-500' },
              { hour: '15:00 EST', units: 1620, max: 2000, color: 'bg-emerald-500' },
              { hour: '18:00 EST', units: 980, max: 2000, color: 'bg-sky-500' },
            ].map((bar, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">{bar.hour}</span>
                  <strong className="text-white">{bar.units} Units</strong>
                </div>
                <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div className={`h-full ${bar.color}`} style={{ width: `${(bar.units / bar.max) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carrier On-Time Delivery Performance */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center justify-between">
            <span>Carrier Dispatch On-Time SLA Performance</span>
            <span className="text-emerald-400 text-[10px]">99.4% On-Time</span>
          </h3>

          <div className="space-y-3 pt-2">
            {[
              { carrier: 'Amazon Logistics (AMZL Prime)', pct: 99.8, status: 'EXCEEDS SLA' },
              { carrier: 'UPS Freight Linehaul', pct: 98.9, status: 'MET SLA' },
              { carrier: 'FedEx Express Freight', pct: 99.2, status: 'MET SLA' },
              { carrier: 'DHL Express International', pct: 97.8, status: 'MET SLA' },
            ].map((c, idx) => (
              <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-white font-bold">{c.carrier}</span>
                  <span className="text-emerald-400 font-extrabold">{c.pct}% On-Time</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${c.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
