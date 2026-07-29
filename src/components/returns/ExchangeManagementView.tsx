import React, { useState } from 'react';
import { ReturnRequest, ExchangeType } from '../../types/returns';
import {
  RefreshCw,
  Package,
  Truck,
  CheckCircle2,
  ArrowRight,
  Boxes,
  Tag,
  Clock,
} from 'lucide-react';

interface Props {
  returnRequests: ReturnRequest[];
  onDispatchExchange: (returnId: string, trackingNum: string) => void;
}

export const ExchangeManagementView: React.FC<Props> = ({ returnRequests, onDispatchExchange }) => {
  const exchanges = returnRequests.filter(
    (r) => r.resolutionRequested === 'EXCHANGE' || r.resolutionRequested === 'REPLACEMENT'
  );

  const [selectedRmaId, setSelectedRmaId] = useState(exchanges[0]?.returnId || '');
  const [replacementTracking, setReplacementTracking] = useState('DHL-OUT-90291122');
  const [carrier, setCarrier] = useState('DHL Express Priority');

  const target = exchanges.find((r) => r.returnId === selectedRmaId) || exchanges[0];

  const handleDispatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!target) return;

    onDispatchExchange(target.returnId, replacementTracking);
    alert(`Replacement package for ${target.returnId} dispatched with tracking ${replacementTracking}!`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <RefreshCw className="w-5 h-5 text-cyan-400" />
            <span>Product Exchange & Size / Variant Replacement Portal</span>
          </h2>
          <p className="text-xs text-slate-400">
            Automate replacement inventory allocation, size/color variant swaps, and outbound shipping labels.
          </p>
        </div>
        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold rounded-lg flex items-center space-x-1">
            <Boxes className="w-3.5 h-3.5" />
            <span>Active Exchange Orders: {exchanges.length}</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Exchange Requests */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Exchange Queue</h3>

          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {exchanges.map((r) => (
              <div
                key={r.returnId}
                onClick={() => setSelectedRmaId(r.returnId)}
                className={`p-3 rounded-xl border cursor-pointer transition ${
                  selectedRmaId === r.returnId
                    ? 'bg-slate-800 border-cyan-400 ring-1 ring-cyan-400/30'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-mono font-bold text-xs text-cyan-400">{r.returnId}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold uppercase">
                    {r.exchangeType || 'REPLACEMENT'}
                  </span>
                </div>
                <div className="text-xs font-bold text-white truncate">{r.item.name}</div>
                <div className="text-[10px] text-slate-400 flex justify-between mt-1">
                  <span>Variant: <span className="text-white font-medium">{r.requestedVariant || 'Default'}</span></span>
                  <span className="text-emerald-400 font-bold">{r.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Exchange Dispatcher */}
        {target ? (
          <form onSubmit={handleDispatchSubmit} className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-5">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Truck className="w-4 h-4 text-cyan-400" />
              <span>Dispatch Replacement Package for RMA {target.returnId}</span>
            </h3>

            {/* Workflow Pipeline Progress */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 text-xs">
              <div className="font-bold text-slate-300">Exchange Lifecycle Stage</div>
              <div className="grid grid-cols-4 gap-2 text-[10px] font-mono text-center">
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded border border-emerald-500/40 font-bold">1. Requested</div>
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded border border-emerald-500/40 font-bold">2. Return Received</div>
                <div className="p-2 bg-cyan-500/20 text-cyan-400 rounded border border-cyan-500/40 font-bold">3. Stock Reserved</div>
                <div className="p-2 bg-[#febd69]/20 text-[#febd69] rounded border border-[#febd69]/40 font-bold">4. Outbound Dispatch</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="font-bold text-white border-b border-slate-800 pb-1">Returned Item</div>
                <div className="text-slate-300 font-semibold">{target.item.name}</div>
                <div className="text-slate-400">SKU: {target.item.sku}</div>
                <div className="text-slate-400">Reason: <span className="text-amber-400 font-bold">{target.reason}</span></div>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 border-cyan-500/30">
                <div className="font-bold text-cyan-400 border-b border-slate-800 pb-1 flex items-center space-x-1">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Requested Replacement Variant</span>
                </div>
                <div className="text-white font-black">{target.requestedVariant || 'Exact Match Replacement'}</div>
                <div className="text-slate-400">Type: <span className="text-cyan-400 font-mono font-bold">{target.exchangeType}</span></div>
                <div className="text-emerald-400 font-bold">In-Stock at Seattle Warehouse FC-1</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Outbound Shipping Carrier</label>
                <select
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="DHL Express Priority">DHL Express Priority</option>
                  <option value="UPS Next Day Air">UPS Next Day Air</option>
                  <option value="FedEx 2Day">FedEx 2Day</option>
                  <option value="Amazon Logistics Prime Delivery">Amazon Logistics Prime Delivery</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Replacement Airway Bill / Tracking Number</label>
                <input
                  type="text"
                  value={replacementTracking}
                  onChange={(e) => setReplacementTracking(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center space-x-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Dispatch Replacement & Notify Buyer</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-8 rounded-xl text-center text-slate-500 text-xs">
            No active product exchange requests found.
          </div>
        )}
      </div>
    </div>
  );
};
