import React, { useState } from 'react';
import { SupplierRecord, SupplierKYCDocument } from '../../types/dropshipping';
import {
  Building2,
  FileText,
  Upload,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Globe,
  AlertCircle,
  Clock,
  UserCheck,
} from 'lucide-react';

interface SupplierRegistrationKYCProps {
  onRegisterSupplier: (supplier: SupplierRecord) => void;
}

export const SupplierRegistrationKYC: React.FC<SupplierRegistrationKYCProps> = ({
  onRegisterSupplier,
}) => {
  const [formData, setFormData] = useState({
    businessName: '',
    contactPerson: '',
    email: '',
    phone: '',
    businessRegistrationNumber: '',
    taxId: '',
    country: 'United States',
    warehouseStreet: '',
    warehouseCity: '',
    warehouseState: '',
    warehouseZip: '',
    supportedRegions: ['North America', 'Europe'],
    termsAccepted: false,
  });

  const [uploadedDocs, setUploadedDocs] = useState<SupplierKYCDocument[]>([
    {
      id: 'KYC-NEW-1',
      documentType: 'BUSINESS_LICENSE',
      documentName: 'Certificate_of_Incorporation_2026.pdf',
      fileUrl: '#',
      status: 'PENDING',
      uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    },
    {
      id: 'KYC-NEW-2',
      documentType: 'TAX_CERTIFICATE',
      documentName: 'Tax_Registration_Certificate_W9.pdf',
      fileUrl: '#',
      status: 'PENDING',
      uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleDocUpload = (type: SupplierKYCDocument['documentType'], fileName: string) => {
    const newDoc: SupplierKYCDocument = {
      id: `KYC-${Date.now()}`,
      documentType: type,
      documentName: fileName,
      fileUrl: '#',
      status: 'PENDING',
      uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setUploadedDocs((prev) => [...prev, newDoc]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName || !formData.email || !formData.phone || !formData.termsAccepted) {
      alert('Please fill out all required fields and accept the Marketplace Supplier Terms.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newSupplier: SupplierRecord = {
        id: `SUP-${Math.floor(1000 + Math.random() * 9000)}`,
        businessName: formData.businessName,
        contactPerson: formData.contactPerson,
        email: formData.email,
        phone: formData.phone,
        businessRegistrationNumber: formData.businessRegistrationNumber,
        taxId: formData.taxId,
        status: 'PENDING_VERIFICATION',
        ratingScore: 0,
        performanceScore: 0,
        totalProductsCount: 0,
        totalOrdersFulfilled: 0,
        onTimeDeliveryRatePct: 100,
        inventoryAccuracyPct: 100,
        cancellationRatePct: 0,
        returnRatePct: 0,
        country: formData.country,
        supportedRegions: formData.supportedRegions,
        warehouses: [
          {
            id: `WH-${Date.now()}`,
            name: `${formData.businessName} Primary Hub`,
            code: 'HUB-01',
            street: formData.warehouseStreet || '100 Industrial Parkway',
            city: formData.warehouseCity || 'Austin',
            state: formData.warehouseState || 'TX',
            zipCode: formData.warehouseZip || '78701',
            country: formData.country,
            contactPhone: formData.phone,
            dockHours: '08:00 - 18:00 Local Time',
            supportedCarriers: ['FEDEX', 'UPS', 'DHL', 'AMAZON_LOGISTICS'],
            isPrimary: true,
          },
        ],
        kycDocuments: uploadedDocs,
        registeredAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      };

      onRegisterSupplier(newSupplier);
      setIsSubmitting(false);
      setSuccessMessage(`Supplier Registration Submitted! Registration ID: ${newSupplier.id}. Status: Pending Admin Verification.`);
    }, 800);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <UserCheck className="w-4 h-4 text-[#febd69]" />
            <span>GLOBAL SUPPLIER ONBOARDING & KYC VERIFICATION</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Marketplace Supplier Portal Registration</h2>
          <p className="text-xs text-slate-400 mt-1">
            Register your wholesale manufacturing or distribution business to fulfill dropship orders directly to Amazon global buyers
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-xl text-xs text-emerald-400 font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>256-Bit Encrypted KYC Audit Pipeline</span>
        </div>
      </div>

      {successMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/40 p-4 rounded-xl text-xs text-emerald-300 flex items-center space-x-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
        {/* Step 1 & 2: Business & Contact Details */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 lg:col-span-2">
          <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Building2 className="w-4 h-4 text-[#febd69]" />
            <span>1. Business Entity & Warehouse Contact</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Legal Business Name *</label>
              <input
                type="text"
                required
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                placeholder="e.g. Apex Electronics Wholesale Inc."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-[#febd69]"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Primary Contact Person *</label>
              <input
                type="text"
                required
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                placeholder="e.g. Marcus Vance (VP Logistics)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-[#febd69]"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Business Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="supplier@company.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-[#febd69]"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Phone Number *</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (800) 555-0192"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-[#febd69]"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Business Reg / EIN Number</label>
              <input
                type="text"
                value={formData.businessRegistrationNumber}
                onChange={(e) => setFormData({ ...formData, businessRegistrationNumber: e.target.value })}
                placeholder="US-DEL-8829104"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-[#febd69]"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Tax Identification / VAT ID</label>
              <input
                type="text"
                value={formData.taxId}
                onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                placeholder="US-99-8239102"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-[#febd69]"
              />
            </div>
          </div>

          <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-2 border-b border-slate-800 pb-3 pt-4">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>2. Warehouse Address & Regional Shipping Reach</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Street Address</label>
              <input
                type="text"
                value={formData.warehouseStreet}
                onChange={(e) => setFormData({ ...formData, warehouseStreet: e.target.value })}
                placeholder="100 Logistics Way, Dock 14"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-[#febd69]"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Country</label>
              <select
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-[#febd69]"
              >
                <option value="United States">United States</option>
                <option value="China">China</option>
                <option value="Germany">Germany</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Japan">Japan</option>
                <option value="India">India</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">City</label>
              <input
                type="text"
                value={formData.warehouseCity}
                onChange={(e) => setFormData({ ...formData, warehouseCity: e.target.value })}
                placeholder="Newark"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-[#febd69]"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">State / Province</label>
              <input
                type="text"
                value={formData.warehouseState}
                onChange={(e) => setFormData({ ...formData, warehouseState: e.target.value })}
                placeholder="NJ"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-[#febd69]"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Zip / Postal Code</label>
              <input
                type="text"
                value={formData.warehouseZip}
                onChange={(e) => setFormData({ ...formData, warehouseZip: e.target.value })}
                placeholder="07102"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-[#febd69]"
              />
            </div>
          </div>
        </div>

        {/* Step 3: KYC Document Upload & Terms */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-2 border-b border-slate-800 pb-3">
              <FileText className="w-4 h-4 text-sky-400" />
              <span>3. Business Verification Documents (KYC)</span>
            </h3>

            <p className="text-slate-400 text-[11px]">
              Upload required compliance documents for marketplace identity verification and tax reporting.
            </p>

            <div className="space-y-3">
              {uploadedDocs.map((doc) => (
                <div key={doc.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                  <div className="space-y-0.5">
                    <span className="font-bold text-white text-[11px] block">{doc.documentName}</span>
                    <span className="text-[9px] font-mono text-slate-400">{doc.documentType} • {doc.uploadedAt}</span>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-[9px] font-bold rounded">
                    {doc.status}
                  </span>
                </div>
              ))}

              <button
                type="button"
                onClick={() => handleDocUpload('ISO_CERT', 'ISO_9001_Quality_Audit_2026.pdf')}
                className="w-full py-2.5 border border-dashed border-slate-700 hover:border-[#febd69] text-slate-300 hover:text-[#febd69] rounded-xl text-center font-bold text-xs transition flex items-center justify-center space-x-1.5"
              >
                <Upload className="w-4 h-4" />
                <span>+ Upload ISO / Bank Letter Document</span>
              </button>
            </div>

            <div className="pt-2">
              <label className="flex items-start space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.termsAccepted}
                  onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                  className="mt-1 rounded bg-slate-950 border-slate-800 text-[#febd69] focus:ring-0"
                />
                <span className="text-[11px] text-slate-300 leading-snug">
                  I agree to the <strong className="text-white">Amazon Marketplace Supplier Master Terms</strong>, SLA delivery deadlines (98%+ on-time), real-time inventory synchronization, and 10% standard marketplace commission split.
                </span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition shadow-lg flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <span>Submitting KYC Package...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Supplier Application</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
