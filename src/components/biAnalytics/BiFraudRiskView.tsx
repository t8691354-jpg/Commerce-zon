import React, { useState } from 'react';
import { MOCK_FRAUD_RISK_BI } from '../../data/mockBiAnalytics';
import { ShieldAlert, AlertTriangle, Lock, Eye, CheckCircle2, ShieldCheck, XCircle } from 'lucide-react';

export const BiFraudRiskView: React.FC = () => {
  const [fraudItems, setFraudItems] = useState(MOCK_FRAUD_RISK_BI);

  const handleAction = (id: string, newStatus: 'Blocked' | 'Resolved') => {
    setFraudItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
          <span className="text-xs text-slate-400">Blocked Fraud Value (30d)</span>
          <p className="text-2xl font-black text-emerald-400 font-mono">$4,820,900</p>
          <p className="text-xs text-emerald-400 font-semibold">100% Automated Prevention</p>
        </div>
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
          <span className="text-xs text-slate-400">Flagged Risk Cases</span>
          <p className="text-2xl font-black text-amber-400 font-mono">{fraudItems.filter(i => i.status === 'Flagged' || i.status === 'Investigating').length}</p>
          <p className="text-xs text-slate-400">Under active Security Ops review</p>
        </div>
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
          <span className="text-xs text-slate-400">Fake Review Bot Score</span>
          <p className="text-2xl font-black text-blue-400 font-mono">0.001%</p>
          <p className="text-xs text-emerald-400 font-semibold">NLP Bot Net Purged</p>
        </div>
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
          <span className="text-xs text-slate-400">Account Abuse Defense</span>
          <p className="text-2xl font-black text-purple-400 font-mono">Active</p>
          <p className="text-xs text-slate-400">IP Cluster & Fingerprint Rate Limit</p>
        </div>
      </div>

      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-400" />
          Real-Time Threat Detection & High-Risk Case Feed
        </h3>

        <div className="space-y-3">
          {fraudItems.map((item) => (
            <div key={item.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                    item.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}>
                    {item.severity}
                  </span>
                  <span className="font-bold text-slate-200 text-xs">{item.type}</span>
                  <span className="text-xs text-slate-400 font-mono">ID: {item.id}</span>
                </div>
                <p className="text-xs text-slate-300"><strong className="text-amber-400">{item.targetEntity}</strong> — {item.details}</p>
                <span className="text-[11px] text-slate-500 font-mono">Risk Score: <strong className="text-rose-400">{item.riskScore}/100</strong> • {item.timestamp}</span>
              </div>

              <div className="flex items-center space-x-2 self-end sm:self-center">
                <span className={`px-2.5 py-1 rounded text-xs font-bold font-mono ${
                  item.status === 'Blocked' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}>
                  {item.status}
                </span>
                {item.status !== 'Blocked' && (
                  <button
                    onClick={() => handleAction(item.id, 'Blocked')}
                    className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded transition shadow"
                  >
                    Block Entity
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
