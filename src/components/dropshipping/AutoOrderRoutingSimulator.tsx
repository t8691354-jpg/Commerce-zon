import React, { useState } from 'react';
import { DropshipOrder } from '../../types/dropshipping';
import {
  GitBranch,
  Play,
  CheckCircle2,
  Sliders,
  Building2,
  Clock,
  ShieldCheck,
  ArrowRight,
  Package,
} from 'lucide-react';

interface AutoOrderRoutingSimulatorProps {
  orders: DropshipOrder[];
  onRouteSimulatedOrder: (newOrder: DropshipOrder) => void;
}

export const AutoOrderRoutingSimulator: React.FC<AutoOrderRoutingSimulatorProps> = ({
  orders,
  onRouteSimulatedOrder,
}) => {
  const [routingPriority, setRoutingPriority] = useState<
    'PROXIMITY_NEAREST_WAREHOUSE' | 'LOWEST_WHOLESALE_COST' | 'HIGHEST_SUPPLIER_RATING'
  >('PROXIMITY_NEAREST_WAREHOUSE');

  const [activeStep, setActiveStep] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const routingSteps = [
    { step: 1, title: 'Payment Verification', desc: 'Verify 256-bit buyer credit card / wallet payment authorization' },
    { step: 2, title: 'Create Marketplace Order', desc: 'Generate parent order AMZ-ORD-90399 in marketplace core engine' },
    { step: 3, title: 'Identify Optimal Supplier', desc: 'Apply priority rule: Proximity / Stock availability match' },
    { step: 4, title: 'Send Fulfilment EDI Request', desc: 'Dispatch REST/WebSocket API payload to supplier ERP portal' },
    { step: 5, title: 'Reserve Warehouse Inventory', desc: 'Execute 15-min stock lock in Newark Distribution Hub' },
    { step: 6, title: 'Generate Supplier Order', desc: 'Issue DSO-88299 purchase order with wholesale payout ledger' },
    { step: 7, title: 'Update Seller Dashboard', desc: 'Sync seller profit margin & order status to "Fulfilment Requested"' },
    { step: 8, title: 'Update Buyer Dashboard', desc: 'Provide estimated delivery date & package tracking placeholder' },
    { step: 9, title: 'Multi-Channel Supplier Alert', desc: 'Dispatch instant SMS & Email notification to supplier warehouse team' },
  ];

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setActiveStep(1);

    let current = 1;
    const interval = setInterval(() => {
      current++;
      setActiveStep(current);

      if (current >= 9) {
        clearInterval(interval);
        setIsSimulating(false);

        // Inject simulated routed order
        const simOrder: DropshipOrder = {
          orderId: `DSO-${Math.floor(88300 + Math.random() * 100)}`,
          marketplaceOrderId: `AMZ-ORD-${Math.floor(90400 + Math.random() * 100)}`,
          buyerName: 'Samantha Green',
          buyerEmail: 'samantha.g@example.com',
          shippingAddress: {
            street: '500 Fifth Avenue',
            city: 'New York',
            state: 'NY',
            zipCode: '10110',
            country: 'United States',
            phone: '+1 (212) 555-0130',
          },
          sellerId: 'SEL-301',
          sellerName: 'PrimeTech Direct Store',
          supplierId: 'SUP-9001',
          supplierName: 'Apex Electronics Global Wholesalers',
          warehouseId: 'WH-US-EAST',
          items: [
            {
              itemId: 'ITEM-SIM',
              supplierProductId: 'SPROD-801',
              sku: 'APX-ANC-HP900-BLK',
              productTitle: 'AuraSound ANC Headphones (Midnight Black)',
              quantity: 1,
              wholesaleUnitPriceUSD: 42.50,
              sellingUnitPriceUSD: 119.99,
              totalWholesaleUSD: 42.50,
              totalSellingUSD: 119.99,
              sellerMarginUSD: 77.49,
            },
          ],
          grossBuyerPaidUSD: 119.99,
          supplierProductCostUSD: 42.50,
          marketplaceCommissionUSD: 12.00,
          sellerProfitUSD: 65.49,
          shippingCostUSD: 8.50,
          taxUSD: 9.60,
          orderStatus: 'FULFILMENT_REQUESTED',
          carrier: 'FEDEX',
          estimatedDeliveryDate: '2026-07-30',
          trackingTimeline: [
            {
              id: `TRK-${Date.now()}`,
              status: 'PENDING_ROUTING',
              location: 'Amazon Order Router',
              description: `Routed to Apex Electronics via ${routingPriority}`,
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
            },
          ],
          createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        };

        onRouteSimulatedOrder(simOrder);
        alert(`Order ${simOrder.orderId} routed successfully to ${simOrder.supplierName}!`);
      }
    }, 600);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <GitBranch className="w-4 h-4 text-emerald-400" />
            <span>AUTOMATIC ORDER ROUTING & FULFILMENT DISPATCH PIPELINE</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Amazon-Grade Automated Order Routing Engine</h2>
          <p className="text-xs text-slate-400 mt-1">
            9-step automated pipeline executing instant supplier matching, stock lock reservation, ERP EDI dispatch & buyer updates
          </p>
        </div>

        <button
          onClick={handleRunSimulation}
          disabled={isSimulating}
          className="px-4 py-2.5 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black text-xs rounded-xl transition flex items-center space-x-2 shadow-lg"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{isSimulating ? 'Routing Simulation Active...' : 'Simulate Live Order Routing'}</span>
        </button>
      </div>

      {/* Routing Rule Config */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 text-xs">
        <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-2 border-b border-slate-800 pb-3">
          <Sliders className="w-4 h-4 text-[#febd69]" />
          <span>Routing Priority Rule Engine</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              id: 'PROXIMITY_NEAREST_WAREHOUSE',
              title: 'Nearest Warehouse Proximity',
              desc: 'Select supplier warehouse closest to buyer postal code for fastest transit time.',
            },
            {
              id: 'LOWEST_WHOLESALE_COST',
              title: 'Lowest Wholesale Cost',
              desc: 'Select supplier offering lowest product wholesale price to maximize seller profit.',
            },
            {
              id: 'HIGHEST_SUPPLIER_RATING',
              title: 'Highest Quality Score',
              desc: 'Route strictly to suppliers with 98%+ on-time fulfillment score.',
            },
          ].map((rule) => (
            <div
              key={rule.id}
              onClick={() => setRoutingPriority(rule.id as any)}
              className={`p-4 rounded-xl border cursor-pointer transition space-y-1.5 ${
                routingPriority === rule.id
                  ? 'bg-slate-950 border-[#febd69] ring-2 ring-amber-400/20'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="font-bold text-white text-xs">{rule.title}</div>
              <p className="text-[10px] text-slate-400">{rule.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 9-Step Visual Pipeline */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6 text-xs">
        <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-2">
          <Clock className="w-4 h-4 text-sky-400" />
          <span>9-Step Order Execution Timeline</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-9 gap-2">
          {routingSteps.map((s) => {
            const isDone = activeStep >= s.step;
            const isCurrent = activeStep === s.step;

            return (
              <div
                key={s.step}
                className={`p-3 rounded-xl border transition space-y-1 ${
                  isCurrent
                    ? 'bg-amber-500/20 border-[#febd69] text-white ring-2 ring-amber-400/30'
                    : isDone
                    ? 'bg-slate-950 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[10px] font-bold">
                  <span>STEP {s.step}</span>
                  {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <div className="font-black text-[11px] leading-tight">{s.title}</div>
                <p className="text-[9px] opacity-80 leading-snug">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
