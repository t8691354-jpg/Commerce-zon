import React, { useState, useEffect } from 'react';
import { Product } from '../../types/domain';
import { RecommendationItem } from '../../types/recommendations';
import { recommendationClient } from '../../services/recommendationClient';
import {
  Sparkles,
  Plus,
  Check,
  ShoppingCart,
  Star,
  Layers,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface ProductDetailRecommendationsProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onSelectProduct?: (product: Product) => void;
}

export const ProductDetailRecommendations: React.FC<ProductDetailRecommendationsProps> = ({
  product,
  onAddToCart,
  onSelectProduct,
}) => {
  const [boughtTogether, setBoughtTogether] = useState<RecommendationItem[]>([]);
  const [frequentlyViewed, setFrequentlyViewed] = useState<RecommendationItem[]>([]);
  const [similarItems, setSimilarItems] = useState<RecommendationItem[]>([]);
  const [bundleAdded, setBundleAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'similar' | 'viewed_together'>('similar');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const loadAll = async () => {
      try {
        const [boughtRes, viewedRes, similarRes] = await Promise.all([
          recommendationClient.getFrequentlyBoughtTogether(product.id, 1),
          recommendationClient.getFrequentlyViewedTogether(product.id, 3),
          recommendationClient.getSimilarProducts(product.id, 3),
        ]);

        if (isMounted) {
          if (boughtRes?.recommendations) setBoughtTogether(boughtRes.recommendations);
          if (viewedRes?.recommendations) setFrequentlyViewed(viewedRes.recommendations);
          if (similarRes?.recommendations) setSimilarItems(similarRes.recommendations);
        }
      } catch (err) {
        console.warn('Error loading product detail recommendations:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadAll();
    return () => {
      isMounted = false;
    };
  }, [product.id]);

  const companionItem = boughtTogether[0]?.product;
  const bundleSavingsPct = 5;
  const bundleOriginalTotal = companionItem
    ? product.price.amount + companionItem.price.amount
    : product.price.amount;
  const bundleDiscountedTotal = bundleOriginalTotal * (1 - bundleSavingsPct / 100);

  const handleAddBundle = () => {
    onAddToCart(product);
    recommendationClient.trackInteraction(product, 'cart_add');
    if (companionItem) {
      onAddToCart(companionItem);
      recommendationClient.trackInteraction(companionItem, 'cart_add');
    }
    setBundleAdded(true);
    setTimeout(() => setBundleAdded(false), 3000);
  };

  return (
    <div className="space-y-6 font-sans border-t border-slate-800 pt-6">
      {/* 1. Frequently Bought Together Box */}
      {companionItem && (
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-amber-500/40 p-5 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="bg-[#febd69] text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-widest">
                FREQUENTLY BOUGHT TOGETHER
              </span>
              <span className="text-xs text-amber-300 font-bold">Bundle & Save 5%</span>
            </div>
            <span className="text-[11px] text-slate-400 hidden sm:inline">1-Click Combined Order</span>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-5">
            {/* Visual Products Row */}
            <div className="flex items-center space-x-3 w-full md:w-auto">
              {/* Product 1 (Current) */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 w-36 text-center space-y-1.5 shadow shrink-0">
                <div className="h-20 flex items-center justify-center p-1">
                  <img
                    src={product.images?.[0] || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=400&q=80'}
                    alt={product.title}
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="text-[10px] font-bold text-white line-clamp-1">{product.title}</div>
                <div className="text-xs font-mono font-extrabold text-amber-300">
                  ${product.price.amount.toFixed(2)}
                </div>
              </div>

              <div className="p-1.5 bg-slate-800 rounded-full text-slate-400 font-bold shrink-0">
                <Plus className="w-4 h-4 text-[#febd69]" />
              </div>

              {/* Product 2 (Companion) */}
              <div
                onClick={() => onSelectProduct && onSelectProduct(companionItem)}
                className="bg-slate-950 border border-slate-800 hover:border-amber-400/50 cursor-pointer rounded-xl p-3 w-36 text-center space-y-1.5 shadow shrink-0 transition"
              >
                <div className="h-20 flex items-center justify-center p-1">
                  <img
                    src={companionItem.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80'}
                    alt={companionItem.title}
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="text-[10px] font-bold text-white line-clamp-1">{companionItem.title}</div>
                <div className="text-xs font-mono font-extrabold text-emerald-400">
                  ${companionItem.price.amount.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Bundle Checkout Box */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 w-full md:w-64 text-center md:text-left shrink-0">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Bundle Total:</span>
                <span className="line-through text-slate-500 font-mono">${bundleOriginalTotal.toFixed(2)}</span>
              </div>
              <div className="text-2xl font-black text-white font-mono flex items-center space-x-2">
                <span>${bundleDiscountedTotal.toFixed(2)}</span>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                  Save 5%
                </span>
              </div>
              <button
                type="button"
                onClick={handleAddBundle}
                className="w-full py-2.5 bg-[#ffd814] hover:bg-[#f7ca00] text-slate-950 font-black text-xs rounded-xl shadow transition flex items-center justify-center space-x-1.5"
              >
                {bundleAdded ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-900" />
                    <span>Bundle Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add Both to Cart</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Similar & Frequently Viewed Tabbed Carousel */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-3 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('similar')}
              className={`pb-2 border-b-2 transition flex items-center space-x-1.5 ${
                activeTab === 'similar'
                  ? 'border-[#febd69] text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#febd69]" />
              <span>Similar Equipment in Department ({similarItems.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('viewed_together')}
              className={`pb-2 border-b-2 transition flex items-center space-x-1.5 ${
                activeTab === 'viewed_together'
                  ? 'border-[#febd69] text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
              <span>Customers Also Viewed ({frequentlyViewed.length})</span>
            </button>
          </div>
        </div>

        {/* Display Items */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-44 bg-slate-900 border border-slate-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(activeTab === 'similar' ? similarItems : frequentlyViewed).map((item) => {
              const { product: prod } = item;
              return (
                <div
                  key={prod.id}
                  onClick={() => onSelectProduct && onSelectProduct(prod)}
                  className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-3 flex flex-col justify-between space-y-2 group cursor-pointer transition shadow"
                >
                  <div className="h-28 bg-slate-900 rounded-lg p-2 flex items-center justify-center">
                    <img
                      src={prod.images?.[0] || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=400&q=80'}
                      alt={prod.title}
                      referrerPolicy="no-referrer"
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="text-[10px] text-amber-400 font-semibold">{prod.category}</div>
                    <div className="text-xs font-bold text-white line-clamp-1 group-hover:text-[#febd69] transition">
                      {prod.title}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-black text-white">${prod.price.amount.toFixed(2)}</span>
                      <span className="text-[10px] text-emerald-400 font-semibold">{item.badge || 'Verified'}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(prod);
                      recommendationClient.trackInteraction(prod, 'cart_add');
                    }}
                    className="w-full py-1.5 bg-slate-800 hover:bg-[#febd69] hover:text-slate-950 text-slate-200 font-bold rounded-lg text-xs transition"
                  >
                    Add to Cart
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
