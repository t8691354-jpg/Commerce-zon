import React, { useState } from 'react';
import { X, Key, ShieldCheck, AlertCircle, CheckCircle2, Copy, Check, RefreshCw, Cpu, Server } from 'lucide-react';
import { digitalMarketplaceClient } from '../../services/digitalMarketplaceClient';

interface DigitalLicenseCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DigitalLicenseCheckerModal: React.FC<DigitalLicenseCheckerModalProps> = ({
  isOpen,
  onClose
}) => {
  const [licenseKey, setLicenseKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Activation tester state
  const [testDomain, setTestDomain] = useState('app.production-demo.com');
  const [activating, setActivating] = useState(false);
  const [activationResult, setActivationResult] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!licenseKey.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setActivationResult(null);

    try {
      const res = await digitalMarketplaceClient.verifyLicense(licenseKey.trim());
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Verification service unreachable');
    } finally {
      setLoading(false);
    }
  };

  const handleTestActivation = async () => {
    if (!licenseKey.trim() || !testDomain.trim()) return;
    setActivating(true);
    setActivationResult(null);

    try {
      const res = await digitalMarketplaceClient.activateLicense(licenseKey.trim(), testDomain.trim());
      setActivationResult(res);
      // Re-verify to update seat counts
      await handleVerify();
    } catch (err: any) {
      setActivationResult({ success: false, message: err.message || 'Failed to activate' });
    } finally {
      setActivating(false);
    }
  };

  const handleCopySample = (sampleKey: string) => {
    setLicenseKey(sampleKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <span>Cryptographic License Validator</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Live API
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Validate authenticity, seat allocations, and domain bindings in real time.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Quick Sample Paste Bar */}
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between text-xs">
            <span className="text-slate-400">Test with sample key:</span>
            <button
              type="button"
              onClick={() => handleCopySample('CZON-DIGI-7F2A-98C1-E4D2-B831')}
              className="text-[#febd69] hover:underline font-mono font-bold flex items-center space-x-1"
            >
              <span>CZON-DIGI-7F2A-98C1-E4D2-B831</span>
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1.5">
                License Key (Format: CZON-DIGI-XXXX-XXXX-XXXX-XXXX)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  required
                  value={licenseKey}
                  onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
                  placeholder="CZON-DIGI-XXXX-XXXX-XXXX-XXXX"
                  className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-sm placeholder-slate-600 focus:outline-none focus:border-indigo-400"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1.5 disabled:opacity-50"
                >
                  {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Verify Now</span>
                </button>
              </div>
            </div>
          </form>

          {/* Verification Result Card */}
          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {result && (
            <div className={`p-4 rounded-xl border ${result.valid ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'} space-y-3`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {result.valid ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-400" />
                  )}
                  <span className={`text-sm font-bold ${result.valid ? 'text-emerald-300' : 'text-rose-300'}`}>
                    {result.valid ? 'Authentic Verified License' : 'Invalid License'}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {result.valid ? 'Signature Status: OK' : 'Signature Status: FAILED'}
                </span>
              </div>

              <p className="text-xs text-slate-300">{result.message}</p>

              {result.valid && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800">
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase font-mono">Product</span>
                    <span className="text-xs font-bold text-white line-clamp-1">{result.productTitle}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase font-mono">Tier</span>
                    <span className="text-xs font-bold text-indigo-300">{result.tierName}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase font-mono">Max Seats</span>
                    <span className="text-xs font-bold font-mono text-white">{result.maxSeats} Seats</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase font-mono">Available</span>
                    <span className="text-xs font-bold font-mono text-emerald-400">{result.seatsRemaining} Left</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Test Live Activation Simulator */}
          {result?.valid && (
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-white flex items-center space-x-1.5 font-mono uppercase">
                <Server className="w-3.5 h-3.5 text-indigo-400" />
                <span>Simulate Remote Client Machine / Domain Activation</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Test how your application software validates licenses via the <code>/api/digital/licenses/activate</code> endpoint.
              </p>

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={testDomain}
                  onChange={(e) => setTestDomain(e.target.value)}
                  placeholder="e.g. app.mycompany.com or device-uuid-889"
                  className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-indigo-400"
                />
                <button
                  type="button"
                  onClick={handleTestActivation}
                  disabled={activating}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-lg transition flex items-center space-x-1 border border-slate-700 disabled:opacity-50"
                >
                  {activating && <RefreshCw className="w-3 h-3 animate-spin" />}
                  <span>Test Activation</span>
                </button>
              </div>

              {activationResult && (
                <div className={`p-2.5 rounded-lg text-xs ${activationResult.success ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'}`}>
                  {activationResult.message}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition"
          >
            Close Validator
          </button>
        </div>
      </div>
    </div>
  );
};
