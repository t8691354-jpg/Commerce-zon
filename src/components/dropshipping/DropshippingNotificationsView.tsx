import React, { useState } from 'react';
import { Bell, Mail, Smartphone, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

export const DropshippingNotificationsView: React.FC = () => {
  const [logs] = useState([
    {
      id: 'NOTIF-901',
      type: 'NEW_ORDER_ROUTED',
      channel: 'EMAIL',
      title: 'New Dropship Order DSO-88201 Dispatched',
      body: 'Order DSO-88201 successfully routed to Newark Distribution Hub. Please pack within 12 hours.',
      recipient: 'marcus@apexelectronics.com',
      sentAt: '2026-07-26 14:02:10',
    },
    {
      id: 'NOTIF-902',
      type: 'LOW_STOCK_WARNING',
      channel: 'SMS',
      title: 'Low Stock Alert: SPROD-801 (18 Units Left)',
      body: 'Stock level for AuraSound ANC Headphones is near MOQ threshold. Automated re-order recommended.',
      recipient: '+1 (800) 555-0192',
      sentAt: '2026-07-26 16:00:45',
    },
    {
      id: 'NOTIF-903',
      type: 'PAYMENT_SETTLED',
      channel: 'IN_APP',
      title: 'Supplier Settlement $36.40 Released',
      body: 'Order DSO-88202 payout settled directly to Apex Electronics Commerce Zone Wallet.',
      recipient: 'marcus@apexelectronics.com',
      sentAt: '2026-07-26 14:15:00',
    },
  ]);

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <Bell className="w-4 h-4 text-[#febd69]" />
            <span>MULTI-CHANNEL NOTIFICATION & ALERT DISPATCH STREAM</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Automated Supplier & Seller Notification Stream</h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time audit log of automated Email, SMS, Push & In-App dispatches for order routing, low stock & payout settlements
          </p>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 text-xs">
        <h3 className="text-xs font-black text-white uppercase tracking-wider">
          Recent Multi-Channel Dispatches ({logs.length})
        </h3>

        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                <div className="flex items-center space-x-2">
                  {log.channel === 'EMAIL' ? (
                    <Mail className="w-4 h-4 text-sky-400" />
                  ) : (
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                  )}
                  <span className="font-bold text-white text-sm">{log.title}</span>
                </div>

                <span className="text-[10px] text-slate-400 font-mono">{log.sentAt}</span>
              </div>

              <p className="text-slate-300 text-xs">{log.body}</p>

              <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono pt-1">
                <span>Recipient: {log.recipient}</span>
                <span>Type: <strong className="text-[#febd69]">{log.type}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
