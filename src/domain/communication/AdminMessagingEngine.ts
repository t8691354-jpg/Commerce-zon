/**
 * Enterprise Admin Messaging & Broadcast Engine
 * Supports System Announcements, Emergency Alerts, Maintenance Notices, and Audience Targeting
 */

import { NotificationRole, NotificationChannel } from '../../types/notifications';
import { NotificationRecord, NotificationIdGenerator } from './NotificationEntity';

export interface AdminBroadcastRequest {
  title: string;
  body: string;
  htmlBody?: string;
  targetRole: NotificationRole | 'All';
  category?: string;
  channel?: NotificationChannel;
  priority?: 'normal' | 'high' | 'critical';
  scheduledAt?: string;
  adminId: string;
}

export class AdminMessagingEngine {
  /**
   * Generates broadcast notification records for specified recipient list based on target role.
   */
  public static createBroadcastRecords(
    request: AdminBroadcastRequest,
    recipients: Array<{ id: string; name: string; email: string; phone?: string; role: NotificationRole }>
  ): NotificationRecord[] {
    const timestamp = new Date().toISOString();
    const priority = request.priority || 'high';
    const category = request.category || 'System Announcement';
    const channel = request.channel || 'in_app';

    const filteredRecipients = recipients.filter(
      r => request.targetRole === 'All' || r.role === request.targetRole
    );

    return filteredRecipients.map(recipient => ({
      id: NotificationIdGenerator.generateNotificationId(),
      recipientId: recipient.id,
      recipientName: recipient.name,
      recipientEmail: recipient.email,
      recipientPhone: recipient.phone,
      role: recipient.role,
      category,
      channel,
      title: request.title,
      body: request.body,
      htmlBody: request.htmlBody,
      status: 'pending',
      priority,
      timestamp,
      read: false,
      clicked: false,
      retryAttempts: 0,
      maxRetries: 3,
      metadata: {
        broadcast: true,
        sentByAdmin: request.adminId,
        targetRole: request.targetRole,
      },
    }));
  }
}
