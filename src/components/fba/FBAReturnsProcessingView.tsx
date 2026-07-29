import React, { useState } from 'react';
import { FBAReturnRecord, ConditionGrade, FBAReturnAction } from '../../types/fba';
import {
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Search,
  Plus,
  Trash2,
  PackageX,
  ShieldCheck,
} from 'lucide-react';

interface FBAReturnsProcessingViewProps {
  returns: FBAReturnRecord[];
  onProcessReturn: (newRma: FBAReturnRecord) => void;
}

export const FBAReturnsProcessingView: React.FC<FBAReturnsProcessingViewProps> = ({
  returns,
  onProcessReturn,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [orderId, setOrderId] = useState('FBA-ORD-10901');
  const [buyerName, setBuyerName] = useState('Marcus Vance');
  const [fnsku, setFnsku] = useState('X002891A90');
  const [productTitle, setProductTitle] = useState('AuraSound ANC Wireless Headphones');
  const [reason, setReason] = useState('Unopened box return');
  const [grade, setGrade] = useState<ConditionGrade>('NEW');
  const [action, setAction] = useState<FBAReturnAction>('RESTOCK_GRADE_A');
  const [refundUSD, setRefundUSD] = useState(119.99);

  const handleCreateRma = (e: React.FormEvent) => {
    e.preventDefault();
    const rmaId = `FBA-RMA-${Math.floor(500 + Math.random() * 500)}`;

    const newRma: FBAReturnRecord = {
      rmaId,
      orderId,
      buyerName,
      fnsku,
      productTitle,
      returnReason: reason,
      inspectionGrade: grade,
      actionTaken: action,
      refundAmountUSD: refundUSD,
      warehouseCode: 'EWR4',
      inspectorName: 'Quality Lead John Miller',
      status: action === 'RESTOCK_GRADE_A' ? 'RESTOCKED' : 'INSPECTED',
      timestamp: new Date().toISOString().substring(0, 16).replace('T', ' '),
    };

    onProcessReturn(newRma);
    setShowModal(false);
    alert(`RMA ${rmaId} processed! Action: ${action}. Inventory updated in EWR4.`);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <RotateCcw className="w-4 h-4 text-[#febd69]" />
            <span>FBA RETURNS PROCESSING & QUALITY RE-INSPECTION (RMA)</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Returned Product Inspection, Grade Classification & Disposal Workflow</h2>
          <p className="text-xs text-slate-400 mt-1">
            Returned customer items are inspected by quality leads, graded (New, Open Box, Damaged), and automatically restocked or destroyed
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black text-xs rounded-xl transition flex items-center space-x-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Process Return Request (RMA)</span>
        </button>
      </div>

      {/* Returns Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 font-mono text-xs">
        <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3">
          RMA Inspection Logs ({returns.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                <th className="py-3 px-3">RMA ID & Order</th>
                <th className="py-3 px-3">Product & FNSKU</th>
                <th className="py-3 px-3">Return Reason</th>
                <th className="py-3 px-3">Inspection Grade</th>
                <th className="py-3 px-3">Action Taken</th>
                <th className="py-3 px-3 text-right">Refund Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {returns.map((r) => (
                <tr key={r.rmaId} className="hover:bg-slate-800/30 transition">
                  <td className="py-3.5 px-3">
                    <span className="font-extrabold text-[#febd69] text-xs block">{r.rmaId}</span>
                    <span className="text-slate-400 text-[10px]">Order: {r.orderId}</span>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="font-bold text-white block">{r.productTitle}</span>
                    <span className="text-emerald-400 text-[9px]">FNSKU: {r.fnsku}</span>
                  </td>

                  <td className="py-3.5 px-3 text-slate-300 max-w-xs text-[10px]">
                    {r.returnReason}
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 bg-slate-800 text-amber-300 rounded text-[9px] font-bold">
                      Grade: {r.inspectionGrade}
                    </span>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-[9px] font-bold">
                      {r.actionTaken.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-right font-extrabold text-emerald-400 text-sm">
                    ${r.refundAmountUSD.toFixed(2)}
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
              <RotateCcw className="w-4 h-4 text-[#febd69]" />
              <span>Process Customer FBA Return (RMA)</span>
            </h3>

            <form onSubmit={handleCreateRma} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Order ID</label>
                  <input
                    type="text"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Buyer Name</label>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">FNSKU</label>
                  <input
                    type="text"
                    value={fnsku}
                    onChange={(e) => setFnsku(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Product Title</label>
                  <input
                    type="text"
                    value={productTitle}
                    onChange={(e) => setProductTitle(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Return Reason</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Condition Grade</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value as ConditionGrade)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold focus:outline-none"
                  >
                    <option value="NEW">New (Unopened)</option>
                    <option value="LIKE_NEW">Like New (Open Box)</option>
                    <option value="DAMAGED">Damaged Goods</option>
                    <option value="DISPOSAL_REQUIRED">Disposal Required</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Resolution Action</label>
                  <select
                    value={action}
                    onChange={(e) => setAction(e.target.value as FBAReturnAction)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold focus:outline-none"
                  >
                    <option value="RESTOCK_GRADE_A">Restock to Bin (Grade A)</option>
                    <option value="DISPOSAL_DESTRUCTION">Dispose & Destroy</option>
                    <option value="REPLACEMENT_SENT">Send Replacement</option>
                    <option value="RETURN_TO_SELLER">Return to Seller</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Refund Amount ($)</label>
                  <input
                    type="number"
                    value={refundUSD}
                    onChange={(e) => setRefundUSD(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold focus:outline-none"
                  />
                </div>
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
                  className="px-4 py-2 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black rounded-xl"
                >
                  Complete Inspection & RMA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
