import React, { useState } from 'react';
import { Shipment, ProofOfDelivery } from '../../types/logistics';
import { CheckCircle2, ShieldCheck, MapPin, Camera, PenTool, UserCheck, Clock, FileText } from 'lucide-react';

interface DeliveryAndPODViewProps {
  shipments: Shipment[];
  onUploadPOD: (shipmentId: string, pod: ProofOfDelivery) => void;
}

export const DeliveryAndPODView: React.FC<DeliveryAndPODViewProps> = ({
  shipments,
  onUploadPOD,
}) => {
  const [selectedShipmentId, setSelectedShipmentId] = useState<string>(shipments[0]?.shipmentId || '');
  const [recipientName, setRecipientName] = useState('');
  const [notes, setNotes] = useState('Handed directly to resident. Signed on mobile handheld device.');

  const currentShipment = shipments.find((s) => s.shipmentId === selectedShipmentId);

  const handleCapturePOD = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipmentId || !recipientName) return;

    const pod: ProofOfDelivery = {
      recipientName,
      signatureDataUrl:
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60"><path d="M 10 30 Q 30 10 50 30 T 90 30 T 130 30 T 180 20" stroke="%2310b981" stroke-width="3" fill="none"/></svg>',
      photoUrl:
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
      gpsLatitude: 40.7128,
      gpsLongitude: -74.006,
      timestamp: new Date().toISOString().substring(0, 16).replace('T', ' '),
      driverNotes: notes,
    };

    onUploadPOD(selectedShipmentId, pod);
    alert(`Proof of Delivery (POD) uploaded and digitally signed for ${selectedShipmentId}!`);
    setRecipientName('');
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#febd69]" />
            <span>PROOF OF DELIVERY (POD) & DRIVER TELEMETRY AUDIT</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Digital Customer Signatures, GPS Coordinates & Parcel Photos</h2>
          <p className="text-xs text-slate-400 mt-1">
            Store secure audit evidence of completed last-mile deliveries to eliminate non-delivery disputes and chargebacks
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg font-bold">
            GPS Lock Verified
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs font-mono">
        {/* POD Capture Form */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 font-sans">
          <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center space-x-2">
            <PenTool className="w-4 h-4 text-[#febd69]" />
            <span>Capture Mobile Proof of Delivery</span>
          </h3>

          <form onSubmit={handleCapturePOD} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Select Active Shipment</label>
              <select
                value={selectedShipmentId}
                onChange={(e) => setSelectedShipmentId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono focus:outline-none focus:border-[#febd69]"
              >
                {shipments.map((s) => (
                  <option key={s.shipmentId} value={s.shipmentId}>
                    {s.shipmentId} - {s.recipientName} ({s.status})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Recipient Name Signee</label>
              <input
                type="text"
                required
                placeholder="Name of person accepting package"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono focus:outline-none focus:border-[#febd69]"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Driver Delivery Notes</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono focus:outline-none focus:border-[#febd69]"
              />
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[10px] text-slate-400 uppercase block font-mono">Digital Signature & Camera Lock</span>
              <div className="h-16 bg-slate-900 border border-dashed border-slate-700 rounded-lg flex items-center justify-center text-emerald-400 font-mono text-[10px]">
                <PenTool className="w-4 h-4 mr-2 text-emerald-400" />
                <span>Simulated Touch Screen Digital Signature Lock</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black rounded-xl transition shadow-lg"
            >
              Upload & Seal POD Audit Record
            </button>
          </form>
        </div>

        {/* POD Record Audit Preview */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center justify-between">
            <span>Proof of Delivery Inspection Panel</span>
            <span className="text-emerald-400 text-[10px]">Verified Audit Evidence</span>
          </h3>

          {currentShipment?.proofOfDelivery ? (
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
              <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                <div>
                  <strong className="text-white text-sm block">{currentShipment.proofOfDelivery.recipientName}</strong>
                  <span className="text-slate-400 text-[10px]">
                    Signed: {currentShipment.proofOfDelivery.timestamp}
                  </span>
                </div>
                <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-[9px] font-black">
                  POD VERIFIED
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-slate-500 text-[9px] uppercase block">Captured Photo Evidence</span>
                  <img
                    src={currentShipment.proofOfDelivery.photoUrl}
                    alt="Delivery Photo"
                    className="w-full h-24 object-cover rounded-lg border border-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-slate-500 text-[9px] uppercase block">Customer Digital Signature</span>
                  <div
                    className="w-full h-24 bg-slate-900 rounded-lg border border-slate-800 p-2 flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: currentShipment.proofOfDelivery.signatureDataUrl || '' }}
                  />
                </div>
              </div>

              <div className="space-y-1 text-[10px] text-slate-300 bg-slate-900 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center space-x-1.5 text-sky-400 font-bold">
                  <MapPin className="w-3.5 h-3.5 text-sky-400" />
                  <span>
                    GPS Lat: {currentShipment.proofOfDelivery.gpsLatitude} • Long: {currentShipment.proofOfDelivery.gpsLongitude}
                  </span>
                </div>
                <p className="text-slate-400 pt-1">Driver Notes: {currentShipment.proofOfDelivery.driverNotes}</p>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500">
              No POD evidence uploaded yet for shipment {selectedShipmentId}. Use the form to capture signature & photo.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
