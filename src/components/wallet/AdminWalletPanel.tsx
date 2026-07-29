import React, { useState } from 'react';
import { AdminWalletState, WithdrawalRequest, WalletTransaction } from '../../types/domain';
import {
  ShieldCheck,
  DollarSign,
  TrendingUp,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Plus,
  Minus,
  FileText,
  Activity,
  Layers,
  Building
} from 'lucide-react';

interface AdminWalletPanelProps {
  admin: AdminWalletState;
  withdrawals: WithdrawalRequest[];
  transactions: WalletTransaction[];
  onApproveWithdrawal: (id: string) => void;
  onRejectWithdrawal: (id: string, note?: string) => void;
  onFreezeWalletToggle: () => void;
  onManualAdjustment: (type: 'CREDIT' | 'DEBIT', amount: number, note: string) => void;
  currencyRate: number;
  currencySymbol: string;
}

export const AdminWalletPanel: React.FC<AdminWalletPanelProps> = ({
  admin,
  withdrawals,
  transactions,
  onApproveWithdrawal,
  onRejectWithdrawal,
  onFreezeWalletToggle,
  onManualAdjustment,
  currencyRate,
  currencySymbol,
}) => {
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustType, setAdjustType] = useState<'CREDIT' | 'DEBIT'>('CREDIT');
  const [adjustAmount, setAdjustAmount] = useState<number>(100);
  const [adjustNote, setAdjustNote] = useState<string>('Platform Goodwill Adjustment');
  const [adminActionMsg, setAdminActionMsg] = useState<string | null>(null);

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adjustAmount <= 0) return;
    onManualAdjustment(adjustType, adjustAmount, adjustNote);
    setShowAdjustModal(false);
    setAdminActionMsg(`Successfully applied ${adjustType} of $${adjustAmount} to marketplace ledger.`);
    setTimeout(() => setAdminActionMsg(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Admin Treasury Header */}
      <div className="bg-[#131921] border border-[#37475a] p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-500 text-slate-950 rounded-xl font-black">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black text-emerald-400 uppercase">Marketplace Master Treasury</span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-300 font-semibold">Admin Executive Controls</span>
            </div>
            <h2 className="text-lg font-black text-white">Platform Revenue & Financial Governance</h2>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onFreezeWalletToggle}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center space-x-1.5 ${
              admin.frozenWalletsCount > 0
                ? 'bg-rose-950 text-rose-300 border border-rose-800'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            {admin.frozenWalletsCount > 0 ? (
              <>
                <Lock className="w-4 h-4 text-rose-400" />
                <span>Wallets Status: FROZEN ({admin.frozenWalletsCount})</span>
              </>
            ) : (
              <>
                <Unlock className="w-4 h-4 text-emerald-400" />
                <span>Wallets Status: UNLOCKED</span>
              </>
            )}
          </button>

          <button
            onClick={() => setShowAdjustModal(true)}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl transition flex items-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>Manual Ledger Adjustment</span>
          </button>
        </div>
      </div>

      {adminActionMsg && (
        <div className="p-3 bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-bold rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{adminActionMsg}</span>
        </div>
      )}

      {/* Revenue Breakdown Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-slate-900 border border-emerald-800/80 p-4 rounded-2xl shadow-lg col-span-2 md:col-span-1">
          <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Platform Net Profit</div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
            {currencySymbol}{(admin.platformProfit * currencyRate).toFixed(2)}
          </div>
          <span className="text-[9px] text-emerald-400 font-semibold">Net margin after payouts</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Total Gross Revenue</div>
          <div className="text-xl font-black text-white font-mono mt-1">
            {currencySymbol}{(admin.marketplaceRevenue * currencyRate).toFixed(2)}
          </div>
          <span className="text-[9px] text-slate-500">GMV Volume</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Commissions</div>
          <div className="text-xl font-black text-amber-400 font-mono mt-1">
            {currencySymbol}{(admin.commissionRevenue * currencyRate).toFixed(2)}
          </div>
          <span className="text-[9px] text-slate-500">5% seller cut</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Subscriptions</div>
          <div className="text-xl font-black text-sky-400 font-mono mt-1">
            {currencySymbol}{(admin.subscriptionRevenue * currencyRate).toFixed(2)}
          </div>
          <span className="text-[9px] text-slate-500">Prime Merchant Plans</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Ads & Promos</div>
          <div className="text-xl font-black text-purple-400 font-mono mt-1">
            {currencySymbol}{(admin.advertisementRevenue * currencyRate).toFixed(2)}
          </div>
          <span className="text-[9px] text-slate-500">Sponsored Listings</span>
        </div>
      </div>

      {/* Additional Secondary Fee Streams */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl">
          <div className="text-[10px] text-slate-400">Processing Fees</div>
          <div className="text-sm font-bold text-slate-200 font-mono">
            {currencySymbol}{(admin.processingFees * currencyRate).toFixed(2)}
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl">
          <div className="text-[10px] text-slate-400">Shipping Revenue</div>
          <div className="text-sm font-bold text-slate-200 font-mono">
            {currencySymbol}{(admin.shippingRevenue * currencyRate).toFixed(2)}
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl">
          <div className="text-[10px] text-slate-400">Penalties Collected</div>
          <div className="text-sm font-bold text-amber-400 font-mono">
            {currencySymbol}{(admin.penaltiesCollected * currencyRate).toFixed(2)}
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl">
          <div className="text-[10px] text-slate-400">Refund Adjustments</div>
          <div className="text-sm font-bold text-rose-400 font-mono">
            -{currencySymbol}{(admin.refundAdjustments * currencyRate).toFixed(2)}
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl col-span-2 md:col-span-1">
          <div className="text-[10px] text-slate-400">Taxes Collected</div>
          <div className="text-sm font-bold text-blue-400 font-mono">
            {currencySymbol}{(admin.taxesCollected * currencyRate).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Pending Withdrawals Approval Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Activity className="w-4 h-4 text-[#febd69]" />
            <span>Pending Withdrawal Requests Requiring Admin Signature</span>
          </h3>
          <span className="text-xs text-amber-400 font-mono font-bold">
            {withdrawals.filter((w) => w.status === 'PENDING' || w.status === 'UNDER_REVIEW').length} Pending
          </span>
        </div>

        {withdrawals.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-4">No pending withdrawal requests.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[10px] uppercase font-mono">
                <tr>
                  <th className="p-3">User / Entity</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Payout Method</th>
                  <th className="p-3">Fraud Score</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {withdrawals.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-800/50 transition">
                    <td className="p-3">
                      <div className="font-bold text-white">{w.userName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{w.accountDetails}</div>
                    </td>
                    <td className="p-3 font-mono text-[10px]">
                      <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-bold">
                        {w.userRole}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-emerald-400">
                      ${w.amount.toFixed(2)} USD
                    </td>
                    <td className="p-3 font-mono text-[11px] text-slate-300">{w.payoutMethod}</td>
                    <td className="p-3 font-mono">
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        w.fraudRiskScore < 10 ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                      }`}>
                        {w.fraudRiskScore}/100 Risk
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-[10px]">
                      <span className={`px-2 py-0.5 rounded ${
                        w.status === 'APPROVED' ? 'bg-emerald-950 text-emerald-400' :
                        w.status === 'REJECTED' ? 'bg-rose-950 text-rose-400' :
                        'bg-amber-950 text-amber-300'
                      }`}>
                        {w.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      {w.status === 'PENDING' || w.status === 'UNDER_REVIEW' ? (
                        <>
                          <button
                            onClick={() => {
                              onApproveWithdrawal(w.id);
                              setAdminActionMsg(`Approved withdrawal #${w.id} for ${w.userName}. Payout initiated.`);
                              setTimeout(() => setAdminActionMsg(null), 4000);
                            }}
                            className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[11px] font-extrabold rounded-lg transition"
                          >
                            Approve & Pay
                          </button>

                          <button
                            onClick={() => {
                              onRejectWithdrawal(w.id, 'Risk parameters failed verification');
                              setAdminActionMsg(`Rejected withdrawal #${w.id}. Balance restored.`);
                              setTimeout(() => setAdminActionMsg(null), 4000);
                            }}
                            className="px-3 py-1 bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 text-[11px] font-bold rounded-lg transition"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-[10px] text-slate-500 italic">Action Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Manual Adjustment Modal */}
      {showAdjustModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Manual Admin Ledger Adjustment</span>
              </h3>
              <button onClick={() => setShowAdjustModal(false)} className="text-slate-400 text-sm">✕</button>
            </div>

            <form onSubmit={handleAdjustSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-400 font-semibold">Adjustment Action</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setAdjustType('CREDIT')}
                    className={`py-2 text-xs font-bold rounded-xl border ${
                      adjustType === 'CREDIT'
                        ? 'bg-emerald-950 border-emerald-600 text-emerald-300'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    + Credit Funds
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType('DEBIT')}
                    className={`py-2 text-xs font-bold rounded-xl border ${
                      adjustType === 'DEBIT'
                        ? 'bg-rose-950 border-rose-600 text-rose-300'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    - Debit / Fee
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-semibold">Amount ($ USD)</label>
                <input
                  type="number"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mt-1 font-mono focus:outline-none focus:border-emerald-400"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-semibold">Audit Reason / Note</label>
                <input
                  type="text"
                  value={adjustNote}
                  onChange={(e) => setAdjustNote(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mt-1 focus:outline-none focus:border-emerald-400"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl"
                >
                  Execute Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
