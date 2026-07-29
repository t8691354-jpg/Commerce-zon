import React, { useState, useEffect } from 'react';
import { DomainEvent, AuditLog } from '../types/domain';
import { Activity, Terminal, Shield, Cpu, Filter, RefreshCw, CheckCircle2, ChevronDown, ChevronRight } from 'lucide-react';

interface EventInspectorViewProps {
  auditLogs: AuditLog[];
}

export const EventInspectorView: React.FC<EventInspectorViewProps> = ({ auditLogs }) => {
  const [events, setEvents] = useState<DomainEvent[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(false);
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/events');
      if (res.ok) {
        const data = await res.json();
        if (data.events) setEvents(data.events);
      }
    } catch (err) {
      console.warn('Failed to fetch event stream:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredEvents = events.filter((e) => {
    if (selectedDomain !== 'all' && e.domain !== selectedDomain) return false;
    return true;
  });

  const domains = [
    { label: 'All Domains', value: 'all' },
    { label: 'Orders', value: 'ORDER' },
    { label: 'Inventory', value: 'INVENTORY' },
    { label: 'AI Services', value: 'AI_SERVICE' },
    { label: 'Security & Audit', value: 'SECURITY' },
    { label: 'Catalog', value: 'CATALOG' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl">
            <Activity className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <span>Event-Driven Bus & Audit Inspector</span>
              <span className="text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold px-2.5 py-0.5 rounded-full font-mono">
                Task 1.1.2 Active
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Decoupled Pub/Sub event stream monitoring real-time domain aggregate changes
            </p>
          </div>
        </div>

        <button
          onClick={fetchEvents}
          disabled={loading}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-2 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-blue-400 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Stream</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex items-center space-x-2 bg-slate-900/60 p-4 border border-slate-800/80 rounded-xl overflow-x-auto">
        <Filter className="w-4 h-4 text-slate-400 shrink-0" />
        {domains.map((d) => (
          <button
            key={d.value}
            onClick={() => setSelectedDomain(d.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              selectedDomain === d.value
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Event Stream */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Published Domain Events ({filteredEvents.length})</span>
            </h3>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded">
              Pub/Sub Active
            </span>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs space-y-2">
              <Activity className="w-8 h-8 mx-auto text-slate-700 animate-pulse" />
              <p>No domain events matching filter. Try placing an order or running AI search.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {filteredEvents.map((evt) => {
                const isExpanded = expandedEventId === evt.id;

                return (
                  <div
                    key={evt.id}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs space-y-2 hover:border-slate-700 transition"
                  >
                    <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpandedEventId(isExpanded ? null : evt.id)}>
                      <div className="flex items-center space-x-2">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-blue-400 shrink-0" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                        )}
                        <span className="font-mono font-bold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-900">
                          {evt.eventType}
                        </span>
                        <span className="text-slate-400 font-mono text-[11px]">{evt.domain}</span>
                      </div>

                      <div className="flex items-center space-x-2 font-mono text-[11px] text-slate-500">
                        <span>{new Date(evt.timestamp).toLocaleTimeString()}</span>
                        <span className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                          Actor: {evt.actor.type}
                        </span>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="pt-2 border-t border-slate-900 space-y-2">
                        <div className="text-[11px] text-slate-400">
                          <strong>Aggregate ID:</strong> <span className="font-mono text-slate-200">{evt.aggregateId}</span>
                        </div>

                        <div>
                          <span className="text-[11px] font-semibold text-slate-400">Payload JSON:</span>
                          <pre className="mt-1 bg-slate-900 p-3 rounded-lg text-[11px] font-mono text-emerald-300 border border-slate-800/80 overflow-x-auto">
                            {JSON.stringify(evt.payload, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Audit Log Trail */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Audit Trail Logs</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">{auditLogs.length} Entries</span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {auditLogs.map((log) => (
              <div key={log.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-[11px] space-y-1">
                <div className="flex items-center justify-between text-slate-400 font-mono">
                  <span className="text-indigo-400 font-semibold">{log.action}</span>
                  <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="text-slate-300 leading-relaxed">{log.details}</p>
                <div className="text-[10px] text-slate-500 font-mono">
                  Domain: {log.domain} | Actor: {log.actorType} ({log.actorId})
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
