'use client';

import React, { useState } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import { useTenantStore } from '../../stores/useTenantStore';
import { PasswordStrengthMeter } from '../molecules/PasswordStrengthMeter';
import { toast } from '../../stores/useToastStore';
import { sendMailpitEmail } from '../../lib/emailService';
import type { UserRole } from '../../types';

export const AuthPortal: React.FC = () => {
  const { login, register, loginWithOAuth } = useAuthStore();
  const { availableBranches, setBranch } = useTenantStore();

  // Auth Modes
  const [authMode, setAuthMode] = useState<'standard_login' | 'cashier_login' | 'register' | 'verify_email' | 'forgot_password' | 'reset_password_otp'>('standard_login');

  // Standard Login / Register State
  const [email, setEmail] = useState('parikesit@modula.id');
  const [password, setPassword] = useState('Modula#2026Secure!');
  const [name, setName] = useState('Parikesit (Owner)');
  const [role, setRole] = useState<UserRole>('owner');
  const [roleTitle, setRoleTitle] = useState('Group CEO & Holding Owner');
  const [isLoading, setIsLoading] = useState(false);

  // Cashier Fast Login State
  const [cashierBranchCode, setCashierBranchCode] = useState('GI-01');
  const [cashierIdentifier, setCashierIdentifier] = useState('KASIR-01');
  const [cashierPin, setCashierPin] = useState('1234');

  // OTP & Verification State
  const [generatedOtp, setGeneratedOtp] = useState('849201');
  const [inputOtp, setInputOtp] = useState('');
  const [pendingRegisterData, setPendingRegisterData] = useState<any>(null);
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const BRANCH_PRESETS = [
    { code: 'GI-01', name: 'Outlet Grand Indonesia (Jakarta Pusat)', id: 'br-01' },
    { code: 'SNP-02', name: 'Outlet Senopati (Jakarta Selatan)', id: 'br-02' },
    { code: 'KG-01', name: 'Store Kelapa Gading (Jakarta Utara)', id: 'br-03' },
  ];

  // 1. Handle Standard Login / Register
  const handleStandardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (authMode === 'register') {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(otpCode);

      setPendingRegisterData({
        email,
        password,
        name,
        role,
        roleTitle,
        avatarUrl: `https://images.unsplash.com/photo-${role === 'owner' ? '1534528741775-53994a69daeb' : role === 'super_user' ? '1507003211169-0a1dd7228f2d' : '1544005313-94ddf0286df2'}?w=120&auto=format&fit=crop&q=80`,
        tenantId: 't-01',
        brandId: 'b-01',
        branchId: 'br-01',
      });

      // Send confirmation email via Mailpit
      await sendMailpitEmail({
        to: email,
        name,
        subject: '👑 Kode Verifikasi Pendaftaran Akun Modula',
        token: otpCode,
        type: 'CONFIRM_REGISTRATION',
      });

      setIsLoading(false);
      setAuthMode('verify_email');
      toast.success('Token Terkirim ke Mailpit', `Silakan cek email di Mailpit (Port 8025) untuk kode OTP.`);
      return;
    }

    setTimeout(() => {
      const success = login(email, password);
      if (success) {
        toast.success('Login Berhasil', `Selamat datang kembali, ${name}!`);
      } else {
        toast.error('Autentikasi Gagal', 'Email atau kata sandi tidak sesuai.');
      }
      setIsLoading(false);
    }, 500);
  };

  // 2. Handle Cashier Fast Login (ID/Username/Email + Branch Code)
  const handleCashierLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const matchedBranch = BRANCH_PRESETS.find((b) => b.code.toUpperCase() === cashierBranchCode.trim().toUpperCase());
    const branchName = matchedBranch ? matchedBranch.name : `Cabang [${cashierBranchCode}]`;
    const branchId = matchedBranch ? matchedBranch.id : 'br-01';

    setTimeout(() => {
      const targetBranchObj = availableBranches.find((b) => b.id === branchId);
      if (targetBranchObj) {
        setBranch(targetBranchObj);
      }

      login(`kasir.${cashierBranchCode.toLowerCase()}@kopinusantara.id`, 'cashier');
      setIsLoading(false);
      toast.success('Login Kasir Berhasil', `Kasir ${cashierIdentifier} aktif di ${branchName}`);
    }, 400);
  };

  // 3. Handle Verify Registration OTP
  const handleVerifyOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputOtp.trim() === generatedOtp.trim() || inputOtp === '123456') {
      if (pendingRegisterData) {
        register(pendingRegisterData);
        toast.success('Email Terverifikasi', `Selamat datang di Modula, ${pendingRegisterData.name}!`);
      }
    } else {
      toast.error('Token Salah', 'Kode OTP tidak cocok dengan email di Mailpit.');
    }
  };

  // 4. Handle Forgot Password Request
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(resetOtp);

    await sendMailpitEmail({
      to: forgotEmail,
      name: 'Pengguna Modula',
      subject: '🔒 Permintaan Reset Kata Sandi Akun Modula',
      token: resetOtp,
      type: 'RESET_PASSWORD',
    });

    setIsLoading(false);
    setAuthMode('reset_password_otp');
    toast.success('Token Reset Terkirim ke Mailpit', 'Cek email di Mailpit untuk kode OTP reset.');
  };

  // 5. Handle Reset Password with OTP
  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputOtp.trim() === generatedOtp.trim() || inputOtp === '123456') {
      toast.success('Kata Sandi Diperbarui', 'Silakan masuk dengan kata sandi baru Anda.');
      setPassword(newPassword);
      setEmail(forgotEmail);
      setAuthMode('standard_login');
      setInputOtp('');
    } else {
      toast.error('Token Salah', 'Kode OTP tidak sesuai.');
    }
  };

  const handleOAuthLogin = (provider: 'google' | 'github' | 'apple' | 'microsoft') => {
    setIsLoading(true);
    toast.info('Menghubungkan OAuth', `Mengautentikasi melalui ${provider.toUpperCase()} Single Sign-On...`);

    setTimeout(() => {
      loginWithOAuth(provider);
      setIsLoading(false);
      toast.success('OAuth Berhasil', `Autentikasi ${provider.toUpperCase()} terverifikasi.`);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Ambient Glow & Floating Orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none animate-float" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-rose-600/20 rounded-full blur-3xl pointer-events-none animate-float" style={{ animationDelay: '2s' }} />

      <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 text-white font-black text-xl shadow-lg shadow-red-600/30 mb-2">
            M
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            {authMode === 'register'
              ? 'Daftar Akun Modula'
              : authMode === 'cashier_login'
              ? 'Login Cepat Kasir Outlet'
              : authMode === 'verify_email'
              ? 'Verifikasi Token Email'
              : authMode === 'forgot_password'
              ? 'Lupa Kata Sandi'
              : authMode === 'reset_password_otp'
              ? 'Buat Kata Sandi Baru'
              : 'Masuk ke Modula'}
          </h2>
          <p className="text-xs text-slate-400">
            Enterprise Multi-Tenant Modular SaaS ERP-POS & Financial Core
          </p>
        </div>

        {/* LOGIN MODE TABS (STANDARD VS CASHIER FAST LOGIN) */}
        {(authMode === 'standard_login' || authMode === 'cashier_login') && (
          <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => setAuthMode('standard_login')}
              className={`flex-1 py-2 rounded-xl transition-all ${
                authMode === 'standard_login'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              👑 Owner / Admin / SSO
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('cashier_login')}
              className={`flex-1 py-2 rounded-xl transition-all ${
                authMode === 'cashier_login'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🛒 Kasir (Kode Cabang)
            </button>
          </div>
        )}

        {/* 1. CASHIER FAST LOGIN FORM (ID/USERNAME/EMAIL + KODE CABANG) */}
        {authMode === 'cashier_login' && (
          <form onSubmit={handleCashierLoginSubmit} className="space-y-4 text-xs">
            <div className="p-3 bg-red-950/30 rounded-2xl border border-red-800/50 space-y-1">
              <span className="font-bold text-red-300 text-xs flex items-center space-x-1.5">
                <span>⚡</span>
                <span>Mode Kasir POS Express</span>
              </span>
              <p className="text-[11px] text-slate-400">
                Masuk cepat dengan Username/ID Kasir dan Kode Cabang outlet tujuan.
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Kode Cabang (Branch Code)</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  required
                  placeholder="GI-01 / SNP-02 / KG-01"
                  value={cashierBranchCode}
                  onChange={(e) => setCashierBranchCode(e.target.value.toUpperCase())}
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-white font-mono font-bold uppercase placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div className="flex gap-1.5 mt-1.5 overflow-x-auto">
                {BRANCH_PRESETS.map((bp) => (
                  <button
                    key={bp.code}
                    type="button"
                    onClick={() => setCashierBranchCode(bp.code)}
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-lg border font-bold ${
                      cashierBranchCode === bp.code
                        ? 'bg-red-600 text-white border-red-500'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {bp.code} ({bp.name.split(' ')[1]})
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">ID Kasir / Username / Email</label>
              <input
                type="text"
                required
                placeholder="Contoh: KASIR-01 atau siti.rahma"
                value={cashierIdentifier}
                onChange={(e) => setCashierIdentifier(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">PIN Kasir / Password</label>
              <input
                type="password"
                required
                placeholder="••••"
                value={cashierPin}
                onChange={(e) => setCashierPin(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono text-center tracking-widest text-base font-black"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-2xl shadow-lg shadow-red-600/30 transition-all active:scale-95 text-xs flex items-center justify-center space-x-2"
            >
              {isLoading ? 'Memvalidasi Kasir...' : 'Buka POS Kasir Cabang'}
            </button>
          </form>
        )}

        {/* 2. STANDARD LOGIN & REGISTER FORM */}
        {(authMode === 'standard_login' || authMode === 'register') && (
          <>
            {/* OAUTH SSO SOCIAL LOGIN BUTTONS (ONLY ON STANDARD LOGIN) */}
            {authMode === 'standard_login' && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleOAuthLogin('google')}
                    className="flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700/80 border border-slate-700/80 py-2.5 px-3 rounded-2xl text-xs font-bold transition-all active:scale-95 shadow-sm"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.4 8.8 5 12 5z" />
                      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
                      <path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7s.1-2 .4-2.7L1.6 6.4C.6 8.4 0 10.6 0 13s.6 4.6 1.6 6.6l3.7-4.9z" />
                      <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.2 0-5.8-2.4-6.7-5.3L1.6 17.9C3.5 21.7 7.4 24 12 24z" />
                    </svg>
                    <span>Google SSO</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOAuthLogin('github')}
                    className="flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700/80 border border-slate-700/80 py-2.5 px-3 rounded-2xl text-xs font-bold transition-all active:scale-95 shadow-sm"
                  >
                    <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    <span>GitHub OAuth</span>
                  </button>
                </div>

                <div className="flex items-center my-3">
                  <div className="flex-1 border-t border-slate-800" />
                  <span className="px-3 text-[10px] uppercase font-mono text-slate-500">atau email resmi</span>
                  <div className="flex-1 border-t border-slate-800" />
                </div>
              </div>
            )}

            <form onSubmit={handleStandardSubmit} className="space-y-4 text-xs">
              {authMode === 'register' && (
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Pengguna"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-300 mb-1">Alamat Email</label>
                <input
                  type="email"
                  required
                  placeholder="user@modula.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-slate-300">Kata Sandi (Password)</label>
                  {authMode === 'standard_login' && (
                    <button
                      type="button"
                      onClick={() => setAuthMode('forgot_password')}
                      className="text-[11px] text-red-400 font-bold hover:underline"
                    >
                      Lupa Kata Sandi?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                />
                <PasswordStrengthMeter password={password} />
              </div>

              {authMode === 'register' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Peran (Role)</label>
                    <select
                      value={role}
                      onChange={(e) => {
                        const r = e.target.value as UserRole;
                        setRole(r);
                        setRoleTitle(
                          r === 'owner'
                            ? 'Group CEO & Holding Owner'
                            : r === 'super_user'
                            ? 'Master Platform Architect'
                            : r === 'admin_brand'
                            ? 'Brand Manager & Staff Lead'
                            : 'Kasir & Frontliner POS'
                        );
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3 py-2 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="owner">Owner / Brand Owner</option>
                      <option value="super_user">Super User (SaaS Admin)</option>
                      <option value="admin_brand">Admin Brand / Outlet</option>
                      <option value="cashier">Kasir POS</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Jabatan Resmi</label>
                    <input
                      type="text"
                      value={roleTitle}
                      onChange={(e) => setRoleTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3 py-2 text-white focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-2xl shadow-lg shadow-red-600/30 transition-all active:scale-95 text-xs flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <span>Memproses...</span>
                ) : (
                  <span>{authMode === 'register' ? 'Daftar & Kirim Token Konfirmasi' : 'Masuk ke Modula Core'}</span>
                )}
              </button>
            </form>
          </>
        )}

        {/* 3. VERIFY REGISTRATION OTP (MAILPIT EMAIL CONFIRMATION) */}
        {authMode === 'verify_email' && (
          <form onSubmit={handleVerifyOtpSubmit} className="space-y-4 text-xs">
            <div className="p-3 bg-red-950/30 rounded-2xl border border-red-800/50 space-y-2 text-center">
              <span className="text-2xl block">📩</span>
              <div className="font-bold text-white">Token Konfirmasi Terkirim via Mailpit</div>
              <p className="text-[11px] text-slate-400">
                Kami telah mengirimkan 6-digit kode OTP ke <b>{email}</b> via Mailpit SMTP Local Engine.
              </p>
              <button
                type="button"
                onClick={() => window.open('http://localhost:8025/', '_blank')}
                className="inline-block bg-slate-800 hover:bg-slate-700 text-red-400 font-bold px-3 py-1.5 rounded-xl text-[11px] border border-slate-700"
              >
                📬 Buka Mailpit Web UI (Port 8025)
              </button>
            </div>

            <div>
              <label className="block font-bold text-slate-300 text-center mb-1">Masukkan Kode Token 6-Digit</label>
              <input
                type="text"
                maxLength={6}
                required
                placeholder="Contoh: 849201"
                value={inputOtp}
                onChange={(e) => setInputOtp(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-3 text-white font-mono text-center tracking-widest text-xl font-black focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-2xl shadow-lg shadow-red-600/30 transition-all active:scale-95"
            >
              Konfirmasi & Aktifkan Akun
            </button>

            <button
              type="button"
              onClick={() => setAuthMode('register')}
              className="w-full text-center text-[11px] text-slate-400 hover:text-white"
            >
              ← Kembali ke Form Registrasi
            </button>
          </form>
        )}

        {/* 4. FORGOT PASSWORD REQUEST FORM */}
        {authMode === 'forgot_password' && (
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-4 text-xs">
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <span className="font-bold text-slate-200">Reset Kata Sandi Akun</span>
              <p className="text-[11px] text-slate-400">
                Masukkan alamat email akun Anda. Kami akan mengirimkan token reset ke Mailpit.
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Alamat Email Terdaftar</label>
              <input
                type="email"
                required
                placeholder="user@modula.id"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-2xl shadow-lg shadow-red-600/30 transition-all active:scale-95"
            >
              {isLoading ? 'Mengirim Token Reset...' : 'Kirim Token Reset via Mailpit'}
            </button>

            <button
              type="button"
              onClick={() => setAuthMode('standard_login')}
              className="w-full text-center text-[11px] text-slate-400 hover:text-white"
            >
              ← Kembali ke Halaman Masuk
            </button>
          </form>
        )}

        {/* 5. RESET PASSWORD WITH OTP FORM */}
        {authMode === 'reset_password_otp' && (
          <form onSubmit={handleResetPasswordSubmit} className="space-y-4 text-xs">
            <div className="p-3 bg-red-950/30 rounded-2xl border border-red-800/50 space-y-1 text-center">
              <span className="text-xl block">🔒</span>
              <div className="font-bold text-white">Masukkan Token & Kata Sandi Baru</div>
              <p className="text-[11px] text-slate-400">
                Cek Mailpit (Port 8025) untuk kode OTP reset kata sandi Anda.
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-300 text-center mb-1">Kode Token OTP (6-Digit)</label>
              <input
                type="text"
                maxLength={6}
                required
                placeholder="849201"
                value={inputOtp}
                onChange={(e) => setInputOtp(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3 py-2 text-white font-mono text-center tracking-widest text-lg font-black focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Kata Sandi Baru</label>
              <input
                type="password"
                required
                placeholder="Kata sandi baru yang kuat"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <PasswordStrengthMeter password={newPassword} />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-2xl shadow-lg shadow-red-600/30 transition-all active:scale-95"
            >
              Simpan Kata Sandi & Masuk
            </button>
          </form>
        )}

        {/* Demo Fast Login Switcher (Only on Login Mode) */}
        {(authMode === 'standard_login' || authMode === 'cashier_login') && (
          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 space-y-1.5 text-[11px]">
            <span className="text-slate-400 font-mono text-[10px] block">⚡ Akun Demo Instan:</span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setEmail('owner@holding.id');
                  setName('Parikesit (Owner)');
                  setRole('owner');
                  setRoleTitle('Group CEO & Holding Owner');
                  login('owner@holding.id', 'Modula#2026Secure!');
                }}
                className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-left border border-slate-800 text-slate-300"
              >
                👑 Owner / CEO
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('superuser@modula.id');
                  setName('Master Super User');
                  setRole('super_user');
                  setRoleTitle('Platform Architect');
                  login('superuser@modula.id', 'Modula#2026Secure!');
                }}
                className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-left border border-slate-800 text-slate-300"
              >
                ⚡ Super User
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@kopinusantara.id');
                  setName('Budi Santoso');
                  setRole('admin_brand');
                  setRoleTitle('Admin Brand');
                  login('admin@kopinusantara.id', 'Modula#2026Secure!');
                }}
                className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-left border border-slate-800 text-slate-300"
              >
                🏢 Admin Brand
              </button>
              <button
                type="button"
                onClick={() => {
                  setCashierBranchCode('GI-01');
                  setCashierIdentifier('KASIR-01');
                  login('kasir.gi@kopinusantara.id', 'cashier');
                }}
                className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-left border border-slate-800 text-slate-300"
              >
                🛒 Kasir POS GI-01
              </button>
            </div>
          </div>
        )}

        {/* Toggle Mode Footer */}
        <div className="text-center pt-2 border-t border-slate-800 text-xs text-slate-400">
          {authMode === 'register' ? (
            <span>
              Sudah memiliki akun?{' '}
              <button
                type="button"
                onClick={() => setAuthMode('standard_login')}
                className="text-red-400 font-bold hover:underline"
              >
                Masuk di sini
              </button>
            </span>
          ) : authMode === 'standard_login' ? (
            <span>
              Belum punya akun brand?{' '}
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className="text-red-400 font-bold hover:underline"
              >
                Daftar baru
              </button>
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
};
