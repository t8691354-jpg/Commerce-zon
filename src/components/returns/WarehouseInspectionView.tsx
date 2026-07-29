import React, { useState } from 'react';
import { ReturnRequest, InspectionCondition } from '../../types/returns';
import {
  PackageCheck,
  Camera,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileCheck2,
  UserCheck,
  Calendar,
} from 'lucide-react';

interface Props {
  returnRequests: ReturnRequest[];
  onSaveInspection: (
    returnId: string,
    condition: InspectionCondition,
    result: any,
    notes: string,
    restockingFee: number
  ) => void;
}

export const WarehouseInspectionView: React.FC<Props> = ({ returnRequests, onSaveInspection }) => {
  const [selectedReturnId, setSelectedReturnId] = useState(returnRequests[0]?.returnId || '');
  const [inspectorName, setInspectorName] = useState('Marcus Vance (QA Lead FC-4)');
  const [productCondition, setProductCondition] = useState<InspectionCondition>('RESELLABLE_NEW');
  const [packagingCondition, setPackagingCondition] = useState<'INTACT' | 'DAMAGED' | 'MISSING'>('INTACT');
  const [missingAccessories, setMissingAccessories] = useState<string>('');
  const [inspectionResult, setInspectionResult] = useState<'APPROVED_FOR_FULL_REFUND' | 'APPROVED_FOR_PARTIAL_REFUND' | 'APPROVED_FOR_EXCHANGE' | 'REJECTED_CUSTOMER_DAMAGED'>('APPROVED_FOR_FULL_REFUND');
  const [restockingFeeUSD, setRestockingFeeUSD] = useState(0);
  const [notes, setNotes] = useState('Item inspected at FC intake station. Verified complete working condition.');

  const targetReturn = returnRequests.find((r) => r.returnId === selectedReturnId) || returnRequests[0];

  const handleInspectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetReturn) return;

    onSaveInspection(targetReturn.returnId, productCondition, inspectionResult, notes, restockingFeeUSD);
    alert(`Warehouse QA Inspection for ${targetReturn.returnId} recorded successfully!`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <PackageCheck className="w-5 h-5 text-[#febd69]" />
            <span>Fulfillment Center Quality Inspection Terminal</span>
          </h2>
          <p className="text-xs text-slate-400">
            Record physical product intake condition, test functionality, log missing accessories, and assign resale disposition.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold rounded-lg flex items-center space-x-1">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Logged as QA Lead</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Selector & Target Order Summary */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
          <h3 className="text-xs font-bold text-[#febd69] uppercase tracking-wider">Select Return Item for Inspection</h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">RMA Queue</label>
            <select
              value={selectedReturnId}
              onChange={(e) => setSelectedReturnId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#febd69]"
            >
              {returnRequests.map((r) => (
                <option key={r.returnId} value={r.returnId}>
                  {r.returnId} - {r.item.name.substring(0, 25)}...
                </option>
              ))}
            </select>
          </div>

          {targetReturn && (
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 text-xs">
              <div className="font-bold text-white border-b border-slate-800 pb-2">Product Intake Manifest</div>
              {targetReturn.item.imageUrl && (
                <img
                  src={targetReturn.item.imageUrl}
                  alt={targetReturn.item.name}
                  className="w-full h-32 object-cover rounded-lg border border-slate-800"
                />
              )}
              <div className="space-y-1">
                <div className="font-bold text-white">{targetReturn.item.name}</div>
                <div className="text-slate-400">SKU: <span className="font-mono text-slate-200">{targetReturn.item.sku}</span></div>
                <div className="text-slate-400">Buyer Reason: <span className="text-amber-400 font-bold">{targetReturn.reason}</span></div>
                <div className="text-slate-400">Seller: <span className="text-[#febd69] font-bold">{targetReturn.sellerName}</span></div>
                <div className="text-slate-400">Unit Price: <span className="font-mono text-emerald-400 font-bold">${targetReturn.item.unitPriceUSD.toFixed(2)}</span></div>
              </div>
            </div>
          )}
        </div>

        {/* Inspection Form */}
        <form onSubmit={handleInspectSubmit} className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-5">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <FileCheck2 className="w-4 h-4 text-[#febd69]" />
            <span>Inspection Form & Condition Assessment</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Inspector Name / ID</label>
              <input
                type="text"
                value={inspectorName}
                onChange={(e) => setInspectorName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#febd69]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Packaging Condition</label>
              <select
                value={packagingCondition}
                onChange={(e) => setPackagingCondition(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#febd69]"
              >
                <option value="INTACT">Original Box Intact & Sealed</option>
                <option value="DAMAGED">Original Packaging Damaged</option>
                <option value="MISSING">Original Packaging Missing</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Graded Product Condition</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'RESELLABLE_NEW', label: 'Resellable (Like New)', desc: 'Re-stock to prime tier' },
                { id: 'RESELLABLE_OPEN_BOX', label: 'Resellable (Open Box)', desc: 'Re-stock to Amazon Warehouse Deals' },
                { id: 'REPAIR_REQUIRED', label: 'Repair Required', desc: 'Send to refurbishment hub' },
                { id: 'DAMAGED_SCRAP', label: 'Damaged / Scrap', desc: 'Liquidate or recycle' },
                { id: 'RETURN_TO_SELLER', label: 'Return to Seller', desc: 'Ship back to vendor' },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setProductCondition(c.id as InspectionCondition)}
                  className={`p-3 rounded-xl border text-left transition ${
                    productCondition === c.id
                      ? 'bg-[#febd69] text-slate-950 border-[#febd69] shadow-md'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs">{c.label}</div>
                  <div className="text-[10px] opacity-80">{c.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Missing Accessories / Components</label>
              <input
                type="text"
                placeholder="e.g. Charging Cable missing"
                value={missingAccessories}
                onChange={(e) => setMissingAccessories(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#febd69]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Restocking Fee Deduction ($ USD)</label>
              <input
                type="number"
                value={restockingFeeUSD}
                onChange={(e) => setRestockingFeeUSD(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#febd69]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Final Inspection Verdict & Resolution Decision</label>
            <select
              value={inspectionResult}
              onChange={(e) => setInspectionResult(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#febd69]"
            >
              <option value="APPROVED_FOR_FULL_REFUND">APPROVED FOR 100% FULL REFUND</option>
              <option value="APPROVED_FOR_PARTIAL_REFUND">APPROVED FOR PARTIAL REFUND (Minus Restocking Fee)</option>
              <option value="APPROVED_FOR_EXCHANGE">APPROVED FOR REPLACEMENT DISPATCH</option>
              <option value="REJECTED_CUSTOMER_DAMAGED">REJECTED (Customer Caused Non-Covered Damage)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">QA Inspector Technical Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-[#febd69]"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save & Publish Inspection Report</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
