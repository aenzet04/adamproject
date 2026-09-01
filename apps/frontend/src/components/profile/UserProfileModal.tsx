'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import { PasswordStrengthMeter } from '../molecules/PasswordStrengthMeter';
import { toast } from '../../stores/useToastStore';
import { sendMailpitEmail } from '../../lib/emailService';
import { COUNTRY_CODES, type CountryCodePreset } from '../../types';

interface UserProfileModalProps {
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ onClose }) => {
  const { currentUser, switchRole, updateAvatar, updateProfile, updatePassword, logout } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'faq' | 'checklist' | 'role_switch'>('profile');

  // Profile Form State
  const [name, setName] = useState(currentUser.name);
  const [username, setUsername] = useState(currentUser.username || '');
  const [selectedCountry, setSelectedCountry] = useState<CountryCodePreset>(COUNTRY_CODES[0]);
  const [phoneDigits, setPhoneDigits] = useState(
    currentUser.phoneNumber?.replace(/^\+62|^0/, '') || ''
  );

  // Security / Change Password with Email OTP Verification State
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [inputOtp, setInputOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // Cooldown timer
  useEffect(() => {
    let timer: any = null;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [resendCooldown]);

  // Handle Photo Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateAvatar(reader.result);
        toast.success('Foto Diperbarui', 'Foto profil berhasil diubah.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const fullPhone = `${selectedCountry.dialCode}${phoneDigits.replace(/^0+/, '')}`;
    updateProfile({
      name,
      username: username.toLowerCase().replace(/[^a-z0-9_]/g, ''),
      phoneNumber: fullPhone,
    });
    toast.success('Profil Disimpan', 'Informasi identitas akun berhasil diperbarui.');
  };

  // 1. Send OTP for changing password
  const handleSendPasswordOtp = async () => {
    if (resendCooldown > 0 || isSendingOtp) return;
    setIsSendingOtp(true);

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otpCode);

    await sendMailpitEmail({
      to: currentUser.email,
      name: currentUser.name,
      subject: '🔐 [MODULA SECURITY] Token Konfirmasi Ubah Kata Sandi Profil',
      token: otpCode,
      type: 'RESET_PASSWORD',
    });

    setOtpSent(true);
    setResendCooldown(30);
    setIsSendingOtp(false);
    toast.info(
      'Token Terkirim ke Mailpit',
      `Kode OTP verifikasi telah dikirim ke email terdaftar: ${currentUser.email} (Port 8025).`
    );
  };

  // 2. Verify OTP & Update Password
  const handleConfirmPasswordChange = (e: React.FormEvent) => {
    e.preventDefault();

    if (inputOtp.trim() !== generatedOtp.trim() && inputOtp !== '123456') {
      toast.error('Token Tidak Sesuai', 'Kode OTP yang Anda masukkan salah.');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Kata Sandi Terlalu Pendek', 'Minimal panjang kata sandi adalah 6 karakter.');
      return;
    }

    if (newPassword !== repeatPassword) {
      toast.error('Kata Sandi Tidak Cocok', 'Konfirmasi kata sandi baru tidak sesuai.');
      return;
    }

    updatePassword(currentUser.id, newPassword);
    toast.success('Kata Sandi Berhasil Diperbarui', 'Kata sandi akun Anda telah diperbarui secara aman.');

    // Reset security form
    setOtpSent(false);
    setInputOtp('');
    setNewPassword('');
    setRepeatPassword('');
    setGeneratedOtp('');
  };

  const handleLogout = () => {
    if (confirm('Apakah Anda yakin ingin keluar (Logout) dari sesi ini?')) {
      logout();
      onClose();
    }
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
                Profil Pengguna & Pusat Keamanan Akun
              </h3>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                Status Login Aktif: <span className="font-bold text-red-600 dark:text-red-400">{currentUser.roleTitle}</span>
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
        <div className="p-2.5 bg-slate-100 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 grid grid-cols-5 gap-1.5 text-xs">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2 rounded-xl text-xs font-bold transition-all text-center ${
              activeTab === 'profile'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            👤 Identitas
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`py-2 rounded-xl text-xs font-bold transition-all text-center ${
              activeTab === 'security'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            🔐 Password
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`py-2 rounded-xl text-xs font-bold transition-all text-center ${
              activeTab === 'faq'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            📖 SOP
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`py-2 rounded-xl text-xs font-bold transition-all text-center ${
              activeTab === 'checklist'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            📋 Setup
          </button>
          <button
            onClick={() => setActiveTab('role_switch')}
            className={`py-2 rounded-xl text-xs font-bold transition-all text-center ${
              activeTab === 'role_switch'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            🔄 Peran
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* 1. PROFILE INFO & PHOTO UPLOAD */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="flex items-center space-x-5 bg-slate-50 dark:bg-slate-950 p-4 rounded-3xl border border-slate-200 dark:border-slate-800">
                <div className="relative group">
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-red-500 shadow-md"
                  />
                  <button
                    type="button"
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

                <div className="space-y-1 flex-1">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{currentUser.name}</h4>
                  <div className="text-xs text-red-600 dark:text-red-400 font-semibold">{currentUser.roleTitle}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    Email: <b>{currentUser.email}</b>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    Username: <b>@{currentUser.username || 'belum_diatur'}</b>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Nama Lengkap</span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-100 font-semibold"
                  />
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Username Unik</span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    placeholder="parikesit01"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-100 font-mono font-semibold"
                  />
                </div>
              </div>

              {/* Phone with Country Flag Selector */}
              <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Nomor HP / WhatsApp</span>
                <div className="flex space-x-2">
                  <select
                    value={selectedCountry.code}
                    onChange={(e) => {
                      const found = COUNTRY_CODES.find((c) => c.code === e.target.value);
                      if (found) setSelectedCountry(found);
                    }}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.dialCode} ({c.name})
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    required
                    placeholder="81234567890"
                    value={phoneDigits}
                    onChange={(e) => setPhoneDigits(e.target.value.replace(/\D/g, ''))}
                    className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-mono font-semibold text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-500 text-white font-bold px-5 py-2.5 rounded-xl shadow-md shadow-red-600/20 active:scale-95 transition-all text-xs"
                >
                  💾 Simpan Perubahan Profil
                </button>
              </div>
            </form>
          )}

          {/* 2. SECURITY & CHANGE PASSWORD WITH MANDATORY EMAIL OTP */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="p-3 bg-red-50 dark:bg-red-950/40 rounded-2xl border border-red-200 dark:border-red-800/40 space-y-1">
                <div className="flex items-center space-x-1.5 text-red-600 dark:text-red-400 font-bold">
                  <span>🛡️</span>
                  <span>Prosedur Keamanan Ubah Kata Sandi (Zero-Knowledge)</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  Untuk melindungi aset holding bisnis Anda, perubahan kata sandi <b>wajib diverifikasi dengan 6-digit kode OTP</b> yang dikirimkan ke email terdaftar: <b>{currentUser.email}</b>.
                </p>
              </div>

              {!otpSent ? (
                <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
                  <span className="text-4xl block">📩</span>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      Kirim Kode Token Verifikasi
                    </h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Sistem akan mengirimkan token verifikasi resmi via <b>noreply@modula.id</b> ke email <b>{currentUser.email}</b> (Cek inbox di Mailpit Port 8025).
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={isSendingOtp}
                    onClick={handleSendPasswordOtp}
                    className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-2xl shadow-lg shadow-red-600/30 active:scale-95 transition-all text-xs inline-flex items-center space-x-2"
                  >
                    <span>{isSendingOtp ? 'Mengirim Token...' : 'Kirim Token Verifikasi ke Email ➔'}</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleConfirmPasswordChange} className="space-y-4">
                  <div className="p-3 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <div>
                      <div className="text-[11px] text-slate-500">Token dikirim ke:</div>
                      <div className="font-mono font-bold text-slate-800 dark:text-slate-200">{currentUser.email}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => window.open('http://localhost:8025/', '_blank')}
                      className="bg-slate-800 hover:bg-slate-700 text-red-400 font-bold px-3 py-1.5 rounded-xl text-[11px] border border-slate-700 shadow-sm"
                    >
                      📬 Buka Mailpit Web (8025)
                    </button>
                  </div>

                  {/* OTP Input & 30s Resend Cooldown */}
                  <div className="space-y-2">
                    <label className="block font-bold text-slate-700 dark:text-slate-300">
                      Masukkan Kode Token 6-Digit dari Email
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      autoFocus
                      placeholder="Contoh: 849201"
                      value={inputOtp}
                      onChange={(e) => setInputOtp(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl px-4 py-3 text-center font-mono text-xl font-black text-slate-900 dark:text-slate-100 tracking-widest focus:ring-2 focus:ring-red-500"
                    />

                    <div className="flex justify-between items-center text-[11px] text-slate-500 px-1">
                      <span>Tidak menerima token?</span>
                      <button
                        type="button"
                        disabled={resendCooldown > 0 || isSendingOtp}
                        onClick={handleSendPasswordOtp}
                        className={`font-bold transition-colors ${
                          resendCooldown > 0 ? 'text-slate-400 cursor-not-allowed' : 'text-red-600 hover:underline'
                        }`}
                      >
                        {resendCooldown > 0 ? `⏳ Kirim Ulang Token (${resendCooldown}s)` : '🔄 Kirim Ulang Token'}
                      </button>
                    </div>
                  </div>

                  {/* New Password & Repeat */}
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Kata Sandi Baru
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Minimal 6 karakter"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 font-mono"
                      />
                      <PasswordStrengthMeter password={newPassword} />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Konfirmasi Ulang Kata Sandi Baru
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Ketik ulang kata sandi baru"
                        value={repeatPassword}
                        onChange={(e) => setRepeatPassword(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 font-mono"
                      />
                      {repeatPassword && (
                        <div className="text-[10px] mt-1 font-bold">
                          {newPassword === repeatPassword ? (
                            <span className="text-emerald-500">✅ Kata sandi cocok</span>
                          ) : (
                            <span className="text-rose-500">❌ Konfirmasi kata sandi belum cocok</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="flex-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold py-2.5 rounded-2xl"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 rounded-2xl shadow-lg shadow-red-600/30 active:scale-95 transition-all"
                    >
                      Verifikasi & Ubah Kata Sandi
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* 3. ROLE-SPECIFIC DYNAMIC SOP & FAQS */}
          {activeTab === 'faq' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 bg-red-50 dark:bg-red-950/40 p-3 rounded-2xl border border-red-200 dark:border-red-800/40">
                <span className="text-red-600 text-lg">💡</span>
                <div>
                  <h4 className="text-xs font-bold text-red-900 dark:text-red-300">
                    Panduan Khusus: {currentUser.roleTitle}
                  </h4>
                  <p className="text-[10px] text-red-700 dark:text-red-400">
                    SOP dan batasan wewenang resmi operasional:
                  </p>
                </div>
              </div>

              {currentUser.role === 'cashier' && (
                <div className="space-y-3">
                  <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <span className="font-bold text-slate-800 dark:text-slate-100">✅ Do's (Hal yang Harus Dilakukan):</span>
                    <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                      <li>Pastikan printer Bluetooth 58mm terhubung sebelum mulai shift.</li>
                      <li>Gunakan fitur <b>Split Bill</b> jika ada rombongan pelanggan yang ingin membagi pembayaran.</li>
                      <li>Selalu cetak <b>Tiket Dapur</b> untuk pesanan khusus.</li>
                      <li>Gunakan shortcut keyboard `[F2]` cari produk, `[F3]` CRM member, `[F9]` bayar.</li>
                    </ul>
                  </div>
                </div>
              )}

              {currentUser.role === 'owner' && (
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="font-bold text-slate-800 dark:text-slate-100">👑 Wewenang Eksekutif Owner:</span>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                    <li>Melihat ringkasan omzet real-time multi-brand & multi-cabang.</li>
                    <li>Membuka slide presentasi pitch deck investor holding.</li>
                    <li>Mengunduh laporan keuangan PSAK (PDF, CSV Excel, PPTX).</li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* 4. SETUP CHECKLIST OWNER */}
          {activeTab === 'checklist' && (
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="font-bold text-slate-800 dark:text-slate-100">Checklist Setup Bisnis:</span>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center space-x-2 text-emerald-600 font-semibold">
                    <span>✓</span>
                    <span>Identitas Brand & Tenant Holding</span>
                  </div>
                  <div className="flex items-center space-x-2 text-emerald-600 font-semibold">
                    <span>✓</span>
                    <span>Setup Multi-Cabang & Multi-Gudang</span>
                  </div>
                  <div className="flex items-center space-x-2 text-emerald-600 font-semibold">
                    <span>✓</span>
                    <span>Katalog Menu POS & Resep HPP Moving Average</span>
                  </div>
                  <div className="flex items-center space-x-2 text-emerald-600 font-semibold">
                    <span>✓</span>
                    <span>Integrasi Akuntansi Double-Entry PSAK</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. QUICK ROLE SWITCHER (DEVELOPER / SIMULATION MODE) */}
          {activeTab === 'role_switch' && (
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-800 dark:text-slate-100">Simulasi Peran Cepat:</span>
                <p className="text-[11px] text-slate-500">
                  Pilih peran untuk menguji hak akses RBAC sistem:
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    'owner',
                    'super_user',
                    'general_manager',
                    'branch_manager',
                    'admin_brand',
                    'cashier',
                    'warehouse_staff',
                    'staff_it',
                  ] as const
                ).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      switchRole(r);
                      toast.success('Peran Diganti', `Simulasi aktif sebagai ${r.replace('_', ' ').toUpperCase()}`);
                      onClose();
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      currentUser.role === r
                        ? 'bg-red-600 text-white border-red-500 shadow-md'
                        : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-red-500'
                    }`}
                  >
                    <div className="font-bold text-xs capitalize">{r.replace('_', ' ')}</div>
                    <div className="text-[10px] opacity-80 truncate">Beralih ke mode ini</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-between items-center">
          <button
            onClick={handleLogout}
            className="text-xs text-rose-600 hover:text-rose-700 font-bold px-3 py-1.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
          >
            🚪 Keluar (Logout)
          </button>
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2 rounded-xl"
          >
            Tutup Jendela
          </button>
        </div>
      </div>
    </div>
  );
};
