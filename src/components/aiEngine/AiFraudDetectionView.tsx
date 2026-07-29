import React, { useState } from 'react';
import { 
  ShieldAlert, AlertTriangle, CheckCircle2, XCircle, Search, Filter, Lock, Eye, RefreshCw, UserX, ShieldCheck
} from 'lucide-react';
import { FraudAlertItem } from '../../types/aiEngine';
import { MOCK_FRAUD_ALERTS } from '../../data/mockAiEngineData';

export const AiFraudDetectionView: React.FC = () => {
  const [alerts, setAlerts] = useState<FraudAlertItem[]>(MOCK_FRAUD_ALERTS);

  const handleUpdateStatus = (id: string, status: FraudAlertItem['status']) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/95 border border-slate-800 p-5 rounded-xl space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">AI Fraud, Risk & Security Protection Engine</h2>
              <p className="text-xs text-slate-400">Graph Neural Networks & XGBoost for fake review detection, carding, return fraud & bot mitigation</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold font-mono">
              Active Fraud Threat Shield: 99.8% Blocked
            </span>
          </div>
        </div>
      </div>

      {/* Fraud Alert Queue */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>High Risk Alert Queue</span>
          </h3>

          <span className="text-xs text-slate-400 font-mono">Real-Time Event Stream</span>
        </div>

        <div className="space-y-3">
          {alerts.map((alert) => (
            <div 
              key={alert.id}
              className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-rose-500/40 transition"
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center space-x-2 text-xs">
                  <span className={`px-2 py-0.5 rounded font-black font-mono text-[10px] ${
                    alert.severity === 'Critical' 
                      ? 'bg-rose-500 text-white' 
                      : alert.severity === 'High' 
                      ? 'bg-amber-500 text-slate-950' 
                      : 'bg-sky-500 text-slate-950'
                  }`}>
                    {alert.severity} Risk ({alert.riskScore}/100)
                  </span>

                  <span className="text-amber-400 font-bold">{alert.fraudType}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400 font-mono text-[10px]">{alert.detectedAt}</span>
                </div>

                <h4 className="text-xs font-bold text-white">{alert.entityName}</h4>
                <p className="text-xs text-slate-300">{alert.details}</p>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <span className={`px-2.5 py-1 rounded text-xs font-bold font-mono ${
                  alert.status === 'Mitigated'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : alert.status === 'Investigating'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {alert.status}
                </span>

                {alert.status !== 'Mitigated' && (
                  <button
                    onClick={() => handleUpdateStatus(alert.id, 'Mitigated')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition shadow"
                  >
                    Mitigate Threat
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
