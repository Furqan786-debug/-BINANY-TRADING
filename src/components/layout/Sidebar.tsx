import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Activity,
  TrendingUp,
  PieChart,
  History,
  ArrowDownLeft,
  ArrowUpRight,
  LifeBuoy,
  Settings,
  Shield,
  Home,
  LogOut,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onGoHome: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onGoHome,
  mobileOpen = false,
  onCloseMobile,
}) => {
  const { currentUser, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'trade', label: 'Trade Terminal', icon: Activity, badge: 'Live' },
    { id: 'markets', label: 'Markets', icon: TrendingUp },
    { id: 'portfolio', label: 'Portfolio', icon: PieChart },
    { id: 'history', label: 'History', icon: History },
    { id: 'deposit', label: 'Deposit Funds', icon: ArrowDownLeft },
    { id: 'withdraw', label: 'Withdraw (Draw)', icon: ArrowUpRight },
    { id: 'support', label: 'Support', icon: LifeBuoy },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (tabId: string) => {
    onSelectTab(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-200 dark:border-slate-800/80 flex flex-col transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800/80">
          <button
            onClick={onGoHome}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 shadow-sm font-black text-sm">
              BT
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-white block">
                BINANY TRADING
              </span>
              <span className="text-[10px] text-slate-500 font-mono block -mt-0.5">
                Institutional Terminal
              </span>
            </div>
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1 mb-1">
            Trading Platform
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                    isActive ? 'bg-blue-700 text-white' : 'bg-emerald-500/15 text-emerald-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* MRG company Section */}
          <div className="mt-4 pt-3 border-t border-slate-800">
            <div className="text-[10px] font-bold uppercase tracking-wider text-purple-400 px-3 py-1 mb-1 flex items-center justify-between">
              <span>MRG company</span>
              <span className="text-[9px] font-mono text-purple-400/80 bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-800/50">
                Portal
              </span>
            </div>
            <button
              onClick={() => handleNavClick('admin')}
              className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                currentTab === 'admin'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-purple-300 hover:text-white hover:bg-purple-950/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-purple-400" />
                <span className="font-bold">MRG company</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>
          </div>
        </nav>

        {/* Footer actions */}
        <div className="p-3 border-t border-slate-800 flex flex-col gap-1">
          <button
            onClick={onGoHome}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <Home className="w-4 h-4 text-slate-500" />
            <span>Public Home</span>
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
