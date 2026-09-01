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
  const { employees, addEmployee, updateEmployee, transferStaffBranch, removeEmployee } = useStaffStore();
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
  const [newPin, setNewPin] = useState('0000');

  // Edit Employee Modal State
  const [editingStaff, setEditingStaff] = useState<BrandEmployee | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRole, setEditRole] = useState<BrandStaffRole>('cashier');
  const [editRoleTitle, setEditRoleTitle] = useState('');
  const [editBranchId, setEditBranchId] = useState('');
  const [editShift, setEditShift] = useState('');
  const [editPin, setEditPin] = useState('');

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
      transferReason || 'Penugasan rotasi kerja berkala',
      'Owner / GM Approved'
    );

    toast.success(
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
      pin: newRole === 'cashier' ? (newPin || '0000') : undefined,
      isDefaultPin: newRole === 'cashier' ? true : undefined,
    });

    toast.success('Karyawan Ditambahkan', `${newName} terdaftar sebagai ${newRoleTitle}`);
    setIsAddModalOpen(false);
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setNewPin('0000');
  };

  const handleStartEditStaff = (emp: BrandEmployee) => {
    setEditingStaff(emp);
    setEditName(emp.name);
    setEditEmail(emp.email);
    setEditPhone(emp.phone);
    setEditRole(emp.role);
    setEditRoleTitle(emp.roleTitle);
    setEditBranchId(emp.branchId);
    setEditShift(emp.shift);
    setEditPin(emp.pin || '0000');
  };

  const handleSaveEditStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;

    const branch = branchOptions.find((b) => b.id === editBranchId);

    updateEmployee(editingStaff.id, {
      name: editName,
      email: editEmail,
      phone: editPhone,
      role: editRole,
      roleTitle: editRoleTitle,
      branchId: editBranchId,
      branchName: branch ? branch.name : editingStaff.branchName,
      shift: editShift,
      pin: editRole === 'cashier' ? editPin : undefined,
    });

    toast.success('Data Karyawan Diperbarui', editName);
    setEditingStaff(null);
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
              {currentBrand?.name || 'Kopi Nusantara Roastery'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manajemen hierarki karyawan 1 brand (Owner, GM, Manajer Cabang, Kasir, Gudang, Admin IT), mutasi dinas antar cabang, edit staf, dan PIN kasir default.
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
          <span className="text-[10px] text-slate-400 font-mono uppercase font-bold">Total Staf Aktif</span>
          <div className="text-2xl font-bold font-mono text-red-600 dark:text-red-400">{employees.length} Orang</div>
          <span className="text-[10px] text-emerald-500 font-semibold">● Terhubung Live</span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-400 font-mono uppercase font-bold">Cabang Terdaftar</span>
          <div className="text-2xl font-bold font-mono text-slate-800 dark:text-slate-100">{branchOptions.length} Outlet</div>
          <span className="text-[10px] text-slate-400">Multi-Branch Sync</span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-400 font-mono uppercase font-bold">Total Mutasi Dinas</span>
          <div className="text-2xl font-bold font-mono text-slate-800 dark:text-slate-100">{allTransferLogs.length} Kali</div>
          <span className="text-[10px] text-blue-500 font-semibold">Tercatat di Sistem</span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-400 font-mono uppercase font-bold">Total CRM Member</span>
          <div className="text-2xl font-bold font-mono text-slate-800 dark:text-slate-100">{customers.length} Orang</div>
          <span className="text-[10px] text-amber-500 font-semibold">Loyalitas Aktif</span>
        </div>
      </div>

      {/* 3. NAVIGATION TABS */}
      <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('employees')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'employees'
              ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          👥 Daftar Staf ({employees.length})
        </button>
        <button
          onClick={() => setActiveTab('transfer_logs')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'transfer_logs'
              ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          🔄 Riwayat Mutasi Cabang ({allTransferLogs.length})
        </button>
        <button
          onClick={() => setActiveTab('customers')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'customers'
              ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          ⭐ Direktori Pelanggan CRM ({customers.length})
        </button>
      </div>

      {/* 4. TAB CONTENT 1: EMPLOYEES DIRECTORY */}
      {activeTab === 'employees' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <input
                type="text"
                placeholder="Cari nama, email, jabatan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 w-full md:w-64"
              />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="all">Semua Role</option>
                <option value="owner">Owner / CEO</option>
                <option value="general_manager">General Manager</option>
                <option value="branch_manager">Manajer Cabang</option>
                <option value="admin_system">Admin IT</option>
                <option value="warehouse_staff">Staf Gudang (SCM)</option>
                <option value="cashier">Kasir POS</option>
                <option value="staff">Staf Barista / Kitchen</option>
              </select>

              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="all">Semua Cabang</option>
                {branchOptions.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono">
                  <th className="pb-3 font-semibold">Nama & Profil</th>
                  <th className="pb-3 font-semibold">Jabatan & Role</th>
                  <th className="pb-3 font-semibold">Penugasan Cabang</th>
                  <th className="pb-3 font-semibold">Shift Kerja</th>
                  <th className="pb-3 font-semibold">PIN Kasir</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center space-x-3">
                        <img src={emp.avatar} alt={emp.name} className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                        <div>
                          <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1">
                            <span>{emp.name}</span>
                            {emp.role === 'owner' && <span>👑</span>}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">{emp.phone} • {emp.email}</div>
                        </div>
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
                    <td className="py-3 font-mono">
                      {emp.role === 'cashier' ? (
                        <div className="flex items-center space-x-1">
                          <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px] font-bold">
                            PIN: {emp.pin || '0000'}
                          </span>
                          {emp.isDefaultPin && (
                            <span className="text-[9px] bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 px-1 rounded font-bold">
                              Default
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
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
                          type="button"
                          onClick={() => handleStartEditStaff(emp)}
                          className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1.5 rounded-xl font-bold text-xs"
                          title="Edit Data Karyawan"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => {
                            setTransferringStaff(emp);
                            setTargetBranchId(emp.branchId === 'br-01' ? 'br-02' : 'br-01');
                          }}
                          className="bg-red-50 dark:bg-red-950/50 hover:bg-red-100 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 px-2.5 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1 transition-all"
                        >
                          <span>🔄</span>
                          <span>Mutasi</span>
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
            <div className="space-y-3">
              {allTransferLogs.map((log) => (
                <div key={log.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-100">{log.employeeName} ({log.roleTitle})</div>
                    <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                      Pindah dari <b>{log.fromBranchName}</b> ➔ <b>{log.toBranchName}</b>
                    </div>
                    <div className="text-[10px] text-slate-400 italic mt-1">Alasan: "{log.reason}"</div>
                  </div>
                  <div className="text-right font-mono text-[10px] text-slate-400">
                    <div>{log.transferDate}</div>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{log.approvedBy}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 6. TAB CONTENT 3: CRM CUSTOMERS */}
      {activeTab === 'customers' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Direktori Konsumen & Loyalitas Brand ({customers.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {customers.map((c) => (
              <div key={c.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-100">{c.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{c.phone}</div>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full font-mono ${
                    c.tier === 'VIP' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' :
                    c.tier === 'Gold' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                    'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    {c.tier}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2 text-[10px]">
                  <div>
                    <span className="text-slate-400">Total Belanja:</span>
                    <div className="font-bold font-mono text-red-600 dark:text-red-400">Rp {c.totalSpend.toLocaleString('id-ID')}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Poin Loyalty:</span>
                    <div className="font-bold font-mono text-emerald-600 dark:text-emerald-400">{c.loyaltyPoints} Poin</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL EDIT DATA KARYAWAN */}
      {editingStaff && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xl">✏️</span>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Edit Data Karyawan: {editingStaff.name}
                </h3>
              </div>
              <button onClick={() => setEditingStaff(null)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveEditStaff} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap:</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email:</label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">No. WhatsApp:</label>
                  <input
                    type="tel"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Role Sistem:</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="owner">Owner / Group CEO</option>
                    <option value="general_manager">General Manager</option>
                    <option value="branch_manager">Manajer Cabang</option>
                    <option value="admin_system">Admin IT</option>
                    <option value="warehouse_staff">Staf Gudang (SCM)</option>
                    <option value="cashier">Kasir POS</option>
                    <option value="staff">Staf Barista / Kitchen</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Judul Jabatan:</label>
                  <input
                    type="text"
                    required
                    value={editRoleTitle}
                    onChange={(e) => setEditRoleTitle(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              {editRole === 'cashier' && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl space-y-1">
                  <label className="block font-bold text-amber-900 dark:text-amber-300">
                    PIN Keamanan Kasir POS:
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={editPin}
                    onChange={(e) => setEditPin(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-amber-400 rounded-xl px-3 py-1.5 font-mono text-center font-bold tracking-widest text-sm"
                  />
                  <span className="text-[10px] text-amber-700 dark:text-amber-400">
                    Kasir dapat mengubah PIN ini secara mandiri di jendela profil.
                  </span>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
                  className="px-4 py-2 text-slate-500 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-500 text-white font-bold px-5 py-2 rounded-xl shadow-md"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
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
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Mutasi Penugasan Cabang: {transferringStaff.name}
                </h3>
              </div>
              <button onClick={() => setTransferringStaff(null)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleExecuteTransfer} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Pilih Cabang Tujuan:</label>
                <select
                  value={targetBranchId}
                  onChange={(e) => setTargetBranchId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2"
                  required
                >
                  <option value="">-- Pilih Cabang Tujuan --</option>
                  {branchOptions.map((b) => (
                    <option key={b.id} value={b.id} disabled={b.id === transferringStaff.branchId}>
                      {b.name} {b.id === transferringStaff.branchId ? '(Cabang Asal)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Alasan Mutasi:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rotasi kasir cabang"
                  value={transferReason}
                  onChange={(e) => setTransferReason(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2"
                />
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
                  className="bg-red-600 hover:bg-red-500 text-white font-bold px-5 py-2 rounded-xl shadow-md"
                >
                  Konfirmasi Mutasi
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
              <div className="flex items-center space-x-2">
                <span className="text-xl">👤</span>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Tambah Karyawan Baru
                </h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleAddEmployeeSubmit} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rina Anggraini"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email:</label>
                  <input
                    type="email"
                    required
                    placeholder="rina@kopinusantara.id"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">No. WhatsApp:</label>
                  <input
                    type="tel"
                    required
                    placeholder="081234567890"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Role Sistem:</label>
                  <select
                    value={newRole}
                    onChange={(e) => {
                      const r = e.target.value as BrandStaffRole;
                      setNewRole(r);
                      if (r === 'cashier') setNewRoleTitle('Kasir POS');
                      else if (r === 'warehouse_staff') setNewRoleTitle('Staf Gudang (SCM)');
                      else if (r === 'branch_manager') setNewRoleTitle('Manajer Cabang');
                      else if (r === 'general_manager') setNewRoleTitle('General Manager');
                      else if (r === 'admin_system') setNewRoleTitle('Admin IT');
                      else setNewRoleTitle('Staf Barista / Kitchen');
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="cashier">Kasir POS</option>
                    <option value="warehouse_staff">Staf Gudang (SCM)</option>
                    <option value="staff">Staf Barista / Kitchen</option>
                    <option value="branch_manager">Manajer Cabang</option>
                    <option value="general_manager">General Manager</option>
                    <option value="admin_system">Admin IT</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Judul Jabatan:</label>
                  <input
                    type="text"
                    required
                    value={newRoleTitle}
                    onChange={(e) => setNewRoleTitle(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              {/* DYNAMIC CASHIER PIN INPUT */}
              {newRole === 'cashier' && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl space-y-1">
                  <label className="block font-bold text-amber-900 dark:text-amber-300">
                    PIN Awal Kasir (Default: 0000):
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-amber-400 rounded-xl px-3 py-1.5 font-mono text-center font-bold tracking-widest text-sm"
                  />
                  <p className="text-[10px] text-amber-700 dark:text-amber-400">
                    💡 Saat pertama kali login, kasir diwajibkan mengubah PIN 0000 demi keamanan transaksi POS.
                  </p>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Penugasan Cabang:</label>
                <select
                  value={newBranchId}
                  onChange={(e) => setNewBranchId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs"
                >
                  {branchOptions.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
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
                  className="bg-red-600 hover:bg-red-500 text-white font-bold px-5 py-2 rounded-xl shadow-md active:scale-95"
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
