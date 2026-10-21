import { IAIProviderAdapter } from './IAIProviderAdapter';
import { AICompletionRequest, AICompletionResponse, AIProviderId } from '../../../domain/ai/AITypes';
import { ModelRegistry } from '../models/ModelRegistry';
import { logger } from '../../logging/Logger';

export class OpenAIAdapter implements IAIProviderAdapter {
  public providerId: AIProviderId = 'openai';
  public name = 'OpenAI GPT Adapter';

  public isAvailable(): boolean {
    return Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim().length > 0);
  }

  public async executeCompletion(req: AICompletionRequest, traceId: string): Promise<AICompletionResponse> {
    const startTime = Date.now();
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not configured in runtime environment.');
    }

    const targetModel = req.modelId || 'gpt-4o';
    const modelSpec = ModelRegistry.getModelById(targetModel) || ModelRegistry.getDefaultModel('openai');

    const messages = [];
    if (req.systemPrompt) {
      messages.push({ role: 'system', content: req.systemPrompt });
    }
    messages.push({ role: 'user', content: req.prompt });

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: modelSpec.id,
          messages,
          temperature: req.temperature ?? 0.7,
          max_tokens: req.maxTokens ?? 2048,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const textOutput = data.choices?.[0]?.message?.content || 'No completion returned by OpenAI.';
      const latency = Date.now() - startTime;

      const promptTokens = data.usage?.prompt_tokens || Math.ceil((req.prompt.length + (req.systemPrompt?.length || 0)) / 4);
      const completionTokens = data.usage?.completion_tokens || Math.ceil(textOutput.length / 4);
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
      logger.error('OpenAI execution failed', 'OpenAIAdapter', { error: err.message, traceId });
      throw new Error(`OpenAI Provider Exception: ${err.message || String(err)}`);
    }
  }
}
