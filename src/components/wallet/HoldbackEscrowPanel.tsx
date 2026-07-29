import React, { useState } from 'react';
import { HoldPeriodRecord } from '../../types/paymentWalletArchitecture';
import { Lock, Unlock, Clock, ShieldCheck, RefreshCw, AlertTriangle, CheckCircle2, DollarSign } from 'lucide-react';

interface HoldbackEscrowPanelProps {
  holds: HoldPeriodRecord[];
  lockPeriodDays: number;
  onUpdateLockPeriodDays: (days: number) => void;
  onTriggerAutoRelease: () => void;
  onForceUnlockOrder: (orderId: string) => void;
  onIssueRefund: (orderId: string, sellerId: string, amount: number) => void;
  currencySymbol: string;
  currencyRate: number;
}

export const HoldbackEscrowPanel: React.FC<HoldbackEscrowPanelProps> = ({
  holds,
  lockPeriodDays,
  onUpdateLockPeriodDays,
  onTriggerAutoRelease,
  onForceUnlockOrder,
  onIssueRefund,
  currencySymbol,
  currencyRate,
}) => {
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'LOCKED' | 'UNLOCKED' | 'REFUNDED'>('LOCKED');
  const [refundModal, setRefundModal] = useState<{ open: boolean; hold?: HoldPeriodRecord }>({ open: false });
  const [refundReason, setRefundReason] = useState<'BUYER_RETURN' | 'CANCELLED_BEFORE_SHIP' | 'DEFECTIVE' | 'SELLER_DISPUTE' | 'ADMIN_OVERRIDE'>('BUYER_RETURN');

  const filteredHolds = holds.filter((h) => {
    if (filterStatus === 'ALL') return true;
    return h.status === filterStatus;
  });

  const totalLockedAmount = holds
    .filter((h) => h.status === 'LOCKED')
    .reduce((sum, h) => sum + h.netSellerAmount, 0);

  const totalUnlockedAmount = holds
    .filter((h) => h.status === 'UNLOCKED')
    .reduce((sum, h) => sum + h.netSellerAmount, 0);

  const calculateDaysLeft = (unlocksAt: string) => {
    const diff = new Date(unlocksAt).getTime() - new Date().getTime();
    if (diff <= 0) return 0;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      {/* Banner & Control Bar */}
      <div className="bg-[#131921] border border-[#37475a] p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-sky-500 to-blue-600 text-white rounded-xl font-bold">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black text-sky-400 uppercase tracking-wider">14-Day Buyer Protection Escrow</span>
              <span className="text-slate-500">•</span>
              <span className="text-xs bg-sky-950 text-sky-300 border border-sky-800 px-2 py-0.5 rounded-full font-mono">
                {holds.filter((h) => h.status === 'LOCKED').length} Orders Currently Escrowed
              </span>
            </div>
            <h2 className="text-lg font-black text-white mt-0.5">Automated Holdback & Settlement System</h2>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onTriggerAutoRelease}
            className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-xs rounded-xl transition shadow flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Run Auto-Unlock Engine</span>
          </button>
        </div>
      </div>

      {/* Escrow Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-sky-800/80 p-4 rounded-2xl">
          <div className="text-[10px] text-slate-400 font-mono font-bold uppercase flex items-center space-x-1">
            <Lock className="w-3.5 h-3.5 text-sky-400" />
            <span>Total Escrowed (Locked)</span>
          </div>
          <div className="text-2xl font-black text-sky-400 font-mono mt-1">
            {currencySymbol}{(totalLockedAmount * currencyRate).toFixed(2)}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Subject to 14-day refund window</div>
        </div>

        <div className="bg-slate-900 border border-emerald-800/80 p-4 rounded-2xl">
          <div className="text-[10px] text-slate-400 font-mono font-bold uppercase flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Released & Unlocked</span>
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
            {currencySymbol}{(totalUnlockedAmount * currencyRate).toFixed(2)}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Cleared for seller withdrawal</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl col-span-2">
          <div className="flex items-center justify-between">
            <div className="text-[10px] text-slate-400 font-mono font-bold uppercase">Configurable Escrow Hold Period</div>
            <span className="text-xs font-extrabold text-[#febd69] font-mono">{lockPeriodDays} Days</span>
          </div>
          <div className="flex items-center space-x-4 mt-2">
            <input
              type="range"
              min="1"
              max="30"
              value={lockPeriodDays}
              onChange={(e) => onUpdateLockPeriodDays(Number(e.target.value))}
              className="w-full accent-[#febd69] bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <span className="text-xs text-slate-400 whitespace-nowrap font-mono">{lockPeriodDays}d Default Policy</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            Automatically unlocks funds to Available Balance after {lockPeriodDays} days if no refund/dispute occurs.
          </p>
        </div>
      </div>

      {/* Escrow Table Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <h3 className="text-sm font-black text-white flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span>Escrow Holdback Registry ({filteredHolds.length})</span>
          </h3>

          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
            {(['LOCKED', 'UNLOCKED', 'REFUNDED', 'ALL'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg transition ${
                  filterStatus === status ? 'bg-[#febd69] text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Holds Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                <th className="py-2.5 px-3">Order ID</th>
                <th className="py-2.5 px-3">Seller</th>
                <th className="py-2.5 px-3">Gross Amount</th>
                <th className="py-2.5 px-3">Commission</th>
                <th className="py-2.5 px-3">Net Locked</th>
                <th className="py-2.5 px-3">Escrow Status</th>
                <th className="py-2.5 px-3">Time Left</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredHolds.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 font-sans text-xs">
                    No escrow holdback records matching filter '{filterStatus}'.
                  </td>
                </tr>
              ) : (
                filteredHolds.map((h) => {
                  const daysLeft = calculateDaysLeft(h.unlocksAt);
                  return (
                    <tr key={h.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-3 font-bold text-white">{h.orderId}</td>
                      <td className="py-3 px-3 text-slate-300">{h.sellerId}</td>
                      <td className="py-3 px-3 text-white font-bold">
                        {currencySymbol}{(h.amount * currencyRate).toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-amber-400">
                        -{currencySymbol}{(h.commissionAmount * currencyRate).toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-sky-400 font-extrabold">
                        {currencySymbol}{(h.netSellerAmount * currencyRate).toFixed(2)}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase inline-flex items-center space-x-1 ${
                            h.status === 'LOCKED'
                              ? 'bg-sky-950 text-sky-400 border border-sky-800'
                              : h.status === 'UNLOCKED'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-rose-950 text-rose-400 border border-rose-800'
                          }`}
                        >
                          {h.status === 'LOCKED' && <Lock className="w-3 h-3 mr-1" />}
                          {h.status === 'UNLOCKED' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                          <span>{h.status}</span>
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {h.status === 'LOCKED' ? (
                          <span className="text-amber-400 font-bold flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{daysLeft}d remaining</span>
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[10px]">
                            {h.status === 'UNLOCKED' ? `Unlocked` : `Refunded`}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right font-sans">
                        <div className="flex items-center justify-end space-x-2">
                          {h.status === 'LOCKED' && (
                            <>
                              <button
                                onClick={() => onForceUnlockOrder(h.orderId)}
                                className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-800 rounded-lg text-[10px] font-bold transition flex items-center space-x-1"
                                title="Force immediate release to Available Balance"
                              >
                                <Unlock className="w-3 h-3" />
                                <span>Release Now</span>
                              </button>
                              <button
                                onClick={() => setRefundModal({ open: true, hold: h })}
                                className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-800 rounded-lg text-[10px] font-bold transition"
                              >
                                Refund
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Refund Modal */}
      {refundModal.open && refundModal.hold && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131921] border border-[#37475a] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-black text-white flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>Issue Refund from Escrow ({refundModal.hold.orderId})</span>
            </h3>

            <p className="text-xs text-slate-300">
              Refunding this order will immediately deduct{' '}
              <strong className="text-rose-400">
                {currencySymbol}{(refundModal.hold.amount * currencyRate).toFixed(2)}
              </strong>{' '}
              from seller holdback and credit the buyer wallet.
            </p>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400">Refund Reason</label>
              <select
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-[#febd69] outline-none"
              >
                <option value="BUYER_RETURN">Buyer Return within 14 Days</option>
                <option value="CANCELLED_BEFORE_SHIP">Cancelled Before Shipment</option>
                <option value="DEFECTIVE">Item Defective / Not as Described</option>
                <option value="SELLER_DISPUTE">Seller Dispute Settlement</option>
                <option value="ADMIN_OVERRIDE">Admin Goodwill Override</option>
              </select>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => setRefundModal({ open: false })}
                className="w-1/2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (refundModal.hold) {
                    onIssueRefund(refundModal.hold.orderId, refundModal.hold.sellerId, refundModal.hold.amount);
                  }
                  setRefundModal({ open: false });
                }}
                className="w-1/2 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-black rounded-xl transition shadow"
              >
                Confirm Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
