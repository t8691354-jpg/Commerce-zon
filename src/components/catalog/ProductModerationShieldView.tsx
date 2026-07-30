import React, { useState } from 'react';
import { Product } from '../../types/domain';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
  Search,
  Lock,
  Eye,
  Trash2,
} from 'lucide-react';

interface ProductModerationShieldViewProps {
  products: Product[];
  onUpdateProduct: (product: Product) => void;
}

export const ProductModerationShieldView: React.FC<ProductModerationShieldViewProps> = ({
  products,
  onUpdateProduct,
}) => {
  const [flaggedItems, setFlaggedItems] = useState(
    products.map((p, idx) => ({
      ...p,
      isFlaggedForModeration: idx % 3 === 0,
      flagReason:
        idx % 3 === 0
          ? 'AI Detected: Possible Duplicate SKU / Missing GTIN Barcode'
          : undefined,
    }))
  );

  const handleResolveFlag = (id: string, approve: boolean) => {
    setFlaggedItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = {
            ...item,
            isFlaggedForModeration: false,
            approvalStatus: approve ? ('APPROVED' as const) : ('REJECTED' as const),
          };
          onUpdateProduct(updated);
          return updated;
        }
        return item;
      })
    );
  };

  const flaggedOnly = flaggedItems.filter((p) => p.isFlaggedForModeration);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-black text-white flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            <span>AI Automated Listing Moderation & IP Shield</span>
          </h2>
          <p className="text-xs text-slate-400">
            Auto-detect Duplicate Products, Spam Listings, Fake Brands, Restricted Goods & Missing GTINs
          </p>
        </div>

        <div className="px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-black font-mono">
          {flaggedOnly.length} Flagged Listings Requiring Review
        </div>
      </div>

      {/* Flagged Items Grid */}
      <div className="space-y-4">
        {flaggedOnly.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900 border border-rose-500/40 rounded-2xl p-5 space-y-4 shadow-xl"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <img
                  src={item.images?.[0] || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=400&q=80'}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 object-contain bg-slate-950 p-1 rounded-xl border border-slate-800"
                />
                <div>
                  <h3 className="text-sm font-bold text-white">{item.title}</h3>
                  <div className="text-[11px] font-mono text-slate-400">
                    Merchant: <strong className="text-amber-400">{item.merchant.name}</strong> | SKU: {item.sku}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleResolveFlag(item.id, true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition flex items-center space-x-1"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve Listing</span>
                </button>

                <button
                  onClick={() => handleResolveFlag(item.id, false)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition flex items-center space-x-1"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject & Takedown</span>
                </button>
              </div>
            </div>

            {/* AI Warning Box */}
            <div className="bg-rose-500/10 border-l-4 border-rose-500 p-3 rounded-r-xl text-xs text-rose-200 flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-bold">Commerce Zon AI Compliance Alert: </span>
                {item.flagReason || 'Automated policy flag triggered during listing intake.'}
              </div>
            </div>
          </div>
        ))}

        {flaggedOnly.length === 0 && (
          <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-bold text-white">All Clear! No Flagged Listings</h3>
            <p className="text-xs text-slate-400">Your marketplace catalog is 100% compliant with Commerce Zon IP guidelines.</p>
          </div>
        )}
      </div>
    </div>
  );
};
