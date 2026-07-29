import React, { useState } from 'react';
import { FBAInboundShipment, FBAInboundShipmentStatus } from '../../types/fba';
import {
  Truck,
  Plus,
  CheckCircle2,
  Clock,
  QrCode,
  ShieldAlert,
  Boxes,
  FileCheck,
  Search,
} from 'lucide-react';

interface InboundInventoryReceivingViewProps {
  shipments: FBAInboundShipment[];
  onCreateInboundShipment: (newShipment: FBAInboundShipment) => void;
  onUpdateStatus: (shipmentId: string, status: FBAInboundShipmentStatus) => void;
}

export const InboundInventoryReceivingView: React.FC<InboundInventoryReceivingViewProps> = ({
  shipments,
  onCreateInboundShipment,
  onUpdateStatus,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sellerName, setSellerName] = useState('PrimeTech Direct Store');
  const [targetWarehouse, setTargetWarehouse] = useState('EWR4');
  const [sku, setSku] = useState('APX-ANC-HP900');
  const [title, setTitle] = useState('AuraSound ANC Headphones');
  const [declaredQty, setDeclaredQty] = useState(300);
  const [carrier, setCarrier] = useState('UPS Freight');
  const [trackingNumber, setTrackingNumber] = useState('1Z88290192801293');

  const handleCreateShipment = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `FBA-INB-${Math.floor(1000 + Math.random() * 9000)}`;

    const newShipment: FBAInboundShipment = {
      shipmentId: id,
      sellerId: 'SEL-301',
      sellerName,
      targetWarehouseId: `WH-${targetWarehouse}`,
      targetWarehouseCode: targetWarehouse,
      items: [
        {
          sku,
          asin: 'B08N5WRWNW',
          fnsku: `X00${Math.floor(100000 + Math.random() * 900000)}`,
          productTitle: title,
          declaredQty,
          receivedQty: 0,
          passedQty: 0,
          failedQty: 0,
        },
      ],
      totalUnits: declaredQty,
      carrier,
      trackingNumber,
      status: 'SHIPMENT_CREATED',
      arrivalDate: new Date().toISOString().substring(0, 10),
      createdAt: new Date().toISOString().substring(0, 16).replace('T', ' '),
    };

    onCreateInboundShipment(newShipment);
    setShowCreateModal(false);
    alert(`Inbound Shipment ${id} created! Approved for receiving at warehouse ${targetWarehouse}.`);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <Truck className="w-4 h-4 text-[#febd69]" />
            <span>INBOUND INVENTORY RECEIVING & QUALITY INSPECTION</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Dock Receiving, Barcode Verification & Automated Bin Placement</h2>
          <p className="text-xs text-slate-400 mt-1">
            Track seller inbound freight, scan FNSKU barcodes, record quality inspection results & store inventory directly into active bins
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black text-xs rounded-xl transition flex items-center space-x-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Register Inbound Shipment</span>
        </button>
      </div>

      {/* Shipments Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3">
          Inbound Freight Queue ({shipments.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                <th className="py-3 px-3">Shipment ID</th>
                <th className="py-3 px-3">Seller & Destination</th>
                <th className="py-3 px-3">Items & Qty</th>
                <th className="py-3 px-3">Carrier & Tracking</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {shipments.map((s) => (
                <tr key={s.shipmentId} className="hover:bg-slate-800/30 transition">
                  <td className="py-3.5 px-3">
                    <span className="font-extrabold text-[#febd69] text-xs">{s.shipmentId}</span>
                    <span className="text-slate-500 block text-[9px]">Created: {s.createdAt}</span>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="font-bold text-white block">{s.sellerName}</span>
                    <span className="text-emerald-400 text-[10px]">Target: {s.targetWarehouseCode} Hub</span>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="space-y-0.5">
                      {s.items.map((it, idx) => (
                        <div key={idx} className="text-[11px]">
                          <span className="text-slate-200 font-bold">{it.productTitle}</span>
                          <span className="text-slate-400 block text-[9px]">
                            FNSKU: {it.fnsku} • Declared: {it.declaredQty} | Passed: <strong className="text-emerald-400">{it.passedQty}</strong>
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>

                  <td className="py-3.5 px-3 text-[10px]">
                    <span className="text-slate-300 font-bold block">{s.carrier}</span>
                    <span className="text-sky-400">{s.trackingNumber}</span>
                  </td>

                  <td className="py-3.5 px-3">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase inline-block ${
                        s.status === 'STORED_AVAILABLE'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : s.status === 'INSPECTING'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                      }`}
                    >
                      {s.status.replace('_', ' ')}
                    </span>
                    {s.shelfAssigned && (
                      <span className="text-[9px] text-slate-400 block mt-1">
                        Assigned: {s.shelfAssigned} ({s.binAssigned})
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    <div className="flex justify-end space-x-1">
                      {s.status === 'SHIPMENT_CREATED' && (
                        <button
                          onClick={() => onUpdateStatus(s.shipmentId, 'APPROVED_BY_FBA')}
                          className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded text-[10px]"
                        >
                          Approve Inbound
                        </button>
                      )}
                      {s.status === 'APPROVED_BY_FBA' && (
                        <button
                          onClick={() => onUpdateStatus(s.shipmentId, 'INSPECTING')}
                          className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded text-[10px]"
                        >
                          Receive at Dock
                        </button>
                      )}
                      {s.status === 'INSPECTING' && (
                        <button
                          onClick={() => onUpdateStatus(s.shipmentId, 'BARCODE_VERIFIED')}
                          className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded text-[10px]"
                        >
                          Verify Barcode
                        </button>
                      )}
                      {s.status === 'BARCODE_VERIFIED' && (
                        <button
                          onClick={() => onUpdateStatus(s.shipmentId, 'STORED_AVAILABLE')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded text-[10px]"
                        >
                          Store in Bins
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Inbound Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-xl w-full space-y-4 shadow-2xl text-xs font-sans">
            <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center space-x-2">
              <Truck className="w-4 h-4 text-[#febd69]" />
              <span>Register Inbound FBA Shipment</span>
            </h3>

            <form onSubmit={handleCreateShipment} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Seller Business Name</label>
                  <input
                    type="text"
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Target Warehouse Hub</label>
                  <select
                    value={targetWarehouse}
                    onChange={(e) => setTargetWarehouse(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold focus:outline-none"
                  >
                    <option value="EWR4">EWR4 (Newark, NJ)</option>
                    <option value="ONT8">ONT8 (Moreno Valley, CA)</option>
                    <option value="BFI4">BFI4 (Kent, WA)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Product Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Seller SKU</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Declared Units</label>
                  <input
                    type="number"
                    value={declaredQty}
                    onChange={(e) => setDeclaredQty(parseInt(e.target.value, 10) || 0)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Freight Carrier</label>
                  <input
                    type="text"
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Tracking Number</label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black rounded-xl"
                >
                  Create Inbound Shipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
