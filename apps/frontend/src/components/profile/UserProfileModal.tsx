'use client';

import React, { useRef, useState } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import type { UserRole } from '../../types';

interface UserProfileModalProps {
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ onClose }) => {
  const { currentUser, switchRole, updateAvatar, updateProfile } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'faq' | 'role_switch'>('profile');

  // Handle Photo Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh] transition-colors">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center space-x-2">
            <span className="text-xl">👤</span>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Profil Pengguna & Dokumentasi Peran (Role SOP)
              </h3>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                Status Login Aktif: <span className="font-bold text-emerald-600 dark:text-emerald-400">{currentUser.roleTitle}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold px-2 py-1"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="p-3 bg-slate-100 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 flex space-x-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            👤 Informasi Akun & Foto
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'faq'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            📖 Panduan & SOP ({currentUser.role.toUpperCase()})
          </button>
          <button
            onClick={() => setActiveTab('role_switch')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'role_switch'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            🔄 Ganti Status Peran
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* 1. PROFILE INFO & PHOTO UPLOAD */}
          {activeTab === 'profile' && (
            <div className="space-y-5">
              <div className="flex items-center space-x-5 bg-slate-50 dark:bg-slate-950 p-4 rounded-3xl border border-slate-200 dark:border-slate-800">
                <div className="relative group">
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-bold transition-all"
                  >
                    <span>📷</span>
                    <span>Ubah Foto</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{currentUser.name}</h4>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{currentUser.roleTitle}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{currentUser.email}</div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-[10px] font-bold px-3 py-1 rounded-lg mt-1 inline-block shadow-sm"
                  >
                    📁 Upload File Foto Baru
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Nama Lengkap</span>
                  <input
                    type="text"
                    value={currentUser.name}
                    onChange={(e) => updateProfile({ name: e.target.value })}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1 text-xs text-slate-900 dark:text-slate-100 font-semibold"
                  />
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Nomor Telepon (WhatsApp)</span>
                  <input
                    type="text"
                    value={currentUser.phoneNumber || ''}
                    onChange={(e) => updateProfile({ phoneNumber: e.target.value })}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1 text-xs text-slate-900 dark:text-slate-100 font-semibold font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. ROLE-SPECIFIC DYNAMIC SOP & FAQS */}
          {activeTab === 'faq' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-2xl border border-emerald-200 dark:border-emerald-800/40">
                <span className="text-emerald-600 text-lg">💡</span>
                <div>
                  <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    Panduan Khusus: {currentUser.roleTitle}
                  </h4>
                  <p className="text-[10px] text-emerald-700 dark:text-emerald-400">
                    Sistem mendeteksi login Anda dan menyesuaikan SOP serta batasan wewenang resmi:
                  </p>
                </div>
              </div>

              {/* CASHIER SOP */}
              {currentUser.role === 'cashier' && (
                <div className="space-y-3">
                  <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <span className="font-bold text-slate-800 dark:text-slate-100">✅ Do's (Hal yang Harus Dilakukan):</span>
                    <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                      <li>Pastikan printer Bluetooth 58mm terhubung dengan tombol <b>+ Hubungkan BT</b> sebelum mulai shift.</li>
                      <li>Gunakan fitur <b>Split Bill</b> jika ada rombongan pelanggan yang ingin membagi pembayaran (Rata, Nominal, atau Per Item).</li>
                      <li>Selalu tawarkan struk digital WhatsApp dengan mengetik no. HP <b>081xxxx</b> (tanpa +62).</li>
                    </ul>
                  </div>

                  <div className="bg-rose-50 dark:bg-rose-950/30 p-4 rounded-2xl border border-rose-200 dark:border-rose-800/30 space-y-2">
                    <span className="font-bold text-rose-800 dark:text-rose-300">❌ Don'ts (Pantangan Kasir):</span>
                    <ul className="list-disc list-inside space-y-1 text-[11px] text-rose-700 dark:text-rose-400">
                      <li>Dilarang membatalkan (*void*) transaksi lebih dari 3 kali berturut-turut tanpa otorisasi Branch Manager.</li>
                      <li>Dilarang mematikan koneksi data atau mengubah tanggal sistem saat shift kasir aktif.</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* BRAND ADMIN SOP */}
              {currentUser.role === 'admin_brand' && (
                <div className="space-y-3">
                  <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <span className="font-bold text-slate-800 dark:text-slate-100">✅ Tanggung Jawab Branch / Store Admin:</span>
                    <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                      <li>Melakukan rekapitulasi setoran kas kasir pada penutupan shift harian.</li>
                      <li>Mengecek selisih persediaan (*Stock Opname*) berkala dan mengajukan request transfer stok gudang utama.</li>
                      <li>Memvalidasi presisi absensi radius geofence barista & staf outlet.</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* OWNER SOP */}
              {currentUser.role === 'owner' && (
                <div className="space-y-3">
                  <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <span className="font-bold text-slate-800 dark:text-slate-100">👑 Dashboard Panduan Eksekutif Owner:</span>
                    <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                      <li>Buka menu <b>👑 Executive Owner Dashboard</b> untuk melihat performa penjualan hari ini, minggu ini, dan bulan ini.</li>
                      <li>Perhatikan rekomendasi <b>AI Strategic Advisor</b> untuk produk <b>Fast-Moving (Stars)</b> vs <b>Deadstock</b> yang perlu di-liquidate.</li>
                      <li>Pantau kepuasan pelanggan real-time melalui panel review konsumen cabang.</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* SUPER USER SOP */}
              {currentUser.role === 'super_user' && (
                <div className="space-y-3">
                  <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <span className="font-bold text-slate-800 dark:text-slate-100">⚡ Wewenang Super User & SaaS Director:</span>
                    <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                      <li>Mengatur status lisensi modul berbayar (Lock/Unlock) ala Accurate / Jurnal.id untuk masing-masing tenant.</li>
                      <li>Memantau kesehatan database MySQL 8 / MariaDB (InnoDB Strict Mode) dan koneksi pool backend.</li>
                      <li>Mengelola auto-git sync daemon dan deployment CI/CD platform.</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. QUICK ROLE SWITCHER (FOR TESTING) */}
          {activeTab === 'role_switch' && (
            <div className="space-y-3">
              <p className="text-[11px] text-slate-500">
                Pilih peran untuk menguji tampilan dashboard dan hak akses masing-masing level pengguna:
              </p>
              <div className="grid grid-cols-2 gap-3">
                {(['owner', 'super_user', 'admin_brand', 'cashier'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => switchRole(r)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-start space-x-3 ${
                      currentUser.role === r
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-md shadow-emerald-500/10'
                        : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900'
                    }`}
                  >
                    <span className="text-xl">
                      {r === 'super_user' ? '⚡' : r === 'owner' ? '👑' : r === 'admin_brand' ? '🏢' : '🛒'}
                    </span>
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-100 capitalize">
                        {r.replace('_', ' ')}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {r === 'owner' && 'Akses laporan penjualan, AI matrix, & ulasan'}
                        {r === 'super_user' && 'Akses manajemen tenant & lisensi modul'}
                        {r === 'admin_brand' && 'Akses manajemen staf, shift & cabang'}
                        {r === 'cashier' && 'Akses kasir POS kilat & printer 58mm'}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <span className="text-[11px] text-slate-500">ID: {currentUser.id}</span>
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-5 py-2 rounded-2xl text-xs shadow-sm"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
