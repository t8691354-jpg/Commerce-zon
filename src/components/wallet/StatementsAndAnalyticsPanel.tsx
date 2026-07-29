import React, { useState } from 'react';
import { WalletState, WalletTransaction } from '../../types/domain';
import {
  BarChart3,
  Download,
  FileText,
  Calendar,
  Filter,
  TrendingUp,
  DollarSign,
  PieChart,
  Table,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';

interface StatementsAndAnalyticsPanelProps {
  wallet: WalletState;
  currencyRate: number;
  currencySymbol: string;
}

export const StatementsAndAnalyticsPanel: React.FC<StatementsAndAnalyticsPanelProps> = ({
  wallet,
  currencyRate,
  currencySymbol,
}) => {
  const [timeframe, setTimeframe] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'>('MONTHLY');
  const [statementType, setStatementType] = useState<'MONTHLY' | 'ANNUAL' | 'TRANSACTION' | 'TAX' | 'SETTLEMENT'>('MONTHLY');
  const [exportFormat, setExportFormat] = useState<'PDF' | 'CSV' | 'EXCEL'>('CSV');
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  // Calculate High-level Analytics Metrics
  const totalVolume = wallet.transactions.reduce((acc, tx) => acc + Math.abs(tx.amount), 0);
  const totalPurchases = wallet.transactions.filter((t) => t.type === 'PURCHASE' || t.type === 'WALLET_PAYMENT').reduce((acc, t) => acc + Math.abs(t.amount), 0);
  const totalRefunds = wallet.transactions.filter((t) => t.type === 'REFUND').reduce((acc, t) => acc + Math.abs(t.amount), 0);
  const totalCashback = wallet.transactions.filter((t) => t.type === 'CASHBACK_CREDIT').reduce((acc, t) => acc + Math.abs(t.amount), 0);
  const totalSettlements = wallet.transactions.filter((t) => t.type === 'SELLER_SETTLEMENT').reduce((acc, t) => acc + Math.abs(t.amount), 0);

  const handleDownloadStatement = () => {
    const filename = `CommerceZone_${statementType}_Statement_2026.${exportFormat.toLowerCase()}`;
    let content = '';

    if (exportFormat === 'CSV' || exportFormat === 'EXCEL') {
      content = `ID,User,WalletType,TransactionType,Amount(USD),Status,Timestamp,ReferenceId\n`;
      wallet.transactions.forEach((tx) => {
        content += `"${tx.id}","${tx.userName}","${tx.walletType}","${tx.type}",${tx.amount},"${tx.status}","${tx.timestamp}","${tx.referenceId || ''}"\n`;
      });
    } else {
      // Simple text-based PDF representation
      content = `=== COMMERCE ZONE PAY STATEMENT (${statementType}) ===\n`;
      content += `Generated Date: ${new Date().toISOString()}\n`;
      content += `Total Volume: $${totalVolume.toFixed(2)} USD\n\n`;
      wallet.transactions.forEach((tx) => {
        content += `[${tx.timestamp}] ${tx.type} | ${tx.userName} | Amount: $${tx.amount} | Ref: ${tx.referenceId}\n`;
      });
    }

    const blob = new Blob([content], { type: exportFormat === 'PDF' ? 'text/plain' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadNotice(`Downloaded ${filename} (${exportFormat}) successfully!`);
    setTimeout(() => setDownloadNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Filters */}
      <div className="bg-[#131921] border border-[#37475a] p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-sky-500 text-slate-950 rounded-xl font-bold">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">Financial Analytics & Statement Generation</h2>
            <p className="text-xs text-slate-400">
              Download official monthly, annual, tax, and settlement ledger statements in PDF, CSV & Excel.
            </p>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                timeframe === tf ? 'bg-[#febd69] text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {downloadNotice && (
        <div className="p-3 bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-bold rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Metric Cards Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Total Processed Volume</div>
          <div className="text-xl font-black text-white font-mono mt-1">
            {currencySymbol}{(totalVolume * currencyRate).toFixed(2)}
          </div>
          <span className="text-[9px] text-slate-500">All wallet types</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Buyer Payments</div>
          <div className="text-xl font-black text-emerald-400 font-mono mt-1">
            {currencySymbol}{(totalPurchases * currencyRate).toFixed(2)}
          </div>
          <span className="text-[9px] text-slate-500">Gross purchases</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Total Refunds</div>
          <div className="text-xl font-black text-rose-400 font-mono mt-1">
            {currencySymbol}{(totalRefunds * currencyRate).toFixed(2)}
          </div>
          <span className="text-[9px] text-slate-500">Returned goods</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Cashback Awarded</div>
          <div className="text-xl font-black text-amber-400 font-mono mt-1">
            {currencySymbol}{(totalCashback * currencyRate).toFixed(2)}
          </div>
          <span className="text-[9px] text-slate-500">2% Prime Perks</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Seller Settlements</div>
          <div className="text-xl font-black text-sky-400 font-mono mt-1">
            {currencySymbol}{(totalSettlements * currencyRate).toFixed(2)}
          </div>
          <span className="text-[9px] text-slate-500">Payout ledger</span>
        </div>
      </div>

      {/* Visual Analytics Chart Simulation (SVG bars) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-[#febd69]" />
            <h3 className="text-sm font-bold text-white">Financial Movement Trends ({timeframe})</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Live Sync</span>
        </div>

        {/* SVG Chart */}
        <div className="h-44 w-full flex items-end justify-between gap-3 pt-6 pb-2 px-4 bg-slate-950 rounded-xl border border-slate-800">
          {[
            { label: 'Mon', buy: 65, sell: 40 },
            { label: 'Tue', buy: 80, sell: 55 },
            { label: 'Wed', buy: 45, sell: 30 },
            { label: 'Thu', buy: 90, sell: 70 },
            { label: 'Fri', buy: 100, sell: 85 },
            { label: 'Sat', buy: 75, sell: 60 },
            { label: 'Sun', buy: 88, sell: 72 },
          ].map((bar, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
              <div className="w-full flex items-end justify-center gap-1 h-32">
                <div
                  style={{ height: `${bar.buy}%` }}
                  className="w-1/2 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t transition-all duration-500"
                  title={`Purchases: $${bar.buy * 100}`}
                ></div>
                <div
                  style={{ height: `${bar.sell}%` }}
                  className="w-1/2 bg-gradient-to-t from-[#febd69] to-amber-400 rounded-t transition-all duration-500"
                  title={`Settlements: $${bar.sell * 100}`}
                ></div>
              </div>
              <span className="text-[10px] text-slate-400 font-mono font-bold">{bar.label}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center space-x-6 text-xs text-slate-400 pt-1">
          <div className="flex items-center space-x-1.5">
            <div className="w-3 h-3 bg-emerald-400 rounded"></div>
            <span>Buyer Purchases</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-3 h-3 bg-[#febd69] rounded"></div>
            <span>Seller Settlements</span>
          </div>
        </div>
      </div>

      {/* Statement Generator Form Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-sky-400" />
            <h3 className="text-sm font-bold text-white">Downloadable Official Statements & Tax Reports</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-slate-400 font-semibold">Select Statement Type</label>
            <select
              value={statementType}
              onChange={(e) => setStatementType(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white mt-1 focus:outline-none focus:border-sky-400"
            >
              <option value="MONTHLY">Monthly Wallet Statement</option>
              <option value="ANNUAL">Annual Financial Statement</option>
              <option value="TRANSACTION">Full Transaction Audit Ledger</option>
              <option value="TAX">Official Tax Breakdown Statement</option>
              <option value="SETTLEMENT">Merchant Settlement Audit Statement</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 font-semibold">File Format</label>
            <div className="grid grid-cols-3 gap-1.5 mt-1">
              {(['PDF', 'CSV', 'EXCEL'] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setExportFormat(fmt)}
                  className={`py-2 rounded-xl text-xs font-bold transition border ${
                    exportFormat === fmt
                      ? 'bg-sky-500 text-slate-950 border-sky-400'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleDownloadStatement}
              className="w-full py-2.5 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-extrabold text-xs rounded-xl transition shadow flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Statement ({exportFormat})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
