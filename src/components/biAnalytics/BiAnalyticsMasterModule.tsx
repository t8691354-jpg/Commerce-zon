import React, { useState } from 'react';
import { BiExecutiveDashboardView } from './BiExecutiveDashboardView';
import { BiSalesAnalyticsView } from './BiSalesAnalyticsView';
import { BiCustomerAnalyticsView } from './BiCustomerAnalyticsView';
import { BiSellerAnalyticsView } from './BiSellerAnalyticsView';
import { BiAffiliateAnalyticsView } from './BiAffiliateAnalyticsView';
import { BiProductAnalyticsView } from './BiProductAnalyticsView';
import { BiInventoryAnalyticsView } from './BiInventoryAnalyticsView';
import { BiOrderAnalyticsView } from './BiOrderAnalyticsView';
import { BiFinancialAnalyticsView } from './BiFinancialAnalyticsView';
import { BiMarketingAnalyticsView } from './BiMarketingAnalyticsView';
import { BiLogisticsAnalyticsView } from './BiLogisticsAnalyticsView';
import { BiPredictiveAiView } from './BiPredictiveAiView';
import { BiFraudRiskView } from './BiFraudRiskView';
import { BiRealtimeMonitoringView } from './BiRealtimeMonitoringView';
import { BiCustomReportBuilderView } from './BiCustomReportBuilderView';
import { BiScheduledReportsAdminView } from './BiScheduledReportsAdminView';
import { BiSecurityTechStackView } from './BiSecurityTechStackView';

import {
  BarChart3,
  TrendingUp,
  Users,
  Store,
  Award,
  ShoppingBag,
  Warehouse,
  Package,
  DollarSign,
  Megaphone,
  Truck,
  Bot,
  ShieldAlert,
  Radio,
  FileText,
  Settings,
  Cpu,
  Download,
  Calendar,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

export type BiSubTab =
  | 'executive'
  | 'sales'
  | 'customers'
  | 'sellers'
  | 'affiliates'
  | 'products'
  | 'inventory'
  | 'orders'
  | 'financial'
  | 'marketing'
  | 'logistics'
  | 'predictive'
  | 'fraud'
  | 'realtime'
  | 'builder'
  | 'admin'
  | 'security';

export const BiAnalyticsMasterModule: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<BiSubTab>('executive');
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d' | '90d' | '1y'>('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const navItems = [
    { id: 'executive', label: 'Executive Dashboard', icon: BarChart3 },
    { id: 'sales', label: 'Sales Analytics', icon: TrendingUp },
    { id: 'customers', label: 'Customer Analytics', icon: Users },
    { id: 'sellers', label: 'Seller Analytics', icon: Store },
    { id: 'affiliates', label: 'Affiliate Analytics', icon: Award },
    { id: 'products', label: 'Product Analytics', icon: ShoppingBag },
    { id: 'inventory', label: 'Inventory Analytics', icon: Warehouse },
    { id: 'orders', label: 'Order Analytics', icon: Package },
    { id: 'financial', label: 'Financial Analytics', icon: DollarSign },
    { id: 'marketing', label: 'Marketing Analytics', icon: Megaphone },
    { id: 'logistics', label: 'Logistics Analytics', icon: Truck },
    { id: 'predictive', label: 'AI Predictive AI', icon: Bot, badge: 'AI' },
    { id: 'fraud', label: 'Fraud & Risk', icon: ShieldAlert, badge: 'ALERT' },
    { id: 'realtime', label: 'Real-Time Monitoring', icon: Radio, badge: 'LIVE' },
    { id: 'builder', label: 'Report Builder', icon: FileText },
    { id: 'admin', label: 'Admin Controls', icon: Settings },
    { id: 'security', label: 'Tech Stack & Security', icon: Cpu },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Module 18 Main Header */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-full text-xs font-black tracking-wider uppercase">
                Module 18
              </span>
              <span className="flex items-center text-xs font-mono text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-ping" />
                Spark & ClickHouse Analytics Engine Online
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-amber-400" />
              Business Intelligence, Analytics & Reporting System
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
              Amazon-scale marketplace intelligence processing real-time telemetry, predictive AI forecasts, fraud prevention, custom report builder, and executive scorecards across all modules.
            </p>
          </div>

          {/* Timeframe Selector & Global Refresh */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-mono">
              <Calendar className="w-3.5 h-3.5 text-amber-400 ml-2 mr-2" />
              {(['24h', '7d', '30d', '90d', '1y'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition ${
                    timeframe === t
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>

            <button
              onClick={handleRefreshData}
              className={`px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
                isRefreshing ? 'opacity-50' : ''
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh Metrics</span>
            </button>
          </div>
        </div>
      </div>

      {/* Module 18 Horizontal Sub-Tab Navigation Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2 shadow-xl overflow-x-auto no-scrollbar">
        <div className="flex items-center space-x-1.5 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSubTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSubTab(item.id as BiSubTab)}
                className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-lg font-black'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded text-[9px] font-black uppercase ${
                      isActive
                        ? 'bg-slate-950 text-amber-400'
                        : item.badge === 'LIVE'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-Tab Content Router */}
      <div className="transition-all duration-300">
        {activeSubTab === 'executive' && <BiExecutiveDashboardView timeframe={timeframe} />}
        {activeSubTab === 'sales' && <BiSalesAnalyticsView globalTimeframe={timeframe} />}
        {activeSubTab === 'customers' && <BiCustomerAnalyticsView />}
        {activeSubTab === 'sellers' && <BiSellerAnalyticsView />}
        {activeSubTab === 'affiliates' && <BiAffiliateAnalyticsView />}
        {activeSubTab === 'products' && <BiProductAnalyticsView />}
        {activeSubTab === 'inventory' && <BiInventoryAnalyticsView />}
        {activeSubTab === 'orders' && <BiOrderAnalyticsView />}
        {activeSubTab === 'financial' && <BiFinancialAnalyticsView />}
        {activeSubTab === 'marketing' && <BiMarketingAnalyticsView />}
        {activeSubTab === 'logistics' && <BiLogisticsAnalyticsView />}
        {activeSubTab === 'predictive' && <BiPredictiveAiView />}
        {activeSubTab === 'fraud' && <BiFraudRiskView />}
        {activeSubTab === 'realtime' && <BiRealtimeMonitoringView />}
        {activeSubTab === 'builder' && <BiCustomReportBuilderView />}
        {activeSubTab === 'admin' && <BiScheduledReportsAdminView />}
        {activeSubTab === 'security' && <BiSecurityTechStackView />}
      </div>
    </div>
  );
};
