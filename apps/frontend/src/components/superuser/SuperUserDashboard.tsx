'use client';

import React, { useState } from 'react';
import { useModuleLicenseStore, SubscriptionTier } from '../../stores/useModuleLicenseStore';
import { useTenantStore } from '../../stores/useTenantStore';
import { useInternalChatStore } from '../../stores/useInternalChatStore';
import { toast } from '../../stores/useToastStore';
import type { Brand } from '../../types';

interface TenantOwnerAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  legalEntity: 'PT' | 'CV' | 'Perorangan';
  brandCount: number;
  branchCount: number;
  tier: SubscriptionTier;
  monthsRemaining: number;
  expiryDate: string;
  status: 'active' | 'warning_expiring' | 'suspended';
}

const INITIAL_TENANT_OWNERS: TenantOwnerAccount[] = [
  {
    id: 'own-01',
    name: 'Parikesit (Group CEO)',
    email: 'ceo@nusantaragroup.com',
    phone: '081299001122',
    companyName: 'PT Multi Industri Nusantara Holding',
    legalEntity: 'PT',
    brandCount: 2,
    branchCount: 3,
    tier: 'enterprise',
    monthsRemaining: 12,
    expiryDate: '2027-08-31',
    status: 'active',
  },
  {
    id: 'own-02',
    name: 'Hendra Gunawan',
    email: 'hendra@berkahmart.co.id',
    phone: '081388776655',
    companyName: 'CV Berkah Mart Retail Sejahtera',
    legalEntity: 'CV',
    brandCount: 1,
    branchCount: 2,
    tier: 'business',
    monthsRemaining: 1,
    expiryDate: '2026-09-15',
    status: 'warning_expiring',
  },
  {
    id: 'own-03',
    name: 'Siti Aminah',
    email: 'siti@barbershopelite.id',
    phone: '081900112233',
    companyName: 'Elite Grooming Studio',
    legalEntity: 'Perorangan',
    brandCount: 1,
    branchCount: 1,
    tier: 'starter',
    monthsRemaining: 6,
    expiryDate: '2027-02-28',
    status: 'active',
  },
];

const RELEASES_CHANGELOG = [
  {
    version: 'v3.1.0-enterprise',
    date: '2026-09-01',
    title: 'Zero-Knowledge Privacy, Super User Director Suite & Emoji Reaction Engine',
    highlights: [
      'Strict Zero-Knowledge Tenancy Isolation: Super User wajib memiliki izin tiket audit untuk inspeksi brand.',
      'Super User Director Control: Manajemen multi-owner, granular per-brand module toggle, dan subscription expiry tracker.',
      'Realtime Chat Direct DM & Happening Now beacon untuk Owner & GM.',
      'Enterprise Emoji Suite (Babi Hoki, Gen Z Core, Lansia, & Corporate Synergy).',
    ],
  },
  {
    version: 'v3.0.0',
    date: '2026-08-31',
    title: 'Realtime Team Chat (Dual Channels Telegram/WhatsApp Web)',
    highlights: [
      'Dedicated Realtime Team Chat in sidebar navigation with live beacon.',
      'Dual Channels: Brand Headquarters (All Outlets) vs Branch Local Chat (Outlet Team).',
      'Image attachments, Pinned announcements, and Live voting polls.',
    ],
  },
  {
    version: 'v2.9.0',
    date: '2026-08-31',
    title: 'Enterprise Core: Split Bill CRM Search, Dual Payment & RBAC',
    highlights: [
      'Split bill single-owner default & scalable CRM search modal for millions of customers.',
      'Dual payment mutual exclusion lock & fast 50/50 split presets.',
      'Order sales channels (Dine In, Take Away, GrabFood, GoFood, ShopeeFood, Maxim).',
      'Immutable security audit logs & developer seed API (POST /api/v1/dev/seed).',
    ],
  },
];

export const SuperUserDashboard: React.FC = () => {
  const {
    subscriptionTier,
    remainingMonths,
    expiryDate,
    customReceiptFooter,
    modules,
    setSubscriptionTier,
    setCustomReceiptFooter,
    toggleModuleLock,
  } = useModuleLicenseStore();

  const { availableBrands } = useTenantStore();
  const brands = availableBrands || [];
  const { inspectionSessions, authorizeSuperUserTicket, isSuperUserAuthorizedForBrand } = useInternalChatStore();

  const [activeTab, setActiveTab] = useState<'owners' | 'modules' | 'billing' | 'privacy' | 'changelog'>('owners');
  const [selectedBrandId, setSelectedBrandId] = useState<string>('b-01');
  const [footerDraft, setFooterDraft] = useState(customReceiptFooter);

  // Inspection Request Modal State
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestReason, setRequestReason] = useState('Diagnostik sinkronisasi saldo Buku Besar Akuntansi');
  const [targetBrandIdForAudit, setTargetBrandIdForAudit] = useState('b-01');

  // Tenant Owners State
  const [owners, setOwners] = useState<TenantOwnerAccount[]>(INITIAL_TENANT_OWNERS);

  const handleExtendSubscription = (ownerId: string, additionalMonths: number) => {
    setOwners((prev) =>
      prev.map((o) => {
        if (o.id !== ownerId) return o;
        const newMonths = o.monthsRemaining + additionalMonths;
        return {
          ...o,
          monthsRemaining: newMonths,
          status: 'active',
        };
      })
    );
    toast.success('Langganan Diperpanjang', `Tenant berhasil ditambahkan ${additionalMonths} bulan aktif.`);
  };

  const handleSendReminderWA = (owner: TenantOwnerAccount) => {
    const text = encodeURIComponent(
      `Halo Bpk/Ibu ${owner.name}, akun SaaS Modula Anda untuk ${owner.companyName} akan berakhir dalam ${owner.monthsRemaining} bulan (${owner.expiryDate}). Silakan lakukan perpanjangan paket ${owner.tier.toUpperCase()} agar operasional POS dan Laporan Keuangan tetap lancar.`
    );
    window.open(`https://wa.me/${owner.phone}?text=${text}`, '_blank');
    toast.info('Notifikasi Tagihan Terkirim', `Pesan WhatsApp billing dikirim ke ${owner.name}`);
  };

  const handleCreateAuditTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const brand = brands.find((b) => b.id === targetBrandIdForAudit);
    const ticketId = `TCK-${Date.now().toString().slice(-6)}`;

    authorizeSuperUserTicket({
      ticketId,
      brandId: targetBrandIdForAudit,
      brandName: brand?.name || 'Brand Partner',
      superUserId: 'usr-superuser-01',
      ownerId: 'usr-owner-01',
      reason: requestReason,
    });

    setIsRequestModalOpen(false);
    toast.success('Tiket Audit Diterbitkan', `Izin inspeksi aktif untuk brand ${brand?.name}`);
  };

  return (
    <div className="p-4 md:p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors space-y-6">
      {/* 1. HEADER & SYSTEM OVERVIEW */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">⚡</span>
            <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100">
              Super User & Platform Director Command Center
            </h2>
            <span className="bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400 border border-purple-300 dark:border-purple-800 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold">
              Global Multi-Tenant Control
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manajemen akun Owner, lisensi modular per Brand, pelacak sisa langganan SaaS, etika isolasi privasi data (*Zero-Knowledge*), dan riwayat versi rilis.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsRequestModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2 rounded-2xl text-xs flex items-center space-x-1.5 shadow-lg shadow-purple-600/30 active:scale-95 transition-all"
        >
          <span>🛡️</span>
          <span>Request Tiket Audit Brand</span>
        </button>
      </div>

      {/* 2. ZERO-KNOWLEDGE PRIVACY ETHICS BANNER */}
      <div className="p-4 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/80 rounded-3xl flex items-center justify-between text-xs text-purple-900 dark:text-purple-300">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">🛡️</span>
          <div>
            <div className="font-bold flex items-center space-x-2">
              <span>Protokol Privasi Zero-Knowledge & Etika Bisnis Korporasi</span>
              <span className="text-[9px] bg-purple-200 dark:bg-purple-900 px-2 py-0.5 rounded font-mono font-bold">
                ENFORCED
              </span>
            </div>
            <p className="text-[11px] opacity-90 mt-0.5">
              Super User / Tim Pengembang <b>dilarang mengintip data internal transaksi POS, laporan keuangan, dan obrolan cabang</b> milik Brand rekanan secara sepihak kecuali telah memiliki Tiket Izin Audit resmi dari Owner/GM.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold hidden md:inline">
          {inspectionSessions.filter((s) => s.isActive).length} Tiket Aktif
        </span>
      </div>

      {/* 3. NAVIGATION TABS */}
      <div className="flex items-center space-x-2 overflow-x-auto border-b border-slate-200 dark:border-slate-800 pb-2">
        {[
          { id: 'owners', label: '👑 Manajemen Owner & Holding' },
          { id: 'modules', label: '📦 Lisensi Modul Per Brand' },
          { id: 'billing', label: '💳 Sisa Langganan & Billing Alerts' },
          { id: 'privacy', label: '🛡️ Audit Inspection Tickets' },
          { id: 'changelog', label: '🚀 Versioning & Health Monitor' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 4. TAB 1: MANAJEMEN OWNER & TENANT HOLDING */}
      {activeTab === 'owners' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
              Direktori Akun Owner & Entitas Bisnis Terdaftar ({owners.length})
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Multi-Tenant Holding Architecture</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono">
                  <th className="pb-3 font-semibold">Nama Owner / Holding</th>
                  <th className="pb-3 font-semibold">Entitas Hukum</th>
                  <th className="pb-3 font-semibold">Kontak WA & Email</th>
                  <th className="pb-3 font-semibold">Jml Brand / Cabang</th>
                  <th className="pb-3 font-semibold">Paket SaaS</th>
                  <th className="pb-3 font-semibold">Masa Aktif</th>
                  <th className="pb-3 font-semibold text-right">Aksi Super User</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {owners.map((own) => (
                  <tr key={own.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 font-bold text-slate-800 dark:text-slate-200">
                      <div>{own.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{own.companyName}</div>
                    </td>
                    <td className="py-3.5">
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono px-2 py-0.5 rounded font-bold">
                        {own.legalEntity}
                      </span>
                    </td>
                    <td className="py-3.5 font-mono text-[11px]">
                      <div>📱 {own.phone}</div>
                      <div className="text-slate-400">✉️ {own.email}</div>
                    </td>
                    <td className="py-3.5 font-mono font-bold">
                      {own.brandCount} Brand / {own.branchCount} Cabang
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                          own.tier === 'enterprise'
                            ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                            : own.tier === 'business'
                            ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                            : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        }`}
                      >
                        {own.tier}
                      </span>
                    </td>
                    <td className="py-3.5 font-mono">
                      <div className={own.monthsRemaining <= 1 ? 'text-amber-500 font-bold' : 'text-emerald-500 font-bold'}>
                        {own.monthsRemaining} Bulan ({own.expiryDate})
                      </div>
                      {own.monthsRemaining <= 1 && (
                        <span className="text-[9px] bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 px-1 rounded font-bold">
                          Segera Habis
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 text-right space-x-1">
                      <select
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (val > 0) {
                            handleExtendSubscription(own.id, val);
                            e.target.value = '';
                          }
                        }}
                        defaultValue=""
                        className="bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-bold px-2 py-1 rounded-xl text-[10px] focus:outline-none cursor-pointer"
                        title="Pilih Perpanjangan Langganan"
                      >
                        <option value="" disabled>+ Perpanjang</option>
                        <option value="1">+1 Bulan (Bulanan)</option>
                        <option value="3">+3 Bulan (Triwulan)</option>
                        <option value="6">+6 Bulan (Semester)</option>
                        <option value="12">+12 Bulan (Tahunan)</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => handleSendReminderWA(own)}
                        className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold px-2.5 py-1 rounded-xl text-[10px]"
                        title="Kirim Pengingat Billing via WhatsApp"
                      >
                        🔔 WA
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. TAB 2: LISENSI MODUL PER BRAND */}
      {activeTab === 'modules' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                  Pilih Brand yang Ingin Dikelola Akses Modulnya:
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Kunci atau aktifkan modul bisnis per brand secara independen ala Accurate / Jurnal.id.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                {brands.map((b: Brand) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBrandId(b.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                      selectedBrandId === b.id
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    🏢 {b.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Granular Module Switch Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              {modules.map((mod) => (
                <div
                  key={mod.id}
                  className={`p-4 rounded-3xl border transition-all flex flex-col justify-between space-y-3 ${
                    mod.isUnlocked
                      ? 'bg-white dark:bg-slate-900 border-purple-300 dark:border-purple-800/60 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100">{mod.name}</h4>
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          mod.isUnlocked
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                        }`}
                      >
                        {mod.isUnlocked ? 'AKTIF' : 'TERKUNCI'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{mod.description}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                    <span className="font-mono text-purple-600 dark:text-purple-400 font-bold text-[11px]">
                      Rp {(mod.priceMonthly || 0).toLocaleString('id-ID')}/bln
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        toggleModuleLock(mod.code);
                        toast.info('Status Modul Berubah', `${mod.name} berhasil di-${mod.isUnlocked ? 'kunci' : 'buka'}`);
                      }}
                      className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all ${
                        mod.isUnlocked
                          ? 'bg-rose-100 hover:bg-rose-200 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                      }`}
                    >
                      {mod.isUnlocked ? '🔒 Kunci Modul' : '🔓 Buka Modul'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. TAB 3: SISA LANGGANAN & BILLING ALERTS */}
      {activeTab === 'billing' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                Pusat Notifikasi Tagihan & Pelacak Masa Aktif SaaS
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Otomatisasi pengingat tagihan langganan via WhatsApp gateway dan email Mailpit.
              </p>
            </div>

            <button
              type="button"
              onClick={() => toast.success('Broadcast Tagihan Terkirim', 'Seluruh tenant mendekati jatuh tempo telah dikirimi reminder.')}
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs shadow-md shadow-purple-600/20"
            >
              🚀 Broadcast Reminder Massal
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl space-y-1">
              <span className="text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-300 uppercase">
                Tenant Sehat (&gt; 3 Bulan)
              </span>
              <div className="text-xl font-bold font-mono text-emerald-700 dark:text-emerald-200">
                {owners.filter((o) => o.monthsRemaining > 3).length} Akun
              </div>
              <p className="text-[10px] text-slate-500">Arus kas stabil & tidak ada risiko terhenti.</p>
            </div>

            <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl space-y-1">
              <span className="text-[10px] font-mono font-bold text-amber-800 dark:text-amber-300 uppercase">
                Peringatan (&lt; 30 Hari Sisa)
              </span>
              <div className="text-xl font-bold font-mono text-amber-700 dark:text-amber-200">
                {owners.filter((o) => o.monthsRemaining <= 1).length} Akun
              </div>
              <p className="text-[10px] text-slate-500">Perlu follow-up penawaran perpanjangan paket.</p>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-2xl space-y-1">
              <span className="text-[10px] font-mono font-bold text-purple-800 dark:text-purple-300 uppercase">
                Estimasi MRR SaaS
              </span>
              <div className="text-xl font-bold font-mono text-purple-700 dark:text-purple-200">
                Rp 28.500.000 / bln
              </div>
              <p className="text-[10px] text-slate-500">Dari total lisensi modular seluruh holding.</p>
            </div>
          </div>
        </div>
      )}

      {/* 7. TAB 4: AUDIT INSPECTION TICKETS */}
      {activeTab === 'privacy' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                Daftar Tiket Izin Inspeksi Audit Aktif
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Setiap akses Super User ke data internal tercatat secara kriptografis dalam buku log audit.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsRequestModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs"
            >
              + Ajukan Izin Tiket Baru
            </button>
          </div>

          <div className="space-y-2">
            {inspectionSessions.map((session) => (
              <div
                key={session.ticketId}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold font-mono text-purple-600 dark:text-purple-400">
                      #{session.ticketId}
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{session.brandName}</span>
                    <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono px-2 py-0.2 rounded font-bold">
                      AUTHORIZED
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    <b>Alasan Audit:</b> {session.reason}
                  </p>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Berlaku s/d: {new Date(session.authorizedUntil).toLocaleString('id-ID')}
                  </div>
                </div>

                <span className="text-emerald-500 font-mono font-bold text-xs">● Active Session</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. TAB 5: VERSIONING & HEALTH MONITOR */}
      {activeTab === 'changelog' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                  Riwayat Versi Rilis & Changelog Semantik GitHub
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Pelacakan tag rilis resmi dan fitur baru Modula Enterprise.
                </p>
              </div>
              <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono text-xs px-3 py-1 rounded-full font-bold">
                Versi Aktif: v3.1.0-enterprise
              </span>
            </div>

            <div className="space-y-3 pt-2">
              {RELEASES_CHANGELOG.map((rel) => (
                <div
                  key={rel.version}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-sm text-purple-600 dark:text-purple-400">
                        {rel.version}
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">— {rel.title}</span>
                    </div>
                    <span className="text-slate-400 font-mono text-[10px]">{rel.date}</span>
                  </div>

                  <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1 text-[11px]">
                    {rel.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 9. MODAL REQUEST AUDIT TICKET */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xl">🛡️</span>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Request Izin Tiket Audit Brand
                </h3>
              </div>
              <button onClick={() => setIsRequestModalOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateAuditTicket} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Pilih Brand Rekanan Tujuan:
                </label>
                <select
                  value={targetBrandIdForAudit}
                  onChange={(e) => setTargetBrandIdForAudit(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2"
                >
                  {brands.map((b: Brand) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.industryType.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Alasan Inspeksi / Tiket Dukungan Teknis:
                </label>
                <textarea
                  rows={3}
                  required
                  value={requestReason}
                  onChange={(e) => setRequestReason(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  className="px-4 py-2 text-slate-500 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-5 py-2 rounded-xl shadow-md"
                >
                  Terbitkan Izin Tiket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
