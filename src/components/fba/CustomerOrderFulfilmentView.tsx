import React, { useState } from 'react';
import { FBACustomerOrder, FBAOrderStatus } from '../../types/fba';
import {
  PackageCheck,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  Boxes,
  User,
  ArrowRight,
} from 'lucide-react';

interface CustomerOrderFulfilmentViewProps {
  orders: FBACustomerOrder[];
  onAdvanceOrderStatus: (orderId: string, nextStatus: FBAOrderStatus) => void;
}

const ORDER_LIFECYCLE: { status: FBAOrderStatus; label: string }[] = [
  { status: 'ORDER_RECEIVED', label: 'Order Received' },
  { status: 'INVENTORY_RESERVED', label: 'Stock Reserved' },
  { status: 'PICKING_ACTIVE', label: 'Picking Active' },
  { status: 'PACKING_ACTIVE', label: 'Packing Verified' },
  { status: 'LABEL_GENERATED', label: 'Label Printed' },
  { status: 'CARRIER_PICKUP', label: 'Carrier Pickup' },
  { status: 'IN_TRANSIT', label: 'In Transit' },
  { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
  { status: 'DELIVERED', label: 'Delivered' },
];

export const CustomerOrderFulfilmentView: React.FC<CustomerOrderFulfilmentViewProps> = ({
  orders,
  onAdvanceOrderStatus,
}) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.orderId || '');

  const activeOrder = orders.find((o) => o.orderId === selectedOrderId) || orders[0];

  const getNextStatus = (current: FBAOrderStatus): FBAOrderStatus | null => {
    const idx = ORDER_LIFECYCLE.findIndex((l) => l.status === current);
    if (idx !== -1 && idx < ORDER_LIFECYCLE.length - 1) {
      return ORDER_LIFECYCLE[idx + 1].status;
    }
    return null;
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <PackageCheck className="w-4 h-4 text-emerald-400" />
            <span>END-TO-END FBA CUSTOMER ORDER FULFILMENT TRACKER</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">9-Stage Real-Time Order Lifecycle Pipeline</h2>
          <p className="text-xs text-slate-400 mt-1">
            Track order intake, bin reservations, pick wave assignment, box weight scale checks, carrier pickup & final delivery confirmation
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <select
            value={selectedOrderId}
            onChange={(e) => setSelectedOrderId(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white font-bold focus:outline-none focus:border-[#febd69]"
          >
            {orders.map((o) => (
              <option key={o.orderId} value={o.orderId}>
                {o.orderId} - {o.buyerName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {activeOrder && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
          {/* Order Details Panel */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 font-mono">
            <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
              <div>
                <span className="text-xs font-black text-[#febd69]">{activeOrder.orderId}</span>
                <span className="text-slate-400 text-[10px] block">Seller: {activeOrder.sellerName}</span>
              </div>
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold rounded-lg">
                {activeOrder.status}
              </span>
            </div>

            <div className="space-y-2 text-[11px] text-slate-300">
              <div>Buyer: <strong className="text-white">{activeOrder.buyerName}</strong></div>
              <div>Address: <span className="text-slate-400">{activeOrder.buyerAddress}</span></div>
              <div>Warehouse Hub: <strong className="text-emerald-400">{activeOrder.warehouseCode}</strong></div>
              <div>Carrier: <strong className="text-sky-400">{activeOrder.carrier.replace('_', ' ')}</strong></div>
              <div>Tracking: <strong className="text-amber-300">{activeOrder.trackingNumber}</strong></div>
            </div>

            {/* Line Items */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Purchased Line Items</span>
              {activeOrder.items.map((it, idx) => (
                <div key={idx} className="flex justify-between items-center text-[11px]">
                  <div>
                    <span className="text-white font-bold block">{it.productTitle}</span>
                    <span className="text-slate-400 text-[9px]">SKU: {it.sku} | FNSKU: {it.fnsku}</span>
                  </div>
                  <span className="text-emerald-400 font-bold">${it.priceUSD} x {it.qty}</span>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1 text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span>${activeOrder.subtotalUSD.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>FBA Fulfilment Fee</span>
                <span>${activeOrder.fulfilmentFeeUSD.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-extrabold text-xs pt-1 border-t border-slate-800">
                <span>Total Charge</span>
                <span>${activeOrder.totalUSD.toFixed(2)}</span>
              </div>
            </div>

            {/* Advance Button */}
            {getNextStatus(activeOrder.status) && (
              <button
                onClick={() => {
                  const ns = getNextStatus(activeOrder.status);
                  if (ns) onAdvanceOrderStatus(activeOrder.orderId, ns);
                }}
                className="w-full py-3 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black text-xs rounded-xl transition flex items-center justify-center space-x-2 shadow-lg"
              >
                <span>Advance Order Stage to {getNextStatus(activeOrder.status)}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* 9-Stage Visual Timeline */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 lg:col-span-2 font-mono">
            <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center justify-between">
              <span>Order Lifecycle Audit Trail</span>
              <span className="text-emerald-400 text-[10px]">Estimated Delivery: {activeOrder.estimatedDelivery}</span>
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {ORDER_LIFECYCLE.map((stage, idx) => {
                const currentIdx = ORDER_LIFECYCLE.findIndex((l) => l.status === activeOrder.status);
                const isPassed = idx <= currentIdx;
                const isCurrent = idx === currentIdx;

                const eventNote = activeOrder.timeline.find((t) => t.status === stage.status);

                return (
                  <div key={stage.status} className="relative flex items-start space-x-4">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold z-10 -ml-6 ${
                        isCurrent
                          ? 'bg-[#febd69] text-slate-950 ring-4 ring-[#febd69]/20'
                          : isPassed
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {idx + 1}
                    </div>

                    <div
                      className={`flex-1 p-3.5 rounded-xl border ${
                        isCurrent
                          ? 'bg-slate-950 border-[#febd69]/50 text-white'
                          : isPassed
                          ? 'bg-slate-950/60 border-slate-800 text-slate-200'
                          : 'bg-slate-950/20 border-slate-900 text-slate-600'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-xs">{stage.label}</span>
                        {eventNote && <span className="text-[9px] text-slate-400">{eventNote.timestamp}</span>}
                      </div>

                      {eventNote && <p className="text-[10px] text-slate-400 mt-1">{eventNote.description}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
