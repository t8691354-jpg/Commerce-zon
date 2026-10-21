import { GoogleGenAI } from '@google/genai';
import { IAIProviderAdapter } from './IAIProviderAdapter';
import { AICompletionRequest, AICompletionResponse, AIProviderId } from '../../../domain/ai/AITypes';
import { ModelRegistry } from '../models/ModelRegistry';
import { logger } from '../../logging/Logger';

export class GeminiAdapter implements IAIProviderAdapter {
  public providerId: AIProviderId = 'google_gemini';
  public name = 'Google Gemini AI Adapter';

  private client: GoogleGenAI | null = null;

  constructor() {
    this.initClient();
  }

  private initClient() {
    if (!this.client && process.env.GEMINI_API_KEY) {
      try {
        this.client = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
          httpOptions: {
            headers: {
              'User-Agent': 'commercezon-enterprise-ai-v4',
            },
          },
        });
        logger.info('GeminiAdapter initialized with valid API key', 'GeminiAdapter');
      } catch (err) {
        logger.error('Failed to instantiate GoogleGenAI client', 'GeminiAdapter', { error: String(err) });
      }
    }
  }

  public isAvailable(): boolean {
    this.initClient();
    return Boolean(this.client && process.env.GEMINI_API_KEY);
  }

  public async executeCompletion(req: AICompletionRequest, traceId: string): Promise<AICompletionResponse> {
    const startTime = Date.now();
    this.initClient();

    if (!this.client) {
      throw new Error('Gemini API key is not configured or client initialization failed.');
    }

    const targetModel = req.modelId || 'gemini-2.5-flash';
    const modelSpec = ModelRegistry.getModelById(targetModel) || ModelRegistry.getDefaultModel('google_gemini');

    const combinedContents = [];
    if (req.systemPrompt) {
      combinedContents.push({
        role: 'user',
        parts: [{ text: `[System Protocol & Context]: ${req.systemPrompt}` }],
      });
      combinedContents.push({
        role: 'model',
        parts: [{ text: 'System protocols acknowledged. Ready for query.' }],
      });
    }

    combinedContents.push({
      role: 'user',
      parts: [{ text: req.prompt }],
    });

    try {
      const response = await this.client.models.generateContent({
        model: modelSpec.id,
        contents: combinedContents,
        config: {
          temperature: req.temperature ?? 0.7,
          topP: req.topP ?? 0.95,
          maxOutputTokens: req.maxTokens ?? 2048,
        },
      });

      const textOutput = response.text || 'Commerce Zon Gemini AI Engine produced a completed response.';
      const latency = Date.now() - startTime;

      // Estimate tokens
      const promptTokens = Math.ceil((req.prompt.length + (req.systemPrompt?.length || 0)) / 4);
      const completionTokens = Math.ceil(textOutput.length / 4);
      const totalTokens = promptTokens + completionTokens;

      const estimatedCostUSD =
        (promptTokens / 1000) * modelSpec.costPer1kInputUSD +
        (completionTokens / 1000) * modelSpec.costPer1kOutputUSD;

      return {
        traceId,
        text: textOutput,
        providerId: this.providerId,
        modelId: modelSpec.id,
        usage: { promptTokens, completionTokens, totalTokens },
        estimatedCostUSD,
        latencyMs: latency,
        cached: false,
        failoverOccurred: false,
        attemptedProviders: [this.providerId],
        finishReason: 'stop',
        timestamp: new Date().toISOString(),
      };
    } catch (err: any) {
      logger.error('Gemini API call failed', 'GeminiAdapter', { error: err.message || String(err), traceId });
      throw new Error(`Gemini Provider Exception: ${err.message || String(err)}`);
    }
  }
}
