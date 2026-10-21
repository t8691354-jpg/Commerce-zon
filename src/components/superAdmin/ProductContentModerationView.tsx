import React, { useState } from 'react';
import { MOCK_MODERATION_ITEMS } from '../../data/mockSuperAdmin';
import { ModerationQueueItem } from '../../types/superAdmin';
import { ShieldAlert, CheckCircle2, XCircle, AlertTriangle, Cpu, RefreshCw, Eye, Trash2 } from 'lucide-react';

export const ProductContentModerationView: React.FC = () => {
  const [items, setItems] = useState<ModerationQueueItem[]>(MOCK_MODERATION_ITEMS);
  const [notification, setNotification] = useState<string | null>(null);

  const handleAction = (id: string, newStatus: 'Approved' | 'Rejected' | 'Hidden') => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    setNotification(`Moderation action executed for item ${id}: Status set to "${newStatus}".`);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-6">
      {notification && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              Automated AI & Human Moderation Queue
            </h3>
            <p className="text-xs text-slate-400">
              Inspect flagged Products, Sellers, Reviews, Q&A, and Videos analyzed by Gemini Safety Classifier
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-3 px-3">Item ID</th>
                <th className="py-3 px-3">Type & Entity Title</th>
                <th className="py-3 px-3">Submitted By</th>
                <th className="py-3 px-3">AI Safety Score</th>
                <th className="py-3 px-3">Risk Flags</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-3 text-amber-400 font-bold">{item.id}</td>

                  <td className="py-3 px-3">
                    <span className="text-[10px] px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded font-bold mr-2">
                      {item.itemType}
                    </span>
                    <span className="font-sans font-bold text-slate-200">{item.entityTitle}</span>
                  </td>

                  <td className="py-3 px-3 text-slate-400 font-sans">{item.submittedBy}</td>

                  <td className="py-3 px-3">
                    <div className="flex items-center space-x-1.5">
                      <Cpu className="w-3.5 h-3.5 text-blue-400" />
                      <span
                        className={`font-bold ${
                          item.aiSafetyScorePct >= 90
                            ? 'text-emerald-400'
                            : item.aiSafetyScorePct >= 70
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {item.aiSafetyScorePct}% Clean
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <div className="flex flex-wrap gap-1">
                      {item.riskFlags.map((flag, idx) => (
                        <span key={idx} className="text-[10px] px-1.5 py-0.5 bg-rose-500/10 text-rose-300 border border-rose-500/30 rounded">
                          {flag}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.status === 'Approved'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : item.status === 'Pending Review'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      <button
                        onClick={() => handleAction(item.id, 'Approved')}
                        title="Approve & Publish Item"
                        className="p-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 rounded transition"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleAction(item.id, 'Rejected')}
                        title="Reject Item"
                        className="p-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 rounded transition"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleAction(item.id, 'Hidden')}
                        title="Permanently Hide Item"
                        className="p-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/40 rounded transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
