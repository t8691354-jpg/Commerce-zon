import { AIProviderId } from '../../../domain/ai/AITypes';

export interface AIPlatformConfig {
  defaultProvider: AIProviderId;
  defaultModel: string;
  fallbackSequence: AIProviderId[];
  maxRetryAttempts: number;
  requestTimeoutMs: number;
  rateLimitPerMinute: number;
  dailyBudgetCapUSD: number;
  cacheTtlSeconds: number;
  safetyThresholdRiskScore: number;
  providers: {
    google_gemini: { enabled: boolean; apiKeyConfigured: boolean; defaultModel: string };
    openai: { enabled: boolean; apiKeyConfigured: boolean; defaultModel: string };
    anthropic_claude: { enabled: boolean; apiKeyConfigured: boolean; defaultModel: string };
    deepseek: { enabled: boolean; apiKeyConfigured: boolean; defaultModel: string };
    grok: { enabled: boolean; apiKeyConfigured: boolean; defaultModel: string };
    fallback: { enabled: boolean; apiKeyConfigured: boolean; defaultModel: string };
  };
}

export const getAIPlatformConfig = (): AIPlatformConfig => {
  const geminiKey = process.env.GEMINI_API_KEY || '';
  const openaiKey = process.env.OPENAI_API_KEY || '';
  const anthropicKey = process.env.ANTHROPIC_API_KEY || '';
  const deepseekKey = process.env.DEEPSEEK_API_KEY || '';

  return {
    defaultProvider: geminiKey ? 'google_gemini' : 'fallback',
    defaultModel: 'gemini-2.5-flash',
    fallbackSequence: ['google_gemini', 'openai', 'anthropic_claude', 'deepseek', 'fallback'],
    maxRetryAttempts: 3,
    requestTimeoutMs: 15000,
    rateLimitPerMinute: 120,
    dailyBudgetCapUSD: 50.0,
    cacheTtlSeconds: 300, // 5 minutes
    safetyThresholdRiskScore: 75,
    providers: {
      google_gemini: {
        enabled: true,
        apiKeyConfigured: Boolean(geminiKey),
        defaultModel: 'gemini-2.5-flash',
      },
      openai: {
        enabled: true,
        apiKeyConfigured: Boolean(openaiKey),
        defaultModel: 'gpt-4o',
      },
      anthropic_claude: {
        enabled: true,
        apiKeyConfigured: Boolean(anthropicKey),
        defaultModel: 'claude-3-5-sonnet-20241022',
      },
      deepseek: {
        enabled: true,
        apiKeyConfigured: Boolean(deepseekKey),
        defaultModel: 'deepseek-r1',
      },
      grok: {
        enabled: true,
        apiKeyConfigured: false,
        defaultModel: 'grok-2',
      },
      fallback: {
        enabled: true,
        apiKeyConfigured: true,
        defaultModel: 'czon-deterministic-v1',
      },
    },
  };
};
