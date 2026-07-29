import React from 'react';
import { SupportMetrics, SupportTicket } from '../../types/support';
import {
  LifeBuoy,
  TicketCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MessageSquareText,
  Bot,
  Star,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  Users,
  Activity,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface Props {
  metrics: SupportMetrics;
  tickets: SupportTicket[];
}

const TICKET_VOLUME_DATA = [
  { day: 'Mon', tickets: 180, resolved: 172, aiHandled: 85 },
  { day: 'Tue', tickets: 220, resolved: 210, aiHandled: 110 },
  { day: 'Wed', tickets: 290, resolved: 280, aiHandled: 145 },
  { day: 'Thu', tickets: 240, resolved: 235, aiHandled: 120 },
  { day: 'Fri', tickets: 310, resolved: 300, aiHandled: 160 },
  { day: 'Sat', tickets: 190, resolved: 185, aiHandled: 95 },
  { day: 'Sun', tickets: 150, resolved: 148, aiHandled: 80 },
];

const CATEGORY_DISTRIBUTION = [
  { name: 'Orders & Tracking', value: 35, color: '#febd69' },
  { name: 'Returns & Refunds', value: 25, color: '#38bdf8' },
  { name: 'FBA & Seller Ops', value: 15, color: '#a855f7' },
  { name: 'Payments & Wallet', value: 12, color: '#34d399' },
  { name: 'Account & Security', value: 8, color: '#f43f5e' },
  { name: 'Technical Issues', value: 5, color: '#fb923c' },
];

const CSAT_RATING_BREAKDOWN = [
  { stars: '5 Stars (Excellent)', percent: 84, color: '#10b981' },
  { stars: '4 Stars (Good)', percent: 12, color: '#38bdf8' },
  { stars: '3 Stars (Average)', percent: 2.5, color: '#f59e0b' },
  { stars: '2 Stars (Poor)', percent: 1.0, color: '#fb923c' },
  { stars: '1 Star (Critical)', percent: 0.5, color: '#ef4444' },
];

export const SupportDashboardOverview: React.FC<Props> = ({ metrics, tickets }) => {
  return (
    <div className="space-y-6">
      {/* Top Banner KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Tickets</span>
            <TicketCheck className="w-4 h-4 text-[#febd69]" />
          </div>
          <div className="text-xl font-black text-white font-mono">{metrics.totalTickets}</div>
          <div className="text-[10px] text-emerald-400 font-bold flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>+12.4% vs last week</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Open / Pending</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-black text-amber-400 font-mono">
            {metrics.openTickets + metrics.pendingTickets}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            {metrics.openTickets} Open, {metrics.pendingTickets} Pending
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Resolved Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-emerald-400 font-mono">{metrics.resolvedTickets}</div>
          <div className="text-[10px] text-emerald-400 font-bold">96.8% Success Rate</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">AI Auto-Resolved</span>
            <Bot className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-black text-purple-400 font-mono">{metrics.aiResolvedCases}</div>
          <div className="text-[10px] text-purple-300 font-bold">43.1% Deflection Rate</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">CSAT Score</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="text-xl font-black text-amber-400 font-mono">{metrics.csatScore} / 5.0</div>
          <div className="text-[10px] text-slate-400">Based on 1,240 ratings</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">SLA Compliance</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-black text-cyan-400 font-mono">{metrics.slaCompliancePercent}%</div>
          <div className="text-[10px] text-cyan-300 font-mono">Avg Response: {metrics.firstResponseTimeMinutes}m</div>
        </div>
      </div>

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket Volume & AI Deflection Area Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-[#febd69]" />
                <span>Ticket Volume & AI Copilot Deflection Trends</span>
              </h3>
              <p className="text-xs text-slate-400">Daily incoming ticket volume vs AI virtual agent automated resolutions.</p>
            </div>
            <div className="flex items-center space-x-3 text-xs font-mono">
              <span className="flex items-center space-x-1 text-[#febd69]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#febd69]" />
                <span>Total Tickets</span>
              </span>
              <span className="flex items-center space-x-1 text-purple-400">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                <span>AI Resolved</span>
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TICKET_VOLUME_DATA}>
                <defs>
                  <linearGradient id="ticketGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#febd69" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#febd69" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="aiGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c084fc" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#c084fc" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="tickets" stroke="#febd69" strokeWidth={2} fillOpacity={1} fill="url(#ticketGrad)" />
                <Area type="monotone" dataKey="aiHandled" stroke="#c084fc" strokeWidth={2} fillOpacity={1} fill="url(#aiGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution Pie Chart */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <LifeBuoy className="w-4 h-4 text-cyan-400" />
              <span>Ticket Category Distribution</span>
            </h3>
            <p className="text-xs text-slate-400">Breakdown of support inquiries by department.</p>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={CATEGORY_DISTRIBUTION} innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                  {CATEGORY_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs">
            {CATEGORY_DISTRIBUTION.slice(0, 4).map((c) => (
              <div key={c.name} className="flex justify-between items-center text-slate-300">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  <span>{c.name}</span>
                </span>
                <span className="font-mono font-bold text-white">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CSAT & Agent Performance Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer CSAT Rating Breakdown */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
          <h3 className="text-xs font-bold text-[#febd69] uppercase tracking-wider flex items-center space-x-2">
            <Star className="w-4 h-4 fill-[#febd69]" />
            <span>Customer Satisfaction (CSAT) Rating Breakdown</span>
          </h3>

          <div className="space-y-2.5">
            {CSAT_RATING_BREAKDOWN.map((r) => (
              <div key={r.stars} className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>{r.stars}</span>
                  <span className="font-mono font-bold text-white">{r.percent}%</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${r.percent}%`, backgroundColor: r.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Urgent Support Queue */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4" />
              <span>High Priority & Critical Support Tickets</span>
            </h3>
            <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 text-[10px] font-mono font-bold rounded border border-rose-500/40">
              {tickets.filter((t) => t.priority === 'HIGH' || t.priority === 'URGENT_CRITICAL').length} Active
            </span>
          </div>

          <div className="space-y-2.5 max-h-52 overflow-y-auto">
            {tickets
              .filter((t) => t.priority === 'HIGH' || t.priority === 'URGENT_CRITICAL')
              .map((t) => (
                <div key={t.ticketId} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                  <div className="flex justify-between items-start">
                    <span className="font-mono font-bold text-xs text-[#febd69]">{t.ticketId}</span>
                    <span className="px-1.5 py-0.5 bg-rose-500 text-slate-950 text-[9px] font-black uppercase rounded">
                      {t.priority}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white truncate">{t.subject}</div>
                  <div className="text-[10px] text-slate-400 flex justify-between pt-1">
                    <span>User: <span className="text-slate-200 font-semibold">{t.userName} ({t.userRole})</span></span>
                    <span className="text-amber-400 font-bold">{t.status}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
