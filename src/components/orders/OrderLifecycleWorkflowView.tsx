import React, { useState } from 'react';
import { ComprehensiveMasterOrder, OrderLifecycleStatus, UserRole } from '../../types/oms';
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  RotateCcw,
  XCircle,
  AlertCircle,
  Play,
  ArrowRight,
  ShieldCheck,
  User,
  Building2,
  Sparkles,
} from 'lucide-react';

interface OrderLifecycleWorkflowViewProps {
  orders: ComprehensiveMasterOrder[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderLifecycleStatus, actorName: string, note: string) => void;
}

const LIFECYCLE_STAGES: { status: OrderLifecycleStatus; label: string; desc: string }[] = [
  { status: 'CART', label: '1. Cart', desc: 'Customer selected items' },
  { status: 'CHECKOUT', label: '2. Checkout', desc: 'Addresses & payment entered' },
  { status: 'PAYMENT_PENDING', label: '3. Payment Pending', desc: 'Awaiting 3D Secure verification' },
  { status: 'PAYMENT_SUCCESS', label: '4. Payment Successful', desc: 'Funds authorized & captured' },
  { status: 'ORDER_CONFIRMED', label: '5. Order Confirmed', desc: 'Dispatched to vendor OMS' },
  { status: 'SELLER_ACCEPTED', label: '6. Seller Accepted', desc: 'Vendor accepted fulfillment' },
  { status: 'PROCESSING', label: '7. Processing', desc: 'Stock allocated in warehouse' },
  { status: 'PACKED', label: '8. Packed', desc: 'Thermal shipping box sealed' },
  { status: 'READY_FOR_SHIPMENT', label: '9. Ready for Shipment', desc: 'Handed to staging dock' },
  { status: 'SHIPPED', label: '10. Shipped', desc: 'Carrier manifest generated' },
  { status: 'IN_TRANSIT', label: '11. In Transit', desc: 'Air/Ground haul in progress' },
  { status: 'OUT_FOR_DELIVERY', label: '12. Out for Delivery', desc: 'On final mile delivery van' },
  { status: 'DELIVERED', label: '13. Delivered', desc: 'Handed over / POD proof' },
  { status: 'COMPLETED', label: '14. Completed', desc: 'Order settled & closed' },
];

export const OrderLifecycleWorkflowView: React.FC<OrderLifecycleWorkflowViewProps> = ({
  orders,
  onUpdateOrderStatus,
}) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || '');
  const [transitionNote, setTransitionNote] = useState('');
  const [actorName, setActorName] = useState('Amazon OMS Controller');

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  const getCurrentStageIndex = (status: OrderLifecycleStatus) => {
    return LIFECYCLE_STAGES.findIndex((s) => s.status === status);
  };

  const handleAdvanceStatus = (nextStatus: OrderLifecycleStatus) => {
    if (!selectedOrder) return;
    onUpdateOrderStatus(
      selectedOrder.id,
      nextStatus,
      actorName,
      transitionNote.trim() || `Automated state transition to ${nextStatus}`
    );
    setTransitionNote('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <Play className="w-4 h-4 text-emerald-400" />
            <span>14-STAGE STATE MACHINE ENGINE</span>
          </div>
          <h2 className="text-base font-black text-white mt-0.5">
            End-to-End Order Lifecycle & Timeline Audit State Engine
          </h2>
          <p className="text-xs text-slate-400">
            Real-time state transitions from Cart Checkout to Warehouse Packing, Courier Transit & Settlement
          </p>
        </div>

        {/* Select Order Dropdown */}
        <div className="flex items-center space-x-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 font-bold">Select Order:</span>
          <select
            value={selectedOrderId}
            onChange={(e) => setSelectedOrderId(e.target.value)}
            className="bg-slate-900 text-white font-mono font-bold text-xs p-1.5 rounded-lg border border-slate-700 focus:outline-none"
          >
            {orders.map((o) => (
              <option key={o.id} value={o.id}>
                {o.orderNumber} - {o.customerName.slice(0, 20)} ({o.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedOrder && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: 14 Stage Progression Stepper */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase">Master Order ID</span>
                <h3 className="text-sm font-black text-white font-mono">{selectedOrder.orderNumber}</h3>
              </div>

              <div className="px-3 py-1 bg-amber-500/20 text-[#febd69] border border-amber-500/30 rounded-xl text-xs font-black">
                Current Status: {selectedOrder.status}
              </div>
            </div>

            {/* Stepper Grid */}
            <div className="space-y-2">
              {LIFECYCLE_STAGES.map((stg, idx) => {
                const currentIdx = getCurrentStageIndex(selectedOrder.status);
                const isPassed = currentIdx >= idx && currentIdx !== -1;
                const isCurrent = currentIdx === idx;

                return (
                  <div
                    key={stg.status}
                    className={`p-3 rounded-xl border transition flex items-center justify-between ${
                      isCurrent
                        ? 'bg-amber-500/20 border-amber-500/60 shadow-lg'
                        : isPassed
                        ? 'bg-slate-950/80 border-slate-800 text-slate-300'
                        : 'bg-slate-950/40 border-slate-900 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-black ${
                          isCurrent
                            ? 'bg-[#febd69] text-slate-950'
                            : isPassed
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {isPassed && !isCurrent ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                      </div>

                      <div>
                        <div className="text-xs font-bold text-white">{stg.label}</div>
                        <div className="text-[10px] text-slate-400">{stg.desc}</div>
                      </div>
                    </div>

                    {!isCurrent && isPassed && (
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">Passed ✓</span>
                    )}

                    {!isCurrent && !isPassed && (
                      <button
                        onClick={() => handleAdvanceStatus(stg.status)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-[#febd69] hover:text-slate-950 text-slate-300 text-[10px] font-bold rounded-lg transition"
                      >
                        Jump to Stage
                      </button>
                    )}

                    {isCurrent && (
                      <span className="px-2 py-0.5 bg-[#febd69] text-slate-950 text-[10px] font-black uppercase rounded animate-pulse">
                        Active Stage
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quick State Transition Actions */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
              <h4 className="text-xs font-black text-white uppercase tracking-wider">
                Simulate Manual Workflow Action Trigger
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Actor Name (e.g. Courier Agent / Merchant)"
                  value={actorName}
                  onChange={(e) => setActorName(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-white p-2 rounded-xl text-xs focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Timeline Note / Reason"
                  value={transitionNote}
                  onChange={(e) => setTransitionNote(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-white p-2 rounded-xl text-xs focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={() => handleAdvanceStatus('PROCESSING')}
                  className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl transition"
                >
                  Mark Processing
                </button>
                <button
                  onClick={() => handleAdvanceStatus('PACKED')}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl transition"
                >
                  Mark Packed
                </button>
                <button
                  onClick={() => handleAdvanceStatus('SHIPPED')}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition"
                >
                  Dispatch Shipment
                </button>
                <button
                  onClick={() => handleAdvanceStatus('OUT_FOR_DELIVERY')}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition"
                >
                  Out for Delivery
                </button>
                <button
                  onClick={() => handleAdvanceStatus('DELIVERED')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition"
                >
                  Mark Delivered
                </button>
                <button
                  onClick={() => handleAdvanceStatus('CANCELLED')}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition"
                >
                  Cancel Order
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Timeline Event Audit Log */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
            <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-[#febd69]" />
              <span>Immutable Timeline Audit Logs ({selectedOrder.timeline.length})</span>
            </h3>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {selectedOrder.timeline.map((event) => (
                <div
                  key={event.id}
                  className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-1 relative pl-8"
                >
                  <div className="w-2.5 h-2.5 bg-amber-400 rounded-full absolute left-3 top-4 shadow" />
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-amber-300 uppercase font-mono">{event.status}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-200">{event.note}</p>

                  <div className="text-[10px] text-slate-400 font-mono flex items-center space-x-1 pt-1">
                    <span className="px-1.5 py-0.5 bg-slate-800 rounded font-bold">{event.actorRole}</span>
                    <span>• {event.actorName}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
