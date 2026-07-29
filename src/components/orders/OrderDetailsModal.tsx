import React from 'react';
import { ComprehensiveMasterOrder } from '../../types/oms';
import {
  X,
  FileText,
  Printer,
  Truck,
  MapPin,
  CreditCard,
  Building,
  User,
  ShieldCheck,
  Package,
  Calendar,
  DollarSign,
  Download,
  RotateCcw,
} from 'lucide-react';

interface OrderDetailsModalProps {
  order: ComprehensiveMasterOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onPrintInvoice?: (order: ComprehensiveMasterOrder) => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  isOpen,
  onClose,
  onPrintInvoice,
}) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full p-6 space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 bg-[#febd69] text-slate-950 font-black text-[10px] uppercase rounded">
                ENTERPRISE ORDER SPECIFICATION
              </span>
              <span className="text-xs text-amber-300 font-bold font-mono">{order.orderNumber}</span>
            </div>
            <h2 className="text-lg font-black text-white">Order Details & Complete Financial Statement</h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs">
          <div className="flex items-center space-x-2 text-slate-300">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>Placed: <strong className="text-white">{new Date(order.createdAt).toLocaleString()}</strong></span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPrintInvoice && onPrintInvoice(order)}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold rounded-xl transition flex items-center space-x-1.5 border border-slate-700"
            >
              <Printer className="w-4 h-4" />
              <span>Print Tax Invoice ({order.invoiceNumber})</span>
            </button>
          </div>
        </div>

        {/* Grid: Customer & Shipping Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Customer Details */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
            <h4 className="font-bold text-amber-300 uppercase tracking-wider flex items-center space-x-1.5">
              <User className="w-4 h-4 text-[#febd69]" />
              <span>Customer Metadata</span>
            </h4>
            <div className="space-y-1 text-slate-300">
              <div className="font-bold text-white text-sm">{order.customerName}</div>
              <div className="text-slate-400 font-mono">{order.customerEmail}</div>
              <div className="text-slate-400 font-mono">{order.customerPhone || 'N/A'}</div>
              <div className="text-[10px] text-slate-500 font-mono pt-1">ID: {order.customerId}</div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
            <h4 className="font-bold text-sky-300 uppercase tracking-wider flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-sky-400" />
              <span>Shipping Address</span>
            </h4>
            <div className="space-y-0.5 text-slate-300">
              <div>{order.shippingAddress.address}</div>
              <div>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </div>
              <div className="font-bold text-slate-400">{order.shippingAddress.country}</div>
              <div className="text-[10px] text-emerald-400 font-bold pt-1">
                Est. Delivery: {order.estimatedDeliveryDate}
              </div>
            </div>
          </div>

          {/* Payment & Billing */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
            <h4 className="font-bold text-emerald-300 uppercase tracking-wider flex items-center space-x-1.5">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>Payment & Billing</span>
            </h4>
            <div className="space-y-1 text-slate-300">
              <div>
                Method: <strong className="text-white font-mono">{order.paymentMethod}</strong>
              </div>
              <div>Billing Address: {order.billingAddress?.address || order.shippingAddress.address}</div>
              <div className="text-emerald-400 font-bold">Status: Paid & Verified</div>
            </div>
          </div>
        </div>

        {/* Product Line Items */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-1.5">
            <Package className="w-4 h-4 text-[#febd69]" />
            <span>Product Line Items ({order.items.length})</span>
          </h3>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800">
            {order.items.map((item) => (
              <div key={item.id} className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80'}
                    alt={item.productTitle}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 object-contain bg-slate-900 rounded-xl p-1 border border-slate-800"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">{item.productTitle}</h4>
                    <div className="text-[11px] font-mono text-slate-400">
                      SKU: {item.sku} | Variant: {item.variantName || 'Standard'}
                    </div>
                    <div className="text-[10px] text-amber-400 font-bold">
                      Sold by: {item.merchantName} ({item.warehouseName || 'Default Warehouse'})
                    </div>
                  </div>
                </div>

                <div className="text-right font-mono text-xs">
                  <div className="text-slate-400">
                    ${item.unitPrice.amount.toFixed(2)} × {item.quantity}
                  </div>
                  <div className="text-sm font-black text-white">${item.totalPrice.amount.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Summary & Breakdown Table */}
        <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3 text-xs">
          <h4 className="font-black text-white uppercase tracking-wider">Financial Statement Breakdown</h4>

          <div className="space-y-1.5 font-mono text-slate-300">
            <div className="flex justify-between">
              <span>Items Subtotal:</span>
              <span>${order.subtotal.amount.toFixed(2)}</span>
            </div>

            {order.discount.amount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Discount Promo ({order.couponCode || 'PROMO'}):</span>
                <span>-${order.discount.amount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Shipping & Fulfillment Fee:</span>
              <span>${order.shippingFee.amount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Estimated Sales Tax:</span>
              <span>${order.taxFee.amount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-purple-400 border-t border-slate-800 pt-2 font-bold">
              <span>Marketplace Commission Fee (Internal):</span>
              <span>${order.marketplaceFee.amount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-base font-black text-white border-t border-slate-800 pt-2">
              <span>Grand Total Paid:</span>
              <span className="text-[#febd69]">${order.grandTotal.amount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition"
          >
            Close Modal
          </button>
        </div>
      </div>
    </div>
  );
};
