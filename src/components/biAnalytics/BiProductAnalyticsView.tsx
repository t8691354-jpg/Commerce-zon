import React, { useState } from 'react';
import { MOCK_PRODUCT_METRICS } from '../../data/mockBiAnalytics';
import { ShoppingBag, Eye, Heart, ShoppingCart, RefreshCw, Star, Flame } from 'lucide-react';

export const BiProductAnalyticsView: React.FC = () => {
  const [productFilter, setProductFilter] = useState<'best' | 'worst' | 'all'>('best');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center space-x-2">
          <ShoppingBag className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-slate-200">Filter Catalogue:</span>
          {(['best', 'all'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setProductFilter(mode as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition ${
                productFilter === mode
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {mode === 'best' ? 'Top Selling SKUs' : 'All Catalog Items'}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-400 font-mono">482,000 Total Active Catalog SKUs</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_PRODUCT_METRICS.map((prd) => (
          <div key={prd.productId} className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-4 shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono border border-amber-500/20">
                  {prd.category} • SKU: {prd.sku}
                </span>
                <h4 className="font-bold text-slate-100 text-sm mt-1.5">{prd.title}</h4>
              </div>
              <div className="text-right font-mono">
                <span className="text-amber-400 font-black text-sm">${(prd.revenue / 1e6).toFixed(2)}M Rev</span>
                <p className="text-xs text-slate-400">{prd.unitsSold.toLocaleString()} units sold</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] flex items-center gap-1"><Eye className="w-3 h-3 text-blue-400" />Views</span>
                <p className="font-bold text-slate-200 mt-0.5">{(prd.views / 1e6).toFixed(2)}M</p>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] flex items-center gap-1"><ShoppingCart className="w-3 h-3 text-emerald-400" />Cart Additions</span>
                <p className="font-bold text-emerald-400 mt-0.5">{(prd.cartAdditions / 1e3).toFixed(0)}K</p>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] flex items-center gap-1"><Heart className="w-3 h-3 text-rose-400" />Wishlists</span>
                <p className="font-bold text-rose-400 mt-0.5">{(prd.wishlistAdditions / 1e3).toFixed(0)}K</p>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] flex items-center gap-1"><RefreshCw className="w-3 h-3 text-amber-400" />Turnover</span>
                <p className="font-bold text-amber-400 mt-0.5">{prd.inventoryTurnoverRate}x / yr</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
              <span className="flex items-center text-amber-300 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                {prd.rating} ({prd.reviewCount.toLocaleString()} verified reviews)
              </span>
              <span className="flex items-center text-xs font-bold text-purple-400">
                <Flame className="w-3.5 h-3.5 mr-1" />
                Seasonal Trend: {prd.seasonalTrend}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
