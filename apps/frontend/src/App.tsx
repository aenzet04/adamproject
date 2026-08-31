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
import { CustomerReviewPage } from './components/reviews/CustomerReviewPage';
import { useTenantStore } from './stores/useTenantStore';
import { useThemeStore } from './stores/useThemeStore';
import { useModuleLicenseStore } from './stores/useModuleLicenseStore';

export default function App() {
  const [activeModule, setActiveModule] = useState<
    'pos' | 'finance' | 'inventory' | 'hr' | 'audit' | 'owner' | 'superuser' | 'brand_admin' | 'reviews' | 'swagger' | 'database' | 'docs'
  >('pos');

  const { setHierarchicalData } = useTenantStore();
  const { theme, setTheme } = useThemeStore();
  const { modules } = useModuleLicenseStore();

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

  // Check if a module is locked
  const isModuleLocked = (code: string) => {
    const mod = modules.find((m) => m.code === code);
    return mod ? !mod.isUnlocked : false;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* 1. TOP MULTI-TIER SWITCHER & PROFILE BAR */}
      <MultiTierSwitcher />

      <div className="flex flex-1 overflow-hidden">
        {/* 2. LEFT SIDEBAR NAVIGATION */}
        <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between p-3 transition-colors shadow-sm overflow-y-auto">
          <div className="space-y-1">
            {/* ROLE DASHBOARDS */}
            <div className="px-3 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Executive & Management Dashboards
            </div>

            <button
              onClick={() => setActiveModule('owner')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeModule === 'owner'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>👑</span>
              <span>Owner Dashboard & AI</span>
            </button>

            <button
              onClick={() => setActiveModule('brand_admin')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeModule === 'brand_admin'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>🏢</span>
              <span>Brand & Staff Admin</span>
            </button>

            <button
              onClick={() => setActiveModule('superuser')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeModule === 'superuser'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>⚡</span>
              <span>Super User & SaaS Licensing</span>
            </button>

            {/* OPERATIONAL MODULES */}
            <div className="pt-3 px-3 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Modul Operasional Bisnis
            </div>

            <button
              onClick={() => setActiveModule('pos')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeModule === 'pos'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <span>🛒</span>
                <span>Point of Sale (POS)</span>
              </div>
              {isModuleLocked('pos') && <span className="text-[10px]">🔒</span>}
            </button>

            <button
              onClick={() => setActiveModule('finance')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeModule === 'finance'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <span>📊</span>
                <span>Akuntansi & Buku Besar</span>
              </div>
              {isModuleLocked('finance') && <span className="text-[10px]">🔒</span>}
            </button>

            <button
              onClick={() => setActiveModule('inventory')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeModule === 'inventory'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <span>📦</span>
                <span>Gudang & Dead Stock</span>
              </div>
              {isModuleLocked('inventory') && <span className="text-[10px]">🔒</span>}
            </button>

            <button
              onClick={() => setActiveModule('hr')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeModule === 'hr'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <span>👥</span>
                <span>HR & Payroll</span>
              </div>
              {isModuleLocked('hr') && <span className="text-[10px]">🔒</span>}
            </button>

            <button
              onClick={() => setActiveModule('audit')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeModule === 'audit'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <span>🛡️</span>
                <span>Anti-Fraud & Audit Trail</span>
              </div>
              {isModuleLocked('audit') && <span className="text-[10px]">🔒</span>}
            </button>

            {/* CONSUMER PORTAL & TOOLS */}
            <div className="pt-3 px-3 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Portal Konsumen & Developer
            </div>

            <button
              onClick={() => setActiveModule('reviews')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeModule === 'reviews'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>⭐</span>
              <span>Landing Page Review</span>
            </button>

            <button
              onClick={() => setActiveModule('docs')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeModule === 'docs'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>📚</span>
              <span>Dokumentasi & Slides</span>
            </button>

            <button
              onClick={() => setActiveModule('swagger')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeModule === 'swagger'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>⚡</span>
              <span>Swagger API Console</span>
            </button>

            <button
              onClick={() => setActiveModule('database')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeModule === 'database'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>🐬</span>
              <span>MySQL 8 / MariaDB</span>
            </button>
          </div>
        </aside>

        {/* 3. MAIN WORKSPACE */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 transition-colors">
          {activeModule === 'owner' && <OwnerAnalyticsDashboard />}
          {activeModule === 'brand_admin' && <BrandAdminDashboard />}
          {activeModule === 'superuser' && <SuperUserDashboard />}
          {activeModule === 'reviews' && <CustomerReviewPage />}
          {activeModule === 'pos' && (
            isModuleLocked('pos') ? (
              <div className="p-12 text-center space-y-4">
                <span className="text-5xl">🔒</span>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                  Modul POS Enterprise Terkunci
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Hubungi Account Manager Anda atau buka kunci lisensi di menu <b>Super User & SaaS Licensing</b>.
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
          {activeModule === 'inventory' && (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400">
              <div className="text-4xl mb-3">📦</div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Modul SCM & Dead Stock Analyzer</h3>
              <p className="text-xs max-w-md mx-auto mt-2 text-slate-500 dark:text-slate-400">
                Layanan `InventoryEngine::DeadStockService` aktif menghitung persediaan tidak bergerak $N$ hari dan menyusun draft PO otomatis.
              </p>
            </div>
          )}
          {activeModule === 'hr' && (
            isModuleLocked('hr') ? (
              <div className="p-12 text-center space-y-4">
                <span className="text-5xl">🔒</span>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                  Modul HR & Payroll Terkunci (Demo Lisensi Pay-Per-Module)
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Modul ini dijual terpisah ala Accurate / Jurnal.id seharga Rp 299.000/bln. Buka kunci di menu <b>Super User & SaaS Licensing</b> untuk mengaktifkannya.
                </p>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                <div className="text-4xl mb-3">👥</div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Modul HR, Presensi Geofence & Payroll</h3>
                <p className="text-xs max-w-md mx-auto mt-2 text-slate-500 dark:text-slate-400">
                  Layanan `HrEngine::PayrollProcessorService` siap memproses perhitungan lembur Depnaker, BPJS, PPh 21 TER, dan auto-jurnal payroll ke Akuntansi.
                </p>
              </div>
            )
          )}
          {activeModule === 'audit' && (
            isModuleLocked('audit') ? (
              <div className="p-12 text-center space-y-4">
                <span className="text-5xl">🔒</span>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                  Modul Anti-Fraud & Audit Trail Terkunci
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Buka kunci lisensi di menu <b>Super User & SaaS Licensing</b> untuk mengaktifkan audit logs dan deteksi anomali kasir.
                </p>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                <div className="text-4xl mb-3">🛡️</div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Modul Audit Trail & Deteksi Anomali Fraud</h3>
                <p className="text-xs max-w-md mx-auto mt-2 text-slate-500 dark:text-slate-400">
                  Layanan `AuditEngine::FraudDetectorService` memonitor immutable logs, spike void transaksi kasir, dan manual drawer opening.
                </p>
              </div>
            )
          )}
        </main>
      </div>
    </div>
  );
}
