'use client';

import React, { useState } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import { PasswordStrengthMeter } from '../molecules/PasswordStrengthMeter';
import { toast } from '../../stores/useToastStore';
import type { UserRole } from '../../types';

export const AuthPortal: React.FC = () => {
  const { login, register, loginWithOAuth } = useAuthStore();
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Form State
  const [email, setEmail] = useState('parikesit@modula.id');
  const [password, setPassword] = useState('Modula#2026Secure!');
  const [name, setName] = useState('Parikesit (Owner)');
  const [role, setRole] = useState<UserRole>('owner');
  const [roleTitle, setRoleTitle] = useState('Group CEO & Holding Owner');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (isRegisterMode) {
        register({
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
        toast.success('Pendaftaran Berhasil', `Selamat datang di Modula, ${name}!`);
      } else {
        const success = login(email, password);
        if (success) {
          toast.success('Login Berhasil', `Selamat datang kembali, ${name}!`);
        } else {
          toast.error('Autentikasi Gagal', 'Email atau kata sandi tidak sesuai.');
        }
      }
      setIsLoading(false);
    }, 600);
  };

  const handleOAuthLogin = (provider: 'google' | 'github' | 'apple' | 'microsoft') => {
    setIsLoading(true);
    toast.info('Menghubungkan OAuth', `Mengautentikasi melalui ${provider.toUpperCase()} Single Sign-On...`);

    setTimeout(() => {
      if (loginWithOAuth) {
        loginWithOAuth(provider);
      } else {
        // Fallback simulated OAuth
        login(email, password);
      }
      setIsLoading(false);
      toast.success('OAuth Berhasil', `Autentikasi ${provider.toUpperCase()} terverifikasi.`);
    }, 800);
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
            {isRegisterMode ? 'Daftar Akun Modula' : 'Masuk ke Modula'}
          </h2>
          <p className="text-xs text-slate-400">
            Enterprise Multi-Tenant Modular SaaS ERP-POS & Financial Core
          </p>
        </div>

        {/* OAUTH SSO SOCIAL LOGIN BUTTONS */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleOAuthLogin('google')}
              className="flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700/80 border border-slate-700/80 py-2.5 px-3 rounded-2xl text-xs font-bold transition-all active:scale-95 shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.4 8.8 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7s.1-2 .4-2.7L1.6 6.4C.6 8.4 0 10.6 0 13s.6 4.6 1.6 6.6l3.7-4.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.2 0-5.8-2.4-6.7-5.3L1.6 17.9C3.5 21.7 7.4 24 12 24z"
                />
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

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleOAuthLogin('apple')}
              className="flex items-center justify-center space-x-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 py-2 px-3 rounded-2xl text-[11px] font-semibold transition-all"
            >
              <span>🍎 Apple ID</span>
            </button>
            <button
              type="button"
              onClick={() => handleOAuthLogin('microsoft')}
              className="flex items-center justify-center space-x-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 py-2 px-3 rounded-2xl text-[11px] font-semibold transition-all"
            >
              <span>💼 Microsoft SSO</span>
            </button>
          </div>

          <div className="flex items-center my-3">
            <div className="flex-1 border-t border-slate-800" />
            <span className="px-3 text-[10px] uppercase font-mono text-slate-500">atau email resmi</span>
            <div className="flex-1 border-t border-slate-800" />
          </div>
        </div>

        {/* Main Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isRegisterMode && (
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
            <label className="block font-bold text-slate-300 mb-1">Kata Sandi (Password)</label>
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
            />
            {/* Real-time Password Strength Meter */}
            <PasswordStrengthMeter password={password} />
          </div>

          {isRegisterMode && (
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
              <span>Memproses Autentikasi...</span>
            ) : (
              <span>{isRegisterMode ? 'Daftar Sekarang' : 'Masuk ke Modula Core'}</span>
            )}
          </button>
        </form>

        {/* Demo Fast Login Switcher */}
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
                setEmail('kasir.gi@kopinusantara.id');
                setName('Siti Rahma');
                setRole('cashier');
                setRoleTitle('Kasir Shift Pagi');
                login('kasir.gi@kopinusantara.id', 'Modula#2026Secure!');
              }}
              className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-left border border-slate-800 text-slate-300"
            >
              🛒 Kasir POS
            </button>
          </div>
        </div>

        {/* Toggle Mode Footer */}
        <div className="text-center pt-2 border-t border-slate-800 text-xs text-slate-400">
          {isRegisterMode ? (
            <span>
              Sudah memiliki akun?{' '}
              <button
                type="button"
                onClick={() => setIsRegisterMode(false)}
                className="text-red-400 font-bold hover:underline"
              >
                Masuk di sini
              </button>
            </span>
          ) : (
            <span>
              Belum punya akun brand?{' '}
              <button
                type="button"
                onClick={() => setIsRegisterMode(true)}
                className="text-red-400 font-bold hover:underline"
              >
                Daftar baru
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
