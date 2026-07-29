import React, { useState } from 'react';
import { FBAInventoryItem, RotationStrategy, ConditionGrade } from '../../types/fba';
import {
  Boxes,
  Search,
  SlidersHorizontal,
  Layers,
  Calendar,
  Tag,
  ShieldCheck,
  AlertTriangle,
  QrCode,
  Maximize2,
} from 'lucide-react';

interface InventoryStorageBinsViewProps {
  inventory: FBAInventoryItem[];
}

export const InventoryStorageBinsView: React.FC<InventoryStorageBinsViewProps> = ({ inventory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('ALL');
  const [selectedStrategy, setSelectedStrategy] = useState<string>('ALL');

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.productTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fnsku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.bin.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesWarehouse = selectedWarehouse === 'ALL' || item.warehouseCode === selectedWarehouse;
    const matchesStrategy = selectedStrategy === 'ALL' || item.rotationStrategy === selectedStrategy;

    return matchesSearch && matchesWarehouse && matchesStrategy;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <Boxes className="w-4 h-4 text-[#febd69]" />
            <span>FBA HIGH-DENSITY BIN & RACK INVENTORY ENGINE</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Granular Shelf, Rack, Bin & Batch Tracking</h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry on stored physical units with serial number validation, condition grading & FIFO / LIFO / FEFO rotation strategy dispatch
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300">
            Strategy: <strong className="text-emerald-400">FIFO / FEFO Enforced</strong>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search FNSKU, SKU, Bin, Title..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 font-mono focus:outline-none focus:border-[#febd69]"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto font-mono">
          <select
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none"
          >
            <option value="ALL">All Warehouses</option>
            <option value="EWR4">EWR4 (Newark)</option>
            <option value="ONT8">ONT8 (Inland Empire)</option>
            <option value="BFI4">BFI4 (Seattle)</option>
          </select>

          <select
            value={selectedStrategy}
            onChange={(e) => setSelectedStrategy(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none"
          >
            <option value="ALL">All Rotation Strategies</option>
            <option value="FIFO">FIFO (First In First Out)</option>
            <option value="LIFO">LIFO (Last In First Out)</option>
            <option value="FEFO">FEFO (First Expired First Out)</option>
          </select>
        </div>
      </div>

      {/* Inventory Bins Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3">
          Active Stock Items & Physical Storage Coordinates ({filteredInventory.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                <th className="py-3 px-3">FNSKU / Product</th>
                <th className="py-3 px-3">Location (Shelf - Rack - Bin)</th>
                <th className="py-3 px-3">Available / Reserved</th>
                <th className="py-3 px-3">Batch & Serial</th>
                <th className="py-3 px-3">Rotation Strategy</th>
                <th className="py-3 px-3">Daily Storage Fee</th>
                <th className="py-3 px-3 text-right">Condition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-3.5 px-3">
                    <span className="font-extrabold text-[#febd69] text-xs block">{item.fnsku}</span>
                    <span className="text-white font-bold text-[11px] block">{item.productTitle}</span>
                    <span className="text-slate-500 text-[9px] block">Seller: {item.sellerName} • SKU: {item.sku}</span>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800 inline-block">
                      <span className="text-emerald-400 font-black text-xs">{item.warehouseCode}</span>
                      <span className="text-slate-300 font-bold block text-[10px]">
                        {item.shelf} - {item.rack} - <strong className="text-white">{item.bin}</strong>
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="space-y-0.5">
                      <span className="text-emerald-400 font-extrabold text-sm block">
                        {item.quantityAvailable.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">Available</span>
                      </span>
                      <span className="text-slate-400 text-[9px] block">
                        {item.quantityReserved} Reserved | +{item.quantityInbound} Inbound
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-3 text-[10px]">
                    <span className="text-slate-300 font-bold block">{item.batchNumber}</span>
                    {item.serialNumber && <span className="text-sky-400 block">{item.serialNumber}</span>}
                    {item.expiryDate && <span className="text-amber-400 block">Exp: {item.expiryDate}</span>}
                  </td>

                  <td className="py-3.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                        item.rotationStrategy === 'FEFO'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                      }`}
                    >
                      {item.rotationStrategy}
                    </span>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="text-emerald-400 font-bold">${item.dailyStorageFeeUSD.toFixed(2)}/day</span>
                    <span className="text-slate-500 text-[9px] block">{item.unitVolumeCubicMeters} m³ unit</span>
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-[9px] font-bold">
                      {item.condition}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
