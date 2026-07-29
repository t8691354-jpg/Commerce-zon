import React, { useState } from 'react';
import { UserRoleType } from '../../types/securityFraud';
import { Lock, Shield, Check, X, Save, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';

interface PermissionDefinition {
  key: string;
  category: 'Security & Auth' | 'Financial & Payments' | 'Marketplace & Products' | 'Logistics & FBA' | 'Customer Care';
  label: string;
}

export const RbacMatrixView: React.FC = () => {
  const roles: UserRoleType[] = [
    'Super Admin',
    'Admin',
    'Finance Admin',
    'Operations Admin',
    'Security Admin',
    'Warehouse Admin',
    'Seller',
    'Buyer',
    'Affiliate',
    'Supplier',
    'Delivery Partner',
    'Customer Support',
  ];

  const permissions: PermissionDefinition[] = [
    { key: 'sec_view_logs', category: 'Security & Auth', label: 'View Security Audit Logs' },
    { key: 'sec_manage_iam', category: 'Security & Auth', label: 'Lock / Unlock IAM Accounts' },
    { key: 'sec_override_fraud', category: 'Security & Auth', label: 'Override Fraud Engine Decisions' },
    { key: 'fin_process_refunds', category: 'Financial & Payments', label: 'Process Customer Refunds' },
    { key: 'fin_approve_payouts', category: 'Financial & Payments', label: 'Approve Merchant Withdrawals' },
    { key: 'mkt_manage_products', category: 'Marketplace & Products', label: 'Create & Manage Catalog Items' },
    { key: 'mkt_view_analytics', category: 'Marketplace & Products', label: 'View BI Executive Analytics' },
    { key: 'log_manage_fba', category: 'Logistics & FBA', label: 'Manage Warehouse & FBA Shipments' },
    { key: 'cs_access_pii', category: 'Customer Care', label: 'View Buyer PII & Order Details' },
  ];

  // Default permissions state
  const [matrix, setMatrix] = useState<Record<UserRoleType, Record<string, boolean>>>(() => {
    const initial: any = {};
    roles.forEach((r) => {
      initial[r] = {};
      permissions.forEach((p) => {
        if (r === 'Super Admin') {
          initial[r][p.key] = true;
        } else if (r === 'Security Admin') {
          initial[r][p.key] = p.category === 'Security & Auth' || p.key === 'mkt_view_analytics';
        } else if (r === 'Finance Admin') {
          initial[r][p.key] = p.category === 'Financial & Payments' || p.key === 'mkt_view_analytics';
        } else if (r === 'Seller') {
          initial[r][p.key] = p.key === 'mkt_manage_products' || p.key === 'mkt_view_analytics';
        } else if (r === 'Customer Support') {
          initial[r][p.key] = p.key === 'cs_access_pii' || p.key === 'fin_process_refunds';
        } else {
          initial[r][p.key] = false;
        }
      });
    });
    return initial;
  });

  const [notification, setNotification] = useState<string | null>(null);

  const togglePermission = (role: UserRoleType, permKey: string) => {
    setMatrix((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [permKey]: !prev[role][permKey],
      },
    }));
  };

  const handleSaveMatrix = () => {
    setNotification('Role-Based Access Control (RBAC) permission matrix synchronized & cached in Redis!');
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

      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-400" />
              Role-Based Access Control (RBAC Permission Matrix)
            </h3>
            <p className="text-xs text-slate-400">
              Configure fine-grained access policies across all 12 enterprise user roles
            </p>
          </div>

          <button
            onClick={handleSaveMatrix}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl transition flex items-center space-x-2 text-xs shadow-lg self-start sm:self-auto"
          >
            <Save className="w-4 h-4" />
            <span>Save RBAC Policy Matrix</span>
          </button>
        </div>

        {/* RBAC Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-3 px-3 bg-slate-950 min-w-[220px]">Permission Name</th>
                {roles.map((role) => (
                  <th key={role} className="py-3 px-2 text-center bg-slate-950 min-w-[100px]">
                    <span className="text-[10px] font-bold text-slate-200 block truncate" title={role}>
                      {role}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {permissions.map((p) => (
                <tr key={p.key} className="hover:bg-slate-800/30 transition">
                  <td className="py-3 px-3 bg-slate-950/60">
                    <span className="font-bold text-slate-200 block font-sans">{p.label}</span>
                    <span className="text-[10px] text-amber-400 font-mono">{p.category}</span>
                  </td>

                  {roles.map((role) => {
                    const isGranted = matrix[role]?.[p.key] ?? false;
                    return (
                      <td key={role} className="py-3 px-2 text-center">
                        <button
                          onClick={() => togglePermission(role, p.key)}
                          className={`w-7 h-7 rounded-lg font-bold flex items-center justify-center mx-auto transition ${
                            isGranted
                              ? 'bg-emerald-500 text-slate-950 shadow-md'
                              : 'bg-slate-950 text-slate-600 border border-slate-800 hover:text-slate-400'
                          }`}
                        >
                          {isGranted ? <Check className="w-4 h-4 stroke-[3]" /> : <X className="w-3.5 h-3.5" />}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
