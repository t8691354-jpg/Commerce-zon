import React, { useState } from 'react';
import { SubscriptionBillingRecord } from '../../types/payments';
import { MOCK_SUBSCRIPTION_BILLING } from '../../data/paymentsMockData';
import {
  CalendarClock,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
  Building2,
  DollarSign,
  Lock,
} from 'lucide-react';

export const SubscriptionBillingEngineView: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionBillingRecord[]>(
    MOCK_SUBSCRIPTION_BILLING
  );

  const handleRetryBilling = (id: string) => {
    setSubscriptions((prev) =>
      prev.map((sub) =>
        sub.id === id
          ? {
              ...sub,
              billingStatus: 'ACTIVE',
              failedAttempts: 0,
              lastPaymentStatus: 'SUCCESS',
            }
          : sub
      )
    );
  };

  const handleToggleSuspend = (id: string) => {
    setSubscriptions((prev) =>
      prev.map((sub) =>
        sub.id === id
          ? {
              ...sub,
              billingStatus: sub.billingStatus === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED',
            }
          : sub
      )
    );
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <CalendarClock className="w-4 h-4 text-purple-400" />
            <span>SELLER SUBSCRIPTION RECURRING BILLING ENGINE</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Professional & Enterprise Seller Subscriptions</h2>
          <p className="text-xs text-slate-400 mt-1">
            Automated monthly seller plan recurring billing ($39.99/mo Professional, $299.00/mo Enterprise), dunning management & grace period controls
          </p>
        </div>
      </div>

      {/* Subscriptions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subscriptions.map((sub) => (
          <div key={sub.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-bold text-white text-sm">{sub.sellerName}</span>
                <div className="text-[10px] text-slate-400 font-mono">{sub.sellerEmail}</div>
              </div>

              <span
                className={`px-2.5 py-0.5 rounded-xl text-[10px] font-black uppercase ${
                  sub.billingStatus === 'ACTIVE'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : sub.billingStatus === 'GRACE_PERIOD'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}
              >
                {sub.billingStatus}
              </span>
            </div>

            <div className="space-y-2 font-mono text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between">
                <span>Plan Level:</span>
                <span className="text-[#febd69] font-bold">{sub.planName}</span>
              </div>

              <div className="flex justify-between">
                <span>Monthly Recurring Charge:</span>
                <span className="text-white font-bold">${sub.monthlyFeeUSD.toFixed(2)} USD</span>
              </div>

              <div className="flex justify-between">
                <span>Next Billing Date:</span>
                <span className="text-sky-400">{sub.nextBillingDate.slice(0, 10)}</span>
              </div>

              <div className="flex justify-between">
                <span>Failed Attempt Counter:</span>
                <span className={sub.failedAttempts > 0 ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                  {sub.failedAttempts} Attempts
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              {sub.billingStatus === 'GRACE_PERIOD' && (
                <button
                  onClick={() => handleRetryBilling(sub.id)}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs transition flex items-center space-x-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Charge Now</span>
                </button>
              )}

              <button
                onClick={() => handleToggleSuspend(sub.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ml-auto ${
                  sub.billingStatus === 'SUSPENDED'
                    ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                    : 'bg-rose-600/30 text-rose-300 hover:bg-rose-600 text-white'
                }`}
              >
                {sub.billingStatus === 'SUSPENDED' ? 'Reactivate Store' : 'Suspend Store'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
