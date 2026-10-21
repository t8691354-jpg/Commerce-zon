import { IAIProviderAdapter } from './IAIProviderAdapter';
import { AICompletionRequest, AICompletionResponse, AIProviderId } from '../../../domain/ai/AITypes';
import { ModelRegistry } from '../models/ModelRegistry';
import { logger } from '../../logging/Logger';

export class ClaudeAdapter implements IAIProviderAdapter {
  public providerId: AIProviderId = 'anthropic_claude';
  public name = 'Anthropic Claude Adapter';

  public isAvailable(): boolean {
    return Boolean(process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY.trim().length > 0);
  }

  public async executeCompletion(req: AICompletionRequest, traceId: string): Promise<AICompletionResponse> {
    const startTime = Date.now();
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY is not configured in environment.');
    }

    const targetModel = req.modelId || 'claude-3-5-sonnet-20241022';
    const modelSpec = ModelRegistry.getModelById(targetModel) || ModelRegistry.getDefaultModel('anthropic_claude');

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: modelSpec.id,
          system: req.systemPrompt,
          messages: [{ role: 'user', content: req.prompt }],
          max_tokens: req.maxTokens ?? 2048,
          temperature: req.temperature ?? 0.7,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Claude HTTP ${response.status}: ${errText}`);
      }

      const data = await response.json();
      const textOutput = data.content?.[0]?.text || 'No output returned by Claude.';
      const latency = Date.now() - startTime;

      const promptTokens = data.usage?.input_tokens || Math.ceil((req.prompt.length + (req.systemPrompt?.length || 0)) / 4);
      const completionTokens = data.usage?.output_tokens || Math.ceil(textOutput.length / 4);
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
      logger.error('Claude execution failed', 'ClaudeAdapter', { error: err.message, traceId });
      throw new Error(`Claude Provider Exception: ${err.message || String(err)}`);
    }
  }
}
