import React, { useState } from 'react';
import { MOCK_SECURITY_KPIS, MOCK_INCIDENTS, MOCK_FRAUD_CASES } from '../../data/mockSecurityFraud';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Users,
  Activity,
  AlertTriangle,
  Zap,
  Globe,
  Radio,
  Key,
  Server,
  FileCheck,
  Bot,
  Flame,
  Search,
} from 'lucide-react';

export const SecurityOpsDashboardView: React.FC = () => {
  const [threatFilter, setThreatFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM'>('ALL');

  const filteredCases = MOCK_FRAUD_CASES.filter(
    (c) => threatFilter === 'ALL' || c.severity === threatFilter
  );

  return (
    <div className="space-y-6">
      {/* Top Banner - Zero Trust Architecture Status */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 p-6 rounded-2xl border border-rose-500/30 shadow-2xl relative overflow-hidden space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-400">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Real-Time Security Operations Center (SOC) Guard Engine
              </h3>
              <p className="text-xs text-rose-200">
                Zero Trust Architecture • Automated Threat Prevention • Cloud WAF • AI Botnet Mitigation
              </p>
            </div>
          </div>
          <span className="text-xs font-mono px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full font-bold self-start sm:self-auto flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-ping" />
            SOC DEFENSE LEVEL 1: ALL SYSTEMS NORMAL
          </span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {MOCK_SECURITY_KPIS.map((kpi) => (
          <div key={kpi.id} className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2 shadow-lg">
            <div className="flex justify-between items-start">
              <span className="text-[11px] text-slate-400 font-medium leading-tight">{kpi.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                  kpi.status === 'Healthy'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}
              >
                {kpi.status}
              </span>
            </div>

            <p className="text-2xl font-black text-slate-100 font-mono tracking-tight">{kpi.value}</p>

            <p className="text-[10px] text-slate-400 leading-tight">{kpi.description}</p>
          </div>
        ))}
      </div>

      {/* Attack Sources & Threat Trends Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Realtime Threat Case Stream */}
        <div className="lg:col-span-2 bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Flame className="w-5 h-5 text-rose-400 animate-pulse" />
              <h3 className="text-base font-bold text-slate-100">Live Fraud & Threat Event Monitor</h3>
            </div>

            {/* Severity Filter */}
            <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
              {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'] as const).map((sev) => (
                <button
                  key={sev}
                  onClick={() => setThreatFilter(sev)}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition ${
                    threatFilter === sev
                      ? 'bg-rose-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredCases.map((c) => (
              <div
                key={c.caseId}
                className="p-4 bg-slate-950 rounded-xl border border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:border-slate-700"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        c.severity === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          : c.severity === 'HIGH'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                      }`}
                    >
                      {c.severity}
                    </span>
                    <span className="font-bold text-slate-200 text-xs">{c.fraudType}</span>
                    <span className="text-[11px] text-slate-400 font-mono">Case #{c.caseId}</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Target: <strong className="text-amber-400">{c.entityName}</strong>
                  </p>
                  <p className="text-[11px] text-slate-400">{c.detectionReason}</p>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Timestamp: {c.timestamp} • Risk Score:{' '}
                    <strong className="text-rose-400">{c.riskScore}/100</strong> • Confidence:{' '}
                    <strong className="text-emerald-400">{c.confidenceScorePct}%</strong>
                  </span>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-center">
                  <span
                    className={`px-2.5 py-1 rounded text-xs font-bold font-mono ${
                      c.status === 'Blocked'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Active Security Incidents Summary */}
        <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-slate-100 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              Active Incident Tickets
            </span>
            <span className="text-xs font-mono text-rose-400">{MOCK_INCIDENTS.length} Open/Mitigated</span>
          </h3>

          <div className="space-y-3">
            {MOCK_INCIDENTS.map((inc) => (
              <div key={inc.id} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-start">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      inc.severity === 'CRITICAL'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    }`}
                  >
                    {inc.severity}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{inc.id}</span>
                </div>

                <h4 className="text-xs font-bold text-slate-200">{inc.title}</h4>

                <p className="text-[11px] text-slate-400 leading-relaxed">{inc.rootCause}</p>

                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-800 font-mono">
                  <span>Assignee: {inc.assignedTo}</span>
                  <span className="text-emerald-400 font-bold">{inc.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
