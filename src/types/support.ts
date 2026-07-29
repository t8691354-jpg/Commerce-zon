export type SupportUserRole =
  | 'BUYER'
  | 'SELLER'
  | 'AFFILIATE'
  | 'SUPPLIER'
  | 'WAREHOUSE_STAFF'
  | 'DELIVERY_PARTNER'
  | 'ADMIN';

export type AgentRole =
  | 'CUSTOMER_SUPPORT_AGENT'
  | 'SENIOR_SUPPORT_AGENT'
  | 'TECHNICAL_SUPPORT'
  | 'FINANCE_SUPPORT'
  | 'SELLER_SUPPORT'
  | 'WAREHOUSE_SUPPORT'
  | 'SUPERVISOR';

export type TicketCategory =
  | 'ORDERS'
  | 'PAYMENTS'
  | 'REFUNDS'
  | 'RETURNS'
  | 'EXCHANGES'
  | 'PRODUCT_ISSUES'
  | 'SELLER_ISSUES'
  | 'ACCOUNT_PROBLEMS'
  | 'SHIPPING_PROBLEMS'
  | 'TECHNICAL_PROBLEMS'
  | 'SECURITY_REPORTS'
  | 'OTHER';

export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT_CRITICAL';

export type TicketStatus =
  | 'CREATED'
  | 'AUTO_CATEGORIZED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'WAITING_FOR_CUSTOMER'
  | 'WAITING_FOR_SELLER'
  | 'ESCALATED'
  | 'RESOLVED'
  | 'CLOSED';

export type SentimentType = 'POSITIVE' | 'NEUTRAL' | 'FRUSTRATED' | 'CRITICAL';

export type HelpCenterCategory =
  | 'BUYER_GUIDES'
  | 'SELLER_GUIDES'
  | 'AFFILIATE_GUIDES'
  | 'FBA_GUIDES'
  | 'DROPSHIPPING_GUIDES'
  | 'SHIPPING_GUIDES'
  | 'PAYMENT_GUIDES'
  | 'RETURNS_REFUND_GUIDES'
  | 'ACCOUNT_SECURITY_GUIDES';

export interface KnowledgeArticle {
  articleId: string;
  title: string;
  category: HelpCenterCategory;
  summary: string;
  content: string;
  tags: string[];
  readTimeMinutes: number;
  helpfulYes: number;
  helpfulNo: number;
  lastUpdated: string;
  author: string;
  relatedArticleIds: string[];
}

export interface TicketMessage {
  messageId: string;
  ticketId: string;
  senderRole: SupportUserRole | 'AGENT' | 'AI_COPILOT' | 'SYSTEM';
  senderName: string;
  message: string;
  timestamp: string;
  attachments?: string[];
  isInternalNote?: boolean;
  isAiGenerated?: boolean;
}

export interface SupportTicket {
  ticketId: string;
  userRole: SupportUserRole;
  userId: string;
  userName: string;
  userEmail: string;
  orderId?: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  subject: string;
  description: string;
  attachments: string[];
  assignedAgentId?: string;
  assignedAgentName?: string;
  department: string;
  sentiment: SentimentType;
  language: string;
  createdDate: string;
  updatedDate: string;
  resolutionDate?: string;
  slaBreached: boolean;
  slaFirstResponseDueDate: string;
  slaResolutionDueDate: string;
  internalNotesCount: number;
  messages: TicketMessage[];
}

export interface ChatMessage {
  messageId: string;
  chatSessionId: string;
  senderRole: 'USER' | 'BOT' | 'AGENT' | 'SYSTEM';
  senderName: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  attachments?: string[];
  smartReplies?: string[];
}

export interface LiveChatSession {
  chatSessionId: string;
  userRole: SupportUserRole;
  userId: string;
  userName: string;
  userEmail: string;
  assignedAgentId?: string;
  assignedAgentName?: string;
  status: 'BOT_ACTIVE' | 'AGENT_CONNECTED' | 'ENDED';
  sentiment: SentimentType;
  language: string;
  startedAt: string;
  endedAt?: string;
  aiHandoverReason?: string;
  messages: ChatMessage[];
}

export interface SupportAgent {
  agentId: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: AgentRole;
  department: string;
  status: 'ONLINE' | 'AWAY' | 'IN_CALL' | 'OFFLINE';
  activeTicketsCount: number;
  resolvedToday: number;
  csatScore: number;
  avgResponseTimeMinutes: number;
}

export interface SlaPolicy {
  policyId: string;
  priority: TicketPriority;
  firstResponseTargetMinutes: number;
  resolutionTargetHours: number;
  autoEscalateAfterHours: number;
  vipCustomerMultiplier: number;
}

export interface CsatFeedback {
  feedbackId: string;
  ticketId: string;
  rating: number; // 1 to 5
  agentRating: number;
  serviceTags: string[];
  comment: string;
  submittedAt: string;
  agentName: string;
}

export interface SupportNotification {
  notificationId: string;
  ticketId: string;
  recipientRole: string;
  title: string;
  body: string;
  channels: ('EMAIL' | 'SMS' | 'PUSH' | 'IN_APP')[];
  sentAt: string;
  isRead: boolean;
}

export interface SupportMetrics {
  totalTickets: number;
  openTickets: number;
  pendingTickets: number;
  resolvedTickets: number;
  closedTickets: number;
  escalatedTickets: number;
  liveChatSessions: number;
  aiResolvedCases: number;
  csatScore: number;
  firstResponseTimeMinutes: number;
  avgResolutionTimeHours: number;
  agentPerformancePercent: number;
  slaCompliancePercent: number;
}
