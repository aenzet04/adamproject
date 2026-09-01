'use client';

import React, { useState } from 'react';
import { useCustomerStore, CustomerMember } from '../../stores/useCustomerStore';
import { useTenantStore } from '../../stores/useTenantStore';
import { toast } from '../../stores/useToastStore';

export const CustomerManagementView: React.FC = () => {
  const { customers, addCustomer, getTopSpenders, searchCustomers, getBranchReport } = useCustomerStore();
  const { availableBranches } = useTenantStore();

  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewTab, setViewTab] = useState<'members' | 'reports'>('members');

  // New Member Form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [memberBranchId, setMemberBranchId] = useState('br-01');
  const [tier, setTier] = useState<CustomerMember['tier']>('Bronze');
  const [notes, setNotes] = useState('');

  const topSpenders = getTopSpenders(3, selectedBranch);
  const filteredCustomers = searchCustomers(searchQuery, selectedBranch);
  const branchReports = getBranchReport();

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      toast.error('Data Belum Lengkap', 'Nama dan No. WhatsApp wajib diisi.');
      return;
    }

    const branch = availableBranches.find((b) => b.id === memberBranchId) || { name: 'Outlet Grand Indonesia' };

    const created = addCustomer({
      name,
      phone,
      email,
      branchId: memberBranchId,
      branchName: branch.name,
      tier,
      notes,
    });

    toast.success('Member Berhasil Didaftarkan', `${created.name} (${created.tier}) di ${branch.name}`);
    setIsAddModalOpen(false);
    setName('');
    setPhone('');
    setEmail('');
    setNotes('');
  };

  const handleSendWaPoints = (c: CustomerMember) => {
    let clean = c.phone.replace(/\D/g, '');
    if (clean.startsWith('08')) clean = '628' + clean.substring(2);
    else if (clean.startsWith('8')) clean = '628' + clean.substring(1);

    const msg = `Halo Kak ${c.name},\n\nTerima kasih telah menjadi Member Setia kami di *${c.branchName}* (*Tier: ${c.tier}*)!\nSaat ini Anda memiliki *${c.points} Poin Loyalitas* dengan akumulasi belanja Rp ${c.lifetimeSpend.toLocaleString('id-ID')}.\n\nTukarkan poin Anda di kasir untuk potongan harga spesial!\n\n_Modula Smart CRM_`;
    window.open(`https://wa.me/${clean}?text=${encodeURIComponent(msg)}`, '_blank');
    toast.info('Membuka WhatsApp', `Mengirim info poin ke ${c.name}`);
  };

  const handleExportCsv = () => {
    let csv = 'ID,Nama Pelanggan,Cabang,Tier,No WhatsApp,Poin,Total Belanja,Kunjungan,Tanggal Bergabung\n';
    filteredCustomers.forEach((c) => {
      csv += `"${c.id}","${c.name}","${c.branchName}","${c.tier}","${c.phone}",${c.points},${c.lifetimeSpend},${c.visitCount},"${c.joinedDate}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Laporan-CRM-Member-${selectedBranch}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Laporan CSV Diekspor', `File ${link.download} berhasil diunduh.`);
  };

  return (
    <div className="p-4 md:p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">👥</span>
            <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100">
              CRM, Member Loyalitas & Laporan Cabang
            </h2>
            <span className="bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold">
              Multi-Branch CRM
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Pisahkan data konsumen per cabang, pantau top spender, dan ekspor laporan loyalitas member.
          </p>
        </div>

        {/* Branch Filter & Actions */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm focus:outline-none focus:ring-1 focus:ring-red-500"
          >
            <option value="all">🏢 Semua Cabang (Konsolidasi)</option>
            {availableBranches.map((b) => (
              <option key={b.id} value={b.id}>
                📍 {b.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleExportCsv}
            className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold px-3.5 py-2 rounded-2xl text-xs flex items-center space-x-1.5 shadow-sm transition-all"
          >
            <span>📊</span>
            <span>Ekspor CSV</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2 rounded-2xl text-xs flex items-center space-x-1.5 shadow-md shadow-red-600/20 transition-all active:scale-95"
          >
            <span>+</span>
            <span>Daftar Member</span>
          </button>
        </div>
      </div>

      {/* TOP SPENDER PODIUM CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {topSpenders.map((c: any, idx: number) => (
          <div
            key={c.id}
            className={`p-5 rounded-3xl border flex flex-col justify-between shadow-sm relative overflow-hidden transition-all ${
              idx === 0
                ? 'bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-transparent border-amber-500/40'
                : idx === 1
                ? 'bg-gradient-to-br from-slate-400/10 via-slate-500/5 to-transparent border-slate-400/40'
                : 'bg-gradient-to-br from-amber-800/10 via-amber-900/5 to-transparent border-amber-800/40'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</span>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    TOP SPENDER #{idx + 1}
                  </span>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{c.name}</h4>
                  <div className="text-[10px] text-slate-400">{c.branchName}</div>
                </div>
              </div>
              <span className="bg-red-600 text-white text-[9px] font-mono px-2 py-0.5 rounded-full font-bold">
                {c.tier}
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-end">
              <div>
                <div className="text-[10px] text-slate-400">Akumulasi Belanja:</div>
                <div className="text-base font-black font-mono text-red-600 dark:text-red-400">
                  Rp {c.lifetimeSpend.toLocaleString('id-ID')}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-400">Poin:</div>
                <div className="text-xs font-bold text-amber-500 font-mono">{c.points} Pts</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* REKAPITULASI LAPORAN PER CABANG */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
          📊 Rekapitulasi Member & Kontribusi Omzet per Cabang
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {branchReports.map((br: any) => (
            <div
              key={br.branchId}
              className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1"
            >
              <div className="font-bold text-xs text-slate-800 dark:text-slate-100">{br.branchName}</div>
              <div className="flex justify-between text-[11px] pt-1">
                <span className="text-slate-400">Total Member:</span>
                <span className="font-bold font-mono">{br.memberCount} Orang</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Total Belanja Member:</span>
                <span className="font-bold font-mono text-red-600 dark:text-red-400">
                  Rp {br.totalSpend.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Rata-rata / Member:</span>
                <span className="font-bold font-mono text-slate-600 dark:text-slate-300">
                  Rp {br.avgSpend.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CUSTOMER DIRECTORY & SEARCH */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 md:p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap">
            Daftar Member Terdaftar ({filteredCustomers.length})
          </h3>

          <div className="relative w-full md:max-w-xs">
            <input
              type="text"
              placeholder="Cari nama, no. HP, atau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-2xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                <th className="pb-2">Nama Pelanggan</th>
                <th className="pb-2">Cabang Outlet</th>
                <th className="pb-2">Tier Level</th>
                <th className="pb-2">No. WhatsApp</th>
                <th className="pb-2">Poin Loyalitas</th>
                <th className="pb-2">Total Belanja</th>
                <th className="pb-2">Kunjungan</th>
                <th className="pb-2 text-right">Aksi CRM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {filteredCustomers.map((c: any) => (
                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 font-bold text-slate-800 dark:text-slate-100 font-sans">
                    <div>{c.name}</div>
                    {c.notes && <div className="text-[10px] text-slate-400 font-normal italic">{c.notes}</div>}
                  </td>
                  <td className="py-3 text-slate-500 font-sans">{c.branchName}</td>
                  <td className="py-3">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        c.tier === 'VIP'
                          ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                          : c.tier === 'Platinum'
                          ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                          : c.tier === 'Gold'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {c.tier}
                    </span>
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-300">{c.phone}</td>
                  <td className="py-3 font-bold text-amber-600 dark:text-amber-400">{c.points} Pts</td>
                  <td className="py-3 font-bold text-red-600 dark:text-red-400">
                    Rp {c.lifetimeSpend.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 text-slate-500">{c.visitCount}x</td>
                  <td className="py-3 text-right font-sans">
                    <button
                      onClick={() => handleSendWaPoints(c)}
                      className="bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/40 px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all"
                    >
                      💬 Info Poin WA
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD MEMBER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Pendaftaran Member Loyalitas Baru
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap Member</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bpk. Irwan Hidayat"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">No. WhatsApp (081xxxx)</label>
                <input
                  type="tel"
                  required
                  placeholder="081234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Pilih Cabang Terdaftar</label>
                  <select
                    value={memberBranchId}
                    onChange={(e) => setMemberBranchId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 font-semibold"
                  >
                    {availableBranches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Initial Tier</label>
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 font-semibold"
                  >
                    <option value="Bronze">Bronze (Member Baru)</option>
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                    <option value="Platinum">Platinum</option>
                    <option value="VIP">VIP</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Catatan Preferensi</label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Suka kopi gayo, meja favorit no. 4"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
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
                  Daftarkan & Beri 100 Poin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
