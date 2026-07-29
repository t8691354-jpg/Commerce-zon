import React, { useState } from 'react';
import { ReturnRMARecord, ReturnStatus } from '../../types/dropshipping';
import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Search,
  Filter,
  Package,
  ShieldCheck,
  DollarSign,
} from 'lucide-react';

interface ReturnsAndRMAEngineViewProps {
  returns: ReturnRMARecord[];
  onUpdateReturnStatus: (rmaId: string, status: ReturnStatus, grade?: ReturnRMARecord['inspectionGrade']) => void;
}

export const ReturnsAndRMAEngineView: React.FC<ReturnsAndRMAEngineViewProps> = ({
  returns,
  onUpdateReturnStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReturns = returns.filter((r) =>
    r.rmaId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.orderId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApproveReturn = (rmaId: string) => {
    onUpdateReturnStatus(rmaId, 'APPROVED_BY_SUPPLIER');
    alert(`Return RMA ${rmaId} Approved by Supplier! Return shipping label dispatched to buyer.`);
  };

  const handleCompleteInspection = (rmaId: string, grade: ReturnRMARecord['inspectionGrade']) => {
    onUpdateReturnStatus(rmaId, 'REFUNDED', grade);
    alert(`RMA ${rmaId} Inspected (${grade}). Buyer refunded $119.99 USD.`);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span>RETURNS, REPLACEMENTS & RMA INSPECTION ENGINE</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Multi-Vendor RMA & Warehouse Return Inspection System</h2>
          <p className="text-xs text-slate-400 mt-1">
            End-to-end return authorizations, supplier approvals, warehouse grading (Grade A / B / Destroy) & automated buyer refunds
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-xs">
          <span className="text-slate-400">RMA Resolution Rate: <strong className="text-emerald-400 font-mono">98.5%</strong></span>
        </div>
      </div>

      {/* Returns List */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 text-xs">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="text-xs font-black text-white uppercase tracking-wider">
            Active RMA Return Requests ({filteredReturns.length})
          </h3>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search RMA ID, Order ID..."
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-[#febd69]"
          />
        </div>

        <div className="space-y-4">
          {filteredReturns.map((rma) => (
            <div key={rma.rmaId} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-900 pb-2 font-mono">
                <div>
                  <span className="font-extrabold text-white text-sm">{rma.rmaId}</span>
                  <span className="text-slate-400 ml-2">(Order: {rma.orderId})</span>
                </div>

                <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-bold rounded">
                  {rma.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <span className="text-[10px] text-slate-500 font-mono uppercase block">Product Item</span>
                  <span className="font-bold text-white">{rma.productTitle}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 font-mono uppercase block">Return Reason</span>
                  <span className="font-bold text-rose-400">{rma.reason}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 font-mono uppercase block">Refund Amount</span>
                  <span className="font-bold text-emerald-400">${rma.refundAmountUSD.toFixed(2)} USD</span>
                </div>
              </div>

              <p className="text-slate-400 text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                Buyer Notes: "{rma.details}"
              </p>

              <div className="flex justify-between items-center pt-1">
                <span className="text-[10px] text-slate-500 font-mono">
                  Requested: {rma.requestedAt} {rma.resolvedAt && `• Resolved: ${rma.resolvedAt}`}
                </span>

                <div className="flex items-center space-x-2">
                  {rma.status === 'REQUESTED' && (
                    <button
                      onClick={() => handleApproveReturn(rma.rmaId)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition text-[11px]"
                    >
                      Approve Return
                    </button>
                  )}

                  {rma.status === 'INSPECTED' && (
                    <button
                      onClick={() => handleCompleteInspection(rma.rmaId, 'GRADE_A_RESTOCK')}
                      className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl transition text-[11px]"
                    >
                      Restock & Issue Refund
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
