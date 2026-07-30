import React from 'react';
import { OrderFraudScan } from '../../types/oms';
import { ShieldAlert, ShieldCheck, AlertTriangle, CheckCircle2, XCircle, UserX, Lock, Eye } from 'lucide-react';

interface OrderFraudDetectionShieldViewProps {
  fraudScans: OrderFraudScan[];
  onClearFlag: (scanId: string) => void;
  onCancelFraudOrder: (scanId: string) => void;
}

export const OrderFraudDetectionShieldView: React.FC<OrderFraudDetectionShieldViewProps> = ({
  fraudScans,
  onClearFlag,
  onCancelFraudOrder,
}) => {
  const criticalCount = fraudScans.filter((s) => s.riskLevel === 'CRITICAL' || s.riskLevel === 'HIGH').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-rose-400 uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            <span>COMMERCE_ZON SENTINEL AI FRAUD ENGINE</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Autonomous Order Fraud & High-Risk Risk Shield</h2>
          <p className="text-xs text-slate-400 mt-1">
            Machine learning scanner analyzing IP geolocations, disposable emails, velocity spikes, and freight forwarder proxies
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-rose-500/10 border border-rose-500/30 p-3 rounded-2xl text-rose-300 text-xs font-bold">
          <AlertTriangle className="w-5 h-5 text-rose-400" />
          <span>{criticalCount} High Risk Orders Awaiting Admin Clearance</span>
        </div>
      </div>

      {/* Fraud Scan Cards */}
      <div className="space-y-4">
        {fraudScans.map((scan) => {
          const isHighRisk = scan.riskLevel === 'CRITICAL' || scan.riskLevel === 'HIGH';

          return (
            <div
              key={scan.id}
              className={`p-5 rounded-2xl border space-y-4 transition shadow-xl ${
                isHighRisk
                  ? 'bg-slate-900 border-rose-500/50'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-white text-sm">Scan #{scan.id}</span>
                    <span className="text-xs font-bold text-slate-400 font-mono">Order: {scan.orderId}</span>
                  </div>
                  <div className="text-xs text-slate-300 font-mono mt-0.5">
                    Customer Email: <strong className="text-white">{scan.customerEmail}</strong>
                  </div>
                </div>

                {/* Risk Gauge */}
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Risk Score</div>
                    <div
                      className={`text-lg font-black font-mono ${
                        scan.riskScore > 50 ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {scan.riskScore} / 100
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 text-xs font-black rounded-xl uppercase ${
                      isHighRisk
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {scan.riskLevel} RISK
                  </span>
                </div>
              </div>

              {/* Risk Reasons */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  AI Risk Signals Detected ({scan.reasons.length}):
                </div>
                <div className="space-y-1">
                  {scan.reasons.map((r, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-slate-200">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Admin Actions */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-xs">
                <div className="text-[10px] text-slate-500 font-mono">
                  Flagged at: {new Date(scan.flaggedAt).toLocaleString()}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onClearFlag(scan.id)}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition flex items-center space-x-1"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Clear Risk Flag (False Positive)</span>
                  </button>

                  <button
                    onClick={() => onCancelFraudOrder(scan.id)}
                    className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition flex items-center space-x-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Cancel Fraudulent Order & Refund</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
