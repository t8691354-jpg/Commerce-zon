import React, { useState } from 'react';
import { DropshipOrder, DropshipOrderStatus } from '../../types/dropshipping';
import {
  Package,
  CheckCircle2,
  XCircle,
  Truck,
  Printer,
  QrCode,
  Search,
  Filter,
  MapPin,
  Clock,
  ShieldCheck,
} from 'lucide-react';

interface SupplierOrderFulfilmentPortalProps {
  orders: DropshipOrder[];
  onUpdateOrderStatus: (orderId: string, newStatus: DropshipOrderStatus, trackingNumber?: string) => void;
}

export const SupplierOrderFulfilmentPortal: React.FC<SupplierOrderFulfilmentPortalProps> = ({
  orders,
  onUpdateOrderStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.marketplaceOrderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.buyerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || o.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAcceptOrder = (orderId: string) => {
    onUpdateOrderStatus(orderId, 'SUPPLIER_ACCEPTED');
    alert(`Order ${orderId} Accepted by Warehouse Dock! Inventory locked.`);
  };

  const handlePackOrder = (orderId: string) => {
    onUpdateOrderStatus(orderId, 'PACKED');
    alert(`Order ${orderId} Packed & Barcode Verified.`);
  };

  const handleGenerateLabelAndShip = (orderId: string) => {
    const tracking = 'FX-' + Math.floor(880000000000 + Math.random() * 100000000000);
    onUpdateOrderStatus(orderId, 'SHIPPED', tracking);
    alert(`Shipping Label Generated! Carrier Tracking Number: ${tracking}. Order marked as SHIPPED.`);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <Package className="w-4 h-4 text-[#febd69]" />
            <span>SUPPLIER WAREHOUSE ORDER FULFILMENT PORTAL</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Order Dispatch, Packing & Shipping Label Generator</h2>
          <p className="text-xs text-slate-400 mt-1">
            Supplier warehouse portal to accept incoming dropship orders, pack items, print carrier shipping labels & update real-time tracking
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-xs">
          <Clock className="w-4 h-4 text-amber-400" />
          <span className="text-slate-300">Action Required: <strong className="text-amber-400 font-mono">
            {orders.filter((o) => ['PENDING_ROUTING', 'FULFILMENT_REQUESTED'].includes(o.orderStatus)).length} Pending
          </strong></span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Order ID, Buyer, or SKU..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-[#febd69]"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="FULFILMENT_REQUESTED">Fulfilment Requested</option>
            <option value="SUPPLIER_ACCEPTED">Supplier Accepted</option>
            <option value="PACKED">Packed</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4 text-xs">
        {filteredOrders.map((ord) => (
          <div key={ord.orderId} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center space-x-2 font-mono">
                  <span className="font-extrabold text-white text-sm">{ord.orderId}</span>
                  <span className="text-slate-500">({ord.marketplaceOrderId})</span>
                  <span className="px-2 py-0.5 bg-slate-800 text-[#febd69] text-[10px] rounded font-bold">
                    {ord.carrier}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Buyer: <strong className="text-slate-200">{ord.buyerName}</strong> ({ord.buyerEmail}) • Placed: {ord.createdAt}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span
                  className={`px-3 py-1 rounded-xl text-xs font-black uppercase ${
                    ord.orderStatus === 'DELIVERED'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : ord.orderStatus === 'SHIPPED' || ord.orderStatus === 'IN_TRANSIT'
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {ord.orderStatus}
                </span>
              </div>
            </div>

            {/* Address & Items */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 font-mono uppercase block flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  <span>Ship To Address</span>
                </span>
                <p className="font-bold text-white leading-tight">
                  {ord.shippingAddress.street}, {ord.shippingAddress.city}, {ord.shippingAddress.state} {ord.shippingAddress.zipCode}
                </p>
                <div className="text-[10px] text-slate-400 font-mono">Phone: {ord.shippingAddress.phone}</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 lg:col-span-2">
                <span className="text-[10px] text-slate-500 font-mono uppercase block">Ordered Item SKUs</span>
                <div className="space-y-2">
                  {ord.items.map((it) => (
                    <div key={it.itemId} className="flex justify-between items-center text-slate-200">
                      <div>
                        <span className="font-bold text-white">{it.productTitle}</span>
                        <span className="text-[10px] font-mono text-[#febd69] block">SKU: {it.sku}</span>
                      </div>
                      <div className="text-right font-mono">
                        <span className="text-amber-300 font-bold">Qty: {it.quantity}</span>
                        <span className="block text-slate-400 text-[10px]">Cost: ${it.totalWholesaleUSD.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
              <div className="text-[11px] font-mono text-slate-400">
                Tracking Number: {ord.trackingNumber ? <strong className="text-emerald-400">{ord.trackingNumber}</strong> : <span className="text-slate-500">Not Generated Yet</span>}
              </div>

              <div className="flex items-center space-x-2">
                {ord.orderStatus === 'FULFILMENT_REQUESTED' && (
                  <button
                    onClick={() => handleAcceptOrder(ord.orderId)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl transition flex items-center space-x-1"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Accept Order</span>
                  </button>
                )}

                {ord.orderStatus === 'SUPPLIER_ACCEPTED' && (
                  <button
                    onClick={() => handlePackOrder(ord.orderId)}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-black rounded-xl transition flex items-center space-x-1"
                  >
                    <Package className="w-4 h-4" />
                    <span>Pack & Verify Barcode</span>
                  </button>
                )}

                {ord.orderStatus === 'PACKED' && (
                  <button
                    onClick={() => handleGenerateLabelAndShip(ord.orderId)}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-black rounded-xl transition flex items-center space-x-1"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Generate Shipping Label & Ship</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
