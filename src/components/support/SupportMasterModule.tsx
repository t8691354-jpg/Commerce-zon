import React, { useState } from 'react';
import {
  SupportTicket,
  SupportAgent,
  TicketStatus,
  SupportMetrics,
} from '../../types/support';
import {
  MOCK_SUPPORT_TICKETS,
  MOCK_SUPPORT_AGENTS,
  MOCK_SUPPORT_METRICS,
} from '../../data/supportMockData';
import { SupportDashboardOverview } from './SupportDashboardOverview';
import { HelpCenterKnowledgeBaseView } from './HelpCenterKnowledgeBaseView';
import { TicketManagementView } from './TicketManagementView';
import { TicketWorkflowDetailModal } from './TicketWorkflowDetailModal';
import { LiveChatSystemView } from './LiveChatSystemView';
import { AiCopilotAssistantView } from './AiCopilotAssistantView';
import { AgentDepartmentManagerView } from './AgentDepartmentManagerView';
import { SlaPolicyManagerView } from './SlaPolicyManagerView';
import { CsatFeedbackView } from './CsatFeedbackView';
import { SupportNotificationsView } from './SupportNotificationsView';
import { SupportReportsExportView } from './SupportReportsExportView';
import { SupportAdminSecurityView } from './SupportAdminSecurityView';
import {
  LayoutDashboard,
  HelpCircle,
  TicketCheck,
  MessageSquareText,
  Sparkles,
  Users,
  ShieldAlert,
  Star,
  Bell,
  FileText,
  Lock,
  Headphones,
} from 'lucide-react';

type SubTab =
  | 'OVERVIEW'
  | 'KNOWLEDGE_BASE'
  | 'TICKETS'
  | 'LIVE_CHAT'
  | 'AI_COPILOT'
  | 'AGENTS'
  | 'SLA_POLICIES'
  | 'CSAT_FEEDBACK'
  | 'NOTIFICATIONS'
  | 'REPORTS'
  | 'ADMIN_SECURITY';

export const SupportMasterModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SubTab>('OVERVIEW');
  const [tickets, setTickets] = useState<SupportTicket[]>(MOCK_SUPPORT_TICKETS);
  const [agents, setAgents] = useState<SupportAgent[]>(MOCK_SUPPORT_AGENTS);
  const [metrics, setMetrics] = useState<SupportMetrics>(MOCK_SUPPORT_METRICS);
  const [selectedTicketForDetail, setSelectedTicketForDetail] = useState<SupportTicket | null>(null);

  // Handlers for state updates across components
  const handleCreateTicket = (newTicket: SupportTicket) => {
    setTickets((prev) => [newTicket, ...prev]);
    setMetrics((prev) => ({
      ...prev,
      totalTickets: prev.totalTickets + 1,
      openTickets: prev.openTickets + 1,
    }));
  };

  const handleUpdateTicketStatus = (ticketId: string, newStatus: TicketStatus) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.ticketId === ticketId) {
          return {
            ...t,
            status: newStatus,
            updatedDate: new Date().toISOString(),
            resolutionDate:
              newStatus === 'RESOLVED' || newStatus === 'CLOSED'
                ? new Date().toISOString()
                : t.resolutionDate,
          };
        }
        return t;
      })
    );

    // Keep modal state updated if open
    if (selectedTicketForDetail && selectedTicketForDetail.ticketId === ticketId) {
      setSelectedTicketForDetail((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              updatedDate: new Date().toISOString(),
            }
          : null
      );
    }
  };

  const handleAssignAgent = (ticketId: string, agentId: string, agentName: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.ticketId === ticketId) {
          return {
            ...t,
            assignedAgentId: agentId,
            assignedAgentName: agentName,
            status: t.status === 'CREATED' ? 'ASSIGNED' : t.status,
            updatedDate: new Date().toISOString(),
          };
        }
        return t;
      })
    );

    if (selectedTicketForDetail && selectedTicketForDetail.ticketId === ticketId) {
      setSelectedTicketForDetail((prev) =>
        prev
          ? {
              ...prev,
              assignedAgentId: agentId,
              assignedAgentName: agentName,
            }
          : null
      );
    }
  };

  const handleAddTicketMessage = (
    ticketId: string,
    messageText: string,
    isInternalNote: boolean
  ) => {
    const newMessage = {
      messageId: `MSG-${Date.now()}`,
      ticketId,
      senderRole: isInternalNote ? ('AGENT' as const) : ('BUYER' as const),
      senderName: isInternalNote ? 'Sarah Jenkins (Senior CX)' : 'Support Staff',
      message: messageText,
      timestamp: new Date().toISOString(),
      isInternalNote,
    };

    setTickets((prev) =>
      prev.map((t) => {
        if (t.ticketId === ticketId) {
          return {
            ...t,
            messages: [...t.messages, newMessage],
            internalNotesCount: isInternalNote ? t.internalNotesCount + 1 : t.internalNotesCount,
            updatedDate: new Date().toISOString(),
          };
        }
        return t;
      })
    );

    if (selectedTicketForDetail && selectedTicketForDetail.ticketId === ticketId) {
      setSelectedTicketForDetail((prev) =>
        prev
          ? {
              ...prev,
              messages: [...prev.messages, newMessage],
              internalNotesCount: isInternalNote
                ? prev.internalNotesCount + 1
                : prev.internalNotesCount,
            }
          : null
      );
    }
  };

  const handleAddAgent = (newAgent: SupportAgent) => {
    setAgents((prev) => [...prev, newAgent]);
  };

  const handleUpdateAgentStatus = (
    agentId: string,
    status: 'ONLINE' | 'AWAY' | 'IN_CALL' | 'OFFLINE'
  ) => {
    setAgents((prev) =>
      prev.map((a) => (a.agentId === agentId ? { ...a, status } : a))
    );
  };

  const navItems: { id: SubTab; label: string; icon: React.ElementType }[] = [
    { id: 'OVERVIEW', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'KNOWLEDGE_BASE', label: 'Help Center & KB', icon: HelpCircle },
    { id: 'TICKETS', label: 'Tickets Queue', icon: TicketCheck },
    { id: 'LIVE_CHAT', label: '24/7 Live Chat', icon: MessageSquareText },
    { id: 'AI_COPILOT', label: 'AI Copilot Engine', icon: Sparkles },
    { id: 'AGENTS', label: 'Agent Roster', icon: Users },
    { id: 'SLA_POLICIES', label: 'SLAs & Rules', icon: ShieldAlert },
    { id: 'CSAT_FEEDBACK', label: 'CSAT Reviews', icon: Star },
    { id: 'NOTIFICATIONS', label: 'Dispatches', icon: Bell },
    { id: 'REPORTS', label: 'Audit Reports', icon: FileText },
    { id: 'ADMIN_SECURITY', label: 'Security & RBAC', icon: Lock },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 lg:p-6 space-y-6">
      {/* Top Header Title Bar */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-[#febd69] text-slate-950 rounded-2xl shadow-lg">
            <Headphones className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-extrabold text-white tracking-tight">
                Amazon Customer Support & Live Chat Management
              </h1>
              <span className="px-2 py-0.5 bg-[#febd69]/20 text-[#febd69] border border-[#febd69]/40 text-[10px] font-mono font-bold rounded">
                MODULE 15
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Enterprise customer service portal supporting Buyers, Sellers, Affiliates, Suppliers, Warehouse Staff, and Courier Partners.
            </p>
          </div>
        </div>

        {/* Global Live Status Badge */}
        <div className="flex items-center space-x-3 text-xs font-mono bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300">
            CSAT: <span className="text-amber-400 font-bold">{metrics.csatScore}★</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">
            SLA: <span className="text-emerald-400 font-bold">{metrics.slaCompliancePercent}%</span>
          </span>
        </div>
      </div>

      {/* Sub-Navigation Tabs Bar */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-thin border-b border-slate-800/80">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition flex items-center space-x-2 whitespace-nowrap ${
                isActive
                  ? 'bg-[#febd69] text-slate-950 shadow-lg font-black'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-[#febd69]'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Render Switcher */}
      <div className="pt-2">
        {activeTab === 'OVERVIEW' && (
          <SupportDashboardOverview metrics={metrics} tickets={tickets} />
        )}

        {activeTab === 'KNOWLEDGE_BASE' && <HelpCenterKnowledgeBaseView />}

        {activeTab === 'TICKETS' && (
          <TicketManagementView
            tickets={tickets}
            onCreateTicket={handleCreateTicket}
            onSelectTicketDetail={(ticket) => setSelectedTicketForDetail(ticket)}
          />
        )}

        {activeTab === 'LIVE_CHAT' && <LiveChatSystemView />}

        {activeTab === 'AI_COPILOT' && <AiCopilotAssistantView tickets={tickets} />}

        {activeTab === 'AGENTS' && (
          <AgentDepartmentManagerView
            agents={agents}
            onAddAgent={handleAddAgent}
            onUpdateAgentStatus={handleUpdateAgentStatus}
          />
        )}

        {activeTab === 'SLA_POLICIES' && <SlaPolicyManagerView />}

        {activeTab === 'CSAT_FEEDBACK' && <CsatFeedbackView />}

        {activeTab === 'NOTIFICATIONS' && <SupportNotificationsView />}

        {activeTab === 'REPORTS' && <SupportReportsExportView />}

        {activeTab === 'ADMIN_SECURITY' && <SupportAdminSecurityView />}
      </div>

      {/* Ticket Workflow Detail Modal Viewer */}
      {selectedTicketForDetail && (
        <TicketWorkflowDetailModal
          ticket={selectedTicketForDetail}
          agents={agents}
          onClose={() => setSelectedTicketForDetail(null)}
          onUpdateStatus={handleUpdateTicketStatus}
          onAssignAgent={handleAssignAgent}
          onAddMessage={handleAddTicketMessage}
        />
      )}
    </div>
  );
};
