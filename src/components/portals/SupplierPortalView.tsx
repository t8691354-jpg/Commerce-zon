import React, { useState } from 'react';
import {
  PackageCheck,
  Warehouse,
  Truck,
  DollarSign,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  FileText,
  Boxes,
  ArrowUpRight,
} from 'lucide-react';

export const SupplierPortalView: React.FC = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([
    { id: 'PO-8810', buyer: 'Amazon FBA EU-Central-1', items: '2,000x Quantum Noise-Canceling Headphones', total: '$84,000.00', status: 'DISPATCHED' },
    { id: 'PO-8811', buyer: 'TechZone Merchant LLC', items: '500x Industrial Robotic Arm V4', total: '$145,000.00', status: 'IN_PRODUCTION' },
    { id: 'PO-8812', buyer: 'Global Logistics Hub', items: '1,200x Smart Wearable Fitness Trackers', total: '$36,000.00', status: 'PENDING_APPROVAL' },
  ]);

  return (
    <div className="p-6 bg-slate-950 text-slate-100 min-h-screen space-y-6">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-2xl">
            <PackageCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-100 tracking-tight">Supplier & B2B Procurement Hub</h1>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Wholesale inventory dispatch • Bulk PO processing & direct FBA cross-docking
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="px-5 py-2.5 bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold rounded-xl text-xs transition flex items-center space-x-2 shadow-lg shadow-blue-500/10">
            <Plus className="w-4 h-4" />
            <span>New Wholesale Listing</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-2">
          <span className="text-[10px] text-slate-400 font-mono uppercase">Active Wholesale POs</span>
          <div className="text-2xl font-black text-blue-400">$265,000.00</div>
          <div className="text-[10px] text-blue-400 font-mono">3 Bulk POs in queue</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-2">
          <span className="text-[10px] text-slate-400 font-mono uppercase">Bulk Inventory Stock</span>
          <div className="text-2xl font-black text-slate-100">48,200 Units</div>
          <div className="text-[10px] text-slate-400 font-mono">4 regional supplier plants</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-2">
          <span className="text-[10px] text-slate-400 font-mono uppercase">FBA Inbound Shipments</span>
          <div className="text-2xl font-black text-amber-400">12 Shipments</div>
          <div className="text-[10px] text-slate-400 font-mono">Auto-synced with Amazon OMS</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-2">
          <span className="text-[10px] text-slate-400 font-mono uppercase">Supplier Rating</span>
          <div className="text-2xl font-black text-emerald-400">4.98 / 5.0</div>
          <div className="text-[10px] text-emerald-400 font-mono">Tier 1 Verified Supplier</div>
        </div>
      </div>

      {/* PO Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden font-mono">
        <div className="p-4 bg-slate-950 border-b border-slate-800 font-bold text-slate-200 text-xs flex justify-between items-center">
          <span>Active B2B Purchase Orders (POs)</span>
          <span className="text-[10px] text-blue-400">B2B AUTO-SYNC ACTIVE</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/50 text-slate-400 font-bold border-b border-slate-800">
              <tr>
                <th className="p-4">PO Number</th>
                <th className="p-4">Buyer Entity</th>
                <th className="p-4">Items & SKU Quantities</th>
                <th className="p-4">PO Amount</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {purchaseOrders.map((po) => (
                <tr key={po.id} className="hover:bg-slate-800/40">
                  <td className="p-4 font-bold text-amber-400">{po.id}</td>
                  <td className="p-4 font-bold text-slate-100">{po.buyer}</td>
                  <td className="p-4 text-slate-300">{po.items}</td>
                  <td className="p-4 text-emerald-400 font-bold">{po.total}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded font-bold text-[10px]">
                      {po.status}
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
