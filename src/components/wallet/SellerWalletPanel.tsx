import React, { useState } from 'react';
import { SellerWalletState, WithdrawalRequest } from '../../types/domain';
import {
  Store,
  DollarSign,
  TrendingUp,
  Clock,
  ShieldCheck,
  Building,
  ArrowUpRight,
  FileText,
  Download,
  AlertTriangle,
  CheckCircle2,
  Lock,
  MinusCircle,
  HelpCircle
} from 'lucide-react';

interface SellerWalletPanelProps {
  seller: SellerWalletState;
  onRequestWithdrawal: (req: Partial<WithdrawalRequest>) => void;
  currencyRate: number;
  currencySymbol: string;
}

export const SellerWalletPanel: React.FC<SellerWalletPanelProps> = ({
  seller,
  onRequestWithdrawal,
  currencyRate,
  currencySymbol,
}) => {
  const [showWithdrawModal, setShowWithdrawModal] = useState<boolean>(false);
  const [withdrawAmt, setWithdrawAmt] = useState<number>(seller.withdrawableBalance);
  const [payoutMethod, setPayoutMethod] = useState<'BANK_TRANSFER' | 'PAYPAL' | 'STRIPE' | 'CRYPTO'>('BANK_TRANSFER');
  const [bankDetails, setBankDetails] = useState<string>('Chase Lockbox • Account ****9921');
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState<string | null>(null);

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmt <= 0 || withdrawAmt > seller.withdrawableBalance) return;

    onRequestWithdrawal({
      userId: seller.merchantId,
      userName: seller.merchantName,
      userRole: 'SELLER',
      amount: withdrawAmt,
      currency: 'USD',
      payoutMethod,
      accountDetails: bankDetails,
      status: 'PENDING',
      fraudRiskScore: 3,
      adminNote: 'Submitted via Seller Central Financial Portal',
    });

    setShowWithdrawModal(false);
    setSubmitSuccessMsg(`Withdrawal request for ${currencySymbol}${(withdrawAmt * currencyRate).toFixed(2)} submitted for admin review.`);
    setTimeout(() => setSubmitSuccessMsg(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-[#131921] border border-[#37475a] p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-[#febd69] text-slate-950 rounded-xl font-bold">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black text-[#febd69] uppercase">Seller Central Wallet</span>
              <span className="text-slate-500">•</span>
              <span className="text-xs font-semibold text-slate-300">{seller.merchantName}</span>
            </div>
            <h2 className="text-lg font-black text-white">Merchant Financial & Settlement Dashboard</h2>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="px-5 py-2.5 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-extrabold text-xs rounded-xl transition shadow flex items-center space-x-1.5"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Request Payout / Withdrawal</span>
          </button>
        </div>
      </div>

      {submitSuccessMsg && (
        <div className="p-3 bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-bold rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{submitSuccessMsg}</span>
        </div>
      )}

      {/* Main Balances Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-slate-900 border border-emerald-800/80 p-4 rounded-2xl shadow-lg">
          <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Available Balance</div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
            {currencySymbol}{(seller.availableBalance * currencyRate).toFixed(2)}
          </div>
          <span className="text-[9px] text-emerald-400 font-semibold">Ready for payout</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="text-[10px] text-slate-400 uppercase font-mono font-bold flex items-center space-x-1">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>Pending Balance</span>
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono mt-1">
            {currencySymbol}{(seller.pendingBalance * currencyRate).toFixed(2)}
          </div>
          <span className="text-[9px] text-slate-500">Awaiting FBA delivery</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="text-[10px] text-slate-400 uppercase font-mono font-bold flex items-center space-x-1">
            <Lock className="w-3 h-3 text-sky-400" />
            <span>Reserved Balance</span>
          </div>
          <div className="text-2xl font-black text-sky-400 font-mono mt-1">
            {currencySymbol}{(seller.reservedBalance * currencyRate).toFixed(2)}
          </div>
          <span className="text-[9px] text-slate-500">Dispute reserve</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="text-[10px] text-slate-400 uppercase font-mono font-bold flex items-center space-x-1">
            <ArrowUpRight className="w-3 h-3 text-[#febd69]" />
            <span>Withdrawable</span>
          </div>
          <div className="text-2xl font-black text-[#febd69] font-mono mt-1">
            {currencySymbol}{(seller.withdrawableBalance * currencyRate).toFixed(2)}
          </div>
          <span className="text-[9px] text-slate-500">Net clear funds</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl col-span-2 md:col-span-1">
          <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Total Settled</div>
          <div className="text-2xl font-black text-white font-mono mt-1">
            {currencySymbol}{(seller.totalSettled * currencyRate).toFixed(2)}
          </div>
          <span className="text-[9px] text-slate-500">Lifetime earnings</span>
        </div>
      </div>

      {/* Deductions & Adjustments Breakdown Cards */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <MinusCircle className="w-4 h-4 text-rose-400" />
            <span>Marketplace Fee Deductions & Tax Adjustments</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">Real-time ledger audit</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400 font-mono">Commission Deducted</div>
            <div className="text-sm font-bold text-rose-400 font-mono mt-0.5">
              -{currencySymbol}{(seller.commissionDeducted * currencyRate).toFixed(2)}
            </div>
            <div className="text-[9px] text-slate-500">5% Platform Standard Fee</div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400 font-mono">Marketplace Fees</div>
            <div className="text-sm font-bold text-rose-400 font-mono mt-0.5">
              -{currencySymbol}{(seller.marketplaceFees * currencyRate).toFixed(2)}
            </div>
            <div className="text-[9px] text-slate-500">FBA & Warehousing</div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400 font-mono">Refund Adjustments</div>
            <div className="text-sm font-bold text-amber-400 font-mono mt-0.5">
              -{currencySymbol}{(seller.refundAdjustments * currencyRate).toFixed(2)}
            </div>
            <div className="text-[9px] text-slate-500">Customer returns</div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400 font-mono">Chargebacks</div>
            <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
              {currencySymbol}{(seller.chargebacks * currencyRate).toFixed(2)}
            </div>
            <div className="text-[9px] text-slate-500">Zero open disputes</div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 col-span-2 md:col-span-1">
            <div className="text-[10px] text-slate-400 font-mono">Taxes Adjusted</div>
            <div className="text-sm font-bold text-blue-400 font-mono mt-0.5">
              -{currencySymbol}{(seller.taxesAdjusted * currencyRate).toFixed(2)}
            </div>
            <div className="text-[9px] text-slate-500">Sales tax withheld</div>
          </div>
        </div>
      </div>

      {/* Withdrawal Request Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white flex items-center space-x-2">
                <Building className="w-4 h-4 text-[#febd69]" />
                <span>Submit Seller Withdrawal Request</span>
              </h3>
              <button onClick={() => setShowWithdrawModal(false)} className="text-slate-400 text-sm">✕</button>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-400 font-semibold">Withdrawable Balance</label>
                <div className="text-lg font-black font-mono text-emerald-400 mt-0.5">
                  {currencySymbol}{(seller.withdrawableBalance * currencyRate).toFixed(2)}
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-semibold">Payout Method</label>
                <select
                  value={payoutMethod}
                  onChange={(e) => setPayoutMethod(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mt-1 focus:outline-none focus:border-[#febd69]"
                >
                  <option value="BANK_TRANSFER">Direct Bank ACH Wire Transfer</option>
                  <option value="STRIPE">Stripe Express Connect</option>
                  <option value="PAYPAL">PayPal Business Account</option>
                  <option value="CRYPTO">USDC Stablecoin Settlement</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-semibold">Bank / Account Details</label>
                <input
                  type="text"
                  value={bankDetails}
                  onChange={(e) => setBankDetails(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mt-1 font-mono focus:outline-none focus:border-[#febd69]"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-semibold">Withdrawal Amount ($ USD)</label>
                <input
                  type="number"
                  max={seller.withdrawableBalance}
                  value={withdrawAmt}
                  onChange={(e) => setWithdrawAmt(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mt-1 font-mono focus:outline-none focus:border-[#febd69]"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-extrabold text-xs rounded-xl"
                >
                  Confirm Withdrawal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
