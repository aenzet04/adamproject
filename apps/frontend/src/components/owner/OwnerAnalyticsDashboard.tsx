'use client';

import React, { useState } from 'react';
import { useReviewStore } from '../../stores/useReviewStore';
import { useDensityStore } from '../../stores/useDensityStore';
import { useTenantStore } from '../../stores/useTenantStore';

interface SalesDataPoint {
  period: string;
  totalSales: number;
  totalTransactions: number;
  grossProfit: number;
  marginPercent: number;
}

const SALES_PERIOD_DATA: Record<string, SalesDataPoint> = {
  today: {
    period: 'Hari Ini (1 September 2026)',
    totalSales: 14850000,
    totalTransactions: 248,
    grossProfit: 9652500,
    marginPercent: 65.0,
  },
  this_week: {
    period: 'Minggu Ini (25 Agu - 1 Sep 2026)',
    totalSales: 108420000,
    totalTransactions: 1820,
    grossProfit: 70473000,
    marginPercent: 65.0,
  },
  this_month: {
    period: 'Bulan Ini (Agustus 2026)',
    totalSales: 446960000,
    totalTransactions: 7450,
    grossProfit: 266630000,
    marginPercent: 59.6,
  },
  custom: {
    period: 'Rentang Custom (Q3 2026)',
    totalSales: 890400000,
    totalTransactions: 14900,
    grossProfit: 534240000,
    marginPercent: 60.0,
  },
};

const AI_PRODUCT_MATRIX = [
  {
    name: 'Kopi Aren Nusantara Latte',
    category: 'Fast-Moving & High Margin (BINTANG)',
    status: 'star',
    salesQty: 1420,
    margin: 68.5,
    recommendation: 'Valuable untuk Konsumen! Naikkan safety stock 25%, pertahankan kualitas gula aren, dan jadikan hero campaign di media sosial.',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
  },
  {
    name: 'Croissant Butter Paris',
    category: 'Cash Cow (Fast-Moving)',
    status: 'cash_cow',
    salesQty: 980,
    margin: 62.5,
    recommendation: 'Tingkat repeat order tinggi. Terapkan bundling sarapan pagi dengan Espresso untuk meningkatkan Average Ticket Size.',
    badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300 dark:border-blue-800',
  },
  {
    name: 'Manual Drip V60 Glass Server',
    category: 'Deadstock / Slow Moving (KURANGI)',
    status: 'deadstock',
    salesQty: 8,
    margin: 45.0,
    recommendation: 'Modal kerja tertahan Rp 3.5 Juta (Inaktif >60 hari). Terapkan diskon clearance bundle 30% atau hentikan PO berikutnya.',
    badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300 dark:border-rose-800',
  },
  {
    name: 'Canvas Tote Bag Nusantara Edition',
    category: 'Slow Moving Merchandise',
    status: 'deadstock',
    salesQty: 15,
    margin: 64.0,
    recommendation: 'Jadikan merchandise gratis untuk pembelian paket loyalty minimal Rp 250.000 guna melikuidasi persediaan.',
    badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-800',
  },
];

export const OwnerAnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'today' | 'this_week' | 'this_month' | 'custom'>('today');
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');
  const { reviews, getAverageRating } = useReviewStore();
  const { viewMode } = useDensityStore();
  const { availableBranches } = useTenantStore();

  const currentData = SALES_PERIOD_DATA[timeRange];
  const avgRating = getAverageRating(selectedBranchId === 'all' ? undefined : selectedBranchId);

  const filteredReviews = selectedBranchId === 'all'
    ? reviews
    : reviews.filter((r) => r.branchId === selectedBranchId);

  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors space-y-6">
      {/* Top Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">👑</span>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Executive Owner & Investor Dashboard
            </h2>
            <span className="bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold">
              AI Strategic Advisor Active
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Analisis penjualan berkala, matriks kecerdasan buatan (AI) produk berharga vs stok mati, serta sentimen ulasan konsumen.
          </p>
        </div>

        {/* Branch & Time Filters */}
        <div className="flex items-center space-x-2">
          {/* Branch Filter */}
          <select
            value={selectedBranchId}
            onChange={(e) => setSelectedBranchId(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 rounded-xl px-3 py-2 font-semibold shadow-sm focus:outline-none"
          >
            <option value="all">🏢 Semua Cabang Outlet</option>
            {availableBranches.map((b) => (
              <option key={b.id} value={b.id}>
                📍 {b.name}
              </option>
            ))}
          </select>

          {/* Time Range Pills */}
          <div className="bg-slate-200 dark:bg-slate-900 p-1 rounded-2xl border border-slate-300 dark:border-slate-800 flex space-x-1">
            <button
              onClick={() => setTimeRange('today')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                timeRange === 'today'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Hari Ini
            </button>
            <button
              onClick={() => setTimeRange('this_week')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                timeRange === 'this_week'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Minggu Ini
            </button>
            <button
              onClick={() => setTimeRange('this_month')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                timeRange === 'this_month'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Bulan Ini
            </button>
            <button
              onClick={() => setTimeRange('custom')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                timeRange === 'custom'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Custom Range
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Omset Penjualan</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">
            Rp {currentData.totalSales.toLocaleString('id-ID')}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">{currentData.period}</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Laba Kotor (Gross Profit)</span>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono mt-1">
            Rp {currentData.grossProfit.toLocaleString('id-ID')}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Margin Kotor: {currentData.marginPercent}%</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Transaksi Selesai</span>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400 font-mono mt-1">
            {currentData.totalTransactions.toLocaleString('id-ID')} Struk
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Avg Ticket: Rp {Math.round(currentData.totalSales / currentData.totalTransactions).toLocaleString('id-ID')}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Kepuasan Pelanggan (NPS)</span>
          <div className="text-2xl font-black text-amber-500 font-mono mt-1 flex items-center space-x-1">
            <span>⭐ {avgRating}</span>
            <span className="text-xs font-normal text-slate-400">/ 5.0</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">{reviews.length} Ulasan Masuk</div>
        </div>
      </div>

      {/* SECTION: AI STRATEGIC ADVISOR (VALUABLE VS DEADSTOCK) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🧠</span>
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                AI Strategic Advisor: Matriks Produk Bintang vs Deadstock
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Kecerdasan buatan membedah performa barang dagang untuk pertimbangan inventory & likuidasi owner:
              </p>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full font-bold">
            Real-time Analyzed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {AI_PRODUCT_MATRIX.map((item, idx) => (
            <div
              key={idx}
              className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs">{item.name}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                    {item.category}
                  </span>
                </div>

                <div className="flex space-x-4 text-[11px] text-slate-500 font-mono mt-1">
                  <span>Terjual: <b>{item.salesQty} unit</b></span>
                  <span>Margin: <b className="text-emerald-600 dark:text-emerald-400">{item.margin}%</b></span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300">
                <span className="font-bold text-amber-600 dark:text-amber-400 mr-1">💡 Saran AI:</span>
                {item.recommendation}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION: LIVE CUSTOMER FEEDBACK & REVIEWS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-xl">💬</span>
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Ulasan Konsumen Masuk (Landing Page Review Integration)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Feedback langsung dari konsumen per cabang dan penilaian rasa menu produk:
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2 text-xs"
            >
              <div className="flex justify-between items-center">
                <div className="font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-2">
                  <span>{rev.customerName}</span>
                  <span className="text-[10px] text-slate-400 font-normal">({rev.branchName})</span>
                </div>
                <div className="text-amber-500 font-bold">
                  {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                </div>
              </div>

              {rev.menuItemName && (
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  Menu yang dinilai: <b>{rev.menuItemName}</b> (★ {rev.menuRating}/5)
                </div>
              )}

              <p className="text-slate-600 dark:text-slate-300 italic text-[11px]">
                "{rev.comment}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
