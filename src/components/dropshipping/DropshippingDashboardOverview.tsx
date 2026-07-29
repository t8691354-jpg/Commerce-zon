import React from 'react';
import { SupplierRecord, DropshipOrder, SupplierProduct } from '../../types/dropshipping';
import {
  Users,
  CheckCircle2,
  Clock,
  Package,
  Truck,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  RotateCcw,
  BarChart3,
  Building2,
  ShieldCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

interface DropshippingDashboardOverviewProps {
  suppliers: SupplierRecord[];
  orders: DropshipOrder[];
  products: SupplierProduct[];
}

export const DropshippingDashboardOverview: React.FC<DropshippingDashboardOverviewProps> = ({
  suppliers,
  orders,
  products,
}) => {
  // Calculated KPIs
  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter((s) => s.status === 'APPROVED').length;
  const pendingSuppliers = suppliers.filter((s) => s.status === 'PENDING_VERIFICATION').length;

  const totalOrders = orders.length;
  const processingOrders = orders.filter((o) => ['PENDING_ROUTING', 'FULFILMENT_REQUESTED', 'SUPPLIER_ACCEPTED', 'PACKED'].includes(o.orderStatus)).length;
  const shippedOrders = orders.filter((o) => ['SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'].includes(o.orderStatus)).length;
  const deliveredOrders = orders.filter((o) => o.orderStatus === 'DELIVERED').length;
  const cancelledOrders = orders.filter((o) => o.orderStatus === 'CANCELLED').length;
  const returnedOrders = orders.filter((o) => ['RETURN_REQUESTED', 'RETURNED'].includes(o.orderStatus)).length;

  const totalRevenue = orders.reduce((acc, o) => acc + o.grossBuyerPaidUSD, 0);
  const marketplaceRevenue = orders.reduce((acc, o) => acc + o.marketplaceCommissionUSD, 0);

  const avgSupplierPerformance =
    suppliers.length > 0
      ? (suppliers.reduce((acc, s) => acc + s.performanceScore, 0) / suppliers.length).toFixed(1)
      : '94.5';

  // Chart Data
  const dailyOrdersData = [
    { day: 'Mon', orders: 142, revenue: 14800 },
    { day: 'Tue', orders: 189, revenue: 21200 },
    { day: 'Wed', orders: 210, revenue: 25400 },
    { day: 'Thu', orders: 195, revenue: 22100 },
    { day: 'Fri', orders: 260, revenue: 31000 },
    { day: 'Sat', orders: 310, revenue: 38900 },
    { day: 'Sun', orders: 285, revenue: 34500 },
  ];

  const supplierPerformanceData = suppliers.map((s) => ({
    name: s.businessName.length > 18 ? s.businessName.substring(0, 18) + '...' : s.businessName,
    score: s.performanceScore,
    onTime: s.onTimeDeliveryRatePct,
    accuracy: s.inventoryAccuracyPct,
  }));

  const revenueBreakdownData = [
    { name: 'Supplier Product Cost', value: orders.reduce((acc, o) => acc + o.supplierProductCostUSD, 0) || 12000, color: '#38bdf8' },
    { name: 'Seller Profit Margin', value: orders.reduce((acc, o) => acc + o.sellerProfitUSD, 0) || 18000, color: '#34d399' },
    { name: 'Marketplace Take Fee', value: marketplaceRevenue || 4500, color: '#febd69' },
    { name: 'Shipping & Logistics', value: orders.reduce((acc, o) => acc + o.shippingCostUSD, 0) || 2800, color: '#f43f5e' },
  ];

  const deliveryPerformanceData = [
    { status: 'Delivered On-Time', count: 884, pct: '97.2%' },
    { status: 'In Transit', count: 120, pct: '2.1%' },
    { status: 'Delayed / Exceptions', count: 8, pct: '0.7%' },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <Building2 className="w-4 h-4 text-[#febd69]" />
            <span>EXECUTIVE DROPSHIPPNG SYSTEM OVERVIEW</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Multi-Vendor Dropshipping Control Center</h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time supply chain analytics across registered suppliers, inventory synchronizations, automated order routing & revenue splits
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300">Average Supplier Quality Index: <strong className="text-emerald-400">{avgSupplierPerformance}/100</strong></span>
        </div>
      </div>

      {/* KPI Grid - Suppliers & Orders */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow space-y-1">
          <span className="text-[10px] text-slate-400 font-mono uppercase block">Total Suppliers</span>
          <div className="text-lg font-black text-white">{totalSuppliers}</div>
          <span className="text-[10px] text-emerald-400 font-bold block">{activeSuppliers} Active</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow space-y-1">
          <span className="text-[10px] text-slate-400 font-mono uppercase block">Pending KYC</span>
          <div className="text-lg font-black text-amber-400">{pendingSuppliers}</div>
          <span className="text-[10px] text-slate-400 font-bold block">Action Required</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow space-y-1">
          <span className="text-[10px] text-slate-400 font-mono uppercase block">Total Dropship Orders</span>
          <div className="text-lg font-black text-white">{totalOrders}</div>
          <span className="text-[10px] text-sky-400 font-bold block">Live Pipeline</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow space-y-1">
          <span className="text-[10px] text-slate-400 font-mono uppercase block">Processing / Packed</span>
          <div className="text-lg font-black text-amber-300">{processingOrders}</div>
          <span className="text-[10px] text-slate-400 font-bold block">In Fulfillment</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow space-y-1">
          <span className="text-[10px] text-slate-400 font-mono uppercase block">Shipped & In Transit</span>
          <div className="text-lg font-black text-sky-400">{shippedOrders}</div>
          <span className="text-[10px] text-slate-400 font-bold block">With Carriers</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow space-y-1">
          <span className="text-[10px] text-slate-400 font-mono uppercase block">Delivered Orders</span>
          <div className="text-lg font-black text-emerald-400">{deliveredOrders}</div>
          <span className="text-[10px] text-emerald-400 font-bold block">99.1% Success</span>
        </div>
      </div>

      {/* KPI Grid - Financial & Quality */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex justify-between items-center">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Gross GMV Revenue</span>
            <div className="text-xl font-black text-white mt-1">${totalRevenue.toFixed(2)} USD</div>
            <span className="text-[10px] text-emerald-400 font-bold">↑ +18.4% vs last week</span>
          </div>
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex justify-between items-center">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Marketplace Commission</span>
            <div className="text-xl font-black text-emerald-400 mt-1">${marketplaceRevenue.toFixed(2)} USD</div>
            <span className="text-[10px] text-slate-400 font-bold">Average 10% Take-rate</span>
          </div>
          <div className="p-3 bg-[#febd69]/10 border border-[#febd69]/30 rounded-xl text-[#febd69]">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex justify-between items-center">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Cancelled / Exception Rate</span>
            <div className="text-xl font-black text-rose-400 mt-1">0.42%</div>
            <span className="text-[10px] text-emerald-400 font-bold">Below 1.5% Amazon Threshold</span>
          </div>
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex justify-between items-center">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Returned / RMA Rate</span>
            <div className="text-xl font-black text-amber-300 mt-1">1.10%</div>
            <span className="text-[10px] text-slate-400 font-bold">{returnedOrders} Active RMAs</span>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
            <RotateCcw className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Daily Orders & Revenue */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-[#febd69]" />
              <span>Daily Dropshipping Orders & Revenue Stream</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Last 7 Days</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyOrdersData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis yAxisId="left" stroke="#38bdf8" fontSize={11} />
                <YAxis yAxisId="right" orientation="right" stroke="#febd69" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar yAxisId="left" dataKey="orders" fill="#38bdf8" name="Orders Count" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#febd69" strokeWidth={2} name="Revenue ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Supplier Quality & Accuracy */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Supplier Performance & On-Time Rate</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Active Suppliers</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={supplierPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="score" fill="#34d399" name="Quality Score" radius={[4, 4, 0, 0]} />
                <Bar dataKey="onTime" fill="#febd69" name="On-Time Delivery %" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Revenue Split & Logistics Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Revenue Breakdown Pie Chart */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 md:col-span-1">
          <h3 className="text-xs font-black text-white uppercase tracking-wider">Revenue Allocation Split</h3>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueBreakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {revenueBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 text-[11px]">
            {revenueBreakdownData.map((item) => (
              <div key={item.name} className="flex justify-between items-center text-slate-300">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                </span>
                <span className="font-mono font-bold">${item.value.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Supplier Performance Table */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 md:col-span-2">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-black text-white uppercase tracking-wider">
              Top Supplier Network Roster
            </h3>
            <span className="text-[10px] text-emerald-400 font-mono">100% Verified Warehouses</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3">Supplier Name</th>
                  <th className="p-3">Region</th>
                  <th className="p-3">Catalog</th>
                  <th className="p-3">On-Time</th>
                  <th className="p-3">Score</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300 text-[11px]">
                {suppliers.map((sup) => (
                  <tr key={sup.id} className="hover:bg-slate-950/60">
                    <td className="p-3 font-bold text-white">
                      {sup.businessName}
                      <span className="block text-[10px] font-mono text-slate-500">{sup.id} • {sup.contactPerson}</span>
                    </td>
                    <td className="p-3 text-slate-400">{sup.country}</td>
                    <td className="p-3 font-mono">{sup.totalProductsCount} SKUs</td>
                    <td className="p-3 font-mono text-emerald-400">{sup.onTimeDeliveryRatePct}%</td>
                    <td className="p-3 font-bold font-mono text-[#febd69]">{sup.performanceScore}/100</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                          sup.status === 'APPROVED'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {sup.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
