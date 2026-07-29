import React, { useState } from 'react';
import {
  FBAWarehouse,
  FBAInventoryItem,
  FBAInboundShipment,
  FBAInventoryTransfer,
  FBAPickingTask,
  FBAPackingTask,
  FBACustomerOrder,
  FBAFeeRecord,
  FBAReturnRecord,
  FBAAuditRecord,
  FBAStaffMember,
  FBANotification,
  FBAEnrollmentRequest,
  FBAOrderStatus,
  FBAInboundShipmentStatus,
  WarehouseStatus,
} from '../../types/fba';

import {
  MOCK_FBA_WAREHOUSES,
  MOCK_FBA_INVENTORY,
  MOCK_FBA_INBOUND_SHIPMENTS,
  MOCK_FBA_TRANSFERS,
  MOCK_FBA_PICKING_TASKS,
  MOCK_FBA_PACKING_TASKS,
  MOCK_FBA_ORDERS,
  MOCK_FBA_FEE_RECORDS,
  MOCK_FBA_RETURNS,
  MOCK_FBA_AUDIT_LOGS,
  MOCK_FBA_STAFF,
  MOCK_FBA_NOTIFICATIONS,
  MOCK_FBA_ENROLLMENTS,
} from '../../data/fbaMockData';

import { FBADashboardOverview } from './FBADashboardOverview';
import { SellerFBAEnrollmentView } from './SellerFBAEnrollmentView';
import { WarehouseManagementView } from './WarehouseManagementView';
import { InboundInventoryReceivingView } from './InboundInventoryReceivingView';
import { InventoryStorageBinsView } from './InventoryStorageBinsView';
import { InventoryTransfersView } from './InventoryTransfersView';
import { PickingSystemView } from './PickingSystemView';
import { PackingSystemView } from './PackingSystemView';
import { ShippingManagementView } from './ShippingManagementView';
import { CustomerOrderFulfilmentView } from './CustomerOrderFulfilmentView';
import { StorageAndFulfilmentFeesView } from './StorageAndFulfilmentFeesView';
import { FBAReturnsProcessingView } from './FBAReturnsProcessingView';
import { InventoryAuditingView } from './InventoryAuditingView';
import { WarehouseStaffManagementView } from './WarehouseStaffManagementView';
import { FBANotificationsView } from './FBANotificationsView';
import { FBAReportsExportView } from './FBAReportsExportView';
import { FBAAnalyticsDashboard } from './FBAAnalyticsDashboard';
import { AdminFBAControlsView } from './AdminFBAControlsView';

import {
  Warehouse,
  UserCheck,
  Boxes,
  Truck,
  ArrowRightLeft,
  PackageCheck,
  Package,
  DollarSign,
  RotateCcw,
  ShieldAlert,
  Users,
  Bell,
  FileText,
  BarChart2,
  Sliders,
  Layers,
} from 'lucide-react';

export type FBATab =
  | 'OVERVIEW'
  | 'SELLER_ENROLLMENT'
  | 'WAREHOUSE_MGMT'
  | 'INBOUND_RECEIVING'
  | 'INVENTORY_STORAGE'
  | 'INVENTORY_TRANSFERS'
  | 'PICKING_SYSTEM'
  | 'PACKING_SYSTEM'
  | 'SHIPPING_DISPATCH'
  | 'CUSTOMER_FULFILMENT'
  | 'STORAGE_FULFILMENT_FEES'
  | 'RETURNS_RMA'
  | 'INVENTORY_AUDITING'
  | 'STAFF_MANAGEMENT'
  | 'NOTIFICATIONS'
  | 'REPORTS_EXPORT'
  | 'ANALYTICS'
  | 'ADMIN_CONTROLS';

export const FBAMasterModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FBATab>('OVERVIEW');

  // State Management
  const [warehouses, setWarehouses] = useState<FBAWarehouse[]>(MOCK_FBA_WAREHOUSES);
  const [inventory, setInventory] = useState<FBAInventoryItem[]>(MOCK_FBA_INVENTORY);
  const [inboundShipments, setInboundShipments] = useState<FBAInboundShipment[]>(MOCK_FBA_INBOUND_SHIPMENTS);
  const [transfers, setTransfers] = useState<FBAInventoryTransfer[]>(MOCK_FBA_TRANSFERS);
  const [pickingTasks, setPickingTasks] = useState<FBAPickingTask[]>(MOCK_FBA_PICKING_TASKS);
  const [packingTasks, setPackingTasks] = useState<FBAPackingTask[]>(MOCK_FBA_PACKING_TASKS);
  const [orders, setOrders] = useState<FBACustomerOrder[]>(MOCK_FBA_ORDERS);
  const [feeRecords, setFeeRecords] = useState<FBAFeeRecord[]>(MOCK_FBA_FEE_RECORDS);
  const [returns, setReturns] = useState<FBAReturnRecord[]>(MOCK_FBA_RETURNS);
  const [auditLogs, setAuditLogs] = useState<FBAAuditRecord[]>(MOCK_FBA_AUDIT_LOGS);
  const [staffList, setStaffList] = useState<FBAStaffMember[]>(MOCK_FBA_STAFF);
  const [notifications, setNotifications] = useState<FBANotification[]>(MOCK_FBA_NOTIFICATIONS);
  const [enrollments, setEnrollments] = useState<FBAEnrollmentRequest[]>(MOCK_FBA_ENROLLMENTS);

  // Handlers
  const handleAddWarehouse = (newWh: FBAWarehouse) => {
    setWarehouses([newWh, ...warehouses]);
  };

  const handleUpdateWarehouseStatus = (whId: string, status: WarehouseStatus) => {
    setWarehouses(
      warehouses.map((w) => (w.id === whId ? { ...w, status } : w))
    );
  };

  const handleApplyForFBA = (req: FBAEnrollmentRequest) => {
    setEnrollments([req, ...enrollments]);
  };

  const handleCreateInboundShipment = (s: FBAInboundShipment) => {
    setInboundShipments([s, ...inboundShipments]);
  };

  const handleUpdateInboundStatus = (id: string, status: FBAInboundShipmentStatus) => {
    setInboundShipments(
      inboundShipments.map((s) => (s.shipmentId === id ? { ...s, status } : s))
    );
  };

  const handleCreateTransfer = (t: FBAInventoryTransfer) => {
    setTransfers([t, ...transfers]);
  };

  const handleCompleteTransfer = (id: string) => {
    setTransfers(
      transfers.map((t) => (t.transferId === id ? { ...t, status: 'COMPLETED' } : t))
    );
  };

  const handleCompletePickTask = (taskId: string) => {
    setPickingTasks(
      pickingTasks.map((pt) =>
        pt.taskId === taskId
          ? {
              ...pt,
              status: 'COMPLETED',
              completedAt: new Date().toISOString().substring(0, 16).replace('T', ' '),
            }
          : pt
      )
    );
  };

  const handleCompletePackTask = (packId: string) => {
    setPackingTasks(
      packingTasks.map((pk) =>
        pk.packId === packId ? { ...pk, status: 'DISPATCH_READY' } : pk
      )
    );
  };

  const handleAdvanceOrderStatus = (orderId: string, nextStatus: FBAOrderStatus) => {
    setOrders(
      orders.map((o) => {
        if (o.orderId === orderId) {
          const newTimeline = [
            ...o.timeline,
            {
              status: nextStatus,
              description: `Order stage advanced to ${nextStatus}`,
              timestamp: new Date().toISOString().substring(0, 16).replace('T', ' '),
            },
          ];
          return { ...o, status: nextStatus, timeline: newTimeline };
        }
        return o;
      })
    );
  };

  const handleDispatchOrder = (orderId: string) => {
    handleAdvanceOrderStatus(orderId, 'IN_TRANSIT');
  };

  const handleTriggerDailyStorageBilling = () => {
    const newFee: FBAFeeRecord = {
      feeId: `FEE-${Math.floor(3300 + Math.random() * 900)}`,
      sellerId: 'SEL-301',
      sellerName: 'PrimeTech Direct Store',
      feeType: 'DAILY_STORAGE',
      amountUSD: 29.0,
      description: `Daily FBA inventory storage fee assessed for ${new Date().toISOString().substring(0, 10)}`,
      deductedFromWallet: true,
      timestamp: new Date().toISOString().substring(0, 16).replace('T', ' '),
    };

    setFeeRecords([newFee, ...feeRecords]);
    alert('Daily FBA Storage Fee Run Executed! $29.00 USD deducted from seller wallet.');
  };

  const handleProcessReturn = (newRma: FBAReturnRecord) => {
    setReturns([newRma, ...returns]);
  };

  const handleAddAuditRecord = (newAudit: FBAAuditRecord) => {
    setAuditLogs([newAudit, ...auditLogs]);
  };

  const handleAddStaffMember = (newStaff: FBAStaffMember) => {
    setStaffList([newStaff, ...staffList]);
  };

  const handleMarkNotifRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleApproveEnrollment = (sellerId: string) => {
    setEnrollments(
      enrollments.map((e) => (e.sellerId === sellerId ? { ...e, status: 'APPROVED' } : e))
    );
  };

  const handleRejectEnrollment = (sellerId: string) => {
    setEnrollments(
      enrollments.map((e) => (e.sellerId === sellerId ? { ...e, status: 'REJECTED' } : e))
    );
  };

  // Nav Items
  const navItems: { id: FBATab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'OVERVIEW', label: 'FBA Telemetry', icon: Warehouse },
    { id: 'SELLER_ENROLLMENT', label: 'Seller Enrollment', icon: UserCheck },
    { id: 'WAREHOUSE_MGMT', label: 'Warehouses', icon: Layers },
    { id: 'INBOUND_RECEIVING', label: 'Inbound Dock', icon: Truck },
    { id: 'INVENTORY_STORAGE', label: 'Bins & Racks', icon: Boxes },
    { id: 'INVENTORY_TRANSFERS', label: 'Transfers', icon: ArrowRightLeft },
    { id: 'PICKING_SYSTEM', label: 'Picking System', icon: PackageCheck },
    { id: 'PACKING_SYSTEM', label: 'Packing & Scale', icon: Package },
    { id: 'SHIPPING_DISPATCH', label: 'Carrier Dispatch', icon: Truck },
    { id: 'CUSTOMER_FULFILMENT', label: 'Order Fulfilment', icon: PackageCheck },
    { id: 'STORAGE_FULFILMENT_FEES', label: 'Billing & Fees', icon: DollarSign },
    { id: 'RETURNS_RMA', label: 'Returns (RMA)', icon: RotateCcw },
    { id: 'INVENTORY_AUDITING', label: 'Stock Auditing', icon: ShieldAlert },
    { id: 'STAFF_MANAGEMENT', label: 'Staff Roster', icon: Users },
    { id: 'NOTIFICATIONS', label: 'Events & Alerts', icon: Bell },
    { id: 'REPORTS_EXPORT', label: 'Reports Export', icon: FileText },
    { id: 'ANALYTICS', label: 'Analytics', icon: BarChart2 },
    { id: 'ADMIN_CONTROLS', label: 'Admin Rates', icon: Sliders },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-12">
      {/* Module Navigation Sub-Header */}
      <div className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-14 z-30 px-4 py-2 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex items-center space-x-1.5 min-w-max">
          {navItems.map((item) => {
            const IconComp = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-[#febd69] text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Container View */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        {activeTab === 'OVERVIEW' && (
          <FBADashboardOverview warehouses={warehouses} inventory={inventory} orders={orders} />
        )}

        {activeTab === 'SELLER_ENROLLMENT' && (
          <SellerFBAEnrollmentView enrollments={enrollments} onApplyForFBA={handleApplyForFBA} />
        )}

        {activeTab === 'WAREHOUSE_MGMT' && (
          <WarehouseManagementView
            warehouses={warehouses}
            onAddWarehouse={handleAddWarehouse}
            onUpdateWarehouseStatus={handleUpdateWarehouseStatus}
          />
        )}

        {activeTab === 'INBOUND_RECEIVING' && (
          <InboundInventoryReceivingView
            shipments={inboundShipments}
            onCreateInboundShipment={handleCreateInboundShipment}
            onUpdateStatus={handleUpdateInboundStatus}
          />
        )}

        {activeTab === 'INVENTORY_STORAGE' && (
          <InventoryStorageBinsView inventory={inventory} />
        )}

        {activeTab === 'INVENTORY_TRANSFERS' && (
          <InventoryTransfersView
            transfers={transfers}
            onCreateTransfer={handleCreateTransfer}
            onCompleteTransfer={handleCompleteTransfer}
          />
        )}

        {activeTab === 'PICKING_SYSTEM' && (
          <PickingSystemView pickingTasks={pickingTasks} onCompletePickTask={handleCompletePickTask} />
        )}

        {activeTab === 'PACKING_SYSTEM' && (
          <PackingSystemView packingTasks={packingTasks} onCompletePackTask={handleCompletePackTask} />
        )}

        {activeTab === 'SHIPPING_DISPATCH' && (
          <ShippingManagementView orders={orders} onDispatchOrder={handleDispatchOrder} />
        )}

        {activeTab === 'CUSTOMER_FULFILMENT' && (
          <CustomerOrderFulfilmentView orders={orders} onAdvanceOrderStatus={handleAdvanceOrderStatus} />
        )}

        {activeTab === 'STORAGE_FULFILMENT_FEES' && (
          <StorageAndFulfilmentFeesView
            feeRecords={feeRecords}
            onTriggerDailyStorageBilling={handleTriggerDailyStorageBilling}
          />
        )}

        {activeTab === 'RETURNS_RMA' && (
          <FBAReturnsProcessingView returns={returns} onProcessReturn={handleProcessReturn} />
        )}

        {activeTab === 'INVENTORY_AUDITING' && (
          <InventoryAuditingView auditLogs={auditLogs} onAddAuditRecord={handleAddAuditRecord} />
        )}

        {activeTab === 'STAFF_MANAGEMENT' && (
          <WarehouseStaffManagementView staffList={staffList} onAddStaffMember={handleAddStaffMember} />
        )}

        {activeTab === 'NOTIFICATIONS' && (
          <FBANotificationsView notifications={notifications} onMarkAsRead={handleMarkNotifRead} />
        )}

        {activeTab === 'REPORTS_EXPORT' && <FBAReportsExportView />}

        {activeTab === 'ANALYTICS' && <FBAAnalyticsDashboard />}

        {activeTab === 'ADMIN_CONTROLS' && (
          <AdminFBAControlsView
            enrollments={enrollments}
            onApproveEnrollment={handleApproveEnrollment}
            onRejectEnrollment={handleRejectEnrollment}
          />
        )}
      </div>
    </div>
  );
};
