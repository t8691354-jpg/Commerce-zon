import React from 'react';
import { ComprehensiveMasterOrder } from '../../types/oms';
import { Split, Building2, Package, Truck, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface MultiVendorOrderSplittingViewProps {
  orders: ComprehensiveMasterOrder[];
}

export const MultiVendorOrderSplittingView: React.FC<MultiVendorOrderSplittingViewProps> = ({ orders }) => {
  // Find multi-vendor orders or prepare multi-vendor preview simulation
  const multiVendorOrders = orders.filter((o) => o.subOrders && o.subOrders.length > 0);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-2">
        <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
          <Split className="w-4 h-4 text-purple-400" />
          <span>MULTI-VENDOR ORDER SPLITTING ENGINE</span>
        </div>
        <h2 className="text-xl font-black text-white">
          Unified Customer Checkout → Multi-Seller Sub-Order Splitting
        </h2>
        <p className="text-xs text-slate-400">
          When a buyer purchases items from multiple distinct sellers in a single transaction, the Amazon OMS engine automatically splits the master order into separate seller sub-orders with isolated fulfillment tasks, warehouses, and carrier tracking labels.
        </p>
      </div>

      {/* Demonstration Card */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-mono text-purple-400 uppercase font-bold">Master Customer Checkout Order</span>
            <h3 className="text-base font-black text-white font-mono">ORD-2026-MULTI-88190</h3>
            <p className="text-xs text-slate-400">Customer: AeroSpace Global Procurement ($21,113.97 total)</p>
          </div>

          <div className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-bold">
            Split into 2 Seller Sub-Orders
          </div>
        </div>

        {/* Visual Splitting Graph */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          {/* Sub-Order 1 (CyberTech) */}
          <div className="bg-slate-950 border border-indigo-500/30 p-5 rounded-2xl space-y-3 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-white">Seller 1: CyberTech Enterprise</span>
              </div>
              <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-[10px] font-bold rounded">
                Sub-Order #SUB-88190-A
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <span>2x Titan Workstation X9 Laptops</span>
                <span className="font-mono font-bold text-white">$5,799.98</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Allocated Warehouse:</span>
                <span className="font-bold text-slate-200">WH-US-WEST (Fremont, CA)</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Sub-Order Carrier:</span>
                <span className="font-bold text-indigo-300 font-mono">Amazon Express (TRK-AMZ-992014)</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Sub-Order Status:</span>
                <span className="font-bold text-emerald-400 uppercase">IN TRANSIT</span>
              </div>
            </div>
          </div>

          {/* Sub-Order 2 (Apex Robotics) */}
          <div className="bg-slate-950 border border-amber-500/30 p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white">Seller 2: Apex Robotics</span>
              </div>
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-bold rounded">
                Sub-Order #SUB-88190-B
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <span>1x Autonomous Cobot Heavy Arm</span>
                <span className="font-mono font-bold text-white">$14,500.00</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Allocated Warehouse:</span>
                <span className="font-bold text-slate-200">WH-US-EAST (Newark, NJ)</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Sub-Order Carrier:</span>
                <span className="font-bold text-amber-300 font-mono">Prime Air Freight (TRK-AMZ-881023)</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Sub-Order Status:</span>
                <span className="font-bold text-emerald-400 uppercase">DELIVERED</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-xs text-slate-400 space-y-1">
          <div className="font-bold text-slate-200 flex items-center space-x-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Master Order Settlement Consistency</span>
          </div>
          <p>
            The buyer sees a unified order receipt and tracking timeline, while the marketplace backend manages isolated financial commission settlements, seller payouts, and individual return windows per seller sub-order.
          </p>
        </div>
      </div>
    </div>
  );
};
