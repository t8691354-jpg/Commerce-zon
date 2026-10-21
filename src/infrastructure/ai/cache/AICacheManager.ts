import { AICompletionResponse } from '../../../domain/ai/AITypes';
import { logger } from '../../logging/Logger';

interface CacheEntry {
  response: AICompletionResponse;
  expiresAt: number;
}

export class AICacheManager {
  private static cache: Map<string, CacheEntry> = new Map();

  public static generateCacheKey(prompt: string, systemPrompt?: string, modelId?: string): string {
    const raw = `${prompt}::${systemPrompt || ''}::${modelId || 'default'}`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = (hash << 5) - hash + raw.charCodeAt(i);
      hash |= 0;
    }
    return `czon-cache-${Math.abs(hash)}`;
  }

  public static get(key: string): AICompletionResponse | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    logger.info(`AI Cache HIT for key ${key}`, 'AICacheManager');
    return {
      ...entry.response,
      cached: true,
      latencyMs: 2, // Near instantaneous cache lookup
    };
  }

  public static set(key: string, response: AICompletionResponse, ttlSeconds = 300): void {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.cache.set(key, { response, expiresAt });
  }

  public static clear(): void {
    this.cache.clear();
    logger.info('Cleared AI Response Cache', 'AICacheManager');
  }

  public static getStats() {
    return {
      activeEntries: this.cache.size,
    };
  }
}
