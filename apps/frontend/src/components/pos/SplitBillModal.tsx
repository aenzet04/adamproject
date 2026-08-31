'use client';

import React, { useState } from 'react';
import type { CartItem } from '../../types';

interface SplitBillModalProps {
  items: CartItem[];
  grandTotal: number;
  subtotal: number;
  tax: number;
  discount: number;
  rounding: number;
  onClose: () => void;
  onCompleteSplit: (splitResults: any[]) => void;
}

interface SplitCustomer {
  id: string;
  name: string;
  nominal: number;
  isPaid: boolean;
  paymentMethod?: string;
  assignedItems: Array<{ productId: string; quantity: number; subtotal: number }>;
}

export const SplitBillModal: React.FC<SplitBillModalProps> = ({
  items,
  grandTotal,
  subtotal,
  tax,
  discount,
  rounding,
  onClose,
  onCompleteSplit,
}) => {
  const [splitMode, setSplitMode] = useState<'equal' | 'nominal' | 'items'>('equal');
  const [numPeople, setNumPeople] = useState<number>(2);

  // For Equal / Nominal split state
  const [customers, setCustomers] = useState<SplitCustomer[]>([
    { id: 'p-1', name: 'Konsumen 1', nominal: Math.round(grandTotal / 2), isPaid: false, assignedItems: [] },
    { id: 'p-2', name: 'Konsumen 2', nominal: grandTotal - Math.round(grandTotal / 2), isPaid: false, assignedItems: [] },
  ]);

  // For Itemized Split state: Map of ItemIndex -> Assigned Person ID
  const [itemAssignments, setItemAssignments] = useState<Record<string, string>>({});

  // Active person paying
  const [payingCustomerId, setPayingCustomerId] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>('qris');

  // Handle Equal Split adjustment
  const handleSetPeopleCount = (count: number) => {
    const validCount = Math.max(2, Math.min(10, count));
    setNumPeople(validCount);
    const equalShare = Math.floor(grandTotal / validCount);
    const remainder = grandTotal - equalShare * validCount;

    const newCustomers: SplitCustomer[] = Array.from({ length: validCount }).map((_, i) => ({
      id: `p-${i + 1}`,
      name: `Konsumen ${i + 1}`,
      nominal: i === 0 ? equalShare + remainder : equalShare,
      isPaid: false,
      assignedItems: [],
    }));
    setCustomers(newCustomers);
  };

  // Handle Nominal Update
  const handleUpdateNominal = (id: string, amount: number) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, nominal: amount } : c))
    );
  };

  // Add new customer in nominal mode
  const handleAddCustomer = () => {
    const nextIdx = customers.length + 1;
    setCustomers((prev) => [
      ...prev,
      { id: `p-${nextIdx}`, name: `Konsumen ${nextIdx}`, nominal: 0, isPaid: false, assignedItems: [] },
    ]);
  };

  // Mark a person as paid
  const handlePayCustomer = (id: string) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isPaid: true, paymentMethod: selectedMethod } : c))
    );
    setPayingCustomerId(null);
  };

  const totalAllocated =
    splitMode === 'items'
      ? items.reduce((acc, it) => (itemAssignments[it.productId] ? acc + it.subtotal : acc), 0)
      : customers.reduce((acc, c) => acc + (c.nominal || 0), 0);

  const totalPaid = customers.filter((c) => c.isPaid).reduce((acc, c) => acc + c.nominal, 0);
  const isFullyAllocated = splitMode === 'items' ? Object.keys(itemAssignments).length === items.length : totalAllocated === grandTotal;
  const isAllPaid = customers.every((c) => c.isPaid);

  const handleFinish = () => {
    onCompleteSplit(customers);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh] transition-colors">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center space-x-2">
            <span className="text-xl">✂️</span>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Split Bill (Pisah Pembayaran Konsumen)
              </h3>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                Total Tagihan POS: <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">Rp {grandTotal.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold px-2 py-1"
          >
            ✕
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="p-3 bg-slate-100 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 flex space-x-2">
          <button
            onClick={() => {
              setSplitMode('equal');
              handleSetPeopleCount(numPeople);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              splitMode === 'equal'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            1. Dibagi Rata (N Orang)
          </button>
          <button
            onClick={() => setSplitMode('nominal')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              splitMode === 'nominal'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            2. Split per Nominal Custom
          </button>
          <button
            onClick={() => setSplitMode('items')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              splitMode === 'items'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            3. Split per Item Menu
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* MODE 1: EQUAL SPLIT */}
          {splitMode === 'equal' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-700 dark:text-slate-300">Jumlah Konsumen (Orang):</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleSetPeopleCount(numPeople - 1)}
                    disabled={numPeople <= 2}
                    className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 disabled:opacity-40 font-black text-sm"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-bold text-base font-mono text-emerald-600 dark:text-emerald-400">
                    {numPeople}
                  </span>
                  <button
                    onClick={() => handleSetPeopleCount(numPeople + 1)}
                    disabled={numPeople >= 10}
                    className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 disabled:opacity-40 font-black text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Customers List */}
              <div className="space-y-2">
                {customers.map((c, idx) => (
                  <div
                    key={c.id}
                    className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                      c.isPaid
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/60'
                        : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-200">{c.name}</div>
                        <div className="text-[10px] text-slate-500">
                          Porsi: {((1 / numPeople) * 100).toFixed(0)}% dari total tagihan
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-black font-mono text-slate-900 dark:text-slate-100">
                        Rp {c.nominal.toLocaleString('id-ID')}
                      </span>

                      {c.isPaid ? (
                        <span className="bg-emerald-600 text-white font-bold text-[10px] px-2.5 py-1 rounded-xl flex items-center space-x-1">
                          <span>✓ Lunas</span>
                          <span className="uppercase text-[9px] font-mono">({c.paymentMethod})</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => setPayingCustomerId(c.id)}
                          className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-sm transition-all"
                        >
                          Bayar Porsi Ini
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MODE 2: NOMINAL SPLIT */}
          {splitMode === 'nominal' && (
            <div className="space-y-4">
              <div className="space-y-2">
                {customers.map((c, idx) => (
                  <div
                    key={c.id}
                    className="p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 font-bold flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{c.name}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-slate-400 font-mono">Rp</span>
                      <input
                        type="number"
                        value={c.nominal || ''}
                        disabled={c.isPaid}
                        onChange={(e) => handleUpdateNominal(c.id, parseFloat(e.target.value) || 0)}
                        className="w-32 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1 text-right font-mono font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />

                      {c.isPaid ? (
                        <span className="bg-emerald-600 text-white font-bold text-[10px] px-2.5 py-1 rounded-xl">
                          ✓ Lunas
                        </span>
                      ) : (
                        <button
                          onClick={() => setPayingCustomerId(c.id)}
                          disabled={c.nominal <= 0}
                          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-sm"
                        >
                          Bayar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={handleAddCustomer}
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  + Tambah Konsumen Lain
                </button>
                <div className="text-right text-xs">
                  <span className="text-slate-500">Total Terbagi: </span>
                  <span
                    className={`font-mono font-bold ${
                      totalAllocated === grandTotal ? 'text-emerald-600' : 'text-rose-500'
                    }`}
                  >
                    Rp {totalAllocated.toLocaleString('id-ID')} / Rp {grandTotal.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* MODE 3: ITEM SPLIT */}
          {splitMode === 'items' && (
            <div className="space-y-4">
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Pilih konsumen yang bertanggung jawab untuk setiap item menu yang dipesan:
              </p>
              <div className="space-y-2">
                {items.map((it) => (
                  <div
                    key={it.productId}
                    className="p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">{it.productName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {it.quantity} x Rp {it.unitPrice.toLocaleString('id-ID')} = Rp {it.subtotal.toLocaleString('id-ID')}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <select
                        value={itemAssignments[it.productId] || ''}
                        onChange={(e) =>
                          setItemAssignments((prev) => ({ ...prev, [it.productId]: e.target.value }))
                        }
                        className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs rounded-xl px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none"
                      >
                        <option value="">-- Pilih Konsumen --</option>
                        {customers.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PAYMENT DRAWER POPUP FOR INDIVIDUAL PERSON */}
          {payingCustomerId && (
            <div className="bg-slate-100 dark:bg-slate-950 border-2 border-emerald-500/50 rounded-2xl p-4 space-y-3 animate-in fade-in">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Pembayaran: {customers.find((c) => c.id === payingCustomerId)?.name}
                </span>
                <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
                  Rp {customers.find((c) => c.id === payingCustomerId)?.nominal.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {(['qris', 'cash', 'edc_bca', 'transfer_bank'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setSelectedMethod(m)}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-bold uppercase transition-all ${
                      selectedMethod === m
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {m.replace('_', ' ')}
                  </button>
                ))}
              </div>

              <div className="flex justify-end space-x-2 pt-1">
                <button
                  onClick={() => setPayingCustomerId(null)}
                  className="px-3 py-1 text-xs text-slate-500 font-semibold hover:text-slate-700"
                >
                  Batal
                </button>
                <button
                  onClick={() => handlePayCustomer(payingCustomerId)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-1.5 rounded-xl text-xs shadow-md"
                >
                  Konfirmasi Pembayaran ({selectedMethod.toUpperCase()})
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <div className="text-xs">
            <span className="text-slate-500">Status Pembayaran: </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              Rp {totalPaid.toLocaleString('id-ID')} / Rp {grandTotal.toLocaleString('id-ID')}
            </span>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400"
            >
              Kembali
            </button>
            <button
              onClick={handleFinish}
              disabled={!isAllPaid}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold px-6 py-2 rounded-2xl text-xs shadow-lg shadow-emerald-600/20 transition-all"
            >
              {isAllPaid ? 'Selesaikan Semua Split Bill (Lunas)' : 'Belum Semua Konsumen Lunas'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
