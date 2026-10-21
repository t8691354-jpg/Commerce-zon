import { AICompletionResponse, AIProviderId } from '../../../domain/ai/AITypes';
import { ModelRegistry } from '../models/ModelRegistry';
import { logger } from '../../logging/Logger';

export class AICostEngine {
  private static dailySpendUSD = 0.048; // Initial baseline
  private static budgetCapUSD = 50.0;
  private static providerSpendUSD: Record<AIProviderId, number> = {
    google_gemini: 0.032,
    openai: 0.012,
    anthropic_claude: 0.004,
    deepseek: 0.000,
    grok: 0.000,
    fallback: 0.000,
  };

  public static recordUsageCost(response: AICompletionResponse): void {
    const cost = response.estimatedCostUSD;
    this.dailySpendUSD += cost;
    this.providerSpendUSD[response.providerId] = (this.providerSpendUSD[response.providerId] || 0) + cost;

    if (this.dailySpendUSD > this.budgetCapUSD) {
      logger.warn(`Daily AI budget cap threshold reached! Current spend: $${this.dailySpendUSD.toFixed(4)}`, 'AICostEngine');
    }
  }

  public static getCostSummary() {
    return {
      dailySpendUSD: Number(this.dailySpendUSD.toFixed(4)),
      budgetCapUSD: this.budgetCapUSD,
      budgetUtilizationPercent: Number(((this.dailySpendUSD / this.budgetCapUSD) * 100).toFixed(2)),
      providerSpendBreakdown: this.providerSpendUSD,
    };
  }
}
