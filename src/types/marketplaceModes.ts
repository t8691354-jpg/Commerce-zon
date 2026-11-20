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
    title: 'AI Agent Marketplace',
    subtitle: 'Autonomous Cloud Run Agents, Browser Automation & Agent Factory',
    badge: 'Active & Live',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    iconName: 'Bot',
    description: 'Deployable autonomous AI agents, Cloud Run browser automation bots with Playwright + Gemini, live execution sandboxes, and custom agent builder factory.',
    isAvailable: true,
    features: ['Browser Agent (FastAPI + Playwright + Gemini)', 'Interactive Live Agent Sandbox Runner', 'AI Agent Factory & Docker Packaging', '1-Click Google Cloud Run Deployer']
  }
];
