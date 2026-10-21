import {
  AnalyticsDateRangePreset,
  AnalyticsEventTrackRequest,
  MarketplaceWideAnalytics,
  SellerAnalyticsReport,
} from '../types/sellerAnalytics';

class SellerAnalyticsClient {
  private sessionId: string;

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
  }

  private getOrCreateSessionId(): string {
    const key = 'cz_analytics_session_id';
    try {
      let id = sessionStorage.getItem(key);
      if (!id) {
        id = `sess-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        sessionStorage.setItem(key, id);
      }
      return id;
    } catch {
      return `sess-${Date.now()}`;
    }
  }

  /**
   * Fetch Seller Intelligence & Analytics Report
   */
  async getSellerReport(
    merchantId: string,
    preset: AnalyticsDateRangePreset = '7d',
    customStart?: string,
    customEnd?: string,
    currency: string = 'USD'
  ): Promise<SellerAnalyticsReport> {
    const params = new URLSearchParams({
      range: preset,
      currency,
    });

    if (customStart) params.append('startDate', customStart);
    if (customEnd) params.append('endDate', customEnd);

    const res = await fetch(`/api/seller/analytics/${encodeURIComponent(merchantId)}?${params.toString()}`);
    if (!res.ok) {
      throw new Error(`Failed to load seller analytics: ${res.statusText}`);
    }

    const data = await res.json();
    return data.report;
  }

  /**
   * Fetch Platform-Wide Marketplace Analytics (for Admin / Executive view)
   */
  async getMarketplaceAnalytics(): Promise<MarketplaceWideAnalytics> {
    const res = await fetch('/api/admin/marketplace-analytics');
    if (!res.ok) {
      throw new Error(`Failed to load marketplace analytics: ${res.statusText}`);
    }
    const data = await res.json();
    return data.analytics;
  }

  /**
   * Track Product Event (View, Impression, Click, Add to Cart)
   */
  async trackEvent(event: Omit<AnalyticsEventTrackRequest, 'sessionId'>): Promise<void> {
    try {
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...event,
          sessionId: this.sessionId,
        }),
      });
    } catch (err) {
      // Non-blocking telemetry failure
      console.debug('[AnalyticsClient] Event tracking skipped:', err);
    }
  }

  /**
   * Trigger CSV Download in Browser
   */
  downloadCSV(report: SellerAnalyticsReport, exportType: 'products' | 'summary' | 'orders' = 'products') {
    const url = `/api/seller/analytics/${encodeURIComponent(report.merchantId)}/export?format=csv&type=${exportType}&range=${report.dateRange.preset}`;
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${report.merchantName.replace(/[^a-z0-9]/gi, '_')}_${exportType}_${report.dateRange.preset}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Trigger JSON Download in Browser
   */
  downloadJSON(report: SellerAnalyticsReport) {
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${report.merchantName.replace(/[^a-z0-9]/gi, '_')}_analytics_${report.dateRange.preset}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const sellerAnalyticsClient = new SellerAnalyticsClient();
