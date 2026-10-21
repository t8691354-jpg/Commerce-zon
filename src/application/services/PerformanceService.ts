import { RedisCacheManager } from '../../infrastructure/cache/RedisCacheManager.js';
import { QueueEngine } from '../../infrastructure/jobs/QueueEngine.js';
import { EventBus } from '../../infrastructure/events/EventBus.js';
import { PerformanceMonitor } from '../../infrastructure/performance/PerformanceMonitor.js';
import { AuditEngine } from '../../infrastructure/performance/AuditEngine.js';
import { LoadTester } from '../../infrastructure/performance/LoadTester.js';
import { JobPriority, LoadTestScenario } from '../../domain/performance/PerformanceTypes.js';
import { logger } from '../../infrastructure/logging/Logger.js';

export class PerformanceService {
  /**
   * Get complete performance metrics snapshot
   */
  public getMetricsSnapshot() {
    return {
      metrics: PerformanceMonitor.getMetrics(),
      cacheStats: RedisCacheManager.getStats(),
      queueStats: QueueEngine.getStats(),
      eventSubscribersCount: EventBus.getSubscriberCount(),
      eventHistory: EventBus.getEventHistory(),
      health: PerformanceMonitor.getSystemHealth(),
    };
  }

  /**
   * Run automated audit
   */
  public executeAudit() {
    return AuditEngine.runAudit();
  }

  /**
   * Invalidate cache tag or purge all
   */
  public purgeCache(tag?: string, prefix?: string): { clearedCount: number; message: string } {
    if (tag) {
      const count = RedisCacheManager.invalidateTag(tag);
      return { clearedCount: count, message: `Invalidated ${count} keys with tag '${tag}'` };
    }

    if (prefix) {
      const count = RedisCacheManager.invalidatePrefix(prefix);
      return { clearedCount: count, message: `Invalidated ${count} keys with prefix '${prefix}'` };
    }

    RedisCacheManager.purgeAll();
    return { clearedCount: -1, message: 'Purged entire Redis cache store successfully' };
  }

  /**
   * Dispatch background queue job
   */
  public dispatchJob(name: string, queueName: any, data: any, priority: JobPriority = 'NORMAL') {
    return QueueEngine.dispatch(name, queueName, data, priority);
  }

  /**
   * Retry DLQ job
   */
  public retryDlqJob(jobId: string) {
    return QueueEngine.retryDlqJob(jobId);
  }

  /**
   * Run load test simulation
   */
  public runLoadTest(scenario: LoadTestScenario) {
    logger.info(`Executing load test simulation for ${scenario.concurrentUsers} users`, 'PerformanceService');
    return LoadTester.simulateLoadTest(scenario);
  }
}

export const performanceService = new PerformanceService();
