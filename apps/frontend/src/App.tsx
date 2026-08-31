import React, { useState, useEffect } from 'react';
import { MultiTierSwitcher } from './components/navigation/MultiTierSwitcher';
import { PosTerminal } from './components/pos/PosTerminal';
import { FinancialStatementsViewer } from './components/finance/FinancialStatementsViewer';
import { SwaggerApiViewer } from './components/swagger/SwaggerApiViewer';
import { DatabaseManager } from './components/database/DatabaseManager';
import { useTenantStore } from './stores/useTenantStore';
import { useThemeStore } from './stores/useThemeStore';

export default function App() {
  const [activeModule, setActiveModule] = useState<'pos' | 'finance' | 'inventory' | 'hr' | 'audit' | 'swagger' | 'database'>('pos');
  const { setHierarchicalData } = useTenantStore();
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    // Sync initial theme class
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* 1. TOP MULTI-TIER SWITCHER BAR */}
      <MultiTierSwitcher />

      <div className="flex flex-1 overflow-hidden">
        {/* 2. LEFT SIDEBAR NAVIGATION */}
        <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between p-3 transition-colors shadow-sm">
          <div className="space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Modul Bisnis & Operasional
            </div>

            <button
              onClick={() => setActiveModule('pos')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeModule === 'pos'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>🛒</span>
              <span>Point of Sale (POS)</span>
            </button>

            <button
              onClick={() => setActiveModule('finance')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeModule === 'finance'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>📊</span>
              <span>Akuntansi & Buku Besar</span>
            </button>

            <button
              onClick={() => setActiveModule('inventory')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeModule === 'inventory'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>📦</span>
              <span>Gudang & Dead Stock</span>
            </button>

            <button
              onClick={() => setActiveModule('hr')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeModule === 'hr'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>👥</span>
              <span>HR, Absensi & Payroll</span>
            </button>

            <button
              onClick={() => setActiveModule('audit')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeModule === 'audit'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>🛡️</span>
              <span>Audit Trail & Anti-Fraud</span>
            </button>

            <div className="pt-3 px-3 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Developer & Database Tools
            </div>

            <button
              onClick={() => setActiveModule('swagger')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeModule === 'swagger'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>⚡</span>
              <span>Swagger / OpenAPI Console</span>
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
              <span>MySQL / MariaDB Manager</span>
            </button>
          </div>

          {/* System Status Footnote */}
          <div className="p-3 bg-slate-100 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800 text-[11px] space-y-1">
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Database:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">MySQL / MariaDB</span>
            </div>
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Backend API:</span>
              <span className="text-emerald-600 dark:text-emerald-400">Ruby (3001)</span>
            </div>
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Theme:</span>
              <span className="font-semibold capitalize text-slate-800 dark:text-slate-200">{theme} Mode</span>
            </div>
          </div>
        </aside>

        {/* 3. MAIN WORKSPACE */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 transition-colors">
          {activeModule === 'pos' && <PosTerminal />}
          {activeModule === 'finance' && <FinancialStatementsViewer />}
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
            <div className="p-8 text-center text-slate-500 dark:text-slate-400">
              <div className="text-4xl mb-3">👥</div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Modul HR, Presensi Geofence & Payroll</h3>
              <p className="text-xs max-w-md mx-auto mt-2 text-slate-500 dark:text-slate-400">
                Layanan `HrEngine::PayrollProcessorService` siap memproses perhitungan lembur Depnaker, BPJS, PPh 21 TER, dan auto-jurnal payroll ke Akuntansi.
              </p>
            </div>
          )}
          {activeModule === 'audit' && (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400">
              <div className="text-4xl mb-3">🛡️</div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Modul Audit Trail & Deteksi Anomali Fraud</h3>
              <p className="text-xs max-w-md mx-auto mt-2 text-slate-500 dark:text-slate-400">
                Layanan `AuditEngine::FraudDetectorService` memonitor immutable logs, spike void transaksi kasir, dan manual drawer opening.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
