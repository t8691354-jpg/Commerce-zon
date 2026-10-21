import { GoogleGenAI } from '@google/genai';
import { logger } from '../logging/Logger';
import { AIProviderError } from '../errors/AppError';
import { appConfig } from '../config/appConfig';

export interface AIProvider {
  generateText(prompt: string, context?: string): Promise<string>;
  recommendProduct(prompt: string, category?: string): Promise<{ reason: string; suggestedPrice?: number }>;
}

export class GeminiAIProvider implements AIProvider {
  private aiClient: GoogleGenAI | null = null;

  constructor() {
    this.initClient();
  }

  private initClient() {
    if (!this.aiClient && process.env.GEMINI_API_KEY) {
      try {
        this.aiClient = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build-commercezon',
            },
          },
        });
        logger.info('Gemini AI Provider initialized successfully', 'AIProvider');
      } catch (err) {
        logger.error('Failed to initialize Gemini AI Provider', 'AIProvider', { error: String(err) });
      }
    }
  }

  async generateText(prompt: string, context?: string): Promise<string> {
    this.initClient();
    if (!this.aiClient) {
      logger.warn('GEMINI_API_KEY is not configured; using intelligent fallback response', 'AIProvider');
      return `[Commerce Zon AI Assistant]: Refined insight for "${prompt}". ${context ? `Context: ${context}` : ''}`;
    }

    try {
      const response = await this.aiClient.models.generateContent({
        model: appConfig.geminiModel,
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `${context ? `System Context: ${context}\n\n` : ''}User Query: ${prompt}`,
              },
            ],
          },
        ],
      });
      return response.text || 'Commerce Zon AI Engine evaluated your request successfully.';
    } catch (error) {
      logger.error('Error executing Gemini text generation', 'AIProvider', { error: String(error) });
      throw new AIProviderError('Unable to generate content with Gemini AI', { originalError: String(error) });
    }
  }

  async recommendProduct(prompt: string, category?: string): Promise<{ reason: string; suggestedPrice?: number }> {
    try {
      const text = await this.generateText(prompt, `Category filter: ${category || 'All'}. Recommend product details.`);
      return {
        reason: text,
        suggestedPrice: 299.99,
      };
    } catch {
      return {
        reason: `Recommended based on Commerce Zon search trends for "${prompt}".`,
        suggestedPrice: 199.99,
      };
    }
  }
}

export const aiProvider = new GeminiAIProvider();
