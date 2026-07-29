import React, { useState } from 'react';
import { DropshipOrder, CarrierCode } from '../../types/dropshipping';
import {
  Truck,
  Globe,
  MapPin,
  CheckCircle2,
  Clock,
  Search,
  Sliders,
  DollarSign,
  ShieldCheck,
  Package,
} from 'lucide-react';

interface ShippingAndOrderTrackingViewProps {
  orders: DropshipOrder[];
}

export const ShippingAndOrderTrackingView: React.FC<ShippingAndOrderTrackingViewProps> = ({
  orders,
}) => {
  const [selectedOrder, setSelectedOrder] = useState<DropshipOrder>(orders[0]);

  const carrierMatrix = [
    { code: 'FEDEX', name: 'FedEx Express & Ground', ratePerKg: '$4.20', avgTransitDays: '1-3 Days', APIStatus: 'CONNECTED' },
    { code: 'UPS', name: 'UPS Worldwide Saver', ratePerKg: '$3.90', avgTransitDays: '2-4 Days', APIStatus: 'CONNECTED' },
    { code: 'DHL', name: 'DHL Express International', ratePerKg: '$6.50', avgTransitDays: '2-5 Days', APIStatus: 'CONNECTED' },
    { code: 'AMAZON_LOGISTICS', name: 'Amazon Logistics Prime (AMZL)', ratePerKg: '$2.80', avgTransitDays: '1-2 Days', APIStatus: 'CONNECTED' },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <Truck className="w-4 h-4 text-sky-400" />
            <span>MULTI-CARRIER LOGISTICS & LIVE ORDER TRACKING ENGINE</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Shipping Carrier Integration & Real-Time Package Tracker</h2>
          <p className="text-xs text-slate-400 mt-1">
            Carrier rate matrices, API Webhook event listeners & step-by-step buyer package tracking timeline
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-xl text-xs text-emerald-400 font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>Carriers Webhook Active</span>
        </div>
      </div>

      {/* Carrier Matrix */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 text-xs">
        <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-2 border-b border-slate-800 pb-3">
          <Globe className="w-4 h-4 text-[#febd69]" />
          <span>Integrated Shipping Carriers & Rate Matrix</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {carrierMatrix.map((c) => (
            <div key={c.code} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-white text-xs">{c.name}</span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[9px] font-bold rounded">
                  {c.APIStatus}
                </span>
              </div>

              <div className="text-[10px] text-slate-400 font-mono space-y-1 pt-1">
                <div>Base Rate: <strong className="text-emerald-400">{c.ratePerKg} / kg</strong></div>
                <div>Transit Estimate: <strong className="text-white">{c.avgTransitDays}</strong></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Order Timeline Viewer */}
      {selectedOrder && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
          {/* Order Selector */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 lg:col-span-1">
            <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3">
              Select Active Dropship Order
            </h3>

            <div className="space-y-2 max-h-80 overflow-y-auto">
              {orders.map((ord) => (
                <div
                  key={ord.orderId}
                  onClick={() => setSelectedOrder(ord)}
                  className={`p-3 rounded-xl border cursor-pointer transition space-y-1 ${
                    selectedOrder.orderId === ord.orderId
                      ? 'bg-slate-800 border-[#febd69] ring-2 ring-amber-400/20'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between font-mono text-[11px]">
                    <span className="font-bold text-white">{ord.orderId}</span>
                    <span className="text-[#febd69]">{ord.carrier}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">Buyer: {ord.buyerName}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Visualizer */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6 lg:col-span-2">
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-black text-white">
                  Live Tracking Timeline for Order {selectedOrder.orderId}
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  Carrier: <strong className="text-white">{selectedOrder.carrier}</strong> • Tracking #: <strong className="text-emerald-400 font-mono">{selectedOrder.trackingNumber || 'Pending'}</strong>
                </p>
              </div>

              <div className="text-right font-mono text-xs">
                <span className="text-slate-400 block text-[10px] uppercase">Est. Delivery</span>
                <span className="text-emerald-400 font-bold">{selectedOrder.estimatedDeliveryDate}</span>
              </div>
            </div>

            {/* Steps Timeline */}
            <div className="space-y-4">
              {selectedOrder.trackingTimeline.map((ev, idx) => (
                <div key={ev.id} className="flex items-start space-x-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-slate-950 border border-[#febd69] flex items-center justify-center text-[#febd69] font-bold text-xs">
                      {idx + 1}
                    </div>
                    {idx < selectedOrder.trackingTimeline.length - 1 && (
                      <div className="w-0.5 h-10 bg-slate-800 my-1" />
                    )}
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex-1 space-y-1">
                    <div className="flex justify-between items-center font-mono">
                      <span className="font-bold text-white text-xs">{ev.status}</span>
                      <span className="text-[10px] text-slate-500">{ev.timestamp}</span>
                    </div>
                    <p className="text-slate-300 text-xs">{ev.description}</p>
                    <div className="text-[10px] text-slate-500 font-mono">Location: {ev.location}</div>
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
