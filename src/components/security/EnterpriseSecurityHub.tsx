import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Key,
  Lock,
  UserCheck,
  Smartphone,
  AlertTriangle,
  History,
  Activity,
  LogOut,
  RefreshCw,
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  User,
  Zap,
} from 'lucide-react';
import { UserRole, Permission } from '../../domain/iam/IAMTypes';

interface UserContext {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  permissions: Permission[];
  isMfaEnabled?: boolean;
}

export const EnterpriseSecurityHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'auth' | 'jwt' | 'mfa' | 'sessions' | 'rbac' | 'audit'>('auth');

  // Auth state
  const [loginIdentifier, setLoginIdentifier] = useState('superadmin@commercezon.com');
  const [password, setPassword] = useState('SuperAdmin@2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Active Session & Token state
  const [currentUser, setCurrentUser] = useState<UserContext | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [mfaChallengeToken, setMfaChallengeToken] = useState<string | null>(null);
  const [mfaCodeInput, setMfaCodeInput] = useState('');

  // Active sessions & audit state
  const [sessionsList, setSessionsList] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [securityAlerts, setSecurityAlerts] = useState<any[]>([]);
  const [iamUsers, setIamUsers] = useState<any[]>([]);

  // Default Quick Account Selectors
  const defaultAccounts = [
    { label: 'Super Admin', email: 'superadmin@commercezon.com', pass: 'SuperAdmin@2026!', role: 'SUPER_ADMIN' },
    { label: 'Platform Admin', email: 'admin@commercezon.com', pass: 'AdminPass@2026!', role: 'ADMIN' },
    { label: 'Apex Merchant', email: 'seller@apex.com', pass: 'SellerPass@2026!', role: 'SELLER' },
    { label: 'Enterprise Buyer', email: 'buyer@enterprise.com', pass: 'Customer@2026!', role: 'CUSTOMER' },
    { label: 'Warehouse Manager', email: 'warehouse@fba.com', pass: 'Warehouse@2026!', role: 'WAREHOUSE_MANAGER' },
    { label: 'Support Specialist', email: 'support@commercezon.com', pass: 'Support@2026!', role: 'CUSTOMER_SUPPORT' },
    { label: 'Finance Lead', email: 'finance@commercezon.com', pass: 'Finance@2026!', role: 'FINANCE' },
  ];

  // Handle Login
  const handleLogin = async (idToUse?: string, passToUse?: string) => {
    setLoading(true);
    setAuthError(null);
    setAuthSuccessMsg(null);

    const identifier = idToUse || loginIdentifier;
    const pass = passToUse || password;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginIdentifier: identifier, password: pass }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || 'Authentication failed');
      }

      if (data.mfaRequired) {
        setMfaChallengeToken(data.mfaChallengeToken);
        setAuthSuccessMsg('MFA Challenge required. Enter 6-digit TOTP code (123456) or backup code.');
      } else {
        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        setCurrentUser(data.user);
        setMfaChallengeToken(null);
        setAuthSuccessMsg(`Authenticated as ${data.user.fullName} (${data.user.role})`);
        fetchUserSessions(data.accessToken);
      }
    } catch (err: any) {
      setAuthError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  // Handle MFA Challenge Verification
  const handleVerifyMFA = async () => {
    if (!mfaChallengeToken || !mfaCodeInput) return;
    setLoading(true);
    setAuthError(null);

    try {
      const res = await fetch('/api/auth/verify-mfa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeToken: mfaChallengeToken, code: mfaCodeInput }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'MFA verification failed');

      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      setCurrentUser(data.user);
      setMfaChallengeToken(null);
      setAuthSuccessMsg(`MFA verified successfully! Welcome ${data.user.fullName}`);
      fetchUserSessions(data.accessToken);
    } catch (err: any) {
      setAuthError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  // Fetch Sessions
  const fetchUserSessions = async (token = accessToken) => {
    if (!token) return;
    try {
      const res = await fetch('/api/auth/sessions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSessionsList(data.sessions || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Fetch IAM Admin Data
  const fetchIamData = async () => {
    if (!accessToken) return;
    try {
      const [uRes, aRes, altRes] = await Promise.all([
        fetch('/api/iam/users', { headers: { Authorization: `Bearer ${accessToken}` } }),
        fetch('/api/iam/audit-logs', { headers: { Authorization: `Bearer ${accessToken}` } }),
        fetch('/api/iam/security-alerts', { headers: { Authorization: `Bearer ${accessToken}` } }),
      ]);

      if (uRes.ok) {
        const d = await uRes.json();
        setIamUsers(d.users || []);
      }
      if (aRes.ok) {
        const d = await aRes.json();
        setAuditLogs(d.logs || []);
      }
      if (altRes.ok) {
        const d = await altRes.json();
        setSecurityAlerts(d.alerts || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (activeTab === 'audit' || activeTab === 'rbac') {
      fetchIamData();
    }
  }, [activeTab, accessToken]);

  const decodeJwtPayload = (token: string | null) => {
    if (!token) return null;
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      return JSON.parse(atob(parts[1]));
    } catch {
      return null;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-slate-100">
      {/* Top Banner */}
      <div className="bg-[#131921] border border-[#37475a] rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-amber-500/20 border border-amber-500/40 rounded-xl text-[#febd69]">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#febd69] uppercase">
              <span>Enterprise Identity & Access Management (IAM)</span>
              <span>•</span>
              <span className="text-emerald-400">Zero Trust Certified</span>
            </div>
            <h1 className="text-2xl font-black text-white mt-0.5">Amazon-Level Security Control Center</h1>
            <p className="text-xs text-slate-400 mt-1">
              Enterprise OAuth2 / JWT authentication, TOTP Multi-Factor challenge, RBAC matrix, and threat detection logs.
            </p>
          </div>
        </div>

        {currentUser && (
          <div className="bg-[#232f3e] border border-[#37475a] p-3.5 rounded-xl flex items-center space-x-3 text-xs font-mono">
            <UserCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="text-white font-bold">{currentUser.fullName}</div>
              <div className="text-emerald-400 font-semibold">{currentUser.role}</div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 overflow-x-auto text-xs font-bold">
        {[
          { id: 'auth', label: 'Identity & Auth Portal', icon: Key },
          { id: 'jwt', label: 'JWT Token Inspector', icon: Lock },
          { id: 'mfa', label: 'Multi-Factor Auth (MFA)', icon: Smartphone },
          { id: 'sessions', label: 'Active Devices & Sessions', icon: Activity },
          { id: 'rbac', label: 'Zero-Trust RBAC Matrix', icon: Zap },
          { id: 'audit', label: 'Security Audit & Threat Logs', icon: History },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition whitespace-nowrap ${
                isActive
                  ? 'bg-[#febd69] text-slate-950 font-black shadow-lg'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}

      {/* Tab 1: Auth Portal */}
      {activeTab === 'auth' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Pre-seeded Selector */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center space-x-2">
              <User className="w-4 h-4 text-[#febd69]" />
              <span>Test Enterprise Roles</span>
            </h3>
            <p className="text-xs text-slate-400">
              Select any pre-seeded enterprise account to authenticate instantly with its role credentials:
            </p>

            <div className="space-y-2">
              {defaultAccounts.map((acc) => (
                <button
                  key={acc.email}
                  onClick={() => {
                    setLoginIdentifier(acc.email);
                    setPassword(acc.pass);
                    handleLogin(acc.email, acc.pass);
                  }}
                  className="w-full text-left p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-[#febd69] rounded-xl transition flex items-center justify-between group"
                >
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-[#febd69] transition">
                      {acc.label}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">{acc.email}</div>
                  </div>
                  <span className="text-[10px] bg-slate-800 text-emerald-400 px-2 py-1 rounded font-mono font-bold">
                    {acc.role}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Authentication Form */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-black text-white">Enterprise Identity Authentication</h2>
                <p className="text-xs text-slate-400">Sign in using PBKDF2 hashed password & device fingerprinting.</p>
              </div>
              <ShieldCheck className="w-6 h-6 text-[#febd69]" />
            </div>

            {authError && (
              <div className="p-4 bg-rose-950/80 border border-rose-500/50 rounded-xl text-rose-300 text-xs flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {authSuccessMsg && (
              <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>{authSuccessMsg}</span>
              </div>
            )}

            {mfaChallengeToken ? (
              <div className="bg-slate-950 p-6 border border-amber-500/40 rounded-xl space-y-4">
                <div className="flex items-center space-x-3 text-amber-400">
                  <Smartphone className="w-6 h-6 animate-pulse" />
                  <span className="font-bold text-sm">Multi-Factor Challenge Active</span>
                </div>
                <p className="text-xs text-slate-300">
                  Enter your 6-digit Authenticator TOTP code (<code className="text-[#febd69]">123456</code> for demo) or one-time backup code:
                </p>
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="Enter 6-digit code or backup code"
                    value={mfaCodeInput}
                    onChange={(e) => setMfaCodeInput(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm font-mono text-white focus:border-[#febd69] focus:outline-none"
                  />
                  <button
                    onClick={handleVerifyMFA}
                    disabled={loading}
                    className="px-6 py-2.5 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black text-xs rounded-lg transition"
                  >
                    Verify & Sign In
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin();
                }}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Email, Username, or Phone</label>
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#febd69]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#febd69] pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black text-sm rounded-xl transition shadow-lg flex items-center justify-center space-x-2"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                  <span>Authenticate Session</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: JWT Token Inspector */}
      {activeTab === 'jwt' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-black text-white">HMAC-SHA256 JWT Token Inspector</h2>
              <p className="text-xs text-slate-400">
                Short-lived Access Token (15m) and Rotating Refresh Token (7d) claims.
              </p>
            </div>
            <Key className="w-6 h-6 text-[#febd69]" />
          </div>

          {!accessToken ? (
            <div className="p-12 text-center text-slate-500 space-y-3 bg-slate-950 rounded-xl border border-slate-800">
              <Lock className="w-10 h-10 mx-auto text-slate-600" />
              <p className="text-sm font-bold text-slate-300">No active JWT session.</p>
              <p className="text-xs text-slate-500">Log in on the Identity Portal tab to generate live JWT tokens.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
              {/* Access Token */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400 uppercase">ACCESS TOKEN (15 Mins)</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                    HMAC-SHA256 Signed
                  </span>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 break-all text-[11px] text-slate-400">
                  {accessToken}
                </div>

                <div className="space-y-1 text-slate-300 pt-2 border-t border-slate-800">
                  <div className="font-bold text-slate-400 mb-1">Decoded Payload Claims:</div>
                  <pre className="p-3 bg-slate-900 rounded-lg text-amber-300 text-[11px] overflow-x-auto">
                    {JSON.stringify(decodeJwtPayload(accessToken), null, 2)}
                  </pre>
                </div>
              </div>

              {/* Refresh Token */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-400 uppercase">REFRESH TOKEN (7 Days)</span>
                  <span className="text-[10px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">
                    Token Family Rotation
                  </span>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 break-all text-[11px] text-slate-400">
                  {refreshToken}
                </div>

                <div className="space-y-1 text-slate-300 pt-2 border-t border-slate-800">
                  <div className="font-bold text-slate-400 mb-1">Decoded Payload Claims:</div>
                  <pre className="p-3 bg-slate-900 rounded-lg text-blue-300 text-[11px] overflow-x-auto">
                    {JSON.stringify(decodeJwtPayload(refreshToken), null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Multi-Factor Auth */}
      {activeTab === 'mfa' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-black text-white">TOTP Authenticator & Backup Recovery Codes</h2>
              <p className="text-xs text-slate-400">
                Enterprise Multi-Factor Authentication (MFA) with Google/Authy Authenticator & emergency recovery tokens.
              </p>
            </div>
            <Smartphone className="w-6 h-6 text-[#febd69]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-950 p-6 border border-slate-800 rounded-xl space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">TOTP Authenticator Status</h3>
                  <p className="text-xs text-slate-400">Configured for Super Admin & Admin accounts</p>
                </div>
              </div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
                <div className="text-slate-400">Secret Key (Base32):</div>
                <div className="text-[#febd69] font-bold text-sm tracking-wider">JBSWY3DPEHPK3PXP</div>
                <div className="text-[10px] text-slate-500">Test OTP Code: 123456</div>
              </div>
            </div>

            <div className="bg-slate-950 p-6 border border-slate-800 rounded-xl space-y-4">
              <h3 className="text-sm font-bold text-white">Single-Use Backup Recovery Codes</h3>
              <p className="text-xs text-slate-400">Use these emergency 8-digit codes if your mobile device is lost:</p>

              <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                {['1234-5678', '8765-4321', '9988-7766', '4433-2211', '5566-7788'].map((code) => (
                  <div key={code} className="bg-slate-900 border border-slate-800 p-2 rounded text-center text-emerald-400 font-bold">
                    {code}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Active Sessions */}
      {activeTab === 'sessions' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-black text-white">Active Device Sessions</h2>
              <p className="text-xs text-slate-400">
                Monitor and terminate multi-device login sessions across web, tablet, and mobile.
              </p>
            </div>
            <Activity className="w-6 h-6 text-[#febd69]" />
          </div>

          <div className="space-y-3">
            {sessionsList.length === 0 ? (
              <p className="text-xs text-slate-500">No session list available. Authenticate to view active devices.</p>
            ) : (
              sessionsList.map((sess) => (
                <div
                  key={sess.sessionId}
                  className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white">{sess.deviceType} Session</span>
                      {sess.isCurrentSession && (
                        <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                          THIS DEVICE
                        </span>
                      )}
                    </div>
                    <div className="text-slate-400 font-mono">
                      IP: {sess.ipAddress} • ID: {sess.sessionId}
                    </div>
                  </div>

                  <button
                    onClick={async () => {
                      if (!accessToken) return;
                      await fetch(`/api/auth/sessions/${sess.sessionId}`, {
                        method: 'DELETE',
                        headers: { Authorization: `Bearer ${accessToken}` },
                      });
                      fetchUserSessions();
                    }}
                    className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-bold transition flex items-center space-x-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Revoke</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 5: RBAC Matrix */}
      {activeTab === 'rbac' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-black text-white">Zero-Trust RBAC & Granular Permission Hierarchy</h2>
              <p className="text-xs text-slate-400">
                Amazon-grade role definitions and fine-grained access policies across 9 distinct platform tiers.
              </p>
            </div>
            <Zap className="w-6 h-6 text-[#febd69]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { role: 'SUPER_ADMIN', desc: 'Full Root Privileges, IAM Overrides, Security Log Wiping' },
              { role: 'ADMIN', desc: 'Catalog Moderation, Order Management, User Suspension' },
              { role: 'SELLER', desc: 'Product Listing Creation, FBA Warehouse View, Merchant Payouts' },
              { role: 'WAREHOUSE_MANAGER', desc: 'Stock Allocation, Inventory Transfer, Express Dispatch' },
              { role: 'CUSTOMER_SUPPORT', desc: 'Order Refunds, Buyer Account Inquiries, Dispute Resolution' },
              { role: 'FINANCE', desc: 'Financial Auditing, Wallet Payouts, Merchant Settlements' },
              { role: 'MODERATOR', desc: 'Product Review Approval, Content Moderation' },
              { role: 'DELIVERY_STAFF', desc: 'Last-Mile Route Inspection, Order Delivery Confirmation' },
              { role: 'CUSTOMER', desc: 'Product Search, Checkout, Commerce Zone Pay Wallet' },
            ].map((item) => (
              <div key={item.role} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                <div className="text-xs font-bold text-[#febd69] font-mono uppercase">{item.role}</div>
                <p className="text-xs text-slate-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Audit & Threat Logs */}
      {activeTab === 'audit' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-black text-white">Security Audit & Threat Detection Stream</h2>
              <p className="text-xs text-slate-400">
                Real-time security events, brute force detection counters, and anomaly logs.
              </p>
            </div>
            <History className="w-6 h-6 text-[#febd69]" />
          </div>

          {/* Security Alerts Banner */}
          {securityAlerts.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider">Active Threat Detection Alerts</h3>
              {securityAlerts.map((alt) => (
                <div
                  key={alt.id}
                  className="bg-rose-950/40 border border-rose-500/40 p-3 rounded-xl flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <div>
                      <div className="font-bold text-white">{alt.title}</div>
                      <div className="text-[10px] text-rose-300">{alt.details}</div>
                    </div>
                  </div>
                  <span className="font-mono text-rose-400 font-bold">Risk: {alt.riskScore}/100</span>
                </div>
              ))}
            </div>
          )}

          {/* Audit Event Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Event Type</th>
                  <th className="p-3">Actor / Email</th>
                  <th className="p-3">IP Address</th>
                  <th className="p-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-500">
                      No security audit events recorded yet.
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-3 text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</td>
                      <td className="p-3 font-bold text-[#febd69]">{log.eventType}</td>
                      <td className="p-3 text-white">{log.actorEmail || log.actorId}</td>
                      <td className="p-3 text-slate-400">{log.ipAddress}</td>
                      <td className="p-3 text-slate-300">{log.details}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
