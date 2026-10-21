export interface AppConfig {
  appName: string;
  version: string;
  environment: 'development' | 'production' | 'staging' | 'test';
  port: number;
  apiPrefix: string;
  geminiModel: string;
  features: {
    aiSearchEnabled: boolean;
    multiWarehouseStockEnabled: boolean;
    auditTrailEnabled: boolean;
    securityFraudShieldEnabled: boolean;
    realTimeNotificationsEnabled: boolean;
    fbaFulfillmentEnabled: boolean;
    dropshippingHubEnabled: boolean;
  };
  currency: {
    defaultCurrency: string;
    supportedCurrencies: string[];
  };
}

export const appConfig: AppConfig = {
  appName: 'Commerce Zon',
  version: '2026.1.0-enterprise',
  environment: (process.env.NODE_ENV as AppConfig['environment']) || 'development',
  port: 3000,
  apiPrefix: '/api',
  geminiModel: 'gemini-3.6-flash',
  features: {
    aiSearchEnabled: true,
    multiWarehouseStockEnabled: true,
    auditTrailEnabled: true,
    securityFraudShieldEnabled: true,
    realTimeNotificationsEnabled: true,
    fbaFulfillmentEnabled: true,
    dropshippingHubEnabled: true,
  },
  currency: {
    defaultCurrency: 'USD',
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'JPY', 'AUD', 'INR'],
  },
};
