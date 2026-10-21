import React, { useState } from 'react';
import { Product, Warehouse } from '../types/domain';
import { AllocationPlan } from '../lib/stockAllocator';
import { Truck, MapPin, Layers, ArrowRight, ShieldAlert, CheckCircle2, RefreshCw, Cpu } from 'lucide-react';

interface StockAllocationSimulatorProps {
  products: Product[];
  warehouses: Warehouse[];
}

const REGION_PRESETS = [
  { name: 'San Francisco, CA (West Coast)', lat: 37.7749, lng: -122.4194 },
  { name: 'New York, NY (East Coast)', lat: 40.7128, lng: -74.006 },
  { name: 'Austin, TX (South Central)', lat: 30.2672, lng: -97.7431 },
  { name: 'Frankfurt, Germany (Europe)', lat: 50.1109, lng: 8.6821 },
  { name: 'Tokyo, Japan (Asia Pacific)', lat: 35.6762, lng: 139.6503 },
];

export const StockAllocationSimulator: React.FC<StockAllocationSimulatorProps> = ({ products, warehouses }) => {
  const [selectedRegion, setSelectedRegion] = useState(REGION_PRESETS[0]);
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [quantity, setQuantity] = useState<number>(15);
  const [loading, setLoading] = useState<boolean>(false);
  const [allocationPlan, setAllocationPlan] = useState<AllocationPlan | null>(null);

  const handleRunAllocation = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/inventory/allocate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{ productId: selectedProductId, quantity }],
          customerLocation: {
            latitude: selectedRegion.lat,
            longitude: selectedRegion.lng,
            regionName: selectedRegion.name,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAllocationPlan(data.plan);
      }
    } catch (err) {
      console.error('Failed to run stock allocation simulator:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <span>Multi-Warehouse Stock Allocation Simulator</span>
              <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-mono">
                Task 1.2.1
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Optimal route calculation, split-shipment engine, and haversine distance-based hub assignment
            </p>
          </div>
        </div>

        <button
          onClick={handleRunAllocation}
          disabled={loading || !selectedProductId}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center space-x-2 transition shadow-lg shadow-emerald-900/30"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Cpu className="w-4 h-4" />}
          <span>Execute Route Allocation</span>
        </button>
      </div>

      {/* Simulator Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Select Delivery Destination</label>
          <select
            value={selectedRegion.name}
            onChange={(e) => {
              const preset = REGION_PRESETS.find((r) => r.name === e.target.value);
              if (preset) setSelectedRegion(preset);
            }}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
          >
            {REGION_PRESETS.map((r) => (
              <option key={r.name} value={r.name}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Select Product SKU</label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                [{p.sku}] {p.title} (Total Stock: {p.totalStock}u)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Order Quantity Needed</label>
          <input
            type="number"
            min={1}
            max={500}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Allocation Plan Result Display */}
      {allocationPlan && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-bold text-white">Allocation Plan #{(allocationPlan as any).allocationId || (allocationPlan as any).id || '101'}</span>
              {(allocationPlan as any).isSplitShipment ? (
                <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-mono font-semibold">
                  Split Shipment Required
                </span>
              ) : (
                <span className="text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded font-mono font-semibold">
                  Single Hub Direct Route
                </span>
              )}
            </div>

            <div className="text-xs font-mono text-slate-400">
              Est. Delivery: <strong className="text-emerald-400">{(allocationPlan as any).totalEstimatedDeliveryDays || (allocationPlan as any).estDays || 2} Business Day(s)</strong>
            </div>
          </div>

          <div className="space-y-3">
            {((allocationPlan as any).itemPlans || (allocationPlan as any).allocations || []).map((itemPlan: any, idx: number) => (
              <div key={itemPlan.productId || idx} className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white text-sm">{itemPlan.productTitle}</span>
                  <span className="text-slate-400 font-mono">
                    Requested: <strong className="text-white">{itemPlan.requestedQuantity} units</strong>
                  </span>
                </div>

                <div className="space-y-2">
                  {itemPlan.allocations.map((alloc) => (
                    <div
                      key={alloc.warehouseId}
                      className="bg-slate-950 border border-slate-800/80 rounded-lg p-3 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="font-mono font-bold text-blue-400 bg-blue-950 px-2 py-1 rounded border border-blue-900">
                          {alloc.warehouseCode}
                        </span>
                        <div>
                          <div className="font-bold text-slate-200">{alloc.warehouseName}</div>
                          <div className="text-[11px] text-slate-500">
                            Distance: {alloc.distanceKm.toLocaleString()} km from destination
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 font-mono text-xs">
                        <span className="text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-900">
                          +{alloc.allocatedQuantity} Units Reserved
                        </span>
                        <span className="text-slate-400">{alloc.estimatedDeliveryDays} Day SLA</span>
                      </div>
                    </div>
                  ))}
                </div>

                {itemPlan.unfulfilledQuantity > 0 && (
                  <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-lg text-xs text-red-300 flex items-center space-x-2">
                    <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
                    <span>
                      Stock Deficit: {itemPlan.unfulfilledQuantity} units could not be allocated across all active warehouses.
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
