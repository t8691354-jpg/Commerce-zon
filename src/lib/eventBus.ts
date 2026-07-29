import { DomainEvent, AuditLog } from '../types/domain';

type EventHandler<T = any> = (event: DomainEvent<T>) => void | Promise<void>;

class EnterpriseEventBus {
  private handlers: Map<string, EventHandler[]> = new Map();
  private eventHistory: DomainEvent[] = [];
  private auditTrail: AuditLog[] = [];

  constructor() {
    // Register default listener to convert all domain events into structured audit logs
    this.subscribe('*', (event) => {
      const auditEntry: AuditLog = {
        id: `audit-${event.id}`,
        timestamp: event.timestamp,
        actorType: event.actor.type,
        actorId: event.actor.id,
        action: event.eventType,
        domain: event.domain,
        details: `[${event.domain}] ${event.eventType} on aggregate ${event.aggregateId}: ${JSON.stringify(
          event.payload
        ).substring(0, 150)}`,
        metadata: { payload: event.payload },
      };
      this.auditTrail.unshift(auditEntry);
      if (this.auditTrail.length > 200) this.auditTrail.pop();
    });
  }

  public subscribe<T = any>(eventType: string, handler: EventHandler<T>): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)!.push(handler as EventHandler);

    // Return unsubscribe function
    return () => {
      const existing = this.handlers.get(eventType);
      if (existing) {
        this.handlers.set(
          eventType,
          existing.filter((h) => h !== handler)
        );
      }
    };
  }

  public async publish<T = any>(event: DomainEvent<T>): Promise<void> {
    this.eventHistory.unshift(event);
    if (this.eventHistory.length > 200) this.eventHistory.pop();

    // Call wildcard subscribers
    const wildcards = this.handlers.get('*') || [];
    for (const handler of wildcards) {
      try {
        await handler(event);
      } catch (err) {
        console.error(`[EventBus] Error in wildcard handler for ${event.eventType}:`, err);
      }
    }

    // Call specific event type subscribers
    const specificHandlers = this.handlers.get(event.eventType) || [];
    for (const handler of specificHandlers) {
      try {
        await handler(event);
      } catch (err) {
        console.error(`[EventBus] Error in handler for ${event.eventType}:`, err);
      }
    }
  }

  public getEventHistory(): DomainEvent[] {
    return [...this.eventHistory];
  }

  public getAuditTrail(): AuditLog[] {
    return [...this.auditTrail];
  }
}

export const eventBus = new EnterpriseEventBus();
