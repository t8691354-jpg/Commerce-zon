/**
 * Commerce Zon Marketplace - Part 19: Customer Support, Help Center & Ticketing Service
 * Handles Searchable Knowledge Base, Article Feedback, Multi-Role Ticket Lifecycle,
 * SLA Due Date Tracking, Private Internal Notes Isolation, and Agent Assignment.
 */

import {
  KnowledgeArticle,
  SupportTicket,
  TicketMessage,
  TicketCategory,
  TicketPriority,
  TicketStatus,
  SupportUserRole,
  HelpCenterCategory,
  SupportMetrics,
} from '../../types/support';
import {
  MOCK_KNOWLEDGE_ARTICLES,
  MOCK_SUPPORT_TICKETS,
  MOCK_SUPPORT_AGENTS,
  MOCK_SUPPORT_METRICS,
} from '../../data/supportMockData';
import { auditService } from './AuditService';
import { notificationService } from './NotificationService';
import { logger } from '../../infrastructure/logging/Logger';

export class SupportTicketingService {
  private articles: Map<string, KnowledgeArticle> = new Map();
  private tickets: Map<string, SupportTicket> = new Map();
  private metrics: SupportMetrics = { ...MOCK_SUPPORT_METRICS };

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    MOCK_KNOWLEDGE_ARTICLES.forEach((art) => {
      this.articles.set(art.articleId, art);
    });

    MOCK_SUPPORT_TICKETS.forEach((t) => {
      this.tickets.set(t.ticketId, t);
    });
  }

  // --------------------------------------------------------------------------
  // 1. HELP CENTER & KNOWLEDGE BASE
  // --------------------------------------------------------------------------

  public searchArticles(params: {
    query?: string;
    category?: HelpCenterCategory | 'ALL';
    tag?: string;
  }): KnowledgeArticle[] {
    let list = Array.from(this.articles.values());

    if (params.category && params.category !== 'ALL') {
      list = list.filter((a) => a.category === params.category);
    }

    if (params.tag) {
      const targetTag = params.tag.toLowerCase();
      list = list.filter((a) => a.tags.some((t) => t.toLowerCase() === targetTag));
    }

    if (params.query && params.query.trim()) {
      const q = params.query.toLowerCase().trim();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q) ||
          a.content.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return list.sort((a, b) => b.helpfulYes - a.helpfulYes);
  }

  public getArticleById(articleId: string): KnowledgeArticle | null {
    return this.articles.get(articleId) || null;
  }

  public voteArticleHelpful(articleId: string, isHelpful: boolean): KnowledgeArticle {
    const art = this.getArticleById(articleId);
    if (!art) throw new Error(`Article '${articleId}' not found.`);

    if (isHelpful) {
      art.helpfulYes += 1;
    } else {
      art.helpfulNo += 1;
    }
    return art;
  }

  public createArticle(articleData: Omit<KnowledgeArticle, 'articleId' | 'helpfulYes' | 'helpfulNo' | 'lastUpdated'>, adminId: string): KnowledgeArticle {
    const articleId = `KB-${Date.now().toString().slice(-4)}`;
    const newArt: KnowledgeArticle = {
      ...articleData,
      articleId,
      helpfulYes: 0,
      helpfulNo: 0,
      lastUpdated: new Date().toISOString(),
    };
    this.articles.set(articleId, newArt);

    auditService.recordEvent(
      'SYSTEM',
      adminId,
      'HELP_ARTICLE_CREATED',
      'COMMUNICATION',
      `Created knowledge article ${articleId}: "${newArt.title}"`
    );

    return newArt;
  }

  public updateArticle(articleId: string, updates: Partial<KnowledgeArticle>, adminId: string): KnowledgeArticle {
    const art = this.getArticleById(articleId);
    if (!art) throw new Error(`Article '${articleId}' not found.`);

    Object.assign(art, updates, { lastUpdated: new Date().toISOString() });
    auditService.recordEvent(
      'SYSTEM',
      adminId,
      'HELP_ARTICLE_UPDATED',
      'COMMUNICATION',
      `Updated knowledge article ${articleId}`
    );
    return art;
  }

  // --------------------------------------------------------------------------
  // 2. SUPPORT TICKET CREATION & USER ACCESS
  // --------------------------------------------------------------------------

  public async createTicket(params: {
    userRole: SupportUserRole;
    userId: string;
    userName: string;
    userEmail: string;
    category: TicketCategory;
    priority?: TicketPriority;
    subject: string;
    description: string;
    orderId?: string;
    attachments?: string[];
  }): Promise<SupportTicket> {
    if (!params.userId || !params.subject || !params.description) {
      throw new Error('userId, subject, and description are required to submit a ticket.');
    }

    const ticketId = `TICK-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();
    const priority = params.priority || 'MEDIUM';

    // Calculate SLA due dates based on priority
    const slaResponseHours = priority === 'URGENT_CRITICAL' ? 1 : priority === 'HIGH' ? 4 : 24;
    const slaResolutionHours = priority === 'URGENT_CRITICAL' ? 8 : priority === 'HIGH' ? 24 : 72;

    const firstMsg: TicketMessage = {
      messageId: `msg-${Date.now()}`,
      ticketId,
      senderRole: params.userRole,
      senderName: params.userName,
      message: params.description,
      timestamp: now,
      attachments: params.attachments,
    };

    const newTicket: SupportTicket = {
      ticketId,
      userRole: params.userRole,
      userId: params.userId,
      userName: params.userName,
      userEmail: params.userEmail,
      orderId: params.orderId,
      category: params.category,
      priority,
      status: 'CREATED',
      subject: params.subject,
      description: params.description,
      attachments: params.attachments || [],
      department: this.getDepartmentForCategory(params.category),
      sentiment: 'NEUTRAL',
      language: 'en-US',
      createdDate: now,
      updatedDate: now,
      slaBreached: false,
      slaFirstResponseDueDate: new Date(Date.now() + slaResponseHours * 3600000).toISOString(),
      slaResolutionDueDate: new Date(Date.now() + slaResolutionHours * 3600000).toISOString(),
      internalNotesCount: 0,
      messages: [firstMsg],
    };

    this.tickets.set(ticketId, newTicket);
    this.metrics.totalTickets += 1;
    this.metrics.openTickets += 1;

    // Send in-app confirmation to user
    await notificationService.sendNotification({
      recipientId: params.userId,
      role: params.userRole === 'SELLER' ? 'Seller' : 'Buyer',
      category: 'Support',
      channel: 'in_app',
      title: `Support Ticket Received: ${ticketId}`,
      body: `Your support request "${params.subject}" was logged. Our team is reviewing it.`,
      priority: 'normal',
    });

    auditService.recordEvent(
      params.userRole === 'SELLER' ? 'MOCK_MERCHANT' : 'MOCK_USER',
      params.userId,
      'SUPPORT_TICKET_CREATED',
      'COMMUNICATION',
      `Created ticket ${ticketId} [${params.category}]`
    );

    return newTicket;
  }

  // --------------------------------------------------------------------------
  // 3. TICKET MESSAGING & INTERNAL NOTES ISOLATION
  // --------------------------------------------------------------------------

  public async addTicketMessage(params: {
    ticketId: string;
    senderRole: SupportUserRole | 'AGENT' | 'AI_COPILOT' | 'SYSTEM';
    senderName: string;
    senderId: string;
    message: string;
    attachments?: string[];
    isInternalNote?: boolean;
  }): Promise<TicketMessage> {
    const ticket = this.tickets.get(params.ticketId);
    if (!ticket) throw new Error(`Ticket '${params.ticketId}' not found.`);

    // Role check: Customers and Sellers CANNOT post internal notes!
    if (params.isInternalNote && (params.senderRole === 'BUYER' || params.senderRole === 'SELLER')) {
      throw new Error('Security Violation: Only authorized support staff and administrators can post internal notes.');
    }

    // Role check: Users can only message their own tickets
    if (
      (params.senderRole === 'BUYER' || params.senderRole === 'SELLER') &&
      ticket.userId !== params.senderId
    ) {
      throw new Error('Forbidden: You can only communicate on tickets belonging to your account.');
    }

    const now = new Date().toISOString();
    const newMsg: TicketMessage = {
      messageId: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      ticketId: params.ticketId,
      senderRole: params.senderRole,
      senderName: params.senderName,
      message: params.message,
      timestamp: now,
      attachments: params.attachments,
      isInternalNote: params.isInternalNote ?? false,
    };

    ticket.messages.push(newMsg);
    ticket.updatedDate = now;

    if (params.isInternalNote) {
      ticket.internalNotesCount = (ticket.internalNotesCount || 0) + 1;
    } else {
      // If agent replies, status shifts to WAITING_FOR_CUSTOMER; if user replies, shifts to IN_PROGRESS
      if (params.senderRole === 'AGENT' || params.senderRole === 'ADMIN') {
        ticket.status = 'WAITING_FOR_CUSTOMER';
        // Notify user
        await notificationService.sendNotification({
          recipientId: ticket.userId,
          role: ticket.userRole === 'SELLER' ? 'Seller' : 'Buyer',
          category: 'Support',
          channel: 'in_app',
          title: `Support Agent Replied: ${ticket.ticketId}`,
          body: `${params.senderName} has replied to your ticket "${ticket.subject}".`,
          priority: 'high',
        });
      } else {
        ticket.status = 'IN_PROGRESS';
      }
    }

    auditService.recordEvent(
      params.senderRole === 'AGENT' || params.senderRole === 'ADMIN' ? 'SYSTEM' : 'MOCK_USER',
      params.senderId,
      params.isInternalNote ? 'SUPPORT_INTERNAL_NOTE_ADDED' : 'SUPPORT_MESSAGE_POSTED',
      'COMMUNICATION',
      `Posted message on ticket ${ticket.ticketId}`
    );

    return newMsg;
  }

  // --------------------------------------------------------------------------
  // 4. SANITIZED RETRIEVAL (STRIPS INTERNAL NOTES FOR CUSTOMERS / SELLERS)
  // --------------------------------------------------------------------------

  public getTicketForUser(ticketId: string, userId: string, userRole: SupportUserRole): SupportTicket {
    const ticket = this.tickets.get(ticketId);
    if (!ticket) throw new Error(`Ticket '${ticketId}' not found.`);

    // Enforce ownership
    if (userRole !== 'ADMIN' && ticket.userId !== userId) {
      throw new Error('Forbidden: You do not have permission to access this support ticket.');
    }

    // If customer or seller, STRIP internal notes from the response!
    if (userRole === 'BUYER' || userRole === 'SELLER') {
      const sanitizedMessages = ticket.messages.filter((m) => !m.isInternalNote);
      return {
        ...ticket,
        messages: sanitizedMessages,
        internalNotesCount: 0,
      };
    }

    // Admin / Support Agent sees all messages including internal notes
    return ticket;
  }

  public getBuyerTickets(buyerId: string): SupportTicket[] {
    return Array.from(this.tickets.values())
      .filter((t) => t.userId === buyerId && t.userRole === 'BUYER')
      .map((t) => ({
        ...t,
        messages: t.messages.filter((m) => !m.isInternalNote),
        internalNotesCount: 0,
      }))
      .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
  }

  public getSellerTickets(sellerId: string): SupportTicket[] {
    return Array.from(this.tickets.values())
      .filter((t) => t.userId === sellerId && t.userRole === 'SELLER')
      .map((t) => ({
        ...t,
        messages: t.messages.filter((m) => !m.isInternalNote),
        internalNotesCount: 0,
      }))
      .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
  }

  public getAllTicketsForAdmin(filter?: {
    status?: TicketStatus;
    category?: TicketCategory;
    priority?: TicketPriority;
    assignedAgentId?: string;
  }): SupportTicket[] {
    let list = Array.from(this.tickets.values());
    if (filter?.status) list = list.filter((t) => t.status === filter.status);
    if (filter?.category) list = list.filter((t) => t.category === filter.category);
    if (filter?.priority) list = list.filter((t) => t.priority === filter.priority);
    if (filter?.assignedAgentId) list = list.filter((t) => t.assignedAgentId === filter.assignedAgentId);

    return list.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
  }

  // --------------------------------------------------------------------------
  // 5. TICKET STATUS & ASSIGNMENT WORKFLOWS
  // --------------------------------------------------------------------------

  public async updateTicketStatus(ticketId: string, status: TicketStatus, actorId: string, notes?: string): Promise<SupportTicket> {
    const ticket = this.tickets.get(ticketId);
    if (!ticket) throw new Error(`Ticket '${ticketId}' not found.`);

    const now = new Date().toISOString();
    ticket.status = status;
    ticket.updatedDate = now;

    if (status === 'RESOLVED' || status === 'CLOSED') {
      ticket.resolutionDate = now;
      this.metrics.resolvedTickets += 1;
      this.metrics.openTickets = Math.max(0, this.metrics.openTickets - 1);
    }

    if (notes) {
      ticket.messages.push({
        messageId: `msg-${Date.now()}`,
        ticketId,
        senderRole: 'SYSTEM',
        senderName: 'System Status Engine',
        message: `Status updated to ${status}. ${notes}`,
        timestamp: now,
        isInternalNote: false,
      });
    }

    // In-app alert
    await notificationService.sendNotification({
      recipientId: ticket.userId,
      role: ticket.userRole === 'SELLER' ? 'Seller' : 'Buyer',
      category: 'Support',
      channel: 'in_app',
      title: `Ticket Status Updated: ${ticket.ticketId}`,
      body: `Ticket "${ticket.subject}" is now marked as ${status.replace(/_/g, ' ')}.`,
      priority: 'normal',
    });

    auditService.recordEvent(
      'SYSTEM',
      actorId,
      'SUPPORT_TICKET_STATUS_UPDATED',
      'COMMUNICATION',
      `Updated ticket ${ticket.ticketId} status to ${status}`
    );

    return ticket;
  }

  public async assignAgent(ticketId: string, agentId: string, agentName: string, adminId: string): Promise<SupportTicket> {
    const ticket = this.tickets.get(ticketId);
    if (!ticket) throw new Error(`Ticket '${ticketId}' not found.`);

    ticket.assignedAgentId = agentId;
    ticket.assignedAgentName = agentName;
    ticket.status = 'ASSIGNED';
    ticket.updatedDate = new Date().toISOString();

    auditService.recordEvent(
      'SYSTEM',
      adminId,
      'SUPPORT_TICKET_ASSIGNED',
      'COMMUNICATION',
      `Assigned ticket ${ticket.ticketId} to agent ${agentName} (${agentId})`
    );

    return ticket;
  }

  private getDepartmentForCategory(cat: TicketCategory): string {
    switch (cat) {
      case 'PAYMENTS':
      case 'REFUNDS':
        return 'Billing & Finance';
      case 'SHIPPING_PROBLEMS':
      case 'RETURNS':
      case 'EXCHANGES':
        return 'Logistics & Warehouse Operations';
      case 'SELLER_ISSUES':
        return 'Merchant Store Operations';
      case 'SECURITY_REPORTS':
        return 'Trust & Platform Safety';
      default:
        return 'Customer Care & General Inquiries';
    }
  }

  public getMetrics(): SupportMetrics {
    return { ...this.metrics };
  }
}

export const supportTicketingService = new SupportTicketingService();
