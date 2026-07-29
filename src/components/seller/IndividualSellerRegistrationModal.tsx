import React, { useState } from 'react';
import { IndividualSellerProfile, SellerPlanLimits } from '../../types/domain';
import {
  Store,
  ShieldCheck,
  CheckCircle2,
  Lock,
  User,
  Mail,
  Phone,
  Globe,
  MapPin,
  FileText,
  BadgeAlert,
  ArrowRight,
  Sparkles,
  Zap,
  DollarSign,
  X
} from 'lucide-react';

interface IndividualSellerRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterSuccess: (profile: IndividualSellerProfile) => void;
}

export const IndividualSellerRegistrationModal: React.FC<IndividualSellerRegistrationModalProps> = ({
  isOpen,
  onClose,
  onRegisterSuccess,
}) => {
  const [step, setStep] = useState<number>(1);

  // Form State
  const [fullName, setFullName] = useState<string>('Alexander Vance');
  const [storeName, setStoreName] = useState<string>('Vance Artisanal Electronics');
  const [email, setEmail] = useState<string>('alexander.vance@commercezone.io');
  const [phone, setPhone] = useState<string>('+1 (555) 019-2834');
  const [country, setCountry] = useState<string>('United States');
  const [address, setAddress] = useState<string>('742 Evergreen Terrace, Seattle, WA 98101');
  const [nationalId, setNationalId] = useState<string>('US-PASS-8829-9821');
  const [taxId, setTaxId] = useState<string>('US-EIN-98-382910');

  // Verification state simulations
  const [emailVerified, setEmailVerified] = useState<boolean>(true);
  const [phoneVerified, setPhoneVerified] = useState<boolean>(true);
  const [emailCode, setEmailCode] = useState<string>('849201');
  const [phoneCode, setPhoneCode] = useState<string>('392018');
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(true);

  if (!isOpen) return null;

  const handleCompleteRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      alert('Please accept the Marketplace Individual Seller Agreement.');
      return;
    }

    const defaultLimits: SellerPlanLimits = {
      maxActiveProducts: 40,
      maxCategories: 3,
      storageLimitMb: 500,
      imageUploadLimitPerProduct: 5,
      apiLimitRequestsPerMin: 60,
      promotionalFeatureAccess: false,
    };

    const newProfile: IndividualSellerProfile = {
      id: `seller-indiv-${Date.now()}`,
      userId: `usr-seller-${Date.now()}`,
      fullName,
      storeName,
      email,
      phone,
      country,
      address,
      nationalId,
      taxId,
      plan: 'INDIVIDUAL',
      planFeePerSale: 0.99,
      monthlySubscriptionPrice: 0.00,
      verificationStatus: 'VERIFIED',
      kycVerified: true,
      acceptedTerms: true,
      activeProductsCount: 0,
      totalOrders: 0,
      totalRevenue: 0,
      totalPerItemFeesPaid: 0,
      totalMarketplaceFeesPaid: 0,
      walletBalance: 0,
      pendingBalance: 0,
      storeHealthScore: 100,
      orderSuccessRate: 100,
      cancellationRate: 0,
      returnRate: 0,
      avgResponseTimeHours: 1.0,
      customerRating: 5.0,
      createdAt: new Date().toISOString(),
      limits: defaultLimits,
    };

    onRegisterSuccess(newProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#131921] border border-[#37475a] rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative font-sans text-slate-100 max-h-[90vh] overflow-y-auto my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full transition cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Banner */}
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <div className="p-3 bg-gradient-to-br from-[#febd69] to-amber-500 text-slate-950 rounded-2xl font-black shadow-lg">
            <Store className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black text-[#febd69] uppercase tracking-wider">Free Registration</span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-emerald-400 font-bold">$0.99 Per Sold Item Fee</span>
            </div>
            <h2 className="text-xl font-black text-white">Individual Seller Plan Registration</h2>
            <p className="text-xs text-slate-400">
              Ideal for occasional sellers. Zero monthly subscription fee. Pay $0.99 only when you sell!
            </p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-2xl border border-slate-800 text-xs font-bold font-mono">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl transition cursor-pointer ${step === 1 ? 'bg-[#febd69] text-slate-950' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <span>1. Profile & Store</span>
          </button>
          <button
            type="button"
            onClick={() => setStep(2)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl transition cursor-pointer ${step === 2 ? 'bg-[#febd69] text-slate-950' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <span>2. KYC & Verification</span>
          </button>
          <button
            type="button"
            onClick={() => setStep(3)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl transition cursor-pointer ${step === 3 ? 'bg-[#febd69] text-slate-950' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <span>3. Terms & Activation</span>
          </button>
        </div>

        {/* Step 1: Profile & Store Details */}
        {step === 1 && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Full Legal Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#febd69]"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Store / Brand Name</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#febd69]"
                  placeholder="e.g. Doe Electronics"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#febd69]"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Mobile Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#febd69]"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Country of Residence</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#febd69]"
                >
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Pakistan">Pakistan</option>
                  <option value="Germany">Germany</option>
                  <option value="Canada">Canada</option>
                  <option value="Japan">Japan</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Full Business Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#febd69]"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full py-3 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black rounded-xl text-xs transition shadow flex items-center justify-center space-x-2 mt-4 cursor-pointer"
            >
              <span>Continue to Identity & KYC Verification</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: KYC & ID Verification */}
        {step === 2 && (
          <div className="space-y-4 text-xs">
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                <ShieldCheck className="w-5 h-5" />
                <span>KYC Identity Verification Framework (256-Bit Hardware Cryptographic)</span>
              </div>
              <p className="text-[11px] text-slate-400">
                To prevent fraud and maintain marketplace integrity, verify your government-issued ID and tax details.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-slate-400 font-semibold mb-1 block">National ID / Passport Number</label>
                  <input
                    type="text"
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-[#febd69]"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-semibold mb-1 block">Tax Identification Number (EIN/SSN)</label>
                  <input
                    type="text"
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-[#febd69]"
                  />
                </div>
              </div>
            </div>

            {/* Email & SMS OTP verification checks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center space-x-1.5">
                    <Mail className="w-4 h-4 text-sky-400" />
                    <span>Email OTP Verification</span>
                  </span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-mono font-bold">VERIFIED</span>
                </div>
                <div className="text-[11px] text-slate-400">Code {emailCode} sent to {email}</div>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center space-x-1.5">
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span>SMS OTP Verification</span>
                  </span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-mono font-bold">VERIFIED</span>
                </div>
                <div className="text-[11px] text-slate-400">Code {phoneCode} sent to {phone}</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="w-2/3 py-3 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black rounded-xl text-xs transition shadow flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Proceed to Plan Terms & Activation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Terms & Final Activation */}
        {step === 3 && (
          <form onSubmit={handleCompleteRegistration} className="space-y-4 text-xs">
            {/* Fee Schedule Box */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm">Individual Seller Fee Structure</h3>
                <span className="text-xs bg-[#febd69] text-slate-950 font-black px-2.5 py-0.5 rounded-full">
                  $0.00 / Month
                </span>
              </div>

              <div className="space-y-2 text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span>Monthly Subscription:</span>
                  <span className="font-bold text-emerald-400">$0.00 USD (FREE)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span>Per-Item Fee When Sold:</span>
                  <span className="font-bold text-[#febd69]">$0.99 USD</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span>Marketplace Referral Commission:</span>
                  <span className="font-bold text-white">8% Standard Category Commission</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span>Unsold Listings Fee:</span>
                  <span className="font-bold text-emerald-400">$0.00 USD (No Charge)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Active Listings Limit:</span>
                  <span className="font-bold text-sky-400">Up to 40 Active Products</span>
                </div>
              </div>
            </div>

            {/* Terms Checkbox */}
            <label className="flex items-start space-x-2 p-3 bg-slate-900 border border-slate-800 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-0.5 accent-[#febd69]"
              />
              <span className="text-[11px] text-slate-300">
                I accept the <strong className="text-white">Commerce Zone Marketplace Seller Terms</strong>. I agree that $0.99 will be automatically deducted from my seller wallet or order payout whenever a product is successfully sold.
              </span>
            </label>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-1/3 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition"
              >
                Back
              </button>
              <button
                type="submit"
                className="w-2/3 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl text-xs transition shadow-lg flex items-center justify-center space-x-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Activate Individual Seller Account</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
