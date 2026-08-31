'use client';

import React, { useState } from 'react';
import { useTenantStore } from '../../stores/useTenantStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { useDensityStore } from '../../stores/useDensityStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { UserProfileModal } from '../profile/UserProfileModal';

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
  const { viewMode, toggleViewMode } = useDensityStore();
  const { currentUser } = useAuthStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const filteredBranches = availableBranches.filter((b) => b.brandId === currentBrand?.id);
  const filteredWarehouses = availableWarehouses.filter((w) => w.branchId === currentBranch?.id);

  return (
    <header className="h-14 border-b bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 px-4 flex items-center justify-between transition-colors shadow-sm z-30">
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

      <div className="flex items-center space-x-2.5">
        {/* Jira Sleek Density Toggle (Simple vs Detailed) */}
        <button
          onClick={toggleViewMode}
          className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm active:scale-95"
          title="Ganti Mode Tampilan (Sleek Simple vs Detailed Enterprise)"
        >
          <span>{viewMode === 'simple' ? '⚡' : '🔍'}</span>
          <span>{viewMode === 'simple' ? 'Simple Mode' : 'Detailed Mode'}</span>
        </button>

        {/* Dark / Light Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm active:scale-95"
          title="Ganti Tema Tampilan"
        >
          <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
        </button>

        {/* User Profile Avatar & Role Badge Trigger */}
        <button
          onClick={() => setIsProfileOpen(true)}
          className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 p-1.5 pr-3 rounded-2xl transition-all shadow-sm group text-left"
        >
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.name}
            className="w-8 h-8 rounded-xl object-cover border border-emerald-500 shadow-sm"
          />
          <div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-1">
              <span>{currentUser.name.split(' ')[0]}</span>
              <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.2 rounded font-bold uppercase">
                {currentUser.role.replace('_', ' ')}
              </span>
            </div>
            <div className="text-[10px] text-slate-400">Klik untuk SOP & Profil</div>
          </div>
        </button>
      </div>

      {isProfileOpen && <UserProfileModal onClose={() => setIsProfileOpen(false)} />}
    </header>
  );
};
