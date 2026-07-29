import React, { useState } from 'react';
import { ComprehensiveMasterOrder, OrderLifecycleStatus } from '../../types/oms';
import {
  Building2,
  PackageCheck,
  Printer,
  Truck,
  CheckCircle2,
  XCircle,
  FileText,
  Warehouse,
  Barcode,
  Search,
  Filter,
} from 'lucide-react';

interface SellerOrderProcessingViewProps {
  orders: ComprehensiveMasterOrder[];
  onUpdateStatus: (orderId: string, status: OrderLifecycleStatus, note: string) => void;
  onPrintInvoice: (order: ComprehensiveMasterOrder) => void;
}

export const SellerOrderProcessingView: React.FC<SellerOrderProcessingViewProps> = ({
  orders,
  onUpdateStatus,
  onPrintInvoice,
}) => {
  const [selectedMerchant, setSelectedMerchant] = useState('merch-02'); // CyberTech default
  const [activeTab, setActiveTab] = useState<'NEW' | 'PROCESSING' | 'SHIPPED' | 'ALL'>('NEW');
  const [trackingInput, setTrackingInput] = useState<{ [orderId: string]: string }>({});

  // Filter orders containing items for the selected merchant
  const sellerOrders = orders.filter((o) =>
    o.items.some((i) => i.merchantId === selectedMerchant)
  );

  const filteredSellerOrders = sellerOrders.filter((o) => {
    if (activeTab === 'NEW') return o.status === 'PAYMENT_SUCCESS' || o.status === 'ORDER_CONFIRMED';
    if (activeTab === 'PROCESSING') return o.status === 'SELLER_ACCEPTED' || o.status === 'PROCESSING' || o.status === 'PACKED';
    if (activeTab === 'SHIPPED') return o.status === 'SHIPPED' || o.status === 'IN_TRANSIT' || o.status === 'DELIVERED';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Seller Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>SELLER CENTRAL FULFILLMENT PORTAL</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Vendor Order Dispatch & Logistics Hub</h2>
          <p className="text-xs text-slate-400 mt-1">
            Accept buyer orders, print thermal packing slips & barcode shipping labels, and dispatch packages
          </p>
        </div>

        {/* Merchant Selector Switcher */}
        <div className="flex items-center space-x-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 font-bold">Seller Store:</span>
          <select
            value={selectedMerchant}
            onChange={(e) => setSelectedMerchant(e.target.value)}
            className="bg-slate-900 text-white text-xs font-bold p-2 rounded-lg border border-slate-700 focus:outline-none"
          >
            <option value="merch-02">CyberTech Enterprise Solutions</option>
            <option value="merch-01">Apex Robotics & Industrial</option>
            <option value="merch-03">OmniGear Precision Hardware</option>
          </select>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs">
        {(['NEW', 'PROCESSING', 'SHIPPED', 'ALL'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl font-bold transition whitespace-nowrap ${
              activeTab === tab
                ? 'bg-[#febd69] text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab === 'NEW'
              ? 'New Unaccepted Orders'
              : tab === 'PROCESSING'
              ? 'In Warehouse Processing'
              : tab === 'SHIPPED'
              ? 'Dispatched & Delivered'
              : 'All Merchant Orders'}
          </button>
        ))}
      </div>

      {/* Seller Orders List */}
      {filteredSellerOrders.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 p-12 rounded-2xl text-center text-slate-500 space-y-2">
          <PackageCheck className="w-12 h-12 mx-auto text-slate-600" />
          <h3 className="text-sm font-bold text-slate-300">No orders found in this queue</h3>
          <p className="text-xs text-slate-500">All merchant fulfillment tasks are current and up to date.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSellerOrders.map((order) => {
            const sellerItems = order.items.filter((i) => i.merchantId === selectedMerchant);
            const sellerTotal = sellerItems.reduce((acc, i) => acc + i.totalPrice.amount, 0);

            return (
              <div key={order.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
                {/* Header line */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-black text-white font-mono">{order.orderNumber}</span>
                      <span className="px-2 py-0.5 bg-amber-500/20 text-[#febd69] text-[10px] font-bold rounded">
                        {order.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Buyer: <strong className="text-white">{order.customerName}</strong> ({order.customerEmail})
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className="text-xs text-slate-400">Seller Portion Total</div>
                    <div className="text-base font-black text-emerald-400">${sellerTotal.toFixed(2)}</div>
                  </div>
                </div>

                {/* Seller Items */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Allocated Merchant Products ({sellerItems.length}):
                  </div>
                  {sellerItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-slate-200">
                      <div>
                        <span className="font-bold text-white">{item.productTitle}</span>
                        <span className="text-slate-500 text-[10px] ml-2">SKU: {item.sku}</span>
                      </div>
                      <div className="font-mono">
                        {item.quantity}x @ ${item.unitPrice.amount.toFixed(2)} = ${item.totalPrice.amount.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Logistics Action Buttons for Seller */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-800">
                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                    <Warehouse className="w-4 h-4 text-amber-400" />
                    <span>Fulfillment Warehouse: <strong className="text-white">WH-02 Silicon Valley Hub</strong></span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => onPrintInvoice(order)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold rounded-xl text-xs transition flex items-center space-x-1.5 border border-slate-700"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Packing Slip</span>
                    </button>

                    {(order.status === 'PAYMENT_SUCCESS' || order.status === 'ORDER_CONFIRMED') && (
                      <>
                        <button
                          onClick={() => onUpdateStatus(order.id, 'SELLER_ACCEPTED', 'Seller accepted order')}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition flex items-center space-x-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Accept Order</span>
                        </button>
                        <button
                          onClick={() => onUpdateStatus(order.id, 'CANCELLED', 'Seller rejected order due to stock allocation')}
                          className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition flex items-center space-x-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject Order</span>
                        </button>
                      </>
                    )}

                    {(order.status === 'SELLER_ACCEPTED' || order.status === 'PROCESSING') && (
                      <button
                        onClick={() => onUpdateStatus(order.id, 'PACKED', 'Seller packed item with protective seal')}
                        className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs transition flex items-center space-x-1"
                      >
                        <Barcode className="w-3.5 h-3.5" />
                        <span>Pack & Generate Shipping Label</span>
                      </button>
                    )}

                    {order.status === 'PACKED' && (
                      <button
                        onClick={() => onUpdateStatus(order.id, 'SHIPPED', 'Seller handed over package to Prime Express carrier')}
                        className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition flex items-center space-x-1"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Dispatch to Carrier</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
