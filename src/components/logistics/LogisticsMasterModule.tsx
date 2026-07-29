import React, { useState } from 'react';
import {
  MOCK_CARRIERS,
  MOCK_SHIPPING_METHODS,
  MOCK_PICKUP_REQUESTS,
  MOCK_SHIPMENTS,
  MOCK_DELIVERY_ZONES,
  MOCK_LOGISTICS_NOTIFICATIONS,
} from '../../data/logisticsMockData';
import {
  ShippingCarrier,
  ShippingMethodConfig,
  PickupRequest,
  Shipment,
  ShipmentStatus,
  DeliveryZone,
  ProofOfDelivery,
  LogisticsNotification,
} from '../../types/logistics';

import { LogisticsDashboardOverview } from './LogisticsDashboardOverview';
import { CarrierManagementView } from './CarrierManagementView';
import { ShippingMethodsView } from './ShippingMethodsView';
import { PickupManagementView } from './PickupManagementView';
import { ShipmentCreationTrackingView } from './ShipmentCreationTrackingView';
import { DeliveryAndPODView } from './DeliveryAndPODView';
import { ShippingCostEngineView } from './ShippingCostEngineView';
import { DeliveryZonesView } from './DeliveryZonesView';
import { InternationalShippingView } from './InternationalShippingView';
import { RouteOptimizationView } from './RouteOptimizationView';
import { ReturnsLogisticsView } from './ReturnsLogisticsView';
import { LogisticsNotificationsView } from './LogisticsNotificationsView';
import { LogisticsReportsExportView } from './LogisticsReportsExportView';

import {
  Truck,
  Package,
  Sliders,
  Calendar,
  CheckCircle2,
  Calculator,
  Globe,
  Navigation,
  RotateCcw,
  Bell,
  FileText,
  Activity,
  Layers,
} from 'lucide-react';

type LogisticsSubTab =
  | 'overview'
  | 'carriers'
  | 'methods'
  | 'pickups'
  | 'shipments'
  | 'pod'
  | 'calculator'
  | 'zones'
  | 'international'
  | 'routes'
  | 'returns'
  | 'notifications'
  | 'reports';

export const LogisticsMasterModule: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<LogisticsSubTab>('overview');

  // Master Logistics State
  const [carriers, setCarriers] = useState<ShippingCarrier[]>(MOCK_CARRIERS);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethodConfig[]>(MOCK_SHIPPING_METHODS);
  const [pickups, setPickups] = useState<PickupRequest[]>(MOCK_PICKUP_REQUESTS);
  const [shipments, setShipments] = useState<Shipment[]>(MOCK_SHIPMENTS);
  const [zones, setZones] = useState<DeliveryZone[]>(MOCK_DELIVERY_ZONES);
  const [notifications, setNotifications] = useState<LogisticsNotification[]>(MOCK_LOGISTICS_NOTIFICATIONS);

  // Handlers
  const handleAddCarrier = (newCarrier: ShippingCarrier) => {
    setCarriers((prev) => [newCarrier, ...prev]);
  };

  const handleToggleCarrier = (carrierId: string) => {
    setCarriers((prev) =>
      prev.map((c) => (c.id === carrierId ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const handleToggleMethod = (methodId: string) => {
    setShippingMethods((prev) =>
      prev.map((m) => (m.id === methodId ? { ...m, isEnabled: !m.isEnabled } : m))
    );
  };

  const handleRequestPickup = (newPickup: PickupRequest) => {
    setPickups((prev) => [newPickup, ...prev]);
  };

  const handleUpdatePickupStatus = (id: string, status: PickupRequest['status']) => {
    setPickups((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
  };

  const handleCreateShipment = (newShipment: Shipment) => {
    setShipments((prev) => [newShipment, ...prev]);
  };

  const handleAdvanceShipmentStatus = (shipmentId: string, status: ShipmentStatus) => {
    setShipments((prev) =>
      prev.map((s) => {
        if (s.shipmentId === shipmentId) {
          const updatedTimeline = s.trackingTimeline.map((item) =>
            item.stage === status ? { ...item, completed: true } : item
          );
          return {
            ...s,
            status,
            trackingTimeline: updatedTimeline,
          };
        }
        return s;
      })
    );
  };

  const handleUploadPOD = (shipmentId: string, pod: ProofOfDelivery) => {
    setShipments((prev) =>
      prev.map((s) =>
        s.shipmentId === shipmentId
          ? {
              ...s,
              status: 'DELIVERED',
              proofOfDelivery: pod,
            }
          : s
      )
    );
  };

  const handleAddZone = (newZone: DeliveryZone) => {
    setZones((prev) => [newZone, ...prev]);
  };

  const handleToggleZoneServiceable = (zoneId: string) => {
    setZones((prev) =>
      prev.map((z) => (z.zoneId === zoneId ? { ...z, isServiceable: !z.isServiceable } : z))
    );
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const tabsNav: { id: LogisticsSubTab; label: string; icon: React.ElementType; count?: number }[] = [
    { id: 'overview', label: 'Dashboard', icon: Activity },
    { id: 'shipments', label: 'Shipments & Tracking', icon: Package, count: shipments.length },
    { id: 'carriers', label: 'Carriers', icon: Truck, count: carriers.filter((c) => c.isActive).length },
    { id: 'methods', label: 'Shipping Methods', icon: Sliders },
    { id: 'pickups', label: 'Pickups', icon: Calendar, count: pickups.filter((p) => p.status === 'SCHEDULED' || p.status === 'REQUESTED').length },
    { id: 'pod', label: 'Proof of Delivery', icon: CheckCircle2 },
    { id: 'calculator', label: 'Freight Calculator', icon: Calculator },
    { id: 'zones', label: 'Delivery Zones', icon: Globe },
    { id: 'international', label: 'Cross-Border & Customs', icon: Globe },
    { id: 'routes', label: 'AI Route Optimization', icon: Navigation },
    { id: 'returns', label: 'Returns & RMA', icon: RotateCcw },
    { id: 'notifications', label: 'Notifications', icon: Bell, count: notifications.filter((n) => !n.isRead).length },
    { id: 'reports', label: 'Audit & Reports', icon: FileText },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Master Top Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-[#131921] border border-slate-800 p-6 rounded-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Truck className="w-80 h-80 text-[#febd69]" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 bg-[#febd69] text-slate-950 font-black text-[10px] uppercase tracking-wider rounded">
                MODULE 13
              </span>
              <span className="text-xs text-[#febd69] font-mono font-bold uppercase tracking-wider flex items-center space-x-1">
                <Layers className="w-3.5 h-3.5" />
                <span>Enterprise Logistics Suite</span>
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center space-x-2">
              <span>Shipping & Global Logistics Management System</span>
            </h1>
            <p className="text-xs text-slate-400 max-w-3xl">
              End-to-end multi-vendor marketplace shipping engine: Carrier management, first-mile pickups, real-time telemetry tracking, digital POD, cross-border customs compliance, AI path optimization & reverse logistics.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
            <div className="text-right font-mono">
              <div className="text-[10px] text-slate-400 uppercase">Active Shipments</div>
              <div className="text-lg font-black text-emerald-400">{shipments.length} Units</div>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div className="text-right font-mono">
              <div className="text-[10px] text-slate-400 uppercase">Carriers Integrated</div>
              <div className="text-lg font-black text-[#febd69]">{carriers.length} Network</div>
            </div>
          </div>
        </div>

        {/* Sub Navigation Tabs Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-thin">
          {tabsNav.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`px-3 py-2 rounded-xl text-xs font-extrabold transition flex items-center space-x-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-[#febd69] text-slate-950 shadow-lg scale-[1.02]'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-[#febd69]'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-black ${
                      isActive ? 'bg-slate-950 text-[#febd69]' : 'bg-[#febd69] text-slate-950'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main View Display */}
      <div className="transition-all duration-200">
        {activeSubTab === 'overview' && (
          <LogisticsDashboardOverview shipments={shipments} />
        )}

        {activeSubTab === 'shipments' && (
          <ShipmentCreationTrackingView
            shipments={shipments}
            onCreateShipment={handleCreateShipment}
            onAdvanceStatus={handleAdvanceShipmentStatus}
          />
        )}

        {activeSubTab === 'carriers' && (
          <CarrierManagementView
            carriers={carriers}
            onAddCarrier={handleAddCarrier}
            onToggleCarrier={handleToggleCarrier}
          />
        )}

        {activeSubTab === 'methods' && (
          <ShippingMethodsView
            shippingMethods={shippingMethods}
            onToggleMethod={handleToggleMethod}
          />
        )}

        {activeSubTab === 'pickups' && (
          <PickupManagementView
            pickups={pickups}
            onRequestPickup={handleRequestPickup}
            onUpdatePickupStatus={handleUpdatePickupStatus}
          />
        )}

        {activeSubTab === 'pod' && (
          <DeliveryAndPODView shipments={shipments} onUploadPOD={handleUploadPOD} />
        )}

        {activeSubTab === 'calculator' && <ShippingCostEngineView />}

        {activeSubTab === 'zones' && (
          <DeliveryZonesView
            zones={zones}
            onAddZone={handleAddZone}
            onToggleZoneServiceable={handleToggleZoneServiceable}
          />
        )}

        {activeSubTab === 'international' && <InternationalShippingView />}

        {activeSubTab === 'routes' && <RouteOptimizationView />}

        {activeSubTab === 'returns' && <ReturnsLogisticsView />}

        {activeSubTab === 'notifications' && (
          <LogisticsNotificationsView
            notifications={notifications}
            onMarkRead={handleMarkNotificationRead}
          />
        )}

        {activeSubTab === 'reports' && <LogisticsReportsExportView />}
      </div>
    </div>
  );
};
