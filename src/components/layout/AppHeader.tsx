import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTrading } from '../../context/TradingContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Bell,
  Sun,
  Moon,
  ChevronDown,
  LogOut,
  User,
  Shield,
  RotateCcw,
  Sparkles,
  Menu
} from 'lucide-react';
import { NotificationCenter } from '../notifications/NotificationCenter';

interface AppHeaderProps {
  currentTab: string;
  onNavigateTab: (tab: string) => void;
  onToggleSidebarMobile?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ currentTab, onNavigateTab, onToggleSidebarMobile }) => {
  const { currentUser, logout, loginAs } = useAuth();
  const { totalPortfolioValue, notifications, resetDemoBalance } = useTrading();
  const { theme, toggleTheme } = useTheme();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const tabLabels: Record<string, string> = {
    dashboard: 'Dashboard Overview',
    trade: 'Trading Terminal',
    markets: 'Live Market Watch',
    portfolio: 'Portfolio & Risk Analytics',
    history: 'Trading History & Statements',
    deposit: 'Deposit Funds',
    withdraw: 'Withdraw (Draw)',
    support: 'Customer Support Desk',
    settings: 'Profile & Security',
    admin: 'MRG company',
  };

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-4 px-4 sm:px-6 py-3 bg-slate-950/90 dark:bg-slate-950/95 border-b border-slate-200 dark:border-slate-800/80 backdrop-blur-md">
      {/* Zone 1: Mobile Toggle & Contextual Breadcrumb trail */}
      <div className="flex items-center gap-3">
        {onToggleSidebarMobile && (
          <button
            onClick={onToggleSidebarMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center gap-2 text-xs font-medium">
          <span className="text-slate-500 font-bold tracking-tight">BINANY TRADING</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-900 dark:text-slate-200 font-semibold truncate max-w-[140px] sm:max-w-none">
            {tabLabels[currentTab] || currentTab}
          </span>
        </div>
      </div>

      {/* Zone 2: Account Balance Badge & Role Quick Switcher */}
      <div className="hidden md:flex items-center gap-3 text-xs">
        {/* Balance Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
          <span className="text-[10px] uppercase font-mono font-bold text-blue-400">BALANCE</span>
          <span className="font-mono tabular-nums font-bold text-emerald-400">
            ${(currentUser?.demoBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <button
            onClick={resetDemoBalance}
            title="Reset balance"
            className="text-slate-500 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>

        {/* Role Switcher */}
        <div className="flex items-center p-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono">
          <button
            onClick={() => {
              loginAs('trader');
              onNavigateTab('dashboard');
            }}
            className={`px-2 py-1 rounded transition-colors ${
              currentUser?.role === 'user'
                ? 'bg-blue-600 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Trader
          </button>
          <button
            onClick={() => {
              onNavigateTab('admin');
            }}
            className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
              currentUser?.role === 'admin'
                ? 'bg-purple-600 text-white font-bold'
                : 'text-purple-400 hover:text-white'
            }`}
          >
            <Shield className="w-3 h-3" />
            <span>MRG company</span>
          </button>
        </div>
      </div>

      {/* Zone 3: Notification Bell, Theme Switch, and User Profile menu */}
      <div className="flex items-center gap-2.5 relative">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors relative cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-slate-950" />
            )}
          </button>

          <NotificationCenter
            isOpen={notifOpen}
            onClose={() => setNotifOpen(false)}
            onNavigateTab={onNavigateTab}
          />
        </div>

        {/* User Profile Pill & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-800"
          >
            <img
              src={currentUser?.avatarUrl || '/src/assets/images/avatar_trader_sarah_1793624992270.jpg'}
              alt={currentUser?.name}
              className="w-7 h-7 rounded-lg object-cover"
              referrerPolicy="no-referrer"
            />
            <span className="hidden sm:inline font-bold text-xs text-slate-200 max-w-[100px] truncate">
              {currentUser?.name || 'Trader'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-11 mt-1 w-56 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl z-50 py-2 text-xs">
              <div className="px-3 py-2 border-b border-slate-800">
                <span className="font-bold text-slate-100 block">{currentUser?.name}</span>
                <span className="text-[11px] text-slate-400 font-mono block truncate">{currentUser?.email}</span>
                <span className="text-[10px] font-mono text-blue-400 uppercase mt-0.5 block">
                  ID: {currentUser?.id} · {currentUser?.role}
                </span>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    onNavigateTab('settings');
                    setUserMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Profile & Security</span>
                </button>
                {currentUser?.role === 'admin' && (
                  <button
                    onClick={() => {
                      onNavigateTab('admin');
                      setUserMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-purple-400 hover:bg-slate-800 transition-colors"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Admin Console</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    resetDemoBalance();
                    setUserMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-amber-400 hover:bg-slate-800 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Demo Funds ($10k)</span>
                </button>
              </div>

              <div className="pt-1 border-t border-slate-800">
                <button
                  onClick={() => {
                    logout();
                    setUserMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-rose-400 hover:bg-slate-800 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
