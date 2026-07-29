import React, { useState } from 'react';
import { FraudScanRecord } from '../../types/payments';
import { MOCK_FRAUD_SCANS } from '../../data/paymentsMockData';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  Globe,
  Radio,
  Search,
} from 'lucide-react';

export const FraudDetectionShieldView: React.FC = () => {
  const [scans, setScans] = useState<FraudScanRecord[]>(MOCK_FRAUD_SCANS);

  const handleUpdateScanStatus = (scanId: string, newStatus: 'CLEARED' | 'BLOCKED') => {
    setScans((prev) =>
      prev.map((s) => (s.scanId === scanId ? { ...s, status: newStatus } : s))
    );
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>SENTINEL AI PAYMENT FRAUD & RISK SHIELD</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Real-Time Payment Fraud Radar & Carding Shield</h2>
          <p className="text-xs text-slate-400 mt-1">
            Machine learning anomaly scanner inspecting IP velocity, proxy proxies, disposable emails, BIN card mismatches & stolen credentials
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-rose-500/10 border border-rose-500/30 px-4 py-2 rounded-xl text-rose-300 text-xs font-mono">
          <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
          <span>Sentinel AI Guard Active</span>
        </div>
      </div>

      {/* Fraud Scan Records */}
      <div className="space-y-4">
        {scans.map((scan) => (
          <div key={scan.scanId} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-white text-base">Scan #{scan.scanId}</span>
                  <span className="text-slate-400 font-mono text-xs">Tx: {scan.transactionId}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">Scanned at: {scan.scannedAt}</div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="px-4 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-black font-mono text-sm">
                  Risk Score: {scan.riskScore}/100 ({scan.riskLevel})
                </div>

                <span
                  className={`px-3 py-1 rounded-xl text-xs font-black ${
                    scan.status === 'FLAGGED'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : scan.status === 'CLEARED'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {scan.status}
                </span>
              </div>
            </div>

            {/* Risk Signals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-slate-300 uppercase text-[10px] tracking-wider block">
                  Telemetric Security Attributes:
                </span>
                <div className="space-y-1 font-mono text-slate-400">
                  <div className="flex justify-between">
                    <span>IP Address:</span>
                    <span className="text-white font-bold">{scan.ipAddress} ({scan.ipCountry})</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Proxy / VPN Detected:</span>
                    <span className={scan.isProxyVPN ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                      {scan.isProxyVPN ? 'YES (TOR Proxy)' : 'NO'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Issuer Card Country:</span>
                    <span className="text-white">{scan.cardCountry}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-slate-300 uppercase text-[10px] tracking-wider block">
                  Detected Risk Signals:
                </span>
                <ul className="list-disc list-inside text-rose-300 space-y-1 font-mono">
                  {scan.signals.map((sig, i) => (
                    <li key={i}>{sig}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Admin Override Action Buttons */}
            {scan.status === 'FLAGGED' && (
              <div className="flex items-center justify-end space-x-3 pt-2 border-t border-slate-800">
                <button
                  onClick={() => handleUpdateScanStatus(scan.scanId, 'CLEARED')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition flex items-center space-x-1"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Clear False Positive & Capture Payment</span>
                </button>

                <button
                  onClick={() => handleUpdateScanStatus(scan.scanId, 'BLOCKED')}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition flex items-center space-x-1"
                >
                  <Lock className="w-4 h-4" />
                  <span>Block Transaction & Blacklist IP</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
