import React, { useState, useEffect } from 'react';
import { MultiTierSwitcher } from './components/navigation/MultiTierSwitcher';
import { PosTerminal } from './components/pos/PosTerminal';
import { FinancialStatementsViewer } from './components/finance/FinancialStatementsViewer';
import { useTenantStore } from './stores/useTenantStore';

export default function App() {
  const [activeModule, setActiveModule] = useState<'pos' | 'finance' | 'inventory' | 'hr' | 'audit'>('pos');
  const { setHierarchicalData } = useTenantStore();

  useEffect(() => {
    // Initialize default enterprise hierarchy
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
  }, [setHierarchicalData]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans">
      {/* 1. TOP MULTI-TIER SWITCHER BAR */}
      <MultiTierSwitcher />

      <div className="flex flex-1 overflow-hidden">
        {/* 2. LEFT SIDEBAR NAVIGATION */}
        <aside className="w-60 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-3">
          <div className="space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Modul Enterprise
            </div>

            <button
              onClick={() => setActiveModule('pos')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeModule === 'pos'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <span>🛒</span>
              <span>Point of Sale (POS)</span>
            </button>

            <button
              onClick={() => setActiveModule('finance')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeModule === 'finance'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <span>📊</span>
              <span>Akuntansi & Buku Besar</span>
            </button>

            <button
              onClick={() => setActiveModule('inventory')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeModule === 'inventory'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <span>📦</span>
              <span>Gudang & Dead Stock</span>
            </button>

            <button
              onClick={() => setActiveModule('hr')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeModule === 'hr'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <span>👥</span>
              <span>HR, Absensi & Payroll</span>
            </button>

            <button
              onClick={() => setActiveModule('audit')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeModule === 'audit'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <span>🛡️</span>
              <span>Audit Trail & Anti-Fraud</span>
            </button>
          </div>

          {/* System Status Footnote */}
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>Stack:</span>
              <span className="font-semibold text-emerald-400">Rails 8 + React 19</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>DB Mode:</span>
              <span className="text-slate-300">RLS Multi-Tenant</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>GL Posting:</span>
              <span className="text-emerald-400">Real-time Active</span>
            </div>
          </div>
        </aside>

        {/* 3. MAIN WORKSPACE */}
        <main className="flex-1 overflow-y-auto bg-slate-950">
          {activeModule === 'pos' && <PosTerminal />}
          {activeModule === 'finance' && <FinancialStatementsViewer />}
          {activeModule === 'inventory' && (
            <div className="p-8 text-center text-slate-400">
              <div className="text-4xl mb-3">📦</div>
              <h3 className="text-lg font-bold text-slate-200">Modul SCM & Dead Stock Analyzer</h3>
              <p className="text-xs max-w-md mx-auto mt-2 text-slate-400">
                Layanan `InventoryEngine::DeadStockService` aktif menghitung persediaan tidak bergerak $N$ hari dan menyusun draft PO otomatis.
              </p>
            </div>
          )}
          {activeModule === 'hr' && (
            <div className="p-8 text-center text-slate-400">
              <div className="text-4xl mb-3">👥</div>
              <h3 className="text-lg font-bold text-slate-200">Modul HR, Presensi Geofence & Payroll</h3>
              <p className="text-xs max-w-md mx-auto mt-2 text-slate-400">
                Layanan `HrEngine::PayrollProcessorService` siap memproses perhitungan lembur Depnaker, BPJS, PPh 21 TER, dan auto-jurnal payroll ke Akuntansi.
              </p>
            </div>
          )}
          {activeModule === 'audit' && (
            <div className="p-8 text-center text-slate-400">
              <div className="text-4xl mb-3">🛡️</div>
              <h3 className="text-lg font-bold text-slate-200">Modul Audit Trail & Deteksi Anomali Fraud</h3>
              <p className="text-xs max-w-md mx-auto mt-2 text-slate-400">
                Layanan `AuditEngine::FraudDetectorService` memonitor immutable logs, spike void transaksi kasir, dan manual drawer opening.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
