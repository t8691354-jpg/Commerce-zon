import React, { useState } from 'react';
import { MOCK_FRAUD_CASES } from '../../data/mockSecurityFraud';
import { FraudDetectionCase, FraudType } from '../../types/securityFraud';
import {
  ShieldAlert,
  AlertTriangle,
  Bot,
  UserX,
  RotateCcw,
  Tag,
  CreditCard,
  CheckCircle2,
  XCircle,
  Eye,
  Search,
  Filter,
} from 'lucide-react';

export const FraudDetectionEngineView: React.FC = () => {
  const [cases, setCases] = useState<FraudDetectionCase[]>(MOCK_FRAUD_CASES);
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const fraudTypes: FraudType[] = [
    'Card Testing',
    'Fake Review',
    'Return Fraud',
    'Coupon Abuse',
    'Account Takeover',
    'Fake Account',
    'Fake Seller',
    'Multi-Account Abuse',
    'Bot Activity',
  ];

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.caseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.entityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.detectionReason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'ALL' || c.fraudType === selectedType;
    return matchesSearch && matchesType;
  });

  const handleAction = (caseId: string, newStatus: FraudDetectionCase['status'], note: string) => {
    setCases((prev) =>
      prev.map((c) => (c.caseId === caseId ? { ...c, status: newStatus } : c))
    );
    setActionMsg(`Case #${caseId} updated to state "${newStatus}". Action applied: ${note}`);
    setTimeout(() => setActionMsg(null), 3500);
  };

  return (
    <div className="space-y-6">
      {actionMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* Fraud Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
          <span className="text-xs text-slate-400">Total Flagged Fraud Cases</span>
          <p className="text-2xl font-black text-rose-400 font-mono">{cases.length}</p>
          <span className="text-[10px] text-rose-300 font-semibold">Real-time NLP & ML Classifier</span>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
          <span className="text-xs text-slate-400 font-medium">Avg Confidence Score</span>
          <p className="text-2xl font-black text-emerald-400 font-mono">96.8%</p>
          <span className="text-[10px] text-emerald-300 font-semibold">Low False-Positive Rate</span>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
          <span className="text-xs text-slate-400 font-medium">Bot Network Mitigation</span>
          <p className="text-2xl font-black text-blue-400 font-mono">100% Auto</p>
          <span className="text-[10px] text-blue-300 font-semibold">Cloud WAF Challenge Engine</span>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
          <span className="text-xs text-slate-400 font-medium">Chargeback Prevention</span>
          <p className="text-2xl font-black text-amber-400 font-mono">$12.8M Saved</p>
          <span className="text-[10px] text-amber-300 font-semibold">Pre-Dispute Automated Defense</span>
        </div>
      </div>

      {/* Fraud Cases Management Panel */}
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              Automated AI Fraud Detection Engine (Live Case Feed)
            </h3>
            <p className="text-xs text-slate-400">
              Detect fake accounts, reviews, coupon abuse, chargeback fraud & multi-account clusters
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search case, entity, reason..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:border-amber-500 outline-none w-64 font-mono"
              />
            </div>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 font-mono"
            >
              <option value="ALL">All Fraud Types</option>
              {fraudTypes.map((ft) => (
                <option key={ft} value={ft}>
                  {ft}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Case Cards */}
        <div className="space-y-3">
          {filteredCases.map((c) => (
            <div
              key={c.caseId}
              className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 shadow-lg"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                      c.severity === 'CRITICAL'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    }`}
                  >
                    {c.severity}
                  </span>
                  <span className="font-bold text-slate-100 text-sm">{c.fraudType}</span>
                  <span className="text-xs text-slate-400 font-mono">#{c.caseId}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-400 font-mono">
                    Risk Score: <strong className="text-rose-400">{c.riskScore}/100</strong>
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Confidence: <strong className="text-emerald-400">{c.confidenceScorePct}%</strong>
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded text-xs font-bold font-mono ${
                      c.status === 'Blocked'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-300 space-y-1 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                <p>
                  Entity Target: <strong className="text-amber-400">{c.entityName}</strong> ({c.entityId})
                </p>
                <p>
                  ML Classification Driver: <span className="text-slate-200">{c.detectionReason}</span>
                </p>
                <p>
                  Recommended Policy: <span className="text-purple-300 font-bold">{c.recommendedAction}</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <span className="text-[10px] text-slate-500 font-mono">Detected: {c.timestamp}</span>

                <div className="flex items-center space-x-2">
                  {c.status !== 'Blocked' && (
                    <button
                      onClick={() => handleAction(c.caseId, 'Blocked', 'Account/Order blocked & credentials revoked.')}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs transition shadow"
                    >
                      Block Account / Order
                    </button>
                  )}

                  <button
                    onClick={() => handleAction(c.caseId, 'Under Investigation', 'Enforced Hardware TOTP MFA prompt.')}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-xs transition shadow"
                  >
                    Enforce MFA Challenge
                  </button>

                  <button
                    onClick={() => handleAction(c.caseId, 'Dismissed', 'Dismissed as false positive.')}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg text-xs transition"
                  >
                    Dismiss Case
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
