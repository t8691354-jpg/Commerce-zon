import React from 'react';
import { LogisticsNotification } from '../../types/logistics';
import { Bell, Truck, Mail, Smartphone, Globe, CheckCircle2 } from 'lucide-react';

interface LogisticsNotificationsViewProps {
  notifications: LogisticsNotification[];
  onMarkRead: (id: string) => void;
}

export const LogisticsNotificationsView: React.FC<LogisticsNotificationsViewProps> = ({
  notifications,
  onMarkRead,
}) => {
  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <Bell className="w-4 h-4 text-[#febd69]" />
            <span>REAL-TIME LOGISTICS EVENT NOTIFICATION DISPATCH</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Multi-Channel Telemetry Alerts (Email, SMS, Push & Webhooks)</h2>
          <p className="text-xs text-slate-400 mt-1">
            Automated notifications sent upon order dispatch, out-for-delivery driver updates, POD signatures & customs clearance holds
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg font-bold">
            All Channels Online
          </span>
        </div>
      </div>

      {/* Notifications Stream */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 font-mono text-xs">
        <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3">
          Event Notification Stream ({notifications.length})
        </h3>

        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-xl border flex items-start justify-between gap-4 transition ${
                n.isRead ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-950 border-[#febd69]/40'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-[#febd69] flex-shrink-0">
                  <Truck className="w-4 h-4 text-[#febd69]" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-black text-white text-xs">{n.title}</span>
                    <span className="px-2 py-0.5 bg-slate-800 text-sky-300 rounded text-[8px] font-bold uppercase">
                      Channel: {n.channel}
                    </span>
                  </div>

                  <p className="text-slate-300 text-[11px] font-sans">{n.message}</p>

                  <div className="text-slate-500 text-[9px] flex items-center space-x-3 pt-1">
                    <span>Recipient: {n.recipient}</span>
                    <span>•</span>
                    <span>Timestamp: {n.timestamp}</span>
                  </div>
                </div>
              </div>

              {!n.isRead && (
                <button
                  onClick={() => onMarkRead(n.id)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[9px] font-bold flex-shrink-0"
                >
                  Mark Read
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
