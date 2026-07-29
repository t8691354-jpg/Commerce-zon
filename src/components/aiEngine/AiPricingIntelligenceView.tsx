import React from 'react';
import { 
  DollarSign, Zap, TrendingUp, ShieldCheck, CheckCircle2, ArrowRight
} from 'lucide-react';
import { MOCK_PRICING_COMPETITORS } from '../../data/mockAiEngineData';

export const AiPricingIntelligenceView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900/95 border border-slate-800 p-5 rounded-xl space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">AI Dynamic Pricing & Competitor Intelligence Engine</h2>
              <p className="text-xs text-slate-400">Automated competitor price crawling, demand surge pricing & gross margin protection</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {MOCK_PRICING_COMPETITORS.map((item) => (
          <div key={item.productId} className="bg-slate-900/90 border border-slate-800 p-5 rounded-xl space-y-3 shadow-lg">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white">{item.productTitle}</h3>
                <span className="text-xs text-emerald-400 font-mono font-bold">Rule: {item.priceRuleApplied}</span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Current Price</span>
                  <span className="text-sm font-black text-white font-mono">${item.currentPrice.toFixed(2)}</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-emerald-400 block font-bold">AI Recommended</span>
                  <span className="text-base font-black text-emerald-400 font-mono">${item.recommendedDynamicPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Competitor Min Price</span>
                <span className="text-xs font-bold text-slate-200 font-mono">${item.competitorMinPrice.toFixed(2)}</span>
              </div>

              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Competitor Avg Price</span>
                <span className="text-xs font-bold text-slate-200 font-mono">${item.competitorAvgPrice.toFixed(2)}</span>
              </div>

              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Predicted Margin</span>
                <span className="text-xs font-bold text-emerald-400 font-mono">{item.predictedMarginPct}%</span>
              </div>

              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Demand Surge Multiplier</span>
                <span className="text-xs font-bold text-amber-400 font-mono">{item.demandSurgeMultiplier}x</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
