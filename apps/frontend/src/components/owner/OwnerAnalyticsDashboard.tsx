'use client';

import React, { useState } from 'react';
import { useCustomerStore } from '../../stores/useCustomerStore';
import { useModuleLicenseStore } from '../../stores/useModuleLicenseStore';
import { useReviewStore } from '../../stores/useReviewStore';

interface StockCandle {
  date: string;
  dayName: string;
  open: number; // in thousands (Rp)
  high: number;
  low: number;
  close: number;
  volume: number; // transactions
  ma5: number;
  isBullish: boolean;
}

const STOCK_CANDLE_DATA: StockCandle[] = [
  { date: '2026-08-18', dayName: 'Sen 18', open: 3800, high: 4500, low: 3600, close: 4200, volume: 110, ma5: 3950, isBullish: true },
  { date: '2026-08-19', dayName: 'Sel 19', open: 4200, high: 5300, low: 4100, close: 5100, volume: 135, ma5: 4300, isBullish: true },
  { date: '2026-08-20', dayName: 'Rab 20', open: 5100, high: 5200, low: 4600, close: 4800, volume: 124, ma5: 4550, isBullish: false },
  { date: '2026-08-21', dayName: 'Kam 21', open: 4800, high: 6100, low: 4700, close: 5900, volume: 152, ma5: 4900, isBullish: true },
  { date: '2026-08-22', dayName: 'Jum 22', open: 5900, high: 8100, low: 5800, close: 7800, volume: 198, ma5: 5560, isBullish: true },
  { date: '2026-08-23', dayName: 'Sab 23', open: 7800, high: 9800, low: 7600, close: 9400, volume: 245, ma5: 6600, isBullish: true },
  { date: '2026-08-24', dayName: 'Min 24', open: 9400, high: 9600, low: 8500, close: 8900, volume: 230, ma5: 7360, isBullish: false },
  { date: '2026-08-25', dayName: 'Sen 25', open: 8900, high: 9100, low: 4400, close: 4600, volume: 118, ma5: 7320, isBullish: false },
  { date: '2026-08-26', dayName: 'Sel 26', open: 4600, high: 5600, low: 4500, close: 5400, volume: 140, ma5: 7220, isBullish: true },
  { date: '2026-08-27', dayName: 'Rab 27', open: 5400, high: 6300, low: 5200, close: 6100, volume: 160, ma5: 6880, isBullish: true },
  { date: '2026-08-28', dayName: 'Kam 28', open: 6100, high: 6900, low: 5900, close: 6700, volume: 172, ma5: 6340, isBullish: true },
  { date: '2026-08-29', dayName: 'Jum 29', open: 6700, high: 8800, low: 6600, close: 8500, volume: 215, ma5: 6260, isBullish: true },
  { date: '2026-08-30', dayName: 'Sab 30', open: 8500, high: 10600, low: 8400, close: 10200, volume: 268, ma5: 7380, isBullish: true },
  { date: '2026-08-31', dayName: 'Min 31', open: 10200, high: 10400, low: 9500, close: 9800, volume: 250, ma5: 8260, isBullish: false },
  { date: '2026-09-01', dayName: 'Sen 01', open: 9800, high: 11200, low: 9700, close: 10800, volume: 280, ma5: 9200, isBullish: true },
];

export const OwnerAnalyticsDashboard: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1M');
  const [chartType, setChartType] = useState<'candlestick' | 'volume_bar'>('candlestick');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>('all');
  const [hoveredCandle, setHoveredCandle] = useState<StockCandle | null>(null);

  const { getTopSpenders } = useCustomerStore();
  const { subscriptionTier, remainingMonths, expiryDate } = useModuleLicenseStore();
  const { reviews } = useReviewStore();

  const topSpenders = getTopSpenders(4, selectedBranchFilter);

  const chartMax = Math.max(...STOCK_CANDLE_DATA.map((c) => c.high));
  const chartMin = Math.min(...STOCK_CANDLE_DATA.map((c) => c.low)) * 0.85;
  const priceRange = chartMax - chartMin;
  const maxVolume = Math.max(...STOCK_CANDLE_DATA.map((c) => c.volume));

  const activeCandle = hoveredCandle || STOCK_CANDLE_DATA[STOCK_CANDLE_DATA.length - 1];

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
              TradingView Analytics Core
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Grafik candlestick interaktif bergaya bursa saham, moving averages (MA5), volume transaksi, dan AI advisor.
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

      {/* 2. KEY METRICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 md:p-5 rounded-3xl shadow-sm space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            Total Omzet Penjualan
          </span>
          <div className="text-xl md:text-2xl font-black font-mono text-red-600 dark:text-red-400">
            Rp 148.520.000
          </div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center space-x-1">
            <span>▲ +18.5%</span>
            <span className="text-slate-400 font-normal">BULLISH TREND</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 md:p-5 rounded-3xl shadow-sm space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            Total Volume Transaksi
          </span>
          <div className="text-xl md:text-2xl font-black font-mono text-slate-800 dark:text-slate-100">
            3.420 <span className="text-xs font-normal text-slate-400">order</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">Rata-rata: Rp 43.420 / struk</div>
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

      {/* 3. TRADINGVIEW / STOCK MARKET STYLE INTERACTIVE CANDLESTICK CHART */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 md:p-6 shadow-sm space-y-4">
        {/* TradingView Top Controls Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-3 flex-wrap">
            <div className="flex items-center space-x-2">
              <span className="font-black text-sm tracking-wider font-mono text-slate-900 dark:text-slate-100">
                MODULA:REVENUE
              </span>
              <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                LIVE 1D
              </span>
            </div>

            {/* Timeframe selector */}
            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 text-xs font-mono font-bold">
              {(['1D', '1W', '1M', '3M', '1Y'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    timeframe === tf
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            {/* Chart Type Toggle */}
            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 text-xs font-bold">
              <button
                onClick={() => setChartType('candlestick')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center space-x-1 ${
                  chartType === 'candlestick'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                    : 'text-slate-500'
                }`}
              >
                <span>🕯️</span>
                <span className="hidden sm:inline">Candle Saham</span>
              </button>
              <button
                onClick={() => setChartType('volume_bar')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center space-x-1 ${
                  chartType === 'volume_bar'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                    : 'text-slate-500'
                }`}
              >
                <span>📊</span>
                <span className="hidden sm:inline">Bar Omzet</span>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto">
            <span className="text-xs text-slate-500">Cabang:</span>
            <select
              value={selectedBranchFilter}
              onChange={(e) => setSelectedBranchFilter(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs rounded-xl px-2.5 py-1 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none"
            >
              <option value="all">🏢 Semua Cabang Konsolidasi</option>
              <option value="br-01">Outlet Grand Indonesia</option>
              <option value="br-02">Outlet Senopati</option>
              <option value="br-03">Store Kelapa Gading</option>
            </select>
          </div>
        </div>

        {/* Live Candlestick Stats Bar (OHLCV) */}
        <div className="bg-slate-950 text-slate-100 p-3 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center space-x-3 flex-wrap gap-y-1">
            <span className="font-bold text-red-400">{activeCandle.date} ({activeCandle.dayName})</span>
            <span>O: <b className="text-white">Rp {(activeCandle.open * 1000).toLocaleString('id-ID')}</b></span>
            <span>H: <b className="text-emerald-400">Rp {(activeCandle.high * 1000).toLocaleString('id-ID')}</b></span>
            <span>L: <b className="text-rose-400">Rp {(activeCandle.low * 1000).toLocaleString('id-ID')}</b></span>
            <span>C: <b className={activeCandle.isBullish ? 'text-emerald-400' : 'text-rose-400'}>Rp {(activeCandle.close * 1000).toLocaleString('id-ID')}</b></span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-amber-400">MA(5): <b>Rp {(activeCandle.ma5 * 1000).toLocaleString('id-ID')}</b></span>
            <span className="text-slate-400">Vol: <b className="text-white">{activeCandle.volume} Orders</b></span>
            <span className={`px-2 py-0.5 rounded font-bold ${activeCandle.isBullish ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'}`}>
              {activeCandle.isBullish ? '▲ BULLISH' : '▼ BEARISH'}
            </span>
          </div>
        </div>

        {/* The Candlestick & Volume Chart Canvas Area */}
        <div className="relative h-72 pt-4 pb-2 flex flex-col justify-between overflow-x-auto select-none">
          {/* Main Price / Candlestick Area */}
          <div className="flex-1 flex items-end space-x-2 md:space-x-3 relative border-b border-slate-200 dark:border-slate-800/80 pb-2">
            {STOCK_CANDLE_DATA.map((c, idx) => {
              // Calculate % heights based on price range
              const highPct = Math.min(100, Math.max(5, ((c.high - chartMin) / priceRange) * 100));
              const lowPct = Math.min(100, Math.max(0, ((c.low - chartMin) / priceRange) * 100));
              const openPct = ((c.open - chartMin) / priceRange) * 100;
              const closePct = ((c.close - chartMin) / priceRange) * 100;

              const bodyTop = Math.max(openPct, closePct);
              const bodyBottom = Math.min(openPct, closePct);
              const bodyHeight = Math.max(6, bodyTop - bodyBottom);

              const isHovered = hoveredCandle?.date === c.date;

              return (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredCandle(c)}
                  onMouseLeave={() => setHoveredCandle(null)}
                  className="flex-1 min-w-[28px] h-full flex flex-col items-center justify-end relative cursor-crosshair group"
                >
                  {/* Candlestick Mode */}
                  {chartType === 'candlestick' ? (
                    <div className="relative w-full h-full flex justify-center items-end">
                      {/* Upper & Lower Wick Line */}
                      <div
                        style={{
                          bottom: `${lowPct}%`,
                          height: `${Math.max(4, highPct - lowPct)}%`,
                        }}
                        className={`absolute w-[2px] transition-all ${
                          c.isBullish ? 'bg-emerald-500 group-hover:bg-emerald-400' : 'bg-rose-500 group-hover:bg-rose-400'
                        }`}
                      />

                      {/* Real Candlestick Body (Open to Close) */}
                      <div
                        style={{
                          bottom: `${bodyBottom}%`,
                          height: `${bodyHeight}%`,
                        }}
                        className={`absolute w-3.5 md:w-5 rounded-[3px] border transition-all z-10 ${
                          c.isBullish
                            ? 'bg-emerald-500 border-emerald-400 group-hover:bg-emerald-400 shadow-sm shadow-emerald-500/30'
                            : 'bg-rose-600 border-rose-500 group-hover:bg-rose-500 shadow-sm shadow-rose-600/30'
                        } ${isHovered ? 'scale-110 ring-2 ring-white dark:ring-slate-300' : ''}`}
                      />
                    </div>
                  ) : (
                    /* Bar Chart Mode */
                    <div className="w-full flex items-end justify-center h-full">
                      <div
                        style={{ height: `${closePct}%` }}
                        className={`w-3.5 md:w-5 rounded-t-lg transition-all ${
                          c.isBullish
                            ? 'bg-gradient-to-t from-emerald-700 to-emerald-500 group-hover:to-emerald-400'
                            : 'bg-gradient-to-t from-rose-700 to-rose-500 group-hover:to-rose-400'
                        }`}
                      />
                    </div>
                  )}

                  {/* Day Label */}
                  <span className="text-[9px] font-mono text-slate-400 mt-2 truncate w-full text-center group-hover:text-red-500 font-bold">
                    {c.dayName}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Volume Bars Area (Bottom of Stock Chart) */}
          <div className="h-14 flex items-end space-x-2 md:space-x-3 pt-1 border-t border-dashed border-slate-200 dark:border-slate-800">
            {STOCK_CANDLE_DATA.map((c, idx) => {
              const volPct = Math.round((c.volume / maxVolume) * 100);
              return (
                <div
                  key={idx}
                  className="flex-1 min-w-[28px] h-full flex flex-col items-center justify-end group"
                  onMouseEnter={() => setHoveredCandle(c)}
                  onMouseLeave={() => setHoveredCandle(null)}
                >
                  <div
                    style={{ height: `${volPct}%` }}
                    className={`w-2.5 md:w-3.5 rounded-t transition-all ${
                      c.isBullish ? 'bg-emerald-500/40 group-hover:bg-emerald-500' : 'bg-rose-500/40 group-hover:bg-rose-500'
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. TOP SPENDER LEADERBOARD & AI ADVISOR GRID */}
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
