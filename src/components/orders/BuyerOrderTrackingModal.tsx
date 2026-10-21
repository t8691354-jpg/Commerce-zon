import React, { useState, useEffect } from 'react';
import {
  X,
  Truck,
  Package,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  MapPin,
  Calendar,
  FileText,
  Printer,
  ChevronRight,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { ShipmentRecord, FulfillmentStatus, PackingSlip } from '../../types/shippingFulfillment';
import { shippingFulfillmentClient } from '../../services/shippingFulfillmentClient';

interface BuyerOrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
  orderId: string;
}

const STAGES: { stage: FulfillmentStatus; label: string; icon: any }[] = [
  { stage: 'PROCESSING', label: 'Order Confirmed', icon: Clock },
  { stage: 'PACKED', label: 'Package Packed', icon: Package },
  { stage: 'READY_FOR_DISPATCH', label: 'Ready for Pickup', icon: Building2 },
  { stage: 'SHIPPED', label: 'Dispatched', icon: Truck },
  { stage: 'IN_TRANSIT', label: 'In Transit', icon: Truck },
  { stage: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: MapPin },
  { stage: 'DELIVERED', label: 'Delivered', icon: CheckCircle2 },
];

export const BuyerOrderTrackingModal: React.FC<BuyerOrderTrackingModalProps> = ({
  isOpen,
  onClose,
  orderNumber,
  orderId,
}) => {
  const [shipments, setShipments] = useState<ShipmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedShipment, setSelectedShipment] = useState<ShipmentRecord | null>(null);
  const [packingSlip, setPackingSlip] = useState<PackingSlip | null>(null);
  const [showSlipModal, setShowSlipModal] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    shippingFulfillmentClient
      .getBuyerOrderTracking(orderId)
      .then((data) => {
        setShipments(data);
        if (data.length > 0) {
          setSelectedShipment(data[0]);
        }
      })
      .catch((err) => console.error('Failed to load tracking data', err))
      .finally(() => setLoading(false));
  }, [isOpen, orderId]);

  const handleOpenPackingSlip = async (shipmentId: string) => {
    try {
      const slip = await shippingFulfillmentClient.getPackingSlip(shipmentId);
      setPackingSlip(slip);
      setShowSlipModal(true);
    } catch (err: any) {
      alert(`Could not load packing slip: ${err.message}`);
    }
  };

  if (!isOpen) return null;

  const currentStatus = selectedShipment?.status || 'PROCESSING';
  const isDelivered = currentStatus === 'DELIVERED';
  const isException = currentStatus === 'DELIVERY_EXCEPTION' || currentStatus === 'DELAYED';

  // Helper to check if milestone is reached
  const getStageIndex = (status: FulfillmentStatus) => {
    const order: FulfillmentStatus[] = [
      'PENDING_FULFILLMENT',
      'PROCESSING',
      'PACKED',
      'READY_FOR_DISPATCH',
      'SHIPPED',
      'IN_TRANSIT',
      'OUT_FOR_DELIVERY',
      'DELIVERED',
    ];
    return order.indexOf(status);
  };

  const currentStageIndex = getStageIndex(currentStatus);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans text-slate-100">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-[#febd69] rounded-2xl">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">Live Package Tracking</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase bg-slate-800 text-slate-300">
                  Order #{orderNumber}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time transit milestones, carrier verification, and delivery estimates
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-[#febd69] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-400 font-mono">Connecting to carrier logistics network...</p>
          </div>
        ) : shipments.length === 0 ? (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
            <Package className="w-10 h-10 text-slate-500 mx-auto" />
            <h4 className="text-sm font-bold text-white">Fulfillment In Preparation</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Your order has been verified and allocated to merchant fulfillment warehouses. A courier tracking
              number will be generated as soon as packages are packed and dispatched.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Multi-Shipment Tabs (if order split across multiple sellers/warehouses) */}
            {shipments.length > 1 && (
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 overflow-x-auto">
                <span className="text-xs font-mono text-slate-400 shrink-0">Shipments ({shipments.length}):</span>
                {shipments.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedShipment(s)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                      selectedShipment?.id === s.id
                        ? 'bg-[#febd69] text-slate-950 font-black shadow'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    Package {idx + 1} • {s.carrierName} ({s.status})
                  </button>
                ))}
              </div>
            )}

            {selectedShipment && (
              <>
                {/* Status Hero Card */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-[10px] uppercase font-mono font-bold text-slate-400">Current Status</div>
                      <div className="text-lg font-black text-white flex items-center gap-2 mt-0.5">
                        <span>{selectedShipment.status.replace(/_/g, ' ')}</span>
                        {isDelivered ? (
                          <span className="p-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs flex items-center gap-1 font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Delivered</span>
                          </span>
                        ) : isException ? (
                          <span className="p-1 bg-rose-500/20 text-rose-400 rounded-lg text-xs flex items-center gap-1 font-bold">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Transit Exception</span>
                          </span>
                        ) : (
                          <span className="p-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs flex items-center gap-1 font-bold">
                            <Truck className="w-3.5 h-3.5 animate-pulse" />
                            <span>In Motion</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end">
                      <div className="text-[10px] uppercase font-mono font-bold text-slate-400">Estimated Delivery</div>
                      <div className="text-sm font-black text-[#febd69] font-mono mt-0.5 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(selectedShipment.estimatedDeliveryDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Exception alert if delayed */}
                  {isException && (
                    <div className="p-3 bg-rose-950/60 border border-rose-800/80 rounded-xl text-xs text-rose-300 flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold">Carrier Notice: {selectedShipment.exceptionReason || 'Minor weather or customs transit delay'}</div>
                        <p className="text-[11px] text-rose-200/80 mt-0.5">
                          Delivery schedule updated. Our automated logistics engine is monitoring courier progression.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Carrier Details Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-850 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-mono block">Carrier Partner</span>
                      <span className="font-bold text-white">{selectedShipment.carrierName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-mono block">Tracking Number</span>
                      <span className="font-mono font-bold text-[#febd69]">{selectedShipment.trackingNumber}</span>
                    </div>
                    <div className="sm:text-right">
                      <span className="text-slate-400 text-[10px] uppercase font-mono block">Official Courier Portal</span>
                      {selectedShipment.trackingUrl ? (
                        <a
                          href={selectedShipment.trackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-sky-400 hover:text-sky-300 font-bold hover:underline"
                        >
                          <span>Open Carrier Site</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-slate-500 font-mono text-[11px]">Manual Carrier Dispatch</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Visual Progress Timeline */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <h4 className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider">
                    Fulfillment & Transit Lifecycle
                  </h4>

                  <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                    {selectedShipment.statusHistory.map((ev, idx) => {
                      const isLatest = idx === selectedShipment.statusHistory.length - 1;
                      return (
                        <div key={ev.id} className="relative group">
                          {/* Circle Milestone */}
                          <div
                            className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              isLatest
                                ? 'bg-[#febd69] text-slate-950 ring-4 ring-[#febd69]/20'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {isLatest ? '●' : '✓'}
                          </div>

                          <div className="space-y-0.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                                <span>{ev.stage.replace(/_/g, ' ')}</span>
                                <span className="text-[10px] font-mono text-slate-400">({ev.location})</span>
                              </span>
                              <span className="text-[10px] font-mono text-slate-500">
                                {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(ev.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">{ev.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Destination & Manifest Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Destination Address */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs space-y-2">
                    <div className="flex items-center space-x-1.5 text-slate-400 font-mono uppercase font-bold text-[10px]">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      <span>Shipping Destination Address</span>
                    </div>
                    <div className="text-white font-bold">{selectedShipment.destinationAddress.fullName}</div>
                    <div className="text-slate-400 leading-relaxed">
                      {selectedShipment.destinationAddress.streetLine1}
                      {selectedShipment.destinationAddress.streetLine2 && `, ${selectedShipment.destinationAddress.streetLine2}`}
                      <br />
                      {selectedShipment.destinationAddress.city}, {selectedShipment.destinationAddress.stateOrProvince} {selectedShipment.destinationAddress.postalCode}
                      <br />
                      Country: <strong>{selectedShipment.destinationAddress.countryCode}</strong>
                    </div>
                  </div>

                  {/* Shipment Line Items & Packing Slip Action */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-1.5 text-slate-400 font-mono uppercase font-bold text-[10px]">
                        <Package className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Included Items in this Package</span>
                      </div>
                      <div className="mt-2 space-y-1.5">
                        {selectedShipment.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-slate-300">
                            <span className="truncate max-w-[200px] text-xs font-semibold">{item.name}</span>
                            <span className="font-mono text-emerald-400 font-bold">Qty: {item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-850 flex justify-between items-center">
                      <span className="text-[10px] text-slate-500 font-mono">Weight: {selectedShipment.totalWeightKg} kg</span>
                      <button
                        onClick={() => handleOpenPackingSlip(selectedShipment.id)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold transition flex items-center space-x-1.5 text-xs border border-slate-700"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#febd69]" />
                        <span>View Packing Slip</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Modal Footer */}
        <div className="border-t border-slate-800 pt-4 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-mono text-[10px]">
            Commerce Zon Global Logistics Engine • Verified Courier Tracking
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>

      {/* Embedded Printable Packing Slip Modal */}
      {showSlipModal && packingSlip && (
        <div className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 text-slate-900">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto font-sans">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900">COMMERCE ZON PACKING SLIP</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Slip Ref: {packingSlip.packingSlipNumber} • Order: {packingSlip.orderNumber}
                </p>
              </div>
              <button
                onClick={() => setShowSlipModal(false)}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Official Disclaimer (Requirement 8) */}
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-xs font-bold text-center">
              {packingSlip.disclaimer}
            </div>

            {/* Merchant and Buyer Info */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="border p-3 rounded-xl bg-slate-50">
                <span className="font-mono text-[10px] uppercase text-slate-500 font-bold block mb-1">
                  SHIP FROM (MERCHANT):
                </span>
                <p className="font-bold text-slate-900">{packingSlip.seller.name}</p>
                <p className="text-slate-600 text-[11px] leading-tight mt-1">{packingSlip.seller.address}</p>
              </div>

              <div className="border p-3 rounded-xl bg-slate-50">
                <span className="font-mono text-[10px] uppercase text-slate-500 font-bold block mb-1">
                  SHIP TO (CUSTOMER):
                </span>
                <p className="font-bold text-slate-900">{packingSlip.buyer.name}</p>
                <p className="text-slate-600 text-[11px] leading-tight mt-1">{packingSlip.buyer.shippingAddress}</p>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="border rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-600 font-mono text-[11px] uppercase border-b">
                  <tr>
                    <th className="py-2.5 px-3">SKU</th>
                    <th className="py-2.5 px-3">Item Description</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Unit Price</th>
                    <th className="py-2.5 px-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-800 font-mono">
                  {packingSlip.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{it.sku}</td>
                      <td className="py-2.5 px-3 font-sans">{it.title}</td>
                      <td className="py-2.5 px-3 text-center font-bold">{it.quantity}</td>
                      <td className="py-2.5 px-3 text-right">${it.unitPriceUSD.toFixed(2)}</td>
                      <td className="py-2.5 px-3 text-right font-bold">${it.totalUSD.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Special Instructions & Return Policy */}
            <div className="text-xs text-slate-600 space-y-2 border-t pt-4">
              <div>
                <strong>Handling Notes:</strong> {packingSlip.specialInstructions}
              </div>
              <div className="text-[11px] text-slate-500 italic">
                {packingSlip.returnPolicyNotice}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <span className="text-[11px] font-mono text-slate-400">
                Carrier: {packingSlip.carrier} • Tracking: {packingSlip.trackingNumber}
              </span>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow"
              >
                <Printer className="w-4 h-4" />
                <span>Print Packing Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
