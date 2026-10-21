import React, { useState, useEffect } from 'react';
import { DisputeCase, SellerTrustReputation, ProductListingModeration } from '../../types/trustSafety';
import {
  Scale,
  ShieldCheck,
  ShieldAlert,
  Gavel,
  DollarSign,
  Send,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Eye,
  RefreshCw,
  Plus,
  HelpCircle,
  Truck,
} from 'lucide-react';

interface SellerDisputesTrustViewProps {
  merchantId: string;
  merchantName: string;
}

export const SellerDisputesTrustView: React.FC<SellerDisputesTrustViewProps> = ({
  merchantId,
  merchantName,
}) => {
  const [disputes, setDisputes] = useState<DisputeCase[]>([]);
  const [reputation, setReputation] = useState<SellerTrustReputation | null>(null);
  const [moderations, setModeratedListings] = useState<ProductListingModeration[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDispute, setSelectedDispute] = useState<DisputeCase | null>(null);

  // Settlement Form State
  const [proposalType, setProposalType] = useState<any>('FULL_REFUND');
  const [proposalAmount, setProposalAmount] = useState<number>(0);
  const [proposalExplanation, setProposalExplanation] = useState<string>('');
  const [replyMessage, setReplyMessage] = useState<string>('');
  const [carrierTrackingInput, setCarrierTrackingInput] = useState<string>('');

  // Appeal Form State
  const [selectedModerationItem, setSelectedModerationItem] = useState<ProductListingModeration | null>(null);
  const [appealStatement, setAppealStatement] = useState<string>('');
  const [appealDocUrl, setAppealDocUrl] = useState<string>('');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadSellerData = async () => {
    try {
      setLoading(true);
      const [dRes, rRes, mRes] = await Promise.all([
        fetch(`/api/trust-safety/disputes?sellerId=${merchantId}`),
        fetch(`/api/trust-safety/reputation/${merchantId}`),
        fetch(`/api/trust-safety/moderation/listings?sellerId=${merchantId}`),
      ]);

      if (dRes.ok) {
        const d = await dRes.json();
        setDisputes(d.disputes || []);
        if (selectedDispute) {
          const fresh = (d.disputes || []).find((x: any) => x.id === selectedDispute.id);
          if (fresh) setSelectedDispute(fresh);
        }
      }

      if (rRes.ok) {
        const r = await rRes.json();
        setReputation(r.reputation);
      }

      if (mRes.ok) {
        const m = await mRes.json();
        setModeratedListings(m.listings || []);
      }
    } catch (e) {
      console.error('Failed to load seller disputes data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSellerData();
  }, [merchantId]);

  const handleSendSellerReply = async () => {
    if (!selectedDispute || !replyMessage.trim()) return;
    try {
      const res = await fetch(`/api/trust-safety/disputes/${selectedDispute.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderRole: 'SELLER',
          senderName: merchantName,
          content: replyMessage.trim(),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedDispute(data.dispute);
        setReplyMessage('');
        showToast('Reply recorded on case timeline');
        loadSellerData();
      }
    } catch (e) {
      showToast('Error sending message');
    }
  };

  const handleSubmitProposal = async () => {
    if (!selectedDispute || !proposalExplanation.trim()) return;
    try {
      const res = await fetch(`/api/trust-safety/disputes/${selectedDispute.id}/propose-resolution`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actor: {
            role: 'SELLER',
            name: merchantName,
          },
          proposal: {
            type: proposalType,
            amount: proposalAmount || selectedDispute.claimedAmount,
            explanation: proposalExplanation.trim(),
          },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedDispute(data.dispute);
        setProposalExplanation('');
        showToast('Settlement offer submitted to customer');
        loadSellerData();
      }
    } catch (e) {
      showToast('Error submitting proposal');
    }
  };

  const handleAddTrackingProof = async () => {
    if (!selectedDispute || !carrierTrackingInput.trim()) return;
    try {
      const res = await fetch(`/api/trust-safety/disputes/${selectedDispute.id}/evidence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uploadedBy: 'SELLER',
          uploaderName: merchantName,
          type: 'TRACKING_PROOF',
          title: `Courier Verification: ${carrierTrackingInput.trim()}`,
          referenceNumber: carrierTrackingInput.trim(),
          notes: 'Official courier tracking confirmation and carrier delivery scan timestamp.',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedDispute(data.dispute);
        setCarrierTrackingInput('');
        showToast('Shipping proof attached to case');
        loadSellerData();
      }
    } catch (e) {
      showToast('Error adding shipping proof');
    }
  };

  const handleSubmitAppeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModerationItem || !appealStatement.trim()) return;
    try {
      const res = await fetch(`/api/trust-safety/moderation/listings/${selectedModerationItem.id}/appeal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sellerId: merchantId,
          statement: appealStatement.trim(),
          documentUrls: appealDocUrl.trim() ? [appealDocUrl.trim()] : [],
        }),
      });
      if (res.ok) {
        showToast('Appeal submitted for Trust & Safety review');
        setSelectedModerationItem(null);
        setAppealStatement('');
        setAppealDocUrl('');
        loadSellerData();
      }
    } catch (e) {
      showToast('Error submitting appeal');
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-[#febd69] text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-[#febd69]" />
          <span>{toast}</span>
        </div>
      )}

      {/* Account Trust & Health Banner */}
      <div className="bg-[#131921] border border-[#37475a] rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black text-[#febd69] uppercase tracking-wider flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-[#febd69]" />
                Merchant Trust & Policy Standing
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400 font-mono">Part 15 Trust & Safety Engine</span>
            </div>
            <h2 className="text-xl font-black text-white flex items-center gap-3">
              <span>Account Health & Dispute Standing</span>
              {reputation && (
                <span
                  className={`text-xs uppercase px-2.5 py-0.5 rounded-full font-black ${
                    reputation.badge === 'VERIFIED_LEADER'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : reputation.badge === 'TRUSTED_MERCHANT'
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {reputation.badge.replace(/_/g, ' ')}
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl">
              Maintain a dispute rate below 1.0% and zero policy infractions to ensure continuous instant payout disbursements.
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-[11px] text-slate-400 font-bold">Trust Rating</div>
              <div className="text-2xl font-black text-white font-mono">{reputation?.trustScore ?? 95} / 100</div>
            </div>
            <div className="text-right pl-4 border-l border-slate-800">
              <div className="text-[11px] text-slate-400 font-bold">Dispute Rate</div>
              <div className="text-2xl font-black text-emerald-400 font-mono">
                {reputation?.disputeRatePct ?? 0.42}%
              </div>
            </div>
            <div className="text-right pl-4 border-l border-slate-800">
              <div className="text-[11px] text-slate-400 font-bold">Active Strikes</div>
              <div
                className={`text-2xl font-black font-mono ${
                  (reputation?.activeStrikesCount ?? 0) > 0 ? 'text-rose-400' : 'text-slate-400'
                }`}
              >
                {reputation?.activeStrikesCount ?? 0} / 3
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Disputes List & Case Resolution Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Active Disputes Roster */}
        <div className="bg-[#131921] border border-[#37475a] rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white flex items-center space-x-2">
              <Scale className="w-4 h-4 text-[#febd69]" />
              <span>Customer Disputes on Your Orders ({disputes.length})</span>
            </h3>
            <button onClick={loadSellerData} className="text-slate-400 hover:text-white">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {disputes.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400 mb-2 opacity-80" />
                No active disputes against your merchant account. Great job!
              </div>
            ) : (
              disputes.map((d) => (
                <div
                  key={d.id}
                  onClick={() => setSelectedDispute(d)}
                  className={`p-3.5 rounded-xl border text-xs cursor-pointer transition space-y-2 ${
                    selectedDispute?.id === d.id
                      ? 'bg-slate-900 border-[#febd69] shadow-md'
                      : 'bg-[#1e293b] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#febd69]">{d.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        d.status === 'RESOLVED'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : d.status === 'ESCALATED'
                          ? 'bg-rose-500/20 text-rose-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {d.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="font-bold text-white line-clamp-1">{d.productTitle}</div>
                  <div className="text-[11px] text-slate-400">Order #{d.orderNumber} • Buyer: {d.buyerName}</div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                    <span className="text-slate-400">{d.category.replace(/_/g, ' ')}</span>
                    <span className="font-black text-white">${d.claimedAmount.toFixed(2)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Center/Right: Selected Dispute Action Drawer */}
        <div className="lg:col-span-2 space-y-6">
          {selectedDispute ? (
            <div className="bg-[#131921] border border-[#37475a] rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <div className="text-xs font-mono text-[#febd69] font-bold">Case #{selectedDispute.id}</div>
                  <h3 className="text-base font-black text-white">{selectedDispute.productTitle}</h3>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Order #{selectedDispute.orderNumber} • Claim: ${selectedDispute.claimedAmount.toFixed(2)} USD
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                    selectedDispute.status === 'RESOLVED'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {selectedDispute.status.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Customer Claim Details */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-xs">
                <span className="font-black text-slate-400 uppercase text-[10px] block">Customer Statement</span>
                <p className="text-white italic leading-relaxed">"{selectedDispute.description}"</p>
                <div className="text-[11px] text-slate-400 pt-1">
                  Customer requested: <strong className="text-[#febd69]">{selectedDispute.desiredOutcome.replace(/_/g, ' ')}</strong>
                </div>
              </div>

              {/* Evidence Provided */}
              {selectedDispute.evidence.length > 0 && (
                <div className="space-y-2">
                  <span className="font-black text-slate-400 uppercase text-[10px] block">Customer Attached Evidence</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedDispute.evidence.map((ev) => (
                      <div key={ev.id} className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs space-y-1">
                        <div className="font-bold text-white">{ev.title}</div>
                        {ev.fileUrl && (
                          <img src={ev.fileUrl} alt={ev.title} className="w-full h-24 object-cover rounded-lg" />
                        )}
                        {ev.notes && <p className="text-slate-400 italic text-[11px]">{ev.notes}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Message Thread */}
              <div className="space-y-3">
                <span className="font-black text-slate-400 uppercase text-[10px] block">Messages & Responses</span>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedDispute.messages.map((m) => (
                    <div
                      key={m.id}
                      className={`p-3 rounded-xl text-xs space-y-1 ${
                        m.senderRole === 'SELLER'
                          ? 'bg-[#febd69]/10 border border-[#febd69]/30 text-white'
                          : 'bg-slate-900 border border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className={m.senderRole === 'SELLER' ? 'text-[#febd69]' : 'text-cyan-400'}>
                          {m.senderName} ({m.senderRole})
                        </span>
                        <span className="text-slate-500">
                          {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p>{m.content}</p>
                    </div>
                  ))}
                </div>

                {/* Reply bar */}
                {selectedDispute.status !== 'RESOLVED' && (
                  <div className="flex items-center space-x-2 pt-1">
                    <input
                      type="text"
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Type response to customer..."
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      onKeyDown={(e) => e.key === 'Enter' && handleSendSellerReply()}
                    />
                    <button
                      onClick={handleSendSellerReply}
                      className="px-4 py-2 bg-[#febd69] hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs"
                    >
                      Reply
                    </button>
                  </div>
                )}
              </div>

              {/* Action: Propose Settlement or Attach Courier Proof */}
              {selectedDispute.status !== 'RESOLVED' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                  {/* Propose Offer */}
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3 text-xs">
                    <div className="font-black text-white flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-[#febd69]" />
                      <span>Propose Settlement Offer</span>
                    </div>
                    <select
                      value={proposalType}
                      onChange={(e) => setProposalType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                    >
                      <option value="FULL_REFUND">Issue Full 100% Refund</option>
                      <option value="PARTIAL_REFUND">Offer Partial Refund (Keep Item)</option>
                      <option value="REPLACEMENT">Ship Immediate Replacement</option>
                      <option value="RETURN_REQUIRED">Require Return Before Refund</option>
                    </select>
                    <input
                      type="number"
                      value={proposalAmount || selectedDispute.claimedAmount}
                      onChange={(e) => setProposalAmount(Number(e.target.value))}
                      placeholder="Refund Amount ($)"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                    />
                    <input
                      type="text"
                      value={proposalExplanation}
                      onChange={(e) => setProposalExplanation(e.target.value)}
                      placeholder="Explanation to buyer..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                    />
                    <button
                      onClick={handleSubmitProposal}
                      className="w-full py-2 bg-[#febd69] hover:bg-amber-400 text-slate-950 font-black rounded-lg"
                    >
                      Submit Settlement Offer
                    </button>
                  </div>

                  {/* Add Tracking Evidence */}
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3 text-xs">
                    <div className="font-black text-white flex items-center space-x-2">
                      <Truck className="w-4 h-4 text-cyan-400" />
                      <span>Attach Proof of Delivery / Tracking</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      If customer claims item was not received, submit carrier dispatch proof or signed bill of lading.
                    </p>
                    <input
                      type="text"
                      value={carrierTrackingInput}
                      onChange={(e) => setCarrierTrackingInput(e.target.value)}
                      placeholder="e.g. FX-88492019US or POD receipt #"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                    />
                    <button
                      onClick={handleAddTrackingProof}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg border border-slate-700"
                    >
                      Attach Courier Proof
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[#131921] border border-[#37475a] rounded-2xl p-12 text-center text-slate-400 space-y-3">
              <Scale className="w-12 h-12 mx-auto text-slate-600" />
              <div className="text-sm font-bold text-white">Select a dispute case from the left list</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Review buyer claims, examine photo damage evidence, communicate with the customer, and submit fair resolution offers.
              </p>
            </div>
          )}

          {/* Section: Flagged Listings & Appeals */}
          {moderations.length > 0 && (
            <div className="bg-[#131921] border border-rose-900/40 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-black text-white flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Flagged Products Requiring Attention / Appeal</span>
              </h3>
              <div className="space-y-3">
                {moderations.map((m) => (
                  <div
                    key={m.id}
                    className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-white">{m.productTitle}</div>
                      <div className="text-slate-400 text-[11px]">
                        Infraction: <span className="text-rose-400 font-bold">{m.violationType}</span> • Status:{' '}
                        <span className="text-amber-400">{m.status}</span>
                      </div>
                      <p className="text-slate-400 text-[11px] mt-1 italic">"{m.evidenceNotes}"</p>
                    </div>

                    {m.status === 'SUPPRESSED' && !m.appeal && (
                      <button
                        onClick={() => setSelectedModerationItem(m)}
                        className="px-3 py-1.5 bg-[#febd69] hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs"
                      >
                        Submit Appeal
                      </button>
                    )}

                    {m.appeal && (
                      <span className="text-cyan-400 font-bold text-xs uppercase">
                        Appeal {m.appeal.status}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Appeal Submission Modal */}
      {selectedModerationItem && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-xs">
            <h3 className="text-base font-black text-white flex items-center space-x-2">
              <FileText className="w-4 h-4 text-[#febd69]" />
              <span>Submit Listing Moderation Appeal</span>
            </h3>
            <p className="text-slate-400">
              Appealing suppression for: <strong className="text-white">{selectedModerationItem.productTitle}</strong>
            </p>

            <form onSubmit={handleSubmitAppeal} className="space-y-3">
              <div>
                <label className="text-slate-400 font-bold block mb-1">Defense Statement / Conformity Proof</label>
                <textarea
                  rows={4}
                  value={appealStatement}
                  onChange={(e) => setAppealStatement(e.target.value)}
                  placeholder="Provide distributor invoices, authorized reseller letters, or lab testing certificates..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Evidence Document URL</label>
                <input
                  type="url"
                  value={appealDocUrl}
                  onChange={(e) => setAppealDocUrl(e.target.value)}
                  placeholder="https://example.com/certificates/oem-auth.pdf"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedModerationItem(null)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#febd69] text-slate-950 font-black rounded-lg"
                >
                  Submit Official Appeal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
