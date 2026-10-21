import React, { useState, useEffect } from 'react';
import {
  DisputeCase,
  DisputeStatus,
  DisputeCategory,
  MarketplaceReport,
  ReportStatus,
  ReportSeverity,
  FraudRiskAssessment,
  ProductListingModeration,
  SellerTrustReputation,
  TrustSafetyMetrics,
} from '../../types/trustSafety';
import {
  ShieldAlert,
  Scale,
  AlertTriangle,
  FileWarning,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Search,
  Filter,
  Eye,
  Gavel,
  DollarSign,
  ShieldCheck,
  AlertCircle,
  FileText,
  ChevronRight,
  Plus,
  RefreshCw,
  Clock,
  ArrowRight,
  Send,
  Sliders,
  ShieldX,
  Lock,
  UserCheck,
} from 'lucide-react';

export type TrustSafetySubTab =
  | 'overview'
  | 'disputes'
  | 'reports'
  | 'fraud'
  | 'moderation'
  | 'reputation';

interface TrustSafetyMasterModuleProps {
  currentRole?: string;
  onNavigateOrders?: () => void;
}

export const TrustSafetyMasterModule: React.FC<TrustSafetyMasterModuleProps> = ({
  currentRole = 'ADMIN',
}) => {
  const [activeSubTab, setActiveSubTab] = useState<TrustSafetySubTab>('overview');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Data states
  const [metrics, setMetrics] = useState<TrustSafetyMetrics | null>(null);
  const [disputes, setDisputes] = useState<DisputeCase[]>([]);
  const [reports, setReports] = useState<MarketplaceReport[]>([]);
  const [fraudAssessments, setFraudAssessments] = useState<FraudRiskAssessment[]>([]);
  const [moderatedListings, setModeratedListings] = useState<ProductListingModeration[]>([]);
  const [sellerReputations, setSellerReputations] = useState<SellerTrustReputation[]>([]);

  // Selected Detail Views / Modals
  const [selectedDispute, setSelectedDispute] = useState<DisputeCase | null>(null);
  const [selectedReport, setSelectedReport] = useState<MarketplaceReport | null>(null);
  const [showNewDisputeModal, setShowNewDisputeModal] = useState<boolean>(false);
  const [showNewReportModal, setShowNewReportModal] = useState<boolean>(false);
  const [showSimulateFraudModal, setShowSimulateFraudModal] = useState<boolean>(false);

  // Dispute Filter states
  const [disputeStatusFilter, setDisputeStatusFilter] = useState<string>('all');
  const [disputeCategoryFilter, setDisputeCategoryFilter] = useState<string>('all');
  const [disputeSearch, setDisputeSearch] = useState<string>('');

  // Report Filter states
  const [reportStatusFilter, setReportStatusFilter] = useState<string>('all');
  const [reportSeverityFilter, setReportSeverityFilter] = useState<string>('all');

  // Dispute Detail Action Form states
  const [disputeReplyText, setDisputeReplyText] = useState<string>('');
  const [proposeType, setProposeType] = useState<any>('FULL_REFUND');
  const [proposeAmount, setProposeAmount] = useState<number>(0);
  const [proposeExplanation, setProposeExplanation] = useState<string>('');
  const [arbitrationDecision, setArbitrationDecision] = useState<any>('REFUND_BUYER_FULL');
  const [arbitrationRationale, setArbitrationRationale] = useState<string>('');

  // New Dispute Form states
  const [newOrderNum, setNewOrderNum] = useState<string>('CZ-98214');
  const [newOrderId, setNewOrderId] = useState<string>('ord-101');
  const [newProdTitle, setNewProdTitle] = useState<string>('AeroBook Pro M3 Max Workstation');
  const [newProdId, setNewProdId] = useState<string>('prod-01');
  const [newSellerId, setNewSellerId] = useState<string>('merch-01');
  const [newSellerName, setNewSellerName] = useState<string>('AeroTech Electronics Global');
  const [newCategory, setNewCategory] = useState<DisputeCategory>('DAMAGED_OR_DEFECTIVE');
  const [newAmount, setNewAmount] = useState<number>(2499.0);
  const [newOutcome, setNewOutcome] = useState<any>('REPLACEMENT');
  const [newDescription, setNewDescription] = useState<string>('');

  // New Report Form states
  const [newReportTargetType, setNewReportTargetType] = useState<any>('PRODUCT_LISTING');
  const [newReportTargetName, setNewReportTargetName] = useState<string>('SuperAir Wireless Pods Pro [Counterfeit clone]');
  const [newReportTargetId, setNewReportTargetId] = useState<string>('prod-fake-01');
  const [newReportCategory, setNewReportCategory] = useState<any>('COUNTERFEIT_OR_REPLICA');
  const [newReportSeverity, setNewReportSeverity] = useState<ReportSeverity>('HIGH');
  const [newReportDescription, setNewReportDescription] = useState<string>('');

  // Fraud Simulation Form states
  const [simAmount, setSimAmount] = useState<number>(3200);
  const [simEmail, setSimEmail] = useState<string>('test.buyer@tempmail.com');
  const [simShipCountry, setSimShipCountry] = useState<string>('NG');
  const [simBillCountry, setSimBillCountry] = useState<string>('US');
  const [simItemsCount, setSimItemsCount] = useState<number>(18);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = async () => {
    try {
      setRefreshing(true);
      const [mRes, dRes, rRes, fRes, modRes, repRes] = await Promise.all([
        fetch('/api/trust-safety/metrics'),
        fetch('/api/trust-safety/disputes'),
        fetch('/api/trust-safety/reports'),
        fetch('/api/trust-safety/fraud/evaluations'),
        fetch('/api/trust-safety/moderation/listings'),
        fetch('/api/trust-safety/reputation'),
      ]);

      if (mRes.ok) {
        const d = await mRes.json();
        setMetrics(d.metrics);
      }
      if (dRes.ok) {
        const d = await dRes.json();
        setDisputes(d.disputes || []);
        if (selectedDispute) {
          const fresh = (d.disputes || []).find((x: any) => x.id === selectedDispute.id);
          if (fresh) setSelectedDispute(fresh);
        }
      }
      if (rRes.ok) {
        const d = await rRes.json();
        setReports(d.reports || []);
      }
      if (fRes.ok) {
        const d = await fRes.json();
        setFraudAssessments(d.evaluations || []);
      }
      if (modRes.ok) {
        const d = await modRes.json();
        setModeratedListings(d.listings || []);
      }
      if (repRes.ok) {
        const d = await repRes.json();
        setSellerReputations(d.reputations || []);
      }
    } catch (err) {
      console.error('Failed to fetch trust & safety data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Dispute Actions
  const handleSendMessage = async () => {
    if (!selectedDispute || !disputeReplyText.trim()) return;
    try {
      const res = await fetch(`/api/trust-safety/disputes/${selectedDispute.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderRole: currentRole === 'SELLER' ? 'SELLER' : currentRole === 'ADMIN' ? 'ADMIN' : 'BUYER',
          senderName:
            currentRole === 'SELLER'
              ? selectedDispute.sellerName
              : currentRole === 'ADMIN'
              ? 'Marketplace Arbitrator'
              : selectedDispute.buyerName,
          content: disputeReplyText.trim(),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedDispute(data.dispute);
        setDisputeReplyText('');
        showToast('Message sent to dispute record');
        loadData();
      }
    } catch (e) {
      showToast('Error sending message');
    }
  };

  const handleProposeResolution = async () => {
    if (!selectedDispute || !proposeExplanation.trim()) return;
    try {
      const res = await fetch(`/api/trust-safety/disputes/${selectedDispute.id}/propose-resolution`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actor: {
            role: currentRole === 'ADMIN' ? 'ADMIN' : 'SELLER',
            name: currentRole === 'ADMIN' ? 'Admin Arbitrator' : selectedDispute.sellerName,
          },
          proposal: {
            type: proposeType,
            amount: proposeAmount || selectedDispute.claimedAmount,
            explanation: proposeExplanation.trim(),
          },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedDispute(data.dispute);
        setProposeExplanation('');
        showToast('Resolution proposal submitted to buyer');
        loadData();
      }
    } catch (e) {
      showToast('Failed to propose resolution');
    }
  };

  const handleAcceptResolution = async () => {
    if (!selectedDispute) return;
    try {
      const res = await fetch(`/api/trust-safety/disputes/${selectedDispute.id}/accept-resolution`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerId: selectedDispute.buyerId,
          buyerName: selectedDispute.buyerName,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedDispute(data.dispute);
        showToast('Resolution accepted! Dispute marked as RESOLVED');
        loadData();
      }
    } catch (e) {
      showToast('Error accepting resolution');
    }
  };

  const handleEscalateToAdmin = async () => {
    if (!selectedDispute) return;
    try {
      const res = await fetch(`/api/trust-safety/disputes/${selectedDispute.id}/escalate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actor: {
            role: currentRole === 'SELLER' ? 'SELLER' : 'BUYER',
            name: currentRole === 'SELLER' ? selectedDispute.sellerName : selectedDispute.buyerName,
          },
          reason: 'Unable to reach mutual agreement. Requesting platform arbitrator ruling.',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedDispute(data.dispute);
        showToast('Dispute escalated to Marketplace Trust & Safety Arbitrator');
        loadData();
      }
    } catch (e) {
      showToast('Error escalating dispute');
    }
  };

  const handleArbitrate = async () => {
    if (!selectedDispute || !arbitrationRationale.trim()) return;
    try {
      const res = await fetch(`/api/trust-safety/disputes/${selectedDispute.id}/arbitrate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: 'admin-sec-01',
          adminName: 'Chief Trust Officer',
          decision: arbitrationDecision,
          rationale: arbitrationRationale.trim(),
          refundAmount:
            arbitrationDecision === 'REFUND_BUYER_FULL'
              ? selectedDispute.claimedAmount
              : arbitrationDecision === 'REFUND_BUYER_PARTIAL'
              ? selectedDispute.claimedAmount * 0.5
              : 0,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedDispute(data.dispute);
        setArbitrationRationale('');
        showToast('Binding arbitration verdict recorded');
        loadData();
      }
    } catch (e) {
      showToast('Failed to arbitrate dispute');
    }
  };

  // Create Dispute
  const handleCreateDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDescription.trim()) return;
    try {
      const res = await fetch('/api/trust-safety/disputes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: newOrderId,
          orderNumber: newOrderNum,
          productId: newProdId,
          productTitle: newProdTitle,
          buyerId: 'usr-buyer-01',
          buyerName: 'Alex Mercer (Buyer)',
          buyerEmail: 'alex.mercer@enterprise.co',
          sellerId: newSellerId,
          sellerName: newSellerName,
          category: newCategory,
          claimedAmount: Number(newAmount),
          currency: 'USD',
          description: newDescription.trim(),
          desiredOutcome: newOutcome,
          initialEvidence: {
            title: 'Initial Buyer Filing Statement & Evidence',
            type: 'STATEMENT',
            notes: newDescription.trim(),
          },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setShowNewDisputeModal(false);
        setNewDescription('');
        showToast(`Dispute #${data.dispute.id} created successfully`);
        loadData();
        setSelectedDispute(data.dispute);
      } else {
        const err = await res.json();
        showToast(err.error || 'Failed to file dispute');
      }
    } catch (e) {
      showToast('Network error filing dispute');
    }
  };

  // Create Report
  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReportDescription.trim()) return;
    try {
      const res = await fetch('/api/trust-safety/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reporterId: 'usr-buyer-01',
          reporterName: 'Alex Mercer',
          reporterRole: 'BUYER',
          targetType: newReportTargetType,
          targetId: newReportTargetId,
          targetName: newReportTargetName,
          category: newReportCategory,
          severity: newReportSeverity,
          description: newReportDescription.trim(),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setShowNewReportModal(false);
        setNewReportDescription('');
        showToast(`Report #${data.report.referenceNumber} submitted`);
        loadData();
      } else {
        const err = await res.json();
        showToast(err.error || 'Failed to submit report');
      }
    } catch (e) {
      showToast('Error submitting report');
    }
  };

  // Triage Report Action
  const handleTriageReport = async (
    reportId: string,
    status: ReportStatus,
    action: any,
    notes: string
  ) => {
    try {
      const res = await fetch(`/api/trust-safety/reports/${reportId}/triage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: 'admin-sec-01',
          status,
          actionTaken: action,
          resolutionNotes: notes,
        }),
      });
      if (res.ok) {
        showToast('Report triaged successfully');
        loadData();
        if (selectedReport && selectedReport.id === reportId) {
          const fresh = reports.find((r) => r.id === reportId);
          if (fresh) setSelectedReport({ ...fresh, status, actionTaken: action, resolutionNotes: notes });
        }
      }
    } catch (e) {
      showToast('Failed to triage report');
    }
  };

  // Fraud Simulation
  const handleSimulateFraud = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/trust-safety/fraud/evaluate-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: `ord-sim-${Date.now().toString().slice(-4)}`,
          orderAmount: Number(simAmount),
          buyerId: 'usr-sim-buyer',
          buyerEmail: simEmail,
          shippingCountry: simShipCountry,
          billingCountry: simBillCountry,
          itemsCount: Number(simItemsCount),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        showToast(`Evaluation complete: Score ${data.assessment.riskScore}/100 (${data.assessment.riskTier})`);
        setShowSimulateFraudModal(false);
        loadData();
      }
    } catch (e) {
      showToast('Simulation error');
    }
  };

  // Moderation Listing Action
  const handleListingAction = async (id: string, action: 'SUPPRESS' | 'CLEAR' | 'PERMANENTLY_REMOVE', strike: boolean) => {
    try {
      const res = await fetch(`/api/trust-safety/moderation/listings/${id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: 'admin-sec-01',
          action,
          evidenceNotes: `Moderation officer executed ${action} action. Strike issued: ${strike}`,
          issueStrike: strike,
        }),
      });
      if (res.ok) {
        showToast(`Listing moderation applied: ${action}`);
        loadData();
      }
    } catch (e) {
      showToast('Failed to action listing');
    }
  };

  // Review Appeal
  const handleReviewAppeal = async (id: string, decision: 'APPROVED' | 'REJECTED') => {
    try {
      const res = await fetch(`/api/trust-safety/moderation/listings/${id}/appeal/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: 'admin-sec-01',
          decision,
          reviewNotes: decision === 'APPROVED' ? 'Proof of authenticity validated.' : 'Documentation insufficient.',
        }),
      });
      if (res.ok) {
        showToast(`Appeal ${decision.toLowerCase()}`);
        loadData();
      }
    } catch (e) {
      showToast('Failed to review appeal');
    }
  };

  // Toggle Payout Hold
  const handleToggleHold = async (merchantId: string, currentHold: boolean) => {
    try {
      const res = await fetch(`/api/trust-safety/reputation/${merchantId}/toggle-hold`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          holdStatus: !currentHold,
          reason: !currentHold ? 'Risk review hold placed by Trust & Safety' : 'Hold released following audit',
        }),
      });
      if (res.ok) {
        showToast(!currentHold ? 'Merchant payouts frozen' : 'Merchant payouts restored');
        loadData();
      }
    } catch (e) {
      showToast('Failed to toggle payout hold');
    }
  };

  // Filtered Disputes
  const filteredDisputes = disputes.filter((d) => {
    if (disputeStatusFilter !== 'all' && d.status !== disputeStatusFilter) return false;
    if (disputeCategoryFilter !== 'all' && d.category !== disputeCategoryFilter) return false;
    if (disputeSearch.trim()) {
      const q = disputeSearch.toLowerCase();
      return (
        d.id.toLowerCase().includes(q) ||
        d.orderNumber.toLowerCase().includes(q) ||
        d.productTitle.toLowerCase().includes(q) ||
        d.buyerName.toLowerCase().includes(q) ||
        d.sellerName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Filtered Reports
  const filteredReports = reports.filter((r) => {
    if (reportStatusFilter !== 'all' && r.status !== reportStatusFilter) return false;
    if (reportSeverityFilter !== 'all' && r.severity !== reportSeverityFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-[#febd69] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 animate-fade-in">
          <ShieldAlert className="w-5 h-5 text-[#febd69]" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Main Banner Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border border-slate-800 rounded-2xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-xs font-black tracking-wider uppercase">
                Part 15
              </span>
              <span className="flex items-center text-xs font-mono text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-ping" />
                Trust, Safety & Arbitration Protocol Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Scale className="w-8 h-8 text-[#febd69]" />
              Trust, Safety, Fraud Prevention & Dispute Resolution
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
              End-to-end marketplace integrity hub: order dispute arbitration, multi-tier evidence tracking, fraud detection risk scoring, counterfeit & IP infringement moderation, and seller trust scores.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowNewDisputeModal(true)}
              className="px-4 py-2.5 bg-[#febd69] hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black transition flex items-center space-x-2 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>File New Dispute</span>
            </button>

            <button
              onClick={() => setShowNewReportModal(true)}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black transition flex items-center space-x-2 shadow-lg"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Submit Report</span>
            </button>

            <button
              onClick={loadData}
              disabled={refreshing}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition border border-slate-700"
              title="Refresh telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-[#febd69]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Sub-navigation tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto border-t border-slate-800/80 pt-4 mt-6">
          {[
            { id: 'overview', label: 'Command Overview', icon: ShieldAlert, badge: undefined },
            { id: 'disputes', label: 'Dispute Arbitration', icon: Scale, badge: disputes.filter((d) => !['RESOLVED', 'REJECTED', 'CLOSED'].includes(d.status)).length },
            { id: 'reports', label: 'Marketplace Reports', icon: FileWarning, badge: reports.filter((r) => r.status === 'SUBMITTED').length },
            { id: 'fraud', label: 'AI Fraud Monitoring', icon: AlertCircle, badge: fraudAssessments.filter((f) => f.riskTier === 'CRITICAL' || f.riskTier === 'HIGH').length },
            { id: 'moderation', label: 'Product Moderation & IP', icon: ShieldCheck, badge: moderatedListings.filter((m) => m.status === 'FLAGGED' || m.status === 'UNDER_APPEAL').length },
            { id: 'reputation', label: 'Seller Trust Scores', icon: UserCheck, badge: sellerReputations.filter((s) => s.payoutHoldStatus).length ? `${sellerReputations.filter((s) => s.payoutHoldStatus).length} Holds` : undefined },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveSubTab(tab.id as TrustSafetySubTab);
                  setSelectedDispute(null);
                  setSelectedReport(null);
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-[#febd69] text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-black ${
                      isActive ? 'bg-slate-950 text-white' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: OVERVIEW & KEY TELEMETRY */}
      {/* ========================================================= */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
                <span>Active Open Disputes</span>
                <Scale className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-black text-white">{metrics?.totalActiveDisputes ?? 0}</div>
              <div className="text-[11px] text-amber-400 mt-2 flex items-center space-x-1">
                <span>Requires buyer/seller resolution</span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
                <span>Pending Safety Reports</span>
                <FileWarning className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-3xl font-black text-white">{metrics?.openReportsCount ?? 0}</div>
              <div className="text-[11px] text-rose-400 mt-2 flex items-center space-x-1">
                <span>Counterfeit, Scam & Harassment</span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
                <span>High-Risk Fraud Alerts</span>
                <AlertTriangle className="w-4 h-4 text-orange-400" />
              </div>
              <div className="text-3xl font-black text-white">{metrics?.highRiskTransactionsCount ?? 0}</div>
              <div className="text-[11px] text-emerald-400 mt-2 flex items-center space-x-1">
                <span>${(metrics?.preventedFraudLossUsd ?? 0).toLocaleString()} fraud averted</span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
                <span>Marketplace Dispute Rate</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-white">{metrics?.disputeRateMarketplacePct ?? 0.68}%</div>
              <div className="text-[11px] text-emerald-400 mt-2 flex items-center space-x-1">
                <span>Benchmark &lt; 1.00% (Healthy)</span>
              </div>
            </div>
          </div>

          {/* Quick Action & Protocol Guides */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-lg font-black text-white flex items-center space-x-2">
                <Gavel className="w-5 h-5 text-[#febd69]" />
                <span>Active Disputes Needing Immediate Attention</span>
              </h3>
              <div className="space-y-3">
                {disputes
                  .filter((d) => d.status === 'ESCALATED' || d.status === 'AWAITING_SELLER_RESPONSE')
                  .slice(0, 4)
                  .map((d) => (
                    <div
                      key={d.id}
                      onClick={() => {
                        setSelectedDispute(d);
                        setActiveSubTab('disputes');
                      }}
                      className="p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-slate-700 transition cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-xs text-[#febd69]">
                          {d.id.slice(-4)}
                        </div>
                        <div>
                          <div className="text-xs font-black text-white flex items-center space-x-2">
                            <span>{d.productTitle}</span>
                            <span className="text-[10px] text-slate-400">({d.orderNumber})</span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            Buyer: <span className="text-slate-300 font-semibold">{d.buyerName}</span> • Seller:{' '}
                            <span className="text-slate-300 font-semibold">{d.sellerName}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            d.status === 'ESCALATED'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          }`}
                        >
                          {d.status.replace(/_/g, ' ')}
                        </span>
                        <div className="text-xs font-black text-emerald-400 mt-1">
                          ${d.claimedAmount.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Fraud & Safety Summary */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-lg font-black text-white flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
                <span>AI Threat Signals</span>
              </h3>
              <p className="text-xs text-slate-400">
                Automated risk heuristics monitor checkout velocity, card anomalies, and IP routing continuously.
              </p>
              <div className="space-y-3 pt-2">
                {fraudAssessments.slice(0, 3).map((f) => (
                  <div key={f.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-white">{f.entityName}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black ${
                          f.riskTier === 'CRITICAL'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {f.riskTier} ({f.riskScore}/100)
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">
                      {f.signals[0]?.details || 'Multi-factor risk evaluation'}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowSimulateFraudModal(true)}
                className="w-full mt-2 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2"
              >
                <Sliders className="w-3.5 h-3.5 text-[#febd69]" />
                <span>Test Live Risk Engine Simulator</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: DISPUTE ARBITRATION WORKBENCH */}
      {/* ========================================================= */}
      {activeSubTab === 'disputes' && (
        <div className="space-y-6">
          {!selectedDispute ? (
            /* Dispute List View */
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={disputeSearch}
                    onChange={(e) => setDisputeSearch(e.target.value)}
                    placeholder="Search by case ID, order #, buyer, seller, or product..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#febd69]"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                    <Filter className="w-3.5 h-3.5" />
                    <span>Status:</span>
                  </div>
                  <select
                    value={disputeStatusFilter}
                    onChange={(e) => setDisputeStatusFilter(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-[#febd69]"
                  >
                    <option value="all">All Statuses</option>
                    <option value="AWAITING_SELLER_RESPONSE">Awaiting Seller</option>
                    <option value="AWAITING_BUYER_RESPONSE">Awaiting Buyer</option>
                    <option value="RESOLUTION_PROPOSED">Proposal Pending</option>
                    <option value="ESCALATED">Escalated to Admin</option>
                    <option value="RESOLVED">Resolved</option>
                  </select>

                  <select
                    value={disputeCategoryFilter}
                    onChange={(e) => setDisputeCategoryFilter(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-[#febd69]"
                  >
                    <option value="all">All Categories</option>
                    <option value="ITEM_NOT_RECEIVED">Item Not Received</option>
                    <option value="DAMAGED_OR_DEFECTIVE">Damaged / Defective</option>
                    <option value="SIGNIFICANTLY_NOT_AS_DESCRIBED">Not as Described</option>
                    <option value="RETURN_REFUND_DISAGREEMENT">Return Disagreement</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase font-black tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Dispute Case</th>
                      <th className="py-3 px-4">Order & Product</th>
                      <th className="py-3 px-4">Buyer / Seller</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Claim Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredDisputes.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-slate-500">
                          No dispute records matching query.
                        </td>
                      </tr>
                    ) : (
                      filteredDisputes.map((d) => (
                        <tr key={d.id} className="hover:bg-slate-800/40 transition">
                          <td className="py-3.5 px-4 font-mono font-bold text-[#febd69]">
                            {d.id}
                            {d.escalatedToAdmin && (
                              <span className="block text-[9px] text-rose-400 font-bold uppercase mt-0.5">
                                • Escalated
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white line-clamp-1">{d.productTitle}</div>
                            <div className="text-[10px] text-slate-400">Order #{d.orderNumber}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="text-slate-300 font-semibold">{d.buyerName}</div>
                            <div className="text-[10px] text-slate-500">Store: {d.sellerName}</div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-300">
                            {d.category.replace(/_/g, ' ')}
                          </td>
                          <td className="py-3.5 px-4 font-black text-white">
                            ${d.claimedAmount.toFixed(2)}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                d.status === 'RESOLVED'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : d.status === 'ESCALATED'
                                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                                  : d.status === 'RESOLUTION_PROPOSED'
                                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              }`}
                            >
                              {d.status.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => setSelectedDispute(d)}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-[#febd69] hover:text-slate-950 text-white rounded-lg font-bold transition flex items-center space-x-1 ml-auto text-xs"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Case</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Selected Dispute Detail Case Workbench */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedDispute(null)}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition flex items-center space-x-2"
                >
                  <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                  <span>Back to All Disputes</span>
                </button>

                <div className="flex items-center space-x-3">
                  <span className="text-xs text-slate-400">Case Reference:</span>
                  <span className="text-xs font-mono font-black text-[#febd69]">{selectedDispute.id}</span>
                  <span
                    className={`px-2.5 py-1 rounded text-xs font-black uppercase ${
                      selectedDispute.status === 'RESOLVED'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : selectedDispute.status === 'ESCALATED'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {selectedDispute.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* Case Summary Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Product & Parties Info */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider text-slate-400">
                    Order Item In Dispute
                  </h3>
                  <div className="flex items-center space-x-3 p-3 bg-slate-950 border border-slate-800 rounded-xl">
                    <img
                      src={selectedDispute.productImage}
                      alt={selectedDispute.productTitle}
                      className="w-14 h-14 rounded-lg object-cover bg-slate-800"
                    />
                    <div>
                      <div className="text-xs font-black text-white">{selectedDispute.productTitle}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Order #{selectedDispute.orderNumber}</div>
                      <div className="text-xs font-black text-emerald-400 mt-1">
                        Claimed: ${selectedDispute.claimedAmount.toFixed(2)} USD
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Category</span>
                      <span className="text-white font-bold">{selectedDispute.category.replace(/_/g, ' ')}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Desired Outcome</span>
                      <span className="text-[#febd69] font-bold">{selectedDispute.desiredOutcome.replace(/_/g, ' ')}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Buyer</span>
                      <span className="text-white font-semibold">{selectedDispute.buyerName}</span>
                      <span className="text-slate-500 block text-[10px]">{selectedDispute.buyerEmail}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Seller Store</span>
                      <span className="text-white font-semibold">{selectedDispute.sellerName}</span>
                    </div>

                    {selectedDispute.trackingNumber && (
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Tracking</span>
                        <span className="text-cyan-400 font-mono">
                          {selectedDispute.carrier}: {selectedDispute.trackingNumber}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Active Proposal Box */}
                  {selectedDispute.proposedResolution && (
                    <div className="p-4 bg-cyan-950/40 border border-cyan-800/60 rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-xs font-black text-cyan-400">
                        <span>Active Resolution Proposal</span>
                        <span className="uppercase text-[10px]">{selectedDispute.proposedResolution.status}</span>
                      </div>
                      <div className="text-xs text-white">
                        Type: <span className="font-bold">{selectedDispute.proposedResolution.type.replace(/_/g, ' ')}</span>
                        {selectedDispute.proposedResolution.amount && (
                          <span className="text-emerald-400 font-bold ml-1">
                            (${selectedDispute.proposedResolution.amount.toFixed(2)})
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-300">"{selectedDispute.proposedResolution.explanation}"</p>
                      {selectedDispute.status === 'RESOLUTION_PROPOSED' && (
                        <div className="pt-2 flex items-center space-x-2">
                          <button
                            onClick={handleAcceptResolution}
                            className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition"
                          >
                            Accept Proposal
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Binding Verdict Box */}
                  {selectedDispute.bindingDecision && (
                    <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-xs font-black text-emerald-400">
                        <span>Arbitrator Binding Ruling</span>
                        <Gavel className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="text-xs text-white font-black">
                        {selectedDispute.bindingDecision.decision.replace(/_/g, ' ')}
                      </div>
                      <p className="text-[11px] text-slate-300">"{selectedDispute.bindingDecision.rationale}"</p>
                    </div>
                  )}
                </div>

                {/* Center & Right: Timeline, Evidence & Actions */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Evidence Vault */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                    <h3 className="text-sm font-black text-white uppercase tracking-wider text-slate-400 flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-[#febd69]" />
                      <span>Case Evidence Vault ({selectedDispute.evidence.length})</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedDispute.evidence.map((ev) => (
                        <div key={ev.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                          <div className="flex items-center justify-between text-xs font-black text-white">
                            <span>{ev.title}</span>
                            <span className="text-[10px] text-slate-500 uppercase">{ev.type}</span>
                          </div>
                          {ev.fileUrl && (
                            <img
                              src={ev.fileUrl}
                              alt={ev.title}
                              className="w-full h-32 object-cover rounded-lg border border-slate-800"
                            />
                          )}
                          {ev.notes && <p className="text-[11px] text-slate-400 italic">"{ev.notes}"</p>}
                          <div className="text-[10px] text-slate-500">
                            Submitted by {ev.uploaderName} ({ev.uploadedBy})
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Message Thread */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                    <h3 className="text-sm font-black text-white uppercase tracking-wider text-slate-400 flex items-center space-x-2">
                      <MessageSquare className="w-4 h-4 text-cyan-400" />
                      <span>Case Communications Thread</span>
                    </h3>
                    <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                      {selectedDispute.messages.map((m) => {
                        const isBuyer = m.senderRole === 'BUYER';
                        const isAdmin = m.senderRole === 'ADMIN';
                        return (
                          <div
                            key={m.id}
                            className={`p-3 rounded-xl text-xs space-y-1 ${
                              isAdmin
                                ? 'bg-amber-950/30 border border-amber-800/40 text-amber-200'
                                : isBuyer
                                ? 'bg-slate-950 border border-slate-800 text-slate-200'
                                : 'bg-slate-800/80 border border-slate-700 text-slate-200'
                            }`}
                          >
                            <div className="flex items-center justify-between font-bold text-[11px]">
                              <span className={isAdmin ? 'text-amber-400' : isBuyer ? 'text-cyan-400' : 'text-emerald-400'}>
                                {m.senderName} ({m.senderRole})
                              </span>
                              <span className="text-slate-500 text-[10px]">
                                {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p>{m.content}</p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Send Message Input */}
                    {selectedDispute.status !== 'RESOLVED' && selectedDispute.status !== 'CLOSED' && (
                      <div className="flex items-center space-x-2 pt-2">
                        <input
                          type="text"
                          value={disputeReplyText}
                          onChange={(e) => setDisputeReplyText(e.target.value)}
                          placeholder="Type response or explanation for the other party..."
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#febd69]"
                          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <button
                          onClick={handleSendMessage}
                          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1"
                        >
                          <Send className="w-3.5 h-3.5 text-[#febd69]" />
                          <span>Reply</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Actions / Propose / Escalate / Arbitrate Workbench */}
                  {selectedDispute.status !== 'RESOLVED' && selectedDispute.status !== 'CLOSED' && (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                      <h3 className="text-sm font-black text-white uppercase tracking-wider text-slate-400">
                        Dispute Actions & Next Step
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Propose Resolution (Seller or Admin) */}
                        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                          <div className="text-xs font-black text-white flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-[#febd69]" />
                            <span>Propose Settlement Offer</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <select
                              value={proposeType}
                              onChange={(e) => setProposeType(e.target.value)}
                              className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                            >
                              <option value="FULL_REFUND">Full Refund</option>
                              <option value="PARTIAL_REFUND">Partial Refund</option>
                              <option value="REPLACEMENT">Ship Replacement</option>
                              <option value="RETURN_REQUIRED">Require Return First</option>
                            </select>
                            <input
                              type="number"
                              value={proposeAmount || selectedDispute.claimedAmount}
                              onChange={(e) => setProposeAmount(Number(e.target.value))}
                              placeholder="Amount ($)"
                              className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                            />
                          </div>
                          <input
                            type="text"
                            value={proposeExplanation}
                            onChange={(e) => setProposeExplanation(e.target.value)}
                            placeholder="Explanation of settlement..."
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                          />
                          <button
                            onClick={handleProposeResolution}
                            className="w-full py-2 bg-[#febd69] hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-black transition"
                          >
                            Submit Settlement Proposal
                          </button>
                        </div>

                        {/* Admin Binding Arbitration OR Escalation */}
                        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                          <div className="text-xs font-black text-white flex items-center space-x-2">
                            <Gavel className="w-4 h-4 text-rose-400" />
                            <span>Platform Arbitrator Ruling</span>
                          </div>
                          <select
                            value={arbitrationDecision}
                            onChange={(e) => setArbitrationDecision(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                          >
                            <option value="REFUND_BUYER_FULL">Grant Full Refund to Buyer</option>
                            <option value="REFUND_BUYER_PARTIAL">Grant 50% Partial Refund</option>
                            <option value="RELEASE_FUNDS_TO_SELLER">Rule in Favor of Seller</option>
                            <option value="DISMISS_CASE">Dismiss Claim as Invalid</option>
                          </select>
                          <input
                            type="text"
                            value={arbitrationRationale}
                            onChange={(e) => setArbitrationRationale(e.target.value)}
                            placeholder="Arbitrator legal finding rationale..."
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                          />
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={handleArbitrate}
                              className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-black transition"
                            >
                              Issue Binding Ruling
                            </button>
                            {!selectedDispute.escalatedToAdmin && (
                              <button
                                onClick={handleEscalateToAdmin}
                                className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-xs font-bold transition"
                                title="Escalate to platform"
                              >
                                Escalate
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: MARKETPLACE REPORTS QUEUE */}
      {/* ========================================================= */}
      {activeSubTab === 'reports' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-white flex items-center space-x-2">
                <FileWarning className="w-5 h-5 text-rose-400" />
                <span>Customer & Seller Incident Reports</span>
              </h2>
              <p className="text-xs text-slate-400">
                Community-submitted safety infractions, counterfeit goods, off-platform payment attempts, and policy violations.
              </p>
            </div>

            <div className="flex items-center space-x-3 text-xs">
              <select
                value={reportStatusFilter}
                onChange={(e) => setReportStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2"
              >
                <option value="all">All Statuses</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="UNDER_INVESTIGATION">Under Investigation</option>
                <option value="ACTION_TAKEN">Action Taken</option>
                <option value="DISMISSED">Dismissed</option>
              </select>

              <select
                value={reportSeverityFilter}
                onChange={(e) => setReportSeverityFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2"
              >
                <option value="all">All Severities</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-black border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Ref Number</th>
                  <th className="py-3 px-4">Target Entity</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Reporter</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Triage Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredReports.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-300">{r.referenceNumber}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white line-clamp-1">{r.targetName}</div>
                      <div className="text-[10px] text-slate-500 uppercase">{r.targetType}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{r.category.replace(/_/g, ' ')}</td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {r.reporterName} ({r.reporterRole})
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          r.severity === 'CRITICAL'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : r.severity === 'HIGH'
                            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {r.severity}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          r.status === 'ACTION_TAKEN'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : r.status === 'UNDER_INVESTIGATION'
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {r.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        {r.status !== 'ACTION_TAKEN' && (
                          <button
                            onClick={() =>
                              handleTriageReport(
                                r.id,
                                'ACTION_TAKEN',
                                'LISTING_REMOVED',
                                'Validated infringement. Action taken.'
                              )
                            }
                            className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-[11px] font-bold transition"
                          >
                            Take Action
                          </button>
                        )}
                        {r.status !== 'DISMISSED' && (
                          <button
                            onClick={() =>
                              handleTriageReport(r.id, 'DISMISSED', 'NO_VIOLATION_FOUND', 'Audited, no violation.')
                            }
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] font-bold transition"
                          >
                            Dismiss
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: AI FRAUD MONITORING & RISK SCORING */}
      {/* ========================================================= */}
      {activeSubTab === 'fraud' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-white flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                  <span>Real-time Fraud & Risk Scoring Stream</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Continuous multi-vector risk engine evaluating country mismatches, high-volume checkout velocity, burner domains, and card testing.
                </p>
              </div>

              <button
                onClick={() => setShowSimulateFraudModal(true)}
                className="px-4 py-2 bg-[#febd69] hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black transition flex items-center space-x-2"
              >
                <Sliders className="w-4 h-4" />
                <span>Simulate Order Risk Evaluation</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {fraudAssessments.map((fa) => (
                <div
                  key={fa.id}
                  className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white">{fa.entityName}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${
                        fa.riskTier === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : fa.riskTier === 'HIGH'
                          ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {fa.riskTier}
                    </span>
                  </div>

                  {/* Score Gauge */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400 font-bold">Threat Score</span>
                      <span className="text-white font-mono font-black">{fa.riskScore} / 100</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          fa.riskScore >= 75 ? 'bg-rose-500' : fa.riskScore >= 50 ? 'bg-orange-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${fa.riskScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Signals List */}
                  <div className="space-y-2 pt-1">
                    <span className="text-[10px] font-black uppercase text-slate-500 block">Identified Signals</span>
                    {fa.signals.map((sig, i) => (
                      <div key={i} className="text-[11px] p-2 bg-slate-900/80 rounded-lg border border-slate-800 space-y-0.5">
                        <div className="text-slate-200 font-bold flex items-center justify-between">
                          <span>{sig.label}</span>
                          <span className="text-[10px] text-amber-400 font-mono">+{sig.scoreContribution}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">{sig.details}</div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400">Action:</span>
                    <span className="font-black text-[#febd69] uppercase">{fa.automatedDecision.replace(/_/g, ' ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: PRODUCT MODERATION & IP PROTECTION */}
      {/* ========================================================= */}
      {activeSubTab === 'moderation' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div>
            <h2 className="text-lg font-black text-white flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Anti-Counterfeit, Trademark IP & Product Moderation Queue</span>
            </h2>
            <p className="text-xs text-slate-400">
              Automated image OCR scanner and brand registry flags for unauthorized replicas, safety violations, and misleading claims.
            </p>
          </div>

          <div className="space-y-4">
            {moderatedListings.map((item) => (
              <div
                key={item.id}
                className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row gap-5 items-start md:items-center justify-between"
              >
                <div className="flex items-start space-x-4">
                  {item.productImage && (
                    <img
                      src={item.productImage}
                      alt={item.productTitle}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-800 bg-slate-900 shrink-0"
                    />
                  )}
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-black text-white">{item.productTitle}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          item.status === 'CLEARED'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : item.status === 'SUPPRESSED'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {item.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400">
                      Seller: <span className="text-slate-300 font-semibold">{item.sellerName}</span> • Violation:{' '}
                      <span className="text-rose-400 font-bold">{item.violationType.replace(/_/g, ' ')}</span> • Flagged
                      by: <span className="text-slate-300">{item.flaggedBy}</span>
                    </div>

                    <p className="text-xs text-slate-300 italic">"{item.evidenceNotes}"</p>

                    {item.appeal && (
                      <div className="mt-2 p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs space-y-1">
                        <span className="text-[10px] font-black uppercase text-amber-400 block">Seller Appeal on Record</span>
                        <p className="text-slate-300">"{item.appeal.sellerStatement}"</p>
                        {item.appeal.status === 'PENDING' && (
                          <div className="flex items-center space-x-2 pt-1">
                            <button
                              onClick={() => handleReviewAppeal(item.id, 'APPROVED')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-bold"
                            >
                              Approve Appeal & Restore
                            </button>
                            <button
                              onClick={() => handleReviewAppeal(item.id, 'REJECTED')}
                              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-[10px] font-bold"
                            >
                              Reject Appeal
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {item.status !== 'CLEARED' && (
                    <button
                      onClick={() => handleListingAction(item.id, 'CLEAR', false)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition"
                    >
                      Clear Listing
                    </button>
                  )}

                  {item.status !== 'SUPPRESSED' && (
                    <button
                      onClick={() => handleListingAction(item.id, 'SUPPRESS', true)}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition"
                    >
                      Suppress & Strike
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 6: SELLER TRUST SCORES & HEALTH LEADERBOARD */}
      {/* ========================================================= */}
      {activeSubTab === 'reputation' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div>
            <h2 className="text-lg font-black text-white flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-emerald-400" />
              <span>Seller Trust Scores & Account Health Leaderboard</span>
            </h2>
            <p className="text-xs text-slate-400">
              Evaluates dispute rates (&lt;1%), fulfillment speed (&gt;98%), cancellation rate, policy strikes, and automated payout escrow holds.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-black border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Merchant Store</th>
                  <th className="py-3 px-4">Trust Score</th>
                  <th className="py-3 px-4">Badge</th>
                  <th className="py-3 px-4">Dispute Rate</th>
                  <th className="py-3 px-4">Fulfillment %</th>
                  <th className="py-3 px-4">Strikes</th>
                  <th className="py-3 px-4">Payout Status</th>
                  <th className="py-3 px-4 text-right">Escrow Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {sellerReputations.map((rep) => (
                  <tr key={rep.merchantId} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-bold text-white flex items-center space-x-3">
                      {rep.logoUrl && (
                        <img
                          src={rep.logoUrl}
                          alt={rep.storeName}
                          className="w-8 h-8 rounded-lg object-cover bg-slate-800"
                        />
                      )}
                      <div>
                        <div>{rep.storeName}</div>
                        <span className="text-[10px] text-slate-500 uppercase">{rep.tier}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-black text-white">{rep.trustScore} / 100</span>
                      </div>
                      <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full rounded-full ${
                            rep.trustScore >= 90
                              ? 'bg-emerald-500'
                              : rep.trustScore >= 75
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${rep.trustScore}%` }}
                        />
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          rep.badge === 'VERIFIED_LEADER'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : rep.badge === 'TRUSTED_MERCHANT'
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                            : rep.badge === 'PROBATION_WARNING'
                            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30 animate-pulse'
                            : rep.badge === 'RESTRICTED'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {rep.badge.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-slate-200">{rep.disputeRatePct}%</td>
                    <td className="py-3.5 px-4 font-mono text-emerald-400">{rep.fulfillmentRatePct}%</td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black ${
                          rep.activeStrikesCount > 0 ? 'bg-rose-500/20 text-rose-400' : 'text-slate-500'
                        }`}
                      >
                        {rep.activeStrikesCount} / 3 Strikes
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          rep.payoutHoldStatus
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {rep.payoutHoldStatus ? 'Frozen' : 'Active'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleToggleHold(rep.merchantId, rep.payoutHoldStatus)}
                        className={`px-3 py-1 rounded text-xs font-bold transition ${
                          rep.payoutHoldStatus
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            : 'bg-rose-600 hover:bg-rose-500 text-white'
                        }`}
                      >
                        {rep.payoutHoldStatus ? 'Release Payouts' : 'Freeze Payouts'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: FILE NEW DISPUTE */}
      {/* ========================================================= */}
      {showNewDisputeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-black text-white flex items-center space-x-2">
                <Scale className="w-5 h-5 text-[#febd69]" />
                <span>Open Order Dispute Case</span>
              </h3>
              <button
                onClick={() => setShowNewDisputeModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateDispute} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Order #</label>
                  <input
                    type="text"
                    value={newOrderNum}
                    onChange={(e) => setNewOrderNum(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1">Product Title</label>
                  <input
                    type="text"
                    value={newProdTitle}
                    onChange={(e) => setNewProdTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Dispute Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  >
                    <option value="DAMAGED_OR_DEFECTIVE">Damaged or Defective</option>
                    <option value="ITEM_NOT_RECEIVED">Item Not Received</option>
                    <option value="SIGNIFICANTLY_NOT_AS_DESCRIBED">Significantly Not as Described</option>
                    <option value="INCORRECT_ITEM">Incorrect Item Shipped</option>
                    <option value="RETURN_REFUND_DISAGREEMENT">Return / Refund Disagreement</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1">Claim Amount ($)</label>
                  <input
                    type="number"
                    value={newAmount}
                    onChange={(e) => setNewAmount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Desired Outcome</label>
                <select
                  value={newOutcome}
                  onChange={(e) => setNewOutcome(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                >
                  <option value="REPLACEMENT">Expedited Replacement</option>
                  <option value="FULL_REFUND">Full 100% Refund</option>
                  <option value="PARTIAL_REFUND">Partial Refund for Flaw</option>
                  <option value="RETURN_FOR_REFUND">Return Item for Refund</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Detailed Description of Problem</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Explain exactly what happened, condition of received packaging, defects observed..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white placeholder-slate-500"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewDisputeModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#febd69] hover:bg-amber-400 text-slate-950 font-black rounded-xl shadow-lg"
                >
                  File Dispute Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: SUBMIT MARKETPLACE REPORT */}
      {/* ========================================================= */}
      {showNewReportModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-black text-white flex items-center space-x-2">
                <FileWarning className="w-5 h-5 text-rose-400" />
                <span>Submit Marketplace Safety Report</span>
              </h3>
              <button
                onClick={() => setShowNewReportModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateReport} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Report Target</label>
                  <select
                    value={newReportTargetType}
                    onChange={(e) => setNewReportTargetType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  >
                    <option value="PRODUCT_LISTING">Product Listing</option>
                    <option value="SELLER">Seller Store</option>
                    <option value="BUYER">Buyer Account</option>
                    <option value="SCAM_SCHEME">Scam / Phishing Scheme</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1">Category</label>
                  <select
                    value={newReportCategory}
                    onChange={(e) => setNewReportCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  >
                    <option value="COUNTERFEIT_OR_REPLICA">Counterfeit / Unauthorized Replica</option>
                    <option value="OFF_PLATFORM_PAYMENT">Off-Platform Payment Solicitation</option>
                    <option value="PROHIBITED_OR_DANGEROUS">Prohibited / Hazardous Item</option>
                    <option value="PRICE_GOUGING">Price Gouging</option>
                    <option value="SUSPECTED_SCAM">Suspected Scam</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Target Name / Item Title</label>
                <input
                  type="text"
                  value={newReportTargetName}
                  onChange={(e) => setNewReportTargetName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Severity</label>
                <select
                  value={newReportSeverity}
                  onChange={(e) => setNewReportSeverity(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                >
                  <option value="CRITICAL">Critical (Immediate harm / major infringement)</option>
                  <option value="HIGH">High Priority</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Infraction Details</label>
                <textarea
                  rows={3}
                  value={newReportDescription}
                  onChange={(e) => setNewReportDescription(e.target.value)}
                  placeholder="Provide concrete details, suspicious URLs, or evidence references..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white placeholder-slate-500"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewReportModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-xl shadow-lg"
                >
                  Submit Incident Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: SIMULATE ORDER RISK ENGINE */}
      {/* ========================================================= */}
      {showSimulateFraudModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-black text-white flex items-center space-x-2">
                <Sliders className="w-5 h-5 text-[#febd69]" />
                <span>Simulate Order Risk Evaluation</span>
              </h3>
              <button
                onClick={() => setShowSimulateFraudModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSimulateFraud} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Order Amount ($)</label>
                  <input
                    type="number"
                    value={simAmount}
                    onChange={(e) => setSimAmount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1">Buyer Email</label>
                  <input
                    type="email"
                    value={simEmail}
                    onChange={(e) => setSimEmail(e.target.value)}
                    placeholder="e.g. test@tempmail.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Billing Country</label>
                  <input
                    type="text"
                    value={simBillCountry}
                    onChange={(e) => setSimBillCountry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white uppercase"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1">Shipping Country</label>
                  <input
                    type="text"
                    value={simShipCountry}
                    onChange={(e) => setSimShipCountry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white uppercase"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1">Line Items Qty</label>
                  <input
                    type="number"
                    value={simItemsCount}
                    onChange={(e) => setSimItemsCount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowSimulateFraudModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#febd69] hover:bg-amber-400 text-slate-950 font-black rounded-xl shadow-lg"
                >
                  Run Risk Evaluation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
