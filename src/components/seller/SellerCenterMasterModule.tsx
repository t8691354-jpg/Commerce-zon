import React, { useState, useEffect, useMemo } from 'react';
import {
  Store,
  ShieldCheck,
  ShieldAlert,
  Package,
  ShoppingCart,
  Users,
  Settings,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RotateCcw,
  Plus,
  Edit,
  Eye,
  Trash2,
  Send,
  Truck,
  ExternalLink,
  Search,
  Filter,
  Download,
  Info,
  DollarSign,
  Building2,
  Calendar,
  Lock,
  ChevronRight,
  Sparkles,
  FileText,
  Printer,
  X,
  RefreshCw,
  BadgeAlert,
  ArrowUpRight,
  Scale,
  Headphones,
} from 'lucide-react';
import {
  SellerApplication,
  SellerApplicationStatus,
  SellerOrderFulfillmentRecord,
  SellerProductCreateRequest,
  SellerStaffMember,
  SellerStaffRole,
  SellerStoreProfile,
} from '../../types/sellerCenter';
import { sellerCenterClient } from '../../services/sellerCenterClient';
import { afterSalesClient } from '../../services/afterSalesClient';
import { supportTicketingClient } from '../../services/supportTicketingClient';
import { ReturnRequest } from '../../types/returns';
import { SupportTicket } from '../../types/support';
import { MOCK_SUPPORT_AGENTS } from '../../data/supportMockData';
import { Merchant, MerchantTier, Product, ProductCategory } from '../../types/domain';
import { SellerAnalyticsDashboard } from './SellerAnalyticsDashboard';
import { SellerDisputesTrustView } from './SellerDisputesTrustView';
import { SellerFulfillmentHubView } from './SellerFulfillmentHubView';
import { SellerReturnConsoleView } from '../returns/SellerReturnConsoleView';
import { TicketManagementView } from '../support/TicketManagementView';
import { TicketWorkflowDetailModal } from '../support/TicketWorkflowDetailModal';

interface SellerCenterMasterModuleProps {
  merchants: Merchant[];
  allProducts: Product[];
  onAddMerchant?: (newMerchant: Merchant) => void;
  onAddProduct?: (newProduct: Product) => void;
}

export type SellerCenterSubTab =
  | 'hub'
  | 'onboarding'
  | 'products'
  | 'orders'
  | 'returns'
  | 'support'
  | 'storefront'
  | 'team'
  | 'analytics'
  | 'plans'
  | 'disputes_trust';

export const SellerCenterMasterModule: React.FC<SellerCenterMasterModuleProps> = ({
  merchants,
  allProducts,
  onAddMerchant,
  onAddProduct,
}) => {
  // Selected Merchant
  const [selectedMerchantId, setSelectedMerchantId] = useState<string>(merchants[0]?.id || 'merch-01');
  const [activeTab, setActiveTab] = useState<SellerCenterSubTab>('hub');

  // Store & Application State
  const [storeProfile, setStoreProfile] = useState<SellerStoreProfile | null>(null);
  const [myApplication, setMyApplication] = useState<SellerApplication | null>(null);
  const [teamMembers, setTeamMembers] = useState<SellerStaffMember[]>([]);
  const [sellerProducts, setSellerProducts] = useState<Product[]>([]);
  const [sellerOrders, setSellerOrders] = useState<any[]>([]);
  const [sellerReturns, setSellerReturns] = useState<ReturnRequest[]>([]);
  const [sellerTickets, setSellerTickets] = useState<SupportTicket[]>([]);
  const [selectedSupportTicket, setSelectedSupportTicket] = useState<SupportTicket | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [showApplyModal, setShowApplyModal] = useState<boolean>(false);
  const [showAddProductModal, setShowAddProductModal] = useState<boolean>(false);
  const [showFulfillModal, setShowFulfillModal] = useState<any | null>(null);
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);
  const [showStorePreviewModal, setShowStorePreviewModal] = useState<boolean>(false);

  // Filters
  const [productFilterStatus, setProductFilterStatus] = useState<string>('all');
  const [productSearch, setProductSearch] = useState<string>('');
  const [orderSearch, setOrderSearch] = useState<string>('');

  // Form states for Add Product
  const [newProdTitle, setNewProdTitle] = useState('');
  const [newProdSku, setNewProdSku] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<ProductCategory>('computing');
  const [newProdPrice, setNewProdPrice] = useState(249.99);
  const [newProdCurrency, setNewProdCurrency] = useState('USD');
  const [newProdStock, setNewProdStock] = useState(50);
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImage, setNewProdImage] = useState('https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80');

  // Form states for Fulfillment
  const [fulfillCarrier, setFulfillCarrier] = useState('FedEx Priority');
  const [fulfillTracking, setFulfillTracking] = useState('');
  const [fulfillNotes, setFulfillNotes] = useState('Packed in anti-static ESD safety box');

  // Form states for Invite Team Member
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<SellerStaffRole>('STORE_MANAGER');

  // Application Revision Form
  const [revisedName, setRevisedName] = useState('');
  const [revisedDesc, setRevisedDesc] = useState('');
  const [revisedPhone, setRevisedPhone] = useState('');
  const [revisedRegNumber, setRevisedRegNumber] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [store, app, team, prods, ords, rets, tcks] = await Promise.all([
        sellerCenterClient.getStoreProfile(selectedMerchantId).catch(() => null),
        sellerCenterClient.getApplicationStatus(sellerCenterClient.getUserId()).catch(() => null),
        sellerCenterClient.getStoreTeam(selectedMerchantId).catch(() => []),
        sellerCenterClient.getSellerProducts(selectedMerchantId).catch(() => []),
        sellerCenterClient.getSellerOrders(selectedMerchantId).catch(() => []),
        afterSalesClient.getSellerReturns(selectedMerchantId).catch(() => []),
        supportTicketingClient.getTickets({ role: 'SELLER', userId: selectedMerchantId }).catch(() => []),
      ]);

      if (store) setStoreProfile(store);
      if (app) setMyApplication(app);
      setTeamMembers(team);
      setSellerProducts(prods);
      setSellerOrders(ords);
      setSellerReturns(rets);
      setSellerTickets(tcks);
    } catch (err) {
      console.error('Failed to load seller center data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedMerchantId]);

  // Selected active merchant object
  const activeMerchantObj = useMemo(() => {
    return (
      merchants.find((m) => m.id === selectedMerchantId) || {
        id: selectedMerchantId,
        name: storeProfile?.name || 'Verified Merchant Store',
        code: storeProfile?.code || 'STORE',
        tier: (storeProfile?.tier || 'flagship') as MerchantTier,
        rating: storeProfile?.rating || 4.9,
        reviewCount: storeProfile?.reviewCount || 120,
        isVerified: storeProfile?.isVerified || true,
        createdAt: storeProfile?.createdAt || new Date().toISOString(),
      }
    );
  }, [selectedMerchantId, merchants, storeProfile]);

  // Handle Add Product Submit
  const handleCreateProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await sellerCenterClient.createProduct(selectedMerchantId, {
        title: newProdTitle,
        sku: newProdSku || `SKU-${Date.now().toString().slice(-6)}`,
        category: newProdCategory,
        price: Number(newProdPrice),
        currency: newProdCurrency,
        totalStock: Number(newProdStock),
        description: newProdDesc,
        images: [newProdImage],
        status: 'SUBMITTED',
      });

      setSellerProducts((prev) => [created, ...prev]);
      if (onAddProduct) onAddProduct(created);
      setShowAddProductModal(false);
      showToast(`Product "${created.title}" submitted for administrative moderation!`);

      // Reset
      setNewProdTitle('');
      setNewProdSku('');
      setNewProdDesc('');
    } catch (err: any) {
      alert(err.message || 'Failed to create product');
    }
  };

  // Handle Fulfill Order Submit
  const handleFulfillSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showFulfillModal) return;
    try {
      const record = await sellerCenterClient.fulfillOrder(selectedMerchantId, showFulfillModal.orderId, {
        carrier: fulfillCarrier,
        trackingNumber: fulfillTracking || `TRK-${Date.now()}`,
        dispatchNotes: fulfillNotes,
      });

      setSellerOrders((prev) =>
        prev.map((o) => (o.orderId === showFulfillModal.orderId ? { ...o, fulfillment: record } : o))
      );
      setShowFulfillModal(null);
      showToast(`Order #${showFulfillModal.orderNumber} dispatched via ${fulfillCarrier}!`);
    } catch (err: any) {
      alert(err.message || 'Failed to dispatch order');
    }
  };

  // Handle Invite Team Member
  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const inv = await sellerCenterClient.inviteTeamMember(selectedMerchantId, {
        email: inviteEmail,
        name: inviteName || inviteEmail.split('@')[0],
        role: inviteRole,
      });

      const updatedTeam = await sellerCenterClient.getStoreTeam(selectedMerchantId);
      setTeamMembers(updatedTeam);
      setShowInviteModal(false);
      setInviteEmail('');
      setInviteName('');
      showToast(`Invitation sent to ${inv.email} as ${inv.role}!`);
    } catch (err: any) {
      alert(err.message || 'Failed to invite team member');
    }
  };

  // Handle Resubmit Application
  const handleResubmitApplication = async () => {
    if (!myApplication) return;
    try {
      const updated = await sellerCenterClient.resubmitApplication(myApplication.id, {
        storeName: revisedName || myApplication.storeName,
        storeDescription: revisedDesc || myApplication.storeDescription,
        business: {
          ...myApplication.business,
          registrationNumber: revisedRegNumber || myApplication.business.registrationNumber,
          businessPhone: revisedPhone || myApplication.business.businessPhone,
        },
      });

      setMyApplication(updated);
      showToast('Application updated & resubmitted for admin review!');
    } catch (err: any) {
      alert(err.message || 'Failed to resubmit application');
    }
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return sellerProducts.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.sku.toLowerCase().includes(productSearch.toLowerCase());
      const matchesStatus =
        productFilterStatus === 'all' ||
        (productFilterStatus === 'approved' && (p.approvalStatus === 'APPROVED' || !p.approvalStatus)) ||
        (productFilterStatus === 'submitted' && (p.approvalStatus === 'SUBMITTED' || p.approvalStatus === 'UNDER_REVIEW')) ||
        (productFilterStatus === 'draft' && p.approvalStatus === 'DRAFT') ||
        (productFilterStatus === 'rejected' && p.approvalStatus === 'REJECTED') ||
        (productFilterStatus === 'low_stock' && p.totalStock <= 10);
      return matchesSearch && matchesStatus;
    });
  }, [sellerProducts, productSearch, productFilterStatus]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return sellerOrders.filter((o) => {
      return (
        o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.customerName.toLowerCase().includes(orderSearch.toLowerCase())
      );
    });
  }, [sellerOrders, orderSearch]);

  const totalSellerGross = useMemo(() => {
    return sellerOrders.reduce((sum, o) => sum + (o.sellerGrossAmount || 0), 0);
  }, [sellerOrders]);

  const totalSellerNet = useMemo(() => {
    return sellerOrders.reduce((sum, o) => sum + (o.sellerNetPayout || 0), 0);
  }, [sellerOrders]);

  const pendingShipmentCount = useMemo(() => {
    return sellerOrders.filter((o) => !o.fulfillment || o.fulfillment.fulfillmentStatus === 'PROCESSING').length;
  }, [sellerOrders]);

  return (
    <div className="space-y-6 font-sans text-slate-100">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 text-xs font-bold border border-emerald-400/40 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Seller Center Header & Store Switcher */}
      <div className="bg-[#131921] border border-[#37475a] rounded-2xl p-5 shadow-2xl flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-black text-[#febd69] uppercase tracking-wider flex items-center gap-1.5">
              <Store className="w-4 h-4 text-[#febd69]" />
              Commerce Zon Seller Central
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400 font-mono">Part 14 Multi-Seller Operations</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-1.5">
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <span>{storeProfile?.name || activeMerchantObj.name}</span>
              {storeProfile?.isVerified && (
                <span title="Verified Brand Partner">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </span>
              )}
            </h1>

            <span className="text-xs font-mono px-2.5 py-0.5 bg-slate-800 border border-slate-700 rounded-lg text-[#febd69] font-bold">
              {storeProfile?.code || activeMerchantObj.code}
            </span>

            <span className="text-xs uppercase px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 font-black rounded-lg">
              {storeProfile?.tier || activeMerchantObj.tier} Tier
            </span>

            {storeProfile?.status === 'SUSPENDED' ? (
              <span className="text-xs uppercase px-2.5 py-0.5 bg-rose-500/20 border border-rose-500/40 text-rose-300 font-black rounded-lg flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                Store Suspended
              </span>
            ) : (
              <span className="text-xs uppercase px-2.5 py-0.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-black rounded-lg flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Store Active
              </span>
            )}
          </div>

          <p className="text-xs text-slate-400 mt-1 flex items-center space-x-2">
            <span>Logged in as Store Owner: <strong className="text-slate-200">{teamMembers[0]?.name || 'General Manager'}</strong></span>
            <span className="text-slate-600">|</span>
            <span>Storefront Visibility: <strong className="text-emerald-400 font-mono uppercase">{storeProfile?.visibility || 'PUBLIC'}</strong></span>
          </p>
        </div>

        {/* Store Context Switcher & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center bg-[#1e293b] border border-slate-800 rounded-xl px-3 py-1.5 text-xs">
            <span className="text-slate-400 font-bold mr-2">Active Store:</span>
            <select
              value={selectedMerchantId}
              onChange={(e) => setSelectedMerchantId(e.target.value)}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
            >
              {merchants.map((m) => (
                <option key={m.id} value={m.id} className="bg-slate-900 text-white">
                  {m.name} ({m.code})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowStorePreviewModal(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 border border-slate-700"
          >
            <Eye className="w-3.5 h-3.5 text-[#febd69]" />
            <span>Storefront Preview</span>
          </button>

          <button
            onClick={() => setShowAddProductModal(true)}
            disabled={storeProfile?.status === 'SUSPENDED'}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs flex items-center space-x-1.5 transition shadow-lg disabled:opacity-40"
          >
            <Plus className="w-4 h-4" />
            <span>List New Product</span>
          </button>
        </div>
      </div>

      {/* Seller Application Status Banner (if user has active application review or changes requested) */}
      {myApplication && myApplication.status !== 'APPROVED' && (
        <div
          className={`border rounded-2xl p-5 shadow-xl space-y-3 ${
            myApplication.status === 'CHANGES_REQUESTED'
              ? 'bg-amber-950/40 border-amber-600/60 text-amber-200'
              : myApplication.status === 'REJECTED'
              ? 'bg-rose-950/40 border-rose-600/60 text-rose-200'
              : 'bg-blue-950/40 border-blue-600/60 text-blue-200'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              {myApplication.status === 'CHANGES_REQUESTED' ? (
                <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
              ) : myApplication.status === 'REJECTED' ? (
                <BadgeAlert className="w-6 h-6 text-rose-400 shrink-0" />
              ) : (
                <Clock className="w-6 h-6 text-blue-400 shrink-0" />
              )}
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <span>Seller Application Status:</span>
                  <span className="font-mono uppercase px-2 py-0.5 rounded bg-black/40 border border-white/20 text-xs">
                    {myApplication.status.replace('_', ' ')}
                  </span>
                </h3>
                <p className="text-xs opacity-90 mt-0.5">
                  Application ID: <span className="font-mono font-bold">{myApplication.id}</span> for store &ldquo;
                  {myApplication.storeName}&rdquo;.
                </p>
              </div>
            </div>

            {myApplication.status === 'CHANGES_REQUESTED' && (
              <button
                onClick={() => setActiveTab('onboarding')}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs transition shrink-0 shadow"
              >
                Revise & Resubmit Application
              </button>
            )}
          </div>

          {myApplication.reviewNotes && (
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-white/10 text-xs space-y-1">
              <strong className="text-white block">Administrative Review Notes:</strong>
              <p className="text-slate-300 leading-relaxed">{myApplication.reviewNotes}</p>
            </div>
          )}

          {myApplication.requestedChanges && myApplication.requestedChanges.length > 0 && (
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-amber-500/30 text-xs space-y-1.5">
              <strong className="text-amber-300 block font-bold">Action Items Required:</strong>
              <ul className="list-disc list-inside space-y-1 text-slate-200">
                {myApplication.requestedChanges.map((change, idx) => (
                  <li key={idx}>{change}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Navigation Sub-Tabs Bar */}
      <div className="bg-[#1e293b] p-1.5 border border-slate-800 rounded-xl flex items-center space-x-1.5 overflow-x-auto text-xs font-bold scrollbar-thin">
        {[
          { id: 'hub', label: 'Operations Hub', icon: BarChart3 },
          { id: 'products', label: `Product Operations (${sellerProducts.length})`, icon: Package },
          { id: 'orders', label: `Shipping & Fulfillment (${sellerOrders.length})`, icon: Truck },
          { id: 'returns', label: `Returns & RMA (${sellerReturns.length})`, icon: RotateCcw },
          { id: 'support', label: `Support Tickets (${sellerTickets.length})`, icon: Headphones },
          { id: 'storefront', label: 'Store Profile & Branding', icon: Store },
          { id: 'team', label: `Staff & Team (${teamMembers.length})`, icon: Users },
          { id: 'onboarding', label: 'Onboarding & Approvals', icon: FileText },
          { id: 'analytics', label: 'Seller Intelligence (Part 13)', icon: Sparkles },
          { id: 'plans', label: 'Plan & Billing ($36/mo)', icon: DollarSign },
          { id: 'disputes_trust', label: 'Disputes & Trust (Part 15)', icon: Scale },
        ].map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition shrink-0 ${
                isActive
                  ? 'bg-[#febd69] text-slate-950 font-black shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <IconComp className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: OPERATIONS HUB */}
      {/* ========================================================================= */}
      {activeTab === 'hub' && (
        <div className="space-y-6">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#131921] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Gross Merchant Sales</span>
                <DollarSign className="w-4 h-4 text-[#febd69]" />
              </div>
              <p className="text-2xl font-black text-white font-mono">
                ${totalSellerGross.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-[11px] text-emerald-400 font-semibold">
                Net Payout: ${totalSellerNet.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (10% Take Deducted)
              </p>
            </div>

            <div className="bg-[#131921] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Orders Awaiting Dispatch</span>
                <Truck className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-2xl font-black text-white font-mono">
                {pendingShipmentCount} <span className="text-sm font-normal text-slate-400 font-sans">orders</span>
              </p>
              <p className="text-[11px] text-blue-400 font-semibold">
                FBA Prime Fulfillment Speed: 24h
              </p>
            </div>

            <div className="bg-[#131921] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Active Listings</span>
                <Package className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-2xl font-black text-white font-mono">
                {sellerProducts.length} <span className="text-sm font-normal text-slate-400 font-sans">SKUs</span>
              </p>
              <p className="text-[11px] text-slate-400 font-mono">
                {sellerProducts.filter((p) => p.totalStock <= 10).length} low-stock alerts
              </p>
            </div>

            <div className="bg-[#131921] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Account Health & Standing</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-black text-emerald-400 font-mono">100 / 100</p>
              <p className="text-[11px] text-emerald-400 font-semibold">
                0 policy flags • 0% cancellation defect
              </p>
            </div>
          </div>

          {/* Quick Action Cards & Operational Checklists */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-[#131921] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-[#febd69]" />
                  <span>Immediate Orders Requiring Shipment</span>
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-[#febd69] hover:underline font-bold"
                >
                  View All Orders →
                </button>
              </div>

              {sellerOrders.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">No orders assigned to your merchant store yet.</div>
              ) : (
                <div className="divide-y divide-slate-800">
                  {sellerOrders.slice(0, 4).map((o) => (
                    <div key={o.orderId} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-mono font-bold text-[#febd69] flex items-center gap-2">
                          <span>{o.orderNumber}</span>
                          <span className="text-slate-400 font-sans font-normal">({o.customerName})</span>
                        </div>
                        <div className="text-slate-400 text-[11px] mt-0.5">
                          {o.merchantItems.length} items • Deliver to {o.customerCity}, {o.customerCountry}
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 shrink-0">
                        <span className="font-mono font-black text-white">${o.sellerGrossAmount.toFixed(2)}</span>
                        {o.fulfillment ? (
                          <span className="px-2.5 py-1 bg-emerald-950/80 text-emerald-400 border border-emerald-800 rounded-lg text-[10px] font-bold">
                            Dispatched ({o.fulfillment.carrier})
                          </span>
                        ) : (
                          <button
                            onClick={() => setShowFulfillModal(o)}
                            className="px-3 py-1.5 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-bold rounded-lg text-xs transition"
                          >
                            Dispatch Order
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Seller Setup & Compliance Checklist */}
            <div className="bg-[#131921] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>Store Setup & Compliance</span>
                  </h3>
                  <p className="text-xs text-slate-400">Essential readiness for high-volume marketplace selling</p>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center space-x-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span className="font-semibold text-white">Business Registration & KYC Verified</span>
                  </div>
                  <div className="flex items-center space-x-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span className="font-semibold text-white">Escrow Payout Wallet Configured</span>
                  </div>
                  <div className="flex items-center space-x-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span className="font-semibold text-white">FBA Prime Logistics Agreement Signed</span>
                  </div>
                  <div className="flex items-center space-x-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span className="font-semibold text-white">Storefront Logo & Return Policies Published</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-[11px] text-slate-400 space-y-1">
                <span className="font-bold text-[#febd69] block">FBA Prime Benefit Active</span>
                <p>Your listings receive Prime 1-2 day delivery badges across regional fulfillment nodes.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PRODUCT OPERATIONS */}
      {/* ========================================================================= */}
      {activeTab === 'products' && (
        <div className="bg-[#131921] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-[#febd69]" />
                <span>Seller Product Catalog & Operations</span>
              </h3>
              <p className="text-xs text-slate-400">
                Manage your listings, inventory counts, draft submissions, and moderation status
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search products or SKU..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#febd69] w-52"
                />
              </div>

              <select
                value={productFilterStatus}
                onChange={(e) => setProductFilterStatus(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#febd69]"
              >
                <option value="all">All Approval Statuses</option>
                <option value="approved">Approved & Live</option>
                <option value="submitted">Under Moderation</option>
                <option value="draft">Drafts</option>
                <option value="rejected">Rejected</option>
                <option value="low_stock">Low Stock (≤10)</option>
              </select>

              <button
                onClick={() => setShowAddProductModal(true)}
                className="px-3.5 py-1.5 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black rounded-xl text-xs flex items-center space-x-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Product</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800 text-[11px]">
                <tr>
                  <th className="py-3 px-3">Product / SKU</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3 text-right">Unit Price</th>
                  <th className="py-3 px-3 text-center">Stock Units</th>
                  <th className="py-3 px-3 text-center">Moderation Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      No products match your filter. Click &ldquo;Add Product&rdquo; to list your first item.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-3">
                        <div className="flex items-center space-x-3">
                          <img
                            src={p.images?.[0] || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=400&q=80'}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover bg-slate-900 border border-slate-800 shrink-0"
                          />
                          <div className="min-w-0 max-w-xs">
                            <div className="font-bold text-white text-xs truncate" title={p.title}>
                              {p.title}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              SKU: <span className="text-[#febd69]">{p.sku}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-slate-300 capitalize">{p.category}</td>

                      <td className="py-3 px-3 text-right font-mono font-bold text-white">
                        {p.price.currency === 'USD' ? '$' : `${p.price.currency || 'USD'} `}{p.price.amount.toFixed(2)}
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                            p.totalStock <= 5
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : p.totalStock <= 15
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}
                        >
                          {p.totalStock} units
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        {p.approvalStatus === 'APPROVED' || !p.approvalStatus ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                            Approved & Live
                          </span>
                        ) : p.approvalStatus === 'SUBMITTED' || p.approvalStatus === 'UNDER_REVIEW' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                            Awaiting Moderation
                          </span>
                        ) : p.approvalStatus === 'REJECTED' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                            Rejected
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                            {p.approvalStatus}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-right space-x-1.5">
                        <button
                          onClick={async () => {
                            const newStock = prompt(`Update stock count for ${p.title}:`, p.totalStock.toString());
                            if (newStock !== null && !isNaN(Number(newStock))) {
                              await sellerCenterClient.updateProduct(selectedMerchantId, p.id, {
                                totalStock: Number(newStock),
                              });
                              setSellerProducts((prev) =>
                                prev.map((item) => (item.id === p.id ? { ...item, totalStock: Number(newStock) } : item))
                              );
                              showToast(`Stock updated to ${newStock} for "${p.title}"!`);
                            }
                          }}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold rounded-lg transition"
                        >
                          Tweak Stock
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: GLOBAL SHIPPING, LOGISTICS & SELLER FULFILLMENT ENGINE (PART 17) */}
      {/* ========================================================================= */}
      {activeTab === 'orders' && (
        <SellerFulfillmentHubView
          sellerId={selectedMerchantId}
          sellerName={storeProfile?.name || activeMerchantObj.name}
          sellerOrders={sellerOrders}
          onOrderUpdated={loadData}
        />
      )}

      {/* ========================================================================= */}
      {/* TAB 4: STOREFRONT & BRANDING */}
      {/* ========================================================================= */}
      {activeTab === 'storefront' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#131921] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Store className="w-5 h-5 text-[#febd69]" />
                  <span>Store Profile & Brand Assets</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Customer-facing storefront identity, description, banners, and verified policies
                </p>
              </div>

              <button
                onClick={() => setShowStorePreviewModal(true)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition flex items-center space-x-1"
              >
                <Eye className="w-3.5 h-3.5 text-[#febd69]" />
                <span>Live Preview</span>
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const updated = await sellerCenterClient.updateStoreProfile(selectedMerchantId, {
                    name: storeProfile?.name,
                    description: storeProfile?.description,
                    logoUrl: storeProfile?.logoUrl,
                    bannerUrl: storeProfile?.bannerUrl,
                    contactEmail: storeProfile?.contactEmail,
                    contactPhone: storeProfile?.contactPhone,
                    policies: storeProfile?.policies,
                    visibility: storeProfile?.visibility,
                  });
                  setStoreProfile(updated);
                  showToast('Store profile & policies saved successfully!');
                } catch (err: any) {
                  alert(err.message || 'Failed to update store');
                }
              }}
              className="space-y-4 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Store Public Name</label>
                  <input
                    type="text"
                    value={storeProfile?.name || ''}
                    onChange={(e) => setStoreProfile(storeProfile ? { ...storeProfile, name: e.target.value } : null)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold focus:outline-none focus:border-[#febd69]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Store Visibility</label>
                  <select
                    value={storeProfile?.visibility || 'PUBLIC'}
                    onChange={(e) =>
                      setStoreProfile(
                        storeProfile ? { ...storeProfile, visibility: e.target.value as any } : null
                      )
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#febd69]"
                  >
                    <option value="PUBLIC">Public & Discoverable</option>
                    <option value="MAINTENANCE">Maintenance Mode</option>
                    <option value="HIDDEN">Hidden / Unlisted</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Store Description</label>
                <textarea
                  rows={3}
                  value={storeProfile?.description || ''}
                  onChange={(e) =>
                    setStoreProfile(storeProfile ? { ...storeProfile, description: e.target.value } : null)
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#febd69]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Logo Image URL</label>
                  <input
                    type="text"
                    value={storeProfile?.logoUrl || ''}
                    onChange={(e) => setStoreProfile(storeProfile ? { ...storeProfile, logoUrl: e.target.value } : null)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono text-[11px] focus:outline-none focus:border-[#febd69]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Banner Image URL</label>
                  <input
                    type="text"
                    value={storeProfile?.bannerUrl || ''}
                    onChange={(e) => setStoreProfile(storeProfile ? { ...storeProfile, bannerUrl: e.target.value } : null)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono text-[11px] focus:outline-none focus:border-[#febd69]"
                  />
                </div>
              </div>

              {/* Policies Editor */}
              <div className="border-t border-slate-800 pt-3 space-y-3">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider text-[#febd69]">
                  Store Fulfillment & Return Policies
                </h4>

                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Shipping Policy</label>
                  <input
                    type="text"
                    value={storeProfile?.policies.shippingPolicy || ''}
                    onChange={(e) =>
                      setStoreProfile(
                        storeProfile
                          ? {
                              ...storeProfile,
                              policies: { ...storeProfile.policies, shippingPolicy: e.target.value },
                            }
                          : null
                      )
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-[#febd69]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Return & Refund Policy</label>
                  <input
                    type="text"
                    value={storeProfile?.policies.returnPolicy || ''}
                    onChange={(e) =>
                      setStoreProfile(
                        storeProfile
                          ? {
                              ...storeProfile,
                              policies: { ...storeProfile.policies, returnPolicy: e.target.value },
                            }
                          : null
                      )
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-[#febd69]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black rounded-xl text-xs transition shadow-lg"
              >
                Save Store Profile Changes
              </button>
            </form>
          </div>

          {/* Storefront Mini Preview Card */}
          <div className="bg-[#131921] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">
              Live Storefront Preview
            </h4>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <img
                src={storeProfile?.bannerUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'}
                alt="Banner"
                className="w-full h-24 object-cover"
              />
              <div className="p-4 relative">
                <img
                  src={storeProfile?.logoUrl || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=200&q=80'}
                  alt="Logo"
                  className="w-14 h-14 rounded-xl object-cover border-2 border-slate-900 -mt-10 bg-slate-950 shadow-md"
                />
                <div className="mt-2">
                  <h4 className="font-black text-white text-sm">{storeProfile?.name}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{storeProfile?.description}</p>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between">
                  <span>Rating: ⭐ {storeProfile?.rating || 4.9}</span>
                  <span className="text-emerald-400 font-bold">FBA Prime Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: TEAM & PERMISSIONS */}
      {/* ========================================================================= */}
      {activeTab === 'team' && (
        <div className="bg-[#131921] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                <span>Store Team Members & Delegated Staff</span>
              </h3>
              <p className="text-xs text-slate-400">
                Grant role-based access for catalog management, fulfillment, and financial reporting
              </p>
            </div>

            <button
              onClick={() => setShowInviteModal(true)}
              className="px-3.5 py-1.5 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black rounded-xl text-xs flex items-center space-x-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Invite Team Member</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800 text-[11px]">
                <tr>
                  <th className="py-3 px-3">Staff Name</th>
                  <th className="py-3 px-3">Email Address</th>
                  <th className="py-3 px-3">Assigned Role</th>
                  <th className="py-3 px-3">Permissions Matrix</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {teamMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3 font-bold text-white">{m.name}</td>
                    <td className="py-3 px-3 text-slate-300 font-mono text-[11px]">{m.email}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-purple-500/10 text-purple-300 border border-purple-500/30">
                        {m.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[10px] text-slate-400 space-x-1.5">
                      {m.permissions.canManageProducts && <span className="text-emerald-400">Products •</span>}
                      {m.permissions.canManageOrders && <span className="text-blue-400">Orders •</span>}
                      {m.permissions.canViewFinancials && <span className="text-amber-400">Financials •</span>}
                      {m.permissions.canManageTeam && <span className="text-purple-400">Team</span>}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          m.status === 'ACTIVE'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {m.role !== 'STORE_OWNER' && (
                        <button
                          onClick={async () => {
                            if (confirm(`Remove staff member ${m.name}?`)) {
                              await sellerCenterClient.removeTeamMember(selectedMerchantId, m.id);
                              setTeamMembers((prev) => prev.filter((item) => item.id !== m.id));
                              showToast(`Removed team member ${m.name}`);
                            }
                          }}
                          className="text-rose-400 hover:text-rose-300 font-bold text-[11px]"
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: ONBOARDING & APPLICATION STATUS */}
      {/* ========================================================================= */}
      {activeTab === 'onboarding' && (
        <div className="bg-[#131921] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#febd69]" />
              <span>Seller Onboarding & KYC Application Lifecycle</span>
            </h3>
            <p className="text-xs text-slate-400">
              Track your seller application status, administrative review decisions, and submit revision packages
            </p>
          </div>

          {myApplication ? (
            <div className="space-y-6">
              {/* Application Details Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 block font-semibold">Store & Entity</span>
                  <p className="font-bold text-white text-sm">{myApplication.storeName}</p>
                  <p className="text-slate-400 font-mono">Slug: {myApplication.storeSlug}</p>
                  <p className="text-amber-400 font-bold">{myApplication.plan} Plan</p>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 block font-semibold">Business Registration</span>
                  <p className="font-bold text-white">{myApplication.business.businessName}</p>
                  <p className="text-slate-400 font-mono">Reg #: {myApplication.business.registrationNumber}</p>
                  <p className="text-slate-400 font-mono">Tax / VAT: {myApplication.business.taxIdVat}</p>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 block font-semibold">Current Review Decision</span>
                  <p className="font-bold text-emerald-400 uppercase text-sm">{myApplication.status}</p>
                  <p className="text-slate-400">Submitted: {new Date(myApplication.submittedAt).toLocaleDateString()}</p>
                  {myApplication.reviewedByAdminName && (
                    <p className="text-slate-400 font-mono">Reviewed by: {myApplication.reviewedByAdminName}</p>
                  )}
                </div>
              </div>

              {/* Status History Audit Trail */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Application Review History
                </h4>
                <div className="border border-slate-800 rounded-xl divide-y divide-slate-800/80 bg-slate-900/60">
                  {myApplication.history.map((entry) => (
                    <div key={entry.id} className="p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-[#febd69]">
                            {entry.fromStatus} → {entry.toStatus}
                          </span>
                          {entry.adminName && (
                            <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded font-mono">
                              By: {entry.adminName}
                            </span>
                          )}
                        </div>
                        <p className="text-slate-300">{entry.reason}</p>
                      </div>
                      <span className="text-slate-500 font-mono text-[11px] shrink-0">
                        {new Date(entry.timestamp).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Revision Form if Changes Requested */}
              {myApplication.status === 'CHANGES_REQUESTED' && (
                <div className="bg-amber-950/20 border border-amber-600/40 rounded-2xl p-5 space-y-4">
                  <h4 className="font-bold text-amber-300 text-sm flex items-center gap-2">
                    <Edit className="w-4 h-4 text-amber-400" />
                    <span>Submit Application Revisions</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold">Store Name</label>
                      <input
                        type="text"
                        defaultValue={myApplication.storeName}
                        onChange={(e) => setRevisedName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold">Business Phone</label>
                      <input
                        type="text"
                        defaultValue={myApplication.business.businessPhone}
                        onChange={(e) => setRevisedPhone(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-slate-300 font-bold">Business Registration / Safety Cert #</label>
                      <input
                        type="text"
                        defaultValue={myApplication.business.registrationNumber}
                        onChange={(e) => setRevisedRegNumber(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-slate-300 font-bold">Store Description & Guidelines</label>
                      <textarea
                        rows={2}
                        defaultValue={myApplication.storeDescription}
                        onChange={(e) => setRevisedDesc(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleResubmitApplication}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs transition shadow-lg"
                  >
                    Resubmit Revisions For Review
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center space-y-3">
              <Store className="w-12 h-12 text-[#febd69] mx-auto opacity-70" />
              <h4 className="text-sm font-bold text-white">No Application on File</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Ready to sell your enterprise hardware, software, or components on Commerce Zon? Submit a seller application to get started.
              </p>
              <button
                onClick={() => setShowApplyModal(true)}
                className="px-5 py-2.5 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black rounded-xl text-xs transition"
              >
                Apply as Commerce Zon Merchant
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: SELLER INTELLIGENCE (EMBEDDED PART 13 DASHBOARD) */}
      {/* ========================================================================= */}
      {activeTab === 'analytics' && (
        <SellerAnalyticsDashboard
          activeMerchant={activeMerchantObj}
          allMerchants={merchants}
          onSelectMerchant={setSelectedMerchantId}
          onNavigateToListings={() => setActiveTab('products')}
          onNavigateToOrders={() => setActiveTab('orders')}
        />
      )}

      {/* ========================================================================= */}
      {/* TAB 8: PLANS & BILLING */}
      {/* ========================================================================= */}
      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#131921] border border-amber-500/40 rounded-2xl p-6 shadow-2xl space-y-4 relative overflow-hidden">
            <span className="absolute top-4 right-4 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-[10px] font-black uppercase">
              Current Active Plan
            </span>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-white">Professional Seller Plan</h3>
              <p className="text-2xl font-black text-[#febd69] font-mono">
                $36.00 <span className="text-xs text-slate-400 font-sans font-normal">/ month</span>
              </p>
            </div>
            <ul className="text-xs space-y-2 text-slate-300 pt-2 border-t border-slate-800">
              <li className="flex items-center gap-2">✓ Unlimited catalog listing capacity</li>
              <li className="flex items-center gap-2">✓ $0.00 per-item closing fees (standard commission only)</li>
              <li className="flex items-center gap-2">✓ Multi-user staff role delegation & permission matrix</li>
              <li className="flex items-center gap-2">✓ Part 13 Seller Intelligence & conversion funnels</li>
              <li className="flex items-center gap-2">✓ Prime 24h FBA warehouse distribution network</li>
            </ul>
          </div>

          <div className="bg-[#131921] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg font-black text-white">Individual Seller Plan</h3>
              <p className="text-2xl font-black text-slate-300 font-mono">
                $0.99 <span className="text-xs text-slate-400 font-sans font-normal">/ item sold</span>
              </p>
            </div>
            <ul className="text-xs space-y-2 text-slate-400 pt-2 border-t border-slate-800">
              <li className="flex items-center gap-2">✓ Pay as you sell (no monthly subscription)</li>
              <li className="flex items-center gap-2">✓ Max 40 active product listings</li>
              <li className="flex items-center gap-2">✓ Basic order fulfillment and packing slips</li>
              <li className="flex items-center gap-2">✓ Standard customer reviews & support</li>
            </ul>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 9: DISPUTES, ARBITRATION & TRUST STANDING (PART 15) */}
      {/* ========================================================================= */}
      {activeTab === 'disputes_trust' && (
        <SellerDisputesTrustView
          merchantId={selectedMerchantId}
          merchantName={activeMerchantObj.name}
        />
      )}

      {/* ========================================================================= */}
      {/* TAB 10: SELLER RETURN CONSOLE & RMA MANAGEMENT (PART 18) */}
      {/* ========================================================================= */}
      {activeTab === 'returns' && (
        <div className="space-y-4">
          <SellerReturnConsoleView
            returnRequests={sellerReturns}
            onApproveBySeller={async (returnId) => {
              try {
                await afterSalesClient.sellerApproveReturn(returnId, {
                  sellerId: selectedMerchantId,
                  returnAddress: 'Merchant Warehouse Fulfillment Hub, Bay 4',
                  instructions: 'Please securely box item with original RMA label attached.',
                });
                showToast(`Return ${returnId} approved successfully.`);
                const updated = await afterSalesClient.getSellerReturns(selectedMerchantId);
                setSellerReturns(updated);
              } catch (err: any) {
                showToast(err.message || 'Failed to approve return');
              }
            }}
            onRejectBySeller={async (returnId, reason) => {
              try {
                await afterSalesClient.sellerRejectReturn(returnId, {
                  sellerId: selectedMerchantId,
                  reason,
                });
                showToast(`Return ${returnId} rejected.`);
                const updated = await afterSalesClient.getSellerReturns(selectedMerchantId);
                setSellerReturns(updated);
              } catch (err: any) {
                showToast(err.message || 'Failed to reject return');
              }
            }}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 11: SELLER SUPPORT DESK & TICKETS (PART 19) */}
      {/* ========================================================================= */}
      {activeTab === 'support' && (
        <div className="space-y-4">
          <TicketManagementView
            tickets={sellerTickets}
            onCreateTicket={async (newTicket) => {
              try {
                await supportTicketingClient.createTicket({
                  userRole: 'SELLER',
                  userId: selectedMerchantId,
                  userName: activeMerchantObj.name,
                  userEmail: `${selectedMerchantId}@merchants.commercezon.com`,
                  category: newTicket.category,
                  priority: newTicket.priority,
                  subject: newTicket.subject,
                  description: newTicket.description,
                  orderId: newTicket.orderId,
                  attachments: newTicket.attachments,
                });
                showToast('Seller support ticket submitted to enterprise queue.');
                const updated = await supportTicketingClient.getTickets({
                  role: 'SELLER',
                  userId: selectedMerchantId,
                });
                setSellerTickets(updated);
              } catch (err: any) {
                showToast(err.message || 'Failed to submit support ticket');
              }
            }}
            onSelectTicketDetail={(ticket) => setSelectedSupportTicket(ticket)}
          />

          {selectedSupportTicket && (
            <TicketWorkflowDetailModal
              ticket={selectedSupportTicket}
              agents={MOCK_SUPPORT_AGENTS}
              onClose={() => setSelectedSupportTicket(null)}
              onUpdateStatus={async (ticketId, status) => {
                await supportTicketingClient.updateTicketStatus(ticketId, status, selectedMerchantId);
                const updated = await supportTicketingClient.getTickets({
                  role: 'SELLER',
                  userId: selectedMerchantId,
                });
                setSellerTickets(updated);
                setSelectedSupportTicket(null);
                showToast(`Ticket status updated to ${status}`);
              }}
              onAssignAgent={async (ticketId, agentId, agentName) => {
                await supportTicketingClient.assignAgent(ticketId, agentId, agentName, selectedMerchantId);
                const updated = await supportTicketingClient.getTickets({
                  role: 'SELLER',
                  userId: selectedMerchantId,
                });
                setSellerTickets(updated);
                showToast(`Assigned to agent ${agentName}`);
              }}
              onAddMessage={async (ticketId, msg) => {
                await supportTicketingClient.addMessage(ticketId, {
                  senderRole: 'SELLER',
                  senderName: activeMerchantObj.name,
                  senderId: selectedMerchantId,
                  message: msg,
                  isInternalNote: false,
                });
                const updatedTicket = await supportTicketingClient.getTicketDetails(
                  ticketId,
                  selectedMerchantId,
                  'SELLER'
                );
                setSelectedSupportTicket(updatedTicket);
                const updated = await supportTicketingClient.getTickets({
                  role: 'SELLER',
                  userId: selectedMerchantId,
                });
                setSellerTickets(updated);
              }}
            />
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD PRODUCT */}
      {/* ========================================================================= */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#febd69]" />
                <span>List New Product for Moderation</span>
              </h3>
              <button onClick={() => setShowAddProductModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProductSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UltraPrecision Laser Sensor Unit X4"
                  value={newProdTitle}
                  onChange={(e) => setNewProdTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#febd69]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">SKU Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SKU-SENS-09"
                    value={newProdSku}
                    onChange={(e) => setNewProdSku(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-[#febd69]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Department / Category</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#febd69]"
                  >
                    <option value="computing">Computing</option>
                    <option value="robotics">Robotics</option>
                    <option value="industrial">Industrial</option>
                    <option value="electronics">Electronics</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-300">Listing Price *</label>
                    <span className="text-[10px] text-slate-400">Seller Currency</span>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={newProdCurrency}
                      onChange={(e) => setNewProdCurrency(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-[#febd69] font-mono font-bold focus:outline-none focus:border-[#febd69]"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="PKR">PKR (Rs)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="AED">AED (د.إ)</option>
                      <option value="SAR">SAR (ر.س)</option>
                      <option value="CAD">CAD (C$)</option>
                      <option value="AUD">AUD (A$)</option>
                    </select>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      required
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(Number(e.target.value))}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-mono font-bold focus:outline-none focus:border-[#febd69]"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Initial Stock Units *</label>
                  <input
                    type="number"
                    required
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-[#febd69]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Product Image URL</label>
                <input
                  type="text"
                  value={newProdImage}
                  onChange={(e) => setNewProdImage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono text-[11px] focus:outline-none focus:border-[#febd69]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Technical Description</label>
                <textarea
                  rows={3}
                  placeholder="Key features, specifications, and warranty information..."
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#febd69]"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black rounded-xl transition"
                >
                  Submit for Moderation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DISPATCH & FULFILL ORDER */}
      {/* ========================================================================= */}
      {showFulfillModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-400" />
                <span>Dispatch Order #{showFulfillModal.orderNumber}</span>
              </h3>
              <button onClick={() => setShowFulfillModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
              <span className="text-slate-400 font-semibold">Recipient:</span>
              <p className="font-bold text-white">{showFulfillModal.customerName}</p>
              <p className="text-slate-400">
                Destination: {showFulfillModal.customerCity}, {showFulfillModal.customerCountry}
              </p>
            </div>

            <form onSubmit={handleFulfillSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Fulfillment Courier *</label>
                <select
                  value={fulfillCarrier}
                  onChange={(e) => setFulfillCarrier(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#febd69]"
                >
                  <option value="FedEx Priority">FedEx Priority (Insured)</option>
                  <option value="UPS Worldwide Express">UPS Worldwide Express</option>
                  <option value="DHL Express Global">DHL Express Global</option>
                  <option value="Commerce Zon FBA Prime">Commerce Zon FBA Prime Dedicated</option>
                  <option value="USPS Commercial Plus">USPS Commercial Plus</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Carrier Tracking Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 794918239012"
                  value={fulfillTracking}
                  onChange={(e) => setFulfillTracking(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-[#febd69]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Packing & Handling Notes</label>
                <textarea
                  rows={2}
                  value={fulfillNotes}
                  onChange={(e) => setFulfillNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#febd69]"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowFulfillModal(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl transition"
                >
                  Confirm Dispatch & Notify Buyer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: INVITE TEAM MEMBER */}
      {/* ========================================================================= */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                <span>Invite Team Member</span>
              </h3>
              <button onClick={() => setShowInviteModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Staff Member Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Johnson"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#febd69]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Staff Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="staff@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-[#febd69]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Assigned Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#febd69]"
                >
                  <option value="STORE_MANAGER">Store Manager (Products, Orders, Settings)</option>
                  <option value="PRODUCT_MANAGER">Product Manager (Catalog & Inventory)</option>
                  <option value="ORDER_MANAGER">Order Manager (Fulfillment & Shipping)</option>
                  <option value="SUPPORT_STAFF">Customer Support Staff (Read Orders)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black rounded-xl transition"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: LIVE STOREFRONT PREVIEW */}
      {/* ========================================================================= */}
      {showStorePreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Store className="w-5 h-5 text-[#febd69]" />
                <h3 className="text-base font-bold text-white">Public Customer Storefront Preview</h3>
              </div>
              <button onClick={() => setShowStorePreviewModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900">
              <img
                src={storeProfile?.bannerUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80'}
                alt="Banner"
                className="w-full h-40 object-cover"
              />
              <div className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-16 mb-4">
                  <img
                    src={storeProfile?.logoUrl || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=200&q=80'}
                    alt="Logo"
                    className="w-20 h-20 rounded-2xl object-cover border-4 border-slate-900 bg-slate-950 shadow-xl"
                  />
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full text-xs font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified Brand Partner
                    </span>
                    <span className="px-3 py-1 bg-[#febd69]/10 border border-[#febd69]/30 text-[#febd69] rounded-full text-xs font-bold">
                      ⭐ 4.9 (1.2k+ reviews)
                    </span>
                  </div>
                </div>

                <h2 className="text-xl font-black text-white">{storeProfile?.name}</h2>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl">{storeProfile?.description}</p>

                <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-400">Shipping Terms:</span>
                    <p className="text-slate-300">{storeProfile?.policies.shippingPolicy}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-slate-400">Return & Warranty:</span>
                    <p className="text-slate-300">{storeProfile?.policies.returnPolicy}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
