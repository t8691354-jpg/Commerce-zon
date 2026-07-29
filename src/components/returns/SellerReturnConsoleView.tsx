import React, { useState } from 'react';
import { ReturnRequest } from '../../types/returns';
import {
  Store,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Clock,
  ShieldCheck,
  FileText,
  AlertCircle,
  Eye,
} from 'lucide-react';

interface Props {
  returnRequests: ReturnRequest[];
  onApproveBySeller: (returnId: string) => void;
  onRejectBySeller: (returnId: string, reason: string) => void;
}

export const SellerReturnConsoleView: React.FC<Props> = ({
  returnRequests,
  onApproveBySeller,
  onRejectBySeller,
}) => {
  const [selectedSellerId, setSelectedSellerId] = useState('SEL-401');
  const [rejectReason, setRejectReason] = useState('');

  const sellerClaims = returnRequests.filter(
    (r) => r.sellerId === selectedSellerId || selectedSellerId === 'ALL'
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Store className="w-5 h-5 text-[#febd69]" />
            <span>Merchant Return & RMA Portal Console</span>
          </h2>
          <p className="text-xs text-slate-400">
            Review incoming customer return requests, approve prepaid RMA labels, dispute invalid claims, and track seller defect SLA.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-xs text-slate-400">Merchant Store:</label>
          <select
            value={selectedSellerId}
            onChange={(e) => setSelectedSellerId(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#febd69]"
          >
            <option value="SEL-401">TechGizmo Electronics Ltd</option>
            <option value="SEL-502">ModaLux Apparel</option>
            <option value="SEL-882">KitchenPro Direct</option>
            <option value="SEL-102">Nordic Craft Leather</option>
            <option value="ALL">All Marketplace Sellers (Admin Mode)</option>
          </select>
        </div>
      </div>

      {/* Seller SLA Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-xs space-y-1">
          <span className="text-slate-400 uppercase text-[10px] font-bold">Total Store Returns</span>
          <div className="text-xl font-black text-white">{sellerClaims.length} Claims</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-xs space-y-1">
          <span className="text-slate-400 uppercase text-[10px] font-bold">Pending Review SLA</span>
          <div className="text-xl font-black text-amber-400">
            {sellerClaims.filter((c) => c.status === 'SELLER_REVIEW' || c.status === 'REQUESTED').length} Requests
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-xs space-y-1">
          <span className="text-slate-400 uppercase text-[10px] font-bold">Return Defect Rate (ODR)</span>
          <div className="text-xl font-black text-emerald-400">0.82% <span className="text-[10px] text-slate-500">(Limit &lt; 1%)</span></div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-xs space-y-1">
          <span className="text-slate-400 uppercase text-[10px] font-bold">Avg Seller Response Time</span>
          <div className="text-xl font-black text-[#febd69]">1.4 Hours</div>
        </div>
      </div>

      {/* Seller Claims Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center text-xs font-bold text-white">
          <span>Incoming Customer Return Requests</span>
          <span className="font-mono text-slate-400">Merchant Portal SLA: 24h Response Limit</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">RMA & Order</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Item & Value</th>
                <th className="p-3">Reason</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Merchant Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {sellerClaims.map((claim) => (
                <tr key={claim.returnId} className="hover:bg-slate-800/40">
                  <td className="p-3 font-mono">
                    <div className="font-bold text-[#febd69]">{claim.returnId}</div>
                    <div className="text-[10px] text-slate-500">{claim.orderId}</div>
                  </td>

                  <td className="p-3">
                    <div className="font-bold text-white">{claim.buyerName}</div>
                    <div className="text-[10px] text-slate-500">{claim.buyerEmail}</div>
                  </td>

                  <td className="p-3">
                    <div className="font-bold text-slate-200 truncate max-w-xs">{claim.item.name}</div>
                    <div className="font-mono text-emerald-400 font-bold">${claim.item.unitPriceUSD.toFixed(2)}</div>
                  </td>

                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded border border-amber-500/20 font-bold">
                      {claim.reason}
                    </span>
                  </td>

                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700 font-mono text-[10px]">
                      {claim.status}
                    </span>
                  </td>

                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => onApproveBySeller(claim.returnId)}
                      className="px-2.5 py-1 bg-emerald-500 text-slate-950 font-bold text-[11px] rounded hover:bg-emerald-400"
                    >
                      Approve RMA
                    </button>
                    <button
                      onClick={() => {
                        const reason = prompt('Enter rejection reason for customer:', 'Serial number mismatch / Customer damage.');
                        if (reason) onRejectBySeller(claim.returnId, reason);
                      }}
                      className="px-2.5 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[11px] font-bold rounded hover:bg-rose-500/30"
                    >
                      Dispute / Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
