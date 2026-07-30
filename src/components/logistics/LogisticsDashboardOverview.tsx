import React from 'react';
import { Shipment } from '../../types/logistics';
import {
  Truck,
  Package,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  DollarSign,
  TrendingUp,
  MapPin,
  ShieldAlert,
  BarChart2,
  Activity,
  Globe,
} from 'lucide-react';

interface LogisticsDashboardOverviewProps {
  shipments: Shipment[];
}

export const LogisticsDashboardOverview: React.FC<LogisticsDashboardOverviewProps> = ({ shipments }) => {
  const totalShipments = shipments.length;
  const inTransitCount = shipments.filter((s) => s.status === 'IN_TRANSIT').length;
  const outForDeliveryCount = shipments.filter((s) => s.status === 'OUT_FOR_DELIVERY').length;
  const deliveredCount = shipments.filter((s) => s.status === 'DELIVERED').length;
  const failedCount = shipments.filter((s) => s.status === 'FAILED_ATTEMPT').length;
  const customsCount = shipments.filter((s) => s.status === 'CUSTOMS_CLEARANCE').length;

  const totalShippingRev = shipments.reduce((acc, s) => acc + s.shippingCostUSD, 0);
  const avgDeliveryDays = 1.8;
  const successRate = totalShipments > 0 ? ((deliveredCount + outForDeliveryCount) / totalShipments) * 100 : 98.4;

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <Truck className="w-4 h-4 text-[#febd69]" />
            <span>COMMERCE_ZON LOGISTICS & TRANSPORTATION SYSTEM (MODULE 13)</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Global Shipping & Logistics Management System</h1>
          <p className="text-xs text-slate-400 mt-1">
            Carrier dispatches, GPS telemetry, AI delivery route optimization, proof of delivery (POD) & customs clearance
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <div className="bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-slate-300">
            Carrier Gateway Status: <strong className="text-emerald-400">100% Operational</strong>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 font-mono text-xs">
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-1">
          <span className="text-slate-500 text-[9px] uppercase block">Total Shipments</span>
          <span className="text-lg font-black text-white">{totalShipments + 1420}</span>
          <span className="text-[9px] text-emerald-400 block">+12.4% vs yesterday</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-1">
          <span className="text-slate-500 text-[9px] uppercase block">In Transit</span>
          <span className="text-lg font-black text-sky-400">{inTransitCount + 340}</span>
          <span className="text-[9px] text-slate-400 block">Air & Ground</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-1">
          <span className="text-slate-500 text-[9px] uppercase block">Out for Delivery</span>
          <span className="text-lg font-black text-[#febd69]">{outForDeliveryCount + 180}</span>
          <span className="text-[9px] text-slate-400 block">Last-Mile Vans</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-1">
          <span className="text-slate-500 text-[9px] uppercase block">Delivered</span>
          <span className="text-lg font-black text-emerald-400">{deliveredCount + 890}</span>
          <span className="text-[9px] text-emerald-400 block">Signature / Photo</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-1">
          <span className="text-slate-500 text-[9px] uppercase block">Customs Clearance</span>
          <span className="text-lg font-black text-purple-400">{customsCount + 42}</span>
          <span className="text-[9px] text-slate-400 block">EU & Asia Cargo</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-1">
          <span className="text-slate-500 text-[9px] uppercase block">Failed Attempts</span>
          <span className="text-lg font-black text-rose-400">{failedCount + 6}</span>
          <span className="text-[9px] text-rose-300 block">Rescheduled</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-1">
          <span className="text-slate-500 text-[9px] uppercase block">Success Rate</span>
          <span className="text-lg font-black text-emerald-400">{successRate.toFixed(1)}%</span>
          <span className="text-[9px] text-slate-400 block">SLA Target &gt;98%</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-1">
          <span className="text-slate-500 text-[9px] uppercase block">Shipping Revenue</span>
          <span className="text-lg font-black text-[#febd69]">${(totalShippingRev + 18450).toLocaleString()}</span>
          <span className="text-[9px] text-emerald-400 block">Gross Fees</span>
        </div>
      </div>

      {/* Interactive Visual Performance & Carrier Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs font-mono">
        {/* Daily Shipment Volume & Transit SLA */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <BarChart2 className="w-4 h-4 text-[#febd69]" />
              <span>Daily Global Shipment Volume (Units Dispatched)</span>
            </span>
            <span className="text-emerald-400 text-[10px]">Peak Capacity: 10,000 / Day</span>
          </h3>

          <div className="space-y-3 pt-2">
            {[
              { day: 'Mon', count: 7800, max: 10000, pct: 78 },
              { day: 'Tue', count: 8900, max: 10000, pct: 89 },
              { day: 'Wed', count: 9400, max: 10000, pct: 94 },
              { day: 'Thu', count: 8600, max: 10000, pct: 86 },
              { day: 'Fri (Today)', count: 9850, max: 10000, pct: 98 },
            ].map((d, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">{d.day}</span>
                  <strong className="text-white">{d.count.toLocaleString()} Shipments ({d.pct}%)</strong>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div className="h-full bg-[#febd69]" style={{ width: `${d.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carrier SLA On-Time Performance */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-sky-400" />
              <span>Carrier On-Time Delivery Performance</span>
            </span>
            <span className="text-emerald-400 text-[10px]">Avg SLA: 99.1%</span>
          </h3>

          <div className="space-y-3 pt-2">
            {[
              { name: 'Commerce Zon Logistics', rate: 99.8, status: 'EXCEEDS SLA', color: 'text-emerald-400' },
              { name: 'UPS Worldwide Express', rate: 98.9, status: 'MET SLA', color: 'text-sky-400' },
              { name: 'FedEx Priority Freight', rate: 99.2, status: 'MET SLA', color: 'text-sky-400' },
              { name: 'DHL Express International', rate: 97.6, status: 'MONITORING', color: 'text-amber-400' },
            ].map((c, idx) => (
              <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-white font-bold">{c.name}</span>
                  <span className={`${c.color} font-black`}>{c.rate}% On-Time</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${c.rate}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
