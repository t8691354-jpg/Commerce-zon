import React, { useState } from 'react';
import { 
  Sparkles, Layers, ShoppingBag, Eye, History, ArrowRight, Flame, Star, Award, Clock, Compass, CheckCircle2, ChevronRight
} from 'lucide-react';
import { ProductSearchResult } from '../../types/aiEngine';
import { MOCK_PRODUCTS } from '../../data/mockAiEngineData';

export const SmartRecommendationsView: React.FC = () => {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');

  const recommendationSections = [
    {
      id: 'rec-for-you',
      icon: Sparkles,
      color: 'text-amber-400',
      title: 'Recommended For You',
      subtitle: 'Generated via Real-Time Neural User Vector Embeddings',
      products: [MOCK_PRODUCTS[0], MOCK_PRODUCTS[1], MOCK_PRODUCTS[2]]
    },
    {
      id: 'because-viewed',
      icon: Eye,
      color: 'text-purple-400',
      title: 'Because You Viewed ROG Strix Scar 18',
      subtitle: 'High-affinity gaming accessories & cooling pads',
      products: [MOCK_PRODUCTS[5], MOCK_PRODUCTS[1], MOCK_PRODUCTS[3]]
    },
    {
      id: 'purchase-history',
      icon: History,
      color: 'text-emerald-400',
      title: 'Based On Purchase History',
      subtitle: 'Reorder supplies & ecosystem upgrades',
      products: [MOCK_PRODUCTS[1], MOCK_PRODUCTS[4]]
    },
    {
      id: 'freq-together',
      icon: Layers,
      color: 'text-sky-400',
      title: 'Frequently Bought Together',
      subtitle: 'AI Automated Product Bundles with 10% Savings',
      products: [MOCK_PRODUCTS[0], MOCK_PRODUCTS[1]]
    },
    {
      id: 'customers-also-bought',
      icon: ShoppingBag,
      color: 'text-rose-400',
      title: 'Customers Also Bought',
      subtitle: 'Collaborative filtering cluster signals',
      products: [MOCK_PRODUCTS[2], MOCK_PRODUCTS[4], MOCK_PRODUCTS[5]]
    },
    {
      id: 'similar-products',
      icon: Compass,
      color: 'text-indigo-400',
      title: 'Similar Products',
      subtitle: 'Visual & specification feature similarity matches',
      products: [MOCK_PRODUCTS[3], MOCK_PRODUCTS[0]]
    },
    {
      id: 'trending-near-you',
      icon: Flame,
      color: 'text-amber-500',
      title: 'Trending Near You',
      subtitle: 'Geographic popular items in your postal code',
      products: [MOCK_PRODUCTS[2], MOCK_PRODUCTS[1]]
    },
    {
      id: 'new-arrivals',
      icon: Clock,
      color: 'text-teal-400',
      title: 'New Arrivals',
      subtitle: 'Just added to marketplace inventory',
      products: [MOCK_PRODUCTS[5], MOCK_PRODUCTS[0]]
    },
    {
      id: 'top-rated',
      icon: Star,
      color: 'text-yellow-400',
      title: 'Top Rated',
      subtitle: 'Verified 4.8+ star customer rating threshold',
      products: [MOCK_PRODUCTS[1], MOCK_PRODUCTS[3], MOCK_PRODUCTS[0]]
    },
    {
      id: 'best-sellers',
      icon: Award,
      color: 'text-amber-400',
      title: 'Best Sellers',
      subtitle: '#1 Sales volume leaders in primary categories',
      products: [MOCK_PRODUCTS[0], MOCK_PRODUCTS[2]]
    },
    {
      id: 'recently-viewed',
      icon: Eye,
      color: 'text-slate-400',
      title: 'Recently Viewed',
      subtitle: 'Your session browsing queue',
      products: [MOCK_PRODUCTS[1], MOCK_PRODUCTS[5], MOCK_PRODUCTS[4]]
    },
    {
      id: 'continue-shopping',
      icon: ArrowRight,
      color: 'text-emerald-400',
      title: 'Continue Shopping For Laptops',
      subtitle: 'Pick up right where you left off',
      products: [MOCK_PRODUCTS[0], MOCK_PRODUCTS[3]]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Title & Filter Bar */}
      <div className="bg-slate-900/95 border border-slate-800 p-5 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl border border-purple-500/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Smart AI Recommendation Engine</h2>
            <p className="text-xs text-slate-400">12 Multi-tier personalized recommendation carousels driven by neural embeddings</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto text-xs">
          {['All', 'Electronics', 'Audio', 'Footwear', 'Gaming'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap ${
                activeCategoryFilter === cat
                  ? 'bg-purple-600 text-white shadow'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 12 Recommendation Carousels */}
      <div className="space-y-8">
        {recommendationSections.map((sec) => {
          const IconComp = sec.icon;

          return (
            <div key={sec.id} className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4 shadow-lg">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2.5">
                  <IconComp className={`w-5 h-5 ${sec.color}`} />
                  <div>
                    <h3 className="text-sm font-bold text-white">{sec.title}</h3>
                    <p className="text-[11px] text-slate-400">{sec.subtitle}</p>
                  </div>
                </div>

                <button className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center space-x-1">
                  <span>View All</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Product Horizontal Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sec.products.map((prod) => (
                  <div 
                    key={prod.id}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2 hover:border-purple-500/50 transition flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="relative h-36 rounded-lg overflow-hidden bg-slate-900">
                        <img 
                          src={prod.imageUrl} 
                          alt={prod.title} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-slate-950/80 text-amber-400 font-mono text-[10px] font-bold">
                          ★ {prod.rating}
                        </div>
                      </div>

                      <h4 className="text-xs font-bold text-white line-clamp-2">{prod.title}</h4>
                      <p className="text-[10px] text-slate-400">by {prod.sellerName}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                      <div className="text-sm font-black text-white font-mono">${prod.price.toFixed(2)}</div>
                      <button
                        onClick={() => alert(`Purchasing bundle for ${prod.title}`)}
                        className="px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold transition shadow"
                      >
                        Quick Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
