'use client';

import React, { useState } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
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
    } else {
      if (!name) {
        alert('Mohon isi nama lengkap Anda.');
        return;
      }
      signup(name, email, selectedRole);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6 relative overflow-hidden font-sans">
      {/* Background Aesthetic Red Glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-rose-700/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header & Metadata */}
      <header className="flex justify-between items-center z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center font-black text-white shadow-lg shadow-red-600/30 text-lg">
            AD
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tight text-white flex items-center space-x-2">
              <span>ADAM ERP-POS & FINANCIAL CORE</span>
              <span className="bg-red-950 text-red-400 border border-red-800/80 text-[9px] font-mono px-2 py-0.5 rounded-full font-bold">
                v1.4.0 Enterprise
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">
              Developed by <b className="text-red-400 font-mono">parikesitad-pm</b> • Repository: <b className="text-slate-300 font-mono">aenzet04/adamproject</b>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Security Engine: Active</span>
        </div>
      </header>

      {/* Auth Card Container */}
      <div className="max-w-md w-full mx-auto my-auto z-10">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-black/50 space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-black text-white tracking-tight">
              {mode === 'signin' ? 'Masuk ke Akun Enterprise' : 'Pendaftaran Pengguna Baru'}
            </h2>
            <p className="text-xs text-slate-400">
              Sistem Otentikasi Multi-Tenant dengan Proteksi JWT & RBAC
            </p>
          </div>

          {/* Quick Demo 1-Click Role Login */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center">
              ⚡ 1-Click Quick Demo Login (Pilih Peran):
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => quickLoginAs('owner')}
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
                onClick={() => quickLoginAs('cashier')}
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
                onClick={() => quickLoginAs('admin_brand')}
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
                onClick={() => quickLoginAs('super_user')}
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
            <span>atau login manual</span>
            <div className="h-[1px] flex-1 bg-slate-800" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
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
              <label className="block font-bold text-slate-300 mb-1">Alamat Email Perusahaan</label>
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
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Otoritas Peran (Role RBAC)</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2.5 text-slate-100 font-semibold focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                <option value="owner">👑 Owner / Group CEO</option>
                <option value="cashier">🛒 Kasir & Barista Outlet</option>
                <option value="admin_brand">🏢 Brand & Branch Admin</option>
                <option value="super_user">⚡ Super User / SaaS Platform Director</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold py-3 rounded-2xl text-xs shadow-lg shadow-red-600/30 transition-all active:scale-95 mt-2"
            >
              {mode === 'signin' ? 'Masuk ke Dashboard Sistem' : 'Daftar Akun Baru'}
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
