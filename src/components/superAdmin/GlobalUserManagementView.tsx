import React, { useState } from 'react';
import { MOCK_GLOBAL_USERS } from '../../data/mockSuperAdmin';
import { GlobalUserRecord } from '../../types/superAdmin';
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
  Trash2,
  RefreshCw,
  Edit,
  ShieldAlert,
} from 'lucide-react';

export const GlobalUserManagementView: React.FC = () => {
  const [users, setUsers] = useState<GlobalUserRecord[]>(MOCK_GLOBAL_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRoleFilter === 'ALL' || u.role === selectedRoleFilter;
    const matchesStatus = selectedStatusFilter === 'ALL' || u.status === selectedStatusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleUpdateStatus = (id: string, newStatus: GlobalUserRecord['status']) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
    );
    setActionMsg(`User account ID ${id} status changed to "${newStatus}". Session JWT tokens revoked.`);
    setTimeout(() => setActionMsg(null), 3500);
  };

  const handleResetPassword = (id: string, email: string) => {
    setActionMsg(`Dispatched password reset token link to ${email}. Active sessions cleared.`);
    setTimeout(() => setActionMsg(null), 3500);
  };

  const handleResetMfa = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, mfaEnabled: false } : u))
    );
    setActionMsg(`MFA reset for user ID ${id}. User will be required to re-enroll TOTP/Hardware key upon next login.`);
    setTimeout(() => setActionMsg(null), 3500);
  };

  const handleDeleteUser = (id: string, name: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setActionMsg(`User "${name}" (${id}) permanently purged from IAM directory and data anonymized.`);
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

      {/* Directory Search & Filters */}
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              Global Marketplace Directory (10 User Archetypes)
            </h3>
            <p className="text-xs text-slate-400">
              Manage Buyers, Sellers, Affiliates, Suppliers, Warehouse Staff, Delivery Partners, CS Agents & Admins
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search name, email, ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:border-amber-500 outline-none w-60 font-mono"
              />
            </div>

            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 font-mono"
            >
              <option value="ALL">All Roles</option>
              <option value="Buyer">Buyer</option>
              <option value="Professional Seller">Professional Seller</option>
              <option value="Affiliate">Affiliate</option>
              <option value="Supplier">Supplier</option>
              <option value="Warehouse Staff">Warehouse Staff</option>
              <option value="Delivery Partner">Delivery Partner</option>
              <option value="Support Agent">Support Agent</option>
              <option value="Admin">Admin</option>
            </select>

            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 font-mono"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
              <option value="Banned">Banned</option>
            </select>
          </div>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-3 px-3">User & ID</th>
                <th className="py-3 px-3">Email & Country</th>
                <th className="py-3 px-3">Assigned Role</th>
                <th className="py-3 px-3">MFA</th>
                <th className="py-3 px-3">Last Login</th>
                <th className="py-3 px-3">Transactions</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Super Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-200 font-sans block">{u.name}</span>
                    <span className="text-[10px] text-amber-400">{u.id}</span>
                  </td>

                  <td className="py-3 px-3 font-sans text-slate-300">
                    <div>{u.email}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{u.country}</div>
                  </td>

                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-200 border border-slate-700">
                      {u.role}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.mfaEnabled
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      }`}
                    >
                      {u.mfaEnabled ? 'ENABLED' : 'OFF'}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-slate-400 text-[11px]">
                    <div>{u.lastLoginIp}</div>
                    <div className="text-[10px] text-slate-500">{u.lastLoginDate}</div>
                  </td>

                  <td className="py-3 px-3 text-amber-400 font-bold">{u.totalTransactions.toLocaleString()}</td>

                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.status === 'Active'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : u.status === 'Suspended'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      {u.status === 'Active' ? (
                        <button
                          onClick={() => handleUpdateStatus(u.id, 'Suspended')}
                          title="Suspend User Account"
                          className="p-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 rounded transition"
                        >
                          <Lock className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(u.id, 'Active')}
                          title="Activate User Account"
                          className="p-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 rounded transition"
                        >
                          <Unlock className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => handleResetPassword(u.id, u.email)}
                        title="Send Reset Password Link"
                        className="p-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 rounded transition"
                      >
                        <Key className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleResetMfa(u.id)}
                        title="Reset MFA Hardware Credential"
                        className="p-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 rounded transition"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteUser(u.id, u.name)}
                        title="Purge User Account"
                        className="p-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/40 rounded transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
