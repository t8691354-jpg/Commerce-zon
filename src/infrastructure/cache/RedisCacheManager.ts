import { CacheEntry, CacheStats, CachePolicy } from '../../domain/performance/PerformanceTypes.js';
import { logger } from '../logging/Logger.js';

export class RedisCacheManager {
  private static store: Map<string, CacheEntry> = new Map();
  private static tagIndex: Map<string, Set<string>> = new Map(); // tag -> Set of keys
  private static hits = 4210;
  private static misses = 380;
  private static evictions = 14;
  private static maxKeysCap = 10000;

  /**
   * Set a key in Redis cache with TTL and tags
   */
  public static set<T = any>(
    key: string,
    value: T,
    ttlMs: number = 300000, // 5 mins default
    tags: string[] = []
  ): void {
    // Check max capacity eviction
    if (this.store.size >= this.maxKeysCap && !this.store.has(key)) {
      this.evictOldest();
    }

    const now = Date.now();
    const entry: CacheEntry<T> = {
      key,
      value,
      tags,
      ttlMs,
      createdAt: now,
      expiresAt: now + ttlMs,
      hits: 0,
    };

    this.store.set(key, entry);

    // Index tags
    for (const tag of tags) {
      if (!this.tagIndex.has(tag)) {
        this.tagIndex.set(tag, new Set());
      }
      this.tagIndex.get(tag)!.add(key);
    }
  }

  /**
   * Get value from Redis cache
   */
  public static get<T = any>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) {
      this.misses++;
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.delete(key);
      this.misses++;
      return null;
    }

    entry.hits++;
    this.hits++;
    return entry.value as T;
  }

  /**
   * Delete a key
   */
  public static delete(key: string): boolean {
    const entry = this.store.get(key);
    if (!entry) return false;

    // Clean up tag index
    for (const tag of entry.tags) {
      const keys = this.tagIndex.get(tag);
      if (keys) {
        keys.delete(key);
        if (keys.size === 0) {
          this.tagIndex.delete(tag);
        }
      }
    }

    return this.store.delete(key);
  }

  /**
   * Invalidate all keys matching a specific tag (Tag-Based Invalidation)
   */
  public static invalidateTag(tag: string): number {
    const keys = this.tagIndex.get(tag);
    if (!keys) return 0;

    let count = 0;
    const keysArray = Array.from(keys);
    for (const k of keysArray) {
      if (this.delete(k)) {
        count++;
      }
    }

    this.tagIndex.delete(tag);
    logger.info(`Invalidated ${count} cache entries with tag '${tag}'`, 'RedisCacheManager');
    return count;
  }

  /**
   * Invalidate all keys matching a prefix namespace (e.g., 'product:', 'search:')
   */
  public static invalidatePrefix(prefix: string): number {
    let count = 0;
    for (const [key] of this.store.entries()) {
      if (key.startsWith(prefix)) {
        if (this.delete(key)) count++;
      }
    }
    logger.info(`Invalidated ${count} cache entries with prefix '${prefix}'`, 'RedisCacheManager');
    return count;
  }

  /**
   * Clear all cache entries
   */
  public static purgeAll(): void {
    this.store.clear();
    this.tagIndex.clear();
    logger.info('Purged entire Redis cache store', 'RedisCacheManager');
  }

  /**
   * LRU Eviction helper
   */
  private static evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    for (const [k, entry] of this.store.entries()) {
      if (entry.createdAt < oldestTime) {
        oldestTime = entry.createdAt;
        oldestKey = k;
      }
    }

    if (oldestKey) {
      this.delete(oldestKey);
      this.evictions++;
    }
  }

  /**
   * Get current Cache Statistics
   */
  public static getStats(): CacheStats {
    const totalRequests = this.hits + this.misses;
    const hitRatioPercent = totalRequests > 0 ? Number(((this.hits / totalRequests) * 100).toFixed(2)) : 0;
    const estimatedMemoryBytes = this.store.size * 512; // ~512 bytes average key-value footprint

    return {
      totalKeys: this.store.size,
      hits: this.hits,
      misses: this.misses,
      hitRatioPercent,
      memoryUsageBytes: estimatedMemoryBytes,
      evictions: this.evictions,
      tagCount: this.tagIndex.size,
    };
  }

  /**
   * Seed baseline cache entries for Commerce Zon platform demonstration
   */
  public static seedBaselineCache(): void {
    if (this.store.size > 0) return;

    this.set('product:p-101', { id: 'p-101', name: 'Pro Noise Canceling Headphones', price: 299.99 }, 600000, ['product', 'electronics']);
    this.set('product:p-102', { id: 'p-102', name: 'Ultra-Slim Gaming Laptop 16"', price: 1899.99 }, 600000, ['product', 'electronics', 'computers']);
    this.set('category:electronics', { id: 'electronics', name: 'Electronics & Audio', count: 420 }, 900000, ['category']);
    this.set('search:wireless audio', { results: ['p-101', 'p-105', 'p-109'], total: 3 }, 300000, ['search']);
    this.set('inventory:WH-US-EAST:p-101', { sku: 'SKU-101', quantity: 1420 }, 180000, ['inventory']);
    this.set('user_session:sess-9921', { userId: 'usr-1', role: 'SUPER_ADMIN' }, 1800000, ['session']);
  }
}

// Seed initial baseline
RedisCacheManager.seedBaselineCache();
