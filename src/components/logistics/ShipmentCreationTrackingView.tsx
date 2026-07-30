import React, { useState } from 'react';
import { Shipment, ShipmentStatus } from '../../types/logistics';
import {
  Package,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Truck,
  Barcode,
  QrCode,
  FileText,
  DollarSign,
  Globe,
  AlertTriangle,
} from 'lucide-react';

interface ShipmentCreationTrackingViewProps {
  shipments: Shipment[];
  onCreateShipment: (shipment: Shipment) => void;
  onAdvanceStatus: (shipmentId: string, status: ShipmentStatus) => void;
}

export const ShipmentCreationTrackingView: React.FC<ShipmentCreationTrackingViewProps> = ({
  shipments,
  onCreateShipment,
  onAdvanceStatus,
}) => {
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(shipments[0] || null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [recipient, setRecipient] = useState('');
  const [address, setAddress] = useState('');
  const [country, setCountry] = useState('USA');
  const [weightKg, setWeightKg] = useState(2.5);

  const filteredShipments = shipments.filter(
    (s) =>
      s.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.shipmentId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !address) return;

    const newTracking = `TRK-900${Math.floor(100000 + Math.random() * 900000)}`;
    const newShipment: Shipment = {
      shipmentId: `SHP-${Math.floor(2000 + Math.random() * 8000)}`,
      orderId: `ORD-${Math.floor(98000 + Math.random() * 900)}`,
      trackingNumber: newTracking,
      carrierId: 'CARRIER-AMZL',
      carrierName: 'Commerce Zon Logistics',
      shippingMethod: country === 'USA' ? 'EXPRESS' : 'INTERNATIONAL',
      originAddress: 'FBA Warehouse EWR4, Robbinsville, NJ',
      destinationAddress: address,
      destinationCountry: country,
      recipientName: recipient,
      recipientPhone: '+1-555-019-2831',
      weightKg: weightKg,
      dimensionsCm: { length: 30, width: 20, height: 15 },
      items: [
        {
          sku: 'SKU-LOGISTICS-GENERIC',
          name: 'Commerce Zon Marketplace Customer Order Goods',
          quantity: 1,
          unitWeightKg: weightKg,
          unitValueUSD: 149.99,
        },
      ],
      shippingCostUSD: country === 'USA' ? 12.99 : 45.0,
      status: 'SHIPMENT_CREATED',
      estimatedDeliveryDate: new Date(Date.now() + 86400000 * 2).toISOString().substring(0, 16).replace('T', ' '),
      createdAt: new Date().toISOString().substring(0, 16).replace('T', ' '),
      trackingTimeline: [
        {
          stage: 'SHIPMENT_CREATED',
          title: 'Shipment Created & Label Printed',
          location: 'EWR4 Fulfillment Hub',
          timestamp: new Date().toISOString().substring(0, 16).replace('T', ' '),
          completed: true,
        },
      ],
    };

    onCreateShipment(newShipment);
    setSelectedShipment(newShipment);
    setShowModal(false);
    setRecipient('');
    setAddress('');
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <Package className="w-4 h-4 text-[#febd69]" />
            <span>SHIPMENT CREATION & COMPLETE TRACKING TELEMETRY</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Generate Shipping Labels & Monitor Real-Time Milestones</h2>
          <p className="text-xs text-slate-400 mt-1">
            Barcode generation, QR tracking codes, carrier assignments & step-by-step dispatch status progression
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black rounded-xl text-xs transition flex items-center space-x-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Shipment</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs font-mono">
        {/* Left Column: Shipment List & Search */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by Tracking # or Recipient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-[#febd69]"
            />
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredShipments.map((s) => {
              const isSelected = selectedShipment?.shipmentId === s.shipmentId;
              return (
                <button
                  key={s.shipmentId}
                  onClick={() => setSelectedShipment(s)}
                  className={`w-full p-3.5 rounded-xl border text-left transition flex items-start justify-between ${
                    isSelected
                      ? 'bg-slate-950 border-[#febd69] text-white shadow-md'
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <strong className="text-white text-xs">{s.trackingNumber}</strong>
                      <span className="text-[9px] text-[#febd69] font-bold">{s.shippingMethod}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block">{s.recipientName} ({s.destinationCountry})</span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                      s.status === 'DELIVERED'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : s.status === 'OUT_FOR_DELIVERY'
                        ? 'bg-[#febd69]/20 text-[#febd69]'
                        : 'bg-sky-500/20 text-sky-300'
                    }`}
                  >
                    {s.status.replace(/_/g, ' ')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Tracking Timeline & Digital Label */}
        {selectedShipment ? (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6 lg:col-span-2">
            {/* Header / Digital Label Bar */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-base font-black text-white">{selectedShipment.trackingNumber}</span>
                  <span className="px-2 py-0.5 bg-slate-800 text-sky-300 rounded text-[9px] font-extrabold">
                    {selectedShipment.carrierName}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Recipient: <strong className="text-slate-200">{selectedShipment.recipientName}</strong> • {selectedShipment.destinationAddress}
                </p>
              </div>

              {/* Barcode & Label Simulator */}
              <div className="bg-white p-2 rounded-lg text-slate-950 flex flex-col items-center shadow font-mono">
                <Barcode className="w-28 h-8 text-slate-950" />
                <span className="text-[8px] font-black tracking-widest uppercase">{selectedShipment.trackingNumber}</span>
              </div>
            </div>

            {/* Stage Controls */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">Advance Stage:</span>
              {(['IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'] as ShipmentStatus[]).map((st) => (
                <button
                  key={st}
                  onClick={() => onAdvanceStatus(selectedShipment.shipmentId, st)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[9px] font-bold"
                >
                  Mark {st.replace(/_/g, ' ')}
                </button>
              ))}
            </div>

            {/* Complete Tracking Timeline */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-800 pb-2">
                Live Shipment Telemetry & Milestone Timeline
              </h4>

              <div className="space-y-3 relative pl-4 border-l-2 border-slate-800">
                {selectedShipment.trackingTimeline.map((ts, idx) => (
                  <div key={idx} className="relative group">
                    <div
                      className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 ${
                        ts.completed ? 'bg-emerald-500 border-emerald-400' : 'bg-slate-950 border-slate-700'
                      }`}
                    />

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-extrabold text-white">{ts.title}</span>
                        <span className="text-slate-500 text-[9px]">{ts.timestamp}</span>
                      </div>
                      <span className="text-slate-400 text-[10px] block flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-[#febd69] inline" />
                        <span>{ts.location}</span>
                      </span>
                      {ts.notes && <p className="text-rose-300 text-[10px] pt-1">{ts.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500 lg:col-span-2">Select a shipment to view tracking</div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full shadow-2xl space-y-4 font-sans">
            <h3 className="text-base font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3">
              Generate New Order Shipment Label
            </h3>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Recipient Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Connor"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#febd69]"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Destination Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 742 Evergreen Terrace, Springfield, OR"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#febd69]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Country</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#febd69]"
                  >
                    <option value="USA">United States (USA)</option>
                    <option value="DEU">Germany (DEU)</option>
                    <option value="CAN">Canada (CAN)</option>
                    <option value="GBR">United Kingdom (GBR)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={weightKg}
                    onChange={(e) => setWeightKg(parseFloat(e.target.value) || 1)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#febd69]"
                  />
                </div>
              </div>

              <div className="flex space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#febd69] text-slate-950 font-black rounded-xl"
                >
                  Print Label & Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
