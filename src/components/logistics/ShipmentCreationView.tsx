import React, { useState } from 'react';
import { Shipment, ShippingCarrier, ShippingMethodType } from '../../types/logistics';
import {
  Package,
  QrCode,
  Barcode,
  Printer,
  CheckCircle2,
  Truck,
  Building,
  User,
  DollarSign,
  Calendar,
} from 'lucide-react';

interface ShipmentCreationViewProps {
  carriers: ShippingCarrier[];
  onCreateShipment: (shipment: Shipment) => void;
}

export const ShipmentCreationView: React.FC<ShipmentCreationViewProps> = ({
  carriers,
  onCreateShipment,
}) => {
  const [orderId, setOrderId] = useState('ORD-98250');
  const [recipientName, setRecipientName] = useState('Sarah Connor');
  const [recipientPhone, setRecipientPhone] = useState('+1-310-555-0199');
  const [destinationAddress, setDestinationAddress] = useState('777 Cyberdyne Way, Los Angeles, CA 90001');
  const [destinationCountry, setDestinationCountry] = useState('USA');
  const [selectedCarrier, setSelectedCarrier] = useState(carriers[0]?.id || 'CARRIER-AMZL');
  const [selectedMethod, setSelectedMethod] = useState<ShippingMethodType>('EXPRESS');
  const [weightKg, setWeightKg] = useState(3.5);

  const [generatedShipment, setGeneratedShipment] = useState<Shipment | null>(null);

  const handleGenerateShipment = (e: React.FormEvent) => {
    e.preventDefault();

    const carrierObj = carriers.find((c) => c.id === selectedCarrier) || carriers[0];
    const shipmentId = `SHP-${Math.floor(8000 + Math.random() * 1000)}`;
    const trackingNumber = `TRK-${Math.floor(900000000 + Math.random() * 90000000)}`;

    const newShipment: Shipment = {
      shipmentId,
      orderId,
      trackingNumber,
      carrierId: carrierObj.id,
      carrierName: carrierObj.name,
      shippingMethod: selectedMethod,
      originAddress: 'Commerce Zon Logistics Fulfillment Center EWR4, Robbinsville, NJ',
      destinationAddress,
      destinationCountry,
      recipientName,
      recipientPhone,
      weightKg,
      dimensionsCm: { length: 35, width: 25, height: 18 },
      items: [
        { sku: 'AMZ-ELEC-99', name: 'Smart AI Smart Home Gateway Pro', quantity: 1, unitWeightKg: weightKg, unitValueUSD: 149.99 },
      ],
      shippingCostUSD: 14.99,
      status: 'SHIPMENT_CREATED',
      estimatedDeliveryDate: '2026-07-29 17:00',
      createdAt: new Date().toISOString().substring(0, 16).replace('T', ' '),
      trackingTimeline: [
        {
          stage: 'SHIPMENT_CREATED',
          title: 'Shipment Created & Carrier Assigned',
          location: 'Origin Warehouse EWR4',
          timestamp: new Date().toISOString().substring(0, 16).replace('T', ' '),
          completed: true,
        },
      ],
    };

    onCreateShipment(newShipment);
    setGeneratedShipment(newShipment);
  };

  const handlePrintLabel = () => {
    window.print();
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-emerald-400 uppercase tracking-wider">
            <Package className="w-4 h-4 text-emerald-400" />
            <span>AUTOMATED SHIPMENT & SHIPPING LABEL DISPATCH ENGINE</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Generate Shipments, Carrier Tracking Numbers & Print Barcode Labels</h2>
          <p className="text-xs text-slate-400 mt-1">
            Automated consignment creation linked with marketplace orders, 1D barcode generator, QR code routing & EDD computation
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg font-bold">
            Barcode Printer Connected
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono text-xs">
        {/* Shipment Form */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 font-sans">
          <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center space-x-2">
            <Truck className="w-4 h-4 text-emerald-400" />
            <span>Consignment & Carrier Parameters</span>
          </h3>

          <form onSubmit={handleGenerateShipment} className="space-y-3 font-mono text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 text-[10px] uppercase mb-1">Marketplace Order ID</label>
                <input
                  type="text"
                  required
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] uppercase mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseFloat(e.target.value) || 1)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-[10px] uppercase mb-1">Recipient Name</label>
              <input
                type="text"
                required
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-[10px] uppercase mb-1">Delivery Address</label>
              <input
                type="text"
                required
                value={destinationAddress}
                onChange={(e) => setDestinationAddress(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 text-[10px] uppercase mb-1">Carrier Assignment</label>
                <select
                  value={selectedCarrier}
                  onChange={(e) => setSelectedCarrier(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                >
                  {carriers.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] uppercase mb-1">Shipping Speed Method</label>
                <select
                  value={selectedMethod}
                  onChange={(e) => setSelectedMethod(e.target.value as ShippingMethodType)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="EXPRESS">Express Air (2 Days)</option>
                  <option value="SAME_DAY">Prime Same-Day</option>
                  <option value="STANDARD">Standard Ground (3-5 Days)</option>
                  <option value="INTERNATIONAL">Cross-Border Int'l</option>
                  <option value="NEXT_DAY">Next-Day Priority</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition shadow-lg mt-2"
            >
              Generate Shipment & Print Label
            </button>
          </form>
        </div>

        {/* Generated Shipping Label Preview */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 font-sans">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">
              Printable Thermal Shipping Label
            </h3>

            {generatedShipment && (
              <button
                onClick={handlePrintLabel}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold font-mono flex items-center space-x-1.5"
              >
                <Printer className="w-3.5 h-3.5 text-emerald-400" />
                <span>Print Label</span>
              </button>
            )}
          </div>

          {generatedShipment ? (
            <div className="bg-white text-slate-950 p-6 rounded-xl shadow-2xl border-2 border-slate-950 space-y-4 font-mono">
              {/* Header */}
              <div className="flex justify-between items-start border-b-4 border-slate-950 pb-3">
                <div>
                  <h4 className="text-xl font-black tracking-tighter uppercase">{generatedShipment.carrierName}</h4>
                  <span className="text-[10px] font-bold uppercase block">PRIORITY EXPRESS PARCEL DISPATCH</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black bg-slate-950 text-white px-3 py-1 rounded">
                    {generatedShipment.shippingMethod}
                  </span>
                </div>
              </div>

              {/* Addresses */}
              <div className="grid grid-cols-2 gap-4 text-[10px] border-b-2 border-slate-950 pb-3">
                <div>
                  <span className="font-extrabold uppercase block text-slate-600">FROM (ORIGIN):</span>
                  <p className="font-bold">Commerce Zon Fulfillment Center EWR4</p>
                  <p>100 Logistics Way, Robbinsville, NJ 08691</p>
                </div>
                <div>
                  <span className="font-extrabold uppercase block text-slate-600">SHIP TO (DESTINATION):</span>
                  <p className="font-extrabold text-xs">{generatedShipment.recipientName}</p>
                  <p className="font-bold">{generatedShipment.destinationAddress}</p>
                  <p>{generatedShipment.recipientPhone}</p>
                </div>
              </div>

              {/* Weight & EDD */}
              <div className="flex justify-between text-[11px] font-extrabold border-b-2 border-slate-950 pb-3">
                <span>WEIGHT: {generatedShipment.weightKg} KG</span>
                <span>ORDER: {generatedShipment.orderId}</span>
                <span>EST: {generatedShipment.estimatedDeliveryDate}</span>
              </div>

              {/* Barcode & QR Display */}
              <div className="space-y-2 text-center pt-2">
                <div className="flex justify-center items-center py-2 bg-slate-100 rounded border border-slate-300">
                  {/* SVG 1D Barcode Simulation */}
                  <svg className="w-full h-16 max-w-xs" viewBox="0 0 200 50">
                    <rect x="10" y="5" width="3" height="40" fill="#000" />
                    <rect x="15" y="5" width="1" height="40" fill="#000" />
                    <rect x="18" y="5" width="4" height="40" fill="#000" />
                    <rect x="25" y="5" width="2" height="40" fill="#000" />
                    <rect x="30" y="5" width="5" height="40" fill="#000" />
                    <rect x="38" y="5" width="2" height="40" fill="#000" />
                    <rect x="42" y="5" width="1" height="40" fill="#000" />
                    <rect x="46" y="5" width="6" height="40" fill="#000" />
                    <rect x="55" y="5" width="3" height="40" fill="#000" />
                    <rect x="61" y="5" width="2" height="40" fill="#000" />
                    <rect x="66" y="5" width="4" height="40" fill="#000" />
                    <rect x="73" y="5" width="1" height="40" fill="#000" />
                    <rect x="77" y="5" width="5" height="40" fill="#000" />
                    <rect x="85" y="5" width="2" height="40" fill="#000" />
                    <rect x="90" y="5" width="4" height="40" fill="#000" />
                    <rect x="97" y="5" width="3" height="40" fill="#000" />
                    <rect x="103" y="5" width="1" height="40" fill="#000" />
                    <rect x="107" y="5" width="6" height="40" fill="#000" />
                    <rect x="116" y="5" width="2" height="40" fill="#000" />
                    <rect x="121" y="5" width="5" height="40" fill="#000" />
                    <rect x="129" y="5" width="3" height="40" fill="#000" />
                    <rect x="135" y="5" width="1" height="40" fill="#000" />
                    <rect x="139" y="5" width="4" height="40" fill="#000" />
                    <rect x="146" y="5" width="2" height="40" fill="#000" />
                    <rect x="151" y="5" width="5" height="40" fill="#000" />
                    <rect x="159" y="5" width="3" height="40" fill="#000" />
                    <rect x="165" y="5" width="2" height="40" fill="#000" />
                    <rect x="170" y="5" width="4" height="40" fill="#000" />
                    <rect x="177" y="5" width="1" height="40" fill="#000" />
                    <rect x="181" y="5" width="6" height="40" fill="#000" />
                  </svg>
                </div>
                <div className="text-xs font-black tracking-widest">{generatedShipment.trackingNumber}</div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-950 p-12 rounded-xl border border-slate-800 text-center text-slate-500 font-mono text-xs">
              Fill out consignment details and submit to generate printable barcode shipping label
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
