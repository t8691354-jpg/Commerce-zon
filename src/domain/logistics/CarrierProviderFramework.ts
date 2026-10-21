/**
 * Commerce Zon Marketplace - Carrier Provider Framework
 * Modular Carrier Integration & Tracking Portal Verification
 */

export interface CarrierMetadata {
  carrierId: string;
  carrierCode: string;
  name: string;
  supportedCountries: string[];
  trackingUrlTemplate: string;
  isLiveApiConfigured: boolean;
  requiresManualDispatch: boolean;
  serviceLevels: string[];
}

export interface ICarrierProvider {
  metadata: CarrierMetadata;
  validateTrackingNumber(tracking: string): boolean;
  generateTrackingUrl(tracking: string): string | null;
  formatTrackingManifest(shipmentId: string, trackingNumber: string): {
    manifestRef: string;
    generatedAt: string;
    carrierName: string;
  };
}

export class StandardCarrierProvider implements ICarrierProvider {
  constructor(public metadata: CarrierMetadata) {}

  validateTrackingNumber(tracking: string): boolean {
    if (!tracking || tracking.trim().length < 6) return false;
    return /^[A-Za-z0-9\-_]{6,35}$/.test(tracking.trim());
  }

  generateTrackingUrl(tracking: string): string | null {
    if (!this.validateTrackingNumber(tracking)) return null;
    return this.metadata.trackingUrlTemplate.replace('{tracking}', encodeURIComponent(tracking.trim()));
  }

  formatTrackingManifest(shipmentId: string, trackingNumber: string) {
    return {
      manifestRef: `MAN-${this.metadata.carrierCode}-${Date.now().toString().slice(-6)}`,
      generatedAt: new Date().toISOString(),
      carrierName: this.metadata.name,
    };
  }
}

export const CONFIGURED_CARRIERS: Record<string, CarrierMetadata> = {
  FEDEX: {
    carrierId: 'CARRIER_FEDEX',
    carrierCode: 'FEDEX',
    name: 'FedEx Priority Global',
    supportedCountries: ['US', 'CA', 'GB', 'DE', 'AE', 'SA', 'AU', 'PK'],
    trackingUrlTemplate: 'https://www.fedex.com/fedextrack/?trknbr={tracking}',
    isLiveApiConfigured: false,
    requiresManualDispatch: true,
    serviceLevels: ['FedEx Priority (1-2 Days)', 'FedEx Ground (3-5 Days)', 'FedEx International Economy'],
  },
  UPS: {
    carrierId: 'CARRIER_UPS',
    carrierCode: 'UPS',
    name: 'UPS Worldwide Express',
    supportedCountries: ['US', 'CA', 'GB', 'DE', 'AU', 'SA', 'AE'],
    trackingUrlTemplate: 'https://www.ups.com/track?tracknum={tracking}',
    isLiveApiConfigured: false,
    requiresManualDispatch: true,
    serviceLevels: ['UPS Next Day Air', 'UPS Worldwide Expedited', 'UPS Ground'],
  },
  DHL: {
    carrierId: 'CARRIER_DHL',
    carrierCode: 'DHL',
    name: 'DHL Express Worldwide',
    supportedCountries: ['US', 'PK', 'GB', 'DE', 'AE', 'SA', 'CA', 'AU'],
    trackingUrlTemplate: 'https://www.dhl.com/en/express/tracking.html?AWB={tracking}',
    isLiveApiConfigured: false,
    requiresManualDispatch: true,
    serviceLevels: ['DHL Express Worldwide', 'DHL Economy Select'],
  },
  USPS: {
    carrierId: 'CARRIER_USPS',
    carrierCode: 'USPS',
    name: 'USPS Priority Commercial',
    supportedCountries: ['US'],
    trackingUrlTemplate: 'https://tools.usps.com/go/TrackConfirmAction?tLabels={tracking}',
    isLiveApiConfigured: false,
    requiresManualDispatch: true,
    serviceLevels: ['USPS Priority Mail', 'USPS Priority Mail Express'],
  },
  TCS: {
    carrierId: 'CARRIER_TCS',
    carrierCode: 'TCS',
    name: 'TCS Express Pakistan & Middle East',
    supportedCountries: ['PK', 'AE', 'SA'],
    trackingUrlTemplate: 'https://www.tcsexpress.com/tracking?track={tracking}',
    isLiveApiConfigured: false,
    requiresManualDispatch: true,
    serviceLevels: ['TCS Express 24-Hour', 'TCS Overland Cargo', 'TCS Red Box Global'],
  },
  ROYAL_MAIL: {
    carrierId: 'CARRIER_ROYAL_MAIL',
    carrierCode: 'ROYAL_MAIL',
    name: 'Royal Mail Tracked UK',
    supportedCountries: ['GB'],
    trackingUrlTemplate: 'https://www.royalmail.com/track-your-item#/tracking-results/{tracking}',
    isLiveApiConfigured: false,
    requiresManualDispatch: true,
    serviceLevels: ['Royal Mail Tracked 24', 'Royal Mail Tracked 48'],
  },
  CZL: {
    carrierId: 'CARRIER_CZL',
    carrierCode: 'CZL',
    name: 'Commerce Zon Dedicated Logistics Fleet',
    supportedCountries: ['US', 'PK', 'GB', 'DE', 'AE', 'SA', 'CA', 'AU'],
    trackingUrlTemplate: '/api/fulfillment/shipments/{tracking}',
    isLiveApiConfigured: true,
    requiresManualDispatch: false,
    serviceLevels: ['Commerce Zon Express (1-Day)', 'Commerce Zon Standard FBA'],
  },
};

export class CarrierRegistry {
  private static providers: Map<string, ICarrierProvider> = new Map();

  static {
    Object.entries(CONFIGURED_CARRIERS).forEach(([key, meta]) => {
      this.providers.set(key, new StandardCarrierProvider(meta));
      this.providers.set(meta.name.toUpperCase(), new StandardCarrierProvider(meta));
    });
  }

  public static getCarrier(identifier: string): ICarrierProvider | null {
    if (!identifier) return null;
    const clean = identifier.toUpperCase().trim();
    for (const [key, provider] of this.providers.entries()) {
      if (key === clean || provider.metadata.name.toUpperCase().includes(clean) || provider.metadata.carrierCode === clean) {
        return provider;
      }
    }
    // Fallback generic carrier provider with manual dispatch
    return new StandardCarrierProvider({
      carrierId: `CARRIER_${clean.replace(/[^A-Z0-9]/g, '_')}`,
      carrierCode: clean.slice(0, 5),
      name: identifier,
      supportedCountries: ['US', 'PK', 'GB', 'DE', 'AE', 'SA', 'CA', 'AU'],
      trackingUrlTemplate: '',
      isLiveApiConfigured: false,
      requiresManualDispatch: true,
      serviceLevels: ['Standard Service'],
    });
  }

  public static getAllCarriers(): CarrierMetadata[] {
    return Object.values(CONFIGURED_CARRIERS);
  }
}
