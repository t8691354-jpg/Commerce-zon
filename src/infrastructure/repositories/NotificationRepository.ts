/**
 * Enterprise Communication Repository Implementation
 * Handles in-memory & persistent storage for Notifications, Templates, Campaigns, User Preferences, Channels, and Metrics
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
import {
  ICommunicationRepository,
  NotificationSearchFilter,
  PaginatedNotifications
} from '../../domain/communication/ICommunicationRepository';
import {
  INITIAL_NOTIFICATIONS,
  INITIAL_TEMPLATES,
  INITIAL_CAMPAIGNS,
  INITIAL_USER_PREFERENCES,
  INITIAL_CHANNELS,
  INITIAL_QUEUE_METRICS
} from '../../data/mockNotificationsData';
import { logger } from '../logging/Logger';

export class NotificationRepository implements ICommunicationRepository {
  private notifications: Map<string, NotificationItem> = new Map();
  private templates: Map<string, NotificationTemplate> = new Map();
  private campaigns: Map<string, Campaign> = new Map();
  private preferences: Map<string, UserNotificationPreference> = new Map();
  private channelConfigs: Map<NotificationChannel, ChannelControlConfig> = new Map();
  private queueMetrics: QueueStatusMetrics[] = [];

  constructor() {
    this.seedData();
  }

  private seedData(): void {
    // Seed Notifications
    (INITIAL_NOTIFICATIONS || []).forEach(notif => {
      this.notifications.set(notif.id, { ...notif });
    });

    // Seed Templates
    (INITIAL_TEMPLATES || []).forEach(tpl => {
      this.templates.set(tpl.id, { ...tpl });
    });

    // Seed Campaigns
    (INITIAL_CAMPAIGNS || []).forEach(cmp => {
      this.campaigns.set(cmp.id, { ...cmp });
    });

    // Seed Preferences
    if (INITIAL_USER_PREFERENCES) {
      this.preferences.set(INITIAL_USER_PREFERENCES.userId, { ...INITIAL_USER_PREFERENCES });
    }

    // Seed Channels
    (INITIAL_CHANNELS || []).forEach(ch => {
      this.channelConfigs.set(ch.id, { ...ch });
    });

    // Seed Queue Metrics
    this.queueMetrics = INITIAL_QUEUE_METRICS ? [...INITIAL_QUEUE_METRICS] : [];

    logger.info(`[NotificationRepository] Seeded ${this.notifications.size} notifications, ${this.templates.size} templates, ${this.campaigns.size} campaigns.`, 'Infrastructure');
  }

  // ==========================================
  // NOTIFICATIONS
  // ==========================================

  async searchNotifications(filter: NotificationSearchFilter): Promise<PaginatedNotifications> {
    let list = Array.from(this.notifications.values());

    if (filter.recipientId) {
      list = list.filter(n => n.recipientId.toLowerCase() === filter.recipientId!.toLowerCase());
    }

    if (filter.role) {
      list = list.filter(n => n.role === filter.role);
    }

    if (filter.category) {
      list = list.filter(n => n.category.toLowerCase() === filter.category!.toLowerCase());
    }

    if (filter.channel) {
      list = list.filter(n => n.channel === filter.channel);
    }

    if (filter.status) {
      list = list.filter(n => n.status === filter.status);
    }

    if (filter.unreadOnly) {
      list = list.filter(n => !n.read);
    }

    if (filter.query) {
      const q = filter.query.toLowerCase();
      list = list.filter(
        n =>
          n.title.toLowerCase().includes(q) ||
          n.body.toLowerCase().includes(q) ||
          n.recipientName.toLowerCase().includes(q) ||
          n.id.toLowerCase().includes(q)
      );
    }

    // Sort newest first
    list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const page = filter.page || 1;
    const limit = filter.limit || 20;
    const total = list.length;
    const totalPages = Math.ceil(total / limit) || 1;

    const startIndex = (page - 1) * limit;
    const paginatedItems = list.slice(startIndex, startIndex + limit);

    const unreadCount = list.filter(n => !n.read).length;

    return {
      items: paginatedItems,
      total,
      page,
      limit,
      totalPages,
      unreadCount,
    };
  }

  async getNotificationById(id: string): Promise<NotificationItem | null> {
    return this.notifications.get(id) || null;
  }

  async saveNotification(notification: NotificationItem): Promise<NotificationItem> {
    this.notifications.set(notification.id, { ...notification });
    return notification;
  }

  async markAsRead(id: string): Promise<NotificationItem | null> {
    const notif = this.notifications.get(id);
    if (!notif) return null;

    notif.read = true;
    notif.readAt = new Date().toISOString();
    this.notifications.set(id, notif);
    return notif;
  }

  async markAllAsRead(recipientId: string): Promise<number> {
    let updatedCount = 0;
    const now = new Date().toISOString();

    this.notifications.forEach((notif, id) => {
      if (notif.recipientId.toLowerCase() === recipientId.toLowerCase() && !notif.read) {
        notif.read = true;
        notif.readAt = now;
        this.notifications.set(id, notif);
        updatedCount++;
      }
    });

    return updatedCount;
  }

  async getUnreadCount(recipientId: string): Promise<number> {
    let count = 0;
    this.notifications.forEach(notif => {
      if (notif.recipientId.toLowerCase() === recipientId.toLowerCase() && !notif.read) {
        count++;
      }
    });
    return count;
  }

  async deleteNotification(id: string): Promise<boolean> {
    return this.notifications.delete(id);
  }

  // ==========================================
  // TEMPLATES
  // ==========================================

  async getTemplates(): Promise<NotificationTemplate[]> {
    return Array.from(this.templates.values());
  }

  async getTemplateById(id: string): Promise<NotificationTemplate | null> {
    return this.templates.get(id) || null;
  }

  async saveTemplate(template: NotificationTemplate): Promise<NotificationTemplate> {
    this.templates.set(template.id, { ...template });
    return template;
  }

  // ==========================================
  // CAMPAIGNS
  // ==========================================

  async getCampaigns(): Promise<Campaign[]> {
    return Array.from(this.campaigns.values());
  }

  async getCampaignById(id: string): Promise<Campaign | null> {
    return this.campaigns.get(id) || null;
  }

  async saveCampaign(campaign: Campaign): Promise<Campaign> {
    this.campaigns.set(campaign.id, { ...campaign });
    return campaign;
  }

  // ==========================================
  // USER PREFERENCES
  // ==========================================

  async getUserPreferences(userId: string): Promise<UserNotificationPreference | null> {
    return this.preferences.get(userId) || null;
  }

  async saveUserPreferences(pref: UserNotificationPreference): Promise<UserNotificationPreference> {
    this.preferences.set(pref.userId, { ...pref });
    return pref;
  }

  // ==========================================
  // CHANNEL CONTROLS & METRICS
  // ==========================================

  async getChannelConfigs(): Promise<ChannelControlConfig[]> {
    return Array.from(this.channelConfigs.values());
  }

  async updateChannelConfig(
    id: NotificationChannel,
    updates: Partial<ChannelControlConfig>
  ): Promise<ChannelControlConfig | null> {
    const existing = this.channelConfigs.get(id);
    if (!existing) return null;

    const updated = { ...existing, ...updates };
    this.channelConfigs.set(id, updated);
    return updated;
  }

  async getQueueMetrics(): Promise<QueueStatusMetrics[]> {
    return [...this.queueMetrics];
  }
}
