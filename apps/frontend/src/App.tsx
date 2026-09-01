import React, { useState, useEffect } from 'react';
import { MultiTierSwitcher } from './components/navigation/MultiTierSwitcher';
import { PosTerminal } from './components/pos/PosTerminal';
import { FinancialStatementsViewer } from './components/finance/FinancialStatementsViewer';
import { SwaggerApiViewer } from './components/swagger/SwaggerApiViewer';
import { DatabaseManagerView } from './components/database/DatabaseManagerView';
import { DocumentationViewer } from './components/docs/DocumentationViewer';
import { OwnerAnalyticsDashboard } from './components/owner/OwnerAnalyticsDashboard';
import { SuperUserDashboard } from './components/superuser/SuperUserDashboard';
import { BrandAdminDashboard } from './components/admin/BrandAdminDashboard';
import { CustomerManagementView } from './components/crm/CustomerManagementView';
import { InventoryManagementView } from './components/inventory/InventoryManagementView';
import { StockOpnameView } from './components/inventory/StockOpnameView';
import { RealtimeTeamChatView } from './components/chat/RealtimeTeamChatView';
import { CustomerReviewPage } from './components/reviews/CustomerReviewPage';
import { BenchmarkViewer } from './components/benchmark/BenchmarkViewer';
import { BugTicketingCenter } from './components/tickets/BugTicketingCenter';
import { SoftDeleteManager } from './components/trash/SoftDeleteManager';
import { OnboardingWizardModal } from './components/onboarding/OnboardingWizardModal';
import { InvestorPitchDeckModal } from './components/presentation/InvestorPitchDeckModal';
import { PublicLandingPage } from './components/landing/PublicLandingPage';
import { FaqView } from './components/public/FaqView';
import { TermsAndConditionsView } from './components/public/TermsAndConditionsView';
import { AboutUsView } from './components/public/AboutUsView';
import { AuthPortal } from './components/auth/AuthPortal';
import { ToastContainer } from './components/atoms/ToastContainer';
import { PageTransitionPreloader } from './components/atoms/PageTransitionPreloader';
import { useTenantStore } from './stores/useTenantStore';
import { useThemeStore } from './stores/useThemeStore';
import { useAuthStore } from './stores/useAuthStore';
import { useOnboardingStore } from './stores/useOnboardingStore';
import { useModuleLicenseStore } from './stores/useModuleLicenseStore';
import { toast } from './stores/useToastStore';

export default function App() {
  const { isAuthenticated, currentUser, logout } = useAuthStore();
  const [isLandingPageMode, setIsLandingPageMode] = useState(false);
  const [activeModule, setActiveModule] = useState<
    | 'pos'
    | 'crm'
    | 'chat'
    | 'inventory'
    | 'opname'
    | 'hr'
    | 'audit'
    | 'owner'
    | 'superuser'
    | 'brand_admin'
    | 'reviews'
    | 'benchmark'
    | 'tickets'
    | 'trash'
    | 'swagger'
    | 'database'
    | 'docs'
    | 'finance'
    | 'faq'
    | 'terms'
    | 'about'
  >('owner');

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isInvestorDeckOpen, setIsInvestorDeckOpen] = useState(false);

  const { currentTenant, setHierarchicalData } = useTenantStore();
  const { theme, setTheme } = useThemeStore();
  const { modules, subscriptionTier, remainingMonths, setSubscriptionTier } = useModuleLicenseStore();
  const { openOnboarding } = useOnboardingStore();

  const [isGuestReviewMode, setIsGuestReviewMode] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname.toLowerCase();
      if (p === '/review') setIsGuestReviewMode(true);
      else if (p === '/faq') setActiveModule('faq');
      else if (p === '/terms' || p === '/term&cond' || p === '/terms-and-conditions') setActiveModule('terms');
      else if (p === '/about' || p === '/about-us') setActiveModule('about');
    }
  }, []);

  useEffect(() => {
    setTheme(theme);

    if (!currentTenant) {
      setHierarchicalData({
        tenant: {
          id: 't-01',
          name: 'PT Multi Industri Nusantara',
          subdomain: 'nusantara',
          legalEntityType: 'PT',
          status: 'active',
          featureFlags: { pos: true, inventory: true, finance: true, hr: true, audit: true },
          onboarding_completed: true,
        },
        brands: [
          {
            id: 'b-01',
            tenantId: 't-01',
            name: 'Kopi Nusantara Roastery',
            code: 'KNR',
            industryType: 'fnb',
            businessSector: 'fnb',
            tagline: 'Cita Rasa Autentik Nusantara, Disajikan dengan Sepenuh Hati',
            description: 'Kopi Nusantara Roastery adalah kafe dan roastery artisanal yang menyajikan racikan kopi single origin terbaik nusantara dengan atmosfer modern dan elegan.',
            logoUrl: 'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?w=180&auto=format&fit=crop&q=80',
            bannerUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&auto=format&fit=crop&q=80',
            socialLinks: { instagram: '@kopinusantara.id', tiktok: '@kopinusantara', whatsapp: '081299001122', website: 'https://kopinusantara.id' },
            status: 'active',
          },
          {
            id: 'b-02',
            tenantId: 't-01',
            name: 'Nusantara Retail Mart',
            code: 'NRM',
            industryType: 'retail',
            businessSector: 'retail',
            tagline: 'Belanja Lengkap, Cepat & Hemat Dekat Anda',
            description: 'Minimarket ritel modern yang menyediakan kebutuhan pokok keluarga.',
            logoUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=180&auto=format&fit=crop&q=80',
            bannerUrl: 'https://images.unsplash.com/photo-1534723452868-45d140f7d591?w=1200&auto=format&fit=crop&q=80',
            status: 'active',
          },
        ],
        branches: [
          { id: 'br-01', tenantId: 't-01', brandId: 'b-01', name: 'Outlet Grand Indonesia', code: 'GI-01', branchType: 'store', geofenceRadiusMeters: 100, address: 'West Mall Lt 3A', city: 'Jakarta Pusat', phone: '021-23580001', operatingHours: '08:00 - 22:00 WIB', isActive: true },
          { id: 'br-02', tenantId: 't-01', brandId: 'b-01', name: 'Outlet Senopati', code: 'SNP-02', branchType: 'store', geofenceRadiusMeters: 100, address: 'Jl. Senopati No. 45', city: 'Jakarta Selatan', phone: '021-7201234', operatingHours: '07:00 - 23:00 WIB', isActive: true },
          { id: 'br-03', tenantId: 't-01', brandId: 'b-02', name: 'Store Kelapa Gading', code: 'KG-01', branchType: 'store', geofenceRadiusMeters: 100, address: 'Mall Kelapa Gading 3', city: 'Jakarta Utara', phone: '021-4585123', operatingHours: '09:00 - 22:00 WIB', isActive: true },
        ],
        warehouses: [
          { id: 'wh-01', tenantId: 't-01', branchId: 'br-01', name: 'Gudang Utama Raw Material', code: 'WH-RM-01', isPrimary: true, costingMethod: 'moving_average' },
          { id: 'wh-02', tenantId: 't-01', branchId: 'br-01', name: 'Gudang Packaging & Supplies', code: 'WH-PKG-02', isPrimary: false, costingMethod: 'moving_average' },
          { id: 'wh-03', tenantId: 't-01', branchId: 'br-02', name: 'Gudang Outlet Senopati', code: 'WH-SNP-01', isPrimary: true, costingMethod: 'fifo' },
        ],
      });
    }
  }, [theme, currentTenant]);

  if (isGuestReviewMode) {
    return (
      <>
        <ToastContainer />
        <CustomerReviewPage />
      </>
    );
  }

  // PUBLIC LANDING PAGE AT "/"
  if (isLandingPageMode) {
    return (
      <>
        <ToastContainer />
        <PublicLandingPage onEnterApp={() => setIsLandingPageMode(false)} />
      </>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <ToastContainer />
        <div className="relative">
          <div className="absolute top-4 right-4 z-50">
            <button
              type="button"
              onClick={() => setIsLandingPageMode(true)}
              className="bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700 px-4 py-2 rounded-2xl text-xs font-bold transition-all"
            >
              🌐 Lihat Landing Page & Harga
            </button>
          </div>
          <AuthPortal />
        </div>
      </>
    );
  }

  const isModuleLocked = (code: string) => {
    const mod = modules.find((m) => m.code === code);
    return mod ? !mod.isUnlocked : false;
  };

  const handleSelectModule = (mod: typeof activeModule) => {
    setActiveModule(mod);
    setIsMobileSidebarOpen(false);
  };

  const userRole = currentUser.role;
  const isSuperUser = userRole === 'super_user';

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 dark:bg-slate-950 font-sans transition-colors duration-200">
      <PageTransitionPreloader activeModuleKey={activeModule} />
      <ToastContainer />
      <OnboardingWizardModal />

      {isInvestorDeckOpen && (
        <InvestorPitchDeckModal onClose={() => setIsInvestorDeckOpen(false)} />
      )}

      {/* TOPBAR NAVIGATION */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 flex items-center justify-between z-30 shrink-0 shadow-sm">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            ☰
          </button>
          <MultiTierSwitcher />
        </div>

        {/* Top bar right items */}
        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            onClick={() => setIsLandingPageMode(true)}
            className="hidden sm:flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700"
            title="Buka Landing Page Publik & Katalog Harga"
          >
            <span>🌐</span>
            <span>Landing Page</span>
          </button>

          <button
            type="button"
            onClick={() => openOnboarding()}
            className="hidden sm:flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700"
            title="Setup Ulang Identitas Bisnis"
          >
            <span>🧙‍♂️</span>
            <span>Setup Bisnis</span>
          </button>

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:scale-105 transition-all text-xs"
            title="Ubah Tema"
          >
            {theme === 'dark' ? '☀️ Terang' : '🌙 Gelap'}
          </button>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block" />

          {/* User Profile Chip */}
          <div className="flex items-center space-x-2 pl-1">
            <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="hidden sm:block text-left">
              <div className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate max-w-[120px]">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-red-600 dark:text-red-400 font-mono capitalize">
                {currentUser.role.replace('_', ' ')}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* SIDEBAR NAVIGATION */}
        <aside
          className={`
            fixed md:static inset-y-0 left-0 z-40
            ${isSidebarCollapsed ? 'w-16' : 'w-64'}
            bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
            transition-all duration-300 ease-in-out flex flex-col justify-between p-3
            ${isMobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
          `}
        >
          <div className="space-y-4 overflow-y-auto pr-1">
            {/* Collapse Toggle */}
            <div className="hidden md:flex justify-end">
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                title={isSidebarCollapsed ? 'Buka Sidebar' : 'Perkecil Sidebar'}
              >
                {isSidebarCollapsed ? '➔' : '⬅'}
              </button>
            </div>

            {/* 1. EXECUTIVE SUITE GROUP */}
            {(userRole === 'owner' || isSuperUser || (userRole as string) === 'general_manager' || (userRole as string) === 'branch_manager' || userRole === 'admin_brand') && (
              <div className="space-y-1">
                {!isSidebarCollapsed && (
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    👑 Executive Suite
                  </div>
                )}

                {isSuperUser && (
                  <button
                    onClick={() => handleSelectModule('superuser')}
                    className={`w-full flex items-center ${
                      isSidebarCollapsed ? 'justify-center px-2' : 'space-x-2.5 px-3'
                    } py-2 rounded-xl text-xs font-semibold transition-all ${
                      activeModule === 'superuser'
                        ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    title="Platform Director & SaaS Licensing"
                  >
                    <span className="text-base">⚡</span>
                    {!isSidebarCollapsed && <span>Super User Director</span>}
                  </button>
                )}

                {(userRole === 'owner' || (userRole as string) === 'general_manager') && (
                  <button
                    onClick={() => handleSelectModule('owner')}
                    className={`w-full flex items-center ${
                      isSidebarCollapsed ? 'justify-center px-2' : 'space-x-2.5 px-3'
                    } py-2 rounded-xl text-xs font-semibold transition-all ${
                      activeModule === 'owner'
                        ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    title="Owner Dashboard & AI Advisor"
                  >
                    <span className="text-base">👑</span>
                    {!isSidebarCollapsed && <span>Owner Dashboard</span>}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsInvestorDeckOpen(true)}
                  className={`w-full flex items-center ${
                    isSidebarCollapsed ? 'justify-center px-2' : 'justify-between px-3'
                  } py-2 rounded-xl text-xs font-semibold transition-all bg-gradient-to-r from-red-600/10 via-rose-600/10 to-transparent hover:from-red-600/20 hover:to-rose-600/20 text-red-600 dark:text-red-400 border border-red-500/20`}
                  title="Slide Presentasi Investor PowerPoint"
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="text-base">🖥️</span>
                    {!isSidebarCollapsed && <span>Investor Slide Deck</span>}
                  </div>
                  {!isSidebarCollapsed && (
                    <span className="text-[9px] bg-red-600 text-white font-mono px-1.5 py-0.2 rounded-full font-bold">
                      PITCH
                    </span>
                  )}
                </button>

                <button
                  onClick={() => handleSelectModule('brand_admin')}
                  className={`w-full flex items-center ${
                    isSidebarCollapsed ? 'justify-center px-2' : 'space-x-2.5 px-3'
                  } py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeModule === 'brand_admin'
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title="Brand & Staff Admin"
                >
                  <span className="text-base">🏢</span>
                  {!isSidebarCollapsed && <span>Brand & Staff Admin</span>}
                </button>
              </div>
            )}

            {/* 2. OPERATIONAL MODULES (HIDDEN FOR SUPER USER) */}
            {!isSuperUser && (
              <div className="space-y-1 pt-1">
                {!isSidebarCollapsed && (
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    🛒 Operasional & Toko
                  </div>
                )}

                <button
                  onClick={() => handleSelectModule('pos')}
                  className={`w-full flex items-center ${
                    isSidebarCollapsed ? 'justify-center px-2' : 'justify-between px-3'
                  } py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeModule === 'pos'
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title="Kasir POS & Dapur"
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="text-base">🛒</span>
                    {!isSidebarCollapsed && <span>Kasir POS Terminal</span>}
                  </div>
                  {!isSidebarCollapsed && isModuleLocked('pos') && <span className="text-[10px]">🔒</span>}
                </button>

                <button
                  onClick={() => handleSelectModule('inventory')}
                  className={`w-full flex items-center ${
                    isSidebarCollapsed ? 'justify-center px-2' : 'justify-between px-3'
                  } py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeModule === 'inventory'
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title="Gudang, Stok & SCM"
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="text-base">📦</span>
                    {!isSidebarCollapsed && <span>Gudang & SCM</span>}
                  </div>
                  {!isSidebarCollapsed && isModuleLocked('inventory') && <span className="text-[10px]">🔒</span>}
                </button>

                <button
                  onClick={() => handleSelectModule('opname')}
                  className={`w-full flex items-center ${
                    isSidebarCollapsed ? 'justify-center px-2' : 'justify-between px-3'
                  } py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeModule === 'opname'
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title="Stok Opname Fisik Gudang"
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="text-base">📋</span>
                    {!isSidebarCollapsed && <span>Stok Opname</span>}
                  </div>
                  {!isSidebarCollapsed && (
                    <span className="text-[9px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono px-1.5 py-0.2 rounded-full font-bold">
                      AUDIT
                    </span>
                  )}
                </button>

                <button
                  onClick={() => handleSelectModule('crm')}
                  className={`w-full flex items-center ${
                    isSidebarCollapsed ? 'justify-center px-2' : 'justify-between px-3'
                  } py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeModule === 'crm'
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title="CRM & Loyalitas Member"
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="text-base">👥</span>
                    {!isSidebarCollapsed && <span>CRM & Member</span>}
                  </div>
                  {!isSidebarCollapsed && isModuleLocked('crm') && <span className="text-[10px]">🔒</span>}
                </button>

                {(userRole === 'owner' || (userRole as string) === 'general_manager' || (userRole as string) === 'branch_manager') && (
                  <button
                    onClick={() => handleSelectModule('finance')}
                    className={`w-full flex items-center ${
                      isSidebarCollapsed ? 'justify-center px-2' : 'justify-between px-3'
                    } py-2 rounded-xl text-xs font-semibold transition-all ${
                      activeModule === 'finance'
                        ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    title="Akuntansi & GL PSAK"
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="text-base">📊</span>
                      {!isSidebarCollapsed && <span>Akuntansi & GL</span>}
                    </div>
                    {!isSidebarCollapsed && isModuleLocked('finance') && <span className="text-[10px]">🔒</span>}
                  </button>
                )}
              </div>
            )}

            {/* 3. TEAM COLLABORATION GROUP */}
            <div className="space-y-1 pt-1">
              {!isSidebarCollapsed && (
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  💬 Kolaborasi Tim
                </div>
              )}

              <button
                onClick={() => handleSelectModule('chat')}
                className={`w-full flex items-center ${
                  isSidebarCollapsed ? 'justify-center px-2' : 'justify-between px-3'
                } py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeModule === 'chat'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title="Realtime Team Chat (Brand & Cabang)"
              >
                <div className="flex items-center space-x-2.5">
                  <span className="text-base">💬</span>
                  {!isSidebarCollapsed && <span>Realtime Team Chat</span>}
                </div>
                {!isSidebarCollapsed && (
                  <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-mono px-1.5 rounded font-bold">
                      LIVE
                    </span>
                  </div>
                )}
              </button>
            </div>

            {/* 4. R&D & ENGINEERING LABS */}
            <div className="space-y-1 pt-1">
              {!isSidebarCollapsed && (
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  🔬 R&D & Engineering Labs
                </div>
              )}

              <button
                onClick={() => handleSelectModule('benchmark')}
                className={`w-full flex items-center ${
                  isSidebarCollapsed ? 'justify-center px-2' : 'space-x-2.5 px-3'
                } py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeModule === 'benchmark'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title="Speed Benchmark & Stress Test"
              >
                <span className="text-base">🚀</span>
                {!isSidebarCollapsed && <span>Hardware Benchmark</span>}
              </button>

              <button
                onClick={() => handleSelectModule('docs')}
                className={`w-full flex items-center ${
                  isSidebarCollapsed ? 'justify-center px-2' : 'space-x-2.5 px-3'
                } py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeModule === 'docs'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title="Dokumentasi Modula"
              >
                <span className="text-base">📚</span>
                {!isSidebarCollapsed && <span>Dokumentasi Sistem</span>}
              </button>

              <button
                onClick={() => handleSelectModule('swagger')}
                className={`w-full flex items-center ${
                  isSidebarCollapsed ? 'justify-center px-2' : 'space-x-2.5 px-3'
                } py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeModule === 'swagger'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title="Swagger API Specification"
              >
                <span className="text-base">📑</span>
                {!isSidebarCollapsed && <span>Swagger API Specs</span>}
              </button>

              {/* DATABASE MANAGER - STRICTLY SUPER USER ONLY */}
              {isSuperUser && (
                <button
                  onClick={() => handleSelectModule('database')}
                  className={`w-full flex items-center ${
                    isSidebarCollapsed ? 'justify-center px-2' : 'justify-between px-3'
                  } py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeModule === 'database'
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title="Database Schema & Query Manager"
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="text-base">🗄️</span>
                    {!isSidebarCollapsed && <span>Database Manager</span>}
                  </div>
                  {!isSidebarCollapsed && (
                    <span className="text-[9px] bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-mono px-1.5 py-0.2 rounded font-bold">
                      SU
                    </span>
                  )}
                </button>
              )}

              <button
                onClick={() => handleSelectModule('tickets')}
                className={`w-full flex items-center ${
                  isSidebarCollapsed ? 'justify-center px-2' : 'space-x-2.5 px-3'
                } py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeModule === 'tickets'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title="Tiket Bug & Insiden"
              >
                <span className="text-base">🎫</span>
                {!isSidebarCollapsed && <span>Tiket Insiden</span>}
              </button>

              <button
                onClick={() => handleSelectModule('trash')}
                className={`w-full flex items-center ${
                  isSidebarCollapsed ? 'justify-center px-2' : 'space-x-2.5 px-3'
                } py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeModule === 'trash'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title="Soft-Delete & Trash"
              >
                <span className="text-base">🗑️</span>
                {!isSidebarCollapsed && <span>Soft-Delete Trash</span>}
              </button>
            </div>
          </div>

          {/* FOOTER & LOGOUT BAR */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
            {!isSidebarCollapsed && (
              <div className="bg-slate-100 dark:bg-slate-800/80 p-2 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  <span className="font-bold">TIER: {subscriptionTier.toUpperCase()}</span>
                  <span className="text-emerald-500 font-bold">{remainingMonths} Bln</span>
                </div>
                <div className="grid grid-cols-3 gap-1 text-[9px] font-bold">
                  {(['starter', 'business', 'enterprise'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setSubscriptionTier(t);
                        toast.success('Tier Diganti', `Simulasi Paket ${t.toUpperCase()}`);
                      }}
                      className={`py-1 rounded-lg capitalize transition-all ${
                        subscriptionTier === t
                          ? 'bg-red-600 text-white shadow-sm'
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SIDEBAR FOOTER LINKS (FAQ, TERMS, ABOUT, COPYRIGHT) */}
            {!isSidebarCollapsed && (
              <div className="px-1 py-1 space-y-1 text-[10px] font-medium text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/60 pt-2">
                <div className="flex justify-between items-center text-[10px]">
                  <button
                    onClick={() => handleSelectModule('faq')}
                    className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  >
                    ❓ FAQ
                  </button>
                  <span>•</span>
                  <button
                    onClick={() => handleSelectModule('terms')}
                    className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  >
                    📜 Syarat & Ketentuan
                  </button>
                  <span>•</span>
                  <button
                    onClick={() => handleSelectModule('about')}
                    className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  >
                    ℹ️ Tentang Kami
                  </button>
                </div>
                <div className="text-[9px] text-center text-slate-400 dark:text-slate-500 font-mono pt-1">
                  © 2026 Modula Enterprise. All rights reserved.
                </div>
              </div>
            )}

            <button
              onClick={() => {
                logout();
                toast.info('Berhasil Keluar', 'Sesi pengguna telah diakhiri.');
              }}
              className={`w-full flex items-center ${
                isSidebarCollapsed ? 'justify-center p-2' : 'justify-center space-x-2 p-2'
              } bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 rounded-xl text-xs font-bold transition-all border border-slate-200 dark:border-slate-700`}
              title="Keluar (Logout)"
            >
              <span>🚪</span>
              {!isSidebarCollapsed && <span>Keluar</span>}
            </button>
          </div>
        </aside>

        {/* 3. MAIN WORKSPACE */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 transition-colors">
          {activeModule === 'owner' && <OwnerAnalyticsDashboard />}
          {activeModule === 'brand_admin' && <BrandAdminDashboard />}
          {activeModule === 'superuser' && <SuperUserDashboard />}
          {activeModule === 'chat' && <RealtimeTeamChatView />}
          {activeModule === 'faq' && <FaqView onBackToHome={() => handleSelectModule('owner')} />}
          {activeModule === 'terms' && <TermsAndConditionsView onBackToHome={() => handleSelectModule('owner')} />}
          {activeModule === 'about' && <AboutUsView onBackToHome={() => handleSelectModule('owner')} />}
          {activeModule === 'crm' && (
            isModuleLocked('crm') ? (
              <div className="p-12 text-center space-y-4">
                <span className="text-5xl">🔒</span>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                  Modul CRM & Loyalitas Member Terkunci
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Hubungi Super User atau upgrade paket di menu <b>Super User & SaaS Licensing</b>.
                </p>
              </div>
            ) : (
              <CustomerManagementView />
            )
          )}
          {activeModule === 'inventory' && (
            isSuperUser ? (
              <div className="p-12 text-center space-y-4">
                <span className="text-5xl">🛡️</span>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                  Akses Gudang Operasional Terisolasi (Zero-Knowledge Privacy)
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Super User dibatasi dari manipulasi persediaan fisik cabang. Ajukan tiket inspeksi audit jika diperlukan.
                </p>
              </div>
            ) : isModuleLocked('inventory') ? (
              <div className="p-12 text-center space-y-4">
                <span className="text-5xl">🔒</span>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                  Modul Gudang & SCM Terkunci
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Buka kunci lisensi di menu <b>Super User & SaaS Licensing</b>.
                </p>
              </div>
            ) : (
              <InventoryManagementView />
            )
          )}
          {activeModule === 'opname' && (
            isSuperUser ? (
              <div className="p-12 text-center space-y-4">
                <span className="text-5xl">🛡️</span>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                  Akses Stok Opname Terisolasi
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Super User dibatasi dari audit fisik outlet demi integritas tenant isolation.
                </p>
              </div>
            ) : (
              <StockOpnameView />
            )
          )}
          {activeModule === 'benchmark' && <BenchmarkViewer />}
          {activeModule === 'tickets' && <BugTicketingCenter />}
          {activeModule === 'trash' && <SoftDeleteManager />}
          {activeModule === 'reviews' && <CustomerReviewPage />}
          {activeModule === 'pos' && (
            isSuperUser ? (
              <div className="p-12 text-center space-y-4">
                <span className="text-5xl">🛡️</span>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                  Akses Kasir POS Terisolasi (Zero-Knowledge Privacy)
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Super User tidak diperkenankan melakukan transaksi kasir toko. Login sebagai Kasir atau Owner untuk menggunakan POS Terminal.
                </p>
              </div>
            ) : isModuleLocked('pos') ? (
              <div className="p-12 text-center space-y-4">
                <span className="text-5xl">🔒</span>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                  Modul POS Enterprise Terkunci
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Buka kunci lisensi di menu <b>Super User & SaaS Licensing</b>.
                </p>
              </div>
            ) : (
              <PosTerminal />
            )
          )}
          {activeModule === 'finance' && (
            isModuleLocked('finance') ? (
              <div className="p-12 text-center space-y-4">
                <span className="text-5xl">🔒</span>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                  Modul Akuntansi & Buku Besar Terkunci
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Buka kunci lisensi di menu <b>Super User & SaaS Licensing</b> untuk mengakses laporan keuangan PSAK.
                </p>
              </div>
            ) : (
              <FinancialStatementsViewer />
            )
          )}
          {activeModule === 'docs' && <DocumentationViewer />}
          {activeModule === 'swagger' && <SwaggerApiViewer />}
          {activeModule === 'database' && <DatabaseManagerView />}
        </main>
      </div>
    </div>
  );
}
