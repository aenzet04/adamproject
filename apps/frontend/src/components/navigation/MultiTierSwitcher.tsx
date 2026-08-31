'use client';

import React from 'react';
import { useTenantStore } from '../../stores/useTenantStore';
import { useThemeStore } from '../../stores/useThemeStore';

export const MultiTierSwitcher: React.FC = () => {
  const {
    currentTenant,
    currentBrand,
    currentBranch,
    currentWarehouse,
    availableBrands,
    availableBranches,
    availableWarehouses,
    setBrand,
    setBranch,
    setWarehouse,
  } = useTenantStore();

  const { theme, toggleTheme } = useThemeStore();

  const filteredBranches = availableBranches.filter((b) => b.brandId === currentBrand?.id);
  const filteredWarehouses = availableWarehouses.filter((w) => w.branchId === currentBranch?.id);

  return (
    <header className="h-14 border-b bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 px-4 flex items-center justify-between transition-colors shadow-sm">
      <div className="flex items-center space-x-3">
        {/* Tier 1: Holding / Tenant */}
        <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Holding:</span>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
            {currentTenant?.name || 'PT Multi Industri Nusantara'}
          </span>
        </div>

        <span className="text-slate-300 dark:text-slate-700">/</span>

        {/* Tier 2: Brand Switcher */}
        <div className="flex items-center space-x-1.5">
          <label htmlFor="brand-select" className="text-xs text-slate-500 dark:text-slate-400 font-medium">Brand:</label>
          <select
            id="brand-select"
            className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs rounded-xl border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold"
            value={currentBrand?.id || ''}
            onChange={(e) => {
              const brand = availableBrands.find((b) => b.id === e.target.value);
              if (brand) setBrand(brand);
            }}
          >
            {availableBrands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.code})
              </option>
            ))}
          </select>
        </div>

        <span className="text-slate-300 dark:text-slate-700">/</span>

        {/* Tier 3: Branch / Store Switcher */}
        <div className="flex items-center space-x-1.5">
          <label htmlFor="branch-select" className="text-xs text-slate-500 dark:text-slate-400 font-medium">Outlet:</label>
          <select
            id="branch-select"
            className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs rounded-xl border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold"
            value={currentBranch?.id || ''}
            onChange={(e) => {
              const branch = filteredBranches.find((b) => b.id === e.target.value);
              if (branch) setBranch(branch);
            }}
          >
            {filteredBranches.map((br) => (
              <option key={br.id} value={br.id}>
                {br.name} ({br.code})
              </option>
            ))}
          </select>
        </div>

        <span className="text-slate-300 dark:text-slate-700">/</span>

        {/* Warehouse Selector */}
        <div className="flex items-center space-x-1.5">
          <label htmlFor="warehouse-select" className="text-xs text-slate-500 dark:text-slate-400 font-medium">Gudang:</label>
          <select
            id="warehouse-select"
            className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs rounded-xl border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold"
            value={currentWarehouse?.id || ''}
            onChange={(e) => {
              const wh = filteredWarehouses.find((w) => w.id === e.target.value);
              if (wh) setWarehouse(wh);
            }}
          >
            {filteredWarehouses.map((wh) => (
              <option key={wh.id} value={wh.id}>
                {wh.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Dark / Light Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm active:scale-95"
          title="Ganti Tema Tampilan"
        >
          <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        <span className="inline-flex items-center px-2 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          ● Online Synced
        </span>

        <div className="text-right">
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Kasir: Siti Rahma</div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">Shift #1 (ID: POS-JKT-01)</div>
        </div>
      </div>
    </header>
  );
};
