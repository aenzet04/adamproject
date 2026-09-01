'use client';

import React, { useState } from 'react';
import { useCustomerStore } from '../../stores/useCustomerStore';
import { useModuleLicenseStore } from '../../stores/useModuleLicenseStore';
import { useReviewStore } from '../../stores/useReviewStore';
import { useShiftStore } from '../../stores/useShiftStore';
import { InvestorPitchDeckModal } from '../presentation/InvestorPitchDeckModal';
import { toast } from '../../stores/useToastStore';

interface DailyRevenuePoint {
  date: string;
  label: string;
  revenue: number; // in thousands (Rp)
  transactions: number;
}

const FINANCIAL_LINE_DATA: DailyRevenuePoint[] = [
  { date: '2026-08-18', label: '18 Agu', revenue: 4200, transactions: 110 },
  { date: '2026-08-19', label: '19 Agu', revenue: 5100, transactions: 135 },
  { date: '2026-08-20', label: '20 Agu', revenue: 4800, transactions: 124 },
  { date: '2026-08-21', label: '21 Agu', revenue: 5900, transactions: 152 },
  { date: '2026-08-22', label: '22 Agu', revenue: 7800, transactions: 198 },
  { date: '2026-08-23', label: '23 Agu', revenue: 9400, transactions: 245 },
  { date: '2026-08-24', label: '24 Agu', revenue: 8900, transactions: 230 },
  { date: '2026-08-25', label: '25 Agu', revenue: 4600, transactions: 118 },
  { date: '2026-08-26', label: '26 Agu', revenue: 5400, transactions: 140 },
  { date: '2026-08-27', label: '27 Agu', revenue: 6100, transactions: 160 },
  { date: '2026-08-28', label: '28 Agu', revenue: 6700, transactions: 172 },
  { date: '2026-08-29', label: '29 Agu', revenue: 8500, transactions: 215 },
  { date: '2026-08-30', label: '30 Agu', revenue: 10200, transactions: 268 },
  { date: '2026-08-31', label: '31 Agu', revenue: 9800, transactions: 250 },
  { date: '2026-09-01', label: '01 Sep', revenue: 10800, transactions: 280 },
];

export const OwnerAnalyticsDashboard: React.FC = () => {
  const [periodFilter, setPeriodFilter] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>('all');
  const [hoveredPoint, setHoveredPoint] = useState<DailyRevenuePoint | null>(null);
  const [isInvestorDeckOpen, setIsInvestorDeckOpen] = useState(false);

  const { getTopSpenders } = useCustomerStore();
  const { subscriptionTier, remainingMonths, expiryDate } = useModuleLicenseStore();
  const { reviews } = useReviewStore();
  const { alerts, markAlertsAsRead } = useShiftStore();

  const topSpenders = getTopSpenders(4, selectedBranchFilter);

  const maxRevenue = Math.max(...FINANCIAL_LINE_DATA.map((d) => d.revenue));
  const minRevenue = 0;
  const totalRevenueSum = FINANCIAL_LINE_DATA.reduce((sum, d) => sum + d.revenue * 1000, 0);
  const avgDailyRevenue = Math.round(totalRevenueSum / FINANCIAL_LINE_DATA.length);

  // Generate SVG Points for Line and Gradient Area
  const svgWidth = 800;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 30;
  const chartW = svgWidth - paddingX * 2;
  const chartH = svgHeight - paddingY * 2;

  const points = FINANCIAL_LINE_DATA.map((d, idx) => {
    const x = paddingX + (idx / (FINANCIAL_LINE_DATA.length - 1)) * chartW;
    const y = paddingY + chartH - ((d.revenue - minRevenue) / (maxRevenue - minRevenue)) * chartH;
    return { x, y, data: d };
  });

  const pathD = points.reduce((acc, p, idx) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${paddingY + chartH} L ${points[0].x} ${paddingY + chartH} Z`;

  return (
    <div className="p-4 md:p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors space-y-6">
      {/* 1. TOP HEADER & SUBSCRIPTION BANNER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">👑</span>
            <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100">
              Executive Owner Analytics & Laporan Finansial
            </h2>
            <span className="bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold">
              Group Financial Core
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Grafik garis standar laporan keuangan, real-time alert keterlambatan shift, dan AI matrix persediaan.
          </p>
        </div>

        {/* Action Button: Investor Slide Deck & Subscription Status */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setIsInvestorDeckOpen(true)}
            className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold px-4 py-2 rounded-2xl text-xs flex items-center space-x-2 shadow-lg shadow-red-600/30 active:scale-95 transition-all"
          >
            <span>🖥️</span>
            <span>Buka Investor Pitch Deck</span>
            <span className="bg-white/20 text-white text-[9px] font-mono px-1.5 py-0.2 rounded font-bold">
              PITCH
            </span>
          </button>

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
      </div>

      {isInvestorDeckOpen && <InvestorPitchDeckModal onClose={() => setIsInvestorDeckOpen(false)} />}

      {/* 2. REALTIME LIVE NOTIFICATIONS FEED */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 md:p-5 shadow-sm space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 font-mono">
              🔔 Real-Time Live Feed Notifikasi Operasional Owner ({alerts.length})
            </h3>
          </div>
          <button
            onClick={() => {
              markAlertsAsRead();
              toast.info('Notifikasi Ditandai', 'Semua notifikasi ditandai telah dibaca.');
            }}
            className="text-[11px] text-red-600 dark:text-red-400 font-bold hover:underline"
          >
            Tandai Sudah Dibaca
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {alerts.map((al) => (
            <div
              key={al.id}
              className={`p-3.5 rounded-2xl border flex flex-col justify-between space-y-2 text-xs transition-all ${
                al.severity === 'warning'
                  ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800/60'
                  : al.severity === 'critical'
                  ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800/60'
                  : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/60'
              }`}
            >
              <div>
                <div className="flex justify-between items-start">
                  <span className="font-bold text-slate-800 dark:text-slate-100">{al.title}</span>
                  <span className="text-[9px] font-mono text-slate-400">
                    {new Date(al.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">{al.message}</p>
              </div>

              <div className="pt-2 border-t border-black/5 dark:border-white/5 flex justify-between items-center text-[10px]">
                <span className="font-bold font-mono text-slate-500">📍 {al.branchName}</span>
                {al.type === 'SHIFT_LATE' && (
                  <button
                    onClick={() => {
                      window.open('https://wa.me/6281234567890?text=Halo,%20mohon%20konfirmasi%20jadwal%20shift%20anda.', '_blank');
                    }}
                    className="text-red-600 dark:text-red-400 font-bold hover:underline"
                  >
                    💬 Kontak Kasir
                  </button>
                )}
                {al.type === 'LOW_STOCK' && (
                  <span className="text-rose-600 dark:text-rose-400 font-bold">🚨 Urgent PO</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. KEY METRICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 md:p-5 rounded-3xl shadow-sm space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            Total Omzet Penjualan
          </span>
          <div className="text-xl md:text-2xl font-black font-mono text-red-600 dark:text-red-400">
            Rp {totalRevenueSum.toLocaleString('id-ID')}
          </div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center space-x-1">
            <span>↑ +18.5%</span>
            <span className="text-slate-400 font-normal">Pertumbuhan Positif</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 md:p-5 rounded-3xl shadow-sm space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            Rata-Rata Omzet Harian
          </span>
          <div className="text-xl md:text-2xl font-black font-mono text-slate-800 dark:text-slate-100">
            Rp {avgDailyRevenue.toLocaleString('id-ID')}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">Periode Berjalan</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 md:p-5 rounded-3xl shadow-sm space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            Gross Margin Profit
          </span>
          <div className="text-xl md:text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            68.4%
          </div>
          <div className="text-[10px] text-slate-400">HPP Terkendali Rendah</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 md:p-5 rounded-3xl shadow-sm space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            Customer Sentiment
          </span>
          <div className="text-xl md:text-2xl font-black font-mono text-amber-500">
            4.9 / 5.0 ⭐
          </div>
          <div className="text-[10px] text-slate-400">{reviews.length} Ulasan Terverifikasi</div>
        </div>
      </div>

      {/* 4. CLEAN PROFESSIONAL FINANCIAL LINE CHART */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
        {/* Top Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg">📈</span>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Tren Pendapatan & Omzet Penjualan
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Grafik garis standar laporan keuangan periodik. Arahkan kursor ke titik garis untuk melihat omzet harian.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Period Filters */}
            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 text-xs font-semibold">
              {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriodFilter(p)}
                  className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                    periodFilter === p
                      ? 'bg-red-600 text-white shadow-sm font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {p === 'daily' ? 'Harian' : p === 'weekly' ? 'Mingguan' : p === 'monthly' ? 'Bulanan' : 'Tahunan'}
                </button>
              ))}
            </div>

            {/* Branch Filter */}
            <select
              value={selectedBranchFilter}
              onChange={(e) => setSelectedBranchFilter(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs rounded-xl px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none"
            >
              <option value="all">🏢 Semua Cabang Konsolidasi</option>
              <option value="br-01">Outlet Grand Indonesia</option>
              <option value="br-02">Outlet Senopati</option>
              <option value="br-03">Store Kelapa Gading</option>
            </select>
          </div>
        </div>

        {/* Hover Info Tooltip Banner */}
        <div className="h-9 flex items-center justify-between px-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono">
          {hoveredPoint ? (
            <>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block" />
                <span className="font-bold text-slate-800 dark:text-slate-100">
                  Tanggal: {hoveredPoint.label} ({hoveredPoint.date})
                </span>
              </div>
              <div>
                <span className="text-slate-400">Omzet: </span>
                <span className="font-black text-red-600 dark:text-red-400 text-sm">
                  Rp {(hoveredPoint.revenue * 1000).toLocaleString('id-ID')}
                </span>
                <span className="text-slate-400 ml-2">({hoveredPoint.transactions} Transaksi)</span>
              </div>
            </>
          ) : (
            <div className="text-slate-400 text-[11px]">
              Arahkan kursor ke titik grafik di bawah untuk melihat rincian omzet harian.
            </div>
          )}
        </div>

        {/* Clean SVG Line Chart */}
        <div className="relative w-full overflow-hidden select-none">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-56 md:h-64">
            <defs>
              <linearGradient id="financialGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e11d48" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#e11d48" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid Guidelines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
              const y = paddingY + chartH * pct;
              const val = Math.round(maxRevenue - (maxRevenue - minRevenue) * pct);
              return (
                <g key={i}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={svgWidth - paddingX}
                    y2={y}
                    stroke="currentColor"
                    className="text-slate-200 dark:text-slate-800/80"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <text
                    x={paddingX - 6}
                    y={y + 3}
                    textAnchor="end"
                    className="fill-slate-400 text-[9px] font-mono"
                  >
                    {val >= 1000 ? `${(val / 1000).toFixed(1)}M` : `${val}k`}
                  </text>
                </g>
              );
            })}

            {/* Gradient Area under the line */}
            <path d={areaD} fill="url(#financialGradient)" />

            {/* The Main Red Financial Trend Line */}
            <path
              d={pathD}
              fill="none"
              stroke="#e11d48"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Interactive Data Points (Circles) */}
            {points.map((p, idx) => {
              const isHovered = hoveredPoint?.date === p.data.date;
              return (
                <g key={idx}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isHovered ? 6 : 4}
                    className={`transition-all cursor-pointer ${
                      isHovered
                        ? 'fill-red-600 stroke-white stroke-2'
                        : 'fill-white dark:fill-slate-900 stroke-red-600 stroke-2 hover:r-6'
                    }`}
                    onMouseEnter={() => setHoveredPoint(p.data)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  {/* Date labels at the bottom */}
                  {(idx % 2 === 0 || idx === points.length - 1) && (
                    <text
                      x={p.x}
                      y={paddingY + chartH + 16}
                      textAnchor="middle"
                      className="fill-slate-400 text-[9px] font-mono"
                    >
                      {p.data.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
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
            {topSpenders.map((c: any, idx: number) => (
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
