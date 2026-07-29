import React from 'react';
import { MOCK_INVENTORY_METRICS } from '../../data/mockBiAnalytics';
import { Warehouse, AlertOctagon, TrendingUp, CheckCircle, ShieldAlert } from 'lucide-react';

export const BiInventoryAnalyticsView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
          <span className="text-xs text-slate-400">Total Fast Moving SKUs</span>
          <p className="text-2xl font-black text-emerald-400">46,120</p>
          <p className="text-xs text-slate-400">Turnover &gt; 12x annually</p>
        </div>
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
          <span className="text-xs text-slate-400">Dead Stock Risk Items</span>
          <p className="text-2xl font-black text-rose-400">165</p>
          <p className="text-xs text-rose-400 font-semibold">&lt;0.03% of catalog inventory</p>
        </div>
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
          <span className="text-xs text-slate-400">Avg Warehouse Capacity</span>
          <p className="text-2xl font-black text-amber-400 font-mono">87.6%</p>
          <p className="text-xs text-slate-400">Optimized slotting efficiency</p>
        </div>
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
          <span className="text-xs text-slate-400">RFID Stock Accuracy</span>
          <p className="text-2xl font-black text-blue-400 font-mono">99.63%</p>
          <p className="text-xs text-emerald-400 font-semibold">Robotic Audit Verified</p>
        </div>
      </div>

      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Warehouse className="w-5 h-5 text-amber-400" />
          Fulfillment Center & Warehouse Analytics
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {MOCK_INVENTORY_METRICS.map((wh) => (
            <div key={wh.warehouseId} className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-100 text-sm">{wh.warehouseName}</h4>
                  <p className="text-xs text-slate-400 font-mono">{wh.warehouseId}</p>
                </div>
                <span className="text-xs font-bold px-2 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded">
                  {wh.capacityUtilizationPct}% Capacity
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 bg-slate-900 rounded flex justify-between">
                  <span className="text-slate-400">Fast Moving SKUs</span>
                  <span className="font-bold text-emerald-400">{wh.fastMovingItems.toLocaleString()}</span>
                </div>
                <div className="p-2.5 bg-slate-900 rounded flex justify-between">
                  <span className="text-slate-400">Slow Moving Items</span>
                  <span className="font-bold text-amber-400">{wh.slowMovingItems.toLocaleString()}</span>
                </div>
                <div className="p-2.5 bg-slate-900 rounded flex justify-between">
                  <span className="text-slate-400">Dead Stock Units</span>
                  <span className="font-bold text-rose-400">{wh.deadStockCount}</span>
                </div>
                <div className="p-2.5 bg-slate-900 rounded flex justify-between">
                  <span className="text-slate-400">Overstock Capital Risk</span>
                  <span className="font-bold text-slate-200">${(wh.overstockRiskValue / 1e3).toFixed(0)}K</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-400">Reorder Forecast Value</span>
                <span className="font-bold text-blue-400 font-mono">${(wh.forecastedReorderValue / 1e6).toFixed(2)}M</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
