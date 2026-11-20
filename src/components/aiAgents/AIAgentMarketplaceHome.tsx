import React, { useState, useEffect } from 'react';
import {
  Bot,
  Terminal,
  Play,
  Download,
  Code2,
  Cloud,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  Layers,
  Copy,
  Check,
  RefreshCw,
  Sliders,
  Cpu,
  Globe,
  Lock,
  Zap,
  Wrench,
  ChevronRight,
  Info,
  Package,
  Briefcase,
  LayoutGrid,
  List,
  Star,
  X,
  Server,
  Activity,
  Eye
} from 'lucide-react';
import { AIAgent, AgentExecutionResult, CustomAgentFactoryDraft, AgentCategory } from '../../types/aiAgent';
import { aiAgentClient } from '../../services/aiAgentClient';
import { SEEDED_AI_AGENTS, BROWSER_AGENT_MAIN_PY, BROWSER_AGENT_DOCKERFILE, BROWSER_AGENT_REQUIREMENTS, BROWSER_AGENT_ENV_EXAMPLE, BROWSER_AGENT_README } from '../../data/aiAgentData';

interface AIAgentMarketplaceHomeProps {
  walletBalance: number;
  onSwitchToPhysical: () => void;
  onSwitchToDigital: () => void;
  onSwitchToFreelancer?: () => void;
}

export const AIAgentMarketplaceHome: React.FC<AIAgentMarketplaceHomeProps> = ({
  walletBalance,
  onSwitchToPhysical,
  onSwitchToDigital,
  onSwitchToFreelancer
}) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'sandbox' | 'factory' | 'deploy' | 'code'>('catalog');
  const [agents, setAgents] = useState<AIAgent[]>(SEEDED_AI_AGENTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgentForModal, setSelectedAgentForModal] = useState<AIAgent | null>(null);

  // Enterprise Dashboard Controls for Many Agents
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'price_asc' | 'price_desc' | 'name'>('popular');
  const [selectedPricing, setSelectedPricing] = useState<'all' | 'free' | 'paid'>('all');
  const [quickTestAgent, setQuickTestAgent] = useState<AIAgent | null>(null);
  const [quickTestInput, setQuickTestInput] = useState<string>('');
  const [quickTestResult, setQuickTestResult] = useState<AgentExecutionResult | null>(null);
  const [isQuickTesting, setIsQuickTesting] = useState<boolean>(false);

  // Sandbox State (Browser Agent Runner)
  const [taskPrompt, setTaskPrompt] = useState('Open https://example.com and summarize the page content');
  const [startUrl, setStartUrl] = useState('https://example.com');
  const [maxSteps, setMaxSteps] = useState(8);
  const [apiToken, setApiToken] = useState('');
  const [isRunningTask, setIsRunningTask] = useState(false);
  const [taskResult, setTaskResult] = useState<AgentExecutionResult | null>(null);
  const [executionError, setExecutionError] = useState<string | null>(null);

  // Code Inspector Tab State
  const [activeFile, setActiveFile] = useState<string>('app/main.py');
  const [copiedFile, setCopiedFile] = useState(false);

  // Factory State
  const [factoryDraft, setFactoryDraft] = useState<CustomAgentFactoryDraft>({
    name: 'Smart Price Monitor Agent',
    tagline: 'Autonomous Competitor Price Intelligence & Margin Analyzer',
    category: 'browser_automation',
    model: 'gemini-2.5-flash',
    systemPrompt: 'You are an autonomous price monitoring agent. Navigate to competitor e-commerce listings, extract current retail prices and discounts, and report margin differences.',
    tools: ['Playwright Chromium Headless', 'DOM Element Inspector', 'Gemini 2.5 Flash'],
    maxSteps: 10,
    cloudRunRegion: 'asia-south1',
    memoryType: 'ISOLATED_SESSION'
  });
  const [factorySuccess, setFactorySuccess] = useState(false);

  // Load catalog on mount
  useEffect(() => {
    const load = async () => {
      const data = await aiAgentClient.getCatalog();
      setAgents(data);
    };
    load();
  }, []);

  const handleRunTask = async () => {
    if (!taskPrompt.trim()) return;
    setIsRunningTask(true);
    setExecutionError(null);
    setTaskResult(null);

    try {
      const result = await aiAgentClient.executeBrowserAgent({
        task: taskPrompt,
        startUrl: startUrl || undefined,
        maxSteps,
        apiToken: apiToken || undefined
      });
      setTaskResult(result);
    } catch (err: any) {
      setExecutionError(err.message || 'Task execution failed.');
    } finally {
      setIsRunningTask(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newAgent = await aiAgentClient.createCustomAgent(factoryDraft);
      setAgents((prev) => [newAgent, ...prev]);
      setFactorySuccess(true);
      setTimeout(() => setFactorySuccess(false), 4000);
    } catch (err) {
      console.error('Failed to create custom agent', err);
    }
  };

  // Categories definition for many agents
  const CATEGORIES = [
    { id: 'all', label: 'All Agents' },
    { id: 'browser_automation', label: 'Browser Automation' },
    { id: 'repricing_analytics', label: 'Repricing & Profit' },
    { id: 'multimodal_vision', label: 'Vision & OCR' },
    { id: 'inventory_fba', label: 'FBA & Inventory' },
    { id: 'customer_support', label: 'Customer Support' },
    { id: 'fraud_security', label: 'Fraud Shield' },
    { id: 'copywriting_seo', label: 'SEO & Copy' },
    { id: 'devops_cloudrun', label: 'Cloud Run DevOps' },
    { id: 'custom_factory', label: 'Custom Factory' }
  ];

  // Dynamic category counts
  const categoryCounts = agents.reduce((acc, a) => {
    acc[a.category] = (acc[a.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const filteredAgents = agents
    .filter((a) => {
      if (selectedCategory !== 'all' && a.category !== selectedCategory) return false;
      if (selectedPricing === 'free' && a.priceUSD > 0) return false;
      if (selectedPricing === 'paid' && a.priceUSD === 0) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          a.name.toLowerCase().includes(q) ||
          a.tagline.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.runtime.toLowerCase().includes(q) ||
          a.tools.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') return b.downloadsCount - a.downloadsCount;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price_asc') return a.priceUSD - b.priceUSD;
      if (sortBy === 'price_desc') return b.priceUSD - a.priceUSD;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  const handleLaunchQuickTest = (agent: AIAgent, presetTask?: string) => {
    setQuickTestAgent(agent);
    setQuickTestInput(presetTask || agent.sampleTasks[0] || 'Execute autonomous task evaluation');
    setQuickTestResult(null);
  };

  const handleExecuteQuickTest = async () => {
    if (!quickTestAgent || !quickTestInput.trim()) return;
    setIsQuickTesting(true);
    setQuickTestResult(null);

    try {
      if (quickTestAgent.isUploadedFlagship) {
        const res = await aiAgentClient.executeBrowserAgent({
          task: quickTestInput,
          startUrl: 'https://example.com',
          maxSteps: 6
        });
        setQuickTestResult(res);
      } else {
        // High-fidelity realistic execution simulation for agent catalog
        await new Promise((r) => setTimeout(r, 650));
        let simulatedSteps = [];
        let summaryResult = '';

        if (quickTestAgent.category === 'repricing_analytics') {
          simulatedSteps = [
            { step: 1, action: 'extract' as const, reason: 'Reading competitor Buy Box live telemetry feed', output: 'Competitor pricing active at $142.50 USD (Stock: 14 units)' },
            { step: 2, action: 'wait' as const, reason: 'Evaluating cost of goods floor margin limit (18% threshold)', output: 'Floor margin safe zone: $128.00 minimum' },
            { step: 3, action: 'done' as const, reason: 'Submitting dynamic price recalculation', output: 'Price adjusted to $141.99 USD. Projected Buy Box win rate: 96.4%' }
          ];
          summaryResult = `Buy Box optimization complete for ${quickTestAgent.name}. Price locked at $141.99. Target gross profit margin preserved.`;
        } else if (quickTestAgent.category === 'multimodal_vision') {
          simulatedSteps = [
            { step: 1, action: 'goto' as const, reason: 'Streaming image frame to Gemini 2.5 Flash Multimodal Vision', output: 'Payload size 1.2MB, 300 DPI resolution verified' },
            { step: 2, action: 'extract' as const, reason: 'Running structural anomaly & barcode segmentation', output: 'Carton corner deformation detected: 4.2mm dent. Barcode checksum VALID.' },
            { step: 3, action: 'done' as const, reason: 'Computing RMA condition grade', output: 'Grading assigned: Grade B (Cosmetic Imperfection - Restock with 12% discount badge)' }
          ];
          summaryResult = `Multimodal inspection passed. Condition: Grade B. Item approved for restock under RMA-8891.`;
        } else if (quickTestAgent.category === 'fraud_security') {
          simulatedSteps = [
            { step: 1, action: 'extract' as const, reason: 'Inspecting buyer device fingerprint, IP proxy status, and email age', output: 'IP Geolocation: US-East residential. Email domain age: 4.2 years.' },
            { step: 2, action: 'wait' as const, reason: 'Computing Bayesian card velocity over 60-second window', output: 'Velocity: 1 attempt. Risk score computed: 12/100 (LOW RISK).' },
            { step: 3, action: 'done' as const, reason: 'Releasing transaction gateway authorization lock', output: 'Transaction approved instantly. 0 chargeback flags detected.' }
          ];
          summaryResult = `Transaction cleared through Fraud Shield. Risk score 12/100 (Safe). Payment authorized.`;
        } else if (quickTestAgent.category === 'devops_cloudrun') {
          simulatedSteps = [
            { step: 1, action: 'goto' as const, reason: 'Querying Cloud Run Admin API v2 metrics', output: 'Active instances: 3. CPU utilization: 42%. HTTP 2xx: 99.8%.' },
            { step: 2, action: 'wait' as const, reason: 'Evaluating cold start buffer and concurrency threshold', output: 'Concurrency optimal at 60 requests/container. Cold start latency: 180ms.' },
            { step: 3, action: 'done' as const, reason: 'Applying auto-scaling policy', output: 'Min-instances set to 1. Autoscaler healthy in region asia-south1.' }
          ];
          summaryResult = `Cloud Run container microservice healthy. 0 cold starts recorded. Zero-downtime scaling engaged.`;
        } else {
          simulatedSteps = [
            { step: 1, action: 'extract' as const, reason: `Initializing ${quickTestAgent.name} engine`, output: `Runtime: ${quickTestAgent.runtime}` },
            { step: 2, action: 'type' as const, reason: 'Processing task parameters with Gemini reasoning', output: `Task: ${quickTestInput}` },
            { step: 3, action: 'done' as const, reason: 'Task executed successfully with verification', output: 'Output artifacts generated and verified against schema.' }
          ];
          summaryResult = `Task successfully completed by ${quickTestAgent.name}.`;
        }

        setQuickTestResult({
          status: 'completed',
          result: summaryResult,
          latencyMs: Math.floor(Math.random() * 80) + 120,
          history: simulatedSteps
        });
      }
    } catch (err: any) {
      setQuickTestResult({
        status: 'error',
        message: err.message || 'Quick test execution error',
        latencyMs: 310,
        history: []
      });
    } finally {
      setIsQuickTesting(false);
    }
  };

  const flagshipBrowserAgent = agents.find((a) => a.isUploadedFlagship) || agents[0];

  const getFileContent = (filename: string) => {
    switch (filename) {
      case 'app/main.py': return BROWSER_AGENT_MAIN_PY;
      case 'Dockerfile': return BROWSER_AGENT_DOCKERFILE;
      case 'requirements.txt': return BROWSER_AGENT_REQUIREMENTS;
      case '.env.example': return BROWSER_AGENT_ENV_EXAMPLE;
      case 'README.md': return BROWSER_AGENT_README;
      default: return BROWSER_AGENT_MAIN_PY;
    }
  };

  return (
    <div className="w-full flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans space-y-6">
      {/* 1. Header Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-500/30 p-6 md:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded-full text-xs font-mono font-extrabold flex items-center space-x-1.5">
                <Bot className="w-3.5 h-3.5 text-purple-400" />
                <span>MARKETPLACE 4: AI AGENT MARKETPLACE</span>
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-[11px] font-bold">
                Active & Live
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
              Cloud Run Autonomous Agents, Browser Automation & Agent Factory
            </h1>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Explore, test, and deploy ready-to-run autonomous AI agents. Powered by Google Cloud Run, Playwright Chromium, and Gemini 2.5 Flash. Build custom bots or run browser automations directly in the sandbox.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setActiveTab('sandbox')}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl transition shadow-lg shadow-purple-500/20 flex items-center space-x-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Launch Interactive Browser Sandbox</span>
              </button>

              <button
                onClick={() => setActiveTab('factory')}
                className="px-4 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition flex items-center space-x-2"
              >
                <Wrench className="w-4 h-4 text-purple-400" />
                <span>AI Agent Factory Studio</span>
              </button>

              <a
                href="/downloads/BrowserAgentCloudRun.zip"
                download="BrowserAgentCloudRun.zip"
                className="px-4 py-2 bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition flex items-center space-x-2 shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Download Cloud Run ZIP (5.7 KB)</span>
              </a>
            </div>
          </div>

          {/* AI Agent Platform Telemetry & Status Card */}
          <div className="bg-slate-900/80 border border-purple-500/20 rounded-2xl p-4 md:w-72 space-y-3 backdrop-blur-md shrink-0">
            <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
              <span className="text-slate-400 font-mono">Agent Engine Telemetry</span>
              <span className="text-purple-400 font-mono font-bold">ONLINE</span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400">Chromium Playwright:</span>
                <span className="text-emerald-400 font-bold flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>v1.55.0</span>
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400">Google Cloud Run:</span>
                <span className="text-sky-400 font-bold">Noble Ready</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400">Active Agent Bots:</span>
                <span className="text-purple-300 font-bold">{agents.length} Deployed</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Wallet Balance:</span>
              <span className="text-emerald-400 font-mono font-bold">${walletBalance.toFixed(2)} USD</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'catalog', label: 'Agent Catalog & Packages', icon: Layers, badge: `${agents.length}` },
          { id: 'sandbox', label: 'Live Browser Agent Sandbox', icon: Play, badge: 'Interactive' },
          { id: 'factory', label: 'AI Agent Factory (Builder)', icon: Wrench, badge: 'Studio' },
          { id: 'code', label: 'Code & Package Inspector', icon: Code2, badge: '5 Files' },
          { id: 'deploy', label: 'Cloud Run Deployment Hub', icon: Cloud, badge: '1-Click' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
                isActive
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                  : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-black/30 text-white' : 'bg-slate-800 text-purple-400'
                }`}
              >
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. TAB 1: AGENT CATALOG */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          {/* Flagship Hero Card: Cloud Run Autonomous Browser Agent */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/40 border-2 border-purple-500/50 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded-full text-[11px] font-mono font-bold flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>PREMIER UPLOADED AGENT</span>
                  </span>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-[10px] font-bold">
                    FastAPI + Playwright + Gemini
                  </span>
                  <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded-full text-[10px] font-bold">
                    v1.0.0
                  </span>
                </div>

                <h2 className="text-xl md:text-2xl font-black text-white">
                  {flagshipBrowserAgent.name}
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {flagshipBrowserAgent.description}
                </p>

                {/* Capabilities pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {flagshipBrowserAgent.tools.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-slate-950/80 border border-slate-800 text-slate-300 text-[10px] rounded-lg font-mono"
                    >
                      ✓ {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions & Download */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full lg:w-64 shrink-0">
                <button
                  onClick={() => setActiveTab('sandbox')}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl transition shadow-lg shadow-purple-500/20 flex items-center justify-center space-x-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Test in Live Sandbox</span>
                </button>

                <a
                  href="/downloads/BrowserAgentCloudRun.zip"
                  download="BrowserAgentCloudRun.zip"
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center space-x-2 text-center"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Package (ZIP)</span>
                </a>

                <button
                  onClick={() => setActiveTab('code')}
                  className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition flex items-center justify-center space-x-2"
                >
                  <Code2 className="w-4 h-4 text-purple-400" />
                  <span>Inspect Code & Dockerfile</span>
                </button>

                <button
                  onClick={() => setActiveTab('deploy')}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs rounded-xl border border-slate-800 transition flex items-center justify-center space-x-2"
                >
                  <Cloud className="w-4 h-4 text-sky-400" />
                  <span>Cloud Run Deploy Command</span>
                </button>
              </div>
            </div>
          </div>

          {/* Search, Filter & Action Toolbar for Many Agents */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-lg">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search 12+ agents by name, task, tool (Playwright, Gemini, OCR), or runtime..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition font-mono"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-3 text-slate-500 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Controls: Sort, Pricing Filter, View Mode, + Create Agent */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Sort dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-mono focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="popular">🔥 Most Popular (Downloads)</option>
                  <option value="rating">⭐ Highest Rated</option>
                  <option value="price_asc">💵 Price: Low to High</option>
                  <option value="price_desc">💎 Price: High to Low</option>
                  <option value="name">🔤 Name (A-Z)</option>
                </select>

                {/* Pricing filter */}
                <select
                  value={selectedPricing}
                  onChange={(e) => setSelectedPricing(e.target.value as any)}
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-mono focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="all">All Licenses</option>
                  <option value="free">Free Open-Source (0 USD)</option>
                  <option value="paid">Commercial & Token</option>
                </select>

                {/* View Mode Toggle: Grid vs Table */}
                <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition ${
                      viewMode === 'grid' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Grid View (Cards)"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('table')}
                    className={`p-1.5 rounded-lg transition ${
                      viewMode === 'table' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Dense Table View (Manage Many Agents)"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                {/* Direct Create New Agent CTA */}
                <button
                  onClick={() => setActiveTab('factory')}
                  className="px-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1.5 shadow-md shadow-purple-600/20"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>+ Create New AI Agent</span>
                </button>
              </div>
            </div>

            {/* Category Filter Chips with Dynamic Count Badges */}
            <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pt-1">
              {CATEGORIES.map((cat) => {
                const count = cat.id === 'all' ? agents.length : categoryCounts[cat.id] || 0;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center space-x-1.5 ${
                      isSelected
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isSelected ? 'bg-black/30 text-white' : 'bg-slate-800 text-purple-400'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Metrics Bar for Many Agents */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-black text-white font-mono">{filteredAgents.length} / {agents.length}</div>
                <div className="text-[10px] text-slate-400 font-mono">Catalog Agents Active</div>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-black text-white font-mono">Cloud Run Ready</div>
                <div className="text-[10px] text-slate-400 font-mono">Docker Containers</div>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-black text-white font-mono">140ms Avg</div>
                <div className="text-[10px] text-slate-400 font-mono">Execution Latency</div>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-black text-white font-mono">100% Verified</div>
                <div className="text-[10px] text-slate-400 font-mono">Safety Interceptors</div>
              </div>
            </div>
          </div>

          {/* Empty State */}
          {filteredAgents.length === 0 && (
            <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
              <Bot className="w-12 h-12 text-slate-600 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">No AI Agents Match Your Filter</h3>
                <p className="text-xs text-slate-400">
                  Try adjusting your search terms, license filter, or selecting a different category.
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setSelectedPricing('all');
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* VIEW 1: DENSE TABLE VIEW (For managing many agents comfortably) */}
          {viewMode === 'table' && filteredAgents.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono text-[11px] uppercase">
                    <tr>
                      <th className="py-3 px-4">Agent Name & Tagline</th>
                      <th className="py-3 px-4">Runtime / Image</th>
                      <th className="py-3 px-4">Key Tools</th>
                      <th className="py-3 px-4">License / Price</th>
                      <th className="py-3 px-4">Rating / DLs</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredAgents.map((agent) => (
                      <tr key={agent.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center space-x-2.5">
                            <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shrink-0">
                              <Bot className="w-4 h-4 text-purple-400" />
                            </div>
                            <div>
                              <div className="flex items-center space-x-1.5">
                                <span className="font-extrabold text-white">{agent.name}</span>
                                <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono border ${agent.badgeColor}`}>
                                  {agent.badge}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{agent.tagline}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-slate-300">
                          <span className="text-[11px] text-purple-300 font-bold">{agent.runtime}</span>
                          <span className="text-[9px] text-slate-500 block truncate max-w-xs">{agent.dockerImage}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {agent.tools.slice(0, 2).map((t, idx) => (
                              <span key={idx} className="text-[9px] font-mono px-1.5 py-0.5 bg-slate-950 border border-slate-800 rounded text-slate-300">
                                {t}
                              </span>
                            ))}
                            {agent.tools.length > 2 && (
                              <span className="text-[9px] font-mono px-1 py-0.5 bg-slate-800 rounded text-slate-400">
                                +{agent.tools.length - 2}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono">
                          <span className="font-black text-emerald-400">
                            {agent.priceUSD === 0 ? 'FREE' : `$${agent.priceUSD.toFixed(2)}`}
                          </span>
                          <span className="text-[10px] text-slate-500 block">
                            {agent.pricingType === 'FREE_OPEN_SOURCE' ? 'Open-Source' : agent.pricingType === 'USAGE_TOKEN' ? 'Token Metered' : 'Perpetual'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-mono">
                          <div className="flex items-center space-x-1 text-amber-400 font-bold">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span>{agent.rating}</span>
                          </div>
                          <span className="text-[10px] text-slate-500">{agent.downloadsCount.toLocaleString()} deploys</span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => handleLaunchQuickTest(agent)}
                              className="px-2.5 py-1 bg-purple-600/90 hover:bg-purple-500 text-white rounded-lg font-bold text-[11px] transition flex items-center space-x-1"
                              title="Test Run Agent"
                            >
                              <Play className="w-3 h-3 fill-current" />
                              <span>Run</span>
                            </button>
                            <button
                              onClick={() => setSelectedAgentForModal(agent)}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-bold text-[11px] border border-slate-700 transition flex items-center space-x-1"
                              title="Inspect Full Specifications"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Inspect</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW 2: GRID VIEW (Detailed cards with full features) */}
          {viewMode === 'grid' && filteredAgents.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAgents.map((agent) => (
                <div
                  key={agent.id}
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between hover:border-purple-500/50 transition group shadow-lg"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${agent.badgeColor}`}>
                        {agent.badge}
                      </span>
                      <div className="flex items-center space-x-1 text-amber-400 font-mono text-xs font-bold">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{agent.rating}</span>
                        <span className="text-slate-500 text-[10px]">({agent.reviewCount})</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-extrabold text-white group-hover:text-purple-300 transition">
                        {agent.name}
                      </h3>
                      <p className="text-[11px] text-purple-400/90 font-medium mt-0.5">
                        {agent.tagline}
                      </p>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {agent.description}
                    </p>

                    <div className="space-y-1.5 pt-1">
                      <div className="text-[10px] text-slate-400 font-mono">Tools & Capabilities:</div>
                      <div className="flex flex-wrap gap-1">
                        {agent.tools.slice(0, 3).map((tool, i) => (
                          <span key={i} className="text-[9px] px-2 py-0.5 bg-slate-950 rounded text-slate-300 font-mono border border-slate-800/80">
                            ✓ {tool}
                          </span>
                        ))}
                        {agent.tools.length > 3 && (
                          <span className="text-[9px] px-1.5 py-0.5 bg-slate-800 rounded text-slate-400 font-mono">
                            +{agent.tools.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black text-emerald-400 font-mono block">
                        {agent.priceUSD === 0 ? 'FREE OPEN-SOURCE' : `$${agent.priceUSD.toFixed(2)} USD`}
                      </span>
                      <div className="text-[10px] text-slate-500 font-mono">{agent.runtime}</div>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => handleLaunchQuickTest(agent)}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1 shadow-md shadow-purple-600/20"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Run</span>
                      </button>
                      <button
                        onClick={() => setSelectedAgentForModal(agent)}
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 transition flex items-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. TAB 2: INTERACTIVE BROWSER AGENT SANDBOX */}
      {activeTab === 'sandbox' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-mono text-[10px] font-bold">
                    FastAPI + Playwright Chromium
                  </span>
                  <h2 className="text-lg font-bold text-white">Browser Agent Execution Sandbox</h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Executes automated multi-step browser tasks using Chromium headless & Gemini 2.5 Flash reasoning.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400 font-mono">Quick Preset Tasks:</span>
              </div>
            </div>

            {/* Quick Task Preset Pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Summarize Example.com', task: 'Open https://example.com and summarize the page content', url: 'https://example.com' },
                { label: 'Audit Deals & Discounts', task: 'Navigate to products page and extract all items with discount badges', url: 'https://commercezon.demo/deals' },
                { label: 'Verify Checkout Button', task: 'Check if Add to Cart and checkout buttons have proper aria-labels', url: 'https://commercezon.demo/catalog' },
                { label: 'Test Safety Interceptor', task: 'Navigate to checkout and attempt to buy now with payment', url: 'https://commercezon.demo/checkout' },
              ].map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setTaskPrompt(preset.task);
                    setStartUrl(preset.url);
                  }}
                  className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs text-slate-300 transition font-mono flex items-center space-x-1"
                >
                  <span>⚡</span>
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>

            {/* Task Inputs */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Autonomous Task Description:
                </label>
                <textarea
                  rows={3}
                  value={taskPrompt}
                  onChange={(e) => setTaskPrompt(e.target.value)}
                  placeholder="e.g. Open https://example.com and summarize the main headings and links"
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition font-mono"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Start URL (Optional):
                  </label>
                  <input
                    type="text"
                    value={startUrl}
                    onChange={(e) => setStartUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-300">Max Steps Iterations:</label>
                    <span className="text-xs font-mono text-purple-400 font-bold">{maxSteps} steps</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={20}
                    value={maxSteps}
                    onChange={(e) => setMaxSteps(parseInt(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    API Secret Token (Bearer Auth):
                  </label>
                  <input
                    type="password"
                    value={apiToken}
                    onChange={(e) => setApiToken(e.target.value)}
                    placeholder="Optional for test sandbox"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-[11px] text-slate-400 flex items-center space-x-1.5 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Safety Guardrail Active: Auto-pauses before purchase, checkout, or destructive operations</span>
                </div>

                <button
                  onClick={handleRunTask}
                  disabled={isRunningTask || !taskPrompt.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl transition shadow-lg shadow-purple-500/20 flex items-center space-x-2 disabled:opacity-50"
                >
                  {isRunningTask ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Executing Chromium Agent...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>Run Task with Agent</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {executionError && (
              <div className="p-4 bg-rose-950/80 border border-rose-800 rounded-2xl text-rose-300 text-xs flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{executionError}</span>
              </div>
            )}

            {/* Execution Trace & Timeline Results */}
            {taskResult && (
              <div className="border border-purple-500/30 bg-slate-950 rounded-2xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black ${
                        taskResult.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : taskResult.status === 'needs_confirmation'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      }`}
                    >
                      STATUS: {taskResult.status.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      URL: <strong className="text-white">{taskResult.currentUrl}</strong>
                    </span>
                  </div>

                  <span className="text-xs font-mono text-purple-400">
                    Latency: {taskResult.latencyMs}ms • {taskResult.history.length} steps executed
                  </span>
                </div>

                {/* Safety pause notice */}
                {taskResult.status === 'needs_confirmation' && (
                  <div className="p-3 bg-amber-950/60 border border-amber-800 rounded-xl text-amber-300 text-xs space-y-1">
                    <div className="font-bold flex items-center space-x-1.5">
                      <Lock className="w-4 h-4 text-amber-400" />
                      <span>Safety Interceptor Engaged</span>
                    </div>
                    <p className="text-[11px] text-amber-200/90 leading-relaxed">
                      {taskResult.message || 'Paused before potentially consequential action. Manual confirmation required.'}
                    </p>
                  </div>
                )}

                {/* Step Timeline */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-300">Action Trace History:</div>
                  <div className="space-y-2 max-h-80 overflow-y-auto no-scrollbar">
                    {taskResult.history.map((step, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-start justify-between text-xs font-mono space-x-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="px-1.5 py-0.2 bg-purple-500/20 text-purple-300 rounded font-bold text-[10px]">
                              Step {step.step}
                            </span>
                            <span className="text-amber-400 font-bold uppercase">{step.action}</span>
                            {step.selector && <span className="text-slate-400">Selector: {step.selector}</span>}
                            {step.url && <span className="text-sky-400 truncate max-w-xs">{step.url}</span>}
                          </div>
                          {step.reason && <p className="text-[11px] text-slate-300 font-sans">{step.reason}</p>}
                          {step.output && <div className="text-[10px] text-emerald-400">{step.output}</div>}
                          {step.error && <div className="text-[10px] text-rose-400 font-bold">Error: {step.error}</div>}
                        </div>

                        <span className="text-[10px] text-slate-500 shrink-0">Executed</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Final Result */}
                {taskResult.result && (
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                    <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Agent Result Summary</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-mono">
                      {taskResult.result}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. TAB 3: AI AGENT FACTORY (STUDIO) */}
      {activeTab === 'factory' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <Wrench className="w-5 h-5 text-purple-400" />
                <h2 className="text-lg font-bold text-white">AI Agent Factory & Docker Forge</h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Customize, configure, and package autonomous agents for your marketplace. Automatically generates Google Cloud Run Docker manifests.
              </p>
            </div>

            <form onSubmit={handleCreateAgent} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Agent Name:</label>
                  <input
                    type="text"
                    value={factoryDraft.name}
                    onChange={(e) => setFactoryDraft({ ...factoryDraft, name: e.target.value })}
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Tagline / Mission:</label>
                  <input
                    type="text"
                    value={factoryDraft.tagline}
                    onChange={(e) => setFactoryDraft({ ...factoryDraft, tagline: e.target.value })}
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Category:</label>
                  <select
                    value={factoryDraft.category}
                    onChange={(e) => setFactoryDraft({ ...factoryDraft, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="browser_automation">Browser Automation</option>
                    <option value="inventory_fba">Inventory & Warehouses</option>
                    <option value="customer_support">Customer Support & RMA</option>
                    <option value="fraud_security">Fraud & Risk Shield</option>
                    <option value="copywriting_seo">SEO & Copywriting</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Gemini AI Model:</label>
                  <select
                    value={factoryDraft.model}
                    onChange={(e) => setFactoryDraft({ ...factoryDraft, model: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-purple-400 font-bold focus:border-purple-500 focus:outline-none"
                  >
                    <option value="gemini-2.5-flash">Gemini 2.5 Flash (Fastest / Low Latency)</option>
                    <option value="gemini-2.5-pro">Gemini 2.5 Pro (Deep Reasoning)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Cloud Run Region:</label>
                  <select
                    value={factoryDraft.cloudRunRegion}
                    onChange={(e) => setFactoryDraft({ ...factoryDraft, cloudRunRegion: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="asia-south1">asia-south1 (Mumbai)</option>
                    <option value="asia-southeast1">asia-southeast1 (Singapore)</option>
                    <option value="us-central1">us-central1 (Iowa)</option>
                    <option value="europe-west1">europe-west1 (Belgium)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Agent System Prompt & Instructions:
                </label>
                <textarea
                  rows={4}
                  value={factoryDraft.systemPrompt}
                  onChange={(e) => setFactoryDraft({ ...factoryDraft, systemPrompt: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition font-mono"
                />
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <label className="text-xs font-bold text-slate-300 block">Assigned Autonomous Tools:</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  {[
                    'Playwright Chromium Headless',
                    'DOM Element Inspector',
                    'CSS Selector Engine',
                    'Safety Consequence Interceptor',
                    'FBA Warehouse Stock Query',
                    'Refund Ledger Trigger',
                    'Slack / Webhook Dispatcher',
                    'A9 Keyword Scraper'
                  ].map((tool) => {
                    const isChecked = factoryDraft.tools.includes(tool);
                    return (
                      <label key={tool} className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFactoryDraft({ ...factoryDraft, tools: [...factoryDraft.tools, tool] });
                            } else {
                              setFactoryDraft({ ...factoryDraft, tools: factoryDraft.tools.filter((t) => t !== tool) });
                            }
                          }}
                          className="rounded bg-slate-900 border-slate-700 text-purple-600"
                        />
                        <span className="text-[11px] font-mono">{tool}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {factorySuccess && (
                <div className="p-3 bg-emerald-950 border border-emerald-800 rounded-xl text-emerald-300 text-xs font-bold flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Custom AI Agent successfully created and added to the AI Agent Marketplace catalog!</span>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs rounded-xl transition shadow-lg shadow-purple-600/20 flex items-center space-x-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Build & Package Agent</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. TAB 4: CODE & DOCKERFILE INSPECTOR */}
      {activeTab === 'code' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Code2 className="w-4 h-4 text-purple-400" />
                  <span>Package Source Code Viewer: BrowserAgentCloudRun</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Extracted from user upload: <strong className="text-purple-300 font-mono">public/assets/aistudio/BrowserAgentCloudRun_3d3bd737.zip</strong>
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleCopyCode(getFileContent(activeFile))}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-mono transition flex items-center space-x-1.5"
                >
                  {copiedFile ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedFile ? 'Copied!' : 'Copy File Content'}</span>
                </button>

                <a
                  href="/downloads/BrowserAgentCloudRun.zip"
                  download="BrowserAgentCloudRun.zip"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .ZIP</span>
                </a>
              </div>
            </div>

            {/* File Switcher Tabs */}
            <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">
              {[
                { name: 'app/main.py', size: '4.8 KB', tag: 'FastAPI + Playwright' },
                { name: 'Dockerfile', size: '260 B', tag: 'Noble Playwright' },
                { name: 'requirements.txt', size: '90 B', tag: 'Pip Spec' },
                { name: '.env.example', size: '127 B', tag: 'Config' },
                { name: 'README.md', size: '2.4 KB', tag: 'Docs & Deploy' },
              ].map((f) => (
                <button
                  key={f.name}
                  onClick={() => setActiveFile(f.name)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center space-x-2 ${
                    activeFile === f.name
                      ? 'bg-purple-600 text-white shadow'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{f.name}</span>
                  <span className="text-[10px] opacity-70">({f.size})</span>
                </button>
              ))}
            </div>

            {/* Code Block Display */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 overflow-x-auto font-mono text-xs text-slate-200 max-h-[550px] leading-relaxed">
              <pre>{getFileContent(activeFile)}</pre>
            </div>
          </div>
        </div>
      )}

      {/* 7. TAB 5: CLOUD RUN DEPLOYMENT HUB */}
      {activeTab === 'deploy' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <Cloud className="w-5 h-5 text-sky-400" />
                <h2 className="text-lg font-bold text-white">Google Cloud Run One-Click Deployment Hub</h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Follow these 4 simple steps to deploy your autonomous Browser Agent to Google Cloud Run in under 2 minutes.
              </p>
            </div>

            {/* Step-by-Step Guide */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center space-x-2 text-purple-400 font-bold text-xs">
                  <span className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center">1</span>
                  <span>Extract ZIP Package</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Download the bundle from this page. Extract in Google Cloud Shell or on your terminal with Google Cloud CLI installed.
                </p>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center">2</span>
                  <span>Enable Cloud Run APIs</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  In Google Cloud Console, enable <strong className="text-white">Cloud Run API</strong> and <strong className="text-white">Cloud Build API</strong>.
                </p>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">3</span>
                  <span>Set AI Studio Gemini Key</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Generate an API key from Google AI Studio. It will be passed as the <code className="text-amber-400">GEMINI_API_KEY</code> environment variable.
                </p>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center space-x-2 text-sky-400 font-bold text-xs">
                  <span className="w-5 h-5 rounded-full bg-sky-500/20 flex items-center justify-center">4</span>
                  <span>Execute Deployment Command</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Run the deployment command below. Cloud Build packages the Playwright Noble image and deploys with HTTPS endpoint.
                </p>
              </div>
            </div>

            {/* Generated Deployment Command */}
            <div className="bg-slate-950 border border-purple-500/30 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200 font-mono">Google Cloud CLI Command:</span>
                <button
                  onClick={() => handleCopyCode(flagshipBrowserAgent.cloudRunDeployCommand)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-mono text-[11px] transition flex items-center space-x-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Command</span>
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl font-mono text-xs text-emerald-400 overflow-x-auto select-all">
                {flagshipBrowserAgent.cloudRunDeployCommand}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. AGENT INSPECTOR MODAL */}
      {selectedAgentForModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-black text-white">{selectedAgentForModal.name}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${selectedAgentForModal.badgeColor}`}>
                      {selectedAgentForModal.badge}
                    </span>
                  </div>
                  <p className="text-xs text-purple-300 font-medium">{selectedAgentForModal.tagline}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAgentForModal(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description & Specs */}
            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block mb-1">Architecture & Capabilities</span>
                <p className="text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                  {selectedAgentForModal.description}
                </p>
              </div>

              {/* Grid Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px]">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Runtime Engine</span>
                  <span className="text-white font-bold">{selectedAgentForModal.runtime}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Base Image</span>
                  <span className="text-purple-400 font-bold truncate block">{selectedAgentForModal.dockerImage}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Commercial Model</span>
                  <span className="text-emerald-400 font-bold">
                    {selectedAgentForModal.priceUSD === 0 ? 'FREE OPEN-SOURCE' : `$${selectedAgentForModal.priceUSD.toFixed(2)} USD`}
                  </span>
                </div>
              </div>

              {/* Tools */}
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block mb-1.5">Bundled Tools & APIs</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedAgentForModal.tools.map((t, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 font-mono text-[10px]">
                      ✓ {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sample Tasks */}
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block mb-1.5">Preset Sample Tasks</span>
                <div className="space-y-1.5">
                  {selectedAgentForModal.sampleTasks.map((task, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-3 text-slate-300"
                    >
                      <span className="text-[11px] font-mono leading-tight">{task}</span>
                      <button
                        onClick={() => {
                          const tgt = selectedAgentForModal;
                          setSelectedAgentForModal(null);
                          handleLaunchQuickTest(tgt, task);
                        }}
                        className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-[10px] font-bold shrink-0 transition flex items-center space-x-1"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Run</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cloud Run Deploy Command */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Cloud Run CLI Command</span>
                  <button
                    onClick={() => handleCopyCode(selectedAgentForModal.cloudRunDeployCommand)}
                    className="text-[10px] font-mono text-purple-400 hover:text-purple-300 flex items-center space-x-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </button>
                </div>
                <div className="p-2.5 bg-slate-950 border border-purple-500/30 rounded-xl font-mono text-[11px] text-emerald-400 overflow-x-auto select-all">
                  {selectedAgentForModal.cloudRunDeployCommand}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedAgentForModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const tgt = selectedAgentForModal;
                  setSelectedAgentForModal(null);
                  handleLaunchQuickTest(tgt);
                }}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl transition shadow-md shadow-purple-600/20 flex items-center space-x-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Launch in Quick Runner</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. UNIVERSAL QUICK TEST RUNNER MODAL */}
      {quickTestAgent && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
                  <Play className="w-4 h-4 text-purple-400 fill-current" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Live Execution Runner: {quickTestAgent.name}</h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Runtime: {quickTestAgent.runtime} • Docker: {quickTestAgent.dockerImage}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setQuickTestAgent(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Task Prompt Area */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Task Objective / Action Prompt</span>
                <span className="text-[10px] text-purple-400 font-mono">Gemini 2.5 Flash Autonomous Planning</span>
              </label>
              <textarea
                value={quickTestInput}
                onChange={(e) => setQuickTestInput(e.target.value)}
                rows={3}
                placeholder="Describe task for the AI agent..."
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-purple-500 transition"
              />

              {/* Preset task suggestions */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] text-slate-400 font-mono">Presets:</span>
                {quickTestAgent.sampleTasks.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => setQuickTestInput(t)}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-300 hover:text-purple-300 hover:border-purple-500 transition truncate max-w-[260px]"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Run Button */}
            <div className="pt-2">
              <button
                onClick={handleExecuteQuickTest}
                disabled={isQuickTesting || !quickTestInput.trim()}
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-black text-xs rounded-xl transition shadow-lg shadow-purple-600/20 flex items-center justify-center space-x-2"
              >
                {isQuickTesting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Executing Autonomous Steps...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Execute Agent Task</span>
                  </>
                )}
              </button>
            </div>

            {/* Execution Result Area */}
            {quickTestResult && (
              <div className="space-y-3 pt-3 border-t border-slate-800 animate-scale-up">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                        quickTestResult.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-red-500/20 text-red-300 border border-red-500/40'
                      }`}
                    >
                      Status: {quickTestResult.status}
                    </span>
                    <span className="text-slate-400">Latency: {quickTestResult.latencyMs}ms</span>
                  </div>
                  <span className="text-purple-400">Completed Steps: {quickTestResult.history.length}</span>
                </div>

                {/* History Steps */}
                {quickTestResult.history.length > 0 && (
                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                    {quickTestResult.history.map((h, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1 font-mono text-xs">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-purple-400 font-bold">Step #{h.step}: {h.action.toUpperCase()}</span>
                          <span className="text-slate-500">{h.reason}</span>
                        </div>
                        {h.output && (
                          <div className="text-emerald-400 text-[11px] bg-slate-900/80 p-1.5 rounded border border-slate-800">
                            {h.output}
                          </div>
                        )}
                        {h.error && (
                          <div className="text-red-400 text-[11px] bg-red-950/60 p-1.5 rounded border border-red-800">
                            {h.error}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Final Result / Summary */}
                {quickTestResult.result && (
                  <div className="p-3 bg-purple-950/40 border border-purple-500/30 rounded-xl text-xs space-y-1">
                    <div className="flex items-center space-x-1.5 text-purple-300 font-bold">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span>Agent Verdict & Verified Output:</span>
                    </div>
                    <p className="text-slate-200 font-mono text-[11px] leading-relaxed">
                      {quickTestResult.result}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
