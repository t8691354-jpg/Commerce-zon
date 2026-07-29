import React, { useState } from 'react';
import { Warehouse, Product } from '../types/domain';
import { Warehouse as WarehouseIcon, MapPin, BarChart3, Clock, AlertTriangle, Truck, Compass, CheckCircle2, ArrowRight } from 'lucide-react';
import { StockAllocationSimulator } from './StockAllocationSimulator';

interface WarehouseInventoryViewProps {
  warehouses: Warehouse[];
  products: Product[];
}

export const WarehouseInventoryView: React.FC<WarehouseInventoryViewProps> = ({
  warehouses,
  products,
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [requestedQty, setRequestedQty] = useState<number>(50);
  const [selectedRegion, setSelectedRegion] = useState<{ name: string; lat: number; lng: number }>({
    name: 'London, UK (Europe Region)',
    lat: 51.5074,
    lng: -0.1278,
  });
  const [allocationPlan, setAllocationPlan] = useState<any>(null);
  const [isAllocating, setIsAllocating] = useState<boolean>(false);

  const regionOptions = [
    { name: 'London, UK (Europe Region)', lat: 51.5074, lng: -0.1278 },
    { name: 'San Francisco, CA (US West)', lat: 37.7749, lng: -122.4194 },
    { name: 'New York, NY (US East)', lat: 40.7128, lng: -74.006 },
    { name: 'Tokyo, Japan (Asia Pacific)', lat: 35.6762, lng: 139.6503 },
  ];

  const handleSimulateAllocation = async () => {
    setIsAllocating(true);
    try {
      const res = await fetch('/api/inventory/allocate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{ productId: selectedProductId, quantity: requestedQty }],
          customerLocation: {
            latitude: selectedRegion.lat,
            longitude: selectedRegion.lng,
            address: selectedRegion.name,
            city: selectedRegion.name.split(',')[0],
            state: 'N/A',
            country: 'Global',
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAllocationPlan(data.plan);
      }
    } catch (err) {
      console.error('Failed to run stock allocation simulation:', err);
    } finally {
      setIsAllocating(false);
    }
  };
  return (
    <div className="space-y-6">
      {/* Overview Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center space-x-4 shadow">
          <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl">
            <WarehouseIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Active Logistics Hubs</div>
            <div className="text-2xl font-black text-white font-mono">{warehouses.length} Global Hubs</div>
            <div className="text-xs text-emerald-400">US-East • US-West • EU-Central</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center space-x-4 shadow">
          <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Storage Capacity</div>
            <div className="text-2xl font-black text-white font-mono">185,000 Units</div>
            <div className="text-xs text-indigo-300">72.4% Average Capacity Utilization</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center space-x-4 shadow">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Fulfillment Service Level</div>
            <div className="text-2xl font-black text-emerald-400 font-mono">1.3 Days SLA</div>
            <div className="text-xs text-slate-400">Automated Route Optimization</div>
          </div>
        </div>
      </div>

      {/* Warehouse Hub Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {warehouses.map((wh) => {
          const utilPercentage = Math.round((wh.utilizedUnits / wh.capacityUnits) * 100);

          return (
            <div
              key={wh.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950 border border-blue-800 px-2.5 py-1 rounded">
                    {wh.code}
                  </span>
                  <span className="text-xs font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>Status: {wh.status.toUpperCase()}</span>
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white">{wh.name}</h3>

                <div className="text-xs text-slate-400 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>
                    {wh.location.address}, {wh.location.city}, {wh.location.state}, {wh.location.country}
                  </span>
                </div>

                {/* Capacity Progress Bar */}
                <div className="pt-2 space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-400 font-mono">
                    <span>Capacity Allocated</span>
                    <span className="text-white font-bold">{wh.utilizedUnits.toLocaleString()} / {wh.capacityUnits.toLocaleString()} units ({utilPercentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full transition-all duration-500 ${
                        utilPercentage > 80 ? 'bg-amber-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${utilPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  <span>Next Day Fulfillment SLA</span>
                </span>
                <span className="font-bold text-white font-mono">{wh.fulfillmentSpeedDays} Day(s)</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stock Matrix Table Across Products */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Multi-Warehouse Stock Distribution Matrix</h3>
            <p className="text-xs text-slate-400">Real-time inventory levels per product across regional fulfillment hubs</p>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-950 border border-slate-800 px-3 py-1 rounded-lg">
            Inventory Mode: Hexagonal Multi-Tenant
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 uppercase font-mono text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Product SKU</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Merchant</th>
                <th className="py-3 px-4">NY Metro (WH-US-EAST)</th>
                <th className="py-3 px-4">Silicon Valley (WH-US-WEST)</th>
                <th className="py-3 px-4">Frankfurt (WH-EU-CENTRAL)</th>
                <th className="py-3 px-4 font-bold text-right">Total Aggregate Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {products.map((p) => {
                const eastStock = p.warehouseStock.find((w) => w.code === 'WH-US-EAST')?.quantity || 0;
                const westStock = p.warehouseStock.find((w) => w.code === 'WH-US-WEST')?.quantity || 0;
                const euStock = p.warehouseStock.find((w) => w.code === 'WH-EU-CENTRAL')?.quantity || 0;

                return (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-mono text-blue-400 font-semibold">{p.sku}</td>
                    <td className="py-3.5 px-4 font-bold text-white">{p.title}</td>
                    <td className="py-3.5 px-4 text-slate-400">{p.merchant.name}</td>
                    <td className="py-3.5 px-4 font-mono">
                      <span className={eastStock < 10 ? 'text-amber-400 font-bold' : 'text-slate-200'}>
                        {eastStock} units
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <span className={westStock < 10 ? 'text-amber-400 font-bold' : 'text-slate-200'}>
                        {westStock} units
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <span className={euStock < 10 ? 'text-amber-400 font-bold' : 'text-slate-200'}>
                        {euStock} units
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-extrabold text-emerald-400 text-right">
                      {p.totalStock} units
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Stock Allocation Simulator (Task 1.2.1) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>Multi-Warehouse Stock Allocation Engine</span>
                <span className="text-[11px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-mono">
                  Task 1.2.1 Active
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Simulate Haversine-distance geo-routing and multi-hub stock split optimization for buyer orders
              </p>
            </div>
          </div>

          <button
            onClick={handleSimulateAllocation}
            disabled={isAllocating}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs flex items-center space-x-2 transition shadow-lg shadow-emerald-950/50"
          >
            <Compass className={`w-4 h-4 ${isAllocating ? 'animate-spin' : ''}`} />
            <span>Run Allocation Routing</span>
          </button>
        </div>

        {/* Input Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Target Catalog Product</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.sku}) - Stock: {p.totalStock}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Requested Quantity</label>
            <input
              type="number"
              min={1}
              max={1000}
              value={requestedQty}
              onChange={(e) => setRequestedQty(parseInt(e.target.value) || 1)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Buyer Destination Region</label>
            <select
              value={selectedRegion.name}
              onChange={(e) => {
                const reg = regionOptions.find((r) => r.name === e.target.value);
                if (reg) setSelectedRegion(reg);
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {regionOptions.map((reg) => (
                <option key={reg.name} value={reg.name}>
                  {reg.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Allocation Results Panel */}
        {allocationPlan && (
          <div className="bg-slate-950 border border-slate-800/90 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white">Calculated Routing Plan</span>
              </div>
              <div className="flex items-center space-x-3 text-xs font-mono text-slate-400">
                <span>Total Distance: <strong className="text-emerald-400">{allocationPlan.totalDistanceKm} km</strong></span>
                <span>Max SLA: <strong className="text-blue-400">{allocationPlan.estimatedDaysMax} Day(s)</strong></span>
                <span className={`px-2 py-0.5 rounded ${allocationPlan.isMultiWarehouseSplit ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-blue-950 text-blue-300 border border-blue-800'}`}>
                  {allocationPlan.isMultiWarehouseSplit ? 'Split Shipment' : 'Single Warehouse Direct'}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {allocationPlan.allocations.map((alloc: any, idx: number) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono bg-blue-950 text-blue-300 border border-blue-800 px-2.5 py-1 rounded font-bold">
                      {alloc.allocatedWarehouseCode}
                    </span>
                    <div>
                      <div className="font-bold text-white">{alloc.allocatedWarehouseName}</div>
                      <div className="text-[11px] text-slate-400">Allocated Quantity: <strong className="text-emerald-400">{alloc.requestedQuantity} units</strong></div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 font-mono text-[11px] text-slate-400">
                    <span>Distance: <strong className="text-slate-200">{alloc.fulfillmentDistanceKm} km</strong></span>
                    <span>Est Delivery: <strong className="text-slate-200">{alloc.estimatedDeliveryDays} days</strong></span>
                  </div>
                </div>
              ))}
            </div>

            {allocationPlan.warnings && allocationPlan.warnings.length > 0 && (
              <div className="p-3 bg-amber-950/40 border border-amber-800/80 rounded-lg text-xs text-amber-300 space-y-1">
                <div className="font-bold flex items-center space-x-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Allocation Warnings:</span>
                </div>
                {allocationPlan.warnings.map((w: string, i: number) => (
                  <p key={i}>• {w}</p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
