import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Sliders,
  Check,
  Plus,
  Trash2,
  X,
  Shield,
  Layers,
  History,
  Tag,
} from 'lucide-react';
import { recommendationClient } from '../../services/recommendationClient';
import { UserPersonalizationProfile } from '../../types/recommendations';

interface PersonalizationPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPreferencesUpdated: () => void;
}

const PRESET_INTERESTS = [
  'Robotics & Automation',
  'AI Workstations',
  'Edge Computing & IoT',
  'Metrology & 3D Scanning',
  'Enterprise Networking & 100GbE',
  'Mission-Critical Warranty & Support',
  'Ruggedized Field Hardware',
  'Factory 4.0 Collaborative Cobots',
  'High-Speed Thunderbolt Hubs',
];

export const PersonalizationPreferencesModal: React.FC<PersonalizationPreferencesModalProps> = ({
  isOpen,
  onClose,
  onPreferencesUpdated,
}) => {
  const [profile, setProfile] = useState<UserPersonalizationProfile | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState('');
  const [saving, setSaving] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadProfile();
    }
  }, [isOpen]);

  const loadProfile = async () => {
    const prof = await recommendationClient.getUserProfile();
    if (prof) {
      setProfile(prof);
      setSelectedInterests(prof.explicitInterests || []);
    }
  };

  if (!isOpen) return null;

  const handleToggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleAddCustomInterest = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customInterest.trim();
    if (trimmed && !selectedInterests.includes(trimmed)) {
      setSelectedInterests([...selectedInterests, trimmed]);
      setCustomInterest('');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    await recommendationClient.updateExplicitInterests(selectedInterests);
    setSaving(false);
    setNotification('Personalization preferences updated!');
    onPreferencesUpdated();
    setTimeout(() => {
      setNotification(null);
      onClose();
    }, 1200);
  };

  const handleClearHistory = async () => {
    if (!window.confirm('Clear your browsing history and recommendation affinities?')) return;
    setClearing(true);
    await recommendationClient.clearHistory();
    await loadProfile();
    setClearing(false);
    onPreferencesUpdated();
    setNotification('Browsing history and interaction affinities reset.');
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-[#febd69] to-amber-600 rounded-xl text-slate-950 font-bold shadow">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center space-x-2">
                <span>Personalization & Interest Preferences</span>
                <span className="bg-[#febd69]/20 text-[#febd69] text-[10px] font-mono px-2 py-0.5 rounded-full border border-[#febd69]/30">
                  Part 12 Engine
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Tune the multi-signal AI recommendation engine to align with your procurement priorities
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {notification && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-xl text-emerald-300 font-semibold flex items-center space-x-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{notification}</span>
            </div>
          )}

          {/* Section 1: Explicit Focus & Interests */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-white font-bold text-sm">
                <Tag className="w-4 h-4 text-[#febd69]" />
                <span>Explicit Enterprise Interests</span>
              </div>
              <span className="text-[11px] text-slate-400">
                {selectedInterests.length} selected
              </span>
            </div>
            <p className="text-slate-400 text-xs">
              Select or type the domains most relevant to your organization. The recommendation engine applies content similarity & vector ranking boosts for matching products.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {PRESET_INTERESTS.map((interest) => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleToggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition flex items-center space-x-1.5 ${
                      isSelected
                        ? 'bg-[#febd69] text-slate-950 border-[#febd69] shadow-md font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    <span>{interest}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Interest Input */}
            <form onSubmit={handleAddCustomInterest} className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Add custom keyword or interest (e.g. LiDAR calibration, 2.5GbE)..."
                value={customInterest}
                onChange={(e) => setCustomInterest(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#febd69]"
              />
              <button
                type="submit"
                disabled={!customInterest.trim()}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white rounded-xl font-bold flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </form>
          </div>

          {/* Section 2: Learned Affinities & Analytics */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="flex items-center space-x-2 text-white font-bold text-sm">
              <Layers className="w-4 h-4 text-sky-400" />
              <span>Learned Department & Brand Affinities</span>
            </div>
            <p className="text-slate-400 text-xs">
              Based on your session interactions (clicks, views, cart additions, and procurement inquiries):
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Category Affinities */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Top Categories</span>
                  <span className="text-slate-500 font-mono">Weight</span>
                </div>
                {profile?.categoryAffinities && Object.keys(profile.categoryAffinities).length > 0 ? (
                  Object.entries(profile.categoryAffinities)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 4)
                    .map(([cat, score]) => (
                      <div key={cat} className="space-y-1">
                        <div className="flex justify-between text-xs text-white">
                          <span className="capitalize">{cat}</span>
                          <span className="font-mono text-emerald-400">{score} pts</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5">
                          <div
                            className="bg-emerald-500 h-1.5 rounded-full"
                            style={{ width: `${Math.min(score * 10, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-slate-500 text-xs italic py-2">No category activity recorded yet.</div>
                )}
              </div>

              {/* Brand Affinities */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Top Vendors</span>
                  <span className="text-slate-500 font-mono">Weight</span>
                </div>
                {profile?.brandAffinities && Object.keys(profile.brandAffinities).length > 0 ? (
                  Object.entries(profile.brandAffinities)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 4)
                    .map(([brand, score]) => (
                      <div key={brand} className="space-y-1">
                        <div className="flex justify-between text-xs text-white">
                          <span className="truncate max-w-[140px]">{brand}</span>
                          <span className="font-mono text-amber-300">{score} pts</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5">
                          <div
                            className="bg-amber-400 h-1.5 rounded-full"
                            style={{ width: `${Math.min(score * 12, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-slate-500 text-xs italic py-2">No vendor interaction recorded yet.</div>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Privacy & Session Controls */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="flex items-center space-x-2 text-white font-bold text-sm">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Privacy & Session Reset</span>
            </div>
            <p className="text-slate-400 text-xs">
              Commerce Zon allows guest and registered procurement officers to fully reset browsing history, product view footprints, and learned affinities at any time.
            </p>
            <div className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-xl p-3.5">
              <div className="space-y-0.5">
                <div className="text-white font-bold text-xs flex items-center space-x-1.5">
                  <History className="w-3.5 h-3.5 text-slate-400" />
                  <span>Reset Browsing & Recommendation Profile</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Clears recently viewed items ({profile?.recentlyViewedIds?.length || 0}) and zero-outs interaction scores.
                </div>
              </div>
              <button
                type="button"
                onClick={handleClearHistory}
                disabled={clearing}
                className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-300 rounded-lg text-xs font-bold transition flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{clearing ? 'Clearing...' : 'Clear Footprint'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#febd69]" />
            <span>Changes immediately recalibrate your homepage & search feeds</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 bg-[#febd69] hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black shadow-lg transition flex items-center space-x-1.5"
            >
              {saving ? <Check className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              <span>{saving ? 'Saving...' : 'Apply Preferences'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
