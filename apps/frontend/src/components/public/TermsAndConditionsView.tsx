'use client';

import React from 'react';

export const TermsAndConditionsView: React.FC<{ onBackToHome?: () => void }> = ({ onBackToHome }) => {
  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 md:p-8 space-y-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {onBackToHome && (
          <button
            type="button"
            onClick={onBackToHome}
            className="text-xs font-bold text-slate-500 hover:text-red-600 flex items-center space-x-1.5 transition-colors"
          >
            <span>⬅</span>
            <span>Kembali ke Workspace</span>
          </button>
        )}

        {/* Header */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-3">
          <div className="inline-flex items-center space-x-2 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 font-mono px-3 py-1 rounded-full text-xs font-bold">
            <span>📜</span>
            <span>SYARAT & KETENTUAN LAYANAN SAAS</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100">
            Syarat dan Ketentuan Penggunaan Modula Enterprise
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Terakhir diperbarui: 1 September 2026 • Versi Kontrak: v3.2-Legal
          </p>
        </div>

        {/* Legal Body Sections */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <span className="text-red-600 font-mono">1.</span>
              <span>Penerimaan Ketentuan & Definisi Layanan</span>
            </h2>
            <p>
              Dengan mendaftar, mengakses, atau menggunakan platform <b>Modula Enterprise SaaS</b> ("Layanan"), Anda ("Pelanggan / Tenant / Holding") menyatakan setuju untuk terikat oleh seluruh Syarat dan Ketentuan ini. Modula menyediakan platform cloud ERP-POS, manajemen stok multi-gudang, pembukuan akuntansi PSAK, dan kolaborasi tim terintegrasi.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <span className="text-red-600 font-mono">2.</span>
              <span>Kepemilikan Data & Protokol Zero-Knowledge Privacy</span>
            </h2>
            <p>
              <b>2.1 Hak Milik Data:</b> Seluruh data transaksi kasir, master data produk, resep, database pelanggan CRM, dan laporan keuangan adalah hak milik eksklusif dari pihak Pelanggan (Tenant).
            </p>
            <p>
              <b>2.2 Isolasi Privasi Super User:</b> Pengelola platform (Super User) tidak memiliki wewenang untuk membuka, membaca, atau mengekstrak rincian transaksi cabang tanpa otorisasi tertulis atau tiket audit permohonan resmi (#TCK) yang disetujui oleh Owner / General Manager.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <span className="text-red-600 font-mono">3.</span>
              <span>Tanggung Jawab Akun & Keamanan PIN Kasir</span>
            </h2>
            <p>
              Pelanggan bertanggung jawab penuh atas kerahasiaan kata sandi dan PIN kasir staf. Kasir wajib mengubah PIN default (0000) pada saat pertama kali login. Segala transaksi yang dicatatkan atas nama kredensial kasir yang sah dianggap sebagai tindakan resmi yang sah dari Pelanggan.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <span className="text-red-600 font-mono">4.</span>
              <span>Kepatuhan Akuntansi & Perpajakan (PSAK Compliance)</span>
            </h2>
            <p>
              Modula menyediakan kalkulasi HPP dan posting jurnal otomatis berbasis standar PSAK Indonesia. Pelanggan bertanggung jawab memastikan kebenaran input nilai modal barang (standard cost) dan konfigurasi tarif pajak pertambahan nilai (PPN/PB1) sesuai peraturan perundang-undangan perpajakan Republik Indonesia.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <span className="text-red-600 font-mono">5.</span>
              <span>Service Level Agreement (SLA) & Ketersediaan Sistem</span>
            </h2>
            <p>
              Modula berkomitmen memberikan uptime ketersediaan server sebesar <b>99.9%</b> per bulan kalender. Pemeliharaan terjadwal akan diinformasikan sekurang-kurangnya 24 jam sebelum eksekusi melalui Happening Now Live Beacon atau email holding.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <span className="text-red-600 font-mono">6.</span>
              <span>Ketentuan Berlangganan, Add-On & Pembatalan</span>
            </h2>
            <p>
              Langganan dihitung berdasarkan paket (Starter, Business, Enterprise) dengan termin bulanan atau tahunan. Add-on fitur (seperti Realtime Chat) dapat ditambahkan atau dinonaktifkan sewaktu-waktu. Pengembalian dana (refund) prorata tidak berlaku untuk periode yang telah berjalan.
            </p>
          </section>

          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 font-mono">
            ⚖️ Yurisdiksi Hukum: Ketentuan ini diatur dan ditafsirkan berdasarkan hukum Republik Indonesia. Setiap sengketa akan diselesaikan melalui musyawarah mufakat atau Badan Arbitrase Nasional Indonesia (BANI).
          </div>
        </div>
      </div>
    </div>
  );
};
