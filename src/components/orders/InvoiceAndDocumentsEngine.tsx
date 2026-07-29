import React, { useState } from 'react';
import { ComprehensiveMasterOrder } from '../../types/oms';
import { FileText, Printer, Download, Barcode, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface InvoiceAndDocumentsEngineProps {
  orders: ComprehensiveMasterOrder[];
}

export const InvoiceAndDocumentsEngine: React.FC<InvoiceAndDocumentsEngineProps> = ({ orders }) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || '');
  const [docType, setDocType] = useState<'TAX_INVOICE' | 'PRO_FORMA' | 'CREDIT_NOTE' | 'PACKING_SLIP'>('TAX_INVOICE');

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <FileText className="w-4 h-4 text-sky-400" />
            <span>COMMERCE ZONE DOCUMENTATION ENGINE</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Official Tax Invoices, Credit Notes & Packing Slips</h2>
          <p className="text-xs text-slate-400 mt-1">
            Generate compliant enterprise invoices with barcode signatures and detailed tax calculations
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedOrderId}
            onChange={(e) => setSelectedOrderId(e.target.value)}
            className="bg-slate-950 text-white font-mono text-xs font-bold p-2 rounded-xl border border-slate-800 focus:outline-none"
          >
            {orders.map((o) => (
              <option key={o.id} value={o.id}>
                {o.orderNumber} ({o.customerName.slice(0, 15)})
              </option>
            ))}
          </select>

          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value as any)}
            className="bg-slate-950 text-[#febd69] text-xs font-black p-2 rounded-xl border border-slate-800 focus:outline-none"
          >
            <option value="TAX_INVOICE">Tax Invoice</option>
            <option value="PRO_FORMA">Pro Forma Invoice</option>
            <option value="CREDIT_NOTE">Credit Note</option>
            <option value="PACKING_SLIP">Warehouse Packing Slip</option>
          </select>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-[#febd69] hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition flex items-center space-x-1.5 shadow"
          >
            <Printer className="w-4 h-4" />
            <span>Print Document</span>
          </button>
        </div>
      </div>

      {/* Invoice Document Canvas */}
      {selectedOrder && (
        <div className="bg-white text-slate-950 p-8 rounded-3xl shadow-2xl max-w-4xl mx-auto space-y-6 font-sans border border-slate-300">
          {/* Document Header */}
          <div className="flex justify-between items-start border-b border-slate-300 pb-6">
            <div>
              <div className="text-2xl font-black tracking-tighter text-slate-900 flex items-center space-x-2">
                <span className="bg-slate-950 text-[#febd69] px-3 py-1 rounded-xl text-lg font-black">
                  AMAZON
                </span>
                <span>ENTERPRISE MARKETPLACE</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Global Procurement & Tax Compliance Services</p>
              <p className="text-xs text-slate-500">Tax ID: US-EIN-99201482-AMZ</p>
            </div>

            <div className="text-right space-y-1">
              <span className="px-3 py-1 bg-slate-900 text-amber-300 font-mono font-black text-xs uppercase rounded-lg">
                {docType.replace('_', ' ')}
              </span>
              <div className="text-sm font-black font-mono mt-1 text-slate-900">{selectedOrder.invoiceNumber}</div>
              <div className="text-xs text-slate-600 font-mono">Date: {new Date(selectedOrder.createdAt).toLocaleDateString()}</div>
            </div>
          </div>

          {/* Customer & Merchant Grid */}
          <div className="grid grid-cols-2 gap-6 text-xs">
            <div className="space-y-1 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="font-black text-slate-500 uppercase text-[10px]">Billed To (Customer):</span>
              <div className="font-black text-slate-900 text-sm">{selectedOrder.customerName}</div>
              <div className="text-slate-600">{selectedOrder.customerEmail}</div>
              <div className="text-slate-600">{selectedOrder.shippingAddress.address}</div>
              <div className="text-slate-600">
                {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.country}
              </div>
            </div>

            <div className="space-y-1 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="font-black text-slate-500 uppercase text-[10px]">Fulfilled By (Merchant):</span>
              <div className="font-black text-slate-900 text-sm">
                {selectedOrder.items[0]?.merchantName || 'CyberTech Enterprise'}
              </div>
              <div className="text-slate-600">Amazon Logistics Verified Seller</div>
              <div className="text-slate-600">Tracking #: {selectedOrder.trackingNumber}</div>
              <div className="text-slate-600">Payment: {selectedOrder.paymentMethod}</div>
            </div>
          </div>

          {/* Table */}
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-900 text-slate-900 uppercase font-black">
                <th className="py-2">Item Description</th>
                <th className="py-2">SKU</th>
                <th className="py-2 text-center">Qty</th>
                <th className="py-2 text-right">Unit Price</th>
                <th className="py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {selectedOrder.items.map((item) => (
                <tr key={item.id} className="text-slate-800">
                  <td className="py-3 font-bold">{item.productTitle}</td>
                  <td className="py-3 font-mono text-slate-500">{item.sku}</td>
                  <td className="py-3 text-center font-mono font-bold">{item.quantity}</td>
                  <td className="py-3 text-right font-mono">${item.unitPrice.amount.toFixed(2)}</td>
                  <td className="py-3 text-right font-mono font-bold">${item.totalPrice.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-between items-start pt-4 border-t border-slate-300">
            <div className="space-y-2">
              <Barcode className="w-48 h-12 text-slate-900" />
              <div className="text-[10px] font-mono text-slate-500">Digital Tax Signature: 0x9f8812a8190c</div>
            </div>

            <div className="w-64 space-y-1.5 text-xs font-mono text-slate-800 text-right">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${selectedOrder.subtotal.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>${selectedOrder.shippingFee.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${selectedOrder.taxFee.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-950 border-t border-slate-900 pt-2">
                <span>Grand Total:</span>
                <span>${selectedOrder.grandTotal.amount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
