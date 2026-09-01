'use client';

import React from 'react';

export const AboutUsView: React.FC<{ onBackToHome?: () => void }> = ({ onBackToHome }) => {
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

        {/* Hero Banner */}
        <div className="bg-gradient-to-br from-slate-900 via-red-950 to-slate-900 border border-slate-800 rounded-3xl p-6 md:p-10 text-white shadow-xl relative overflow-hidden space-y-4">
          <div className="inline-flex items-center space-x-2 bg-red-600/30 border border-red-500/40 px-3 py-1 rounded-full text-xs font-mono font-bold text-red-300">
            <span>👑</span>
            <span>MODULA ENTERPRISE SAAS PLATFORM</span>
          </div>

          <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-tight">
            Memampukan Grup Konglomerasi & UMKM Mengelola Bisnis Tanpa Hambatan
          </h1>

          <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Modula adalah sistem operasi bisnis terpadu yang memadukan kecepatan terminal Kasir POS ultra-ringan, manajemen rantai pasok multi-gudang (SCM), dan pembukuan akuntansi Buku Besar standar PSAK dalam satu ekosistem modular berkinerja tinggi.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800 text-center">
            <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
              <div className="text-lg md:text-2xl font-black text-red-400 font-mono">&lt; 1 ms</div>
              <div className="text-[10px] text-slate-400">Response Latency</div>
            </div>
            <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
              <div className="text-lg md:text-2xl font-black text-amber-400 font-mono">99.99%</div>
              <div className="text-[10px] text-slate-400">SLA Uptime Cloud</div>
            </div>
            <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
              <div className="text-lg md:text-2xl font-black text-emerald-400 font-mono">100%</div>
              <div className="text-[10px] text-slate-400">PSAK Compliance</div>
            </div>
            <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
              <div className="text-lg md:text-2xl font-black text-purple-400 font-mono">AES-256</div>
              <div className="text-[10px] text-slate-400">Zero-Knowledge Vault</div>
            </div>
          </div>
        </div>

        {/* Vision & Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
            <span className="text-2xl">🎯</span>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Visi Kami</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Menjadi standar platform SaaS ERP-POS nomor 1 di Asia Tenggara yang menjembatani operasional toko fisik dengan analisis data kecerdasan buatan (AI) level korporasi.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
            <span className="text-2xl">🚀</span>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Misi Rekayasa</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Menghilangkan fragmentasi data antara kasir, gudang, dan laporan laba rugi. Menyajikan antarmuka super cepat yang ramah untuk seluruh kalangan karyawan dari generasi Z hingga sesepuh holding.
            </p>
          </div>
        </div>

        {/* Engineering Leadership & Author Section */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="text-xl">👨‍💻</span>
            <div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                Arsitektur & Kepemimpinan Rekayasa
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">
                Didesain dan dibangun dengan filosofi High-Performance & Clean Atomic Engineering
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-rose-500 text-white flex items-center justify-center font-bold text-xl shadow-lg shrink-0">
              PA
            </div>
            <div className="space-y-1 text-center sm:text-left flex-1">
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                Parikesit AD (parikesitad-pm)
              </h4>
              <p className="text-xs text-red-600 dark:text-red-400 font-mono">
                Principal Software Architect & Lead Creator
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Pelopor arsitektur modular multi-tenant Modula dengan fokus pada kecepatan rendering React sub-milidetik, integritas data PSAK double-entry, dan protokol isolasi data Zero-Knowledge.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                <a
                  href="https://github.com/parikesitad-pm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-[11px] font-mono font-bold bg-slate-900 text-white px-3 py-1 rounded-xl hover:bg-slate-800 transition-colors"
                >
                  <span>🐙 GitHub: @parikesitad-pm</span>
                </a>
                <a
                  href="https://github.com/aenzet04/adamproject.git"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-[11px] font-mono font-bold bg-red-600 text-white px-3 py-1 rounded-xl hover:bg-red-500 transition-colors"
                >
                  <span>📦 Target Repo: adamproject</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack Matrix */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3 text-xs">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 font-mono">
            ⚡ Fondasi Teknologi Modern
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-[11px]">
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
              <b className="text-slate-800 dark:text-slate-200 block">⚛️ React 18.3 & Vite</b>
              <span className="text-slate-400">Atomic UI & Hot Reload</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
              <b className="text-slate-800 dark:text-slate-200 block">💎 Ruby 3.2 & Rails</b>
              <span className="text-slate-400">High-Concurrency API</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
              <b className="text-slate-800 dark:text-slate-200 block">🐬 MariaDB / MySQL 8</b>
              <span className="text-slate-400">ACID Transactional Core</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
              <b className="text-slate-800 dark:text-slate-200 block">📫 Mailpit SMTP 1025</b>
              <span className="text-slate-400">Isolated Email Testing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
