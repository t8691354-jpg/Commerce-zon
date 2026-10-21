import { IAIProviderAdapter } from './IAIProviderAdapter';
import { AICompletionRequest, AICompletionResponse, AIProviderId } from '../../../domain/ai/AITypes';
import { ModelRegistry } from '../models/ModelRegistry';
import { logger } from '../../logging/Logger';

export class DeepSeekAdapter implements IAIProviderAdapter {
  public providerId: AIProviderId = 'deepseek';
  public name = 'DeepSeek R1 Reasoning Adapter';

  public isAvailable(): boolean {
    return Boolean(process.env.DEEPSEEK_API_KEY && process.env.DEEPSEEK_API_KEY.trim().length > 0);
  }

  public async executeCompletion(req: AICompletionRequest, traceId: string): Promise<AICompletionResponse> {
    const startTime = Date.now();
    const apiKey = process.env.DEEPSEEK_API_KEY;

    if (!apiKey) {
      throw new Error('DEEPSEEK_API_KEY is not configured in environment.');
    }

    const targetModel = req.modelId || 'deepseek-r1';
    const modelSpec = ModelRegistry.getModelById(targetModel) || ModelRegistry.getDefaultModel('deepseek');

    try {
      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: modelSpec.id,
          messages: [
            ...(req.systemPrompt ? [{ role: 'system', content: req.systemPrompt }] : []),
            { role: 'user', content: req.prompt },
          ],
          temperature: req.temperature ?? 0.6,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`DeepSeek HTTP ${response.status}: ${errText}`);
      }

      const data = await response.json();
      const textOutput = data.choices?.[0]?.message?.content || 'DeepSeek reasoning completed.';
      const latency = Date.now() - startTime;

      const promptTokens = data.usage?.prompt_tokens || Math.ceil(req.prompt.length / 4);
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
      logger.error('DeepSeek execution failed', 'DeepSeekAdapter', { error: err.message, traceId });
      throw new Error(`DeepSeek Provider Exception: ${err.message || String(err)}`);
    }
  }
}
