import React, { useState } from 'react';
import {
  ComprehensiveMasterOrder,
  OrderLifecycleStatus,
  ReturnRequestRecord,
  ExchangeRequestRecord,
  RefundRecord,
  SellerSettlementRecord,
  OrderFraudScan,
  UserRole,
} from '../../types/oms';
import {
  MOCK_OMS_ORDERS,
  MOCK_RETURNS_DATA,
  MOCK_EXCHANGES_DATA,
  MOCK_REFUNDS_DATA,
  MOCK_SETTLEMENTS_DATA,
} from '../../data/omsMockData';
import { OrderDashboardAnalyticsView } from './OrderDashboardAnalyticsView';
import { OrderLifecycleWorkflowView } from './OrderLifecycleWorkflowView';
import { MultiVendorOrderSplittingView } from './MultiVendorOrderSplittingView';
import { SellerOrderProcessingView } from './SellerOrderProcessingView';
import { CustomerOrderManagementPortal } from './CustomerOrderManagementPortal';
import { ShipmentTrackingEngineView } from './ShipmentTrackingEngineView';
import { ReturnsAndExchangesHub } from './ReturnsAndExchangesHub';
import { RefundsAndSettlementsView } from './RefundsAndSettlementsView';
import { InvoiceAndDocumentsEngine } from './InvoiceAndDocumentsEngine';
import { OrderFraudDetectionShieldView } from './OrderFraudDetectionShieldView';
import { OrderReportsAndAnalyticsView } from './OrderReportsAndAnalyticsView';
import { OrderDetailsModal } from './OrderDetailsModal';
import {
  ShoppingBag,
  BarChart3,
  Clock,
  Split,
  Building2,
  User,
  Truck,
  RotateCcw,
  DollarSign,
  FileText,
  ShieldAlert,
  FileSpreadsheet,
  Bell,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export type OMSSubTab =
  | 'DASHBOARD'
  | 'LIFECYCLE_WORKFLOW'
  | 'MULTI_VENDOR_SPLIT'
  | 'SELLER_HUB'
  | 'CUSTOMER_PORTAL'
  | 'SHIPMENT_TRACKING'
  | 'RETURNS_EXCHANGES'
  | 'REFUNDS_SETTLEMENTS'
  | 'INVOICES_DOCS'
  | 'FRAUD_SHIELD'
  | 'REPORTS';

export const OrderManagementMasterModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<OMSSubTab>('DASHBOARD');
  const [userRole, setUserRole] = useState<UserRole>('ADMIN');

  // Master State Management
  const [orders, setOrders] = useState<ComprehensiveMasterOrder[]>(MOCK_OMS_ORDERS);
  const [returns, setReturns] = useState<ReturnRequestRecord[]>(MOCK_RETURNS_DATA);
  const [exchanges, setExchanges] = useState<ExchangeRequestRecord[]>(MOCK_EXCHANGES_DATA);
  const [refunds, setRefunds] = useState<RefundRecord[]>(MOCK_REFUNDS_DATA);
  const [settlements, setSettlements] = useState<SellerSettlementRecord[]>(MOCK_SETTLEMENTS_DATA);
  const [fraudScans, setFraudScans] = useState<OrderFraudScan[]>([
    {
      id: 'fr-1005',
      orderId: 'ord-1005',
      customerEmail: 'temp8812@disposable-mail.net',
      riskScore: 89,
      riskLevel: 'CRITICAL',
      isFlagged: true,
      reasons: [
        'Disposable email domain detected',
        'Billing/shipping address country mismatch (KY vs US)',
        'Known freight forwarder address',
        'High value first-time order ($31,669.88)',
      ],
      status: 'UNDER_REVIEW',
      flaggedAt: '2026-07-27T08:10:00Z',
    },
  ]);

  // Selected order for modal details or tracking
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<ComprehensiveMasterOrder | null>(null);
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<ComprehensiveMasterOrder | null>(orders[0]);

  // Handler: Update Order Status
  const handleUpdateOrderStatus = (
    orderId: string,
    newStatus: OrderLifecycleStatus,
    actorName: string,
    note: string
  ) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const newTimelineEvent = {
            id: `tl-${Date.now()}`,
            orderId,
            status: newStatus,
            actorRole: userRole,
            actorName: actorName || 'OMS Controller',
            note,
            timestamp: new Date().toISOString(),
          };

          return {
            ...ord,
            status: newStatus,
            updatedAt: new Date().toISOString(),
            timeline: [newTimelineEvent, ...ord.timeline],
          };
        }
        return ord;
      })
    );
  };

  // Handler: Initiate Return
  const handleInitiateReturn = (
    orderId: string,
    reason: string,
    comment: string,
    mediaUrls: string[]
  ) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    const newReturn: ReturnRequestRecord = {
      id: `ret-${Date.now()}`,
      orderId,
      customerId: targetOrder.customerId,
      customerName: targetOrder.customerName,
      customerEmail: targetOrder.customerEmail,
      productId: targetOrder.items[0]?.productId || 'prod-01',
      productTitle: targetOrder.items[0]?.productTitle || 'Product Item',
      reason,
      comment,
      mediaUrls,
      refundMethod: 'WALLET',
      status: 'REQUESTED',
      requestedAt: new Date().toISOString(),
      refundAmount: targetOrder.grandTotal,
    };

    setReturns((prev) => [newReturn, ...prev]);
    handleUpdateOrderStatus(orderId, 'RETURN_REQUESTED', targetOrder.customerName, `Return requested: ${reason}`);
  };

  // Handler: Initiate Exchange
  const handleInitiateExchange = (orderId: string, reason: string, comment: string) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    const newExchange: ExchangeRequestRecord = {
      id: `exc-${Date.now()}`,
      orderId,
      customerId: targetOrder.customerId,
      customerName: targetOrder.customerName,
      productId: targetOrder.items[0]?.productId || 'prod-01',
      originalSku: targetOrder.items[0]?.sku || 'SKU-ORIGINAL',
      requestedSku: 'SKU-REPLACEMENT-VAR',
      requestedVariantName: 'Replacement Variant (Auto-Assigned)',
      reason: reason as any,
      comment,
      status: 'REQUESTED',
      requestedAt: new Date().toISOString(),
    };

    setExchanges((prev) => [newExchange, ...prev]);
    handleUpdateOrderStatus(orderId, 'EXCHANGE_REQUESTED', targetOrder.customerName, `Exchange requested: ${reason}`);
  };

  // Handler: Cancel Order
  const handleCancelOrder = (orderId: string) => {
    handleUpdateOrderStatus(orderId, 'CANCELLED', 'Customer/System', 'Order cancelled by user request');
  };

  // Handler: Reorder
  const handleReorder = (order: ComprehensiveMasterOrder) => {
    const newOrderId = `ord-${Date.now()}`;
    const newMasterOrder: ComprehensiveMasterOrder = {
      ...order,
      id: newOrderId,
      orderNumber: `ORD-2026-07-${Math.floor(1000 + Math.random() * 9000)}`,
      invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      trackingNumber: `TRK-AMZ-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'ORDER_CONFIRMED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        {
          id: `tl-${Date.now()}`,
          orderId: newOrderId,
          status: 'ORDER_CONFIRMED',
          actorRole: 'BUYER',
          actorName: order.customerName,
          note: 'Reorder placed via 1-Click Commerce Zon Checkout',
          timestamp: new Date().toISOString(),
        },
      ],
    };

    setOrders((prev) => [newMasterOrder, ...prev]);
  };

  // Handler: Process Return Refund
  const handleProcessRefund = (returnId: string) => {
    setReturns((prev) =>
      prev.map((r) => (r.id === returnId ? { ...r, status: 'REFUNDED', completedAt: new Date().toISOString() } : r))
    );

    const retObj = returns.find((r) => r.id === returnId);
    if (retObj) {
      const newRefundRecord: RefundRecord = {
        id: `ref-${Date.now()}`,
        orderId: retObj.orderId,
        customerId: retObj.customerId,
        sellerId: 'merch-02',
        refundType: 'WALLET',
        amount: retObj.refundAmount,
        reason: retObj.reason,
        status: 'PROCESSED',
        buyerWalletCredited: true,
        sellerWalletDebited: true,
        marketplaceFeeAdjusted: true,
        processedAt: new Date().toISOString(),
      };

      setRefunds((prev) => [newRefundRecord, ...prev]);
      handleUpdateOrderStatus(retObj.orderId, 'REFUNDED', 'Commerce Zon Refund Engine', 'Instant wallet refund processed');
    }
  };

  // Handler: Clear Fraud Flag
  const handleClearFraudFlag = (scanId: string) => {
    setFraudScans((prev) => prev.filter((s) => s.id !== scanId));
  };

  // Handler: Cancel Fraudulent Order
  const handleCancelFraudOrder = (scanId: string) => {
    const scan = fraudScans.find((s) => s.id === scanId);
    if (scan) {
      handleCancelOrder(scan.orderId);
      handleClearFraudFlag(scanId);
    }
  };

  return (
    <div className="space-y-6 font-sans text-slate-100 max-w-7xl mx-auto pb-12">
      {/* Top Header & Navigation Bar */}
      <div className="bg-[#131921] border border-[#37475a] rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-widest">
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>MODULE 9 • ENTERPRISE ORDER MANAGEMENT SYSTEM (OMS)</span>
            </div>
            <h1 className="text-2xl font-black text-white mt-1">Commerce Zon-Class Order Control Hub</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Multi-vendor order splitting, 14-stage state machine, live shipment radar, RMA portal & financial settlements
            </p>
          </div>

          {/* Role Switcher */}
          <div className="flex items-center space-x-2 bg-[#232f3e] p-2 rounded-xl border border-[#37475a]">
            <span className="text-xs text-slate-400 font-bold">Simulated Persona Role:</span>
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value as UserRole)}
              className="bg-[#131921] text-[#febd69] font-mono text-xs font-black p-2 rounded-lg border border-[#37475a] focus:outline-none"
            >
              <option value="ADMIN">Super Admin OMS Controller</option>
              <option value="SELLER">Merchant Vendor Seller Hub</option>
              <option value="BUYER">Customer Prime Account</option>
              <option value="LOGISTICS_AGENT">Logistics & Warehouse Courier</option>
            </select>
          </div>
        </div>

        {/* Sub-Tab Navigation Bar */}
        <div className="flex items-center space-x-1 overflow-x-auto pt-2 border-t border-[#37475a] text-xs">
          {[
            { id: 'DASHBOARD', label: '1. Analytics Dashboard', icon: BarChart3 },
            { id: 'LIFECYCLE_WORKFLOW', label: '2. 14-Stage Workflow', icon: Clock },
            { id: 'MULTI_VENDOR_SPLIT', label: '3. Multi-Vendor Splitter', icon: Split },
            { id: 'SELLER_HUB', label: '4. Seller Dispatch Hub', icon: Building2 },
            { id: 'CUSTOMER_PORTAL', label: '5. Customer Orders & Reorder', icon: User },
            { id: 'SHIPMENT_TRACKING', label: '6. Live Shipment Radar', icon: Truck },
            { id: 'RETURNS_EXCHANGES', label: '7. Returns & RMA Portal', icon: RotateCcw },
            { id: 'REFUNDS_SETTLEMENTS', label: '8. Financial Ledger & Payouts', icon: DollarSign },
            { id: 'INVOICES_DOCS', label: '9. Tax Invoices & Slips', icon: FileText },
            { id: 'FRAUD_SHIELD', label: '10. AI Fraud Sentinel', icon: ShieldAlert },
            { id: 'REPORTS', label: '11. Compliance Reports', icon: FileSpreadsheet },
          ].map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as OMSSubTab)}
                className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center space-x-1.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-[#febd69] text-slate-950 shadow-lg font-black'
                    : 'bg-[#232f3e] text-slate-300 hover:text-white border border-[#37475a]'
                }`}
              >
                <IconComponent className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Content View */}
      <div className="transition-all duration-300">
        {activeTab === 'DASHBOARD' && <OrderDashboardAnalyticsView orders={orders} />}

        {activeTab === 'LIFECYCLE_WORKFLOW' && (
          <OrderLifecycleWorkflowView orders={orders} onUpdateOrderStatus={handleUpdateOrderStatus} />
        )}

        {activeTab === 'MULTI_VENDOR_SPLIT' && <MultiVendorOrderSplittingView orders={orders} />}

        {activeTab === 'SELLER_HUB' && (
          <SellerOrderProcessingView
            orders={orders}
            onUpdateStatus={(id, status, note) => handleUpdateOrderStatus(id, status, 'Seller Hub', note)}
            onPrintInvoice={(o) => setSelectedOrderForModal(o)}
          />
        )}

        {activeTab === 'CUSTOMER_PORTAL' && (
          <CustomerOrderManagementPortal
            orders={orders}
            onViewOrderDetails={(o) => setSelectedOrderForModal(o)}
            onTrackShipment={(o) => {
              setSelectedOrderForTracking(o);
              setActiveTab('SHIPMENT_TRACKING');
            }}
            onInitiateReturn={handleInitiateReturn}
            onInitiateExchange={handleInitiateExchange}
            onCancelOrder={handleCancelOrder}
            onReorder={handleReorder}
          />
        )}

        {activeTab === 'SHIPMENT_TRACKING' && (
          <ShipmentTrackingEngineView order={selectedOrderForTracking || orders[0]} />
        )}

        {activeTab === 'RETURNS_EXCHANGES' && (
          <ReturnsAndExchangesHub
            returns={returns}
            exchanges={exchanges}
            onApproveReturn={(id) =>
              setReturns((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'APPROVED' } : r)))
            }
            onRejectReturn={(id) =>
              setReturns((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'REJECTED' } : r)))
            }
            onInspectWarehouse={(id, note) =>
              setReturns((prev) =>
                prev.map((r) => (r.id === id ? { ...r, status: 'INSPECTED', warehouseInspectionNote: note } : r))
              )
            }
            onProcessRefund={handleProcessRefund}
          />
        )}

        {activeTab === 'REFUNDS_SETTLEMENTS' && (
          <RefundsAndSettlementsView
            refunds={refunds}
            settlements={settlements}
            onTriggerSettlement={(id) =>
              setSettlements((prev) =>
                prev.map((s) => (s.id === id ? { ...s, status: 'SETTLED', settledAt: new Date().toISOString() } : s))
              )
            }
          />
        )}

        {activeTab === 'INVOICES_DOCS' && <InvoiceAndDocumentsEngine orders={orders} />}

        {activeTab === 'FRAUD_SHIELD' && (
          <OrderFraudDetectionShieldView
            fraudScans={fraudScans}
            onClearFlag={handleClearFraudFlag}
            onCancelFraudOrder={handleCancelFraudOrder}
          />
        )}

        {activeTab === 'REPORTS' && <OrderReportsAndAnalyticsView orders={orders} />}
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrderForModal}
        isOpen={!!selectedOrderForModal}
        onClose={() => setSelectedOrderForModal(null)}
        onPrintInvoice={(o) => {
          setSelectedOrderForModal(null);
          setActiveTab('INVOICES_DOCS');
        }}
      />
    </div>
  );
};
