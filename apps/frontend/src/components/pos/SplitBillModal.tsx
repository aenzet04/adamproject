'use client';

import React, { useState } from 'react';
import { useCustomerStore, CustomerMember } from '../../stores/useCustomerStore';
import { toast } from '../../stores/useToastStore';
import type { CartItem, SplitBillPerson } from '../../types';

interface SplitBillModalProps {
  items: CartItem[];
  grandTotal: number;
  subtotal: number;
  tax: number;
  discount: number;
  rounding: number;
  initialCustomerName?: string;
  onClose: () => void;
  onCompleteSplit: (splitPersons: SplitBillPerson[]) => void;
}

export const SplitBillModal: React.FC<SplitBillModalProps> = ({
  items,
  grandTotal,
  subtotal,
  tax,
  discount,
  rounding,
  initialCustomerName = 'Pemilik Meja / Pemesan Utama',
  onClose,
  onCompleteSplit,
}) => {
  const { customers, searchCustomers } = useCustomerStore();
  const [splitMode, setSplitMode] = useState<'equal' | 'nominal' | 'by_item'>('equal');

  // 1. DEFAULT ONLY PRIMARY TABLE OWNER (Tidak ada nama lain secara default)
  const [persons, setPersons] = useState<Array<{ id: string; name: string; phone?: string; tier?: string }>>([
    { id: 'p-1', name: initialCustomerName, tier: 'Primary' },
  ]);

  // Nominal Allocations
  const [nominalAmounts, setNominalAmounts] = useState<Record<string, number>>({
    'p-1': grandTotal,
  });

  // Item Allocations: Map of productId -> personId who claimed it
  const [itemAllocations, setItemAllocations] = useState<Record<string, string>>({});

  // CRM Search Modal State
  const [isCrmSearchModalOpen, setIsCrmSearchModalOpen] = useState(false);
  const [crmSearchQuery, setCrmSearchQuery] = useState('');
  const [manualGuestName, setManualGuestName] = useState('');

  // Equal Split calculation
  const validNumPeople = Math.max(1, persons.length);
  const equalAmount = Math.round(grandTotal / validNumPeople);

  // Add person from CRM search
  const handleSelectCrmCustomer = (c: CustomerMember) => {
    if (persons.some((p) => p.name.toLowerCase() === c.name.toLowerCase())) {
      toast.warning('Sudah Terdaftar', `${c.name} sudah ada dalam daftar split bill.`);
      return;
    }
    const newId = `p-${Date.now().toString().slice(-4)}`;
    const updated = [...persons, { id: newId, name: c.name, phone: c.phone, tier: c.tier }];
    setPersons(updated);
    setIsCrmSearchModalOpen(false);
    setCrmSearchQuery('');
    toast.success('Konsumen Ditambahkan', `${c.name} (${c.tier}) masuk ke split bill.`);
  };

  // Add manual guest
  const handleAddManualGuest = () => {
    if (!manualGuestName.trim()) return;
    const newId = `p-${Date.now().toString().slice(-4)}`;
    const updated = [...persons, { id: newId, name: manualGuestName.trim(), tier: 'Guest' }];
    setPersons(updated);
    setManualGuestName('');
    setIsCrmSearchModalOpen(false);
    toast.success('Tamu Ditambahkan', `${manualGuestName} masuk ke split bill.`);
  };

  const handleRemovePerson = (id: string) => {
    if (persons.length <= 1) {
      toast.warning('Minimal 1 Pemesan', 'Pemilik meja utama tidak dapat dihapus.');
      return;
    }
    setPersons(persons.filter((p) => p.id !== id));
    // Clear item allocations for this person
    const updatedAlloc = { ...itemAllocations };
    Object.keys(updatedAlloc).forEach((prodId) => {
      if (updatedAlloc[prodId] === id) {
        delete updatedAlloc[prodId];
      }
    });
    setItemAllocations(updatedAlloc);
  };

  // Toggle item claim for a person
  const handleToggleItemForPerson = (productId: string, personId: string) => {
    const currentOwner = itemAllocations[productId];
    if (currentOwner === personId) {
      // Unclaim
      const copy = { ...itemAllocations };
      delete copy[productId];
      setItemAllocations(copy);
    } else if (!currentOwner) {
      // Claim
      setItemAllocations({ ...itemAllocations, [productId]: personId });
    }
  };

  // Calculate total for a person in by_item mode
  const getPersonItemSubtotal = (personId: string) => {
    return items
      .filter((it) => itemAllocations[it.productId] === personId)
      .reduce((sum, it) => sum + it.subtotal, 0);
  };

  const handleComplete = () => {
    let resultPersons: SplitBillPerson[] = [];

    if (splitMode === 'equal') {
      for (let i = 0; i < validNumPeople; i++) {
        const amt = i === validNumPeople - 1 ? grandTotal - equalAmount * (validNumPeople - 1) : equalAmount;
        resultPersons.push({
          personId: `ps-${i + 1}`,
          personName: persons[i]?.name || `Tamu Meja #${i + 1}`,
          assignedItems: items.map((it) => ({
            productId: it.productId,
            quantity: it.quantity,
            amount: it.subtotal,
          })),
          customAmount: amt,
          isPaid: true,
        });
      }
    } else if (splitMode === 'nominal') {
      const sum = persons.reduce((acc, p) => acc + (nominalAmounts[p.id] || 0), 0);
      if (sum !== grandTotal) {
        toast.warning(
          'Nominal Belum Seimbang',
          `Total pembagian (Rp ${sum.toLocaleString('id-ID')}) harus sama dengan Grand Total (Rp ${grandTotal.toLocaleString('id-ID')})`
        );
        return;
      }
      resultPersons = persons.map((p, idx) => ({
        personId: `ps-nom-${idx + 1}`,
        personName: p.name,
        assignedItems: items.map((it) => ({
          productId: it.productId,
          quantity: it.quantity,
          amount: it.subtotal,
        })),
        customAmount: nominalAmounts[p.id] || 0,
        isPaid: true,
      }));
    } else {
      // By Item
      const unassignedItems = items.filter((it) => !itemAllocations[it.productId]);
      if (unassignedItems.length > 0) {
        toast.warning(
          'Menu Belum Selesai Dibagi',
          `Masih ada ${unassignedItems.length} menu yang belum dialokasikan ke konsumen mana pun.`
        );
        return;
      }

      resultPersons = persons.map((p, idx) => {
        const claimed = items.filter((it) => itemAllocations[it.productId] === p.id);
        const sub = claimed.reduce((s, it) => s + it.subtotal, 0);
        // Proportional tax & service
        const ratio = subtotal > 0 ? sub / subtotal : 1 / persons.length;
        const totalWithTax = Math.round(sub + (tax + rounding - discount) * ratio);

        return {
          personId: `ps-itm-${idx + 1}`,
          personName: p.name,
          assignedItems: claimed.map((it) => ({
            productId: it.productId,
            quantity: it.quantity,
            amount: it.subtotal,
          })),
          customAmount: totalWithTax,
          isPaid: true,
        };
      });
    }

    onCompleteSplit(resultPersons);
    toast.success('Split Bill Berhasil', `Tagihan dibagi untuk ${resultPersons.length} orang.`);
  };

  const filteredCrmSearch = searchCustomers(crmSearchQuery, 'all');

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl">✂️</span>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                Split Bill Pintar Multi-Konsumen & Per-Item
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Total Tagihan Meja: <b className="font-mono text-red-600 dark:text-red-400">Rp {grandTotal.toLocaleString('id-ID')}</b>
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold">
            ✕
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="p-4 grid grid-cols-3 gap-2 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <button
            type="button"
            onClick={() => setSplitMode('equal')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              splitMode === 'equal'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            ⚖️ Bagi Rata ({persons.length} Orang)
          </button>

          <button
            type="button"
            onClick={() => setSplitMode('by_item')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              splitMode === 'by_item'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            🍱 Bagi Per-Item Menu
          </button>

          <button
            type="button"
            onClick={() => setSplitMode('nominal')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              splitMode === 'nominal'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            💰 Nominal Manual
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
          {/* Header Customer List & Add Customer Trigger */}
          <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-100 block">
                Daftar Tamu Meja ({persons.length} Orang)
              </span>
              <span className="text-[10px] text-slate-400">
                Default hanya nama pemesan utama. Tambahkan teman semeja via tombol CRM.
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsCrmSearchModalOpen(true)}
              className="bg-red-600 hover:bg-red-500 text-white font-bold px-3 py-1.5 rounded-xl shadow-md text-xs flex items-center space-x-1.5 active:scale-95"
            >
              <span>+</span>
              <span>Cari / Tambah Konsumen CRM</span>
            </button>
          </div>

          {/* 1. EQUAL SPLIT VIEW */}
          {splitMode === 'equal' && (
            <div className="space-y-3">
              <div className="space-y-2">
                {persons.map((p, idx) => (
                  <div
                    key={p.id}
                    className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-between items-center"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-lg bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 font-mono font-bold flex items-center justify-center text-[10px]">
                        #{idx + 1}
                      </span>
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-100">{p.name}</div>
                        {p.tier && <span className="text-[9px] text-slate-400 font-mono">Tier: {p.tier}</span>}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="font-mono font-bold text-red-600 dark:text-red-400 text-sm">
                        Rp {equalAmount.toLocaleString('id-ID')}
                      </span>
                      {persons.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePerson(p.id)}
                          className="text-rose-500 hover:text-rose-700 font-bold"
                          title="Hapus Konsumen"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. BY ITEM SPLIT VIEW (WITH STRICT LOCK / DISABLED WHEN CLAIMED) */}
          {splitMode === 'by_item' && (
            <div className="space-y-4">
              <div className="p-3 bg-red-950/20 border border-red-800/40 rounded-2xl text-[11px] text-slate-300">
                💡 <b>Aturan Kunci Menu:</b> Jika suatu item menu sudah dipilih untuk <b>Konsumen A</b>, maka di baris konsumen lain menu tersebut otomatis <b>TERKUNCI / DISABLED</b> untuk mencegah alokasi ganda.
              </div>

              {persons.map((p, idx) => {
                const pSubtotal = getPersonItemSubtotal(p.id);

                return (
                  <div
                    key={p.id}
                    className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5"
                  >
                    <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-2">
                      <div className="flex items-center space-x-2">
                        <span className="bg-red-600/20 text-red-400 font-mono font-bold px-2 py-0.5 rounded text-[10px]">
                          TAMU #{idx + 1}
                        </span>
                        <span className="font-bold text-slate-800 dark:text-slate-100">{p.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-red-600 dark:text-red-400 text-xs">
                          Total Menu: Rp {pSubtotal.toLocaleString('id-ID')}
                        </span>
                        {persons.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemovePerson(p.id)}
                            className="text-rose-500 font-bold text-xs"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Item Grid for this person */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                      {items.map((it) => {
                        const claimedBy = itemAllocations[it.productId];
                        const isClaimedByMe = claimedBy === p.id;
                        const isClaimedByOther = claimedBy && claimedBy !== p.id;
                        const otherPersonName = persons.find((x) => x.id === claimedBy)?.name || 'Orang Lain';

                        return (
                          <button
                            key={it.productId}
                            type="button"
                            disabled={Boolean(isClaimedByOther)}
                            onClick={() => handleToggleItemForPerson(it.productId, p.id)}
                            className={`p-2.5 rounded-xl text-left border text-xs transition-all relative ${
                              isClaimedByMe
                                ? 'bg-red-600 text-white border-red-500 shadow-md font-bold'
                                : isClaimedByOther
                                ? 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800/80 text-slate-400 dark:text-slate-600 opacity-50 cursor-not-allowed line-through'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-red-400'
                            }`}
                          >
                            <div className="truncate font-semibold">{it.productName}</div>
                            <div className="text-[10px] font-mono mt-0.5">
                              {it.quantity}x • Rp {it.subtotal.toLocaleString('id-ID')}
                            </div>

                            {isClaimedByOther && (
                              <span className="text-[9px] bg-slate-200 dark:bg-slate-800 text-slate-500 font-mono px-1 rounded block mt-1 not-italic no-underline">
                                Milik {otherPersonName.split(' ')[0]}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 3. NOMINAL SPLIT VIEW */}
          {splitMode === 'nominal' && (
            <div className="space-y-3">
              {persons.map((p, idx) => (
                <div
                  key={p.id}
                  className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-between items-center"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400 font-mono font-bold text-[10px]">#{idx + 1}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100">{p.name}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400 font-mono">Rp</span>
                    <input
                      type="number"
                      min={0}
                      value={nominalAmounts[p.id] || 0}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setNominalAmounts({ ...nominalAmounts, [p.id]: val });
                      }}
                      className="w-32 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-1 text-right font-mono font-bold text-red-600 dark:text-red-400"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleComplete}
            className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-2.5 rounded-2xl text-xs shadow-lg shadow-red-600/20 transition-all active:scale-95"
          >
            Selesaikan & Cetak Struk Terpisah ({persons.length} Orang)
          </button>
        </div>
      </div>

      {/* CRM MEMBER SEARCH MODAL */}
      {isCrmSearchModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-5 shadow-2xl space-y-4 text-xs max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                  Cari Konsumen CRM / Tambah Tamu Baru
                </h4>
                <p className="text-[10px] text-slate-400">Pencarian cepat dari database konsumen jutaan member.</p>
              </div>
              <button onClick={() => setIsCrmSearchModalOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            {/* Search Bar */}
            <input
              type="text"
              autoFocus
              placeholder="Ketik nama konsumen atau no WhatsApp..."
              value={crmSearchQuery}
              onChange={(e) => setCrmSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-2xl px-3.5 py-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            {/* Manual Guest Fast Input */}
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Atau ketik nama tamu non-member (misal: Bpk. Dani)..."
                value={manualGuestName}
                onChange={(e) => setManualGuestName(e.target.value)}
                className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddManualGuest}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs"
              >
                + Tambah
              </button>
            </div>

            {/* Search Results List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-60">
              {filteredCrmSearch.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">
                  Tidak ditemukan konsumen dengan kata kunci tersebut.
                </div>
              ) : (
                filteredCrmSearch.map((c: any) => (
                  <div
                    key={c.id}
                    onClick={() => handleSelectCrmCustomer(c)}
                    className="p-3 bg-slate-50 dark:bg-slate-950 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-between items-center cursor-pointer transition-all"
                  >
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-100 text-xs flex items-center space-x-1.5">
                        <span>{c.name}</span>
                        <span className="text-[9px] bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 font-mono px-1.5 rounded font-bold">
                          {c.tier}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        📱 {c.phone} • {c.branchName}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="bg-red-600 text-white font-bold px-3 py-1 rounded-xl text-[11px]"
                    >
                      Pilih ➔
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
