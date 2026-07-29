import React, { useState } from 'react';
import { SupplierProduct, ImportedSellerProduct } from '../../types/dropshipping';
import {
  Download,
  Store,
  CheckCircle2,
  Edit3,
  Trash2,
  PauseCircle,
  PlayCircle,
  TrendingUp,
  DollarSign,
  Tag,
  RefreshCw,
  Eye,
  Sliders,
} from 'lucide-react';

interface SellerProductImportManagerProps {
  supplierProducts: SupplierProduct[];
  importedSellerProducts: ImportedSellerProduct[];
  onImportProduct: (supplierProduct: SupplierProduct, sellingPrice: number, marginPct: number) => void;
  onUpdateImportedProduct: (updated: ImportedSellerProduct) => void;
  onRemoveImportedProduct: (importedId: string) => void;
}

export const SellerProductImportManager: React.FC<SellerProductImportManagerProps> = ({
  supplierProducts,
  importedSellerProducts,
  onImportProduct,
  onUpdateImportedProduct,
  onRemoveImportedProduct,
}) => {
  const [activeTab, setActiveTab] = useState<'BROWSE_SUPPLIERS' | 'MY_IMPORTED_LISTINGS'>('BROWSE_SUPPLIERS');
  const [selectedProductToImport, setSelectedProductToImport] = useState<SupplierProduct | null>(null);

  // Custom markup calculator state
  const [customSellingPrice, setCustomSellingPrice] = useState<number>(0);
  const [customTitle, setCustomTitle] = useState<string>('');

  const handleOpenImportModal = (sp: SupplierProduct) => {
    setSelectedProductToImport(sp);
    setCustomTitle(`Store Listing - ${sp.title}`);
    setCustomSellingPrice(sp.suggestedRetailPriceUSD);
  };

  const handleConfirmImport = () => {
    if (!selectedProductToImport) return;
    const wholesaleCost = selectedProductToImport.wholesalePriceUSD;
    const marginAmount = customSellingPrice - wholesaleCost;
    const marginPct = (marginAmount / wholesaleCost) * 100;

    onImportProduct(selectedProductToImport, customSellingPrice, marginPct);
    setSelectedProductToImport(null);
    alert(`Product successfully imported to your store! Selling price set to $${customSellingPrice.toFixed(2)}.`);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <Store className="w-4 h-4 text-[#febd69]" />
            <span>SELLER STOREFRONT DROPSHIP CATALOGUE MANAGER</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">1-Click Supplier Product Import & Profit Margin Engine</h2>
          <p className="text-xs text-slate-400 mt-1">
            Browse verified wholesale supplier items, set profit markup percentages, customize listing titles & publish to your storefront
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('BROWSE_SUPPLIERS')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition ${
              activeTab === 'BROWSE_SUPPLIERS' ? 'bg-[#febd69] text-slate-950 font-black' : 'text-slate-300 hover:text-white'
            }`}
          >
            Browse Supplier Directory ({supplierProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('MY_IMPORTED_LISTINGS')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition ${
              activeTab === 'MY_IMPORTED_LISTINGS' ? 'bg-[#febd69] text-slate-950 font-black' : 'text-slate-300 hover:text-white'
            }`}
          >
            My Store Listings ({importedSellerProducts.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Browse Wholesale Supplier Products */}
      {activeTab === 'BROWSE_SUPPLIERS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
          {supplierProducts.map((sp) => {
            const isAlreadyImported = importedSellerProducts.some((imp) => imp.supplierProductId === sp.id);

            return (
              <div key={sp.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={sp.images[0]}
                      alt={sp.title}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-800 bg-slate-950"
                    />
                    <div>
                      <h3 className="font-extrabold text-white text-xs leading-snug line-clamp-2">{sp.title}</h3>
                      <span className="text-[10px] font-mono text-slate-400 block mt-0.5">Supplier: {sp.supplierName}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px]">
                    <div>
                      <span className="text-slate-500 text-[9px] uppercase block">Wholesale Cost</span>
                      <span className="font-bold text-emerald-400">${sp.wholesalePriceUSD.toFixed(2)} USD</span>
                    </div>

                    <div>
                      <span className="text-slate-500 text-[9px] uppercase block">Suggested MSRP</span>
                      <span className="font-bold text-white">${sp.suggestedRetailPriceUSD.toFixed(2)} USD</span>
                    </div>

                    <div>
                      <span className="text-slate-500 text-[9px] uppercase block">Supplier Stock</span>
                      <span className="font-bold text-sky-400">{sp.availableStock} Units</span>
                    </div>

                    <div>
                      <span className="text-slate-500 text-[9px] uppercase block">Est. Profit Margin</span>
                      <span className="font-bold text-[#febd69]">
                        +${(sp.suggestedRetailPriceUSD - sp.wholesalePriceUSD).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenImportModal(sp)}
                  disabled={isAlreadyImported || sp.availableStock <= 0}
                  className={`w-full py-2.5 rounded-xl font-extrabold transition flex items-center justify-center space-x-1.5 ${
                    isAlreadyImported
                      ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
                  }`}
                >
                  <Download className="w-4 h-4" />
                  <span>{isAlreadyImported ? 'Already In Storefront' : '1-Click Import to Store'}</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Seller's Imported Products */}
      {activeTab === 'MY_IMPORTED_LISTINGS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden text-xs">
          <div className="p-4 bg-slate-950 border-b border-slate-800 font-black text-white text-xs uppercase tracking-wider flex justify-between items-center">
            <span>Imported Store Listings ({importedSellerProducts.length})</span>
            <span className="text-[10px] text-emerald-400 font-mono">Live Sync with Supplier Inventories Active</span>
          </div>

          <div className="divide-y divide-slate-800">
            {importedSellerProducts.map((imp) => (
              <div key={imp.id} className="p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 hover:bg-slate-950/40">
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-white text-sm">{imp.customTitle}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                        imp.status === 'PUBLISHED'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {imp.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{imp.customDescription}</p>
                  <div className="text-[10px] text-slate-500 font-mono pt-1">
                    Supplier SKU: <strong className="text-slate-300">{imp.supplierProductId}</strong> ({imp.supplierName})
                  </div>
                </div>

                <div className="flex items-center space-x-6 font-mono text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase block">Wholesale Cost</span>
                    <span className="text-slate-300 font-bold">${imp.wholesalePriceUSD.toFixed(2)}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[10px] uppercase block">Selling Price</span>
                    <span className="text-emerald-400 font-black">${imp.sellingPriceUSD.toFixed(2)}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[10px] uppercase block">Profit / Sale</span>
                    <span className="text-[#febd69] font-bold">+${imp.profitMarginAmountUSD.toFixed(2)} ({imp.profitMarginPct.toFixed(0)}%)</span>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[10px] uppercase block">Synced Stock</span>
                    <span className="text-sky-400 font-bold">{imp.syncedStock} Units</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        const updatedStatus = imp.status === 'PUBLISHED' ? 'PAUSED' : 'PUBLISHED';
                        onUpdateImportedProduct({ ...imp, status: updatedStatus });
                      }}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition"
                      title="Toggle Publish / Pause"
                    >
                      {imp.status === 'PUBLISHED' ? <PauseCircle className="w-4 h-4 text-amber-400" /> : <PlayCircle className="w-4 h-4 text-emerald-400" />}
                    </button>

                    <button
                      onClick={() => onRemoveImportedProduct(imp.id)}
                      className="p-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 rounded-lg transition"
                      title="Remove from store"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Import & Price Markup Modal */}
      {selectedProductToImport && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl text-xs">
            <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center space-x-2">
              <Download className="w-4 h-4 text-[#febd69]" />
              <span>Configure Profit Margin & Store Listing</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Store Listing Title</label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold focus:outline-none focus:border-[#febd69]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] uppercase block">Supplier Wholesale Cost</span>
                  <span className="text-emerald-400 text-sm font-black">${selectedProductToImport.wholesalePriceUSD.toFixed(2)} USD</span>
                </div>

                <div>
                  <label className="block text-slate-400 text-[10px] uppercase mb-1">Your Store Selling Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={customSellingPrice}
                    onChange={(e) => setCustomSellingPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-black text-sm focus:outline-none focus:border-[#febd69]"
                  />
                </div>
              </div>

              {/* Profit Math Preview */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Net Profit per Unit:</span>
                  <strong className="text-emerald-400">+${(customSellingPrice - selectedProductToImport.wholesalePriceUSD).toFixed(2)} USD</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Calculated Profit Margin:</span>
                  <strong className="text-[#febd69]">
                    {(((customSellingPrice - selectedProductToImport.wholesalePriceUSD) / selectedProductToImport.wholesalePriceUSD) * 100).toFixed(1)}%
                  </strong>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setSelectedProductToImport(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmImport}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl"
              >
                Import & Publish to Store
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
