import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTrading } from '../../context/TradingContext';
import { Shield, Smartphone, Key, RotateCcw, CheckCircle2, User, Globe, Mail, Phone } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { currentUser, updateProfile } = useAuth();
  const { resetDemoBalance } = useTrading();

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [country, setCountry] = useState(currentUser?.country || 'United States');
  const [twoFactor, setTwoFactor] = useState(currentUser?.twoFactorEnabled || false);
  const [savedNotice, setSavedNotice] = useState(false);

  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passNotice, setPassNotice] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      phone,
      country,
      twoFactorEnabled: twoFactor,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 4000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPass || newPass.length < 6) {
      setPassNotice('Password must contain at least 6 characters.');
      return;
    }
    setPassNotice('Password updated successfully.');
    setCurrentPass('');
    setNewPass('');
    setTimeout(() => setPassNotice(''), 4000);
  };

  const avatarOptions = [
    { label: 'Sarah (Trader)', url: '/assets/images/avatar_trader_sarah_1793624992270.jpg' },
    { label: 'Marcus (Admin/Analyst)', url: '/assets/images/avatar_trader_marcus_1793624992948.jpg' },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Account Profile & Security Settings
        </h1>
        <p className="text-xs text-slate-500">
          Manage personal credentials, authentication security, and virtual demo configurations
        </p>
      </div>

      {/* Profile Information Card */}
      <div className="p-6 rounded-2xl bg-slate-900/60 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <User className="w-4 h-4 text-blue-400" />
          Personal Details
        </h3>

        <form onSubmit={handleSaveProfile} className="flex flex-col gap-4 text-xs">
          {/* Avatar Selector */}
          <div>
            <label className="block text-slate-400 mb-2 font-medium">Profile Avatar</label>
            <div className="flex items-center gap-4">
              <img
                src={currentUser?.avatarUrl || avatarOptions[0].url}
                alt={currentUser?.name}
                className="w-16 h-16 rounded-xl object-cover border-2 border-blue-500 shadow-md"
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-wrap items-center gap-2">
                {avatarOptions.map((opt) => (
                  <button
                    key={opt.url}
                    type="button"
                    onClick={() => updateProfile({ avatarUrl: opt.url })}
                    className={`px-3 py-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                      currentUser?.avatarUrl === opt.url
                        ? 'bg-blue-600/20 border-blue-500 text-white font-semibold'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    Select {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">User Identifier (Permanent)</label>
              <input
                type="text"
                disabled
                value={currentUser?.id || ''}
                className="w-full bg-slate-800/40 border border-slate-800 rounded-xl px-3 py-2 text-slate-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Account Role & Status</label>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 font-mono uppercase text-[11px] font-bold">
                  {currentUser?.role}
                </span>
                <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 font-mono uppercase text-[11px] font-bold">
                  {currentUser?.status}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Email Address</label>
              <input
                type="email"
                disabled
                value={currentUser?.email || ''}
                className="w-full bg-slate-800/40 border border-slate-800 rounded-xl px-3 py-2 text-slate-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Country / Jurisdiction</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {savedNotice && (
            <div className="flex items-center gap-2 p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Profile information successfully saved.</span>
            </div>
          )}

          <div className="flex justify-end mt-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors cursor-pointer"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>

      {/* Security & 2FA */}
      <div className="p-6 rounded-2xl bg-slate-900/60 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          Security & Password Management
        </h3>

        <div className="flex flex-col gap-6 text-xs">
          {/* 2FA Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/40 border border-slate-800">
            <div className="flex items-center gap-3">
              <Smartphone className="w-6 h-6 text-blue-400" />
              <div>
                <span className="font-bold text-slate-200 text-sm block">Two-Factor Authentication (2FA)</span>
                <span className="text-slate-400 text-xs">
                  Enforce simulated authenticator app code on high-value executions
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                const nextState = !twoFactor;
                setTwoFactor(nextState);
                updateProfile({ twoFactorEnabled: nextState });
              }}
              className={`px-4 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                twoFactor
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {twoFactor ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {/* Change Password Form */}
          <form onSubmit={handlePasswordChange} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Current Password</label>
              <input
                type="password"
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-medium">New Password</label>
              <input
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            {passNotice && (
              <div className="col-span-full p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
                {passNotice}
              </div>
            )}
            <div className="col-span-full flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700 transition-colors cursor-pointer"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Demo Balance Management & Reset */}
      <div className="p-6 rounded-2xl bg-slate-900/60 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-amber-400" />
          Virtual Demo Sandbox Reset
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Need a fresh start? Resetting will clear active demo positions and restore your virtual demo balance to $10,000.00.
        </p>

        <div className="flex items-center justify-between p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
          <div>
            <span className="font-bold text-slate-200 text-xs block">Reset Virtual Funds to $10,000.00</span>
            <span className="text-[11px] text-slate-400">Current balance: ${currentUser?.demoBalance.toLocaleString()}</span>
          </div>
          <button
            onClick={resetDemoBalance}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Balance</span>
          </button>
        </div>
      </div>
    </div>
  );
};
