'use client';

import React, { useState } from 'react';
import { useStaffStore, BrandStaffRole, BrandEmployee } from '../../stores/useStaffStore';
import { useTenantStore } from '../../stores/useTenantStore';
import { useCustomerStore } from '../../stores/useCustomerStore';
import { AuditLogViewerModal } from '../audit/AuditLogViewerModal';
import { toast } from '../../stores/useToastStore';
import type { Branch } from '../../types';

export const BrandAdminDashboard: React.FC = () => {
  const { currentBrand, availableBranches } = useTenantStore();
  const { employees, addEmployee, transferStaffBranch, removeEmployee } = useStaffStore();
  const { customers } = useCustomerStore();

  const [activeTab, setActiveTab] = useState<'employees' | 'transfer_logs' | 'customers'>('employees');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [branchFilter, setBranchFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  // Transfer Modal State
  const [transferringStaff, setTransferringStaff] = useState<BrandEmployee | null>(null);
  const [targetBranchId, setTargetBranchId] = useState('');
  const [transferReason, setTransferReason] = useState('');

  // Add Employee Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState<BrandStaffRole>('cashier');
  const [newRoleTitle, setNewRoleTitle] = useState('Kasir POS');
  const [newBranchId, setNewBranchId] = useState('br-01');
  const [newShift, setNewShift] = useState('Shift Pagi (07:00 - 15:00)');

  const branchOptions: Array<{ id: string; name: string }> =
    availableBranches && availableBranches.length > 0
      ? availableBranches.map((b: Branch) => ({ id: b.id, name: b.name }))
      : [
          { id: 'br-01', name: 'Outlet Grand Indonesia' },
          { id: 'br-02', name: 'Outlet Senopati' },
          { id: 'br-03', name: 'Store Kelapa Gading' },
        ];

  const filteredEmployees = employees.filter((emp) => {
    const matchesRole = roleFilter === 'all' || emp.role === roleFilter;
    const matchesBranch = branchFilter === 'all' || emp.branchId === branchFilter;
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.roleTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesBranch && matchesSearch;
  });

  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferringStaff || !targetBranchId) return;

    const targetBranch = branchOptions.find((b: { id: string; name: string }) => b.id === targetBranchId);
    const targetBranchName = targetBranch ? targetBranch.name : 'Cabang Tujuan';

    transferStaffBranch(
      transferringStaff.id,
      targetBranchId,
      targetBranchName,
      transferReason || 'Penugasan rotasi operasional cabang',
      'Parikesit (Brand Owner / GM)'
      transferReason || 'Penugasan rotasi kerja berkala',
      'Owner / GM Approved'
    );

    toast.success(
      'Mutasi Cabang Berhasil',
      `${transferringStaff.name} resmi dipindahkan ke ${targetBranchName}. Otomatis aktif di sistem POS & presensi cabang baru!`
      'Mutasi Berhasil Dieksekusi',
      `${transferringStaff.name} resmi dipindahkan ke ${targetBranchName}`
    );

    setTransferringStaff(null);
    setTargetBranchId('');
    setTransferReason('');
  };

  const handleAddEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const branch = branchOptions.find((b: { id: string; name: string }) => b.id === newBranchId);

    addEmployee({
      brandId: currentBrand?.id || 'b-01',
      brandName: currentBrand?.name || 'Kopi Nusantara Roastery',
      name: newName,
      email: newEmail,
      phone: newPhone,
      role: newRole,
      roleTitle: newRoleTitle,
      branchId: newBranchId,
      branchName: branch ? branch.name : 'Outlet Grand Indonesia',
      shift: newShift,
      status: 'active',
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80`,
      joinedDate: new Date().toISOString().split('T')[0],
    });

    toast.success('Karyawan Ditambahkan', `${newName} terdaftar sebagai ${newRoleTitle}`);
    setIsAddModalOpen(false);
    setNewName('');
    setNewEmail('');
    setNewPhone('');
  };

  const allTransferLogs = employees.flatMap((emp) =>
    emp.transferHistory.map((t) => ({ ...t, employeeName: emp.name, roleTitle: emp.roleTitle }))
  );

  return (
    <div className="p-4 md:p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors space-y-6">
      {/* 1. HEADER & ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🏢</span>
            <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100">
              Brand & Staff Management Command Center
            </h2>
            <span className="bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold">
            <span className="bg-red-100 dark:bg-red-950 text-red-700 dark:bg-red-400 border border-red-300 dark:border-red-800 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold">
              {currentBrand?.name || 'Kopi Nusantara Roastery'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manajemen hierarki karyawan 1 brand (Owner, General Manager, Manajer Cabang, Admin Sistem, Kasir, Staf), mutasi dinas antar cabang, dan CRM pelanggan.
          </p>
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setIsAuditModalOpen(true)}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-3.5 py-2.5 rounded-2xl text-xs shadow-sm flex items-center space-x-1.5"
          >
            <span>🛡️</span>
            <span>Log Audit Keamanan</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2.5 rounded-2xl text-xs shadow-md shadow-red-600/20 active:scale-95 flex items-center space-x-1.5"
          >
            <span>+</span>
            <span>Tambah Karyawan Baru</span>
          </button>
        </div>
      </div>

      {isAuditModalOpen && <AuditLogViewerModal onClose={() => setIsAuditModalOpen(false)} />}

      {/* 2. STATS SUMMARY ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">
            Total Karyawan Brand
          </span>
          <div className="text-2xl font-black font-mono text-slate-800 dark:text-slate-100">
            {employees.length} Orang
          </div>
          <div className="text-[10px] text-emerald-600 font-bold">100% Terverifikasi</div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">
            Kasir & Frontliner
          </span>
          <div className="text-2xl font-black font-mono text-red-600 dark:text-red-400">
            {employees.filter((e) => e.role === 'cashier').length} Kasir
          </div>
          <div className="text-[10px] text-slate-400">Aktif POS Terminal</div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">
            Total Mutasi Cabang
          </span>
          <div className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400">
            {allTransferLogs.length} Kali
          </div>
          <div className="text-[10px] text-slate-400">Rotasi Operasional</div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">
            Konsumen CRM Terdaftar
          </span>
          <div className="text-2xl font-black font-mono text-purple-600 dark:text-purple-400">
            {customers.length} Member
          </div>
          <div className="text-[10px] text-slate-400">Konsolidasi Holding</div>
        </div>
      </div>

      {/* 3. TABS NAVIGATION */}
      <div className="flex space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('employees')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
            activeTab === 'employees'
              ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>👥</span>
          <span>Struktur Karyawan & Mutasi Cabang ({employees.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('transfer_logs')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
            activeTab === 'transfer_logs'
              ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>🔄</span>
          <span>Riwayat Mutasi Dinas ({allTransferLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('customers')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
            activeTab === 'customers'
              ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>⭐</span>
          <span>Detail Lengkap CRM Konsumen ({customers.length})</span>
        </button>
      </div>

      {/* 4. TAB CONTENT 1: EMPLOYEES & MUTATION */}
      {activeTab === 'employees' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <input
                type="text"
                placeholder="Cari nama, email, jabatan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-red-500 w-full sm:w-56"
              />

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none font-semibold"
              >
                <option value="all">Semua Peran (Role)</option>
                <option value="owner">👑 Owner Brand</option>
                <option value="general_manager">👔 General Manager</option>
                <option value="branch_manager">🏢 Manajer Cabang</option>
                <option value="admin_system">💻 Admin IT & Sistem</option>
                <option value="cashier">🛒 Kasir POS</option>
                <option value="staff">☕ Staf Barista / Dapur</option>
              </select>

              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none font-semibold"
              >
                <option value="all">Semua Penempatan Cabang</option>
                <option value="br-all">Headquarters (Semua Cabang)</option>
                {branchOptions.map((b: { id: string; name: string }) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                  <th className="pb-3">Karyawan</th>
                  <th className="pb-3">Peran & Hierarki</th>
                  <th className="pb-3">Cabang Saat Ini</th>
                  <th className="pb-3">Jadwal Shift</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Aksi Mutasi Cabang</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 flex items-center space-x-3">
                      <img src={emp.avatar} alt={emp.name} className="w-9 h-9 rounded-full object-cover border border-slate-300 dark:border-slate-700" />
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-100">{emp.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{emp.email} • {emp.phone}</div>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="font-semibold text-slate-700 dark:text-slate-300">{emp.roleTitle}</div>
                      <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {emp.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="font-bold text-red-600 dark:text-red-400 flex items-center space-x-1">
                        <span>📍</span>
                        <span>{emp.branchName}</span>
                      </div>
                      {emp.transferHistory.length > 0 && (
                        <div className="text-[9px] text-slate-400 italic">
                          Dimutasi dari {emp.transferHistory[0].fromBranchName}
                        </div>
                      )}
                    </td>
                    <td className="py-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                      {emp.shift}
                    </td>
                    <td className="py-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          emp.status === 'on_duty'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : emp.status === 'on_break'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {emp.status === 'on_duty' ? '🟢 Sedang Dinas' : emp.status === 'on_break' ? '🟡 Istirahat' : '⚪ Aktif'}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => {
                            setTransferringStaff(emp);
                            setTargetBranchId(emp.branchId === 'br-01' ? 'br-02' : 'br-01');
                          }}
                          className="bg-red-50 dark:bg-red-950/50 hover:bg-red-100 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 px-3 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1 transition-all"
                        >
                          <span>🔄</span>
                          <span>Pindah Cabang</span>
                        </button>
                        {emp.role !== 'owner' && (
                          <button
                            onClick={() => {
                              if (confirm(`Hapus data staf ${emp.name}?`)) {
                                removeEmployee(emp.id);
                                toast.info('Karyawan Dihapus', emp.name);
                              }
                            }}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl"
                            title="Hapus Karyawan"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. TAB CONTENT 2: TRANSFER LOGS */}
      {activeTab === 'transfer_logs' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            Log Riwayat Mutasi & Rotasi Penugasan Dinas Antar Cabang
          </h3>

          {allTransferLogs.length === 0 ? (
            <div className="p-8 text-center text-slate-400">Belum ada riwayat mutasi cabang.</div>
          ) : (
            <div className="space-y-2">
              {allTransferLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-black text-slate-800 dark:text-slate-100">{log.employeeName}</span>
                      <span className="text-[10px] text-slate-400">({log.roleTitle})</span>
                    </div>
                    <div className="flex items-center space-x-2 text-[11px]">
                      <span className="text-slate-500">Dari: <b>{log.fromBranchName}</b></span>
                      <span>➔</span>
                      <span className="text-red-600 dark:text-red-400 font-bold">Ke: {log.toBranchName}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 italic">Alasan: {log.reason}</div>
                  </div>

                  <div className="text-right font-mono text-[10px] text-slate-400">
                    <div>Tanggal: <b>{log.transferDate}</b></div>
                    <div>Otorisasi: {log.approvedBy}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 6. TAB CONTENT 3: CRM KONSUMEN DETAIL LENGKAP */}
      {activeTab === 'customers' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Detail Lengkap CRM Pelanggan & Loyalitas Member Brand
              </h3>
              <p className="text-xs text-slate-400">
                Data konsumen lengkap dengan tier, nomor WhatsApp, riwayat transaksi, dan poin.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {customers.map((c) => (
              <div
                key={c.id}
                className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{c.name}</h4>
                    <div className="text-xs font-mono text-slate-500">📱 {c.phone}</div>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 px-2 py-0.5 rounded-full border border-red-300 dark:border-red-800">
                    {c.tier}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-mono">Poin Member:</span>
                    <span className="font-black text-amber-500 font-mono text-sm">⭐ {c.points} Pts</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-mono">Total Belanja:</span>
                    <span className="font-black text-red-600 dark:text-red-400 font-mono text-xs">
                      Rp {c.lifetimeSpend.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                  <span>📍 {c.branchName}</span>
                  <button
                    onClick={() => {
                      window.open(`https://wa.me/62${c.phone.replace(/^0/, '')}?text=Halo%20${c.name},%20terima%20kasih%20telah%20menjadi%20member%20setia%20${currentBrand?.name}!`, '_blank');
                    }}
                    className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                  >
                    💬 Kirim WA
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL MUTASI KARYAWAN CABANG */}
      {transferringStaff && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xl">🔄</span>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    Mutasi Penugasan Cabang Karyawan
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Pindahkan staf ke cabang lain dalam 1 brand secara instan.
                  </p>
                </div>
              </div>
              <button onClick={() => setTransferringStaff(null)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleExecuteTransfer} className="space-y-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center space-x-3">
                <img src={transferringStaff.avatar} alt={transferringStaff.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <div className="font-bold text-sm text-slate-800 dark:text-slate-100">{transferringStaff.name}</div>
                  <div className="text-slate-500 font-mono text-[10px]">{transferringStaff.roleTitle}</div>
                  <div className="text-red-600 font-bold text-[10px]">Cabang Asal: {transferringStaff.branchName}</div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Pilih Cabang Tujuan:</label>
                <select
                  value={targetBranchId}
                  onChange={(e) => setTargetBranchId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
                  required
                >
                  <option value="">-- Pilih Cabang Tujuan --</option>
                  {branchOptions.map((b: { id: string; name: string }) => (
                    <option key={b.id} value={b.id} disabled={b.id === transferringStaff.branchId}>
                      {b.name} {b.id === transferringStaff.branchId ? '(Cabang Asal)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Alasan Penugasan / Mutasi:</label>
                <input
                  type="text"
                  placeholder="Contoh: Rotasi kasir cabang atau promosi jabatan"
                  value={transferReason}
                  onChange={(e) => setTransferReason(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  required
                />
              </div>

              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-[10px] text-emerald-800 dark:text-emerald-300">
                💡 <b>Efek Otomatis:</b> Setelah disimpan, sistem POS Terminal di cabang tujuan langsung mengenali staf ini untuk login shift dan mencatat penjualan atas namanya.
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setTransferringStaff(null)}
                  className="px-4 py-2 text-slate-500 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-500 text-white font-bold px-5 py-2 rounded-xl shadow-md active:scale-95"
                >
                  Konfirmasi Mutasi Cabang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH KARYAWAN BARU */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Pendaftaran Karyawan Baru Brand
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleAddEmployeeSubmit} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rian Pratama"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email Karyawan</label>
                  <input
                    type="email"
                    required
                    placeholder="rian@outlet.id"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">No. WhatsApp</label>
                  <input
                    type="tel"
                    required
                    placeholder="081234567890"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Peran (Role)</label>
                  <select
                    value={newRole}
                    onChange={(e) => {
                      const r = e.target.value as BrandStaffRole;
                      setNewRole(r);
                      setNewRoleTitle(
                        r === 'owner'
                          ? 'Brand Owner'
                          : r === 'general_manager'
                          ? 'General Manager'
                          : r === 'branch_manager'
                          ? 'Branch Manager'
                          : r === 'admin_system'
                          ? 'Admin IT & Sistem'
                          : r === 'cashier'
                          ? 'Senior Cashier POS'
                          : 'Barista / Kitchen Staf'
                      );
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-2 font-semibold"
                  >
                    <option value="cashier">Kasir POS</option>
                    <option value="staff">Staf Barista/Dapur</option>
                    <option value="branch_manager">Manajer Cabang</option>
                    <option value="admin_system">Admin IT Sistem</option>
                    <option value="general_manager">General Manager</option>
                    <option value="owner">Brand Owner</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Jabatan</label>
                  <input
                    type="text"
                    value={newRoleTitle}
                    onChange={(e) => setNewRoleTitle(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Penempatan Cabang</label>
                  <select
                    value={newBranchId}
                    onChange={(e) => setNewBranchId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-2 font-semibold"
                  >
                    {branchOptions.map((b: { id: string; name: string }) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Shift Kerja</label>
                  <input
                    type="text"
                    value={newShift}
                    onChange={(e) => setNewShift(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-slate-500 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-500 text-white font-bold px-5 py-2 rounded-xl shadow-md"
                >
                  Simpan Karyawan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
