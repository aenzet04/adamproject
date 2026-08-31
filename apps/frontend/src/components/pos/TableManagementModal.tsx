'use client';

import React, { useState } from 'react';
import { usePosCartStore, HeldOrder } from '../../stores/usePosCartStore';
import { useCustomerStore } from '../../stores/useCustomerStore';
import { toast } from '../../stores/useToastStore';

interface TableManagementModalProps {
  onClose: () => void;
  onOpenPaymentForHeld?: () => void;
}

export const TableManagementModal: React.FC<TableManagementModalProps> = ({
  onClose,
  onOpenPaymentForHeld,
}) => {
  const { heldOrders, restoreHeldOrder, deleteHeldOrder, holdCurrentOrder, items, customerName, tableNumber } =
    usePosCartStore();
  const { customers } = useCustomerStore();

  // Form to hold current cart under specific customer & table
  const [newTableName, setNewTableName] = useState(tableNumber || 'Meja 01');
  const [newCustName, setNewCustName] = useState(customerName || '');
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [holdNotes, setHoldNotes] = useState('');

  const handleHoldCurrent = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.warning('Keranjang Kosong', 'Tambahkan menu terlebih dahulu sebelum hold table.');
      return;
    }

    const member = customers.find((c) => c.id === selectedMemberId);
    const finalCust = member ? member.name : newCustName || 'Pelanggan Walk-in';

    const saved = holdCurrentOrder({
      table: newTableName,
      name: finalCust,
      customerId: member?.id,
      customerTier: member?.tier,
      notes: holdNotes,
    });

    toast.success('Table Berhasil Disimpan', `${saved.tableNumber} atas nama ${saved.customerName}`);
    onClose();
  };

  const handleResumeOrder = (held: HeldOrder) => {
    restoreHeldOrder(held.id);
    toast.info('Meja Dipulihkan', `Melanjutkan transaksi ${held.tableNumber} (${held.customerName})`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 text-xs max-h-[90vh] flex flex-col justify-between transition-colors">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🍽️</span>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Pusat Manajemen Table & Transaksi Hold Antar Konsumen
              </h3>
              <p className="text-[10px] text-slate-400">
                Simpan pesanan per meja & atas nama konsumen member/guest secara terpisah.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 font-bold px-2 py-1">✕</button>
        </div>

        <div className="overflow-y-auto space-y-4 flex-1 pr-1">
          {/* 1. HOLD CURRENT CART FORM (IF ITEMS EXIST) */}
          {items.length > 0 && (
            <form onSubmit={handleHoldCurrent} className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  📌 Simpan / Hold Pesanan Saat Ini ({items.length} Item):
                </span>
                <span className="text-red-600 dark:text-red-400 font-mono font-bold">
                  Rp {items.reduce((s, i) => s + i.subtotal, 0).toLocaleString('id-ID')}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Nomor Meja / Area
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Meja 05"
                    value={newTableName}
                    onChange={(e) => setNewTableName(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Pilih Member CRM
                  </label>
                  <select
                    value={selectedMemberId}
                    onChange={(e) => {
                      setSelectedMemberId(e.target.value);
                      const m = customers.find((c) => c.id === e.target.value);
                      if (m) setNewCustName(m.name);
                    }}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5"
                  >
                    <option value="">-- Tamu / Guest --</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.tier})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Nama Atas Nama
                  </label>
                  <input
                    type="text"
                    placeholder="Bpk. Irwan / Walk-in"
                    value={newCustName}
                    onChange={(e) => setNewCustName(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md shadow-amber-600/20 active:scale-95"
                >
                  Hold Meja & Mulai Pesanan Berikutnya
                </button>
              </div>
            </form>
          )}

          {/* 2. LIST OF ACTIVE HELD TABLES */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] font-mono">
                Daftar Meja / Pesanan Aktif di-Hold ({heldOrders.length})
              </span>
            </div>

            {heldOrders.length === 0 ? (
              <div className="p-8 text-center text-slate-400 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
                <span className="text-3xl mb-1 block">🍽️</span>
                Tidak ada meja atau transaksi yang sedang di-hold.
              </div>
            ) : (
              heldOrders.map((h) => (
                <div
                  key={h.id}
                  className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-sm hover:border-red-500/50 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-black text-xs text-red-600 dark:text-red-400 font-mono">
                        {h.tableNumber}
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-100">
                        👤 {h.customerName}
                      </span>
                      {h.customerTier && (
                        <span className="bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 text-[9px] px-1.5 py-0.2 rounded font-mono font-bold">
                          {h.customerTier}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {h.items.length} Item ({h.items.map((i) => `${i.quantity}x ${i.productName}`).join(', ')})
                    </div>
                    {h.notes && (
                      <div className="text-[10px] text-slate-400 italic">Catatan: {h.notes}</div>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right font-mono">
                      <span className="text-[10px] text-slate-400 block">Total:</span>
                      <span className="text-sm font-black text-red-600 dark:text-red-400">
                        Rp {h.grandTotal.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        type="button"
                        onClick={() => handleResumeOrder(h)}
                        className="bg-red-600 hover:bg-red-500 text-white font-bold px-3 py-2 rounded-xl text-xs shadow-md shadow-red-600/20 active:scale-95"
                      >
                        Buka Meja
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          deleteHeldOrder(h.id);
                          toast.info('Meja Dihapus', `Hold ${h.tableNumber} dibatalkan.`);
                        }}
                        className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl"
                        title="Hapus Meja"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold px-5 py-2 rounded-xl text-xs"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
