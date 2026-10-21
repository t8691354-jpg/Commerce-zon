import { RedisCacheManager } from './RedisCacheManager.js';
import { logger } from '../logging/Logger.js';

export class CacheStrategy {
  /**
   * Cache-Aside Pattern:
   * First check cache. If hit, return cached value.
   * If miss, call fetcher, store result in cache, and return.
   */
  public static async cacheAside<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlMs: number = 300000,
    tags: string[] = []
  ): Promise<{ data: T; cached: boolean }> {
    const cachedData = RedisCacheManager.get<T>(key);
    if (cachedData !== null) {
      return { data: cachedData, cached: true };
    }

    const freshData = await fetcher();
    RedisCacheManager.set(key, freshData, ttlMs, tags);
    return { data: freshData, cached: false };
  }

  /**
   * Read-Through Pattern:
   * Transparently reads through cache layer.
   */
  public static async readThrough<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlMs: number = 300000,
    tags: string[] = []
  ): Promise<T> {
    const res = await this.cacheAside(key, fetcher, ttlMs, tags);
    return res.data;
  }

  /**
   * Write-Through Pattern:
   * Synchronously writes to persistent store, then updates cache immediately.
   */
  public static async writeThrough<T>(
    key: string,
    value: T,
    persister: (data: T) => Promise<void>,
    ttlMs: number = 300000,
    tags: string[] = []
  ): Promise<T> {
    await persister(value);
    RedisCacheManager.set(key, value, ttlMs, tags);
    logger.info(`Write-Through executed for cache key ${key}`, 'CacheStrategy');
    return value;
  }

  /**
   * Write-Behind (Write-Back) Pattern:
   * Immediately updates cache, then asynchronously queues background persistence.
   */
  public static writeBehind<T>(
    key: string,
    value: T,
    asyncPersister: (data: T) => Promise<void>,
    ttlMs: number = 300000,
    tags: string[] = []
  ): T {
    RedisCacheManager.set(key, value, ttlMs, tags);

    // Queue asynchronous non-blocking persistent update
    setTimeout(() => {
      asyncPersister(value).catch((err) => {
        logger.error(`Write-Behind asynchronous persistence failed for ${key}`, 'CacheStrategy', { error: String(err) });
      });
    }, 10);

    logger.info(`Write-Behind queued background write for ${key}`, 'CacheStrategy');
    return value;
  }
}
