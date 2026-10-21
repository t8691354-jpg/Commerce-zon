/**
 * Enterprise Provider-Independent Messaging Adapter Interface
 * Abstraction layer for Email, SMS, Push, and In-App delivery providers
 */

import { NotificationChannel, DeliveryStatus } from '../../types/notifications';

export interface DispatchMessageRequest {
  notificationId: string;
  recipientId: string;
  recipientName: string;
  recipientEmail?: string;
  recipientPhone?: string;
  title: string;
  body: string;
  htmlBody?: string;
  channel: NotificationChannel;
  priority: 'low' | 'normal' | 'high' | 'critical';
  metadata?: Record<string, any>;
}

export interface DispatchMessageResponse {
  success: boolean;
  messageId: string;
  provider: string;
  status: DeliveryStatus;
  deliveredAt?: string;
  errorMessage?: string;
}

export interface IMessagingAdapter {
  channel: NotificationChannel;
  providerName: string;
  dispatch(request: DispatchMessageRequest): Promise<DispatchMessageResponse>;
  checkStatus(messageId: string): Promise<DeliveryStatus>;
}
