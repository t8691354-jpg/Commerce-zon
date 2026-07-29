import React, { useState } from 'react';
import { WalletState, WalletCard, GiftCardItem } from '../../types/domain';
import {
  Wallet,
  CreditCard,
  PlusCircle,
  TrendingUp,
  Gift,
  Zap,
  ShieldCheck,
  Award,
  RefreshCw,
  Plus,
  CheckCircle2,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Sparkles,
  Lock,
  Tag
} from 'lucide-react';

interface BuyerWalletPanelProps {
  wallet: WalletState;
  onTopUp: (amount: number, description: string) => void;
  onAddCard: (card: WalletCard) => void;
  onRedeemGiftCard: (code: string) => boolean;
  onConvertPoints: (pointsToConvert: number) => void;
  onToggleAutoPay: () => void;
  currencyRate: number;
  currencySymbol: string;
}

export const BuyerWalletPanel: React.FC<BuyerWalletPanelProps> = ({
  wallet,
  onTopUp,
  onAddCard,
  onRedeemGiftCard,
  onConvertPoints,
  onToggleAutoPay,
  currencyRate,
  currencySymbol,
}) => {
  const buyer = wallet.buyerWallet;

  const [topUpAmount, setTopUpAmount] = useState<number>(100);
  const [customTopUp, setCustomTopUp] = useState<string>('');
  const [selectedCardId, setSelectedCardId] = useState<string>(wallet.cards[0]?.id || 'card-1');

  // Gift Card Redemption
  const [giftCode, setGiftCode] = useState<string>('');
  const [giftSuccess, setGiftSuccess] = useState<string | null>(null);
  const [giftError, setGiftError] = useState<string | null>(null);

  // Points Conversion
  const [pointsInput, setPointsInput] = useState<number>(1000);
  const [pointsConvertedMsg, setPointsConvertedMsg] = useState<string | null>(null);

  // New Card Modal
  const [showAddCard, setShowAddCard] = useState<boolean>(false);
  const [cardName, setCardName] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('12/28');
  const [cardBrand, setCardBrand] = useState<'VISA' | 'MASTERCARD' | 'AMEX'>('VISA');

  const handleTopUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = customTopUp ? parseFloat(customTopUp) : topUpAmount;
    if (isNaN(amt) || amt <= 0) return;

    const cardMask = wallet.cards.find((c) => c.id === selectedCardId)?.cardNumberMasked || 'Default Card';
    onTopUp(amt, `Top-Up via ${cardMask}`);
    setCustomTopUp('');
  };

  const handleRedeem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!giftCode.trim()) return;

    const ok = onRedeemGiftCard(giftCode.trim());
    if (ok) {
      setGiftSuccess(`Redeemed $50.00 voucher (${giftCode.toUpperCase()}) to Wallet Balance!`);
      setGiftError(null);
      setGiftCode('');
      setTimeout(() => setGiftSuccess(null), 4000);
    } else {
      setGiftError('Invalid or already redeemed voucher code. Try "ZONE-PAY-50" or "AMAZON-BONUS"');
      setGiftSuccess(null);
    }
  };

  const handleConvertPointsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pointsInput <= 0 || pointsInput > buyer.rewardPoints) return;
    onConvertPoints(pointsInput);
    const convertedDollar = (pointsInput / 100).toFixed(2);
    setPointsConvertedMsg(`Converted ${pointsInput} Points into $${convertedDollar} Wallet Credit!`);
    setTimeout(() => setPointsConvertedMsg(null), 4000);
  };

  const handleAddNewCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardName || !cardNumber) return;
    const last4 = cardNumber.replace(/\D/g, '').slice(-4) || '9999';
    onAddCard({
      id: `card-${Date.now()}`,
      cardHolderName: cardName.trim(),
      cardNumberMasked: `**** **** **** ${last4}`,
      expiry: cardExpiry,
      brand: cardBrand,
      isDefault: wallet.cards.length === 0,
    });
    setShowAddCard(false);
    setCardName('');
    setCardNumber('');
  };

  return (
    <div className="space-y-6">
      {/* Buyer Wallet Balances Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="bg-[#131921] border border-[#febd69]/60 p-3.5 rounded-2xl col-span-2 shadow-lg relative overflow-hidden">
          <div className="text-[10px] text-slate-400 font-mono uppercase font-bold">Main Wallet Balance</div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-1">
            {currencySymbol}{(buyer.walletBalance * currencyRate).toFixed(2)}
          </div>
          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 mt-2 inline-block">
            1-Click Checkout Ready
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
          <div className="text-[10px] text-slate-400 uppercase font-mono font-bold flex items-center space-x-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span>Cashback</span>
          </div>
          <div className="text-lg font-black text-emerald-400 font-mono mt-1">
            {currencySymbol}{(buyer.cashbackBalance * currencyRate).toFixed(2)}
          </div>
          <span className="text-[9px] text-slate-500">2% Prime Earned</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
          <div className="text-[10px] text-slate-400 uppercase font-mono font-bold flex items-center space-x-1">
            <RefreshCw className="w-3 h-3 text-sky-400" />
            <span>Refunds</span>
          </div>
          <div className="text-lg font-black text-sky-400 font-mono mt-1">
            {currencySymbol}{(buyer.refundBalance * currencyRate).toFixed(2)}
          </div>
          <span className="text-[9px] text-slate-500">FBA Returned</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
          <div className="text-[10px] text-slate-400 uppercase font-mono font-bold flex items-center space-x-1">
            <Award className="w-3 h-3 text-amber-400" />
            <span>Rewards</span>
          </div>
          <div className="text-lg font-black text-amber-400 font-mono mt-1">
            {currencySymbol}{(buyer.rewardBalance * currencyRate).toFixed(2)}
          </div>
          <span className="text-[9px] text-amber-300 font-bold">{buyer.rewardPoints} Pts</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
          <div className="text-[10px] text-slate-400 uppercase font-mono font-bold flex items-center space-x-1">
            <Gift className="w-3 h-3 text-purple-400" />
            <span>Gift Cards</span>
          </div>
          <div className="text-lg font-black text-purple-400 font-mono mt-1">
            {currencySymbol}{(buyer.giftCardBalance * currencyRate).toFixed(2)}
          </div>
          <span className="text-[9px] text-slate-500">Store Vouchers</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
          <div className="text-[10px] text-slate-400 uppercase font-mono font-bold flex items-center space-x-1">
            <Tag className="w-3 h-3 text-pink-400" />
            <span>Store Credit</span>
          </div>
          <div className="text-lg font-black text-pink-400 font-mono mt-1">
            {currencySymbol}{(buyer.storeCredit * currencyRate).toFixed(2)}
          </div>
          <span className="text-[9px] text-slate-500">Promo Credits</span>
        </div>
      </div>

      {/* Top-Up & Payment Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Top-Up Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <PlusCircle className="w-5 h-5 text-[#febd69]" />
              <h3 className="text-sm font-bold text-white">Deposit / Add Funds to Wallet</h3>
            </div>
            <span className="text-[11px] text-emerald-400 font-mono font-bold">Instant Credit</span>
          </div>

          <div className="space-y-3">
            <label className="text-xs text-slate-400 font-medium">Select Saved Payment Card:</label>
            <div className="grid grid-cols-2 gap-2">
              {wallet.cards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => setSelectedCardId(card.id)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition flex items-center justify-between text-xs ${
                    selectedCardId === card.id
                      ? 'bg-[#131921] border-[#febd69] text-white font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-[#febd69]" />
                    <span>{card.cardNumberMasked}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{card.brand}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowAddCard(true)}
              className="w-full py-2 bg-slate-950 hover:bg-slate-800 border border-dashed border-slate-700 text-xs text-slate-300 font-bold rounded-xl transition flex items-center justify-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5 text-[#febd69]" />
              <span>+ Add New Debit/Credit Card</span>
            </button>
          </div>

          {/* Presets */}
          <div className="space-y-2 pt-2">
            <label className="text-xs text-slate-400 font-medium">Select Top-Up Amount:</label>
            <div className="grid grid-cols-4 gap-2">
              {[50, 100, 250, 500].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    setTopUpAmount(amt);
                    setCustomTopUp('');
                  }}
                  className={`py-2 rounded-xl text-xs font-bold font-mono transition border ${
                    topUpAmount === amt && !customTopUp
                      ? 'bg-[#febd69] text-slate-950 border-[#febd69]'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  +{currencySymbol}{amt}
                </button>
              ))}
            </div>

            <form onSubmit={handleTopUpSubmit} className="flex gap-2 pt-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-mono">{currencySymbol}</span>
                <input
                  type="number"
                  placeholder="Custom amount..."
                  value={customTopUp}
                  onChange={(e) => setCustomTopUp(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-7 pr-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#febd69]"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-extrabold text-xs rounded-xl transition shadow active:scale-98"
              >
                Top Up Now
              </button>
            </form>
          </div>
        </div>

        {/* Gift Card Redemption & Reward Points Converter */}
        <div className="space-y-6">
          {/* Redeem Gift Voucher */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-2 text-sm font-bold text-white">
                <Gift className="w-5 h-5 text-amber-400" />
                <span>Redeem Gift Card or Promo Voucher</span>
              </div>
            </div>

            <form onSubmit={handleRedeem} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Gift Voucher Code (e.g. ZONE-PAY-50)"
                value={giftCode}
                onChange={(e) => setGiftCode(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-mono uppercase focus:outline-none focus:border-[#febd69]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-extrabold text-xs rounded-xl transition shadow"
              >
                Apply
              </button>
            </form>

            <div className="pt-1 flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] text-slate-500">Quick Test Vouchers:</span>
              {['ZONE-PAY-50', 'AMAZON-BONUS', 'PRIME-2026'].map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => {
                    setGiftCode(code);
                    onRedeemGiftCard(code);
                    setGiftSuccess(`Redeemed $50.00 voucher (${code})!`);
                    setTimeout(() => setGiftSuccess(null), 3000);
                  }}
                  className="px-2 py-0.5 bg-slate-950 border border-slate-800 hover:border-[#febd69] text-[10px] font-mono text-[#febd69] rounded transition"
                >
                  +{code}
                </button>
              ))}
            </div>

            {giftSuccess && (
              <p className="text-xs text-emerald-400 font-bold bg-emerald-950 p-2 rounded-lg border border-emerald-800">
                ✓ {giftSuccess}
              </p>
            )}
            {giftError && (
              <p className="text-xs text-rose-400 font-bold bg-rose-950 p-2 rounded-lg border border-rose-800">
                ✕ {giftError}
              </p>
            )}
          </div>

          {/* Convert Rewards Points Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-2 text-sm font-bold text-white">
                <Award className="w-5 h-5 text-amber-400" />
                <span>Convert Reward Points to Wallet Cash</span>
              </div>
              <span className="text-xs font-mono font-bold text-amber-400">{buyer.rewardPoints} Pts Available</span>
            </div>

            <p className="text-xs text-slate-400">
              Rate: <strong>100 Points = $1.00 USD</strong> instant wallet balance credit.
            </p>

            <form onSubmit={handleConvertPointsSubmit} className="flex gap-2">
              <input
                type="number"
                placeholder="Points to convert..."
                value={pointsInput}
                onChange={(e) => setPointsInput(parseInt(e.target.value) || 0)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#febd69]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl transition shadow"
              >
                Convert to Cash
              </button>
            </form>

            {pointsConvertedMsg && (
              <p className="text-xs text-amber-300 font-bold bg-amber-950/80 p-2 rounded-lg border border-amber-800">
                ✓ {pointsConvertedMsg}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Add Card Modal */}
      {showAddCard && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-[#febd69]" />
                <span>Add New Payment Card</span>
              </h3>
              <button onClick={() => setShowAddCard(false)} className="text-slate-400 text-sm">✕</button>
            </div>

            <form onSubmit={handleAddNewCard} className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-400 font-semibold">Cardholder Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. AeroSpace Corp"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mt-1 focus:outline-none focus:border-[#febd69]"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-semibold">Card Number</label>
                <input
                  type="text"
                  placeholder="4532 •••• •••• 8888"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mt-1 font-mono focus:outline-none focus:border-[#febd69]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 font-semibold">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="12/28"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mt-1 font-mono focus:outline-none focus:border-[#febd69]"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 font-semibold">Card Brand</label>
                  <select
                    value={cardBrand}
                    onChange={(e) => setCardBrand(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mt-1 focus:outline-none focus:border-[#febd69]"
                  >
                    <option value="VISA">VISA</option>
                    <option value="MASTERCARD">MASTERCARD</option>
                    <option value="AMEX">AMEX</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddCard(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-extrabold text-xs rounded-xl"
                >
                  Save Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
