export type NotificationRole = 
  | 'Buyer' 
  | 'Seller' 
  | 'Affiliate' 
  | 'Supplier' 
  | 'Warehouse' 
  | 'DeliveryPartner' 
  | 'Administrator';

export type NotificationChannel = 
  | 'in_app' 
  | 'email' 
  | 'sms' 
  | 'push_android' 
  | 'push_ios' 
  | 'push_web' 
  | 'whatsapp' 
  | 'telegram';

export type DeliveryStatus = 'pending' | 'queued' | 'sending' | 'delivered' | 'failed' | 'retrying' | 'bounced';

export interface NotificationItem {
  id: string;
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
  metadata?: Record<string, any>;
  campaignId?: string;
  templateId?: string;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  role: NotificationRole;
  category: string;
  channel: NotificationChannel;
  subject?: string;
  bodyText: string;
  bodyHtml?: string;
  variables: string[];
  language: string; // e.g. 'en-US', 'es-ES', 'de-DE', 'fr-FR', 'ja-JP'
  version: number;
  updatedAt: string;
  updatedBy: string;
  history?: Array<{
    version: number;
    updatedAt: string;
    updatedBy: string;
    changesSummary: string;
  }>;
}

export type CampaignType = 'promotional' | 'flash_sale' | 'product_launch' | 'seasonal' | 'holiday' | 'announcement';
export type CampaignSendMode = 'immediate' | 'scheduled' | 'recurring';

export interface Campaign {
  id: string;
  title: string;
  type: CampaignType;
  channel: NotificationChannel;
  sendMode: CampaignSendMode;
  status: 'draft' | 'scheduled' | 'running' | 'completed' | 'paused' | 'cancelled';
  targetRole: NotificationRole | 'All';
  segmentFilter: {
    country?: string;
    language?: string;
    membership?: 'Prime' | 'Standard' | 'VIP' | 'All';
    sellerPlan?: 'Professional' | 'Individual' | 'All';
    minSpent?: number;
    activityPeriod?: string;
  };
  templateId: string;
  scheduledAt?: string;
  recurrencePattern?: 'daily' | 'weekly' | 'monthly';
  totalRecipients: number;
  sentCount: number;
  deliveredCount: number;
  failedCount: number;
  openCount: number;
  clickCount: number;
  convertedCount: number;
  revenueGenerated: number;
  createdAt: string;
}

export interface UserNotificationPreference {
  userId: string;
  userName: string;
  role: NotificationRole;
  quietHours: {
    enabled: boolean;
    startTime: string; // "22:00"
    endTime: string;   // "07:00"
    timezone: string;  // "UTC", "EST", "PST"
  };
  channels: Record<NotificationChannel, boolean>;
  categories: Record<string, { email: boolean; sms: boolean; push: boolean; in_app: boolean }>;
  marketingOptIn: boolean;
  frequencyCapPerDay: number;
}

export interface ChannelControlConfig {
  id: NotificationChannel;
  name: string;
  enabled: boolean;
  provider: string; // e.g. "AWS SES", "Twilio", "Firebase FCM", "APNS", "OneSignal", "Meta WhatsApp API"
  dailyLimit: number;
  dailySentToday: number;
  throughputPerSec: number;
  retryMaxCount: number;
  backoffDelayMs: number;
  status: 'operational' | 'degraded' | 'maintenance' | 'disabled';
}

export interface QueueStatusMetrics {
  queueName: string;
  pendingJobs: number;
  processingWorkers: number;
  avgLatencyMs: number;
  deadLetterCount: number;
  throughputPerSec: number;
  health: 'healthy' | 'warning' | 'critical';
}

export interface AISendOptimizer {
  userSegment: string;
  predictedOptimalHour: number; // 0-23
  predictedOpenRatePct: number;
  priorityScore: number; // 1-100
  fatigueRisk: 'Low' | 'Medium' | 'High';
  recommendedChannel: NotificationChannel;
  recommendedTone: 'Urgent' | 'Friendly' | 'Professional' | 'Promotional';
}
