import React, { useState } from 'react';
import { SecurityOpsDashboardView } from './SecurityOpsDashboardView';
import { IamUserManagementView } from './IamUserManagementView';
import { MfaDeviceSessionsView } from './MfaDeviceSessionsView';
import { RbacMatrixView } from './RbacMatrixView';
import { FraudDetectionEngineView } from './FraudDetectionEngineView';
import { PaymentSecurityAiEngineView } from './PaymentSecurityAiEngineView';
import { ApiSecurityComplianceView } from './ApiSecurityComplianceView';
import { AuditLogsMonitoringView } from './AuditLogsMonitoringView';
import { IncidentManagementView } from './IncidentManagementView';
import { AdminSecurityCentreView } from './AdminSecurityCentreView';
import { DisasterRecoveryView } from './DisasterRecoveryView';

import {
  ShieldAlert,
  Users,
  Smartphone,
  Shield,
  Bot,
  CreditCard,
  Key,
  FileText,
  Activity,
  Settings,
  Database,
  RefreshCw,
  Lock,
} from 'lucide-react';

export type SecuritySubTab =
  | 'soc'
  | 'iam'
  | 'mfa'
  | 'rbac'
  | 'fraud'
  | 'payment'
  | 'api'
  | 'audit'
  | 'incidents'
  | 'admin'
  | 'dr';

export const SecurityMasterModule: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<SecuritySubTab>('soc');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshSecurity = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const navItems = [
    { id: 'soc', label: 'SOC Operations Dashboard', icon: ShieldAlert, badge: 'LIVE' },
    { id: 'iam', label: 'IAM User Directory', icon: Users },
    { id: 'mfa', label: 'MFA & Active Sessions', icon: Smartphone },
    { id: 'rbac', label: 'RBAC Access Matrix', icon: Shield },
    { id: 'fraud', label: 'AI Fraud Detection', icon: Bot, badge: 'AI' },
    { id: 'payment', label: 'Payment & ATO Security', icon: CreditCard },
    { id: 'api', label: 'API Security & Compliance', icon: Key },
    { id: 'audit', label: 'Audit Logs & Monitoring', icon: FileText },
    { id: 'incidents', label: 'Incident Command', icon: Activity },
    { id: 'admin', label: 'Admin Security Centre', icon: Settings },
    { id: 'dr', label: 'Disaster Recovery', icon: Database },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Module 19 Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950/50 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 bg-rose-500/20 text-rose-400 border border-rose-500/40 rounded-full text-xs font-black tracking-wider uppercase">
                Module 19
              </span>
              <span className="flex items-center text-xs font-mono text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-ping" />
                Zero Trust Security & AI Threat Defense Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight flex items-center gap-3">
              <ShieldAlert className="w-8 h-8 text-rose-400" />
              Security, Fraud Detection & Compliance System
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
              Commerce Zon security infrastructure protecting Buyers, Sellers, Affiliates, Suppliers, Delivery Partners, Warehouse Staff, and Administrators against cyber threats, fraud, ATO, payment abuse, and regulatory compliance breaches.
            </p>
          </div>

          <button
            onClick={handleRefreshSecurity}
            className={`px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              isRefreshing ? 'opacity-50' : ''
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 text-rose-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Rescan Security Telemetry</span>
          </button>
        </div>
      </div>

      {/* Module 19 Horizontal Navigation Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2 shadow-xl overflow-x-auto no-scrollbar">
        <div className="flex items-center space-x-1.5 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSubTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSubTab(item.id as SecuritySubTab)}
                className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-lg font-black'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded text-[9px] font-black uppercase ${
                      isActive
                        ? 'bg-slate-950 text-rose-300'
                        : item.badge === 'LIVE'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-Tab Router View */}
      <div className="transition-all duration-300">
        {activeSubTab === 'soc' && <SecurityOpsDashboardView />}
        {activeSubTab === 'iam' && <IamUserManagementView />}
        {activeSubTab === 'mfa' && <MfaDeviceSessionsView />}
        {activeSubTab === 'rbac' && <RbacMatrixView />}
        {activeSubTab === 'fraud' && <FraudDetectionEngineView />}
        {activeSubTab === 'payment' && <PaymentSecurityAiEngineView />}
        {activeSubTab === 'api' && <ApiSecurityComplianceView />}
        {activeSubTab === 'audit' && <AuditLogsMonitoringView />}
        {activeSubTab === 'incidents' && <IncidentManagementView />}
        {activeSubTab === 'admin' && <AdminSecurityCentreView />}
        {activeSubTab === 'dr' && <DisasterRecoveryView />}
      </div>
    </div>
  );
};
