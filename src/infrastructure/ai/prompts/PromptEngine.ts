import { PromptTemplate } from '../../../domain/ai/AITypes';
import { logger } from '../../logging/Logger';

export class PromptEngine {
  private static templates: Map<string, PromptTemplate> = new Map([
    [
      'tpl-product-recommendation',
      {
        id: 'tpl-product-recommendation',
        name: 'Marketplace Product Recommendation',
        category: 'MARKETPLACE',
        version: 2,
        description: 'Generates targeted product recommendations with pricing and velocity metrics.',
        requiredVariables: ['userQuery', 'category', 'budgetMax'],
        rawTemplate:
          'You are Commerce Zon AI Marketplace Advisor. Analyze category "{{category}}" for query "{{userQuery}}". Suggest top products under budget ${{budgetMax}} with profit margin and delivery estimate.',
        updatedAt: new Date().toISOString(),
      },
    ],
    [
      'tpl-competitor-analysis',
      {
        id: 'tpl-competitor-analysis',
        name: 'Amazon vs. Commerce Zon Competitor Benchmark',
        category: 'ANALYTICS',
        version: 1,
        description: 'Compares seller product listings against top Amazon buy box pricing.',
        requiredVariables: ['productTitle', 'ourPrice', 'amazonBuyBoxPrice'],
        rawTemplate:
          'Perform buy-box competition analysis for product "{{productTitle}}". Our price: ${{ourPrice}}, Amazon price: ${{amazonBuyBoxPrice}}. Recommend price adjustments and margin impact.',
        updatedAt: new Date().toISOString(),
      },
    ],
    [
      'tpl-inventory-forecasting',
      {
        id: 'tpl-inventory-forecasting',
        name: 'Multi-Warehouse Inventory Stock Predictor',
        category: 'LOGISTICS',
        version: 3,
        description: 'Calculates stock replenishment dates and reorder quantities across regional FBA hubs.',
        requiredVariables: ['warehouseId', 'currentStock', 'dailyBurnRate'],
        rawTemplate:
          'Analyze warehouse "{{warehouseId}}" with current stock {{currentStock}} units and daily burn rate {{dailyBurnRate}} units/day. Calculate stockout risk in days and recommended reorder quantity.',
        updatedAt: new Date().toISOString(),
      },
    ],
    [
      'tpl-customer-support',
      {
        id: 'tpl-customer-support',
        name: 'Enterprise Customer Support Dispute Auto-Resolver',
        category: 'SUPPORT',
        version: 1,
        description: 'Drafts empathetic, policy-compliant responses for customer disputes or refunds.',
        requiredVariables: ['customerName', 'issueDescription', 'orderStatus'],
        rawTemplate:
          'Customer "{{customerName}}" reports issue: "{{issueDescription}}". Order status: "{{orderStatus}}". Draft a professional support resolution offering replacement or wallet refund per Commerce Zon SLA.',
        updatedAt: new Date().toISOString(),
      },
    ],
  ]);

  public static getTemplates(): PromptTemplate[] {
    return Array.from(this.templates.values());
  }

  public static getTemplate(id: string): PromptTemplate | undefined {
    return this.templates.get(id);
  }

  public static registerTemplate(template: PromptTemplate): void {
    this.templates.set(template.id, template);
    logger.info(`Registered prompt template ${template.id} (v${template.version})`, 'PromptEngine');
  }

  public static interpolate(templateId: string, vars: Record<string, any>): string {
    const tpl = this.templates.get(templateId);
    if (!tpl) {
      throw new Error(`Prompt template '${templateId}' not found in registry.`);
    }

    let rendered = tpl.rawTemplate;
    for (const reqVar of tpl.requiredVariables) {
      if (vars[reqVar] === undefined) {
        logger.warn(`Missing required prompt variable '${reqVar}' for template '${templateId}'`, 'PromptEngine');
      }
    }

    for (const [key, value] of Object.entries(vars)) {
      rendered = rendered.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), String(value));
    }

    return this.compressPrompt(rendered);
  }

  public static compressPrompt(text: string): string {
    return text.replace(/\s+/g, ' ').trim();
  }
}
