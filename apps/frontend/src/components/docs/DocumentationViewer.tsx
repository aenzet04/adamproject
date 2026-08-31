'use client';

import React, { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Slide {
  id: number;
  tag: string;
  title: string;
  subtitle: string;
  points: Array<{ title: string; desc: string; icon: string }>;
  codeSnippet?: string;
  footerNote: string;
}

const PRESENTATION_SLIDES: Slide[] = [
  {
    id: 1,
    tag: 'EXECUTIVE OVERVIEW',
    title: 'Enterprise Multi-Tenant SaaS ERP-POS & Financial Core',
    subtitle: 'Arsitektur Next-Gen Pengganti Odoo, Accurate, dan Jurnal.id',
    points: [
      {
        icon: '🏛️',
        title: 'Hierarki Tenancy 3-Tier',
        desc: 'Holding Group -> Brand / Business Unit -> Outlet Store -> Multi-Warehouse.',
      },
      {
        icon: '⚡',
        title: 'Real-time Double-Entry Posting',
        desc: 'Setiap transaksi POS otomatis menjurnal HPP, Pendapatan, Pajak, dan Kas.',
      },
      {
        icon: '📱',
        title: 'Offline-First POS & Peripherals',
        desc: 'Dukungan Bluetooth Thermal 58mm ESC/POS, Tiket Dapur, & E-Struk WhatsApp.',
      },
    ],
    footerNote: 'Dokumentasi Sistem Resmi - Created by parikesitad-pm x aenzet04',
  },
  {
    id: 2,
    tag: 'TECH STACK & ARCHITECTURE',
    title: 'Modern Monorepo Stack: Rails 8 API + React 19',
    subtitle: 'Dirancang untuk Skalabilitas Jutaan Baris Data & Latensi Rendah',
    points: [
      {
        icon: '💎',
        title: 'Backend Rails 8 API & Modular Engines',
        desc: 'Terisolasi dalam 6 modular engines (core, pos, finance, inventory, hr, audit).',
      },
      {
        icon: '⚛️',
        title: 'Frontend React 19 & Next.js App Router',
        desc: 'Tailwind CSS, Shadcn UI, Zustand State, dan optimasi SSR chunking gzipped 20kB.',
      },
      {
        icon: '🐬',
        title: 'Database MySQL 8.0 / MariaDB',
        desc: 'InnoDB engine, utf8mb4 collation, UUIDv4 keys, dan Row-Level Security isolation.',
      },
    ],
    codeSnippet: `adamProject/
├── apps/
│   ├── backend/ (Rails 8 API + Engines)
│   └── frontend/ (React 19 + Zustand)
└── packages/ (Shared Types & Config)`,
    footerNote: 'Slide 2 dari 6 - Arsitektur Monorepo',
  },
  {
    id: 3,
    tag: 'FINANCIAL CORE ENGINE',
    title: 'Double-Entry General Ledger (PSAK / IFRS)',
    subtitle: 'Integritas Pembukuan Otomatis dengan Presisi BigDecimal 0.001',
    points: [
      {
        icon: '💳',
        title: 'Debit: Penerimaan Pembayaran',
        desc: 'Akun Kas, Bank QRIS, EDC BCA/Mandiri, atau Piutang Pelanggan.',
      },
      {
        icon: '📈',
        title: 'Kredit: Pendapatan & Pajak',
        desc: 'Pendapatan Penjualan Produk, Hutang PPN Keluaran 11%, dan Service Charge.',
      },
      {
        icon: '📦',
        title: 'Debit/Kredit HPP & Persediaan',
        desc: 'Debit Beban HPP (Moving Average Cost) & Kredit Persediaan Barang Dagang.',
      },
    ],
    codeSnippet: `Invarian Keseimbangan:
SUM(Debit) == SUM(Credit)
Exception: UnbalancedJournalError`,
    footerNote: 'Slide 3 dari 6 - Modul Keuangan & Akuntansi',
  },
  {
    id: 4,
    tag: 'POS & KITCHEN PERIPHERALS',
    title: 'High-Speed POS, Split Bill, Tiket Dapur & WhatsApp',
    subtitle: 'Pengalaman Kasir Zero-Lag dengan Fitur Omnichannel Terintegrasi',
    points: [
      {
        icon: '🍳',
        title: 'Tiket Dapur & Struk Konsumen Terpisah',
        desc: 'Mencetak catatan pesanan kustom (e.g. less sugar, tanpa cabai) ke dapur dan struk resmi ke konsumen.',
      },
      {
        icon: '✂️',
        title: 'Split Bill 3 Mode',
        desc: 'Dibagi rata N orang, split nominal bebas, atau split per item menu terpisah.',
      },
      {
        icon: '💬',
        title: 'Smart WhatsApp E-Struk',
        desc: 'Kirim struk teks dan lampiran dokumen PDF langsung via format nomor lokal 081xxxx.',
      },
    ],
    footerNote: 'Slide 4 dari 6 - Modul POS & Periferal',
  },
  {
    id: 5,
    tag: 'DEVELOPER ONBOARDING',
    title: 'Panduan Pengembang Junior & Tim Selanjutnya',
    subtitle: 'Langkah Cepat Memulai Pengembangan & Pengujian Lokal',
    points: [
      {
        icon: '1️⃣',
        title: 'Jalankan Frontend React',
        desc: 'Masuk ke apps/frontend, jalankan npm install lalu npm run dev (Port 3000).',
      },
      {
        icon: '2️⃣',
        title: 'Jalankan Backend Ruby API',
        desc: 'Masuk ke apps/backend, jalankan ruby server.rb (Port 3001).',
      },
      {
        icon: '3️⃣',
        title: 'Uji API via Swagger Console',
        desc: 'Buka menu Swagger di sidebar frontend untuk mencoba live endpoint POST / GET.',
      },
    ],
    footerNote: 'Slide 5 dari 6 - Onboarding Junior Developer',
  },
  {
    id: 6,
    tag: 'CHANGELOG & RELEASE HISTORY',
    title: 'Log Riwayat Pembaruan Sistem (Changelog)',
    subtitle: 'Catatan Rilis Lengkap dari Inisialisasi hingga Fitur Enterprise',
    points: [
      {
        icon: '🚀',
        title: 'v1.0.0 - Core Foundation',
        desc: 'Monorepo setup, skema ActiveRecord, AutoPostingService, & Zustand store.',
      },
      {
        icon: '✨',
        title: 'v1.1.0 - POS & Scanner',
        desc: 'Optical barcode scanner, data produk berkategori, dan modal struk konsumen.',
      },
      {
        icon: '🖨️',
        title: 'v1.2.0 - Bluetooth & WA',
        desc: 'ESC/POS 58mm driver, auto-print, dan normalisasi nomor WhatsApp.',
      },
      {
        icon: '💎',
        title: 'v1.3.0 - MySQL & PDF/Slide',
        desc: 'Migrasi MySQL/MariaDB, Swagger console, ekspor TXT/PDF struk, & slide viewer.',
      },
      {
        icon: '👑',
        title: 'v1.4.0 - Auth, Red Theme & Benchmark',
        desc: 'Auth session, tiketing dapur, split bill 3 mode, owner AI matrix, & benchmark test suite.',
      },
    ],
    footerNote: 'Slide 6 dari 6 - Riwayat Pembaruan',
  },
];

const CHANGELOG_DATA = [
  {
    version: 'v1.4.0',
    date: '01 September 2026',
    title: 'Auth Portal, Kitchen Ticket vs Customer Receipt, Benchmark Suite, & Crimson Red Palette',
    items: [
      'Metadata Pembuat: Dikembangkan oleh parikesitad-pm berkolaborasi dengan repository aenzet04.',
      'Sistem Otentikasi Superaman: SignIn, SignUp, proteksi sesi aktif, dan tombol Logout fungsional.',
      'Pemisahan Cetak Struk: Tiket Dapur / Barista (dengan Catatan Menu) vs Struk Konsumen Resmi.',
      'Modul Split Bill 3 Mode: Dibagi rata N orang, split nominal bebas, dan split per item menu.',
      'Owner Executive Dashboard dengan AI Strategic Advisor (Stars vs Deadstock) & Portal Ulasan Konsumen (/review).',
      'Modul Pengujian Benchmark & Optimasi: Laporan real-time latensi React, throughput Ruby GL, dan MySQL InnoDB.',
      'Perombakan Palet Warna: Crimson Red & Sleek Dark/Light Clean Palette modern.',
    ],
  },
  {
    version: 'v1.3.0',
    date: '01 September 2026',
    title: 'MySQL Migration, Swagger Console, Export PDF/TXT, & Presentation Slide Viewer',
    items: [
      'Migrasi skema database ActiveRecord ke MySQL 8.0 / MariaDB (InnoDB Strict Mode).',
      'Penambahan menu Swagger / OpenAPI 3.0 Interactive Testing Console di sidebar.',
      'Dukungan ekspor struk: 1 Teks (.TXT) ESC/POS & 1 Dokumen (.PDF) Retina 2x.',
      'Sistem Tema Dinamis: Dark Mode & Light Mode ultra-clean dengan toggle header.',
      'Penambahan modul Dokumentasi & Slide Presentation Viewer dengan ekspor PDF.',
    ],
  },
  {
    version: 'v1.2.0',
    date: '01 September 2026',
    title: 'Direct Bluetooth 58mm Thermal Printer & Smart WhatsApp Receipt',
    items: [
      'Integrasi Web Bluetooth API (GATT direct) khusus printer thermal 58mm tanpa scan WiFi.',
      'Fitur Auto-Print otomatis setelah checkout berhasil.',
      'Pengirim E-Struk WhatsApp cerdas: input nomor lokal (081xxxx) otomatis dikonversi ke +62.',
      'Format pesan nota WhatsApp yang sangat informatif, rapi, dan mencakup link e-Invoice.',
    ],
  },
  {
    version: 'v1.1.0',
    date: '01 September 2026',
    title: 'Optical Barcode Scanner, Multi-Category Catalog, & Receipt Modal',
    items: [
      'Live Optical Barcode Scanner modal dengan laser animation & camera feed (getUserMedia).',
      'Katalog produk terstruktur: Kopi, Makanan/Pastry, Non-Coffee, dan Retail Merchandise.',
      'Struk resmi konsumen thermal paper preview dengan QR Code dinamis dan Barcode Code-128.',
    ],
  },
  {
    version: 'v1.0.0',
    date: '01 September 2026',
    title: 'Master Architecture, Double-Entry General Ledger, & Monorepo Setup',
    items: [
      'Arsitektur Tenancy 3-Tier: Holding -> Brand -> Branch -> Warehouse.',
      'Backend Modular Engines Rails 8 (core, pos, finance, inventory, hr, audit).',
      'FinanceEngine::AutoPostingService untuk penjurnalan otomatis transaksi POS ke General Ledger.',
      'Frontend Next.js / React 19 dengan Zustand State Management dan Multi-Tier Switcher.',
    ],
  },
];

export const DocumentationViewer: React.FC = () => {
  const [viewMode, setViewMode] = useState<'docs' | 'slides'>('docs');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const docsRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);

  const currentSlide = PRESENTATION_SLIDES[currentSlideIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== 'slides') return;
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        setCurrentSlideIndex((prev) => (prev < PRESENTATION_SLIDES.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : prev));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode]);

  const handleExportDocsPdf = async () => {
    if (!docsRef.current) return;
    setIsExportingPdf(true);
    try {
      const canvas = await (html2canvas as any)(docsRef.current, {
        scale: 2,
        backgroundColor: '#0f172a',
        useCORS: true,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Dokumentasi-Teknis-ERP-POS-AdamProject.pdf');
    } catch (err) {
      console.error('Export Docs PDF error:', err);
      alert('Gagal mengekspor PDF dokumentasi.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleExportSlidePdf = async () => {
    if (!slideRef.current) return;
    setIsExportingPdf(true);
    try {
      const canvas = await (html2canvas as any)(slideRef.current, {
        scale: 2,
        backgroundColor: '#0f172a',
        useCORS: true,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Slide-${currentSlide.id}-${currentSlide.tag.toLowerCase().replace(/ /g, '-')}.pdf`);
    } catch (err) {
      console.error('Export Slide PDF error:', err);
      alert('Gagal mengekspor PDF slide.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors">
      {/* Top Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">📚</span>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Dokumentasi Teknis & Log Pembaruan
            </h2>
            <span className="bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold">
              v1.4.0 Release
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Created & Maintained by <a href="https://github.com/parikesitad-pm" target="_blank" rel="noreferrer" className="text-red-600 dark:text-red-400 font-bold hover:underline">parikesitad-pm</a> • Repo: <a href="https://github.com/aenzet04/adamproject.git" target="_blank" rel="noreferrer" className="text-slate-600 dark:text-slate-300 font-bold hover:underline">aenzet04/adamproject</a>
          </p>
        </div>

        {/* View Mode & Export Actions */}
        <div className="flex items-center space-x-2">
          <div className="bg-slate-200 dark:bg-slate-900 p-1 rounded-2xl border border-slate-300 dark:border-slate-800 flex space-x-1">
            <button
              onClick={() => setViewMode('docs')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'docs'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              📖 Tampilan Dokumen
            </button>
            <button
              onClick={() => setViewMode('slides')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'slides'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              📽️ Mode Presentasi Slide
            </button>
          </div>

          {viewMode === 'docs' ? (
            <button
              onClick={handleExportDocsPdf}
              disabled={isExportingPdf}
              className="bg-red-600 hover:bg-red-500 text-white font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-md shadow-red-600/20 transition-all active:scale-95"
            >
              <span>📕</span>
              <span>{isExportingPdf ? 'Mengonversi...' : 'Convert Dokumen ke PDF'}</span>
            </button>
          ) : (
            <button
              onClick={handleExportSlidePdf}
              disabled={isExportingPdf}
              className="bg-red-600 hover:bg-red-500 text-white font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-md shadow-red-600/20 transition-all active:scale-95"
            >
              <span>📑</span>
              <span>{isExportingPdf ? 'Mengonversi...' : 'Convert Slide ke PDF'}</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: FULL DOCUMENTATION & CHANGELOG */}
      {viewMode === 'docs' && (
        <div ref={docsRef} className="space-y-6 max-w-5xl">
          {/* Metadata Card */}
          <div className="bg-gradient-to-r from-red-950/40 to-slate-900 border border-red-900/40 rounded-3xl p-5 shadow-sm flex justify-between items-center">
            <div>
              <span className="text-[10px] font-mono uppercase text-red-400 font-bold tracking-wider">
                System Author & Collaboration Metadata
              </span>
              <h3 className="text-sm font-bold text-slate-100 mt-0.5">
                Dikembangkan & Diarsiteki oleh: <a href="https://github.com/parikesitad-pm" target="_blank" rel="noreferrer" className="text-red-400 underline font-mono">parikesitad-pm</a>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Kolaborasi Pemilik Repositori: <a href="https://github.com/aenzet04/adamproject.git" target="_blank" rel="noreferrer" className="text-slate-300 underline font-mono">aenzet04</a> • Lisensi: Enterprise Closed-Source
              </p>
            </div>
            <div className="text-right font-mono text-xs text-slate-400">
              <span className="bg-red-900/60 border border-red-700/60 text-red-300 px-2.5 py-1 rounded-xl font-bold text-[10px]">
                Build: v1.4.0 Production Verified
              </span>
            </div>
          </div>

          {/* Section 1: Architecture & Tenancy */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-xl">🏛️</span>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                1. Struktur Arsitektur & Multi-Tenancy
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Sistem ini dibangun dengan model multi-tenancy hierarkis untuk mendukung operasional konglomerasi bisnis (*Holding Company*):
            </p>
            <div className="grid grid-cols-3 gap-3 text-xs mb-4">
              <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-red-600 dark:text-red-400">Tier 1: Tenant / Holding</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Entitas legal induk (e.g. PT Multi Industri Nusantara), pemilik langganan dan master Chart of Accounts.
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-blue-600 dark:text-blue-400">Tier 2: Brand / Business Unit</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Unit bisnis spesifik (e.g. Kopi Nusantara Roastery, Retail Mart) dengan katalog produk independen.
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-amber-600 dark:text-amber-400">Tier 3: Branch & Warehouse</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Outlet fisik dan multi-gudang untuk pelacakan stok real-time (Moving Average Costing).
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Financial Auto-Posting Logic */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-xl">📊</span>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                2. Logika Penjurnalan Otomatis (Double-Entry General Ledger)
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Setiap transaksi POS checkout di backend memicu <code className="text-red-600 dark:text-red-400 font-bold">FinanceEngine::AutoPostingService</code> yang melakukan pembukuan Debit & Kredit berimbang:
            </p>
            <div className="bg-slate-950 text-slate-200 p-4 rounded-2xl font-mono text-xs overflow-x-auto space-y-1">
              <div className="text-slate-500">// 1. Penerimaan Kas/Bank/QRIS</div>
              <div>Debit  : 1101-01 (Kas / Bank QRIS / EDC)     [Rp Grand Total]</div>
              <div className="text-slate-500 mt-2">// 2. Pengakuan Pendapatan & Pajak</div>
              <div>Kredit : 4101-01 (Pendapatan Penjualan Produk) [Rp Subtotal]</div>
              <div>Kredit : 2103-01 (Hutang PPN Keluaran 11%)     [Rp Nilai Pajak]</div>
              <div className="text-slate-500 mt-2">// 3. Realized HPP & Persediaan</div>
              <div>Debit  : 5101-01 (Beban Pokok Penjualan / HPP) [Rp Realized COGS]</div>
              <div>Kredit : 1104-01 (Persediaan Barang Dagang)    [Rp Realized COGS]</div>
            </div>
          </div>

          {/* Section 3: Changelog History */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-xl">📜</span>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  3. Log Riwayat Pembaruan Sistem (Changelog)
                </h3>
              </div>

              <button
                onClick={() => setViewMode('slides')}
                className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center space-x-1.5 shadow-sm transition-all"
              >
                <span>📽️</span>
                <span>Buka Slide Presentasi</span>
              </button>
            </div>

            <div className="space-y-4">
              {CHANGELOG_DATA.map((log) => (
                <div
                  key={log.version}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="bg-red-600 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-lg">
                        {log.version}
                      </span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{log.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{log.date}</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 dark:text-slate-400 pl-1">
                    {log.items.map((it, idx) => (
                      <li key={idx}>{it}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: INTERACTIVE PRESENTATION SLIDE MODE */}
      {viewMode === 'slides' && (
        <div className="max-w-5xl mx-auto space-y-4">
          <div
            ref={slideRef}
            className="bg-slate-900 text-slate-100 border border-slate-800 rounded-3xl p-8 min-h-[500px] flex flex-col justify-between shadow-2xl relative overflow-hidden"
          >
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[11px] font-mono font-bold tracking-widest text-red-400 uppercase bg-red-950/80 border border-red-800/60 px-3 py-1 rounded-full">
                  {currentSlide.tag}
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">
                  SLIDE {currentSlide.id} / {PRESENTATION_SLIDES.length}
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-100 tracking-tight">{currentSlide.title}</h2>
              <p className="text-xs text-slate-400 mt-1 font-medium">{currentSlide.subtitle}</p>
            </div>

            <div className="grid grid-cols-12 gap-6 my-6">
              <div className={`${currentSlide.codeSnippet ? 'col-span-7' : 'col-span-12'} space-y-3`}>
                {currentSlide.points.map((p, i) => (
                  <div key={i} className="bg-slate-950/60 border border-slate-800/80 p-3.5 rounded-2xl flex items-start space-x-3">
                    <span className="text-xl flex-shrink-0">{p.icon}</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{p.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {currentSlide.codeSnippet && (
                <div className="col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-[11px] text-red-300 flex items-center justify-center">
                  <pre className="overflow-x-auto w-full leading-relaxed">{currentSlide.codeSnippet}</pre>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500 font-mono">
              <span>{currentSlide.footerNote}</span>
              <span>Gunakan Tombol Panah Keyboard ⬅️ / ➡️ untuk berpindah slide</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex justify-between items-center shadow-sm">
            <button
              onClick={() => setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : prev))}
              disabled={currentSlideIndex === 0}
              className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-800 dark:text-slate-200 font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition-all"
            >
              <span>⬅️</span>
              <span>Slide Sebelumnya</span>
            </button>

            <div className="flex space-x-2">
              {PRESENTATION_SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentSlideIndex === idx
                      ? 'bg-red-600 scale-125 shadow-md shadow-red-600/30'
                      : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                  }`}
                  title={`Lompat ke Slide ${s.id}`}
                />
              ))}
            </div>

            <button
              onClick={() =>
                setCurrentSlideIndex((prev) => (prev < PRESENTATION_SLIDES.length - 1 ? prev + 1 : prev))
              }
              disabled={currentSlideIndex === PRESENTATION_SLIDES.length - 1}
              className="bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-md transition-all"
            >
              <span>Slide Berikutnya</span>
              <span>➡️</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
