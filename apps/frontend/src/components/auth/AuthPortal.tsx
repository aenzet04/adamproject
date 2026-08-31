'use client';

import React, { useState } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import { PasswordStrengthMeter } from '../molecules/PasswordStrengthMeter';
import { toast } from '../../stores/useToastStore';
import type { UserRole } from '../../types';

export const AuthPortal: React.FC = () => {
  const { login, signup, quickLoginAs } = useAuthStore();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('hendra.gunawan@nusantara.id');
  const [password, setPassword] = useState('Password123!');
  const [selectedRole, setSelectedRole] = useState<UserRole>('owner');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'signin') {
      login(email, selectedRole);
      toast.success('Berhasil Masuk', `Selamat datang kembali, ${selectedRole.toUpperCase()}!`);
    } else {
      if (!name) {
        toast.error('Gagal Mendaftar', 'Mohon isi nama lengkap Anda.');
        return;
      }
      signup(name, email, selectedRole);
      toast.success('Pendaftaran Sukses', `Akun ${name} (${selectedRole}) berhasil diaktifkan.`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6 relative overflow-hidden font-sans">
      {/* Background Aesthetic Red Floating Orbs (GSAP-like floating animations) */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none animate-float" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-rose-700/20 rounded-full blur-3xl pointer-events-none animate-float" style={{ animationDelay: '3s' }} />

      {/* Top Header & Modula Branding */}
      <header className="flex justify-between items-center z-10">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-600 to-red-500 flex items-center justify-center font-black text-white shadow-xl shadow-red-600/30 text-xl tracking-tighter">
            M
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-white flex items-center space-x-2">
              <span className="bg-gradient-to-r from-white via-slate-100 to-red-200 bg-clip-text text-transparent">
                MODULA ERP-POS
              </span>
              <span className="bg-red-950 text-red-400 border border-red-800/80 text-[9px] font-mono px-2 py-0.5 rounded-full font-bold">
                v1.5.0 Enterprise
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">
              Built by <b className="text-red-400 font-mono">parikesitad-pm</b> • Target Repo: <b className="text-slate-300 font-mono">aenzet04/adamproject</b>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-2xl border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Multi-Tenant Auth Shield</span>
        </div>
      </header>

      {/* Auth Card Container */}
      <div className="max-w-md w-full mx-auto my-auto z-10 animate-fadeInScale">
        <div className="bg-slate-900/90 backdrop-blur-2xl border border-slate-800/90 rounded-3xl p-8 shadow-2xl shadow-black/60 space-y-5">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-white tracking-tight">
              {mode === 'signin' ? 'Masuk ke Modula' : 'Pendaftaran Akun Baru'}
            </h2>
            <p className="text-xs text-slate-400">
              Platform ERP-POS Modular & Financial Core Multi-Tenant
            </p>
          </div>

          {/* Quick Demo 1-Click Role Login */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center">
              ⚡ 1-Click Quick Demo Login:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  quickLoginAs('owner');
                  toast.success('Login Cepat Berhasil', 'Masuk sebagai Owner / Group CEO');
                }}
                className="bg-red-950/60 hover:bg-red-900/80 border border-red-800/60 p-2.5 rounded-2xl text-left transition-all group"
              >
                <div className="text-xs font-bold text-red-300 group-hover:text-white flex items-center space-x-1">
                  <span>👑</span>
                  <span>Owner (CEO)</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">Hendra Gunawan</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  quickLoginAs('cashier');
                  toast.success('Login Cepat Berhasil', 'Masuk sebagai Kasir Outlet');
                }}
                className="bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 p-2.5 rounded-2xl text-left transition-all group"
              >
                <div className="text-xs font-bold text-slate-200 group-hover:text-white flex items-center space-x-1">
                  <span>🛒</span>
                  <span>Kasir Outlet</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">Siti Rahma (POS)</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  quickLoginAs('admin_brand');
                  toast.success('Login Cepat Berhasil', 'Masuk sebagai Branch Admin');
                }}
                className="bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 p-2.5 rounded-2xl text-left transition-all group"
              >
                <div className="text-xs font-bold text-slate-200 group-hover:text-white flex items-center space-x-1">
                  <span>🏢</span>
                  <span>Brand Admin</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">Rian Setyadi</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  quickLoginAs('super_user');
                  toast.success('Login Cepat Berhasil', 'Masuk sebagai Super User Platform');
                }}
                className="bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 p-2.5 rounded-2xl text-left transition-all group"
              >
                <div className="text-xs font-bold text-purple-300 group-hover:text-white flex items-center space-x-1">
                  <span>⚡</span>
                  <span>Super User</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">Adam Pratama</div>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-slate-600 text-xs">
            <div className="h-[1px] flex-1 bg-slate-800" />
            <span>atau isi kredensial</span>
            <div className="h-[1px] flex-1 bg-slate-800" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {mode === 'signup' && (
              <div>
                <label className="block font-bold text-slate-300 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  placeholder="Nama Lengkap Anda"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-300 mb-1">Email Perusahaan</label>
              <input
                type="email"
                required
                placeholder="nama@perusahaan.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-red-500"
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
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-red-500 font-mono"
              />
              {/* Real-time Interactive Password Validator */}
              <div className="mt-2">
                <PasswordStrengthMeter password={password} />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Otoritas Peran (Role)</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2.5 text-slate-100 font-semibold focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                <option value="owner">👑 Owner / Group CEO</option>
                <option value="cashier">🛒 Kasir & Barista Outlet</option>
                <option value="admin_brand">🏢 Brand & Branch Admin</option>
                <option value="super_user">⚡ Super User / SaaS Director</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold py-3 rounded-2xl text-xs shadow-lg shadow-red-600/30 transition-all active:scale-95 mt-2"
            >
              {mode === 'signin' ? 'Masuk ke Modula Dashboard' : 'Daftar Akun Baru'}
            </button>
          </form>

          <div className="text-center">
            <button
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-xs text-red-400 hover:text-red-300 font-bold"
            >
              {mode === 'signin' ? 'Belum punya akun? Daftar di sini' : 'Sudah punya akun? Masuk di sini'}
            </button>
          </div>
        </div>
      </div>

      {/* Footer Credits */}
      <footer className="flex justify-between items-center text-[11px] text-slate-500 z-10 border-t border-slate-900 pt-4">
        <div>
          Created & Architected by <a href="https://github.com/parikesitad-pm" target="_blank" rel="noreferrer" className="text-red-400 font-bold hover:underline font-mono">parikesitad-pm</a>
        </div>
        <div>
          Collaborator & Repo Owner: <a href="https://github.com/aenzet04" target="_blank" rel="noreferrer" className="text-slate-400 font-bold hover:underline font-mono">aenzet04</a> (adamproject)
        </div>
      </footer>
    </div>
  );
};
