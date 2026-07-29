import React, { useState } from 'react';
import { SupplierProduct } from '../../types/dropshipping';
import {
  Package,
  Plus,
  Upload,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Tag,
  DollarSign,
  Layers,
  FileCode,
  Box,
} from 'lucide-react';

interface SupplierProductCatalogueProps {
  products: SupplierProduct[];
  onAddProduct: (product: SupplierProduct) => void;
  onUpdateStock: (productId: string, newStock: number) => void;
}

export const SupplierProductCatalogue: React.FC<SupplierProductCatalogueProps> = ({
  products,
  onAddProduct,
  onUpdateStock,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);

  const [newProd, setNewProd] = useState({
    title: '',
    sku: '',
    barcode: '',
    category: 'Electronics',
    wholesalePriceUSD: 25.0,
    suggestedRetailPriceUSD: 79.99,
    moq: 1,
    currentStock: 500,
    weightKg: 0.5,
    imageUrl: '',
    description: '',
  });

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.supplierName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.title || !newProd.sku) {
      alert('Title and SKU are required.');
      return;
    }

    const created: SupplierProduct = {
      id: `SPROD-${Math.floor(800 + Math.random() * 200)}`,
      supplierId: 'SUP-9001',
      supplierName: 'Apex Electronics Global Wholesalers',
      title: newProd.title,
      sku: newProd.sku,
      barcode: newProd.barcode || '079357319' + Math.floor(1000 + Math.random() * 9000),
      category: newProd.category,
      description: newProd.description || 'Enterprise wholesale dropship catalogue item.',
      images: [
        newProd.imageUrl ||
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      ],
      wholesalePriceUSD: newProd.wholesalePriceUSD,
      suggestedRetailPriceUSD: newProd.suggestedRetailPriceUSD,
      moq: newProd.moq,
      currentStock: newProd.currentStock,
      reservedStock: 0,
      availableStock: newProd.currentStock,
      variants: [],
      status: newProd.currentStock > 0 ? 'ACTIVE' : 'OUT_OF_STOCK',
      weightKg: newProd.weightKg,
      dimensionsCm: { length: 20, width: 15, height: 5 },
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      lastStockSyncAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    onAddProduct(created);
    setShowAddModal(false);
    alert(`Wholesale product ${created.sku} added to global supplier catalogue!`);
  };

  const handleBulkImportCSV = () => {
    // Demo bulk upload
    const mockBulkProduct: SupplierProduct = {
      id: `SPROD-${Math.floor(800 + Math.random() * 200)}`,
      supplierId: 'SUP-9001',
      supplierName: 'Apex Electronics Global Wholesalers',
      title: 'Bulk Imported Fast USB-C Braided Cable 3-Pack',
      sku: 'APX-CBL-USBC3P',
      barcode: '0793573199999',
      category: 'Electronics',
      description: '60W Power Delivery nylon braided fast charging cables.',
      images: ['https://images.unsplash.com/photo-1622445268121-8a1d18897089?auto=format&fit=crop&w=800&q=80'],
      wholesalePriceUSD: 4.80,
      suggestedRetailPriceUSD: 19.99,
      moq: 10,
      currentStock: 5000,
      reservedStock: 0,
      availableStock: 5000,
      variants: [],
      status: 'ACTIVE',
      weightKg: 0.15,
      dimensionsCm: { length: 15, width: 10, height: 2 },
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      lastStockSyncAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    onAddProduct(mockBulkProduct);
    setShowBulkModal(false);
    alert('Bulk CSV catalogue import complete! 1 new SKU registered.');
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <Package className="w-4 h-4 text-[#febd69]" />
            <span>WHOLESALE SUPPLIER PRODUCT CATALOGUE</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Master Supplier Inventory & Wholesale Pricing</h2>
          <p className="text-xs text-slate-400 mt-1">
            Maintain wholesale price tiers, MOQ thresholds, variants, barcoding & live warehouse inventory sync
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowBulkModal(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1.5 border border-slate-700"
          >
            <Upload className="w-4 h-4 text-sky-400" />
            <span>Bulk CSV Import</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black text-xs rounded-xl transition flex items-center space-x-1.5 shadow"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Wholesale SKU</span>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by product title, SKU, or supplier..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-[#febd69]"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Computers & Accessories">Computers & Accessories</option>
            <option value="Home & Kitchen">Home & Kitchen</option>
          </select>
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
        {filteredProducts.map((p) => (
          <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-center space-x-3">
                  <img
                    src={p.images[0]}
                    alt={p.title}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-800 bg-slate-950"
                  />
                  <div>
                    <h3 className="font-extrabold text-white text-xs leading-snug line-clamp-2">{p.title}</h3>
                    <span className="text-[10px] font-mono text-[#febd69] block mt-0.5">{p.sku}</span>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[9px] font-black uppercase flex-shrink-0 ${
                    p.status === 'ACTIVE'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {p.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px]">
                <div>
                  <span className="text-slate-500 text-[9px] uppercase block">Wholesale Price</span>
                  <span className="font-bold text-emerald-400">${p.wholesalePriceUSD.toFixed(2)} USD</span>
                </div>

                <div>
                  <span className="text-slate-500 text-[9px] uppercase block">MSRP / Retail</span>
                  <span className="font-bold text-white">${p.suggestedRetailPriceUSD.toFixed(2)} USD</span>
                </div>

                <div>
                  <span className="text-slate-500 text-[9px] uppercase block">MOQ (Min Order)</span>
                  <span className="font-bold text-amber-300">{p.moq} Units</span>
                </div>

                <div>
                  <span className="text-slate-500 text-[9px] uppercase block">Available Stock</span>
                  <span className="font-bold text-sky-400">{p.availableStock} Units</span>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 space-y-1">
                <div>Supplier: <strong className="text-white">{p.supplierName}</strong></div>
                <div>Barcode / EAN: <strong className="text-slate-300 font-mono">{p.barcode}</strong></div>
                <div>Weight: <strong className="text-slate-300 font-mono">{p.weightKg} kg</strong></div>
              </div>
            </div>

            {/* Quick Stock Sync Control */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">Stock Sync: {p.lastStockSyncAt}</span>
              <button
                onClick={() => {
                  const updated = prompt(`Enter new available stock quantity for ${p.sku}:`, p.availableStock.toString());
                  if (updated !== null) {
                    onUpdateStock(p.id, parseInt(updated, 10) || 0);
                  }
                }}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white font-bold text-[10px] rounded-lg transition"
              >
                Update Stock
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Single Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-xl w-full space-y-4 shadow-2xl text-xs">
            <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3">
              Add New Wholesale Supplier SKU
            </h3>

            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div>
                <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={newProd.title}
                  onChange={(e) => setNewProd({ ...newProd, title: e.target.value })}
                  placeholder="e.g. UltraSonic Bluetooth Speaker 20W"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#febd69]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">SKU *</label>
                  <input
                    type="text"
                    required
                    value={newProd.sku}
                    onChange={(e) => setNewProd({ ...newProd, sku: e.target.value })}
                    placeholder="APX-SPK-20W"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#febd69]"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Barcode / EAN</label>
                  <input
                    type="text"
                    value={newProd.barcode}
                    onChange={(e) => setNewProd({ ...newProd, barcode: e.target.value })}
                    placeholder="0793573192099"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#febd69]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Wholesale ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProd.wholesalePriceUSD}
                    onChange={(e) => setNewProd({ ...newProd, wholesalePriceUSD: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-emerald-400 font-mono font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Retail MSRP ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProd.suggestedRetailPriceUSD}
                    onChange={(e) => setNewProd({ ...newProd, suggestedRetailPriceUSD: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Initial Stock</label>
                  <input
                    type="number"
                    value={newProd.currentStock}
                    onChange={(e) => setNewProd({ ...newProd, currentStock: parseInt(e.target.value, 10) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sky-400 font-mono font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black rounded-xl"
                >
                  Save Wholesale SKU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk CSV Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 text-xs">
            <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3">
              Bulk CSV Catalogue Import
            </h3>
            <p className="text-slate-400">
              Upload standard Amazon Dropship CSV file (SKU, Title, WholesalePrice, Stock, MOQ, Barcode).
            </p>

            <div className="border-2 border-dashed border-slate-700 p-6 rounded-xl text-center space-y-2">
              <FileCode className="w-8 h-8 text-[#febd69] mx-auto" />
              <span className="text-slate-300 font-bold block">Drag & Drop catalogue.csv or click to browse</span>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowBulkModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkImportCSV}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl"
              >
                Process CSV Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
