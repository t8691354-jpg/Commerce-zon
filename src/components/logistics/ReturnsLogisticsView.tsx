import React from 'react';
import { RotateCcw, Truck, Warehouse, CheckCircle2, PackageCheck, AlertTriangle } from 'lucide-react';

export const ReturnsLogisticsView: React.FC = () => {
  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <RotateCcw className="w-4 h-4 text-[#febd69]" />
            <span>REVERSE LOGISTICS & CUSTOMER RETURN PICKUP (RMA)</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Customer Return Pickups, Lockers & Warehouse Inspection Processing</h2>
          <p className="text-xs text-slate-400 mt-1">
            Reverse transit courier dispatch, return parcel barcode tracking & restocking inspection grading
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg font-bold">
            RMA Gateway Active
          </span>
        </div>
      </div>

      {/* Reverse Shipments Stream */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 font-mono text-xs">
        <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3">
          Active Reverse Logistics Return Shipments (3 Items)
        </h3>

        <div className="space-y-3">
          {[
            { rmaId: 'RMA-9001', customer: 'David Miller', item: 'UltraNoise Pro Headphones', status: 'PICKUP_SCHEDULED', tracking: 'TRK-RET-881', warehouse: 'EWR4' },
            { rmaId: 'RMA-9002', customer: 'Jessica Alba', item: 'Biometric Titanium Ring', status: 'IN_TRANSIT_TO_WAREHOUSE', tracking: 'TRK-RET-882', warehouse: 'ONT8' },
            { rmaId: 'RMA-9003', customer: 'Robert Vance', item: 'Ergonomic 4K Monitor', status: 'INSPECTED_RESTOCKED', tracking: 'TRK-RET-883', warehouse: 'BFI4' },
          ].map((r) => (
            <div key={r.rmaId} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <strong className="text-white font-bold">{r.rmaId}</strong>
                  <span className="text-[#febd69] text-[10px]">{r.tracking}</span>
                  <span className="text-slate-400 text-[10px]">→ Destination: {r.warehouse} Hub</span>
                </div>
                <p className="text-slate-300 text-[11px] font-sans">
                  Item: <strong className="text-white">{r.item}</strong> • Returnee: {r.customer}
                </p>
              </div>

              <span
                className={`px-2.5 py-1 rounded text-[9px] font-black uppercase ${
                  r.status === 'INSPECTED_RESTOCKED'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                }`}
              >
                {r.status.replace(/_/g, ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
