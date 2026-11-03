import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, ShieldCheck, Mail, Lock, User, ArrowRight, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface AuthModalsProps {
  authMode: 'login' | 'register' | 'forgot' | 'verify' | null;
  onClose: () => void;
  onSwitchMode: (mode: 'login' | 'register' | 'forgot' | 'verify') => void;
  onSuccessAuth: () => void;
}

export const AuthModals: React.FC<AuthModalsProps> = ({
  authMode,
  onClose,
  onSwitchMode,
  onSuccessAuth,
}) => {
  const { login, register, loginAs, verifyEmail, requestPasswordReset, resetPassword, currentUser } = useAuth();

  // Login states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register states
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regTerms, setRegTerms] = useState(true);

  // Forgot / Reset states
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotStep, setForgotStep] = useState<'request' | 'reset'>('request');

  // Verify email state
  const [verifyCode, setVerifyCode] = useState('');

  // Status feedback
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!authMode) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    const res = await login(loginEmail, loginPassword);
    setIsLoading(false);

    if (res.success) {
      onSuccessAuth();
      onClose();
    } else {
      setErrorMsg(res.message || 'Authentication failed');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!regTerms) {
      setErrorMsg('Please accept the Terms of Service to continue.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMsg('Password must contain at least 6 characters.');
      return;
    }

    setIsLoading(true);
    const res = await register(regName, regEmail, regPassword);
    setIsLoading(false);

    if (res.success) {
      onSwitchMode('verify');
    } else {
      setErrorMsg(res.message || 'Registration failed');
    }
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const valid = verifyEmail(verifyCode);
    if (valid) {
      setSuccessMsg('Email verified successfully! Opening terminal...');
      setTimeout(() => {
        onSuccessAuth();
        onClose();
      }, 1500);
    } else {
      setErrorMsg('Invalid verification code. Please enter 6 digits (or click auto-fill).');
    }
  };

  const handleForgotRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);
    const ok = await requestPasswordReset(forgotEmail);
    setIsLoading(false);
    if (ok) {
      setForgotStep('reset');
      setSuccessMsg('Reset code simulated and sent to your email.');
    } else {
      setErrorMsg('No registered account found with that email.');
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);
    const ok = await resetPassword(forgotEmail, resetCode, newPassword);
    setIsLoading(false);
    if (ok) {
      setSuccessMsg('Password reset successfully! Please sign in.');
      setTimeout(() => {
        onSwitchMode('login');
      }, 1500);
    } else {
      setErrorMsg('Invalid reset code or short password.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-sm sm:max-w-md bg-[#101726] border border-[#1F2C42] rounded-3xl p-6 sm:p-8 shadow-2xl relative text-xs text-slate-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top App Icon Badge matching screenshot */}
        <div className="text-center mb-4">
          <div className="w-14 h-14 rounded-2xl bg-[#0B1320] border-2 border-[#00E599] flex items-center justify-center shadow-lg shadow-[#00E599]/20 mx-auto">
            <span className="text-2xl font-black text-[#00E599]">B</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-2.5 mb-0.5 tracking-tight">
            BINANY TRADING
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Global Financial Trading Platform
          </p>
          <div className="inline-flex items-center justify-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-semibold text-[#00E599]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E599] animate-pulse" />
            <span>Centralized Real-Time Backend Active</span>
          </div>
        </div>

        {/* Segmented Pill Switcher: [ Login ] [ Sign Up ] */}
        {(authMode === 'login' || authMode === 'register') && (
          <div className="w-full p-1 rounded-2xl bg-[#0B101D] border border-[#1E293B] flex items-center gap-1 mb-5">
            <button
              type="button"
              onClick={() => {
                onSwitchMode('login');
                setErrorMsg('');
              }}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                authMode === 'login'
                  ? 'bg-[#00E599] text-slate-950 font-black shadow-md shadow-[#00E599]/20'
                  : 'text-slate-400 hover:text-white bg-transparent'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                onSwitchMode('register');
                setErrorMsg('');
              }}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                authMode === 'register'
                  ? 'bg-[#00E599] text-slate-950 font-black shadow-md shadow-[#00E599]/20'
                  : 'text-slate-400 hover:text-white bg-transparent'
              }`}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* 1. LOGIN MODE */}
        {authMode === 'login' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <div className="w-6 h-6 rounded-full bg-[#00E599]/20 text-[#00E599] flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-[#00E599]" />
              </div>
              <span>Trader Sign In</span>
            </div>

            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3.5">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold text-[11px]">
                  Username or Email
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="trader_john"
                    className="w-full bg-[#0A0F1A] border border-[#1F2C42] focus:border-[#00E599] focus:ring-1 focus:ring-[#00E599] rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-400 font-semibold text-[11px]">Password</label>
                  <button
                    type="button"
                    onClick={() => onSwitchMode('forgot')}
                    className="text-[#00E599] hover:underline text-[11px]"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#0A0F1A] border border-[#1F2C42] focus:border-[#00E599] focus:ring-1 focus:ring-[#00E599] rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

            </form>
          </div>
        )}

        {/* 2. REGISTER MODE */}
        {authMode === 'register' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <div className="w-6 h-6 rounded-full bg-[#00E599]/20 text-[#00E599] flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-[#00E599]" />
              </div>
              <span>Create Trader Account</span>
            </div>

            <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold text-[11px]">
                  Full Name / Username
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="trader_john"
                    className="w-full bg-[#0A0F1A] border border-[#1F2C42] focus:border-[#00E599] focus:ring-1 focus:ring-[#00E599] rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold text-[11px]">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="john@tradepro.io"
                    className="w-full bg-[#0A0F1A] border border-[#1F2C42] focus:border-[#00E599] focus:ring-1 focus:ring-[#00E599] rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold text-[11px]">
                  Password (Min. 6 chars)
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#0A0F1A] border border-[#1F2C42] focus:border-[#00E599] focus:ring-1 focus:ring-[#00E599] rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-0.5">
                <input
                  type="checkbox"
                  id="termsCheck"
                  checked={regTerms}
                  onChange={(e) => setRegTerms(e.target.checked)}
                  className="rounded text-[#00E599] focus:ring-0"
                />
                <label htmlFor="termsCheck" className="text-[11px] text-slate-400">
                  I agree to the Terms of Service & Risk Disclosure notice
                </label>
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-[#00E599] hover:bg-[#00D48D] active:bg-[#00BF7E] text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-[#00E599]/20 transition-all cursor-pointer flex items-center justify-center gap-2 mt-1"
              >
                <span>{isLoading ? 'Creating Account...' : 'Create Account & Start Trading'}</span>
              </button>
            </form>
          </div>
        )}

        {/* 3. EMAIL VERIFICATION MODE */}
        {authMode === 'verify' && (
          <div className="flex flex-col gap-4 text-center">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">Verify Your Email</h2>
              <p className="text-xs text-slate-400 mt-1">
                We sent a 6-digit verification code to <strong>{currentUser?.email || regEmail}</strong>
              </p>
            </div>

            <form onSubmit={handleVerifySubmit} className="flex flex-col gap-3">
              <input
                type="text"
                maxLength={6}
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
                placeholder="123456"
                className="w-full text-center tracking-[0.5em] font-mono text-xl font-bold bg-slate-800 border border-slate-700 rounded-xl py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="button"
                onClick={() => setVerifyCode('123456')}
                className="text-[11px] text-blue-400 hover:underline"
              >
                Auto-fill sample test code (123456)
              </button>

              {errorMsg && (
                <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-xs">
                  {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs">
                  {successMsg}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-white text-xs shadow-md transition-all cursor-pointer mt-1"
              >
                Verify & Open Terminal
              </button>
            </form>
          </div>
        )}

        {/* 4. FORGOT PASSWORD MODE */}
        {authMode === 'forgot' && (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">Reset Password</h2>
              <p className="text-xs text-slate-400 mt-1">
                Enter your account email to receive recovery instructions
              </p>
            </div>

            {forgotStep === 'request' ? (
              <form onSubmit={handleForgotRequest} className="flex flex-col gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Email Address</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="trader@tradepro.io"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {errorMsg && (
                  <div className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-xs">
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-white text-xs shadow-md transition-all cursor-pointer"
                >
                  Send Recovery Link
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetSubmit} className="flex flex-col gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Reset Code</label>
                  <input
                    type="text"
                    required
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    placeholder="Enter code (or test code 1234)"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {errorMsg && (
                  <div className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-xs">
                    {errorMsg}
                  </div>
                )}
                {successMsg && (
                  <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs">
                    {successMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-white text-xs shadow-md transition-all cursor-pointer"
                >
                  Confirm New Password
                </button>
              </form>
            )}

            <button
              onClick={() => onSwitchMode('login')}
              className="text-xs text-slate-400 hover:text-white text-center pt-2"
            >
              Back to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
