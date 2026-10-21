/**
 * Commerce Zon Marketplace - Support Ticketing Client API
 * Part 19: Customer Support, Help Center & Ticketing System
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
} from '../types/support';

export interface CreateTicketPayload {
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
}

export interface AddMessagePayload {
  senderRole: SupportUserRole | 'AGENT' | 'AI_COPILOT' | 'SYSTEM';
  senderName: string;
  senderId: string;
  message: string;
  attachments?: string[];
  isInternalNote?: boolean;
}

export class SupportTicketingClient {
  // Knowledge Base / Help Center Articles
  async searchArticles(params?: {
    query?: string;
    category?: HelpCenterCategory | 'ALL';
    tag?: string;
  }): Promise<KnowledgeArticle[]> {
    const queryParams = new URLSearchParams();
    if (params?.query) queryParams.set('query', params.query);
    if (params?.category && params.category !== 'ALL') queryParams.set('category', params.category);
    if (params?.tag) queryParams.set('tag', params.tag);

    const res = await fetch(`/api/support/articles?${queryParams.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch knowledge base articles');
    const data = await res.json();
    return data.articles || [];
  }

  async getArticleById(articleId: string): Promise<KnowledgeArticle | null> {
    const res = await fetch(`/api/support/articles/${encodeURIComponent(articleId)}`);
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch article ${articleId}`);
    }
    const data = await res.json();
    return data.article;
  }

  async voteArticleHelpful(articleId: string, isHelpful: boolean): Promise<KnowledgeArticle> {
    const res = await fetch(`/api/support/articles/${encodeURIComponent(articleId)}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isHelpful }),
    });
    if (!res.ok) throw new Error('Failed to record article feedback');
    const data = await res.json();
    return data.article;
  }

  async createArticle(
    articleData: Omit<KnowledgeArticle, 'articleId' | 'helpfulYes' | 'helpfulNo' | 'lastUpdated'>,
    adminId: string = 'admin-root'
  ): Promise<KnowledgeArticle> {
    const res = await fetch('/api/support/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ article: articleData, adminId }),
    });
    if (!res.ok) throw new Error('Failed to create knowledge base article');
    const data = await res.json();
    return data.article;
  }

  // Tickets
  async getTickets(params: {
    role: SupportUserRole;
    userId: string;
    status?: TicketStatus;
    category?: TicketCategory;
    priority?: TicketPriority;
  }): Promise<SupportTicket[]> {
    const queryParams = new URLSearchParams({
      role: params.role,
      userId: params.userId,
    });
    if (params.status) queryParams.set('status', params.status);
    if (params.category) queryParams.set('category', params.category);
    if (params.priority) queryParams.set('priority', params.priority);

    const res = await fetch(`/api/support/tickets?${queryParams.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch tickets');
    const data = await res.json();
    return data.tickets || [];
  }

  async getTicketDetails(ticketId: string, userId: string, role: SupportUserRole): Promise<SupportTicket> {
    const queryParams = new URLSearchParams({ userId, role });
    const res = await fetch(`/api/support/tickets/${encodeURIComponent(ticketId)}?${queryParams.toString()}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to fetch ticket ${ticketId}`);
    }
    const data = await res.json();
    return data.ticket;
  }

  async createTicket(payload: CreateTicketPayload): Promise<SupportTicket> {
    const res = await fetch('/api/support/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create support ticket');
    }
    const data = await res.json();
    return data.ticket;
  }

  async addMessage(ticketId: string, payload: AddMessagePayload): Promise<TicketMessage> {
    const res = await fetch(`/api/support/tickets/${encodeURIComponent(ticketId)}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to add message to ticket');
    }
    const data = await res.json();
    return data.message;
  }

  async updateTicketStatus(
    ticketId: string,
    status: TicketStatus,
    actorId: string,
    notes?: string
  ): Promise<SupportTicket> {
    const res = await fetch(`/api/support/tickets/${encodeURIComponent(ticketId)}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, actorId, notes }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update ticket status');
    }
    const data = await res.json();
    return data.ticket;
  }

  async assignAgent(
    ticketId: string,
    agentId: string,
    agentName: string,
    adminId: string = 'admin-root'
  ): Promise<SupportTicket> {
    const res = await fetch(`/api/support/tickets/${encodeURIComponent(ticketId)}/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentId, agentName, adminId }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to assign agent');
    }
    const data = await res.json();
    return data.ticket;
  }

  async getMetrics(): Promise<SupportMetrics> {
    const res = await fetch('/api/support/metrics');
    if (!res.ok) throw new Error('Failed to fetch support metrics');
    const data = await res.json();
    return data.metrics;
  }
}

export const supportTicketingClient = new SupportTicketingClient();
