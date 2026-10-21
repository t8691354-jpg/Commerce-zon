/**
 * Enterprise Event-Driven Notification Listener
 * Automatically converts Domain Events from the Event Bus into multi-channel notifications
 */

import { eventBus } from '../../lib/eventBus';
import { DomainEvent } from '../../types/domain';
import { NotificationRecord, NotificationIdGenerator } from './NotificationEntity';
import { TemplateEngine } from './TemplateEngine';
import { logger } from '../../infrastructure/logging/Logger';

export type NotificationDispatcher = (notification: NotificationRecord) => Promise<any>;

export class EventNotificationListener {
  private static registered = false;
  private static dispatcher: NotificationDispatcher | null = null;

  public static initialize(dispatcher: NotificationDispatcher): void {
    if (this.registered) return;
    this.dispatcher = dispatcher;

    // Listen to all events published to eventBus
    eventBus.subscribe('*', async (event: DomainEvent) => {
      try {
        await EventNotificationListener.handleDomainEvent(event);
      } catch (err) {
        logger.error(`[EventNotificationListener] Error processing domain event ${event.eventType}`, 'CommunicationDomain', { error: String(err) });
      }
    });

    this.registered = true;
    logger.info('[EventNotificationListener] Registered event-driven notification subscriber.', 'CommunicationDomain');
  }

  private static async handleDomainEvent(event: DomainEvent): Promise<void> {
    if (!this.dispatcher) return;

    const payload = event.payload as any;
    const timestamp = new Date().toISOString();

    switch (event.eventType) {
      case 'UserRegistered': {
        const notif: NotificationRecord = {
          id: NotificationIdGenerator.generateNotificationId(),
          recipientId: payload.userId || event.actor.id,
          recipientName: payload.name || 'User',
          recipientEmail: payload.email || 'user@example.com',
          role: 'Buyer',
          category: 'Account Created',
          channel: 'email',
          title: 'Welcome to Commerce Zon!',
          body: `Hi ${payload.name || 'there'}, your Commerce Zon account has been successfully created. Enjoy seamless global shopping!`,
          htmlBody: `<h2>Welcome to Commerce Zon!</h2><p>Hi ${payload.name || 'there'}, welcome aboard.</p>`,
          status: 'pending',
          priority: 'normal',
          timestamp,
          read: false,
          clicked: false,
          retryAttempts: 0,
          maxRetries: 3,
          metadata: { eventType: event.eventType, aggregateId: event.aggregateId },
        };
        await this.dispatcher(notif);
        break;
      }

      case 'OrderCreated': {
        const notif: NotificationRecord = {
          id: NotificationIdGenerator.generateNotificationId(),
          recipientId: payload.customerId || 'CUST-001',
          recipientName: payload.customerName || 'Valued Buyer',
          recipientEmail: payload.customerEmail || 'buyer@example.com',
          role: 'Buyer',
          category: 'New Order',
          channel: 'email',
          title: `Order Confirmation #${payload.orderNumber || event.aggregateId}`,
          body: `Thank you for your order #${payload.orderNumber || event.aggregateId}! Total amount: $${payload.totalUSD || 0}. We are preparing your shipment.`,
          status: 'pending',
          priority: 'high',
          timestamp,
          read: false,
          clicked: false,
          retryAttempts: 0,
          maxRetries: 3,
          metadata: { orderId: payload.orderId || event.aggregateId },
        };
        await this.dispatcher(notif);
        break;
      }

      case 'PaymentSuccessful': {
        const notif: NotificationRecord = {
          id: NotificationIdGenerator.generateNotificationId(),
          recipientId: payload.userId || 'CUST-001',
          recipientName: payload.userName || 'Valued Customer',
          recipientEmail: payload.userEmail || 'customer@example.com',
          role: 'Buyer',
          category: 'Payment Successful',
          channel: 'in_app',
          title: 'Payment Receipt Confirmed',
          body: `Payment of $${payload.amount || 0} via ${payload.paymentMethod || 'Card'} was successful (Transaction ID: ${payload.transactionId || event.aggregateId}).`,
          status: 'pending',
          priority: 'normal',
          timestamp,
          read: false,
          clicked: false,
          retryAttempts: 0,
          maxRetries: 3,
          metadata: { transactionId: payload.transactionId || event.aggregateId },
        };
        await this.dispatcher(notif);
        break;
      }

      case 'ShipmentCreated':
      case 'ShipmentDispatched': {
        const notif: NotificationRecord = {
          id: NotificationIdGenerator.generateNotificationId(),
          recipientId: payload.recipientId || 'CUST-001',
          recipientName: payload.recipientName || 'Recipient',
          recipientEmail: payload.recipientEmail || 'customer@example.com',
          role: 'Buyer',
          category: event.eventType === 'ShipmentDispatched' ? 'Order Shipped' : 'Shipment Created',
          channel: 'push_web',
          title: `Shipment Update for Order #${payload.orderId || event.aggregateId}`,
          body: `Your order has been dispatched! Tracking number: ${payload.trackingNumber || 'TRK-CZ-0000'}. Carrier: ${payload.carrierName || 'Commerce Zon Logistics'}.`,
          status: 'pending',
          priority: 'high',
          timestamp,
          read: false,
          clicked: false,
          retryAttempts: 0,
          maxRetries: 3,
          metadata: { trackingNumber: payload.trackingNumber, shipmentId: event.aggregateId },
        };
        await this.dispatcher(notif);
        break;
      }

      case 'ShipmentDelivered': {
        const notif: NotificationRecord = {
          id: NotificationIdGenerator.generateNotificationId(),
          recipientId: payload.recipientId || 'CUST-001',
          recipientName: payload.recipientName || 'Recipient',
          recipientEmail: payload.recipientEmail || 'customer@example.com',
          role: 'Buyer',
          category: 'Delivered',
          channel: 'in_app',
          title: 'Package Delivered! 🎉',
          body: `Your package for order #${payload.orderId || event.aggregateId} has been safely delivered to ${payload.recipientName}.`,
          status: 'pending',
          priority: 'high',
          timestamp,
          read: false,
          clicked: false,
          retryAttempts: 0,
          maxRetries: 3,
          metadata: { orderId: payload.orderId },
        };
        await this.dispatcher(notif);
        break;
      }

      case 'WalletUpdated': {
        const notif: NotificationRecord = {
          id: NotificationIdGenerator.generateNotificationId(),
          recipientId: payload.userId || event.actor.id,
          recipientName: payload.userName || 'User',
          recipientEmail: payload.userEmail || 'user@example.com',
          role: 'Buyer',
          category: 'Wallet Updated',
          channel: 'in_app',
          title: 'Wallet Balance Update',
          body: `Your digital wallet has been ${payload.type === 'CREDIT' ? 'credited' : 'debited'} with $${payload.amount}. New balance: $${payload.newBalance}.`,
          status: 'pending',
          priority: 'normal',
          timestamp,
          read: false,
          clicked: false,
          retryAttempts: 0,
          maxRetries: 3,
          metadata: { amount: payload.amount, balance: payload.newBalance },
        };
        await this.dispatcher(notif);
        break;
      }

      default:
        // Generic domain event handler for audit alerts
        if (event.domain === 'SECURITY' || event.eventType.includes('Alert')) {
          const alertNotif: NotificationRecord = {
            id: NotificationIdGenerator.generateNotificationId(),
            recipientId: 'ADMIN-001',
            recipientName: 'Security Admin',
            recipientEmail: 'security@commercezon.internal',
            role: 'Administrator',
            category: 'Security Alert',
            channel: 'sms',
            title: `Security Alert: ${event.eventType}`,
            body: `Security event detected in domain ${event.domain}: ${JSON.stringify(payload).substring(0, 100)}`,
            status: 'pending',
            priority: 'critical',
            timestamp,
            read: false,
            clicked: false,
            retryAttempts: 0,
            maxRetries: 5,
            metadata: { eventType: event.eventType },
          };
          await this.dispatcher(alertNotif);
        }
        break;
    }
  }
}
