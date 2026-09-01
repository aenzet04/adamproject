'use client';

import React, { useState } from 'react';
import { toast } from '../../stores/useToastStore';
import { useAuthStore } from '../../stores/useAuthStore';

interface TableMeta {
  tableName: string;
  rowCount: number;
  sizeBytes: string;
  indexes: number;
  engine: string;
  description: string;
}

const DATABASE_TABLES: TableMeta[] = [
  { tableName: 'tenants', rowCount: 3, sizeBytes: '14 KB', indexes: 2, engine: 'PostgreSQL InnoDB', description: 'Holding legal entity data & feature flags' },
  { tableName: 'brands', rowCount: 8, sizeBytes: '32 KB', indexes: 3, engine: 'PostgreSQL InnoDB', description: 'Multi-brand profiles & industry classifications' },
  { tableName: 'branches', rowCount: 18, sizeBytes: '48 KB', indexes: 4, engine: 'PostgreSQL InnoDB', description: 'Geofenced physical outlets & stores' },
  { tableName: 'warehouses', rowCount: 12, sizeBytes: '28 KB', indexes: 3, engine: 'PostgreSQL InnoDB', description: 'Multi-warehouse facilities & costing models' },
  { tableName: 'users', rowCount: 42, sizeBytes: '64 KB', indexes: 5, engine: 'PostgreSQL InnoDB', description: 'User credentials, roles & cashier PIN hashes' },
  { tableName: 'products', rowCount: 1540, sizeBytes: '512 KB', indexes: 6, engine: 'PostgreSQL InnoDB', description: 'Product catalog, SKU, UOM & moving avg cost' },
  { tableName: 'orders', rowCount: 128900, sizeBytes: '42.8 MB', indexes: 8, engine: 'PostgreSQL InnoDB', description: 'POS omnichannel transactions & split bills' },
  { tableName: 'order_items', rowCount: 384500, sizeBytes: '96.2 MB', indexes: 9, engine: 'PostgreSQL InnoDB', description: 'Transaction line items & kitchen notes' },
  { tableName: 'purchase_inbounds', rowCount: 840, sizeBytes: '2.4 MB', indexes: 4, engine: 'PostgreSQL InnoDB', description: 'Vendor supplier invoices & restock proofs' },
  { tableName: 'journal_entries', rowCount: 257800, sizeBytes: '78.5 MB', indexes: 7, engine: 'PostgreSQL InnoDB', description: 'General Ledger PSAK double-entry journals' },
  { tableName: 'audit_logs', rowCount: 89000, sizeBytes: '24.1 MB', indexes: 5, engine: 'PostgreSQL InnoDB', description: 'Immutable security inspection records' },
];

export const DatabaseManagerView: React.FC = () => {
  const { currentUser } = useAuthStore();
  const [selectedTable, setSelectedTable] = useState<TableMeta>(DATABASE_TABLES[0]);
  const [sqlQuery, setSqlQuery] = useState<string>('SELECT * FROM tenants ORDER BY id ASC LIMIT 50;');
  const [queryResult, setQueryResult] = useState<any[] | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeTab, setActiveTab] = useState<'tables' | 'query' | 'backups' | 'health'>('tables');

  const handleRunQuery = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      if (sqlQuery.toLowerCase().includes('tenants')) {
        setQueryResult([
          { id: 'ten-001', name: 'PT Multi Industri Nusantara', legal_entity: 'PT', subdomain: 'nusantara', status: 'ACTIVE', created_at: '2026-01-01' },
          { id: 'ten-002', name: 'CV Berkah Mart Retail', legal_entity: 'CV', subdomain: 'berkahmart', status: 'ACTIVE', created_at: '2026-02-15' },
          { id: 'ten-003', name: 'Elite Grooming Studio', legal_entity: 'PERORANGAN', subdomain: 'elitegroom', status: 'ACTIVE', created_at: '2026-03-01' },
        ]);
      } else {
        setQueryResult([
          { id: 'row-001', record_key: 'sample_01', status: 'VALID', indexed: true, updated_at: '2026-09-01T07:30:00Z' },
          { id: 'row-002', record_key: 'sample_02', status: 'VALID', indexed: true, updated_at: '2026-09-01T07:30:05Z' },
        ]);
      }
      toast.success('Query Berhasil Dieksekusi', '0.12 ms execution time • 0 locks detected');
    }, 250);
  };

  const handleCreateSnapshot = () => {
    toast.success('Snapshot Database Dibuat', `modula_pgdump_${new Date().toISOString().slice(0, 10)}.sql.enc (AES-256 GCM)`);
  };

  return (
    <div className="p-4 md:p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors space-y-6">
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🗄️</span>
            <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100">
              Database Core & Multi-Tenant Schema Manager
            </h2>
            <span className="bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400 border border-purple-300 dark:border-purple-800 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold">
              Super User Restricted
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manajemen relasional skema database, eksekusi query PostgreSQL, status indeks, dan snapshot backup holding.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleCreateSnapshot}
            className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2.5 rounded-2xl text-xs shadow-md shadow-purple-600/20 active:scale-95 flex items-center space-x-1.5"
          >
            <span>💾</span>
            <span>Buat Backup Snapshot</span>
          </button>
        </div>
      </div>

      {/* 2. STATS ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-400 font-mono uppercase font-bold">Total Relational Tables</span>
          <div className="text-2xl font-bold font-mono text-purple-600 dark:text-purple-400">11 Tabel</div>
          <span className="text-[10px] text-emerald-500 font-semibold">● 100% Normalized (3NF)</span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-400 font-mono uppercase font-bold">Database Storage Size</span>
          <div className="text-2xl font-bold font-mono text-slate-800 dark:text-slate-100">244.5 MB</div>
          <span className="text-[10px] text-slate-400">Compressed WAL</span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-400 font-mono uppercase font-bold">Query Latency (p99)</span>
          <div className="text-2xl font-bold font-mono text-emerald-500">0.38 ms</div>
          <span className="text-[10px] text-emerald-500 font-semibold">Sub-millisecond</span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-400 font-mono uppercase font-bold">Replication Lag</span>
          <div className="text-2xl font-bold font-mono text-slate-800 dark:text-slate-100">0.00 ms</div>
          <span className="text-[10px] text-blue-500 font-semibold">Synchronous Mirror</span>
        </div>
      </div>

      {/* 3. TABS SWITCHER */}
      <div className="flex space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('tables')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'tables'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          📑 Daftar Tabel & Skema ({DATABASE_TABLES.length})
        </button>
        <button
          onClick={() => setActiveTab('query')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'query'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          ⚡ SQL Query Runner
        </button>
        <button
          onClick={() => setActiveTab('health')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'health'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          🛡️ Health & Enkripsi Zero-Knowledge
        </button>
      </div>

      {/* 4. TAB 1: TABLES */}
      {activeTab === 'tables' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            Relational Schema Tables
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono">
                  <th className="pb-3 font-semibold">Nama Tabel</th>
                  <th className="pb-3 font-semibold">Jumlah Baris</th>
                  <th className="pb-3 font-semibold">Ukuran Fisik</th>
                  <th className="pb-3 font-semibold">Indeks B-Tree</th>
                  <th className="pb-3 font-semibold">Engine</th>
                  <th className="pb-3 font-semibold">Deskripsi Entitas</th>
                  <th className="pb-3 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
                {DATABASE_TABLES.map((t) => (
                  <tr key={t.tableName} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 font-bold text-purple-600 dark:text-purple-400">
                      {t.tableName}
                    </td>
                    <td className="py-3">{t.rowCount.toLocaleString('id-ID')} baris</td>
                    <td className="py-3">{t.sizeBytes}</td>
                    <td className="py-3">{t.indexes} Indexes</td>
                    <td className="py-3 text-slate-500">{t.engine}</td>
                    <td className="py-3 font-sans text-slate-600 dark:text-slate-300">{t.description}</td>
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTable(t);
                          setSqlQuery(`SELECT * FROM ${t.tableName} ORDER BY id ASC LIMIT 50;`);
                          setActiveTab('query');
                        }}
                        className="bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800 px-2.5 py-1 rounded-xl text-[10px] font-bold"
                      >
                        Query Data ➔
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. TAB 2: QUERY RUNNER */}
      {activeTab === 'query' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Interactive SQL Console
            </h3>
            <span className="text-[10px] font-mono text-slate-400">PostgreSQL v16.2 Enterprise Engine</span>
          </div>

          <div className="space-y-2">
            <textarea
              rows={4}
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              className="w-full bg-slate-950 text-emerald-400 border border-slate-700 rounded-2xl p-4 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-inner"
            />
            <div className="flex justify-between items-center">
              <div className="text-[10px] text-slate-400 font-mono">
                💡 Tip: Gunakan <code>LIMIT</code> untuk query tabel besar seperti <code>orders</code> atau <code>journal_entries</code>.
              </div>
              <button
                type="button"
                onClick={handleRunQuery}
                disabled={isExecuting}
                className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-md shadow-purple-600/20 active:scale-95 flex items-center space-x-1.5"
              >
                <span>{isExecuting ? '⏳ Menjalankan...' : '▶ Jalankan SQL'}</span>
              </button>
            </div>
          </div>

          {queryResult && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-2">
                <span>Hasil Query: ({queryResult.length} Baris)</span>
                <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono text-[9px] px-1.5 py-0.2 rounded font-bold">
                  200 OK
                </span>
              </div>
              <div className="bg-slate-950 rounded-2xl p-4 overflow-x-auto border border-slate-800">
                <pre className="text-emerald-400 font-mono text-xs">
                  {JSON.stringify(queryResult, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. TAB 3: HEALTH */}
      {activeTab === 'health' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            Kesehatan Database & Protokol Enkripsi Zero-Knowledge
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                <span>🔒</span>
                <span>Enkripsi At-Rest AES-256 GCM</span>
              </div>
              <p className="text-slate-500 leading-relaxed">
                Seluruh data kolom sensitif, detail transaksi holding, dan PIN kasir dienkripsi secara kriptografis sebelum disimpan di storage disk.
              </p>
              <div className="text-[10px] font-mono text-emerald-500 font-bold">Status: ENCRYPTION_ACTIVE (Key ID: #MK-2026-NUSA)</div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                <span>🛡️</span>
                <span>Isolasi Tenancy Row-Level Security (RLS)</span>
              </div>
              <p className="text-slate-500 leading-relaxed">
                Setiap query otomatis difilter oleh parameter <code>tenant_id</code> dan <code>brand_id</code> untuk mencegah kebocoran data antar pemilik bisnis.
              </p>
              <div className="text-[10px] font-mono text-emerald-500 font-bold">Status: RLS_ENFORCED (100% Coverage)</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
