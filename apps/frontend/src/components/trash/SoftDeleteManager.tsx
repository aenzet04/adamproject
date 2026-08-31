'use client';

import React, { useState } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import { toast } from '../../stores/useToastStore';

interface SoftDeletedItem {
  id: string;
  itemType: 'Product' | 'Transaction' | 'Staff' | 'Branch';
  name: string;
  deletedBy: string;
  deletedAt: string;
  reason: string;
  status: 'PENDING_APPROVAL' | 'APPROVED_BY_OWNER' | 'PURGED_BY_SUPERUSER';
}

const INITIAL_TRASH: SoftDeletedItem[] = [
  {
    id: 'del-prod-99',
    itemType: 'Product',
    name: 'Syrup Vanilla Botol 1L (SKU: SYR-VAN-99)',
    deletedBy: 'Rian Setyadi (Branch Admin)',
    deletedAt: '2026-09-01T03:30:00Z',
    reason: 'Discontinue supplier dan diganti merk baru',
    status: 'PENDING_APPROVAL',
  },
  {
    id: 'del-txn-12',
    itemType: 'Transaction',
    name: 'Void Transaksi Meja 04 (ORD-OLD-0012)',
    deletedBy: 'Siti Rahma (Kasir)',
    deletedAt: '2026-08-31T18:20:00Z',
    reason: 'Salah ketik kuantiti kasir',
    status: 'APPROVED_BY_OWNER',
  },
];

export const SoftDeleteManager: React.FC = () => {
  const { currentUser } = useAuthStore();
  const [trashItems, setTrashItems] = useState<SoftDeletedItem[]>(INITIAL_TRASH);

  const isOwner = currentUser.role === 'owner';
  const isSuperUser = currentUser.role === 'super_user';

  const handleOwnerApprove = (id: string) => {
    setTrashItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, status: 'APPROVED_BY_OWNER' } : it))
    );
    toast.success('Persetujuan Penghapusan Diberikan', 'Super User kini memiliki otorisasi untuk purge / restore.');
  };

  const handleSuperUserPurge = (id: string) => {
    setTrashItems((prev) => prev.filter((it) => it.id !== id));
    toast.success('Data Berhasil Dipurge Permanen', 'Otorisasi Super User selesai dieksekusi.');
  };

  const handleRestore = (id: string) => {
    setTrashItems((prev) => prev.filter((it) => it.id !== id));
    toast.success('Data Berhasil Dipulihkan (Restored)', 'Item telah kembali aktif di katalog.');
  };

  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🗑️</span>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Tata Kelola Soft-Delete (No Hard Delete Policy)
            </h2>
            <span className="bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold">
              3-Tier Approval Workflow
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Data produksi tidak pernah dihapus langsung (Hard Delete). Pemulihan atau pembersihan permanen memerlukan otorisasi bertingkat Kasir $\rightarrow$ Owner $\rightarrow$ Super User.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
          Daftar Item Soft-Deleted ({trashItems.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                <th className="pb-2">Nama / Entitas</th>
                <th className="pb-2">Tipe Data</th>
                <th className="pb-2">Dihapus Oleh</th>
                <th className="pb-2">Alasan Penghapusan</th>
                <th className="pb-2">Status Otorisasi</th>
                <th className="pb-2 text-right">Aksi Governance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {trashItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 font-bold text-slate-800 dark:text-slate-100 font-sans">{item.name}</td>
                  <td className="py-3 text-slate-600 dark:text-slate-300">{item.itemType}</td>
                  <td className="py-3 text-slate-500">{item.deletedBy}</td>
                  <td className="py-3 text-slate-500 italic font-sans">{item.reason}</td>
                  <td className="py-3">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === 'APPROVED_BY_OWNER'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                      }`}
                    >
                      {item.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 text-right space-x-2 font-sans">
                    <button
                      onClick={() => handleRestore(item.id)}
                      className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                    >
                      Pulihkan (Restore)
                    </button>

                    {isOwner && item.status === 'PENDING_APPROVAL' && (
                      <button
                        onClick={() => handleOwnerApprove(item.id)}
                        className="bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg"
                      >
                        Beri Izin Owner
                      </button>
                    )}

                    {isSuperUser && item.status === 'APPROVED_BY_OWNER' && (
                      <button
                        onClick={() => handleSuperUserPurge(item.id)}
                        className="bg-rose-700 hover:bg-rose-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-sm"
                      >
                        Purge Permanen (Super User)
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
