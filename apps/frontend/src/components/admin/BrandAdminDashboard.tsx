'use client';

import React, { useState } from 'react';
import { useTenantStore } from '../../stores/useTenantStore';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  branchName: string;
  shift: string;
  status: 'active' | 'on_break' | 'off';
  avatar: string;
}

const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'st-01',
    name: 'Siti Rahma',
    role: 'Senior Barista & Kasir',
    branchName: 'Outlet Grand Indonesia',
    shift: 'Shift Pagi (07:00 - 15:00)',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'st-02',
    name: 'Budi Santoso',
    role: 'Barista Espresso Specialist',
    branchName: 'Outlet Grand Indonesia',
    shift: 'Shift Pagi (07:00 - 15:00)',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'st-03',
    name: 'Dimas Pratama',
    role: 'Kitchen Pastry Cook',
    branchName: 'Outlet Grand Indonesia',
    shift: 'Shift Siang (14:00 - 22:00)',
    status: 'on_break',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'st-04',
    name: 'Nadia Safitri',
    role: 'Junior Cashier',
    branchName: 'Outlet Senopati',
    shift: 'Shift Siang (14:00 - 22:00)',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  },
];

export const BrandAdminDashboard: React.FC = () => {
  const { currentBrand, currentBranch } = useTenantStore();
  const [staffList, setStaffList] = useState<StaffMember[]>(INITIAL_STAFF);

  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🏢</span>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Brand & Branch Admin Management
            </h2>
            <span className="bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-800 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold">
              {currentBrand?.name || 'Kopi Nusantara Roastery'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Pengelolaan staf barista/kasir, pembagian jadwal shift outlet, presensi geofence, dan audit kas harian.
          </p>
        </div>

        <button
          onClick={() => alert('Fitur tambah staf barista baru')}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-2xl text-xs shadow-md shadow-emerald-600/20"
        >
          + Tambah Staf Baru
        </button>
      </div>

      {/* Staff Management Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
          Daftar Karyawan Outlet & Status Shift Aktif
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                <th className="pb-2">Nama Staf</th>
                <th className="pb-2">Peran / Jabatan</th>
                <th className="pb-2">Penempatan Outlet</th>
                <th className="pb-2">Jadwal Shift</th>
                <th className="pb-2">Status Presensi</th>
                <th className="pb-2 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {staffList.map((staf) => (
                <tr key={staf.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 flex items-center space-x-2.5">
                    <img
                      src={staf.avatar}
                      alt={staf.name}
                      className="w-8 h-8 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <span className="font-bold text-slate-800 dark:text-slate-100">{staf.name}</span>
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-300">{staf.role}</td>
                  <td className="py-3 text-slate-500">{staf.branchName}</td>
                  <td className="py-3 font-mono text-[11px] text-slate-600 dark:text-slate-300">{staf.shift}</td>
                  <td className="py-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        staf.status === 'active'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                      }`}
                    >
                      {staf.status === 'active' ? '● Aktif Bekerja' : '⏸ Istirahat'}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => alert(`Atur shift untuk ${staf.name}`)}
                      className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                    >
                      Atur Shift
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
