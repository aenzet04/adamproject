'use client';

import React, { useState } from 'react';
import type { ProfitLossReport } from '../../types';
import { InvestorPitchDeckModal } from '../presentation/InvestorPitchDeckModal';
import { exportToExcelCsv, triggerPrintPdf } from '../../lib/exportUtils';
import { toast } from '../../stores/useToastStore';

const SAMPLE_PL_DATA: ProfitLossReport = {
  periodStart: '2026-08-01',
  periodEnd: '2026-08-31',
  revenues: [
    { code: '4101-01', name: 'Pendapatan Penjualan F&B', amount: 345200000 },
    { code: '4101-02', name: 'Pendapatan Penjualan Retail & Merch', amount: 84500000 },
    { code: '4201-01', name: 'Pendapatan Service Charge (5%)', amount: 17260000 },
  ],
  totalRevenue: 446960000,
  cogs: [
    { code: '5101-01', name: 'Beban Pokok Penjualan (HPP F&B Bahan Baku)', amount: 138080000 },
    { code: '5101-02', name: 'Beban Pokok Penjualan (HPP Retail/Merchandise)', amount: 42250000 },
  ],
  totalCogs: 180330000,
  grossProfit: 266630000,
  operatingExpenses: [
    { code: '5201-01', name: 'Beban Gaji, Upah & Lembur Staf', amount: 82000000 },
    { code: '5202-01', name: 'Beban Sewa Gedung & Outlet', amount: 25000000 },
    { code: '5203-01', name: 'Beban Utilitas (Listrik, Air & Internet)', amount: 12400000 },
    { code: '5204-01', name: 'Beban Pemasaran & Promo Digital', amount: 15000000 },
  ],
  totalOperatingExpense: 134400000,
  netIncome: 132230000,
};

export const FinancialStatementsViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pl' | 'bs' | 'ledger'>('pl');
  const [data] = useState<ProfitLossReport>(SAMPLE_PL_DATA);
  const [isInvestorDeckOpen, setIsInvestorDeckOpen] = useState(false);

  const handleExportExcel = () => {
    const headers = ['Kode Akun', 'Nama Pos Akun', 'Tipe Akun', 'Jumlah Nominal (Rp)'];
    const rows = [
      ...data.revenues.map((r) => [r.code, r.name, 'Pendapatan Penjualan', r.amount.toLocaleString('id-ID')]),
      ['4999-00', 'TOTAL PENDAPATAN', 'TOTAL', data.totalRevenue.toLocaleString('id-ID')],
      ...data.cogs.map((c) => [c.code, c.name, 'Beban Pokok Penjualan (HPP)', c.amount.toLocaleString('id-ID')]),
      ['5199-00', 'TOTAL HPP', 'TOTAL', data.totalCogs.toLocaleString('id-ID')],
      ['3999-01', 'LABA KOTOR (GROSS PROFIT)', 'PROFIT', data.grossProfit.toLocaleString('id-ID')],
      ...data.operatingExpenses.map((o) => [o.code, o.name, 'Beban Operasional', o.amount.toLocaleString('id-ID')]),
      ['5299-00', 'TOTAL BEBAN OPERASIONAL', 'TOTAL', data.totalOperatingExpense.toLocaleString('id-ID')],
      ['3999-99', 'LABA BERSIH (NET INCOME)', 'NET PROFIT', data.netIncome.toLocaleString('id-ID')],
    ];
    exportToExcelCsv('Laporan_Keuangan_Laba_Rugi_Modula_2026', rows, headers);
    toast.success('Ekspor Excel Berhasil', 'Laporan laba rugi PSAK telah diunduh.');
  };

  return (
    <div className="p-4 md:p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">📊</span>
            <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100">
              Laporan Keuangan Eksekutif (PSAK / IFRS)
            </h2>
            <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold">
              General Ledger Live
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Konsolidasi Real-time Double-Entry General Ledger otomatis dari transaksi POS & Operasional.
          </p>
        </div>

        {/* Action Buttons: Slide Deck, Export Excel & Export PDF */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsInvestorDeckOpen(true)}
            className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-4 py-2 rounded-2xl text-xs font-bold shadow-lg shadow-red-600/30 active:scale-95 flex items-center space-x-1.5"
          >
            <span>🖥️</span>
            <span>Slide Presentasi Investor</span>
          </button>

          <button
            type="button"
            onClick={handleExportExcel}
            className="bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3.5 py-2 rounded-2xl text-xs font-bold border border-slate-200 dark:border-slate-700 shadow-sm flex items-center space-x-1.5"
          >
            <span>📊</span>
            <span>Export Excel</span>
          </button>

          <button
            type="button"
            onClick={() => triggerPrintPdf('Laporan_Keuangan_Konsolidasi_PSAK')}
            className="bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-2 rounded-2xl text-xs font-bold shadow-sm flex items-center space-x-1.5"
          >
            <span>🖨️</span>
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('pl')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'pl'
              ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          📈 Laporan Laba Rugi (Profit & Loss)
        </button>

        <button
          onClick={() => setActiveTab('bs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'bs'
              ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          ⚖️ Neraca Keuangan (Balance Sheet)
        </button>

        <button
          onClick={() => setActiveTab('ledger')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'ledger'
              ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          📋 Jurnal Buku Besar (General Ledger)
        </button>
      </div>

      {/* TAB 1: PROFIT & LOSS */}
      {activeTab === 'pl' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                Laporan Laba Rugi Komprehensif
              </h3>
              <p className="text-xs text-slate-400">
                Periode: {data.periodStart} s/d {data.periodEnd} (IDR)
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-mono">Net Profit Margin:</span>
              <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {((data.netIncome / data.totalRevenue) * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Revenue */}
          <div className="space-y-2">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] font-mono block">
              1. Pendapatan Usaha (Revenues)
            </span>
            <div className="space-y-1.5">
              {data.revenues.map((rev) => (
                <div
                  key={rev.code}
                  className="flex justify-between items-center text-xs p-2 bg-slate-50 dark:bg-slate-950 rounded-xl"
                >
                  <span className="text-slate-700 dark:text-slate-300">
                    <b className="font-mono text-[10px] text-slate-400 mr-2">{rev.code}</b>
                    {rev.name}
                  </span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    Rp {rev.amount.toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
              <div className="flex justify-between items-center text-xs font-bold p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/40">
                <span className="text-emerald-800 dark:text-emerald-200">TOTAL PENDAPATAN BERSIH:</span>
                <span className="font-mono text-emerald-700 dark:text-emerald-300 text-sm">
                  Rp {data.totalRevenue.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          {/* COGS */}
          <div className="space-y-2">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] font-mono block">
              2. Beban Pokok Penjualan (HPP / COGS)
            </span>
            <div className="space-y-1.5">
              {data.cogs.map((c) => (
                <div
                  key={c.code}
                  className="flex justify-between items-center text-xs p-2 bg-slate-50 dark:bg-slate-950 rounded-xl"
                >
                  <span className="text-slate-700 dark:text-slate-300">
                    <b className="font-mono text-[10px] text-slate-400 mr-2">{c.code}</b>
                    {c.name}
                  </span>
                  <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                    (Rp {c.amount.toLocaleString('id-ID')})
                  </span>
                </div>
              ))}
              <div className="flex justify-between items-center text-xs font-bold p-2.5 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-800/40">
                <span className="text-rose-800 dark:text-rose-200">TOTAL BEBAN POKOK PENJUALAN:</span>
                <span className="font-mono text-rose-700 dark:text-rose-300 text-sm">
                  (Rp {data.totalCogs.toLocaleString('id-ID')})
                </span>
              </div>
            </div>
          </div>

          {/* Gross Profit Banner */}
          <div className="flex justify-between items-center p-3.5 bg-slate-100 dark:bg-slate-800 rounded-2xl font-black text-sm">
            <span>LABA KOTOR (GROSS PROFIT):</span>
            <span className="font-mono text-base text-emerald-600 dark:text-emerald-400">
              Rp {data.grossProfit.toLocaleString('id-ID')}
            </span>
          </div>

          {/* Operating Expenses */}
          <div className="space-y-2">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] font-mono block">
              3. Beban Operasional & Umum (OpEx)
            </span>
            <div className="space-y-1.5">
              {data.operatingExpenses.map((exp) => (
                <div
                  key={exp.code}
                  className="flex justify-between items-center text-xs p-2 bg-slate-50 dark:bg-slate-950 rounded-xl"
                >
                  <span className="text-slate-700 dark:text-slate-300">
                    <b className="font-mono text-[10px] text-slate-400 mr-2">{exp.code}</b>
                    {exp.name}
                  </span>
                  <span className="font-mono font-bold text-slate-600 dark:text-slate-400">
                    (Rp {exp.amount.toLocaleString('id-ID')})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Net Income */}
          <div className="flex justify-between items-center p-4 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-2xl shadow-lg shadow-red-600/30 font-black">
            <div>
              <span className="text-xs uppercase tracking-wider block opacity-80">Laba Bersih Tahun Berjalan</span>
              <span className="text-lg">LABA BERSIH (NET PROFIT / EBITDA):</span>
            </div>
            <span className="font-mono text-2xl">
              Rp {data.netIncome.toLocaleString('id-ID')}
            </span>
          </div>
        </div>
      )}

      {/* TAB 2: BALANCE SHEET */}
      {activeTab === 'bs' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
              Laporan Posisi Keuangan (Neraca Saldo)
            </h3>
            <p className="text-xs text-slate-400">Per 31 Agustus 2026 (Audited System)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Left: Assets */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <span className="font-bold text-slate-800 dark:text-slate-200 text-xs block">
                🏛️ TOTAL ASET (ASSETS): Rp 4.650.000.000
              </span>
              <div className="space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span>1101 Kas di Bank BCA:</span>
                  <b>Rp 890.000.000</b>
                </div>
                <div className="flex justify-between">
                  <span>1104 Persediaan Bahan Baku:</span>
                  <b>Rp 420.000.000</b>
                </div>
                <div className="flex justify-between">
                  <span>1201 Peralatan & Mesin Espresso:</span>
                  <b>Rp 3.200.000.000</b>
                </div>
                <div className="flex justify-between">
                  <span>1205 Akumulasi Penyusutan:</span>
                  <span className="text-rose-500">(Rp 140.000.000)</span>
                </div>
              </div>
            </div>

            {/* Right: Liabilities & Equity */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <span className="font-bold text-slate-800 dark:text-slate-200 text-xs block">
                🛡️ LIABILITAS & EKUITAS: Rp 4.650.000.000
              </span>
              <div className="space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span>2101 Hutang Usaha Supplier:</span>
                  <b>Rp 280.000.000</b>
                </div>
                <div className="flex justify-between">
                  <span>2103 Hutang PPN Keluaran 11%:</span>
                  <b>Rp 140.000.000</b>
                </div>
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>3101 Modal Disetor Pemilik:</span>
                  <b>Rp 4.097.770.000</b>
                </div>
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>3201 Laba Ditahan (Retained):</span>
                  <b>Rp 132.230.000</b>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GENERAL LEDGER */}
      {activeTab === 'ledger' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
              Jurnal Posting Buku Besar Terakhir
            </h3>
            <span className="text-xs font-mono text-emerald-500 font-bold">✓ Balance 100%</span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div>
                <span className="font-bold text-red-600 dark:text-red-400">JRN-POS-20260831-01</span>
                <p className="text-[11px] text-slate-500">Auto Posting POS Settlement Outlet Grand Indonesia</p>
              </div>
              <div className="text-right">
                <span className="text-emerald-500 font-bold">Debit: Rp 446.960.000</span>
                <span className="text-rose-500 font-bold block">Credit: Rp 446.960.000</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Presentation Deck Modal */}
      {isInvestorDeckOpen && <InvestorPitchDeckModal onClose={() => setIsInvestorDeckOpen(false)} />}
    </div>
  );
};
