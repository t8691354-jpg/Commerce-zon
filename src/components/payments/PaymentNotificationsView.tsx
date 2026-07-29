import React, { useState } from 'react';
import { PaymentNotificationLog } from '../../types/payments';
import { MOCK_PAYMENT_NOTIFICATIONS } from '../../data/paymentsMockData';
import {
  Bell,
  Mail,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export const PaymentNotificationsView: React.FC = () => {
  const [logs] = useState<PaymentNotificationLog[]>(MOCK_PAYMENT_NOTIFICATIONS);

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <Bell className="w-4 h-4 text-[#febd69]" />
            <span>PAYMENT NOTIFICATIONS & AUDIT DISPATCH ENGINE</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Multi-Channel Payment Notifications Stream</h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time audit log of automated Emails, SMS alerts & Push dispatches for payments, refunds, chargebacks & subscription renewals
          </p>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 text-xs">
        <h3 className="text-xs font-black text-white uppercase tracking-wider">
          Notification Stream ({logs.length} Logged)
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
                <span>Recipient: {log.recipientEmail}</span>
                <span>Type: <strong className="text-[#febd69]">{log.type}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
