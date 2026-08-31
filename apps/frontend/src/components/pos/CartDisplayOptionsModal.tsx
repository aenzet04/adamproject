'use client';

import React from 'react';
import { useCartViewStore, CartLayoutStyle, CartDensity } from '../../stores/useCartViewStore';
import { toast } from '../../stores/useToastStore';

interface CartDisplayOptionsModalProps {
  onClose: () => void;
}

export const CartDisplayOptionsModal: React.FC<CartDisplayOptionsModalProps> = ({ onClose }) => {
  const {
    layoutStyle,
    density,
    groupByCategory,
    alwaysShowNotes,
    showSkuBarcode,
    showCogsMargin,
    setLayoutStyle,
    setDensity,
    toggleGroupByCategory,
    toggleAlwaysShowNotes,
    toggleShowSkuBarcode,
    toggleShowCogsMargin,
  } = useCartViewStore();

  const LAYOUTS: Array<{ id: CartLayoutStyle; name: string; icon: string; desc: string }> = [
    {
      id: 'card',
      name: '1. Modern Sleek Cards (Default)',
      icon: '🎴',
      desc: 'Kartu elegan dengan tombol kuantitas responsif dan input catatan dapur individual.',
    },
    {
      id: 'compact_list',
      name: '2. Compact Table List (Supermarket / Retail)',
      icon: '📑',
      desc: 'Tabel berdensitas tinggi untuk input puluhan item per menit ala minimarket.',
    },
    {
      id: 'visual_grid',
      name: '3. Visual Thumbnail Grid',
      icon: '🖼️',
      desc: 'Kotak media visual dengan ikon produk besar dan tombol sentuh cepat.',
    },
    {
      id: 'kitchen_kds',
      name: '4. Kitchen / Barista KDS Ticket Mode',
      icon: '🍳',
      desc: 'Menonjolkan catatan resep dapur (Less sugar, extra hot, no ice, dsb).',
    },
    {
      id: 'accounting_detail',
      name: '5. Detailed Accounting & Tax Breakdown',
      icon: '📊',
      desc: 'Audit lengkap rincian SKU, HPP standar, margin laba, dan alokasi pajak per baris.',
    },
  ];

  const DENSITIES: Array<{ id: CartDensity; name: string; icon: string }> = [
    { id: 'comfortable', name: 'Standar (Nyaman)', icon: '✨' },
    { id: 'compact', name: 'Rapat / Padat (Compact)', icon: '⚡' },
    { id: 'touch_large', name: 'Tombol Besar (Touchscreen)', icon: '👆' },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs max-h-[90vh] flex flex-col justify-between transition-colors">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🎨</span>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Pilihan Layout & Tampilan Keranjang POS
              </h3>
              <p className="text-[10px] text-slate-400">
                Kustomisasi gaya tampilan kasir sesuai alur kerja operasional Anda.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 font-bold px-2 py-1">✕</button>
        </div>

        <div className="overflow-y-auto space-y-4 flex-1 pr-1">
          {/* 1. LAYOUT STYLES */}
          <div className="space-y-2">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] font-mono">
              Pilih Gaya Tampilan (Layout Style)
            </span>
            <div className="grid grid-cols-1 gap-2">
              {LAYOUTS.map((lay) => (
                <button
                  key={lay.id}
                  type="button"
                  onClick={() => {
                    setLayoutStyle(lay.id);
                    toast.info('Gaya Cart Diubah', lay.name);
                  }}
                  className={`p-3 rounded-2xl border text-left flex items-start space-x-3 transition-all ${
                    layoutStyle === lay.id
                      ? 'bg-red-50 dark:bg-red-950/40 border-red-500 text-red-900 dark:text-red-200 ring-1 ring-red-500/30'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xl">{lay.icon}</span>
                  <div className="flex-1">
                    <div className="font-bold text-xs">{lay.name}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{lay.desc}</div>
                  </div>
                  {layoutStyle === lay.id && (
                    <span className="text-red-600 dark:text-red-400 font-bold text-xs">✓ Aktif</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 2. DENSITY SELECTOR */}
          <div className="space-y-2">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] font-mono">
              Kepadatan & Ukuran Tombol (Density)
            </span>
            <div className="grid grid-cols-3 gap-2">
              {DENSITIES.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDensity(d.id)}
                  className={`p-2.5 rounded-2xl border text-center font-bold text-xs transition-all ${
                    density === d.id
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <span className="block text-sm mb-0.5">{d.icon}</span>
                  <span>{d.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. ADDITIONAL TOGGLES */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] font-mono">
              Opsi Tambahan Keranjang
            </span>

            <div className="space-y-2">
              <label className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">Tampilkan Catatan Dapur / Resep</div>
                  <div className="text-[10px] text-slate-400">Input catatan preferensi tamu di tiap baris</div>
                </div>
                <input
                  type="checkbox"
                  checked={alwaysShowNotes}
                  onChange={toggleAlwaysShowNotes}
                  className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">Tampilkan Kode SKU & Barcode</div>
                  <div className="text-[10px] text-slate-400">Munculkan kode SKU di bawah nama produk</div>
                </div>
                <input
                  type="checkbox"
                  checked={showSkuBarcode}
                  onChange={toggleShowSkuBarcode}
                  className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">Tampilkan HPP / COGS & Margin (Mode Owner/Admin)</div>
                  <div className="text-[10px] text-slate-400">Informasi laba kotor item secara realtime</div>
                </div>
                <input
                  type="checkbox"
                  checked={showCogsMargin}
                  onChange={toggleShowCogsMargin}
                  className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-2 rounded-xl text-xs shadow-md shadow-red-600/20 active:scale-95"
          >
            Terapkan Tampilan
          </button>
        </div>
      </div>
    </div>
  );
};
