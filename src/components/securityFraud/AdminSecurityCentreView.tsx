import React, { useState } from 'react';
import { Settings, ShieldCheck, Lock, Unlock, Globe, RefreshCw, FileText, Download, CheckCircle2, Save, Key } from 'lucide-react';

export const AdminSecurityCentreView: React.FC = () => {
  const [minPasswordLength, setMinPasswordLength] = useState(14);
  const [requireSpecialChar, setRequireSpecialChar] = useState(true);
  const [maxFailedAttempts, setMaxFailedAttempts] = useState(5);
  const [sessionTimeoutMins, setSessionTimeoutMins] = useState(30);
  const [blockedIpInput, setBlockedIpInput] = useState('');
  const [blockedIps, setBlockedIps] = useState<string[]>(['185.220.101.4', '103.251.170.88', '194.26.29.110']);
  const [trustedIps, setTrustedIps] = useState<string[]>(['54.210.12.99', '198.51.100.42']);
  const [trustedIpInput, setTrustedIpInput] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  const handleBlockIp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockedIpInput.trim()) return;
    setBlockedIps([...blockedIps, blockedIpInput.trim()]);
    setBlockedIpInput('');
    setNotification(`IP Address ${blockedIpInput.trim()} added to Cloud WAF Blocklist.`);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleAddTrustedIp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trustedIpInput.trim()) return;
    setTrustedIps([...trustedIps, trustedIpInput.trim()]);
    setTrustedIpInput('');
    setNotification(`IP Address ${trustedIpInput.trim()} added to Admin Allowlist.`);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleSavePolicies = () => {
    setNotification('Password & Session Security Policies saved & applied across all IAM auth realms!');
    setTimeout(() => setNotification(null), 3500);
  };

  const handleExportReport = (reportName: string, format: string) => {
    setNotification(`Generating and downloading "${reportName}" as .${format.toUpperCase()} file...`);
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Password & Session Policies */}
        <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-400" />
            Password & Auth Session Security Policies
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Minimum Password Length: {minPasswordLength} chars</label>
              <input
                type="range"
                min="8"
                max="32"
                value={minPasswordLength}
                onChange={(e) => setMinPasswordLength(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div>
                <p className="font-bold text-slate-200">Require Special Chars & Numbers</p>
                <p className="text-[11px] text-slate-400">Enforce entropy constraints on password change</p>
              </div>
              <button
                type="button"
                onClick={() => setRequireSpecialChar(!requireSpecialChar)}
                className={`px-3 py-1 rounded text-xs font-bold transition ${
                  requireSpecialChar ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {requireSpecialChar ? 'REQUIRED' : 'OFF'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Max Failed Login Lockout</label>
                <select
                  value={maxFailedAttempts}
                  onChange={(e) => setMaxFailedAttempts(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 font-mono"
                >
                  <option value={3}>3 Failed Attempts</option>
                  <option value={5}>5 Failed Attempts (Default)</option>
                  <option value={10}>10 Failed Attempts</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">JWT Session Inactivity Timeout</label>
                <select
                  value={sessionTimeoutMins}
                  onChange={(e) => setSessionTimeoutMins(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 font-mono"
                >
                  <option value={15}>15 Minutes</option>
                  <option value={30}>30 Minutes</option>
                  <option value={60}>60 Minutes</option>
                  <option value={240}>4 Hours</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleSavePolicies}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl transition flex items-center justify-center space-x-2 text-xs shadow-lg"
            >
              <Save className="w-4 h-4" />
              <span>Save Auth Security Configuration</span>
            </button>
          </div>
        </div>

        {/* IP Blocklist & Allowlist Controls */}
        <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-400" />
            Cloud WAF IP Access Control Rules
          </h3>

          <div className="space-y-4 text-xs">
            {/* Block IP Form */}
            <form onSubmit={handleBlockIp} className="space-y-2">
              <label className="block text-slate-300 font-bold">Block Malicious IP Address</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="e.g. 185.220.101.4"
                  value={blockedIpInput}
                  onChange={(e) => setBlockedIpInput(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg transition text-xs"
                >
                  Block IP
                </button>
              </div>
            </form>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="font-bold text-rose-400 text-xs">Active Blocked IP Subnets ({blockedIps.length})</span>
              <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                {blockedIps.map((ip) => (
                  <span key={ip} className="px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded">
                    {ip}
                  </span>
                ))}
              </div>
            </div>

            {/* Trusted IP Form */}
            <form onSubmit={handleAddTrustedIp} className="space-y-2 pt-2 border-t border-slate-800">
              <label className="block text-slate-300 font-bold">Allowlist Admin Trusted IP</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="e.g. 54.210.12.99"
                  value={trustedIpInput}
                  onChange={(e) => setTrustedIpInput(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition text-xs"
                >
                  Allow IP
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Reports Export Hub */}
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            Executive Security & Compliance Report Generation
          </span>
          <span className="text-xs font-mono text-emerald-400">PDF, Excel & CSV Multi-Format</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          {[
            'Comprehensive Security Audit Report',
            'Fraud Detection & Financial Loss Report',
            'IAM User Activity & Login Log Report',
            'SOC 2 & PCI-DSS Compliance Deck',
          ].map((rpt) => (
            <div key={rpt} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <h4 className="font-bold text-slate-200">{rpt}</h4>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(['pdf', 'excel', 'csv'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => handleExportReport(rpt, fmt)}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-800 rounded text-[10px] font-bold uppercase transition flex items-center space-x-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>{fmt}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
