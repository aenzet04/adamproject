'use client';

import React, { useState } from 'react';
import { useModuleLicenseStore, SubscriptionTier } from '../../stores/useModuleLicenseStore';
import { toast } from '../../stores/useToastStore';

export const SuperUserDashboard: React.FC = () => {
  const {
    subscriptionTier,
    remainingMonths,
    expiryDate,
    customReceiptFooter,
    modules,
    setSubscriptionTier,
    setCustomReceiptFooter,
    toggleModuleLock,
  } = useModuleLicenseStore();

  const [footerDraft, setFooterDraft] = useState(customReceiptFooter);

  const handleTierChange = (tier: SubscriptionTier) => {
    setSubscriptionTier(tier);
    toast.success('Paket Berlangganan Diperbarui', `Tenant kini aktif dengan paket ${tier.toUpperCase()}`);
  };

  const handleSaveFooter = () => {
    setCustomReceiptFooter(footerDraft);
    toast.success('Footer Struk Disimpan', 'Semua struk transaksi kini menggunakan footer kustom white-label Anda.');
  };

  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">⚡</span>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Super User: SaaS Licensing, Addon Modules & Tier Manager
            </h2>
            <span className="bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400 border border-purple-300 dark:border-purple-800 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold">
              Platform Director Control
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Atur paket langganan (Starter, Business, Enterprise), buka/kunci modul per tenant ala Accurate / Jurnal.id, dan kelola white-labeling footer struk.
          </p>
        </div>
      </div>

      {/* 1. TIER SUBSCRIPTION SELECTOR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            1. Pilihan Paket Berlangganan Tenant (Subscription Tiers)
          </h3>
          <div className="text-xs font-mono text-slate-400">
            Masa Aktif: <b className="text-emerald-500">{remainingMonths} Bulan Lagi</b> (s/d {expiryDate})
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* STARTER */}
          <div
            onClick={() => handleTierChange('starter')}
            className={`p-5 rounded-3xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
              subscriptionTier === 'starter'
                ? 'bg-red-50 dark:bg-red-950/40 border-red-500 shadow-md shadow-red-500/10'
                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-400'
            }`}
          >
            <div>
              <div className="flex justify-between items-start">
                <span className="text-xl">🥉</span>
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  Rp 149k/bln
                </span>
              </div>
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 mt-2">Paket Starter</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Khusus Kasir POS kilat, tiket dapur, dan CRM member sederhana. Mengandung watermark "Powered by Modula".
              </p>
            </div>
            <div className="text-[10px] font-bold text-red-600 dark:text-red-400 font-mono">
              {subscriptionTier === 'starter' ? '✓ Sedang Aktif' : 'Pilih Starter'}
            </div>
          </div>

          {/* BUSINESS */}
          <div
            onClick={() => handleTierChange('business')}
            className={`p-5 rounded-3xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
              subscriptionTier === 'business'
                ? 'bg-red-50 dark:bg-red-950/40 border-red-500 shadow-md shadow-red-500/10'
                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-400'
            }`}
          >
            <div>
              <div className="flex justify-between items-start">
                <span className="text-xl">🥈</span>
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  Rp 399k/bln
                </span>
              </div>
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 mt-2">Paket Business</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                POS + Akuntansi Buku Besar PSAK + Manajemen Gudang & Deadstock SCM Multi-Outlet.
              </p>
            </div>
            <div className="text-[10px] font-bold text-red-600 dark:text-red-400 font-mono">
              {subscriptionTier === 'business' ? '✓ Sedang Aktif' : 'Pilih Business'}
            </div>
          </div>

          {/* ENTERPRISE */}
          <div
            onClick={() => handleTierChange('enterprise')}
            className={`p-5 rounded-3xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
              subscriptionTier === 'enterprise'
                ? 'bg-red-50 dark:bg-red-950/40 border-red-500 shadow-md shadow-red-500/10'
                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-400'
            }`}
          >
            <div>
              <div className="flex justify-between items-start">
                <span className="text-xl">👑</span>
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full font-bold">
                  Rp 799k/bln (Full)
                </span>
              </div>
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 mt-2">Paket Enterprise (White-Label)</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Akses semua modul + AI Advisor + <b>White-Label Footer Struk</b> (Bebas dari watermark Modula).
              </p>
            </div>
            <div className="text-[10px] font-bold text-red-600 dark:text-red-400 font-mono">
              {subscriptionTier === 'enterprise' ? '✓ Sedang Aktif' : 'Pilih Enterprise'}
            </div>
          </div>
        </div>
      </div>

      {/* 2. WHITE-LABEL RECEIPT FOOTER CUSTOMIZER */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
        <div className="flex items-center space-x-2">
          <span className="text-xl">🏷️</span>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            2. Pengaturan White-Label Footer Struk (Fitur Enterprise)
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Ubah teks footer di bagian bawah struk konsumen menjadi nama/slogan brand Anda sendiri sehingga brand Modula hilang.
        </p>

        <div className="flex items-center space-x-2 pt-1">
          <input
            type="text"
            value={footerDraft}
            disabled={subscriptionTier !== 'enterprise'}
            onChange={(e) => setFooterDraft(e.target.value)}
            placeholder="Contoh: Terima Kasih • IG: @brandanda.id • Call: 0812345678"
            className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 disabled:opacity-50 font-semibold focus:outline-none focus:ring-1 focus:ring-red-500"
          />
          <button
            onClick={handleSaveFooter}
            disabled={subscriptionTier !== 'enterprise'}
            className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded-2xl text-xs shadow-md shadow-red-600/20"
          >
            Simpan Footer Struk
          </button>
        </div>
        {subscriptionTier !== 'enterprise' && (
          <div className="text-[10px] text-amber-500 font-mono">
            * Tingkatkan ke Paket Enterprise untuk mengaktifkan white-labeling kustom footer struk.
          </div>
        )}
      </div>

      {/* 3. GRANULAR PER-MODULE ADD-ON SWITCHER */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
          3. Granular Add-on Modular Switcher (Beli Per Modul)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((m) => (
            <div
              key={m.id}
              className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                    {m.code.toUpperCase()}
                  </span>
                  <span
                    className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded-full border ${
                      m.isUnlocked
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300'
                        : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-300'
                    }`}
                  >
                    {m.isUnlocked ? '🔓 UNLOCKED' : '🔒 LOCKED'}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-1">{m.name}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {m.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="text-xs font-mono font-bold text-red-600 dark:text-red-400">
                  Rp {(m.priceMonthly || 149000).toLocaleString('id-ID')}/bln
                </span>
                <button
                  onClick={() => {
                    toggleModuleLock(m.code);
                    toast.info('Status Modul Diubah', `${m.name} sekarang ${m.isUnlocked ? 'Terkunci' : 'Terbuka'}`);
                  }}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-sm ${
                    m.isUnlocked
                      ? 'bg-rose-600 hover:bg-rose-500 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {m.isUnlocked ? 'Kunci Modul' : 'Buka Kunci'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
