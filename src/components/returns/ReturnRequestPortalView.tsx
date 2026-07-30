import React, { useState } from 'react';
import { ReturnRequest, ReturnReason, ResolutionType, ExchangeType } from '../../types/returns';
import {
  Package,
  Upload,
  RefreshCw,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  FileText,
  QrCode,
  Truck,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface Props {
  onRequestSubmitted: (newReturn: ReturnRequest) => void;
}

export const ReturnRequestPortalView: React.FC<Props> = ({ onRequestSubmitted }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [orderId, setOrderId] = useState('ORD-88902-US');
  const [itemName, setItemName] = useState('Anker 100W GaN Fast Charger Station');
  const [sku, setSku] = useState('SKU-ANK-100W');
  const [category, setCategory] = useState('Electronics & Gadgets');
  const [unitPriceUSD, setUnitPriceUSD] = useState(79.99);
  const [sellerName, setSellerName] = useState('Anker Official Store');

  const [reason, setReason] = useState<ReturnReason>('DEFECTIVE');
  const [comments, setComments] = useState('');
  const [proofImage, setProofImage] = useState('https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=60');

  const [resolutionRequested, setResolutionRequested] = useState<ResolutionType>('REFUND');
  const [exchangeType, setExchangeType] = useState<ExchangeType>('PRODUCT_REPLACEMENT');
  const [requestedVariant, setRequestedVariant] = useState('White Edition 100W');

  const [submittedReturn, setSubmittedReturn] = useState<ReturnRequest | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newRMA: ReturnRequest = {
      returnId: `RMA-${Math.floor(10000 + Math.random() * 90000)}`,
      orderId,
      buyerId: 'USR-8821',
      buyerName: 'David Miller',
      buyerEmail: 'david.m@example.com',
      sellerId: 'SEL-ANK',
      sellerName,
      item: {
        sku,
        name: itemName,
        category,
        quantity: 1,
        unitPriceUSD,
        imageUrl: proofImage,
        sellerId: 'SEL-ANK',
        sellerName,
      },
      reason,
      comments: comments || 'Item malfunctioned upon setup.',
      proofImages: [proofImage],
      resolutionRequested,
      exchangeType: resolutionRequested === 'EXCHANGE' || resolutionRequested === 'REPLACEMENT' ? exchangeType : undefined,
      requestedVariant: resolutionRequested === 'EXCHANGE' ? requestedVariant : undefined,
      status: unitPriceUSD <= 100 ? 'AUTO_APPROVED' : 'SELLER_REVIEW',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      policyWindowDays: 30,
      purchaseDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      shippingLabel: {
        carrier: 'UPS Return Ground',
        trackingNumber: `1Z999999${Math.floor(10000000 + Math.random() * 90000000)}`,
        labelUrl: 'https://api.qrserver.com/v1/create-qr-code/?data=UPS-LABEL-RMA-GENERATED',
        qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?data=UPS-LABEL-RMA-GENERATED',
        returnAddress: 'Commerce Zon Global Return FC Hub #7, Louisville KY 40201',
      },
      fraudDetails: {
        fraudRiskScore: 4,
        riskFlags: [],
        requiresAdminOverride: false,
        isFrozen: false,
      },
    };

    onRequestSubmitted(newRMA);
    setSubmittedReturn(newRMA);
    setStep(4);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Package className="w-5 h-5 text-[#febd69]" />
            <span>Buyer Self-Service Return & Replacement Request Wizard</span>
          </h2>
          <p className="text-xs text-slate-400">
            Submit return claims, request size/variant exchanges, or upload evidence for automated label generation.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono transition ${
                step === i
                  ? 'bg-[#febd69] text-slate-950 ring-2 ring-[#febd69]/40'
                  : step > i
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {step > i ? '✓' : i}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Select Item */}
      {step === 1 && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-5">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Package className="w-4 h-4 text-[#febd69]" />
            <span>Step 1: Select Order & Product for Return</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Order Number</label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#febd69]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Merchant / Seller Name</label>
              <input
                type="text"
                value={sellerName}
                onChange={(e) => setSellerName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#febd69]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Product Title</label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#febd69]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Unit Price ($ USD)</label>
              <input
                type="number"
                value={unitPriceUSD}
                onChange={(e) => setUnitPriceUSD(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#febd69]"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="px-5 py-2.5 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black text-xs rounded-xl flex items-center space-x-2 shadow-lg"
            >
              <span>Continue to Return Reason</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Return Reason & Evidence */}
      {step === 2 && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-5">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <FileText className="w-4 h-4 text-[#febd69]" />
            <span>Step 2: Reason for Return & Evidence Upload</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Primary Return Reason</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'DEFECTIVE', label: 'Defective Product / Malfunction' },
                  { id: 'DAMAGED_ITEM', label: 'Damaged in Shipping' },
                  { id: 'WRONG_ITEM', label: 'Wrong Item Shipped' },
                  { id: 'MISSING_PARTS', label: 'Missing Parts / Accessories' },
                  { id: 'QUALITY_ISSUE', label: 'Quality / Sizing Discrepancy' },
                  { id: 'CHANGED_MIND', label: 'Changed Mind / Not Needed' },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setReason(r.id as ReturnReason)}
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition ${
                      reason === r.id
                        ? 'bg-[#febd69] text-slate-950 border-[#febd69] shadow-lg'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Explanation & Comments</label>
              <textarea
                rows={3}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Describe what went wrong with the item..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-[#febd69]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Proof Image URL (Defect / Packaging)</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={proofImage}
                  onChange={(e) => setProofImage(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#febd69]"
                />
                <button
                  type="button"
                  className="px-3 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-lg text-xs font-bold flex items-center space-x-1"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Attach</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-5 py-2.5 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black text-xs rounded-xl flex items-center space-x-2 shadow-lg"
            >
              <span>Choose Resolution Type</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Choose Resolution (Refund vs Exchange) */}
      {step === 3 && (
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-5">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-[#febd69]" />
            <span>Step 3: Select Requested Resolution</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              onClick={() => setResolutionRequested('REFUND')}
              className={`p-4 rounded-xl border cursor-pointer transition space-y-2 ${
                resolutionRequested === 'REFUND'
                  ? 'bg-[#febd69]/10 border-[#febd69] ring-2 ring-[#febd69]/30'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-black text-sm text-white flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-[#febd69]" />
                  <span>Request Full Refund</span>
                </span>
                {resolutionRequested === 'REFUND' && <CheckCircle2 className="w-5 h-5 text-[#febd69]" />}
              </div>
              <p className="text-xs text-slate-400">
                Receive 100% refund to original payment method or instant credit to Commerce Zon Marketplace Wallet.
              </p>
            </div>

            <div
              onClick={() => setResolutionRequested('EXCHANGE')}
              className={`p-4 rounded-xl border cursor-pointer transition space-y-2 ${
                resolutionRequested === 'EXCHANGE'
                  ? 'bg-cyan-500/10 border-cyan-500 ring-2 ring-cyan-500/30'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-black text-sm text-white flex items-center space-x-2">
                  <RefreshCw className="w-4 h-4 text-cyan-400" />
                  <span>Request Product Exchange / Replacement</span>
                </span>
                {resolutionRequested === 'EXCHANGE' && <CheckCircle2 className="w-5 h-5 text-cyan-400" />}
              </div>
              <p className="text-xs text-slate-400">
                Swap for a different size, color, or receive a brand new replacement dispatch.
              </p>
            </div>
          </div>

          {resolutionRequested === 'EXCHANGE' && (
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
              <div className="text-xs font-bold text-cyan-400">Exchange Options Configuration</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Exchange Category</label>
                  <select
                    value={exchangeType}
                    onChange={(e) => setExchangeType(e.target.value as ExchangeType)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="PRODUCT_REPLACEMENT">Exact Product Replacement</option>
                    <option value="SIZE_EXCHANGE">Size Exchange</option>
                    <option value="COLOR_EXCHANGE">Color Exchange</option>
                    <option value="VARIANT_EXCHANGE">Variant Swap</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Requested Variant Description</label>
                  <input
                    type="text"
                    value={requestedVariant}
                    onChange={(e) => setRequestedVariant(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center space-x-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Submit RMA Claim & Generate Label</span>
            </button>
          </div>
        </form>
      )}

      {/* Step 4: Submission Confirmation & Prepaid Return Label */}
      {step === 4 && submittedReturn && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-6">
          <div className="flex items-center space-x-3 text-emerald-400 border-b border-slate-800 pb-4">
            <CheckCircle2 className="w-8 h-8" />
            <div>
              <h3 className="text-base font-black text-white">
                RMA Return Request Successfully Authorized ({submittedReturn.returnId})
              </h3>
              <p className="text-xs text-slate-400">
                Prepaid shipping label generated. Status:{' '}
                <span className="text-emerald-400 font-mono font-bold uppercase">{submittedReturn.status}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* RMA Summary */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 text-xs">
              <div className="font-bold text-white border-b border-slate-800 pb-2">RMA Claim Summary</div>
              <div className="flex justify-between text-slate-300">
                <span>RMA Number:</span>
                <span className="font-mono text-[#febd69] font-bold">{submittedReturn.returnId}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Item Name:</span>
                <span className="text-white font-medium">{submittedReturn.item.name}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Requested Resolution:</span>
                <span className="text-cyan-400 font-bold">{submittedReturn.resolutionRequested}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Estimated Refund Value:</span>
                <span className="text-emerald-400 font-mono font-bold">${submittedReturn.item.unitPriceUSD.toFixed(2)}</span>
              </div>
            </div>

            {/* Prepaid Label & QR Code */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center space-x-4">
              <img
                src={submittedReturn.shippingLabel?.qrCodeUrl}
                alt="UPS QR Code"
                className="w-24 h-24 bg-white p-2 rounded-lg border border-slate-700"
              />
              <div className="space-y-1 text-xs">
                <div className="font-bold text-white flex items-center space-x-1">
                  <Truck className="w-4 h-4 text-[#febd69]" />
                  <span>Prepaid UPS Drop-Off QR Code</span>
                </div>
                <div className="text-slate-400">Tracking: <span className="font-mono text-white">{submittedReturn.shippingLabel?.trackingNumber}</span></div>
                <div className="text-[10px] text-slate-500">{submittedReturn.shippingLabel?.returnAddress}</div>
                <button
                  onClick={() => alert(`Printing Return Label for ${submittedReturn.returnId}...`)}
                  className="mt-2 px-3 py-1.5 bg-[#febd69] text-slate-950 font-black rounded text-[11px] hover:bg-[#f3a847]"
                >
                  Download / Print Shipping Label PDF
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => {
                setStep(1);
                setSubmittedReturn(null);
              }}
              className="px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold text-xs rounded-xl"
            >
              Submit Another Return Request
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
