import React, { useState } from 'react';
import { WalletLedgerEntry, LedgerEntryType } from '../../types/paymentWalletArchitecture';
import { FileText, ShieldCheck, Search, Filter, ArrowUpRight, ArrowDownLeft, RefreshCw, CheckCircle2 } from 'lucide-react';

interface DoubleEntryLedgerPanelProps {
  entries: WalletLedgerEntry[];
  currencySymbol: string;
  currencyRate: number;
}

export const DoubleEntryLedgerPanel: React.FC<DoubleEntryLedgerPanelProps> = ({
  entries,
  currencySymbol,
  currencyRate,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredEntries = entries.filter((entry) => {
    if (filterType !== 'ALL' && entry.type !== filterType) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        entry.id.toLowerCase().includes(q) ||
        entry.transactionId.toLowerCase().includes(q) ||
        (entry.orderId && entry.orderId.toLowerCase().includes(q)) ||
        entry.description.toLowerCase().includes(q) ||
        entry.entityId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      {/* Header Banner */}
      <div className="bg-[#131921] border border-[#37475a] p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 text-slate-950 rounded-xl font-bold">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black text-[#febd69] uppercase tracking-wider">Enterprise Audit Architecture</span>
              <span className="text-slate-500">•</span>
              <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-mono flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Immutable Double-Entry Ledger</span>
              </span>
            </div>
            <h2 className="text-lg font-black text-white mt-0.5">Financial Transaction & Audit Explorer</h2>
          </div>
        </div>

        <div className="text-xs text-slate-400 font-mono bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
          Total Recorded Journal Entries: <span className="text-[#febd69] font-bold">{entries.length}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by Ledger ID, Tx ID, Order ID, or Entity..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl pl-9 pr-4 py-2 text-xs outline-none focus:ring-2 focus:ring-[#febd69] font-mono"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-1">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs font-mono outline-none focus:ring-2 focus:ring-[#febd69]"
            >
              <option value="ALL">All Event Types</option>
              <option value="ORDER_PAID">ORDER_PAID</option>
              <option value="COMMISSION_DEDUCTED">COMMISSION_DEDUCTED</option>
              <option value="WALLET_UNLOCKED">WALLET_UNLOCKED</option>
              <option value="REFUND_ISSUED">REFUND_ISSUED</option>
              <option value="WITHDRAWAL_REQUESTED">WITHDRAWAL_REQUESTED</option>
              <option value="WITHDRAWAL_PAID">WITHDRAWAL_PAID</option>
              <option value="MANUAL_CREDIT">MANUAL_CREDIT</option>
              <option value="MANUAL_DEBIT">MANUAL_DEBIT</option>
            </select>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <th className="py-2.5 px-3">Ledger ID</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Entity</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Direction</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Buckets</th>
                <th className="py-2.5 px-3">Balance Delta</th>
                <th className="py-2.5 px-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500 font-sans text-xs">
                    No double-entry ledger records matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3 font-bold text-white">{entry.id}</td>
                    <td className="py-3 px-3 text-slate-500 text-[10px]">
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-bold">
                        {entry.entityType}:{entry.entityId}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-[#febd69]">{entry.type}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase inline-flex items-center space-x-1 ${
                          entry.direction === 'CREDIT'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : entry.direction === 'DEBIT'
                            ? 'bg-rose-950 text-rose-400 border border-rose-800'
                            : 'bg-sky-950 text-sky-400 border border-sky-800'
                        }`}
                      >
                        {entry.direction === 'CREDIT' && <ArrowDownLeft className="w-3 h-3 mr-1" />}
                        {entry.direction === 'DEBIT' && <ArrowUpRight className="w-3 h-3 mr-1" />}
                        {entry.direction === 'TRANSFER' && <RefreshCw className="w-3 h-3 mr-1" />}
                        <span>{entry.direction}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-white">
                      {currencySymbol}{(entry.amount * currencyRate).toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-[10px] text-slate-400">
                      {entry.fromBucket && <span>{entry.fromBucket} → </span>}
                      <span className="text-white font-bold">{entry.toBucket || 'TREASURY'}</span>
                    </td>
                    <td className="py-3 px-3 text-[10px] text-slate-400">
                      ${entry.balanceBefore.toFixed(0)} → <strong className="text-emerald-400">${entry.balanceAfter.toFixed(0)}</strong>
                    </td>
                    <td className="py-3 px-3 text-slate-300 font-sans text-[11px] leading-tight max-w-xs truncate">
                      {entry.description}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
