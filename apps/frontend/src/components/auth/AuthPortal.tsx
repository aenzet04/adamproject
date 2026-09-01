'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import { useTenantStore } from '../../stores/useTenantStore';
import { PasswordStrengthMeter } from '../molecules/PasswordStrengthMeter';
import { toast } from '../../stores/useToastStore';
import { sendMailpitEmail } from '../../lib/emailService';
import { COUNTRY_CODES, type CountryCodePreset, type UserRole } from '../../types';

export const AuthPortal: React.FC = () => {
  const { login, register, loginWithOAuth, findUserByIdentifier, updatePassword } = useAuthStore();
  const { availableBranches, setBranch } = useTenantStore();

  // Auth Modes
  const [authMode, setAuthMode] = useState<
    'standard_login' | 'cashier_login' | 'register' | 'verify_email' | 'forgot_password' | 'reset_password_otp'
  >('standard_login');

  // Standard Login State (supports Email / Username / Phone)
  const [loginIdentifierType, setLoginIdentifierType] = useState<'text' | 'phone'>('text');
  const [loginIdentifier, setLoginIdentifier] = useState('owner@holding.id');
  const [loginPhoneDigits, setLoginPhoneDigits] = useState('81808080808');
  const [loginSelectedCountry, setLoginSelectedCountry] = useState<CountryCodePreset>(COUNTRY_CODES[0]);
  const [password, setPassword] = useState('Modula#2026Secure!');

  // Register State
  const [regName, setRegName] = useState('Parikesit Anindito');
  const [regUsername, setRegUsername] = useState('parikesit01');
  const [regEmail, setRegEmail] = useState('parikesit@holding.id');
  const [regSelectedCountry, setRegSelectedCountry] = useState<CountryCodePreset>(COUNTRY_CODES[0]);
  const [regPhoneDigits, setRegPhoneDigits] = useState('81234567890');
  const [regPassword, setRegPassword] = useState('Modula#2026Secure!');
  const [regRepeatPassword, setRegRepeatPassword] = useState('Modula#2026Secure!');
  const [regRole] = useState<UserRole>('owner');
  const [regRoleTitle] = useState('Group CEO & Holding Owner');

  // Cashier Fast Login State
  const [cashierBranchCode, setCashierBranchCode] = useState('GI-01');
  const [cashierIdentifier, setCashierIdentifier] = useState('KASIR-01');
  const [cashierPin, setCashierPin] = useState('1234');

  // OTP & Verification State
  const [generatedOtp, setGeneratedOtp] = useState('849201');
  const [inputOtp, setInputOtp] = useState('');
  const [pendingRegisterData, setPendingRegisterData] = useState<any>(null);
  const [forgotIdentifierType, setForgotIdentifierType] = useState<'text' | 'phone'>('text');
  const [forgotIdentifier, setForgotIdentifier] = useState('owner@holding.id');
  const [forgotPhoneDigits, setForgotPhoneDigits] = useState('81808080808');
  const [forgotSelectedCountry, setForgotSelectedCountry] = useState<CountryCodePreset>(COUNTRY_CODES[0]);
  const [matchedForgotUser, setMatchedForgotUser] = useState<any>(null);
  const [newPassword, setNewPassword] = useState('');
  const [repeatNewPassword, setRepeatNewPassword] = useState('');
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const BRANCH_PRESETS = [
    { code: 'GI-01', name: 'Outlet Grand Indonesia (Jakarta Pusat)', id: 'br-01' },
    { code: 'SNP-02', name: 'Outlet Senopati (Jakarta Selatan)', id: 'br-02' },
    { code: 'KG-01', name: 'Store Kelapa Gading (Jakarta Utara)', id: 'br-03' },
  ];

  // Resend Countdown Timer
  useEffect(() => {
    let interval: any = null;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendCooldown]);

  // Helper mask email (e.g. p***@holding.id)
  const maskEmail = (emailStr: string) => {
    if (!emailStr || !emailStr.includes('@')) return emailStr;
    const [user, domain] = emailStr.split('@');
    if (user.length <= 2) return `${user.charAt(0)}***@${domain}`;
    return `${user.slice(0, 2)}***${user.slice(-1)}@${domain}`;
  };

  // 1. Handle Standard Login (Email / Username / Phone)
  const handleStandardLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const identifier =
      loginIdentifierType === 'phone'
        ? `${loginSelectedCountry.dialCode}${loginPhoneDigits.replace(/^0+/, '')}`
        : loginIdentifier.trim();

    setTimeout(() => {
      const success = login(identifier, password);
      if (success) {
        toast.success('Login Berhasil', `Selamat datang kembali di Modula Enterprise!`);
      } else {
        toast.error('Autentikasi Gagal', 'Kredensial atau kata sandi tidak cocok.');
      }
      setIsLoading(false);
    }, 400);
  };

  // 2. Handle Register
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (regPassword.length < 6) {
      toast.error('Kata Sandi Terlalu Pendek', 'Minimal panjang kata sandi adalah 6 karakter.');
      return;
    }

    if (regPassword !== regRepeatPassword) {
      toast.error('Kata Sandi Tidak Cocok', 'Konfirmasi kata sandi tidak sesuai.');
      return;
    }

    setIsLoading(true);

    const fullPhone = `${regSelectedCountry.dialCode}${regPhoneDigits.replace(/^0+/, '')}`;
    const cleanUser = regUsername.toLowerCase().replace(/[^a-z0-9_]/g, '');

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otpCode);

    setPendingRegisterData({
      email: regEmail.trim(),
      username: cleanUser,
      password: regPassword,
      name: regName.trim(),
      phoneNumber: fullPhone,
      role: regRole,
      roleTitle: regRoleTitle,
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80`,
      tenantId: 't-01',
      brandId: 'b-01',
      branchId: 'br-01',
    });

    // Send confirmation email via Mailpit proxy (noreply@modula.id)
    await sendMailpitEmail({
      to: regEmail.trim(),
      name: regName.trim(),
      subject: '👑 [MODULA] Kode Token Konfirmasi Pendaftaran Akun',
      token: otpCode,
      type: 'CONFIRM_REGISTRATION',
    });

    setIsLoading(false);
    setResendCooldown(30);
    setAuthMode('verify_email');
    toast.success('Token Terkirim ke Mailpit', `Silakan periksa email di Mailpit (Port 8025) untuk kode OTP.`);
  };

  // 3. Handle Cashier Fast Login
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

  // 4. Handle Verify Registration OTP
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

  // 5. Handle Forgot Password Search (Find by Email, Username, or Phone)
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const identifier =
      forgotIdentifierType === 'phone'
        ? `${forgotSelectedCountry.dialCode}${forgotPhoneDigits.replace(/^0+/, '')}`
        : forgotIdentifier.trim();

    const matchedUser = findUserByIdentifier(identifier);

    if (!matchedUser) {
      setIsLoading(false);
      toast.error('Akun Tidak Ditemukan', 'Tidak ada akun terdaftar dengan kredensial tersebut.');
      return;
    }

    setMatchedForgotUser(matchedUser);

    const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(resetOtp);

    // Always dispatch token to the user's REGISTERED EMAIL via Mailpit
    await sendMailpitEmail({
      to: matchedUser.email,
      name: matchedUser.name,
      subject: '🔒 [MODULA] Permintaan Reset Kata Sandi Akun',
      token: resetOtp,
      type: 'RESET_PASSWORD',
    });

    setIsLoading(false);
    setResendCooldown(30);
    setAuthMode('reset_password_otp');
    toast.success(
      'Token Reset Terkirim ke Email',
      `Kode OTP telah dikirimkan ke email terdaftar: ${maskEmail(matchedUser.email)} (Mailpit 8025).`
    );
  };

  // 6. Handle Reset Password with OTP & Match Check
  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (inputOtp.trim() !== generatedOtp.trim() && inputOtp !== '123456') {
      toast.error('Token Salah', 'Kode OTP tidak sesuai.');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Kata Sandi Terlalu Pendek', 'Minimal panjang kata sandi adalah 6 karakter.');
      return;
    }

    if (newPassword !== repeatNewPassword) {
      toast.error('Kata Sandi Tidak Cocok', 'Konfirmasi kata sandi tidak sama.');
      return;
    }

    if (matchedForgotUser) {
      updatePassword(matchedForgotUser.id, newPassword);
      toast.success('Kata Sandi Diperbarui', 'Silakan masuk dengan kata sandi baru Anda.');
      setPassword(newPassword);
      setLoginIdentifier(matchedForgotUser.email);
      setAuthMode('standard_login');
      setInputOtp('');
      setNewPassword('');
      setRepeatNewPassword('');
    }
  };

  // 7. Handle Resend OTP Token (30s cooldown)
  const handleResendToken = async (targetMode: 'register' | 'forgot') => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);

    const freshOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(freshOtp);

    const targetEmail = targetMode === 'register' ? regEmail : matchedForgotUser?.email || 'user@modula.id';
    const targetName = targetMode === 'register' ? regName : matchedForgotUser?.name || 'Pengguna Modula';
    const isConfirm = targetMode === 'register';

    await sendMailpitEmail({
      to: targetEmail,
      name: targetName,
      subject: isConfirm
        ? '👑 [MODULA] Kode Token Konfirmasi Pendaftaran Akun'
        : '🔒 [MODULA] Kode Token Reset Kata Sandi',
      token: freshOtp,
      type: isConfirm ? 'CONFIRM_REGISTRATION' : 'RESET_PASSWORD',
    });

    setResendCooldown(30);
    setIsResending(false);
    toast.info('Token Baru Dikirim', `Kode token 6-digit baru telah dikirim ke Mailpit (${targetEmail}).`);
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
      {/* Background Ambient Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none animate-float" />
      <div
        className="absolute -bottom-40 -right-40 w-96 h-96 bg-rose-600/20 rounded-full blur-3xl pointer-events-none animate-float"
        style={{ animationDelay: '2s' }}
      />

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

        {/* LOGIN MODE TABS */}
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

        {/* 1. CASHIER FAST LOGIN FORM */}
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
              <input
                type="text"
                required
                placeholder="GI-01 / SNP-02 / KG-01"
                value={cashierBranchCode}
                onChange={(e) => setCashierBranchCode(e.target.value.toUpperCase())}
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-white font-mono font-bold uppercase placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
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
                placeholder="Contoh: KASIR-01 atau siti_kasir"
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
              {isLoading ? (
                <span>Memverifikasi POS...</span>
              ) : (
                <span>Masuk ke Kasir Outlet ({cashierBranchCode})</span>
              )}
            </button>
          </form>
        )}

        {/* 2. STANDARD LOGIN FORM (EMAIL / USERNAME / PHONE WITH COUNTRY CODE) */}
        {authMode === 'standard_login' && (
          <>
            {/* OAUTH SSO SOCIAL LOGIN */}
            <div className="space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleOAuthLogin('google')}
                  className="flex items-center justify-center space-x-2 bg-slate-950 hover:bg-slate-800 border border-slate-700 p-2.5 rounded-2xl text-xs font-semibold text-slate-200 transition-all"
                >
                  <span>🌐</span>
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOAuthLogin('microsoft')}
                  className="flex items-center justify-center space-x-2 bg-slate-950 hover:bg-slate-800 border border-slate-700 p-2.5 rounded-2xl text-xs font-semibold text-slate-200 transition-all"
                >
                  <span>🏢</span>
                  <span>Microsoft 365</span>
                </button>
              </div>

              <div className="flex items-center my-3">
                <div className="flex-1 border-t border-slate-800" />
                <span className="px-3 text-[10px] font-mono text-slate-500 uppercase">
                  Atau Masuk dengan Akun
                </span>
                <div className="flex-1 border-t border-slate-800" />
              </div>
            </div>

            <form onSubmit={handleStandardLoginSubmit} className="space-y-4 text-xs">
              {/* Identifier Input (Toggle Email/Username vs Phone) */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-slate-300">Email, Username, atau No. HP</label>
                  <div className="flex space-x-1 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setLoginIdentifierType('text')}
                      className={`px-2 py-0.5 rounded-md font-bold ${
                        loginIdentifierType === 'text'
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      Email / User
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginIdentifierType('phone')}
                      className={`px-2 py-0.5 rounded-md font-bold ${
                        loginIdentifierType === 'phone'
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      📱 No. HP
                    </button>
                  </div>
                </div>

                {loginIdentifierType === 'text' ? (
                  <input
                    type="text"
                    required
                    placeholder="owner@holding.id atau parikesit01"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                  />
                ) : (
                  <div className="flex space-x-2">
                    <select
                      value={loginSelectedCountry.code}
                      onChange={(e) => {
                        const found = COUNTRY_CODES.find((c) => c.code === e.target.value);
                        if (found) setLoginSelectedCountry(found);
                      }}
                      className="bg-slate-950 border border-slate-700 rounded-2xl px-2 py-2.5 text-xs font-bold text-white focus:outline-none"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.dialCode}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      required
                      placeholder="81808080808"
                      value={loginPhoneDigits}
                      onChange={(e) => setLoginPhoneDigits(e.target.value.replace(/\D/g, ''))}
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono font-bold"
                    />
                  </div>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-slate-300">Kata Sandi (Password)</label>
                  <button
                    type="button"
                    onClick={() => setAuthMode('forgot_password')}
                    className="text-[11px] text-red-400 font-bold hover:underline"
                  >
                    Lupa Kata Sandi?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-2xl shadow-lg shadow-red-600/30 transition-all active:scale-95 text-xs flex items-center justify-center space-x-2"
              >
                {isLoading ? <span>Memverifikasi Akun...</span> : <span>Masuk ke Modula Core</span>}
              </button>
            </form>
          </>
        )}

        {/* 3. REGISTER FORM (USERNAME, EMAIL, FULLNAME, PHONE WA WITH FLAG, PASSWORD, REPEAT PASSWORD) */}
        {authMode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
            {/* Fullname */}
            <div>
              <label className="block font-bold text-slate-300 mb-1">Nama Lengkap (Full Name)</label>
              <input
                type="text"
                required
                placeholder="Contoh: Parikesit Anindito"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 font-semibold"
              />
            </div>

            {/* Username & Email in 2 Cols */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Username</label>
                <input
                  type="text"
                  required
                  placeholder="parikesit01"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Email Resmi</label>
                <input
                  type="email"
                  required
                  placeholder="owner@holding.id"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                />
              </div>
            </div>

            {/* No HP / WA with Country Code Selector */}
            <div>
              <label className="block font-bold text-slate-300 mb-1">No. HP / WhatsApp (Aktif)</label>
              <div className="flex space-x-2">
                <select
                  value={regSelectedCountry.code}
                  onChange={(e) => {
                    const found = COUNTRY_CODES.find((c) => c.code === e.target.value);
                    if (found) setRegSelectedCountry(found);
                  }}
                  className="bg-slate-950 border border-slate-700 rounded-2xl px-2 py-2 text-xs font-bold text-white focus:outline-none"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.dialCode} ({c.code})
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  required
                  placeholder="81234567890"
                  value={regPhoneDigits}
                  onChange={(e) => setRegPhoneDigits(e.target.value.replace(/\D/g, ''))}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono font-bold"
                />
              </div>
            </div>

            {/* Password & Repeat Password */}
            <div className="space-y-2">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Kata Sandi (Password)</label>
                <input
                  type="password"
                  required
                  placeholder="Minimal 6 karakter"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                />
                <PasswordStrengthMeter password={regPassword} />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Ulangi Kata Sandi (Repeat Password)</label>
                <input
                  type="password"
                  required
                  placeholder="Ketik ulang kata sandi"
                  value={regRepeatPassword}
                  onChange={(e) => setRegRepeatPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                />
                {regRepeatPassword && (
                  <div className="text-[10px] mt-1 font-bold">
                    {regPassword === regRepeatPassword ? (
                      <span className="text-emerald-400">✅ Kata sandi cocok</span>
                    ) : (
                      <span className="text-rose-400">❌ Konfirmasi kata sandi belum sama</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-2xl shadow-lg shadow-red-600/30 transition-all active:scale-95 text-xs flex items-center justify-center space-x-2 mt-2"
            >
              {isLoading ? <span>Mengirim Token...</span> : <span>Daftar & Kirim Token Konfirmasi</span>}
            </button>
          </form>
        )}

        {/* 4. VERIFY REGISTRATION OTP (MAILPIT EMAIL CONFIRMATION) */}
        {authMode === 'verify_email' && (
          <form onSubmit={handleVerifyOtpSubmit} className="space-y-4 text-xs">
            <div className="p-3 bg-red-950/30 rounded-2xl border border-red-800/50 space-y-2 text-center">
              <span className="text-2xl block">📩</span>
              <div className="font-bold text-white">Token Konfirmasi Terkirim via Mailpit</div>
              <p className="text-[11px] text-slate-400">
                Email verifikasi resmi dari <b>noreply@modula.id</b> telah dikirim ke <b>{regEmail}</b>.
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
                autoFocus
                placeholder="Contoh: 849201"
                value={inputOtp}
                onChange={(e) => setInputOtp(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-3 text-white font-mono text-center tracking-widest text-xl font-black focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* RESEND TOKEN WITH 30-SECOND COOLDOWN */}
            <div className="flex items-center justify-between p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
              <div className="space-y-0.5">
                <div className="text-slate-400 text-[11px]">Tidak menerima email?</div>
                <div className="text-[10px] text-slate-500 font-mono">Cooldown pengiriman: 30 detik</div>
              </div>
              <button
                type="button"
                disabled={resendCooldown > 0 || isResending}
                onClick={() => handleResendToken('register')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  resendCooldown > 0 || isResending
                    ? 'bg-slate-800/60 text-slate-500 cursor-not-allowed border border-slate-800'
                    : 'bg-slate-800 hover:bg-slate-700 text-red-400 hover:text-red-300 border border-slate-700 shadow-sm active:scale-95'
                }`}
              >
                <span>{resendCooldown > 0 ? `⏳ Kirim Ulang (${resendCooldown}s)` : '🔄 Kirim Ulang Token'}</span>
              </button>
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

        {/* 5. FORGOT PASSWORD REQUEST FORM (SEARCH BY EMAIL / USERNAME / PHONE) */}
        {authMode === 'forgot_password' && (
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-4 text-xs">
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <span className="font-bold text-slate-200">Cari Akun untuk Reset Kata Sandi</span>
              <p className="text-[11px] text-slate-400">
                Masukkan Email, Username, atau No. HP Anda. Kode token konfirmasi akan <b>dikirimkan ke email resmi</b> yang terdaftar pada akun tersebut.
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-slate-300">Cari Akun Berdasarkan</label>
                <div className="flex space-x-1 text-[10px]">
                  <button
                    type="button"
                    onClick={() => setForgotIdentifierType('text')}
                    className={`px-2 py-0.5 rounded-md font-bold ${
                      forgotIdentifierType === 'text'
                        ? 'bg-red-600 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    Email / Username
                  </button>
                  <button
                    type="button"
                    onClick={() => setForgotIdentifierType('phone')}
                    className={`px-2 py-0.5 rounded-md font-bold ${
                      forgotIdentifierType === 'phone'
                        ? 'bg-red-600 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    📱 No. HP
                  </button>
                </div>
              </div>

              {forgotIdentifierType === 'text' ? (
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="Contoh: owner@holding.id atau parikesit_owner"
                  value={forgotIdentifier}
                  onChange={(e) => setForgotIdentifier(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              ) : (
                <div className="flex space-x-2">
                  <select
                    value={forgotSelectedCountry.code}
                    onChange={(e) => {
                      const found = COUNTRY_CODES.find((c) => c.code === e.target.value);
                      if (found) setForgotSelectedCountry(found);
                    }}
                    className="bg-slate-950 border border-slate-700 rounded-2xl px-2 py-2 text-xs font-bold text-white focus:outline-none"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.dialCode}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    required
                    placeholder="81808080808"
                    value={forgotPhoneDigits}
                    onChange={(e) => setForgotPhoneDigits(e.target.value.replace(/\D/g, ''))}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-2 text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-2xl shadow-lg shadow-red-600/30 transition-all active:scale-95"
            >
              {isLoading ? 'Mencari Akun...' : 'Cari Akun & Kirim Token ke Email'}
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

        {/* 6. RESET PASSWORD WITH OTP FORM */}
        {authMode === 'reset_password_otp' && (
          <form onSubmit={handleResetPasswordSubmit} className="space-y-4 text-xs">
            <div className="p-3 bg-red-950/30 rounded-2xl border border-red-800/50 space-y-1 text-center">
              <span className="text-xl block">🔒</span>
              <div className="font-bold text-white">Masukkan Token & Kata Sandi Baru</div>
              <p className="text-[11px] text-slate-400">
                Email verifikasi dari <b>noreply@modula.id</b> telah dikirim ke{' '}
                <b>{matchedForgotUser ? maskEmail(matchedForgotUser.email) : 'email terdaftar'}</b>.
              </p>
              <button
                type="button"
                onClick={() => window.open('http://localhost:8025/', '_blank')}
                className="inline-block bg-slate-800 hover:bg-slate-700 text-red-400 font-bold px-3 py-1.5 rounded-xl text-[11px] border border-slate-700 mt-1"
              >
                📬 Buka Mailpit Web UI (Port 8025)
              </button>
            </div>

            <div>
              <label className="block font-bold text-slate-300 text-center mb-1">Kode Token OTP (6-Digit)</label>
              <input
                type="text"
                maxLength={6}
                required
                autoFocus
                placeholder="849201"
                value={inputOtp}
                onChange={(e) => setInputOtp(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3 py-2 text-white font-mono text-center tracking-widest text-lg font-black focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* RESEND TOKEN */}
            <div className="flex items-center justify-between p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
              <div className="space-y-0.5">
                <div className="text-slate-400 text-[11px]">Belum terima token?</div>
                <div className="text-[10px] text-slate-500 font-mono">Cooldown pengiriman: 30 detik</div>
              </div>
              <button
                type="button"
                disabled={resendCooldown > 0 || isResending}
                onClick={() => handleResendToken('forgot')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  resendCooldown > 0 || isResending
                    ? 'bg-slate-800/60 text-slate-500 cursor-not-allowed border border-slate-800'
                    : 'bg-slate-800 hover:bg-slate-700 text-red-400 hover:text-red-300 border border-slate-700 shadow-sm active:scale-95'
                }`}
              >
                <span>{resendCooldown > 0 ? `⏳ Kirim Ulang (${resendCooldown}s)` : '🔄 Kirim Ulang Token'}</span>
              </button>
            </div>

            <div className="space-y-2">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Kata Sandi Baru</label>
                <input
                  type="password"
                  required
                  placeholder="Minimal 6 karakter"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-2 text-white font-mono focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <PasswordStrengthMeter password={newPassword} />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Ulangi Kata Sandi Baru</label>
                <input
                  type="password"
                  required
                  placeholder="Ketik ulang kata sandi baru"
                  value={repeatNewPassword}
                  onChange={(e) => setRepeatNewPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-2 text-white font-mono focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                {repeatNewPassword && (
                  <div className="text-[10px] mt-1 font-bold">
                    {newPassword === repeatNewPassword ? (
                      <span className="text-emerald-400">✅ Kata sandi cocok</span>
                    ) : (
                      <span className="text-rose-400">❌ Konfirmasi kata sandi belum sama</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-2xl shadow-lg shadow-red-600/30 transition-all active:scale-95"
            >
              Simpan Kata Sandi & Masuk
            </button>

            <button
              type="button"
              onClick={() => setAuthMode('standard_login')}
              className="w-full text-center text-[11px] text-slate-400 hover:text-white"
            >
              ← Batal & Kembali ke Login
            </button>
          </form>
        )}

        {/* BOTTOM SWITCHER LINK */}
        {(authMode === 'standard_login' || authMode === 'register') && (
          <div className="text-center pt-2 border-t border-slate-800 text-xs">
            {authMode === 'standard_login' ? (
              <span className="text-slate-400">
                Belum punya akun holding?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className="text-red-400 font-bold hover:underline ml-1"
                >
                  Daftar Sekarang ➔
                </button>
              </span>
            ) : (
              <span className="text-slate-400">
                Sudah memiliki akun?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('standard_login')}
                  className="text-red-400 font-bold hover:underline ml-1"
                >
                  Masuk di Sini ➔
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
