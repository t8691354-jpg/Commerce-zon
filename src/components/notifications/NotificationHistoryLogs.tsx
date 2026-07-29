import React, { useState } from 'react';
import { 
  Search, Filter, Download, FileSpreadsheet, FileText, Eye, CheckCircle2, 
  AlertTriangle, Clock, RefreshCw, XCircle, Code, ShieldCheck, Mail, MessageSquare, Smartphone
} from 'lucide-react';
import { NotificationItem, DeliveryStatus, NotificationRole, NotificationChannel } from '../../types/notifications';

interface Props {
  notifications: NotificationItem[];
  onRetryFailedNotification: (id: string) => void;
}

export const NotificationHistoryLogs: React.FC<Props> = ({ notifications, onRetryFailedNotification }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [selectedChannel, setSelectedChannel] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [inspectItem, setInspectItem] = useState<NotificationItem | null>(null);

  const filtered = notifications.filter((ntf) => {
    const matchesSearch = 
      ntf.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ntf.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ntf.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ntf.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ntf.errorLog && ntf.errorLog.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = selectedRole === 'All' || ntf.role === selectedRole;
    const matchesChannel = selectedChannel === 'All' || ntf.channel === selectedChannel;
    const matchesStatus = selectedStatus === 'All' || ntf.status === selectedStatus;

    return matchesSearch && matchesRole && matchesChannel && matchesStatus;
  });

  const exportCSV = () => {
    const headers = ['Notification ID', 'Recipient', 'Role', 'Category', 'Channel', 'Status', 'Timestamp', 'Retries'];
    const rows = filtered.map(n => [
      n.id,
      `"${n.recipientName}"`,
      n.role,
      `"${n.category}"`,
      n.channel,
      n.status,
      n.timestamp,
      n.retryAttempts
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `marketplace_notifications_audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filtered, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `marketplace_notifications_audit_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header & Export Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-xl">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span>Complete Notification Audit & Dispatch Logs</span>
          </h2>
          <p className="text-xs text-slate-400">Searchable system event ledger, transmission retry histories & raw payloads</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={exportCSV}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center space-x-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={exportJSON}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center space-x-1.5"
          >
            <Code className="w-3.5 h-3.5 text-amber-400" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search ID, Name, Title, Log..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
            >
              <option value="All">All Roles</option>
              <option value="Buyer">Buyer</option>
              <option value="Seller">Seller</option>
              <option value="Affiliate">Affiliate</option>
              <option value="Supplier">Supplier</option>
              <option value="Warehouse">Warehouse</option>
              <option value="DeliveryPartner">Delivery Partner</option>
              <option value="Administrator">Administrator</option>
            </select>
          </div>

          <div>
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white uppercase"
            >
              <option value="All">All Channels</option>
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="in_app">In-App</option>
              <option value="push_android">Push Android</option>
              <option value="push_ios">Push iOS</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
            >
              <option value="All">All Statuses</option>
              <option value="delivered">Delivered</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
              <option value="retrying">Retrying</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3.5">Notification ID</th>
                <th className="p-3.5">Recipient</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Channel</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    No notification logs match your filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((ntf) => (
                  <tr key={ntf.id} className="hover:bg-slate-800/50 transition">
                    <td className="p-3.5 font-mono text-amber-400 font-bold">{ntf.id}</td>
                    <td className="p-3.5">
                      <div className="font-bold text-white">{ntf.recipientName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{ntf.recipientEmail}</div>
                    </td>
                    <td className="p-3.5 font-semibold text-slate-300">{ntf.role}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-200 border border-slate-700">
                        {ntf.category}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono uppercase text-[10px] font-bold text-sky-400">{ntf.channel}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        ntf.status === 'delivered' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        ntf.status === 'failed' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {ntf.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-400 font-mono text-[11px]">{ntf.timestamp}</td>
                    <td className="p-3.5 text-right space-x-1">
                      {ntf.status === 'failed' && (
                        <button
                          onClick={() => onRetryFailedNotification(ntf.id)}
                          className="px-2 py-1 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 text-[10px] font-bold"
                          title="Retry dispatch"
                        >
                          Retry
                        </button>
                      )}
                      <button
                        onClick={() => setInspectItem(ntf)}
                        className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                        title="Inspect payload & logs"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payload Inspection Modal */}
      {inspectItem && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 max-w-2xl w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Code className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Notification Transmission Trace #{inspectItem.id}</h3>
              </div>
              <button onClick={() => setInspectItem(null)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono">
                <div>Recipient ID: <strong className="text-white">{inspectItem.recipientId}</strong></div>
                <div>Role: <strong className="text-amber-400">{inspectItem.role}</strong></div>
                <div>Channel: <strong className="text-sky-400 uppercase">{inspectItem.channel}</strong></div>
                <div>Priority: <strong className="text-purple-400 uppercase">{inspectItem.priority}</strong></div>
                <div>Retry Attempts: <strong className="text-slate-200">{inspectItem.retryAttempts} / {inspectItem.maxRetries}</strong></div>
                <div>Delivered At: <strong className="text-emerald-400">{inspectItem.deliveredAt || 'N/A'}</strong></div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Title & Message Payload</label>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-slate-200 space-y-1">
                  <div className="font-bold text-white">{inspectItem.title}</div>
                  <p className="text-slate-300">{inspectItem.body}</p>
                </div>
              </div>

              {inspectItem.errorLog && (
                <div>
                  <label className="block text-[11px] font-bold text-rose-400 mb-1">System Error & Retry Log</label>
                  <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-lg font-mono text-rose-200 text-[11px]">
                    {inspectItem.errorLog}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setInspectItem(null)}
                className="px-4 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400"
              >
                Close Trace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
