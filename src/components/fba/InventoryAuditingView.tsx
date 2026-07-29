import React, { useState } from 'react';
import { FBAAuditRecord } from '../../types/fba';
import {
  ShieldAlert,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Scale,
  Boxes,
} from 'lucide-react';

interface InventoryAuditingViewProps {
  auditLogs: FBAAuditRecord[];
  onAddAuditRecord: (newAudit: FBAAuditRecord) => void;
}

export const InventoryAuditingView: React.FC<InventoryAuditingViewProps> = ({
  auditLogs,
  onAddAuditRecord,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [whCode, setWhCode] = useState('EWR4');
  const [fnsku, setFnsku] = useState('X002891A90');
  const [expectedQty, setExpectedQty] = useState(1450);
  const [actualQty, setActualQty] = useState(1448);
  const [reason, setReason] = useState<'LOST_IN_WAREHOUSE' | 'DAMAGED_IN_HANDLING' | 'MISCOUNT' | 'SYSTEM_RECONCILED'>('DAMAGED_IN_HANDLING');

  const handleCreateAudit = (e: React.FormEvent) => {
    e.preventDefault();
    const auditId = `AUD-${Math.floor(200 + Math.random() * 800)}`;
    const variance = actualQty - expectedQty;

    const newAudit: FBAAuditRecord = {
      auditId,
      warehouseCode: whCode,
      auditorName: 'Senior Auditor Karen Chen',
      fnsku,
      expectedQty,
      actualPhysicalQty: actualQty,
      varianceQty: variance,
      varianceReason: reason,
      status: 'APPROVED_ADJUSTED',
      timestamp: new Date().toISOString().substring(0, 16).replace('T', ' '),
    };

    onAddAuditRecord(newAudit);
    setShowModal(false);
    alert(`Audit ${auditId} recorded! Stock variance (${variance}) reconciled in database.`);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>FBA PHYSICAL INVENTORY AUDIT & STOCK RECONCILIATION</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Stock Adjustments, Lost / Damaged Inventory & Variance Auditing</h2>
          <p className="text-xs text-slate-400 mt-1">
            Physical stock cycle counts compare database quantities with bin counts & automatically adjust seller balances
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-black text-xs rounded-xl transition flex items-center space-x-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Record Physical Audit Count</span>
        </button>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 font-mono text-xs">
        <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3">
          Physical Cycle Count Audit History ({auditLogs.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                <th className="py-3 px-3">Audit ID</th>
                <th className="py-3 px-3">Warehouse & Auditor</th>
                <th className="py-3 px-3">FNSKU</th>
                <th className="py-3 px-3">Expected vs Actual</th>
                <th className="py-3 px-3">Variance</th>
                <th className="py-3 px-3">Reason</th>
                <th className="py-3 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {auditLogs.map((a) => (
                <tr key={a.auditId} className="hover:bg-slate-800/30 transition">
                  <td className="py-3.5 px-3">
                    <span className="font-extrabold text-[#febd69] text-xs block">{a.auditId}</span>
                    <span className="text-slate-500 text-[9px]">{a.timestamp}</span>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="font-bold text-white block">{a.auditorName}</span>
                    <span className="text-emerald-400 text-[10px]">Warehouse: {a.warehouseCode}</span>
                  </td>

                  <td className="py-3.5 px-3 text-sky-400 font-bold">
                    {a.fnsku}
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="text-slate-300 font-bold">Exp: {a.expectedQty} | Act: {a.actualPhysicalQty}</span>
                  </td>

                  <td className="py-3.5 px-3 font-extrabold text-sm">
                    <span className={a.varianceQty < 0 ? 'text-rose-400' : 'text-emerald-400'}>
                      {a.varianceQty > 0 ? `+${a.varianceQty}` : a.varianceQty}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-slate-300 text-[10px]">
                    {a.varianceReason.replace('_', ' ')}
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-[9px] font-bold">
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-xl w-full space-y-4 shadow-2xl text-xs font-sans">
            <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Record Physical Cycle Count Audit</span>
            </h3>

            <form onSubmit={handleCreateAudit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Warehouse Code</label>
                  <input
                    type="text"
                    value={whCode}
                    onChange={(e) => setWhCode(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">FNSKU Barcode</label>
                  <input
                    type="text"
                    value={fnsku}
                    onChange={(e) => setFnsku(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Expected System Qty</label>
                  <input
                    type="number"
                    value={expectedQty}
                    onChange={(e) => setExpectedQty(parseInt(e.target.value, 10) || 0)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Actual Physical Bin Count</label>
                  <input
                    type="number"
                    value={actualQty}
                    onChange={(e) => setActualQty(parseInt(e.target.value, 10) || 0)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Variance Classification Reason</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold focus:outline-none"
                >
                  <option value="DAMAGED_IN_HANDLING">Damaged in Handling</option>
                  <option value="LOST_IN_WAREHOUSE">Lost in Warehouse</option>
                  <option value="MISCOUNT">Miscount / Scan Discrepancy</option>
                  <option value="SYSTEM_RECONCILED">System Reconciled</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-black rounded-xl"
                >
                  Submit Audit & Reconcile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
