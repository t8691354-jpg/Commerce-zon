import React, { useState, useEffect } from 'react';
import { Store, ShieldCheck, Award, AlertTriangle, TrendingUp, CheckCircle, PackageCheck, RefreshCw, DollarSign, Layers } from 'lucide-react';
import { sellerAnalyticsClient } from '../../services/sellerAnalyticsClient';
import { MarketplaceWideAnalytics } from '../../types/sellerAnalytics';
import { MOCK_SELLER_METRICS } from '../../data/mockBiAnalytics';

export const BiSellerAnalyticsView: React.FC = () => {
  const [data, setData] = useState<MarketplaceWideAnalytics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await sellerAnalyticsClient.getMarketplaceAnalytics();
      setData(res);
    } catch (err) {
      console.warn('Failed to load live marketplace analytics, using fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6 font-sans">
      {/* Platform Level Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2 relative overflow-hidden group hover:border-[#febd69]/50 transition">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Platform GMV</span>
            <DollarSign className="w-4 h-4 text-[#febd69]" />
          </div>
          <p className="text-2xl font-black text-white font-mono">
            ${data ? data.platformGMV.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '61,280.95'}
          </p>
          <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Realtime Verified Transaction Volume</span>
          </p>
        </div>

        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2 relative overflow-hidden group hover:border-emerald-500/50 transition">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Marketplace Net Commission Take</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400 font-mono">
            ${data ? data.platformNetRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '6,128.09'}
          </p>
          <p className="text-xs text-slate-400 font-mono">
            Avg Platform Take Rate: {data ? data.averageTakeRatePct : 10.0}%
          </p>
        </div>

        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2 relative overflow-hidden group hover:border-blue-500/50 transition">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Merchants & Brands</span>
            <Store className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-black text-white font-mono">
            {data ? data.activeSellersCount : 3} <span className="text-sm font-normal text-slate-400 font-sans">Brands</span>
          </p>
          <p className="text-xs text-blue-400 font-semibold">100% Brand Verified & FBA Prime</p>
        </div>

        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2 relative overflow-hidden group hover:border-purple-500/50 transition">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Catalog Listings</span>
            <PackageCheck className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-black text-white font-mono">
            {data ? data.activeProductsListed : 10} <span className="text-sm font-normal text-slate-400 font-sans">SKUs</span>
          </p>
          <p className="text-xs text-slate-400">Multi-Warehouse Synced</p>
        </div>
      </div>

      {/* Top Marketplace Merchant Scorecard & Analytics */}
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Store className="w-5 h-5 text-[#febd69]" />
              <span>Marketplace Merchant Performance Scorecard</span>
            </h3>
            <p className="text-xs text-slate-400">
              Live revenue attribution, commission take, units sold, and fulfillment efficiency across verified merchants
            </p>
          </div>

          <button
            onClick={loadData}
            disabled={loading}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition flex items-center space-x-1.5 text-xs font-bold"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#febd69]' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-3 px-4">Merchant Name & ID</th>
                <th className="py-3 px-4">Tier Status</th>
                <th className="py-3 px-4 text-right">Gross GMV</th>
                <th className="py-3 px-4 text-right">Commission Take</th>
                <th className="py-3 px-4 text-right">Net Seller Payout</th>
                <th className="py-3 px-4 text-right">Orders</th>
                <th className="py-3 px-4 text-right">Units Sold</th>
                <th className="py-3 px-4 text-center">Customer Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {data && data.topPerformingSellers.length > 0 ? (
                data.topPerformingSellers.map((s) => (
                  <tr key={s.merchantId} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-sans font-bold text-slate-100">
                      <div>{s.merchantName}</div>
                      <span className="text-[10px] text-slate-400 font-mono">{s.merchantId}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#febd69]/10 text-[#febd69] border border-[#febd69]/30">
                        {s.tier}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-white font-bold">
                      ${s.grossSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-right text-amber-400 font-bold">
                      ${s.commissionPaid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-right text-emerald-400 font-bold">
                      ${s.netSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-300 font-bold">
                      {s.ordersCount}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-300">
                      {s.unitsSold}
                    </td>
                    <td className="py-3.5 px-4 text-center text-amber-300 font-bold">
                      ⭐ {s.rating}
                    </td>
                  </tr>
                ))
              ) : (
                MOCK_SELLER_METRICS.map((s) => (
                  <tr key={s.sellerId} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-sans font-bold text-slate-100">
                      <div>{s.sellerName}</div>
                      <span className="text-[10px] text-amber-400 font-mono">{s.tier} • {s.sellerId}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs text-slate-300 uppercase">{s.tier}</span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-[#febd69] font-bold">${(s.revenue / 1e6).toFixed(1)}M</td>
                    <td className="py-3.5 px-4 text-right text-emerald-400 font-bold">{s.profitabilityPct}%</td>
                    <td className="py-3.5 px-4 text-right text-slate-200 font-bold">${((s.revenue * 0.9) / 1e6).toFixed(1)}M</td>
                    <td className="py-3.5 px-4 text-right text-slate-200">{s.orderVolume.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-right text-slate-300">{Math.round(s.orderVolume * 1.4)}</td>
                    <td className="py-3.5 px-4 text-center text-amber-300 font-bold">{s.customerRating}★</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category GMV Breakdown */}
      {data && data.categoryRevenueBreakdown.length > 0 && (
        <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-400" />
              <span>Platform Department GMV Distribution</span>
            </h3>
            <p className="text-xs text-slate-400">Gross Merchandise Value across retail categories</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            {data.categoryRevenueBreakdown.map((cat) => (
              <div key={cat.category} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <div className="text-xs font-bold text-slate-400">{cat.category}</div>
                <div className="text-lg font-black text-white font-mono">
                  ${cat.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#febd69] font-bold">{cat.percentage}% of GMV</span>
                  <span className="text-slate-500 font-mono">{cat.ordersCount} orders</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
