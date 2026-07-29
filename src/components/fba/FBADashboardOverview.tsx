import React from 'react';
import { FBAWarehouse, FBAInventoryItem, FBACustomerOrder } from '../../types/fba';
import {
  Warehouse,
  Boxes,
  Truck,
  TrendingUp,
  DollarSign,
  PackageCheck,
  RotateCcw,
  Clock,
  ShieldCheck,
  BarChart2,
  Users,
} from 'lucide-react';

interface FBADashboardOverviewProps {
  warehouses: FBAWarehouse[];
  inventory: FBAInventoryItem[];
  orders: FBACustomerOrder[];
}

export const FBADashboardOverview: React.FC<FBADashboardOverviewProps> = ({
  warehouses,
  inventory,
  orders,
}) => {
  const totalWarehouses = warehouses.length;
  const activeWarehouses = warehouses.filter((w) => w.status === 'ACTIVE').length;

  const totalInventory = inventory.reduce((acc, i) => acc + i.quantityOnHand, 0);
  const reservedInventory = inventory.reduce((acc, i) => acc + i.quantityReserved, 0);
  const availableInventory = inventory.reduce((acc, i) => acc + i.quantityAvailable, 0);
  const inboundInventory = inventory.reduce((acc, i) => acc + i.quantityInbound, 0);

  const pendingOrders = orders.filter((o) => o.status === 'ORDER_RECEIVED' || o.status === 'INVENTORY_RESERVED').length;
  const pickingOrders = orders.filter((o) => o.status === 'PICKING_ACTIVE').length;
  const packingOrders = orders.filter((o) => o.status === 'PACKING_ACTIVE').length;
  const shippedOrders = orders.filter((o) => o.status === 'CARRIER_PICKUP' || o.status === 'IN_TRANSIT' || o.status === 'OUT_FOR_DELIVERY').length;
  const deliveredOrders = orders.filter((o) => o.status === 'DELIVERED').length;

  const storageRevenue = 8450.0;
  const shippingRevenue = 12400.0;

  return (
    <div className="space-y-6 font-sans">
      {/* Hero Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <Warehouse className="w-4 h-4 text-[#febd69]" />
            <span>AMAZON-GRADE FBA (FULFILMENT BY MARKETPLACE) COMMAND CENTER</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Multi-Warehouse Robotics, Inventory & Order Fulfilment Engine</h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry across {totalWarehouses} global fulfillment centers managing {totalInventory.toLocaleString()} physical items with automated picking, packing & carrier dispatch
          </p>
        </div>

        <div className="flex items-center space-x-3 font-mono text-xs">
          <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-center">
            <span className="text-slate-400 text-[10px] uppercase block">Global Capacity Utilisation</span>
            <span className="text-emerald-400 font-extrabold text-sm">75.3%</span>
          </div>
          <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-center">
            <span className="text-slate-400 text-[10px] uppercase block">Picking Accuracy SLA</span>
            <span className="text-sky-400 font-extrabold text-sm">99.85%</span>
          </div>
        </div>
      </div>

      {/* Primary Telemetry Metrics Row 1 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 font-mono text-xs">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg space-y-1">
          <span className="text-slate-500 text-[10px] uppercase block flex items-center space-x-1">
            <Warehouse className="w-3.5 h-3.5 text-sky-400" />
            <span>Warehouses</span>
          </span>
          <span className="text-lg font-black text-white">{activeWarehouses} / {totalWarehouses}</span>
          <span className="text-[9px] text-emerald-400 block">100% Operational</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg space-y-1">
          <span className="text-slate-500 text-[10px] uppercase block flex items-center space-x-1">
            <Boxes className="w-3.5 h-3.5 text-[#febd69]" />
            <span>Available Stock</span>
          </span>
          <span className="text-lg font-black text-emerald-400">{availableInventory.toLocaleString()}</span>
          <span className="text-[9px] text-slate-400 block">{reservedInventory} Reserved</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg space-y-1">
          <span className="text-slate-500 text-[10px] uppercase block flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Inbound Dock</span>
          </span>
          <span className="text-lg font-black text-amber-300">+{inboundInventory.toLocaleString()}</span>
          <span className="text-[9px] text-slate-400 block">Receiving Active</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg space-y-1">
          <span className="text-slate-500 text-[10px] uppercase block flex items-center space-x-1">
            <PackageCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Picking / Packing</span>
          </span>
          <span className="text-lg font-black text-white">{pickingOrders + packingOrders}</span>
          <span className="text-[9px] text-sky-400 block">Robotics Picking Active</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg space-y-1">
          <span className="text-slate-500 text-[10px] uppercase block flex items-center space-x-1">
            <Truck className="w-3.5 h-3.5 text-sky-400" />
            <span>Shipped Today</span>
          </span>
          <span className="text-lg font-black text-sky-300">{shippedOrders}</span>
          <span className="text-[9px] text-emerald-400 block">Carrier Dispatch SLA</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg space-y-1">
          <span className="text-slate-500 text-[10px] uppercase block flex items-center space-x-1">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>FBA Revenue</span>
          </span>
          <span className="text-lg font-black text-emerald-400">${(storageRevenue + shippingRevenue).toLocaleString()}</span>
          <span className="text-[9px] text-slate-400 block">Storage & Fulfilment</span>
        </div>
      </div>

      {/* Interactive Visual Warehouse Occupancy & Performance Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
        {/* Warehouse Status Overview */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 lg:col-span-2">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-2">
              <Warehouse className="w-4 h-4 text-[#febd69]" />
              <span>Active Fulfilment Centers Telemetry</span>
            </h3>

            <span className="text-[10px] text-emerald-400 font-mono">Live WebSocket Sync</span>
          </div>

          <div className="space-y-4">
            {warehouses.map((wh) => (
              <div key={wh.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex justify-between items-start font-mono">
                  <div>
                    <span className="font-extrabold text-white text-sm">{wh.name}</span>
                    <span className="text-slate-500 block text-[10px]">{wh.address.city}, {wh.address.state} • Temp: {wh.temperatureZone}</span>
                  </div>

                  <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold rounded-lg">
                    {wh.status}
                  </span>
                </div>

                {/* Capacity Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-slate-400">Capacity Utilisation</span>
                    <strong className="text-emerald-400">{wh.utilizationPct}% ({wh.usedCapacityCubicMeters.toLocaleString()} / {wh.totalCapacityCubicMeters.toLocaleString()} m³)</strong>
                  </div>
                  <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full transition-all duration-500 ${
                        wh.utilizationPct > 85 ? 'bg-amber-400' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${wh.utilizationPct}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 font-mono text-[10px] text-slate-400 pt-1">
                  <div>Racks: <strong className="text-white">{wh.activeRacksCount}</strong></div>
                  <div>Bins: <strong className="text-white">{wh.activeBinsCount}</strong></div>
                  <div>Staff On Shift: <strong className="text-sky-400">{wh.staffCount} Staff</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-Time Order Fulfilment Queue */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-2 border-b border-slate-800 pb-3">
            <BarChart2 className="w-4 h-4 text-sky-400" />
            <span>FBA Fulfilment Pipeline Stream</span>
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">Pending Orders</span>
                <span className="text-white font-bold">{pendingOrders} Orders</span>
              </div>
              <span className="text-[#febd69] font-black text-xs">Inventory Reserved</span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">Active Picking Wave</span>
                <span className="text-white font-bold">{pickingOrders} Orders</span>
              </div>
              <span className="text-sky-400 font-black text-xs">Robotics Guided</span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">Packing & Weight Audit</span>
                <span className="text-white font-bold">{packingOrders} Orders</span>
              </div>
              <span className="text-amber-400 font-black text-xs">Barcode Verified</span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">Shipped & In Transit</span>
                <span className="text-emerald-400 font-bold">{shippedOrders} Orders</span>
              </div>
              <span className="text-emerald-400 font-black text-xs">AMZL Prime Carrier</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
