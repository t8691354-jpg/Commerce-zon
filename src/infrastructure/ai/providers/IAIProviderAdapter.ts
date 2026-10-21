import { AICompletionRequest, AICompletionResponse, AIProviderId } from '../../../domain/ai/AITypes';

export interface IAIProviderAdapter {
  providerId: AIProviderId;
  name: string;
  isAvailable(): boolean;
  executeCompletion(req: AICompletionRequest, traceId: string): Promise<AICompletionResponse>;
}
