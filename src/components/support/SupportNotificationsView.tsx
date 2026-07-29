import React, { useState } from 'react';
import { SupportNotification } from '../../types/support';
import { MOCK_NOTIFICATIONS } from '../../data/supportMockData';
import { Bell, Mail, Smartphone, Send, CheckCircle2, Sliders } from 'lucide-react';

export const SupportNotificationsView: React.FC = () => {
  const [notifications, setNotifications] = useState<SupportNotification[]>(MOCK_NOTIFICATIONS);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true);

  const handleTestDispatch = () => {
    const testNotif: SupportNotification = {
      notificationId: `NOTIF-${Date.now()}`,
      ticketId: 'TCK-90124',
      recipientRole: 'BUYER',
      title: 'SMS & Push Notification Test',
      body: 'Your Amazon support ticket status was refreshed by AI Copilot Engine.',
      channels: ['EMAIL', 'SMS', 'PUSH', 'IN_APP'],
      sentAt: new Date().toISOString(),
      isRead: false,
    };
    setNotifications([testNotif, ...notifications]);
    alert('Test notification broadcast dispatched across Email, SMS, Push, and In-App channels!');
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Bell className="w-5 h-5 text-[#febd69]" />
            <span>Multi-Channel Notification Dispatch Engine</span>
          </h2>
          <p className="text-xs text-slate-400">
            Real-time delivery of ticket updates, SLA warnings, and chat invites via Email, SMS, Push, and In-App.
          </p>
        </div>

        <button
          onClick={handleTestDispatch}
          className="px-4 py-2 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black text-xs rounded-xl shadow flex items-center space-x-1.5"
        >
          <Send className="w-4 h-4" />
          <span>Dispatch Test Alert</span>
        </button>
      </div>

      {/* Channel Toggles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex justify-between items-center text-xs">
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-white">Email Gateway (SES)</span>
          </div>
          <input
            type="checkbox"
            checked={emailEnabled}
            onChange={(e) => setEmailEnabled(e.target.checked)}
            className="rounded accent-[#febd69] w-4 h-4"
          />
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex justify-between items-center text-xs">
          <div className="flex items-center space-x-2">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white">SMS Gateway (SNS)</span>
          </div>
          <input
            type="checkbox"
            checked={smsEnabled}
            onChange={(e) => setSmsEnabled(e.target.checked)}
            className="rounded accent-[#febd69] w-4 h-4"
          />
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex justify-between items-center text-xs">
          <div className="flex items-center space-x-2">
            <Bell className="w-4 h-4 text-purple-400" />
            <span className="font-bold text-white">Mobile Push (FCM)</span>
          </div>
          <input
            type="checkbox"
            checked={pushEnabled}
            onChange={(e) => setPushEnabled(e.target.checked)}
            className="rounded accent-[#febd69] w-4 h-4"
          />
        </div>
      </div>

      {/* Notifications Audit Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950 border-b border-slate-800 text-xs font-bold text-white">
          Dispatched Notification Logs ({notifications.length})
        </div>

        <div className="divide-y divide-slate-800 text-xs">
          {notifications.map((n) => (
            <div key={n.notificationId} className="p-4 bg-slate-900 hover:bg-slate-800/50 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#febd69]">{n.title}</span>
                <span className="font-mono text-[10px] text-slate-500">
                  {new Date(n.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-slate-300 text-xs">{n.body}</p>
              <div className="flex space-x-2 pt-1 font-mono text-[10px]">
                {n.channels.map((ch) => (
                  <span key={ch} className="px-1.5 py-0.2 bg-slate-950 text-cyan-400 rounded border border-slate-800 font-bold">
                    {ch}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
