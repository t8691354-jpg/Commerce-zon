import React from 'react';
import { SupplierRecord } from '../../types/dropshipping';
import {
  Award,
  Star,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

interface SupplierPerformanceScorecardViewProps {
  suppliers: SupplierRecord[];
}

export const SupplierPerformanceScorecardView: React.FC<SupplierPerformanceScorecardViewProps> = ({
  suppliers,
}) => {
  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>SUPPLIER PERFORMANCE & SLA SCORECARD</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Supplier Performance Index & Quality Ranking</h2>
          <p className="text-xs text-slate-400 mt-1">
            Algorithmic scorecards evaluating order fulfilment speed, cancellation rates, on-time delivery & stock accuracy
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300">Target SLA On-Time: <strong className="text-emerald-400 font-mono">≥ 98.0%</strong></span>
        </div>
      </div>

      {/* Supplier Scorecards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
        {suppliers.map((s) => (
          <div key={s.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-black text-white text-sm">{s.businessName}</h3>
                <span className="text-[10px] font-mono text-slate-400">{s.id} • {s.country}</span>
              </div>

              <div className="text-right">
                <div className="text-xl font-black text-[#febd69] font-mono">{s.performanceScore}/100</div>
                <span className="text-[9px] text-emerald-400 font-bold uppercase">Quality Score</span>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 gap-3 font-mono text-[11px]">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[9px] uppercase block">On-Time Delivery</span>
                <span className="font-bold text-emerald-400">{s.onTimeDeliveryRatePct}%</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[9px] uppercase block">Inventory Accuracy</span>
                <span className="font-bold text-sky-400">{s.inventoryAccuracyPct}%</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[9px] uppercase block">Cancellation Rate</span>
                <span className="font-bold text-amber-300">{s.cancellationRatePct}%</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[9px] uppercase block">Return / RMA Rate</span>
                <span className="font-bold text-rose-400">{s.returnRatePct}%</span>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center text-[10px] text-slate-400">
              <span>Orders Fulfilled: <strong className="text-white font-mono">{s.totalOrdersFulfilled.toLocaleString()}</strong></span>
              <span>Rating: <strong className="text-[#febd69] font-mono">★ {s.ratingScore}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
