import React, { useState } from 'react';
import { MOCK_INCIDENTS } from '../../data/mockSecurityFraud';
import { IncidentRecord, SeverityLevel } from '../../types/securityFraud';
import { ShieldAlert, AlertTriangle, Plus, CheckCircle2, FileText, Download, UserCheck, Clock, Check, RefreshCw } from 'lucide-react';

export const IncidentManagementView: React.FC = () => {
  const [incidents, setIncidents] = useState<IncidentRecord[]>(MOCK_INCIDENTS);
  const [title, setTitle] = useState('');
  const [severity, setSeverity] = useState<SeverityLevel>('HIGH');
  const [category, setCategory] = useState<IncidentRecord['category']>('Account Takeover');
  const [assignee, setAssignee] = useState('Security Ops Team Lead');
  const [rootCause, setRootCause] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newInc: IncidentRecord = {
      id: `INC-2026-00${incidents.length + 5}`,
      title,
      severity,
      category,
      status: 'Investigating',
      assignedTo: assignee,
      createdAt: new Date().toISOString().substring(0, 19).replace('T', ' '),
      rootCause: rootCause || 'Investigation in progress by SOC team.',
      timelineEventsCount: 1,
    };

    setIncidents([newInc, ...incidents]);
    setTitle('');
    setRootCause('');
    setNotification(`Security Incident ${newInc.id} opened and dispatched to ${assignee}!`);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleResolveIncident = (id: string) => {
    setIncidents((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: 'Resolved' } : i))
    );
    setNotification(`Incident Ticket #${id} marked as RESOLVED and post-mortem generated.`);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleExportReport = (id: string) => {
    setNotification(`Exporting Post-Incident Root Cause Analysis (RCA) report for ${id} (.PDF)...`);
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <div className="space-y-6">
      {notification && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form: Create Incident */}
        <form onSubmit={handleCreateIncident} className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              Declare Security Incident Ticket
            </h3>
            <p className="text-xs text-slate-400">Dispatch SOC alerts, set severity level & assign engineering leads</p>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Incident Title / Summary</label>
              <input
                type="text"
                placeholder="e.g. Credential stuffing anomaly on /api/v1/login"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-rose-500 outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Severity Level</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 font-mono"
                >
                  <option value="CRITICAL">CRITICAL</option>
                  <option value="HIGH">HIGH</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="LOW">LOW</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 font-mono"
                >
                  <option value="Account Takeover">Account Takeover</option>
                  <option value="DDoS Attempt">DDoS Attempt</option>
                  <option value="API Scraping Bot">API Scraping Bot</option>
                  <option value="Payment Fraud Cluster">Payment Fraud Cluster</option>
                  <option value="Data Breach Attempt">Data Breach Attempt</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Assigned Lead Engineer</label>
              <input
                type="text"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Initial Findings / Root Cause Hypothesis</label>
              <textarea
                rows={3}
                placeholder="Describe initial telemetry signals and mitigation actions..."
                value={rootCause}
                onChange={(e) => setRootCause(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:border-rose-500 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition shadow flex items-center justify-center space-x-2 text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Declare Incident & Trigger Page</span>
            </button>
          </div>
        </form>

        {/* Right List: Active & Historical Incidents */}
        <div className="lg:col-span-2 bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-100">Incident Command Register & Investigation Timeline</h3>
            <span className="text-xs font-mono text-amber-400 font-bold">{incidents.length} Records</span>
          </div>

          <div className="space-y-4">
            {incidents.map((inc) => (
              <div key={inc.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                        inc.severity === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      }`}
                    >
                      {inc.severity}
                    </span>
                    <h4 className="font-bold text-slate-100 text-sm">{inc.title}</h4>
                  </div>

                  <div className="flex items-center space-x-2 font-mono text-xs">
                    <span className="text-slate-400">{inc.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded font-bold ${
                        inc.status === 'Resolved'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}
                    >
                      {inc.status}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800/80 text-xs space-y-1 text-slate-300">
                  <p>
                    Category: <strong className="text-amber-400">{inc.category}</strong>
                  </p>
                  <p>
                    Root Cause Analysis: <span className="text-slate-200">{inc.rootCause}</span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs font-mono">
                  <span className="text-slate-400 text-[11px]">Assigned: {inc.assignedTo} • Created: {inc.createdAt}</span>

                  <div className="flex space-x-2">
                    {inc.status !== 'Resolved' && (
                      <button
                        onClick={() => handleResolveIncident(inc.id)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition"
                      >
                        Mark Resolved
                      </button>
                    )}

                    <button
                      onClick={() => handleExportReport(inc.id)}
                      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 rounded-lg text-xs font-bold transition flex items-center space-x-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>RCA PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
