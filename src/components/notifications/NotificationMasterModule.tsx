import React, { useState } from 'react';
import { 
  Bell, LayoutDashboard, Zap, FileText, Megaphone, Layers, Sliders, Radio, Sparkles, History, ShieldCheck, Headphones
} from 'lucide-react';
import { NotificationItem, NotificationTemplate, Campaign, ChannelControlConfig, UserNotificationPreference, NotificationRole } from '../../types/notifications';
import { 
  INITIAL_NOTIFICATIONS, 
  INITIAL_TEMPLATES, 
  INITIAL_CAMPAIGNS, 
  INITIAL_CHANNELS, 
  INITIAL_USER_PREFERENCES,
  INITIAL_QUEUE_METRICS 
} from '../../data/mockNotificationsData';

import { NotificationDashboardMetrics } from './NotificationDashboardMetrics';
import { RealTimeNotificationCenter } from './RealTimeNotificationCenter';
import { TemplateManager } from './TemplateManager';
import { CampaignManager } from './CampaignManager';
import { RoleCategoriesMatrix } from './RoleCategoriesMatrix';
import { UserPreferencesView } from './UserPreferencesView';
import { BroadcastMessagingView } from './BroadcastMessagingView';
import { AiCommunicationView } from './AiCommunicationView';
import { NotificationHistoryLogs } from './NotificationHistoryLogs';
import { AdminSecurityControls } from './AdminSecurityControls';

export const NotificationMasterModule: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<
    'dashboard' | 'realtime' | 'templates' | 'campaigns' | 'categories' | 'preferences' | 'broadcast' | 'ai' | 'history' | 'security'
  >('dashboard');

  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [templates, setTemplates] = useState<NotificationTemplate[]>(INITIAL_TEMPLATES);
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [channels, setChannels] = useState<ChannelControlConfig[]>(INITIAL_CHANNELS);
  const [userPreferences, setUserPreferences] = useState<UserNotificationPreference>(INITIAL_USER_PREFERENCES);
  const [queueMetrics, setQueueMetrics] = useState(INITIAL_QUEUE_METRICS);

  const [activeRole, setActiveRole] = useState<NotificationRole>('Buyer');

  const handleAddNotification = (newNtf: NotificationItem) => {
    setNotifications(prev => [newNtf, ...prev]);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleSaveTemplate = (updatedTpl: NotificationTemplate) => {
    setTemplates(prev => {
      const idx = prev.findIndex(t => t.id === updatedTpl.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = updatedTpl;
        return copy;
      }
      return [updatedTpl, ...prev];
    });
  };

  const handleCreateCampaign = (newCamp: Campaign) => {
    setCampaigns(prev => [newCamp, ...prev]);
  };

  const handleUpdateCampaignStatus = (id: string, status: Campaign['status']) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  const handleToggleChannel = (channelId: string) => {
    setChannels(prev => prev.map(c => c.id === channelId ? { ...c, enabled: !c.enabled } : c));
  };

  const handleUpdateChannelLimit = (channelId: string, limit: number) => {
    setChannels(prev => prev.map(c => c.id === channelId ? { ...c, dailyLimit: limit } : c));
  };

  const handleRetryFailed = (id: string) => {
    setNotifications(prev => prev.map(n => {
      if (n.id === id) {
        return {
          ...n,
          status: 'delivered',
          retryAttempts: n.retryAttempts + 1,
          deliveredAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
          errorLog: undefined
        };
      }
      return n;
    }));
    alert(`Retried dispatch for Notification #${id} successfully!`);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-100 p-4 md:p-6 space-y-6">
      {/* Top Bar Header */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 rounded-xl shadow-lg font-black">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-black tracking-tight text-white">Enterprise Notification & Communication Engine</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-widest">
                Module 16
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Multi-channel real-time notification engine for Buyers, Sellers, Affiliates, Suppliers, Delivery & Admins
            </p>
          </div>
        </div>

        {/* Unread Bell Badge Summary */}
        <div className="flex items-center space-x-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
          <div className="relative">
            <Bell className="w-5 h-5 text-amber-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <div className="text-xs font-bold text-white">{unreadCount} Unread Alerts</div>
            <div className="text-[10px] text-emerald-400 font-mono">Real-Time WebSocket Stream</div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs Bar */}
      <div className="flex items-center space-x-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 overflow-x-auto">
        {[
          { id: 'dashboard', label: 'Dashboard & Metrics', icon: LayoutDashboard },
          { id: 'realtime', label: 'Real-Time Dispatch', icon: Zap },
          { id: 'templates', label: 'Template Manager', icon: FileText },
          { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
          { id: 'categories', label: 'Role Categories', icon: Layers },
          { id: 'preferences', label: 'User Preferences', icon: Sliders },
          { id: 'broadcast', label: 'Broadcast Messaging', icon: Radio },
          { id: 'ai', label: 'AI Optimization', icon: Sparkles },
          { id: 'history', label: 'Audit Logs & History', icon: History },
          { id: 'security', label: 'Admin & Security', icon: ShieldCheck }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-lg text-xs font-black whitespace-nowrap transition flex items-center space-x-1.5 ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-Module Views */}
      {activeSubTab === 'dashboard' && (
        <NotificationDashboardMetrics
          notifications={notifications}
          channels={channels}
          queueMetrics={queueMetrics}
        />
      )}

      {activeSubTab === 'realtime' && (
        <RealTimeNotificationCenter
          notifications={notifications}
          onAddNotification={handleAddNotification}
          onMarkAllAsRead={handleMarkAllAsRead}
          onMarkAsRead={handleMarkAsRead}
          onDeleteNotification={handleDeleteNotification}
          activeRole={activeRole}
          setActiveRole={setActiveRole}
        />
      )}

      {activeSubTab === 'templates' && (
        <TemplateManager
          templates={templates}
          onSaveTemplate={handleSaveTemplate}
        />
      )}

      {activeSubTab === 'campaigns' && (
        <CampaignManager
          campaigns={campaigns}
          onCreateCampaign={handleCreateCampaign}
          onUpdateCampaignStatus={handleUpdateCampaignStatus}
        />
      )}

      {activeSubTab === 'categories' && (
        <RoleCategoriesMatrix
          onSelectCategoryForTrigger={(role, cat) => {
            setActiveRole(role);
            setActiveSubTab('realtime');
          }}
        />
      )}

      {activeSubTab === 'preferences' && (
        <UserPreferencesView
          preferences={userPreferences}
          onSavePreferences={setUserPreferences}
        />
      )}

      {activeSubTab === 'broadcast' && (
        <BroadcastMessagingView
          onAddNotification={handleAddNotification}
        />
      )}

      {activeSubTab === 'ai' && (
        <AiCommunicationView />
      )}

      {activeSubTab === 'history' && (
        <NotificationHistoryLogs
          notifications={notifications}
          onRetryFailedNotification={handleRetryFailed}
        />
      )}

      {activeSubTab === 'security' && (
        <AdminSecurityControls
          channels={channels}
          onToggleChannel={handleToggleChannel}
          onUpdateChannelLimit={handleUpdateChannelLimit}
        />
      )}
    </div>
  );
};
