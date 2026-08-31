'use client';

import React, { useState } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import { toast } from '../../stores/useToastStore';

export interface BugTicket {
  id: string;
  title: string;
  module: 'POS Kasir' | 'Akuntansi GL' | 'Bluetooth 58mm' | 'Gudang & Stok' | 'Auth & Sesi';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  reportedBy: string;
  role: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
  description: string;
  createdAt: string;
  resolvedAt?: string;
  ownerNotified: boolean;
}

const INITIAL_TICKETS: BugTicket[] = [
  {
    id: 'TCK-20260901-01',
    title: 'ESC/POS 58mm buffer overflow saat antrian 20 struk cepat',
    module: 'Bluetooth 58mm',
    severity: 'HIGH',
    reportedBy: 'Siti Rahma',
    role: 'Kasir Outlet GI',
    status: 'INVESTIGATING',
    description: 'Saat kasir mencetak 20 nota berturut-turut tanpa henti, ada 1 struk yang terpotong di tengah.',
    createdAt: '2026-09-01T04:15:00Z',
    ownerNotified: true,
  },
  {
    id: 'TCK-20260901-02',
    title: 'Request audit auto-jurnal akun PPN Keluaran 11%',
    module: 'Akuntansi GL',
    severity: 'MEDIUM',
    reportedBy: 'Rian Setyadi',
    role: 'Branch Admin',
    status: 'OPEN',
    description: 'Mohon verifikasi pembulatan nilai PPN pada transaksi di bawah Rp 1.000.',
    createdAt: '2026-09-01T05:00:00Z',
    ownerNotified: true,
  },
];

export const BugTicketingCenter: React.FC = () => {
  const { currentUser } = useAuthStore();
  const [tickets, setTickets] = useState<BugTicket[]>(INITIAL_TICKETS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [moduleName, setModuleName] = useState<BugTicket['module']>('POS Kasir');
  const [severity, setSeverity] = useState<BugTicket['severity']>('HIGH');
  const [description, setDescription] = useState('');

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const newTicket: BugTicket = {
      id: `TCK-${Date.now().toString().slice(-8)}`,
      title,
      module: moduleName,
      severity,
      reportedBy: currentUser.name,
      role: currentUser.roleTitle,
      status: 'OPEN',
      description,
      createdAt: new Date().toISOString(),
      ownerNotified: true,
    };

    setTickets([newTicket, ...tickets]);
    setIsModalOpen(false);
    setTitle('');
    setDescription('');
    toast.success('Tiket Insiden Berhasil Diajukan', `ID: ${newTicket.id} • Notifikasi terkirim ke Owner & Super User`);
  };

  const handleResolveTicket = (id: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: 'RESOLVED', resolvedAt: new Date().toISOString() }
          : t
      )
    );
    toast.success('Tiket Insiden Berhasil Diselesaikan', 'Patch produksi telah terverifikasi.');
  };

  const isSuperUser = currentUser.role === 'super_user';

  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🎫</span>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Pusat Tiketing Insiden & Bug Produksi
            </h2>
            <span className="bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold">
              Real-time Incident Notification
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Sistem eskalasi laporan kendala operasional kasir & admin dengan notifikasi instan ke Owner & Super User.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2 rounded-2xl text-xs flex items-center space-x-1.5 shadow-md shadow-red-600/20 transition-all active:scale-95"
        >
          <span>+</span>
          <span>Buat Laporan Bug / Insiden</span>
        </button>
      </div>

      {/* Tickets List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
          Daftar Tiket Kendala Aktif ({tickets.length})
        </h3>

        <div className="space-y-3">
          {tickets.map((t) => (
            <div
              key={t.id}
              className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-start justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-red-600 dark:text-red-400">{t.id}</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{t.title}</span>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full font-mono border ${
                      t.severity === 'CRITICAL'
                        ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-300'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-300'
                    }`}
                  >
                    {t.severity}
                  </span>
                  <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-lg">
                    {t.module}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {t.description}
                </p>

                <div className="text-[10px] text-slate-400 font-mono flex items-center space-x-3 pt-1">
                  <span>Pelapor: {t.reportedBy} ({t.role})</span>
                  <span>•</span>
                  <span>Waktu: {new Date(t.createdAt).toLocaleString('id-ID')}</span>
                  <span>•</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    🔔 Notifikasi Terkirim ke Owner & Super User
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end space-y-2">
                <span
                  className={`text-[10px] font-bold px-3 py-1 rounded-full ${
                    t.status === 'RESOLVED'
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      : t.status === 'INVESTIGATING'
                      ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                      : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                  }`}
                >
                  ● {t.status}
                </span>

                {isSuperUser && t.status !== 'RESOLVED' && (
                  <button
                    onClick={() => handleResolveTicket(t.id)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-xl shadow-sm"
                  >
                    Tandai Selesai (Resolve)
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CREATE TICKET MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Ajukan Laporan Kendala / Bug Produksi
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Judul Kendala</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Printer Bluetooth tidak merespons"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Modul Terkait</label>
                  <select
                    value={moduleName}
                    onChange={(e) => setModuleName(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 font-semibold"
                  >
                    <option value="POS Kasir">POS Kasir</option>
                    <option value="Bluetooth 58mm">Bluetooth 58mm</option>
                    <option value="Akuntansi GL">Akuntansi GL</option>
                    <option value="Gudang & Stok">Gudang & Stok</option>
                    <option value="Auth & Sesi">Auth & Sesi</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Tingkat Urgensi</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 font-semibold text-rose-600"
                  >
                    <option value="CRITICAL">CRITICAL (Macet Total)</option>
                    <option value="HIGH">HIGH (Sangat Mendesak)</option>
                    <option value="MEDIUM">MEDIUM (Normal)</option>
                    <option value="LOW">LOW (Saran)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Rincian Kronologi Kendala</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Jelaskan langkah-langkah terjadinya kendala..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-500 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-500 text-white font-bold px-5 py-2 rounded-xl shadow-md"
                >
                  Kirim Tiket & Beritahu Owner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
