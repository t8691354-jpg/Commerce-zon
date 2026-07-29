import React, { useState } from 'react';
import { 
  Sliders, Award, RefreshCw, Sparkles, CheckCircle2, RotateCcw, HelpCircle, Layers, ArrowUpDown
} from 'lucide-react';
import { RankingWeights, ProductSearchResult } from '../../types/aiEngine';
import { INITIAL_RANKING_WEIGHTS, MOCK_PRODUCTS } from '../../data/mockAiEngineData';

export const AiProductRankingView: React.FC = () => {
  const [weights, setWeights] = useState<RankingWeights>(INITIAL_RANKING_WEIGHTS);

  const calculateCustomRankScore = (prod: ProductSearchResult): number => {
    const rel = (prod.relevanceScore / 100) * weights.relevance;
    const rat = (prod.rating / 5) * weights.rating;
    const ver = Math.min(1, prod.verifiedReviewsCount / 2000) * weights.verifiedReviews;
    const sel = (prod.sellerRating / 5) * weights.sellerPerformance;
    const pop = Math.min(1, prod.reviewCount / 5000) * weights.popularity;
    const inv = Math.min(1, prod.inStockCount / 100) * weights.inventoryAvailability;
    const del = (prod.deliverySpeedDays === 1 ? 1 : 0.7) * weights.deliverySpeed;
    const con = (prod.conversionRatePct / 15) * weights.conversionRate;
    const sat = (prod.satisfactionScorePct / 100) * weights.customerSatisfaction;

    const totalWeight = (Object.values(weights) as number[]).reduce((a: number, b: number) => a + b, 0);
    const score = ((rel + rat + ver + sel + pop + inv + del + con + sat) / (totalWeight || 1)) * 100;
    return Math.round(score * 10) / 10;
  };

  const reRankedProducts = [...MOCK_PRODUCTS].sort((a, b) => calculateCustomRankScore(b) - calculateCustomRankScore(a));

  const handleSliderChange = (key: keyof RankingWeights, value: number) => {
    setWeights(prev => ({ ...prev, [key]: value }));
  };

  const handleResetWeights = () => {
    setWeights(INITIAL_RANKING_WEIGHTS);
  };

  const totalWeightSum = (Object.values(weights) as number[]).reduce((a: number, b: number) => a + b, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/95 border border-slate-800 p-5 rounded-xl space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">AI Neural Product Ranking Engine</h2>
              <p className="text-xs text-slate-400">Dynamically adjust ranking algorithm weights to evaluate real-time catalog re-indexing</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs font-mono font-bold text-slate-300">
              Weight Allocation Sum: <strong className="text-amber-400">{totalWeightSum}%</strong>
            </span>
            <button
              onClick={handleResetWeights}
              className="px-3 py-1.5 rounded-lg bg-slate-950 text-slate-300 border border-slate-700 hover:text-white hover:bg-slate-800 text-xs font-bold transition flex items-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Sliders on Left, Live Ranking on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders Panel */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>Algorithm Weight Parameters</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Live Tuning</span>
          </div>

          <div className="space-y-3.5 text-xs">
            {[
              { key: 'relevance', label: 'Semantic Query Relevance', desc: 'Vector similarity score' },
              { key: 'rating', label: 'Customer Rating Score', desc: 'Star rating (1 to 5)' },
              { key: 'verifiedReviews', label: 'Verified Review Count', desc: 'Authentic buyer feedback' },
              { key: 'sellerPerformance', label: 'Seller SLA & Rating', desc: 'Fulfillment & return score' },
              { key: 'popularity', label: 'Product Popularity', desc: 'Click-through & wishlists' },
              { key: 'inventoryAvailability', label: 'Inventory Stock Level', desc: 'In-stock buffer weight' },
              { key: 'deliverySpeed', label: 'Delivery Speed (Prime)', desc: '1-day vs standard delivery' },
              { key: 'conversionRate', label: 'Historical Conversion Rate', desc: 'Past purchase ratio' },
              { key: 'customerSatisfaction', label: 'Customer Satisfaction Index', desc: 'Low return rate bonus' }
            ].map(({ key, label, desc }) => {
              const k = key as keyof RankingWeights;
              const val = weights[k];

              return (
                <div key={key} className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">{label}</span>
                      <span className="text-[10px] text-slate-400">{desc}</span>
                    </div>
                    <span className="text-amber-400 font-mono font-black text-xs">{val}%</span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={val}
                    onChange={(e) => handleSliderChange(k, Number(e.target.value))}
                    className="w-full accent-amber-500 bg-slate-800 h-1.5 rounded cursor-pointer"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Re-Ranked Catalog Output */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <ArrowUpDown className="w-4 h-4 text-emerald-400" />
                <span>Live Re-Ranked Catalog Results</span>
              </h3>
              <p className="text-xs text-slate-400">Updated in real-time as weight sliders change</p>
            </div>

            <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold border border-emerald-500/30">
              Algorithm: Active
            </span>
          </div>

          <div className="space-y-3">
            {reRankedProducts.map((prod, index) => {
              const score = calculateCustomRankScore(prod);

              return (
                <div 
                  key={prod.id}
                  className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between gap-4 hover:border-amber-500/40 transition"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black font-mono text-xs ${
                      index === 0 
                        ? 'bg-amber-500 text-slate-950 shadow-lg' 
                        : index === 1 
                        ? 'bg-slate-300 text-slate-950' 
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      #{index + 1}
                    </div>

                    <img 
                      src={prod.imageUrl} 
                      alt={prod.title} 
                      className="w-12 h-12 object-cover rounded-lg border border-slate-800"
                      referrerPolicy="no-referrer"
                    />

                    <div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{prod.title}</h4>
                      <p className="text-[10px] text-slate-400">
                        {prod.brand} • ${prod.price.toFixed(2)} • ★ {prod.rating} ({prod.reviewCount} rev)
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-sm font-black text-amber-400 font-mono">{score} pts</div>
                    <span className="text-[10px] text-emerald-400 font-bold block">{prod.deliverySpeedDays === 1 ? '1-Day Prime' : '2-Day Ship'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
