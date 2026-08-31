'use client';

import React, { useState } from 'react';
import type { ProfitLossReport } from '../../types';

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

  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">📊</span>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
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
        <div className="flex space-x-2">
          <button
            onClick={() => alert('Exporting Excel Worksheet...')}
            className="bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            📊 Export Excel (XLSX)
          </button>
          <button
            onClick={() => window.print()}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20"
          >
            📄 Cetak PDF Resmi
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 dark:border-slate-800 mb-6">
        <button
          onClick={() => setActiveTab('pl')}
          className={`pb-2.5 px-4 text-xs font-bold transition-all ${
            activeTab === 'pl'
              ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Laba Rugi (Profit & Loss)
        </button>
        <button
          onClick={() => setActiveTab('bs')}
          className={`pb-2.5 px-4 text-xs font-bold transition-all ${
            activeTab === 'bs'
              ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Neraca Keuangan (Balance Sheet)
        </button>
        <button
          onClick={() => setActiveTab('ledger')}
          className={`pb-2.5 px-4 text-xs font-bold transition-all ${
            activeTab === 'ledger'
              ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Buku Besar (General Ledger Audit)
        </button>
      </div>

      {/* PROFIT & LOSS CONTENT */}
      {activeTab === 'pl' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-4xl shadow-sm transition-colors">
          <div className="text-center border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
            <h3 className="text-base font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider">
              PT Multi Industri Nusantara
            </h3>
            <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              Laporan Laba Rugi Komprehensif
            </div>
            <div className="text-xs text-slate-400">Periode: 1 Agustus 2026 s/d 31 Agustus 2026 (Semua Outlet)</div>
          </div>

          <div className="space-y-6 text-xs">
            {/* 1. REVENUE */}
            <div>
              <div className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-2 border-b border-slate-100 dark:border-slate-800 pb-1">
                1. PENDAPATAN USAHA (REVENUE)
              </div>
              <div className="space-y-2 pl-3">
                {data.revenues.map((rev) => (
                  <div key={rev.code} className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>
                      <span className="font-mono text-slate-400 mr-2">{rev.code}</span>
                      {rev.name}
                    </span>
                    <span className="font-mono font-semibold">Rp {rev.amount.toLocaleString('id-ID')}</span>
                  </div>
                ))}
                <div className="flex justify-between font-black text-slate-900 dark:text-slate-100 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span>TOTAL PENDAPATAN USAHA</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                    Rp {data.totalRevenue.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. COGS */}
            <div>
              <div className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-2 border-b border-slate-100 dark:border-slate-800 pb-1">
                2. BEBAN POKOK PENJUALAN (HPP / COGS)
              </div>
              <div className="space-y-2 pl-3">
                {data.cogs.map((c) => (
                  <div key={c.code} className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>
                      <span className="font-mono text-slate-400 mr-2">{c.code}</span>
                      {c.name}
                    </span>
                    <span className="font-mono text-rose-600 dark:text-rose-400 font-semibold">
                      Rp {c.amount.toLocaleString('id-ID')}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between font-black text-slate-900 dark:text-slate-100 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span>TOTAL BEBAN POKOK PENJUALAN</span>
                  <span className="text-rose-600 dark:text-rose-400 font-mono">
                    (Rp {data.totalCogs.toLocaleString('id-ID')})
                  </span>
                </div>
              </div>
            </div>

            {/* GROSS PROFIT */}
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-between items-center shadow-inner">
              <span className="font-black text-slate-800 dark:text-slate-100 text-sm">
                LABA KOTOR (GROSS PROFIT)
              </span>
              <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
                Rp {data.grossProfit.toLocaleString('id-ID')}
              </span>
            </div>

            {/* 3. EXPENSES */}
            <div>
              <div className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-2 border-b border-slate-100 dark:border-slate-800 pb-1">
                3. BEBAN OPERASIONAL
              </div>
              <div className="space-y-2 pl-3">
                {data.operatingExpenses.map((exp) => (
                  <div key={exp.code} className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>
                      <span className="font-mono text-slate-400 mr-2">{exp.code}</span>
                      {exp.name}
                    </span>
                    <span className="font-mono text-rose-600 dark:text-rose-400 font-semibold">
                      Rp {exp.amount.toLocaleString('id-ID')}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between font-black text-slate-900 dark:text-slate-100 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span>TOTAL BEBAN OPERASIONAL</span>
                  <span className="text-rose-600 dark:text-rose-400 font-mono">
                    (Rp {data.totalOperatingExpense.toLocaleString('id-ID')})
                  </span>
                </div>
              </div>
            </div>

            {/* NET INCOME */}
            <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-500/40 flex justify-between items-center">
              <div>
                <div className="text-sm font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                  LABA BERSIH TAHUN BERJALAN (NET INCOME)
                </div>
                <div className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  Margin Bersih: {((data.netIncome / data.totalRevenue) * 100).toFixed(1)}%
                </div>
              </div>
              <div className="text-xl font-black text-emerald-700 dark:text-emerald-400 font-mono">
                Rp {data.netIncome.toLocaleString('id-ID')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
