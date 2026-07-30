import React, { useState } from 'react';
import { SupportAgent, AgentRole } from '../../types/support';
import {
  Users,
  Plus,
  Star,
  Clock,
  CheckCircle2,
  PhoneCall,
  Activity,
  X,
  Mail,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

interface Props {
  agents: SupportAgent[];
  onAddAgent: (agent: SupportAgent) => void;
  onUpdateAgentStatus: (
    agentId: string,
    status: 'ONLINE' | 'AWAY' | 'IN_CALL' | 'OFFLINE'
  ) => void;
}

export const AgentDepartmentManagerView: React.FC<Props> = ({
  agents,
  onAddAgent,
  onUpdateAgentStatus,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<AgentRole>('CUSTOMER_SUPPORT_AGENT');
  const [department, setDepartment] = useState('Customer Support Tier 1');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const newAgent: SupportAgent = {
      agentId: `AGT-${Math.floor(100 + Math.random() * 900)}`,
      name,
      email,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      role,
      department,
      status: 'ONLINE',
      activeTicketsCount: 0,
      resolvedToday: 0,
      csatScore: 5.0,
      avgResponseTimeMinutes: 5.0,
    };

    onAddAgent(newAgent);
    setIsModalOpen(false);
    setName('');
    setEmail('');
    alert(`Agent ${newAgent.name} provisioned successfully!`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Users className="w-5 h-5 text-[#febd69]" />
            <span>Support Agent Roster & Department Management</span>
          </h2>
          <p className="text-xs text-slate-400">
            Monitor real-time agent presence, CSAT scores, ticket workloads, and department assignments.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black text-xs rounded-xl shadow flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Provision Support Agent</span>
        </button>
      </div>

      {/* Agents Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {agents.map((agent) => {
          return (
            <div
              key={agent.agentId}
              className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <img
                      src={agent.avatarUrl}
                      alt={agent.name}
                      className="w-10 h-10 rounded-full border-2 border-[#febd69] object-cover"
                    />
                    <div>
                      <h3 className="text-xs font-bold text-white">{agent.name}</h3>
                      <span className="text-[10px] text-slate-400 font-mono">{agent.agentId}</span>
                    </div>
                  </div>

                  <select
                    value={agent.status}
                    onChange={(e) => onUpdateAgentStatus(agent.agentId, e.target.value as any)}
                    className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded uppercase focus:outline-none ${
                      agent.status === 'ONLINE'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : agent.status === 'IN_CALL'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <option value="ONLINE">ONLINE</option>
                    <option value="AWAY">AWAY</option>
                    <option value="IN_CALL">IN CALL</option>
                    <option value="OFFLINE">OFFLINE</option>
                  </select>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="text-[10px] text-[#febd69] font-bold">{agent.department}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{agent.email}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800">
                  <div className="bg-slate-950 p-2 rounded-lg space-y-0.5">
                    <span className="text-[9px] text-slate-500 font-bold uppercase">Active Queue</span>
                    <div className="font-mono font-extrabold text-amber-400">{agent.activeTicketsCount} Cases</div>
                  </div>

                  <div className="bg-slate-950 p-2 rounded-lg space-y-0.5">
                    <span className="text-[9px] text-slate-500 font-bold uppercase">Resolved Today</span>
                    <div className="font-mono font-extrabold text-emerald-400">{agent.resolvedToday} Solved</div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs font-mono pt-1 text-slate-300">
                  <span className="flex items-center space-x-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="font-bold text-white">{agent.csatScore}</span>
                  </span>
                  <span className="text-slate-400">Avg Resp: {agent.avgResponseTimeMinutes}m</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Provision Agent Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-xs font-bold text-white flex items-center space-x-2">
                <UserCheck className="w-4 h-4 text-[#febd69]" />
                <span>Provision New Support Agent</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rachel Adams"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#febd69]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Internal Email</label>
                <input
                  type="email"
                  placeholder="rachel.a@commercezon-support.internal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#febd69]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Role Permission Level</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as AgentRole)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#febd69]"
                >
                  <option value="CUSTOMER_SUPPORT_AGENT">Customer Support Agent (Tier 1)</option>
                  <option value="SENIOR_SUPPORT_AGENT">Senior Support Agent (Tier 2)</option>
                  <option value="TECHNICAL_SUPPORT">Technical & API Support</option>
                  <option value="FINANCE_SUPPORT">Finance & Payments Specialist</option>
                  <option value="SELLER_SUPPORT">Seller Partner Specialist</option>
                  <option value="WAREHOUSE_SUPPORT">Warehouse & FBA Specialist</option>
                  <option value="SUPERVISOR">Supervisor / Escalations Manager</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#febd69]"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#febd69] text-slate-950 font-black text-xs rounded-xl shadow"
                >
                  Provision Agent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
