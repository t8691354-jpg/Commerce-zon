import { AISafetyAssessment } from '../../../domain/ai/AITypes';
import { logger } from '../../logging/Logger';

export class AISafetyEngine {
  private static injectionPatterns = [
    /ignore\s+(all\s+)?previous\s+instructions/i,
    /system\s+prompt\s+override/i,
    /jailbreak/i,
    /reveal\s+secret\s+key/i,
    /<script.*?>.*?<\/script>/i,
    /drop\s+table/i,
  ];

  public static assessPrompt(prompt: string, thresholdScore = 75): AISafetyAssessment {
    let riskScore = 0;
    const flaggedCategories: string[] = [];
    let sanitized = prompt;

    // 1. Check Prompt Injection Attack
    for (const pattern of this.injectionPatterns) {
      if (pattern.test(prompt)) {
        riskScore += 45;
        flaggedCategories.push('PROMPT_INJECTION_ATTEMPT');
        sanitized = sanitized.replace(pattern, '[REDACTED_INJECTION_ATTEMPT]');
      }
    }

    // 2. Detect PII (Credit Cards / SSN / Secret Keys)
    const creditCardRegex = /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13})\b/g;
    if (creditCardRegex.test(prompt)) {
      riskScore += 30;
      flaggedCategories.push('PII_CREDIT_CARD');
      sanitized = sanitized.replace(creditCardRegex, '[REDACTED_CARD_NUMBER]');
    }

    const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
    if (ssnRegex.test(prompt)) {
      riskScore += 30;
      flaggedCategories.push('PII_SSN');
      sanitized = sanitized.replace(ssnRegex, '[REDACTED_SSN]');
    }

    // Determine Action
    let actionTaken: 'PASSED' | 'SANITIZED' | 'BLOCKED' = 'PASSED';
    if (riskScore >= thresholdScore) {
      actionTaken = 'BLOCKED';
      logger.warn(`AI Safety Engine BLOCKED high-risk prompt (Score ${riskScore})`, 'AISafetyEngine', { flaggedCategories });
    } else if (flaggedCategories.length > 0) {
      actionTaken = 'SANITIZED';
      logger.info(`AI Safety Engine SANITIZED prompt (Score ${riskScore})`, 'AISafetyEngine', { flaggedCategories });
    }

    return {
      isSafe: actionTaken !== 'BLOCKED',
      riskScore,
      flaggedCategories,
      sanitizedPrompt: sanitized,
      actionTaken,
    };
  }
}
