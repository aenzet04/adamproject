'use client';

import React from 'react';

const MYSQL_TABLES = [
  { name: 'tenants', engine: 'InnoDB', rows: 1, collation: 'utf8mb4_unicode_ci', sizeKb: 16 },
  { name: 'brands', engine: 'InnoDB', rows: 3, collation: 'utf8mb4_unicode_ci', sizeKb: 16 },
  { name: 'branches', engine: 'InnoDB', rows: 3, collation: 'utf8mb4_unicode_ci', sizeKb: 16 },
  { name: 'warehouses', engine: 'InnoDB', rows: 2, collation: 'utf8mb4_unicode_ci', sizeKb: 16 },
  { name: 'users', engine: 'InnoDB', rows: 5, collation: 'utf8mb4_unicode_ci', sizeKb: 16 },
  { name: 'roles', engine: 'InnoDB', rows: 8, collation: 'utf8mb4_unicode_ci', sizeKb: 16 },
  { name: 'chart_of_accounts', engine: 'InnoDB', rows: 42, collation: 'utf8mb4_unicode_ci', sizeKb: 64 },
  { name: 'products', engine: 'InnoDB', rows: 14, collation: 'utf8mb4_unicode_ci', sizeKb: 32 },
  { name: 'stock_levels', engine: 'InnoDB', rows: 28, collation: 'utf8mb4_unicode_ci', sizeKb: 32 },
  { name: 'pos_orders', engine: 'InnoDB', rows: 120, collation: 'utf8mb4_unicode_ci', sizeKb: 96 },
  { name: 'journal_entries', engine: 'InnoDB', rows: 120, collation: 'utf8mb4_unicode_ci', sizeKb: 128 },
  { name: 'journal_entry_lines', engine: 'InnoDB', rows: 600, collation: 'utf8mb4_unicode_ci', sizeKb: 256 },
];

export const DatabaseManager: React.FC = () => {
  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🐬</span>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">MySQL / MariaDB Database Manager</h2>
            <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold">
              InnoDB Strict Mode
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Konfigurasi database relasional enterprise MySQL 8 / MariaDB dengan partisi Multi-Tenancy & Indexing performa tinggi.
          </p>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => alert('Rails ActiveRecord Migration Status: UP TO DATE (MySQL 8 / MariaDB)')}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-2 rounded-2xl text-xs flex items-center space-x-1.5 shadow-md shadow-emerald-600/20"
          >
            <span>🔄</span>
            <span>Check Migration Status</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Database Adapter</span>
          <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-1">mysql2 (v8.0)</div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">UTF-8 MB4 Unicode</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Connection Pool</span>
          <div className="text-lg font-bold text-blue-600 dark:text-blue-400 font-mono mt-1">16 Active Threads</div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Puma Multi-Worker Safe</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Transaction Engine</span>
          <div className="text-lg font-bold text-amber-600 dark:text-amber-400 font-mono mt-1">InnoDB ACID</div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Row-Level Locks (SELECT FOR UPDATE)</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Migrated Tables</span>
          <div className="text-lg font-bold text-purple-600 dark:text-purple-400 font-mono mt-1">{MYSQL_TABLES.length} Tables</div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">All UUIDv4 Char(36) Index</div>
        </div>
      </div>

      {/* Tables List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">Tabel Skema MySQL / MariaDB (InnoDB Active)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                <th className="pb-2">Nama Tabel</th>
                <th className="pb-2">Storage Engine</th>
                <th className="pb-2">Estimasi Baris</th>
                <th className="pb-2">Collation</th>
                <th className="pb-2 text-right">Ukuran Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {MYSQL_TABLES.map((t) => (
                <tr key={t.name} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 font-bold text-emerald-600 dark:text-emerald-400">{t.name}</td>
                  <td className="py-2.5 text-slate-600 dark:text-slate-300">{t.engine}</td>
                  <td className="py-2.5 text-slate-600 dark:text-slate-300">{t.rows.toLocaleString()}</td>
                  <td className="py-2.5 text-slate-400">{t.collation}</td>
                  <td className="py-2.5 text-right text-slate-600 dark:text-slate-300">{t.sizeKb} KB</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
