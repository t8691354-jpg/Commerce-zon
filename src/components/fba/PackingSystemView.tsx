import React, { useState } from 'react';
import { FBAPackingTask, BoxType } from '../../types/fba';
import {
  Boxes,
  Scale,
  Printer,
  FileText,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Package,
} from 'lucide-react';

interface PackingSystemViewProps {
  packingTasks: FBAPackingTask[];
  onCompletePackTask: (packId: string) => void;
}

export const PackingSystemView: React.FC<PackingSystemViewProps> = ({
  packingTasks,
  onCompletePackTask,
}) => {
  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <Boxes className="w-4 h-4 text-emerald-400" />
            <span>FBA PACKING VERIFICATION & WEIGHT SCALE AUDIT</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Box Selection, Digital Weight Scale Audit & Label Printing</h2>
          <p className="text-xs text-slate-400 mt-1">
            Optical scale verification compares expected vs physical parcel weight to eliminate incorrect item shipments before carrier dispatch
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-xl text-xs text-emerald-400 font-bold font-mono">
          <Scale className="w-4 h-4" />
          <span>Precision Digital Scale Active</span>
        </div>
      </div>

      {/* Packing Tasks Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {packingTasks.map((p) => (
          <div key={p.packId} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 font-mono">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-black text-[#febd69]">{p.packId}</span>
                <span className="text-slate-400 text-[10px] block">Order Ref: <strong className="text-white">{p.orderId}</strong></span>
              </div>

              <span
                className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${
                  p.status === 'DISPATCH_READY'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                {p.status.replace('_', ' ')}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[9px] uppercase block">Selected Box Size</span>
                <strong className="text-white text-xs">{p.selectedBox}</strong>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[9px] uppercase block">Digital Weight Audit</span>
                <span className="text-emerald-400 font-bold text-xs">
                  {p.actualWeightKg} kg <span className="text-slate-500 text-[9px]">(Exp: {p.expectedWeightKg} kg)</span>
                </span>
              </div>
            </div>

            {/* Checklist */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-[11px]">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Weight Scale Verification</span>
                <span className="text-emerald-400 font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-300">Packing Slip Printed & Enclosed</span>
                <span className="text-emerald-400 font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Generated</span>
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-300">AMZL Prime Shipping Label</span>
                <span className="text-emerald-400 font-bold flex items-center space-x-1">
                  <Printer className="w-3.5 h-3.5" />
                  <span>Printed & Affixed</span>
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center border-t border-slate-800 text-[10px]">
              <span className="text-slate-500">Packer: {p.packerName}</span>

              {p.status !== 'DISPATCH_READY' ? (
                <button
                  onClick={() => onCompletePackTask(p.packId)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl transition"
                >
                  Confirm Packed & Staged
                </button>
              ) : (
                <span className="text-emerald-400 font-bold">Staged at Dock Gate 4</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
