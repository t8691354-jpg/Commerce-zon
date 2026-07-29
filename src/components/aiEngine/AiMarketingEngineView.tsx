import React from 'react';
import { 
  Sparkles, Tag, Send, TrendingUp, CheckCircle2, ArrowRight
} from 'lucide-react';
import { MOCK_MARKETING_OPPORTUNITIES } from '../../data/mockAiEngineData';

export const AiMarketingEngineView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900/95 border border-slate-800 p-5 rounded-xl space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30">
              <Tag className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">AI Automated Marketing, Upsell & Coupon Engine</h2>
              <p className="text-xs text-slate-400">Hyper-targeted cross-sell suggestions, personalized coupon generation & push notification recommendations</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_MARKETING_OPPORTUNITIES.map((opp) => (
          <div key={opp.id} className="bg-slate-900/90 border border-slate-800 p-5 rounded-xl space-y-3 shadow-lg">
            <div className="flex items-center justify-between text-xs">
              <span className="px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">{opp.campaignType}</span>
              <span className="text-emerald-400 font-bold font-mono">Conv Prob: {opp.conversionProbabilityPct}%</span>
            </div>

            <h3 className="text-sm font-bold text-white">{opp.title}</h3>
            <p className="text-xs text-slate-400">Target Segment: <strong className="text-slate-200">{opp.customerGroup}</strong></p>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Offer Discount</span>
                <span className="font-bold text-amber-400">{opp.suggestedDiscount}</span>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Est. Revenue Impact</span>
                <span className="font-bold text-emerald-400 font-mono">${opp.estimatedRevenueImpactUsd.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => alert(`Activated campaign ${opp.title}`)}
              className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg transition shadow flex items-center justify-center space-x-1"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Launch AI Campaign</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
