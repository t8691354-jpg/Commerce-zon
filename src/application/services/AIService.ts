import { aiGateway, AIGateway } from '../../infrastructure/ai/gateway/AIGateway';
import { AICompletionRequest, AICompletionResponse } from '../../domain/ai/AITypes';
import { logger } from '../../infrastructure/logging/Logger';

export class AIService {
  private gateway: AIGateway = aiGateway;

  async generateContent(prompt: string, context?: string): Promise<string> {
    logger.info('AIService delegating request to AIGateway', 'AIService', { promptLength: prompt.length });
    const response = await this.gateway.processRequest({
      prompt,
      systemPrompt: context,
    });
    return response.text;
  }

  async processGatewayRequest(req: AICompletionRequest): Promise<AICompletionResponse> {
    return this.gateway.processRequest(req);
  }

  async recommendProduct(prompt: string, category?: string): Promise<{ reason: string; suggestedPrice?: number }> {
    logger.info('AIService executing product recommendation via AIGateway', 'AIService', { prompt, category });
    const response = await this.gateway.processRequest({
      prompt,
      templateId: 'tpl-product-recommendation',
      templateVars: {
        userQuery: prompt,
        category: category || 'General Marketplace',
        budgetMax: 500,
      },
    });

    return {
      reason: response.text,
      suggestedPrice: 249.99,
    };
  }
}

export const aiService = new AIService();
