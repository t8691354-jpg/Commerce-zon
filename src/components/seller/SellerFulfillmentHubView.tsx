import React, { useState, useEffect } from 'react';
import {
  Truck,
  Package,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Printer,
  ExternalLink,
  Search,
  Filter,
  FileText,
  MapPin,
  Calendar,
  Globe,
  User,
  ShieldAlert,
  ArrowRight,
  Info,
  RefreshCw,
  X,
} from 'lucide-react';
import {
  ShipmentRecord,
  FulfillmentStatus,
  PackingSlip,
  ShippingMethodCode,
} from '../../types/shippingFulfillment';
import { shippingFulfillmentClient } from '../../services/shippingFulfillmentClient';
import { CONFIGURED_CARRIERS } from '../../domain/logistics/CarrierProviderFramework';

interface SellerFulfillmentHubViewProps {
  sellerId: string;
  sellerName: string;
  sellerOrders: any[];
  onOrderUpdated?: () => void;
}

export const SellerFulfillmentHubView: React.FC<SellerFulfillmentHubViewProps> = ({
  sellerId,
  sellerName,
  sellerOrders,
  onOrderUpdated,
}) => {
  const [shipments, setShipments] = useState<ShipmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'UNFULFILLED' | 'IN_TRANSIT' | 'DELIVERED' | 'EXCEPTIONS'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [selectedShipmentForDetail, setSelectedShipmentForDetail] = useState<ShipmentRecord | null>(null);
  const [packingSlipData, setPackingSlipData] = useState<PackingSlip | null>(null);
  const [isPackingSlipLoading, setIsPackingSlipLoading] = useState(false);
  const [orderToFulfill, setOrderToFulfill] = useState<any | null>(null);
  const [exceptionModalShipment, setExceptionModalShipment] = useState<ShipmentRecord | null>(null);

  // Fulfillment form states
  const [carrierName, setCarrierName] = useState('FedEx Priority Global');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shippingMethod, setShippingMethod] = useState<ShippingMethodCode>('STANDARD');
  const [dispatchNotes, setDispatchNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Customs info for international shipments
  const [isInternational, setIsInternational] = useState(false);
  const [hsCode, setHsCode] = useState('8542.31');
  const [declaredValueUSD, setDeclaredValueUSD] = useState<number>(0);
  const [contentsType, setContentsType] = useState<'MERCHANDISE' | 'GIFT' | 'SAMPLE' | 'DOCUMENT'>('MERCHANDISE');

  // Exception form states
  const [exceptionReason, setExceptionReason] = useState('Customer address incomplete — awaiting clarification');
  const [exceptionType, setExceptionType] = useState('ADDRESS_INCOMPLETE');

  // Load Shipments
  const loadShipments = async () => {
    setLoading(true);
    try {
      const data = await shippingFulfillmentClient.getSellerShipments(sellerId);
      setShipments(data);
    } catch (err: any) {
      console.error('Failed to load seller shipments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShipments();
  }, [sellerId]);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  // Open Fulfill Order Modal
  const handleOpenFulfillModal = (order: any) => {
    setOrderToFulfill(order);
    setErrorMessage(null);
    setTrackingNumber('');
    setDispatchNotes('');
    setCarrierName('FedEx Priority Global');
    
    // Check if international: assuming seller origin US
    const isDestIntl = order.customerCountry && order.customerCountry.toUpperCase() !== 'US';
    setIsInternational(isDestIntl);
    setDeclaredValueUSD(order.sellerGrossAmount || 50);
  };

  // Submit Shipment Creation (Dispatch)
  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderToFulfill) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const items = (orderToFulfill.merchantItems || []).map((i: any) => ({
        sku: i.sku || `SKU-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
        name: i.title || i.productTitle || 'Marketplace Item',
        quantity: i.quantity,
        unitPriceUSD: i.price?.amount || i.unitPrice || 0,
        unitWeightKg: i.weightKg || 1.2,
        sellerId: sellerId,
      }));

      const payload = {
        sellerId,
        sellerName,
        orderId: orderToFulfill.orderId,
        orderNumber: orderToFulfill.orderNumber,
        buyerId: orderToFulfill.buyerId || 'buyer-cust-01',
        buyerName: orderToFulfill.customerName,
        buyerEmail: orderToFulfill.customerEmail || 'buyer@example.com',
        carrierName,
        trackingNumber: trackingNumber.trim() || undefined,
        shippingMethod,
        originAddress: {
          fullName: `${sellerName} Distribution Warehouse`,
          streetLine1: '100 Logistics Way, Suite 4B',
          city: 'Newark',
          stateOrProvince: 'NJ',
          postalCode: '07102',
          countryCode: 'US',
          phone: '+1-800-555-0199',
        },
        destinationAddress: {
          fullName: orderToFulfill.customerName,
          streetLine1: orderToFulfill.customerAddress || '742 Evergreen Terrace',
          city: orderToFulfill.customerCity || 'Springfield',
          stateOrProvince: orderToFulfill.customerState || 'OR',
          postalCode: orderToFulfill.customerZip || '97477',
          countryCode: orderToFulfill.customerCountry || 'US',
        },
        items,
        dispatchNotes,
        isManualFulfillment: true,
        customsInfo: isInternational
          ? {
              hsCode,
              declaredValueUSD: Number(declaredValueUSD),
              countryOfOrigin: 'US',
              contentsType,
              dutiesPaidByBuyer: true,
            }
          : undefined,
      };

      const newShipment = await shippingFulfillmentClient.createShipment(payload);
      showToast(`Shipment ${newShipment.shipmentId} created successfully for Order #${orderToFulfill.orderNumber}!`);
      setOrderToFulfill(null);
      await loadShipments();
      if (onOrderUpdated) onOrderUpdated();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to dispatch shipment');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Advance Status (e.g. PACKED, READY_FOR_DISPATCH, SHIPPED)
  const handleUpdateStatus = async (shipmentId: string, newStatus: FulfillmentStatus, notes?: string) => {
    try {
      await shippingFulfillmentClient.updateShipmentStatus(shipmentId, {
        actor: { id: sellerId, role: 'SELLER' },
        newStatus,
        description: notes || `Shipment advanced to ${newStatus} by merchant warehouse staff`,
      });
      showToast(`Shipment status updated to ${newStatus}`);
      await loadShipments();
      if (selectedShipmentForDetail && selectedShipmentForDetail.id === shipmentId) {
        const fresh = await shippingFulfillmentClient.getShipment(shipmentId);
        setSelectedShipmentForDetail(fresh);
      }
    } catch (err: any) {
      alert(`Status update error: ${err.message}`);
    }
  };

  // Submit Exception
  const handleReportException = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exceptionModalShipment) return;

    try {
      await shippingFulfillmentClient.updateShipmentStatus(exceptionModalShipment.id, {
        actor: { id: sellerId, role: 'SELLER' },
        newStatus: 'DELIVERY_EXCEPTION',
        exceptionType,
        exceptionReason,
        description: `Seller reported exception: ${exceptionReason}`,
      });
      showToast(`Delivery exception recorded for ${exceptionModalShipment.shipmentId}`);
      setExceptionModalShipment(null);
      await loadShipments();
    } catch (err: any) {
      alert(`Failed to record exception: ${err.message}`);
    }
  };

  // View Packing Slip
  const handleViewPackingSlip = async (shipmentId: string) => {
    setIsPackingSlipLoading(true);
    try {
      const slip = await shippingFulfillmentClient.getPackingSlip(shipmentId, sellerId);
      setPackingSlipData(slip);
    } catch (err: any) {
      alert(`Could not generate packing slip: ${err.message}`);
    } finally {
      setIsPackingSlipLoading(false);
    }
  };

  // Filter orders needing fulfillment (orders with no shipment created yet)
  const unfulfilledOrders = sellerOrders.filter(
    (order) => !shipments.some((s) => s.orderId === order.orderId && s.status !== 'CANCELLED')
  );

  // Filter active shipments
  const activeShipments = shipments.filter(
    (s) => ['PROCESSING', 'PACKED', 'READY_FOR_DISPATCH', 'SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'].includes(s.status)
  );
  const deliveredShipments = shipments.filter((s) => s.status === 'DELIVERED');
  const exceptionShipments = shipments.filter((s) => ['DELAYED', 'DELIVERY_EXCEPTION', 'RETURNED_TO_SENDER'].includes(s.status));

  const filteredShipments = shipments.filter((s) => {
    if (statusFilter === 'IN_TRANSIT') {
      return ['SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'].includes(s.status);
    }
    if (statusFilter === 'DELIVERED') {
      return s.status === 'DELIVERED';
    }
    if (statusFilter === 'EXCEPTIONS') {
      return ['DELAYED', 'DELIVERY_EXCEPTION', 'RETURNED_TO_SENDER'].includes(s.status);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.shipmentId.toLowerCase().includes(q) ||
        s.orderNumber.toLowerCase().includes(q) ||
        s.trackingNumber.toLowerCase().includes(q) ||
        s.buyerName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 text-xs font-bold animate-fade-in border border-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header and Quick Stats */}
      <div className="bg-[#131921] border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-[#febd69] uppercase tracking-wider font-bold">
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>COMMERCE ZON GLOBAL FULFILLMENT & LOGISTICS ENGINE</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">Merchant Shipping & Dispatch Center</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Fulfill customer orders, assign courier manifests, print official packing slips, and monitor delivery timelines
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={loadShipments}
              className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 transition flex items-center space-x-1.5 text-xs font-semibold"
              title="Refresh Shipments"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          <div
            onClick={() => setStatusFilter('UNFULFILLED')}
            className={`p-4 rounded-xl border cursor-pointer transition ${
              statusFilter === 'UNFULFILLED'
                ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-400">Awaiting Dispatch</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black font-mono text-amber-400 mt-2">{unfulfilledOrders.length}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Orders ready to pick & pack</div>
          </div>

          <div
            onClick={() => setStatusFilter('IN_TRANSIT')}
            className={`p-4 rounded-xl border cursor-pointer transition ${
              statusFilter === 'IN_TRANSIT'
                ? 'bg-sky-500/10 border-sky-500 text-sky-300'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-400">In Transit</span>
              <Truck className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl font-black font-mono text-sky-400 mt-2">{activeShipments.length}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Dispatched with couriers</div>
          </div>

          <div
            onClick={() => setStatusFilter('DELIVERED')}
            className={`p-4 rounded-xl border cursor-pointer transition ${
              statusFilter === 'DELIVERED'
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-400">Delivered</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black font-mono text-emerald-400 mt-2">{deliveredShipments.length}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Completed deliveries</div>
          </div>

          <div
            onClick={() => setStatusFilter('EXCEPTIONS')}
            className={`p-4 rounded-xl border cursor-pointer transition ${
              statusFilter === 'EXCEPTIONS'
                ? 'bg-rose-500/10 border-rose-500 text-rose-300'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-400">Exceptions / Delayed</span>
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-black font-mono text-rose-400 mt-2">{exceptionShipments.length}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Attention needed</div>
          </div>
        </div>
      </div>

      {/* FILTER TABS & SEARCH */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          {(['ALL', 'UNFULFILLED', 'IN_TRANSIT', 'DELIVERED', 'EXCEPTIONS'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                statusFilter === tab
                  ? 'bg-[#febd69] text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tab === 'ALL' && 'All Shipments'}
              {tab === 'UNFULFILLED' && `Unfulfilled Orders (${unfulfilledOrders.length})`}
              {tab === 'IN_TRANSIT' && `In Transit (${activeShipments.length})`}
              {tab === 'DELIVERED' && `Delivered (${deliveredShipments.length})`}
              {tab === 'EXCEPTIONS' && `Exceptions (${exceptionShipments.length})`}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search order #, tracking, buyer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#febd69] w-full sm:w-64"
          />
        </div>
      </div>

      {/* SECTION 1: ORDERS AWAITING FULFILLMENT */}
      {(statusFilter === 'ALL' || statusFilter === 'UNFULFILLED') && unfulfilledOrders.length > 0 && (
        <div className="bg-[#131921] border border-amber-900/50 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Package className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">
                Orders Requiring Seller Fulfillment ({unfulfilledOrders.length})
              </h3>
            </div>
            <span className="text-[10px] text-amber-400 font-mono bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
              Allocated to {sellerName}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {unfulfilledOrders.map((order) => (
              <div
                key={order.orderId}
                className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 hover:border-amber-500/50 transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-black font-mono text-[#febd69]">{order.orderNumber}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Buyer: <strong className="text-slate-200">{order.customerName}</strong>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded text-[10px] font-bold">
                    Pending Dispatch
                  </span>
                </div>

                {/* Items allocated to this merchant */}
                <div className="bg-slate-900/80 rounded-lg p-2.5 space-y-1.5 border border-slate-800 text-xs">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    Allocated Merchant Items:
                  </span>
                  {(order.merchantItems || []).map((i: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-slate-300 text-[11px]">
                      <span className="truncate max-w-[200px]">{i.title || i.productTitle || 'Product SKU'}</span>
                      <span className="font-mono text-white font-bold">x{i.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Destination & Shipping Method */}
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <div className="flex items-center space-x-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span className="truncate">{order.customerCity}, {order.customerCountry}</span>
                  </div>
                  <div className="font-mono text-emerald-400 font-bold">
                    Net: ${order.sellerNetPayout?.toFixed(2) || '0.00'}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-slate-800 flex justify-end items-center space-x-2">
                  <button
                    onClick={() => handleOpenFulfillModal(order)}
                    className="px-4 py-1.5 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black rounded-xl text-xs transition shadow flex items-center space-x-1.5"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Create Shipment & Dispatch</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: ACTIVE & HISTORICAL SHIPMENTS TABLE */}
      {statusFilter !== 'UNFULFILLED' && (
        <div className="bg-[#131921] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Truck className="w-4 h-4 text-sky-400" />
              <span>Registered Carrier Shipments & Manifests</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {filteredShipments.length} total records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-950 text-slate-400 uppercase border-b border-slate-800 text-[10px] font-mono">
                <tr>
                  <th className="py-3 px-3">Shipment Ref</th>
                  <th className="py-3 px-3">Order Number</th>
                  <th className="py-3 px-3">Recipient & Destination</th>
                  <th className="py-3 px-3">Courier & Tracking</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-center">Est. Delivery</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-sans">
                {filteredShipments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      No shipment records found matching current filter.
                    </td>
                  </tr>
                ) : (
                  filteredShipments.map((shp) => {
                    const isException = ['DELAYED', 'DELIVERY_EXCEPTION', 'RETURNED_TO_SENDER'].includes(shp.status);
                    const isDelivered = shp.status === 'DELIVERED';

                    return (
                      <tr key={shp.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 px-3 font-mono font-bold text-white">
                          {shp.shipmentId}
                          <div className="text-[10px] text-slate-500 font-sans">
                            {new Date(shp.createdAt).toLocaleDateString()}
                          </div>
                        </td>

                        <td className="py-3 px-3 font-mono text-[#febd69] font-bold">
                          {shp.orderNumber}
                        </td>

                        <td className="py-3 px-3">
                          <div className="font-bold text-white">{shp.buyerName}</div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                            {shp.destinationAddress.city}, {shp.destinationAddress.countryCode}
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <div className="font-semibold text-sky-300">{shp.carrierName}</div>
                          <div className="font-mono text-[11px] text-slate-400 flex items-center space-x-1">
                            <span>#{shp.trackingNumber}</span>
                            {shp.trackingUrl && (
                              <a
                                href={shp.trackingUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sky-400 hover:text-sky-300"
                                title="Open verified tracking page"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-3 text-center">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              isDelivered
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                                : isException
                                ? 'bg-rose-950 text-rose-300 border-rose-800'
                                : 'bg-sky-950 text-sky-300 border-sky-800'
                            }`}
                          >
                            {shp.status.replace(/_/g, ' ')}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-center font-mono text-slate-300">
                          {shp.estimatedDeliveryDate || 'N/A'}
                        </td>

                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            {/* Packing Slip */}
                            <button
                              onClick={() => handleViewPackingSlip(shp.id)}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition"
                              title="Print Official Warehouse Packing Slip"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>

                            {/* View Detail & History Timeline */}
                            <button
                              onClick={() => setSelectedShipmentForDetail(shp)}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg text-[10px] transition"
                            >
                              Details
                            </button>

                            {/* Step Progression where authorized */}
                            {shp.status === 'PROCESSING' && (
                              <button
                                onClick={() => handleUpdateStatus(shp.id, 'PACKED')}
                                className="px-2 py-1 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/50 text-[10px] font-bold rounded-lg transition"
                              >
                                Mark Packed
                              </button>
                            )}

                            {shp.status === 'PACKED' && (
                              <button
                                onClick={() => handleUpdateStatus(shp.id, 'READY_FOR_DISPATCH')}
                                className="px-2 py-1 bg-sky-600/30 hover:bg-sky-600/50 text-sky-300 border border-sky-500/50 text-[10px] font-bold rounded-lg transition"
                              >
                                Ready Dock
                              </button>
                            )}

                            {shp.status === 'READY_FOR_DISPATCH' && (
                              <button
                                onClick={() => handleUpdateStatus(shp.id, 'SHIPPED')}
                                className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold rounded-lg transition"
                              >
                                Dispatch
                              </button>
                            )}

                            {/* Record exception */}
                            {!isDelivered && shp.status !== 'CANCELLED' && (
                              <button
                                onClick={() => setExceptionModalShipment(shp)}
                                className="p-1 text-slate-500 hover:text-rose-400 transition"
                                title="Report Delivery Delay or Exception"
                              >
                                <AlertTriangle className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: CREATE SHIPMENT & DISPATCH */}
      {orderToFulfill && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131921] border border-slate-800 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Truck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">
                  Dispatch Shipment for Order #{orderToFulfill.orderNumber}
                </h3>
              </div>
              <button onClick={() => setOrderToFulfill(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-950/80 border border-red-800 text-red-300 rounded-xl text-xs font-semibold">
                {errorMessage}
              </div>
            )}

            {/* Recipient & Destination Summary */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Delivery Address:</span>
              <p className="font-bold text-white">{orderToFulfill.customerName}</p>
              <p className="text-slate-400">
                {orderToFulfill.customerCity}, {orderToFulfill.customerCountry}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateShipment} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Carrier / Courier *</label>
                  <select
                    value={carrierName}
                    onChange={(e) => setCarrierName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#febd69]"
                  >
                    {Object.values(CONFIGURED_CARRIERS).map((c) => (
                      <option key={c.carrierId} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Shipping Method</label>
                  <select
                    value={shippingMethod}
                    onChange={(e) => setShippingMethod(e.target.value as ShippingMethodCode)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#febd69]"
                  >
                    <option value="STANDARD">Standard Delivery</option>
                    <option value="EXPRESS">Express Air (Priority)</option>
                    <option value="SAME_DAY">Same-Day Courier</option>
                    <option value="LOCAL_DELIVERY">Local Van Delivery</option>
                    <option value="INTERNATIONAL">International Freight</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300 flex items-center justify-between">
                  <span>Carrier Tracking Number</span>
                  <span className="text-[10px] text-slate-500 font-normal">Leave blank to auto-generate</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 794918239012 (optional)"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-[#febd69]"
                />
              </div>

              {/* International Customs Section if applicable */}
              {isInternational && (
                <div className="bg-slate-900/80 border border-indigo-900/60 rounded-xl p-3 space-y-3">
                  <div className="flex items-center space-x-1.5 text-indigo-400 font-bold text-xs">
                    <Globe className="w-4 h-4" />
                    <span>Cross-Border International Customs Declaration</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold">HS Tariff Code</label>
                      <input
                        type="text"
                        value={hsCode}
                        onChange={(e) => setHsCode(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold">Declared Value (USD)</label>
                      <input
                        type="number"
                        value={declaredValueUSD}
                        onChange={(e) => setDeclaredValueUSD(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold">Contents Type</label>
                      <select
                        value={contentsType}
                        onChange={(e) => setContentsType(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-white"
                      >
                        <option value="MERCHANDISE">Merchandise</option>
                        <option value="SAMPLE">Commercial Sample</option>
                        <option value="GIFT">Gift</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Handling & Packaging Instructions</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Fragile glass components enclosed. Enclosed with anti-static wrapping."
                  value={dispatchNotes}
                  onChange={(e) => setDispatchNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#febd69]"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setOrderToFulfill(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black rounded-xl transition shadow flex items-center space-x-1.5 disabled:opacity-50"
                >
                  <Truck className="w-4 h-4" />
                  <span>{isSubmitting ? 'Registering...' : 'Dispatch & Notify Buyer'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: OFFICIAL WAREHOUSE PACKING SLIP (Requirement 8) */}
      {packingSlipData && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-slate-950 rounded-2xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Header & Disclaimer */}
            <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight">COMMERCE ZON PACKING SLIP</h2>
                <div className="text-xs font-mono font-bold text-slate-600 mt-0.5">
                  Slip Ref: {packingSlipData.packingSlipNumber} • Order: {packingSlipData.orderNumber}
                </div>
              </div>
              <button
                onClick={() => setPackingSlipData(null)}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-950 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Strict Regulatory Disclaimer */}
            <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-3 text-[10px] text-amber-950 font-mono font-bold leading-relaxed">
              ⚠️ {packingSlipData.disclaimer}
            </div>

            {/* Merchant & Customer Addresses */}
            <div className="grid grid-cols-2 gap-4 text-xs font-sans">
              <div className="p-3 bg-slate-100 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-500">Origin / Shipper:</span>
                <div className="font-bold text-slate-900 mt-1">{packingSlipData.seller.name}</div>
                <div className="text-slate-600 mt-0.5">{packingSlipData.seller.address}</div>
                <div className="text-slate-500 text-[11px] mt-1">{packingSlipData.seller.email}</div>
              </div>

              <div className="p-3 bg-slate-100 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-500">Deliver To:</span>
                <div className="font-bold text-slate-900 mt-1">{packingSlipData.buyer.name}</div>
                <div className="text-slate-600 mt-0.5">{packingSlipData.buyer.shippingAddress}</div>
                {packingSlipData.buyer.phone && (
                  <div className="text-slate-500 text-[11px] mt-1">Tel: {packingSlipData.buyer.phone}</div>
                )}
              </div>
            </div>

            {/* Courier & Tracking Details */}
            <div className="bg-slate-900 text-white rounded-xl p-3 flex justify-between items-center text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-400 uppercase">Assigned Courier:</span>
                <div className="font-bold text-emerald-400">{packingSlipData.carrier}</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase">Tracking Number:</span>
                <div className="font-bold text-white">{packingSlipData.trackingNumber}</div>
              </div>
            </div>

            {/* Line Items Checklist */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Itemized Packing Checklist ({packingSlipData.totalItems} Units)
              </span>
              <table className="w-full text-left text-xs border border-slate-200">
                <thead className="bg-slate-100 text-slate-600 font-mono text-[11px]">
                  <tr>
                    <th className="p-2 border">SKU</th>
                    <th className="p-2 border">Item Description</th>
                    <th className="p-2 border text-center">Qty</th>
                    <th className="p-2 border text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {packingSlipData.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-2 font-mono text-slate-700 border">{item.sku}</td>
                      <td className="p-2 font-bold text-slate-900 border">{item.title}</td>
                      <td className="p-2 text-center font-bold text-slate-900 border">{item.quantity}</td>
                      <td className="p-2 text-right font-mono text-slate-800 border">${item.unitPriceUSD.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Special Instructions & Return Policy */}
            <div className="text-xs space-y-1.5 border-t pt-3 text-slate-600">
              <p><strong>Handling Instructions:</strong> {packingSlipData.specialInstructions}</p>
              <p className="text-[11px] text-slate-500"><strong>Return Policy:</strong> {packingSlipData.returnPolicyNotice}</p>
            </div>

            {/* Print & Close */}
            <div className="flex justify-end space-x-3 pt-3 border-t">
              <button
                onClick={() => setPackingSlipData(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-100 transition"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition flex items-center space-x-1.5 shadow"
              >
                <Printer className="w-4 h-4" />
                <span>Print Document</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: SHIPMENT DETAILS & TRACKING TIMELINE */}
      {selectedShipmentForDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131921] border border-slate-800 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <Truck className="w-5 h-5 text-sky-400" />
                  <h3 className="text-base font-bold text-white">
                    Shipment {selectedShipmentForDetail.shipmentId}
                  </h3>
                </div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  Order #{selectedShipmentForDetail.orderNumber} • {selectedShipmentForDetail.carrierName}
                </div>
              </div>
              <button onClick={() => setSelectedShipmentForDetail(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status & Tracking URL */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Current Fulfillment Stage:</span>
                <div className="text-sm font-black text-sky-400 mt-0.5">
                  {selectedShipmentForDetail.status.replace(/_/g, ' ')}
                </div>
              </div>
              {selectedShipmentForDetail.trackingUrl && (
                <a
                  href={selectedShipmentForDetail.trackingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs flex items-center space-x-1 transition"
                >
                  <span>Carrier Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {/* Tracking Events Timeline */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-300 tracking-wider">
                Timestamped Transit Timeline
              </h4>
              <div className="space-y-2 border-l-2 border-slate-800 ml-2 pl-4">
                {selectedShipmentForDetail.statusHistory.map((ev) => (
                  <div key={ev.id} className="relative pb-3 text-xs">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-sky-400 border-2 border-slate-950" />
                    <div className="flex items-center justify-between font-mono text-[10px] text-slate-400">
                      <span>{new Date(ev.timestamp).toLocaleString()}</span>
                      <span className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300 font-bold">
                        {ev.actorRole}
                      </span>
                    </div>
                    <div className="font-bold text-white mt-0.5">{ev.stage.replace(/_/g, ' ')}</div>
                    <div className="text-slate-400 text-[11px]">{ev.description}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5 font-mono">{ev.location}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedShipmentForDetail(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold text-xs hover:bg-slate-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: REPORT DELIVERY EXCEPTION */}
      {exceptionModalShipment && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131921] border border-rose-900/60 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-rose-400 font-bold">
                <AlertTriangle className="w-5 h-5" />
                <span>Report Fulfillment Exception</span>
              </div>
              <button onClick={() => setExceptionModalShipment(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Recording an exception on shipment <strong className="text-white font-mono">{exceptionModalShipment.shipmentId}</strong> will flag the order for administrator review and dispatch an urgent notification to the buyer.
            </p>

            <form onSubmit={handleReportException} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-300">Exception Category</label>
                <select
                  value={exceptionType}
                  onChange={(e) => setExceptionType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white mt-1"
                >
                  <option value="ADDRESS_INCOMPLETE">Address Incomplete / Incorrect</option>
                  <option value="WEATHER_DELAY">Severe Weather Delay</option>
                  <option value="CUSTOMS_HOLD">Cross-Border Customs Clearance Hold</option>
                  <option value="RECIPIENT_UNAVAILABLE">Recipient Unavailable for Delivery</option>
                  <option value="CARRIER_CAPACITY_LIMIT">Carrier Sort Facility Capacity Issue</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-300">Operational Notes</label>
                <textarea
                  rows={3}
                  required
                  value={exceptionReason}
                  onChange={(e) => setExceptionReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white mt-1"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setExceptionModalShipment(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition"
                >
                  Record Exception
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
