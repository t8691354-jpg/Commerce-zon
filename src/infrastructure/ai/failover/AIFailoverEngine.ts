import { IAIProviderAdapter } from '../providers/IAIProviderAdapter';
import { GeminiAdapter } from '../providers/GeminiAdapter';
import { OpenAIAdapter } from '../providers/OpenAIAdapter';
import { ClaudeAdapter } from '../providers/ClaudeAdapter';
import { DeepSeekAdapter } from '../providers/DeepSeekAdapter';
import { FallbackAdapter } from '../providers/FallbackAdapter';
import { AICompletionRequest, AICompletionResponse, AIProviderId } from '../../../domain/ai/AITypes';
import { getAIPlatformConfig } from '../config/aiConfig';
import { logger } from '../../logging/Logger';

export class AIFailoverEngine {
  private providers: Map<AIProviderId, IAIProviderAdapter> = new Map();

  constructor() {
    this.registerProvider(new GeminiAdapter());
    this.registerProvider(new OpenAIAdapter());
    this.registerProvider(new ClaudeAdapter());
    this.registerProvider(new DeepSeekAdapter());
    this.registerProvider(new FallbackAdapter());
  }

  public registerProvider(adapter: IAIProviderAdapter): void {
    this.providers.set(adapter.providerId, adapter);
  }

  public getProvider(providerId: AIProviderId): IAIProviderAdapter | undefined {
    return this.providers.get(providerId);
  }

  public async executeWithFailover(req: AICompletionRequest, traceId: string): Promise<AICompletionResponse> {
    const config = getAIPlatformConfig();
    const attemptedProviders: AIProviderId[] = [];

    // Determine primary sequence
    let sequence: AIProviderId[] = [];
    if (req.providerId && this.providers.has(req.providerId)) {
      sequence.push(req.providerId);
    }

    for (const p of config.fallbackSequence) {
      if (!sequence.includes(p)) {
        sequence.push(p);
      }
    }

    let lastError: Error | null = null;

    for (const providerId of sequence) {
      const adapter = this.providers.get(providerId);
      if (!adapter) continue;

      attemptedProviders.push(providerId);

      // Check availability before attempting
      if (!adapter.isAvailable() && providerId !== 'fallback') {
        logger.info(`Provider '${providerId}' is unconfigured or offline. Skipping to next.`, 'AIFailoverEngine');
        continue;
      }

      try {
        logger.info(`Attempting AI execution via '${providerId}'`, 'AIFailoverEngine', { traceId });
        const response = await adapter.executeCompletion(req, traceId);

        response.attemptedProviders = attemptedProviders;
        response.failoverOccurred = attemptedProviders.length > 1;

        if (response.failoverOccurred) {
          logger.info(`AI Failover successful via '${providerId}' after ${attemptedProviders.length} attempts`, 'AIFailoverEngine', { traceId });
        }

        return response;
      } catch (err: any) {
        lastError = err;
        logger.warn(`Provider '${providerId}' failed execution. Escalating failover.`, 'AIFailoverEngine', {
          error: err.message,
          traceId,
        });
      }
    }

    // Absolute fallback guarantee
    const fallback = this.providers.get('fallback')!;
    const fallbackResp = await fallback.executeCompletion(req, traceId);
    fallbackResp.attemptedProviders = attemptedProviders;
    fallbackResp.failoverOccurred = true;

    return fallbackResp;
  }
}
