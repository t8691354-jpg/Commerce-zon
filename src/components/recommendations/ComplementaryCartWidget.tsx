import React, { useState, useEffect } from 'react';
import { Product } from '../../types/domain';
import { RecommendationItem } from '../../types/recommendations';
import { recommendationClient } from '../../services/recommendationClient';
import { Plus, Check, ShieldCheck, Sparkles, ShoppingBag } from 'lucide-react';

interface ComplementaryCartWidgetProps {
  cart: { product: Product; quantity: number }[];
  onAddToCart: (product: Product) => void;
}

export const ComplementaryCartWidget: React.FC<ComplementaryCartWidgetProps> = ({
  cart,
  onAddToCart,
}) => {
  const [items, setItems] = useState<RecommendationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const cartProductIds = cart.map((i) => i.product.id);

  useEffect(() => {
    if (cartProductIds.length === 0) {
      setItems([]);
      return;
    }

    const fetchComplementary = async () => {
      setLoading(true);
      try {
        const res = await recommendationClient.getComplementaryProducts(cartProductIds, 3);
        if (res && res.recommendations) {
          // Filter out anything already in cart
          const filtered = res.recommendations.filter(
            (rec) => !cartProductIds.includes(rec.product.id)
          );
          setItems(filtered);
        }
      } catch (err) {
        console.warn('Failed to load complementary cart items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplementary();
  }, [cartProductIds.join(',')]);

  if (cartProductIds.length === 0 || (items.length === 0 && !loading)) {
    return null;
  }

  const handleAdd = (product: Product) => {
    onAddToCart(product);
    recommendationClient.trackInteraction(product, 'cart_add');
    setAddedIds((prev) => new Set([...prev, product.id]));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 2000);
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-[#febd69]" />
          <h3 className="text-xs font-black text-white uppercase tracking-wider">
            Verified Add-ons for Your Cart
          </h3>
        </div>
        <span className="text-[10px] text-amber-300 font-bold">1-Click Cross-Sell</span>
      </div>

      <p className="text-[11px] text-slate-400">
        Engineered accessories and SLA protection plans compatible with your selected items:
      </p>

      {loading ? (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-16 bg-slate-900 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => {
            const { product } = item;
            const isAdded = addedIds.has(product.id);

            return (
              <div
                key={product.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-2.5 flex items-center justify-between gap-3 transition"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-11 h-11 bg-slate-950 rounded-lg p-1 shrink-0 flex items-center justify-center border border-slate-800">
                    <img
                      src={product.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80'}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <div className="text-[11px] font-bold text-white truncate max-w-[170px]">
                      {product.title}
                    </div>
                    <div className="flex items-center space-x-1.5 text-[10px]">
                      <span className="text-emerald-400 font-mono font-bold">
                        ${product.price.amount.toFixed(2)}
                      </span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400 truncate max-w-[90px]">{item.badge || 'Verified'}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleAdd(product)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1 shrink-0 shadow ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#ffd814] hover:bg-[#f7ca00] text-slate-950'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>Added</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
