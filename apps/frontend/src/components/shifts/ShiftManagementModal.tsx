'use client';

import React, { useState } from 'react';
import { useShiftStore } from '../../stores/useShiftStore';
import { useTenantStore } from '../../stores/useTenantStore';
import { useAuthStore } from '../../stores/useAuthStore';

interface ShiftManagementModalProps {
  onClose: () => void;
}

export const ShiftManagementModal: React.FC<ShiftManagementModalProps> = ({ onClose }) => {
  const { currentShift, isShiftOpen, openShift, closeShift, shiftHistory } = useShiftStore();
  const { currentBranch } = useTenantStore();
  const { currentUser } = useAuthStore();

  // Open Shift Form
  const [openingCash, setOpeningCash] = useState<number>(500000);
  const [scheduledTime, setScheduledTime] = useState<string>('08:00');

  // Close Shift Form
  const [actualCashCounted, setActualCashCounted] = useState<number>(3950000);
  const [closeNotes, setCloseNotes] = useState<string>('');

  const handleOpenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    openShift({
      cashierId: currentUser.id,
      cashierName: currentUser.name,
      branchId: currentBranch?.id || 'br-01',
      branchName: currentBranch?.name || 'Outlet Grand Indonesia',
      openingCash,
      scheduledTime,
    });
    onClose();
  };

  const handleCloseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    closeShift({
      actualCashCounted,
      notes: closeNotes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs">
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xl">⏱️</span>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Manajemen Shift Kasir (Open / Close Shift)
              </h3>
              <div className="text-[10px] text-slate-400">
                {currentBranch?.name || 'Outlet Grand Indonesia'} • Status:{' '}
                <span className={`font-bold ${isShiftOpen ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {isShiftOpen ? '🟢 SHIFT AKTIF (OPEN)' : '🔴 SHIFT DITUTUP (CLOSED)'}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 font-bold px-2 py-1">✕</button>
        </div>

        {/* 1. OPEN SHIFT FORM (IF CLOSED) */}
        {!isShiftOpen ? (
          <form onSubmit={handleOpenSubmit} className="space-y-3">
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl space-y-1">
              <span className="font-bold text-emerald-900 dark:text-emerald-300">
                🟢 Membuka Shift Kasir Baru
              </span>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                Kasir: <b>{currentUser.name}</b> di <b>{currentBranch?.name}</b>. Masukkan modal kas awal laci.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Jadwal Masuk Shift
                </label>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Modal Kas Awal Laci (Rp)
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  step={10000}
                  value={openingCash}
                  onChange={(e) => setOpeningCash(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-mono font-bold text-red-600 dark:text-red-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-2xl shadow-lg shadow-emerald-600/20 transition-all active:scale-95 text-xs"
            >
              Buka Shift & Kirim Notifikasi ke Owner
            </button>
          </form>
        ) : (
          /* 2. CLOSE SHIFT RECONCILIATION FORM (IF OPEN) */
          <form onSubmit={handleCloseSubmit} className="space-y-3">
            {currentShift && (
              <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Kasir Aktif:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{currentShift.cashierName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Dibuka Pukul:</span>
                  <span className="text-slate-800 dark:text-slate-200">
                    {new Date(currentShift.openedAt).toLocaleTimeString('id-ID')}
                    {currentShift.isLate && (
                      <span className="text-rose-500 font-bold ml-1">
                        (Telat {currentShift.lateMinutes} mnt)
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Modal Kas Awal:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    Rp {currentShift.openingCash.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Hitung Total Uang Tunai Fisik di Laci Kasir (Rp):
              </label>
              <input
                type="number"
                required
                min={0}
                value={actualCashCounted}
                onChange={(e) => setActualCashCounted(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-red-500/50 rounded-2xl px-4 py-2.5 font-mono font-bold text-base text-red-600 dark:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Catatan Serah Terima Shift
              </label>
              <input
                type="text"
                placeholder="Contoh: Laci kas rapi, stok receipt paper aman."
                value={closeNotes}
                onChange={(e) => setCloseNotes(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 rounded-2xl shadow-lg shadow-rose-600/20 transition-all active:scale-95 text-xs"
            >
              Tutup Shift & Rekonsiliasi Otomatis ke Owner
            </button>
          </form>
        )}

        {/* Shift History Log */}
        {shiftHistory.length > 0 && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] font-mono">
              Riwayat Shift Terakhir
            </span>
            <div className="max-h-32 overflow-y-auto space-y-1.5">
              {shiftHistory.slice(0, 3).map((s) => (
                <div
                  key={s.id}
                  className="p-2 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center text-[11px] font-mono"
                >
                  <div>
                    <span className="font-bold">{s.cashierName}</span> • {s.branchName}
                  </div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    Kas: Rp {s.actualCashCounted?.toLocaleString('id-ID')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
