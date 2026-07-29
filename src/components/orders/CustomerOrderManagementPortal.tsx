import React, { useState } from 'react';
import { ComprehensiveMasterOrder, OrderLifecycleStatus } from '../../types/oms';
import {
  Package,
  Truck,
  RotateCcw,
  RefreshCw,
  Printer,
  XCircle,
  HelpCircle,
  ShoppingBag,
  CheckCircle2,
  Clock,
  Search,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';

interface CustomerOrderManagementPortalProps {
  orders: ComprehensiveMasterOrder[];
  onViewOrderDetails: (order: ComprehensiveMasterOrder) => void;
  onTrackShipment: (order: ComprehensiveMasterOrder) => void;
  onInitiateReturn: (orderId: string, reason: string, comment: string, mediaUrls: string[]) => void;
  onInitiateExchange: (orderId: string, reason: string, comment: string) => void;
  onCancelOrder: (orderId: string) => void;
  onReorder: (order: ComprehensiveMasterOrder) => void;
}

export const CustomerOrderManagementPortal: React.FC<CustomerOrderManagementPortalProps> = ({
  orders,
  onViewOrderDetails,
  onTrackShipment,
  onInitiateReturn,
  onInitiateExchange,
  onCancelOrder,
  onReorder,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'DELIVERED' | 'CANCELLED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Return Modal State
  const [returnModalOrderId, setReturnModalOrderId] = useState<string | null>(null);
  const [returnReason, setReturnReason] = useState('Defective Item / Failed Diagnostics');
  const [returnComment, setReturnComment] = useState('');
  const [returnMediaUrl, setReturnMediaUrl] = useState('');

  // Exchange Modal State
  const [exchangeModalOrderId, setExchangeModalOrderId] = useState<string | null>(null);
  const [exchangeReason, setExchangeReason] = useState('SIZE_EXCHANGE');
  const [exchangeComment, setExchangeComment] = useState('');

  const filteredOrders = orders.filter((o) => {
    if (filter === 'ACTIVE') return o.status !== 'DELIVERED' && o.status !== 'COMPLETED' && o.status !== 'CANCELLED';
    if (filter === 'DELIVERED') return o.status === 'DELIVERED' || o.status === 'COMPLETED';
    if (filter === 'CANCELLED') return o.status === 'CANCELLED';
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.items.some((i) => i.productTitle.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnModalOrderId) return;
    onInitiateReturn(
      returnModalOrderId,
      returnReason,
      returnComment,
      returnMediaUrl ? [returnMediaUrl] : []
    );
    setReturnModalOrderId(null);
    setReturnComment('');
    setReturnMediaUrl('');
  };

  const handleExchangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exchangeModalOrderId) return;
    onInitiateExchange(exchangeModalOrderId, exchangeReason, exchangeComment);
    setExchangeModalOrderId(null);
    setExchangeComment('');
  };

  return (
    <div className="space-y-6">
      {/* Customer Portal Banner */}
      <div className="bg-[#131921] border border-[#37475a] p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <span>OFFICIAL AMAZON BUYER PORTAL</span>
            <span>•</span>
            <span className="text-emerald-400">Prime Member Account</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Your Orders, Returns & Subscriptions</h2>
          <p className="text-xs text-slate-400 mt-1">
            Track active shipments, initiate hassle-free returns with instant wallet refund, and manage invoices
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-[#232f3e] p-3 rounded-xl border border-[#37475a]">
          <Package className="w-8 h-8 text-[#febd69]" />
          <div>
            <div className="text-[10px] text-slate-400 font-mono font-bold uppercase">Total Order History</div>
            <div className="text-base font-black text-white font-mono">{orders.length} Purchases</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto">
          {(['ALL', 'ACTIVE', 'DELIVERED', 'CANCELLED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-2 rounded-lg font-bold transition whitespace-nowrap ${
                filter === tab
                  ? 'bg-[#febd69] text-slate-950 shadow'
                  : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {tab === 'ALL' ? 'All Orders' : tab === 'ACTIVE' ? 'Active & In Transit' : tab}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search order # or product name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#febd69]"
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 p-12 rounded-2xl text-center text-slate-500 space-y-2">
            <ShoppingBag className="w-12 h-12 mx-auto text-slate-600" />
            <h3 className="text-sm font-bold text-slate-300">No orders match selected criteria</h3>
            <p className="text-xs text-slate-500">Try adjusting search query or tab filters.</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isDelivered = order.status === 'DELIVERED' || order.status === 'COMPLETED';
            const isCancelled = order.status === 'CANCELLED';
            const canCancel =
              order.status === 'PAYMENT_SUCCESS' || order.status === 'ORDER_CONFIRMED' || order.status === 'SELLER_ACCEPTED';

            return (
              <div
                key={order.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl space-y-4 p-5"
              >
                {/* Header Strip */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 text-xs">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-black text-white text-sm">{order.orderNumber}</span>
                      <span className="px-2 py-0.5 bg-amber-500/20 text-[#febd69] font-bold text-[10px] rounded uppercase">
                        {order.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Placed on: <strong className="text-slate-200">{new Date(order.createdAt).toLocaleDateString()}</strong>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => onViewOrderDetails(order)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition"
                    >
                      View Order Details
                    </button>
                    <button
                      onClick={() => onReorder(order)}
                      className="px-3.5 py-1.5 bg-[#febd69] hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs transition flex items-center space-x-1"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Reorder Items</span>
                    </button>
                  </div>
                </div>

                {/* Items in Order */}
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.imageUrl || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80'}
                          alt={item.productTitle}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 object-contain bg-slate-900 rounded-lg p-1 border border-slate-800"
                        />
                        <div>
                          <h4 className="font-bold text-white">{item.productTitle}</h4>
                          <div className="text-[10px] text-slate-400 font-mono">
                            Qty: {item.quantity} | SKU: {item.sku}
                          </div>
                          <div className="text-[10px] text-amber-400">Seller: {item.merchantName}</div>
                        </div>
                      </div>

                      <div className="text-right font-mono font-bold text-white">
                        ${item.totalPrice.amount.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800 text-xs">
                  <div className="flex items-center space-x-2 text-slate-400">
                    <Truck className="w-4 h-4 text-sky-400" />
                    <span>Tracking: <strong className="text-sky-300 font-mono">{order.trackingNumber}</strong></span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => onTrackShipment(order)}
                      className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl transition flex items-center space-x-1"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Live Track Package</span>
                    </button>

                    {isDelivered && (
                      <>
                        <button
                          onClick={() => setReturnModalOrderId(order.id)}
                          className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 font-bold rounded-xl transition flex items-center space-x-1"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Request Return</span>
                        </button>
                        <button
                          onClick={() => setExchangeModalOrderId(order.id)}
                          className="px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 font-bold rounded-xl transition flex items-center space-x-1"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Request Exchange</span>
                        </button>
                      </>
                    )}

                    {canCancel && (
                      <button
                        onClick={() => onCancelOrder(order.id)}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition flex items-center space-x-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel Order</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Return Request Modal */}
      {returnModalOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <form onSubmit={handleReturnSubmit} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-black text-white flex items-center space-x-2">
              <RotateCcw className="w-5 h-5 text-rose-400" />
              <span>Initiate Amazon Express Return Request</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Reason for Return</label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-white focus:outline-none"
                >
                  <option value="Defective Item / Failed Diagnostics">Defective Item / Failed Diagnostics</option>
                  <option value="Bought Wrong Item by Mistake">Bought Wrong Item by Mistake</option>
                  <option value="Item Arrived Damaged">Item Arrived Damaged</option>
                  <option value="Item Not as Described">Item Not as Described</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Additional Comments / Description</label>
                <textarea
                  rows={3}
                  value={returnComment}
                  onChange={(e) => setReturnComment(e.target.value)}
                  placeholder="Describe the issue or reason for return..."
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Attach Photo / Video Proof URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={returnMediaUrl}
                  onChange={(e) => setReturnMediaUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setReturnModalOrderId(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition"
              >
                Submit Return Request
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Exchange Request Modal */}
      {exchangeModalOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <form onSubmit={handleExchangeSubmit} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-black text-white flex items-center space-x-2">
              <RefreshCw className="w-5 h-5 text-purple-400" />
              <span>Initiate Item Exchange / Replacement Request</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Exchange Category</label>
                <select
                  value={exchangeReason}
                  onChange={(e) => setExchangeReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-white focus:outline-none"
                >
                  <option value="SIZE_EXCHANGE">Size / Capacity Exchange</option>
                  <option value="COLOR_EXCHANGE">Color / Aesthetic Variant Exchange</option>
                  <option value="DEFECTIVE_REPLACEMENT">Defective Item Replacement</option>
                  <option value="WRONG_ITEM">Wrong Item Sent Replacement</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Exchange Details</label>
                <textarea
                  rows={3}
                  value={exchangeComment}
                  onChange={(e) => setExchangeComment(e.target.value)}
                  placeholder="Specify the replacement variant or specs needed..."
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-white focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setExchangeModalOrderId(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs transition"
              >
                Submit Exchange Request
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
