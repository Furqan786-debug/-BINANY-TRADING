import React, { useState } from 'react';
import { useAuth, MRG_ADMIN_PASSWORD } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Activity, Shield, UserPlus, LogIn, Lock, X, LogOut } from 'lucide-react';

interface NavbarProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onGoToTerminal: () => void;
  onOpenAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenLogin,
  onOpenRegister,
  onGoToTerminal,
  onOpenAdmin,
}) => {
  const { currentUser, logout, adminLoginWithPassword } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // MRG company modal state
  const [showAdminPasswordModal, setShowAdminPasswordModal] = useState(false);
  const [adminPassInput, setAdminPassInput] = useState('');
  const [adminError, setAdminError] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    if (!adminPassInput.trim()) {
      setAdminError('Please enter the MRG company admin password.');
      return;
    }
    setAdminLoading(true);
    const res = await adminLoginWithPassword(adminPassInput.trim());
    setAdminLoading(false);
    if (res.success) {
      setShowAdminPasswordModal(false);
      setAdminPassInput('');
      if (onOpenAdmin) {
        onOpenAdmin();
      } else {
        onGoToTerminal();
      }
    } else {
      setAdminError(res.message || 'Incorrect password for MRG company. Access denied.');
    }
  };

  const handleAdminClick = () => {
    if (currentUser?.role === 'admin') {
      if (onOpenAdmin) onOpenAdmin();
      else onGoToTerminal();
    } else {
      setShowAdminPasswordModal(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 flex items-center justify-between gap-6 px-4 lg:px-12 py-3.5 bg-slate-950/85 dark:bg-slate-950/90 border-b border-slate-800/80 backdrop-blur-md">
        {/* Zone 1: Brand wordmark in display face */}
        <a href="#" className="flex items-center gap-2.5 text-lg font-black tracking-tight text-white whitespace-nowrap shrink-0 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/20 font-black text-sm">
            BT
          </div>
          <span>BINANY TRADING</span>
        </a>

        {/* Zone 2: Navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
          <a href="#markets" className="hover:text-blue-400 transition-colors whitespace-nowrap shrink-0">
            Markets
          </a>
          <a href="#features" className="hover:text-blue-400 transition-colors whitespace-nowrap shrink-0">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-blue-400 transition-colors whitespace-nowrap shrink-0">
            How It Works
          </a>
          <a href="#security" className="hover:text-blue-400 transition-colors whitespace-nowrap shrink-0">
            Security
          </a>
          <a href="#faq" className="hover:text-blue-400 transition-colors whitespace-nowrap shrink-0">
            FAQ
          </a>
        </nav>

        {/* Zone 3: Authentication & Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* MRG company Portal Button */}
          <button
            type="button"
            onClick={handleAdminClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 hover:text-white border border-purple-800/60 text-xs font-bold transition-all shadow-xs cursor-pointer whitespace-nowrap"
            title="Access MRG company Portal"
          >
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            <span>MRG company</span>
          </button>

          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {currentUser ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <span className="font-bold text-white">{currentUser.name}</span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">
                  ${currentUser.demoBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <button
                onClick={onGoToTerminal}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#00E599] hover:bg-[#00D48D] text-slate-950 text-xs font-black transition-all shadow-md shadow-[#00E599]/20 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Activity className="w-4 h-4" />
                <span>Open Terminal</span>
              </button>
              <button
                type="button"
                onClick={logout}
                title="Log out"
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* Log In Button */}
              <button
                type="button"
                onClick={onOpenLogin}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-900/90 border border-slate-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-400" />
                <span>Log In</span>
              </button>

              {/* Sign Up Button */}
              <button
                type="button"
                onClick={onOpenRegister}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00E599] hover:bg-[#00D48D] text-slate-950 text-xs font-black transition-all shadow-md shadow-[#00E599]/25 cursor-pointer whitespace-nowrap shrink-0"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* MRG company Admin Password Verification Modal */}
      {showAdminPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-purple-500/40 p-6 shadow-2xl relative text-left">
            <button
              type="button"
              onClick={() => {
                setShowAdminPasswordModal(false);
                setAdminError('');
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base">MRG company</h3>
                <span className="text-[11px] text-purple-400 font-mono">Master Admin Console</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Please enter the MRG company admin security password to access live trade monitoring, user funding, and system parameters.
            </p>

            <form onSubmit={handleAdminSubmit} className="flex flex-col gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Admin Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={adminPassInput}
                    onChange={(e) => setAdminPassInput(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                  />
                </div>
              </div>

              {adminError && (
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
                  {adminError}
                </div>
              )}

              <button
                type="submit"
                disabled={adminLoading}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 mt-1"
              >
                <span>{adminLoading ? 'Verifying...' : 'Unlock MRG company Portal'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
