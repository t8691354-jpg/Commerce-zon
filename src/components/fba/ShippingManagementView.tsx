import React, { useState } from 'react';
import { FBACustomerOrder, FBACarrier } from '../../types/fba';
import {
  Truck,
  Printer,
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  Search,
  ExternalLink,
} from 'lucide-react';

interface ShippingManagementViewProps {
  orders: FBACustomerOrder[];
  onDispatchOrder: (orderId: string) => void;
}

export const ShippingManagementView: React.FC<ShippingManagementViewProps> = ({
  orders,
  onDispatchOrder,
}) => {
  const [carrierFilter, setCarrierFilter] = useState<string>('ALL');

  const filteredOrders = orders.filter(
    (o) => carrierFilter === 'ALL' || o.carrier === carrierFilter
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <Truck className="w-4 h-4 text-sky-400" />
            <span>AUTOMATED CARRIER DISPATCH & SHIPPING MANAGEMENT</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Multi-Carrier Integration & Real-Time Tracking Number Engine</h2>
          <p className="text-xs text-slate-400 mt-1">
            Least-cost carrier routing (Amazon Logistics Prime, FedEx, UPS, DHL) with automated tracking barcoding & Manifest generation
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <select
            value={carrierFilter}
            onChange={(e) => setCarrierFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none"
          >
            <option value="ALL">All Shipping Carriers</option>
            <option value="AMAZON_LOGISTICS_PRIME">Amazon Logistics (AMZL Prime)</option>
            <option value="FEDEX_EXPRESS">FedEx Express</option>
            <option value="UPS_WORLDWIDE">UPS Worldwide</option>
            <option value="DHL_EXPRESS">DHL Express</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 font-mono text-xs">
        <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3">
          Staged Shipments & Carrier Pickup Manifest ({filteredOrders.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                <th className="py-3 px-3">Order ID</th>
                <th className="py-3 px-3">Buyer & Destination</th>
                <th className="py-3 px-3">Carrier & Tracking</th>
                <th className="py-3 px-3">Fulfilment Cost</th>
                <th className="py-3 px-3">Est. Delivery</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredOrders.map((o) => (
                <tr key={o.orderId} className="hover:bg-slate-800/30 transition">
                  <td className="py-3.5 px-3">
                    <span className="font-extrabold text-[#febd69] text-xs">{o.orderId}</span>
                    <span className="text-slate-500 block text-[9px]">{o.createdAt}</span>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="font-bold text-white block">{o.buyerName}</span>
                    <span className="text-slate-400 text-[10px] block truncate max-w-xs">{o.buyerAddress}</span>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 bg-slate-800 text-sky-300 rounded text-[9px] font-bold block w-fit mb-0.5">
                      {o.carrier.replace('_', ' ')}
                    </span>
                    <span className="text-emerald-400 text-[10px] font-bold">{o.trackingNumber}</span>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="text-white font-bold">${o.fulfilmentFeeUSD.toFixed(2)} Fee</span>
                    <span className="text-emerald-400 text-[9px] block">Shipping: ${o.shippingFeeUSD.toFixed(2)}</span>
                  </td>

                  <td className="py-3.5 px-3 text-slate-300 font-bold">
                    {o.estimatedDelivery}
                  </td>

                  <td className="py-3.5 px-3">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase inline-block ${
                        o.status === 'IN_TRANSIT' || o.status === 'DELIVERED'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {o.status.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    {o.status !== 'IN_TRANSIT' && o.status !== 'DELIVERED' ? (
                      <button
                        onClick={() => onDispatchOrder(o.orderId)}
                        className="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded text-[10px]"
                      >
                        Dispatch Carrier
                      </button>
                    ) : (
                      <button
                        onClick={() => alert(`Tracking Carrier Manifest for ${o.trackingNumber}:\nCarrier: ${o.carrier}\nStatus: In Transit to Destination Hub`)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] flex items-center space-x-1 ml-auto"
                      >
                        <span>Manifest</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
