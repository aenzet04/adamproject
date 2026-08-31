'use client';

import React, { useState } from 'react';
import { useStockOpnameStore, StockOpnameSession, OpnameReason } from '../../stores/useStockOpnameStore';
import { useTenantStore } from '../../stores/useTenantStore';
import { useStaffStore } from '../../stores/useStaffStore';
import { exportToExcelCsv, triggerPrintPdf } from '../../lib/exportUtils';
import { toast } from '../../stores/useToastStore';

export const StockOpnameView: React.FC = () => {
  const { sessions, createSession, updateSessionItem, finalizeAndApplyAdjustment, deleteSession } =
    useStockOpnameStore();
  const { availableWarehouses } = useTenantStore();
  const { employees } = useStaffStore();

  const [activeSessionId, setActiveSessionId] = useState<string | null>(sessions[0]?.id || null);
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);

  // New Session State
  const [warehouseId, setWarehouseId] = useState(availableWarehouses[0]?.id || 'wh-01');
  const [auditorName, setAuditorName] = useState('Hendra Saputra');
  const [auditorRole, setAuditorRole] = useState('Staf Gudang & SCM');
  const [sessionNotes, setSessionNotes] = useState('');

  const activeSession = sessions.find((s) => s.id === activeSessionId);

  const handleCreateSessionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const wh = availableWarehouses.find((w) => w.id === warehouseId) || { name: 'Gudang Utama Barista GI' };

    const newSess = createSession(
      warehouseId,
      wh.name,
      auditorName,
      auditorRole,
      sessionNotes || 'Audit fisik berkala stok persediaan outlet'
    );

    toast.success('Sesi Opname Dimulai', `Sesi ${newSess.sessionNumber} untuk ${wh.name}`);
    setActiveSessionId(newSess.id);
    setIsNewSessionModalOpen(false);
  };

  const handleFinalizeAdjustment = (sess: StockOpnameSession) => {
    if (confirm(`Finalisasi sesi ${sess.sessionNumber}? Stok fisik akan langsung disesuaikan ke data persediaan utama.`)) {
      finalizeAndApplyAdjustment(sess.id);
      toast.success(
        'Penyesuaian Stok Diterapkan',
        `Stok fisik ${sess.warehouseName} telah sinkron dan jurnal selisih telah dibukukan.`
      );
    }
  };

  const handleExportOpnameExcel = () => {
    if (!activeSession) return;
    const headers = ['Kode SKU', 'Nama Produk', 'Satuan', 'Stok Sistem', 'Stok Fisik (Aktual)', 'Selisih (Variance)', 'HPP Satuan (Rp)', 'Nilai Selisih (Rp)', 'Alasan Selisih', 'Catatan Audit'];
    const rows = activeSession.items.map((i) => [
      i.sku,
      i.productName,
      i.uom,
      i.systemStock,
      i.physicalStock,
      i.variance,
      i.unitCost,
      i.varianceValue,
      i.reason,
      i.notes || '-',
    ]);

    exportToExcelCsv(`Lembar_Kerja_Opname_${activeSession.sessionNumber}`, rows, headers);
    toast.success('Excel Opname Terunduh', `File lembar kerja ${activeSession.sessionNumber}.csv siap diedit.`);
  };

  return (
    <div className="p-4 md:p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">📋</span>
            <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100">
              Stok Opname & Audit Fisik Persediaan Gudang
            </h2>
            <span className="bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold">
              Inventory Physical Audit
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Penghitungan fisik berkala oleh staf gudang/manajer, audit selisih (*shrinkage* / rusak / tumpah), dan jurnal penyesuaian otomatis.
          </p>
        </div>

        {/* Action Controls: Export Excel, Cetak PDF, Tambah Sesi */}
        <div className="flex flex-wrap items-center gap-2">
          {activeSession && (
            <>
              <button
                type="button"
                onClick={handleExportOpnameExcel}
                className="bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3.5 py-2.5 rounded-2xl text-xs font-bold border border-slate-200 dark:border-slate-700 shadow-sm flex items-center space-x-1.5"
              >
                <span>📊</span>
                <span>Export Excel Opname</span>
              </button>

              <button
                type="button"
                onClick={() => triggerPrintPdf(`Berita_Acara_Opname_${activeSession.sessionNumber}`)}
                className="bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-2.5 rounded-2xl text-xs font-bold shadow-sm flex items-center space-x-1.5"
              >
                <span>🖨️</span>
                <span>Cetak Berita Acara (PDF)</span>
              </button>
            </>
          )}

          <button
            onClick={() => setIsNewSessionModalOpen(true)}
            className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2.5 rounded-2xl text-xs shadow-md shadow-red-600/20 active:scale-95 flex items-center space-x-1.5"
          >
            <span>+</span>
            <span>Mulai Sesi Opname Baru</span>
          </button>
        </div>
      </div>

      {/* SESSIONS SELECTOR BAR */}
      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {sessions.map((sess) => (
          <button
            key={sess.id}
            onClick={() => setActiveSessionId(sess.id)}
            className={`p-3 rounded-2xl border text-left min-w-[240px] transition-all flex flex-col justify-between space-y-1.5 ${
              activeSessionId === sess.id
                ? 'bg-white dark:bg-slate-900 border-red-500 shadow-md ring-1 ring-red-500/30'
                : 'bg-slate-100 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            <div className="flex justify-between items-center w-full">
              <span className="font-bold text-xs font-mono text-slate-800 dark:text-slate-100">
                {sess.sessionNumber}
              </span>
              <span
                className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                  sess.status === 'COMPLETED_ADJUSTED'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                }`}
              >
                {sess.status === 'COMPLETED_ADJUSTED' ? '✓ Disesuaikan' : '⏳ Draft Audit'}
              </span>
            </div>
            <div className="text-[11px] text-slate-500">{sess.warehouseName}</div>
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-200 dark:border-slate-800 w-full">
              <span>Auditor: {sess.auditorName.split(' ')[0]}</span>
              <span className={sess.totalVarianceItems > 0 ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>
                {sess.totalVarianceItems} Selisih
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* ACTIVE OPNAME SESSION DETAILS */}
      {activeSession ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
          {/* Top Session Summary */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl">📍</span>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    {activeSession.warehouseName} — {activeSession.sessionNumber}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Tanggal: {activeSession.opnameDate} • Petugas: <b>{activeSession.auditorName}</b> ({activeSession.auditorRole})
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
              <div className="text-right font-mono">
                <span className="text-[10px] text-slate-400 block">Total Nilai Selisih:</span>
                <span
                  className={`text-sm font-black ${
                    activeSession.totalVarianceValue < 0
                      ? 'text-rose-600 dark:text-rose-400'
                      : activeSession.totalVarianceValue > 0
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {activeSession.totalVarianceValue < 0 ? '-' : '+'} Rp{' '}
                  {Math.abs(activeSession.totalVarianceValue).toLocaleString('id-ID')}
                </span>
              </div>

              {activeSession.status === 'DRAFT' ? (
                <button
                  type="button"
                  onClick={() => handleFinalizeAdjustment(activeSession)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-2xl text-xs shadow-md shadow-emerald-600/20 active:scale-95"
                >
                  ✓ Terapkan Penyesuaian Stok
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => triggerPrintPdf(`Berita_Acara_${activeSession.sessionNumber}`)}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2 rounded-2xl text-xs shadow-sm flex items-center space-x-1.5"
                >
                  <span>🖨️</span>
                  <span>Cetak Berita Acara</span>
                </button>
              )}
            </div>
          </div>

          {/* Opname Items Audit Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                  <th className="pb-3">Produk & SKU</th>
                  <th className="pb-3 text-center">Stok Sistem</th>
                  <th className="pb-3 text-center">Hitungan Fisik (Aktual)</th>
                  <th className="pb-3 text-center">Selisih (Variance)</th>
                  <th className="pb-3 text-right">Nilai Selisih</th>
                  <th className="pb-3">Alasan Selisih</th>
                  <th className="pb-3">Catatan Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {activeSession.items.map((item) => {
                  return (
                    <tr key={item.productId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3">
                        <div className="font-bold text-slate-800 dark:text-slate-100">{item.productName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {item.sku} • {item.uom}
                        </div>
                      </td>

                      <td className="py-3 text-center font-mono font-bold text-slate-600 dark:text-slate-300">
                        {item.systemStock} {item.uom}
                      </td>

                      <td className="py-3 text-center">
                        {activeSession.status === 'DRAFT' ? (
                          <input
                            type="number"
                            min={0}
                            value={item.physicalStock}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 0;
                              updateSessionItem(
                                activeSession.id,
                                item.productId,
                                val,
                                val === item.systemStock ? 'SESUAI' : item.reason,
                                item.notes
                              );
                            }}
                            className="w-20 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-2 py-1 text-center font-mono font-bold text-xs focus:outline-none focus:ring-1 focus:ring-red-500"
                          />
                        ) : (
                          <span className="font-mono font-bold text-slate-800 dark:text-slate-100">
                            {item.physicalStock} {item.uom}
                          </span>
                        )}
                      </td>

                      <td className="py-3 text-center font-mono font-bold">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs ${
                            item.variance < 0
                              ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                              : item.variance > 0
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                              : 'text-slate-400'
                          }`}
                        >
                          {item.variance > 0 ? `+${item.variance}` : item.variance} {item.uom}
                        </span>
                      </td>

                      <td className="py-3 text-right font-mono font-bold">
                        <span
                          className={
                            item.varianceValue < 0
                              ? 'text-rose-600 dark:text-rose-400'
                              : item.varianceValue > 0
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-slate-400'
                          }
                        >
                          {item.varianceValue !== 0
                            ? `${item.varianceValue < 0 ? '-' : '+'} Rp ${Math.abs(item.varianceValue).toLocaleString('id-ID')}`
                            : 'Rp 0'}
                        </span>
                      </td>

                      <td className="py-3">
                        {activeSession.status === 'DRAFT' ? (
                          <select
                            value={item.reason}
                            onChange={(e) =>
                              updateSessionItem(
                                activeSession.id,
                                item.productId,
                                item.physicalStock,
                                e.target.value as OpnameReason,
                                item.notes
                              )
                            }
                            className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-2 py-1 text-[11px] font-semibold focus:outline-none"
                          >
                            <option value="SESUAI">✓ Sesuai (Match)</option>
                            <option value="RUSAK">⚠️ Rusak Fisik</option>
                            <option value="KADALUARSA">⏳ Kedaluwarsa</option>
                            <option value="TUMPAH_BOCOR">💧 Tumpah / Bocor</option>
                            <option value="SELISIH_HITUNG">🔢 Selisih Hitung</option>
                            <option value="SAMPLE_TESTING">☕ Sample / Barista Testing</option>
                            <option value="HILANG_SHRINKAGE">❌ Hilang (Shrinkage)</option>
                          </select>
                        ) : (
                          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                            {item.reason}
                          </span>
                        )}
                      </td>

                      <td className="py-3">
                        {activeSession.status === 'DRAFT' ? (
                          <input
                            type="text"
                            placeholder="Catatan..."
                            value={item.notes || ''}
                            onChange={(e) =>
                              updateSessionItem(
                                activeSession.id,
                                item.productId,
                                item.physicalStock,
                                item.reason,
                                e.target.value
                              )
                            }
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2 py-1 text-[10px] focus:outline-none"
                          />
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">{item.notes || '-'}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 space-y-2">
          <span className="text-4xl block">📋</span>
          <p className="font-semibold text-sm">Belum ada sesi stok opname aktif.</p>
          <button
            onClick={() => setIsNewSessionModalOpen(true)}
            className="text-red-600 font-bold hover:underline text-xs"
          >
            + Mulai Sesi Opname Pertama
          </button>
        </div>
      )}

      {/* MODAL START NEW OPNAME SESSION */}
      {isNewSessionModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xl">📋</span>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Mulai Sesi Stok Opname Baru
                </h3>
              </div>
              <button onClick={() => setIsNewSessionModalOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateSessionSubmit} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Gudang / Cabang Audit:</label>
                <select
                  value={warehouseId}
                  onChange={(e) => setWarehouseId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold"
                >
                  {availableWarehouses.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Petugas Auditor</label>
                  <input
                    type="text"
                    required
                    value={auditorName}
                    onChange={(e) => setAuditorName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Jabatan Auditor</label>
                  <input
                    type="text"
                    required
                    value={auditorRole}
                    onChange={(e) => setAuditorRole(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Catatan Sesi Opname</label>
                <input
                  type="text"
                  placeholder="Contoh: Opname fisik berkala akhir pekan"
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewSessionModalOpen(false)}
                  className="px-4 py-2 text-slate-500 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-500 text-white font-bold px-5 py-2 rounded-xl shadow-md"
                >
                  Buka Form Audit Opname
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
