import React from 'react';
import { 
  TrendingUp, AlertTriangle, Package, Calendar, ArrowUpRight, RefreshCw, Layers
} from 'lucide-react';
import { DemandForecastItem } from '../../types/aiEngine';
import { MOCK_DEMAND_FORECASTS } from '../../data/mockAiEngineData';

export const AiDemandForecastingView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/95 border border-slate-800 p-5 rounded-xl space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-teal-500/20 text-teal-400 rounded-xl border border-teal-500/30">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">AI Demand Forecasting & Inventory Optimization</h2>
              <p className="text-xs text-slate-400">Time-series forecasting, seasonal trend factor analysis & automated stockout risk prevention</p>
            </div>
          </div>
        </div>
      </div>

      {/* Forecast Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {MOCK_DEMAND_FORECASTS.map((item) => (
          <div key={item.productId} className="bg-slate-900/90 border border-slate-800 p-5 rounded-xl space-y-3 shadow-lg">
            <div className="flex items-center justify-between text-xs">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold font-mono">{item.fastSellingStatus}</span>
              <span className="text-rose-400 font-bold">{item.stockoutRiskDate}</span>
            </div>

            <h3 className="text-xs font-bold text-white line-clamp-2">{item.productTitle}</h3>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Current Stock</span>
                <span className="text-sm font-black text-white font-mono">{item.currentStock} units</span>
              </div>

              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 block">30-Day Demand</span>
                <span className="text-sm font-black text-teal-400 font-mono">{item.predicted30DayDemand} units</span>
              </div>
            </div>

            <div className="p-2.5 bg-slate-950 rounded border border-teal-500/30 text-xs text-teal-300 space-y-1">
              <span className="font-bold block text-[10px] text-teal-400">Seasonal Trend Factor</span>
              <p>{item.seasonalTrendFactor}</p>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Reorder Suggestion:</span>
              <span className="text-amber-400 font-bold font-mono">+{item.recommendedReorderQty} units</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
