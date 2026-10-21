import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  CreditCard,
  Truck,
  Globe,
  Mail,
  MessageSquare,
  Bell,
  Lock,
  Cpu,
  BarChart3,
  HardDrive,
  Key,
  Database,
  Wrench,
  Palette,
  Flag,
  FileText,
  Terminal,
  Save,
  CheckCircle2,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import { useI18n } from '../../i18n/I18nContext';

export const UniversalSettingsCenter: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('general');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const categories = [
    { id: 'general', label: 'General', icon: Settings, desc: 'Marketplace name, timezone & contact info' },
    { id: 'marketplace', label: 'Marketplace Rules', icon: Globe, desc: 'Commission rates, payouts & seller rules' },
    { id: 'users', label: 'User Roles & IAM', icon: ShieldCheck, desc: 'Role permissions, MFA & session policy' },
    { id: 'payments', label: 'Payments & Gateways', icon: CreditCard, desc: 'Stripe, PayPal, Crypto & Apple Pay' },
    { id: 'wallet', label: 'Commerce Zone Pay', icon: CreditCard, desc: 'Ledger rules, virtual cards & limits' },
    { id: 'shipping', label: 'Shipping & Logistics', icon: Truck, desc: 'FBA, DHL, FedEx & carrier APIs' },
    { id: 'taxes', label: 'Taxes & Compliance', icon: FileText, desc: 'VAT, Sales Tax & TaxJar integration' },
    { id: 'languages', label: 'Languages & Locales', icon: Globe, desc: 'i18n translations & currency conversion' },
    { id: 'communications', label: 'Email & SMS', icon: Mail, desc: 'SendGrid, Twilio & SMTP relays' },
    { id: 'security', label: 'Security & Auth', icon: Lock, desc: 'OAuth 2.0, Passkeys & IP Whitelists' },
    { id: 'ai', label: 'AI Engine Settings', icon: Cpu, desc: 'Gemini 2.5 Flash, temperature & search index' },
    { id: 'analytics', label: 'Analytics & Tracking', icon: BarChart3, desc: 'Google Analytics, Mixpanel & Webhooks' },
    { id: 'storage', label: 'Storage & S3 CDN', icon: HardDrive, desc: 'AWS S3, Cloudflare R2 & image compression' },
    { id: 'api_keys', label: 'API Keys & Secrets', icon: Key, desc: 'Secret keys, environment tokens & rate limits' },
    { id: 'backup', label: 'Backup & Snapshots', icon: Database, desc: 'Automated DB backups & point-in-time restore' },
    { id: 'feature_flags', label: 'Feature Flags', icon: Flag, desc: 'Canary deployments, beta toggles & A/B tests' },
    { id: 'developer', label: 'Developer & Logs', icon: Terminal, desc: 'Developer sandbox, GraphQL & OpenAPI specs' },
  ];

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="p-6 bg-slate-950 text-slate-100 min-h-screen space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl">
            <Settings className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-100 tracking-tight">Universal System Settings Center</h1>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Centralized platform configuration manager • All 20 marketplace modules synchronized
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveCategory('general')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-mono transition flex items-center space-x-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition flex items-center space-x-2 shadow-lg shadow-amber-500/10"
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-slate-950" />
                <span>Configuration Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Settings</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Category Navigation Sidebar */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-3 space-y-1 max-h-[750px] overflow-y-auto">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full text-left p-3 rounded-2xl transition flex items-center space-x-3 ${
                  isActive
                    ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                <div>
                  <div className="text-xs font-semibold">{cat.label}</div>
                  <div className="text-[10px] text-slate-500 font-mono truncate max-w-[180px]">{cat.desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Settings Configuration Content Panel */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-100 capitalize">
                {categories.find((c) => c.id === activeCategory)?.label} Configuration
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {categories.find((c) => c.id === activeCategory)?.desc}
              </p>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full">
              LIVE SYSTEM STATE
            </span>
          </div>

          {/* Form Fields based on Category */}
          <div className="space-y-5 text-xs font-mono">
            {activeCategory === 'general' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 block mb-1">Marketplace Platform Name</label>
                    <input
                      type="text"
                      defaultValue="Commerce Zone Enterprise Marketplace"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Support Contact Email</label>
                    <input
                      type="email"
                      defaultValue="support@commercezone.enterprise"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-slate-400 block mb-1">System Timezone</label>
                    <select className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-amber-500 focus:outline-none">
                      <option>UTC (Coordinated Universal Time)</option>
                      <option>US/Pacific (PST/PDT)</option>
                      <option>Europe/London (GMT/BST)</option>
                      <option>Asia/Tokyo (JST)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Primary Base Currency</label>
                    <select className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-amber-500 focus:outline-none">
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                      <option>JPY (¥)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Environment Mode</label>
                    <select className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-amber-400 font-bold focus:border-amber-500 focus:outline-none">
                      <option>PRODUCTION (LIVE)</option>
                      <option>STAGING / SANDBOX</option>
                      <option>MAINTENANCE MODE</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeCategory === 'marketplace' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 block mb-1">Default Platform Commission Rate (%)</label>
                    <input
                      type="number"
                      defaultValue="8.5"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Seller Holdback Period (Days)</label>
                    <input
                      type="number"
                      defaultValue="7"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                  <div className="font-bold text-slate-200">Automated Seller Verification</div>
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-900" />
                    <span className="text-slate-400">Require Tax ID & Business Registration for Enterprise Tier</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-900" />
                    <span className="text-slate-400">Auto-approve products from Verified Merchants</span>
                  </div>
                </div>
              </div>
            )}

            {activeCategory === 'ai' && (
              <div className="space-y-4">
                <div>
                  <label className="text-slate-400 block mb-1">Primary LLM Orchestrator</label>
                  <input
                    type="text"
                    disabled
                    value="Gemini 2.5 Flash / Pro (Server-Side Managed via @google/genai)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-amber-400 font-bold opacity-80"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 block mb-1">Semantic Vector Index Refresh Rate</label>
                    <select className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200">
                      <option>Real-time (Stream Event Triggered)</option>
                      <option>Every 15 minutes</option>
                      <option>Hourly batch</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">AI Personalization Reranking</label>
                    <select className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200">
                      <option>Enabled (Hybrid Neural + BM25)</option>
                      <option>Disabled (Standard Keyword Match)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeCategory === 'feature_flags' && (
              <div className="space-y-3">
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl mb-3">
                  <div className="text-xs font-bold text-amber-300">Commerce Zone Multi-Marketplace Control Flags</div>
                  <div className="text-[11px] text-slate-400">Enable or disable any of the 4 independent marketplace sectors platform-wide in real time.</div>
                </div>
                {[
                  { title: '1. Physical Goods & FBA Marketplace', state: true, tag: 'CORE ACTIVE', desc: 'Warehouses, inventory barcodes, carrier shipping, RMA returns' },
                  { title: '2. Digital Software & License Marketplace', state: true, tag: 'ACTIVE LIVE', desc: 'Instant-delivery code, SaaS kits, cryptographic keys, asset vault' },
                  { title: '3. Freelancer & Talent Escrow Marketplace', state: true, tag: 'ACTIVE LIVE', desc: 'Milestone escrow contracts, proposal bidding, talent directory' },
                  { title: '4. Autonomous AI Agent Marketplace', state: false, tag: 'CANARY PREVIEW', desc: 'Autonomous AI agents, prompt libraries, inference token billing' },
                  { title: 'Module 20 Super Admin Control Panel', state: true, tag: 'RELEASED', desc: 'Platform-wide rule enforcement and executive overrides' },
                  { title: 'Commerce Zone Pay Virtual Card Issuing', state: true, tag: 'STABLE', desc: 'Virtual debit card issuing with merchant cashback' },
                  { title: 'AI Neural Fraud Detection Engine', state: true, tag: 'ACTIVE', desc: 'Continuous fraud risk scoring on orders & payouts' },
                  { title: 'FBA Multi-Region Cross-Docking', state: true, tag: 'BETA', desc: 'Dynamic fulfillment route balancing' },
                ].map((flag, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-200 font-bold">{flag.title}</span>
                        <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-amber-400 rounded font-mono font-bold">
                          {flag.tag}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500">{flag.desc}</p>
                    </div>
                    <input type="checkbox" defaultChecked={flag.state} className="w-4 h-4 accent-amber-500" />
                  </div>
                ))}
              </div>
            )}

            {activeCategory === 'languages' && (
              <div className="space-y-6">
                <div className="bg-slate-950 p-4 border border-slate-800 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-black text-white text-sm flex items-center gap-2">
                        <Globe className="w-4 h-4 text-amber-400" />
                        <span>Part 16: Internationalization & Regional Localization Engine</span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Configure system-wide default language, RTL layout toggling, and multi-currency exchange rates.
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full text-xs font-mono font-bold">
                      i18n Active
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="text-slate-400 font-bold block mb-1">Default Platform Language</label>
                      <select className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200">
                        <option value="en">English (US) [LTR]</option>
                        <option value="ur">اردو (Urdu) [RTL]</option>
                        <option value="ar">العربية (Arabic) [RTL]</option>
                        <option value="es">Español [LTR]</option>
                        <option value="de">Deutsch [LTR]</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-400 font-bold block mb-1">Default Base Currency</label>
                      <select className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200">
                        <option value="USD">USD ($) — US Dollar (Base)</option>
                        <option value="PKR">PKR (Rs) — Pakistani Rupee</option>
                        <option value="GBP">GBP (£) — British Pound</option>
                        <option value="EUR">EUR (€) — Euro</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-400 font-bold block mb-1">Default Shipping Country</label>
                      <select className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200">
                        <option value="US">🇺🇸 United States</option>
                        <option value="PK">🇵🇰 Pakistan</option>
                        <option value="GB">🇬🇧 United Kingdom</option>
                        <option value="DE">🇩🇪 Germany</option>
                        <option value="AE">🇦🇪 United Arab Emirates</option>
                        <option value="SA">🇸🇦 Saudi Arabia</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Central Treasury Exchange Rates Panel */}
                <div className="bg-slate-950 p-4 border border-slate-800 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-black text-white text-sm flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        <span>Central Treasury Exchange Rates & Manual Overrides</span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Authoritative exchange rates applied across all currency estimate displays.
                      </p>
                    </div>
                    <span className="text-xs font-mono text-slate-400">
                      Base: <strong className="text-[#febd69]">$1.00 USD</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                    {[
                      { code: 'PKR', symbol: 'Rs', name: 'Pakistani Rupee', rate: 278.50 },
                      { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.79 },
                      { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92 },
                      { code: 'AED', symbol: 'AED', name: 'UAE Dirham', rate: 3.67 },
                      { code: 'SAR', symbol: 'SAR', name: 'Saudi Riyal', rate: 3.75 },
                      { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rate: 1.38 },
                      { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 1.54 },
                      { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1.00 },
                    ].map((c) => (
                      <div key={c.code} className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                        <div className="flex justify-between text-slate-300 font-bold">
                          <span>{c.code} ({c.symbol})</span>
                          <span className="text-[10px] text-emerald-400 font-normal">Active</span>
                        </div>
                        <input
                          type="number"
                          step="0.01"
                          defaultValue={c.rate}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-white font-mono font-bold text-xs"
                        />
                        <div className="text-[10px] text-slate-500 font-sans">{c.name}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Regional Compliance & RTL Rules */}
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 text-xs">
                  <h4 className="font-bold text-slate-200">Internationalization Safeguards</h4>
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-900" />
                    <span className="text-slate-300">
                      Preserve original seller listing currency during cross-border checkout (prevent silent price mutations)
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-900" />
                    <span className="text-slate-300">
                      Dynamically activate right-to-left (RTL) document direction for Urdu (ur) and Arabic (ar)
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-900" />
                    <span className="text-slate-300">
                      Automatic fallback to English dictionary for untranslated seller titles or third-party descriptions
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Default Placeholder for other categories */}
            {!['general', 'marketplace', 'ai', 'feature_flags', 'languages'].includes(activeCategory) && (
              <div className="p-8 border border-dashed border-slate-800 rounded-2xl text-center space-y-3">
                <Settings className="w-8 h-8 text-amber-400 mx-auto" />
                <div className="text-slate-200 font-bold capitalize">{activeCategory} Configuration Engine</div>
                <p className="text-slate-400 text-xs max-w-md mx-auto">
                  All active parameters for {activeCategory} are synchronized across all 20 marketplace modules. Adjust settings above and click Save.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
