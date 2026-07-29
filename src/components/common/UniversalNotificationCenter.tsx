import React, { useState } from 'react';
import {
  Bell,
  Check,
  CheckCircle2,
  Trash2,
  Pin,
  Search,
  Filter,
  ShoppingBag,
  CreditCard,
  ShieldAlert,
  HelpCircle,
  MessageSquare,
  Cpu,
  Tag,
  RotateCcw,
  Wallet,
  Warehouse,
  X,
} from 'lucide-react';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'Orders' | 'Payments' | 'Security' | 'Support' | 'Messages' | 'System' | 'Marketing' | 'Returns' | 'Wallet' | 'Inventory';
  timestamp: string;
  isRead: boolean;
  isPinned: boolean;
  severity: 'info' | 'success' | 'warning' | 'danger';
}

export const UniversalNotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-101',
      title: 'High-Risk Order Blocked by AI Fraud Engine',
      message: 'Order #ORD-9842 (Value: $2,450.00) triggered velocity anomaly score 94/100 and was auto-flagged.',
      category: 'Security',
      timestamp: '2 mins ago',
      isRead: false,
      isPinned: true,
      severity: 'danger',
    },
    {
      id: 'notif-102',
      title: 'FBA Inbound Shipment Received',
      message: 'Warehouse EU-CENTRAL-1 confirmed receipt of 500 units SKU-9902 (Quantum Headphones).',
      category: 'Inventory',
      timestamp: '14 mins ago',
      isRead: false,
      isPinned: false,
      severity: 'success',
    },
    {
      id: 'notif-103',
      title: 'Commerce Zone Pay Withdrawal Approved',
      message: 'Withdrawal request $12,850.00 to Chase Commercial Bank (Ref: WDR-7712) completed.',
      category: 'Wallet',
      timestamp: '1 hour ago',
      isRead: true,
      isPinned: true,
      severity: 'info',
    },
    {
      id: 'notif-104',
      title: 'New Customer Support Ticket #TKT-8842',
      message: 'Buyer Requested RMA Return for Order #ORD-7710 due to size mismatch.',
      category: 'Support',
      timestamp: '3 hours ago',
      isRead: false,
      isPinned: false,
      severity: 'warning',
    },
    {
      id: 'notif-105',
      title: 'Stripe Payment Settlement Dispatched',
      message: 'Batch payment settlement $48,290.10 transferred to merchant reserve account.',
      category: 'Payments',
      timestamp: '5 hours ago',
      isRead: true,
      isPinned: false,
      severity: 'success',
    },
    {
      id: 'notif-106',
      title: 'Flash Sale Promo Campaign Live',
      message: 'Summer Super Sale discounts auto-applied across 1,200 eligible vendor listings.',
      category: 'Marketing',
      timestamp: '1 day ago',
      isRead: true,
      isPinned: false,
      severity: 'info',
    },
  ]);

  const [activeTab, setActiveTab] = useState<string>('All');
  const [query, setQuery] = useState<string>('');

  const categories = ['All', 'Unread', 'Pinned', 'Orders', 'Payments', 'Security', 'Support', 'Wallet', 'Inventory'];

  const filtered = notifications.filter((item) => {
    if (activeTab === 'Unread') return !item.isRead;
    if (activeTab === 'Pinned') return item.isPinned;
    if (activeTab !== 'All' && item.category !== activeTab) return false;

    if (!query) return true;
    return (
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.message.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    );
  });

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const togglePin = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Security': return ShieldAlert;
      case 'Payments': return CreditCard;
      case 'Wallet': return Wallet;
      case 'Inventory': return Warehouse;
      case 'Support': return HelpCircle;
      case 'Orders': return ShoppingBag;
      case 'Marketing': return Tag;
      case 'Returns': return RotateCcw;
      default: return Cpu;
    }
  };

  return (
    <div className="p-6 bg-slate-950 text-slate-100 min-h-screen space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl relative">
            <Bell className="w-8 h-8" />
            {notifications.some((n) => !n.isRead) && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full ring-4 ring-slate-900 animate-pulse" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-100 tracking-tight">Central Notification Center</h1>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Global event alerts & platform triggers • {notifications.filter((n) => !n.isRead).length} unread alerts
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={markAllAsRead}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-mono transition flex items-center space-x-2"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Mark All Read</span>
          </button>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl space-y-4">
        <div className="flex flex-col md:flex-row gap-3 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search notifications by keyword or category..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 font-mono focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 overflow-x-auto w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition ${
                  activeTab === cat
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 p-12 rounded-3xl text-center font-mono space-y-2">
            <Bell className="w-8 h-8 text-slate-600 mx-auto" />
            <div className="text-slate-300 font-bold">No notifications match your filter</div>
            <p className="text-slate-500 text-xs">Try selecting a different category or clearing search query.</p>
          </div>
        ) : (
          filtered.map((item) => {
            const Icon = getCategoryIcon(item.category);
            return (
              <div
                key={item.id}
                className={`p-4 rounded-3xl border transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  !item.isRead
                    ? 'bg-slate-900/90 border-amber-500/30 shadow-lg shadow-amber-500/5'
                    : 'bg-slate-900/40 border-slate-800'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`p-3 rounded-2xl border ${
                      item.severity === 'danger'
                        ? 'bg-red-500/10 border-red-500/20 text-red-400'
                        : item.severity === 'warning'
                        ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        : item.severity === 'success'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-100 text-sm">{item.title}</span>
                      <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-400 rounded font-mono">
                        {item.category}
                      </span>
                      {item.isPinned && (
                        <span className="text-[10px] px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded font-mono flex items-center space-x-1">
                          <Pin className="w-2.5 h-2.5" />
                          <span>Pinned</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 font-mono leading-relaxed">{item.message}</p>
                    <div className="text-[10px] text-slate-500 font-mono">{item.timestamp}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end md:self-center">
                  <button
                    onClick={() => togglePin(item.id)}
                    className={`p-2 rounded-xl text-xs font-mono transition border ${
                      item.isPinned
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                    title="Pin Notification"
                  >
                    <Pin className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => toggleRead(item.id)}
                    className={`p-2 rounded-xl text-xs font-mono transition border ${
                      item.isRead
                        ? 'bg-slate-950 border-slate-800 text-slate-500'
                        : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold'
                    }`}
                    title={item.isRead ? 'Mark Unread' : 'Mark Read'}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => deleteNotification(item.id)}
                    className="p-2 bg-slate-950 border border-slate-800 hover:bg-red-500/10 hover:border-red-500/30 text-slate-500 hover:text-red-400 rounded-xl text-xs transition"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
