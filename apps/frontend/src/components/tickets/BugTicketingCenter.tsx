'use client';

import React, { useState } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import { useInternalChatStore } from '../../stores/useInternalChatStore';
import { toast } from '../../stores/useToastStore';

export interface BugTicket {
  id: string;
  title: string;
  category: 'pos' | 'finance' | 'inventory' | 'sync' | 'hardware';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'escalated_to_superuser';
  reporterRole: string;
  reporterName: string;
  branchName: string;
  brandName: string;
  brandId: string;
  description: string;
  ownerNotified: boolean;
  createdAt: string;
}

const INITIAL_TICKETS: BugTicket[] = [
  {
    id: 'TCK-20260901-001',
    title: 'Selisih Jurnal Otomatis saat Split Bill EDC BCA',
    category: 'finance',
    severity: 'high',
    status: 'escalated_to_superuser',
    reporterRole: 'Kasir Shift Pagi',
    reporterName: 'Siti Rahma',
    branchName: 'Outlet Grand Indonesia',
    brandName: 'Kopi Nusantara Roastery',
    brandId: 'b-01',
    description: 'Saat split bill nominal, pembayaran kartu EDC BCA pertama masuk, namun kartu kedua pending sehingga terjadi selisih balance di jurnal kas kecil.',
    ownerNotified: true,
    createdAt: '2026-09-01T02:15:00Z',
  },
  {
    id: 'TCK-20260901-002',
    title: 'Printer Bluetooth 58mm Thermal Sering Disconnect',
    category: 'hardware',
    severity: 'medium',
    status: 'investigating',
    reporterRole: 'Admin Outlet',
    reporterName: 'Budi Santoso',
    branchName: 'Outlet Senopati',
    brandName: 'Kopi Nusantara Roastery',
    brandId: 'b-01',
    description: 'Koneksi Web Bluetooth ESC/POS GATT putus jika tablet POS idle lebih dari 15 menit.',
    ownerNotified: true,
    createdAt: '2026-09-01T03:30:00Z',
  },
];

export const BugTicketingCenter: React.FC = () => {
  const { currentUser } = useAuthStore();
  const { messages, sendMessage, authorizeSuperUserTicket } = useInternalChatStore();
  const [tickets, setTickets] = useState<BugTicket[]>(INITIAL_TICKETS);
  const [activeTicketId, setActiveTicketId] = useState<string>('TCK-20260901-001');
  const [ticketChatText, setTicketChatText] = useState<string>('');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<BugTicket['category']>('pos');
  const [severity, setSeverity] = useState<BugTicket['severity']>('medium');
  const [description, setDescription] = useState('');

  const activeTicket = tickets.find((t) => t.id === activeTicketId) || tickets[0];
  const ticketMessages = messages.filter((m) => m.ticketId === activeTicket?.id);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      toast.error('Data Belum Lengkap', 'Judul dan deskripsi bug wajib diisi.');
      return;
    }

    const newTicket: BugTicket = {
      id: `TCK-${Date.now().toString().slice(-6)}`,
      title,
      category,
      severity,
      status: 'escalated_to_superuser',
      reporterRole: currentUser.roleTitle,
      reporterRole: currentUser.roleTitle || currentUser.role,
      reporterName: currentUser.name,
      branchName: 'Outlet Grand Indonesia',
      brandName: 'Kopi Nusantara Roastery',
      brandId: 'b-01',
      description,
      ownerNotified: true,
      createdAt: new Date().toISOString(),
    };

    setTickets([newTicket, ...tickets]);
    setActiveTicketId(newTicket.id);
    setIsCreateModalOpen(false);

    toast.success(
      'Tiket Insiden Dibuat & Tereskalasi',
      `Tiket #${newTicket.id} dikirim ke Super User & Notifikasi Owner Aktif.`
    );
  };

  const handleSendTicketChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketChatText.trim() || !activeTicket) return;

    sendMessage({
      brandId: activeTicket.brandId,
      ticketId: activeTicket.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      senderAvatar: currentUser.avatarUrl,
      text: ticketChatText.trim(),
    });

    setTicketChatText('');
  };

  const handleGrantSuperUserAccess = () => {
    if (!activeTicket) return;
    authorizeSuperUserTicket({
      ticketId: activeTicket.id,
      brandId: activeTicket.brandId,
      brandName: activeTicket.brandName,
      superUserId: 'usr-superuser-01',
      ownerId: currentUser.id,
      reason: `Diagnostik investigasi tiket ${activeTicket.id}: ${activeTicket.title}`,
    });
  };

  return (
    <div className="p-4 md:p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🎫</span>
            <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100">
              Pusat Tiketing Insiden & Live Chat Super User
            </h2>
            <span className="bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold">
              Escalation & Chat
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Super User hanya dapat masuk memeriksa data brand setelah memuat tiket resmi dan berkoordinasi via live chat.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center space-x-1.5 shadow-md shadow-red-600/20 transition-all active:scale-95"
        >
          <span>+</span>
          <span>Laporkan Bug / Insiden Baru</span>
        </button>
      </div>

      {/* Main Grid: Ticket List & Live Chat Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Ticket List */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
            Daftar Tiket Terbuka ({tickets.length})
          </h3>

          <div className="space-y-2.5">
            {tickets.map((t) => (
              <div
                key={t.id}
                onClick={() => setActiveTicketId(t.id)}
                className={`p-4 rounded-3xl border cursor-pointer transition-all ${
                  activeTicketId === t.id
                    ? 'bg-white dark:bg-slate-900 border-red-500 shadow-md ring-1 ring-red-500/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 opacity-80'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-red-600 dark:text-red-400">
                      {t.id}
                    </span>
                    <span className="bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[9px] font-mono px-2 py-0.5 rounded-full font-bold">
                      {t.category.toUpperCase()}
                    </span>
                  </div>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full font-mono ${
                      t.severity === 'critical' || t.severity === 'high'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {t.severity.toUpperCase()}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-2 line-clamp-1">
                  {t.title}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{t.description}</p>

                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                  <span>Pelapor: {t.reporterName}</span>
                  <span>{new Date(t.createdAt).toLocaleDateString('id-ID')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Active Ticket Details & Real-Time Live Chat with Super User */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm flex flex-col justify-between space-y-4">
          {activeTicket ? (
            <>
              {/* Top Info */}
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4 space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm font-black text-red-600 dark:text-red-400">
                      {activeTicket.id}
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                      {activeTicket.title}
                    </span>
                  </div>
                  <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold">
                    Owner Notified ✓
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300">{activeTicket.description}</p>

                {/* Authorization Action Bar */}
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      Izin Diagnostik Super User:
                    </span>
                    <div className="text-[10px] text-slate-400">
                      Brand: <b>{activeTicket.brandName}</b>
                    </div>
                  </div>
                  <button
                    onClick={handleGrantSuperUserAccess}
                    className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs shadow-md shadow-purple-600/20 transition-all active:scale-95"
                  >
                    🛡️ Izinkan Super User Masuk
                  </button>
                </div>
              </div>

              {/* Real-Time Live Chat Stream between Super User & Owner */}
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                    💬 Live Chat Room Tiket #{activeTicket.id}
                  </span>
                  <span className="text-[10px] text-emerald-500 font-bold font-mono">● Realtime Sync</span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 h-64 overflow-y-auto space-y-2 text-xs">
                  {ticketMessages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center">
                      <span className="text-2xl mb-1">💬</span>
                      <span>Belum ada pesan koordinasi di tiket ini.</span>
                      <span className="text-[10px]">Ketik pesan di bawah untuk berdiskusi dengan Super User / Owner.</span>
                    </div>
                  ) : (
                    ticketMessages.map((msg) => {
                      const isMe = msg.senderId === currentUser.id;
                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          <span className="text-[10px] font-bold text-slate-500 mb-0.5">
                            {msg.senderName} ({msg.senderRole.replace('_', ' ')})
                          </span>
                          <div
                            className={`p-2.5 rounded-2xl max-w-[85%] ${
                              isMe
                                ? 'bg-red-600 text-white rounded-tr-none'
                                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-tl-none'
                            }`}
                          >
                            {msg.text}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendTicketChat} className="flex space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <input
                  type="text"
                  placeholder="Kirim pesan langsung ke Super User / Owner terkait tiket ini..."
                  value={ticketChatText}
                  onChange={(e) => setTicketChatText(e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-2xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2 rounded-2xl text-xs shadow-md shadow-red-600/20"
                >
                  Kirim
                </button>
              </form>
            </>
          ) : (
            <div className="p-8 text-center text-slate-400">Pilih tiket di sebelah kiri.</div>
          )}
        </div>
      </div>

      {/* CREATE TICKET MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Buat Tiket Laporan Bug / Insiden
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Judul Insiden</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Saldo kas tidak sinkron saat split bill"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Kategori</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 font-semibold"
                  >
                    <option value="pos">Kasir POS</option>
                    <option value="finance">Finance / GL</option>
                    <option value="inventory">Gudang / Stok</option>
                    <option value="hardware">Hardware / Printer</option>
                    <option value="sync">Sync Database</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Tingkat Keparahan</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 font-semibold"
                  >
                    <option value="low">Low (Ringan)</option>
                    <option value="medium">Medium (Sedang)</option>
                    <option value="high">High (Tinggi)</option>
                    <option value="critical">Critical (Kritis)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Rincian Deskripsi Bug</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Jelaskan langkah terjadinya bug dan dampaknya..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-slate-500 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-500 text-white font-bold px-5 py-2 rounded-xl shadow-md"
                >
                  Kirim & Eskalasi ke Super User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
