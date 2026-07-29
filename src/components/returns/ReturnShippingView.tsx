import React, { useState } from 'react';
import { ReturnRequest } from '../../types/returns';
import {
  Truck,
  QrCode,
  MapPin,
  Calendar,
  Search,
  Download,
  Printer,
  ExternalLink,
  CheckCircle2,
  Clock,
} from 'lucide-react';

interface Props {
  returnRequests: ReturnRequest[];
}

export const ReturnShippingView: React.FC<Props> = ({ returnRequests }) => {
  const [selectedReturnId, setSelectedReturnId] = useState(returnRequests[0]?.returnId || '');
  const [pickupDate, setPickupDate] = useState('2026-07-29');
  const [pickupTimeSlot, setPickupTimeSlot] = useState('09:00 AM - 12:00 PM');
  const [carrierPickupConfirmed, setCarrierPickupConfirmed] = useState(false);

  const target = returnRequests.find((r) => r.returnId === selectedReturnId) || returnRequests[0];

  const handleSchedulePickup = (e: React.FormEvent) => {
    e.preventDefault();
    setCarrierPickupConfirmed(true);
    alert(`Carrier Home Pickup scheduled for ${target.returnId} on ${pickupDate} (${pickupTimeSlot})!`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Truck className="w-5 h-5 text-[#febd69]" />
            <span>Reverse Logistics & Prepaid Return Shipping Label Hub</span>
          </h2>
          <p className="text-xs text-slate-400">
            Generate QR barcodes for paperless mobile drop-offs, schedule courier home doorstep pickups, and track reverse transit.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-slate-800 text-slate-300 font-mono text-xs rounded-lg border border-slate-700">
            Carriers Active: UPS, FedEx, DHL, Canada Post
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Selector */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
          <h3 className="text-xs font-bold text-[#febd69] uppercase tracking-wider">Select Return Label</h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">RMA Selection</label>
            <select
              value={selectedReturnId}
              onChange={(e) => setSelectedReturnId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#febd69]"
            >
              {returnRequests.map((r) => (
                <option key={r.returnId} value={r.returnId}>
                  {r.returnId} - {r.item.name.substring(0, 22)}...
                </option>
              ))}
            </select>
          </div>

          {target && target.shippingLabel && (
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 text-xs">
              <div className="font-bold text-white border-b border-slate-800 pb-2">Carrier Telemetry</div>
              <div className="space-y-1">
                <div className="text-slate-400">Carrier: <span className="text-[#febd69] font-bold">{target.shippingLabel.carrier}</span></div>
                <div className="text-slate-400">Tracking #: <span className="font-mono text-white">{target.shippingLabel.trackingNumber}</span></div>
                <div className="text-slate-400">Destination FC: <span className="text-slate-300">{target.shippingLabel.returnAddress}</span></div>
              </div>
            </div>
          )}
        </div>

        {/* Label View & Pickup Scheduler */}
        {target && target.shippingLabel ? (
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-2">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <QrCode className="w-4 h-4 text-[#febd69]" />
                  <span>Prepaid Paperless QR Barcode & Shipping Label ({target.returnId})</span>
                </h3>
                <p className="text-xs text-slate-400">No printer required. Present this QR code at any UPS or FedEx store.</p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => alert(`Printing Label PDF for ${target.returnId}`)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-lg flex items-center space-x-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Label</span>
                </button>
                <button
                  onClick={() => alert(`Downloading PDF for ${target.returnId}`)}
                  className="px-3 py-1.5 bg-[#febd69] text-slate-950 font-bold text-xs rounded-lg flex items-center space-x-1 hover:bg-[#f3a847]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Paperless Barcode Container */}
              <div className="p-5 bg-white rounded-xl text-slate-950 space-y-3 flex flex-col items-center justify-center text-center">
                <div className="text-xs font-black uppercase tracking-widest text-slate-600">{target.shippingLabel.carrier}</div>
                <img
                  src={target.shippingLabel.qrCodeUrl}
                  alt="Return QR Barcode"
                  className="w-36 h-36 border border-slate-300 p-2 rounded-lg"
                />
                <div className="font-mono text-xs font-bold text-slate-800">Tracking: {target.shippingLabel.trackingNumber}</div>
                <div className="text-[10px] text-slate-500 max-w-xs">Scan at carrier counter for instant automated printing & package scan.</div>
              </div>

              {/* Schedule Doorstep Courier Pickup */}
              <form onSubmit={handleSchedulePickup} className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
                <h4 className="text-xs font-bold text-[#febd69] uppercase tracking-wider flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Schedule Courier Home Doorstep Pickup</span>
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Pickup Date</label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#febd69]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Time Slot Window</label>
                  <select
                    value={pickupTimeSlot}
                    onChange={(e) => setPickupTimeSlot(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#febd69]"
                  >
                    <option value="08:00 AM - 11:00 AM">08:00 AM - 11:00 AM Morning</option>
                    <option value="11:00 AM - 02:00 PM">11:00 AM - 02:00 PM Afternoon</option>
                    <option value="02:00 PM - 06:00 PM">02:00 PM - 06:00 PM Evening</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black text-xs rounded-xl shadow flex items-center justify-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Courier Home Pickup</span>
                </button>

                {carrierPickupConfirmed && (
                  <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>Driver dispatched for {pickupDate} ({pickupTimeSlot}).</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-8 rounded-xl text-center text-slate-500 text-xs">
            No shipping label generated for selected request.
          </div>
        )}
      </div>
    </div>
  );
};
