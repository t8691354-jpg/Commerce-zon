import React, { useState } from 'react';
import { 
  Megaphone, Calendar, Users, DollarSign, Send, Clock, Play, Pause, XCircle, 
  Plus, CheckCircle2, TrendingUp, BarChart, Tag, Filter, Globe
} from 'lucide-react';
import { Campaign, CampaignType, CampaignSendMode, NotificationChannel, NotificationRole } from '../../types/notifications';

interface Props {
  campaigns: Campaign[];
  onCreateCampaign: (campaign: Campaign) => void;
  onUpdateCampaignStatus: (id: string, status: Campaign['status']) => void;
}

export const CampaignManager: React.FC<Props> = ({ campaigns, onCreateCampaign, onUpdateCampaignStatus }) => {
  const [showWizard, setShowWizard] = useState<boolean>(false);

  // New Campaign Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<CampaignType>('flash_sale');
  const [channel, setChannel] = useState<NotificationChannel>('push_android');
  const [sendMode, setSendMode] = useState<CampaignSendMode>('immediate');
  const [targetRole, setTargetRole] = useState<NotificationRole | 'All'>('Buyer');
  const [membership, setMembership] = useState<'Prime' | 'Standard' | 'VIP' | 'All'>('Prime');
  const [minSpent, setMinSpent] = useState<number>(100);
  const [scheduledAt, setScheduledAt] = useState<string>('2026-08-01 12:00:00');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newCampaign: Campaign = {
      id: `CMP-${Date.now()}`,
      title,
      type,
      channel,
      sendMode,
      status: sendMode === 'immediate' ? 'running' : 'scheduled',
      targetRole,
      segmentFilter: {
        membership,
        minSpent,
        country: 'US'
      },
      templateId: 'TPL-PUSH-FLASH-SALE',
      scheduledAt: sendMode === 'scheduled' ? scheduledAt : undefined,
      totalRecipients: Math.floor(100000 + Math.random() * 300000),
      sentCount: sendMode === 'immediate' ? 12000 : 0,
      deliveredCount: sendMode === 'immediate' ? 11800 : 0,
      failedCount: 0,
      openCount: 0,
      clickCount: 0,
      convertedCount: 0,
      revenueGenerated: 0,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    onCreateCampaign(newCampaign);
    setShowWizard(false);
    setTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Campaign Header & Action Strip */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-xl">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Marketplace Campaign Management Engine</h2>
            <p className="text-xs text-slate-400">Targeted broadcast marketing, flash sales, seasonal events & recurring automation</p>
          </div>
        </div>

        <button
          onClick={() => setShowWizard(!showWizard)}
          className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center space-x-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Campaign</span>
        </button>
      </div>

      {/* Campaign Creation Wizard Modal/Panel */}
      {showWizard && (
        <div className="bg-slate-900 border border-amber-500/40 rounded-xl p-5 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Megaphone className="w-4 h-4 text-amber-400" />
              <span>Configure Target Campaign</span>
            </h3>
            <button onClick={() => setShowWizard(false)} className="text-slate-400 hover:text-white">
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Campaign Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prime Day Early Bird Electronics Flash Sale"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Campaign Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as CampaignType)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="flash_sale">Flash Sale</option>
                  <option value="promotional">Promotional</option>
                  <option value="product_launch">Product Launch</option>
                  <option value="seasonal">Seasonal Event</option>
                  <option value="holiday">Holiday Campaign</option>
                  <option value="announcement">Official Announcement</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Channel</label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value as NotificationChannel)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 uppercase font-mono"
                >
                  <option value="push_android">Android Push</option>
                  <option value="push_ios">iOS Push</option>
                  <option value="email">Email (AWS SES)</option>
                  <option value="in_app">In-App Stream</option>
                  <option value="whatsapp">WhatsApp Business</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Send Mode</label>
                <select
                  value={sendMode}
                  onChange={(e) => setSendMode(e.target.value as CampaignSendMode)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="immediate">Immediate Dispatch</option>
                  <option value="scheduled">Scheduled Send</option>
                  <option value="recurring">Recurring Automation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Role</label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="All">All Marketplace Users</option>
                  <option value="Buyer">Buyers Only</option>
                  <option value="Seller">Sellers Only</option>
                  <option value="Affiliate">Affiliates Only</option>
                  <option value="Supplier">Suppliers Only</option>
                </select>
              </div>
            </div>

            {/* Segmentation Controls */}
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1">
                <Filter className="w-3.5 h-3.5" />
                <span>Audience Segmentation Filters</span>
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Membership Tier</label>
                  <select
                    value={membership}
                    onChange={(e) => setMembership(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
                  >
                    <option value="All">All Members</option>
                    <option value="Prime">Amazon Prime Members Only</option>
                    <option value="VIP">VIP Tier</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Minimum Customer Spend Threshold ($)</label>
                  <input
                    type="number"
                    value={minSpent}
                    onChange={(e) => setMinSpent(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowWizard(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 flex items-center space-x-1.5 shadow-lg"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Launch Campaign</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Campaign Performance Grid */}
      <div className="grid grid-cols-1 gap-4">
        {campaigns.map((cmp) => {
          const openRate = cmp.sentCount > 0 ? ((cmp.openCount / cmp.sentCount) * 100).toFixed(1) : '0.0';
          const clickRate = cmp.openCount > 0 ? ((cmp.clickCount / cmp.openCount) * 100).toFixed(1) : '0.0';

          return (
            <div key={cmp.id} className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-3">
                  <span className={`px-2.5 py-1 rounded text-xs font-black uppercase tracking-wider ${
                    cmp.status === 'running' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse' :
                    cmp.status === 'scheduled' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                    'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {cmp.status}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-white">{cmp.title}</h3>
                    <div className="flex items-center space-x-3 text-xs text-slate-400 mt-0.5">
                      <span>Type: <strong className="text-amber-400 capitalize">{cmp.type.replace('_', ' ')}</strong></span>
                      <span>•</span>
                      <span>Channel: <strong className="text-slate-200 uppercase">{cmp.channel}</strong></span>
                      <span>•</span>
                      <span>Target: <strong className="text-slate-200">{cmp.targetRole} ({cmp.segmentFilter.membership || 'All'})</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {cmp.status === 'running' && (
                    <button
                      onClick={() => onUpdateCampaignStatus(cmp.id, 'paused')}
                      className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold flex items-center space-x-1 border border-slate-700"
                    >
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause</span>
                    </button>
                  )}
                  {cmp.status === 'paused' && (
                    <button
                      onClick={() => onUpdateCampaignStatus(cmp.id, 'running')}
                      className="px-3 py-1.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center space-x-1 border border-emerald-500/40"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Resume</span>
                    </button>
                  )}
                  <button
                    onClick={() => onUpdateCampaignStatus(cmp.id, 'cancelled')}
                    className="px-3 py-1.5 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 text-xs font-bold flex items-center space-x-1 border border-rose-500/40"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>

              {/* Campaign Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Target Reach</div>
                  <div className="text-sm font-black text-white mt-1">{cmp.totalRecipients.toLocaleString()}</div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Dispatched</div>
                  <div className="text-sm font-black text-sky-400 mt-1">{cmp.sentCount.toLocaleString()}</div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Open Rate</div>
                  <div className="text-sm font-black text-purple-400 mt-1">{openRate}%</div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Click Through</div>
                  <div className="text-sm font-black text-amber-400 mt-1">{clickRate}%</div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Conversions</div>
                  <div className="text-sm font-black text-emerald-400 mt-1">{cmp.convertedCount.toLocaleString()}</div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Revenue Attributed</div>
                  <div className="text-sm font-black text-emerald-300 mt-1">${cmp.revenueGenerated.toLocaleString()}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
