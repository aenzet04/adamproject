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

const SALES_CHANNEL_SHARE = [
  { channel: 'Dine-In (Makan di Tempat)', percent: 45, amount: 48600000, color: '#e11d48', icon: '🍽️' },
  { channel: 'Take Away (Bungkus)', percent: 20, amount: 21600000, color: '#f59e0b', icon: '🛍️' },
  { channel: 'GoFood', percent: 15, amount: 16200000, color: '#10b981', icon: '🛵' },
  { channel: 'GrabFood', percent: 12, amount: 12960000, color: '#06b6d4', icon: '🟢' },
  { channel: 'ShopeeFood', percent: 6, amount: 6480000, color: '#f97316', icon: '🟠' },
  { channel: 'Maxim Food', percent: 2, amount: 2160000, color: '#eab308', icon: '🟡' },
];

const CATEGORY_SHARE = [
  { category: 'Signature Artisanal Coffee', percent: 42, amount: 45360000, color: '#e11d48' },
  { category: 'Main Courses & Rice Bowls', percent: 24, amount: 25920000, color: '#3b82f6' },
  { category: 'Non-Coffee & Artisan Tea', percent: 22, amount: 23760000, color: '#10b981' },
  { category: 'Pastry, Bakery & Snacks', percent: 12, amount: 12960000, color: '#a855f7' },
];

export const OwnerAnalyticsDashboard: React.FC = () => {
  const [periodFilter, setPeriodFilter] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>('all');
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie' | 'donut' | 'table'>('line');
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

  // SVG Geometry for Line & Area
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
            Visualisasi tren pendapatan multi-chart (Line, Bar, Pie, Donut), alert real-time, dan ranking top spender.
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
            <span>Buka Investor Pitch Deck (PPTX)</span>
          </button>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-1.5 rounded-2xl flex items-center space-x-2 text-xs shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
              {subscriptionTier}
            </span>
            <span className="text-slate-400 font-mono">({remainingMonths} Bln Sisa)</span>
          </div>
        </div>
      </div>

      {isInvestorDeckOpen && <InvestorPitchDeckModal onClose={() => setIsInvestorDeckOpen(false)} />}

      {/* 2. REAL-TIME ALERT NOTIFICATION FEED */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 md:p-5 shadow-sm space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
            </span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
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

      {/* 4. MULTI-CHART INTERACTIVE REVENUE SUITE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
        {/* Top Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg">📊</span>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Visualisasi Tren Pendapatan & Distribusi Channel
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pilih format visualisasi (Line Chart, Bar Chart, Channel Pie, Kategori Donut, atau Tabular).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Chart Type Selector Switcher */}
            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 text-xs font-semibold">
              {[
                { type: 'line', label: '📈 Line Trend' },
                { type: 'bar', label: '📊 Bar Chart' },
                { type: 'pie', label: '🥧 Channel Pie' },
                { type: 'donut', label: '🍩 Kategori' },
                { type: 'table', label: '📋 Tabel' },
              ].map((c) => (
                <button
                  key={c.type}
                  onClick={() => setChartType(c.type as any)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    chartType === c.type
                      ? 'bg-red-600 text-white shadow-sm font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Period Filters */}
            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 text-xs font-semibold">
              {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriodFilter(p)}
                  className={`px-2.5 py-1.5 rounded-lg capitalize transition-all ${
                    periodFilter === p
                      ? 'bg-slate-900 dark:bg-slate-700 text-white shadow-sm font-bold'
                      : 'text-slate-600 dark:text-slate-400'
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

        {/* 1. LINE CHART VIEW */}
        {chartType === 'line' && (
          <div className="space-y-3">
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
                  Arahkan kursor ke titik grafik garis di bawah untuk melihat rincian omzet harian.
                </div>
              )}
            </div>

            <div className="relative w-full overflow-hidden select-none">
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-56 md:h-64">
                <defs>
                  <linearGradient id="financialGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e11d48" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#e11d48" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

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

                <path d={areaD} fill="url(#financialGradient)" />
                <path
                  d={pathD}
                  fill="none"
                  stroke="#e11d48"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {points.map((p, idx) => {
                  const isHovered = hoveredPoint?.date === p.data.date;
                  return (
                    <g
                      key={idx}
                      className="cursor-pointer group"
                      onMouseEnter={() => setHoveredPoint(p.data)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    >
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={isHovered ? 6 : 3.5}
                        className={`transition-all duration-150 ${
                          isHovered
                            ? 'fill-red-600 stroke-white dark:stroke-slate-900 stroke-[2.5px]'
                            : 'fill-red-500 dark:fill-red-400 group-hover:scale-125'
                        }`}
                      />
                      <text
                        x={p.x}
                        y={paddingY + chartH + 16}
                        textAnchor="middle"
                        className={`text-[9px] font-mono transition-colors ${
                          isHovered
                            ? 'fill-red-600 dark:fill-red-400 font-bold'
                            : 'fill-slate-400 dark:fill-slate-500'
                        }`}
                      >
                        {p.data.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        )}

        {/* 2. BAR CHART VIEW */}
        {chartType === 'bar' && (
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-15 gap-2 items-end h-60 pt-6">
              {FINANCIAL_LINE_DATA.map((d, idx) => {
                const heightPct = Math.round((d.revenue / maxRevenue) * 100);
                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredPoint(d)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer"
                  >
                    <div className="text-[8px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap mb-1">
                      Rp {(d.revenue / 1000).toFixed(1)}Jt
                    </div>
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full max-w-[28px] bg-gradient-to-t from-red-600 to-rose-400 rounded-t-xl group-hover:from-red-500 group-hover:to-amber-400 transition-all shadow-md group-hover:scale-105"
                    />
                    <span className="text-[9px] font-mono text-slate-400 mt-1.5 truncate">
                      {d.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. CHANNEL PIE / DONUT BREAKDOWN VIEW */}
        {(chartType === 'pie' || chartType === 'donut') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center p-4">
            {/* SVG Pie Representation */}
            <div className="flex justify-center">
              <div className="relative w-56 h-56 flex items-center justify-center">
                <svg viewBox="0 0 36 36" className="w-52 h-52 -rotate-90 transform">
                  {SALES_CHANNEL_SHARE.reduce(
                    (acc, ch, i) => {
                      const strokeDasharray = `${ch.percent} ${100 - ch.percent}`;
                      const strokeDashoffset = acc.offset;
                      acc.elements.push(
                        <circle
                          key={i}
                          cx="18"
                          cy="18"
                          r={chartType === 'donut' ? '15.915' : '12'}
                          fill="transparent"
                          stroke={ch.color}
                          strokeWidth={chartType === 'donut' ? '4.5' : '10'}
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={strokeDashoffset}
                          className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                        />
                      );
                      acc.offset -= ch.percent;
                      return acc;
                    },
                    { elements: [] as React.ReactNode[], offset: 25 }
                  ).elements}
                </svg>

                {chartType === 'donut' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Total Sales</span>
                    <span className="text-sm font-black font-mono text-slate-800 dark:text-slate-100">
                      100%
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Channel Metrics Legend */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 font-mono">
                Kontribusi Kanal Penjualan (Sales Channel Share):
              </h4>
              <div className="space-y-2">
                {SALES_CHANNEL_SHARE.map((ch) => (
                  <div
                    key={ch.channel}
                    className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs"
                  >
                    <div className="flex items-center space-x-2">
                      <span
                        style={{ backgroundColor: ch.color }}
                        className="w-3 h-3 rounded-full shrink-0"
                      />
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {ch.icon} {ch.channel}
                      </span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="font-bold text-slate-800 dark:text-slate-100 mr-2">
                        {ch.percent}%
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Rp {ch.amount.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. TABULAR DATA SUMMARY */}
        {chartType === 'table' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-[10px] uppercase">
                  <th className="pb-2">Tanggal</th>
                  <th className="pb-2">Keterangan Hari</th>
                  <th className="pb-2 text-right">Volume Transaksi</th>
                  <th className="pb-2 text-right">Total Omzet</th>
                  <th className="pb-2 text-right">Rata-Rata / Transaksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {FINANCIAL_LINE_DATA.map((d) => (
                  <tr key={d.date} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 font-bold text-slate-800 dark:text-slate-200">{d.date}</td>
                    <td className="py-2.5 text-slate-500 font-sans">{d.label}</td>
                    <td className="py-2.5 text-right text-slate-700 dark:text-slate-300">{d.transactions} Struk</td>
                    <td className="py-2.5 text-right font-bold text-red-600 dark:text-red-400">
                      Rp {(d.revenue * 1000).toLocaleString('id-ID')}
                    </td>
                    <td className="py-2.5 text-right text-slate-500">
                      Rp {Math.round((d.revenue * 1000) / d.transactions).toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. TOP SPENDERS & AI DEAD STOCK MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Spender Leaderboard */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🏆</span>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Top Spender Member Leaderboard
              </h3>
            </div>
            <span className="text-[10px] text-red-600 dark:text-red-400 font-bold font-mono">
              CRM Active
            </span>
          </div>

          <div className="space-y-2.5">
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
                  <span className="text-[9px] bg-red-100 dark:bg-red-950 text-red-600 font-mono px-1.5 rounded">
                    {c.tier} • {c.points} Pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Dead Stock & Slow Moving Advisor */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🤖</span>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                AI Inventory Restock & Dead Stock Advisor
              </h3>
            </div>
            <span className="text-[10px] bg-purple-100 dark:bg-purple-950 text-purple-600 font-bold font-mono px-2 py-0.5 rounded-full">
              SCM Intelligence
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 rounded-2xl space-y-1">
              <div className="flex justify-between font-bold text-rose-800 dark:text-rose-200">
                <span>⚠️ Sirup Hazelnut 750ml (Dead Stock &gt; 45 Hari)</span>
                <span className="font-mono">Sisa: 24 Btl</span>
              </div>
              <p className="text-[11px] text-rose-600 dark:text-rose-300">
                Rekomendasi AI: Buat bundle promo <i>"Hazelnut Latte Special Combo"</i> dengan diskon 15% untuk melikuidasi persediaan sebelum kedaluwarsa.
              </p>
            </div>

            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-2xl space-y-1">
              <div className="flex justify-between font-bold text-emerald-800 dark:text-emerald-200">
                <span>🔥 Fast-Moving: Susu Fresh Milk Diamond 1L</span>
                <span className="font-mono text-emerald-600">Velocity: 45 Kotak/Hari</span>
              </div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-300">
                Rekomendasi AI: Restock 120 Kotak sebelum hari Jumat untuk mencegah stockout saat weekend rush.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
