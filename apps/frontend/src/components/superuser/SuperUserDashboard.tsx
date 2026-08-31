'use client';

import React from 'react';
import { useModuleLicenseStore } from '../../stores/useModuleLicenseStore';
import { useTenantStore } from '../../stores/useTenantStore';

export const SuperUserDashboard: React.FC = () => {
  const { modules, toggleModuleLock, unlockAll, lockAllNonCore } = useModuleLicenseStore();
  const { availableBrands, availableBranches } = useTenantStore();

  const totalUnlockedMonthly = modules
    .filter((m) => m.isUnlocked)
    .reduce((acc, m) => acc + m.pricePerMonth, 0);

  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">⚡</span>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Super User & SaaS Licensing Management
            </h2>
            <span className="bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400 border border-purple-300 dark:border-purple-800 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold">
              Pay-Per-Module Licensing Core (ala Accurate / Jurnal.id)
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manajemen status langganan modul berbayar, hak akses multi-tenant, dan otorisasi lisensi holding/brand.
          </p>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={lockAllNonCore}
            className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold px-3.5 py-2 rounded-2xl transition-all shadow-sm"
          >
            🔒 Kunci Modul Non-Core
          </button>
          <button
            onClick={unlockAll}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-2xl transition-all shadow-md shadow-emerald-600/20"
          >
            🔓 Buka Semua Lisensi Modul (Full Tier)
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Nilai Lisensi Aktif</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">
            Rp {totalUnlockedMonthly.toLocaleString('id-ID')}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Per Bulan / Tenant Group</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Modul Terbuka (Unlocked)</span>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono mt-1">
            {modules.filter((m) => m.isUnlocked).length} / {modules.length} Modul
          </div>
          <div className="text-[10px] text-slate-400 mt-1">SaaS Pay-as-You-Grow Model</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Brand Business Units</span>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400 font-mono mt-1">
            {availableBrands.length} Brands
          </div>
          <div className="text-[10px] text-slate-400 mt-1">FnB, Retail Mart & Services</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Outlet Cabang</span>
          <div className="text-2xl font-black text-amber-500 font-mono mt-1">
            {availableBranches.length} Outlets
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Multi-Store Synchronization</div>
        </div>
      </div>

      {/* PAY-PER-MODULE LICENSING GRID */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-xl">💳</span>
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Katalog Modul Aplikasi & Status Kunci/Buka Lisensi
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Klik tombol "Kunci / Buka Modul" untuk mensimulasikan penjualan fitur secara modular:
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((mod) => (
            <div
              key={mod.id}
              className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-3 ${
                mod.isUnlocked
                  ? 'bg-slate-50 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 shadow-sm'
                  : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50 opacity-80'
              }`}
            >
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-3xl">{mod.icon}</span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                      mod.isUnlocked
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                    }`}
                  >
                    {mod.isUnlocked ? '✓ UNLOCKED' : '🔒 LOCKED (Terkunci)'}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-2">{mod.name}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {mod.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex justify-between items-center">
                <div>
                  <div className="text-[10px] text-slate-400">Biaya Lisensi</div>
                  <div className="text-xs font-black font-mono text-emerald-600 dark:text-emerald-400">
                    Rp {mod.pricePerMonth.toLocaleString('id-ID')} / bln
                  </div>
                </div>

                <button
                  onClick={() => toggleModuleLock(mod.code)}
                  className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all shadow-sm ${
                    mod.isUnlocked
                      ? 'bg-rose-600 hover:bg-rose-500 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {mod.isUnlocked ? '🔒 Kunci Modul' : '🔓 Buka Lisensi'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
