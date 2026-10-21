import React, { useState, useEffect } from 'react';
import { ComprehensiveMasterOrder } from '../../types/oms';
import {
  Truck,
  MapPin,
  CheckCircle2,
  Clock,
  ExternalLink,
  AlertTriangle,
  Package,
  ArrowLeft,
  RefreshCw,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { ShipmentRecord, FulfillmentStatus } from '../../types/shippingFulfillment';
import { shippingFulfillmentClient } from '../../services/shippingFulfillmentClient';

interface ShipmentTrackingEngineViewProps {
  order: ComprehensiveMasterOrder | null;
  onClose?: () => void;
}

const STEPS: { status: FulfillmentStatus; label: string; desc: string }[] = [
  { status: 'PROCESSING', label: '1. Processing', desc: 'Order received & allocated to seller warehouse' },
  { status: 'PACKED', label: '2. Packed', desc: 'Securely packaged with packing slip enclosed' },
  { status: 'READY_FOR_DISPATCH', label: '3. Ready for Dispatch', desc: 'Manifest created for courier collection' },
  { status: 'SHIPPED', label: '4. Dispatched', desc: 'Handed over to carrier courier' },
  { status: 'IN_TRANSIT', label: '5. In Transit', desc: 'En route between regional sorting hubs' },
  { status: 'OUT_FOR_DELIVERY', label: '6. Out for Delivery', desc: 'On final delivery vehicle' },
  { status: 'DELIVERED', label: '7. Delivered', desc: 'Package delivered to recipient address' },
];

export const ShipmentTrackingEngineView: React.FC<ShipmentTrackingEngineViewProps> = ({ order, onClose }) => {
  const [shipments, setShipments] = useState<ShipmentRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedShipmentIndex, setSelectedShipmentIndex] = useState<number>(0);

  const fetchTracking = async () => {
    if (!order) return;
    setLoading(true);
    try {
      // 1. Try order ID query
      let fetched = await shippingFulfillmentClient.getBuyerOrderTracking(order.id);
      
      // 2. Fallback to order tracking number
      if (fetched.length === 0 && order.trackingNumber) {
        try {
          const direct = await shippingFulfillmentClient.getShipment(order.trackingNumber);
          if (direct) fetched = [direct];
        } catch {
          // ignore
        }
      }

      setShipments(fetched);
    } catch (err) {
      console.error('Failed to load tracking data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracking();
  }, [order?.id, order?.trackingNumber]);

  if (!order) {
    return (
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center text-slate-400">
        <Package className="w-12 h-12 mx-auto text-slate-600 mb-2" />
        <p className="text-sm">Please select an order from your order history to view tracking details.</p>
      </div>
    );
  }

  const activeShipment: ShipmentRecord | undefined = shipments[selectedShipmentIndex];

  // Helper to get step index
  const getStepIndex = (status?: FulfillmentStatus): number => {
    if (!status) return 0;
    if (status === 'DELIVERED') return 6;
    if (status === 'OUT_FOR_DELIVERY') return 5;
    if (status === 'IN_TRANSIT') return 4;
    if (status === 'SHIPPED') return 3;
    if (status === 'READY_FOR_DISPATCH') return 2;
    if (status === 'PACKED') return 1;
    return 0;
  };

  const currentStep = getStepIndex(activeShipment?.status);
  const isException = activeShipment && ['DELAYED', 'DELIVERY_EXCEPTION', 'RETURNED_TO_SENDER'].includes(activeShipment.status);

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          {onClose && (
            <button
              onClick={onClose}
              className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white mb-2 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Orders</span>
            </button>
          )}

          <div className="flex items-center space-x-2 text-xs font-mono text-[#febd69] uppercase tracking-wider font-bold">
            <Truck className="w-4 h-4 text-sky-400" />
            <span>COMMERCE ZON OFFICIAL TRACKING RADAR</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">
            Tracking for Order #{order.orderNumber}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {activeShipment
              ? `Carrier: ${activeShipment.carrierName} • Tracking #${activeShipment.trackingNumber}`
              : `Tracking Number: ${order.trackingNumber || 'Pending Allocation'}`}
          </p>
        </div>

        <div className="flex items-center space-x-3 self-end sm:self-center">
          <button
            onClick={fetchTracking}
            className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-slate-800 transition"
            title="Refresh Tracking Status"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-right">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Estimated Delivery</div>
            <div className="text-sm font-black text-emerald-400 font-mono">
              {activeShipment?.estimatedDeliveryDate || order.estimatedDeliveryDate || '3-5 Business Days'}
            </div>
          </div>
        </div>
      </div>

      {/* Multiple Shipments Selector (Multi-seller orders) */}
      {shipments.length > 1 && (
        <div className="bg-slate-950 p-2 rounded-2xl border border-slate-800 flex items-center space-x-2 overflow-x-auto text-xs">
          <span className="text-slate-400 font-bold px-2 whitespace-nowrap">Package Packages ({shipments.length}):</span>
          {shipments.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setSelectedShipmentIndex(idx)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                selectedShipmentIndex === idx
                  ? 'bg-sky-500 text-slate-950'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Shipment {idx + 1} ({s.carrierCode}) - {s.status.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      )}

      {/* EXCEPTION OR DELAY BANNER (Requirement 9 & 10) */}
      {isException && (
        <div className="bg-rose-950/50 border border-rose-800/80 rounded-2xl p-4 flex items-start space-x-3 text-xs text-rose-200">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-white uppercase text-xs tracking-wider">
              Fulfillment Alert: {activeShipment.status.replace(/_/g, ' ')}
            </h4>
            <p className="leading-relaxed">
              {activeShipment.exceptionReason ||
                'A courier delay or transit exception has been recorded on this shipment. Our logistics team is investigating.'}
            </p>
            <div className="text-[10px] text-rose-300 font-mono">
              Last status update: {new Date(activeShipment.updatedAt).toLocaleString()}
            </div>
          </div>
        </div>
      )}

      {/* VERIFIED TRACKING LINK BANNER */}
      {activeShipment?.trackingUrl && (
        <div className="bg-sky-950/40 border border-sky-800/60 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3">
            <ShieldCheck className="w-5 h-5 text-sky-400 shrink-0" />
            <div>
              <span className="font-bold text-white block">Official Courier Tracking Link</span>
              <span className="text-slate-400 text-[11px]">
                Directly verify real-time transit telemetry on {activeShipment.carrierName}&apos;s verified web portal.
              </span>
            </div>
          </div>
          <a
            href={activeShipment.trackingUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black rounded-xl text-xs transition flex items-center space-x-1.5 self-start sm:self-auto shadow shrink-0"
          >
            <span>Open {activeShipment.carrierName}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* NO TRACKING YET STATE */}
      {!loading && shipments.length === 0 && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
          <Clock className="w-10 h-10 text-amber-400 mx-auto" />
          <h3 className="text-base font-bold text-white">Tracking Being Prepared by Merchant</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            The merchant is currently packing and staging your items. As soon as the carrier collects the package and scans the tracking barcode, real-time dispatch events will be posted here.
          </p>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-full text-[10px] font-mono">
            <span>Status: Order Confirmed & In Warehouse Allocation</span>
          </div>
        </div>
      )}

      {/* VISUAL TRANSIT STEPPER */}
      {activeShipment && (
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Transit Progress ({activeShipment.shippingMethod.replace(/_/g, ' ')})</span>
            </h3>
            <span className="text-xs font-mono text-sky-400 font-bold">
              Current: {activeShipment.status.replace(/_/g, ' ')}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {STEPS.map((stg, idx) => {
              const isCompleted = currentStep >= idx && !isException;
              const isCurrent = currentStep === idx;

              return (
                <div
                  key={stg.status}
                  className={`p-2.5 rounded-xl border text-center space-y-1 transition ${
                    isCurrent
                      ? 'bg-sky-500/20 border-sky-500 text-white shadow-lg'
                      : isCompleted
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-slate-200'
                      : 'bg-slate-900 border-slate-800 text-slate-600'
                  }`}
                >
                  <div
                    className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center font-mono text-[11px] font-black ${
                      isCurrent
                        ? 'bg-sky-400 text-slate-950'
                        : isCompleted
                        ? 'bg-emerald-400 text-slate-950'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {isCompleted && !isCurrent ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                  </div>
                  <div className="text-[11px] font-bold leading-tight">{stg.label}</div>
                  <div className="text-[9px] text-slate-400 leading-tight line-clamp-2">{stg.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ITEMS IN THIS SHIPMENT */}
      {activeShipment && activeShipment.items && activeShipment.items.length > 0 && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
          <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
            Items in this Package ({activeShipment.items.length})
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {activeShipment.items.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-900 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-white truncate max-w-[220px]">{item.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">SKU: {item.sku}</div>
                </div>
                <div className="font-mono text-emerald-400 font-bold">x{item.quantity}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TIMESTAMPED TRACKING EVENTS HISTORY */}
      {activeShipment && activeShipment.statusHistory && activeShipment.statusHistory.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-black text-white uppercase tracking-wider">
            Verified Timestamped Event History ({activeShipment.statusHistory.length} Events)
          </h3>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
            {activeShipment.statusHistory.map((ev) => (
              <div
                key={ev.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-3 last:border-none text-xs gap-2"
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-white flex items-center space-x-2">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                        ev.stage === 'DELIVERED'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : ev.isException
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-sky-500/20 text-sky-300'
                      }`}
                    >
                      {ev.stage.replace(/_/g, ' ')}
                    </span>
                    <span>{ev.description}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center space-x-1.5">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span>{ev.location}</span>
                    <span>•</span>
                    <span className="font-mono text-slate-500">Updated by: {ev.actorRole}</span>
                  </div>
                </div>

                <div className="font-mono text-[10px] text-slate-400 shrink-0">
                  {new Date(ev.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
