/**
 * Enterprise Notification & Communication Application Service
 * Central Orchestrator for Multi-Channel Messaging, User Preferences, Delivery Tracking, Admin Broadcasts, and Event Listeners
 */

import {
  NotificationItem,
  NotificationTemplate,
  Campaign,
  UserNotificationPreference,
  ChannelControlConfig,
  QueueStatusMetrics,
  NotificationRole,
  NotificationChannel,
  DeliveryStatus
} from '../../types/notifications';
import { ICommunicationRepository, NotificationSearchFilter, PaginatedNotifications } from '../../domain/communication/ICommunicationRepository';
import { NotificationRepository } from '../../infrastructure/repositories/NotificationRepository';
import { MessagingAdapterFactory } from '../../domain/communication/MessagingAdapters';
import { UserPreferenceEngine } from '../../domain/communication/UserPreferenceEngine';
import { DeliveryEngine } from '../../domain/communication/DeliveryEngine';
import { TemplateEngine, RenderedMessage } from '../../domain/communication/TemplateEngine';
import { AdminMessagingEngine, AdminBroadcastRequest } from '../../domain/communication/AdminMessagingEngine';
import { AICommunicationOptimizer } from '../../domain/communication/AICommunicationOptimizer';
import { EventNotificationListener } from '../../domain/communication/EventNotificationListener';
import { NotificationRecord, NotificationIdGenerator } from '../../domain/communication/NotificationEntity';
import { eventBus } from '../../lib/eventBus';
import { logger } from '../../infrastructure/logging/Logger';

export class NotificationService {
  private repository: ICommunicationRepository;

  constructor(repository?: ICommunicationRepository) {
    this.repository = repository || new NotificationRepository();

    // Auto-register Event-Driven Notification Listener
    EventNotificationListener.initialize(async (notifRecord: NotificationRecord) => {
      await this.sendNotification(notifRecord);
    });

    logger.info('[NotificationService] Initialized Enterprise Communication Service.', 'Application');
  }

  /**
   * Primary transactional dispatch entry point for multi-channel notifications
   */
  async sendNotification(record: Partial<NotificationRecord> & { recipientId: string; title: string; body: string }): Promise<NotificationItem> {
    const timestamp = new Date().toISOString();
    const id = record.id || NotificationIdGenerator.generateNotificationId();
    const role: NotificationRole = record.role || 'Buyer';
    const category = record.category || 'General';
    let channel: NotificationChannel = record.channel || 'in_app';
    const priority = record.priority || 'normal';

    // Fetch recipient user preferences
    const prefs = await this.repository.getUserPreferences(record.recipientId);

    // Evaluate eligibility
    const eligibility = UserPreferenceEngine.evaluateEligibility(prefs, category, channel, priority);
    if (!eligibility.canDeliver) {
      if (eligibility.suggestedChannel) {
        channel = eligibility.suggestedChannel;
      } else {
        logger.info(`[NotificationService] Suppressed notification ${id} to ${record.recipientId}: ${eligibility.reason}`, 'NotificationService');
      }
    }

    const notifItem: NotificationItem = {
      id,
      recipientId: record.recipientId,
      recipientName: record.recipientName || 'Valued User',
      recipientEmail: record.recipientEmail || 'user@example.com',
      recipientPhone: record.recipientPhone,
      role,
      category,
      channel,
      title: record.title,
      body: record.body,
      htmlBody: record.htmlBody,
      status: 'sending',
      priority,
      timestamp,
      read: false,
      clicked: false,
      retryAttempts: 0,
      maxRetries: record.maxRetries || 3,
      metadata: record.metadata,
      campaignId: record.campaignId,
      templateId: record.templateId,
    };

    // Save initial sending state
    await this.repository.saveNotification(notifItem);

    // Dispatch via Provider Adapter
    const adapter = MessagingAdapterFactory.getAdapter(channel);
    try {
      const dispatchResult = await adapter.dispatch({
        notificationId: id,
        recipientId: record.recipientId,
        recipientName: notifItem.recipientName,
        recipientEmail: notifItem.recipientEmail,
        recipientPhone: notifItem.recipientPhone,
        title: record.title,
        body: record.body,
        htmlBody: record.htmlBody,
        channel,
        priority,
        metadata: record.metadata,
      });

      if (dispatchResult.success) {
        notifItem.status = 'delivered';
        notifItem.deliveredAt = dispatchResult.deliveredAt || new Date().toISOString();
      } else {
        const retryEval = DeliveryEngine.evaluateRetry(notifItem, dispatchResult.errorMessage || 'Unknown failure');
        notifItem.status = retryEval.newStatus;
        notifItem.errorLog = dispatchResult.errorMessage;
      }
    } catch (err: any) {
      const errMsg = String(err.message || err);
      const retryEval = DeliveryEngine.evaluateRetry(notifItem, errMsg);
      notifItem.status = retryEval.newStatus;
      notifItem.errorLog = errMsg;
    }

    const saved = await this.repository.saveNotification(notifItem);

    // Publish event
    eventBus.publish({
      id: NotificationIdGenerator.generateNotificationId(),
      eventType: saved.status === 'delivered' ? 'NotificationDelivered' : 'NotificationFailed',
      domain: 'COMMUNICATION',
      aggregateId: saved.id,
      timestamp: new Date().toISOString(),
      payload: {
        recipientId: saved.recipientId,
        channel: saved.channel,
        status: saved.status,
        category: saved.category,
      },
      actor: { type: 'SYSTEM', id: 'NOTIFICATION_SERVICE' },
    });

    return saved;
  }

  /**
   * Administrative Broadcast to target audiences
   */
  async sendAdminBroadcast(request: AdminBroadcastRequest): Promise<{ count: number; broadcastId: string }> {
    const mockRecipients = [
      { id: 'USR-8821', name: 'Alexander Wright', email: 'alex.wright@example.com', role: 'Buyer' as NotificationRole },
      { id: 'USR-3190', name: 'Emily Davis', email: 'emily.davis@example.com', role: 'Buyer' as NotificationRole },
      { id: 'SEL-1049', name: 'Nordic Home Goods', email: 'contact@nordichome.com', role: 'Seller' as NotificationRole },
      { id: 'SUP-5501', name: 'Shenzhen Microchip', email: 'orders@szmicrochip.cn', role: 'Supplier' as NotificationRole },
      { id: 'WRH-ONT8', name: 'FBA ONT8 Staff', email: 'ont8@fulfillment.com', role: 'Warehouse' as NotificationRole },
      { id: 'ADM-0001', name: 'Super Admin', email: 'admin@commercezon.com', role: 'Administrator' as NotificationRole },
    ];

    const records = AdminMessagingEngine.createBroadcastRecords(request, mockRecipients);

    for (const rec of records) {
      await this.sendNotification(rec);
    }

    const broadcastId = `BRD-${Date.now()}`;
    logger.info(`[NotificationService] Admin broadcast ${broadcastId} dispatched to ${records.length} recipients.`, 'NotificationService');

    return { count: records.length, broadcastId };
  }

  // ==========================================
  // READ / SEARCH NOTIFICATIONS
  // ==========================================

  async searchNotifications(filter: NotificationSearchFilter): Promise<PaginatedNotifications> {
    return this.repository.searchNotifications(filter);
  }

  async getAllNotifications(): Promise<NotificationItem[]> {
    const res = await this.repository.searchNotifications({ page: 1, limit: 1000 });
    return res.items;
  }

  async getNotificationById(id: string): Promise<NotificationItem | null> {
    return this.repository.getNotificationById(id);
  }

  async markAsRead(id: string): Promise<NotificationItem | null> {
    return this.repository.markAsRead(id);
  }

  async markAllAsRead(recipientId: string): Promise<number> {
    return this.repository.markAllAsRead(recipientId);
  }

  async getUnreadCount(recipientId: string): Promise<number> {
    return this.repository.getUnreadCount(recipientId);
  }

  // ==========================================
  // TEMPLATES
  // ==========================================

  async getTemplates(): Promise<NotificationTemplate[]> {
    return this.repository.getTemplates();
  }

  async getTemplateById(id: string): Promise<NotificationTemplate | null> {
    return this.repository.getTemplateById(id);
  }

  async saveTemplate(template: NotificationTemplate): Promise<NotificationTemplate> {
    return this.repository.saveTemplate(template);
  }

  renderTemplate(template: NotificationTemplate, variables: Record<string, any>): RenderedMessage {
    return TemplateEngine.renderTemplate(template, variables);
  }

  // ==========================================
  // CAMPAIGNS
  // ==========================================

  async getCampaigns(): Promise<Campaign[]> {
    return this.repository.getCampaigns();
  }

  async createCampaign(campaign: Campaign): Promise<Campaign> {
    return this.repository.saveCampaign(campaign);
  }

  // ==========================================
  // USER PREFERENCES
  // ==========================================

  async getUserPreferences(userId: string): Promise<UserNotificationPreference | null> {
    return this.repository.getUserPreferences(userId);
  }

  async saveUserPreferences(pref: UserNotificationPreference): Promise<UserNotificationPreference> {
    return this.repository.saveUserPreferences(pref);
  }

  // ==========================================
  // CHANNELS & METRICS
  // ==========================================

  async getChannelConfigs(): Promise<ChannelControlConfig[]> {
    return this.repository.getChannelConfigs();
  }

  async updateChannelConfig(
    id: NotificationChannel,
    updates: Partial<ChannelControlConfig>
  ): Promise<ChannelControlConfig | null> {
    return this.repository.updateChannelConfig(id, updates);
  }

  async getQueueMetrics(): Promise<QueueStatusMetrics[]> {
    return this.repository.getQueueMetrics();
  }

  // ==========================================
  // AI OPTIMIZER
  // ==========================================

  getAIOptimization(role: NotificationRole, category: string, bodyText: string) {
    const optimizer = AICommunicationOptimizer.optimizeDelivery(role, category, bodyText.length);
    const variations = AICommunicationOptimizer.generateVariations(bodyText, optimizer.recommendedTone);

    return {
      optimizer,
      subjectLineVariations: variations,
    };
  }
}

export const notificationService = new NotificationService();
