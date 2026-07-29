import React from 'react';
import { 
  Store, Award, TrendingUp, AlertTriangle, Lightbulb, DollarSign
} from 'lucide-react';
import { MOCK_SELLER_INSIGHTS } from '../../data/mockAiEngineData';

export const AiSellerInsightsView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900/95 border border-slate-800 p-5 rounded-xl space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl border border-purple-500/30">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">AI Merchant Advisory & Seller Intelligence</h2>
              <p className="text-xs text-slate-400">Automated seller guidance, stock forecast recommendations & pricing optimization advice</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {MOCK_SELLER_INSIGHTS.map((insight) => (
          <div key={insight.sellerId} className="bg-slate-900/90 border border-slate-800 p-5 rounded-xl space-y-4 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white">{insight.sellerName}</h3>
                <span className="text-xs text-slate-400 font-mono">Seller ID: {insight.sellerId}</span>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Next Month Forecast</span>
                <span className="text-base font-black text-emerald-400 font-mono">${insight.salesForecastNextMonthUsd.toLocaleString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-[10px] text-emerald-400 block font-bold flex items-center space-x-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>Top Performing Product</span>
                </span>
                <p className="text-slate-200 font-bold">{insight.topPerformingProduct}</p>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-[10px] text-rose-400 block font-bold flex items-center space-x-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Underperforming SKU</span>
                </span>
                <p className="text-slate-200 font-bold">{insight.underperformingProduct}</p>
              </div>
            </div>

            <div className="p-3 bg-purple-950/30 rounded-lg border border-purple-500/30 text-xs text-purple-200 space-y-1">
              <span className="font-bold text-purple-400 block flex items-center space-x-1 text-[11px]">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>AI Recommended Action Plan</span>
              </span>
              <p>{insight.recommendedPriceAdjustments}</p>
              <p className="text-amber-300 font-semibold">{insight.inventoryAlert}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
