/**
 * Commerce Zon Marketplace - Part 20: Real-Time Messaging, Notifications & Marketplace Communication Types
 */

export type CommunicationChannel = 'in_app' | 'email' | 'sms' | 'push_web';

export type UserParticipantRole = 'BUYER' | 'SELLER' | 'ADMIN' | 'SUPPORT_AGENT';

export interface DirectMessageRecord {
  messageId: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserParticipantRole;
  text: string;
  timestamp: string;
  isRead: boolean;
  readAt?: string;
  attachments?: string[];
  isFlagged?: boolean;
}

export interface ConversationParticipant {
  userId: string;
  userName: string;
  userRole: UserParticipantRole;
  unreadCount: number;
  lastReadAt?: string;
}

export interface ConversationRecord {
  conversationId: string;
  participants: ConversationParticipant[];
  orderId?: string;
  orderNumber?: string;
  productId?: string;
  productTitle?: string;
  lastMessageSnippet: string;
  lastMessageTimestamp: string;
  lastMessageSenderId: string;
  createdAt: string;
  updatedAt: string;
  isArchived?: boolean;
  isFlagged?: boolean;
}

export interface MarketplaceAnnouncement {
  announcementId: string;
  title: string;
  content: string;
  category: 'MAINTENANCE' | 'SHIPPING_UPDATE' | 'POLICY_CHANGE' | 'SECURITY_ALERT' | 'PROMOTION';
  priority: 'NORMAL' | 'HIGH' | 'CRITICAL';
  targetAudience: 'ALL' | 'BUYERS' | 'SELLERS';
  publishedAt: string;
  expiresAt?: string;
  isPublished: boolean;
  authorId: string;
  authorName: string;
  dismissedByUserIds?: string[];
}

export interface NotificationPreferenceRecord {
  userId: string;
  orderUpdatesInApp: boolean;
  orderUpdatesEmail: boolean;
  shippingAlertsInApp: boolean;
  shippingAlertsSms: boolean;
  messagesInApp: boolean;
  supportTicketAlertsInApp: boolean;
  promotionsInApp: boolean;
  promotionsEmail: boolean;
  securityAlertsMandatory: true; // Cannot be disabled
}

export interface MessageModerationReport {
  reportId: string;
  messageId: string;
  conversationId: string;
  reporterUserId: string;
  reporterRole: UserParticipantRole;
  reason: 'SPAM' | 'HARASSMENT' | 'SCAM_OR_OFF_PLATFORM_PAYMENT' | 'INAPPROPRIATE_CONTENT' | 'OTHER';
  details: string;
  status: 'PENDING_REVIEW' | 'WARNED' | 'ACTION_TAKEN' | 'DISMISSED';
  reportedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface RealTimeCommunicationEvent {
  type: 'NEW_MESSAGE' | 'NOTIFICATION_ARRIVED' | 'TICKET_UPDATED' | 'ANNOUNCEMENT_BROADCAST';
  recipientUserId: string;
  payload: any;
  timestamp: string;
}
