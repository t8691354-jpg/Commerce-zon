import React, { useState } from 'react';
import { ProfessionalSellerProfile } from '../../types/domain';
import {
  X,
  CheckCircle2,
  Building2,
  CreditCard,
  FileText,
  ShieldCheck,
  Zap,
  DollarSign,
  UserCheck,
  Globe,
  Lock,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRegisterSuccess: (newProProfile: ProfessionalSellerProfile) => void;
}

export const ProfessionalSellerRegistrationModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onRegisterSuccess,
}) => {
  const [step, setStep] = useState<number>(1);

  // Form State
  const [businessName, setBusinessName] = useState('Apex Industrial Robotics LLC');
  const [storeName, setStoreName] = useState('Apex Official Flagship Store');
  const [ownerName, setOwnerName] = useState('Dr. Marcus Vance');
  const [email, setEmail] = useState('marcus.vance@apexrobotics.io');
  const [phone, setPhone] = useState('+1 (800) 555-8920');
  const [businessRegNum, setBusinessRegNum] = useState('US-DEL-98214-B');
  const [taxId, setTaxId] = useState('US-99-881204');
  const [address, setAddress] = useState('450 Innovation Parkway, Suite 800, San Jose, CA 95134');
  const [country, setCountry] = useState('United States');
  const [bankName, setBankName] = useState('Silicon Valley Commercial Bank');
  const [accountNum, setAccountNum] = useState('9876543210');
  const [routingNum, setRoutingNum] = useState('121000358');
  
  // Verification states
  const [emailVerified, setEmailVerified] = useState(true);
  const [phoneVerified, setPhoneVerified] = useState(true);
  const [kycUploaded, setKycUploaded] = useState(true);
  const [acceptedTerms, setAcceptedTerms] = useState(true);

  // Payment state for $36/mo
  const [paymentMethod, setPaymentMethod] = useState<'CREDIT_CARD' | 'SELLER_WALLET'>('CREDIT_CARD');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleCompleteRegistration = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const now = new Date().toISOString();
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      const newProfile: ProfessionalSellerProfile = {
        id: `seller-pro-${Date.now()}`,
        userId: `usr-pro-${Math.floor(Math.random() * 1000)}`,
        businessName,
        storeName,
        ownerName,
        email,
        phone,
        businessRegistrationNumber: businessRegNum,
        taxIdVat: taxId,
        businessAddress: address,
        country,
        plan: 'PROFESSIONAL',
        monthlyPrice: 36.00,
        verificationStatus: 'VERIFIED',
        kycVerified: true,
        acceptedTerms: true,
        subscription: {
          id: `sub-pro-${Date.now()}`,
          sellerId: `seller-pro-${Date.now()}`,
          planName: 'Professional Seller Plan',
          monthlyFee: 36.00,
          status: 'ACTIVE',
          autoRenew: true,
          startDate: now,
          nextBillingDate: nextMonth.toISOString(),
          lastPaymentDate: now,
          paymentMethod: paymentMethod === 'CREDIT_CARD' ? 'CREDIT_CARD' : 'SELLER_WALLET',
          cardLast4: cardNumber.slice(-4) || '4242',
          cardBrand: 'Visa Corporate',
          gracePeriodDays: 7,
          retryCount: 0,
        },
        bankDetails: {
          bankName,
          accountHolderName: businessName,
          accountNumberMasked: `••••••••${accountNum.slice(-4) || '7890'}`,
          routingNumber: routingNum,
          swiftCode: 'SVCBUS33',
          country,
        },
        branding: {
          logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80',
          bannerUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
          description: `${businessName} - Premium Professional Marketplace Merchant.`,
          aboutPageText: `Welcome to ${storeName}. We specialize in enterprise-grade quality and rapid delivery.`,
          themeColor: '#febd69',
          socialLinks: { website: 'https://example.com' },
          featuredProductIds: [],
        },
        staff: [
          {
            id: `staff-owner-${Date.now()}`,
            name: ownerName,
            email,
            role: 'OWNER',
            permissions: ['ALL'],
            status: 'ACTIVE',
            addedAt: now,
            lastActive: now,
          },
        ],
        campaigns: [],
        apiKeys: [
          {
            id: `key-${Date.now()}`,
            keyName: 'Default Production API Key',
            apiKey: `pk_live_pro_${Math.random().toString(36).substring(2, 15)}`,
            permissions: ['ALL'],
            rateLimitPerMin: 1000,
            createdAt: now,
            lastUsedAt: now,
            status: 'ACTIVE',
          },
        ],
        webhooks: [],
        totalOrdersProcessed: 0,
        totalRevenue: 0,
        walletBalance: 0,
        pendingBalance: 0,
        mrrContribution: 36.00,
        storeRating: 5.0,
        createdAt: now,
      };

      setIsSubmitting(false);
      onRegisterSuccess(newProfile);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-amber-500/20 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-amber-500/20 text-[#febd69] rounded-xl border border-amber-500/30">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-black text-white">Professional Seller Registration</h3>
                <span className="px-2 py-0.5 bg-[#febd69] text-slate-950 font-black text-[10px] rounded-md">
                  $36 / MONTH
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Unlimited Listings • Unlimited Sales • No $0.99 Per-Item Selling Fee
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Stepper */}
        <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between text-xs font-bold">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`flex items-center space-x-2 transition cursor-pointer ${step === 1 ? 'text-[#febd69]' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step === 1 ? 'bg-[#febd69] text-slate-950' : 'bg-slate-800 text-slate-300'}`}>1</span>
            <span>Business Info</span>
          </button>
          <div className="w-8 h-px bg-slate-800" />
          <button
            type="button"
            onClick={() => setStep(2)}
            className={`flex items-center space-x-2 transition cursor-pointer ${step === 2 ? 'text-[#febd69]' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step === 2 ? 'bg-[#febd69] text-slate-950' : 'bg-slate-800 text-slate-300'}`}>2</span>
            <span>KYC & Verification</span>
          </button>
          <div className="w-8 h-px bg-slate-800" />
          <button
            type="button"
            onClick={() => setStep(3)}
            className={`flex items-center space-x-2 transition cursor-pointer ${step === 3 ? 'text-[#febd69]' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step === 3 ? 'bg-[#febd69] text-slate-950' : 'bg-slate-800 text-slate-300'}`}>3</span>
            <span>$36/Mo Subscription</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto">
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Legal Business Name *</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    placeholder="Apex Industrial Robotics LLC"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Public Store Name *</label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    placeholder="Apex Official Store"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Owner / Primary Contact Name *</label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Corporate Email Address *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Country / Tax Jurisdiction *</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="United States">United States (US-EIN)</option>
                    <option value="Canada">Canada (CA-BN)</option>
                    <option value="United Kingdom">United Kingdom (UK-VAT)</option>
                    <option value="Germany">Germany (DE-USt-IdNr)</option>
                    <option value="Australia">Australia (AU-ABN)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Business Reg / Incorporation No. *</label>
                  <input
                    type="text"
                    value={businessRegNum}
                    onChange={(e) => setBusinessRegNum(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Tax ID / VAT Number *</label>
                  <input
                    type="text"
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Physical Business Address *</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Settlement Bank Details */}
              <div className="pt-2 border-t border-slate-800/80 space-y-3">
                <h4 className="text-xs font-black text-amber-300 flex items-center space-x-1.5">
                  <Building2 className="w-4 h-4" />
                  <span>Marketplace Revenue Settlement Account</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Bank Name</label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Account Number</label>
                    <input
                      type="text"
                      value={accountNum}
                      onChange={(e) => setAccountNum(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Routing / ABA</label>
                    <input
                      type="text"
                      value={routingNum}
                      onChange={(e) => setRoutingNum(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                <h4 className="text-xs font-black text-white flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Identity Verification & Compliance (KYC)</span>
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Enterprise security regulations require email, phone, and business incorporation checks to prevent fraud across our global marketplace.
                </p>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <div className="flex items-center space-x-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <div>
                        <div className="text-xs font-bold text-white">Corporate Email Verification</div>
                        <div className="text-[10px] text-slate-400">{email}</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 font-bold text-[10px] rounded border border-emerald-500/20">
                      VERIFIED
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <div className="flex items-center space-x-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <div>
                        <div className="text-xs font-bold text-white">Phone SMS Verification</div>
                        <div className="text-[10px] text-slate-400">{phone}</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 font-bold text-[10px] rounded border border-emerald-500/20">
                      VERIFIED
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <div className="flex items-center space-x-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <div>
                        <div className="text-xs font-bold text-white">Tax ID & Incorporation Filing</div>
                        <div className="text-[10px] text-slate-400">Reg: {businessRegNum} | Tax: {taxId}</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 font-bold text-[10px] rounded border border-emerald-500/20">
                      KYC APPROVED
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start space-x-3">
                <FileText className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-xs font-bold text-amber-300">Enterprise Professional Seller Agreement</div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    By proceeding, you agree to the $36/month recurring subscription terms, unlimited catalog terms, zero per-item fee policy, and 100% SLA uptime expectations.
                  </p>
                  <label className="flex items-center space-x-2 pt-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-400"
                    />
                    <span className="text-xs font-bold text-white">I accept the Marketplace Terms & Pro Selling Contract</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-slate-900 to-amber-950/30 border border-amber-500/30 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-amber-400">Professional Seller Plan</div>
                  <div className="text-2xl font-black text-white mt-1">$36.00 <span className="text-xs text-slate-400 font-normal">/ month</span></div>
                  <div className="text-[11px] text-slate-300 mt-1">Renews automatically. Cancel anytime in Seller Central.</div>
                </div>
                <div className="text-right space-y-1">
                  <div className="px-3 py-1 bg-amber-500 text-slate-950 font-black text-xs rounded-full inline-block shadow">
                    ZERO PER-ITEM FEE
                  </div>
                  <div className="text-[10px] text-emerald-400 font-bold">★ Unlimited Products & Sales</div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300">Select Subscription Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CREDIT_CARD')}
                    className={`p-3 rounded-xl border text-left transition flex items-center space-x-3 ${
                      paymentMethod === 'CREDIT_CARD'
                        ? 'bg-amber-500/10 border-amber-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-amber-400" />
                    <div>
                      <div className="text-xs font-bold">Corporate Credit Card</div>
                      <div className="text-[10px] text-slate-400">Visa / Mastercard / Amex</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('SELLER_WALLET')}
                    className={`p-3 rounded-xl border text-left transition flex items-center space-x-3 ${
                      paymentMethod === 'SELLER_WALLET'
                        ? 'bg-amber-500/10 border-amber-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Zap className="w-5 h-5 text-[#febd69]" />
                    <div>
                      <div className="text-xs font-bold">Seller Wallet Balance</div>
                      <div className="text-[10px] text-slate-400">Auto-deduct from earnings</div>
                    </div>
                  </button>
                </div>
              </div>

              {paymentMethod === 'CREDIT_CARD' && (
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Expiration (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExp}
                        onChange={(e) => setCardExp(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">CVC / Security Code</label>
                      <input
                        type="password"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono text-center"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300 flex items-center space-x-2">
                <Lock className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Encrypted 256-bit automated billing engine setup. First $36 charge will process today.</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 bg-[#febd69] hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center space-x-1.5 transition shadow-lg"
            >
              <span>Continue Step {step + 1}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleCompleteRegistration}
              disabled={isSubmitting || !acceptedTerms}
              className="px-6 py-2.5 bg-gradient-to-r from-[#febd69] to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs flex items-center space-x-2 transition shadow-lg disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Activating Subscription ($36)...</span>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Activate Professional Plan ($36/Mo)</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
