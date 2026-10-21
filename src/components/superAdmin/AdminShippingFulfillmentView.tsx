import React, { useState, useEffect } from 'react';
import {
  Truck,
  Settings,
  Globe,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Plus,
  Trash2,
  Save,
  Package,
  Layers,
  ArrowRight,
  X,
  FileText,
} from 'lucide-react';
import {
  ShipmentRecord,
  AdminShippingConfig,
  FulfillmentStatus,
  ShippingMethodCode,
} from '../../types/shippingFulfillment';
import { shippingFulfillmentClient } from '../../services/shippingFulfillmentClient';
import { CONFIGURED_CARRIERS } from '../../domain/logistics/CarrierProviderFramework';

export const AdminShippingFulfillmentView: React.FC = () => {
  const [config, setConfig] = useState<AdminShippingConfig | null>(null);
  const [shipments, setShipments] = useState<ShipmentRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [savingConfig, setSavingConfig] = useState<boolean>(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [exceptionOnly, setExceptionOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected shipment for Admin Detail & Intervention
  const [selectedShipment, setSelectedShipment] = useState<ShipmentRecord | null>(null);
  const [adminActionStatus, setAdminActionStatus] = useState<FulfillmentStatus>('DELIVERED');
  const [adminNote, setAdminNote] = useState<string>('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);

  // New country inputs
  const [newDestCountry, setNewDestCountry] = useState<string>('');
  const [newOriginCountry, setNewOriginCountry] = useState<string>('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [cfg, shps] = await Promise.all([
        shippingFulfillmentClient.getAdminConfig().catch(() => null),
        shippingFulfillmentClient.getAdminShipments({
          status: statusFilter !== 'ALL' ? statusFilter : undefined,
          exceptionOnly,
        }).catch(() => []),
      ]);
      if (cfg) setConfig(cfg);
      setShipments(shps);
    } catch (err) {
      console.error('Failed to load admin shipping data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, exceptionOnly]);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  // Save Config
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;
    setSavingConfig(true);
    try {
      const updated = await shippingFulfillmentClient.updateAdminConfig(config, 'admin-super-01');
      setConfig(updated);
      showToast('Global shipping rates and carrier policies updated successfully!');
    } catch (err: any) {
      alert(`Failed to save shipping configuration: ${err.message}`);
    } finally {
      setSavingConfig(false);
    }
  };

  // Admin Status Override / Exception Resolution
  const handleAdminStatusOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipment) return;
    setIsUpdatingStatus(true);
    try {
      const updated = await shippingFulfillmentClient.updateShipmentStatus(selectedShipment.id, {
        actor: { id: 'admin-super-01', role: 'ADMIN' },
        newStatus: adminActionStatus,
        description: adminNote || `Platform administrator intervention: status set to ${adminActionStatus}`,
      });
      setSelectedShipment(updated);
      showToast(`Shipment ${updated.shipmentId} status updated to ${adminActionStatus}`);
      await loadData();
    } catch (err: any) {
      alert(`Status update failed: ${err.message}`);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Add / Remove Supported Destination Country
  const handleAddDestCountry = () => {
    if (!config || !newDestCountry.trim()) return;
    const clean = newDestCountry.trim().toUpperCase();
    if (!config.supportedDestinationCountries.includes(clean)) {
      setConfig({
        ...config,
        supportedDestinationCountries: [...config.supportedDestinationCountries, clean],
      });
      setNewDestCountry('');
    }
  };

  const handleRemoveDestCountry = (country: string) => {
    if (!config) return;
    setConfig({
      ...config,
      supportedDestinationCountries: config.supportedDestinationCountries.filter((c) => c !== country),
    });
  };

  // Toggle Shipping Method
  const handleToggleMethod = (method: ShippingMethodCode) => {
    if (!config) return;
    const exists = config.enabledMethods.includes(method);
    setConfig({
      ...config,
      enabledMethods: exists
        ? config.enabledMethods.filter((m) => m !== method)
        : [...config.enabledMethods, method],
    });
  };

  const filteredShipments = shipments.filter((s) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.shipmentId.toLowerCase().includes(q) ||
        s.orderNumber.toLowerCase().includes(q) ||
        s.trackingNumber.toLowerCase().includes(q) ||
        s.sellerName.toLowerCase().includes(q) ||
        s.buyerName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 text-xs font-bold border border-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-amber-400 uppercase tracking-wider font-bold">
            <Truck className="w-4 h-4" />
            <span>SUPER ADMIN LOGISTICS & ORDER FULFILLMENT CONTROL CENTER</span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">
            Global Shipping Policy & Carrier Operations
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Audit multi-carrier fulfillment across all merchants, configure flat/per-kg rate formulas, and manage customs clearance rules
          </p>
        </div>

        <button
          onClick={loadData}
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs flex items-center space-x-1.5 transition self-start md:self-center"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Live Manifests</span>
        </button>
      </div>

      {/* 2-COLUMN LAYOUT: CONFIG & CARRIERS ON LEFT, ACTIVE AUDIT ON RIGHT */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* COLUMN 1: SHIPPING RATES & DESTINATION CONFIGURATION */}
        <div className="xl:col-span-1 space-y-6">
          {config ? (
            <form onSubmit={handleSaveConfig} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Sliders className="w-4 h-4 text-[#febd69]" />
                  <h3 className="text-sm font-black text-white">Platform Shipping Rates & Thresholds</h3>
                </div>
                <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-mono font-bold">
                  Live Policy
                </span>
              </div>

              {/* Free Shipping & Handling Days */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Free Shipping Threshold ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={config.freeShippingThresholdUSD}
                    onChange={(e) =>
                      setConfig({ ...config, freeShippingThresholdUSD: Number(e.target.value) })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Default Handling (Days)</label>
                  <input
                    type="number"
                    value={config.defaultHandlingDays}
                    onChange={(e) =>
                      setConfig({ ...config, defaultHandlingDays: Number(e.target.value) })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              {/* Base Rates */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Domestic Flat</label>
                  <input
                    type="number"
                    step="0.01"
                    value={config.domesticFlatRateUSD}
                    onChange={(e) =>
                      setConfig({ ...config, domesticFlatRateUSD: Number(e.target.value) })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Intl Base</label>
                  <input
                    type="number"
                    step="0.01"
                    value={config.internationalBaseRateUSD}
                    onChange={(e) =>
                      setConfig({ ...config, internationalBaseRateUSD: Number(e.target.value) })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Rate / Kg ($)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={config.perKgRateUSD}
                    onChange={(e) =>
                      setConfig({ ...config, perKgRateUSD: Number(e.target.value) })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-mono"
                  />
                </div>
              </div>

              {/* Express Multiplier */}
              <div className="text-xs space-y-1">
                <label className="text-slate-400 font-bold block">
                  Express Air Multiplier: <strong className="text-amber-400 font-mono">{config.expressMultiplier}x</strong>
                </label>
                <input
                  type="range"
                  min="1.0"
                  max="4.0"
                  step="0.1"
                  value={config.expressMultiplier}
                  onChange={(e) => setConfig({ ...config, expressMultiplier: Number(e.target.value) })}
                  className="w-full accent-[#febd69]"
                />
              </div>

              {/* Enabled Shipping Methods */}
              <div className="space-y-2 border-t border-slate-800 pt-3 text-xs">
                <label className="text-slate-400 font-bold uppercase text-[10px] tracking-wider block">
                  Active Shipping Methods
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['STANDARD', 'EXPRESS', 'SAME_DAY', 'LOCAL_DELIVERY', 'INTERNATIONAL'] as ShippingMethodCode[]).map(
                    (m) => {
                      const enabled = config.enabledMethods.includes(m);
                      return (
                        <button
                          type="button"
                          key={m}
                          onClick={() => handleToggleMethod(m)}
                          className={`p-2 rounded-xl text-left font-bold text-[11px] border transition ${
                            enabled
                              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                              : 'bg-slate-950 border-slate-800 text-slate-500'
                          }`}
                        >
                          <span className="block">{m.replace(/_/g, ' ')}</span>
                          <span className="text-[9px] font-mono font-normal">
                            {enabled ? 'Active' : 'Disabled'}
                          </span>
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Supported Destination Countries */}
              <div className="space-y-2 border-t border-slate-800 pt-3 text-xs">
                <label className="text-slate-400 font-bold uppercase text-[10px] tracking-wider block">
                  Allowed Destination Countries ({config.supportedDestinationCountries.length})
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {config.supportedDestinationCountries.map((c) => (
                    <span
                      key={c}
                      className="px-2 py-0.5 bg-slate-950 border border-slate-700 text-white rounded font-mono font-bold text-xs flex items-center space-x-1"
                    >
                      <span>{c}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDestCountry(c)}
                        className="text-slate-500 hover:text-rose-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex space-x-2 pt-1">
                  <input
                    type="text"
                    maxLength={2}
                    placeholder="2-Letter ISO (e.g. FR)"
                    value={newDestCountry}
                    onChange={(e) => setNewDestCountry(e.target.value.toUpperCase())}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-mono text-xs w-36 uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleAddDestCountry}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition"
                  >
                    Add
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={savingConfig}
                className="w-full py-3 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black rounded-xl text-xs transition shadow flex items-center justify-center space-x-1.5 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{savingConfig ? 'Applying...' : 'Save Logistics Configuration'}</span>
              </button>
            </form>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">Loading shipping config...</div>
          )}

          {/* CARRIER PROVIDER REGISTRY OVERVIEW */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-black text-white">Registered Carrier Integration Framework</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Carriers configured with verified tracking templates and manual dispatch manifests.
            </p>

            <div className="space-y-2 text-xs">
              {Object.values(CONFIGURED_CARRIERS).map((carrier) => (
                <div
                  key={carrier.carrierId}
                  className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1"
                >
                  <div className="flex items-center justify-between font-bold text-white">
                    <span>{carrier.name}</span>
                    <span className="font-mono text-[10px] text-sky-400 bg-sky-950/80 px-1.5 py-0.5 rounded border border-sky-800">
                      {carrier.carrierCode}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Countries: {carrier.supportedCountries.join(', ')}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono truncate">
                    Template: {carrier.trackingUrlTemplate}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMN 2 & 3: MASTER SHIPMENTS TABLE & INTERVENTIONS */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Package className="w-5 h-5 text-sky-400" />
                  <span>Platform-Wide Shipments & Fulfillment Manifests</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Real-time visibility across all multi-seller packages, carrier dispatches, and delivery exceptions
                </p>
              </div>

              {/* Exception toggle */}
              <button
                onClick={() => setExceptionOnly(!exceptionOnly)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 border ${
                  exceptionOnly
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Exceptions Only</span>
              </button>
            </div>

            {/* Filter toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
                {(['ALL', 'PROCESSING', 'PACKED', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED', 'DELAYED', 'DELIVERY_EXCEPTION'] as const).map(
                  (st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-2.5 py-1 rounded-lg font-bold transition whitespace-nowrap ${
                        statusFilter === st
                          ? 'bg-sky-500 text-slate-950 font-black'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {st.replace(/_/g, ' ')}
                    </button>
                  )
                )}
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search shipment, seller, tracking..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 w-60"
                />
              </div>
            </div>

            {/* Shipments Master Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-950 text-slate-400 uppercase border-b border-slate-800 text-[10px] font-mono">
                  <tr>
                    <th className="py-3 px-3">Shipment Ref</th>
                    <th className="py-3 px-3">Order Number</th>
                    <th className="py-3 px-3">Seller Store</th>
                    <th className="py-3 px-3">Buyer & Dest</th>
                    <th className="py-3 px-3">Carrier / Tracking</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-right">Intervene</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-sans">
                  {filteredShipments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500">
                        No shipments found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredShipments.map((shp) => {
                      const isException = ['DELAYED', 'DELIVERY_EXCEPTION', 'RETURNED_TO_SENDER'].includes(shp.status);
                      const isDelivered = shp.status === 'DELIVERED';

                      return (
                        <tr key={shp.id} className="hover:bg-slate-800/40 transition">
                          <td className="py-3 px-3 font-mono font-bold text-white">
                            {shp.shipmentId}
                          </td>

                          <td className="py-3 px-3 font-mono text-[#febd69] font-bold">
                            {shp.orderNumber}
                          </td>

                          <td className="py-3 px-3">
                            <div className="font-semibold text-slate-200">{shp.sellerName}</div>
                            <div className="text-[10px] text-slate-500 font-mono">{shp.sellerId}</div>
                          </td>

                          <td className="py-3 px-3">
                            <div className="font-bold text-white">{shp.buyerName}</div>
                            <div className="text-[10px] text-slate-400">
                              {shp.destinationAddress.city}, {shp.destinationAddress.countryCode}
                            </div>
                          </td>

                          <td className="py-3 px-3">
                            <div className="text-sky-300 font-bold">{shp.carrierName}</div>
                            <div className="text-[10px] text-slate-400 font-mono">#{shp.trackingNumber}</div>
                          </td>

                          <td className="py-3 px-3 text-center">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                isDelivered
                                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                                  : isException
                                  ? 'bg-rose-950 text-rose-300 border-rose-800'
                                  : 'bg-sky-950 text-sky-300 border-sky-800'
                              }`}
                            >
                              {shp.status.replace(/_/g, ' ')}
                            </span>
                          </td>

                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => {
                                setSelectedShipment(shp);
                                setAdminActionStatus(shp.status);
                                setAdminNote('');
                              }}
                              className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg text-[10px] transition"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ADMIN INTERVENTION MODAL */}
      {selectedShipment && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131921] border border-slate-800 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <span>Admin Intervention: Shipment {selectedShipment.shipmentId}</span>
                </h3>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  Order #{selectedShipment.orderNumber} • Merchant: {selectedShipment.sellerName}
                </div>
              </div>
              <button onClick={() => setSelectedShipment(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Details */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Courier & Tracking:</span>
                <div className="font-bold text-white mt-0.5">{selectedShipment.carrierName}</div>
                <div className="font-mono text-sky-400">{selectedShipment.trackingNumber}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Destination:</span>
                <div className="font-bold text-white mt-0.5">{selectedShipment.buyerName}</div>
                <div className="text-slate-400">
                  {selectedShipment.destinationAddress.city}, {selectedShipment.destinationAddress.countryCode}
                </div>
              </div>
            </div>

            {/* Audit History Timeline */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase text-slate-300 tracking-wider">
                Audit Status Timeline
              </span>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 max-h-40 overflow-y-auto text-xs">
                {selectedShipment.statusHistory.map((ev) => (
                  <div key={ev.id} className="border-b border-slate-800/60 pb-1.5 last:border-none">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>{new Date(ev.timestamp).toLocaleString()}</span>
                      <span className="text-amber-400 font-bold">{ev.actorRole}</span>
                    </div>
                    <div className="font-bold text-white">{ev.stage.replace(/_/g, ' ')}</div>
                    <div className="text-[11px] text-slate-400">{ev.description}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Admin Override Form */}
            <form onSubmit={handleAdminStatusOverride} className="space-y-3.5 text-xs border-t border-slate-800 pt-3">
              <div>
                <label className="font-bold text-slate-300">Administrative Status Override</label>
                <select
                  value={adminActionStatus}
                  onChange={(e) => setAdminActionStatus(e.target.value as FulfillmentStatus)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white mt-1 focus:outline-none focus:border-amber-400"
                >
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="PACKED">PACKED</option>
                  <option value="READY_FOR_DISPATCH">READY_FOR_DISPATCH</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="IN_TRANSIT">IN_TRANSIT</option>
                  <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                  <option value="DELIVERED">DELIVERED (Force Complete)</option>
                  <option value="DELAYED">DELAYED</option>
                  <option value="DELIVERY_EXCEPTION">DELIVERY_EXCEPTION</option>
                  <option value="RETURNED_TO_SENDER">RETURNED_TO_SENDER</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-300">Audit Justification / Note *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Verified with FedEx tracking portal that customer received package."
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white mt-1 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedShipment(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingStatus}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl transition shadow disabled:opacity-50"
                >
                  {isUpdatingStatus ? 'Updating...' : 'Execute Admin Override'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
