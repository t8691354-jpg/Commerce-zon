import {
  KnowledgeArticle,
  SupportTicket,
  LiveChatSession,
  SupportAgent,
  SlaPolicy,
  CsatFeedback,
  SupportNotification,
  SupportMetrics,
} from '../types/support';

export const MOCK_KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  {
    articleId: 'KB-101',
    title: 'How to Track Order Package Delivery & Carrier Telemetry',
    category: 'BUYER_GUIDES',
    summary: 'Comprehensive guide to tracking real-time GPS locations, carrier airway bills, and estimated doorstep arrival windows.',
    content: `
# Order Delivery & Carrier Telemetry Guide

When an order is placed on our global marketplace, a multi-stage fulfillment pipeline is triggered across Commerce Zon Warehouses and Logistics Hubs.

### Tracking Stages:
1. **Order Confirmed**: Payment verified and escrow reserved.
2. **FC Intake & Packing**: Item picked at regional fulfillment center (e.g. SEA-1).
3. **Outbound Dispatch**: Carrier (DHL, FedEx, UPS, or Commerce Zon Logistics) scans package barcode.
4. **In Transit**: Real-time GPS coordinates updated every 15 minutes.
5. **Out for Delivery**: Local driver assigned with OTP security passcode.

### How to Find Your Passcode:
Check your SMS or in-app notification 30 minutes before driver arrival for your 4-digit Delivery Verification Code.
    `,
    tags: ['Shipping', 'Tracking', 'Delivery', 'Carrier', 'OTP'],
    readTimeMinutes: 4,
    helpfulYes: 1240,
    helpfulNo: 32,
    lastUpdated: '2026-07-20T10:00:00Z',
    author: 'Commerce Zon Customer Excellence Team',
    relatedArticleIds: ['KB-102', 'KB-105'],
  },
  {
    articleId: 'KB-102',
    title: 'Initiating Prepaid RMA Returns & Instant Wallet Refunds',
    category: 'RETURNS_REFUND_GUIDES',
    summary: 'Learn how to generate paperless QR barcodes for UPS/FedEx drop-offs and receive instant refund credits.',
    content: `
# Prepaid RMA Returns & Refund Guide

Our 30-Day Hassle-Free Return Policy guarantees instant customer satisfaction.

### Step-by-Step Return Process:
1. Navigate to **Orders & Returns (Module 14)** in your account menu.
2. Select the item and choose a buyer return reason (e.g., *Defective*, *Size Mismatch*, *Changed Mind*).
3. Select your refund destination: **Marketplace Wallet Credit (Instant)** or **Original Payment Card (3-5 Business Days)**.
4. Download or display the **Paperless Mobile QR Barcode** on your phone.
5. Drop off at any authorized UPS, FedEx, or Commerce Zon Locker station. No box label printing required!
    `,
    tags: ['Returns', 'RMA', 'Refund', 'Wallet Credit', 'QR Code'],
    readTimeMinutes: 3,
    helpfulYes: 2180,
    helpfulNo: 45,
    lastUpdated: '2026-07-22T14:30:00Z',
    author: 'Reverse Commerce Operations',
    relatedArticleIds: ['KB-101', 'KB-106'],
  },
  {
    articleId: 'KB-103',
    title: 'Merchant Seller Central: Managing Fulfillment By Commerce Zon (FBA) Inbound Shipments',
    category: 'FBA_GUIDES',
    summary: 'Guide for third-party marketplace sellers on creating inbound shipment plans, ASIN barcoding, and FC storage fees.',
    content: `
# FBA Inbound Shipment Guide for Sellers

Third-party merchants can leverage Commerce Zon Fulfillment Centers to offer Prime 1-Day shipping to millions of buyers worldwide.

### Inbound Workflow:
1. Open **FBA Logistics Module** in Seller Central.
2. Specify unit counts, pallet configurations, and hazardous material disclosures.
3. Print **Commerce Zon FNSKU Barcode Labels** for each item.
4. Schedule carrier pickup with Commerce Zon Freight or partner carriers.
5. Track FC receiving status in real-time as inventory is stowed into automated robotics racks.
    `,
    tags: ['Seller', 'FBA', 'Inventory', 'Shipment Plan', 'FNSKU'],
    readTimeMinutes: 6,
    helpfulYes: 890,
    helpfulNo: 18,
    lastUpdated: '2026-07-18T09:15:00Z',
    author: 'Seller Services Group',
    relatedArticleIds: ['KB-104', 'KB-107'],
  },
  {
    articleId: 'KB-104',
    title: 'Dropshipping Supplier Integration & Automated Order Forwarding',
    category: 'DROPSHIPPING_GUIDES',
    summary: 'How to link external supplier APIs (AliExpress, CJ Dropshipping) for zero-inventory automated order fulfillment.',
    content: `
# Dropshipping Automation Guide

Connect high-volume suppliers to automatically sync product catalogs, inventory levels, and tracking numbers.

### Key Features:
* **Automated Webhooks**: Orders placed by buyers are instantly forwarded to supplier portals.
* **Auto-Price Markup**: Set global or category-level profit margin rules (e.g. +25% markup).
* **Tracking Auto-Sync**: Carrier tracking numbers automatically link back to buyer notifications.
    `,
    tags: ['Dropshipping', 'Suppliers', 'Automation', 'API', 'Markup'],
    readTimeMinutes: 5,
    helpfulYes: 640,
    helpfulNo: 12,
    lastUpdated: '2026-07-25T11:45:00Z',
    author: 'Vendor Engineering',
    relatedArticleIds: ['KB-103'],
  },
  {
    articleId: 'KB-105',
    title: 'Multi-Currency Payments, Escrow & Wallet Ledger Operations',
    category: 'PAYMENT_GUIDES',
    summary: 'Understanding double-entry ledger security, 3D-Secure 2.0 card processing, and withdrawal schedules.',
    content: `
# Payment Processing & Wallet Security

All marketplace payments are secured by bank-grade TLS 1.3 encryption and 3D-Secure 2.0 buyer authentication.

### Escrow Protection:
Funds collected during checkout are held in a secure escrow pool until the buyer receives the package or the 7-day delivery confirmation window expires. Sellers can request instant payout disbursements to connected bank accounts or crypto wallets.
    `,
    tags: ['Payments', 'Wallet', 'Escrow', 'Security', '3DS'],
    readTimeMinutes: 4,
    helpfulYes: 920,
    helpfulNo: 15,
    lastUpdated: '2026-07-21T16:20:00Z',
    author: 'Financial Risk & Treasury Team',
    relatedArticleIds: ['KB-102', 'KB-108'],
  },
  {
    articleId: 'KB-106',
    title: 'Account Security, Two-Factor Authentication (2FA) & Fraud Prevention',
    category: 'ACCOUNT_SECURITY_GUIDES',
    summary: 'How to protect your buyer/seller account with TOTP authenticator apps, passkeys, and login alerts.',
    content: `
# Account Protection & Anti-Phishing Rules

Protecting your account data is our top priority.

### Recommended Security Steps:
1. Enable **Two-Factor Authentication (2FA)** using Google Authenticator or YubiKey hardware tokens.
2. Review active sessions in **Security Settings**.
3. Never share your 6-digit OTP codes with anyone, including support staff. Commerce Zon staff will never ask for your password.
    `,
    tags: ['Security', '2FA', 'Passkeys', 'Fraud', 'Protection'],
    readTimeMinutes: 3,
    helpfulYes: 1530,
    helpfulNo: 10,
    lastUpdated: '2026-07-27T08:00:00Z',
    author: 'Cybersecurity Operations Center',
    relatedArticleIds: ['KB-105'],
  },
];

export const MOCK_SUPPORT_TICKETS: SupportTicket[] = [
  {
    ticketId: 'TCK-90124',
    userRole: 'BUYER',
    userId: 'USR-8821',
    userName: 'David Miller',
    userEmail: 'david.m@example.com',
    orderId: 'ORD-2026-8812',
    category: 'ORDERS',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    subject: 'Package marked delivered but not received at doorstep',
    description: 'Carrier status shows delivered by Commerce Zon Logistics at 2:15 PM, but my front porch is empty and security camera shows no delivery truck.',
    attachments: ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80'],
    assignedAgentId: 'AGT-101',
    assignedAgentName: 'Sarah Jenkins (Senior CX)',
    department: 'Customer Support Tier 2',
    sentiment: 'FRUSTRATED',
    language: 'English (US)',
    createdDate: '2026-07-28T01:15:00Z',
    updatedDate: '2026-07-28T01:45:00Z',
    slaBreached: false,
    slaFirstResponseDueDate: '2026-07-28T01:30:00Z',
    slaResolutionDueDate: '2026-07-28T05:15:00Z',
    internalNotesCount: 2,
    messages: [
      {
        messageId: 'MSG-801',
        ticketId: 'TCK-90124',
        senderRole: 'BUYER',
        senderName: 'David Miller',
        message: 'Carrier status shows delivered by Commerce Zon Logistics at 2:15 PM, but my front porch is empty and security camera shows no delivery truck.',
        timestamp: '2026-07-28T01:15:00Z',
      },
      {
        messageId: 'MSG-802',
        ticketId: 'TCK-90124',
        senderRole: 'AI_COPILOT',
        senderName: 'Commerce Zon AI Support Assistant',
        message: 'Hello David! I have analyzed your order ORD-2026-8812. Carrier tracking indicates driver misplacement risk. I have flagged this ticket with Tier 2 Logistics Dispatch for immediate driver callback.',
        timestamp: '2026-07-28T01:16:00Z',
        isAiGenerated: true,
      },
      {
        messageId: 'MSG-803',
        ticketId: 'TCK-90124',
        senderRole: 'AGENT',
        senderName: 'Sarah Jenkins (Senior CX)',
        message: 'Hi David, I am investigating with the driver supervisor at FC Seattle. If driver confirmation fails within 2 hours, we will issue an immediate replacement or full refund.',
        timestamp: '2026-07-28T01:45:00Z',
      },
      {
        messageId: 'MSG-804',
        ticketId: 'TCK-90124',
        senderRole: 'AGENT',
        senderName: 'Sarah Jenkins',
        message: 'Internal Note: Checked GPS driver telemetry at 14:15. Truck was 2 doors down. Contacted DSP dispatch manager.',
        timestamp: '2026-07-28T01:46:00Z',
        isInternalNote: true,
      },
    ],
  },
  {
    ticketId: 'TCK-90125',
    userRole: 'SELLER',
    userId: 'SEL-401',
    userName: 'TechGizmo Electronics Ltd',
    userEmail: 'support@techgizmo.io',
    category: 'SELLER_ISSUES',
    priority: 'URGENT_CRITICAL',
    status: 'WAITING_FOR_SELLER',
    subject: 'FBA Inventory Discrepancy & Missing Pallet at FC-Seattle',
    description: 'Inbound shipment FBA-9912 arrived yesterday with 200 units of Wireless Headphones, but inventory stow report only credits 120 units.',
    attachments: [],
    assignedAgentId: 'AGT-103',
    assignedAgentName: 'Marcus Vance (FBA Ops)',
    department: 'Warehouse & FBA Seller Ops',
    sentiment: 'CRITICAL',
    language: 'English (US)',
    createdDate: '2026-07-27T18:20:00Z',
    updatedDate: '2026-07-28T00:10:00Z',
    slaBreached: false,
    slaFirstResponseDueDate: '2026-07-27T18:50:00Z',
    slaResolutionDueDate: '2026-07-28T18:20:00Z',
    internalNotesCount: 1,
    messages: [
      {
        messageId: 'MSG-810',
        ticketId: 'TCK-90125',
        senderRole: 'SELLER',
        senderName: 'TechGizmo Electronics',
        message: 'Inbound shipment FBA-9912 arrived yesterday with 200 units of Wireless Headphones, but inventory stow report only credits 120 units. Please audit receiving dock video.',
        timestamp: '2026-07-27T18:20:00Z',
      },
      {
        messageId: 'MSG-811',
        ticketId: 'TCK-90125',
        senderRole: 'AGENT',
        senderName: 'Marcus Vance (FBA Ops)',
        message: 'Hello TechGizmo team, dock QA audited pallet 2 and found 80 units in temporary inspection queue due to missing outer master carton barcode. Please upload bill of lading copy to complete credit.',
        timestamp: '2026-07-28T00:10:00Z',
      },
    ],
  },
  {
    ticketId: 'TCK-90126',
    userRole: 'BUYER',
    userId: 'USR-3109',
    userName: 'Elena Rostova',
    userEmail: 'elena.r@example.org',
    orderId: 'ORD-2026-9042',
    category: 'REFUNDS',
    priority: 'MEDIUM',
    status: 'RESOLVED',
    subject: 'Request for price difference adjustment after deal discount',
    description: 'Purchased Smart Fitness Watch 2 days ago for $199. Today it is featured in Lightning Deals for $149.',
    attachments: [],
    assignedAgentId: 'AGT-102',
    assignedAgentName: 'Alex Rivera (Finance Support)',
    department: 'Finance & Payments Support',
    sentiment: 'NEUTRAL',
    language: 'English (US)',
    createdDate: '2026-07-27T10:00:00Z',
    updatedDate: '2026-07-27T11:20:00Z',
    resolutionDate: '2026-07-27T11:20:00Z',
    slaBreached: false,
    slaFirstResponseDueDate: '2026-07-27T10:30:00Z',
    slaResolutionDueDate: '2026-07-27T22:00:00Z',
    internalNotesCount: 1,
    messages: [
      {
        messageId: 'MSG-820',
        ticketId: 'TCK-90126',
        senderRole: 'BUYER',
        senderName: 'Elena Rostova',
        message: 'Purchased Smart Fitness Watch 2 days ago for $199. Today it is featured in Lightning Deals for $149. Can I get a partial refund credit?',
        timestamp: '2026-07-27T10:00:00Z',
      },
      {
        messageId: 'MSG-821',
        ticketId: 'TCK-90126',
        senderRole: 'AGENT',
        senderName: 'Alex Rivera',
        message: 'Hi Elena! As a Prime member courtesy, I have approved a $50.00 promotional wallet credit to your account.',
        timestamp: '2026-07-27T11:20:00Z',
      },
    ],
  },
];

export const MOCK_LIVE_CHAT_SESSIONS: LiveChatSession[] = [
  {
    chatSessionId: 'CHAT-7701',
    userRole: 'BUYER',
    userId: 'USR-8821',
    userName: 'David Miller',
    userEmail: 'david.m@example.com',
    assignedAgentId: 'AGT-101',
    assignedAgentName: 'Sarah Jenkins (Senior CX)',
    status: 'AGENT_CONNECTED',
    sentiment: 'FRUSTRATED',
    language: 'English (US)',
    startedAt: '2026-07-28T01:50:00Z',
    messages: [
      {
        messageId: 'CMSG-1',
        chatSessionId: 'CHAT-7701',
        senderRole: 'USER',
        senderName: 'David Miller',
        text: 'Hi, I need help with my package ORD-2026-8812.',
        timestamp: '2026-07-28T01:50:00Z',
        isRead: true,
      },
      {
        messageId: 'CMSG-2',
        chatSessionId: 'CHAT-7701',
        senderRole: 'BOT',
        senderName: 'Commerce Zon AI Virtual Assistant',
        text: 'Hello David! I see your order ORD-2026-8812 is currently under investigation by Tier 2 Support. Would you like me to connect you directly with Senior Agent Sarah Jenkins?',
        timestamp: '2026-07-28T01:50:05Z',
        isRead: true,
        smartReplies: ['Yes, connect to agent', 'Check tracking status', 'Cancel order'],
      },
      {
        messageId: 'CMSG-3',
        chatSessionId: 'CHAT-7701',
        senderRole: 'USER',
        senderName: 'David Miller',
        text: 'Yes, connect to agent please.',
        timestamp: '2026-07-28T01:50:20Z',
        isRead: true,
      },
      {
        messageId: 'CMSG-4',
        chatSessionId: 'CHAT-7701',
        senderRole: 'SYSTEM',
        senderName: 'System',
        text: 'Agent Sarah Jenkins joined the chat.',
        timestamp: '2026-07-28T01:50:30Z',
        isRead: true,
      },
      {
        messageId: 'CMSG-5',
        chatSessionId: 'CHAT-7701',
        senderRole: 'AGENT',
        senderName: 'Sarah Jenkins',
        text: 'Hello David! I am here live on your account. The delivery manager confirmed the driver is circling back to deliver to porch #4.',
        timestamp: '2026-07-28T01:51:00Z',
        isRead: true,
      },
    ],
  },
  {
    chatSessionId: 'CHAT-7702',
    userRole: 'SELLER',
    userId: 'SEL-502',
    userName: 'ModaLux Apparel',
    userEmail: 'partners@modalux.fashion',
    assignedAgentId: 'AGT-104',
    assignedAgentName: 'Jessica Wong (Seller Success)',
    status: 'BOT_ACTIVE',
    sentiment: 'NEUTRAL',
    language: 'English (US)',
    startedAt: '2026-07-28T02:00:00Z',
    aiHandoverReason: 'Automated policy query regarding holiday return windows.',
    messages: [
      {
        messageId: 'CMSG-10',
        chatSessionId: 'CHAT-7702',
        senderRole: 'USER',
        senderName: 'ModaLux Apparel',
        text: 'What is the extended return window policy for Q4 apparel sales?',
        timestamp: '2026-07-28T02:00:00Z',
        isRead: true,
      },
      {
        messageId: 'CMSG-11',
        chatSessionId: 'CHAT-7702',
        senderRole: 'BOT',
        senderName: 'Commerce Zon AI Virtual Assistant',
        text: 'For Q4 sales (Oct 1 to Dec 31), items can be returned through January 31 of the following year. Restocking fees are waived for apparel with original tags attached.',
        timestamp: '2026-07-28T02:00:04Z',
        isRead: true,
        smartReplies: ['Request seller fee table', 'Talk to Seller Support', 'Close chat'],
      },
    ],
  },
];

export const MOCK_SUPPORT_AGENTS: SupportAgent[] = [
  {
    agentId: 'AGT-101',
    name: 'Sarah Jenkins',
    email: 'sarah.j@commercezon-support.internal',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    role: 'SENIOR_SUPPORT_AGENT',
    department: 'Customer Support Tier 2',
    status: 'ONLINE',
    activeTicketsCount: 4,
    resolvedToday: 18,
    csatScore: 4.92,
    avgResponseTimeMinutes: 6.2,
  },
  {
    agentId: 'AGT-102',
    name: 'Alex Rivera',
    email: 'alex.r@commercezon-support.internal',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    role: 'FINANCE_SUPPORT',
    department: 'Finance & Payments Support',
    status: 'ONLINE',
    activeTicketsCount: 2,
    resolvedToday: 24,
    csatScore: 4.88,
    avgResponseTimeMinutes: 4.5,
  },
  {
    agentId: 'AGT-103',
    name: 'Marcus Vance',
    email: 'marcus.v@commercezon-support.internal',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    role: 'WAREHOUSE_SUPPORT',
    department: 'Warehouse & FBA Seller Ops',
    status: 'IN_CALL',
    activeTicketsCount: 5,
    resolvedToday: 14,
    csatScore: 4.75,
    avgResponseTimeMinutes: 12.0,
  },
  {
    agentId: 'AGT-104',
    name: 'Jessica Wong',
    email: 'jessica.w@commercezon-support.internal',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    role: 'SELLER_SUPPORT',
    department: 'Merchant Partner Success',
    status: 'AWAY',
    activeTicketsCount: 1,
    resolvedToday: 19,
    csatScore: 4.95,
    avgResponseTimeMinutes: 8.1,
  },
];

export const MOCK_SLA_POLICIES: SlaPolicy[] = [
  {
    policyId: 'SLA-1',
    priority: 'URGENT_CRITICAL',
    firstResponseTargetMinutes: 15,
    resolutionTargetHours: 4,
    autoEscalateAfterHours: 2,
    vipCustomerMultiplier: 0.5,
  },
  {
    policyId: 'SLA-2',
    priority: 'HIGH',
    firstResponseTargetMinutes: 30,
    resolutionTargetHours: 12,
    autoEscalateAfterHours: 6,
    vipCustomerMultiplier: 0.75,
  },
  {
    policyId: 'SLA-3',
    priority: 'MEDIUM',
    firstResponseTargetMinutes: 60,
    resolutionTargetHours: 24,
    autoEscalateAfterHours: 12,
    vipCustomerMultiplier: 1.0,
  },
  {
    policyId: 'SLA-4',
    priority: 'LOW',
    firstResponseTargetMinutes: 120,
    resolutionTargetHours: 48,
    autoEscalateAfterHours: 24,
    vipCustomerMultiplier: 1.0,
  },
];

export const MOCK_CSAT_FEEDBACKS: CsatFeedback[] = [
  {
    feedbackId: 'CSAT-901',
    ticketId: 'TCK-90126',
    rating: 5,
    agentRating: 5,
    serviceTags: ['Fast Resolution', 'Polite Agent', 'Proactive Wallet Credit'],
    comment: 'Alex resolved my price match concern in less than 10 minutes! Excellent Prime customer service.',
    submittedAt: '2026-07-27T11:25:00Z',
    agentName: 'Alex Rivera',
  },
  {
    feedbackId: 'CSAT-902',
    ticketId: 'TCK-89910',
    rating: 5,
    agentRating: 5,
    serviceTags: ['Clear Knowledge', 'Effective Help'],
    comment: 'Sarah helped track down my package driver. Very satisfied.',
    submittedAt: '2026-07-26T16:40:00Z',
    agentName: 'Sarah Jenkins',
  },
];

export const MOCK_NOTIFICATIONS: SupportNotification[] = [
  {
    notificationId: 'NOTIF-1',
    ticketId: 'TCK-90124',
    recipientRole: 'BUYER',
    title: 'Ticket Updated - TCK-90124',
    body: 'Senior Support Agent Sarah Jenkins has posted an update regarding your delivery investigation.',
    channels: ['EMAIL', 'PUSH', 'IN_APP'],
    sentAt: '2026-07-28T01:45:00Z',
    isRead: false,
  },
  {
    notificationId: 'NOTIF-2',
    ticketId: 'TCK-90125',
    recipientRole: 'SELLER',
    title: 'FBA Inventory Audit - TCK-90125',
    body: 'FC Seattle Warehouse Ops requested a copy of your Bill of Lading.',
    channels: ['EMAIL', 'IN_APP'],
    sentAt: '2026-07-28T00:10:00Z',
    isRead: true,
  },
];

export const MOCK_SUPPORT_METRICS: SupportMetrics = {
  totalTickets: 1420,
  openTickets: 42,
  pendingTickets: 18,
  resolvedTickets: 1310,
  closedTickets: 50,
  escalatedTickets: 8,
  liveChatSessions: 184,
  aiResolvedCases: 612,
  csatScore: 4.88,
  firstResponseTimeMinutes: 8.4,
  avgResolutionTimeHours: 1.2,
  agentPerformancePercent: 96.5,
  slaCompliancePercent: 98.4,
};
