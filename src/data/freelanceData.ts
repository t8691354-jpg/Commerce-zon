import { FreelanceJob, FreelancerProfile, FreelanceProposal } from '../types/freelancer';

export const SEEDED_FREELANCERS: FreelancerProfile[] = [
  {
    id: 'FL-001',
    name: 'Sarah Chen, Lead Architect',
    title: 'Senior Full-Stack & Generative AI Systems Engineer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    category: 'ai_ml',
    hourlyRate: 85,
    rating: 4.98,
    reviewsCount: 114,
    completedProjects: 89,
    earnings: 148500,
    bio: 'Ex-Stripe principal frontend and distributed systems architect. Specializing in Next.js 15, Go microservices, LLM agent tool calling, and high-throughput real-time APIs.',
    skills: ['Next.js 15', 'TypeScript', 'Go', 'Gemini API', 'PostgreSQL', 'Docker', 'WebSockets'],
    badges: ['Top Rated Plus', 'Verified Identity', '100% Job Success'],
    location: 'San Francisco, USA',
    responseTime: '< 1 hour',
    isVerified: true,
    portfolio: [
      {
        id: 'port-1',
        title: 'Enterprise AI Agent Orchestrator',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
        description: 'Multi-agent reasoning system with autonomous function calling and Postgres caching.',
        tag: 'AI / Full Stack'
      },
      {
        id: 'port-2',
        title: 'Global Fintech Payment Gateway',
        image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
        description: 'High-availability ledger handling $12M daily transaction volume.',
        tag: 'Fintech'
      }
    ]
  },
  {
    id: 'FL-002',
    name: 'Tariq Al-Mansoor',
    title: 'Principal Mobile UI/UX & Flutter Product Designer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    category: 'ui_ux_design',
    hourlyRate: 65,
    rating: 4.96,
    reviewsCount: 88,
    completedProjects: 72,
    earnings: 96400,
    bio: 'Award-winning product designer crafting fluid iOS & Android design systems in Figma and Flutter. Passionate about micro-interactions, WCAG AA accessibility, and zero-clutter flows.',
    skills: ['Figma', 'UI/UX Design', 'Flutter', 'Design Systems', 'Prototyping', 'Tailwind CSS'],
    badges: ['Top Rated', 'Design Expert', 'Fast Responder'],
    location: 'Dubai, UAE',
    responseTime: '< 30 mins',
    isVerified: true,
    portfolio: [
      {
        id: 'port-3',
        title: 'Noon-Style Mobile Marketplace UI',
        image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&auto=format&fit=crop&q=80',
        description: 'Pixel-perfect mobile shopping app with clean category pills and 1-tap checkout.',
        tag: 'Mobile E-Commerce'
      }
    ]
  },
  {
    id: 'FL-003',
    name: 'David Kowalski',
    title: 'DevOps & Multi-Cloud Kubernetes Infrastructure Specialist',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    category: 'devops_cloud',
    hourlyRate: 90,
    rating: 4.99,
    reviewsCount: 95,
    completedProjects: 81,
    earnings: 162000,
    bio: 'CKA certified Kubernetes engineer and Terraform consultant. Automating zero-downtime GitOps pipelines across AWS, GCP, and Azure with Cilium eBPF network security.',
    skills: ['Kubernetes', 'Terraform', 'ArgoCD', 'AWS', 'GCP', 'Prometheus', 'Helm', 'Docker'],
    badges: ['Top Rated Plus', 'Cloud Verified'],
    location: 'Berlin, Germany',
    responseTime: '< 2 hours',
    isVerified: true,
    portfolio: [
      {
        id: 'port-4',
        title: 'Multi-Region Kubernetes Failover',
        image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80',
        description: 'Zero-downtime multi-cloud failover mesh serving 50k requests/sec.',
        tag: 'DevOps'
      }
    ]
  },
  {
    id: 'FL-004',
    name: 'Zainab Qureshi',
    title: 'Senior Cross-Platform React Native & Flutter Engineer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    category: 'mobile_apps',
    hourlyRate: 70,
    rating: 4.95,
    reviewsCount: 64,
    completedProjects: 53,
    earnings: 84000,
    bio: 'Mobile software engineer dedicated to building 60 FPS offline-first apps for iOS & Android. Experienced in push notifications, background sync, biometrics, and Stripe mobile SDK.',
    skills: ['React Native', 'Flutter', 'TypeScript', 'GraphQL', 'Firebase', 'State Machines'],
    badges: ['Top Rated', 'Mobile Specialist'],
    location: 'London, UK',
    responseTime: '< 1 hour',
    isVerified: true,
    portfolio: [
      {
        id: 'port-5',
        title: 'Ride-Hailing & Courier Logistics App',
        image: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80',
        description: 'Real-time GPS vehicle tracking with offline job queuing for couriers.',
        tag: 'Mobile Apps'
      }
    ]
  }
];

export const SEEDED_FREELANCE_JOBS: FreelanceJob[] = [
  {
    id: 'JOB-2026-001',
    title: 'Build Autonomous AI Customer Support Agent with Tool Calling',
    description: 'We require an expert software engineer to develop an autonomous AI support engine for Commerce Zone. Must integrate Gemini 2.5 Flash, structured tool calling for order lookups, refunds escalation, and automated sentiment analysis with sub-800ms streaming.',
    category: 'ai_ml',
    categoryLabel: 'AI & Machine Learning',
    budget: 3500,
    budgetType: 'FIXED',
    skills: ['Gemini API', 'TypeScript', 'Node.js', 'PostgreSQL', 'Streaming', 'JSON Schema'],
    experienceLevel: 'EXPERT',
    duration: '3-4 weeks',
    clientId: 'CLIENT-101',
    clientName: 'Apex Cloud Solutions',
    clientRating: 4.98,
    clientTotalSpent: 48000,
    clientCountry: 'United States',
    proposalsCount: 6,
    status: 'OPEN',
    milestones: [
      {
        id: 'M-1',
        title: 'Phase 1: Architecture, Tool Schema Definition & Prompt Engineering',
        amount: 1000,
        status: 'ESCROW_FUNDED',
        dueDate: '2026-11-05'
      },
      {
        id: 'M-2',
        title: 'Phase 2: Live Express Backend Integration & Function Execution Sandbox',
        amount: 1500,
        status: 'PENDING',
        dueDate: '2026-11-20'
      },
      {
        id: 'M-3',
        title: 'Phase 3: Automated Evals Test Suite & Production Rollout',
        amount: 1000,
        status: 'PENDING',
        dueDate: '2026-12-01'
      }
    ],
    postedAt: '2026-10-20T10:00:00Z'
  },
  {
    id: 'JOB-2026-002',
    title: 'Figma to React Native Clean UI for Multi-Vendor Seller App',
    description: 'Convert 12 Figma mobile screen designs into responsive, production-ready React Native components with Tailwind styling. Must follow clean component structure with strict TypeScript interfaces, dark mode support, and smooth bottom sheet drawers.',
    category: 'mobile_apps',
    categoryLabel: 'Mobile App Development',
    budget: 1800,
    budgetType: 'FIXED',
    skills: ['React Native', 'Figma', 'TypeScript', 'Tailwind', 'Mobile Navigation'],
    experienceLevel: 'INTERMEDIATE',
    duration: '2 weeks',
    clientId: 'CLIENT-102',
    clientName: 'Digital Pulse Media',
    clientRating: 4.92,
    clientTotalSpent: 22000,
    clientCountry: 'United Kingdom',
    proposalsCount: 8,
    status: 'IN_PROGRESS',
    milestones: [
      {
        id: 'M-4',
        title: 'Milestone 1: Bottom Navigation, Home & Products Catalog Screens',
        amount: 900,
        status: 'SUBMITTED',
        dueDate: '2026-10-28',
        deliverableNote: 'Completed screens with NativeWind Tailwind styles and mock data models.'
      },
      {
        id: 'M-5',
        title: 'Milestone 2: Orders, Earnings & Seller Profile Settings with Tests',
        amount: 900,
        status: 'PENDING',
        dueDate: '2026-11-10'
      }
    ],
    postedAt: '2026-10-18T14:30:00Z'
  },
  {
    id: 'JOB-2026-003',
    title: 'Hardened Kubernetes Multi-Cloud Deployment with Cilium eBPF',
    description: 'Looking for a Senior DevOps consultant to design and deploy Terraform modules for AWS EKS and GCP GKE with Cilium mesh, automated Vault secret injection, and Prometheus/Grafana SLA alerts.',
    category: 'devops_cloud',
    categoryLabel: 'DevOps & Cloud Systems',
    budget: 2800,
    budgetType: 'FIXED',
    skills: ['Kubernetes', 'Terraform', 'Cilium', 'AWS', 'GCP', 'Vault', 'ArgoCD'],
    experienceLevel: 'EXPERT',
    duration: '2-3 weeks',
    clientId: 'CLIENT-103',
    clientName: 'HyperScale Distributed Systems',
    clientRating: 5.0,
    clientTotalSpent: 65000,
    clientCountry: 'Germany',
    proposalsCount: 4,
    status: 'OPEN',
    milestones: [
      {
        id: 'M-6',
        title: 'Milestone 1: Terraform Cluster Provisioning & Network Security Policies',
        amount: 1400,
        status: 'PENDING',
        dueDate: '2026-11-12'
      },
      {
        id: 'M-7',
        title: 'Milestone 2: ArgoCD GitOps Pipelines & Monitoring Dashboard Validation',
        amount: 1400,
        status: 'PENDING',
        dueDate: '2026-11-25'
      }
    ],
    postedAt: '2026-10-19T08:15:00Z'
  },
  {
    id: 'JOB-2026-004',
    title: 'FinTech Digital Wallet Design System & High-Fidelity Prototype',
    description: 'Need a Senior UI/UX Designer to craft an intuitive, clean design system for a global digital wallet and escrow payment gateway. Includes transaction cards, KYC camera flow, and virtual card management.',
    category: 'ui_ux_design',
    categoryLabel: 'UI/UX & Product Design',
    budget: 1500,
    budgetType: 'FIXED',
    skills: ['Figma', 'UI/UX', 'Design System', 'Prototyping', 'FinTech'],
    experienceLevel: 'EXPERT',
    duration: '1-2 weeks',
    clientId: 'CLIENT-104',
    clientName: 'ZonPay Global',
    clientRating: 4.95,
    clientTotalSpent: 35000,
    clientCountry: 'United Arab Emirates',
    proposalsCount: 11,
    status: 'OPEN',
    milestones: [
      {
        id: 'M-8',
        title: 'Milestone 1: Design Tokens, Typography & Component Library',
        amount: 750,
        status: 'PENDING',
        dueDate: '2026-11-02'
      },
      {
        id: 'M-9',
        title: 'Milestone 2: Interactive Prototype & Developer Handoff Specs',
        amount: 750,
        status: 'PENDING',
        dueDate: '2026-11-09'
      }
    ],
    postedAt: '2026-10-21T06:00:00Z'
  }
];

export const INITIAL_PROPOSALS: FreelanceProposal[] = [
  {
    id: 'PROP-01',
    jobId: 'JOB-2026-001',
    jobTitle: 'Build Autonomous AI Customer Support Agent with Tool Calling',
    freelancerId: 'FL-001',
    freelancerName: 'Sarah Chen, Lead Architect',
    bidAmount: 3400,
    deliveryDays: 21,
    coverLetter: 'I have built over 10 production LLM agents utilizing Gemini structured tool calling and streaming. I will provide a full test suite with 99% accuracy on customer intent routing.',
    milestonesProposed: [
      { title: 'Schema & Architecture', amount: 1000 },
      { title: 'Backend Integration & Tools', amount: 1400 },
      { title: 'Evals & Production Verification', amount: 1000 }
    ],
    submittedAt: '2026-10-20T12:00:00Z',
    status: 'PENDING'
  }
];
