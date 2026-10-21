/**
 * Enterprise Delivery & Intelligent Retry Engine
 * Manages Delivery Status Transitions, Exponential Backoff, and Dead-Letter Queue Handling
 */

import { DeliveryStatus, NotificationItem } from '../../types/notifications';
import { NotificationRecord, DeliveryAttempt } from './NotificationEntity';

export interface RetryEvaluationResult {
  shouldRetry: boolean;
  nextAttemptMs?: number;
  newStatus: DeliveryStatus;
  isDeadLetter: boolean;
}

export class DeliveryEngine {
  /**
   * Calculates next exponential backoff delay based on attempt count.
   */
  public static calculateBackoff(attempt: number, baseDelayMs: number = 1000): number {
    return Math.min(baseDelayMs * Math.pow(2, attempt), 60000); // Max 1 min delay
  }

  /**
   * Evaluates if a failed notification should be retried or moved to Dead-Letter Queue.
   */
  public static evaluateRetry(
    notification: NotificationRecord | NotificationItem,
    error: string,
    baseDelayMs: number = 1000
  ): RetryEvaluationResult {
    const currentAttempts = notification.retryAttempts + 1;
    const maxRetries = notification.maxRetries || 3;

    if (currentAttempts < maxRetries) {
      const nextAttemptMs = this.calculateBackoff(currentAttempts, baseDelayMs);
      return {
        shouldRetry: true,
        nextAttemptMs,
        newStatus: 'retrying',
        isDeadLetter: false,
      };
    }

    return {
      shouldRetry: false,
      newStatus: 'failed',
      isDeadLetter: true,
    };
  }

  /**
   * Adds a delivery attempt log to the notification.
   */
  public static createAttemptRecord(
    attemptNumber: number,
    channel: NotificationItem['channel'],
    status: DeliveryStatus,
    provider: string,
    error?: string
  ): DeliveryAttempt {
    return {
      attemptNumber,
      channel,
      timestamp: new Date().toISOString(),
      status,
      provider,
      error,
    };
  }
}
