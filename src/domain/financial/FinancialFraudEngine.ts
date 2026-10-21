/**
 * Enterprise Sentinel Financial Fraud Guard
 * Risk Scoring, Velocity Checking, Duplicate Payment Protection & Account Abuse Detection
 */

export interface FraudRiskEvaluation {
  riskScore: number; // 0 (Lowest) - 100 (Critical High Risk)
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  passedVelocityCheck: boolean;
  isDuplicatePayment: boolean;
  reasons: string[];
  recommendation: 'ALLOW' | 'REVIEW' | 'BLOCK';
}

export class FinancialFraudEngine {
  private static recentPaymentsCache: Map<string, { timestamp: number; amount: number }> = new Map();

  /**
   * Evaluates financial fraud risk for a payment request.
   */
  public static evaluatePaymentRisk(payload: {
    customerId: string;
    amount: number;
    paymentMethod: string;
    ipAddress?: string;
    idempotencyKey?: string;
    shippingCountry?: string;
    billingCountry?: string;
  }): FraudRiskEvaluation {
    const reasons: string[] = [];
    let riskScore = 5; // Baseline low risk

    // 1. High transaction amount check
    if (payload.amount > 10000) {
      riskScore += 30;
      reasons.push('High transaction volume exceeds $10,000 threshold.');
    } else if (payload.amount > 2500) {
      riskScore += 15;
      reasons.push('Elevated order value ($2,500+).');
    }

    // 2. Mismatched shipping vs billing country
    if (payload.shippingCountry && payload.billingCountry && payload.shippingCountry !== payload.billingCountry) {
      riskScore += 25;
      reasons.push(`Cross-border mismatch: Shipping (${payload.shippingCountry}) vs Billing (${payload.billingCountry}).`);
    }

    // 3. Velocity Check (Multiple rapid orders within 60 seconds)
    const now = Date.now();
    const lastPayment = this.recentPaymentsCache.get(payload.customerId);
    let passedVelocityCheck = true;
    let isDuplicatePayment = false;

    if (lastPayment) {
      const timeDiffSeconds = (now - lastPayment.timestamp) / 1000;
      if (timeDiffSeconds < 15) {
        riskScore += 45;
        passedVelocityCheck = false;
        reasons.push(`Rapid transaction velocity: Multiple attempts within ${Math.round(timeDiffSeconds)} seconds.`);
      }

      if (timeDiffSeconds < 60 && lastPayment.amount === payload.amount) {
        isDuplicatePayment = true;
        riskScore += 50;
        reasons.push('Potential duplicate charge detected with identical payload.');
      }
    }

    // Update velocity tracking cache
    this.recentPaymentsCache.set(payload.customerId, { timestamp: now, amount: payload.amount });

    // Determine Risk Level & Recommendation
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    let recommendation: 'ALLOW' | 'REVIEW' | 'BLOCK' = 'ALLOW';

    if (riskScore >= 75) {
      riskLevel = 'CRITICAL';
      recommendation = 'BLOCK';
    } else if (riskScore >= 45) {
      riskLevel = 'HIGH';
      recommendation = 'REVIEW';
    } else if (riskScore >= 25) {
      riskLevel = 'MEDIUM';
      recommendation = 'ALLOW';
    }

    return {
      riskScore: Math.min(100, riskScore),
      riskLevel,
      passedVelocityCheck,
      isDuplicatePayment,
      reasons,
      recommendation,
    };
  }
}
