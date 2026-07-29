import React, { useState } from 'react';
import { 
  Sparkles, Search, Sliders, Bot, Columns, MessageSquare, ShieldAlert, TrendingUp, DollarSign, Tag, Store, Settings, BarChart3, UserCheck, Layers, Cpu, Activity
} from 'lucide-react';
import { AiTabType, AiSystemMetrics } from '../../types/aiEngine';
import { INITIAL_AI_METRICS } from '../../data/mockAiEngineData';

import { AiDashboardMetrics } from './AiDashboardMetrics';
import { AiSearchEngineView } from './AiSearchEngineView';
import { SmartRecommendationsView } from './SmartRecommendationsView';
import { PersonalizationEngineView } from './PersonalizationEngineView';
import { AiProductRankingView } from './AiProductRankingView';
import { AiChatAssistantView } from './AiChatAssistantView';
import { SmartProductComparisonView } from './SmartProductComparisonView';
import { AiReviewAnalysisView } from './AiReviewAnalysisView';
import { AiFraudDetectionView } from './AiFraudDetectionView';
import { AiDemandForecastingView } from './AiDemandForecastingView';
import { AiPricingIntelligenceView } from './AiPricingIntelligenceView';
import { AiMarketingEngineView } from './AiMarketingEngineView';
import { AiSellerInsightsView } from './AiSellerInsightsView';
import { AiAnalyticsAndAdminView } from './AiAnalyticsAndAdminView';

export const AiEngineMasterModule: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<AiTabType>('dashboard');
  const [metrics, setMetrics] = useState<AiSystemMetrics>(INITIAL_AI_METRICS);

  const navItems: { id: AiTabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'AI Dashboard', icon: BarChart3 },
    { id: 'search', label: 'AI Search Engine', icon: Search },
    { id: 'recommendations', label: 'Smart Recommendations', icon: Sparkles },
    { id: 'personalization', label: 'Personalization Engine', icon: UserCheck },
    { id: 'ranking', label: 'AI Product Ranking', icon: Sliders },
    { id: 'assistant', label: 'AI Chat Assistant', icon: Bot },
    { id: 'comparison', label: 'Product Comparison', icon: Columns },
    { id: 'reviews', label: 'AI Review Analysis', icon: MessageSquare },
    { id: 'fraud', label: 'AI Fraud Detection', icon: ShieldAlert },
    { id: 'forecasting', label: 'Demand Forecasting', icon: TrendingUp },
    { id: 'pricing', label: 'Pricing Intelligence', icon: DollarSign },
    { id: 'marketing', label: 'AI Marketing Engine', icon: Tag },
    { id: 'seller_insights', label: 'Seller Insights', icon: Store },
    { id: 'analytics_admin', label: 'Admin Controls', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-[#070a11] text-slate-100 p-4 sm:p-6 space-y-6">
      {/* Top Banner & Module Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/30 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Module 17 • Enterprise AI Engine</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              AI Search, Recommendation & Personalization Engine
            </h1>

            <p className="text-xs text-slate-300 leading-relaxed">
              Enterprise-grade neural search, 2048-D vector embeddings, real-time personalization, Gemini shopping assistant, dynamic pricing, demand forecasting & fraud detection platform.
            </p>
          </div>

          <div className="flex items-center space-x-4 bg-slate-950/80 p-3 rounded-xl border border-slate-800 shrink-0">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">AI System Status</span>
              <span className="text-xs font-black text-emerald-400 font-mono flex items-center justify-end space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                <span>Operational (99.9%)</span>
              </span>
            </div>

            <div className="h-8 w-px bg-slate-800" />

            <div className="text-left">
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">AI Engine Latency</span>
              <span className="text-xs font-black text-amber-400 font-mono">{metrics.avgAiResponseTimeMs} ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Module Navigation Ribbon */}
      <div className="bg-slate-900/90 border border-slate-800 p-2 rounded-xl overflow-x-auto shadow-lg">
        <div className="flex items-center space-x-1 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSubTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveSubTab(item.id)}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-2 ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Selected Sub-Module */}
      <div className="space-y-6">
        {activeSubTab === 'dashboard' && <AiDashboardMetrics metrics={metrics} />}
        {activeSubTab === 'search' && <AiSearchEngineView />}
        {activeSubTab === 'recommendations' && <SmartRecommendationsView />}
        {activeSubTab === 'personalization' && <PersonalizationEngineView />}
        {activeSubTab === 'ranking' && <AiProductRankingView />}
        {activeSubTab === 'assistant' && <AiChatAssistantView />}
        {activeSubTab === 'comparison' && <SmartProductComparisonView />}
        {activeSubTab === 'reviews' && <AiReviewAnalysisView />}
        {activeSubTab === 'fraud' && <AiFraudDetectionView />}
        {activeSubTab === 'forecasting' && <AiDemandForecastingView />}
        {activeSubTab === 'pricing' && <AiPricingIntelligenceView />}
        {activeSubTab === 'marketing' && <AiMarketingEngineView />}
        {activeSubTab === 'seller_insights' && <AiSellerInsightsView />}
        {activeSubTab === 'analytics_admin' && <AiAnalyticsAndAdminView />}
      </div>
    </div>
  );
};
