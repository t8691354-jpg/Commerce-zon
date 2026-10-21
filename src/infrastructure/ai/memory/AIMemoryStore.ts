import { AIMemoryRecord } from '../../../domain/ai/AITypes';
import { logger } from '../../logging/Logger';

export class AIMemoryStore {
  private static memories: Map<string, AIMemoryRecord[]> = new Map();
  private static userPreferences: Map<string, Record<string, any>> = new Map();

  public static addRecord(sessionId: string, role: 'user' | 'assistant' | 'system', content: string, userId?: string): AIMemoryRecord {
    const list = this.memories.get(sessionId) || [];
    const record: AIMemoryRecord = {
      id: `mem-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      sessionId,
      userId,
      role,
      content,
      timestamp: new Date().toISOString(),
      tokensEstimated: Math.ceil(content.length / 4),
    };

    list.push(record);
    this.memories.set(sessionId, list);

    // Enforce sliding window (keep last 30 messages max)
    if (list.length > 30) {
      this.memories.set(sessionId, list.slice(-30));
    }

    return record;
  }

  public static getSessionHistory(sessionId: string, maxMessages = 20): AIMemoryRecord[] {
    const list = this.memories.get(sessionId) || [];
    return list.slice(-maxMessages);
  }

  public static clearSession(sessionId: string): void {
    this.memories.delete(sessionId);
    logger.info(`Cleared AI memory session ${sessionId}`, 'AIMemoryStore');
  }

  public static setUserPreference(userId: string, key: string, value: any): void {
    const prefs = this.userPreferences.get(userId) || {};
    prefs[key] = value;
    this.userPreferences.set(userId, prefs);
  }

  public static getUserPreferences(userId: string): Record<string, any> {
    return this.userPreferences.get(userId) || {};
  }
}
