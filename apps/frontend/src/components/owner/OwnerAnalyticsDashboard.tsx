'use client';

import React, { useState } from 'react';
import { useCustomerStore } from '../../stores/useCustomerStore';
import { useModuleLicenseStore } from '../../stores/useModuleLicenseStore';
import { useReviewStore } from '../../stores/useReviewStore';

interface DailySalesData {
  day: string;
  currentSales: number; // in thousands
  compareSales: number; // in thousands
  transactions: number;
}

const SALES_CHART_DATA: DailySalesData[] = [
  { day: 'Sen (01)', currentSales: 4200, compareSales: 3500, transactions: 110 },
  { day: 'Sel (02)', currentSales: 5100, compareSales: 4200, transactions: 135 },
  { day: 'Rab (03)', currentSales: 4800, compareSales: 4100, transactions: 124 },
  { day: 'Kam (04)', currentSales: 5900, compareSales: 4900, transactions: 152 },
  { day: 'Jum (05)', currentSales: 7800, compareSales: 6200, transactions: 198 },
  { day: 'Sab (06)', currentSales: 9400, compareSales: 7800, transactions: 245 },
  { day: 'Min (07)', currentSales: 8900, compareSales: 7400, transactions: 230 },
  { day: 'Sen (08)', currentSales: 4600, compareSales: 3800, transactions: 118 },
  { day: 'Sel (09)', currentSales: 5400, compareSales: 4500, transactions: 140 },
  { day: 'Rab (10)', currentSales: 6100, compareSales: 4900, transactions: 160 },
  { day: 'Kam (11)', currentSales: 6700, compareSales: 5300, transactions: 172 },
  { day: 'Jum (12)', currentSales: 8500, compareSales: 6900, transactions: 215 },
  { day: 'Sab (13)', currentSales: 10200, compareSales: 8400, transactions: 268 },
  { day: 'Min (14)', currentSales: 9800, compareSales: 8100, transactions: 250 },
];

export const OwnerAnalyticsDashboard: React.FC = () => {
  const [periodFilter, setPeriodFilter] = useState<'today' | 'this_week' | 'this_month' | 'custom'>('this_month');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>('all');
  const [showComparison, setShowComparison] = useState<boolean>(true);
  const [hoveredData, setHoveredData] = useState<DailySalesData | null>(null);

  const { getTopSpenders } = useCustomerStore();
  const { subscriptionTier, remainingMonths, expiryDate } = useModuleLicenseStore();
  const { reviews } = useReviewStore();

  const topSpenders = getTopSpenders(4, selectedBranchFilter);

  const maxSale = Math.max(...SALES_CHART_DATA.map((d) => Math.max(d.currentSales, d.compareSales)));

  return (
    <div className="p-4 md:p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors space-y-6">
      {/* 1. TOP HEADER & SUBSCRIPTION BANNER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">👑</span>
            <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100">
              Executive Owner Analytics & AI Strategic Advisor
            </h2>
            <span className="bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold">
              Group CEO View
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Grafik interaktif pertumbuhan omzet, perbandingan periode lalu, dan AI matrix produk.
          </p>
        </div>

        {/* Subscription Status Pill */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-2xl flex items-center space-x-3 shadow-sm w-full md:w-auto">
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
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 shadow-sm">
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
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

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <span className="text-xs text-slate-500 whitespace-nowrap">Filter Outlet:</span>
          <select
            value={selectedBranchFilter}
            onChange={(e) => setSelectedBranchFilter(e.target.value)}
            className="w-full md:w-auto bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs rounded-xl px-3 py-1.5 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none"
          >
            <option value="all">🏢 Semua Outlet (Konsolidasi)</option>
            <option value="br-01">Outlet Grand Indonesia</option>
            <option value="br-02">Outlet Senopati</option>
            <option value="br-03">Store Kelapa Gading</option>
          </select>
        </div>
      </div>

      {/* 3. KEY METRICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 md:p-5 rounded-3xl shadow-sm space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            Total Omzet Penjualan
          </span>
          <div className="text-xl md:text-2xl font-black font-mono text-red-600 dark:text-red-400">
            Rp 148.520.000
          </div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center space-x-1">
            <span>↑ 18.5%</span>
            <span className="text-slate-400 font-normal">vs bulan lalu</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 md:p-5 rounded-3xl shadow-sm space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            Total Transaksi POS
          </span>
          <div className="text-xl md:text-2xl font-black font-mono text-slate-800 dark:text-slate-100">
            3.420 <span className="text-xs font-normal text-slate-400">struk</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">Rata-rata: Rp 43.420 / nota</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 md:p-5 rounded-3xl shadow-sm space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            Gross Margin Profit
          </span>
          <div className="text-xl md:text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            68.4%
          </div>
          <div className="text-[10px] text-slate-400">HPP Rata-rata Terkendali</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 md:p-5 rounded-3xl shadow-sm space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            Customer Satisfaction
          </span>
          <div className="text-xl md:text-2xl font-black font-mono text-amber-500">
            4.9 / 5.0 ⭐
          </div>
          <div className="text-[10px] text-slate-400">{reviews.length} Ulasan (/review)</div>
        </div>
      </div>

      {/* 4. INTERACTIVE GROWTH CHART (KOMPARASI VS BULAN LALU / TARGET) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg">📈</span>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Grafik Interaktif Pertumbuhan Penjualan Harian
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Arahkan kursor ke batang grafik untuk melihat rincian omzet dan transaksi harian.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <button
              onClick={() => setShowComparison(!showComparison)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all border flex items-center space-x-1.5 ${
                showComparison
                  ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200'
              }`}
            >
              <span>{showComparison ? '✓' : '○'}</span>
              <span>Bandingkan vs Bulan Lalu</span>
            </button>

            <div className="flex items-center space-x-3 text-[11px] font-mono">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded bg-red-600 inline-block" />
                <span className="text-slate-700 dark:text-slate-300">Bulan Ini</span>
              </div>
              {showComparison && (
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded bg-slate-300 dark:bg-slate-700 inline-block" />
                  <span className="text-slate-400">Bulan Lalu</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hover Tooltip Box */}
        {hoveredData && (
          <div className="bg-slate-950 text-slate-100 p-3 rounded-2xl border border-red-500/50 shadow-xl flex justify-between items-center text-xs animate-fadeInScale">
            <div className="flex items-center space-x-3">
              <span className="font-bold text-red-400 font-mono">{hoveredData.day}</span>
              <div>
                <span className="text-slate-400 text-[10px]">Omzet: </span>
                <span className="font-bold font-mono text-white">
                  Rp {(hoveredData.currentSales * 1000).toLocaleString('id-ID')}
                </span>
                {showComparison && (
                  <span className="text-slate-400 text-[10px] ml-2 font-mono">
                    (vs Rp {(hoveredData.compareSales * 1000).toLocaleString('id-ID')})
                  </span>
                )}
              </div>
            </div>
            <div className="text-[11px] text-emerald-400 font-bold font-mono">
              {hoveredData.transactions} Transaksi
            </div>
          </div>
        )}

        {/* SVG/CSS Interactive Bar Chart */}
        <div className="h-64 flex items-end space-x-2 md:space-x-3 pt-6 pb-2 px-2 overflow-x-auto">
          {SALES_CHART_DATA.map((d, idx) => {
            const currentHeight = Math.round((d.currentSales / maxSale) * 100);
            const compareHeight = Math.round((d.compareSales / maxSale) * 100);

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredData(d)}
                onMouseLeave={() => setHoveredData(null)}
                className="flex-1 min-w-[36px] flex flex-col items-center justify-end h-full group cursor-pointer"
              >
                <div className="w-full flex items-end justify-center space-x-1 h-48">
                  {showComparison && (
                    <div
                      style={{ height: `${compareHeight}%` }}
                      className="w-2.5 md:w-3.5 bg-slate-300 dark:bg-slate-700/80 rounded-t-lg transition-all duration-300 group-hover:bg-slate-400"
                    />
                  )}
                  <div
                    style={{ height: `${currentHeight}%` }}
                    className="w-3 md:w-4.5 bg-gradient-to-t from-red-700 via-red-600 to-rose-500 rounded-t-lg transition-all duration-300 group-hover:scale-105 shadow-sm"
                  />
                </div>
                <span className="text-[9px] md:text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-2 truncate w-full text-center group-hover:text-red-500 font-bold">
                  {d.day.split(' ')[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. TOP SPENDER LEADERBOARD & AI ADVISOR GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* TOP SPENDER LEADERBOARD */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
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
                    <div className="text-[10px] text-slate-400 font-mono">{c.branchName}</div>
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
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
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
