import React, { useState } from 'react';
import { 
  Columns, Sparkles, Check, X, Award, ShieldCheck, Truck, Star, ArrowRight, RefreshCw, Zap
} from 'lucide-react';
import { ComparisonProductSpec, AiComparisonSummary } from '../../types/aiEngine';
import { MOCK_COMPARISON_SPECS, MOCK_COMPARISON_SUMMARY } from '../../data/mockAiEngineData';

export const SmartProductComparisonView: React.FC = () => {
  const [specs, setSpecs] = useState<ComparisonProductSpec[]>(MOCK_COMPARISON_SPECS);
  const [summary, setSummary] = useState<AiComparisonSummary>(MOCK_COMPARISON_SUMMARY);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/95 border border-slate-800 p-5 rounded-xl space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl border border-purple-500/30">
              <Columns className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">AI Smart Specification & Value Matrix Comparison</h2>
              <p className="text-xs text-slate-400">Side-by-side feature matrix, performance benchmarks, AI verdict & pros/cons analysis</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center space-x-1">
              <Award className="w-4 h-4 text-amber-400" />
              <span>AI Winner Verdict Ready</span>
            </span>
          </div>
        </div>
      </div>

      {/* AI Verdict Summary Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-purple-950/40 to-slate-950 border border-purple-500/40 rounded-xl p-5 space-y-3 shadow-xl">
        <div className="flex items-center space-x-2 text-xs font-bold text-amber-400">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>AI COMPARISON SUMMARY & WINNER VERDICT</span>
        </div>

        <p className="text-sm font-semibold text-slate-100 leading-relaxed">
          {summary.verdict}
        </p>

        <div className="flex flex-wrap gap-3 pt-1 text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold flex items-center space-x-1.5">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Best Overall Performance: ROG Strix Scar 18</span>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center space-x-1.5">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>Best Value & Endurance: MacBook Pro 16 M3 Max</span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Product Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {specs.map((item) => {
          const isWinner = item.productId === summary.bestOverallProductId;

          return (
            <div 
              key={item.productId}
              className={`bg-slate-900/90 border p-5 rounded-xl space-y-4 relative shadow-lg ${
                isWinner ? 'border-amber-400/80 ring-1 ring-amber-400/30' : 'border-slate-800'
              }`}
            >
              {isWinner && (
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider flex items-center space-x-1 shadow">
                  <Award className="w-3.5 h-3.5" />
                  <span>AI #1 Pick</span>
                </div>
              )}

              <div className="flex items-center space-x-4">
                <img src={item.imageUrl} alt={item.title} className="w-20 h-20 object-cover rounded-xl border border-slate-800" referrerPolicy="no-referrer" />
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white">{item.title}</h3>
                  <div className="text-base font-black text-amber-400 font-mono">${item.price.toFixed(2)}</div>
                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                    <span className="flex items-center text-amber-400 font-bold">★ {item.rating}</span>
                    <span>({item.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Specs Table */}
              <div className="space-y-2 text-xs border-t border-slate-800 pt-3">
                {Object.entries(item.keySpecs).map(([specKey, specVal]) => (
                  <div key={specKey} className="flex items-center justify-between p-2 bg-slate-950 rounded border border-slate-800">
                    <span className="text-slate-400">{specKey}:</span>
                    <span className="text-slate-100 font-bold">{specVal}</span>
                  </div>
                ))}
              </div>

              {/* Pros & Cons */}
              <div className="space-y-2 text-xs pt-2">
                <div className="space-y-1">
                  <span className="text-emerald-400 font-bold text-[11px] block">PROS</span>
                  {summary.prosCons[item.productId]?.pros.map((p, idx) => (
                    <div key={idx} className="flex items-center space-x-1.5 text-slate-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-1 pt-1">
                  <span className="text-rose-400 font-bold text-[11px] block">CONS</span>
                  {summary.prosCons[item.productId]?.cons.map((c, idx) => (
                    <div key={idx} className="flex items-center space-x-1.5 text-slate-400">
                      <X className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
