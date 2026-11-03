import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TradingProvider, useTrading } from './context/TradingContext';
import { Navbar } from './components/layout/Navbar';
import { MarketTickerBar } from './components/landing/MarketTickerBar';
import { HeroSection } from './components/landing/HeroSection';
import { FeaturedMarkets } from './components/landing/FeaturedMarkets';
import { PlatformFeatures } from './components/landing/PlatformFeatures';
import { HowItWorks } from './components/landing/HowItWorks';
import { SecuritySection } from './components/landing/SecuritySection';
import { TestimonialsSection } from './components/landing/TestimonialsSection';
import { FaqSection } from './components/landing/FaqSection';
import { Footer } from './components/layout/Footer';
import { AuthModals } from './components/auth/AuthModals';
import { LegalModals } from './components/landing/LegalModals';
import { AppHeader } from './components/layout/AppHeader';
import { Sidebar } from './components/layout/Sidebar';
import { TradingTerminal } from './components/trading/TradingTerminal';
import { UserDashboard } from './components/dashboard/UserDashboard';
import { PortfolioPage } from './components/portfolio/PortfolioPage';
import { HistoryPage } from './components/history/HistoryPage';
import { MarketsPage } from './components/markets/MarketsPage';
import { DepositPage } from './components/banking/DepositPage';
import { WithdrawPage } from './components/banking/WithdrawPage';
import { SupportPage } from './components/support/SupportPage';
import { SettingsPage } from './components/settings/SettingsPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AccountActivationWaiting } from './components/dashboard/AccountActivationWaiting';
import { TradeResultBigModal } from './components/trading/TradeResultBigModal';
import { Asset } from './types';

function MainApp() {
  const { currentUser, isAuthenticated } = useAuth();
  const { setSelectedAsset } = useTrading();

  // Root view: 'landing' or 'workspace'
  const [viewMode, setViewMode] = useState<'landing' | 'workspace'>('landing');
  const [workspaceTab, setWorkspaceTab] = useState<string>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  // Modals state
  const [authModal, setAuthModal] = useState<'login' | 'register' | 'forgot' | 'verify' | null>(null);
  const [legalModal, setLegalModal] = useState<'terms' | 'privacy' | 'risk' | 'contact' | null>(null);

  const handleLaunchTerminal = () => {
    if (!isAuthenticated) {
      const authBox = document.getElementById('auth-box');
      if (authBox) {
        authBox.scrollIntoView({ behavior: 'smooth' });
      } else {
        setAuthModal('login');
      }
      return;
    }
    setViewMode('workspace');
    setWorkspaceTab('trade');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectAssetFromLanding = (asset: Asset) => {
    setSelectedAsset(asset);
    if (!isAuthenticated) {
      const authBox = document.getElementById('auth-box');
      if (authBox) {
        authBox.scrollIntoView({ behavior: 'smooth' });
      } else {
        setAuthModal('login');
      }
      return;
    }
    setViewMode('workspace');
    setWorkspaceTab('trade');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAdmin = () => {
    setViewMode('workspace');
    setWorkspaceTab('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {viewMode === 'landing' ? (
        /* PUBLIC LANDING PAGE */
        <div className="flex flex-col flex-1">
          <Navbar
            onOpenLogin={() => setAuthModal('login')}
            onOpenRegister={() => setAuthModal('register')}
            onGoToTerminal={handleLaunchTerminal}
            onOpenAdmin={handleOpenAdmin}
          />
          <MarketTickerBar />
          <main className="flex-1">
            <HeroSection
              onStartTrading={handleLaunchTerminal}
              onCreateAccount={() => setAuthModal('register')}
              isAuthenticated={isAuthenticated}
            />
            <FeaturedMarkets onSelectAsset={handleSelectAssetFromLanding} />
            <PlatformFeatures />
            <HowItWorks onStartTrading={handleLaunchTerminal} />
            <SecuritySection />
            <TestimonialsSection />
            <FaqSection />
          </main>
          <Footer
            onOpenLegal={(type) => setLegalModal(type)}
            onGoToTerminal={handleLaunchTerminal}
          />
        </div>
      ) : (
        /* LOGGED-IN WORKSPACE VIEW (Dashboard / Terminal / Markets / Portfolio / Banking / Support / Admin) */
        <div className="flex h-screen overflow-hidden bg-slate-950">
          {/* Sidebar */}
          <Sidebar
            currentTab={workspaceTab}
            onSelectTab={(tab) => setWorkspaceTab(tab)}
            onGoHome={() => setViewMode('landing')}
            mobileOpen={mobileSidebarOpen}
            onCloseMobile={() => setMobileSidebarOpen(false)}
          />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
            <AppHeader
              currentTab={workspaceTab}
              onNavigateTab={(tab) => setWorkspaceTab(tab)}
              onToggleSidebarMobile={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            />

            <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
              {currentUser?.role === 'user' && (currentUser.demoBalance || 0) <= 0 && workspaceTab !== 'deposit' ? (
                <AccountActivationWaiting onGoToDeposit={() => setWorkspaceTab('deposit')} />
              ) : (
                <>
                  {workspaceTab === 'dashboard' && (
                    <UserDashboard onNavigate={(tab) => setWorkspaceTab(tab)} />
                  )}
                  {workspaceTab === 'trade' && <TradingTerminal />}
                  {workspaceTab === 'markets' && (
                    <MarketsPage
                      onNavigateTrade={(asset) => {
                        setSelectedAsset(asset);
                        setWorkspaceTab('trade');
                      }}
                    />
                  )}
                  {workspaceTab === 'portfolio' && (
                    <PortfolioPage onNavigate={(tab) => setWorkspaceTab(tab)} />
                  )}
                  {workspaceTab === 'history' && <HistoryPage />}
                  {workspaceTab === 'deposit' && <DepositPage />}
                  {workspaceTab === 'withdraw' && <WithdrawPage />}
                  {workspaceTab === 'support' && <SupportPage />}
                  {workspaceTab === 'settings' && <SettingsPage />}
                  {workspaceTab === 'admin' && <AdminDashboard />}
                </>
              )}
            </main>
          </div>
        </div>
      )}

      {/* Global Big Win / Loss Celebration Show Modal */}
      <TradeResultBigModal />

      {/* Auth Modals */}
      <AuthModals
        authMode={authModal}
        onClose={() => setAuthModal(null)}
        onSwitchMode={(mode) => setAuthModal(mode)}
        onSuccessAuth={() => {
          setViewMode('workspace');
          setWorkspaceTab('dashboard');
        }}
      />

      {/* Legal & Contact Modals */}
      <LegalModals modalType={legalModal} onClose={() => setLegalModal(null)} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TradingProvider>
          <MainApp />
        </TradingProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
