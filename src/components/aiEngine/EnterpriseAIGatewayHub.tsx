import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Zap,
  Activity,
  Layers,
  ShieldCheck,
  DollarSign,
  Database,
  Terminal,
  RefreshCw,
  Send,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Flame,
  BrainCircuit,
  Wrench,
  BarChart3,
  Copy,
  Clock,
  Radio,
  FileCode,
} from 'lucide-react';
import { AICompletionResponse, AIModelSpec, ProviderHealthStatus, PromptTemplate } from '../../domain/ai/AITypes';

export const EnterpriseAIGatewayHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'playground' | 'models' | 'health' | 'prompts' | 'tools' | 'analytics'>('playground');

  // Playground state
  const [prompt, setPrompt] = useState('Analyze marketplace competitive positioning for high-end noise canceling wireless earbuds under $250.');
  const [systemPrompt, setSystemPrompt] = useState('You are Commerce Zon Enterprise AI Marketplace Specialist.');
  const [selectedProvider, setSelectedProvider] = useState<string>('google_gemini');
  const [selectedModel, setSelectedModel] = useState<string>('gemini-2.5-flash');
  const [temperature, setTemperature] = useState<number>(0.7);
  const [enableCache, setEnableCache] = useState<boolean>(true);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [requestedTools, setRequestedTools] = useState<string[]>(['marketplace_competitor_search']);

  const [loading, setLoading] = useState<boolean>(false);
  const [aiResponse, setAiResponse] = useState<AICompletionResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Data lists
  const [modelsList, setModelsList] = useState<AIModelSpec[]>([]);
  const [healthStatus, setHealthStatus] = useState<ProviderHealthStatus[]>([]);
  const [promptTemplates, setPromptTemplates] = useState<PromptTemplate[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  // Fetch initial system data
  const fetchGatewayData = async () => {
    try {
      const [mRes, hRes, tRes, aRes] = await Promise.all([
        fetch('/api/ai/gateway/models'),
        fetch('/api/ai/gateway/health'),
        fetch('/api/ai/gateway/templates'),
        fetch('/api/ai/gateway/analytics'),
      ]);

      if (mRes.ok) {
        const data = await mRes.json();
        setModelsList(data.models || []);
      }
      if (hRes.ok) {
        const data = await hRes.json();
        setHealthStatus(data.health || []);
      }
      if (tRes.ok) {
        const data = await tRes.json();
        setPromptTemplates(data.templates || []);
      }
      if (aRes.ok) {
        const data = await aRes.json();
        setAnalyticsData(data);
      }
    } catch (e) {
      console.error('Failed to load AI Gateway metadata', e);
    }
  };

  useEffect(() => {
    fetchGatewayData();
  }, []);

  // Execute Gateway Prompt
  const handleExecutePrompt = async () => {
    setLoading(true);
    setErrorMessage(null);
    setAiResponse(null);

    try {
      const res = await fetch('/api/ai/gateway/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          systemPrompt,
          providerId: selectedProvider,
          modelId: selectedModel,
          temperature,
          enableCache,
          templateId: selectedTemplate || undefined,
          templateVars: {
            userQuery: prompt,
            category: 'Audio & Wearables',
            budgetMax: 250,
            warehouseId: 'WH-US-EAST',
            currentStock: 500,
            dailyBurnRate: 25,
          },
          tools: requestedTools,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Failed to process AI Gateway query');
      }

      setAiResponse(data);
      fetchGatewayData(); // Refresh metrics
    } catch (err: any) {
      setErrorMessage(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-slate-100">
      {/* Header Banner */}
      <div className="bg-[#131921] border border-[#37475a] rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-amber-500/20 border border-amber-500/40 rounded-xl text-[#febd69]">
            <BrainCircuit className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#febd69] uppercase">
              <span>Enterprise AI Gateway</span>
              <span>•</span>
              <span className="text-emerald-400">Multi-Provider Orchestrator</span>
            </div>
            <h1 className="text-2xl font-black text-white mt-0.5">Amazon-Grade Multi-Model AI Platform</h1>
            <p className="text-xs text-slate-400 mt-1">
              Centralized AI Gateway with automatic failover across Gemini, OpenAI, Claude & DeepSeek with prompt engine and cost management.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-slate-900 border border-slate-800 p-3 rounded-xl text-xs font-mono">
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse shrink-0" />
          <div>
            <div className="text-slate-400">Active Routing Engine:</div>
            <div className="text-white font-bold">Zero-Downtime Multi-Model Failover</div>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 overflow-x-auto text-xs font-bold">
        {[
          { id: 'playground', label: 'AI Gateway Playground', icon: Terminal },
          { id: 'models', label: 'Multi-Provider Model Matrix', icon: Cpu },
          { id: 'health', label: 'Failover & Provider Health', icon: Activity },
          { id: 'prompts', label: 'Prompt Engine & Templates', icon: FileCode },
          { id: 'tools', label: 'AI Tool Execution Framework', icon: Wrench },
          { id: 'analytics', label: 'Token Analytics & Cost Budget', icon: BarChart3 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition whitespace-nowrap ${
                isActive
                  ? 'bg-[#febd69] text-slate-950 font-black shadow-lg'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: AI Gateway Playground */}
      {activeTab === 'playground' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl text-xs">
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Sliders className="w-4 h-4 text-[#febd69]" />
              <span>Gateway Configuration</span>
            </h3>

            {/* Provider Selection */}
            <div>
              <label className="block text-slate-300 font-bold mb-1">Target AI Provider</label>
              <select
                value={selectedProvider}
                onChange={(e) => {
                  setSelectedProvider(e.target.value);
                  const firstModel = modelsList.find((m) => m.providerId === e.target.value);
                  if (firstModel) setSelectedModel(firstModel.id);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono focus:border-[#febd69] focus:outline-none"
              >
                <option value="google_gemini">Google Gemini (Default)</option>
                <option value="openai">OpenAI GPT Series</option>
                <option value="anthropic_claude">Anthropic Claude</option>
                <option value="deepseek">DeepSeek R1 Reasoning</option>
                <option value="fallback">Local Deterministic Engine</option>
              </select>
            </div>

            {/* Model Selection */}
            <div>
              <label className="block text-slate-300 font-bold mb-1">Model Architecture</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono focus:border-[#febd69] focus:outline-none"
              >
                {modelsList
                  .filter((m) => m.providerId === selectedProvider)
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.category})
                    </option>
                  ))}
              </select>
            </div>

            {/* Prompt Template */}
            <div>
              <label className="block text-slate-300 font-bold mb-1">Prompt Engine Template (Optional)</label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono focus:border-[#febd69] focus:outline-none"
              >
                <option value="">No Template (Raw Query)</option>
                {promptTemplates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} (v{t.version})
                  </option>
                ))}
              </select>
            </div>

            {/* Temperature Slider */}
            <div>
              <div className="flex justify-between text-slate-300 font-bold mb-1">
                <span>Temperature (Creativity)</span>
                <span className="text-[#febd69] font-mono">{temperature}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-[#febd69]"
              />
            </div>

            {/* Cache Toggle */}
            <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div>
                <div className="text-white font-bold">Smart Response Cache</div>
                <div className="text-[10px] text-slate-400">5-minute LRU cache lookup</div>
              </div>
              <input
                type="checkbox"
                checked={enableCache}
                onChange={(e) => setEnableCache(e.target.checked)}
                className="w-4 h-4 accent-[#febd69]"
              />
            </div>

            {/* Tools Execution Toggle */}
            <div>
              <label className="block text-slate-300 font-bold mb-1">Attach Enterprise Tools</label>
              <div className="space-y-1.5 font-mono text-[11px]">
                {[
                  { id: 'marketplace_competitor_search', label: 'Buy-Box Competitor Search' },
                  { id: 'fba_inventory_reorder_calculator', label: 'FBA Inventory Reorder Calculator' },
                  { id: 'product_catalog_generator', label: 'Product Catalog Synthesizer' },
                ].map((t) => (
                  <label key={t.id} className="flex items-center space-x-2 text-slate-300 bg-slate-950 p-2 rounded border border-slate-800">
                    <input
                      type="checkbox"
                      checked={requestedTools.includes(t.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setRequestedTools([...requestedTools, t.id]);
                        } else {
                          setRequestedTools(requestedTools.filter((x) => x !== t.id));
                        }
                      }}
                      className="accent-[#febd69]"
                    />
                    <span>{t.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Execution & Output */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-black text-white uppercase tracking-wider">Gateway Prompt Execution</h2>
              <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 px-2.5 py-1 rounded border border-emerald-500/30">
                Unified Gateway Active
              </span>
            </div>

            {/* Prompt Input */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 font-bold mb-1">System Context Protocol</label>
                <input
                  type="text"
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 font-mono focus:border-[#febd69] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-bold mb-1">User Query / Prompt</label>
                <textarea
                  rows={4}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-white font-mono focus:border-[#febd69] focus:outline-none"
                />
              </div>

              <button
                onClick={handleExecutePrompt}
                disabled={loading}
                className="w-full py-3.5 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black text-xs rounded-xl transition shadow-lg flex items-center justify-center space-x-2"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Process via Central AI Gateway</span>
              </button>
            </div>

            {/* Error Display */}
            {errorMessage && (
              <div className="p-4 bg-rose-950/80 border border-rose-500/50 rounded-xl text-rose-300 text-xs flex items-center space-x-2 font-mono">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Output Display */}
            {aiResponse && (
              <div className="space-y-4 pt-4 border-t border-slate-800 font-mono text-xs">
                {/* Metrics Header */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Provider / Model</div>
                    <div className="text-emerald-400 font-bold">{aiResponse.providerId} / {aiResponse.modelId}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Latency</div>
                    <div className="text-white font-bold">{aiResponse.latencyMs} ms {aiResponse.cached ? '(Cached)' : ''}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Tokens Processed</div>
                    <div className="text-[#febd69] font-bold">{aiResponse.usage.totalTokens} Tokens</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Est. Cost</div>
                    <div className="text-blue-400 font-bold">${aiResponse.estimatedCostUSD.toFixed(5)}</div>
                  </div>
                </div>

                {/* Tool Results if present */}
                {aiResponse.toolResults && aiResponse.toolResults.length > 0 && (
                  <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-2">
                    <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1">
                      <Wrench className="w-3.5 h-3.5" />
                      <span>Attached Tool Execution Results</span>
                    </div>
                    <pre className="p-2.5 bg-slate-900 rounded text-slate-300 text-[11px] overflow-x-auto">
                      {JSON.stringify(aiResponse.toolResults, null, 2)}
                    </pre>
                  </div>
                )}

                {/* Response Text */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-2">
                    <span>TRACE ID: {aiResponse.traceId}</span>
                    <span>TIMESTAMP: {new Date(aiResponse.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-slate-200 leading-relaxed whitespace-pre-wrap pt-2">
                    {aiResponse.text}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Models Matrix */}
      {activeTab === 'models' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-black text-white">Multi-Model Registry Matrix</h2>
              <p className="text-xs text-slate-400">
                Centralized registry supporting Google Gemini, OpenAI, Anthropic, DeepSeek, Grok, and Local Fallback.
              </p>
            </div>
            <Cpu className="w-6 h-6 text-[#febd69]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
            {modelsList.map((m) => (
              <div key={m.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{m.name}</span>
                  <span className="text-[10px] bg-slate-800 text-[#febd69] px-2 py-0.5 rounded font-bold">
                    {m.category}
                  </span>
                </div>

                <div className="space-y-1 text-slate-400 text-[11px]">
                  <div>Provider ID: <span className="text-white">{m.providerId}</span></div>
                  <div>Context Window: <span className="text-emerald-400 font-bold">{m.contextWindow.toLocaleString()} Tokens</span></div>
                  <div>Max Output: <span className="text-slate-300">{m.maxOutputTokens.toLocaleString()} Tokens</span></div>
                  <div>Input Rate: <span className="text-blue-400">${m.costPer1kInputUSD}/1k</span></div>
                  <div>Output Rate: <span className="text-blue-400">${m.costPer1kOutputUSD}/1k</span></div>
                </div>

                <div className="flex items-center space-x-2 pt-2 border-t border-slate-800 text-[10px]">
                  {m.supportsStreaming && <span className="bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded">Streaming</span>}
                  {m.supportsTools && <span className="bg-amber-950 text-amber-300 px-2 py-0.5 rounded">Tools</span>}
                  {m.supportsVision && <span className="bg-blue-950 text-blue-300 px-2 py-0.5 rounded">Vision</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Failover & Health */}
      {activeTab === 'health' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-black text-white">Failover Cascade & Provider Health Stream</h2>
              <p className="text-xs text-slate-400">
                Real-time connection status and latency matrix across all AI provider adapters.
              </p>
            </div>
            <Activity className="w-6 h-6 text-[#febd69]" />
          </div>

          <div className="space-y-3 font-mono text-xs">
            {healthStatus.map((h) => (
              <div key={h.providerId} className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      h.status === 'HEALTHY' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                    }`}
                  />
                  <div>
                    <div className="font-bold text-white">{h.name}</div>
                    <div className="text-[10px] text-slate-400">ID: {h.providerId} • {h.activeModelCount} Models</div>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-right">
                  <div>
                    <div className="text-[10px] text-slate-500">AVG LATENCY</div>
                    <div className="font-bold text-emerald-400">{h.latencyMs} ms</div>
                  </div>

                  <div>
                    <div className="text-[10px] text-slate-500">SUCCESS RATE</div>
                    <div className="font-bold text-white">{h.successRate}%</div>
                  </div>

                  <span
                    className={`text-[10px] px-2.5 py-1 rounded font-bold ${
                      h.status === 'HEALTHY'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {h.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Prompt Engine */}
      {activeTab === 'prompts' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-black text-white">Enterprise Prompt Engine & Versioned Templates</h2>
              <p className="text-xs text-slate-400">
                Centralized prompt repository with dynamic variable interpolation and whitespace compression.
              </p>
            </div>
            <FileCode className="w-6 h-6 text-[#febd69]" />
          </div>

          <div className="space-y-4 font-mono text-xs">
            {promptTemplates.map((tpl) => (
              <div key={tpl.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{tpl.name}</span>
                  <span className="text-[10px] bg-slate-800 text-[#febd69] px-2 py-0.5 rounded">v{tpl.version}</span>
                </div>
                <p className="text-slate-400 text-xs">{tpl.description}</p>
                <div className="bg-slate-900 p-3 rounded text-amber-300 text-[11px] font-mono leading-relaxed">
                  {tpl.rawTemplate}
                </div>
                <div className="text-[10px] text-slate-500">
                  Required Variables: <span className="text-emerald-400">{tpl.requiredVariables.join(', ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: AI Tools */}
      {activeTab === 'tools' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-black text-white">AI Tool Execution Framework</h2>
              <p className="text-xs text-slate-400">
                Isolated tool executor for marketplace analytics, FBA stock calculation, and product synthesis.
              </p>
            </div>
            <Wrench className="w-6 h-6 text-[#febd69]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            {[
              {
                tool: 'marketplace_competitor_search',
                name: 'Buy-Box Competitor Search',
                desc: 'Scrapes price benchmarks vs. Amazon Buy Box.',
              },
              {
                tool: 'fba_inventory_reorder_calculator',
                name: 'FBA Inventory Reorder Calculator',
                desc: 'Calculates lead times and safety stock reorder levels.',
              },
              {
                tool: 'product_catalog_generator',
                name: 'Product Catalog Synthesizer',
                desc: 'Generates structured SKU listings with target margins.',
              },
              {
                tool: 'image_prompt_generator',
                name: 'Studio Image Prompt Synthesizer',
                desc: 'Generates 8k photorealistic prompts for Imagen 3.',
              },
            ].map((item) => (
              <div key={item.tool} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
                <div>
                  <div className="font-bold text-white">{item.name}</div>
                  <div className="text-[10px] text-slate-400">{item.desc}</div>
                </div>

                <button
                  onClick={async () => {
                    const res = await fetch('/api/ai/gateway/tools/execute', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ toolName: item.tool, args: { query: 'wireless audio' } }),
                    });
                    const d = await res.json();
                    alert(`Tool Output (${item.name}):\n` + JSON.stringify(d, null, 2));
                  }}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-[#febd69] font-bold text-xs rounded transition flex items-center justify-center space-x-1"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Execute Tool Test</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Analytics & Cost */}
      {activeTab === 'analytics' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-black text-white">AI Token Analytics & Daily Budget Tracking</h2>
              <p className="text-xs text-slate-400">
                Real-time usage metrics, token throughput, and cost spend vs. $50.00 daily budget cap.
              </p>
            </div>
            <BarChart3 className="w-6 h-6 text-[#febd69]" />
          </div>

          {analyticsData && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                <div className="text-slate-500 text-[10px]">TOTAL REQUESTS</div>
                <div className="text-2xl font-black text-white">{analyticsData.analytics?.totalRequests}</div>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                <div className="text-slate-500 text-[10px]">TOKENS PROCESSED</div>
                <div className="text-2xl font-black text-[#febd69]">
                  {analyticsData.analytics?.totalTokensProcessed?.toLocaleString()}
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                <div className="text-slate-500 text-[10px]">DAILY SPEND USD</div>
                <div className="text-2xl font-black text-emerald-400">
                  ${analyticsData.costs?.dailySpendUSD}
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                <div className="text-slate-500 text-[10px]">BUDGET CAP UTILIZATION</div>
                <div className="text-2xl font-black text-blue-400">
                  {analyticsData.costs?.budgetUtilizationPercent}%
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
