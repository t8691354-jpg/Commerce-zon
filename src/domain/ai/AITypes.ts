export type AIProviderId = 'google_gemini' | 'openai' | 'anthropic_claude' | 'deepseek' | 'grok' | 'fallback';

export type AIModelCategory = 'FAST' | 'BALANCED' | 'REASONING' | 'VISION' | 'EMBEDDING' | 'CODE';

export interface AIModelSpec {
  id: string;
  name: string;
  providerId: AIProviderId;
  category: AIModelCategory;
  contextWindow: number;
  maxOutputTokens: number;
  costPer1kInputUSD: number;
  costPer1kOutputUSD: number;
  supportsStreaming: boolean;
  supportsTools: boolean;
  supportsVision: boolean;
  isDefault?: boolean;
}

export interface AITokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface AIToolCallSpec {
  toolName: string;
  args: Record<string, any>;
}

export interface AIToolResult {
  toolName: string;
  success: boolean;
  output: any;
  executionTimeMs: number;
}

export interface AICompletionRequest {
  prompt: string;
  systemPrompt?: string;
  providerId?: AIProviderId;
  modelId?: string;
  temperature?: number;
  topP?: number;
  maxTokens?: number;
  stream?: boolean;
  sessionId?: string;
  userId?: string;
  templateId?: string;
  templateVars?: Record<string, any>;
  enableCache?: boolean;
  enableSafetyFilter?: boolean;
  tools?: string[];
  userRole?: string;
}

export interface AICompletionResponse {
  traceId: string;
  text: string;
  providerId: AIProviderId;
  modelId: string;
  usage: AITokenUsage;
  estimatedCostUSD: number;
  latencyMs: number;
  cached: boolean;
  failoverOccurred: boolean;
  attemptedProviders: AIProviderId[];
  toolResults?: AIToolResult[];
  finishReason: 'stop' | 'length' | 'tool_call' | 'content_filter' | 'error';
  timestamp: string;
}

export interface AISafetyAssessment {
  isSafe: boolean;
  riskScore: number; // 0 - 100
  flaggedCategories: string[];
  sanitizedPrompt: string;
  actionTaken: 'PASSED' | 'SANITIZED' | 'BLOCKED';
}

export interface PromptTemplate {
  id: string;
  name: string;
  category: string;
  version: number;
  rawTemplate: string;
  description: string;
  requiredVariables: string[];
  updatedAt: string;
}

export interface AIMemoryRecord {
  id: string;
  sessionId: string;
  userId?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  tokensEstimated: number;
}

export interface ProviderHealthStatus {
  providerId: AIProviderId;
  name: string;
  status: 'HEALTHY' | 'DEGRADED' | 'DOWN' | 'DISABLED';
  latencyMs: number;
  successRate: number;
  lastChecked: string;
  activeModelCount: number;
}

export interface AIAnalyticsSummary {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  cachedRequests: number;
  totalTokensProcessed: number;
  totalCostUSD: number;
  averageLatencyMs: number;
  providerDistribution: Record<AIProviderId, number>;
  topTemplatesUsed: Record<string, number>;
  errorRate: number;
}
