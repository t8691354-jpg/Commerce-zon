/**
 * Enterprise Message Template Engine
 * Handles Dynamic Variable Substitution, Localization, Versioning, and Preview Generation
 */

import { NotificationTemplate } from '../../types/notifications';

export interface RenderedMessage {
  subject?: string;
  bodyText: string;
  bodyHtml?: string;
  templateId: string;
  version: number;
}

export class TemplateEngine {
  /**
   * Replaces Mustache-style placeholders {{variableName}} with actual values in values map.
   */
  public static renderTemplate(
    template: NotificationTemplate,
    variables: Record<string, string | number | boolean>
  ): RenderedMessage {
    let subject = template.subject || '';
    let bodyText = template.bodyText || '';
    let bodyHtml = template.bodyHtml || '';

    // Replace all dynamic variables
    Object.entries(variables).forEach(([key, val]) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      const valStr = String(val !== undefined && val !== null ? val : '');
      if (subject) subject = subject.replace(regex, valStr);
      bodyText = bodyText.replace(regex, valStr);
      if (bodyHtml) bodyHtml = bodyHtml.replace(regex, valStr);
    });

    // Strip unreplaced placeholders with fallback blank or warning
    const placeholderRegex = /{{\s*[a-zA-Z0-9_]+\s*}}/g;
    bodyText = bodyText.replace(placeholderRegex, '');
    if (bodyHtml) bodyHtml = bodyHtml.replace(placeholderRegex, '');
    if (subject) subject = subject.replace(placeholderRegex, '');

    return {
      subject,
      bodyText,
      bodyHtml: bodyHtml || `<div style="font-family: sans-serif; padding: 16px;">${bodyText}</div>`,
      templateId: template.id,
      version: template.version,
    };
  }

  /**
   * Validates required variables in template text.
   */
  public static validateVariables(templateText: string): string[] {
    const matches = templateText.match(/{{\s*([a-zA-Z0-9_]+)\s*}}/g) || [];
    const vars = matches.map(m => m.replace(/[{}]/g, '').trim());
    return Array.from(new Set(vars));
  }
}
