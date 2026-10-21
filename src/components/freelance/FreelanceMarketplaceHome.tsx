import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Users,
  ShieldCheck,
  CheckCircle2,
  Clock,
  DollarSign,
  Plus,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  Star,
  Sparkles,
  FileText,
  AlertCircle,
  X,
  RefreshCw,
  Send,
  Lock,
  Unlock,
  Check
} from 'lucide-react';
import {
  FreelanceJob,
  FreelancerProfile,
  FreelanceProposal,
  FreelanceMilestone,
  FreelancerCategory
} from '../../types/freelancer';
import { freelanceClient } from '../../services/freelanceClient';

interface FreelanceMarketplaceHomeProps {
  walletBalance: number;
  onSwitchToPhysical: () => void;
  onSwitchToDigital: () => void;
}

export const FreelanceMarketplaceHome: React.FC<FreelanceMarketplaceHomeProps> = ({
  walletBalance,
  onSwitchToPhysical,
  onSwitchToDigital
}) => {
  const [activeTab, setActiveTab] = useState<'jobs' | 'talent' | 'contracts' | 'post'>('jobs');
  const [jobs, setJobs] = useState<FreelanceJob[]>([]);
  const [talent, setTalent] = useState<FreelancerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [metrics, setMetrics] = useState<any>({
    totalJobs: 4,
    activeContracts: 1,
    totalFreelancers: 4,
    totalEscrowLockedUSD: 1000,
    totalPaidOutUSD: 18400
  });

  // Proposal modal state
  const [selectedJobForProposal, setSelectedJobForProposal] = useState<FreelanceJob | null>(null);
  const [bidAmount, setBidAmount] = useState<number>(1000);
  const [deliveryDays, setDeliveryDays] = useState<number>(14);
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [proposalSubmitting, setProposalSubmitting] = useState(false);
  const [proposalSuccess, setProposalSuccess] = useState<string | null>(null);

  // Post Job Form State
  const [postTitle, setPostTitle] = useState('');
  const [postCategory, setPostCategory] = useState<FreelancerCategory>('web_frontend');
  const [postBudget, setPostBudget] = useState(2000);
  const [postDescription, setPostDescription] = useState('');
  const [postSkills, setPostSkills] = useState('React, TypeScript, Tailwind');
  const [postDuration, setPostDuration] = useState('2-4 weeks');
  const [postSubmitting, setPostSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [jobsRes, talentRes, metricsRes] = await Promise.all([
        freelanceClient.getJobs({ category: selectedCategory, q: searchQuery }),
        freelanceClient.getFreelancers({ category: selectedCategory, q: searchQuery }),
        freelanceClient.getMetrics().catch(() => ({ metrics }))
      ]);
      setJobs(jobsRes.jobs);
      setTalent(talentRes.freelancers);
      if (metricsRes.metrics) setMetrics(metricsRes.metrics);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const handleProposalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobForProposal) return;
    setProposalSubmitting(true);
    try {
      const res = await freelanceClient.submitProposal({
        jobId: selectedJobForProposal.id,
        bidAmount,
        deliveryDays,
        coverLetter,
        freelancerName: 'Sarah Chen, Lead Architect',
        milestonesProposed: [
          { title: 'Phase 1: Initial Architecture & Proof of Concept', amount: Math.round(bidAmount * 0.5) },
          { title: 'Phase 2: Complete Implementation & Deployment', amount: Math.round(bidAmount * 0.5) }
        ]
      });
      if (res.success) {
        setProposalSuccess('Proposal submitted successfully with milestone escrow terms!');
        await fetchData();
        setTimeout(() => {
          setSelectedJobForProposal(null);
          setProposalSuccess(null);
          setCoverLetter('');
        }, 1500);
      }
    } catch (err: any) {
      alert(`Proposal submission error: ${err.message}`);
    } finally {
      setProposalSubmitting(false);
    }
  };

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setPostSubmitting(true);
    try {
      const skillsArray = postSkills.split(',').map(s => s.trim()).filter(Boolean);
      const res = await freelanceClient.postJob({
        title: postTitle,
        category: postCategory,
        budget: postBudget,
        budgetType: 'FIXED',
        description: postDescription,
        skills: skillsArray,
        experienceLevel: 'EXPERT',
        duration: postDuration,
        milestones: [
          { title: 'Milestone 1: Deliverable Initial Draft', amount: Math.round(postBudget * 0.5), dueDate: '2026-11-15' },
          { title: 'Milestone 2: Final Handover & Sign-off', amount: Math.round(postBudget * 0.5), dueDate: '2026-11-30' }
        ]
      });

      if (res.success) {
        alert('Job contract posted successfully to the Commerce Zone Freelance Board!');
        setPostTitle('');
        setPostDescription('');
        setActiveTab('jobs');
        await fetchData();
      }
    } catch (err: any) {
      alert(`Error posting project: ${err.message}`);
    } finally {
      setPostSubmitting(false);
    }
  };

  const handleReleaseMilestone = async (jobId: string, milestoneId: string) => {
    if (!confirm('Release escrow funds for this milestone to the freelancer? This action transfers verified funds immediately.')) return;
    try {
      const res = await freelanceClient.releaseEscrow(jobId, milestoneId);
      if (res.success) {
        alert('Escrow payment released successfully! Wallet credited to freelancer.');
        await fetchData();
      }
    } catch (err: any) {
      alert(`Failed to release escrow: ${err.message}`);
    }
  };

  const handleFundMilestone = async (jobId: string, milestoneId: string) => {
    try {
      const res = await freelanceClient.fundMilestone(jobId, milestoneId);
      if (res.success) {
        alert('Milestone escrow funded securely from Commerce Zone Wallet!');
        await fetchData();
      }
    } catch (err: any) {
      alert(`Failed to fund milestone: ${err.message}`);
    }
  };

  const categories = [
    { id: 'all', label: 'All Disciplines' },
    { id: 'ai_ml', label: 'AI & Machine Learning' },
    { id: 'web_frontend', label: 'Web & React' },
    { id: 'mobile_apps', label: 'Mobile & Flutter' },
    { id: 'ui_ux_design', label: 'UI/UX & Figma' },
    { id: 'devops_cloud', label: 'DevOps & Kubernetes' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      {/* Sub-Header Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 sticky top-[73px] z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Sub Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto">
            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center space-x-1.5 ${
                activeTab === 'jobs' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Browse Projects</span>
            </button>

            <button
              onClick={() => setActiveTab('talent')}
              className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center space-x-1.5 ${
                activeTab === 'talent' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Top Talent</span>
            </button>

            <button
              onClick={() => setActiveTab('contracts')}
              className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center space-x-1.5 ${
                activeTab === 'contracts' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Milestone Escrow Tracker</span>
            </button>

            <button
              onClick={() => setActiveTab('post')}
              className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center space-x-1.5 ${
                activeTab === 'post' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Post a Project</span>
            </button>
          </div>

          {/* Quick Cross-Marketplace Jump */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onSwitchToDigital}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 font-bold text-xs transition border border-slate-700"
            >
              Digital Market
            </button>
            <button
              onClick={onSwitchToPhysical}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[#febd69] font-bold text-xs transition border border-slate-700"
            >
              Physical Market
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-6 space-y-8">
        {/* Top Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-amber-950/60 via-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-10 shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Commerce Zone Freelancer Platform • 100% Escrow Protected</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Hire Elite Software, AI & Design Talent on Escrow Milestones
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              Work with verified architects, mobile developers, and UI/UX designers. Funds stay safely locked in Commerce Zone Escrow until you inspect and approve each milestone deliverable.
            </p>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Open Contracts</span>
                <span className="text-sm font-bold text-amber-400 font-mono">{metrics.totalJobs} Active</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Escrow Protected</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">${metrics.totalEscrowLockedUSD.toLocaleString()} USD</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Total Disbursed</span>
                <span className="text-sm font-bold text-white font-mono">${metrics.totalPaidOutUSD.toLocaleString()} USD</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Dispute Guarantee</span>
                <span className="text-sm font-bold text-indigo-400 font-mono">100% Arbitration</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab 1: Browse Jobs */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            {/* Search & Categories */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects by skills, tech stack, or client..."
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
                <button type="submit" className="absolute right-2 top-2 p-1 text-slate-400 hover:text-white">
                  <Search className="w-4 h-4" />
                </button>
              </form>

              <div className="flex items-center space-x-2 overflow-x-auto">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                      selectedCategory === c.id
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Jobs List */}
            {loading ? (
              <div className="p-12 text-center text-slate-400">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-amber-400 mb-2" />
                <span className="text-xs font-mono">Loading active contracts...</span>
              </div>
            ) : jobs.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <Briefcase className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="text-sm font-bold text-white">No Open Contracts Found</h3>
                <p className="text-xs text-slate-400">Try adjusting your category filter or search keywords.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl hover:border-amber-500/40 transition space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 uppercase font-bold">
                            {job.categoryLabel}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            {job.experienceLevel}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                            {job.duration}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white mt-1.5">{job.title}</h3>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xl font-black font-mono text-emerald-400">
                          ${job.budget.toLocaleString()}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 block uppercase">
                          {job.budgetType} Price
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
                      {job.description}
                    </p>

                    {/* Skills pills */}
                    <div className="flex flex-wrap gap-1.5">
                      {job.skills.map((skill, i) => (
                        <span key={i} className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/60">
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Milestones Preview */}
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                        Milestone Escrow Structure ({job.milestones.length} Stages)
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {job.milestones.map((m) => (
                          <div key={m.id} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                            <div className="flex flex-col">
                              <span className="font-bold text-white truncate max-w-[150px]">{m.title}</span>
                              <span className="text-[10px] text-slate-500 font-mono">Due: {m.dueDate}</span>
                            </div>
                            <div className="text-right">
                              <span className="font-mono font-bold text-emerald-400">${m.amount}</span>
                              <span className={`text-[9px] block font-mono font-bold ${
                                m.status === 'RELEASED' ? 'text-emerald-400' : m.status === 'ESCROW_FUNDED' ? 'text-indigo-400' : 'text-slate-400'
                              }`}>
                                {m.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Client Info & Proposal Action */}
                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-800 text-xs">
                      <div className="flex items-center space-x-3 text-slate-400">
                        <span className="flex items-center space-x-1 text-white font-bold">
                          <span>{job.clientName}</span>
                          <span className="text-amber-400 font-mono">★ {job.clientRating.toFixed(1)}</span>
                        </span>
                        <span>•</span>
                        <span>{job.clientCountry}</span>
                        <span>•</span>
                        <span>${job.clientTotalSpent.toLocaleString()} spent</span>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedJobForProposal(job);
                          setBidAmount(job.budget);
                        }}
                        className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition flex items-center space-x-1.5 shadow-md self-end sm:self-auto"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Proposal ({job.proposalsCount} applied)</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Top Talent */}
        {activeTab === 'talent' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {talent.map((fl) => (
              <div key={fl.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-start space-x-4">
                  <img src={fl.avatar} alt={fl.name} className="w-16 h-16 rounded-2xl object-cover border border-slate-700 shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-bold text-white">{fl.name}</h3>
                      {fl.isVerified && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-amber-400 font-medium mt-0.5">{fl.title}</p>
                    <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1 font-mono">
                      <span>★ {fl.rating.toFixed(2)} ({fl.reviewsCount})</span>
                      <span>•</span>
                      <span>{fl.completedProjects} Projects</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-bold">${fl.hourlyRate}/hr</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {fl.bio}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5">
                  {fl.skills.map((s, i) => (
                    <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {s}
                    </span>
                  ))}
                </div>

                {/* Portfolio previews */}
                {fl.portfolio.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {fl.portfolio.map((p) => (
                      <div key={p.id} className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                        <img src={p.image} alt={p.title} className="w-full h-24 object-cover" />
                        <div className="p-2">
                          <span className="text-[11px] font-bold text-white block truncate">{p.title}</span>
                          <span className="text-[9px] font-mono text-slate-400">{p.tag}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => alert(`Direct consultation request dispatched to ${fl.name}. They respond in ${fl.responseTime}.`)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition"
                  >
                    Consult & Hire Talent
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Milestone Escrow Contracts Tracker */}
        {activeTab === 'contracts' && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ShieldCheck className="w-8 h-8 text-emerald-400" />
                <div>
                  <h3 className="text-base font-bold text-white">Active Milestone Escrow Ledger</h3>
                  <p className="text-xs text-slate-400">Funds remain locked in smart escrow until deliverable verification.</p>
                </div>
              </div>
              <span className="text-sm font-mono font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
                Wallet Available: ${walletBalance.toFixed(2)} USD
              </span>
            </div>

            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase">Contract #{job.id}</span>
                      <h4 className="text-base font-bold text-white">{job.title}</h4>
                    </div>
                    <span className="text-sm font-mono font-bold text-amber-400">
                      Total: ${job.budget.toLocaleString()} USD
                    </span>
                  </div>

                  <div className="space-y-2">
                    {job.milestones.map((m) => (
                      <div
                        key={m.id}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            {m.status === 'RELEASED' ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : m.status === 'ESCROW_FUNDED' ? (
                              <Lock className="w-4 h-4 text-indigo-400" />
                            ) : (
                              <Clock className="w-4 h-4 text-amber-400" />
                            )}
                            <span className="font-bold text-white">{m.title}</span>
                          </div>
                          {m.deliverableNote && (
                            <p className="text-[11px] text-indigo-300 font-mono pl-6">
                              Deliverable: {m.deliverableNote}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center space-x-3 shrink-0">
                          <span className="font-mono font-bold text-emerald-400 text-sm">
                            ${m.amount} USD
                          </span>

                          {m.status === 'PENDING' && (
                            <button
                              onClick={() => handleFundMilestone(job.id, m.id)}
                              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition"
                            >
                              Fund Escrow
                            </button>
                          )}

                          {m.status === 'ESCROW_FUNDED' && (
                            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded-lg font-mono font-bold">
                              Escrow Locked
                            </span>
                          )}

                          {m.status === 'SUBMITTED' && (
                            <button
                              onClick={() => handleReleaseMilestone(job.id, m.id)}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition flex items-center space-x-1"
                            >
                              <Unlock className="w-3.5 h-3.5" />
                              <span>Approve & Release</span>
                            </button>
                          )}

                          {m.status === 'RELEASED' && (
                            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg font-mono font-bold">
                              Paid & Released
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Post Project */}
        {activeTab === 'post' && (
          <div className="max-w-2xl mx-auto p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
            <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
              <Plus className="w-6 h-6 text-amber-400" />
              <div>
                <h3 className="text-lg font-bold text-white">Post a New Freelance Project Contract</h3>
                <p className="text-xs text-slate-400">Lock escrow milestones and receive qualified proposals within hours.</p>
              </div>
            </div>

            <form onSubmit={handlePostJob} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="e.g. Develop AI Customer Support Assistant with Gemini 2.5"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Category</label>
                  <select
                    value={postCategory}
                    onChange={(e) => setPostCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="ai_ml">AI & Machine Learning</option>
                    <option value="web_frontend">Web & React / Next.js</option>
                    <option value="fullstack_backend">Full-Stack & Microservices</option>
                    <option value="mobile_apps">Mobile (Flutter / React Native)</option>
                    <option value="ui_ux_design">UI/UX & Figma Systems</option>
                    <option value="devops_cloud">DevOps & Cloud Infrastructure</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Estimated Budget ($ USD)</label>
                  <input
                    type="number"
                    min={100}
                    required
                    value={postBudget}
                    onChange={(e) => setPostBudget(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Required Skills (Comma separated)</label>
                <input
                  type="text"
                  value={postSkills}
                  onChange={(e) => setPostSkills(e.target.value)}
                  placeholder="TypeScript, React, Python, Docker"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Project Scope & Deliverable Details</label>
                <textarea
                  rows={4}
                  required
                  value={postDescription}
                  onChange={(e) => setPostDescription(e.target.value)}
                  placeholder="Provide technical requirements, target latency, acceptance criteria, and architecture..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-slate-800">
                <button
                  type="submit"
                  disabled={postSubmitting}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center space-x-1.5"
                >
                  {postSubmitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Publish Contract to Marketplace</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Proposal Modal */}
      {selectedJobForProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Send className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Submit Contract Proposal</h3>
              </div>
              <button
                onClick={() => setSelectedJobForProposal(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProposalSubmit} className="p-6 space-y-4">
              {proposalSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{proposalSuccess}</span>
                </div>
              )}

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Target Project</span>
                <span className="text-xs font-bold text-white line-clamp-1">{selectedJobForProposal.title}</span>
                <span className="text-[10px] text-amber-400 font-mono block mt-0.5">Client Budget: ${selectedJobForProposal.budget}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Your Bid Amount ($ USD)</label>
                  <input
                    type="number"
                    min={50}
                    required
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Delivery Time (Days)</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={deliveryDays}
                    onChange={(e) => setDeliveryDays(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Cover Letter & Approach</label>
                <textarea
                  rows={4}
                  required
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Outline your architecture, previous relevant systems built, milestone breakdown, and testing methodology..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedJobForProposal(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={proposalSubmitting}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center space-x-1.5"
                >
                  {proposalSubmitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Submit Proposal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
