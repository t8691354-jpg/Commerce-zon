import React, { useState } from 'react';
import {
  Truck,
  MapPin,
  Navigation,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Phone,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

export const DeliveryPartnerPortalView: React.FC = () => {
  const [deliveries, setDeliveries] = useState([
    { id: 'DEL-9901', recipient: 'John Doe', address: '742 Evergreen Terrace, Seattle, WA', time: 'Estimated 10:30 AM', status: 'IN_TRANSIT', phone: '+1 (555) 019-2831' },
    { id: 'DEL-9902', recipient: 'Sarah Smith', address: '1204 Pine Street, San Francisco, CA', time: 'Estimated 12:15 PM', status: 'DISPATCHED', phone: '+1 (555) 438-9921' },
    { id: 'DEL-9903', recipient: 'Michael Vance', address: '88 Market Avenue, Austin, TX', time: 'Completed 08:45 AM', status: 'DELIVERED', phone: '+1 (555) 882-1049' },
  ]);

  return (
    <div className="p-6 bg-slate-950 text-slate-100 min-h-screen space-y-6 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-2xl">
            <Truck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-100 tracking-tight">Delivery Fleet & Driver Command Hub</h1>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Live GPS route optimization • Real-time proof of delivery (PoD) & biometric check-in
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs rounded-xl flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Driver On Duty • Van #SF-884</span>
          </span>
        </div>
      </div>

      {/* Fleet Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-2">
          <span className="text-[10px] text-slate-400 uppercase">Assigned Packages</span>
          <div className="text-2xl font-black text-purple-400">28 Stops</div>
          <div className="text-[10px] text-slate-400">25 delivered • 3 remaining</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-2">
          <span className="text-[10px] text-slate-400 uppercase">On-Time Delivery Rate</span>
          <div className="text-2xl font-black text-emerald-400">99.4%</div>
          <div className="text-[10px] text-emerald-400">Prime Same-Day Guarantee</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-2">
          <span className="text-[10px] text-slate-400 uppercase">Route Optimization</span>
          <div className="text-2xl font-black text-amber-400">AI Route Active</div>
          <div className="text-[10px] text-slate-400">Saves 4.2 gal fuel per run</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-2">
          <span className="text-[10px] text-slate-400 uppercase">Today Payout</span>
          <div className="text-2xl font-black text-slate-100">$280.00</div>
          <div className="text-[10px] text-slate-400">Plus $45.00 customer tips</div>
        </div>
      </div>

      {/* Active Route Manifest */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden font-mono">
        <div className="p-4 bg-slate-950 border-b border-slate-800 font-bold text-slate-200 text-xs flex justify-between items-center">
          <span>Active Manifest Dispatch Stops</span>
          <span className="text-[10px] text-purple-400">GPS TELEMETRY SYNCED</span>
        </div>
        <div className="divide-y divide-slate-800/60">
          {deliveries.map((item) => (
            <div key={item.id} className="p-5 hover:bg-slate-800/40 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-slate-950 border border-slate-800 text-purple-400 rounded-2xl">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-amber-400 text-sm">{item.id}</span>
                    <span className="text-xs font-bold text-slate-100">{item.recipient}</span>
                  </div>
                  <div className="text-xs text-slate-300">{item.address}</div>
                  <div className="text-[10px] text-slate-500 flex items-center space-x-2">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{item.time}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 self-end md:self-center">
                <a href={`tel:${item.phone}`} className="p-2.5 bg-slate-950 border border-slate-800 hover:border-purple-400 text-slate-300 rounded-xl text-xs transition">
                  <Phone className="w-4 h-4 text-purple-400" />
                </a>
                <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Proof of Delivery</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
