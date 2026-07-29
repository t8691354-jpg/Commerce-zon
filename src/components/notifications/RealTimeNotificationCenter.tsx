import React, { useState, useEffect } from 'react';
import { 
  Bell, Check, Trash2, Send, Zap, Radio, RefreshCw, Filter, 
  Smartphone, Mail, MessageSquare, ShieldAlert, Sparkles, AlertCircle, Play, Pause, Layers
} from 'lucide-react';
import { NotificationItem, NotificationRole, NotificationChannel } from '../../types/notifications';
import { ROLE_CATEGORIES } from '../../data/mockNotificationsData';

interface Props {
  notifications: NotificationItem[];
  onAddNotification: (newNtf: NotificationItem) => void;
  onMarkAllAsRead: () => void;
  onMarkAsRead: (id: string) => void;
  onDeleteNotification: (id: string) => void;
  activeRole: NotificationRole;
  setActiveRole: (role: NotificationRole) => void;
}

export const RealTimeNotificationCenter: React.FC<Props> = ({
  notifications,
  onAddNotification,
  onMarkAllAsRead,
  onMarkAsRead,
  onDeleteNotification,
  activeRole,
  setActiveRole
}) => {
  const [selectedRole, setSelectedRole] = useState<NotificationRole>(activeRole || 'Buyer');
  const [selectedCategory, setSelectedCategory] = useState<string>(ROLE_CATEGORIES['Buyer'][0]);
  const [selectedChannel, setSelectedChannel] = useState<NotificationChannel>('in_app');
  const [recipientName, setRecipientName] = useState<string>('Alex Wright');
  const [recipientEmail, setRecipientEmail] = useState<string>('alex.wright@amazon-market.com');
  const [recipientPhone, setRecipientPhone] = useState<string>('+1 (555) 019-2831');
  const [customTitle, setCustomTitle] = useState<string>('Your order is out for delivery');
  const [customBody, setCustomBody] = useState<string>('Order #AMZ-99201 is out for delivery with driver Carlos M.');
  const [priority, setPriority] = useState<'low' | 'normal' | 'high' | 'critical'>('high');

  const [autoSimulate, setAutoSimulate] = useState<boolean>(false);
  const [simulationLog, setSimulationLog] = useState<string[]>([]);
  const [filterRole, setFilterRole] = useState<string>('All');
  const [drawerOpen, setDrawerOpen] = useState<boolean>(true);

  // Sync category when role changes
  useEffect(() => {
    const cats = ROLE_CATEGORIES[selectedRole];
    if (cats && cats.length > 0) {
      setSelectedCategory(cats[0]);
    }
  }, [selectedRole]);

  // Handle auto simulation tick
  useEffect(() => {
    let interval: any;
    if (autoSimulate) {
      interval = setInterval(() => {
        triggerSimulatedEvent();
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [autoSimulate, selectedRole, notifications]);

  const triggerSimulatedEvent = () => {
    const roles: NotificationRole[] = ['Buyer', 'Seller', 'Affiliate', 'Supplier', 'Warehouse', 'DeliveryPartner', 'Administrator'];
    const randomRole = roles[Math.floor(Math.random() * roles.length)];
    const cats = ROLE_CATEGORIES[randomRole];
    const randomCat = cats[Math.floor(Math.random() * cats.length)];
    const channels: NotificationChannel[] = ['in_app', 'email', 'sms', 'push_android', 'push_ios', 'whatsapp'];
    const randomChannel = channels[Math.floor(Math.random() * channels.length)];

    const id = `NTF-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const timeStr = now.toISOString().replace('T', ' ').substring(0, 19);

    const newNtf: NotificationItem = {
      id,
      recipientId: `USR-${Math.floor(1000 + Math.random() * 8000)}`,
      recipientName: `${randomRole} User`,
      recipientEmail: `${randomRole.toLowerCase()}@marketplace.com`,
      recipientPhone: '+1 (555) 992-0011',
      role: randomRole,
      category: randomCat,
      channel: randomChannel,
      title: `[Live Event] ${randomCat}`,
      body: `Automated real-time event for ${randomRole} triggered via WebSocket channel ${randomChannel.toUpperCase()}.`,
      status: 'delivered',
      priority: Math.random() > 0.8 ? 'critical' : Math.random() > 0.5 ? 'high' : 'normal',
      timestamp: timeStr,
      deliveredAt: timeStr,
      read: false,
      clicked: false,
      retryAttempts: 0,
      maxRetries: 3
    };

    onAddNotification(newNtf);
    setSimulationLog(prev => [`[${timeStr.substring(11)}] Broadcasted ${id} (${randomRole} - ${randomCat}) via ${randomChannel}`, ...prev.slice(0, 8)]);
  };

  const handleManualTrigger = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `NTF-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const timeStr = now.toISOString().replace('T', ' ').substring(0, 19);

    const newNtf: NotificationItem = {
      id,
      recipientId: `USR-${Math.floor(1000 + Math.random() * 8000)}`,
      recipientName,
      recipientEmail,
      recipientPhone,
      role: selectedRole,
      category: selectedCategory,
      channel: selectedChannel,
      title: customTitle,
      body: customBody,
      status: 'delivered',
      priority,
      timestamp: timeStr,
      deliveredAt: timeStr,
      read: false,
      clicked: false,
      retryAttempts: 0,
      maxRetries: 3
    };

    onAddNotification(newNtf);
    setSimulationLog(prev => [`[${timeStr.substring(11)}] Manual dispatch ${id} to ${recipientName} (${selectedRole})`, ...prev.slice(0, 8)]);
  };

  const filteredNotifications = notifications.filter(n => {
    if (filterRole === 'All') return true;
    return n.role === filterRole;
  });

  const unreadCount = filteredNotifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Live Controls Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/30 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/40">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-white">WebSocket Real-Time Dispatch Engine</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 uppercase tracking-widest">
                Connected
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Live broadcast feed, instant in-app drawer alerts, and real-time event simulation trigger
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setAutoSimulate(!autoSimulate)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-2 border ${
              autoSimulate
                ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                : 'bg-amber-500 text-slate-950 border-amber-400 hover:bg-amber-400 font-black'
            }`}
          >
            {autoSimulate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{autoSimulate ? 'Pause Auto Stream' : 'Start Auto Stream (4s Ticks)'}</span>
          </button>

          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="px-3.5 py-2 rounded-lg text-xs font-bold bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 flex items-center space-x-2"
          >
            <Bell className="w-4 h-4 text-amber-400" />
            <span>In-App Drawer</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-black">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Trigger Test Notification Form */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Trigger Test Notification</span>
            </h3>
            <span className="text-[11px] text-slate-400">Simulator v16.0</span>
          </div>

          <form onSubmit={handleManualTrigger} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Recipient Marketplace Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as NotificationRole)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-medium"
              >
                <option value="Buyer">Buyer (Customer)</option>
                <option value="Seller">Seller (Merchant / Brand)</option>
                <option value="Affiliate">Affiliate Partner</option>
                <option value="Supplier">Supplier / Manufacturer</option>
                <option value="Warehouse">Warehouse & FBA Staff</option>
                <option value="DeliveryPartner">Delivery Courier Partner</option>
                <option value="Administrator">Administrator / SecOps</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Notification Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-medium"
                >
                  {ROLE_CATEGORIES[selectedRole]?.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Channel</label>
                <select
                  value={selectedChannel}
                  onChange={(e) => setSelectedChannel(e.target.value as NotificationChannel)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-medium"
                >
                  <option value="in_app">In-App Notification</option>
                  <option value="email">Email (AWS SES)</option>
                  <option value="sms">SMS (Twilio)</option>
                  <option value="push_android">Android Push (FCM)</option>
                  <option value="push_ios">iOS Push (APNs)</option>
                  <option value="push_web">Browser Push</option>
                  <option value="whatsapp">WhatsApp Business API</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Recipient Name</label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="low">Low Priority</option>
                  <option value="normal">Normal Priority</option>
                  <option value="high">High Priority</option>
                  <option value="critical font-bold">Critical Priority</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Title</label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Body Content</label>
              <textarea
                rows={3}
                value={customBody}
                onChange={(e) => setCustomBody(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 transition flex items-center justify-center space-x-2 shadow-lg"
            >
              <Send className="w-4 h-4" />
              <span>Dispatch Real-Time Event</span>
            </button>
          </form>

          {/* Simulation Feed Output */}
          <div className="pt-3 border-t border-slate-800">
            <div className="text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider flex items-center justify-between">
              <span>Live Engine Event Console</span>
              <span className="text-emerald-400 font-mono">STDOUT</span>
            </div>
            <div className="bg-slate-950 rounded-lg p-2.5 text-[11px] font-mono text-slate-300 space-y-1 h-28 overflow-y-auto border border-slate-800">
              {simulationLog.length === 0 ? (
                <div className="text-slate-600 italic">No events triggered yet. Click dispatch or enable auto stream.</div>
              ) : (
                simulationLog.map((log, idx) => (
                  <div key={idx} className="text-emerald-400/90 hover:text-emerald-300">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Live Notification Bell Center / Feed Drawer */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Bell className="w-5 h-5 text-amber-400" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center animate-bounce">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Live In-App Notification Center</h3>
                  <p className="text-xs text-slate-400">Recipient feed rendering real-time events</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={onMarkAllAsRead}
                  className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 flex items-center space-x-1"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Mark All Read</span>
                </button>
              </div>
            </div>

            {/* Filter Tabs by Role */}
            <div className="flex items-center space-x-1.5 mb-4 overflow-x-auto pb-1">
              <span className="text-xs text-slate-400 font-semibold mr-1">Role:</span>
              {['All', 'Buyer', 'Seller', 'Affiliate', 'Supplier', 'Warehouse', 'DeliveryPartner', 'Administrator'].map(role => (
                <button
                  key={role}
                  onClick={() => setFilterRole(role)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap transition ${
                    filterRole === role
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>

            {/* List of Live Notifications */}
            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No notifications found for this role filter.
                </div>
              ) : (
                filteredNotifications.map((ntf) => (
                  <div
                    key={ntf.id}
                    className={`p-3.5 rounded-lg border transition flex items-start justify-between gap-3 ${
                      !ntf.read 
                        ? 'bg-slate-800/80 border-amber-500/40 shadow-md' 
                        : 'bg-slate-950/60 border-slate-800/80'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg mt-0.5 ${
                        ntf.priority === 'critical' 
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                          : ntf.priority === 'high' 
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                      }`}>
                        {ntf.channel === 'email' ? <Mail className="w-4 h-4" /> :
                         ntf.channel === 'sms' ? <MessageSquare className="w-4 h-4" /> :
                         ntf.channel.includes('push') ? <Smartphone className="w-4 h-4" /> :
                         <Bell className="w-4 h-4" />}
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-white">{ntf.title}</span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                            {ntf.role}
                          </span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            {ntf.category}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 mt-1">{ntf.body}</p>

                        <div className="flex items-center space-x-4 mt-2 text-[10px] text-slate-500">
                          <span>Channel: <strong className="text-slate-300 uppercase">{ntf.channel}</strong></span>
                          <span>Recipient: <strong className="text-slate-300">{ntf.recipientName}</strong></span>
                          <span>Time: {ntf.timestamp}</span>
                          {ntf.read && <span className="text-emerald-400 font-semibold">✓ Read</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      {!ntf.read && (
                        <button
                          onClick={() => onMarkAsRead(ntf.id)}
                          className="p-1.5 text-slate-400 hover:text-emerald-400 rounded hover:bg-slate-800"
                          title="Mark as read"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => onDeleteNotification(ntf.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800"
                        title="Delete notification"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
