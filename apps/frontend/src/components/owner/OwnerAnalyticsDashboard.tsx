'use client';

import React, { useState } from 'react';
import { useCustomerStore } from '../../stores/useCustomerStore';
import { useModuleLicenseStore } from '../../stores/useModuleLicenseStore';
import { useReviewStore } from '../../stores/useReviewStore';

export const OwnerAnalyticsDashboard: React.FC = () => {
  const [periodFilter, setPeriodFilter] = useState<'today' | 'this_week' | 'this_month' | 'custom'>('this_month');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>('all');

  const { getTopSpenders } = useCustomerStore();
  const { subscriptionTier, remainingMonths, expiryDate } = useModuleLicenseStore();
  const { reviews } = useReviewStore();

  const topSpenders = getTopSpenders(4);

  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors space-y-6">
      {/* 1. TOP HEADER & SUBSCRIPTION BANNER */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">👑</span>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Executive Owner Analytics & AI Strategic Advisor
            </h2>
            <span className="bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold">
              Group CEO View
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Ringkasan omzet konsolidasi, performa member, dan AI rekomendasi produk holding.
          </p>
        </div>

        {/* Subscription Status Pill */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-2xl flex items-center space-x-3 shadow-sm">
          <span className="text-amber-500 text-lg">💎</span>
          <div className="text-xs">
            <div className="font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-1.5">
              <span>Paket {subscriptionTier.toUpperCase()}</span>
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.2 rounded-full font-bold font-mono">
                Sisa {remainingMonths} Bulan
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">Masa Aktif s/d {expiryDate}</div>
          </div>
        </div>
      </div>

      {/* 2. FILTER PERIOD & OUTLET BAR */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 flex justify-between items-center shadow-sm">
        <div className="flex space-x-2">
          {(['today', 'this_week', 'this_month', 'custom'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriodFilter(p)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                periodFilter === p
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {p === 'today' && '📅 Hari Ini'}
              {p === 'this_week' && '🗓️ Minggu Ini'}
              {p === 'this_month' && '📊 Bulan Ini'}
              {p === 'custom' && '⚙️ Custom Range'}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-500">Filter Outlet:</span>
          <select
            value={selectedBranchFilter}
            onChange={(e) => setSelectedBranchFilter(e.target.value)}
            className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs rounded-xl px-3 py-1.5 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none"
          >
            <option value="all">Semua Outlet (Konsolidasi)</option>
            <option value="br-01">Outlet Grand Indonesia</option>
            <option value="br-02">Outlet Senopati</option>
          </select>
        </div>
      </div>

      {/* 3. KEY METRICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            Total Omzet Penjualan
          </span>
          <div className="text-2xl font-black font-mono text-red-600 dark:text-red-400">
            Rp 148.520.000
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center space-x-1">
            <span>↑ 14.8%</span>
            <span className="text-slate-400 font-normal">vs bulan lalu</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            Total Transaksi POS
          </span>
          <div className="text-2xl font-black font-mono text-slate-800 dark:text-slate-100">
            3.420 <span className="text-xs font-normal text-slate-400">struk</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">Rata-rata: Rp 43.420 / nota</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            Gross Margin Profit
          </span>
          <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            68.4%
          </div>
          <div className="text-[11px] text-slate-400">HPP Rata-rata Terkendali</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            Customer Satisfaction
          </span>
          <div className="text-2xl font-black font-mono text-amber-500">
            4.9 / 5.0 ⭐
          </div>
          <div className="text-[11px] text-slate-400">{reviews.length} Ulasan Masuk (/review)</div>
        </div>
      </div>

      {/* 4. TOP SPENDER LEADERBOARD & AI ADVISOR GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* TOP SPENDER LEADERBOARD */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🏆</span>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Top Spender Member Leaderboard
              </h3>
            </div>
            <span className="text-[10px] text-red-600 dark:text-red-400 font-bold font-mono">
              CRM Active
            </span>
          </div>

          <div className="space-y-2.5">
            {topSpenders.map((c, idx) => (
              <div
                key={c.id}
                className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-between items-center"
              >
                <div className="flex items-center space-x-2.5">
                  <span className="font-bold font-mono text-xs text-slate-400">#{idx + 1}</span>
                  <div>
                    <div className="font-bold text-xs text-slate-800 dark:text-slate-100">{c.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{c.phone}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold font-mono text-red-600 dark:text-red-400">
                    Rp {c.lifetimeSpend.toLocaleString('id-ID')}
                  </div>
                  <span className="text-[9px] bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 px-1.5 py-0.2 rounded font-mono font-bold">
                    {c.tier} ({c.points} Pts)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI STRATEGIC ADVISOR MATRIX */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🤖</span>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                AI Strategic Advisor (Stars vs Deadstock Matrix)
              </h3>
            </div>
            <span className="bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
              AI Recommendation
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/40 space-y-2">
              <div className="flex items-center space-x-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                <span>⭐</span>
                <span>Produk Bintang (Fast-Moving & High Margin)</span>
              </div>
              <ul className="list-disc list-inside text-[11px] text-emerald-700 dark:text-emerald-400 space-y-1">
                <li><b>Kopi Aren Nusantara Latte:</b> 840 cup/bulan (Margin 68%).</li>
                <li><b>Croissant Butter Paris:</b> 420 pcs/bulan (Margin 62%).</li>
              </ul>
              <div className="text-[10px] bg-white dark:bg-slate-900 p-2 rounded-xl border border-emerald-300 dark:border-emerald-800 text-slate-700 dark:text-slate-300 mt-2">
                💡 <b>Saran AI:</b> Pertahankan stok harian di atas 100 cup dan jadikan paket combo sarapan pagi.
              </div>
            </div>

            <div className="bg-rose-50 dark:bg-rose-950/30 p-4 rounded-2xl border border-rose-200 dark:border-rose-800/40 space-y-2">
              <div className="flex items-center space-x-1.5 font-bold text-rose-800 dark:text-rose-300">
                <span>⚠️</span>
                <span>Deadstock & Produk Lambat Bergerak</span>
              </div>
              <ul className="list-disc list-inside text-[11px] text-rose-700 dark:text-rose-400 space-y-1">
                <li><b>Stainless Tumbler 500ml:</b> 2 pcs/bulan (Stok mengendap 75 hari).</li>
                <li><b>Cold Brew Bottle:</b> Turnaround 14 hari.</li>
              </ul>
              <div className="text-[10px] bg-white dark:bg-slate-900 p-2 rounded-xl border border-rose-300 dark:border-rose-800 text-slate-700 dark:text-slate-300 mt-2">
                💡 <b>Saran AI:</b> Buat program *bundling* tumbler berhadiah free refill kopi 3x untuk melikuidasi persediaan.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
