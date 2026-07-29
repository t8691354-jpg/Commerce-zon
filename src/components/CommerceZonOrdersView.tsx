import React, { useState } from 'react';
import { Order } from '../types/domain';
import { Package, Truck, CheckCircle2, RotateCcw, Clock, ArrowRight, ShieldCheck, Search, Filter, ShoppingBag } from 'lucide-react';

interface CommerceZonOrdersViewProps {
  orders: Order[];
  onReorder?: (order: Order) => void;
  onInitiateReturn?: (orderId: string) => void;
}

export const CommerceZonOrdersView: React.FC<CommerceZonOrdersViewProps> = ({
  orders,
  onReorder,
  onInitiateReturn,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'SHIPPED' | 'DELIVERED' | 'PROCESSING'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = orders.filter((ord) => {
    if (filter !== 'ALL' && ord.fulfillmentStatus !== filter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        ord.orderNumber.toLowerCase().includes(q) ||
        ord.customerName.toLowerCase().includes(q) ||
        ord.items.some((i) => i.product.title.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 font-sans text-slate-100 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-[#131921] border border-[#37475a] rounded-2xl p-6 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-extrabold text-[#febd69] uppercase tracking-wider">
            <span>Official Commerce Zon Customer Portal</span>
            <span>•</span>
            <span className="text-emerald-400">Prime Verified</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Your Orders & Returns</h1>
          <p className="text-xs text-slate-400 mt-1">
            Track Commerce Zon Express packages, manage multi-warehouse deliveries, and initiate instant wallet refunds.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-[#232f3e] p-3 rounded-xl border border-[#37475a]">
          <Package className="w-8 h-8 text-[#febd69]" />
          <div>
            <div className="text-[10px] text-slate-400 font-mono uppercase font-bold">Total Orders Placed</div>
            <div className="text-lg font-black text-white font-mono">{orders.length} Orders</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        {/* Filter Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto">
          {(['ALL', 'PROCESSING', 'SHIPPED', 'DELIVERED'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3.5 py-2 rounded-lg font-bold transition whitespace-nowrap ${
                filter === status
                  ? 'bg-[#febd69] text-slate-950 shadow'
                  : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {status === 'ALL' ? 'All Orders' : status}
            </button>
          ))}
        </div>

        {/* Search Order Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search orders or items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#febd69]"
          />
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 space-y-3">
          <Package className="w-12 h-12 mx-auto text-slate-600" />
          <p className="text-sm font-semibold text-slate-300">No matching orders found.</p>
          <p className="text-xs text-slate-500">Try adjusting your search query or filter settings.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isDelivered = order.fulfillmentStatus === 'DELIVERED';
            const isShipped = order.fulfillmentStatus === 'SHIPPED';

            return (
              <div
                key={order.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-slate-700 transition"
              >
                {/* Order Top Bar Header */}
                <div className="bg-[#131921] border-b border-[#37475a] px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
                  <div className="flex items-center space-x-6">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase">ORDER PLACED</div>
                      <div className="text-white font-bold">{new Date(order.timestamp).toLocaleDateString()}</div>
                    </div>

                    <div>
                      <div className="text-[10px] text-slate-400 uppercase">TOTAL</div>
                      <div className="text-emerald-400 font-bold">${order.total.amount.toFixed(2)} USD</div>
                    </div>

                    <div>
                      <div className="text-[10px] text-slate-400 uppercase">SHIP TO</div>
                      <div className="text-white font-bold">{order.customerName}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-slate-400">ORDER # {order.orderNumber}</div>
                    <div className="text-[#febd69] text-[11px] font-bold">Commerce Zon Express Shipping</div>
                  </div>
                </div>

                {/* Order Body Details */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <div className="flex items-center space-x-2">
                      {isDelivered ? (
                        <span className="p-1.5 bg-emerald-950 text-emerald-400 rounded-lg flex items-center space-x-1 font-bold text-xs">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Delivered Today</span>
                        </span>
                      ) : isShipped ? (
                        <span className="p-1.5 bg-blue-950 text-blue-400 rounded-lg flex items-center space-x-1 font-bold text-xs">
                          <Truck className="w-4 h-4 animate-pulse" />
                          <span>Shipped & In Transit</span>
                        </span>
                      ) : (
                        <span className="p-1.5 bg-amber-950 text-amber-400 rounded-lg flex items-center space-x-1 font-bold text-xs">
                          <Clock className="w-4 h-4" />
                          <span>Processing at Fulfillment Center</span>
                        </span>
                      )}

                      <span className="text-xs text-slate-400">
                        • FBA Warehouse: <strong className="text-slate-200">{order.warehouseId || 'WH-MAIN-US-EAST'}</strong>
                      </span>
                    </div>

                    <div className="text-xs font-mono text-slate-400">
                      Fraud Score: <span className="text-blue-400 font-bold">{order.fraudRiskScore}/100</span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-4 p-3 bg-slate-950 border border-slate-800/80 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <img
                            src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80'}
                            alt={item.product?.title || 'Product'}
                            className="w-14 h-14 object-cover rounded-lg bg-slate-900 border border-slate-800"
                          />
                          <div>
                            <div className="text-xs font-bold text-white hover:text-[#febd69] transition cursor-pointer">
                              {item.product?.title || 'Marketplace Item'}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              Sold by: <span className="text-slate-300 font-semibold">{item.product?.merchant?.name || 'Verified Vendor'}</span>
                            </div>
                            <div className="text-xs text-emerald-400 font-mono font-bold mt-1">
                              ${item.price.amount.toFixed(2)} x {item.quantity}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0">
                          {onReorder && (
                            <button
                              onClick={() => onReorder(order)}
                              className="px-3 py-1.5 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 text-xs font-extrabold rounded-lg transition shadow flex items-center space-x-1"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Buy it Again</span>
                            </button>
                          )}

                          {onInitiateReturn && (
                            <button
                              onClick={() => onInitiateReturn(order.id)}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 transition flex items-center space-x-1"
                            >
                              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                              <span>Return Item</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
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
