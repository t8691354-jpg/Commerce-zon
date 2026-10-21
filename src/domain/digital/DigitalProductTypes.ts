export type DigitalCategory =
  | 'saas_boilerplates'
  | 'developer_tools'
  | 'game_assets'
  | 'ui_ux_kits'
  | 'audio_music'
  | 'ebooks_guides'
  | 'ai_prompts'
  | 'devops_scripts';

export type LicenseType = 'standard' | 'commercial' | 'extended';

export interface LicenseTier {
  type: LicenseType;
  name: string;
  price: number;
  seats: number;
  commercialUse: boolean;
  resaleAllowed: boolean;
  updatesMonths: number;
  description: string;
  features: string[];
}

export interface DigitalProductAuthor {
  id: string;
  name: string;
  avatar: string;
  verifiedBadge: boolean;
  salesCount: number;
  rating: number;
  bio: string;
}

export interface DigitalChangelogEntry {
  version: string;
  date: string;
  changes: string[];
}

export interface CodeSnippetPreview {
  language: string;
  filename: string;
  code: string;
}

export interface DigitalProduct {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: DigitalCategory;
  categoryLabel: string;
  thumbnailUrl: string;
  previewUrl?: string;
  version: string;
  releaseDate: string;
  lastUpdated: string;
  fileFormat: string;
  fileSize: string;
  checksumSha256: string;
  downloadsCount: number;
  rating: number;
  reviewsCount: number;
  author: DigitalProductAuthor;
  licenseTiers: Record<LicenseType, LicenseTier>;
  techStack: string[];
  includedFiles: string[];
  changelog: DigitalChangelogEntry[];
  codeSnippetPreview?: CodeSnippetPreview;
  audioPreviewUrl?: string;
  tags: string[];
  isFeatured: boolean;
  instantDelivery: boolean;
}

export interface LicenseActivation {
  id: string;
  domainOrDeviceId: string;
  activatedAt: string;
  status: 'active' | 'revoked';
}

export interface DigitalVaultItem {
  id: string;
  orderId: string;
  productId: string;
  productTitle: string;
  productThumbnail: string;
  licenseType: LicenseType;
  licenseTierName: string;
  licenseKey: string;
  purchasedAt: string;
  downloadToken: string;
  downloadTokenExpiresAt: string;
  downloadAttemptsRemaining: number;
  checksumSha256: string;
  fileFormat: string;
  fileSize: string;
  currentVersion: string;
  updateAvailable: boolean;
  activations: LicenseActivation[];
  maxActivations: number;
}

export interface DigitalOrder {
  orderId: string;
  buyerId: string;
  buyerEmail: string;
  productId: string;
  productTitle: string;
  licenseType: LicenseType;
  amount: number;
  currency: string;
  paymentMethod: string;
  licenseKey: string;
  downloadToken: string;
  fulfilledAt: string;
  status: 'COMPLETED' | 'REVOKED' | 'REFUNDED';
}

export interface DigitalMarketplaceMetrics {
  totalProducts: number;
  totalCreators: number;
  totalLicensesIssued: number;
  totalVolumeUSD: number;
  activeActivationsCount: number;
  instantDeliveryRate: number; // e.g. 99.9%
}
