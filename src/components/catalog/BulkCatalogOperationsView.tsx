import React, { useState } from 'react';
import { Product } from '../../types/domain';
import {
  UploadCloud,
  DownloadCloud,
  FileSpreadsheet,
  Edit,
  Trash2,
  DollarSign,
  Boxes,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface BulkCatalogOperationsViewProps {
  products: Product[];
  onUpdateProduct: (product: Product) => void;
}

export const BulkCatalogOperationsView: React.FC<BulkCatalogOperationsViewProps> = ({
  products,
  onUpdateProduct,
}) => {
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [bulkPriceChangePct, setBulkPriceChangePct] = useState<number>(5);
  const [bulkStockAdd, setBulkStockAdd] = useState<number>(10);
  const [logs, setLogs] = useState<string[]>([]);

  const toggleSelectAll = () => {
    if (selectedProductIds.length === products.length) setSelectedProductIds([]);
    else setSelectedProductIds(products.map((p) => p.id));
  };

  const toggleSelectOne = (id: string) => {
    if (selectedProductIds.includes(id)) setSelectedProductIds(selectedProductIds.filter((x) => x !== id));
    else setSelectedProductIds([...selectedProductIds, id]);
  };

  const handleBulkPriceUpdate = () => {
    let count = 0;
    products.forEach((p) => {
      if (selectedProductIds.includes(p.id)) {
        const newPrice = Math.round(p.price.amount * (1 + bulkPriceChangePct / 100) * 100) / 100;
        onUpdateProduct({ ...p, price: { ...p.price, amount: newPrice } });
        count++;
      }
    });
    setLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] Bulk Price Updated ${count} products by ${bulkPriceChangePct}%`,
      ...prev,
    ]);
  };

  const handleBulkStockUpdate = () => {
    let count = 0;
    products.forEach((p) => {
      if (selectedProductIds.includes(p.id)) {
        const newStock = p.totalStock + bulkStockAdd;
        onUpdateProduct({ ...p, totalStock: newStock });
        count++;
      }
    });
    setLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] Bulk Stock added ${bulkStockAdd} units to ${count} products`,
      ...prev,
    ]);
  };

  const handleExportCSV = () => {
    const headers = ['ID,Title,SKU,Category,Price,TotalStock,ApprovalStatus\n'];
    const rows = products.map(
      (p) => `${p.id},"${p.title.replace(/"/g, '""')}",${p.sku},${p.category},${p.price.amount},${p.totalStock},${p.approvalStatus || 'APPROVED'}\n`
    );
    const blob = new Blob([...headers, ...rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Amazon_Catalog_Bulk_Export_${Date.now()}.csv`;
    a.click();
    setLogs((prev) => [`[${new Date().toLocaleTimeString()}] Exported CSV for ${products.length} catalog items.`, ...prev]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-black text-white flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-[#febd69]" />
            <span>Bulk Catalog Operations & CSV Import / Export Hub</span>
          </h2>
          <p className="text-xs text-slate-400">
            Batch edit thousands of SKUs: Price adjustments, inventory stock feeds, CSV templates & schema validation
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold rounded-xl text-xs flex items-center space-x-1.5 transition border border-slate-700 shadow"
        >
          <DownloadCloud className="w-4 h-4" />
          <span>Export Catalog CSV</span>
        </button>
      </div>

      {/* Bulk Action Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bulk Price Update Box */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3 shadow-lg">
          <div className="font-bold text-white text-xs flex items-center space-x-1.5">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Bulk Price % Adjustment</span>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={bulkPriceChangePct}
              onChange={(e) => setBulkPriceChangePct(parseFloat(e.target.value) || 0)}
              className="w-28 bg-slate-950 text-white p-2 rounded-xl border border-slate-800 text-xs font-mono"
            />
            <span className="text-xs text-slate-400">% change</span>
            <button
              onClick={handleBulkPriceUpdate}
              disabled={selectedProductIds.length === 0}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition ml-auto"
            >
              Apply to Selected ({selectedProductIds.length})
            </button>
          </div>
        </div>

        {/* Bulk Stock Add Box */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3 shadow-lg">
          <div className="font-bold text-white text-xs flex items-center space-x-1.5">
            <Boxes className="w-4 h-4 text-amber-400" />
            <span>Bulk Inventory Add Units</span>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={bulkStockAdd}
              onChange={(e) => setBulkStockAdd(parseInt(e.target.value) || 0)}
              className="w-28 bg-slate-950 text-white p-2 rounded-xl border border-slate-800 text-xs font-mono"
            />
            <span className="text-xs text-slate-400">units</span>
            <button
              onClick={handleBulkStockUpdate}
              disabled={selectedProductIds.length === 0}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black rounded-xl text-xs transition ml-auto"
            >
              Apply to Selected ({selectedProductIds.length})
            </button>
          </div>
        </div>
      </div>

      {/* Catalog Items Selection Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedProductIds.length === products.length && products.length > 0}
                    onChange={toggleSelectAll}
                    className="accent-amber-500 rounded"
                  />
                </th>
                <th className="p-4">Product / SKU</th>
                <th className="p-4">Category</th>
                <th className="p-4">Unit Price</th>
                <th className="p-4">Current Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedProductIds.includes(p.id)}
                      onChange={() => toggleSelectOne(p.id)}
                      className="accent-amber-500 rounded"
                    />
                  </td>
                  <td className="p-4 font-bold text-white">
                    {p.title} <span className="text-[10px] text-slate-500 font-mono block">SKU: {p.sku}</span>
                  </td>
                  <td className="p-4 text-slate-400 uppercase">{p.category}</td>
                  <td className="p-4 font-mono font-bold text-emerald-400">${p.price.amount.toFixed(2)}</td>
                  <td className="p-4 font-mono text-amber-300">{p.totalStock} units</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Log Box */}
      {logs.length > 0 && (
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1 font-mono text-[11px] text-emerald-400">
          <div className="font-bold text-white">Bulk Activity Execution Log:</div>
          {logs.map((l, i) => (
            <div key={i}>{l}</div>
          ))}
        </div>
      )}
    </div>
  );
};
