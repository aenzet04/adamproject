'use client';

import React, { useState } from 'react';
import { useAuditLogStore, AuditActionType } from '../../stores/useAuditLogStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { exportToExcelCsv, triggerPrintPdf } from '../../lib/exportUtils';
import { toast } from '../../stores/useToastStore';

interface AuditLogViewerModalProps {
  onClose: () => void;
}

export const AuditLogViewerModal: React.FC<AuditLogViewerModalProps> = ({ onClose }) => {
  const { logs, clearLogs } = useAuditLogStore();
  const { currentUser } = useAuthStore();
  const [moduleFilter, setModuleFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const isSuperUserOrOwner = currentUser.role === 'super_user' || currentUser.role === 'owner' || (currentUser.role as string) === 'general_manager';

  const filteredLogs = logs.filter((log) => {
    const matchMod = moduleFilter === 'all' || log.module === moduleFilter;
    const matchSearch =
      log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actionTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.branchName && log.branchName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchMod && matchSearch;
  });

  const handleExportExcel = () => {
    const headers = ['Waktu (Timestamp)', 'Petugas (Actor)', 'Role', 'Aksi Audit', 'Modul', 'Cabang', 'Rincian Perubahan', 'IP Address', 'Tingkat Keamanan'];
    const rows = filteredLogs.map((l) => [
      l.timestamp,
      l.actorName,
      l.actorRole,
      l.actionTitle,
      l.module,
      l.branchName || 'Headquarters',
      l.details,
      l.ipAddress,
      l.severity,
    ]);
    exportToExcelCsv(`Audit_Security_Logs_Modula_${Date.now().toString().slice(-4)}`, rows, headers);
    toast.success('Log Audit Diekspor', 'File audit security log siap diverifikasi.');
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl">🛡️</span>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Sistem Audit Log & Rekam Jejak Keamanan (Enterprise RBAC)
              </h3>
              <span className="bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 font-mono text-[9px] px-2 py-0.5 rounded-full font-bold">
                IMMUTABLE AUDIT TRAIL
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Setiap perubahan stok, harga, mutasi staf, dan sesi kasir tersimpan permanen untuk verifikasi Super User & Owner.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold">✕</button>
        </div>

        {!isSuperUserOrOwner ? (
          <div className="p-12 text-center space-y-3">
            <span className="text-4xl block">🚫</span>
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Akses Dibatasi</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Hanya <b>Super User</b>, <b>Brand Owner</b>, dan <b>General Manager</b> dengan otorisasi keamanan tingkat tinggi yang dapat mengakses log audit sistem.
            </p>
          </div>
        ) : (
          <>
            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs">
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Cari nama staf, aksi, cabang..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 w-full sm:w-60 focus:outline-none"
                />

                <select
                  value={moduleFilter}
                  onChange={(e) => setModuleFilter(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 font-semibold"
                >
                  <option value="all">Semua Modul</option>
                  <option value="INVENTORY">Gudang & SCM</option>
                  <option value="POS">Kasir POS</option>
                  <option value="STAFF">Karyawan & Mutasi</option>
                  <option value="ONBOARDING">Setup Onboarding</option>
                </select>
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={handleExportExcel}
                  className="bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl font-bold text-xs"
                >
                  📊 Export Excel
                </button>
                <button
                  type="button"
                  onClick={() => triggerPrintPdf('Audit_Security_Logs_Modula')}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-xl font-bold text-xs"
                >
                  🖨️ Cetak PDF
                </button>
              </div>
            </div>

            {/* Logs List Table */}
            <div className="flex-1 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono text-[10px] uppercase sticky top-0">
                  <tr>
                    <th className="p-3">Waktu & IP</th>
                    <th className="p-3">Petugas (Actor)</th>
                    <th className="p-3">Aksi & Modul</th>
                    <th className="p-3">Rincian Perubahan</th>
                    <th className="p-3 text-center">Tingkat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-sans">
                  {filteredLogs.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50">
                      <td className="p-3 font-mono text-[10px] text-slate-400 whitespace-nowrap">
                        <div>{l.timestamp}</div>
                        <div className="text-slate-500">{l.ipAddress}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-slate-800 dark:text-slate-100">{l.actorName}</div>
                        <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.2 rounded font-mono font-bold uppercase">
                          {l.actorRole.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-slate-700 dark:text-slate-200">{l.actionTitle}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          [{l.module}] {l.branchName ? `• ${l.branchName}` : ''}
                        </div>
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                        {l.details}
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                            l.severity === 'CRITICAL'
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                              : l.severity === 'WARNING'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}
                        >
                          {l.severity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
