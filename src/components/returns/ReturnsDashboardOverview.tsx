import React from 'react';
import { ReturnRequest } from '../../types/returns';
import {
  RotateCcw,
  Clock,
  CheckCircle2,
  XCircle,
  PackageCheck,
  DollarSign,
  RefreshCw,
  TrendingDown,
  ShieldAlert,
  Star,
  Activity,
  Layers,
} from 'lucide-react';

interface Props {
  returnRequests: ReturnRequest[];
}

export const ReturnsDashboardOverview: React.FC<Props> = ({ returnRequests }) => {
  const totalCount = returnRequests.length;
  const pendingCount = returnRequests.filter(
    (r) => r.status === 'REQUESTED' || r.status === 'SELLER_REVIEW' || r.status === 'ADMIN_REVIEW'
  ).length;
  const approvedCount = returnRequests.filter(
    (r) =>
      r.status === 'APPROVED' ||
      r.status === 'AUTO_APPROVED' ||
      r.status === 'QUALITY_INSPECTED' ||
      r.status === 'REFUND_PROCESSED' ||
      r.status === 'EXCHANGE_DISPATCHED' ||
      r.status === 'CLOSED'
  ).length;
  const rejectedCount = returnRequests.filter((r) => r.status === 'REJECTED').length;
  const escalatedCount = returnRequests.filter((r) => r.status === 'ESCALATED').length;

  const totalRefundValue = returnRequests
    .filter((r) => r.refundAmountUSD)
    .reduce((acc, curr) => acc + (curr.refundAmountUSD || 0), 0);

  const exchangeCount = returnRequests.filter((r) => r.resolutionRequested === 'EXCHANGE' || r.resolutionRequested === 'REPLACEMENT').length;

  // Breakdown by reason
  const reasonsMap: Record<string, number> = {};
  returnRequests.forEach((r) => {
    reasonsMap[r.reason] = (reasonsMap[r.reason] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      {/* KPI Top Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Claims</span>
            <RotateCcw className="w-4 h-4 text-[#febd69]" />
          </div>
          <div className="text-2xl font-black text-white">{totalCount}</div>
          <div className="text-[10px] text-emerald-400 flex items-center space-x-1">
            <TrendingDown className="w-3 h-3 text-emerald-400" />
            <span>-2.4% vs last week</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pending Review</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{pendingCount}</div>
          <div className="text-[10px] text-slate-400">Avg response: 3.4 hrs</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Approved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{approvedCount}</div>
          <div className="text-[10px] text-slate-400">92.4% Approval Rate</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Refund Value</span>
            <DollarSign className="w-4 h-4 text-[#febd69]" />
          </div>
          <div className="text-2xl font-black text-[#febd69]">${totalRefundValue.toFixed(2)}</div>
          <div className="text-[10px] text-slate-400">Direct + Wallet</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Exchanges</span>
            <RefreshCw className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">{exchangeCount}</div>
          <div className="text-[10px] text-slate-400">Size / Variant swaps</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Fraud Escalated</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-400">{escalatedCount}</div>
          <div className="text-[10px] text-rose-300">Requires Admin Review</div>
        </div>
      </div>

      {/* Secondary Metrics Bar */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex items-center space-x-3 border-r border-slate-800 pr-4">
          <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Overall Marketplace Return Rate</div>
            <div className="text-lg font-black text-white">2.84% <span className="text-xs font-normal text-slate-400">(Benchmark &lt; 3.5%)</span></div>
          </div>
        </div>

        <div className="flex items-center space-x-3 border-r border-slate-800 pr-4">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Avg Processing Duration</div>
            <div className="text-lg font-black text-white">18.4 Hours <span className="text-xs font-normal text-emerald-400">(-3.2 hrs)</span></div>
          </div>
        </div>

        <div className="flex items-center space-x-3 border-r border-slate-800 pr-4">
          <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-400">
            <PackageCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Warehouse Inspection SLA</div>
            <div className="text-lg font-black text-white">99.1% <span className="text-xs font-normal text-purple-400">Within 24h</span></div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400">
            <Star className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Returns CSAT Score</div>
            <div className="text-lg font-black text-white">4.82 / 5.0 <span className="text-xs font-normal text-amber-400">(Top Tier)</span></div>
          </div>
        </div>
      </div>

      {/* Analytics Visual Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Reasons Chart Breakdown */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Layers className="w-4 h-4 text-[#febd69]" />
              <span>Top Return Reasons Distribution</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Real-time Telemetry</span>
          </div>

          <div className="space-y-3">
            {[
              { reason: 'DEFECTIVE', label: 'Defective / Malfunction', color: 'bg-rose-500', count: reasonsMap['DEFECTIVE'] || 1 },
              { reason: 'QUALITY_ISSUE', label: 'Sizing / Quality Discrepancy', color: 'bg-amber-500', count: reasonsMap['QUALITY_ISSUE'] || 1 },
              { reason: 'DAMAGED_ITEM', label: 'Transit Damage', color: 'bg-orange-500', count: reasonsMap['DAMAGED_ITEM'] || 1 },
              { reason: 'CHANGED_MIND', label: 'Buyer Changed Mind', color: 'bg-blue-500', count: reasonsMap['CHANGED_MIND'] || 1 },
              { reason: 'WRONG_ITEM', label: 'Wrong Item Shipped', color: 'bg-purple-500', count: reasonsMap['WRONG_ITEM'] || 1 },
            ].map((item) => {
              const pct = Math.round((item.count / totalCount) * 100) || 15;
              return (
                <div key={item.reason} className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-300 font-medium">
                    <span>{item.label}</span>
                    <span className="font-mono text-slate-400">{item.count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Seller Return Performance Radar */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Seller Return SLA Performance</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Top 3 Merchants</span>
          </div>

          <div className="space-y-3">
            {[
              { name: 'TechGizmo Electronics Ltd', rate: '1.9%', sla: '2.1 hrs', autoApprove: '94%', csat: '4.9/5' },
              { name: 'ModaLux Apparel', rate: '3.4%', sla: '1.8 hrs', autoApprove: '98%', csat: '4.8/5' },
              { name: 'KitchenPro Direct', rate: '2.1%', sla: '4.5 hrs', autoApprove: '82%', csat: '4.6/5' },
              { name: 'Nordic Craft Leather', rate: '1.2%', sla: '1.1 hrs', autoApprove: '100%', csat: '5.0/5' },
            ].map((seller) => (
              <div key={seller.name} className="p-3 bg-slate-950 border border-slate-800/80 rounded-lg flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">{seller.name}</div>
                  <div className="text-[10px] text-slate-400">Return Rate: <span className="text-amber-400 font-mono">{seller.rate}</span></div>
                </div>
                <div className="flex items-center space-x-4 font-mono text-[11px]">
                  <div className="text-right">
                    <div className="text-[9px] text-slate-500 uppercase">Avg SLA</div>
                    <div className="text-emerald-400 font-bold">{seller.sla}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] text-slate-500 uppercase">Auto-Approve</div>
                    <div className="text-cyan-400 font-bold">{seller.autoApprove}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] text-slate-500 uppercase">Rating</div>
                    <div className="text-[#febd69] font-bold">{seller.csat}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
