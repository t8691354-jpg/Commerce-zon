/**
 * Enterprise Communication Platform
 * Notification & Message Entity Models
 */

import { NotificationRole, NotificationChannel, DeliveryStatus } from '../../types/notifications';

export interface DeliveryAttempt {
  attemptNumber: number;
  channel: NotificationChannel;
  timestamp: string;
  status: DeliveryStatus;
  provider: string;
  error?: string;
}

export interface NotificationRecord {
  id: string; // e.g. NTF-20260730-XXXXX
  recipientId: string;
  recipientName: string;
  recipientEmail: string;
  recipientPhone?: string;
  role: NotificationRole;
  category: string;
  channel: NotificationChannel;
  title: string;
  body: string;
  htmlBody?: string;
  status: DeliveryStatus;
  priority: 'low' | 'normal' | 'high' | 'critical';
  timestamp: string;
  deliveredAt?: string;
  readAt?: string;
  clickedAt?: string;
  read: boolean;
  clicked: boolean;
  retryAttempts: number;
  maxRetries: number;
  errorLog?: string;
  attemptsHistory?: DeliveryAttempt[];
  metadata?: Record<string, any>;
  campaignId?: string;
  templateId?: string;
}

export class NotificationIdGenerator {
  public static generateNotificationId(): string {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `NTF-${today}-${rand}`;
  }

  public static generateMessageId(channelPrefix: string = 'MSG'): string {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `${channelPrefix}-${today}-${rand}`;
  }
}
