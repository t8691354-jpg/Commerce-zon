import React from 'react';
import { MOCK_LOGISTICS_METRICS } from '../../data/mockBiAnalytics';
import { Truck, CheckCircle2, Clock, RotateCcw, ShieldCheck, MapPin } from 'lucide-react';

export const BiLogisticsAnalyticsView: React.FC = () => {
  const totalShipments = MOCK_LOGISTICS_METRICS.reduce((a, b) => a + b.shipmentVolume, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
          <span className="text-xs text-slate-400">Total Parcels Dispatched</span>
          <p className="text-2xl font-black text-slate-100 font-mono">{(totalShipments / 1e6).toFixed(2)}M</p>
          <p className="text-xs text-emerald-400 font-semibold">Commerce Zon Logistics 67% Share</p>
        </div>
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
          <span className="text-xs text-slate-400">Delivery Success Rate</span>
          <p className="text-2xl font-black text-emerald-400 font-mono">99.1%</p>
          <p className="text-xs text-slate-400">First attempt delivery success</p>
        </div>
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
          <span className="text-xs text-slate-400">Average Delivery Delay</span>
          <p className="text-2xl font-black text-amber-400 font-mono">1.1 Hours</p>
          <p className="text-xs text-emerald-400 font-semibold">Down from 2.4 hrs last quarter</p>
        </div>
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
          <span className="text-xs text-slate-400">Blended Shipping Cost</span>
          <p className="text-2xl font-black text-blue-400 font-mono">$4.25 / parcel</p>
          <p className="text-xs text-slate-400">Volume bulk discount rate</p>
        </div>
      </div>

      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Truck className="w-5 h-5 text-amber-400" />
          Carrier Network & Last-Mile Logistics Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_LOGISTICS_METRICS.map((log) => (
            <div key={log.carrier} className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-100 text-sm">{log.carrier}</h4>
                  <p className="text-xs text-slate-400">Volume: {log.shipmentVolume.toLocaleString()} parcels</p>
                </div>
                <span className="text-xs font-bold px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-mono">
                  {log.deliverySuccessRatePct}% Success
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-400 text-[10px]">Avg Delay</span>
                  <p className="font-bold text-amber-400 mt-0.5">{log.avgDelayHours} hrs</p>
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-400 text-[10px]">Cost / Order</span>
                  <p className="font-bold text-slate-200 mt-0.5">${log.shippingCostPerOrder.toFixed(2)}</p>
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-400 text-[10px]">Return Logistics</span>
                  <p className="font-bold text-blue-400 mt-0.5">{log.returnLogisticsRatePct}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
