import { DigitalProduct, DigitalVaultItem } from '../domain/digital/DigitalProductTypes';

export const SEEDED_DIGITAL_PRODUCTS: DigitalProduct[] = [
  {
    id: 'DIGI-PROD-001',
    title: 'OmniStack SaaS - Next.js 15 & Go Microservices Architecture Kit',
    slug: 'omnistack-saas-nextjs-go',
    shortDescription: 'Production-ready enterprise SaaS boilerplate with multi-tenant Postgres, Stripe/Crypto billing, and JWT RBAC authentication.',
    description: 'OmniStack SaaS is the definitive starter kit for high-growth tech founders and software engineering teams. Built with Next.js 15 App Router, TypeScript, Go microservices, and Docker Compose. Features built-in team workspaces, role-based access control, localized i18n, Stripe webhook handlers, automated CI/CD pipelines, and zero-downtime deployment scripts.',
    category: 'saas_boilerplates',
    categoryLabel: 'SaaS Boilerplates',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    previewUrl: 'https://omnistack-preview.commercezon.dev',
    version: '2.4.1',
    releaseDate: '2026-08-14',
    lastUpdated: '2026-10-18',
    fileFormat: 'ZIP (.ts, .go, .docker)',
    fileSize: '184 MB',
    checksumSha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    downloadsCount: 3842,
    rating: 4.95,
    reviewsCount: 342,
    author: {
      id: 'CREATOR-01',
      name: 'OmniCore Software Labs',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      verifiedBadge: true,
      salesCount: 8940,
      rating: 4.98,
      bio: 'Principal distributed systems architects and open-source tooling maintainers.'
    },
    licenseTiers: {
      standard: {
        type: 'standard',
        name: 'Standard Developer',
        price: 79,
        seats: 1,
        commercialUse: false,
        resaleAllowed: false,
        updatesMonths: 12,
        description: 'For personal projects, solo developers, and experimental applications.',
        features: ['1 Developer Seat', '12 Months Free Updates', 'Source Code Access', 'Community Discord Support']
      },
      commercial: {
        type: 'commercial',
        name: 'Commercial Startup',
        price: 199,
        seats: 5,
        commercialUse: true,
        resaleAllowed: false,
        updatesMonths: 12,
        description: 'For commercial SaaS products, startups, and client billable projects.',
        features: ['Up to 5 Developer Seats', 'Commercial Client Deliverables', 'Multi-tenant SaaS Deployment Rights', 'Priority Email Support']
      },
      extended: {
        type: 'extended',
        name: 'Enterprise Extended',
        price: 499,
        seats: 999,
        commercialUse: true,
        resaleAllowed: true,
        updatesMonths: 24,
        description: 'Unlimited developer seats with full white-labeling and redistribution permission.',
        features: ['Unlimited Seats', '24 Months Updates & Security Patches', 'White-labeling & OEM Embedding', 'Dedicated Slack Channel']
      }
    },
    techStack: ['Next.js 15', 'TypeScript', 'Go 1.23', 'PostgreSQL', 'Docker', 'Tailwind CSS', 'Stripe'],
    includedFiles: [
      'apps/web (Next.js 15 App Router Frontend)',
      'services/api-gateway (Go Fiber Gateway)',
      'services/auth-service (OAuth2 & JWT Manager)',
      'services/billing-service (Stripe Webhook Worker)',
      'deploy/docker-compose.prod.yml',
      'docs/ARCHITECTURE.md'
    ],
    changelog: [
      {
        version: 'v2.4.1',
        date: '2026-10-18',
        changes: ['Upgraded to Next.js 15.1 Canary', 'Added Postgres connection pool circuit breaker', 'Updated Stripe webhook idempotency keys']
      },
      {
        version: 'v2.3.0',
        date: '2026-09-29',
        changes: ['Integrated Docker rootless containers', 'Added dark-mode theme persistence']
      }
    ],
    codeSnippetPreview: {
      language: 'typescript',
      filename: 'services/auth/jwtProvider.ts',
      code: `import { SignJWT, jwtVerify } from 'jose';

export async function generateSessionToken(userId: string, role: string): Promise<string> {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
  return new SignJWT({ uid: userId, role, scope: 'tenant:admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer('commercezon:omnistack')
    .setExpirationTime('24h')
    .sign(secret);
}`
    },
    tags: ['Next.js 15', 'Go', 'SaaS', 'Stripe', 'Docker', 'Boilerplate'],
    isFeatured: true,
    instantDelivery: true
  },
  {
    id: 'DIGI-PROD-002',
    title: 'CyberVoxel 3D Sci-Fi Modular Kit - Unreal Engine 5 & Unity',
    slug: 'cybervoxel-3d-scifi-kit',
    shortDescription: 'High-fidelity AAA modular sci-fi environment assets, 4K PBR Nanite meshes, interactive doors, and cybernetic props.',
    description: 'Transform your game prototype into a breathtaking cyberpunk metropolis. CyberVoxel includes over 280 modular architectural components, Nanite-optimized meshes for Unreal Engine 5.4+, and high-performance Unity URP/HDRP prefab packages with customizable emission shaders and baked collision geometry.',
    category: 'game_assets',
    categoryLabel: '3D & Game Assets',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    previewUrl: 'https://sketchfab.com/3d-models/cyberpunk-environment',
    version: '3.1.0',
    releaseDate: '2026-07-22',
    lastUpdated: '2026-10-12',
    fileFormat: 'ZIP (.fbx, .blend, .uasset, .unitypackage)',
    fileSize: '4.8 GB',
    checksumSha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    downloadsCount: 1920,
    rating: 4.98,
    reviewsCount: 184,
    author: {
      id: 'CREATOR-02',
      name: 'VoxelForge Studios',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      verifiedBadge: true,
      salesCount: 6420,
      rating: 4.97,
      bio: 'AAA environment artists for indie game developers and virtual production studios.'
    },
    licenseTiers: {
      standard: {
        type: 'standard',
        name: 'Indie Game License',
        price: 49,
        seats: 1,
        commercialUse: true,
        resaleAllowed: false,
        updatesMonths: 12,
        description: 'Ideal for independent developers publishing on Steam, itch.io, or mobile.',
        features: ['1 Game Project Release', 'Revenue Cap up to $100k', '4K PBR Textures Included', 'Free Bug Fixes']
      },
      commercial: {
        type: 'commercial',
        name: 'Studio Pro License',
        price: 149,
        seats: 10,
        commercialUse: true,
        resaleAllowed: false,
        updatesMonths: 18,
        description: 'For gaming studios and commercial productions with unlimited title revenue.',
        features: ['Up to 10 Studio Seats', 'Unlimited Commercial Game Titles', 'Raw .BLEND Source Files', 'Unreal 5.4 Nanite Source']
      },
      extended: {
        type: 'extended',
        name: 'Enterprise / Metaverse License',
        price: 389,
        seats: 999,
        commercialUse: true,
        resaleAllowed: true,
        updatesMonths: 24,
        description: 'Broadcasting, film VFX, virtual world platforms, and unlimited seat distribution.',
        features: ['Unlimited Studio Seats', 'Broadcasting & Film VFX Rights', 'Source Substance Painter Files', 'Direct Technical Support']
      }
    },
    techStack: ['Unreal Engine 5.4', 'Unity 6', 'Blender 4.2', 'Substance 3D', 'GLTF', 'FBX'],
    includedFiles: [
      'UnrealEngine_Project_v3.1.uasset',
      'Unity_URP_HDRP_Pack.unitypackage',
      'Raw_Meshes_FBX_280_Items.zip',
      '4K_PBR_Textures_Maps (Albedo, Normal, Roughness, Metal, Emission)',
      'Docs_Modular_Snapping_Guide.pdf'
    ],
    changelog: [
      {
        version: 'v3.1.0',
        date: '2026-10-12',
        changes: ['Added 40 animated holographic billboard meshes', 'Optimized Nanite LOD triangles', 'Fixed Unity HDRP lightmap seam issues']
      }
    ],
    tags: ['3D Model', 'Unreal Engine 5', 'Unity', 'Cyberpunk', 'Nanite', 'Game Assets'],
    isFeatured: true,
    instantDelivery: true
  },
  {
    id: 'DIGI-PROD-003',
    title: 'NexusUI Enterprise Design System - React 19, Tailwind v4 & Figma',
    slug: 'nexusui-design-system-react-tailwind',
    shortDescription: '140+ accessible accessible WCAG AA components, dark-mode tokens, interactive data tables, and complete auto-layout Figma system.',
    description: 'NexusUI is built from the ground up for software teams demanding pixel perfection. Ships with zero-friction copy-paste React 19 components, Radix UI primitives, fluid typography, keyboard accessibility, high-density tables, multi-step checkout modals, and customizable chart widgets.',
    category: 'ui_ux_kits',
    categoryLabel: 'UI/UX Kits & Design Systems',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80',
    previewUrl: 'https://nexusui-docs.commercezon.dev',
    version: '4.0.2',
    releaseDate: '2026-09-01',
    lastUpdated: '2026-10-19',
    fileFormat: 'ZIP (.tsx, .fig, .json)',
    fileSize: '92 MB',
    checksumSha256: 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0',
    downloadsCount: 5120,
    rating: 4.96,
    reviewsCount: 412,
    author: {
      id: 'CREATOR-03',
      name: 'PixelCraft Design Systems',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      verifiedBadge: true,
      salesCount: 14200,
      rating: 4.99,
      bio: 'Design systems engineers specialized in high-performance frontend interfaces.'
    },
    licenseTiers: {
      standard: {
        type: 'standard',
        name: 'Single App License',
        price: 59,
        seats: 1,
        commercialUse: true,
        resaleAllowed: false,
        updatesMonths: 12,
        description: 'For 1 commercial web application or website.',
        features: ['1 Production Web Application', '140+ React Components', 'Figma File Access', 'Lifetime Access to Version 4.x']
      },
      commercial: {
        type: 'commercial',
        name: 'Agency Team License',
        price: 149,
        seats: 8,
        commercialUse: true,
        resaleAllowed: false,
        updatesMonths: 12,
        description: 'For design agencies and development teams building multiple client sites.',
        features: ['Up to 8 Designers & Developers', 'Unlimited Commercial Client Projects', 'Figma Component Tokens Sync', 'Private npm Registry Token']
      },
      extended: {
        type: 'extended',
        name: 'Enterprise Platform License',
        price: 349,
        seats: 999,
        commercialUse: true,
        resaleAllowed: true,
        updatesMonths: 24,
        description: 'For SaaS platforms embedding UI components for end-users to customize.',
        features: ['Unlimited Developer Seats', 'White-Label Distribution Rights', 'Component Source Generators', 'Direct Architecture Consultation']
      }
    },
    techStack: ['React 19', 'Tailwind CSS v4', 'TypeScript', 'Radix UI', 'Figma Variables', 'Lucide Icons'],
    includedFiles: [
      'components/ (140+ Modular React TSX files)',
      'tokens/design-tokens.json (Tailwind v4 tokens)',
      'figma/NexusUI_v4_Design_System.fig',
      'storybook/ (Component documentation sandbox)',
      'guides/ACCESSIBILITY_WCAG_AA.md'
    ],
    changelog: [
      {
        version: 'v4.0.2',
        date: '2026-10-19',
        changes: ['Fixed mobile viewport overflow on data tables', 'Added keyboard navigation to combobox', 'Synchronized Figma variables with Tailwind v4 theme']
      }
    ],
    codeSnippetPreview: {
      language: 'tsx',
      filename: 'components/ui/DataTable.tsx',
      code: `import React, { useState } from 'react';
import { ChevronDown, ArrowUpDown } from 'lucide-react';

export function ModernDataTable<T>({ columns, data }: { columns: any[]; data: T[] }) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  return (
    <div className="border border-slate-700 rounded-xl overflow-hidden shadow-2xl bg-slate-900">
      <table className="w-full text-left text-xs text-slate-300">
        <thead className="bg-slate-800/80 text-slate-400 uppercase font-mono tracking-wider">
          {/* Virtualized column headers */}
        </thead>
      </table>
    </div>
  );
}`
    },
    tags: ['React 19', 'Tailwind v4', 'Figma', 'Design System', 'UI Kit', 'TypeScript'],
    isFeatured: true,
    instantDelivery: true
  },
  {
    id: 'DIGI-PROD-004',
    title: 'SynthWave 2088 Production Suite - 24-Bit DAW Stems & Presets',
    slug: 'synthwave-2088-audio-suite',
    shortDescription: '1,400+ lossless 24-bit 48kHz audio stems, MIDI files, Serum synth presets, and analog drum samples for games and trailers.',
    description: 'Produced using vintage analog synthesizers (Roland Juno-106, Prophet-5, Moog Sub 37) coupled with modern mastering processors. 100% royalty-free for commercial video games, YouTube content, trailers, streaming podcasts, and mobile games.',
    category: 'audio_music',
    categoryLabel: 'Audio & Music Assets',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    previewUrl: 'https://soundcloud.com/synthwave-samples-preview',
    version: '1.5.0',
    releaseDate: '2026-06-10',
    lastUpdated: '2026-09-15',
    fileFormat: 'ZIP (.wav, .midi, .fxp)',
    fileSize: '3.2 GB',
    checksumSha256: 'c3ab8ff13720e8ad9047dd39466b3c8974e592c2fa383d4a3960714caef0c4f2',
    downloadsCount: 2240,
    rating: 4.93,
    reviewsCount: 165,
    author: {
      id: 'CREATOR-04',
      name: 'RetroPulse Soundworks',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
      verifiedBadge: true,
      salesCount: 7120,
      rating: 4.94,
      bio: 'Award-winning soundtrack producers and sound designers for cyberpunk games.'
    },
    licenseTiers: {
      standard: {
        type: 'standard',
        name: 'Creator Standard',
        price: 39,
        seats: 1,
        commercialUse: true,
        resaleAllowed: false,
        updatesMonths: 12,
        description: 'For YouTube videos, Twitch streams, indie podcasts, and social media.',
        features: ['100% Royalty Free', 'Monetized Video Background Music', '24-bit 48kHz WAV Files', 'Full Commercial Clearance']
      },
      commercial: {
        type: 'commercial',
        name: 'Commercial Game & Media',
        price: 99,
        seats: 5,
        commercialUse: true,
        resaleAllowed: false,
        updatesMonths: 12,
        description: 'For commercial games, national television commercials, and theatrical releases.',
        features: ['Commercial Video Game OST Rights', 'Serum Synth Presets & MIDI', 'Broadcast Clearance Certificate', 'Multi-Seat Production Studio']
      },
      extended: {
        type: 'extended',
        name: 'Unlimited Sync & Redistribution',
        price: 249,
        seats: 999,
        commercialUse: true,
        resaleAllowed: true,
        updatesMonths: 24,
        description: 'For software apps with music generators or game engine asset marketplaces.',
        features: ['Redistribution Rights', 'Stem Track Multitracks (Bass, Lead, Drums)', 'Master Stems DAW Sessions (Ableton & Logic)', 'Lifetime Legal Indemnity']
      }
    },
    techStack: ['24-bit 48kHz WAV', 'MIDI Files', 'Xfer Serum Presets', 'Ableton Live 12', 'Logic Pro'],
    includedFiles: [
      'Drum_Loops_OneShots (420 samples)',
      'Synth_Arpeggios_and_Leads (380 stems)',
      'Atmospheric_Drones_and_Pads (210 files)',
      'MIDI_Chord_Progressions.zip',
      'Serum_Presets_Bank.fxp',
      'Commercial_Royalty_Free_License.pdf'
    ],
    changelog: [
      {
        version: 'v1.5.0',
        date: '2026-09-15',
        changes: ['Added 80 modular synth riser SFX', 'Re-mastered low-end kick stems at -14 LUFS', 'Included Ableton Live 12 template project']
      }
    ],
    audioPreviewUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=synthwave-80s-110045.mp3',
    tags: ['Audio', 'Synthwave', 'Game Music', 'WAV', 'MIDI', 'Serum'],
    isFeatured: true,
    instantDelivery: true
  },
  {
    id: 'DIGI-PROD-005',
    title: 'CloudScale GitOps & Kubernetes Multi-Region Cluster Blueprints',
    slug: 'cloudscale-kubernetes-gitops-blueprints',
    shortDescription: 'Enterprise Terraform modules, ArgoCD GitOps pipelines, Cilium eBPF networking, and automated Prometheus/Grafana monitoring.',
    description: 'Deploy hardened, SOC-2 compliant multi-region Kubernetes clusters across AWS, GCP, and Azure in under 15 minutes. Includes zero-trust network policies, HashiCorp Vault secrets injection, autoscaling rules, cert-manager SSL automation, and automated disaster recovery backups.',
    category: 'devops_scripts',
    categoryLabel: 'DevOps & Cloud Scripts',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80',
    previewUrl: 'https://cloudscale-docs.commercezon.dev',
    version: '1.8.4',
    releaseDate: '2026-05-18',
    lastUpdated: '2026-10-15',
    fileFormat: 'ZIP (.tf, .yaml, .sh)',
    fileSize: '45 MB',
    checksumSha256: '7b52009b64fd0a2a49e6d8a939753077792b0554cac5245011df394bb50c955f',
    downloadsCount: 1680,
    rating: 4.97,
    reviewsCount: 122,
    author: {
      id: 'CREATOR-05',
      name: 'CloudNative Architects',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      verifiedBadge: true,
      salesCount: 4200,
      rating: 4.98,
      bio: 'Certified Kubernetes Administrators (CKA) and AWS/GCP Principal DevOps Engineers.'
    },
    licenseTiers: {
      standard: {
        type: 'standard',
        name: 'Single Organization',
        price: 89,
        seats: 3,
        commercialUse: true,
        resaleAllowed: false,
        updatesMonths: 12,
        description: 'For single company cloud infrastructure and internal deployments.',
        features: ['3 DevOps Engineers Access', 'AWS, GCP & Azure Terraform Modules', 'ArgoCD GitOps Manifests', '12 Months Version Updates']
      },
      commercial: {
        type: 'commercial',
        name: 'DevOps Consultancy License',
        price: 249,
        seats: 10,
        commercialUse: true,
        resaleAllowed: false,
        updatesMonths: 12,
        description: 'For IT consultancies and cloud agencies deploying client infrastructure.',
        features: ['10 Team Members', 'Deploy to Unlimited Client Cloud Accounts', 'Hardened CIS Benchmark Compliance', 'Grafana Dashboard JSON Templates']
      },
      extended: {
        type: 'extended',
        name: 'Enterprise Global Reseller',
        price: 599,
        seats: 999,
        commercialUse: true,
        resaleAllowed: true,
        updatesMonths: 24,
        description: 'For managed service providers (MSPs) and SaaS platform vendors.',
        features: ['Unlimited Engineers', 'SaaS Embedding & White-labeling', 'Automated DR Failover Scripts', 'Direct 1-on-1 Architecture Review']
      }
    },
    techStack: ['Terraform 1.9', 'Kubernetes 1.31', 'ArgoCD', 'Cilium eBPF', 'Prometheus', 'Helm', 'Vault'],
    includedFiles: [
      'terraform/aws-eks-multi-region/ (Main infrastructure)',
      'terraform/gcp-gke-enterprise/',
      'gitops/argocd-root-apps.yaml',
      'monitoring/grafana-dashboards/ (24 dashboards)',
      'security/falco-ebpf-rules.yaml',
      'scripts/disaster-recovery-test.sh'
    ],
    changelog: [
      {
        version: 'v1.8.4',
        date: '2026-10-15',
        changes: ['Upgraded EKS and GKE to Kubernetes 1.31', 'Added Cilium cluster mesh for cross-cloud latency reduction', 'Hardened Terraform OpenTofu compatibility']
      }
    ],
    codeSnippetPreview: {
      language: 'yaml',
      filename: 'gitops/argocd/application.yaml',
      code: `apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: commercezon-core-microservices
  namespace: argocd
spec:
  project: production-secure
  source:
    repoURL: 'https://github.com/commercezon/k8s-gitops.git'
    targetRevision: HEAD
    path: envs/production
  destination:
    server: 'https://kubernetes.default.svc'
    namespace: production
  syncPolicy:
    automated:
      prune: true
      selfHeal: true`
    },
    tags: ['DevOps', 'Kubernetes', 'Terraform', 'GitOps', 'AWS', 'GCP', 'Docker'],
    isFeatured: false,
    instantDelivery: true
  },
  {
    id: 'DIGI-PROD-006',
    title: 'DeepPrompt AI Engineer Benchmark & Agent Tool Calling Suite',
    slug: 'deepprompt-ai-agent-suite',
    shortDescription: '1,200+ empirically evaluated prompts, structured JSON schema definitions, and automated evaluation scripts for Gemini, Claude & OpenAI.',
    description: 'Eliminate hallucination and build production-grade AI agents. DeepPrompt gives you battle-tested system prompts for tool calling, function orchestration, structured extraction, code generation, and multi-agent coordination. Includes automated Python and TypeScript evaluation testbeds.',
    category: 'ai_prompts',
    categoryLabel: 'AI Prompts & Agents',
    thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80',
    previewUrl: 'https://deepprompt.commercezon.dev',
    version: '2.1.0',
    releaseDate: '2026-08-01',
    lastUpdated: '2026-10-16',
    fileFormat: 'ZIP (.json, .ts, .py, .md)',
    fileSize: '38 MB',
    checksumSha256: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
    downloadsCount: 2980,
    rating: 4.94,
    reviewsCount: 210,
    author: {
      id: 'CREATOR-06',
      name: 'Agentic Intelligence Labs',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
      verifiedBadge: true,
      salesCount: 8200,
      rating: 4.96,
      bio: 'AI research engineers benchmarking LLM reasoning reliability and agent tool systems.'
    },
    licenseTiers: {
      standard: {
        type: 'standard',
        name: 'Developer Seat',
        price: 49,
        seats: 1,
        commercialUse: true,
        resaleAllowed: false,
        updatesMonths: 12,
        description: 'For solo software engineers and independent AI product developers.',
        features: ['1,200+ Tested Prompts & Schemas', 'Gemini & Claude Function Call Templates', 'TypeScript & Python Runners', 'Free Updates for 12 Months']
      },
      commercial: {
        type: 'commercial',
        name: 'Team / AI Startup',
        price: 129,
        seats: 6,
        commercialUse: true,
        resaleAllowed: false,
        updatesMonths: 12,
        description: 'For startup engineering teams building commercial agentic AI applications.',
        features: ['Up to 6 Team Developers', 'Automated Evals Test Suite', 'Hallucination Mitigation Framework', 'Private Prompt Lab Discord']
      },
      extended: {
        type: 'extended',
        name: 'Enterprise AI Lab',
        price: 329,
        seats: 999,
        commercialUse: true,
        resaleAllowed: true,
        updatesMonths: 24,
        description: 'For enterprises and AI consultancies embedding prompt engines into SaaS products.',
        features: ['Unlimited Developer Seats', 'Full Prompt Reselling & Embedding Rights', 'Custom Domain Fine-Tuning Prompts', 'Priority Model Alignment Support']
      }
    },
    techStack: ['Gemini 2.5', 'Claude 3.5 Sonnet', 'OpenAI GPT-4o', 'TypeScript', 'Python', 'JSON Schema'],
    includedFiles: [
      'prompts/tool-calling-orchestration.json (320 prompts)',
      'prompts/structured-data-extraction.json (280 prompts)',
      'prompts/multi-agent-planning.json (240 prompts)',
      'evals/python/run_benchmark.py (Automated accuracy runner)',
      'evals/typescript/evalEngine.ts',
      'README_PROMPT_ENGINEERING_STANDARDS.md'
    ],
    changelog: [
      {
        version: 'v2.1.0',
        date: '2026-10-16',
        changes: ['Added Gemini 2.5 Flash Thinking prompts', 'Updated JSON schema validation for strict function calling', 'Added zero-shot SQL generator templates']
      }
    ],
    codeSnippetPreview: {
      language: 'typescript',
      filename: 'evals/agentToolCaller.ts',
      code: `export const FUNCTION_CALLING_PROMPT = {
  systemPrompt: "You are an autonomous orchestrator. Always produce valid RFC 8259 JSON.",
  tools: [
    {
      name: "execute_query",
      description: "Query SQL database safely with parameterized arguments",
      parameters: { type: "object", properties: { query: { type: "string" } }, required: ["query"] }
    }
  ]
};`
    },
    tags: ['AI Prompts', 'Gemini', 'LLM', 'Agent Tools', 'TypeScript', 'Python'],
    isFeatured: false,
    instantDelivery: true
  },
  {
    id: 'DIGI-PROD-007',
    title: 'AlgoAlpha Quant High-Frequency Crypto & Equities Backtester',
    slug: 'algoalpha-quant-trading-backtester',
    shortDescription: 'Ultra-low latency event-driven backtesting engine written in Python & Rust with multi-exchange WebSocket connectors and risk guards.',
    description: 'Designed for quantitative traders, hedge funds, and programmatic algorithmic builders. Features tick-by-tick order book simulation, slippage & fee modeling, VaR risk limits, Sharpe/Sortino ratio analytics, and live execution connectors for Binance, Bybit, and Interactive Brokers.',
    category: 'developer_tools',
    categoryLabel: 'Developer Tools & SDKs',
    thumbnailUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
    previewUrl: 'https://algoalpha.commercezon.dev',
    version: '3.4.0',
    releaseDate: '2026-07-04',
    lastUpdated: '2026-10-14',
    fileFormat: 'ZIP (.py, .rs, .whl, .csv)',
    fileSize: '115 MB',
    checksumSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    downloadsCount: 1420,
    rating: 4.96,
    reviewsCount: 138,
    author: {
      id: 'CREATOR-07',
      name: 'AlphaStream Quant Research',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
      verifiedBadge: true,
      salesCount: 3900,
      rating: 4.97,
      bio: 'Former high-frequency trading desk developers and quantitative analysts.'
    },
    licenseTiers: {
      standard: {
        type: 'standard',
        name: 'Individual Trader',
        price: 99,
        seats: 1,
        commercialUse: true,
        resaleAllowed: false,
        updatesMonths: 12,
        description: 'For personal algorithmic trading and strategy research.',
        features: ['1 Trader Seat', 'Tick Data Simulation Engine', 'Binance & IBKR API Connectors', '12 Months Bug Fixes']
      },
      commercial: {
        type: 'commercial',
        name: 'Prop Firm / Fund',
        price: 299,
        seats: 6,
        commercialUse: true,
        resaleAllowed: false,
        updatesMonths: 12,
        description: 'For proprietary trading firms, funds, and multi-desk operators.',
        features: ['6 Quant Trader Seats', 'Rust Execution Engine Core (Sub-millisecond)', 'Multi-Portfolio Risk Manager', 'Direct Discord Desk Support']
      },
      extended: {
        type: 'extended',
        name: 'Institutional White-Label',
        price: 699,
        seats: 999,
        commercialUse: true,
        resaleAllowed: true,
        updatesMonths: 24,
        description: 'For fintech SaaS platforms offering algorithmic trading to end clients.',
        features: ['Unlimited Seats', 'Redistribution & White-label SaaS Rights', 'Source Rust Crate Repository', 'Custom Market Connector Development']
      }
    },
    techStack: ['Python 3.12', 'Rust 1.82', 'AsyncIO', 'Polars', 'WebSockets', 'Interactive Brokers API'],
    includedFiles: [
      'core/rust-engine/ (Sub-millisecond matching engine)',
      'python/algoalpha/ (Python high-level API & strategy classes)',
      'connectors/binance_ws.py',
      'connectors/interactive_brokers.py',
      'examples/mean_reversion_strategy.py',
      'docs/RISK_MANAGEMENT_GUIDELINES.pdf'
    ],
    changelog: [
      {
        version: 'v3.4.0',
        date: '2026-10-14',
        changes: ['Migrated pandas processing to Polars (18x speedup on 10M ticks)', 'Added automated circuit breaker on max drawdown > 5%', 'Added Interactive Brokers TWS API v10.20 support']
      }
    ],
    tags: ['Quant Trading', 'Python', 'Rust', 'Finance', 'Crypto', 'HFT'],
    isFeatured: false,
    instantDelivery: true
  },
  {
    id: 'DIGI-PROD-008',
    title: 'Distributed Systems & Microservices Architectural Master Blueprint',
    slug: 'distributed-systems-architecture-blueprint',
    shortDescription: '420-page comprehensive technical guide, interactive architecture diagrams, event-driven pattern blueprints, and interview mastery cases.',
    description: 'Written by top principal infrastructure architects. Covers consensus algorithms (Raft, Paxos), CQRS, event sourcing with Kafka, database sharding, two-phase commits vs Sagas, rate limiting at scale, and high-availability failure modes with real code implementations.',
    category: 'ebooks_guides',
    categoryLabel: 'E-Books & Engineering Guides',
    thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    previewUrl: 'https://books.commercezon.dev/sample-chapter.pdf',
    version: '3.0.0',
    releaseDate: '2026-06-25',
    lastUpdated: '2026-10-08',
    fileFormat: 'ZIP (.pdf, .epub, .drawio, .excalidraw)',
    fileSize: '68 MB',
    checksumSha256: '4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945',
    downloadsCount: 4320,
    rating: 4.98,
    reviewsCount: 380,
    author: {
      id: 'CREATOR-08',
      name: 'SystemDesign Weekly',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      verifiedBadge: true,
      salesCount: 11200,
      rating: 4.99,
      bio: 'Leading distributed systems engineering publication read by 150,000+ tech leads.'
    },
    licenseTiers: {
      standard: {
        type: 'standard',
        name: 'Single Reader Edition',
        price: 29,
        seats: 1,
        commercialUse: false,
        resaleAllowed: false,
        updatesMonths: 12,
        description: 'For individual engineers, software architects, and interview candidates.',
        features: ['Full 420-page PDF & ePub Edition', 'Interactive Excalidraw Diagrams', 'Lifetime Reading Access', '12 Months Free Edition Updates']
      },
      commercial: {
        type: 'commercial',
        name: 'Engineering Team Pass',
        price: 99,
        seats: 10,
        commercialUse: true,
        resaleAllowed: false,
        updatesMonths: 12,
        description: 'For corporate engineering teams and internal engineering bootcamps.',
        features: ['Up to 10 Team Members', 'Internal Company Distribution Allowed', 'Editable Draw.io / Excalidraw Assets', 'System Design Review Checklist']
      },
      extended: {
        type: 'extended',
        name: 'Company-Wide Enterprise Training',
        price: 249,
        seats: 999,
        commercialUse: true,
        resaleAllowed: true,
        updatesMonths: 24,
        description: 'For tech training organizations, universities, and enterprise-wide LMS integration.',
        features: ['Unlimited Organization Access', 'LMS Course Embedding Permission', 'Slide Deck Presentation Packs', 'Author Q&A Webinar Session']
      }
    },
    techStack: ['PDF', 'ePub', 'Excalidraw', 'Draw.io', 'Markdown', 'Architecture Diagrams'],
    includedFiles: [
      'Distributed_Systems_Blueprint_v3.pdf (High-res 420 pages)',
      'Distributed_Systems_Blueprint_v3.epub (Mobile friendly)',
      'diagrams/excalidraw_source_files/ (45 architecture diagrams)',
      'diagrams/drawio_high_res_exports/',
      'cheatsheets/MICROSERVICES_FAILURE_MODES.pdf'
    ],
    changelog: [
      {
        version: 'v3.0.0',
        date: '2026-10-08',
        changes: ['Added chapter on LLM inference infrastructure & KV cache routing', 'Updated Saga orchestration vs choreography case study', 'Added real-world outage post-mortem breakdowns']
      }
    ],
    tags: ['E-Book', 'Architecture', 'System Design', 'Microservices', 'Distributed Systems'],
    isFeatured: false,
    instantDelivery: true
  }
];

export const INITIAL_SEEDED_VAULT: DigitalVaultItem[] = [
  {
    id: 'VAULT-ITEM-001',
    orderId: 'DIGI-ORD-9821-41',
    productId: 'DIGI-PROD-001',
    productTitle: 'OmniStack SaaS - Next.js 15 & Go Microservices Architecture Kit',
    productThumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    licenseType: 'commercial',
    licenseTierName: 'Commercial Startup (5 Seats)',
    licenseKey: 'CZON-DIGI-7F2A-98C1-E4D2-B831',
    purchasedAt: '2026-10-18T14:22:00Z',
    downloadToken: 'tok_sec_9f86d081884c7d659a2feaa0c55ad015',
    downloadTokenExpiresAt: '2026-10-25T14:22:00Z',
    downloadAttemptsRemaining: 8,
    checksumSha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    fileFormat: 'ZIP (.ts, .go, .docker)',
    fileSize: '184 MB',
    currentVersion: 'v2.4.1',
    updateAvailable: false,
    activations: [
      {
        id: 'ACT-01',
        domainOrDeviceId: 'app.mycompany.io',
        activatedAt: '2026-10-18T16:04:12Z',
        status: 'active'
      },
      {
        id: 'ACT-02',
        domainOrDeviceId: 'staging.mycompany.io',
        activatedAt: '2026-10-19T09:12:45Z',
        status: 'active'
      }
    ],
    maxActivations: 5
  },
  {
    id: 'VAULT-ITEM-002',
    orderId: 'DIGI-ORD-8940-12',
    productId: 'DIGI-PROD-003',
    productTitle: 'NexusUI Enterprise Design System - React 19, Tailwind v4 & Figma',
    productThumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80',
    licenseType: 'standard',
    licenseTierName: 'Single App License',
    licenseKey: 'CZON-DIGI-3B19-4CA0-D19F-A77E',
    purchasedAt: '2026-10-19T11:05:00Z',
    downloadToken: 'tok_sec_a1b2c3d4e5f60718293a4b5c6d7e8f90',
    downloadTokenExpiresAt: '2026-10-26T11:05:00Z',
    downloadAttemptsRemaining: 9,
    checksumSha256: 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0',
    fileFormat: 'ZIP (.tsx, .fig, .json)',
    fileSize: '92 MB',
    currentVersion: 'v4.0.2',
    updateAvailable: false,
    activations: [
      {
        id: 'ACT-03',
        domainOrDeviceId: 'portal.fintechdemo.com',
        activatedAt: '2026-10-19T12:00:22Z',
        status: 'active'
      }
    ],
    maxActivations: 1
  }
];
