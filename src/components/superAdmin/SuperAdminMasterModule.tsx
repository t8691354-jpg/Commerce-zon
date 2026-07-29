import React, { useState } from 'react';
import { SuperAdminExecutiveDashboard } from './SuperAdminExecutiveDashboard';
import { GlobalUserManagementView } from './GlobalUserManagementView';
import { PlatformConfigLocalizationView } from './PlatformConfigLocalizationView';
import { MarketplacePoliciesCmsView } from './MarketplacePoliciesCmsView';
import { FinancialControlsCommissionView } from './FinancialControlsCommissionView';
import { ProductContentModerationView } from './ProductContentModerationView';
import { CategoryTaxonomyEngineView } from './CategoryTaxonomyEngineView';
import { HomepageCmsDragDropView } from './HomepageCmsDragDropView';
import { PromotionsDealsManagementView } from './PromotionsDealsManagementView';
import { AiPlatformControlsView } from './AiPlatformControlsView';
import { IntegrationsApiVaultView } from './IntegrationsApiVaultView';
import { SystemMonitoringJobsView } from './SystemMonitoringJobsView';
import { BackupRestoreWizardView } from './BackupRestoreWizardView';
import { FeatureFlagsCanaryView } from './FeatureFlagsCanaryView';
import { AuditLogsCentralView } from './AuditLogsCentralView';
import { EnterpriseReportsExporterView } from './EnterpriseReportsExporterView';
import { AlertNotificationsRoutingView } from './AlertNotificationsRoutingView';

import {
  BarChart3,
  Users,
  Settings,
  FileText,
  DollarSign,
  ShieldAlert,
  FolderTree,
  Layout,
  Tag,
  Cpu,
  Key,
  Activity,
  Database,
  Sliders,
  ShieldCheck,
  Download,
  Bell,
  Crown,
} from 'lucide-react';

export type SuperAdminSubTab =
  | 'executive'
  | 'users'
  | 'config'
  | 'policies'
  | 'financials'
  | 'moderation'
  | 'taxonomy'
  | 'homepage_cms'
  | 'promotions'
  | 'ai_controls'
  | 'integrations'
  | 'monitoring'
  | 'backup'
  | 'feature_flags'
  | 'audit_logs'
  | 'reports'
  | 'alerts';

export const SuperAdminMasterModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SuperAdminSubTab>('executive');

  const navTabs = [
    { id: 'executive', label: 'Executive Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Global Users (10 Roles)', icon: Users },
    { id: 'config', label: 'Platform & Localization', icon: Settings },
    { id: 'policies', label: 'Marketplace Policies', icon: FileText },
    { id: 'financials', label: 'Financial Controls', icon: DollarSign },
    { id: 'moderation', label: 'Content Moderation', icon: ShieldAlert },
    { id: 'taxonomy', label: 'Category Taxonomy', icon: FolderTree },
    { id: 'homepage_cms', label: 'Homepage CMS', icon: Layout },
    { id: 'promotions', label: 'Promotions & Deals', icon: Tag },
    { id: 'ai_controls', label: 'AI Platform Controls', icon: Cpu },
    { id: 'integrations', label: 'API Integrations Vault', icon: Key },
    { id: 'monitoring', label: 'System Telemetry', icon: Activity },
    { id: 'backup', label: 'Backup & DR Wizard', icon: Database },
    { id: 'feature_flags', label: 'Feature Flags & Canary', icon: Sliders },
    { id: 'audit_logs', label: 'Central Audit Logs', icon: ShieldCheck },
    { id: 'reports', label: 'Enterprise Reports', icon: Download },
    { id: 'alerts', label: 'Alert Dispatch', icon: Bell },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 md:p-8 font-sans space-y-6">
      {/* Master Module Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-gradient-to-tr from-amber-500 to-amber-300 rounded-2xl flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
            <Crown className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-black rounded-full font-mono uppercase tracking-wider">
                Module 20 • Master Control Platform
              </span>
              <span className="text-xs text-slate-400 font-mono">Build v20.4-PROD</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight mt-1">
              Super Admin Control Panel & Platform Management
            </h1>
          </div>
        </div>
      </div>

      {/* Sub Navigation Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800/80">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SuperAdminSubTab)}
              className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab View Rendering */}
      <div>
        {activeTab === 'executive' && <SuperAdminExecutiveDashboard />}
        {activeTab === 'users' && <GlobalUserManagementView />}
        {activeTab === 'config' && <PlatformConfigLocalizationView />}
        {activeTab === 'policies' && <MarketplacePoliciesCmsView />}
        {activeTab === 'financials' && <FinancialControlsCommissionView />}
        {activeTab === 'moderation' && <ProductContentModerationView />}
        {activeTab === 'taxonomy' && <CategoryTaxonomyEngineView />}
        {activeTab === 'homepage_cms' && <HomepageCmsDragDropView />}
        {activeTab === 'promotions' && <PromotionsDealsManagementView />}
        {activeTab === 'ai_controls' && <AiPlatformControlsView />}
        {activeTab === 'integrations' && <IntegrationsApiVaultView />}
        {activeTab === 'monitoring' && <SystemMonitoringJobsView />}
        {activeTab === 'backup' && <BackupRestoreWizardView />}
        {activeTab === 'feature_flags' && <FeatureFlagsCanaryView />}
        {activeTab === 'audit_logs' && <AuditLogsCentralView />}
        {activeTab === 'reports' && <EnterpriseReportsExporterView />}
        {activeTab === 'alerts' && <AlertNotificationsRoutingView />}
      </div>
    </div>
  );
};
