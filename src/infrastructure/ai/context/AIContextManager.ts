import { AIMemoryStore } from '../memory/AIMemoryStore';

export class AIContextManager {
  public static buildFullContextPrompt(
    sessionId?: string,
    systemPrompt?: string,
    userPrompt?: string,
    maxContextTokens = 4000
  ): { systemContext: string; formattedUserPrompt: string } {
    let systemContext = systemPrompt || 'You are Commerce Zon Enterprise AI Platform Assistant.';

    if (sessionId) {
      const history = AIMemoryStore.getSessionHistory(sessionId, 6);
      if (history.length > 0) {
        const historyText = history
          .map((h) => `${h.role.toUpperCase()}: ${h.content}`)
          .join('\n');
        systemContext += `\n\n[Recent Conversation History]:\n${historyText}`;
      }
    }

    return {
      systemContext,
      formattedUserPrompt: userPrompt || '',
    };
  }
}
