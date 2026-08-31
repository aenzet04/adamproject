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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const filteredBranches = availableBranches.filter((b) => b.brandId === currentBrand?.id);
  const filteredWarehouses = availableWarehouses.filter((w) => w.branchId === currentBranch?.id);

  return (
    <header className="h-14 border-b bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 px-3 md:px-4 flex items-center justify-between transition-colors shadow-sm z-30">
      {/* BRAND & TENANT SELECTORS */}
      <div className="flex items-center space-x-2 md:space-x-3 overflow-x-auto scrollbar-none">
        {/* Brand Logo Symbol */}
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center font-black text-white shadow-md shadow-red-600/30 text-xs flex-shrink-0">
          M
        </div>

        {/* Tier 1: Holding / Tenant */}
        <div className="hidden sm:flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 whitespace-nowrap">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Holding:</span>
          <span className="text-xs font-bold text-red-600 dark:text-red-400">
            {currentTenant?.name || 'PT Multi Industri Nusantara'}
          </span>
        </div>

        <span className="hidden sm:inline text-slate-300 dark:text-slate-700">/</span>

        {/* Tier 2: Brand Switcher */}
        <div className="flex items-center space-x-1">
          <select
            className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs rounded-xl border border-slate-200 dark:border-slate-700 px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-red-500 font-semibold max-w-[130px] md:max-w-none truncate"
            value={currentBrand?.id || ''}
            onChange={(e) => {
              const brand = availableBrands.find((b) => b.id === e.target.value);
              if (brand) setBrand(brand);
            }}
          >
            {availableBrands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <span className="text-slate-300 dark:text-slate-700">/</span>

        {/* Tier 3: Branch Switcher */}
        <div className="flex items-center space-x-1">
          <select
            className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs rounded-xl border border-slate-200 dark:border-slate-700 px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-red-500 font-semibold max-w-[140px] md:max-w-none truncate"
            value={currentBranch?.id || ''}
            onChange={(e) => {
              const branch = filteredBranches.find((b) => b.id === e.target.value);
              if (branch) setBranch(branch);
            }}
          >
            {filteredBranches.map((br) => (
              <option key={br.id} value={br.id}>
                {br.name}
              </option>
            ))}
          </select>
        </div>

        <span className="hidden lg:inline text-slate-300 dark:text-slate-700">/</span>

        {/* Tier 4: Warehouse Selector */}
        <div className="hidden lg:flex items-center space-x-1">
          <select
            className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs rounded-xl border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-red-500 font-semibold"
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

      {/* RIGHT ACTION CONTROLS */}
      <div className="flex items-center space-x-2">
        {/* Density Toggle (Desktop Only) */}
        <button
          onClick={toggleViewMode}
          className="hidden md:flex bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-2.5 py-1.5 rounded-xl text-xs font-bold items-center space-x-1.5 transition-all shadow-sm active:scale-95"
          title="Ganti Mode Tampilan"
        >
          <span>{viewMode === 'simple' ? '⚡' : '🔍'}</span>
          <span>{viewMode === 'simple' ? 'Simple' : 'Detailed'}</span>
        </button>

        {/* Dark / Light Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 p-2 md:px-3 md:py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm active:scale-95"
          title="Ganti Tema"
        >
          <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
        </button>

        {/* User Profile Trigger */}
        <button
          onClick={() => setIsProfileOpen(true)}
          className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 p-1 md:p-1.5 md:pr-3 rounded-2xl transition-all shadow-sm group text-left"
        >
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.name}
            className="w-8 h-8 rounded-xl object-cover border border-red-500 shadow-sm"
          />
          <div className="hidden sm:block">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-1">
              <span>{currentUser.name.split(' ')[0]}</span>
              <span className="text-[9px] bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 px-1.5 py-0.2 rounded font-bold uppercase">
                {currentUser.role.replace('_', ' ')}
              </span>
            </div>
            <div className="text-[10px] text-slate-400">Profil & SOP</div>
          </div>
        </button>
      </div>

      {isProfileOpen && <UserProfileModal onClose={() => setIsProfileOpen(false)} />}
    </header>
  );
};
