import React, { useState } from 'react';
import { 
  Radio, Users, Send, AlertTriangle, ShieldCheck, Globe, Filter, Sparkles, CheckCircle2
} from 'lucide-react';
import { NotificationRole, NotificationChannel, NotificationItem } from '../../types/notifications';

interface Props {
  onAddNotification: (ntf: NotificationItem) => void;
}

export const BroadcastMessagingView: React.FC<Props> = ({ onAddNotification }) => {
  const [targetAudience, setTargetAudience] = useState<NotificationRole | 'All'>('All');
  const [country, setCountry] = useState<string>('All');
  const [language, setLanguage] = useState<string>('en-US');
  const [membership, setMembership] = useState<string>('All');
  const [isEmergencyAlert, setIsEmergencyAlert] = useState<boolean>(false);

  const [selectedChannels, setSelectedChannels] = useState<Record<NotificationChannel, boolean>>({
    in_app: true,
    email: true,
    sms: false,
    push_android: true,
    push_ios: true,
    push_web: true,
    whatsapp: false,
    telegram: false
  });

  const [broadcastTitle, setBroadcastTitle] = useState<string>('Important Amazon Marketplace Platform Notice');
  const [broadcastBody, setBroadcastBody] = useState<string>('Scheduled database maintenance will occur tonight at 02:00 UTC. Orders and payments remain active.');

  const toggleChannel = (ch: NotificationChannel) => {
    setSelectedChannels(prev => ({ ...prev, [ch]: !prev[ch] }));
  };

  // Estimated reach calculator
  const estimatedReach = targetAudience === 'All' ? 1485000 :
    targetAudience === 'Buyer' ? 1120000 :
    targetAudience === 'Seller' ? 185000 :
    targetAudience === 'Affiliate' ? 62000 : 4500;

  const handleDispatchBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastBody) return;

    const id = `BCST-${Date.now()}`;
    const timeStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const activeChs = (Object.keys(selectedChannels) as NotificationChannel[]).filter(c => selectedChannels[c]);

    activeChs.forEach(ch => {
      const newNtf: NotificationItem = {
        id: `${id}-${ch}`,
        recipientId: 'BROADCAST-GROUP',
        recipientName: `All ${targetAudience} Recipients (${estimatedReach.toLocaleString()})`,
        recipientEmail: `broadcast-${targetAudience.toLowerCase()}@marketplace-broadcast.org`,
        role: targetAudience === 'All' ? 'Buyer' : targetAudience,
        category: 'Platform Notice',
        channel: ch,
        title: broadcastTitle,
        body: broadcastBody,
        status: 'delivered',
        priority: isEmergencyAlert ? 'critical' : 'high',
        timestamp: timeStr,
        deliveredAt: timeStr,
        read: false,
        clicked: false,
        retryAttempts: 0,
        maxRetries: 3
      };
      onAddNotification(newNtf);
    });

    alert(`Broadcast dispatched to ${estimatedReach.toLocaleString()} recipients across ${activeChs.length} channels!`);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950/30 to-slate-900 border border-rose-500/30 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/40">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Administrator Broadcast & Audience Segment Engine</h2>
            <p className="text-xs text-slate-300">Dispatch platform-wide notices, emergency security warnings & targeted cohort broadcasts</p>
          </div>
        </div>

        <div className="px-4 py-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center space-x-3 text-xs">
          <span className="text-slate-400 font-medium">Estimated Audience Reach:</span>
          <span className="text-emerald-400 font-black text-sm">{estimatedReach.toLocaleString()} Users</span>
        </div>
      </div>

      <form onSubmit={handleDispatchBroadcast} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Target Audience & Segmentation */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2 pb-3 border-b border-slate-800">
            <Users className="w-4 h-4 text-amber-400" />
            <span>Audience Cohort & Segmentation</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Target Recipient Group</label>
            <select
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-bold"
            >
              <option value="All">All Marketplace Users (1.48M Recipients)</option>
              <option value="Buyer">Buyers Only (1.12M Recipients)</option>
              <option value="Seller">Active Merchants & Sellers (185K Recipients)</option>
              <option value="Affiliate">Affiliate Partners (62K Recipients)</option>
              <option value="Supplier">Suppliers & Manufacturers (12K Recipients)</option>
              <option value="Warehouse">Warehouse & FBA Staff (8.5K Recipients)</option>
              <option value="DeliveryPartner">Delivery Couriers (4.5K Recipients)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Country Cohort</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
              >
                <option value="All">All Countries</option>
                <option value="US">United States (US)</option>
                <option value="CA">Canada (CA)</option>
                <option value="UK">United Kingdom (UK)</option>
                <option value="DE">Germany (DE)</option>
                <option value="JP">Japan (JP)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Membership / Plan</label>
              <select
                value={membership}
                onChange={(e) => setMembership(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
              >
                <option value="All">All Tiers</option>
                <option value="Prime">Amazon Prime Members</option>
                <option value="Professional">Professional Sellers</option>
              </select>
            </div>
          </div>

          {/* Channel Selector Checkboxes */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="block text-xs font-bold text-slate-300">Broadcast Channels</label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(selectedChannels) as NotificationChannel[]).map((ch) => (
                <label key={ch} className="p-2 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between text-xs cursor-pointer">
                  <span className="text-slate-300 font-medium uppercase text-[11px]">{ch.replace('_', ' ')}</span>
                  <input
                    type="checkbox"
                    checked={selectedChannels[ch]}
                    onChange={() => toggleChannel(ch)}
                    className="accent-amber-500 rounded"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Emergency Alert Mode */}
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span className="text-xs font-bold text-rose-300">High Priority Emergency Mode</span>
            </div>
            <input
              type="checkbox"
              checked={isEmergencyAlert}
              onChange={(e) => setIsEmergencyAlert(e.target.checked)}
              className="w-4 h-4 accent-rose-500 rounded"
            />
          </div>
        </div>

        {/* Right Column: Message Content & Dispatch */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white pb-3 border-b border-slate-800">Broadcast Message Composition</h3>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Broadcast Title / Subject</label>
              <input
                type="text"
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Message Body</label>
              <textarea
                rows={6}
                value={broadcastBody}
                onChange={(e) => setBroadcastBody(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-amber-400 resize-none leading-relaxed"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center justify-center space-x-2 shadow-xl"
          >
            <Send className="w-4 h-4" />
            <span>Dispatch Broadcast to {estimatedReach.toLocaleString()} Users</span>
          </button>
        </div>
      </form>
    </div>
  );
};
