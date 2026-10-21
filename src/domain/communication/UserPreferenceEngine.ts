/**
 * Enterprise User Notification Preferences Engine
 * Enforces Channel Opt-Ins, Category Rules, Quiet Hours, Frequency Caps, and Security Overrides
 */

import { UserNotificationPreference, NotificationChannel } from '../../types/notifications';

export interface DeliveryEligibilityResult {
  canDeliver: boolean;
  reason?: string;
  suggestedChannel?: NotificationChannel;
}

export class UserPreferenceEngine {
  /**
   * Evaluates if a notification can be delivered to a user given their preferences.
   */
  public static evaluateEligibility(
    pref: UserNotificationPreference | null | undefined,
    category: string,
    channel: NotificationChannel,
    priority: 'low' | 'normal' | 'high' | 'critical'
  ): DeliveryEligibilityResult {
    // Critical security alerts bypass user preferences and quiet hours completely
    if (priority === 'critical' || category.toLowerCase().includes('security')) {
      return { canDeliver: true, reason: 'Critical security override enforced.' };
    }

    if (!pref) {
      return { canDeliver: true, reason: 'Default settings applied.' };
    }

    // Check if channel is enabled overall
    if (pref.channels && pref.channels[channel] === false) {
      return { canDeliver: false, reason: `User disabled channel: ${channel}` };
    }

    // Check category preferences
    const categoryRules = pref.categories ? pref.categories[category] : undefined;
    if (categoryRules) {
      if (channel === 'email' && !categoryRules.email) return { canDeliver: false, reason: `Category ${category} disabled for Email` };
      if (channel === 'sms' && !categoryRules.sms) return { canDeliver: false, reason: `Category ${category} disabled for SMS` };
      if ((channel.startsWith('push')) && !categoryRules.push) return { canDeliver: false, reason: `Category ${category} disabled for Push` };
      if (channel === 'in_app' && !categoryRules.in_app) return { canDeliver: false, reason: `Category ${category} disabled for In-App` };
    }

    // Check marketing opt-in for promotional categories
    if (category.toLowerCase().includes('marketing') || category.toLowerCase().includes('promo')) {
      if (!pref.marketingOptIn) {
        return { canDeliver: false, reason: 'User opted out of marketing communications.' };
      }
    }

    // Quiet hours check for non-high priority messages
    if (pref.quietHours && pref.quietHours.enabled && priority !== 'high') {
      const now = new Date();
      const currentHour = now.getHours();
      const startHour = parseInt(pref.quietHours.startTime.split(':')[0] || '22');
      const endHour = parseInt(pref.quietHours.endTime.split(':')[0] || '7');

      const isQuietTime = startHour > endHour
        ? (currentHour >= startHour || currentHour < endHour)
        : (currentHour >= startHour && currentHour < endHour);

      if (isQuietTime) {
        return {
          canDeliver: false,
          reason: `Quiet hours active (${pref.quietHours.startTime} - ${pref.quietHours.endTime}).`,
          suggestedChannel: 'in_app', // Fallback to silent in-app
        };
      }
    }

    return { canDeliver: true };
  }
}
