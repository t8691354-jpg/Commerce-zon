import React, { useState } from 'react';
import { FBAInventoryTransfer, TransferType } from '../../types/fba';
import {
  ArrowRightLeft,
  Plus,
  Truck,
  CheckCircle2,
  Clock,
  Warehouse,
  Boxes,
  FileText,
} from 'lucide-react';

interface InventoryTransfersViewProps {
  transfers: FBAInventoryTransfer[];
  onCreateTransfer: (newTrf: FBAInventoryTransfer) => void;
  onCompleteTransfer: (transferId: string) => void;
}

export const InventoryTransfersView: React.FC<InventoryTransfersViewProps> = ({
  transfers,
  onCreateTransfer,
  onCompleteTransfer,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [transferType, setTransferType] = useState<TransferType>('WAREHOUSE_TO_WAREHOUSE');
  const [fnsku, setFnsku] = useState('X002891A90');
  const [productTitle, setProductTitle] = useState('AuraSound ANC Wireless Headphones');
  const [qty, setQty] = useState(100);
  const [sourceWh, setSourceWh] = useState('EWR4');
  const [sourceLoc, setSourceLoc] = useState('S-12-R-04-B-108');
  const [destWh, setDestWh] = useState('BFI4');
  const [destLoc, setDestLoc] = useState('S-01-R-01-B-005');

  const handleCreateTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `TRF-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTrf: FBAInventoryTransfer = {
      transferId: id,
      transferType,
      fnsku,
      productTitle,
      quantity: qty,
      sourceWarehouseCode: sourceWh,
      sourceLocation: sourceLoc,
      destWarehouseCode: destWh,
      destLocation: destLoc,
      status: 'INITIATED',
      initiatedBy: 'FBA Logistics Coordinator',
      timestamp: new Date().toISOString().substring(0, 16).replace('T', ' '),
    };

    onCreateTransfer(newTrf);
    setShowModal(false);
    alert(`Transfer ${id} created! Stock movement initiated from ${sourceWh} to ${destWh}.`);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <ArrowRightLeft className="w-4 h-4 text-sky-400" />
            <span>INTER-WAREHOUSE & INTERNAL BIN REBALANCING ENGINE</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Warehouse-to-Warehouse, Bin & Shelf Transfers</h2>
          <p className="text-xs text-slate-400 mt-1">
            Automated stock redistribution across regional fulfillment nodes to minimize customer delivery latency & balance bin occupancy
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-black text-xs rounded-xl transition flex items-center space-x-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Initiate Inventory Transfer</span>
        </button>
      </div>

      {/* Transfer History Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3">
          Active Stock Transfer Orders ({transfers.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                <th className="py-3 px-3">Transfer ID</th>
                <th className="py-3 px-3">Type & Item</th>
                <th className="py-3 px-3">Source Location</th>
                <th className="py-3 px-3">Destination Location</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {transfers.map((t) => (
                <tr key={t.transferId} className="hover:bg-slate-800/30 transition">
                  <td className="py-3.5 px-3">
                    <span className="font-extrabold text-[#febd69] text-xs">{t.transferId}</span>
                    <span className="text-slate-500 block text-[9px]">{t.timestamp}</span>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 bg-slate-800 text-sky-300 rounded text-[9px] font-bold block w-fit mb-1">
                      {t.transferType.replace('_', ' ')}
                    </span>
                    <span className="text-white font-bold block">{t.productTitle}</span>
                    <span className="text-emerald-400 text-[10px]">FNSKU: {t.fnsku} • Qty: {t.quantity}</span>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="text-amber-300 font-bold block">{t.sourceWarehouseCode}</span>
                    <span className="text-slate-400 text-[10px]">{t.sourceLocation}</span>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="text-emerald-400 font-bold block">{t.destWarehouseCode}</span>
                    <span className="text-slate-400 text-[10px]">{t.destLocation}</span>
                  </td>

                  <td className="py-3.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                        t.status === 'COMPLETED'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    {t.status !== 'COMPLETED' && (
                      <button
                        onClick={() => onCompleteTransfer(t.transferId)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded text-[10px]"
                      >
                        Confirm Receipt
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-xl w-full space-y-4 shadow-2xl text-xs font-sans">
            <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center space-x-2">
              <ArrowRightLeft className="w-4 h-4 text-[#febd69]" />
              <span>Initiate FBA Inventory Transfer</span>
            </h3>

            <form onSubmit={handleCreateTransfer} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Transfer Type</label>
                  <select
                    value={transferType}
                    onChange={(e) => setTransferType(e.target.value as TransferType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold focus:outline-none"
                  >
                    <option value="WAREHOUSE_TO_WAREHOUSE">Warehouse to Warehouse</option>
                    <option value="BIN_TO_BIN">Bin to Bin</option>
                    <option value="SHELF_TO_SHELF">Shelf to Shelf</option>
                    <option value="INTERNAL_REBALANCING">Internal Rebalancing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Transfer Quantity</label>
                  <input
                    type="number"
                    value={qty}
                    onChange={(e) => setQty(parseInt(e.target.value, 10) || 0)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">FNSKU</label>
                  <input
                    type="text"
                    value={fnsku}
                    onChange={(e) => setFnsku(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Product Title</label>
                  <input
                    type="text"
                    value={productTitle}
                    onChange={(e) => setProductTitle(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Source Warehouse & Bin</label>
                  <div className="grid grid-cols-2 gap-1">
                    <input
                      type="text"
                      value={sourceWh}
                      onChange={(e) => setSourceWh(e.target.value)}
                      placeholder="EWR4"
                      className="bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-bold"
                    />
                    <input
                      type="text"
                      value={sourceLoc}
                      onChange={(e) => setSourceLoc(e.target.value)}
                      placeholder="S-12-R-04-B-108"
                      className="bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Destination Warehouse & Bin</label>
                  <div className="grid grid-cols-2 gap-1">
                    <input
                      type="text"
                      value={destWh}
                      onChange={(e) => setDestWh(e.target.value)}
                      placeholder="BFI4"
                      className="bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-bold"
                    />
                    <input
                      type="text"
                      value={destLoc}
                      onChange={(e) => setDestLoc(e.target.value)}
                      placeholder="S-01-R-01-B-005"
                      className="bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-black rounded-xl"
                >
                  Create Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
