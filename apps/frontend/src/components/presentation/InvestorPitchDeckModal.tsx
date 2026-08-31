'use client';

import React, { useState, useEffect } from 'react';
import { useTenantStore } from '../../stores/useTenantStore';
import { exportToExcelCsv, triggerPrintPdf } from '../../lib/exportUtils';
import { toast } from '../../stores/useToastStore';

interface InvestorPitchDeckModalProps {
  onClose: () => void;
}

export const InvestorPitchDeckModal: React.FC<InvestorPitchDeckModalProps> = ({ onClose }) => {
  const { currentTenant, currentBrand, availableBranches } = useTenantStore();
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const totalSlides = 5;

  const nextSlide = () => setCurrentSlide((prev) => (prev < totalSlides ? prev + 1 : 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev > 1 ? prev - 1 : totalSlides));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlay) {
      interval = setInterval(() => {
        nextSlide();
      }, 6000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlay, currentSlide]);

  const handleExportFinancialExcel = () => {
    const headers = ['Komponen Keuangan', 'Q1 2026 (Rp)', 'Q2 2026 (Rp)', 'Q3 2026 (Rp)', 'Pertumbuhan (%)'];
    const rows = [
      ['Pendapatan Penjualan Bersih (Net Revenue)', '385.000.000', '412.000.000', '446.960.000', '+16.1%'],
      ['Beban Pokok Penjualan (HPP / COGS)', '154.000.000', '164.800.000', '180.330.000', '+17.1%'],
      ['Laba Kotor (Gross Profit)', '231.000.000', '247.200.000', '266.630.000', '+15.4%'],
      ['Beban Operasional & Gaji (OpEx)', '115.000.000', '124.000.000', '134.400.000', '+16.8%'],
      ['Laba Bersih Sebelum Pajak (EBITDA)', '116.000.000', '123.200.000', '132.230.000', '+14.0%'],
    ];
    exportToExcelCsv(`Laporan_Investor_${currentBrand?.name || 'Modula'}_2026`, rows, headers);
    toast.success('Ekspor Excel Berhasil', 'Data proyeksi finansial investor telah diunduh.');
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between text-white font-sans overflow-hidden">
      {/* 1. TOP PRESENTATION CONTROLS BAR */}
      <header className="px-6 py-3 bg-slate-900/80 border-b border-slate-800/80 flex justify-between items-center z-20">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center font-black text-xs shadow-md shadow-red-600/30">
            M
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xs text-white">
                {currentBrand?.name || 'Kopi Nusantara'} — Investor Pitch Deck & Financial Executive Review
              </span>
              <span className="bg-red-950 text-red-400 border border-red-800 text-[9px] font-mono px-2 py-0.5 rounded-full font-bold">
                SLIDE {currentSlide} OF {totalSlides}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              Holding: {currentTenant?.name || 'PT Multi Industri Nusantara'} • Periode YTD 2026
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Auto Play Toggle */}
          <button
            type="button"
            onClick={() => {
              setIsAutoPlay(!isAutoPlay);
              toast.info(isAutoPlay ? 'Auto-Play Dimatikan' : 'Auto-Play Slide Aktif (6s)');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              isAutoPlay
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <span>{isAutoPlay ? '⏸️' : '▶️'}</span>
            <span>{isAutoPlay ? 'Auto-Play Aktif' : 'Auto-Play'}</span>
          </button>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={toggleFullScreen}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold"
            title="Toggle Fullscreen"
          >
            ⛶
          </button>

          {/* Export to Excel */}
          <button
            type="button"
            onClick={handleExportFinancialExcel}
            className="bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-md shadow-emerald-700/20 flex items-center space-x-1.5"
          >
            <span>📊</span>
            <span>Export Excel</span>
          </button>

          {/* Print to PDF */}
          <button
            type="button"
            onClick={() => triggerPrintPdf(`Investor_Deck_${currentBrand?.name || 'Modula'}`)}
            className="bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-md shadow-red-600/20 flex items-center space-x-1.5"
          >
            <span>🖨️</span>
            <span>Export PDF Slide</span>
          </button>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-white w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm ml-2"
          >
            ✕
          </button>
        </div>
      </header>

      {/* 2. MAIN SLIDE STAGE */}
      <main className="flex-1 flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* SLIDE 1: EXECUTIVE SUMMARY & GROWTH HIGHLIGHTS */}
        {currentSlide === 1 && (
          <div className="max-w-4xl w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
              <div>
                <span className="text-red-400 font-mono text-xs font-bold uppercase tracking-wider block">
                  Slide 01 • Executive Summary
                </span>
                <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
                  Kinerja Finansial & Ekspansi Bisnis {currentBrand?.name || 'Brand'}
                </h1>
                <p className="text-xs text-slate-400 italic font-serif mt-1">
                  "{currentBrand?.tagline || 'Cita Rasa Autentik Nusantara, Disajikan dengan Sepenuh Hati'}"
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-slate-400 block">Valuasi Enterprise:</span>
                <span className="text-2xl font-black font-mono text-emerald-400">Rp 18,5 Miliar</span>
              </div>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800">
                <span className="text-[11px] font-mono text-slate-400 block">Total Omset Bulanan:</span>
                <span className="text-xl font-black font-mono text-white mt-1 block">Rp 446,96 Jt</span>
                <span className="text-[10px] text-emerald-400 font-bold">+28.4% MoM Growth</span>
              </div>

              <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800">
                <span className="text-[11px] font-mono text-slate-400 block">Gross Profit Margin:</span>
                <span className="text-xl font-black font-mono text-emerald-400 mt-1 block">59.6%</span>
                <span className="text-[10px] text-slate-400">Laba Kotor Bersih</span>
              </div>

              <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800">
                <span className="text-[11px] font-mono text-slate-400 block">Net EBITDA:</span>
                <span className="text-xl font-black font-mono text-red-400 mt-1 block">Rp 132,23 Jt</span>
                <span className="text-[10px] text-emerald-400 font-bold">29.6% Margin Laba</span>
              </div>

              <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800">
                <span className="text-[11px] font-mono text-slate-400 block">Outlet & Cabang Aktif:</span>
                <span className="text-xl font-black font-mono text-white mt-1 block">
                  {availableBranches.length} Cabang
                </span>
                <span className="text-[10px] text-slate-400">100% Menguntungkan</span>
              </div>
            </div>

            {/* Narrative Summary */}
            <div className="p-4 bg-red-950/20 rounded-2xl border border-red-800/40 text-xs text-slate-300 leading-relaxed">
              💡 <b>Sorotan Kunci bagi Investor:</b> Model bisnis memiliki <i>unit economics</i> yang sangat kuat dengan <i>payback period</i> di bawah 8 bulan per cabang. Sistem operasional telah didukung penuh oleh arsitektur Modula Modular ERP-POS, menjamin transparansi pencatatan akuntansi PSAK secara <i>real-time</i> tanpa celah kebocoran transaksi.
            </div>
          </div>
        )}

        {/* SLIDE 2: INCOME STATEMENT / LABA RUGI BREAKDOWN */}
        {currentSlide === 2 && (
          <div className="max-w-4xl w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 animate-fadeIn">
            <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
              <div>
                <span className="text-red-400 font-mono text-xs font-bold uppercase tracking-wider block">
                  Slide 02 • Financial Performance
                </span>
                <h2 className="text-2xl font-black text-white mt-1">
                  Struktur Laba Rugi (Profit & Loss Statement)
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-400">Periode: Agustus 2026 (PSAK)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* Left Breakdown */}
              <div className="space-y-3 bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
                <div className="flex justify-between items-center font-bold text-slate-300 border-b border-slate-800 pb-2">
                  <span>Komponen Pendapatan & Beban</span>
                  <span>Nominal (Rp)</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Penjualan Bersih F&B & Retail:</span>
                  <span className="font-mono font-bold text-white">Rp 446.960.000</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Beban Pokok Penjualan (HPP):</span>
                  <span className="font-mono text-rose-400">- Rp 180.330.000</span>
                </div>
                <div className="flex justify-between items-center font-bold text-emerald-400 border-t border-slate-800 pt-2">
                  <span>Laba Kotor (Gross Profit):</span>
                  <span className="font-mono text-sm">Rp 266.630.000</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Beban Operasional, Gaji & Sewa:</span>
                  <span className="font-mono text-rose-400">- Rp 134.400.000</span>
                </div>
                <div className="flex justify-between items-center font-black text-base text-red-400 border-t-2 border-red-500/50 pt-2">
                  <span>Laba Bersih Operasional:</span>
                  <span className="font-mono">Rp 132.230.000</span>
                </div>
              </div>

              {/* Right Expense Visual Ratio */}
              <div className="space-y-3 bg-slate-950/80 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="font-bold text-slate-300 text-xs block mb-3">Distribusi Alokasi Biaya (Cost Allocation):</span>
                  <div className="space-y-2 font-mono text-[11px]">
                    <div>
                      <div className="flex justify-between text-slate-400 mb-1">
                        <span>HPP Bahan Baku (35.2%)</span>
                        <span>Rp 180,33 Jt</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-rose-500 w-[35.2%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-400 mb-1">
                        <span>Gaji & SDM Staf (18.3%)</span>
                        <span>Rp 82,00 Jt</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 w-[18.3%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-400 mb-1">
                        <span>Sewa Outlet & Utilitas (8.3%)</span>
                        <span>Rp 37,40 Jt</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[8.3%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-emerald-400 font-bold mb-1">
                        <span>Net Profit Retained (29.6%)</span>
                        <span>Rp 132,23 Jt</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[29.6%]" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 italic">
                  *Audit internal otomatis diverifikasi via Double-Entry General Ledger.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 3: BALANCE SHEET & ASSETS */}
        {currentSlide === 3 && (
          <div className="max-w-4xl w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 animate-fadeIn">
            <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
              <div>
                <span className="text-red-400 font-mono text-xs font-bold uppercase tracking-wider block">
                  Slide 03 • Balance Sheet & Asset Health
                </span>
                <h2 className="text-2xl font-black text-white mt-1">
                  Kekuatan Neraca & Likuiditas Aset
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-400">Rasio Lancar: 3.4x (Sangat Sehat)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-slate-400 font-mono font-bold block uppercase text-[10px]">
                  🏛️ Aset Lancar (Current Assets)
                </span>
                <div className="space-y-1 font-mono">
                  <div className="text-xl font-black text-emerald-400">Rp 1.450.000.000</div>
                  <p className="text-[11px] text-slate-400">• Kas di Bank: Rp 890 Jt</p>
                  <p className="text-[11px] text-slate-400">• Persediaan Gudang: Rp 420 Jt</p>
                  <p className="text-[11px] text-slate-400">• Piutang Usaha: Rp 140 Jt</p>
                </div>
              </div>

              <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-slate-400 font-mono font-bold block uppercase text-[10px]">
                  ☕ Aset Tetap & Peralatan (Fixed)
                </span>
                <div className="space-y-1 font-mono">
                  <div className="text-xl font-black text-white">Rp 3.200.000.000</div>
                  <p className="text-[11px] text-slate-400">• Mesin Espresso La Marzocco</p>
                  <p className="text-[11px] text-slate-400">• Fit-Out Interior & Booth</p>
                  <p className="text-[11px] text-slate-400">• POS Hardware & Server</p>
                </div>
              </div>

              <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-slate-400 font-mono font-bold block uppercase text-[10px]">
                  🛡️ Liabilitas & Ekuitas Modal
                </span>
                <div className="space-y-1 font-mono">
                  <div className="text-xl font-black text-red-400">Rp 4.650.000.000</div>
                  <p className="text-[11px] text-slate-400">• Total Hutang: Rp 420 Jt (9%)</p>
                  <p className="text-[11px] text-emerald-400 font-bold">• Ekuitas Modal: Rp 4,23 Miliar</p>
                  <p className="text-[11px] text-slate-400">• Debt-to-Equity: 0.1x</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-emerald-950/20 rounded-2xl border border-emerald-800/40 text-xs text-slate-300">
              ✅ <b>Likuiditas Super Kuat:</b> Beban utang sangat rendah (&lt;10% dari total aset), dengan modal kerja kas lancar yang siap mendanai ekspansi 3-5 outlet baru secara mandiri (*self-sustaining growth*).
            </div>
          </div>
        )}

        {/* SLIDE 4: MULTI-BRANCH UNIT ECONOMICS */}
        {currentSlide === 4 && (
          <div className="max-w-4xl w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 animate-fadeIn">
            <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
              <div>
                <span className="text-red-400 font-mono text-xs font-bold uppercase tracking-wider block">
                  Slide 04 • Multi-Branch Unit Economics
                </span>
                <h2 className="text-2xl font-black text-white mt-1">
                  Performa & Produktivitas Setiap Cabang Outlet
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-400">Rata-rata 240 Transaksi/Hari</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-slate-950/80 rounded-2xl border border-red-500/50 space-y-2">
                <span className="bg-red-950 text-red-400 font-mono font-bold px-2 py-0.5 rounded text-[10px]">
                  FLAGSHIP STORE
                </span>
                <h3 className="font-bold text-sm text-white">Outlet Grand Indonesia</h3>
                <div className="space-y-1 font-mono text-slate-300 pt-1">
                  <div>Omset: <b>Rp 245,5 Jt/bln</b></div>
                  <div>Avg Ticket: <b>Rp 64.500</b></div>
                  <div className="text-emerald-400">Net Profit: <b>Rp 78,2 Jt</b> (31.8%)</div>
                </div>
              </div>

              <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
                <span className="bg-slate-800 text-slate-300 font-mono font-bold px-2 py-0.5 rounded text-[10px]">
                  STORE REGULER
                </span>
                <h3 className="font-bold text-sm text-white">Outlet Senopati</h3>
                <div className="space-y-1 font-mono text-slate-300 pt-1">
                  <div>Omset: <b>Rp 142,8 Jt/bln</b></div>
                  <div>Avg Ticket: <b>Rp 58.200</b></div>
                  <div className="text-emerald-400">Net Profit: <b>Rp 39,5 Jt</b> (27.6%)</div>
                </div>
              </div>

              <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
                <span className="bg-slate-800 text-slate-300 font-mono font-bold px-2 py-0.5 rounded text-[10px]">
                  STORE REGULER
                </span>
                <h3 className="font-bold text-sm text-white">Store Kelapa Gading</h3>
                <div className="space-y-1 font-mono text-slate-300 pt-1">
                  <div>Omset: <b>Rp 58,6 Jt/bln</b></div>
                  <div>Avg Ticket: <b>Rp 52.000</b></div>
                  <div className="text-emerald-400">Net Profit: <b>Rp 14,5 Jt</b> (24.7%)</div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-950/90 rounded-2xl border border-slate-800 text-xs text-slate-300">
              📊 <b>Konsistensi Profitabilitas:</b> Seluruh cabang outlet menghasilkan *cashflow* operasional positif sejak bulan kedua pembukaan.
            </div>
          </div>
        )}

        {/* SLIDE 5: EXPANSION ROADMAP & INVESTOR OPPORTUNITY */}
        {currentSlide === 5 && (
          <div className="max-w-4xl w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 animate-fadeIn">
            <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
              <div>
                <span className="text-red-400 font-mono text-xs font-bold uppercase tracking-wider block">
                  Slide 05 • Growth Roadmap & Investment
                </span>
                <h2 className="text-2xl font-black text-white mt-1">
                  Rencana Ekspansi Q4 2026 & Proyeksi 2027
                </h2>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold">Target: 15 Outlet</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-center">
              <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-2xl block">🚀</span>
                <h4 className="font-bold text-white text-sm">Fase 1: Ekspansi 5 Outlet</h4>
                <p className="text-[11px] text-slate-400">
                  Pembukaan cabang di BSD, PIK 2, Bandung, Surabaya, dan Bali.
                </p>
                <div className="font-mono text-red-400 font-bold pt-2">Q4 2026</div>
              </div>

              <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-2xl block">🏭</span>
                <h4 className="font-bold text-white text-sm">Fase 2: Central Roastery</h4>
                <p className="text-[11px] text-slate-400">
                  Pusat roasting biji kopi & rantai pasok terpusat untuk efisiensi margin +12%.
                </p>
                <div className="font-mono text-amber-400 font-bold pt-2">Q1 2027</div>
              </div>

              <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-2xl block">💰</span>
                <h4 className="font-bold text-white text-sm">Proyeksi Omset 2027</h4>
                <p className="text-[11px] text-slate-400">
                  Estimasi pendapatan konsolidasi mencapai Rp 12,8 Miliar / tahun.
                </p>
                <div className="font-mono text-emerald-400 font-bold pt-2">FY 2027 Target</div>
              </div>
            </div>

            <div className="p-5 bg-gradient-to-r from-red-950/50 via-rose-950/30 to-slate-950 rounded-2xl border border-red-800/50 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h4 className="font-bold text-white text-sm">Tertarik Berinvestasi / Kemitraan?</h4>
                <p className="text-xs text-slate-300">
                  Hubungi tim eksekutif holding kami untuk mendapatkan draft Memorandum Investasi lengkap.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  window.open(`https://wa.me/6281299001122?text=Halo%20Executive%20Team%20${currentBrand?.name},%20saya%20tertarik%20membahas%20investasi%20ekspansi%20bisnis.`, '_blank');
                }}
                className="bg-red-600 hover:bg-red-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-lg shadow-red-600/30 whitespace-nowrap active:scale-95"
              >
                💬 Hubungi Eksekutif via WA
              </button>
            </div>
          </div>
        )}
      </main>

      {/* 3. BOTTOM SLIDE NAVIGATION & DOTS BAR */}
      <footer className="px-6 py-3 bg-slate-900/80 border-t border-slate-800/80 flex justify-between items-center z-20">
        <button
          type="button"
          onClick={prevSlide}
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-1.5 rounded-xl text-xs flex items-center space-x-1.5"
        >
          <span>❮</span>
          <span>Slide Sebelumnya</span>
        </button>

        {/* Slide Indicator Dots */}
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setCurrentSlide(s)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === s ? 'w-8 bg-red-600' : 'w-2 bg-slate-700 hover:bg-slate-500'
              }`}
              title={`Pindah ke Slide ${s}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={nextSlide}
          className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-1.5 rounded-xl text-xs shadow-md shadow-red-600/20 flex items-center space-x-1.5"
        >
          <span>Slide Berikutnya</span>
          <span>❯</span>
        </button>
      </footer>
    </div>
  );
};
