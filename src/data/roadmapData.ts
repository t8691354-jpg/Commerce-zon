import { MasterPhase } from '../types/domain';

export const MASTER_ROADMAP: MasterPhase[] = [
  {
    id: 'phase-1',
    code: 'PHASE-1',
    title: 'Phase 1: Architecture Foundation & Domain Core (Current Focus)',
    description: 'Establish enterprise clean architecture, hexagonal boundaries, domain models, mock data layer, server infrastructure, and roadmap governance viewer.',
    milestones: [
      {
        id: 'm1-1',
        code: 'M1.1',
        title: 'Milestone 1.1: Core Domain Entities & System Infrastructure',
        description: 'Define strong domain models, Express + Vite server bridge, audit logger, and master roadmap viewer.',
        tasks: [
          {
            id: 't1-1-1',
            code: 'Task 1.1.1',
            title: 'Define Domain Models, Express API Server, Mock Repository & Roadmap Explorer',
            description: 'Implement domain models (Product, Merchant, Warehouse, Order, AuditLog), server endpoints, lazy Gemini API bridge, and interactive roadmap modal.',
            status: 'completed',
            completedAt: '2026-07-25',
          },
          {
            id: 't1-1-2',
            code: 'Task 1.1.2',
            title: 'Event-Driven In-Memory Event Bus & Audit Trail Manager',
            description: 'Implement decoupled event publish/subscribe system for domain events (e.g. OrderPlacedEvent, InventoryDepletedEvent).',
            status: 'completed',
            completedAt: '2026-07-25',
          },
          {
            id: 't1-1-3',
            code: 'Task 1.1.3',
            title: 'CQRS Repository Abstraction & Command/Query Handlers',
            description: 'Separate read model projections from command mutators for high performance reads.',
            status: 'completed',
            completedAt: '2026-07-25',
          },
        ],
      },
      {
        id: 'm1-2',
        code: 'M1.2',
        title: 'Milestone 1.2: Multi-Warehouse Inventory & Fulfillment Network',
        description: 'Multi-location inventory tracking, safety stock triggers, and inter-warehouse stock reservation.',
        tasks: [
          {
            id: 't1-2-1',
            code: 'Task 1.2.1',
            title: 'Multi-Warehouse Inventory Matrix & Stock Allocation Engine',
            description: 'Calculate real-time stock across multiple hubs and allocate orders to closest warehouse.',
            status: 'completed',
            completedAt: '2026-07-25',
          },
          {
            id: 't1-2-2',
            code: 'Task 1.2.2',
            title: 'Safety Threshold Alerting & Reorder Automation Pipeline',
            description: 'Automate reorder recommendation when warehouse units drop below threshold.',
            status: 'pending',
          },
        ],
      },
    ],
  },
  {
    id: 'phase-2',
    code: 'PHASE-2',
    title: 'Phase 2: AI Intelligence Suite & Modular Engines',
    description: 'Integrate Gemini-powered search, product drafting, intelligent pricing, demand prediction, and fraud detection.',
    milestones: [
      {
        id: 'm2-1',
        code: 'M2.1',
        title: 'Milestone 2.1: Semantic AI Search & Natural Language Catalog Discovery',
        description: 'AI vector/semantic search understanding user queries like "heavy duty developer laptop with long battery".',
        tasks: [
          {
            id: 't2-1-1',
            code: 'Task 2.1.1',
            title: 'Server-Side Gemini Semantic Search Endpoint with Intent Parsing',
            description: 'Extract brand, category, price constraints, and features from user queries.',
            status: 'pending',
          },
          {
            id: 't2-1-2',
            code: 'Task 2.1.2',
            title: 'AI Smart Recommendation Carousel & Related Product Matcher',
            description: 'Generate dynamic recommendations based on mock user interaction graphs.',
            status: 'pending',
          },
        ],
      },
      {
        id: 'm2-2',
        code: 'M2.2',
        title: 'Milestone 2.2: Merchant AI Copilot & Automated Content Studio',
        description: 'Empower sellers with AI product drafting, tag extraction, image enhancement prompts, and price optimization.',
        tasks: [
          {
            id: 't2-2-1',
            code: 'Task 2.2.1',
            title: 'AI Product Listing & SEO Description Generator',
            description: 'Generate structured catalog titles, markdown specs, and SEO keywords from raw merchant input.',
            status: 'pending',
          },
          {
            id: 't2-2-2',
            code: 'Task 2.2.2',
            title: 'AI Smart Dynamic Pricing Engine & Demand Forecaster',
            description: 'Analyze competitors, stock levels, and demand trends to suggest optimized prices.',
            status: 'pending',
          },
        ],
      },
    ],
  },
  {
    id: 'phase-3',
    code: 'PHASE-3',
    title: 'Phase 3: Order Management, Fraud Safeguards & Multi-Merchant Ops',
    description: 'End-to-end checkout pipeline, multi-seller split orders, dispute assistance, and AI risk scoring.',
    milestones: [
      {
        id: 'm3-1',
        code: 'M3.1',
        title: 'Milestone 3.1: Multi-Vendor Split Order Pipeline',
        description: 'Fulfill items across multiple vendors and warehouses with atomic transaction handling.',
        tasks: [
          {
            id: 't3-1-1',
            code: 'Task 3.1.1',
            title: 'Multi-Seller Cart Partitioning & Warehouse Routing Engine',
            description: 'Split cart into merchant sub-orders and compute precise fulfillment routes.',
            status: 'pending',
          },
          {
            id: 't3-1-2',
            code: 'Task 3.1.2',
            title: 'AI Fraud Detection & Risk Scoring Guardrails',
            description: 'Evaluate transaction velocity, buyer history, and item risk to assign 0-100 fraud scores.',
            status: 'pending',
          },
        ],
      },
    ],
  },
  {
    id: 'phase-4',
    code: 'PHASE-4',
    title: 'Phase 4: Security Hardening, Zero-Trust Architecture & Database Strategy',
    description: 'Database normalization, PostgreSQL / Firestore schemas, audit log persistence, rate limiting, and RBAC architecture.',
    milestones: [
      {
        id: 'm4-1',
        code: 'M4.1',
        title: 'Milestone 4.1: Database Persistence Layer & Soft Delete Auditing',
        description: 'Provide persistent ORM schemas (Drizzle / Firestore) with soft deletes and event logs.',
        tasks: [
          {
            id: 't4-1-1',
            code: 'Task 4.1.1',
            title: 'Normalized Schema Definition with Version Control & Audit Triggers',
            description: 'Define relational database schema with indices, foreign keys, and audit log tables.',
            status: 'pending',
          },
        ],
      },
    ],
  },
  {
    id: 'phase-5',
    code: 'PHASE-5',
    title: 'Phase 5: Production Deployment, Monitoring & Auth Integration (Final Phase)',
    description: 'OAuth/Firebase Auth integration (intentionally deferred until core platform stability), CI/CD pipelines, and SLA dashboards.',
    milestones: [
      {
        id: 'm5-1',
        code: 'M5.1',
        title: 'Milestone 5.1: Authentication & Role-Based Access Control Integration',
        description: 'Plug in OAuth 2.0 / Firebase Auth for Merchants, Customers, and System Admins after core platform stability.',
        tasks: [
          {
            id: 't5-1-1',
            code: 'Task 5.1.1',
            title: 'Secure JWT/OAuth Multi-Tenant Auth Service Integration',
            description: 'Integrate authentication providers and bind roles to mock user identities.',
            status: 'pending',
          },
        ],
      },
    ],
  },
];
