import React, { useState } from 'react';
import { SupplierProduct } from '../../types/dropshipping';
import {
  RefreshCw,
  Zap,
  Lock,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Activity,
  Sliders,
} from 'lucide-react';

interface InventorySyncEngineProps {
  products: SupplierProduct[];
  onForceSync: () => void;
}

export const InventorySyncEngine: React.FC<InventorySyncEngineProps> = ({
  products,
  onForceSync,
}) => {
  const [syncIntervalMinutes, setSyncIntervalMinutes] = useState(5);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncLogs, setSyncLogs] = useState([
    {
      id: 'SYNC-101',
      sku: 'APX-ANC-HP900',
      action: 'STOCK_LOCK_RESERVED',
      oldVal: '1450 units',
      newVal: '1418 units available (32 reserved)',
      timestamp: '2026-07-27 16:45:10',
      status: 'SUCCESS',
    },
    {
      id: 'SYNC-102',
      sku: 'TC-KB-MECH87',
      action: 'PRICE_UPDATE_DISPATCHED',
      oldVal: '$36.00 USD',
      newVal: '$34.00 USD (Wholesale Promo)',
      timestamp: '2026-07-27 17:00:02',
      status: 'SUCCESS',
    },
    {
      id: 'SYNC-103',
      sku: 'TC-CAM-4K88',
      action: 'STOCK_OUT_TRIGGERED',
      oldVal: '12 units',
      newVal: '0 units (Storefront Auto-Paused)',
      timestamp: '2026-07-27 16:30:15',
      status: 'SUCCESS',
    },
  ]);

  const handleManualSyncNow = () => {
    setIsSyncing(true);
    setTimeout(() => {
      onForceSync();
      setIsSyncing(false);

      const newLog = {
        id: `SYNC-${Date.now()}`,
        sku: 'ALL_GLOBAL_SKUS',
        action: 'MANUAL_FORCE_SYNC_EXECUTED',
        oldVal: 'Multi-Warehouse Queue',
        newVal: `${products.length} SKUs Synced`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        status: 'SUCCESS',
      };

      setSyncLogs((prev) => [newLog, ...prev]);
      alert('Global Inventory & Price Sync Executed Across All Supplier Warehouses!');
    }, 1200);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>REAL-TIME INVENTORY & PRICE SYNCHRONISATION ENGINE</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Multi-Warehouse Inventory Lock & Oversell Shield</h2>
          <p className="text-xs text-slate-400 mt-1">
            Millisecond WebSocket sync locking supplier warehouse physical stock with active seller store listings to prevent overselling
          </p>
        </div>

        <button
          onClick={handleManualSyncNow}
          disabled={isSyncing}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl transition flex items-center space-x-2 shadow-lg"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Syncing Network...' : 'Force Global Sync Now'}</span>
        </button>
      </div>

      {/* Sync Configuration & Active Locks Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
        {/* Sync Settings Box */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 lg:col-span-1">
          <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Sliders className="w-4 h-4 text-[#febd69]" />
            <span>Sync Rules & Frequency</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">
                Automated Sync Frequency
              </label>
              <select
                value={syncIntervalMinutes}
                onChange={(e) => setSyncIntervalMinutes(parseInt(e.target.value, 10))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-bold focus:outline-none"
              >
                <option value={1}>Every 1 Minute (Real-time WebSockets)</option>
                <option value={5}>Every 5 Minutes (Default High-Volume)</option>
                <option value={15}>Every 15 Minutes</option>
                <option value={60}>Hourly Cron Batch</option>
              </select>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="font-bold text-white text-xs block">Oversell Prevention Protocol</span>
              <p className="text-[11px] text-slate-400">
                When a buyer initiates checkout on any seller storefront, physical warehouse stock is immediately placed into a <strong className="text-amber-300">15-minute Reservation Lock</strong> before buyer payment completion.
              </p>
            </div>
          </div>
        </div>

        {/* Live Inventory Status Grid */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 lg:col-span-2">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-2">
              <Activity className="w-4 h-4 text-sky-400" />
              <span>Supplier Warehouse Inventory Lock Stream</span>
            </h3>

            <span className="text-[10px] text-emerald-400 font-mono">100% Stock Sync Accuracy</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3">Product SKU</th>
                  <th className="p-3">Total Physical</th>
                  <th className="p-3">Reserved Lock</th>
                  <th className="p-3">Available Stock</th>
                  <th className="p-3">Last Sync</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300 font-mono text-[11px]">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-950/60">
                    <td className="p-3 font-bold text-white">
                      {p.sku}
                      <span className="block text-[10px] text-slate-500 font-sans">{p.title}</span>
                    </td>
                    <td className="p-3 text-slate-300">{p.currentStock}</td>
                    <td className="p-3 text-amber-300 font-bold">{p.reservedStock}</td>
                    <td className="p-3 text-emerald-400 font-bold">{p.availableStock}</td>
                    <td className="p-3 text-slate-400 text-[10px]">{p.lastStockSyncAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Sync Execution Stream Audit Logs */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 text-xs">
        <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-2">
          <Clock className="w-4 h-4 text-[#febd69]" />
          <span>Sync Event Execution Logs ({syncLogs.length})</span>
        </h3>

        <div className="space-y-2 font-mono text-[11px]">
          {syncLogs.map((log) => (
            <div key={log.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <div>
                  <span className="font-bold text-white">{log.sku}</span>
                  <span className="text-slate-400 ml-2">• {log.action}</span>
                  <div className="text-[10px] text-slate-500">{log.oldVal} ➔ <span className="text-emerald-300">{log.newVal}</span></div>
                </div>
              </div>

              <span className="text-[10px] text-slate-500">{log.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
