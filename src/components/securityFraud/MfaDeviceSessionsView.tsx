import React, { useState } from 'react';
import { MOCK_ACTIVE_SESSIONS } from '../../data/mockSecurityFraud';
import { ActiveSession } from '../../types/securityFraud';
import {
  Smartphone,
  ShieldCheck,
  Key,
  Monitor,
  Laptop,
  Globe,
  Trash2,
  LogOut,
  CheckCircle2,
  Lock,
  QrCode,
  Copy,
} from 'lucide-react';

export const MfaDeviceSessionsView: React.FC = () => {
  const [sessions, setSessions] = useState<ActiveSession[]>(MOCK_ACTIVE_SESSIONS);
  const [mfaType, setMfaType] = useState<'totp' | 'sms' | 'email'>('totp');
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const [backupCodes] = useState<string[]>([
    'A9F2-81B4-4902',
    '33E1-99C0-8812',
    '88D4-11A0-7721',
    '55F0-44B2-9901',
    '12C4-88A9-3342',
  ]);

  const handleRevokeSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.sessionId !== sessionId));
    setActionMsg(`Session ID ${sessionId} revoked and access token invalidated immediately.`);
    setTimeout(() => setActionMsg(null), 3500);
  };

  const handleRevokeAllOtherSessions = () => {
    setSessions((prev) => prev.filter((s) => s.isCurrent));
    setActionMsg('All secondary devices and sessions logged out across all regions.');
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* MFA Setup Controls */}
        <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Multi-Factor Authentication (MFA)
            </h3>
            <p className="text-xs text-slate-400">
              Enforce multi-layered identity verification for sensitive administrative & seller operations
            </p>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-800">
            <div>
              <p className="font-bold text-slate-200 text-xs">MFA Status</p>
              <p className="text-[11px] text-slate-400">
                {mfaEnabled ? 'Hardware / App Authenticator active' : 'MFA currently disabled'}
              </p>
            </div>
            <button
              onClick={() => {
                setMfaEnabled(!mfaEnabled);
                setActionMsg(
                  !mfaEnabled ? 'MFA policy activated for your account' : 'MFA disabled for account'
                );
                setTimeout(() => setActionMsg(null), 3500);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                mfaEnabled ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {mfaEnabled ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>

          {/* MFA Method Selection */}
          <div className="space-y-3">
            <label className="block text-slate-300 text-xs font-bold">Preferred MFA Method</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMfaType('totp')}
                className={`p-3 rounded-xl border text-xs font-bold transition text-center ${
                  mfaType === 'totp'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                <QrCode className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                <span>Authenticator</span>
              </button>

              <button
                type="button"
                onClick={() => setMfaType('sms')}
                className={`p-3 rounded-xl border text-xs font-bold transition text-center ${
                  mfaType === 'sms'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                <Smartphone className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                <span>SMS OTP</span>
              </button>

              <button
                type="button"
                onClick={() => setMfaType('email')}
                className={`p-3 rounded-xl border text-xs font-bold transition text-center ${
                  mfaType === 'email'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                <Key className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                <span>Email OTP</span>
              </button>
            </div>
          </div>

          {/* Backup Recovery Codes */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-200">Backup Emergency Recovery Codes</span>
              <span className="text-[10px] text-amber-400 font-mono font-bold">5 Codes Left</span>
            </div>
            <div className="grid grid-cols-1 gap-1.5 font-mono text-xs">
              {backupCodes.map((code, idx) => (
                <div
                  key={idx}
                  className="p-1.5 bg-slate-900 border border-slate-800 rounded text-slate-300 flex justify-between items-center"
                >
                  <span>{code}</span>
                  <span className="text-[10px] text-emerald-400">UNUSED</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Devices & Session Management */}
        <div className="lg:col-span-2 bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Laptop className="w-5 h-5 text-amber-400" />
                Active Devices & Live Session Management
              </h3>
              <p className="text-xs text-slate-400">
                Track active OAuth/JWT tokens across devices, IP locations, and user sessions
              </p>
            </div>

            <button
              onClick={handleRevokeAllOtherSessions}
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition flex items-center space-x-2 shadow-lg self-start sm:self-auto"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out From All Other Devices</span>
            </button>
          </div>

          {/* Session Cards */}
          <div className="space-y-3">
            {sessions.map((ses) => (
              <div
                key={ses.sessionId}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${
                  ses.isCurrent
                    ? 'bg-slate-950 border-amber-500/50 shadow-md'
                    : 'bg-slate-950/70 border-slate-800'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-200 text-xs">{ses.deviceType}</span>
                    {ses.isCurrent && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        THIS DEVICE
                      </span>
                    )}
                    <span className="text-[11px] text-slate-400 font-mono">ID: {ses.sessionId}</span>
                  </div>

                  <p className="text-xs text-slate-300">{ses.browser}</p>

                  <div className="text-[11px] text-slate-400 font-mono flex flex-wrap gap-x-4">
                    <span>IP: <strong className="text-slate-200">{ses.ipAddress}</strong></span>
                    <span>Country: <strong className="text-slate-200">{ses.country}</strong></span>
                    <span>Last Active: <strong className="text-emerald-400">{ses.lastActive}</strong></span>
                  </div>
                </div>

                {!ses.isCurrent && (
                  <button
                    onClick={() => handleRevokeSession(ses.sessionId)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-rose-600/30 text-rose-400 hover:text-rose-200 border border-slate-800 hover:border-rose-500/40 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 self-end sm:self-center"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Revoke Session</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
