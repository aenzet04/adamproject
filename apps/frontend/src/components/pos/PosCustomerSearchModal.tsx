'use client';

import React, { useState } from 'react';
import { useCustomerStore, CustomerMember } from '../../stores/useCustomerStore';
import { useTenantStore } from '../../stores/useTenantStore';
import { toast } from '../../stores/useToastStore';

interface PosCustomerSearchModalProps {
  onSelectCustomer: (customerName: string, customerPhone?: string) => void;
  onClose: () => void;
}

export const PosCustomerSearchModal: React.FC<PosCustomerSearchModalProps> = ({
  onSelectCustomer,
  onClose,
}) => {
  const { customers, addCustomer } = useCustomerStore();
  const { currentBranch } = useTenantStore();

  const [query, setQuery] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  // Quick Register State
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.phone.includes(query) ||
      (c.email && c.email.toLowerCase().includes(query.toLowerCase()))
  );

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    addCustomer({
      name: newName.trim(),
      phone: newPhone.trim(),
      email: newEmail.trim() || undefined,
      branchId: currentBranch?.id || 'br-01',
      branchName: currentBranch?.name || 'Outlet Grand Indonesia',
      tier: 'Silver',
      points: 10, // Welcome points
      lifetimeSpend: 0,
      visitCount: 0,
      joinedDate: new Date().toISOString().split('T')[0],
    });

    toast.success('Member Baru Terdaftar', `${newName} (+10 Poin Welcome Bonus)`);
    onSelectCustomer(newName.trim(), newPhone.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">👥</span>
            <div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center space-x-2">
                <span>Pencarian Member CRM Kasir</span>
                <span className="bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 font-mono text-[9px] px-1.5 py-0.2 rounded font-bold">
                  [F3 Shortcut]
                </span>
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">
                Pilih konsumen terdaftar untuk alokasi poin reward & tier diskon
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 font-bold hover:text-slate-700">✕</button>
        </div>

        {!isRegistering ? (
          <div className="space-y-3">
            {/* Search Bar */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                autoFocus
                placeholder="Ketik nama konsumen, nomor WhatsApp / HP..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-inner"
              />
              <button
                type="button"
                onClick={() => setIsRegistering(true)}
                className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2.5 rounded-2xl text-xs whitespace-nowrap shadow-md shadow-red-600/20"
              >
                + Tamu Baru
              </button>
            </div>

            {/* Customer List */}
            <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1">
              {filteredCustomers.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <span className="text-3xl">🔍</span>
                  <p className="text-slate-400 text-xs">Konsumen tidak ditemukan.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setNewName(query);
                      setIsRegistering(true);
                    }}
                    className="text-red-600 font-bold hover:underline text-xs"
                  >
                    + Daftarkan "{query}" Sebagai Member Baru
                  </button>
                </div>
              ) : (
                filteredCustomers.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      onSelectCustomer(c.name, c.phone);
                      toast.success('Konsumen Terpilih', `${c.name} (${c.tier} - ${c.points} Poin)`);
                      onClose();
                    }}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 hover:bg-red-50 dark:hover:bg-red-950/40 border border-slate-200 dark:border-slate-800 flex justify-between items-center cursor-pointer transition-all group"
                  >
                    <div>
                      <div className="font-bold text-xs text-slate-800 dark:text-slate-200 group-hover:text-red-600 transition-colors flex items-center space-x-1.5">
                        <span>{c.name}</span>
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                            c.tier === 'VIP'
                              ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                              : c.tier === 'Gold'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-600'
                          }`}
                        >
                          {c.tier}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        📱 {c.phone} • Belanja: Rp {c.lifetimeSpend.toLocaleString('id-ID')}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold font-mono text-emerald-600 dark:text-emerald-400 text-xs">
                        {c.points} Poin
                      </div>
                      <span className="text-[9px] text-slate-400 font-mono">Pilih Tamu ➔</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          /* QUICK REGISTER FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            <div className="font-bold text-xs text-slate-800 dark:text-slate-200">
              Formulir Cepat Pendaftaran Member Kasir:
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap:</label>
              <input
                type="text"
                required
                autoFocus
                placeholder="Contoh: Bpk. Irwan Hidayat"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">No. WhatsApp / HP:</label>
                <input
                  type="tel"
                  required
                  placeholder="081234567890"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email (Opsional):</label>
                <input
                  type="email"
                  placeholder="irwan@email.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-[10px] text-emerald-800 dark:text-emerald-300">
              🎁 <b>Welcome Bonus:</b> Member baru otomatis mendapatkan 10 poin reward perdana!
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsRegistering(false)}
                className="px-4 py-2 text-slate-500 font-semibold"
              >
                Kembali Cari
              </button>
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-500 text-white font-bold px-5 py-2 rounded-xl shadow-md"
              >
                Daftarkan & Pilih
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
