/**
 * Commerce Zon Marketplace - Part 20: Real-Time Messaging, Notifications & Marketplace Communication Service
 * Handles Unified Notifications, Buyer-Seller Direct Messaging, Content Sanitization,
 * Message Moderation, Real-Time SSE Streams, Announcements, and Notification Preferences.
 */

import { Response } from 'express';
import {
  ConversationRecord,
  DirectMessageRecord,
  MarketplaceAnnouncement,
  NotificationPreferenceRecord,
  MessageModerationReport,
  RealTimeCommunicationEvent,
  UserParticipantRole,
} from '../../types/messaging';
import { NotificationItem } from '../../types/notifications';
import { notificationService } from './NotificationService';
import { auditService } from './AuditService';
import { logger } from '../../infrastructure/logging/Logger';

export class MarketplaceMessagingService {
  private conversations: Map<string, ConversationRecord> = new Map();
  private messages: Map<string, DirectMessageRecord[]> = new Map();
  private announcements: Map<string, MarketplaceAnnouncement> = new Map();
  private preferences: Map<string, NotificationPreferenceRecord> = new Map();
  private moderationReports: Map<string, MessageModerationReport> = new Map();

  // Active Server-Sent Events (SSE) subscriber connections
  private sseConnections: Map<string, Set<Response>> = new Map();

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    // Seed Conversation between buyer-01 and merch-01
    const convId = 'conv-2026-001';
    const now = new Date().toISOString();
    const conv: ConversationRecord = {
      conversationId: convId,
      participants: [
        { userId: 'buyer-01', userName: 'Alex Mercer', userRole: 'BUYER', unreadCount: 0 },
        { userId: 'merch-01', userName: 'Titan Robotics USA', userRole: 'SELLER', unreadCount: 1 },
      ],
      orderId: 'ord-seed-901',
      orderNumber: 'CZ-ORD-2026-901',
      productId: 'prod-01',
      productTitle: 'Titan Pro Robotic Arm Kit',
      lastMessageSnippet: 'Hello, what is the warranty period for this unit?',
      lastMessageTimestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      lastMessageSenderId: 'buyer-01',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    };
    this.conversations.set(convId, conv);

    const msgs: DirectMessageRecord[] = [
      {
        messageId: 'msg-seed-1',
        conversationId: convId,
        senderId: 'buyer-01',
        senderName: 'Alex Mercer',
        senderRole: 'BUYER',
        text: 'Hello, what is the warranty period for this unit?',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        isRead: false,
      },
    ];
    this.messages.set(convId, msgs);

    // Seed Announcement
    const annId = 'ann-2026-01';
    this.announcements.set(annId, {
      announcementId: annId,
      title: 'Global Express Logistics Network Upgrade',
      content:
        'Commerce Zon has completed deployment of dedicated air cargo transit lines between East Coast and European sorting facilities. Transit times on Express shipments are now reduced to 2 business days.',
      category: 'SHIPPING_UPDATE',
      priority: 'NORMAL',
      targetAudience: 'ALL',
      publishedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      isPublished: true,
      authorId: 'admin-super-01',
      authorName: 'Commerce Zon Executive Logistics Desk',
      dismissedByUserIds: [],
    });
  }

  // --------------------------------------------------------------------------
  // 1. REAL-TIME SERVER-SENT EVENTS (SSE) STREAMING & DISPATCH
  // --------------------------------------------------------------------------

  public registerSseConnection(userId: string, res: Response) {
    if (!userId) return;
    const conns = this.sseConnections.get(userId) || new Set();
    conns.add(res);
    this.sseConnections.set(userId, conns);

    logger.debug(`[MarketplaceMessagingService] SSE stream connected for user ${userId}. Total: ${conns.size}`);

    res.on('close', () => {
      const active = this.sseConnections.get(userId);
      if (active) {
        active.delete(res);
        if (active.size === 0) {
          this.sseConnections.delete(userId);
        }
      }
      logger.debug(`[MarketplaceMessagingService] SSE stream closed for user ${userId}.`);
    });
  }

  public dispatchRealTimeEvent(event: RealTimeCommunicationEvent) {
    const clients = this.sseConnections.get(event.recipientUserId);
    if (!clients || clients.size === 0) return;

    const dataString = `data: ${JSON.stringify(event)}\n\n`;
    clients.forEach((res) => {
      try {
        res.write(dataString);
      } catch (err) {
        logger.error(`Error writing SSE to user ${event.recipientUserId}:`, 'MarketplaceMessagingService', { err });
      }
    });
  }

  // --------------------------------------------------------------------------
  // 2. UNIFIED NOTIFICATIONS ENGINE
  // --------------------------------------------------------------------------

  public async getUserNotifications(userId: string): Promise<NotificationItem[]> {
    const all = await notificationService.getAllNotifications();
    return all.filter((n) => n.recipientId === userId || n.recipientId === 'ALL');
  }

  public async getUnreadNotificationCount(userId: string): Promise<number> {
    const userNotes = await this.getUserNotifications(userId);
    return userNotes.filter((n) => !n.read).length;
  }

  public async markNotificationAsRead(id: string): Promise<void> {
    await notificationService.markAsRead(id);
  }

  public async markAllNotificationsAsRead(userId: string): Promise<void> {
    const notes = await this.getUserNotifications(userId);
    for (const n of notes) {
      if (!n.read) {
        await notificationService.markAsRead(n.id);
      }
    }
  }

  // --------------------------------------------------------------------------
  // 3. BUYER-SELLER DIRECT MESSAGING
  // --------------------------------------------------------------------------

  public async startOrGetConversation(params: {
    buyerId: string;
    buyerName: string;
    sellerId: string;
    sellerName: string;
    orderId?: string;
    orderNumber?: string;
    productId?: string;
    productTitle?: string;
    initialMessage?: string;
  }): Promise<{ conversation: ConversationRecord; isNew: boolean }> {
    // Check if conversation already exists for this pair & product/order
    const existing = Array.from(this.conversations.values()).find((c) => {
      const hasBuyer = c.participants.some((p) => p.userId === params.buyerId);
      const hasSeller = c.participants.some((p) => p.userId === params.sellerId);
      const matchesOrder = params.orderId ? c.orderId === params.orderId : true;
      const matchesProduct = params.productId ? c.productId === params.productId : true;
      return hasBuyer && hasSeller && matchesOrder && matchesProduct;
    });

    if (existing) {
      return { conversation: existing, isNew: false };
    }

    const conversationId = `conv-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const now = new Date().toISOString();

    const newConv: ConversationRecord = {
      conversationId,
      participants: [
        { userId: params.buyerId, userName: params.buyerName, userRole: 'BUYER', unreadCount: 0 },
        { userId: params.sellerId, userName: params.sellerName, userRole: 'SELLER', unreadCount: 1 },
      ],
      orderId: params.orderId,
      orderNumber: params.orderNumber,
      productId: params.productId,
      productTitle: params.productTitle,
      lastMessageSnippet: params.initialMessage || 'Conversation started',
      lastMessageTimestamp: now,
      lastMessageSenderId: params.buyerId,
      createdAt: now,
      updatedAt: now,
    };

    this.conversations.set(conversationId, newConv);
    this.messages.set(conversationId, []);

    if (params.initialMessage) {
      await this.sendMessage({
        conversationId,
        senderId: params.buyerId,
        senderName: params.buyerName,
        senderRole: 'BUYER',
        text: params.initialMessage,
      });
    }

    return { conversation: newConv, isNew: true };
  }

  public getConversationsForUser(userId: string): ConversationRecord[] {
    return Array.from(this.conversations.values())
      .filter((c) => c.participants.some((p) => p.userId === userId))
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  public getConversationMessages(conversationId: string, requestingUserId: string): DirectMessageRecord[] {
    const conv = this.conversations.get(conversationId);
    if (!conv) throw new Error(`Conversation '${conversationId}' not found.`);

    // Enforce participant authorization: only participants can view messages
    const isParticipant = conv.participants.some((p) => p.userId === requestingUserId);
    if (!isParticipant && requestingUserId !== 'admin-super-01') {
      throw new Error('Forbidden: You are not an authorized participant in this conversation.');
    }

    // Reset unread count for requesting participant
    const participant = conv.participants.find((p) => p.userId === requestingUserId);
    if (participant) {
      participant.unreadCount = 0;
      participant.lastReadAt = new Date().toISOString();
    }

    return this.messages.get(conversationId) || [];
  }

  public async sendMessage(params: {
    conversationId: string;
    senderId: string;
    senderName: string;
    senderRole: UserParticipantRole;
    text: string;
    attachments?: string[];
  }): Promise<DirectMessageRecord> {
    const conv = this.conversations.get(params.conversationId);
    if (!conv) throw new Error(`Conversation '${params.conversationId}' not found.`);

    // Participant verification
    const isParticipant = conv.participants.some((p) => p.userId === params.senderId);
    if (!isParticipant && params.senderRole !== 'ADMIN') {
      throw new Error('Forbidden: Only authorized conversation participants can post messages.');
    }

    // Input sanitization & security limits
    if (!params.text || params.text.trim().length === 0) {
      throw new Error('Message text cannot be empty.');
    }
    if (params.text.length > 3000) {
      throw new Error('Message text exceeds maximum allowed length of 3000 characters.');
    }

    // Sanitize string (prevent stored XSS)
    const sanitizedText = params.text
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .trim();

    const now = new Date().toISOString();
    const messageId = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

    const newMsg: DirectMessageRecord = {
      messageId,
      conversationId: params.conversationId,
      senderId: params.senderId,
      senderName: params.senderName,
      senderRole: params.senderRole,
      text: sanitizedText,
      timestamp: now,
      isRead: false,
      attachments: params.attachments,
    };

    const msgs = this.messages.get(params.conversationId) || [];
    msgs.push(newMsg);
    this.messages.set(params.conversationId, msgs);

    // Update conversation metadata
    conv.lastMessageSnippet = sanitizedText.slice(0, 100);
    conv.lastMessageTimestamp = now;
    conv.lastMessageSenderId = params.senderId;
    conv.updatedAt = now;

    // Increment unread count for other participants
    conv.participants.forEach((p) => {
      if (p.userId !== params.senderId) {
        p.unreadCount += 1;
        // Real-time SSE dispatch to recipient
        this.dispatchRealTimeEvent({
          type: 'NEW_MESSAGE',
          recipientUserId: p.userId,
          payload: {
            conversationId: conv.conversationId,
            message: newMsg,
          },
          timestamp: now,
        });

        // Trigger in-app notification
        notificationService.sendNotification({
          recipientId: p.userId,
          role: p.userRole === 'SELLER' ? 'Seller' : 'Buyer',
          category: 'Messages',
          channel: 'in_app',
          title: `New Message from ${params.senderName}`,
          body: sanitizedText.slice(0, 120),
          priority: 'normal',
        });
      }
    });

    return newMsg;
  }

  // --------------------------------------------------------------------------
  // 4. MESSAGE REPORTING & MODERATION (ABUSE PREVENTION)
  // --------------------------------------------------------------------------

  public reportMessage(params: {
    messageId: string;
    conversationId: string;
    reporterUserId: string;
    reporterRole: UserParticipantRole;
    reason: MessageModerationReport['reason'];
    details: string;
  }): MessageModerationReport {
    const reportId = `REP-MSG-${Date.now().toString().slice(-6)}`;
    const now = new Date().toISOString();

    const report: MessageModerationReport = {
      reportId,
      messageId: params.messageId,
      conversationId: params.conversationId,
      reporterUserId: params.reporterUserId,
      reporterRole: params.reporterRole,
      reason: params.reason,
      details: params.details,
      status: 'PENDING_REVIEW',
      reportedAt: now,
    };

    this.moderationReports.set(reportId, report);

    // Flag the message in storage
    const msgs = this.messages.get(params.conversationId);
    if (msgs) {
      const target = msgs.find((m) => m.messageId === params.messageId);
      if (target) target.isFlagged = true;
    }

    auditService.recordEvent(
      'MOCK_USER',
      params.reporterUserId,
      'MESSAGE_REPORTED',
      'COMMUNICATION',
      `Reported message ${params.messageId} for ${params.reason}`
    );

    return report;
  }

  public getAllModerationReports(): MessageModerationReport[] {
    return Array.from(this.moderationReports.values()).sort(
      (a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime()
    );
  }

  // --------------------------------------------------------------------------
  // 5. MARKETPLACE ANNOUNCEMENTS
  // --------------------------------------------------------------------------

  public getActiveAnnouncements(userRole?: 'BUYER' | 'SELLER' | 'ADMIN'): MarketplaceAnnouncement[] {
    const list = Array.from(this.announcements.values()).filter((a) => a.isPublished);
    if (!userRole || userRole === 'ADMIN') return list;

    const target = userRole === 'BUYER' ? 'BUYERS' : 'SELLERS';
    return list.filter((a) => a.targetAudience === 'ALL' || a.targetAudience === target);
  }

  public createAnnouncement(params: {
    title: string;
    content: string;
    category: MarketplaceAnnouncement['category'];
    priority: MarketplaceAnnouncement['priority'];
    targetAudience: MarketplaceAnnouncement['targetAudience'];
    authorId: string;
    authorName: string;
  }): MarketplaceAnnouncement {
    const announcementId = `ann-${Date.now().toString().slice(-5)}`;
    const newAnn: MarketplaceAnnouncement = {
      announcementId,
      title: params.title,
      content: params.content,
      category: params.category,
      priority: params.priority,
      targetAudience: params.targetAudience,
      publishedAt: new Date().toISOString(),
      isPublished: true,
      authorId: params.authorId,
      authorName: params.authorName,
      dismissedByUserIds: [],
    };

    this.announcements.set(announcementId, newAnn);

    auditService.recordEvent(
      'SYSTEM',
      params.authorId,
      'ANNOUNCEMENT_PUBLISHED',
      'COMMUNICATION',
      `Published announcement: "${params.title}" (Audience: ${params.targetAudience})`
    );

    return newAnn;
  }

  // --------------------------------------------------------------------------
  // 6. NOTIFICATION PREFERENCES
  // --------------------------------------------------------------------------

  public getNotificationPreferences(userId: string): NotificationPreferenceRecord {
    const existing = this.preferences.get(userId);
    if (existing) return existing;

    const defaultPrefs: NotificationPreferenceRecord = {
      userId,
      orderUpdatesInApp: true,
      orderUpdatesEmail: true,
      shippingAlertsInApp: true,
      shippingAlertsSms: true,
      messagesInApp: true,
      supportTicketAlertsInApp: true,
      promotionsInApp: false,
      promotionsEmail: false,
      securityAlertsMandatory: true,
    };
    this.preferences.set(userId, defaultPrefs);
    return defaultPrefs;
  }

  public updateNotificationPreferences(
    userId: string,
    updates: Partial<NotificationPreferenceRecord>
  ): NotificationPreferenceRecord {
    const current = this.getNotificationPreferences(userId);
    const updated: NotificationPreferenceRecord = {
      ...current,
      ...updates,
      securityAlertsMandatory: true, // Cannot disable mandatory security alerts
    };
    this.preferences.set(userId, updated);
    return updated;
  }
}

export const marketplaceMessagingService = new MarketplaceMessagingService();
