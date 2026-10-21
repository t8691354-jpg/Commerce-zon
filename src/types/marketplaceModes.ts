export type MarketplaceMode = 'physical' | 'digital' | 'freelancer' | 'ai';

export interface MarketplaceModeDefinition {
  id: MarketplaceMode;
  number: number;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  iconName: 'Package' | 'Code' | 'Briefcase' | 'Bot';
  description: string;
  isAvailable: boolean;
  features: string[];
}

export const MARKETPLACE_MODES: MarketplaceModeDefinition[] = [
  {
    id: 'physical',
    number: 1,
    title: 'Physical Marketplace',
    subtitle: 'FBA, Warehouses & Hardware Logistics',
    badge: 'Active & Verified',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    iconName: 'Package',
    description: 'Traditional physical goods with automated FBA warehousing, shipping carriers, RMA returns, and multi-vendor logistics.',
    isAvailable: true,
    features: ['FBA & Warehouse Logistics', 'Order Tracking & Carrier APIs', 'RMA Returns & Quality Inspections', 'B2B & Dropshipping Engine']
  },
  {
    id: 'digital',
    number: 2,
    title: 'Digital Marketplace',
    subtitle: 'Software, SaaS, Code & Digital Licenses',
    badge: 'New & Live',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    iconName: 'Code',
    description: 'Instant-delivery digital products, cryptographic software licenses, SaaS boilerplates, 3D assets, and secure customer asset vault.',
    isAvailable: true,
    features: ['Instant Delivery (0 Shipping)', 'Cryptographic License Keys', 'Secure Asset Vault & Tokens', 'Live Sandbox Previews']
  },
  {
    id: 'freelancer',
    number: 3,
    title: 'Freelancer Marketplace',
    subtitle: 'On-Demand Tech & Creative Talent',
    badge: 'Active & Live',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    iconName: 'Briefcase',
    description: 'Contract-based talent marketplace with milestone-based escrow, proposal bidding, verified portfolio reviews, and time tracking.',
    isAvailable: true,
    features: ['Milestone Escrow Contracts', 'Proposal & Bidding Engine', 'Talent Directory & Portfolios', 'Dispute Arbitration Board']
  },
  {
    id: 'ai',
    number: 4,
    title: 'AI Marketplace',
    subtitle: 'Autonomous Agents, Models & Prompts',
    badge: 'Coming Soon',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    iconName: 'Bot',
    description: 'Autonomous AI agents, fine-tuned LoRA weights, enterprise prompt libraries, and pay-per-token API orchestration gateway.',
    isAvailable: false,
    features: ['Autonomous AI Agent Hub', 'Fine-Tuned Model Weights', 'Prompt Engineering Packs', 'Inference API Token Routing']
  }
];
