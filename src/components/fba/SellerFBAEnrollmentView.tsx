import React, { useState } from 'react';
import { FBAEnrollmentRequest } from '../../types/fba';
import {
  ShieldCheck,
  CheckCircle2,
  FileText,
  Boxes,
  Truck,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  UserCheck,
} from 'lucide-react';

interface SellerFBAEnrollmentViewProps {
  enrollments: FBAEnrollmentRequest[];
  onApplyForFBA: (newReq: FBAEnrollmentRequest) => void;
}

export const SellerFBAEnrollmentView: React.FC<SellerFBAEnrollmentViewProps> = ({
  enrollments,
  onApplyForFBA,
}) => {
  const [businessName, setBusinessName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [monthlyEstVolume, setMonthlyEstVolume] = useState(1000);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleRegisterFBA = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      alert('You must accept the FBA Fulfillment Terms & Storage Fee Agreement.');
      return;
    }

    const newReq: FBAEnrollmentRequest = {
      sellerId: `SEL-${Math.floor(100 + Math.random() * 900)}`,
      sellerName: businessName || 'PrimeTech Enterprise LLC',
      businessName: businessName || 'PrimeTech Enterprise LLC',
      taxId: taxId || 'XX-XXX8819',
      termsAccepted: true,
      status: 'PENDING_APPROVAL',
      monthlyVolumeEstUnits: monthlyEstVolume,
      appliedAt: new Date().toISOString().substring(0, 10),
    };

    onApplyForFBA(newReq);
    alert('FBA Enrollment Application Submitted! Admin team will review your warehouse allocation within 24 hours.');
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>SELLER FBA (FULFILMENT BY MARKETPLACE) ENROLLMENT PORTAL</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Enroll in FBA, Store Inventory & Unlock Prime Delivery Badging</h2>
          <p className="text-xs text-slate-400 mt-1">
            Delegate warehousing, 2-day Prime delivery, customer support & RMA returns to our global robotics fulfillment centers
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-xl text-xs text-emerald-400 font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>Prime 2-Day Shipping Enabled</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
        {/* Enrollment Form */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 lg:col-span-2">
          <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-2 border-b border-slate-800 pb-3">
            <FileText className="w-4 h-4 text-[#febd69]" />
            <span>Apply for FBA Seller Account</span>
          </h3>

          <form onSubmit={handleRegisterFBA} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Business Name</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. PrimeTech Enterprise LLC"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-bold focus:outline-none focus:border-[#febd69]"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Federal Tax Identification / EIN</label>
                <input
                  type="text"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  placeholder="e.g. XX-XXX8819"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-bold focus:outline-none focus:border-[#febd69]"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Estimated Monthly Units Inbound</label>
              <input
                type="number"
                value={monthlyEstVolume}
                onChange={(e) => setMonthlyEstVolume(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-bold focus:outline-none focus:border-[#febd69]"
              />
            </div>

            {/* Terms Box */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="font-bold text-white text-xs block">FBA Terms & Conditions Agreement</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                By enrolling in FBA, you agree to store inventory in our multi-warehouse network, pay daily/monthly storage fees ($0.02 - $0.04/unit/day), authorize automated pick & pack fulfillment deductions from your Commerce Zone Wallet, and adhere to barcode FNSKU labeling standards.
              </p>

              <label className="flex items-center space-x-2 pt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="w-4 h-4 accent-[#febd69] rounded"
                />
                <span className="font-bold text-white text-xs">I accept FBA Logistics & Storage Fee Agreement</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black text-xs rounded-xl transition shadow-lg flex items-center justify-center space-x-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>Submit FBA Seller Enrollment</span>
            </button>
          </form>
        </div>

        {/* Enrollment Status List */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3">
            Active Seller FBA Enrollments ({enrollments.length})
          </h3>

          <div className="space-y-3 font-mono text-xs">
            {enrollments.map((en) => (
              <div key={en.sellerId} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white text-xs">{en.businessName}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                      en.status === 'APPROVED'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {en.status}
                  </span>
                </div>

                <div className="text-[10px] text-slate-400 space-y-1">
                  <div>Seller ID: <strong className="text-slate-200">{en.sellerId}</strong></div>
                  <div>Monthly Est: <strong className="text-emerald-400">{en.monthlyVolumeEstUnits.toLocaleString()} units</strong></div>
                  <div>Applied: <strong className="text-slate-300">{en.appliedAt}</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
