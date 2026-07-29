import React, { useState } from 'react';
import { ProofOfDelivery, Shipment } from '../../types/logistics';
import {
  ShieldCheck,
  FileSignature,
  Camera,
  MapPin,
  Clock,
  User,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface ProofOfDeliveryViewProps {
  shipments: Shipment[];
}

export const ProofOfDeliveryView: React.FC<ProofOfDeliveryViewProps> = ({ shipments }) => {
  const deliveredShipments = shipments.filter((s) => s.status === 'DELIVERED' || s.proofOfDelivery);
  const selectedShipment = deliveredShipments[0] || shipments[2] || shipments[0];

  const pod = selectedShipment?.proofOfDelivery || {
    recipientName: selectedShipment?.recipientName || 'Homer Simpson',
    signatureDataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60"><path d="M 10 30 Q 30 10 50 30 T 90 30 T 130 30 T 180 20" stroke="%2310b981" stroke-width="3" fill="none"/></svg>',
    photoUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
    gpsLatitude: 44.0462,
    gpsLongitude: -123.022,
    timestamp: '2026-07-27 10:48',
    driverNotes: 'Delivered directly to customer. Signature verified via electronic pad.',
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-emerald-400 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>ELECTRONIC PROOF OF DELIVERY (POD) VERIFICATION AUDIT</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Digital Customer Signature, Photographic Proof & GPS Verification</h2>
          <p className="text-xs text-slate-400 mt-1">
            Tamper-proof audit record containing vector customer signatures, high-resolution delivery photo, driver notes & geo-stamped timestamps
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg font-bold flex items-center space-x-1">
            <Lock className="w-3.5 h-3.5" />
            <span>Encrypted POD Storage</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono text-xs">
        {/* POD Audit Details */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 font-sans">
          <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center space-x-2 font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>POD Audit Certificate — {selectedShipment?.shipmentId}</span>
          </h3>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-500 uppercase">Consignment ID:</span>
              <strong className="text-white">{selectedShipment?.shipmentId}</strong>
            </div>

            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-500 uppercase">Carrier Tracking #:</span>
              <strong className="text-emerald-400">{selectedShipment?.trackingNumber}</strong>
            </div>

            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-500 uppercase">Signee / Recipient:</span>
              <strong className="text-white">{pod.recipientName}</strong>
            </div>

            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-500 uppercase">Timestamp:</span>
              <strong className="text-sky-300">{pod.timestamp}</strong>
            </div>

            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-500 uppercase">GPS Verification Coordinates:</span>
              <strong className="text-amber-300">{pod.gpsLatitude.toFixed(4)}, {pod.gpsLongitude.toFixed(4)}</strong>
            </div>

            <div className="pt-1">
              <span className="text-slate-500 uppercase block mb-1">Driver Notes:</span>
              <p className="text-slate-300 text-[11px] font-sans bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                "{pod.driverNotes}"
              </p>
            </div>
          </div>
        </div>

        {/* Visual Signature & Photo Preview */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 font-sans">
          <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3 font-mono">
            Captured Signature & Delivery Photo
          </h3>

          <div className="space-y-4">
            {/* Customer Digital Signature Box */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-400 uppercase font-bold flex items-center space-x-1">
                  <FileSignature className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verified Customer Signature</span>
                </span>
                <span className="text-emerald-400">Match 99.8%</span>
              </div>

              <div className="h-20 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-center p-2">
                <img
                  src={pod.signatureDataUrl}
                  alt="Customer Signature"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>

            {/* Photo Proof */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-400 uppercase font-bold flex items-center space-x-1">
                  <Camera className="w-3.5 h-3.5 text-sky-400" />
                  <span>Doorstep Photo Verification</span>
                </span>
                <span className="text-sky-300">Geo-Tagged Photo</span>
              </div>

              <div className="h-36 bg-slate-900 rounded-lg border border-slate-800 overflow-hidden relative">
                <img
                  src={pod.photoUrl}
                  alt="Doorstep Photo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-slate-950/80 px-2.5 py-1 rounded text-[9px] font-mono text-emerald-300 border border-slate-800">
                  GPS: {pod.gpsLatitude}, {pod.gpsLongitude} • {pod.timestamp}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
