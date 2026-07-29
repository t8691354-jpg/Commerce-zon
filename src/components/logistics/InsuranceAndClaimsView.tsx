import React, { useState } from 'react';
import { Shipment, InsurancePolicy } from '../../types/logistics';
import {
  ShieldAlert,
  ShieldCheck,
  FileText,
  CheckCircle2,
  XCircle,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';

interface InsuranceAndClaimsViewProps {
  shipments: Shipment[];
}

export const InsuranceAndClaimsView: React.FC<InsuranceAndClaimsViewProps> = ({ shipments }) => {
  const [claimShipmentId, setClaimShipmentId] = useState(shipments[3]?.shipmentId || 'SHP-1004');
  const [claimType, setClaimType] = useState<'DAMAGED' | 'LOST'>('DAMAGED');
  const [claimNotes, setClaimNotes] = useState('Outer carton dented during transit. Product display frame cracked.');
  const [submittedClaims, setSubmittedClaims] = useState([
    {
      claimId: 'CLM-901',
      shipmentId: 'SHP-1004',
      type: 'DAMAGED',
      amountUSD: 449.99,
      status: 'UNDER_REVIEW',
      notes: 'Outer packaging crushed in transit lane. Photo evidence uploaded.',
    },
  ]);

  const handleFileClaim = (e: React.FormEvent) => {
    e.preventDefault();

    const newClaim = {
      claimId: `CLM-${Math.floor(900 + Math.random() * 90)}`,
      shipmentId: claimShipmentId,
      type: claimType,
      amountUSD: 299.00,
      status: 'FILED',
      notes: claimNotes,
    };

    setSubmittedClaims([newClaim, ...submittedClaims]);
    alert(`Insurance Claim ${newClaim.claimId} submitted for shipment ${claimShipmentId}!`);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-emerald-400 uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
            <span>CARRIER FREIGHT INSURANCE & CLAIMS DISPATCH ENGINE</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Automatic Cargo Coverage, Loss Claims & Damage Inspection Workflows</h2>
          <p className="text-xs text-slate-400 mt-1">
            File damage or lost shipment claims, review driver photo proof, issue instant seller wallet payouts & audit insurer policies
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg font-bold">
            All Shipments Insured up to $10,000 USD
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono text-xs">
        {/* File Claim Form */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 font-sans">
          <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3 font-mono flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>File Cargo Loss or Damage Claim</span>
          </h3>

          <form onSubmit={handleFileClaim} className="space-y-3 font-mono text-xs">
            <div>
              <label className="block text-slate-400 text-[10px] uppercase mb-1">Select Consignment ID</label>
              <select
                value={claimShipmentId}
                onChange={(e) => setClaimShipmentId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
              >
                {shipments.map((s) => (
                  <option key={s.shipmentId} value={s.shipmentId}>
                    {s.shipmentId} - {s.recipientName} (${s.items[0]?.unitValueUSD || 100} USD)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 text-[10px] uppercase mb-1">Claim Incident Type</label>
              <select
                value={claimType}
                onChange={(e) => setClaimType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="DAMAGED">Goods Damaged in Transit</option>
                <option value="LOST">Package Lost / Non-Delivery</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 text-[10px] uppercase mb-1">Incident Report Notes</label>
              <textarea
                rows={3}
                value={claimNotes}
                onChange={(e) => setClaimNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 font-sans"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-xl transition shadow-lg mt-2"
            >
              Submit Freight Insurance Claim
            </button>
          </form>
        </div>

        {/* Claims Roster */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 font-sans">
          <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3 font-mono">
            Active Insurance Claims Roster ({submittedClaims.length})
          </h3>

          <div className="space-y-3 font-mono text-xs">
            {submittedClaims.map((c) => (
              <div key={c.claimId} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white text-xs">{c.claimId} • {c.shipmentId}</span>
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded text-[9px] font-bold">
                    {c.status}
                  </span>
                </div>

                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Claim Type: <strong className="text-rose-400">{c.type}</strong></span>
                  <span>Claim Value: <strong className="text-emerald-400">${c.amountUSD} USD</strong></span>
                </div>

                <p className="text-slate-300 font-sans text-[11px] bg-slate-900 p-2 rounded border border-slate-800">
                  "{c.notes}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
