export type AgentCategory =
  | 'browser_automation'
  | 'inventory_fba'
  | 'customer_support'
  | 'fraud_security'
  | 'copywriting_seo'
  | 'repricing_analytics'
  | 'multimodal_vision'
  | 'devops_cloudrun'
  | 'custom_factory';

export interface AgentFileMeta {
  name: string;
  path: string;
  size: string;
  type: string;
  description: string;
  content?: string;
}

export interface AgentEnvVar {
  key: string;
  required: boolean;
  defaultValue?: string;
  description: string;
}

export interface AIAgent {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category: AgentCategory;
  version: string;
  author: string;
  pricingType: 'FREE_OPEN_SOURCE' | 'ONE_TIME_PURCHASE' | 'USAGE_TOKEN';
  priceUSD: number;
  runtime: string;
  dockerImage: string;
  tools: string[];
  rating: number;
  reviewCount: number;
  downloadsCount: number;
  verified: boolean;
  isUploadedFlagship?: boolean;
  badge: string;
  badgeColor: string;
  zipDownloadUrl?: string;
  cloudRunDeployCommand: string;
  envVars: AgentEnvVar[];
  sampleTasks: string[];
  files?: AgentFileMeta[];
}

export interface AgentExecutionStep {
  step: number;
  action: 'goto' | 'click' | 'fill' | 'type' | 'press' | 'scroll' | 'wait' | 'extract' | 'done' | 'ask_user';
  url?: string;
  selector?: string;
  text?: string;
  seconds?: number;
  reason?: string;
  output?: string;
  error?: string;
}

export interface AgentExecutionResult {
  status: 'completed' | 'needs_user' | 'needs_confirmation' | 'step_limit_reached' | 'error';
  result?: string;
  message?: string;
  currentUrl?: string;
  history: AgentExecutionStep[];
  latencyMs: number;
  proposedAction?: any;
}

export interface CustomAgentFactoryDraft {
  name: string;
  tagline: string;
  category: AgentCategory;
  model: string;
  systemPrompt: string;
  tools: string[];
  maxSteps: number;
  cloudRunRegion: string;
  memoryType: 'ISOLATED_SESSION' | 'BUFFER_WINDOW' | 'PERSISTENT_REDIS';
}
