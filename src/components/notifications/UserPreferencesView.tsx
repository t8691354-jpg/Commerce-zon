import React, { useState } from 'react';
import { 
  Sliders, Moon, Bell, Mail, Smartphone, MessageSquare, Shield, Check, Save, RotateCcw, Clock, Volume2
} from 'lucide-react';
import { UserNotificationPreference, NotificationRole, NotificationChannel } from '../../types/notifications';
import { ROLE_CATEGORIES } from '../../data/mockNotificationsData';

interface Props {
  preferences: UserNotificationPreference;
  onSavePreferences: (prefs: UserNotificationPreference) => void;
}

export const UserPreferencesView: React.FC<Props> = ({ preferences, onSavePreferences }) => {
  const [selectedRole, setSelectedRole] = useState<NotificationRole>(preferences.role);
  const [quietEnabled, setQuietEnabled] = useState(preferences.quietHours.enabled);
  const [startTime, setStartTime] = useState(preferences.quietHours.startTime);
  const [endTime, setEndTime] = useState(preferences.quietHours.endTime);
  const [timezone, setTimezone] = useState(preferences.quietHours.timezone);
  const [channels, setChannels] = useState<Record<NotificationChannel, boolean>>(preferences.channels);
  const [categories, setCategories] = useState(preferences.categories);
  const [marketingOptIn, setMarketingOptIn] = useState(preferences.marketingOptIn);
  const [frequencyCap, setFrequencyCap] = useState(preferences.frequencyCapPerDay);

  const toggleChannel = (ch: NotificationChannel) => {
    setChannels(prev => ({ ...prev, [ch]: !prev[ch] }));
  };

  const handleSave = () => {
    const updated: UserNotificationPreference = {
      ...preferences,
      role: selectedRole,
      quietHours: {
        enabled: quietEnabled,
        startTime,
        endTime,
        timezone
      },
      channels,
      categories,
      marketingOptIn,
      frequencyCapPerDay: frequencyCap
    };
    onSavePreferences(updated);
    alert('User notification preferences & quiet hours updated!');
  };

  const categoriesForRole = ROLE_CATEGORIES[selectedRole] || [];

  return (
    <div className="space-y-6">
      {/* Role Profile Switcher Banner */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Granular User Notification Preferences</h2>
            <p className="text-xs text-slate-400">Manage quiet hours, channel opt-ins, category frequency caps per role</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <label className="text-xs text-slate-300 font-bold">Preview Preferences For Role:</label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as NotificationRole)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-bold text-amber-400 focus:outline-none"
          >
            <option value="Buyer">Buyer Profile (Alexander Wright)</option>
            <option value="Seller">Seller Profile (Apex Audio Ltd)</option>
            <option value="Affiliate">Affiliate Profile (TechReviews)</option>
            <option value="Supplier">Supplier Profile (SZ Microchip)</option>
            <option value="Warehouse">Warehouse Staff (ONT8)</option>
            <option value="DeliveryPartner">Delivery Partner (#440)</option>
            <option value="Administrator">Administrator (SecOps)</option>
          </select>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition flex items-center space-x-1.5 shadow"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Quiet Hours & Channel Rules */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quiet Hours Panel */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Moon className="w-4 h-4 text-purple-400" />
                <span>Quiet Hours Schedule</span>
              </h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={quietEnabled}
                  onChange={(e) => setQuietEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-500"></div>
              </label>
            </div>

            <div className={`space-y-3 ${!quietEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Silence Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Resume Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">User Timezone</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                >
                  <option value="PST">Pacific Time (PST / UTC-8)</option>
                  <option value="EST">Eastern Time (EST / UTC-5)</option>
                  <option value="UTC">Coordinated Universal Time (UTC)</option>
                  <option value="GMT">Greenwich Mean Time (GMT)</option>
                  <option value="JST">Japan Standard Time (JST / UTC+9)</option>
                </select>
              </div>

              <p className="text-[11px] text-purple-300/80 bg-purple-500/10 p-2 rounded border border-purple-500/20">
                During Quiet Hours, non-critical push & SMS notifications are queued and dispatched at {endTime}. Critical security alerts bypass quiet hours.
              </p>
            </div>
          </div>

          {/* Master Channel Toggles & Daily Cap */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 pb-3 border-b border-slate-800">
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span>Channel Opt-Ins & Frequency Capping</span>
            </h3>

            <div className="space-y-2.5">
              {(Object.keys(channels) as NotificationChannel[]).map((ch) => (
                <div key={ch} className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-xs font-bold text-slate-200 uppercase">{ch.replace('_', ' ')}</span>
                  <input
                    type="checkbox"
                    checked={channels[ch]}
                    onChange={() => toggleChannel(ch)}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-bold">Max Daily Notification Limit:</span>
                <span className="text-amber-400 font-bold">{frequencyCap} msgs / day</span>
              </div>
              <input
                type="range"
                min={2}
                max={30}
                value={frequencyCap}
                onChange={(e) => setFrequencyCap(Number(e.target.value))}
                className="w-full accent-amber-500"
              />

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-300 font-semibold">Marketing & Promotional Opt-In:</span>
                <input
                  type="checkbox"
                  checked={marketingOptIn}
                  onChange={(e) => setMarketingOptIn(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Category-Level Preferences Matrix */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">Category Delivery Matrix ({selectedRole})</h3>
              <p className="text-xs text-slate-400">Configure exact channel delivery preferences per category</p>
            </div>
            <span className="text-xs font-mono text-amber-400">{categoriesForRole.length} Categories</span>
          </div>

          <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
            {categoriesForRole.map((cat) => {
              const currentCat = categories[cat] || { email: true, sms: true, push: true, in_app: true };

              return (
                <div key={cat} className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-white">{cat}</div>
                    <div className="text-[10px] text-slate-500">Event category for {selectedRole}</div>
                  </div>

                  <div className="flex items-center space-x-3 text-xs">
                    <label className="flex items-center space-x-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentCat.email}
                        onChange={(e) => {
                          setCategories(prev => ({
                            ...prev,
                            [cat]: { ...currentCat, email: e.target.checked }
                          }));
                        }}
                        className="accent-amber-500 rounded"
                      />
                      <span className="text-slate-300 text-[11px]">Email</span>
                    </label>

                    <label className="flex items-center space-x-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentCat.sms}
                        onChange={(e) => {
                          setCategories(prev => ({
                            ...prev,
                            [cat]: { ...currentCat, sms: e.target.checked }
                          }));
                        }}
                        className="accent-amber-500 rounded"
                      />
                      <span className="text-slate-300 text-[11px]">SMS</span>
                    </label>

                    <label className="flex items-center space-x-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentCat.push}
                        onChange={(e) => {
                          setCategories(prev => ({
                            ...prev,
                            [cat]: { ...currentCat, push: e.target.checked }
                          }));
                        }}
                        className="accent-amber-500 rounded"
                      />
                      <span className="text-slate-300 text-[11px]">Push</span>
                    </label>

                    <label className="flex items-center space-x-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentCat.in_app}
                        onChange={(e) => {
                          setCategories(prev => ({
                            ...prev,
                            [cat]: { ...currentCat, in_app: e.target.checked }
                          }));
                        }}
                        className="accent-amber-500 rounded"
                      />
                      <span className="text-slate-300 text-[11px]">In-App</span>
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
