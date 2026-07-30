import React, { useState } from 'react';
import {
  PaymentMethodType,
  PaymentProviderId,
  TransactionRecord,
  CheckoutState,
} from '../../types/payments';
import {
  MOCK_PAYMENT_METHOD_SETTINGS,
  MOCK_GATEWAY_CONFIGS,
  MOCK_TAX_RULES,
} from '../../data/paymentsMockData';
import {
  ShoppingBag,
  ShieldCheck,
  CheckCircle2,
  Lock,
  CreditCard,
  Wallet,
  Building2,
  Banknote,
  Gift,
  Coins,
  CalendarClock,
  Truck,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  Printer,
  AlertTriangle,
  RefreshCw,
  Tag,
  DollarSign,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';

interface CheckoutMultiStepFlowProps {
  cartItems?: Array<{
    id: string;
    productTitle: string;
    sku: string;
    unitPrice: number;
    quantity: number;
    merchantName: string;
    imageUrl?: string;
  }>;
  walletBalance: number;
  onTopUpWallet?: (amount: number) => void;
  onOrderComplete?: (tx: TransactionRecord) => void;
}

export const CheckoutMultiStepFlow: React.FC<CheckoutMultiStepFlowProps> = ({
  cartItems = [
    {
      id: 'cart-1',
      productTitle: 'Titan Workstation X9 Heavy Duty Laptop (64GB RAM)',
      sku: 'TW-X9-64GB-2TB',
      unitPrice: 2899.99,
      quantity: 1,
      merchantName: 'CyberTech Enterprise Solutions',
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'cart-2',
      productTitle: 'Precision Fiber Laser Welding Sensor Module',
      sku: 'LSR-SENS-4K',
      unitPrice: 1600.00,
      quantity: 1,
      merchantName: 'OmniGear Precision Hardware',
      imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
    },
  ],
  walletBalance,
  onTopUpWallet,
  onOrderComplete,
}) => {
  const [checkout, setCheckout] = useState<CheckoutState>({
    currentStep: 1,
    guestEmail: 'sarah.jenkins@aerospace.io',
    shippingAddress: {
      fullName: 'Sarah Jenkins (AeroSpace Procurement)',
      street: '500 Technology Parkway, Suite 400',
      city: 'San Jose',
      state: 'CA',
      zipCode: '95110',
      country: 'United States',
      phone: '+1 (555) 382-9012',
    },
    billingAddressSameAsShipping: true,
    billingAddress: {
      fullName: 'Sarah Jenkins (AeroSpace Procurement)',
      street: '500 Technology Parkway, Suite 400',
      city: 'San Jose',
      state: 'CA',
      zipCode: '95110',
      country: 'United States',
      phone: '+1 (555) 382-9012',
    },
    shippingMethod: 'PRIME_EXPRESS',
    shippingCostUSD: 25.00,
    deliveryEstimateDays: 'Guaranteed Tomorrow (July 28)',
    paymentMethod: 'CREDIT_CARD',
    selectedProvider: 'STRIPE',
    cardDetails: {
      cardNumber: '4242 •••• •••• 4242',
      cardHolder: 'SARAH JENKINS',
      expiryMonth: '08',
      expiryYear: '2028',
      cvv: '881',
    },
    bankDetails: {
      accountNumber: '99120839182',
      routingNumber: '121000358',
      bankName: 'Chase Commercial Bank',
    },
    giftCardCode: '',
    appliedGiftCardAmountUSD: 0,
    appliedWalletAmountUSD: 0,
    couponCode: 'PRIME100',
    appliedDiscountUSD: 100.00,
    idempotencyKey: `idemp-checkout-${Date.now()}`,
    is3DSecureRequired: false,
    otpInput: '',
    isProcessing: false,
  });

  // Calculate order math
  const itemsSubtotal = cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const taxRatePct = 8.25; // CA Tax
  const taxAmount = (itemsSubtotal - checkout.appliedDiscountUSD) * (taxRatePct / 100);
  const shippingCost = checkout.shippingCostUSD;
  const grossTotal = Math.max(0, itemsSubtotal - checkout.appliedDiscountUSD + taxAmount + shippingCost);

  // Apply gift card or wallet credits
  const netPayable = Math.max(
    0,
    grossTotal - checkout.appliedGiftCardAmountUSD - checkout.appliedWalletAmountUSD
  );

  const steps = [
    { num: 1, title: 'Address & Account' },
    { num: 2, title: 'Shipping & Speed' },
    { num: 3, title: 'Payment Method' },
    { num: 4, title: 'Order Review' },
    { num: 5, title: 'Secure Payment' },
    { num: 6, title: 'Order Confirmed' },
  ];

  // Apply Coupon
  const handleApplyCoupon = () => {
    if (checkout.couponCode.toUpperCase() === 'PRIME100') {
      setCheckout((prev) => ({ ...prev, appliedDiscountUSD: 100.00 }));
    } else if (checkout.couponCode.toUpperCase().includes('COMMERCE_ZON')) {
      setCheckout((prev) => ({ ...prev, appliedDiscountUSD: 50.00 }));
    } else {
      setCheckout((prev) => ({ ...prev, appliedDiscountUSD: 20.00 }));
    }
  };

  // Apply Gift Card
  const handleApplyGiftCard = () => {
    if (checkout.giftCardCode.trim()) {
      setCheckout((prev) => ({ ...prev, appliedGiftCardAmountUSD: 50.00 }));
    }
  };

  // Toggle Wallet Apply
  const handleToggleWalletApply = () => {
    if (checkout.appliedWalletAmountUSD > 0) {
      setCheckout((prev) => ({ ...prev, appliedWalletAmountUSD: 0 }));
    } else {
      const applyVal = Math.min(walletBalance, grossTotal);
      setCheckout((prev) => ({ ...prev, appliedWalletAmountUSD: applyVal }));
    }
  };

  // Execute Payment Simulation
  const handleExecutePayment = () => {
    setCheckout((prev) => ({ ...prev, isProcessing: true }));

    setTimeout(() => {
      const newTx: TransactionRecord = {
        transactionId: `TX-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        paymentId: `PAY-GATEWAY-${Math.floor(100000 + Math.random() * 900000)}`,
        orderId: `ord-${Math.floor(2000 + Math.random() * 8000)}`,
        invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        customerId: 'cust-901',
        customerName: checkout.shippingAddress.fullName,
        customerEmail: checkout.guestEmail || 'sarah.jenkins@aerospace.io',
        sellerId: 'merch-02',
        sellerName: cartItems[0]?.merchantName || 'Commerce Zone Marketplace Seller',
        paymentMethod: checkout.paymentMethod,
        provider: checkout.selectedProvider,
        currency: 'USD',
        amount: netPayable,
        tax: taxAmount,
        shippingCost: shippingCost,
        discount: checkout.appliedDiscountUSD,
        marketplaceFee: itemsSubtotal * 0.10,
        processingFee: netPayable * 0.029 + 0.30,
        netSellerAmount: itemsSubtotal * 0.90,
        status: 'CAPTURED',
        idempotencyKey: checkout.idempotencyKey,
        gatewayReference: `stripe_ch_${Math.random().toString(36).substring(2, 10)}`,
        fraudRiskScore: 3,
        fraudRiskLevel: 'LOW',
        timestamp: new Date().toISOString(),
        notes: 'Verified via PCI-DSS 256-bit tokenized gateway channel with 3DS 2.0 clearance.',
      };

      setCheckout((prev) => ({
        ...prev,
        isProcessing: false,
        currentStep: 6,
        completedTransaction: newTx,
      }));

      if (onOrderComplete) {
        onOrderComplete(newTx);
      }
    }, 1800);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      {/* Top Banner */}
      <div className="bg-[#131921] border border-[#37475a] p-6 rounded-2xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-white">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>256-BIT PCI-DSS SECURE CHECKOUT PIPELINE</span>
          </div>
          <h2 className="text-xl font-black mt-1 text-white">Commerce Zon Grade Enterprise Multi-Step Checkout</h2>
          <p className="text-xs text-slate-400 mt-1">
            Idempotent payment processing, 3D Secure 2.0 OTP verification, Sentinel AI fraud shield & instant wallet ledger updates
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-[#232f3e] px-4 py-2 rounded-xl border border-[#37475a] text-xs font-mono">
          <Lock className="w-4 h-4 text-emerald-400" />
          <span>Idempotency Key:</span>
          <span className="text-[#febd69] font-bold">{checkout.idempotencyKey.slice(0, 18)}...</span>
        </div>
      </div>

      {/* Progress Step Indicator Bar */}
      <div className="bg-[#131921] border border-[#37475a] p-4 rounded-2xl shadow-xl overflow-x-auto">
        <div className="flex items-center justify-between min-w-[700px]">
          {steps.map((s, idx) => {
            const isDone = checkout.currentStep > s.num;
            const isCurrent = checkout.currentStep === s.num;

            return (
              <div key={s.num} className="flex items-center space-x-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-xs transition ${
                    isDone
                      ? 'bg-emerald-500 text-slate-950 font-black'
                      : isCurrent
                      ? 'bg-[#febd69] text-slate-950 ring-4 ring-amber-400/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-5 h-5 stroke-[2.5]" /> : s.num}
                </div>
                <span
                  className={`text-xs font-bold whitespace-nowrap ${
                    isCurrent ? 'text-[#febd69]' : isDone ? 'text-emerald-400' : 'text-slate-400'
                  }`}
                >
                  {s.title}
                </span>

                {idx < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-2 ${isDone ? 'bg-emerald-500' : 'bg-slate-800'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: Left Checkout Steps, Right Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Step Screen */}
        <div className="lg:col-span-8 space-y-6">
          {/* STEP 1: Address & Customer Details */}
          {checkout.currentStep === 1 && (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-[#febd69]" />
                  <span>Step 1: Customer Account & Delivery Address</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">1-Click Saved Addresses Available</span>
              </div>

              {/* Guest / Account Toggle */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Account Email Address:</label>
                <input
                  type="email"
                  value={checkout.guestEmail}
                  onChange={(e) => setCheckout({ ...checkout, guestEmail: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#febd69]"
                  placeholder="customer@domain.com"
                />
              </div>

              {/* Shipping Address Form */}
              <div className="space-y-4">
                <div className="text-xs font-black text-[#febd69] uppercase tracking-wider">Shipping Address</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-400 mb-1">Full Name / Business:</label>
                    <input
                      type="text"
                      value={checkout.shippingAddress.fullName}
                      onChange={(e) =>
                        setCheckout({
                          ...checkout,
                          shippingAddress: { ...checkout.shippingAddress, fullName: e.target.value },
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-400 mb-1">Street Address:</label>
                    <input
                      type="text"
                      value={checkout.shippingAddress.street}
                      onChange={(e) =>
                        setCheckout({
                          ...checkout,
                          shippingAddress: { ...checkout.shippingAddress, street: e.target.value },
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-400 mb-1">City:</label>
                    <input
                      type="text"
                      value={checkout.shippingAddress.city}
                      onChange={(e) =>
                        setCheckout({
                          ...checkout,
                          shippingAddress: { ...checkout.shippingAddress, city: e.target.value },
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-400 mb-1">State / Zip / Country:</label>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={checkout.shippingAddress.state}
                        onChange={(e) =>
                          setCheckout({
                            ...checkout,
                            shippingAddress: { ...checkout.shippingAddress, state: e.target.value },
                          })
                        }
                        className="bg-slate-950 border border-slate-800 rounded-xl p-2 text-white focus:outline-none"
                      />
                      <input
                        type="text"
                        value={checkout.shippingAddress.zipCode}
                        onChange={(e) =>
                          setCheckout({
                            ...checkout,
                            shippingAddress: { ...checkout.shippingAddress, zipCode: e.target.value },
                          })
                        }
                        className="bg-slate-950 border border-slate-800 rounded-xl p-2 text-white focus:outline-none"
                      />
                      <input
                        type="text"
                        value={checkout.shippingAddress.country}
                        onChange={(e) =>
                          setCheckout({
                            ...checkout,
                            shippingAddress: { ...checkout.shippingAddress, country: e.target.value },
                          })
                        }
                        className="bg-slate-950 border border-slate-800 rounded-xl p-2 text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Action */}
              <div className="flex justify-end pt-4 border-t border-slate-800">
                <button
                  onClick={() => setCheckout({ ...checkout, currentStep: 2 })}
                  className="px-6 py-2.5 bg-[#febd69] hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition flex items-center space-x-2 shadow-lg"
                >
                  <span>Continue to Shipping Method</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Shipping Method & Delivery Estimate */}
          {checkout.currentStep === 2 && (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-sky-400" />
                  <span>Step 2: Choose Fulfillment & Delivery Speed</span>
                </h3>
              </div>

              <div className="space-y-3">
                {[
                  {
                    id: 'PRIME_EXPRESS',
                    label: 'Commerce Zon Prime Express Air (Guaranteed Tomorrow)',
                    cost: 25.00,
                    desc: 'Priority air transport directly from Silicon Valley Logistics Hub',
                    badge: 'RECOMMENDED FOR ENTERPRISE',
                  },
                  {
                    id: 'STANDARD',
                    label: 'Standard Ground Shipping (3-5 Business Days)',
                    cost: 0.00,
                    desc: 'Free standard shipping on orders over $50.00',
                    badge: 'FREE',
                  },
                  {
                    id: 'SAME_DAY',
                    label: 'Same-Day Local Courier Dispatch (Within 6 Hours)',
                    cost: 45.00,
                    desc: 'Dedicated local van courier delivery directly to office dock',
                    badge: 'EXPRESS',
                  },
                ].map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() =>
                      setCheckout({
                        ...checkout,
                        shippingMethod: opt.id as any,
                        shippingCostUSD: opt.cost,
                      })
                    }
                    className={`p-4 rounded-xl border cursor-pointer transition flex items-start justify-between ${
                      checkout.shippingMethod === opt.id
                        ? 'bg-slate-950 border-[#febd69] ring-2 ring-amber-400/20'
                        : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white text-sm">{opt.label}</span>
                        <span className="px-2 py-0.5 bg-[#febd69]/20 text-[#febd69] text-[10px] font-black rounded">
                          {opt.badge}
                        </span>
                      </div>
                      <p className="text-slate-400 text-xs">{opt.desc}</p>
                    </div>

                    <div className="text-right font-mono font-black text-sm text-emerald-400">
                      {opt.cost === 0 ? 'FREE' : `$${opt.cost.toFixed(2)}`}
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Action */}
              <div className="flex justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={() => setCheckout({ ...checkout, currentStep: 1 })}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition flex items-center space-x-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  onClick={() => setCheckout({ ...checkout, currentStep: 3 })}
                  className="px-6 py-2.5 bg-[#febd69] hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition flex items-center space-x-2 shadow-lg"
                >
                  <span>Continue to Payment Selection</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Method Selection */}
          {checkout.currentStep === 3 && (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center space-x-2">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span>Step 3: Select Payment Method & Gateway Provider</span>
                </h3>
              </div>

              {/* Grid of Payment Methods */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {MOCK_PAYMENT_METHOD_SETTINGS.filter((m) => m.isEnabled).map((m) => {
                  const isSelected = checkout.paymentMethod === m.type;

                  return (
                    <div
                      key={m.type}
                      onClick={() => setCheckout({ ...checkout, paymentMethod: m.type })}
                      className={`p-4 rounded-xl border cursor-pointer transition space-y-2 text-xs ${
                        isSelected
                          ? 'bg-slate-950 border-[#febd69] ring-2 ring-amber-400/20'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs">{m.label}</span>
                        {m.type === 'MARKETPLACE_WALLET' && (
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-black rounded">
                            Bal: ${walletBalance.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">{m.description}</p>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic Payment Details Input Form */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                {checkout.paymentMethod === 'CREDIT_CARD' || checkout.paymentMethod === 'DEBIT_CARD' ? (
                  <div className="space-y-3 text-xs">
                    <div className="text-xs font-bold text-slate-300">Enter Card Details (PCI-DSS Tokenized):</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">Card Number:</label>
                        <input
                          type="text"
                          value={checkout.cardDetails.cardNumber}
                          onChange={(e) =>
                            setCheckout({
                              ...checkout,
                              cardDetails: { ...checkout.cardDetails, cardNumber: e.target.value },
                            })
                          }
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono text-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">Cardholder Name:</label>
                        <input
                          type="text"
                          value={checkout.cardDetails.cardHolder}
                          onChange={(e) =>
                            setCheckout({
                              ...checkout,
                              cardDetails: { ...checkout.cardDetails, cardHolder: e.target.value },
                            })
                          }
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono text-white focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-[10px] text-slate-400 mb-1">Exp Month:</label>
                          <input
                            type="text"
                            value={checkout.cardDetails.expiryMonth}
                            onChange={(e) =>
                              setCheckout({
                                ...checkout,
                                cardDetails: { ...checkout.cardDetails, expiryMonth: e.target.value },
                              })
                            }
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono text-white focus:outline-none text-center"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 mb-1">Exp Year:</label>
                          <input
                            type="text"
                            value={checkout.cardDetails.expiryYear}
                            onChange={(e) =>
                              setCheckout({
                                ...checkout,
                                cardDetails: { ...checkout.cardDetails, expiryYear: e.target.value },
                              })
                            }
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono text-white focus:outline-none text-center"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 mb-1">CVV Security:</label>
                          <input
                            type="text"
                            value={checkout.cardDetails.cvv}
                            onChange={(e) =>
                              setCheckout({
                                ...checkout,
                                cardDetails: { ...checkout.cardDetails, cvv: e.target.value },
                              })
                            }
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono text-white focus:outline-none text-center"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : checkout.paymentMethod === 'MARKETPLACE_WALLET' ? (
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white">Commerce Zone Pay Digital Wallet</span>
                      <p className="text-[#febd69] font-mono mt-0.5">
                        Available Balance: <strong>${walletBalance.toFixed(2)} USD</strong>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleToggleWalletApply}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition"
                    >
                      {checkout.appliedWalletAmountUSD > 0 ? 'Applied ($' + checkout.appliedWalletAmountUSD.toFixed(2) + ')' : 'Apply Wallet Balance'}
                    </button>
                  </div>
                ) : (
                  <div className="text-xs text-slate-300">
                    Selected payment method: <strong className="text-white">{checkout.paymentMethod}</strong>.
                    Standard gateway API authorization will execute upon review.
                  </div>
                )}
              </div>

              {/* Navigation Action */}
              <div className="flex justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={() => setCheckout({ ...checkout, currentStep: 2 })}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition flex items-center space-x-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  onClick={() => setCheckout({ ...checkout, currentStep: 4 })}
                  className="px-6 py-2.5 bg-[#febd69] hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition flex items-center space-x-2 shadow-lg"
                >
                  <span>Review Order & Item Breakdown</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Order Review & Financial Breakdown */}
          {checkout.currentStep === 4 && (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center space-x-2">
                  <ShoppingBag className="w-4 h-4 text-purple-400" />
                  <span>Step 4: Final Order Review & Item Audit</span>
                </h3>
              </div>

              {/* Item List */}
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      {item.imageUrl && (
                        <img src={item.imageUrl} alt={item.productTitle} className="w-12 h-12 object-cover rounded-lg border border-slate-800" />
                      )}
                      <div>
                        <div className="font-bold text-white text-sm">{item.productTitle}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          SKU: {item.sku} | Seller: <span className="text-[#febd69]">{item.merchantName}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <div className="text-white font-bold">${(item.unitPrice * item.quantity).toFixed(2)}</div>
                      <div className="text-[10px] text-slate-400">Qty: {item.quantity} × ${item.unitPrice.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupons & Gift Card Input */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                  <span className="font-bold text-slate-300">Promotional Coupon Code:</span>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={checkout.couponCode}
                      onChange={(e) => setCheckout({ ...checkout, couponCode: e.target.value })}
                      placeholder="e.g. PRIME100"
                      className="bg-slate-900 border border-slate-800 p-2 rounded-lg text-white text-xs font-mono focus:outline-none flex-1 uppercase"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="px-3 py-2 bg-[#febd69] text-slate-950 font-black rounded-lg text-xs hover:bg-amber-400 transition"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                  <span className="font-bold text-slate-300">Gift Card or Claim Voucher:</span>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={checkout.giftCardCode}
                      onChange={(e) => setCheckout({ ...checkout, giftCardCode: e.target.value })}
                      placeholder="AMZ-GIFT-8891"
                      className="bg-slate-900 border border-slate-800 p-2 rounded-lg text-white text-xs font-mono focus:outline-none flex-1 uppercase"
                    />
                    <button
                      onClick={handleApplyGiftCard}
                      className="px-3 py-2 bg-emerald-600 text-white font-bold rounded-lg text-xs hover:bg-emerald-500 transition"
                    >
                      Redeem
                    </button>
                  </div>
                </div>
              </div>

              {/* Navigation Action */}
              <div className="flex justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={() => setCheckout({ ...checkout, currentStep: 3 })}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition flex items-center space-x-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  onClick={() => setCheckout({ ...checkout, currentStep: 5 })}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl transition flex items-center space-x-2 shadow-lg"
                >
                  <Lock className="w-4 h-4" />
                  <span>Proceed to Authorise Payment (${netPayable.toFixed(2)})</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Secure Payment Execution & 3D Secure Authorization */}
          {checkout.currentStep === 5 && (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>Step 5: Authorise 256-Bit Encrypted Gateway Payment</span>
                </h3>
              </div>

              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 text-center">
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-black text-white">Payment Authorization Ready</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                    Tokenized via {checkout.selectedProvider} Gateway. Sentinel AI Fraud Risk Score: 3/100 (Passed).
                  </p>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 max-w-md mx-auto space-y-2 text-xs text-left font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Payment Method:</span>
                    <span className="text-white font-bold">{checkout.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Idempotency Token:</span>
                    <span className="text-[#febd69]">{checkout.idempotencyKey.slice(0, 20)}...</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-black text-sm border-t border-slate-800 pt-2">
                    <span>Net Charge Amount:</span>
                    <span>${netPayable.toFixed(2)} USD</span>
                  </div>
                </div>

                {checkout.isProcessing ? (
                  <div className="py-6 space-y-2 text-xs text-amber-300 font-mono animate-pulse">
                    <RefreshCw className="w-8 h-8 mx-auto animate-spin text-[#febd69]" />
                    <p>Executing Payment Authorization & Sentinel Fraud Audit...</p>
                  </div>
                ) : (
                  <button
                    onClick={handleExecutePayment}
                    className="px-8 py-3 bg-[#febd69] hover:bg-amber-400 text-slate-950 font-black text-sm rounded-2xl transition flex items-center space-x-2 mx-auto shadow-xl"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Confirm & Authorise ${netPayable.toFixed(2)}</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 6: Order Confirmation & Invoice */}
          {checkout.currentStep === 6 && checkout.completedTransaction && (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-2xl text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-white">Payment Authorised & Order Confirmed!</h3>
                <p className="text-xs text-emerald-300 font-mono">
                  Transaction #{checkout.completedTransaction.transactionId} • Invoice #{checkout.completedTransaction.invoiceNumber}
                </p>
              </div>

              {/* Order Confirmation Specs */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 text-xs font-mono">
                <div className="text-slate-400 font-sans font-bold uppercase tracking-wider text-[10px]">
                  Transaction Receipt Details:
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-500">Order ID:</span>
                    <div className="text-white font-bold">{checkout.completedTransaction.orderId}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Status:</span>
                    <div className="text-emerald-400 font-bold">{checkout.completedTransaction.status}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Payment Provider:</span>
                    <div className="text-white font-bold">{checkout.completedTransaction.provider}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Gateway Reference:</span>
                    <div className="text-[#febd69] font-bold">{checkout.completedTransaction.gatewayReference}</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1"
                >
                  <Printer className="w-4 h-4 text-[#febd69]" />
                  <span>Print Receipt</span>
                </button>

                <button
                  onClick={() => setCheckout({ ...checkout, currentStep: 1 })}
                  className="px-5 py-2 BG-[#febd69] hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition"
                >
                  Back to Checkout Main
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Dynamic Price Summary Box */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
            <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-2 border-b border-slate-800 pb-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Payment Summary</span>
            </h3>

            <div className="space-y-2 text-xs font-mono text-slate-300">
              <div className="flex justify-between">
                <span>Items Subtotal ({cartItems.length}):</span>
                <span className="text-white">${itemsSubtotal.toFixed(2)}</span>
              </div>

              {checkout.appliedDiscountUSD > 0 && (
                <div className="flex justify-between text-amber-400">
                  <span>- Coupon Discount ({checkout.couponCode}):</span>
                  <span>-${checkout.appliedDiscountUSD.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Shipping Fee:</span>
                <span className="text-white">${shippingCost.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Tax ({taxRatePct}% CA Sales Tax):</span>
                <span className="text-white">${taxAmount.toFixed(2)}</span>
              </div>

              {checkout.appliedGiftCardAmountUSD > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>- Gift Voucher Applied:</span>
                  <span>-${checkout.appliedGiftCardAmountUSD.toFixed(2)}</span>
                </div>
              )}

              {checkout.appliedWalletAmountUSD > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>- Wallet Credit Applied:</span>
                  <span>-${checkout.appliedWalletAmountUSD.toFixed(2)}</span>
                </div>
              )}

              <div className="border-t border-slate-800 pt-3 flex justify-between font-bold text-sm text-white">
                <span>Total Net Payable:</span>
                <span className="text-[#febd69] font-black">${netPayable.toFixed(2)} USD</span>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[10px] text-slate-400 space-y-1">
              <div className="flex items-center space-x-1 text-emerald-400 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Encrypted PCI-DSS Authorization</span>
              </div>
              <p>Protected by Sentinel AI Fraud Guard. Zero Fraud Liability.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
