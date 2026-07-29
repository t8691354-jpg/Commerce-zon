import React, { useState } from 'react';
import { ComprehensiveMasterOrder } from '../../types/oms';
import { FileSpreadsheet, Download, Printer, Filter, BarChart3, TrendingUp, DollarSign } from 'lucide-react';

interface OrderReportsAndAnalyticsViewProps {
  orders: ComprehensiveMasterOrder[];
}

export const OrderReportsAndAnalyticsView: React.FC<OrderReportsAndAnalyticsViewProps> = ({ orders }) => {
  const [reportType, setReportType] = useState<
    'ORDERS' | 'REVENUE' | 'CANCELLATIONS' | 'RETURNS' | 'REFUNDS' | 'SELLER_PERFORMANCE'
  >('ORDERS');

  const handleExportCSV = () => {
    const csvHeader = 'Order Number,Customer,Status,Grand Total,Payment Method,Created At\n';
    const csvRows = orders
      .map(
        (o) =>
          `"${o.orderNumber}","${o.customerName}","${o.status}",${o.grandTotal.amount},"${o.paymentMethod}","${o.createdAt}"`
      )
      .join('\n');

    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Amazon_OMS_Report_${reportType}_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>ENTERPRISE REPORTING & AUDIT EXPORT ENGINE</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Multi-Vendor OMS Analytics & Compliance Reports</h2>
          <p className="text-xs text-slate-400 mt-1">
            Export raw transactional CSV logs, fulfillment SLA audits, and financial settlement summaries
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl transition flex items-center space-x-2 shadow-lg"
        >
          <Download className="w-4 h-4" />
          <span>Export {reportType} CSV Data</span>
        </button>
      </div>

      {/* Report Switcher Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs">
        {[
          { id: 'ORDERS', label: 'Master Orders Report' },
          { id: 'REVENUE', label: 'Gross Revenue & Fees' },
          { id: 'CANCELLATIONS', label: 'Cancellations Audit' },
          { id: 'RETURNS', label: 'Returns & RMA Report' },
          { id: 'REFUNDS', label: 'Refund Ledger Report' },
          { id: 'SELLER_PERFORMANCE', label: 'Seller Fulfillment Performance' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setReportType(tab.id as any)}
            className={`px-4 py-2 rounded-xl font-bold transition whitespace-nowrap ${
              reportType === tab.id
                ? 'bg-[#febd69] text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Report Data Preview Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="text-xs font-black text-white uppercase tracking-wider">
          Report Data Stream ({orders.length} Records)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                <th className="py-2.5 px-3">Order #</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Lifecycle Status</th>
                <th className="py-2.5 px-3">Payment</th>
                <th className="py-2.5 px-3 text-right">Grand Total</th>
                <th className="py-2.5 px-3 text-right">Marketplace Fee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-950/60 transition">
                  <td className="py-3 px-3 font-bold text-amber-300">{o.orderNumber}</td>
                  <td className="py-3 px-3 font-sans text-white">{o.customerName}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] rounded font-bold">
                      {o.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400">{o.paymentMethod}</td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-400">
                    ${o.grandTotal.amount.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-right text-purple-300">
                    ${o.marketplaceFee.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
