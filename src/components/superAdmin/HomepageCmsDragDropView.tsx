import React, { useState } from 'react';
import { MOCK_CMS_BLOCKS } from '../../data/mockSuperAdmin';
import { CmsSectionBlock } from '../../types/superAdmin';
import { Layout, MoveUp, MoveDown, Eye, EyeOff, Plus, CheckCircle2, Sliders } from 'lucide-react';

export const HomepageCmsDragDropView: React.FC = () => {
  const [blocks, setBlocks] = useState<CmsSectionBlock[]>(MOCK_CMS_BLOCKS);
  const [notification, setNotification] = useState<string | null>(null);

  const toggleActive = (id: string) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b))
    );
    setNotification(`CMS Block ${id} status toggled and synced to storefront layout renderer.`);
    setTimeout(() => setNotification(null), 3000);
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newBlocks.length) return;

    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIndex];
    newBlocks[targetIndex] = temp;

    // re-assign order numbers
    newBlocks.forEach((b, idx) => (b.order = idx + 1));
    setBlocks(newBlocks);
    setNotification('Homepage layout section order updated.');
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
              <Layout className="w-5 h-5 text-amber-400" />
              Storefront Homepage CMS Section Layout Builder
            </h3>
            <p className="text-xs text-slate-400">
              Reorder visual sections, toggle visibility, and configure target audience rules (Prime, All, Country)
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {blocks.map((block, idx) => (
            <div
              key={block.id}
              className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                block.isActive ? 'bg-slate-950 border-slate-800' : 'bg-slate-950/50 border-slate-900 opacity-60'
              }`}
            >
              <div className="flex items-center space-x-4">
                <span className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 font-bold font-mono text-xs flex items-center justify-center">
                  #{block.order}
                </span>

                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-300 font-bold rounded">
                      {block.type}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 bg-blue-500/20 text-blue-300 font-mono rounded">
                      Audience: {block.targetAudience}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-100 text-sm mt-1">{block.title}</h4>
                </div>
              </div>

              <div className="flex items-center space-x-2 self-end sm:self-center">
                <button
                  onClick={() => moveBlock(idx, 'up')}
                  disabled={idx === 0}
                  className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-30 rounded-xl transition border border-slate-800"
                >
                  <MoveUp className="w-4 h-4" />
                </button>

                <button
                  onClick={() => moveBlock(idx, 'down')}
                  disabled={idx === blocks.length - 1}
                  className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-30 rounded-xl transition border border-slate-800"
                >
                  <MoveDown className="w-4 h-4" />
                </button>

                <button
                  onClick={() => toggleActive(block.id)}
                  className={`p-2 rounded-xl transition border ${
                    block.isActive
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}
                >
                  {block.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
