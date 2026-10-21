export type CachePolicy = 'CACHE_ASIDE' | 'READ_THROUGH' | 'WRITE_THROUGH' | 'WRITE_BEHIND';

export type JobPriority = 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW';

export type JobStatus = 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'DELAYED' | 'DEAD_LETTER';

export interface CacheEntry<T = any> {
  key: string;
  value: T;
  tags: string[];
  ttlMs: number;
  createdAt: number;
  expiresAt: number;
  hits: number;
}

export interface CacheStats {
  totalKeys: number;
  hits: number;
  misses: number;
  hitRatioPercent: number;
  memoryUsageBytes: number;
  evictions: number;
  tagCount: number;
}

export interface QueueJob<T = any> {
  id: string;
  name: string;
  queueName: 'email' | 'notification' | 'inventory_sync' | 'order_processing' | 'ai_task' | 'analytics_report';
  priority: JobPriority;
  data: T;
  status: JobStatus;
  attempts: number;
  maxAttempts: number;
  delayMs?: number;
  runAt: number;
  createdAt: number;
  completedAt?: number;
  failedAt?: number;
  error?: string;
  result?: any;
}

export interface QueueStats {
  activeWorkers: number;
  pendingJobs: number;
  processingJobs: number;
  completedJobs: number;
  failedJobs: number;
  deadLetterJobs: number;
  throughputJobsPerSec: number;
}

export interface PerformanceMetrics {
  timestamp: string;
  apiResponseLatencyMs: {
    p50: number;
    p95: number;
    p99: number;
    avg: number;
  };
  cacheHitRatioPercent: number;
  databaseQueryLatencyMs: number;
  memoryUsageMB: {
    heapUsed: number;
    heapTotal: number;
    rss: number;
  };
  cpuUsagePercent: number;
  requestsPerSecond: number;
  queueThroughputPerSec: number;
  activeWebsocketConnections: number;
  errorRatePercent: number;
}

export interface SystemAuditItem {
  category: 'FRONTEND' | 'BACKEND' | 'DATABASE' | 'CACHE' | 'NETWORK' | 'ASSETS';
  checkName: string;
  status: 'OPTIMAL' | 'WARNING' | 'CRITICAL';
  score: number; // 0-100
  metricValue: string;
  recommendation: string;
}

export interface AuditReport {
  timestamp: string;
  overallScore: number;
  items: SystemAuditItem[];
  bottlenecks: string[];
  appliedOptimizations: string[];
}

export interface LoadTestScenario {
  concurrentUsers: 1000 | 10000 | 100000 | 1000000;
  durationSeconds: number;
  requestsPerUserPerSec: number;
}

export interface LoadTestResult {
  scenario: LoadTestScenario;
  totalRequestsHandled: number;
  successfulRequests: number;
  failedRequests: number;
  avgLatencyMs: number;
  p99LatencyMs: number;
  peakThroughputRPS: number;
  cacheOffloadPercent: number;
  bottlenecksIdentified: string[];
  systemStabilityStatus: 'STABLE' | 'DEGRADED' | 'OVERLOADED';
}

export interface SystemEventPayload<T = any> {
  eventId: string;
  type: string;
  timestamp: string;
  source: string;
  data: T;
}

export interface SystemHealthReport {
  status: 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
  timestamp: string;
  components: {
    application: { status: string; uptimeSeconds: number };
    database: { status: string; connectionPoolActive: number; maxConnections: number };
    redisCache: { status: string; hitRatioPercent: number; keysCount: number };
    queueEngine: { status: string; pendingCount: number; dlqCount: number };
    aiGateway: { status: string; healthyProvidersCount: number };
    eventBus: { status: string; activeSubscribers: number };
  };
}
