import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface LegalModalsProps {
  modalType: 'terms' | 'privacy' | 'risk' | 'contact' | null;
  onClose: () => void;
}

export const LegalModals: React.FC<LegalModalsProps> = ({ modalType, onClose }) => {
  if (!modalType) return null;

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    setTimeout(() => {
      setContactSent(false);
      onClose();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl relative max-h-[85vh] flex flex-col text-xs text-slate-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal 1: Terms of Service */}
        {modalType === 'terms' && (
          <div className="overflow-y-auto pr-2 flex flex-col gap-4">
            <h2 className="text-lg font-bold text-white">BINANY TRADING Terms of Service</h2>
            <span className="text-[10px] font-mono text-slate-500">Effective Date: January 1, 2026</span>
            
            <p>
              Welcome to BINANY TRADING. By accessing our platform, website, or trading environment, you agree to be bound by these Terms of Service.
            </p>
            <h4 className="font-bold text-white text-sm">1. Platform Environment & Terms</h4>
            <p>
              BINANY TRADING is operated as a premier multi-asset trading platform. Users can analyze candlestick charts, execute orders, and participate in financial markets according to their account terms.
            </p>
            <h4 className="font-bold text-white text-sm">2. Account Governance & Unique Identifiers</h4>
            <p>
              Every user is assigned a unique Trader ID. Users agree to provide truthful registration details and maintain the confidentiality of their login credentials. The platform reserves the right to suspend or terminate accounts in violation of platform rules or simulated abuse.
            </p>
            <h4 className="font-bold text-white text-sm">3. No Investment Advice</h4>
            <p>
              Market commentary, price charting, and indicators displayed on BINANY TRADING do not constitute financial, investment, legal, or tax advice. Past performance is never a guarantee of future real-world financial performance.
            </p>
          </div>
        )}

        {/* Modal 2: Privacy Policy */}
        {modalType === 'privacy' && (
          <div className="overflow-y-auto pr-2 flex flex-col gap-4">
            <h2 className="text-lg font-bold text-white">BINANY TRADING Privacy Policy</h2>
            <span className="text-[10px] font-mono text-slate-500">Last Updated: March 2026</span>

            <p>
              Your privacy is of foundational importance to BINANY TRADING. This Privacy Policy details our procedures regarding the storage, protection, and management of user data.
            </p>
            <h4 className="font-bold text-white text-sm">1. Information We Collect</h4>
            <p>
              We collect user registration details including name, email address, password hashes, and localized preference cookies (such as theme and favorite asset selections). We do NOT collect credit card numbers or CVVs.
            </p>
            <h4 className="font-bold text-white text-sm">2. Data Security & Storage</h4>
            <p>
              BINANY TRADING employs industry-standard encryption protocols. Passwords are never stored in plaintext. Access to user administrative data is governed by strict role-based authorization controls and system audit logs.
            </p>
            <h4 className="font-bold text-white text-sm">3. Third-Party Sharing</h4>
            <p>
              We do not sell, rent, or trade your personal information with external advertisers or commercial data brokers.
            </p>
          </div>
        )}

        {/* Modal 3: Risk Disclosure */}
        {modalType === 'risk' && (
          <div className="overflow-y-auto pr-2 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-amber-400">
              <ShieldAlert className="w-6 h-6 shrink-0" />
              <h2 className="text-lg font-bold text-white">Comprehensive Risk Disclosure</h2>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Notice to All Prospective Traders</span>

            <p className="leading-relaxed">
              Trading foreign exchange (Forex), leveraged contracts for difference (CFDs), equities, and digital cryptocurrencies involves substantial risks. The high degree of leverage available in financial markets can work against you as well as for you.
            </p>
            <h4 className="font-bold text-white text-sm">Simulated Demo vs. Real Market Execution</h4>
            <p className="leading-relaxed">
              Please note that simulated demo trading results have inherent limitations. Unlike real-world trading, demo trades do not incur actual capital loss, execution latency delays may be modeled differently, and emotional psychological pressures inherent to risking real capital are absent.
            </p>
            <h4 className="font-bold text-white text-sm">Liquidation and Margin Calls</h4>
            <p className="leading-relaxed">
              Leveraged positions require maintenance margin. If market prices move against your position, your simulated margin will be depleted. In demo mode, positions are automatically closed if losses reach 95% of allocated margin.
            </p>
          </div>
        )}

        {/* Modal 4: Contact Desk */}
        {modalType === 'contact' && (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-white">Contact Institutional Desk</h2>
            <p className="text-slate-400 text-xs">
              Reach our London and New York compliance desks for enterprise partnerships or technical support.
            </p>

            {contactSent ? (
              <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                <span className="text-sm font-bold text-white">Message Transmitted</span>
                <p className="text-xs text-slate-400">
                  Thank you for reaching out. A BINANY TRADING representative will respond to your inquiry shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="flex flex-col gap-3 mt-1">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Your Name</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Alexander Hamilton"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Email Address</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Inquiry Message</label>
                  <textarea
                    required
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="How can our institutional trading team assist you today?"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold cursor-pointer"
                  >
                    Transmit Message
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
