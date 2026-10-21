/**
 * Enterprise Communication Repository Interface
 * Contracts for persisting notifications, templates, campaigns, preferences, and queue metrics
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

export interface NotificationSearchFilter {
  recipientId?: string;
  role?: NotificationRole;
  category?: string;
  channel?: NotificationChannel;
  status?: DeliveryStatus;
  unreadOnly?: boolean;
  query?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedNotifications {
  items: NotificationItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  unreadCount: number;
}

export interface ICommunicationRepository {
  // Notifications
  searchNotifications(filter: NotificationSearchFilter): Promise<PaginatedNotifications>;
  getNotificationById(id: string): Promise<NotificationItem | null>;
  saveNotification(notification: NotificationItem): Promise<NotificationItem>;
  markAsRead(id: string): Promise<NotificationItem | null>;
  markAllAsRead(recipientId: string): Promise<number>;
  getUnreadCount(recipientId: string): Promise<number>;
  deleteNotification(id: string): Promise<boolean>;

  // Templates
  getTemplates(): Promise<NotificationTemplate[]>;
  getTemplateById(id: string): Promise<NotificationTemplate | null>;
  saveTemplate(template: NotificationTemplate): Promise<NotificationTemplate>;

  // Campaigns
  getCampaigns(): Promise<Campaign[]>;
  getCampaignById(id: string): Promise<Campaign | null>;
  saveCampaign(campaign: Campaign): Promise<Campaign>;

  // User Preferences
  getUserPreferences(userId: string): Promise<UserNotificationPreference | null>;
  saveUserPreferences(pref: UserNotificationPreference): Promise<UserNotificationPreference>;

  // Channel Controls & Metrics
  getChannelConfigs(): Promise<ChannelControlConfig[]>;
  updateChannelConfig(id: NotificationChannel, updates: Partial<ChannelControlConfig>): Promise<ChannelControlConfig | null>;
  getQueueMetrics(): Promise<QueueStatusMetrics[]>;
}
