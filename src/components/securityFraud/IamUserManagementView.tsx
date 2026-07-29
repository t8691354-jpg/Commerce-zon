import React, { useState } from 'react';
import { MOCK_USER_SECURITY_ACCOUNTS } from '../../data/mockSecurityFraud';
import { UserAccountSecurity, UserRoleType, AccountType } from '../../types/securityFraud';
import {
  Users,
  Search,
  Lock,
  Unlock,
  UserX,
  ShieldCheck,
  Key,
  Smartphone,
  Mail,
  CheckCircle2,
  RefreshCw,
  Plus,
  Zap,
} from 'lucide-react';

export const IamUserManagementView: React.FC = () => {
  const [users, setUsers] = useState<UserAccountSecurity[]>(MOCK_USER_SECURITY_ACCOUNTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  // Search and filter
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'ALL' || u.role === selectedRole || u.accountType === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleStatusChange = (id: string, newStatus: 'Active' | 'Locked' | 'Suspended') => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
    );
    setActionMsg(`User account ID ${id} state updated to ${newStatus}. JWT tokens revoked.`);
    setTimeout(() => setActionMsg(null), 3500);
  };

  const handleForceMfa = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, mfaStatus: 'TOTP App' } : u))
    );
    setActionMsg(`Enforced TOTP Authenticator MFA requirement for user ID ${id}.`);
    setTimeout(() => setActionMsg(null), 3500);
  };

  const handleResetPassword = (id: string, email: string) => {
    setActionMsg(`Dispatched password reset token link to ${email}. Session tokens invalidated.`);
    setTimeout(() => setActionMsg(null), 3500);
  };

  return (
    <div className="space-y-6">
      {actionMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2 shadow-lg animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* Header & Search Controls */}
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              Identity & Access Management (IAM Directory)
            </h3>
            <p className="text-xs text-slate-400">
              User accounts across Buyer, Seller, Affiliate, Supplier, Delivery Partner, Warehouse Staff & Admin roles
            </p>
          </div>

          {/* Search & Role Selector */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search user name, email, ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:border-amber-500 outline-none w-64 font-mono"
              />
            </div>

            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 font-mono"
            >
              <option value="ALL">All Roles / Types</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Seller">Seller</option>
              <option value="Buyer">Buyer</option>
              <option value="Affiliate">Affiliate</option>
              <option value="Supplier">Supplier</option>
              <option value="Delivery Partner">Delivery Partner</option>
              <option value="Warehouse Staff">Warehouse Staff</option>
            </select>
          </div>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="py-3 px-3">User ID & Name</th>
                <th className="py-3 px-3">Email</th>
                <th className="py-3 px-3">Role & Account Type</th>
                <th className="py-3 px-3">MFA Status</th>
                <th className="py-3 px-3">Risk Score</th>
                <th className="py-3 px-3">Last Login (IP / Geo)</th>
                <th className="py-3 px-3">Account Status</th>
                <th className="py-3 px-3 text-right">IAM Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-200 font-sans block">{u.name}</span>
                    <span className="text-[10px] text-amber-400">{u.id}</span>
                  </td>

                  <td className="py-3 px-3 text-slate-300 font-sans">{u.email}</td>

                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-200 border border-slate-700">
                      {u.role}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.mfaStatus === 'Disabled'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      }`}
                    >
                      {u.mfaStatus}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <span
                      className={`font-bold ${
                        u.riskScore > 80
                          ? 'text-rose-400'
                          : u.riskScore > 40
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {u.riskScore}/100
                    </span>
                  </td>

                  <td className="py-3 px-3 text-slate-400 text-[11px]">
                    <div>{u.lastLoginIp}</div>
                    <div className="text-[10px] text-slate-500">{u.lastLoginCountry} ({u.lastLoginTime})</div>
                  </td>

                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.status === 'Active'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : u.status === 'Locked'
                          ? 'bg-rose-500/20 text-rose-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      {u.status === 'Active' ? (
                        <button
                          onClick={() => handleStatusChange(u.id, 'Locked')}
                          title="Lock Account & Revoke Sessions"
                          className="p-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/40 rounded transition"
                        >
                          <Lock className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusChange(u.id, 'Active')}
                          title="Unlock Account"
                          className="p-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 rounded transition"
                        >
                          <Unlock className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => handleForceMfa(u.id)}
                        title="Force TOTP MFA Requirement"
                        className="p-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 rounded transition"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleResetPassword(u.id, u.email)}
                        title="Reset Password & Send Link"
                        className="p-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 rounded transition"
                      >
                        <Key className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
