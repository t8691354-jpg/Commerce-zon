import React from 'react';
import { MOCK_ORDER_METRICS } from '../../data/mockBiAnalytics';
import { Package, Clock, CheckCircle2, RotateCcw, Truck, AlertCircle } from 'lucide-react';

export const BiOrderAnalyticsView: React.FC = () => {
  const totalOrders = MOCK_ORDER_METRICS.reduce((a, b) => a + b.count, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
          <span className="text-xs text-slate-400">Total Pipeline Orders</span>
          <p className="text-2xl font-black text-slate-100 font-mono">{(totalOrders / 1e6).toFixed(2)}M</p>
          <p className="text-xs text-emerald-400 font-semibold">99.1% Successful Fulfillment</p>
        </div>
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
          <span className="text-xs text-slate-400">Avg Dispatch Processing Time</span>
          <p className="text-2xl font-black text-amber-400 font-mono">3.4 Hours</p>
          <p className="text-xs text-slate-400">Automated picking & packing</p>
        </div>
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
          <span className="text-xs text-slate-400">Avg Last-Mile Delivery</span>
          <p className="text-2xl font-black text-emerald-400 font-mono">1.8 Days</p>
          <p className="text-xs text-emerald-400 font-semibold">85% delivered &lt; 24 hrs</p>
        </div>
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
          <span className="text-xs text-slate-400">Cancellation Rate</span>
          <p className="text-2xl font-black text-blue-400 font-mono">0.97%</p>
          <p className="text-xs text-slate-400">Declining trend (-0.2% MoM)</p>
        </div>
      </div>

      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Package className="w-5 h-5 text-amber-400" />
          Order State Life-Cycle Distribution & Fulfillment Efficiency
        </h3>

        <div className="space-y-3">
          {MOCK_ORDER_METRICS.map((ord) => {
            const share = ((ord.count / totalOrders) * 100).toFixed(1);
            return (
              <div key={ord.status} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-200">{ord.status}</span>
                    <span className="text-slate-400 font-mono">({ord.count.toLocaleString()} orders - {share}%)</span>
                  </div>
                  <span className="font-mono text-emerald-400 font-bold">
                    Score: {ord.fulfilmentEfficiencyScore}/100
                  </span>
                </div>

                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                  <div style={{ width: `${share}%` }} className="bg-amber-500 h-full rounded-full" />
                </div>

                <div className="flex flex-wrap gap-4 text-[11px] font-mono text-slate-400 pt-1">
                  <span>Avg Processing: <strong className="text-slate-200">{ord.avgProcessingTimeHours} hrs</strong></span>
                  <span>Avg Delivery: <strong className="text-slate-200">{ord.avgDeliveryTimeDays} days</strong></span>
                  <span>Cancel Trend: <strong className={ord.cancellationTrendPct > 0 ? 'text-rose-400' : 'text-emerald-400'}>{ord.cancellationTrendPct}%</strong></span>
                  <span>Refund Trend: <strong className={ord.refundTrendPct > 0 ? 'text-rose-400' : 'text-emerald-400'}>{ord.refundTrendPct}%</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
