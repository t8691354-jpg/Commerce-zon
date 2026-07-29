import React, { useState } from 'react';
import { 
  Sparkles, Search, TrendingUp, Cpu, Zap, Target, DollarSign, Activity, CheckCircle2, Flame, RefreshCw, BarChart3, LineChart
} from 'lucide-react';
import { AiSystemMetrics, TimeSeriesUsage } from '../../types/aiEngine';
import { MOCK_DAILY_USAGE, MOCK_WEEKLY_USAGE } from '../../data/mockAiEngineData';

interface Props {
  metrics: AiSystemMetrics;
}

export const AiDashboardMetrics: React.FC<Props> = ({ metrics }) => {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  
  const currentChartData: TimeSeriesUsage[] = timeframe === 'weekly' ? MOCK_WEEKLY_USAGE : MOCK_DAILY_USAGE;

  const maxSearch = Math.max(...currentChartData.map(d => d.searchRequests));
  const maxRevenue = Math.max(...currentChartData.map(d => d.aiRevenue));

  return (
    <div className="space-y-6">
      {/* Top Banner KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>AI Search Requests</span>
            <Search className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-lg font-black text-white">{metrics.totalSearchRequests.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-400 font-bold flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>+14.2% this week</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Rec. Requests</span>
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-lg font-black text-white">{metrics.totalRecommendationRequests.toLocaleString()}</div>
          <div className="text-[10px] text-purple-300 font-bold">Acc: {metrics.recommendationAccuracyPct}%</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Avg Response Time</span>
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-lg font-black text-amber-400 font-mono">{metrics.avgAiResponseTimeMs} ms</div>
          <div className="text-[10px] text-emerald-400 font-bold">99.9% SLA Met</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Conversion Rate</span>
            <Target className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-lg font-black text-emerald-400">{metrics.conversionRatePct}%</div>
          <div className="text-[10px] text-slate-400">CTR: {metrics.clickThroughRatePct}%</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>AI Generated Revenue</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-lg font-black text-white font-mono">${(metrics.aiGeneratedRevenueUsd / 1000000).toFixed(2)}M</div>
          <div className="text-[10px] text-emerald-400 font-bold">+28.5% YoY Lift</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>AI Model Health</span>
            <Activity className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-lg font-black text-sky-400">{metrics.aiModelHealthPct}%</div>
          <div className="text-[10px] text-slate-400 font-mono">Gemini + Vector DB</div>
        </div>
      </div>

      {/* Interactive Usage & Revenue Performance Chart */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-amber-400" />
              <span>Real-Time AI Throughput & Revenue Analytics</span>
            </h3>
            <p className="text-xs text-slate-400">Search volume, smart recommendation requests & AI conversion correlation</p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {(['daily', 'weekly', 'monthly'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1 rounded text-xs font-bold capitalize transition ${
                  timeframe === t
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t} Usage
              </button>
            ))}
          </div>
        </div>

        {/* Visual Bar Graph */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
            <span>Request Volume & Revenue Trajectory ({timeframe})</span>
            <span className="text-amber-400 font-mono">Peak: {maxSearch.toLocaleString()} req/hr</span>
          </div>

          <div className="grid grid-cols-7 gap-2 items-end h-48 bg-slate-950 p-4 rounded-xl border border-slate-800">
            {currentChartData.map((item, idx) => {
              const heightPct = Math.max(15, Math.round((item.searchRequests / maxSearch) * 100));
              const revPct = Math.max(10, Math.round((item.aiRevenue / maxRevenue) * 100));

              return (
                <div key={idx} className="flex flex-col items-center h-full justify-end group">
                  <div className="w-full flex items-end justify-center space-x-1 h-36 relative">
                    {/* Search bar */}
                    <div 
                      style={{ height: `${heightPct}%` }} 
                      className="w-1/2 bg-gradient-to-t from-amber-600 to-amber-400 rounded-t transition-all group-hover:brightness-125"
                      title={`Search Req: ${item.searchRequests.toLocaleString()}`}
                    />
                    {/* Revenue bar */}
                    <div 
                      style={{ height: `${revPct}%` }} 
                      className="w-1/2 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t transition-all group-hover:brightness-125"
                      title={`AI Revenue: $${item.aiRevenue.toLocaleString()}`}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-2 font-mono">{item.timeLabel}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center space-x-6 text-xs text-slate-300 pt-1">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded bg-amber-400 inline-block" />
              <span>Search & Rec Volume</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded bg-emerald-400 inline-block" />
              <span>AI Revenue Impact ($)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Searches & Personalization Accuracy Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Flame className="w-4 h-4 text-rose-400" />
              <span>Trending Marketplace Searches Today</span>
            </h3>
            <span className="text-xs text-emerald-400 font-bold font-mono">Live Hot Keywords</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {metrics.trendingSearches.map((term, i) => (
              <div 
                key={i}
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-500/50 text-xs font-bold text-slate-200 flex items-center space-x-2 transition cursor-pointer"
              >
                <span className="text-amber-400 font-mono text-[10px]">#{i + 1}</span>
                <span>{term}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-mono">High Velocity</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2 pb-3 border-b border-slate-800">
            <Cpu className="w-4 h-4 text-purple-400" />
            <span>AI Personalization Engine Health</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-300">Personalization Affinity Score</span>
              <span className="text-amber-400 font-bold">{metrics.personalizationScorePct}%</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-300">Vector Search Success Rate</span>
              <span className="text-emerald-400 font-bold">{metrics.searchSuccessRatePct}%</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-300">Customer Engagement Index</span>
              <span className="text-sky-400 font-bold">{metrics.userEngagementScore}/100</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
