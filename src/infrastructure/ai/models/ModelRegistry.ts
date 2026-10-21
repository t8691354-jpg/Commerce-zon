import { AIModelSpec, AIProviderId, AIModelCategory } from '../../../domain/ai/AITypes';

export class ModelRegistry {
  private static models: AIModelSpec[] = [
    // Google Gemini Models
    {
      id: 'gemini-2.5-flash',
      name: 'Google Gemini 2.5 Flash',
      providerId: 'google_gemini',
      category: 'FAST',
      contextWindow: 1000000,
      maxOutputTokens: 8192,
      costPer1kInputUSD: 0.00015,
      costPer1kOutputUSD: 0.0006,
      supportsStreaming: true,
      supportsTools: true,
      supportsVision: true,
      isDefault: true,
    },
    {
      id: 'gemini-2.5-pro',
      name: 'Google Gemini 2.5 Pro (Reasoning)',
      providerId: 'google_gemini',
      category: 'REASONING',
      contextWindow: 2000000,
      maxOutputTokens: 8192,
      costPer1kInputUSD: 0.00125,
      costPer1kOutputUSD: 0.005,
      supportsStreaming: true,
      supportsTools: true,
      supportsVision: true,
    },

    // OpenAI Models
    {
      id: 'gpt-4o',
      name: 'OpenAI GPT-4o Multimodal',
      providerId: 'openai',
      category: 'BALANCED',
      contextWindow: 128000,
      maxOutputTokens: 4096,
      costPer1kInputUSD: 0.0025,
      costPer1kOutputUSD: 0.01,
      supportsStreaming: true,
      supportsTools: true,
      supportsVision: true,
    },
    {
      id: 'gpt-4o-mini',
      name: 'OpenAI GPT-4o Mini',
      providerId: 'openai',
      category: 'FAST',
      contextWindow: 128000,
      maxOutputTokens: 4096,
      costPer1kInputUSD: 0.00015,
      costPer1kOutputUSD: 0.0006,
      supportsStreaming: true,
      supportsTools: true,
      supportsVision: true,
    },
    {
      id: 'o3-mini',
      name: 'OpenAI o3-mini Reasoning Engine',
      providerId: 'openai',
      category: 'REASONING',
      contextWindow: 200000,
      maxOutputTokens: 100000,
      costPer1kInputUSD: 0.0011,
      costPer1kOutputUSD: 0.0044,
      supportsStreaming: true,
      supportsTools: true,
      supportsVision: false,
    },

    // Anthropic Claude Models
    {
      id: 'claude-3-5-sonnet-20241022',
      name: 'Anthropic Claude 3.5 Sonnet',
      providerId: 'anthropic_claude',
      category: 'BALANCED',
      contextWindow: 200000,
      maxOutputTokens: 8192,
      costPer1kInputUSD: 0.003,
      costPer1kOutputUSD: 0.015,
      supportsStreaming: true,
      supportsTools: true,
      supportsVision: true,
    },
    {
      id: 'claude-3-5-haiku-20241022',
      name: 'Anthropic Claude 3.5 Haiku',
      providerId: 'anthropic_claude',
      category: 'FAST',
      contextWindow: 200000,
      maxOutputTokens: 8192,
      costPer1kInputUSD: 0.0008,
      costPer1kOutputUSD: 0.004,
      supportsStreaming: true,
      supportsTools: true,
      supportsVision: true,
    },

    // DeepSeek
    {
      id: 'deepseek-r1',
      name: 'DeepSeek R1 Open Reasoning',
      providerId: 'deepseek',
      category: 'REASONING',
      contextWindow: 64000,
      maxOutputTokens: 8192,
      costPer1kInputUSD: 0.00055,
      costPer1kOutputUSD: 0.00219,
      supportsStreaming: true,
      supportsTools: false,
      supportsVision: false,
    },

    // Grok
    {
      id: 'grok-2',
      name: 'xAI Grok-2 Realtime Market AI',
      providerId: 'grok',
      category: 'BALANCED',
      contextWindow: 128000,
      maxOutputTokens: 4096,
      costPer1kInputUSD: 0.002,
      costPer1kOutputUSD: 0.01,
      supportsStreaming: true,
      supportsTools: true,
      supportsVision: true,
    },

    // Deterministic Fallback Engine
    {
      id: 'czon-deterministic-v1',
      name: 'Commerce Zon Local Enterprise Fallback',
      providerId: 'fallback',
      category: 'FAST',
      contextWindow: 32000,
      maxOutputTokens: 2048,
      costPer1kInputUSD: 0.0,
      costPer1kOutputUSD: 0.0,
      supportsStreaming: true,
      supportsTools: true,
      supportsVision: false,
    },
  ];

  public static getAllModels(): AIModelSpec[] {
    return this.models;
  }

  public static getModelById(modelId: string): AIModelSpec | undefined {
    return this.models.find((m) => m.id === modelId);
  }

  public static getModelsByProvider(providerId: AIProviderId): AIModelSpec[] {
    return this.models.filter((m) => m.providerId === providerId);
  }

  public static getModelsByCategory(category: AIModelCategory): AIModelSpec[] {
    return this.models.filter((m) => m.category === category);
  }

  public static getDefaultModel(providerId: AIProviderId): AIModelSpec {
    const list = this.getModelsByProvider(providerId);
    return list.find((m) => m.isDefault) || list[0] || this.models[this.models.length - 1];
  }
}
