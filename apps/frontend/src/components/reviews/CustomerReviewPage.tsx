'use client';

import React, { useState } from 'react';
import { useReviewStore } from '../../stores/useReviewStore';
import { useTenantStore } from '../../stores/useTenantStore';

const MENU_OPTIONS = [
  { id: 'prod-001', name: 'Espresso Single Origin Gayo' },
  { id: 'prod-002', name: 'Iced Caramel Macchiato' },
  { id: 'prod-005', name: 'Kopi Aren Nusantara Latte' },
  { id: 'prod-003', name: 'Croissant Butter Paris' },
  { id: 'prod-004', name: 'Nasi Goreng Wagyu Spesial' },
  { id: 'prod-008', name: 'Truffle Parmesan Fries' },
  { id: 'prod-009', name: 'Japanese Uji Matcha Latte' },
];

export const CustomerReviewPage: React.FC = () => {
  const { addReview } = useReviewStore();
  const { availableBranches } = useTenantStore();

  const [customerName, setCustomerName] = useState('');
  const [selectedBranchId, setSelectedBranchId] = useState('br-01');
  const [overallRating, setOverallRating] = useState(5);
  const [selectedMenuId, setSelectedMenuId] = useState(MENU_OPTIONS[2].id);
  const [menuRating, setMenuRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !comment) {
      alert('Mohon isi nama dan komentar ulasan Anda.');
      return;
    }

    const branch = availableBranches.find((b) => b.id === selectedBranchId) || availableBranches[0];
    const menu = MENU_OPTIONS.find((m) => m.id === selectedMenuId);

    addReview({
      branchId: branch.id,
      branchName: branch.name,
      customerName,
      rating: overallRating,
      menuItemId: menu?.id,
      menuItemName: menu?.name,
      menuRating,
      comment,
      sentiment: overallRating >= 4 ? 'positive' : overallRating === 3 ? 'neutral' : 'negative',
    });

    setIsSubmitted(true);
  };

  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors flex flex-col items-center justify-center">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-xl space-y-6">
        <div className="text-center space-y-1">
          <span className="text-3xl">⭐</span>
          <h2 className="text-lg font-black text-slate-800 dark:text-slate-100">
            Landing Page Ulasan Konsumen
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Kopi Nusantara Roastery - Bagikan pengalaman & penilaian menu Anda
          </p>
        </div>

        {isSubmitted ? (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 p-6 rounded-2xl text-center space-y-3">
            <span className="text-4xl">🎉</span>
            <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
              Terima Kasih Atas Ulasan Anda!
            </h3>
            <p className="text-xs text-emerald-700 dark:text-emerald-400">
              Ulasan Anda telah langsung terkirim dan tampil di Dashboard Owner untuk peningkatan kualitas kami.
            </p>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setComment('');
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl"
            >
              Tulis Ulasan Lain
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nama Anda
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Bpk. Bambang"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Pilih Cabang / Outlet yang Dikunjungi
              </label>
              <select
                value={selectedBranchId}
                onChange={(e) => setSelectedBranchId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 font-semibold focus:outline-none"
              >
                {availableBranches.map((b) => (
                  <option key={b.id} value={b.id}>
                    📍 {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Kepuasan Layanan Toko ({overallRating} / 5 Bintang)
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setOverallRating(star)}
                    className={`text-2xl transition-all ${
                      star <= overallRating ? 'text-amber-400 scale-110' : 'text-slate-300 dark:text-slate-700'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Menu Favorit yang Dipesan
              </label>
              <select
                value={selectedMenuId}
                onChange={(e) => setSelectedMenuId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 font-semibold focus:outline-none"
              >
                {MENU_OPTIONS.map((m) => (
                  <option key={m.id} value={m.id}>
                    ☕ {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Penilaian Rasa Menu ({menuRating} / 5 Bintang)
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setMenuRating(star)}
                    className={`text-2xl transition-all ${
                      star <= menuRating ? 'text-amber-400 scale-110' : 'text-slate-300 dark:text-slate-700'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Komentar & Pengalaman Anda
              </label>
              <textarea
                rows={3}
                required
                placeholder="Bagikan kesan rasa kopi, kenyamanan tempat, atau keramahan barista kami..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-2xl text-xs shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
            >
              Kirim Ulasan Konsumen
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
