import React, { useState } from 'react';
import { MOCK_FRAUD_CASES } from '../../data/returnsMockData';
import { ReturnFraudCase } from '../../types/returns';
import {
  ShieldAlert,
  AlertTriangle,
  Lock,
  CheckCircle2,
  UserX,
  Search,
  Activity,
  Zap,
} from 'lucide-react';

export const FraudDetectionView: React.FC = () => {
  const [cases, setCases] = useState<ReturnFraudCase[]>(MOCK_FRAUD_CASES);
  const [searchTerm, setSearchTerm] = useState('');

  const handleUpdateCaseStatus = (caseId: string, status: ReturnFraudCase['status']) => {
    setCases((prev) =>
      prev.map((c) => (c.caseId === caseId ? { ...c, status } : c))
    );
  };

  const filtered = cases.filter(
    (c) =>
      c.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.flagReason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.buyerId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <span>AI Return Abuse & Fraud Detection Risk Engine</span>
          </h2>
          <p className="text-xs text-slate-400">
            Detect serial returners, empty box claims, serial number mismatches, and automated refund harvesting.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-xs font-bold rounded-lg flex items-center space-x-1">
            <Lock className="w-3.5 h-3.5" />
            <span>High Risk Cases Flagged: {cases.length}</span>
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search flagged buyer ID or risk reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
          />
        </div>
      </div>

      {/* Fraud Cases Cards */}
      <div className="space-y-4">
        {filtered.map((item) => {
          const isCritical = item.riskScore >= 80;

          return (
            <div
              key={item.caseId}
              className={`p-5 rounded-xl border transition space-y-4 ${
                isCritical
                  ? 'bg-slate-900 border-rose-500/50 shadow-lg'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-3">
                  <div
                    className={`px-3 py-1 rounded-lg text-xs font-black font-mono ${
                      isCritical ? 'bg-rose-500 text-slate-950' : 'bg-amber-500 text-slate-950'
                    }`}
                  >
                    Risk Score: {item.riskScore} / 100
                  </div>
                  <div>
                    <span className="font-bold text-white text-sm">{item.buyerName}</span>
                    <span className="text-xs text-slate-400 font-mono ml-2">({item.buyerId})</span>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold border uppercase ${
                    item.status === 'ACCOUNT_FROZEN'
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                      : item.status === 'VERIFIED_FRAUD'
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                      : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              {/* Telemetry Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-500 block">Total Lifetime Orders</span>
                  <span className="font-mono text-white font-bold">${item.totalOrderValueUSD.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-semibold">Returned Value</span>
                  <span className="font-mono text-rose-400 font-bold">${item.returnedValueUSD.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-semibold">Return Frequency Rate</span>
                  <span className="font-mono text-amber-400 font-bold">{item.returnRatePercent}%</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-semibold">Total Claims Filed</span>
                  <span className="font-mono text-white font-bold">{item.totalReturnsCount} Claims</span>
                </div>
              </div>

              <div className="text-xs text-rose-300 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span className="font-semibold">Flag Reason: {item.flagReason}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 pt-1">
                {item.status !== 'ACCOUNT_FROZEN' && (
                  <button
                    onClick={() => handleUpdateCaseStatus(item.caseId, 'ACCOUNT_FROZEN')}
                    className="px-3.5 py-1.5 bg-rose-500 hover:bg-rose-400 text-slate-950 font-black text-xs rounded-lg flex items-center space-x-1"
                  >
                    <UserX className="w-3.5 h-3.5" />
                    <span>Freeze Buyer Account & Refund Engine</span>
                  </button>
                )}

                {item.status !== 'CLEARED' && (
                  <button
                    onClick={() => handleUpdateCaseStatus(item.caseId, 'CLEARED')}
                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-lg flex items-center space-x-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Clear Flag (Mark Verified)</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
