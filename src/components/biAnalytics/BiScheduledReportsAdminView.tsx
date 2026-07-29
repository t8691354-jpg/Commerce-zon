import React, { useState } from 'react';
import { Settings, ShieldCheck, Database, Calendar, Lock, Users, Save, CheckCircle2 } from 'lucide-react';

export const BiScheduledReportsAdminView: React.FC = () => {
  const [dataRetention, setDataRetention] = useState<'30d' | '90d' | '1y' | '7y'>('1y');
  const [allowPublicExports, setAllowPublicExports] = useState(false);
  const [require2faForExports, setRequire2faForExports] = useState(true);
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSaveSettings = () => {
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div className="space-y-6">
      {savedMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>BI Administrator policies and data source access controls updated successfully!</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Data Governance & Retention */}
        <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Database className="w-4 h-4 text-amber-400" />
            Data Retention & Granularity Governance
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">ClickHouse / Spark Hot Data Retention Window</label>
              <select
                value={dataRetention}
                onChange={(e) => setDataRetention(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-mono"
              >
                <option value="30d">30 Days (Ultra High Precision - Realtime)</option>
                <option value="90d">90 Days (Standard Trailing Quarter)</option>
                <option value="1y">1 Year (Recommended for YoY Enterprise Audits)</option>
                <option value="7y">7 Years (Compliance Cold Storage S3 Parquet)</option>
              </select>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="font-bold text-slate-200">System Storage Estimate</span>
              <p className="text-slate-400">Current compressed Parquet footprint in ClickHouse cluster: <strong className="text-amber-400">4.2 TB</strong></p>
            </div>
          </div>
        </div>

        {/* Access Control & Security Policies */}
        <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-400" />
            Dashboard Access & Export Security Rules
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div>
                <p className="font-bold text-slate-200">Require Hardware 2FA for Financial Exports</p>
                <p className="text-slate-400 text-[11px]">Enforce TOTP / WebAuthn prompt when exporting PII or P&L data</p>
              </div>
              <button
                onClick={() => setRequire2faForExports(!require2faForExports)}
                className={`px-3 py-1 rounded text-xs font-bold transition ${
                  require2faForExports ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {require2faForExports ? 'REQUIRED' : 'OFF'}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div>
                <p className="font-bold text-slate-200">Allow Public Shareable Dashboard Links</p>
                <p className="text-slate-400 text-[11px]">Generate read-only HMAC signed URLs for investor board decks</p>
              </div>
              <button
                onClick={() => setAllowPublicExports(!allowPublicExports)}
                className={`px-3 py-1 rounded text-xs font-bold transition ${
                  allowPublicExports ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {allowPublicExports ? 'ALLOWED' : 'DISABLED'}
              </button>
            </div>

            <button
              onClick={handleSaveSettings}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-lg transition flex items-center justify-center space-x-2 text-xs"
            >
              <Save className="w-4 h-4" />
              <span>Save BI Administrative Policies</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
