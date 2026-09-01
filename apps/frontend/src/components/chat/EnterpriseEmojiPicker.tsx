'use client';

import React, { useState } from 'react';

export interface EnterpriseEmoji {
  emoji: string;
  name: string;
  corporateMeaning: string;
  category: 'piggy' | 'genz' | 'elderly' | 'corporate';
}

export const ENTERPRISE_EMOJIS: EnterpriseEmoji[] = [
  // 1. PIGGY & SWINE (BABI & KAWAN-KAWAN)
  { emoji: '🐷', name: 'Babi Synergistic Swine', corporateMeaning: 'Simbol Hoki & Pembawa Keberuntungan Arus Kas', category: 'piggy' },
  { emoji: '🥓', name: 'Bacon ROI', corporateMeaning: 'Crispy Cash Flow & Margin Gurih', category: 'piggy' },
  { emoji: '🐖', name: 'Babi Gesit SCM', corporateMeaning: 'Agile Turnaround & Perputaran Stok Cepat', category: 'piggy' },
  { emoji: '🐽', name: 'Snout Margin', corporateMeaning: 'Penciuman Tajam Peluang Cuan Baru', category: 'piggy' },
  { emoji: '🐗', name: 'Ekspansi Babi Hutan', corporateMeaning: 'Ekspansi Agresif Buka Cabang Baru', category: 'piggy' },

  // 2. GEN Z CORE
  { emoji: '💀', name: 'Dead / Ketar-ketir', corporateMeaning: 'Ketar-Ketir Menatap Target Q3', category: 'genz' },
  { emoji: '🗿', name: 'Sigma Stone', corporateMeaning: 'Disiplin Tinggi & Patuh PSAK Tanpa Kompromi', category: 'genz' },
  { emoji: '🔥', name: 'Menyala Abangkuh', corporateMeaning: 'Pencapaian Omzet Tertinggi Sepanjang Sejarah', category: 'genz' },
  { emoji: '💅', name: 'Slay Corporate', corporateMeaning: 'Realisasi Budget Anggun & Efisien', category: 'genz' },
  { emoji: '🧢', name: 'No Cap', corporateMeaning: 'Fakta Riil Transparan Tanpa Tipu-Tipu', category: 'genz' },
  { emoji: '🤡', name: 'Clown Costing', corporateMeaning: 'Koreksi HPP Salah Hitung', category: 'genz' },
  { emoji: '✨', name: 'Aesthetic Synergy', corporateMeaning: 'Harmonisasi Antar Tim yang Elegan', category: 'genz' },

  // 3. LANSIA & RESTU KELUARGA
  { emoji: '🙏', name: 'Matur Nuwun', corporateMeaning: 'Berkah Dividen & Rasa Syukur Bersama', category: 'elderly' },
  { emoji: '☕', name: 'Ngopi Santai', corporateMeaning: 'Evaluasi Santai Sambil Menikmati Roast Terbaik', category: 'elderly' },
  { emoji: '👴', name: 'Sesepuh Holding', corporateMeaning: 'Petuah Bijak Para Founder Senior', category: 'elderly' },
  { emoji: '👵', name: 'Eyang Konservatif', corporateMeaning: 'Pengingat Hemat & Disiplin Belanja Modal', category: 'elderly' },
  { emoji: '👍', name: 'Jempol Bapak-Bapak', corporateMeaning: 'ACC Instan Tanpa Birokrasi Berbelit', category: 'elderly' },

  // 4. ENTERPRISE EXECUTIVE
  { emoji: '🚀', name: 'To The Moon', corporateMeaning: 'Scale Up Menuju Valuasi Unicorn', category: 'corporate' },
  { emoji: '💼', name: 'Roadmap Ready', corporateMeaning: 'Eksekusi Strategis Tepat Waktu', category: 'corporate' },
  { emoji: '💸', name: 'Cuan Maksimal', corporateMeaning: 'EBITDA Positif & Laba Bersih Naik', category: 'corporate' },
  { emoji: '📊', name: 'Pivot Matrix', corporateMeaning: 'Keputusan Berbasis Data & AI Laporan', category: 'corporate' },
  { emoji: '🛡️', name: 'Zero-Knowledge', corporateMeaning: 'Kerahasiaan Privasi Tingkat Tinggi', category: 'corporate' },
];

interface EnterpriseEmojiPickerProps {
  onSelectEmoji: (emoji: string) => void;
  onClose: () => void;
}

export const EnterpriseEmojiPicker: React.FC<EnterpriseEmojiPickerProps> = ({ onSelectEmoji, onClose }) => {
  const [selectedCat, setSelectedCat] = useState<'all' | 'piggy' | 'genz' | 'elderly' | 'corporate'>('all');

  const filtered = selectedCat === 'all'
    ? ENTERPRISE_EMOJIS
    : ENTERPRISE_EMOJIS.filter((e) => e.category === selectedCat);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-4 w-80 max-w-sm space-y-3 z-50 text-xs">
      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
        <div className="flex items-center space-x-1.5 font-bold text-slate-800 dark:text-slate-100">
          <span>🐷</span>
          <span>Enterprise Emoji & Reaction Suite</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-bold"
        >
          ✕
        </button>
      </div>

      {/* CATEGORY TABS */}
      <div className="flex items-center space-x-1 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'Semua' },
          { id: 'piggy', label: '🐷 Babi Hoki' },
          { id: 'genz', label: '⚡ Gen Z' },
          { id: 'elderly', label: '👴 Lansia' },
          { id: 'corporate', label: '📈 Korporat' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSelectedCat(tab.id as any)}
            className={`px-2.5 py-1 rounded-xl font-bold whitespace-nowrap text-[10px] transition-all ${
              selectedCat === tab.id
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* EMOJI GRID */}
      <div className="grid grid-cols-5 gap-2 max-h-56 overflow-y-auto p-1">
        {filtered.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectEmoji(item.emoji)}
            className="w-11 h-11 rounded-2xl bg-slate-50 dark:bg-slate-950 hover:bg-red-50 dark:hover:bg-red-950/40 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-xl hover:scale-110 active:scale-95 transition-all group relative"
            title={`${item.name} (${item.corporateMeaning})`}
          >
            <span>{item.emoji}</span>
          </button>
        ))}
      </div>

      <div className="text-[10px] text-slate-400 font-mono text-center pt-1 border-t border-slate-100 dark:border-slate-800">
        💡 Hover emoji untuk melihat arti korporat & sinergi bisnisnya!
      </div>
    </div>
  );
};
