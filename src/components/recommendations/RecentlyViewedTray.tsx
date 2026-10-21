import React, { useState, useEffect } from 'react';
import { Product } from '../../types/domain';
import { RecommendationItem } from '../../types/recommendations';
import { recommendationClient } from '../../services/recommendationClient';
import { History, Trash2, ShoppingCart, Check, Eye } from 'lucide-react';

interface RecentlyViewedTrayProps {
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const RecentlyViewedTray: React.FC<RecentlyViewedTrayProps> = ({
  onAddToCart,
  onSelectProduct,
}) => {
  const [items, setItems] = useState<RecommendationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState<string | null>(null);

  useEffect(() => {
    loadRecentlyViewed();
  }, []);

  const loadRecentlyViewed = async () => {
    setLoading(true);
    const ids = recommendationClient.getLocalRecentlyViewedIds();
    if (ids.length > 0) {
      const res = await recommendationClient.getRecentlyViewed(ids);
      if (res && res.recommendations) {
        setItems(res.recommendations);
      }
    } else {
      setItems([]);
    }
    setLoading(false);
  };

  const handleClear = async () => {
    await recommendationClient.clearHistory();
    setItems([]);
  };

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    recommendationClient.trackInteraction(product, 'cart_add');
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  if (!loading && items.length === 0) {
    return null; // Don't show empty tray if user hasn't browsed yet
  }

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <History className="w-4 h-4 text-[#febd69]" />
          <h2 className="text-sm font-black text-white uppercase tracking-wider">
            Your Recently Viewed Equipment
          </h2>
          <span className="text-xs text-slate-500 font-mono">({items.length} items)</span>
        </div>

        <button
          type="button"
          onClick={handleClear}
          className="text-xs text-slate-400 hover:text-red-400 transition flex items-center space-x-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear History</span>
        </button>
      </div>

      <div className="overflow-x-auto pb-2 scrollbar-thin">
        <div className="flex space-x-4 min-w-max">
          {items.map((item) => {
            const { product } = item;
            const isAdded = addedId === product.id;

            return (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="w-44 bg-slate-950 border border-slate-800 hover:border-[#febd69]/50 rounded-xl p-3 flex flex-col justify-between space-y-2 cursor-pointer transition shadow group"
              >
                <div className="h-28 bg-slate-900 rounded-lg p-2 flex items-center justify-center">
                  <img
                    src={product.images?.[0] || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=400&q=80'}
                    alt={product.title}
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                  />
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] text-slate-400 capitalize">{product.category}</div>
                  <div className="text-xs font-bold text-white line-clamp-1 group-hover:text-[#febd69] transition">
                    {product.title}
                  </div>
                  <div className="text-xs font-mono font-extrabold text-white">
                    ${product.price.amount.toFixed(2)}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleAddToCart(product, e)}
                  className="w-full py-1.5 bg-slate-800 hover:bg-[#ffd814] hover:text-slate-950 text-slate-200 font-bold rounded-lg text-xs transition flex items-center justify-center space-x-1"
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Added!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
