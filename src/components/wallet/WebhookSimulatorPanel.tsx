import React, { useState } from 'react';
import { WebhookLog, WebhookEventType } from '../../types/paymentWalletArchitecture';
import { WebhookService } from '../../services/payment/WebhookService';
import { Terminal, Zap, CheckCircle2, AlertCircle, Code, Copy, RefreshCw, Layers } from 'lucide-react';

interface WebhookSimulatorPanelProps {
  onTriggerWebhook: (eventType: WebhookEventType, payload?: any) => void;
  logs: WebhookLog[];
}

export const WebhookSimulatorPanel: React.FC<WebhookSimulatorPanelProps> = ({
  onTriggerWebhook,
  logs,
}) => {
  const [selectedEventType, setSelectedEventType] = useState<WebhookEventType>('payment_intent.succeeded');
  const [selectedLogPayload, setSelectedLogPayload] = useState<WebhookLog | null>(null);
  const [dispatchMsg, setDispatchMsg] = useState<string | null>(null);

  const eventDescriptions: Record<WebhookEventType, string> = {
    'payment_intent.succeeded': 'Buyer checkout completed successfully. Triggers order payment holdback escrow.',
    'payment_intent.payment_failed': 'Payment authorization failed or card declined.',
    'charge.refunded': 'Charge refunded to buyer. Reverses holdback or available seller balances.',
    'charge.dispute.created': 'Buyer filed chargeback dispute. Locks dispute amount in escrow.',
    'transfer.created': 'Internal ledger transfer generated to seller account.',
    'payout.paid': 'Bank ACH / Stripe Connect Payout successfully executed.',
  };

  const handleDispatch = () => {
    onTriggerWebhook(selectedEventType);
    setDispatchMsg(`Dispatched mock webhook event: ${selectedEventType}`);
    setTimeout(() => setDispatchMsg(null), 4000);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      {/* Top Banner */}
      <div className="bg-[#131921] border border-[#37475a] p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-xl font-bold">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black text-purple-400 uppercase tracking-wider">Production Webhook Architecture</span>
              <span className="text-slate-500">•</span>
              <span className="text-xs bg-purple-950 text-purple-300 border border-purple-800 px-2 py-0.5 rounded-full font-mono">
                Stripe Connect & Gateway Ready
              </span>
            </div>
            <h2 className="text-lg font-black text-white mt-0.5">Real-Time Event Listener & Webhook Simulator</h2>
          </div>
        </div>

        <div className="text-xs text-slate-400 font-mono bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
          Endpoint: <span className="text-emerald-400 font-bold">POST /api/webhooks/stripe</span>
        </div>
      </div>

      {/* Interactive Trigger Sandbox */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 md:col-span-1">
          <h3 className="text-sm font-black text-white flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-purple-400" />
            <span>Simulate Webhook Event</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-400">Select Event Type</label>
              <select
                value={selectedEventType}
                onChange={(e) => setSelectedEventType(e.target.value as WebhookEventType)}
                className="w-full mt-1 bg-slate-950 border border-slate-700 text-white text-xs font-mono font-bold rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="payment_intent.succeeded">payment_intent.succeeded</option>
                <option value="payment_intent.payment_failed">payment_intent.payment_failed</option>
                <option value="charge.refunded">charge.refunded</option>
                <option value="charge.dispute.created">charge.dispute.created</option>
                <option value="transfer.created">transfer.created</option>
                <option value="payout.paid">payout.paid</option>
              </select>
            </div>

            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-300 leading-relaxed">
              <span className="font-bold text-purple-300">Impact: </span>
              {eventDescriptions[selectedEventType]}
            </div>

            <button
              onClick={handleDispatch}
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs rounded-xl transition shadow flex items-center justify-center space-x-2"
            >
              <Zap className="w-4 h-4" />
              <span>Dispatch Webhook Event</span>
            </button>

            {dispatchMsg && (
              <div className="p-2.5 bg-emerald-950 border border-emerald-800 text-emerald-300 text-[11px] font-bold rounded-xl flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{dispatchMsg}</span>
              </div>
            )}
          </div>
        </div>

        {/* Live Event Stream */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 md:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-black text-white flex items-center space-x-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Received Webhook Logs ({logs.length})</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Live Ingress Audit</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="py-2 px-3">Event ID</th>
                  <th className="py-2 px-3">Event Type</th>
                  <th className="py-2 px-3">Provider</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Timestamp</th>
                  <th className="py-2 px-3 text-right">Payload</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500 font-sans">
                      No webhook logs captured yet. Click "Dispatch Webhook Event" above.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-2.5 px-3 font-bold text-white">{log.id}</td>
                      <td className="py-2.5 px-3 text-purple-300 font-bold">{log.eventType}</td>
                      <td className="py-2.5 px-3 text-slate-400">{log.provider}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-950 text-emerald-400 border border-emerald-800">
                          {log.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 text-[10px]">
                        {new Date(log.processedAt).toLocaleTimeString()}
                      </td>
                      <td className="py-2.5 px-3 text-right font-sans">
                        <button
                          onClick={() => setSelectedLogPayload(log)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-[10px] font-mono transition"
                        >
                          View Payload
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payload Modal */}
      {selectedLogPayload && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131921] border border-[#37475a] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white font-mono flex items-center space-x-2">
                <Code className="w-4 h-4 text-purple-400" />
                <span>Payload: {selectedLogPayload.id}</span>
              </h3>
              <button
                onClick={() => setSelectedLogPayload(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>

            <pre className="p-4 bg-slate-950 text-emerald-400 border border-slate-800 rounded-xl font-mono text-xs overflow-x-auto max-h-72">
              {JSON.stringify(selectedLogPayload.payload, null, 2)}
            </pre>

            <button
              onClick={() => setSelectedLogPayload(null)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
