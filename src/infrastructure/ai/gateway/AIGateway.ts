import { AICompletionRequest, AICompletionResponse } from '../../../domain/ai/AITypes';
import { AISafetyEngine } from '../safety/AISafetyEngine';
import { AICacheManager } from '../cache/AICacheManager';
import { AIContextManager } from '../context/AIContextManager';
import { AIMemoryStore } from '../memory/AIMemoryStore';
import { PromptEngine } from '../prompts/PromptEngine';
import { AIToolExecutor } from '../tools/AIToolExecutor';
import { AIFailoverEngine } from '../failover/AIFailoverEngine';
import { AIAnalyticsTracker } from '../analytics/AIAnalyticsTracker';
import { logger } from '../../logging/Logger';

export class AIGateway {
  private failoverEngine: AIFailoverEngine;

  constructor() {
    this.failoverEngine = new AIFailoverEngine();
  }

  public async processRequest(req: AICompletionRequest): Promise<AICompletionResponse> {
    const traceId = `trace-ai-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const startTime = Date.now();

    logger.info(`AIGateway received request [${traceId}]`, 'AIGateway', { provider: req.providerId, model: req.modelId });

    // 1. Safety Assessment
    let rawPrompt = req.prompt;
    if (req.templateId) {
      rawPrompt = PromptEngine.interpolate(req.templateId, req.templateVars || {});
    }

    const safety = AISafetyEngine.assessPrompt(rawPrompt);
    if (!safety.isSafe) {
      throw new Error(`AI Safety Violation [Risk Score ${safety.riskScore}/100]: Prompt contains flagged content (${safety.flaggedCategories.join(', ')}).`);
    }

    const sanitizedPrompt = safety.sanitizedPrompt;

    // 2. Cache Lookup
    const cacheKey = AICacheManager.generateCacheKey(sanitizedPrompt, req.systemPrompt, req.modelId);
    if (req.enableCache !== false) {
      const cachedResponse = AICacheManager.get(cacheKey);
      if (cachedResponse) {
        AIAnalyticsTracker.recordRequest(cachedResponse);
        return cachedResponse;
      }
    }

    // 3. Tool Execution (if tools requested)
    const toolResults = [];
    if (req.tools && req.tools.length > 0) {
      for (const tName of req.tools) {
        const res = await AIToolExecutor.executeTool(tName, req.templateVars || {});
        toolResults.push(res);
      }
    }

    // 4. Memory & Context Enrichment
    const sessionId = req.sessionId || 'default-session';
    AIMemoryStore.addRecord(sessionId, 'user', sanitizedPrompt, req.userId);

    const context = AIContextManager.buildFullContextPrompt(sessionId, req.systemPrompt, sanitizedPrompt);

    // 5. Execute via Failover Engine
    const finalRequest: AICompletionRequest = {
      ...req,
      prompt: context.formattedUserPrompt,
      systemPrompt: context.systemContext,
    };

    const response = await this.failoverEngine.executeWithFailover(finalRequest, traceId);
    if (toolResults.length > 0) {
      response.toolResults = toolResults;
    }

    // 6. Record Response to Memory
    AIMemoryStore.addRecord(sessionId, 'assistant', response.text, req.userId);

    // 7. Record Analytics & Cost
    AIAnalyticsTracker.recordRequest(response);

    // 8. Store in Cache
    if (req.enableCache !== false && response.finishReason !== 'error') {
      AICacheManager.set(cacheKey, response);
    }

    logger.info(`AIGateway completed request [${traceId}] in ${Date.now() - startTime}ms`, 'AIGateway', {
      provider: response.providerId,
      cost: response.estimatedCostUSD,
    });

    return response;
  }
}

export const aiGateway = new AIGateway();
