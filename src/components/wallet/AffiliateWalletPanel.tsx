import React, { useState } from 'react';
import { AffiliateWalletState, WithdrawalRequest } from '../../types/domain';
import {
  Users,
  Award,
  DollarSign,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Share2,
  Copy,
  CheckCircle2,
  Gift,
  Link
} from 'lucide-react';

interface AffiliateWalletPanelProps {
  affiliate: AffiliateWalletState;
  onRequestWithdrawal: (req: Partial<WithdrawalRequest>) => void;
  currencyRate: number;
  currencySymbol: string;
}

export const AffiliateWalletPanel: React.FC<AffiliateWalletPanelProps> = ({
  affiliate,
  onRequestWithdrawal,
  currencyRate,
  currencySymbol,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmt, setWithdrawAmt] = useState(affiliate.withdrawableBalance);
  const [paypalEmail, setPaypalEmail] = useState('payouts@techprime.network');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const referralLink = `https://amazon.commercezone.com/ref/${affiliate.affiliateId}?promo=PRIME2026`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmt <= 0 || withdrawAmt > affiliate.withdrawableBalance) return;

    onRequestWithdrawal({
      userId: affiliate.affiliateId,
      userName: affiliate.affiliateName,
      userRole: 'AFFILIATE',
      amount: withdrawAmt,
      currency: 'USD',
      payoutMethod: 'PAYPAL',
      accountDetails: paypalEmail,
      status: 'PENDING',
      fraudRiskScore: 2,
      adminNote: 'Affiliate commission payout request',
    });

    setShowWithdrawModal(false);
    setSuccessMsg(`Affiliate payout request for ${currencySymbol}${(withdrawAmt * currencyRate).toFixed(2)} submitted successfully!`);
    setTimeout(() => setSuccessMsg(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="bg-[#131921] border border-[#37475a] p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-purple-500 text-slate-950 rounded-xl font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black text-purple-400 uppercase">Affiliate & Ambassador Network</span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-300 font-semibold">{affiliate.affiliateName}</span>
            </div>
            <h2 className="text-lg font-black text-white">Affiliate Commission & Referral Earnings Hub</h2>
          </div>
        </div>

        <button
          onClick={() => setShowWithdrawModal(true)}
          className="px-5 py-2.5 bg-purple-500 hover:bg-purple-400 text-slate-950 font-extrabold text-xs rounded-xl transition shadow flex items-center space-x-1.5"
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>Request Affiliate Cashout</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-bold rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Balances Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="bg-slate-900 border border-purple-800/80 p-3.5 rounded-2xl col-span-2">
          <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Approved Commission</div>
          <div className="text-2xl font-black text-purple-400 font-mono mt-1">
            {currencySymbol}{(affiliate.approvedCommission * currencyRate).toFixed(2)}
          </div>
          <span className="text-[9px] text-purple-300 font-semibold">Available to withdraw</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
          <div className="text-[10px] text-slate-400 uppercase font-mono font-bold flex items-center space-x-1">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>Pending</span>
          </div>
          <div className="text-lg font-black text-amber-400 font-mono mt-1">
            {currencySymbol}{(affiliate.pendingCommission * currencyRate).toFixed(2)}
          </div>
          <span className="text-[9px] text-slate-500">30-day return window</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
          <div className="text-[10px] text-slate-400 uppercase font-mono font-bold flex items-center space-x-1">
            <Award className="w-3 h-3 text-emerald-400" />
            <span>Paid Out</span>
          </div>
          <div className="text-lg font-black text-emerald-400 font-mono mt-1">
            {currencySymbol}{(affiliate.paidCommission * currencyRate).toFixed(2)}
          </div>
          <span className="text-[9px] text-slate-500">Lifetime paid</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
          <div className="text-[10px] text-slate-400 uppercase font-mono font-bold flex items-center space-x-1">
            <Gift className="w-3 h-3 text-amber-300" />
            <span>Bonus Rewards</span>
          </div>
          <div className="text-lg font-black text-amber-300 font-mono mt-1">
            {currencySymbol}{(affiliate.bonusRewards * currencyRate).toFixed(2)}
          </div>
          <span className="text-[9px] text-slate-500">Tier achievement bonus</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
          <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Referral Sales</div>
          <div className="text-lg font-black text-sky-400 font-mono mt-1">
            {currencySymbol}{(affiliate.referralEarnings * currencyRate).toFixed(2)}
          </div>
          <span className="text-[9px] text-slate-500">3% rate</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
          <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Cashback Rewards</div>
          <div className="text-lg font-black text-pink-400 font-mono mt-1">
            {currencySymbol}{(affiliate.cashbackRewards * currencyRate).toFixed(2)}
          </div>
          <span className="text-[9px] text-slate-500">Influencer perk</span>
        </div>
      </div>

      {/* Trackable Referral Link Generator Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2 text-sm font-bold text-white">
            <Link className="w-5 h-5 text-purple-400" />
            <span>Your Exclusive Amazon Trackable Affiliate Link</span>
          </div>
          <span className="text-xs text-purple-400 font-mono font-bold">3.0% Commission Rate</span>
        </div>

        <p className="text-xs text-slate-400">
          Share this link on your channels. Any customer purchasing within 24 hours automatically credits commission to your affiliate wallet.
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            value={referralLink}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-purple-300 font-mono focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-400 text-slate-950 font-extrabold text-xs rounded-xl transition flex items-center space-x-1"
          >
            <Copy className="w-4 h-4" />
            <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
          </button>
        </div>
      </div>

      {/* Modal Withdrawal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Users className="w-4 h-4 text-purple-400" />
                <span>Affiliate Commission Cashout</span>
              </h3>
              <button onClick={() => setShowWithdrawModal(false)} className="text-slate-400 text-sm">✕</button>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-400 font-semibold">PayPal Payout Email</label>
                <input
                  type="email"
                  value={paypalEmail}
                  onChange={(e) => setPaypalEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mt-1 font-mono focus:outline-none focus:border-purple-400"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-semibold">Amount ($ USD)</label>
                <input
                  type="number"
                  max={affiliate.withdrawableBalance}
                  value={withdrawAmt}
                  onChange={(e) => setWithdrawAmt(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mt-1 font-mono focus:outline-none focus:border-purple-400"
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
                  className="px-5 py-2 bg-purple-500 hover:bg-purple-400 text-slate-950 font-extrabold text-xs rounded-xl"
                >
                  Request Cashout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
