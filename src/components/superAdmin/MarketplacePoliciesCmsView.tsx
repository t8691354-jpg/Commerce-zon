import React, { useState } from 'react';
import { MOCK_MARKETPLACE_POLICIES } from '../../data/mockSuperAdmin';
import { MarketplacePolicy } from '../../types/superAdmin';
import { FileText, Plus, CheckCircle2, Edit, Trash2, Eye, Upload, Shield } from 'lucide-react';

export const MarketplacePoliciesCmsView: React.FC = () => {
  const [policies, setPolicies] = useState<MarketplacePolicy[]>(MOCK_MARKETPLACE_POLICIES);
  const [selectedPolicy, setSelectedPolicy] = useState<MarketplacePolicy | null>(policies[0]);
  const [notification, setNotification] = useState<string | null>(null);

  const handleUpdatePolicy = (id: string, newVersion: string, content: string) => {
    setPolicies((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, version: newVersion, content, lastUpdated: new Date().toISOString().split('T')[0] } : p
      )
    );
    setNotification(`Policy ${id} updated to version ${newVersion} & published live.`);
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Policy Index List */}
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              Active Platform Policies ({policies.length})
            </h3>
          </div>

          <div className="space-y-2">
            {policies.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPolicy(p)}
                className={`w-full text-left p-3 rounded-xl border transition ${
                  selectedPolicy?.id === p.id
                    ? 'bg-amber-500/10 border-amber-500/50 text-slate-100'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs">{p.title}</span>
                  <span className="text-[10px] px-2 py-0.5 bg-slate-900 border border-slate-700 text-amber-400 rounded font-mono">
                    {p.version}
                  </span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-mono">
                  <span>Cat: {p.category}</span>
                  <span>{p.lastUpdated}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Policy Editor */}
        {selectedPolicy && (
          <div className="lg:col-span-2 bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-100">{selectedPolicy.title}</h3>
                <p className="text-xs text-slate-400 font-mono">
                  Category: {selectedPolicy.category} | Version: {selectedPolicy.version} | Author: {selectedPolicy.author}
                </p>
              </div>

              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full text-xs font-bold font-mono">
                {selectedPolicy.status}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Policy Markdown Document Content</label>
                <textarea
                  rows={8}
                  value={selectedPolicy.content}
                  onChange={(e) =>
                    setSelectedPolicy({ ...selectedPolicy, content: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 font-mono text-xs focus:border-amber-500 outline-none"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() =>
                    handleUpdatePolicy(selectedPolicy.id, selectedPolicy.version, selectedPolicy.content)
                  }
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center space-x-2"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Publish Updated Version</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
