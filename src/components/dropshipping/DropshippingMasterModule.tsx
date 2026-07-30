import React, { useState } from 'react';
import {
  MOCK_SUPPLIERS,
  MOCK_SUPPLIER_PRODUCTS,
  MOCK_IMPORTED_SELLER_PRODUCTS,
  MOCK_DROPSHIP_ORDERS,
  MOCK_RETURNS,
  MOCK_SETTLEMENTS,
  MOCK_DROPSHIP_AUDIT_LOGS,
} from '../../data/dropshippingMockData';
import {
  SupplierRecord,
  SupplierProduct,
  ImportedSellerProduct,
  DropshipOrder,
  ReturnRMARecord,
  SettlementRecord,
  DropshipAuditLog,
  SupplierStatus,
  DropshipOrderStatus,
  ReturnStatus,
} from '../../types/dropshipping';

import { DropshippingDashboardOverview } from './DropshippingDashboardOverview';
import { SupplierRegistrationKYC } from './SupplierRegistrationKYC';
import { AdminSupplierVerification } from './AdminSupplierVerification';
import { SupplierProductCatalogue } from './SupplierProductCatalogue';
import { SellerProductImportManager } from './SellerProductImportManager';
import { InventorySyncEngine } from './InventorySyncEngine';
import { AutoOrderRoutingSimulator } from './AutoOrderRoutingSimulator';
import { SupplierOrderFulfilmentPortal } from './SupplierOrderFulfilmentPortal';
import { ShippingAndOrderTrackingView } from './ShippingAndOrderTrackingView';
import { ReturnsAndRMAEngineView } from './ReturnsAndRMAEngineView';
import { SupplierSettlementWalletView } from './SupplierSettlementWalletView';
import { SupplierPerformanceScorecardView } from './SupplierPerformanceScorecardView';
import { DropshippingNotificationsView } from './DropshippingNotificationsView';
import { DropshippingReportsExportView } from './DropshippingReportsExportView';
import { AdminDropshipControlsView } from './AdminDropshipControlsView';

import {
  Building2,
  UserCheck,
  ShieldCheck,
  Package,
  Store,
  RefreshCw,
  GitBranch,
  Truck,
  RotateCcw,
  DollarSign,
  Award,
  Bell,
  BarChart3,
  Sliders,
  LayoutDashboard,
} from 'lucide-react';

export const DropshippingMasterModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | 'DASHBOARD'
    | 'SUPPLIER_REGISTRATION'
    | 'ADMIN_VERIFICATION'
    | 'SUPPLIER_CATALOGUE'
    | 'SELLER_IMPORTS'
    | 'INVENTORY_SYNC'
    | 'ORDER_ROUTING'
    | 'SUPPLIER_FULFILMENT'
    | 'SHIPPING_TRACKING'
    | 'RETURNS_RMA'
    | 'SETTLEMENTS'
    | 'PERFORMANCE'
    | 'NOTIFICATIONS'
    | 'REPORTS'
    | 'ADMIN_CONTROLS'
  >('DASHBOARD');

  // Master State
  const [suppliers, setSuppliers] = useState<SupplierRecord[]>(MOCK_SUPPLIERS);
  const [supplierProducts, setSupplierProducts] = useState<SupplierProduct[]>(MOCK_SUPPLIER_PRODUCTS);
  const [importedSellerProducts, setImportedSellerProducts] = useState<ImportedSellerProduct[]>(
    MOCK_IMPORTED_SELLER_PRODUCTS
  );
  const [orders, setOrders] = useState<DropshipOrder[]>(MOCK_DROPSHIP_ORDERS);
  const [returns, setReturns] = useState<ReturnRMARecord[]>(MOCK_RETURNS);
  const [settlements, setSettlements] = useState<SettlementRecord[]>(MOCK_SETTLEMENTS);
  const [auditLogs, setAuditLogs] = useState<DropshipAuditLog[]>(MOCK_DROPSHIP_AUDIT_LOGS);

  // Handlers
  const handleRegisterSupplier = (newSupplier: SupplierRecord) => {
    setSuppliers((prev) => [newSupplier, ...prev]);
  };

  const handleUpdateSupplierStatus = (
    supplierId: string,
    status: SupplierStatus,
    commissionOverride?: number,
    rating?: number
  ) => {
    setSuppliers((prev) =>
      prev.map((s) =>
        s.id === supplierId
          ? {
              ...s,
              status,
              commissionOverridePct: commissionOverride !== undefined ? commissionOverride : s.commissionOverridePct,
              ratingScore: rating !== undefined ? rating : s.ratingScore,
            }
          : s
      )
    );
  };

  const handleAddSupplierProduct = (prod: SupplierProduct) => {
    setSupplierProducts((prev) => [prod, ...prev]);
  };

  const handleUpdateStock = (productId: string, newStock: number) => {
    setSupplierProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, availableStock: newStock, currentStock: newStock } : p))
    );
  };

  const handleImportProductToSeller = (
    sp: SupplierProduct,
    sellingPrice: number,
    marginPct: number
  ) => {
    const newImp: ImportedSellerProduct = {
      id: `IMP-${Math.floor(100 + Math.random() * 900)}`,
      sellerId: 'SEL-301',
      sellerName: 'PrimeTech Direct Store',
      supplierProductId: sp.id,
      supplierId: sp.supplierId,
      supplierName: sp.supplierName,
      originalTitle: sp.title,
      customTitle: `Store - ${sp.title}`,
      customDescription: sp.description,
      wholesalePriceUSD: sp.wholesalePriceUSD,
      sellingPriceUSD: sellingPrice,
      profitMarginPct: marginPct,
      profitMarginAmountUSD: sellingPrice - sp.wholesalePriceUSD,
      status: 'PUBLISHED',
      isSyncEnabled: true,
      syncedStock: sp.availableStock,
      totalSalesCount: 0,
      publishedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setImportedSellerProducts((prev) => [newImp, ...prev]);
  };

  const handleUpdateImportedProduct = (updated: ImportedSellerProduct) => {
    setImportedSellerProducts((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
  };

  const handleRemoveImportedProduct = (importedId: string) => {
    setImportedSellerProducts((prev) => prev.filter((i) => i.id !== importedId));
  };

  const handleForceGlobalSync = () => {
    setSupplierProducts((prev) =>
      prev.map((p) => ({
        ...p,
        lastStockSyncAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      }))
    );
  };

  const handleRouteSimulatedOrder = (newOrder: DropshipOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  const handleUpdateOrderStatus = (
    orderId: string,
    newStatus: DropshipOrderStatus,
    trackingNumber?: string
  ) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.orderId === orderId
          ? {
              ...o,
              orderStatus: newStatus,
              trackingNumber: trackingNumber || o.trackingNumber,
              updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            }
          : o
      )
    );
  };

  const handleUpdateReturnStatus = (
    rmaId: string,
    status: ReturnStatus,
    grade?: ReturnRMARecord['inspectionGrade']
  ) => {
    setReturns((prev) =>
      prev.map((r) =>
        r.rmaId === rmaId
          ? {
              ...r,
              status,
              inspectionGrade: grade || r.inspectionGrade,
              resolvedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            }
          : r
      )
    );
  };

  const navItems = [
    { id: 'DASHBOARD', label: 'Dropshipping Dashboard', icon: LayoutDashboard },
    { id: 'SUPPLIER_REGISTRATION', label: 'Supplier KYC Onboarding', icon: UserCheck },
    { id: 'ADMIN_VERIFICATION', label: 'Admin Verification & Audit', icon: ShieldCheck },
    { id: 'SUPPLIER_CATALOGUE', label: 'Wholesale Product Catalogue', icon: Package },
    { id: 'SELLER_IMPORTS', label: 'Seller 1-Click Import & Markup', icon: Store },
    { id: 'INVENTORY_SYNC', label: 'Inventory & Price Sync Lock', icon: RefreshCw },
    { id: 'ORDER_ROUTING', label: 'Automated Order Routing', icon: GitBranch },
    { id: 'SUPPLIER_FULFILMENT', label: 'Supplier Fulfilment Portal', icon: Building2 },
    { id: 'SHIPPING_TRACKING', label: 'Multi-Carrier Order Tracking', icon: Truck },
    { id: 'RETURNS_RMA', label: 'Returns & RMA Inspection', icon: RotateCcw },
    { id: 'SETTLEMENTS', label: 'Supplier Payouts & Wallet', icon: DollarSign },
    { id: 'PERFORMANCE', label: 'Supplier Performance Scorecard', icon: Award },
    { id: 'NOTIFICATIONS', label: 'Multi-Channel Notifications', icon: Bell },
    { id: 'REPORTS', label: 'Financial & Supply Reports', icon: BarChart3 },
    { id: 'ADMIN_CONTROLS', label: 'Admin Controls & Audit Logs', icon: Sliders },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 lg:p-6 space-y-6 font-sans">
      {/* Module 11 Master Header */}
      <div className="bg-[#131921] border border-[#37475a] p-6 rounded-2xl shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-widest">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span>MODULE 11: ENTERPRISE DROPSHIPPING MANAGEMENT SYSTEM</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Commerce Zon Grade Dropshipping, Multi-Supplier Inventory Sync & Order Routing System
          </h1>
          <p className="text-xs text-slate-400 max-w-3xl">
            Enterprise multi-vendor supply chain orchestrator supporting KYC registration, 1-click seller imports, automated order routing, 256-bit inventory reservation lock, multi-carrier shipping labels, RMA returns & instant wallet settlement splits.
          </p>
        </div>

        <div className="flex items-center space-x-3 font-mono text-xs">
          <div className="bg-[#232f3e] px-4 py-2 rounded-xl border border-[#37475a] text-center">
            <span className="text-slate-400 text-[10px] uppercase block">Active Suppliers</span>
            <span className="text-emerald-400 font-extrabold text-sm">{suppliers.filter(s => s.status === 'APPROVED').length} / {suppliers.length}</span>
          </div>
        </div>
      </div>

      {/* Sub-Tabs Scrollable Navigation */}
      <div className="bg-[#131921] border border-[#37475a] p-2 rounded-2xl shadow-xl overflow-x-auto flex items-center space-x-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 whitespace-nowrap ${
                isActive
                  ? 'bg-[#febd69] text-slate-950 font-black shadow-lg'
                  : 'text-slate-300 hover:bg-[#232f3e] hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-[#febd69]'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Render Active View */}
      <div>
        {activeTab === 'DASHBOARD' && (
          <DropshippingDashboardOverview
            suppliers={suppliers}
            orders={orders}
            products={supplierProducts}
          />
        )}

        {activeTab === 'SUPPLIER_REGISTRATION' && (
          <SupplierRegistrationKYC onRegisterSupplier={handleRegisterSupplier} />
        )}

        {activeTab === 'ADMIN_VERIFICATION' && (
          <AdminSupplierVerification
            suppliers={suppliers}
            onUpdateStatus={handleUpdateSupplierStatus}
          />
        )}

        {activeTab === 'SUPPLIER_CATALOGUE' && (
          <SupplierProductCatalogue
            products={supplierProducts}
            onAddProduct={handleAddSupplierProduct}
            onUpdateStock={handleUpdateStock}
          />
        )}

        {activeTab === 'SELLER_IMPORTS' && (
          <SellerProductImportManager
            supplierProducts={supplierProducts}
            importedSellerProducts={importedSellerProducts}
            onImportProduct={handleImportProductToSeller}
            onUpdateImportedProduct={handleUpdateImportedProduct}
            onRemoveImportedProduct={handleRemoveImportedProduct}
          />
        )}

        {activeTab === 'INVENTORY_SYNC' && (
          <InventorySyncEngine
            products={supplierProducts}
            onForceSync={handleForceGlobalSync}
          />
        )}

        {activeTab === 'ORDER_ROUTING' && (
          <AutoOrderRoutingSimulator
            orders={orders}
            onRouteSimulatedOrder={handleRouteSimulatedOrder}
          />
        )}

        {activeTab === 'SUPPLIER_FULFILMENT' && (
          <SupplierOrderFulfilmentPortal
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}

        {activeTab === 'SHIPPING_TRACKING' && (
          <ShippingAndOrderTrackingView orders={orders} />
        )}

        {activeTab === 'RETURNS_RMA' && (
          <ReturnsAndRMAEngineView
            returns={returns}
            onUpdateReturnStatus={handleUpdateReturnStatus}
          />
        )}

        {activeTab === 'SETTLEMENTS' && (
          <SupplierSettlementWalletView
            settlements={settlements}
            onReleaseSettlement={() => {}}
          />
        )}

        {activeTab === 'PERFORMANCE' && (
          <SupplierPerformanceScorecardView suppliers={suppliers} />
        )}

        {activeTab === 'NOTIFICATIONS' && <DropshippingNotificationsView />}

        {activeTab === 'REPORTS' && <DropshippingReportsExportView />}

        {activeTab === 'ADMIN_CONTROLS' && (
          <AdminDropshipControlsView auditLogs={auditLogs} />
        )}
      </div>
    </div>
  );
};
