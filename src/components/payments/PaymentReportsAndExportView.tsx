import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  DollarSign,
  FileText,
  PieChart,
  ShieldCheck,
} from 'lucide-react';

export const PaymentReportsAndExportView: React.FC = () => {
  const [reportType, setReportType] = useState('REVENUE_SUMMARY');

  const handleDownloadReport = (format: 'CSV' | 'PDF') => {
    alert(`Generating & Downloading ${reportType} Report in ${format} format...`);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span>EXECUTIVE FINANCIAL REPORTS & EXPORT ENGINE</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Marketplace Payment Analytics & Tax Reports</h2>
          <p className="text-xs text-slate-400 mt-1">
            Reconciled financial reporting for gross sales volume, net seller payouts, gateway fee audits & tax compliance
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleDownloadReport('CSV')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1.5 shadow"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV Report</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Gross Processed Volume (30D)</span>
          <div className="text-xl font-black text-white">$248,910.88 USD</div>
          <span className="text-[10px] text-emerald-400 font-bold">↑ +14.2% YoY</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Net Marketplace Commission</span>
          <div className="text-xl font-black text-emerald-400">$24,891.08 USD</div>
          <span className="text-[10px] text-slate-400 font-bold">10% Average Take Rate</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Gateway Processing Fees</span>
          <div className="text-xl font-black text-amber-300">$6,812.40 USD</div>
          <span className="text-[10px] text-slate-400 font-bold">2.73% Effective Gateway Cost</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Dispute & Chargeback Rate</span>
          <div className="text-xl font-black text-rose-400">0.04%</div>
          <span className="text-[10px] text-emerald-400 font-bold">Well Below Visa 0.9% Cap</span>
        </div>
      </div>

      {/* Report Generator Selector */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 text-xs">
        <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-2">
          <FileText className="w-4 h-4 text-[#febd69]" />
          <span>Generate Customized Reconciled Financial Reports</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { id: 'REVENUE_SUMMARY', label: 'Gross Revenue & Settlements', desc: 'Detailed sales, fees & seller wallet payouts' },
            { id: 'GATEWAY_PERFORMANCE', label: 'Gateway Provider Analytics', desc: 'Approval rates, latency & processing cost per gateway' },
            { id: 'REFUNDS_DISPUTES', label: 'Refunds & Chargebacks Audit', desc: 'Full log of issued refunds and active disputes' },
            { id: 'TAX_COMPLIANCE', label: 'Jurisdictional Tax Ledger', desc: 'US State Sales Tax, EU VAT & GST collected' },
          ].map((rep) => (
            <div
              key={rep.id}
              onClick={() => setReportType(rep.id)}
              className={`p-4 rounded-xl border cursor-pointer transition space-y-1 ${
                reportType === rep.id
                  ? 'bg-slate-950 border-[#febd69] ring-2 ring-amber-400/20'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="font-bold text-white">{rep.label}</div>
              <p className="text-[10px] text-slate-400">{rep.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
