import React, { useState } from 'react';
import { 
  FileText, Code, Smartphone, Monitor, Plus, Copy, RotateCcw, Save, 
  Eye, Check, History, Globe, Sparkles, Layers, Tag
} from 'lucide-react';
import { NotificationTemplate, NotificationRole, NotificationChannel } from '../../types/notifications';
import { ROLE_CATEGORIES } from '../../data/mockNotificationsData';

interface Props {
  templates: NotificationTemplate[];
  onSaveTemplate: (template: NotificationTemplate) => void;
}

export const TemplateManager: React.FC<Props> = ({ templates, onSaveTemplate }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate>(templates[0]);
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'history'>('editor');
  const [showVersionModal, setShowVersionModal] = useState<boolean>(false);

  // Form State
  const [name, setName] = useState(selectedTemplate.name);
  const [role, setRole] = useState<NotificationRole>(selectedTemplate.role);
  const [category, setCategory] = useState(selectedTemplate.category);
  const [channel, setChannel] = useState<NotificationChannel>(selectedTemplate.channel);
  const [subject, setSubject] = useState(selectedTemplate.subject || '');
  const [bodyText, setBodyText] = useState(selectedTemplate.bodyText);
  const [bodyHtml, setBodyHtml] = useState(selectedTemplate.bodyHtml || '');
  const [language, setLanguage] = useState(selectedTemplate.language);

  const availableVariables = [
    'user_name',
    'order_id',
    'product_name',
    'carrier',
    'tracking_number',
    'estimated_delivery',
    'amount',
    'units_left',
    'commission_amount',
    'wallet_balance',
    'store_name'
  ];

  const handleSelectTemplate = (tpl: NotificationTemplate) => {
    setSelectedTemplate(tpl);
    setName(tpl.name);
    setRole(tpl.role);
    setCategory(tpl.category);
    setChannel(tpl.channel);
    setSubject(tpl.subject || '');
    setBodyText(tpl.bodyText);
    setBodyHtml(tpl.bodyHtml || '');
    setLanguage(tpl.language);
  };

  const handleInsertVariable = (varName: string) => {
    const varTag = `{{${varName}}}`;
    if (channel === 'email' && bodyHtml) {
      setBodyHtml(prev => prev + ' ' + varTag);
    } else {
      setBodyText(prev => prev + ' ' + varTag);
    }
  };

  const handleSave = () => {
    const newVersion = selectedTemplate.version + 1;
    const updatedHistory = [
      ...(selectedTemplate.history || []),
      {
        version: selectedTemplate.version,
        updatedAt: selectedTemplate.updatedAt,
        updatedBy: selectedTemplate.updatedBy,
        changesSummary: `Updated template content & variables (v${newVersion})`
      }
    ];

    const updatedTpl: NotificationTemplate = {
      ...selectedTemplate,
      name,
      role,
      category,
      channel,
      subject,
      bodyText,
      bodyHtml,
      language,
      version: newVersion,
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      updatedBy: 'Admin Engineer',
      history: updatedHistory
    };

    onSaveTemplate(updatedTpl);
    setSelectedTemplate(updatedTpl);
    alert(`Template "${name}" saved successfully as version v${newVersion}!`);
  };

  // Compile preview text with sample variable replacement
  const compileSamplePreview = (text: string) => {
    if (!text) return '';
    return text
      .replace(/\{\{user_name\}\}/g, 'Alexander Wright')
      .replace(/\{\{order_id\}\}/g, 'AMZ-99201')
      .replace(/\{\{product_name\}\}/g, 'Studio Monitor Headphones')
      .replace(/\{\{carrier\}\}/g, 'Amazon Logistics')
      .replace(/\{\{tracking_number\}\}/g, 'TBA9821039821')
      .replace(/\{\{estimated_delivery\}\}/g, 'Tomorrow, Jul 29')
      .replace(/\{\{amount\}\}/g, '$149.99')
      .replace(/\{\{units_left\}\}/g, '12')
      .replace(/\{\{commission_amount\}\}/g, '$142.80')
      .replace(/\{\{wallet_balance\}\}/g, '$1,850.00')
      .replace(/\{\{store_name\}\}/g, 'Apex Audio Direct');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar: Template Directory */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Template Library</span>
              </h3>
              <p className="text-xs text-slate-400">Multi-channel message templates</p>
            </div>

            <button
              onClick={() => {
                const newTpl: NotificationTemplate = {
                  id: `TPL-NEW-${Date.now()}`,
                  name: 'New Custom Template',
                  role: 'Buyer',
                  category: 'New Order',
                  channel: 'email',
                  subject: 'Notice regarding your account #{{user_name}}',
                  bodyText: 'Hello {{user_name}}, welcome to our marketplace.',
                  variables: ['user_name'],
                  language: 'en-US',
                  version: 1,
                  updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
                  updatedBy: 'Admin'
                };
                onSaveTemplate(newTpl);
                handleSelectTemplate(newTpl);
              }}
              className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 text-xs font-bold flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create</span>
            </button>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                onClick={() => handleSelectTemplate(tpl)}
                className={`p-3 rounded-lg border cursor-pointer transition ${
                  selectedTemplate.id === tpl.id
                    ? 'bg-amber-500/10 border-amber-500/50 shadow-md'
                    : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white truncate max-w-[180px]">{tpl.name}</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-800 text-amber-400 border border-slate-700 uppercase">
                    {tpl.channel}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                  <span>Role: <strong className="text-slate-300">{tpl.role}</strong></span>
                  <span>•</span>
                  <span>v{tpl.version}</span>
                  <span>•</span>
                  <span className="text-slate-500">{tpl.language}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section: Editor & Live Preview Panel */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <span className="px-2.5 py-1 rounded text-xs font-black bg-amber-500 text-slate-950">
                v{selectedTemplate.version}
              </span>
              <div>
                <h2 className="text-base font-bold text-white">{selectedTemplate.name}</h2>
                <p className="text-xs text-slate-400 font-mono">ID: {selectedTemplate.id}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
                <button
                  onClick={() => setActiveTab('editor')}
                  className={`px-3 py-1 rounded text-xs font-bold transition flex items-center space-x-1 ${
                    activeTab === 'editor' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>Editor</span>
                </button>
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1 rounded text-xs font-bold transition flex items-center space-x-1 ${
                    activeTab === 'preview' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-3 py-1 rounded text-xs font-bold transition flex items-center space-x-1 ${
                    activeTab === 'history' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  <span>History</span>
                </button>
              </div>

              <button
                onClick={handleSave}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-black text-xs hover:bg-emerald-400 transition flex items-center space-x-1.5 shadow"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Template</span>
              </button>
            </div>
          </div>

          {activeTab === 'editor' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Target Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as NotificationRole)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  >
                    <option value="Buyer">Buyer</option>
                    <option value="Seller">Seller</option>
                    <option value="Affiliate">Affiliate</option>
                    <option value="Supplier">Supplier</option>
                    <option value="Warehouse">Warehouse</option>
                    <option value="DeliveryPartner">DeliveryPartner</option>
                    <option value="Administrator">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Channel</label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value as NotificationChannel)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white uppercase font-mono"
                  >
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="push_android">Android Push</option>
                    <option value="push_ios">iOS Push</option>
                    <option value="in_app">In-App</option>
                    <option value="whatsapp">WhatsApp</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  >
                    {ROLE_CATEGORIES[role]?.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  >
                    <option value="en-US">English (US)</option>
                    <option value="es-ES">Spanish (ES)</option>
                    <option value="de-DE">German (DE)</option>
                    <option value="fr-FR">French (FR)</option>
                    <option value="ja-JP">Japanese (JA)</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Variables Chips */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Insert Dynamic Variables</span>
                  <span className="text-[10px] text-slate-500">Click variable tag to insert into editor</span>
                </label>
                <div className="flex flex-wrap gap-1.5 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  {availableVariables.map(v => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => handleInsertVariable(v)}
                      className="px-2 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[11px] font-mono flex items-center space-x-1"
                    >
                      <Tag className="w-3 h-3" />
                      <span>{`{{${v}}}`}</span>
                    </button>
                  ))}
                </div>
              </div>

              {(channel === 'email' || channel.includes('push')) && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Subject Line / Push Headline</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-medium"
                  />
                </div>
              )}

              {channel === 'email' ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">HTML Email Template Source</label>
                  <textarea
                    rows={10}
                    value={bodyHtml}
                    onChange={(e) => setBodyHtml(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-amber-200 font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Plain Text Body</label>
                  <textarea
                    rows={6}
                    value={bodyText}
                    onChange={(e) => setBodyText(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-950 p-2 rounded-lg border border-slate-800">
                <span className="text-xs text-slate-400 font-medium">Device Simulation:</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPreviewDevice('mobile')}
                    className={`px-3 py-1 rounded text-xs font-bold flex items-center space-x-1 ${
                      previewDevice === 'mobile' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Mobile Device</span>
                  </button>
                  <button
                    onClick={() => setPreviewDevice('desktop')}
                    className={`px-3 py-1 rounded text-xs font-bold flex items-center space-x-1 ${
                      previewDevice === 'desktop' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>Desktop Client</span>
                  </button>
                </div>
              </div>

              {previewDevice === 'mobile' ? (
                <div className="flex justify-center py-4">
                  <div className="w-[320px] bg-slate-950 rounded-[32px] border-4 border-slate-700 p-4 shadow-2xl space-y-3">
                    <div className="w-20 h-1.5 bg-slate-700 rounded-full mx-auto mb-2" />
                    <div className="bg-slate-900 rounded-xl p-3 border border-amber-500/40 shadow-lg space-y-2">
                      <div className="flex items-center justify-between text-[10px] text-amber-400 font-bold uppercase">
                        <span>{channel}</span>
                        <span>Now</span>
                      </div>
                      <div className="text-xs font-bold text-white">
                        {compileSamplePreview(subject || selectedTemplate.name)}
                      </div>
                      <div className="text-xs text-slate-300 leading-relaxed">
                        {compileSamplePreview(bodyText)}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-3">
                  <div className="border-b border-slate-800 pb-2 text-xs text-slate-400 space-y-1">
                    <div><strong>From:</strong> Amazon Marketplace Notifications &lt;no-reply@amazon-marketplace.com&gt;</div>
                    <div><strong>Subject:</strong> {compileSamplePreview(subject || 'Notification Notice')}</div>
                  </div>
                  {channel === 'email' && bodyHtml ? (
                    <div 
                      className="p-4 bg-slate-900 rounded-lg text-xs"
                      dangerouslySetInnerHTML={{ __html: compileSamplePreview(bodyHtml) }}
                    />
                  ) : (
                    <div className="p-4 bg-slate-900 rounded-lg text-xs text-slate-200 whitespace-pre-wrap">
                      {compileSamplePreview(bodyText)}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Template Version Lineage</h3>
              {(!selectedTemplate.history || selectedTemplate.history.length === 0) ? (
                <div className="p-6 text-center text-xs text-slate-500 bg-slate-950 rounded-lg border border-slate-800">
                  No previous version history saved for this template yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedTemplate.history.map((hist) => (
                    <div key={hist.version} className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            Version v{hist.version}
                          </span>
                          <span className="text-xs font-bold text-white">{hist.changesSummary}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1">
                          Updated at {hist.updatedAt} by {hist.updatedBy}
                        </div>
                      </div>

                      <button
                        onClick={() => alert(`Restored template to version v${hist.version}`)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold text-amber-400 border border-slate-700 flex items-center space-x-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Restore</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
