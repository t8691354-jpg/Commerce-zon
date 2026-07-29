import React, { useState } from 'react';
import { TransactionRecord, PaymentTransactionStatus } from '../../types/payments';
import { MOCK_TRANSACTIONS } from '../../data/paymentsMockData';
import {
  FileText,
  Search,
  Filter,
  DollarSign,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  KeyRound,
  Download,
  Lock,
  Eye,
} from 'lucide-react';

interface TransactionLedgerViewProps {
  transactions?: TransactionRecord[];
  onIssueRefund?: (txId: string) => void;
  onFreezeTransaction?: (txId: string) => void;
}

export const TransactionLedgerView: React.FC<TransactionLedgerViewProps> = ({
  transactions = MOCK_TRANSACTIONS,
  onIssueRefund,
  onFreezeTransaction,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedTx, setSelectedTx] = useState<TransactionRecord | null>(null);

  const filteredTx = transactions.filter((tx) => {
    const matchesSearch =
      tx.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.sellerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'ALL' || tx.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>ENTERPRISE TRANSACTION AUDIT LEDGER</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Real-Time Gateway Transaction Ledger & Financial Audit</h2>
          <p className="text-xs text-slate-400 mt-1">
            Auditable log of gross volume, gateway processing fees, marketplace commission deductions & seller wallet settlements
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              const csv = 'TransactionID,OrderID,Customer,Amount,Status,Provider,Timestamp\n' +
                filteredTx.map(t => `${t.transactionId},${t.orderId},"${t.customerName}",${t.amount},${t.status},${t.provider},${t.timestamp}`).join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `Payment_Transactions_Ledger_${Date.now()}.csv`;
              a.click();
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1.5 shadow"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV Ledger</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-2 w-full md:w-auto flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Tx ID, Order #, Customer, or Seller..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto">
          <span className="text-slate-400 font-bold">Status:</span>
          {['ALL', 'CAPTURED', 'SUCCESSFUL', 'PENDING', 'PARTIALLY_REFUNDED', 'FAILED', 'DISPUTED'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                selectedStatus === st
                  ? 'bg-[#febd69] text-slate-950 shadow'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="text-xs font-black text-white uppercase tracking-wider">
          Transaction Stream ({filteredTx.length} Records)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                <th className="py-3 px-3">Tx ID / Order #</th>
                <th className="py-3 px-3">Customer & Seller</th>
                <th className="py-3 px-3">Method & Provider</th>
                <th className="py-3 px-3 text-right">Gross Amount</th>
                <th className="py-3 px-3 text-right">Net Seller</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              {filteredTx.map((tx) => (
                <tr key={tx.transactionId} className="hover:bg-slate-950/60 transition">
                  <td className="py-3 px-3">
                    <div className="font-bold text-white">{tx.transactionId}</div>
                    <div className="text-[10px] text-amber-300">Order: {tx.orderId}</div>
                  </td>

                  <td className="py-3 px-3 font-sans">
                    <div className="font-bold text-white max-w-[200px] truncate">{tx.customerName}</div>
                    <div className="text-[10px] text-slate-400">Seller: {tx.sellerName}</div>
                  </td>

                  <td className="py-3 px-3">
                    <div className="font-bold text-sky-400">{tx.paymentMethod}</div>
                    <div className="text-[10px] text-slate-500">{tx.provider}</div>
                  </td>

                  <td className="py-3 px-3 text-right font-bold text-white">
                    ${tx.amount.toFixed(2)}
                  </td>

                  <td className="py-3 px-3 text-right font-bold text-emerald-400">
                    ${tx.netSellerAmount.toFixed(2)}
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase ${
                        tx.status === 'CAPTURED' || tx.status === 'SUCCESSFUL'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : tx.status === 'PENDING'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setSelectedTx(tx)}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg text-xs transition flex items-center space-x-1 ml-auto"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#febd69]" />
                      <span>Audit</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-xl w-full space-y-4 font-sans text-xs shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-black text-white text-base">Transaction Audit Detail #{selectedTx.transactionId}</h3>
                <span className="text-[10px] font-mono text-slate-400">Order Ref: {selectedTx.orderId}</span>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 font-mono text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex justify-between">
                <span>Idempotency Key:</span>
                <span className="text-[#febd69]">{selectedTx.idempotencyKey}</span>
              </div>
              <div className="flex justify-between">
                <span>Gateway Ref:</span>
                <span className="text-white">{selectedTx.gatewayReference}</span>
              </div>
              <div className="flex justify-between">
                <span>Gross Charge:</span>
                <span className="text-white">${selectedTx.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-rose-400">
                <span>- Marketplace Commission (10%):</span>
                <span>-${selectedTx.marketplaceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-rose-400">
                <span>- Gateway Processing Fee:</span>
                <span>-${selectedTx.processingFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-bold border-t border-slate-800 pt-2">
                <span>Net Settled to Seller Wallet:</span>
                <span>${selectedTx.netSellerAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setSelectedTx(null)}
                className="px-4 py-2 bg-slate-800 text-white font-bold rounded-xl"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
