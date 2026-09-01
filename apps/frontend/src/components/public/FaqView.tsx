'use client';

import React, { useState } from 'react';

interface FaqItem {
  id: string;
  category: 'pos' | 'finance' | 'security' | 'saas' | 'hardware';
  question: string;
  answer: string;
  tags: string[];
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-01',
    category: 'pos',
    question: 'Bagaimana cara kerja sistem Split Bill dan Dual Payment di kasir POS?',
    answer:
      'Kasir dapat membagi tagihan meja ke beberapa pelanggan berdasarkan item yang dipesan atau persentase nominal. Pembayaran juga dapat dibagi dua (Dual Payment) seperti kombinasi Tunai + QRIS atau Tunai + Kartu Debit EDC, di mana jika salah satu metode dipilih, metode yang sama otomatis disabled untuk mencegah duplikasi.',
    tags: ['POS', 'Split Bill', 'Dual Payment', 'Kasir'],
  },
  {
    id: 'faq-02',
    category: 'security',
    question: 'Apa itu kebijakan Zero-Knowledge Privacy untuk Super User?',
    answer:
      'Demi etika bisnis dan kepatuhan privasi data tenant holding, akun Super User / Platform Director dibatasi dari melihat data transaksi penjualan harian cabang atau memanipulasi stok fisik secara sepihak. Super User hanya dapat melakukan inspeksi teknis jika mengajukan tiket izin resmi (#TCK-XXXXXX) yang telah di-ACC oleh Owner atau GM.',
    tags: ['Super User', 'Privasi', 'Zero-Knowledge', 'Audit Ticket'],
  },
  {
    id: 'faq-03',
    category: 'pos',
    question: 'Mengapa Kasir wajib mengganti PIN saat pertama kali login?',
    answer:
      'Ketika Admin Brand mendaftarkan kasir baru, sistem memberikan PIN default 0000. Untuk memastikan akuntabilitas kas dan keamanan laci kasir, saat kasir login pertama kali, sistem menampilkan modal pengamanan wajib ganti PIN 4-6 digit sebelum kasir dapat memproses transaksi POS.',
    tags: ['PIN Kasir', 'Keamanan', 'Shift Kasir', 'Otorisasi'],
  },
  {
    id: 'faq-04',
    category: 'hardware',
    question: 'Printer thermal dan barcode scanner apa saja yang kompatibel?',
    answer:
      'Modula kompatibel dengan seluruh printer thermal Bluetooth & USB ukuran 58mm dan 80mm standar ESC/POS (Epson, Panda, Rongta, Xprinter) serta barcode scanner 1D/2D QR code USB/Wireless plug-and-play.',
    tags: ['Hardware', 'Printer Thermal', 'ESC/POS', 'Scanner Barcode'],
  },
  {
    id: 'faq-05',
    category: 'finance',
    question: 'Apakah laporan keuangan di Modula sesuai dengan standar PSAK?',
    answer:
      'Ya! Modula menerapkan Chart of Accounts (COA) standar PSAK Indonesia dengan pencatatan double-entry otomatis (Debit/Kredit) saat transaksi POS selesai, kalkulasi HPP dengan metode Moving Average & FIFO, serta laporan Laba Rugi dan Neraca yang dapat diekspor ke PDF, Excel CSV, dan PPTX.',
    tags: ['Akuntansi', 'PSAK', 'COGS / HPP', 'Buku Besar', 'Laba Rugi'],
  },
  {
    id: 'faq-06',
    category: 'saas',
    question: 'Bagaimana mekanisme perpanjangan langganan SaaS dan Add-On modul?',
    answer:
      'Super User atau Owner dapat memperpanjang masa aktif secara fleksibel: bulanan (+1 Bulan), triwulan (+3 Bulan), semester (+6 Bulan), atau tahunan (+12 Bulan dengan hemat 25%). Modul tambahan seperti Realtime Chat Team dapat dibuka terpisah via add-on mulai Rp 49.000 / bulan.',
    tags: ['SaaS', 'Billing', 'Add-On', 'Langganan', 'Perpanjangan'],
  },
  {
    id: 'faq-07',
    category: 'hardware',
    question: 'Apakah Modula dapat beroperasi dalam mode offline saat internet padam?',
    answer:
      'Ya. Modula mengadopsi arsitektur Local-First dengan IndexedDB browser caching dan background synchronizer. Transaksi kasir tetap berjalan lancar dan otomatis disinkronkan ke server cloud begitu koneksi internet pulih.',
    tags: ['Offline Mode', 'Local-First', 'Sync', 'Reliabilitas'],
  },
];

export const FaqView: React.FC<{ onBackToHome?: () => void }> = ({ onBackToHome }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>('faq-01');

  const filteredFaqs = FAQ_ITEMS.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      item.question.toLowerCase().includes(q) ||
      item.answer.toLowerCase().includes(q) ||
      item.tags.some((t) => t.toLowerCase().includes(q));
    return matchesCat && matchesQuery;
  });

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 md:p-8 space-y-6">
      {/* Header Banner */}
      <div className="max-w-4xl mx-auto space-y-4">
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

        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-red-600/10 space-y-3">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold font-mono">
            <span>❓</span>
            <span>MODULA KNOWLEDGE BASE & FAQ</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">
            Pertanyaan yang Sering Diajukan (FAQ)
          </h1>
          <p className="text-xs md:text-sm text-red-50 max-w-2xl leading-relaxed">
            Temukan jawaban lengkap seputar pengoperasian kasir POS, akuntansi PSAK, manajemen gudang multi-cabang, hingga privasi zero-knowledge.
          </p>

          {/* Search Box */}
          <div className="pt-2">
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Cari pertanyaan, topik POS, hardware, atau akuntansi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs rounded-2xl px-4 py-3 border border-red-300 dark:border-slate-700 shadow-md focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <span className="absolute right-3.5 top-3 text-slate-400 text-xs">🔍</span>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-2">
          {[
            { key: 'all', label: '🌟 Semua Topik' },
            { key: 'pos', label: '🛒 Kasir & POS' },
            { key: 'finance', label: '📊 Akuntansi PSAK' },
            { key: 'security', label: '🛡️ Privasi & Keamanan' },
            { key: 'hardware', label: '🖨️ Printer & Scanner' },
            { key: 'saas', label: '💳 SaaS & Lisensi' },
          ].map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat.key
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordion FAQ Items */}
        <div className="space-y-3 pt-2">
          {filteredFaqs.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3">
              <span className="text-4xl">🔍</span>
              <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300">
                Topik tidak ditemukan
              </h3>
              <p className="text-xs text-slate-400">
                Coba ubah kata kunci pencarian atau pilih kategori topik lainnya.
              </p>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = expandedId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden transition-all shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedId(isOpen ? null : faq.id)}
                    className="w-full p-4 md:p-5 text-left flex justify-between items-center space-x-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-bold text-red-600 dark:text-red-400 uppercase">
                          [{faq.category.toUpperCase()}]
                        </span>
                        <h3 className="font-bold text-xs md:text-sm text-slate-800 dark:text-slate-100">
                          {faq.question}
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {faq.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono px-1.5 py-0.2 rounded"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="text-slate-400 text-sm font-bold font-mono">
                      {isOpen ? '▲' : '▼'}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800/80 leading-relaxed bg-slate-50/50 dark:bg-slate-950/50">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Still Have Questions Box */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-lg">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-bold text-sm">Masih punya pertanyaan seputar Modula?</h4>
            <p className="text-xs text-slate-400">
              Tim engineering & product architect kami siap membantu setup kebutuhan holding Anda.
            </p>
          </div>
          <a
            href="mailto:support@modula.id"
            className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-5 py-2.5 rounded-2xl shadow-md transition-all whitespace-nowrap"
          >
            ✉️ Hubungi Support 24/7
          </a>
        </div>
      </div>
    </div>
  );
};
