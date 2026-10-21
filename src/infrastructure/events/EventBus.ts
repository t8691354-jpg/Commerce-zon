import { logger } from '../logging/Logger.js';

export type SystemEventType =
  | 'OrderCreated'
  | 'OrderUpdated'
  | 'InventoryChanged'
  | 'WalletUpdated'
  | 'SellerApproved'
  | 'AIRequestCompleted'
  | 'SystemMetricAlert';

export interface SystemEventPayload<T = any> {
  eventId: string;
  type: SystemEventType;
  timestamp: string;
  source: string;
  data: T;
}

export type EventSubscriberFn<T = any> = (event: SystemEventPayload<T>) => void | Promise<void>;

export class EventBus {
  private static subscribers: Map<SystemEventType, Set<EventSubscriberFn>> = new Map();
  private static eventHistory: SystemEventPayload[] = [];
  private static maxHistory = 50;

  /**
   * Subscribe to a system event
   */
  public static subscribe<T = any>(type: SystemEventType, fn: EventSubscriberFn<T>): () => void {
    if (!this.subscribers.has(type)) {
      this.subscribers.set(type, new Set());
    }
    this.subscribers.get(type)!.add(fn as EventSubscriberFn);

    // Return unsubscribe function
    return () => {
      const set = this.subscribers.get(type);
      if (set) {
        set.delete(fn as EventSubscriberFn);
      }
    };
  }

  /**
   * Publish a system event to all active subscribers
   */
  public static publish<T = any>(type: SystemEventType, source: string, data: T): SystemEventPayload<T> {
    const payload: SystemEventPayload<T> = {
      eventId: `evt-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      type,
      timestamp: new Date().toISOString(),
      source,
      data,
    };

    // Store in history
    this.eventHistory.unshift(payload);
    if (this.eventHistory.length > this.maxHistory) {
      this.eventHistory.pop();
    }

    const set = this.subscribers.get(type);
    if (set && set.size > 0) {
      for (const fn of set) {
        try {
          fn(payload);
        } catch (err: any) {
          logger.error(`Error in event subscriber for '${type}'`, 'EventBus', { error: err.message });
        }
      }
    }

    logger.info(`Published System Event '${type}' from source '${source}'`, 'EventBus', { eventId: payload.eventId });
    return payload;
  }

  /**
   * Get recent event stream
   */
  public static getEventHistory(): SystemEventPayload[] {
    return this.eventHistory;
  }

  /**
   * Get total subscriber count
   */
  public static getSubscriberCount(): number {
    let total = 0;
    for (const set of this.subscribers.values()) {
      total += set.size;
    }
    return total;
  }
}

// Seed baseline initial events
EventBus.publish('OrderCreated', 'OrderService', { orderId: 'ORD-99120', amountUSD: 299.99, customer: 'alex@company.com' });
EventBus.publish('InventoryChanged', 'InventoryService', { sku: 'SKU-7700', oldQuantity: 1500, newQuantity: 1450 });
EventBus.publish('AIRequestCompleted', 'AIGateway', { provider: 'google_gemini', tokens: 420, latencyMs: 140 });
