import React, { useState } from 'react';
import {
  SupportTicket,
  SupportUserRole,
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from '../../types/support';
import {
  TicketCheck,
  Plus,
  Search,
  Filter,
  Clock,
  User,
  AlertTriangle,
  CheckCircle2,
  Paperclip,
  X,
  FileText,
  ChevronRight,
  ShieldAlert,
  Bot,
  Layers,
} from 'lucide-react';

interface Props {
  tickets: SupportTicket[];
  onCreateTicket: (newTicket: SupportTicket) => void;
  onSelectTicketDetail: (ticket: SupportTicket) => void;
}

export const TicketManagementView: React.FC<Props> = ({
  tickets,
  onCreateTicket,
  onSelectTicketDetail,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<SupportUserRole | 'ALL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<TicketStatus | 'ALL'>('ALL');
  const [filterPriority, setFilterPriority] = useState<TicketPriority | 'ALL'>('ALL');

  // New Ticket Form State
  const [userRole, setUserRole] = useState<SupportUserRole>('BUYER');
  const [userName, setUserName] = useState('David Miller');
  const [userEmail, setUserEmail] = useState('david.m@example.com');
  const [orderId, setOrderId] = useState('ORD-2026-8812');
  const [category, setCategory] = useState<TicketCategory>('ORDERS');
  const [priority, setPriority] = useState<TicketPriority>('MEDIUM');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    const newTicket: SupportTicket = {
      ticketId: `TCK-${Math.floor(90000 + Math.random() * 9999)}`,
      userRole,
      userId: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      userName,
      userEmail,
      orderId: orderId.trim() || undefined,
      category,
      priority,
      status: 'CREATED',
      subject,
      description,
      attachments: attachmentUrl ? [attachmentUrl] : [],
      department:
        category === 'FBA_ISSUES' || category === 'SHIPPING_PROBLEMS'
          ? 'Warehouse & FBA Seller Ops'
          : category === 'PAYMENTS' || category === 'REFUNDS'
          ? 'Finance & Payments Support'
          : 'Customer Support Tier 1',
      sentiment: priority === 'URGENT_CRITICAL' ? 'CRITICAL' : priority === 'HIGH' ? 'FRUSTRATED' : 'NEUTRAL',
      language: 'English (US)',
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
      slaBreached: false,
      slaFirstResponseDueDate: new Date(Date.now() + 30 * 60000).toISOString(),
      slaResolutionDueDate: new Date(Date.now() + 12 * 3600000).toISOString(),
      internalNotesCount: 0,
      messages: [
        {
          messageId: `MSG-${Math.floor(100 + Math.random() * 900)}`,
          ticketId: `TCK-TEMP`,
          senderRole: userRole,
          senderName: userName,
          message: description,
          timestamp: new Date().toISOString(),
        },
      ],
    };

    onCreateTicket(newTicket);
    setIsModalOpen(false);
    setSubject('');
    setDescription('');
    setAttachmentUrl('');
    alert(`Support Ticket ${newTicket.ticketId} created successfully! Assigned SLA timer.`);
  };

  const filtered = tickets.filter((t) => {
    const matchesSearch =
      t.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.orderId && t.orderId.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = filterRole === 'ALL' || t.userRole === filterRole;
    const matchesStatus = filterStatus === 'ALL' || t.status === filterStatus;
    const matchesPriority = filterPriority === 'ALL' || t.priority === filterPriority;

    return matchesSearch && matchesRole && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <TicketCheck className="w-5 h-5 text-[#febd69]" />
            <span>Multi-Role Omnichannel Support Ticket Hub</span>
          </h2>
          <p className="text-xs text-slate-400">
            Enterprise case queue for Buyers, Sellers, Affiliates, Suppliers, Warehouse Staff, and Delivery Partners.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Submit Support Ticket</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="relative lg:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Ticket ID, subject, customer, or Order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#febd69]"
          />
        </div>

        <div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as any)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-[#febd69]"
          >
            <option value="ALL">All User Roles</option>
            <option value="BUYER">Buyer</option>
            <option value="SELLER">Seller Merchant</option>
            <option value="AFFILIATE">Affiliate Marketer</option>
            <option value="SUPPLIER">Dropship Supplier</option>
            <option value="WAREHOUSE_STAFF">Warehouse Staff</option>
            <option value="DELIVERY_PARTNER">Delivery Courier</option>
          </select>
        </div>

        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-[#febd69]"
          >
            <option value="ALL">All Statuses</option>
            <option value="CREATED">Created</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="WAITING_FOR_CUSTOMER">Waiting Customer</option>
            <option value="ESCALATED">Escalated</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>

        <div>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as any)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-[#febd69]"
          >
            <option value="ALL">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT_CRITICAL">Urgent / Critical</option>
          </select>
        </div>
      </div>

      {/* Ticket List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center text-xs font-bold text-white">
          <span>Active Enterprise Ticket Queue ({filtered.length})</span>
          <span className="font-mono text-slate-400">SLA Timer Engine Active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Ticket ID & Created</th>
                <th className="p-3">User & Role</th>
                <th className="p-3">Category & Subject</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Assigned Agent</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Lifecycle Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filtered.map((ticket) => {
                const isUrgent = ticket.priority === 'URGENT_CRITICAL' || ticket.priority === 'HIGH';

                return (
                  <tr key={ticket.ticketId} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-mono">
                      <div className="font-bold text-[#febd69]">{ticket.ticketId}</div>
                      <div className="text-[10px] text-slate-500">
                        {new Date(ticket.createdDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="font-bold text-white">{ticket.userName}</div>
                      <span className="px-1.5 py-0.2 bg-slate-800 text-slate-300 text-[9px] font-mono rounded font-bold uppercase">
                        {ticket.userRole}
                      </span>
                    </td>

                    <td className="p-3 max-w-xs">
                      <div className="font-bold text-slate-200 truncate">{ticket.subject}</div>
                      <div className="text-[10px] text-slate-400 flex items-center space-x-1">
                        <span className="text-amber-400">{ticket.category}</span>
                        {ticket.orderId && <span className="font-mono text-slate-500">• Order: {ticket.orderId}</span>}
                      </div>
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          ticket.priority === 'URGENT_CRITICAL'
                            ? 'bg-rose-500 text-slate-950'
                            : ticket.priority === 'HIGH'
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {ticket.priority}
                      </span>
                    </td>

                    <td className="p-3">
                      {ticket.assignedAgentName ? (
                        <div className="text-xs font-semibold text-emerald-400">{ticket.assignedAgentName}</div>
                      ) : (
                        <span className="text-[10px] text-slate-500 italic">Unassigned</span>
                      )}
                    </td>

                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-slate-800 text-slate-300 font-mono text-[10px] rounded border border-slate-700 font-bold">
                        {ticket.status}
                      </span>
                    </td>

                    <td className="p-3 text-right">
                      <button
                        onClick={() => onSelectTicketDetail(ticket)}
                        className="px-3 py-1 bg-slate-800 hover:bg-[#febd69] hover:text-slate-950 text-slate-200 font-bold text-[11px] rounded-lg transition flex items-center space-x-1 ml-auto"
                      >
                        <span>Manage Case</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Ticket Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <TicketCheck className="w-4 h-4 text-[#febd69]" />
                <span>Submit New Enterprise Support Ticket</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Requester Role</label>
                  <select
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value as SupportUserRole)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#febd69]"
                  >
                    <option value="BUYER">Buyer (Customer)</option>
                    <option value="SELLER">Seller Merchant</option>
                    <option value="AFFILIATE">Affiliate Marketer</option>
                    <option value="SUPPLIER">Dropshipping Supplier</option>
                    <option value="WAREHOUSE_STAFF">Warehouse Staff</option>
                    <option value="DELIVERY_PARTNER">Delivery Partner / Courier</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">User Name</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#febd69]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#febd69]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as TicketCategory)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#febd69]"
                  >
                    <option value="ORDERS">Orders & Delivery</option>
                    <option value="PAYMENTS">Payments & Escrow</option>
                    <option value="REFUNDS">Refunds & Credit</option>
                    <option value="RETURNS">Returns & RMA</option>
                    <option value="EXCHANGES">Exchanges & Swaps</option>
                    <option value="PRODUCT_ISSUES">Product Defects</option>
                    <option value="SELLER_ISSUES">Seller Central & FBA</option>
                    <option value="ACCOUNT_PROBLEMS">Account & 2FA</option>
                    <option value="SHIPPING_PROBLEMS">Logistics & Courier</option>
                    <option value="TECHNICAL_PROBLEMS">Technical & API</option>
                    <option value="SECURITY_REPORTS">Security & Fraud</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Priority SLA</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TicketPriority)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#febd69]"
                  >
                    <option value="LOW">Low (48h Target)</option>
                    <option value="MEDIUM">Medium (24h Target)</option>
                    <option value="HIGH">High (12h Target)</option>
                    <option value="URGENT_CRITICAL">Urgent / Critical (4h SLA)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Order ID (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. ORD-2026-8812"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#febd69] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="Brief summary of your issue..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#febd69]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description & Details</label>
                <textarea
                  rows={4}
                  placeholder="Provide comprehensive details, error logs, or package numbers..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-[#febd69]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Attachment Image URL (Optional)</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={attachmentUrl}
                  onChange={(e) => setAttachmentUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#febd69]"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black text-xs rounded-xl shadow-lg"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
