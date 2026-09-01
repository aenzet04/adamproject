'use client';

import React, { useState } from 'react';
import { useStaffStore } from '../../stores/useStaffStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { toast } from '../../stores/useToastStore';
import { REGEX_PATTERNS } from '../../types';

interface CashierPinChangeModalProps {
  onClose: () => void;
}

export const CashierPinChangeModal: React.FC<CashierPinChangeModalProps> = ({ onClose }) => {
  const { currentUser } = useAuthStore();
  const { employees, changePin } = useStaffStore();

  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const currentEmployee = employees.find((e) => e.id === currentUser.id || e.email === currentUser.email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!REGEX_PATTERNS.PIN.test(newPinInput)) {
      setErrorMessage('PIN baru harus berupa 4-6 digit angka numerik.');
      toast.error('Format PIN Tidak Valid', 'Gunakan 4 sampai 6 digit angka.');
      return;
    }

    if (newPinInput === '0000') {
      setErrorMessage('PIN baru tidak boleh menggunakan PIN default 0000.');
      toast.error('PIN Terlalu Lemah', 'Jangan gunakan PIN default 0000.');
      return;
    }

    if (newPinInput !== confirmPinInput) {
      setErrorMessage('Konfirmasi PIN baru tidak cocok.');
      toast.error('PIN Tidak Cocok', 'Pastikan konfirmasi PIN sama persis.');
      return;
    }

    if (currentEmployee) {
      changePin(currentEmployee.id, newPinInput);
      toast.success('PIN Kasir Berhasil Diperbarui', 'Gunakan PIN baru ini saat membuka shift kasir POS.');
      onClose();
    } else {
      toast.success('PIN Kasir Diperbarui', 'PIN keamanan kasir berhasil disimpan.');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-xs">
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🔐</span>
            <div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                Ubah PIN Kasir POS
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">Keamanan Transaksi Kasir</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 font-bold hover:text-slate-700">✕</button>
        </div>

        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl text-[11px] text-amber-800 dark:text-amber-300 space-y-1">
          <div className="font-bold flex items-center space-x-1.5">
            <span>⚠️</span>
            <span>Wajib Mengubah PIN Default!</span>
          </div>
          <p className="opacity-90">
            PIN default kasir baru adalah <b>0000</b>. Demi keamanan transaksi dan otorisasi void/diskon, silakan buat PIN pribadi rahasia Anda.
          </p>
        </div>

        {errorMessage && (
          <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-xl text-rose-600 dark:text-rose-300 font-bold text-[11px]">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              PIN Saat Ini (Default 0000):
            </label>
            <input
              type="password"
              maxLength={6}
              required
              placeholder="0000"
              value={currentPinInput}
              onChange={(e) => setCurrentPinInput(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-center font-mono text-base tracking-widest"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              PIN Baru (4-6 Digit Angka):
            </label>
            <input
              type="password"
              maxLength={6}
              required
              placeholder="••••"
              value={newPinInput}
              onChange={(e) => setNewPinInput(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-center font-mono text-base tracking-widest"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Konfirmasi PIN Baru:
            </label>
            <input
              type="password"
              maxLength={6}
              required
              placeholder="••••"
              value={confirmPinInput}
              onChange={(e) => setConfirmPinInput(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-center font-mono text-base tracking-widest"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-500 font-semibold"
            >
              Nanti Saja
            </button>
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-500 text-white font-bold px-5 py-2 rounded-xl shadow-md"
            >
              Simpan PIN Baru
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
