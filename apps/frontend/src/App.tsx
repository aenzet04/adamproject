import React, { useState, useEffect } from 'react';
import { MultiTierSwitcher } from './components/navigation/MultiTierSwitcher';
import { PosTerminal } from './components/pos/PosTerminal';
import { FinancialStatementsViewer } from './components/finance/FinancialStatementsViewer';
import { SwaggerApiViewer } from './components/swagger/SwaggerApiViewer';
import { DatabaseManager } from './components/database/DatabaseManager';
import { DocumentationViewer } from './components/docs/DocumentationViewer';
import { OwnerAnalyticsDashboard } from './components/owner/OwnerAnalyticsDashboard';
import { SuperUserDashboard } from './components/superuser/SuperUserDashboard';
import { BrandAdminDashboard } from './components/admin/BrandAdminDashboard';
import { CustomerManagementView } from './components/crm/CustomerManagementView';
import { InventoryManagementView } from './components/inventory/InventoryManagementView';
import { CustomerReviewPage } from './components/reviews/CustomerReviewPage';
import { BenchmarkViewer } from './components/benchmark/BenchmarkViewer';
import { BugTicketingCenter } from './components/tickets/BugTicketingCenter';
import { SoftDeleteManager } from './components/trash/SoftDeleteManager';
import { BrandTeamChatWidget } from './components/chat/BrandTeamChatWidget';
import { AuthPortal } from './components/auth/AuthPortal';
import { ToastContainer } from './components/atoms/ToastContainer';
import { PageTransitionPreloader } from './components/atoms/PageTransitionPreloader';
import { useTenantStore } from './stores/useTenantStore';
import { useThemeStore } from './stores/useThemeStore';
import { useAuthStore } from './stores/useAuthStore';
import { useModuleLicenseStore } from './stores/useModuleLicenseStore';
import { toast } from './stores/useToastStore';

export default function App() {
  const { isAuthenticated, currentUser, logout } = useAuthStore();
  const [activeModule, setActiveModule] = useState<
    'pos' | 'crm' | 'finance' | 'inventory' | 'hr' | 'audit' | 'owner' | 'superuser' | 'brand_admin' | 'reviews' | 'benchmark' | 'tickets' | 'trash' | 'swagger' | 'database' | 'docs'
  >('owner');

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const { setHierarchicalData } = useTenantStore();
  const { theme, setTheme } = useThemeStore();
  const { modules, subscriptionTier, remainingMonths, setSubscriptionTier } = useModuleLicenseStore();

  const [isGuestReviewMode, setIsGuestReviewMode] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.pathname === '/review') {
      setIsGuestReviewMode(true);
    }
  }, []);

  useEffect(() => {
    setTheme(theme);

    setHierarchicalData({
      tenant: {
        id: 't-01',
        name: 'PT Multi Industri Nusantara',
        subdomain: 'nusantara',
        legalEntityType: 'PT',
        status: 'active',
        featureFlags: { pos: true, inventory: true, finance: true, hr: true, audit: true },
      },
      brands: [
        { id: 'b-01', tenantId: 't-01', name: 'Kopi Nusantara Roastery', code: 'KNR', industryType: 'fnb', status: 'active' },
        { id: 'b-02', tenantId: 't-01', name: 'Nusantara Retail Mart', code: 'NRM', industryType: 'retail', status: 'active' },
        { id: 'b-03', tenantId: 't-01', name: 'Logistik Cepat Mandiri', code: 'LCM', industryType: 'services', status: 'active' },
      ],
      branches: [
        { id: 'br-01', tenantId: 't-01', brandId: 'b-01', name: 'Outlet Grand Indonesia', code: 'GI-01', branchType: 'store', geofenceRadiusMeters: 100, isActive: true },
        { id: 'br-02', tenantId: 't-01', brandId: 'b-01', name: 'Outlet Senopati', code: 'SNP-02', branchType: 'store', geofenceRadiusMeters: 100, isActive: true },
        { id: 'br-03', tenantId: 't-01', brandId: 'b-02', name: 'Store Kelapa Gading', code: 'KG-01', branchType: 'store', geofenceRadiusMeters: 100, isActive: true },
      ],
      warehouses: [
        { id: 'wh-01', tenantId: 't-01', branchId: 'br-01', name: 'Gudang Utama Barista GI', code: 'WH-GI-MAIN', isPrimary: true, costingMethod: 'moving_average' },
        { id: 'wh-02', tenantId: 't-01', branchId: 'br-02', name: 'Gudang Outlet Senopati', code: 'WH-SNP-MAIN', isPrimary: true, costingMethod: 'moving_average' },
      ],
    });
  }, [setHierarchicalData, theme, setTheme]);

  if (isGuestReviewMode) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-between">
        <CustomerReviewPage />
        <div className="text-center pb-4 text-xs text-slate-500">
          <button
            onClick={() => setIsGuestReviewMode(false)}
            className="text-red-400 font-bold hover:underline"
          >
            ← Kembali ke Modula App Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPortal />;
  }

  const isModuleLocked = (code: string) => {
    const mod = modules.find((m) => m.code === code);
    return mod ? !mod.isUnlocked : false;
  };

  const userRole = currentUser.role;

  const handleSelectModule = (mod: any) => {
    setActiveModule(mod);
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors relative">
      <PageTransitionPreloader activeModuleKey={activeModule} />
      <ToastContainer />
      <MultiTierSwitcher />
      <BrandTeamChatWidget />

      {/* Floating Mobile Sidebar Toggle Button */}
      <button
        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        className="md:hidden fixed bottom-4 left-4 z-50 bg-red-600 hover:bg-red-500 text-white p-3.5 rounded-full shadow-2xl shadow-red-600/50 flex items-center justify-center transition-all active:scale-90"
        title="Buka Menu Modul"
      >
        <span className="text-base">{isMobileSidebarOpen ? '✕' : '☰'}</span>
      </button>

      <div className="flex flex-1 overflow-hidden relative">
        {/* MOBILE SIDEBAR BACKDROP */}
        {isMobileSidebarOpen && (
          <div
            onClick={() => setIsMobileSidebarOpen(false)}
            className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-40"
          />
        )}

        {/* LEFT SIDEBAR NAVIGATION */}
        <aside
          className={`fixed md:relative top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between p-3 transition-transform duration-200 shadow-xl md:shadow-sm overflow-y-auto ${
            isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <div className="space-y-1 pt-12 md:pt-0">
            {/* EXECUTIVE & MANAGEMENT */}
            {(userRole === 'owner' || userRole === 'super_user') && (
              <div className="space-y-1">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Executive Suite
                </div>

                <button
                  onClick={() => handleSelectModule('owner')}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeModule === 'owner'
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>👑</span>
                  <span>Owner Dashboard & AI</span>
                </button>
              </div>
            )}

            {(userRole === 'admin_brand' || userRole === 'owner' || userRole === 'super_user') && (
              <div className="space-y-1 pt-1">
                <button
                  onClick={() => handleSelectModule('brand_admin')}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeModule === 'brand_admin'
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>🏢</span>
                  <span>Brand & Staff Admin</span>
                </button>
              </div>
            )}

            {userRole === 'super_user' && (
              <div className="space-y-1 pt-1">
                <button
                  onClick={() => handleSelectModule('superuser')}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeModule === 'superuser'
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>⚡</span>
                  <span>Super User & Licensing</span>
                </button>
              </div>
            )}

            {/* OPERATIONAL MODULES */}
            <div className="pt-3 px-3 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Modul Operasional
            </div>

            <button
              onClick={() => handleSelectModule('pos')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeModule === 'pos'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <span>🛒</span>
                <span>Kasir POS & Dapur</span>
              </div>
              {isModuleLocked('pos') && <span className="text-[10px]">🔒</span>}
            </button>

            <button
              onClick={() => handleSelectModule('crm')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeModule === 'crm'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <span>👥</span>
                <span>CRM & Loyalitas Member</span>
              </div>
              {isModuleLocked('crm') && <span className="text-[10px]">🔒</span>}
            </button>

            <button
              onClick={() => handleSelectModule('inventory')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeModule === 'inventory'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <span>📦</span>
                <span>Gudang, Stok & Vendor</span>
              </div>
              {isModuleLocked('inventory') && <span className="text-[10px]">🔒</span>}
            </button>

            {(userRole === 'owner' || userRole === 'super_user') && (
              <button
                onClick={() => handleSelectModule('finance')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeModule === 'finance'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <span>📊</span>
                  <span>Akuntansi & GL (PSAK)</span>
                </div>
                {isModuleLocked('finance') && <span className="text-[10px]">🔒</span>}
              </button>
            )}

            {/* TICKETS & SOFT DELETE GOVERNANCE */}
            <div className="pt-3 px-3 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Governance & Support
            </div>

            <button
              onClick={() => handleSelectModule('tickets')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeModule === 'tickets'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>🎫</span>
              <span>Tiket Bug & Insiden</span>
            </button>

            <button
              onClick={() => handleSelectModule('trash')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeModule === 'trash'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>🗑️</span>
              <span>Soft-Delete & Trash</span>
            </button>

            {/* PERFORMANCE & DEV TOOLS */}
            <div className="pt-3 px-3 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Benchmark & Tools
            </div>

            <button
              onClick={() => handleSelectModule('benchmark')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeModule === 'benchmark'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>🚀</span>
              <span>Speed & Benchmark</span>
            </button>

            <button
              onClick={() => handleSelectModule('reviews')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeModule === 'reviews'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>⭐</span>
              <span>Portal Ulasan (/review)</span>
            </button>

            <button
              onClick={() => handleSelectModule('docs')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeModule === 'docs'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>📚</span>
              <span>Dokumentasi Modula</span>
            </button>

            {userRole === 'super_user' && (
              <>
                <button
                  onClick={() => handleSelectModule('swagger')}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeModule === 'swagger'
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>⚡</span>
                  <span>Swagger API Console</span>
                </button>

                <button
                  onClick={() => handleSelectModule('database')}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeModule === 'database'
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>🐬</span>
                  <span>MySQL 8 / MariaDB</span>
                </button>
              </>
            )}
          </div>

          {/* SUBSCRIPTION TIER QUICK SWITCHER & LOGOUT BAR */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
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

            <button
              onClick={() => {
                logout();
                toast.info('Berhasil Keluar', 'Sesi pengguna telah diakhiri.');
              }}
              className="w-full flex items-center justify-center space-x-2 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 p-2 rounded-xl text-xs font-bold transition-all border border-slate-200 dark:border-slate-700"
            >
              <span>🚪</span>
              <span>Keluar (Logout)</span>
            </button>
            <div className="text-[10px] text-center text-slate-400">
              Modula by <a href="https://github.com/parikesitad-pm" target="_blank" rel="noreferrer" className="text-red-500 font-bold hover:underline">parikesitad-pm</a>
            </div>
          </div>
        </aside>

        {/* 3. MAIN WORKSPACE */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 transition-colors">
          {activeModule === 'owner' && <OwnerAnalyticsDashboard />}
          {activeModule === 'brand_admin' && <BrandAdminDashboard />}
          {activeModule === 'superuser' && <SuperUserDashboard />}
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
            isModuleLocked('inventory') ? (
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
          {activeModule === 'benchmark' && <BenchmarkViewer />}
          {activeModule === 'tickets' && <BugTicketingCenter />}
          {activeModule === 'trash' && <SoftDeleteManager />}
          {activeModule === 'reviews' && <CustomerReviewPage />}
          {activeModule === 'pos' && (
            isModuleLocked('pos') ? (
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
          {activeModule === 'database' && <DatabaseManager />}
        </main>
      </div>
    </div>
  );
}
