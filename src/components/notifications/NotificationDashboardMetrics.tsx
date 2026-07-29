import React, { useState } from 'react';
import { 
  Bell, CheckCircle2, AlertTriangle, Clock, Eye, MousePointerClick, 
  Send, Mail, Smartphone, MessageSquare, ShieldAlert, Zap, TrendingUp, BarChart3, Radio
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { NotificationItem, ChannelControlConfig, QueueStatusMetrics } from '../../types/notifications';

interface Props {
  notifications: NotificationItem[];
  channels: ChannelControlConfig[];
  queueMetrics: QueueStatusMetrics[];
}

export const NotificationDashboardMetrics: React.FC<Props> = ({ notifications, channels, queueMetrics }) => {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Compute metrics
  const totalSent = notifications.length + 854000; // Simulated historical baseline
  const delivered = Math.round(totalSent * 0.982);
  const failed = Math.round(totalSent * 0.012);
  const pending = totalSent - delivered - failed;
  const read = Math.round(delivered * 0.645);
  const unread = delivered - read;

  const emailChannel = channels.find(c => c.id === 'email');
  const smsChannel = channels.find(c => c.id === 'sms');
  const pushChannel = channels.find(c => c.id === 'push_android');

  const emailDeliveryRate = '99.4%';
  const smsDeliveryRate = '98.8%';
  const pushDeliveryRate = '96.2%';

  // Chart Data
  const dailyData = [
    { label: 'Mon', sent: 120000, delivered: 118000, failed: 1200, opens: 75000, clicks: 32000 },
    { label: 'Tue', sent: 145000, delivered: 142500, failed: 1500, opens: 92000, clicks: 41000 },
    { label: 'Wed', sent: 160000, delivered: 157200, failed: 1800, opens: 105000, clicks: 48000 },
    { label: 'Thu', sent: 135000, delivered: 132800, failed: 1200, opens: 88000, clicks: 39000 },
    { label: 'Fri', sent: 180000, delivered: 176800, failed: 2200, opens: 119000, clicks: 58000 },
    { label: 'Sat', sent: 110000, delivered: 108500, failed: 900, opens: 68000, clicks: 29000 },
    { label: 'Sun', sent: 95000, delivered: 93800, failed: 700, opens: 58000, clicks: 24000 },
  ];

  const weeklyData = [
    { label: 'Week 1', sent: 820000, delivered: 805000, failed: 8500, opens: 512000, clicks: 220000 },
    { label: 'Week 2', sent: 940000, delivered: 923000, failed: 9800, opens: 610000, clicks: 275000 },
    { label: 'Week 3', sent: 890000, delivered: 874000, failed: 9100, opens: 578000, clicks: 248000 },
    { label: 'Week 4', sent: 1050000, delivered: 1031000, failed: 11200, opens: 689000, clicks: 315000 },
  ];

  const monthlyData = [
    { label: 'Feb', sent: 3200000, delivered: 3140000, failed: 35000, opens: 2040000, clicks: 920000 },
    { label: 'Mar', sent: 3600000, delivered: 3535000, failed: 38000, opens: 2310000, clicks: 1050000 },
    { label: 'Apr', sent: 3450000, delivered: 3388000, failed: 36000, opens: 2200000, clicks: 990000 },
    { label: 'May', sent: 4100000, delivered: 4026000, failed: 42000, opens: 2650000, clicks: 1220000 },
    { label: 'Jun', sent: 3900000, delivered: 3830000, failed: 39000, opens: 2490000, clicks: 1140000 },
    { label: 'Jul', sent: 4500000, delivered: 4420000, failed: 45000, opens: 2920000, clicks: 1380000 },
  ];

  const chartData = timeframe === 'daily' ? dailyData : timeframe === 'weekly' ? weeklyData : monthlyData;

  const channelDistribution = [
    { name: 'Email (AWS SES)', value: 42, color: '#3b82f6' },
    { name: 'Push (Android/iOS)', value: 31, color: '#a855f7' },
    { name: 'In-App Stream', value: 14, color: '#eab308' },
    { name: 'SMS (Twilio)', value: 8, color: '#10b981' },
    { name: 'WhatsApp Business', value: 5, color: '#22c55e' }
  ];

  const categoryTypeBreakdown = [
    { category: 'Buyer Orders & Shipping', percentage: 38, count: '1.71M' },
    { category: 'Seller Inventory & Wallet', percentage: 24, count: '1.08M' },
    { category: 'Promotional Campaigns', percentage: 18, count: '810K' },
    { category: 'Security & Auth Alerts', percentage: 11, count: '495K' },
    { category: 'Logistics & Warehouse', percentage: 9, count: '405K' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Metric Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Sent</span>
            <Send className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-xl font-black text-white">{totalSent.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-400 flex items-center mt-1">
            <TrendingUp className="w-3 h-3 mr-1" /> +14.2% vs last month
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Delivered</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-emerald-400">{delivered.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400 mt-1">98.2% Delivery Rate</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Failed / Retrying</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-xl font-black text-rose-400">{failed.toLocaleString()}</div>
          <div className="text-[11px] text-rose-400/80 mt-1">1.2% DLQ Retries</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Queue</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-black text-amber-400">{pending.toLocaleString()}</div>
          <div className="text-[11px] text-amber-400/80 mt-1">RabbitMQ Avg 42ms</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Open Rate</span>
            <Eye className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-black text-purple-300">64.5%</div>
          <div className="text-[11px] text-purple-400 mt-1">{read.toLocaleString()} Reads</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Click Rate</span>
            <MousePointerClick className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-black text-amber-300">28.4%</div>
          <div className="text-[11px] text-amber-400 mt-1">Direct CTR Impact</div>
        </div>
      </div>

      {/* Channel SLA Delivery Performance Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Email SLA (AWS SES)</div>
              <div className="text-base font-bold text-white">{emailDeliveryRate} Delivered</div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Optimal</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">SMS SLA (Twilio)</div>
              <div className="text-base font-bold text-white">{smsDeliveryRate} Delivered</div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Active</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Push SLA (FCM/APNs)</div>
              <div className="text-base font-bold text-white">{pushDeliveryRate} Delivered</div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">High Speed</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">WebSocket Queue</div>
              <div className="text-base font-bold text-white">42 ms Latency</div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/30">Live Stream</span>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Delivery Volume & Engagement Trend */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-amber-400" />
                <span>Notification Delivery & Engagement Velocity</span>
              </h3>
              <p className="text-xs text-slate-400">Sent vs Delivered vs Opens vs Clicks throughput over time</p>
            </div>
            <div className="flex items-center space-x-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700">
              {(['daily', 'weekly', 'monthly'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 rounded text-xs font-semibold capitalize transition ${
                    timeframe === tf
                      ? 'bg-amber-500 text-slate-950 shadow font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOpens" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c084fc" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#c084fc" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="label" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                  formatter={(val: any) => [Number(val).toLocaleString(), 'Count']}
                />
                <Area type="monotone" dataKey="sent" name="Total Sent" stroke="#38bdf8" fillOpacity={1} fill="url(#colorSent)" strokeWidth={2} />
                <Area type="monotone" dataKey="opens" name="Opened / Read" stroke="#c084fc" fillOpacity={1} fill="url(#colorOpens)" strokeWidth={2} />
                <Bar dataKey="clicks" name="Clicked" fill="#fbbf24" radius={[4, 4, 0, 0]} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Channel Volume Breakdown */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Notification Channel Distribution</h3>
            <p className="text-xs text-slate-400 mb-4">Volume share across multi-channel routing engine</p>
            
            <div className="h-52 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channelDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {channelDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-800">
            {channelDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Distribution & Queue Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-bold text-white mb-1">Notification Volume by Category</h3>
          <p className="text-xs text-slate-400 mb-4">Marketplace domain category traffic composition</p>

          <div className="space-y-3">
            {categoryTypeBreakdown.map((cat) => (
              <div key={cat.category} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">{cat.category}</span>
                  <div className="space-x-2">
                    <span className="text-slate-400">{cat.count}</span>
                    <span className="font-bold text-amber-400">{cat.percentage}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Message Queue Health */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>Message Queue & Pipeline Health</span>
              </h3>
              <p className="text-xs text-slate-400">RabbitMQ / Kafka broker status & worker throughput</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Pipeline Healthy
            </span>
          </div>

          <div className="space-y-3">
            {queueMetrics.map((q) => (
              <div key={q.queueName} className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-200 font-mono">{q.queueName}</div>
                  <div className="text-[11px] text-slate-400 flex items-center space-x-3 mt-1">
                    <span>Workers: <strong className="text-slate-200">{q.processingWorkers}</strong></span>
                    <span>Pending: <strong className="text-amber-300">{q.pendingJobs}</strong></span>
                    <span>Latency: <strong className="text-sky-300">{q.avgLatencyMs}ms</strong></span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-emerald-400">{q.throughputPerSec}/s</div>
                  <div className="text-[10px] text-slate-500">DLQ: {q.deadLetterCount}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
