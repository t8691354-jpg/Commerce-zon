import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Package,
  RotateCcw,
  AlertTriangle,
  Download,
  Calendar,
  Filter,
  RefreshCw,
  Info,
  CheckCircle2,
  XCircle,
  Eye,
  MousePointer,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  ChevronRight,
  Clock,
  Layers,
  Search,
  ExternalLink,
  Sliders,
  HelpCircle,
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
  Legend,
} from 'recharts';
import {
  AnalyticsDateRangePreset,
  ProductPerformanceMetric,
  SellerAnalyticsReport,
  SellerInventoryInsight,
  StockStatusType,
} from '../../types/sellerAnalytics';
import { sellerAnalyticsClient } from '../../services/sellerAnalyticsClient';
import { Merchant } from '../../types/domain';

interface SellerAnalyticsDashboardProps {
  activeMerchant: Merchant;
  allMerchants?: Merchant[];
  onSelectMerchant?: (merchantId: string) => void;
  onNavigateToListings?: () => void;
  onNavigateToOrders?: () => void;
}

const CATEGORY_COLORS = ['#febd69', '#38bdf8', '#818cf8', '#34d399', '#f472b6', '#fbbf24', '#a78bfa'];

export const SellerAnalyticsDashboard: React.FC<SellerAnalyticsDashboardProps> = ({
  activeMerchant,
  allMerchants,
  onSelectMerchant,
  onNavigateToListings,
  onNavigateToOrders,
}) => {
  const [report, setReport] = useState<SellerAnalyticsReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [preset, setPreset] = useState<AnalyticsDateRangePreset>('7d');
  const [customStart, setCustomStart] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 14);
    return d.toISOString().split('T')[0];
  });
  const [customEnd, setCustomEnd] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [showCustomPicker, setShowCustomPicker] = useState<boolean>(false);
  const [currency, setCurrency] = useState<string>('USD');

  // Product Table Search & Category Filter
  const [productSearch, setProductSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStockFilter, setSelectedStockFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof ProductPerformanceMetric>('grossRevenue');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Export Menu State
  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);
  const [showMetricExplanation, setShowMetricExplanation] = useState<boolean>(false);

  const loadReport = async () => {
    if (!activeMerchant) return;
    setLoading(true);
    setError(null);
    try {
      const data = await sellerAnalyticsClient.getSellerReport(
        activeMerchant.id,
        preset,
        preset === 'custom' ? customStart : undefined,
        preset === 'custom' ? customEnd : undefined,
        currency
      );
      setReport(data);
    } catch (err: any) {
      console.error('Failed to load seller analytics report:', err);
      setError(err.message || 'Failed to load seller analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [activeMerchant?.id, preset, currency]);

  const handleApplyCustomRange = () => {
    if (!customStart || !customEnd) return;
    setPreset('custom');
    setShowCustomPicker(false);
    loadReport();
  };

  // Filtered and sorted product performance rows
  const filteredProducts = useMemo(() => {
    if (!report?.productPerformance) return [];
    return report.productPerformance
      .filter((p) => {
        const matchesQuery =
          p.productTitle.toLowerCase().includes(productSearch.toLowerCase()) ||
          p.sku.toLowerCase().includes(productSearch.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
        const matchesStock =
          selectedStockFilter === 'all' ||
          (selectedStockFilter === 'low' && (p.stockStatus === 'LOW_STOCK' || p.stockStatus === 'REORDER_RECOMMENDED')) ||
          (selectedStockFilter === 'out' && p.stockStatus === 'OUT_OF_STOCK') ||
          (selectedStockFilter === 'in' && p.stockStatus === 'IN_STOCK');
        return matchesQuery && matchesCategory && matchesStock;
      })
      .sort((a, b) => {
        const valA = (a as any)[sortField];
        const valB = (b as any)[sortField];
        if (typeof valA === 'string') {
          return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return sortAsc ? (valA || 0) - (valB || 0) : (valB || 0) - (valA || 0);
      });
  }, [report?.productPerformance, productSearch, selectedCategory, selectedStockFilter, sortField, sortAsc]);

  const toggleSort = (field: keyof ProductPerformanceMetric) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const getCurrencySymbol = (curr: string) => {
    switch (curr) {
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'PKR': return 'Rs.';
      case 'JPY': return '¥';
      default: return '$';
    }
  };

  const symbol = getCurrencySymbol(currency);

  const getStockStatusBadge = (status: StockStatusType, stock: number) => {
    switch (status) {
      case 'IN_STOCK':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800">
            In Stock ({stock})
          </span>
        );
      case 'LOW_STOCK':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/80 text-amber-400 border border-amber-800">
            Low Stock ({stock})
          </span>
        );
      case 'REORDER_RECOMMENDED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-950/80 text-orange-400 border border-orange-800">
            Reorder Advised ({stock})
          </span>
        );
      case 'OUT_OF_STOCK':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950/80 text-rose-400 border border-rose-800">
            Out of Stock
          </span>
        );
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'STOCKOUT_RISK': return <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />;
      case 'HIGH_DEMAND': return <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'SLOW_MOVING': return <Clock className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'CONVERSION_OPPORTUNITY': return <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />;
      case 'HIGH_REFUND_RATE': return <RotateCcw className="w-4 h-4 text-purple-400 shrink-0" />;
      default: return <Info className="w-4 h-4 text-slate-400 shrink-0" />;
    }
  };

  return (
    <div className="space-y-6 font-sans text-slate-100">
      {/* Top Controls: Store Context & Date Range Selector */}
      <div className="bg-[#131921] border border-[#37475a] rounded-2xl p-5 shadow-2xl flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-[#febd69] uppercase tracking-wider">
              Seller Intelligence & Performance Engine
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400 font-mono">Part 13 Realtime Analytics</span>
          </div>
          <div className="flex items-center space-x-3 mt-1">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <span>{activeMerchant?.name}</span>
              {activeMerchant?.isVerified && (
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              )}
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-[#febd69]">
              {activeMerchant?.code}
            </span>
            <span className="text-xs uppercase px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300">
              {activeMerchant?.tier} Tier
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#febd69]" />
            <span>Reporting Window: <strong className="text-slate-200">{report?.summary.reportingPeriod || 'Calculating...'}</strong></span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Timezone: UTC Normalized (Inclusive Bounds)</span>
          </p>
        </div>

        {/* Action Toolbar: Date Filters, Currency, Export */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Preset Buttons */}
          <div className="bg-[#1e293b] p-1 border border-slate-800 rounded-xl flex items-center space-x-1">
            {(
              [
                { id: 'today', label: 'Today' },
                { id: '7d', label: '7D' },
                { id: '30d', label: '30D' },
                { id: 'this_month', label: 'This Month' },
                { id: 'last_month', label: 'Last Month' },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setPreset(item.id);
                  setShowCustomPicker(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  preset === item.id
                    ? 'bg-[#febd69] text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}

            <button
              onClick={() => setShowCustomPicker(!showCustomPicker)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                preset === 'custom'
                  ? 'bg-[#febd69] text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Custom</span>
            </button>
          </div>

          {/* Currency Switcher */}
          <div className="flex items-center bg-[#1e293b] border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs">
            <span className="text-slate-400 font-bold mr-1.5">Currency:</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-transparent text-white font-mono font-bold focus:outline-none cursor-pointer"
            >
              <option value="USD" className="bg-slate-900 text-white">USD ($)</option>
              <option value="EUR" className="bg-slate-900 text-white">EUR (€)</option>
              <option value="GBP" className="bg-slate-900 text-white">GBP (£)</option>
              <option value="PKR" className="bg-slate-900 text-white">PKR (Rs)</option>
              <option value="JPY" className="bg-slate-900 text-white">JPY (¥)</option>
            </select>
          </div>

          {/* Refresh */}
          <button
            onClick={loadReport}
            disabled={loading}
            className="p-2 bg-[#1e293b] hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-xl transition"
            title="Refresh Analytics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#febd69]' : ''}`} />
          </button>

          {/* Export Menu */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs flex items-center space-x-1.5 transition shadow-lg"
            >
              <Download className="w-4 h-4" />
              <span>Export Reports</span>
            </button>

            {showExportMenu && report && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-30 space-y-1">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  Export Options
                </div>
                <button
                  onClick={() => {
                    sellerAnalyticsClient.downloadCSV(report, 'products');
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs rounded-xl hover:bg-slate-800 text-slate-200 flex items-center space-x-2"
                >
                  <Download className="w-3.5 h-3.5 text-[#febd69]" />
                  <span>Product Performance (CSV)</span>
                </button>
                <button
                  onClick={() => {
                    sellerAnalyticsClient.downloadCSV(report, 'summary');
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs rounded-xl hover:bg-slate-800 text-slate-200 flex items-center space-x-2"
                >
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sales & P&L Summary (CSV)</span>
                </button>
                <button
                  onClick={() => {
                    sellerAnalyticsClient.downloadCSV(report, 'orders');
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs rounded-xl hover:bg-slate-800 text-slate-200 flex items-center space-x-2"
                >
                  <ShoppingCart className="w-3.5 h-3.5 text-blue-400" />
                  <span>Order Transactions (CSV)</span>
                </button>
                <button
                  onClick={() => {
                    sellerAnalyticsClient.downloadJSON(report);
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs rounded-xl hover:bg-slate-800 text-slate-200 flex items-center space-x-2"
                >
                  <Layers className="w-3.5 h-3.5 text-purple-400" />
                  <span>Full Analytics Schema (JSON)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Date Range Picker Popover */}
      {showCustomPicker && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400 font-bold">Start Date:</span>
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-[#febd69]"
            />
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400 font-bold">End Date:</span>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-[#febd69]"
            />
          </div>
          <button
            onClick={handleApplyCustomRange}
            className="px-4 py-1.5 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-bold text-xs rounded-lg transition"
          >
            Apply Range
          </button>
          <button
            onClick={() => setShowCustomPicker(false)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Metric Definitions Modal / Banner */}
      {showMetricExplanation && (
        <div className="bg-blue-950/40 border border-blue-800 rounded-2xl p-4 text-xs text-blue-200 space-y-2">
          <div className="flex items-center justify-between font-bold text-blue-100">
            <span className="flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-400" />
              <span>Seller Intelligence Metric Definitions & Attribution Policy</span>
            </span>
            <button onClick={() => setShowMetricExplanation(false)} className="text-slate-400 hover:text-white">
              ✕
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-[11px] leading-relaxed">
            <div className="bg-slate-900/80 p-3 rounded-xl border border-blue-900/60">
              <strong className="text-white block mb-1">Gross vs. Net Sales</strong>
              <p className="text-slate-300">
                Gross Sales is the total value of ordered items (excluding cancelled orders). Net Sales subtracts the 10% marketplace commission, processed customer refunds, and platform charges.
              </p>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-blue-900/60">
              <strong className="text-white block mb-1">Product Conversion Rate</strong>
              <p className="text-slate-300">
                Formula: <code className="font-mono text-amber-300">(Attributable purchases / Unique Product Views) × 100</code>. Only valid verified orders within the reporting window are counted.
              </p>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-blue-900/60">
              <strong className="text-white block mb-1">Inventory Runway (Days)</strong>
              <p className="text-slate-300">
                Formula: <code className="font-mono text-amber-300">Current Stock / Average Daily Sales Velocity</code>. Items with &lt; 7 days runway trigger urgent stockout alerts.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main KPI Cards Grid */}
      {report && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Gross Sales */}
          <div className="bg-[#131921] border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:border-[#febd69]/50 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Sales</span>
              <div className="p-2 bg-amber-500/10 text-[#febd69] rounded-xl border border-amber-500/20">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-white font-mono">
                {symbol}{report.summary.grossSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <span>Total ordered merchandise value</span>
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>Avg Order Value (AOV):</span>
              <strong className="text-slate-200 font-mono">{symbol}{report.summary.averageOrderValue.toFixed(2)}</strong>
            </div>
          </div>

          {/* Card 2: Net Sales (After Commission & Refunds) */}
          <div className="bg-[#131921] border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:border-emerald-500/50 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Net Sales (Payout)</span>
              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-emerald-400 font-mono">
                {symbol}{report.summary.netSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Net earnings after commission ({symbol}{report.summary.commissionDeducted.toFixed(2)}) & refunds
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>Marketplace Take Rate:</span>
              <strong className="text-amber-400 font-mono">{report.summary.takeRatePct}%</strong>
            </div>
          </div>

          {/* Card 3: Orders & Units Sold */}
          <div className="bg-[#131921] border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:border-blue-500/50 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Orders & Units</span>
              <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
                <ShoppingCart className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-white font-mono">
                {report.summary.completedOrders}{' '}
                <span className="text-sm font-semibold text-slate-400 font-sans">orders</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {report.summary.unitsSold} total units shipped / in fulfillment
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Cancelled Orders:</span>
              <span className={`font-bold font-mono ${report.summary.cancelledOrders > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {report.summary.cancelledOrders} ({report.summary.cancellationRatePct}%)
              </span>
            </div>
          </div>

          {/* Card 4: Catalog & Refund Health */}
          <div className="bg-[#131921] border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:border-purple-500/50 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Catalog & Returns</span>
              <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
                <Package className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-white font-mono">
                {report.summary.activeListingsCount}{' '}
                <span className="text-sm font-semibold text-slate-400 font-sans">listings</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Refund Total: <span className="text-rose-400 font-mono font-bold">{symbol}{report.summary.refundTotal.toFixed(2)}</span>
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Refund Rate:</span>
              <span className={`font-bold font-mono ${report.summary.refundRatePct > 5 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {report.summary.refundRatePct}% (Threshold: &lt;5%)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Actionable Seller Insights Panel (Phase 5) */}
      {report && report.inventoryInsights.length > 0 && (
        <div className="bg-[#131921] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-[#febd69]" />
              <h3 className="text-base font-bold text-white">Actionable Seller Intelligence & Inventory Alerts</h3>
            </div>
            <span className="text-xs bg-slate-800 px-2.5 py-1 rounded-full text-slate-300 font-semibold">
              {report.inventoryInsights.length} Recommendations Found
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {report.inventoryInsights.map((ins) => (
              <div
                key={ins.id}
                className={`p-4 rounded-xl border transition flex flex-col justify-between space-y-3 ${
                  ins.severity === 'critical'
                    ? 'bg-rose-950/30 border-rose-900/60'
                    : ins.severity === 'warning'
                    ? 'bg-amber-950/30 border-amber-900/60'
                    : ins.severity === 'positive'
                    ? 'bg-emerald-950/30 border-emerald-900/60'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      {getInsightIcon(ins.type)}
                      <span className="text-xs font-bold text-white line-clamp-1">{ins.title}</span>
                    </div>
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        ins.severity === 'critical'
                          ? 'bg-rose-900/80 text-rose-200'
                          : ins.severity === 'warning'
                          ? 'bg-amber-900/80 text-amber-200'
                          : ins.severity === 'positive'
                          ? 'bg-emerald-900/80 text-emerald-200'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {ins.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{ins.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-[#febd69] font-medium text-[10px] italic line-clamp-1">
                    {ins.recommendation}
                  </span>
                  {ins.actionLabel && (
                    <button
                      onClick={onNavigateToListings}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold text-[10px] shrink-0 transition"
                    >
                      {ins.actionLabel}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visual Analytics Charts Section (Phase 2 & 4) */}
      {report && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales & Revenue Trend Chart */}
          <div className="lg:col-span-2 bg-[#131921] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#febd69]" />
                  Sales & Net Revenue Trajectory
                </h3>
                <p className="text-xs text-slate-400">
                  Daily gross sales vs net earnings across the selected reporting window
                </p>
              </div>

              <div className="flex items-center space-x-3 text-xs font-bold">
                <span className="flex items-center space-x-1.5 text-[#febd69]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#febd69]" />
                  <span>Gross Sales</span>
                </span>
                <span className="flex items-center space-x-1.5 text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span>Net Payout</span>
                </span>
              </div>
            </div>

            {report.salesTrends.length === 0 || report.summary.grossSales === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-slate-500 space-y-2">
                <ShoppingCart className="w-8 h-8 opacity-40 text-slate-600" />
                <p className="text-xs font-bold">No sales transactions recorded for this period.</p>
                <p className="text-[11px] text-slate-600">Select a wider date range or check your listing visibility.</p>
              </div>
            ) : (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={report.salesTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="grossSalesGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#febd69" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#febd69" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="netSalesGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#34d399" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#34d399" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#232f3e" vertical={false} />
                    <XAxis dataKey="formattedDate" stroke="#64748b" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(val) => `${symbol}${val}`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                      labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                      formatter={(val: any, name: string) => [
                        `${symbol}${Number(val).toFixed(2)}`,
                        name === 'grossSales' ? 'Gross Sales' : name === 'netSales' ? 'Net Payout' : name,
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="grossSales"
                      stroke="#febd69"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#grossSalesGrad)"
                      name="grossSales"
                    />
                    <Area
                      type="monotone"
                      dataKey="netSales"
                      stroke="#34d399"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#netSalesGrad)"
                      name="netSales"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Category Distribution Pie / Progress */}
          <div className="bg-[#131921] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4 flex flex-col justify-between">
            <div>
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-400" />
                  Category Breakdown
                </h3>
                <p className="text-xs text-slate-400">Distribution of products & sales by department</p>
              </div>

              {report.categoryDistribution.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">No active category data.</div>
              ) : (
                <div className="space-y-3.5 mt-4">
                  {report.categoryDistribution.map((cat, idx) => {
                    const color = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
                    const pct = report.summary.grossSales > 0 ? Math.round((cat.revenue / report.summary.grossSales) * 100) : 0;
                    return (
                      <div key={cat.category} className="space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-200">{cat.category}</span>
                          <span className="font-mono text-slate-300">
                            {symbol}{cat.revenue.toFixed(2)} ({pct}%)
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(5, pct)}%`, backgroundColor: color }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-500">
                          <span>{cat.productCount} active listings</span>
                          <span>{cat.units} units sold</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Verified Brand Status</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> FBA Prime Eligible
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Product Performance Table (Phase 3) */}
      {report && (
        <div className="bg-[#131921] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-[#febd69]" />
                <h3 className="text-base font-bold text-white">Product Performance & Conversion Funnel</h3>
                <button
                  onClick={() => setShowMetricExplanation(true)}
                  className="text-slate-400 hover:text-white p-1 rounded"
                  title="Explain metric formulas"
                >
                  <HelpCircle className="w-4 h-4 text-blue-400" />
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time tracking of views, impressions, clicks, add-to-carts, units sold, conversion rate, and inventory runway
              </p>
            </div>

            {/* Table Filters */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search title or SKU..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#febd69] w-48"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#febd69]"
              >
                <option value="all">All Categories</option>
                <option value="computing">Computing</option>
                <option value="robotics">Robotics</option>
                <option value="industrial">Industrial</option>
                <option value="electronics">Electronics</option>
              </select>

              <select
                value={selectedStockFilter}
                onChange={(e) => setSelectedStockFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#febd69]"
              >
                <option value="all">All Stock Statuses</option>
                <option value="in">In Stock Only</option>
                <option value="low">Low / Reorder Stock</option>
                <option value="out">Out of Stock</option>
              </select>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                  <th className="py-3 px-3 cursor-pointer hover:text-white" onClick={() => toggleSort('productTitle')}>
                    Product / SKU {sortField === 'productTitle' && (sortAsc ? '▲' : '▼')}
                  </th>
                  <th className="py-3 px-3 cursor-pointer hover:text-white text-right" onClick={() => toggleSort('unitPrice')}>
                    Price {sortField === 'unitPrice' && (sortAsc ? '▲' : '▼')}
                  </th>
                  <th className="py-3 px-3 cursor-pointer hover:text-white text-center" onClick={() => toggleSort('currentStock')}>
                    Stock Status {sortField === 'currentStock' && (sortAsc ? '▲' : '▼')}
                  </th>
                  <th className="py-3 px-3 cursor-pointer hover:text-white text-right" onClick={() => toggleSort('views')}>
                    Views {sortField === 'views' && (sortAsc ? '▲' : '▼')}
                  </th>
                  <th className="py-3 px-3 cursor-pointer hover:text-white text-right" onClick={() => toggleSort('clicks')}>
                    Clicks {sortField === 'clicks' && (sortAsc ? '▲' : '▼')}
                  </th>
                  <th className="py-3 px-3 cursor-pointer hover:text-white text-right" onClick={() => toggleSort('addToCartCount')}>
                    Cart Additions {sortField === 'addToCartCount' && (sortAsc ? '▲' : '▼')}
                  </th>
                  <th className="py-3 px-3 cursor-pointer hover:text-white text-right" onClick={() => toggleSort('unitsSold')}>
                    Units Sold {sortField === 'unitsSold' && (sortAsc ? '▲' : '▼')}
                  </th>
                  <th className="py-3 px-3 cursor-pointer hover:text-white text-right" onClick={() => toggleSort('grossRevenue')}>
                    Gross Sales {sortField === 'grossRevenue' && (sortAsc ? '▲' : '▼')}
                  </th>
                  <th className="py-3 px-3 cursor-pointer hover:text-white text-right" onClick={() => toggleSort('conversionRatePct')}>
                    Conv. Rate {sortField === 'conversionRatePct' && (sortAsc ? '▲' : '▼')}
                  </th>
                  <th className="py-3 px-3 cursor-pointer hover:text-white text-right" onClick={() => toggleSort('refundRatePct')}>
                    Return Rate {sortField === 'refundRatePct' && (sortAsc ? '▲' : '▼')}
                  </th>
                  <th className="py-3 px-3 cursor-pointer hover:text-white text-center" onClick={() => toggleSort('daysOfInventoryRunway')}>
                    Runway {sortField === 'daysOfInventoryRunway' && (sortAsc ? '▲' : '▼')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-10 text-center text-slate-500">
                      No products match your search or filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => (
                    <tr key={p.productId} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-3">
                        <div className="flex items-center space-x-3">
                          <img
                            src={p.imageUrl || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=400&q=80'}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover bg-slate-900 border border-slate-800 shrink-0"
                          />
                          <div className="min-w-0 max-w-xs">
                            <div className="font-bold text-white text-xs truncate" title={p.productTitle}>
                              {p.productTitle}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              SKU: <span className="text-[#febd69]">{p.sku}</span> • {p.category}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-white font-bold">
                        {symbol}{p.unitPrice.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {getStockStatusBadge(p.stockStatus, p.currentStock)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-300">
                        {p.views.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-300">
                        {p.clicks.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-300">
                        {p.addToCartCount.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-emerald-400 font-bold">
                        {p.unitsSold}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-[#febd69] font-bold">
                        {symbol}{p.grossRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold">
                        <span
                          className={
                            p.conversionRatePct >= 5
                              ? 'text-emerald-400'
                              : p.conversionRatePct >= 2
                              ? 'text-amber-400'
                              : 'text-slate-400'
                          }
                        >
                          {p.conversionRatePct}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono">
                        <span
                          className={
                            p.refundRatePct > 10
                              ? 'text-rose-400 font-bold'
                              : p.refundRatePct > 0
                              ? 'text-amber-300'
                              : 'text-slate-400'
                          }
                        >
                          {p.refundRatePct}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-[11px]">
                        {p.daysOfInventoryRunway >= 999 ? (
                          <span className="text-slate-500">Stable</span>
                        ) : p.daysOfInventoryRunway <= 7 ? (
                          <span className="text-rose-400 font-bold">{p.daysOfInventoryRunway} days!</span>
                        ) : (
                          <span className="text-slate-300">{p.daysOfInventoryRunway} days</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recently Received Orders for Active Merchant */}
      {report && report.recentOrders.length > 0 && (
        <div className="bg-[#131921] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-emerald-400" />
                Recently Received Orders (Merchant Allocation)
              </h3>
              <p className="text-xs text-slate-400">
                Latest customer purchases containing products fulfilled by {activeMerchant.name}
              </p>
            </div>
            {onNavigateToOrders && (
              <button
                onClick={onNavigateToOrders}
                className="text-xs text-[#febd69] hover:underline font-bold flex items-center gap-1"
              >
                <span>View All In OMS</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                  <th className="py-2.5 px-3">Order Number</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3 text-right">Items / Qty</th>
                  <th className="py-2.5 px-3 text-right">Gross Total</th>
                  <th className="py-2.5 px-3 text-right">Net Payout</th>
                  <th className="py-2.5 px-3 text-center">Fulfillment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {report.recentOrders.map((ord) => (
                  <tr key={ord.orderId} className="hover:bg-slate-800/40 transition">
                    <td className="py-2.5 px-3 font-mono font-bold text-[#febd69]">
                      {ord.orderNumber}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 text-xs">
                      {new Date(ord.orderDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-white">
                      {ord.customerName}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-300">
                      {ord.itemsCount} units
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-white">
                      {symbol}{ord.sellerGrossTotal.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400">
                      {symbol}{ord.sellerNetTotal.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-950/80 text-blue-400 border border-blue-800">
                        {ord.fulfillmentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
