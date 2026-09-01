'use client';

import React, { useState } from 'react';

interface PublicLandingPageProps {
  onEnterApp: () => void;
}

export const PublicLandingPage: React.FC<PublicLandingPageProps> = ({ onEnterApp }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const pricingTiers = [
    {
      id: 'starter',
      name: 'Pemula / Entry Level',
      subtitle: 'Cocok untuk 1 Outlet UMKM, Cafe & Toko Kelontong',
      badge: 'STARTER',
      priceMonthly: 149000,
      priceAnnualPerMonth: 119000,
      features: [
        '1 Brand & 1 Cabang Aktif',
        'Kasir POS Omnichannel (Dine-in, Takeaway, Grab, Gojek)',
        'Cetak Struk Bluetooth Thermal 58mm & 80mm',
        'Laporan Penjualan Harian Standar',
        'Manajemen 1 Gudang Toko',
        'Dukungan Komunitas & Update Otomatis',
      ],
      cta: 'Mulai Paket Pemula',
      popular: false,
    },
    {
      id: 'business',
      name: 'Business / Menengah',
      subtitle: 'Untuk Bisnis Berkembang dengan Banyak Cabang & Gudang',
      badge: 'PALING POPULER',
      priceMonthly: 349000,
      priceAnnualPerMonth: 279000,
      features: [
        'Hingga 5 Cabang & 5 Gudang Terintegrasi',
        'Seluruh Fitur Paket Pemula',
        'Stok Opname Fisik & Mutasi Antar Cabang',
        'Klasifikasi Fast / Slow / Dead Stock SCM',
        'CRM Loyalitas Member, Poin & Top Spender',
        'Realtime Team Chat & Direct Messaging',
        'Split Bill 3-Mode & Dual Multi-Payment',
      ],
      cta: 'Coba Paket Business 14 Hari',
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise Holding',
      subtitle: 'Solusi Lengkap Konglomerasi Multi-Brand & Multi-Entitas',
      badge: 'ENTERPRISE',
      priceMonthly: 799000,
      priceAnnualPerMonth: 639000,
      features: [
        'Unlimited Brand, Cabang & Gudang Holding',
        'Seluruh Fitur Paket Business',
        'Akuntansi & General Ledger Double-Entry PSAK',
        'Laporan Laba Rugi, Neraca & Arus Kas Otomatis',
        'Protokol Privasi Zero-Knowledge & Tiket Audit',
        'Slide Presentasi Investor PowerPoint Interaktif',
        'Multi-Tier Switcher Holding (PT/CV/Perorangan)',
        'Dedicated Server & SLA 99.99%',
      ],
      cta: 'Hubungi Tim Enterprise',
      popular: false,
    },
  ];

  const addOnCatalog = [
    { code: 'pos', name: 'POS & Kasir Omnichannel', price: 149000, icon: '🛒', desc: 'Kasir kilat, split bill 3-mode, tiket dapur & cetak thermal bluetooth.' },
    { code: 'crm', name: 'CRM & Member Loyalty', price: 199000, icon: '👥', desc: 'Database jutaan pelanggan, loyalty point reward, tiering, dan rekap belanja.' },
    { code: 'finance', name: 'Akuntansi GL (PSAK)', price: 299000, icon: '📊', desc: 'Auto-posting debit/kredit POS ke buku besar, laba rugi, dan neraca konsolidasi.' },
    { code: 'inventory', name: 'Gudang & Dead Stock SCM', price: 249000, icon: '📦', desc: 'Moving average costing, mutasi stok antar cabang, dan alert dead stock AI.' },
    { code: 'chat', name: 'Realtime Team Chat & DM', price: 49000, icon: '💬', desc: 'Chat internal brand & cabang, direct message, lampiran foto, dan live polling.' },
    { code: 'warehouse', name: 'Multi-Warehouse & Tukar Guling', price: 99000, icon: '🏭', desc: 'Kelola multi-gudang konsinyasi, transit, dan stok opname barcode scanner.' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-red-500 selection:text-white">
      {/* 1. TOP NAVBAR */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-red-600/30">
            M
          </div>
          <div>
            <div className="font-black text-base tracking-tight flex items-center space-x-1.5">
              <span>MODULA</span>
              <span className="text-[10px] bg-red-600/20 text-red-400 font-mono px-2 py-0.2 rounded-full border border-red-500/30">
                v3.2.0-enterprise
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">Enterprise ERP-POS & Financial Core</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-6 text-xs font-semibold text-slate-300">
          <a href="#features" className="hover:text-red-400 transition-colors">Fitur Unggulan</a>
          <a href="#pricing" className="hover:text-red-400 transition-colors">Paket Langganan</a>
          <a href="#addons" className="hover:text-red-400 transition-colors">Katalog Add-On</a>
          <a href="#benchmark" className="hover:text-red-400 transition-colors">Benchmark</a>
        </nav>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onEnterApp}
            className="bg-red-600 hover:bg-red-500 text-white font-bold px-5 py-2.5 rounded-2xl text-xs shadow-lg shadow-red-600/30 active:scale-95 transition-all flex items-center space-x-1.5"
          >
            <span>Buka Dashboard App</span>
            <span>➔</span>
          </button>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-16 pb-20 px-6 max-w-7xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center space-x-2 bg-red-950/60 border border-red-500/30 px-4 py-1.5 rounded-full text-xs text-red-300 font-mono font-bold">
          <span>✨</span>
          <span>SaaS ERP-POS & Financial Core Multi-Tenant #1 di Indonesia</span>
        </div>

        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Kelola Multi-Brand, Multi-Cabang & Laporan PSAK dalam <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400">Satu Platform Terintegrasi</span>
        </h1>

        <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Dari kasir POS berkecepatan sub-milidetik, split bill cerdas, SCM gudang moving average, hingga auto-posting buku besar debit/kredit berstandar PSAK dengan privasi Zero-Knowledge.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            type="button"
            onClick={onEnterApp}
            className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold px-8 py-3.5 rounded-2xl text-sm shadow-xl shadow-red-600/30 active:scale-95 transition-all flex items-center justify-center space-x-2"
          >
            <span>🚀 Coba Demo Kasir POS & ERP</span>
            <span>➔</span>
          </button>
          <a
            href="#pricing"
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold px-6 py-3.5 rounded-2xl text-sm transition-all"
          >
            Lihat Harga Paket Langganan
          </a>
        </div>

        {/* Feature Highlights Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-12 text-left">
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-1">
            <span className="text-xl">⚡</span>
            <div className="font-bold text-xs text-white">Sub-Millisecond Speed</div>
            <p className="text-[11px] text-slate-400">Kinerja kilat 0.42 ms render time & zero frame drop.</p>
          </div>
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-1">
            <span className="text-xl">📊</span>
            <div className="font-bold text-xs text-white">Double-Entry PSAK</div>
            <p className="text-[11px] text-slate-400">Jurnal kasir otomatis ter-posting ke Laba Rugi & Neraca.</p>
          </div>
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-1">
            <span className="text-xl">🛡️</span>
            <div className="font-bold text-xs text-white">Zero-Knowledge Privacy</div>
            <p className="text-[11px] text-slate-400">Kerahasiaan data bisnis holding terenkripsi penuh.</p>
          </div>
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-1">
            <span className="text-xl">💬</span>
            <div className="font-bold text-xs text-white">Realtime Team Collaboration</div>
            <p className="text-[11px] text-slate-400">Chat brand & cabang, live polling, dan emoji korporat.</p>
          </div>
        </div>
      </section>

      {/* 3. PRICING SECTION */}
      <section id="pricing" className="py-16 px-6 max-w-7xl mx-auto space-y-8 border-t border-slate-800/80">
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-4xl font-black text-white">
            Pilihan Paket Berlangganan Transparan & Fleksibel
          </h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-lg mx-auto">
            Pilih paket yang sesuai dengan skala bisnis Anda. Tingkatkan atau ganti paket kapan saja.
          </p>

          {/* Billing Cycle Switcher */}
          <div className="inline-flex items-center p-1.5 bg-slate-900 border border-slate-800 rounded-2xl space-x-1 mt-4">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tagihan Bulanan
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                billingCycle === 'annual'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Tagihan Tahunan</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-mono px-1.5 py-0.2 rounded font-bold">
                HEMAT 25%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
          {pricingTiers.map((tier) => {
            const displayPrice = billingCycle === 'annual' ? tier.priceAnnualPerMonth : tier.priceMonthly;

            return (
              <div
                key={tier.id}
                className={`rounded-3xl p-6 md:p-8 flex flex-col justify-between space-y-6 transition-all relative ${
                  tier.popular
                    ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-red-950/40 border-2 border-red-500 shadow-2xl shadow-red-600/20 ring-1 ring-red-500/50'
                    : 'bg-slate-900/60 border border-slate-800'
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-red-600 to-rose-500 text-white font-mono font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                    {tier.badge}
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{tier.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{tier.subtitle}</p>
                  </div>

                  <div className="pt-2">
                    <div className="flex items-baseline space-x-1">
                      <span className="text-2xl md:text-3xl font-black font-mono text-white">
                        Rp {displayPrice.toLocaleString('id-ID')}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">/ bulan</span>
                    </div>
                    {billingCycle === 'annual' && (
                      <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                        Ditagih tahunan Rp {(displayPrice * 12).toLocaleString('id-ID')} (Hemat 2 Bulan)
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-800 space-y-2.5">
                    <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider font-mono">
                      Fitur Termasuk:
                    </div>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {tier.features.map((f, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <span className="text-red-400 font-bold">✓</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onEnterApp}
                  className={`w-full py-3 rounded-2xl font-bold text-xs transition-all active:scale-95 ${
                    tier.popular
                      ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                  }`}
                >
                  {tier.cta}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. ADD-ON CATALOGUE */}
      <section id="addons" className="py-16 px-6 max-w-7xl mx-auto space-y-8 border-t border-slate-800/80">
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-4xl font-black text-white">
            Katalog Modul Add-On Modular
          </h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-lg mx-auto">
            Hanya bayar modul yang Anda butuhkan. Tambahkan fitur kapan saja tanpa mengubah paket dasar Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {addOnCatalog.map((addon) => (
            <div
              key={addon.code}
              className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-2xl">{addon.icon}</span>
                  <span className="font-mono font-bold text-xs text-red-400 bg-red-950/40 px-2.5 py-1 rounded-xl border border-red-800/50">
                    Rp {addon.price.toLocaleString('id-ID')}/bln
                  </span>
                </div>
                <h3 className="font-bold text-sm text-white">{addon.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{addon.desc}</p>
              </div>

              <button
                type="button"
                onClick={onEnterApp}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700"
              >
                + Tambahkan Modul
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="border-t border-slate-800 py-10 px-6 max-w-7xl mx-auto text-center text-xs text-slate-500 space-y-3">
        <div className="flex justify-center items-center space-x-2 text-slate-400 font-bold">
          <span>Modula Enterprise SaaS</span>
          <span>•</span>
          <span>Arsitektur Multi-Tenant PT Multi Industri Nusantara</span>
        </div>
        <p>© 2026 Modula Core Platform. Dikembangkan oleh <b className="text-slate-300">parikesitad-pm</b>.</p>
      </footer>
    </div>
  );
};
