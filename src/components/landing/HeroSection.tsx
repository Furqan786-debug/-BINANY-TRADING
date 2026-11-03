import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight, Shield, Activity, UserPlus, LogIn, Mail, Lock, User, AlertCircle, CheckCircle2, Sparkles, Eye, EyeOff } from 'lucide-react';

interface HeroSectionProps {
  onStartTrading: () => void;
  onCreateAccount: () => void;
  isAuthenticated: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartTrading,
  onCreateAccount,
  isAuthenticated,
}) => {
  const { currentUser, login, register } = useAuth();

  // Tabs: 'login' | 'register' (default is 'login' or 'register')
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    if (!name.trim() || !email.trim() || !password) {
      setAuthError('Please complete all registration fields.');
      return;
    }
    setLoading(true);
    const res = await register(name.trim(), email.trim(), password);
    setLoading(false);
    if (res.success) {
      setAuthSuccess('Account created successfully! Welcome to BINANY TRADING.');
    } else {
      setAuthError(res.message || 'Registration failed.');
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    if (!email.trim() || !password) {
      setAuthError('Please provide both email and password.');
      return;
    }
    setLoading(true);
    const res = await login(email.trim(), password);
    setLoading(false);
    if (res.success) {
      setAuthSuccess('Authenticated! Welcome back to BINANY TRADING.');
    } else {
      setAuthError(res.message || 'Login failed. Verify credentials.');
    }
  };

  return (
    <section className="relative pt-8 pb-20 px-6 lg:px-12 overflow-hidden">
      {/* Background radial gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-emerald-500/10 blur-[140px] pointer-events-none -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Top Kicker Label */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-slate-300 text-xs font-medium mb-5 backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>BINANY TRADING · Multi-Asset Institutional Platform</span>
          <span className="text-slate-600">·</span>
          <span className="text-[#00E599] font-bold font-mono">Real-Time Market Execution</span>
        </div>

        {/* Headline: "Trade Smarter. Stay Ahead." */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl leading-[1.1] mb-4">
          Trade Smarter.{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">
            Stay Ahead.
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed mb-8">
          Sign up or log in to your account below to access global currencies, cryptocurrencies, and equities on high-frequency institutional candlestick charts.
        </p>

        {/* Visually exact Login/Sign Up Box matching the user screenshot */}
        {!currentUser && (
          <div id="auth-box" className="w-full max-w-sm sm:max-w-md mx-auto mb-14 text-center scroll-mt-24">
            {/* Top Logo Badge: Green bordered rounded square with 'B' */}
            <div className="w-16 h-16 rounded-2xl bg-[#0B1320] border-2 border-[#00E599] flex items-center justify-center shadow-lg shadow-[#00E599]/20 mx-auto transition-transform hover:scale-105">
              <span className="text-3xl font-black text-[#00E599]">B</span>
            </div>

            {/* Platform Title & Subtitle */}
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-3.5 mb-1 tracking-tight">
              BINANY TRADING
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              Global Financial Trading Platform
            </p>
            <div className="inline-flex items-center justify-center gap-2 mt-2.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] sm:text-xs font-semibold text-[#00E599]">
              <span className="w-2 h-2 rounded-full bg-[#00E599] animate-pulse" />
              <span>Centralized Real-Time Backend Active</span>
            </div>

            {/* Segmented Switcher Pill: [ Login ] [ Sign Up ] */}
            <div className="w-full p-1 rounded-2xl bg-[#111827] border border-[#1F2C42] flex items-center gap-1 mt-6 mb-4">
              <button
                type="button"
                onClick={() => {
                  setAuthTab('login');
                  setAuthError('');
                  setAuthSuccess('');
                }}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                  authTab === 'login'
                    ? 'bg-[#00E599] text-slate-950 font-black shadow-md shadow-[#00E599]/20'
                    : 'text-slate-400 hover:text-white bg-transparent'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthTab('register');
                  setAuthError('');
                  setAuthSuccess('');
                }}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                  authTab === 'register'
                    ? 'bg-[#00E599] text-slate-950 font-black shadow-md shadow-[#00E599]/20'
                    : 'text-slate-400 hover:text-white bg-transparent'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Card Container */}
            <div className="w-full p-6 sm:p-7 rounded-3xl bg-[#101726] border border-[#1F2C42] shadow-2xl text-left">
              {/* Card Header */}
              <div className="flex items-center gap-2.5 mb-5 text-white font-bold text-base">
                <div className="w-7 h-7 rounded-full bg-[#00E599]/20 text-[#00E599] flex items-center justify-center">
                  <User className="w-4 h-4 text-[#00E599]" />
                </div>
                <span>{authTab === 'login' ? 'Trader Sign In' : 'Create Trader Account'}</span>
              </div>

              {/* Login Form */}
              {authTab === 'login' && (
                <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                      Username or Email
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="trader_john"
                        className="w-full bg-[#0A0F1A] border border-[#1F2C42] focus:border-[#00E599] focus:ring-1 focus:ring-[#00E599] rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#0A0F1A] border border-[#1F2C42] focus:border-[#00E599] focus:ring-1 focus:ring-[#00E599] rounded-xl pl-10 pr-11 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 cursor-pointer"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-[#00E599] hover:bg-[#00D48D] active:bg-[#00BF7E] text-slate-950 font-black text-sm sm:text-base shadow-lg shadow-[#00E599]/20 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
                  >
                    <span>{loading ? 'Verifying...' : 'Log In to Trading'}</span>
                  </button>
                </form>
              )}

              {/* Sign Up Form */}
              {authTab === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                      Full Name / Username
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="trader_john"
                        className="w-full bg-[#0A0F1A] border border-[#1F2C42] focus:border-[#00E599] focus:ring-1 focus:ring-[#00E599] rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@tradepro.io"
                        className="w-full bg-[#0A0F1A] border border-[#1F2C42] focus:border-[#00E599] focus:ring-1 focus:ring-[#00E599] rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#0A0F1A] border border-[#1F2C42] focus:border-[#00E599] focus:ring-1 focus:ring-[#00E599] rounded-xl pl-10 pr-11 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-[#00E599] hover:bg-[#00D48D] active:bg-[#00BF7E] text-slate-950 font-black text-sm sm:text-base shadow-lg shadow-[#00E599]/20 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
                  >
                    <span>{loading ? 'Creating Account...' : 'Create Account & Start Trading'}</span>
                  </button>
                </form>
              )}

              {/* Feedback Alerts */}
              {authError && (
                <div className="flex items-center gap-2 p-3 mt-4 bg-rose-500/10 border border-rose-500/25 rounded-xl text-rose-400 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}
              {authSuccess && (
                <div className="flex items-center gap-2 p-3 mt-4 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-emerald-400 text-xs">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{authSuccess}</span>
                </div>
              )}

              {/* Bottom Quick Switch & Demo Helpers */}
              <div className="mt-5 pt-4 border-t border-[#1E293B] flex flex-col gap-3 text-xs text-center">
                <div className="text-slate-400">
                  {authTab === 'login' ? (
                    <span>
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setAuthTab('register');
                          setAuthError('');
                        }}
                        className="text-[#00E599] font-bold hover:underline cursor-pointer"
                      >
                        Sign Up Now
                      </button>
                    </span>
                  ) : (
                    <span>
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setAuthTab('login');
                          setAuthError('');
                        }}
                        className="text-[#00E599] font-bold hover:underline cursor-pointer"
                      >
                        Log In Here
                      </button>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Authenticated State Display */}
        {currentUser && (
          <div className="w-full max-w-lg mb-12 p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-md text-left">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                  />
                  <div>
                    <span className="font-bold text-white text-sm block">{currentUser.name}</span>
                    <span className="text-xs text-slate-400 font-mono">{currentUser.email} · ID: {currentUser.id}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Balance</span>
                  <span className="text-sm font-bold font-mono text-emerald-400">
                    ${currentUser.demoBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <button
                onClick={onStartTrading}
                className="w-full py-3.5 rounded-xl bg-[#00E599] hover:bg-[#00D48D] active:bg-[#00BF7E] text-slate-950 font-black text-sm shadow-lg shadow-[#00E599]/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Activity className="w-4 h-4" />
                <span>Start Trading on BINANY TRADING</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Marquee Visual Hero Card */}
        <div className="w-full max-w-5xl relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 group">
          <img
            src="/src/assets/images/tradepro_hero_terminal_1793625121092.jpg"
            alt="BINANY TRADING Terminal Interface"
            className="w-full h-auto max-h-[560px] object-cover transition-transform duration-700 group-hover:scale-[1.01]"
            referrerPolicy="no-referrer"
          />
          {/* Subtle gradient overlay at bottom for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

          {/* Floating Live Badge inside image */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-700/60 backdrop-blur-md text-xs">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
              <div className="text-left font-sans">
                <span className="font-bold text-white block">BINANY TRADING Matching Engine</span>
                <span className="text-[11px] text-slate-400">Order latency &lt;85ms · Ultra-low Slippage</span>
              </div>
            </div>
            <button
              onClick={onStartTrading}
              className="px-4 py-2 rounded-lg bg-[#00E599] hover:bg-[#00D48D] text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              Start Trading
            </button>
          </div>
        </div>

        {/* Quantitative Proof Strip */}
        <div className="w-full max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 text-left">
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
            <span className="text-2xl font-black font-mono text-white block">100+</span>
            <span className="text-xs text-slate-400 mt-1 block">Global Tradable Markets</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
            <span className="text-2xl font-black font-mono text-emerald-400 block">&lt;85ms</span>
            <span className="text-xs text-slate-400 mt-1 block">Order Matching Engine</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
            <span className="text-2xl font-black font-mono text-blue-400 block">500x</span>
            <span className="text-xs text-slate-400 mt-1 block">Max Leverage Multiplier</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
            <span className="text-2xl font-black font-mono text-purple-400 block">24/7</span>
            <span className="text-xs text-slate-400 mt-1 block">Instant Gateway Liquidity</span>
          </div>
        </div>
      </div>
    </section>
  );
};
