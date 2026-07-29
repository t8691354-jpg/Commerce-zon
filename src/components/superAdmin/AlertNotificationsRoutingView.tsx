import React, { useState } from 'react';
import { MOCK_SYSTEM_ALERT_ROUTES } from '../../data/mockSuperAdmin';
import { SystemAlertRoute } from '../../types/superAdmin';
import { Bell, Plus, CheckCircle2, ShieldAlert, Send } from 'lucide-react';

export const AlertNotificationsRoutingView: React.FC = () => {
  const [routes] = useState<SystemAlertRoute[]>(MOCK_SYSTEM_ALERT_ROUTES);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            System Alert Rules & Incident Notification Channels
          </h3>
          <p className="text-xs text-slate-400">
            Configure automated incident dispatch via PagerDuty Webhook, SMS, Email & In-App Push alerts
          </p>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {routes.map((rt) => (
            <div key={rt.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <span className="text-amber-400 font-bold">{rt.id}</span>
                  <span className="font-sans font-bold text-slate-200">{rt.triggerEvent}</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    rt.severity === 'CRITICAL'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}
                >
                  {rt.severity}
                </span>
              </div>

              <div className="flex justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-900">
                <span>Channel: <strong className="text-blue-400">{rt.channel}</strong></span>
                <span>Recipients: <strong className="text-slate-200">{rt.recipients.join(', ')}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
