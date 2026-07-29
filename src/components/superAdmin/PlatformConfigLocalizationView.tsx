import React, { useState } from 'react';
import { Settings, Globe, DollarSign, Clock, CheckCircle2, Save, Palette, Layers } from 'lucide-react';

export const PlatformConfigLocalizationView: React.FC = () => {
  const [marketplaceName, setMarketplaceName] = useState('Commerce Zone Global');
  const [logoUrl, setLogoUrl] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop');
  const [themeMode, setThemeMode] = useState<'Dark' | 'Light' | 'System Default'>('Dark');
  const [timeZone, setTimeZone] = useState('UTC / Greenwich Mean Time');
  const [defaultCurrency, setDefaultCurrency] = useState('USD ($)');
  const [dateFormat, setDateFormat] = useState('YYYY-MM-DD');
  const [enabledLanguages, setEnabledLanguages] = useState(['English (US)', 'Spanish (ES)', 'German (DE)', 'Japanese (JP)', 'French (FR)']);
  const [notification, setNotification] = useState<string | null>(null);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setNotification('Platform Configuration & Localization parameters updated & pushed to CDN cache!');
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <div className="space-y-6">
      {notification && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      <form onSubmit={handleSaveConfig} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Marketplace Identity & Theme */}
        <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-400" />
            Marketplace Identity & Global Branding
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Global Marketplace Name</label>
              <input
                type="text"
                value={marketplaceName}
                onChange={(e) => setMarketplaceName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Brand Logo Asset URL</label>
              <input
                type="text"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Default UI Color Palette Theme</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Dark', 'Light', 'System Default'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setThemeMode(t)}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      themeMode === t
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Regional & Currency Localization */}
        <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-400" />
            Internationalization (i18n) & Currency Config
          </h3>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Default System Time Zone</label>
                <select
                  value={timeZone}
                  onChange={(e) => setTimeZone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-mono"
                >
                  <option value="UTC / Greenwich Mean Time">UTC / Greenwich Mean Time</option>
                  <option value="EST / US Eastern Time">EST / US Eastern Time</option>
                  <option value="CET / Central European Time">CET / Central European Time</option>
                  <option value="JST / Japan Standard Time">JST / Japan Standard Time</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Base Platform Currency</label>
                <select
                  value={defaultCurrency}
                  onChange={(e) => setDefaultCurrency(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-mono"
                >
                  <option value="USD ($)">USD ($)</option>
                  <option value="EUR (€)">EUR (€)</option>
                  <option value="GBP (£)">GBP (£)</option>
                  <option value="JPY (¥)">JPY (¥)</option>
                  <option value="CAD ($)">CAD ($)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Supported Multi-Languages ({enabledLanguages.length})</label>
              <div className="flex flex-wrap gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono">
                {enabledLanguages.map((lang) => (
                  <span key={lang} className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-amber-400">
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl transition flex items-center justify-center space-x-2 text-xs shadow-lg"
            >
              <Save className="w-4 h-4" />
              <span>Save System Localization Parameters</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
