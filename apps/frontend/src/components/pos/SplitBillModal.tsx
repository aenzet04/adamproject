'use client';

import React, { useState } from 'react';
import { useCustomerStore } from '../../stores/useCustomerStore';
import { toast } from '../../stores/useToastStore';
import type { CartItem, SplitBillPerson } from '../../types';

interface SplitBillModalProps {
  items: CartItem[];
  grandTotal: number;
  subtotal: number;
  tax: number;
  discount: number;
  rounding: number;
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
  onClose,
  onCompleteSplit,
}) => {
  const { customers } = useCustomerStore();
  const [splitMode, setSplitMode] = useState<'equal' | 'nominal' | 'by_item'>('equal');
  const [numPeople, setNumPeople] = useState<number>(2);

  // Equal Split State
  const equalAmount = Math.round(grandTotal / numPeople);

  // Nominal Split State
  const [nominalPersons, setNominalPersons] = useState<Array<{ name: string; amount: number; isPaid: boolean }>>([
    { name: customers[0]?.name || 'Konsumen 1 (Bpk. Irwan)', amount: Math.round(grandTotal / 2), isPaid: false },
    { name: customers[1]?.name || 'Konsumen 2 (Ibu Dian)', amount: grandTotal - Math.round(grandTotal / 2), isPaid: false },
  ]);

  // Itemized Split State
  const [itemPersons, setItemPersons] = useState<Array<{ name: string; itemIds: string[]; total: number }>>([
    { name: customers[0]?.name || 'Konsumen 1', itemIds: [], total: 0 },
    { name: customers[1]?.name || 'Konsumen 2', itemIds: [], total: 0 },
  ]);

  const handleComplete = () => {
    let resultPersons: SplitBillPerson[] = [];

    if (splitMode === 'equal') {
      for (let i = 0; i < numPeople; i++) {
        resultPersons.push({
          personIndex: i + 1,
          name: customers[i]?.name || `Tamu Meja #${i + 1}`,
          assignedItems: items,
          subtotal: Math.round(subtotal / numPeople),
          tax: Math.round(tax / numPeople),
          discount: Math.round(discount / numPeople),
          totalAmount: i === numPeople - 1 ? grandTotal - equalAmount * (numPeople - 1) : equalAmount,
          isPaid: true,
        });
      }
    } else if (splitMode === 'nominal') {
      const sum = nominalPersons.reduce((acc, p) => acc + p.amount, 0);
      if (sum !== grandTotal) {
        toast.warning('Nominal Belum Seimbang', `Total pembagian (Rp ${sum.toLocaleString('id-ID')}) harus sama dengan Total Tagihan (Rp ${grandTotal.toLocaleString('id-ID')})`);
        return;
      }
      resultPersons = nominalPersons.map((p, idx) => ({
        personIndex: idx + 1,
        name: p.name,
        assignedItems: items,
        subtotal: p.amount,
        tax: 0,
        discount: 0,
        totalAmount: p.amount,
        isPaid: true,
      }));
    } else {
      resultPersons = itemPersons.map((p, idx) => ({
        personIndex: idx + 1,
        name: p.name,
        assignedItems: items.filter((it) => p.itemIds.includes(it.productId)),
        subtotal: p.total,
        tax: 0,
        discount: 0,
        totalAmount: p.total,
        isPaid: true,
      }));
    }

    toast.success('Split Bill Selesai', `Tagihan berhasil dibagi untuk ${resultPersons.length} orang.`);
    onCompleteSplit(resultPersons);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh] transition-colors">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center space-x-2">
            <span className="text-xl">✂️</span>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Pusat Split Bill (Pisah Pembayaran Kasir)
              </h3>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                Total Tagihan: <span className="font-bold text-red-600 dark:text-red-400 font-mono">Rp {grandTotal.toLocaleString('id-ID')}</span>
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

        {/* 3 Modes Switcher */}
        <div className="p-3 bg-slate-100 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 flex space-x-2">
          <button
            onClick={() => setSplitMode('equal')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
              splitMode === 'equal'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            <span>⚖️</span>
            <span>1. Bagi Rata (N Orang)</span>
          </button>

          <button
            onClick={() => setSplitMode('nominal')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
              splitMode === 'nominal'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            <span>💵</span>
            <span>2. Nominal Custom</span>
          </button>

          <button
            onClick={() => setSplitMode('by_item')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
              splitMode === 'by_item'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            <span>🍽️</span>
            <span>3. Split per Item</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* 1. EQUAL SPLIT */}
          {splitMode === 'equal' && (
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Jumlah Orang Rombongan:</span>
                <div className="flex items-center space-x-3">
                  {[2, 3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      onClick={() => setNumPeople(num)}
                      className={`flex-1 py-2 rounded-xl font-bold font-mono text-xs border transition-all ${
                        numPeople === num
                          ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/20'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {num} Orang
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                {Array.from({ length: numPeople }).map((_, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-between items-center"
                  >
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-2">
                        <span>👤 {customers[idx]?.name || `Tamu ${idx + 1}`}</span>
                        {customers[idx] && (
                          <span className="bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 text-[9px] px-1.5 py-0.2 rounded font-mono">
                            {customers[idx].tier}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">Pembagian Rata (1/{numPeople})</div>
                    </div>
                    <div className="text-sm font-black text-red-600 dark:text-red-400 font-mono">
                      Rp {equalAmount.toLocaleString('id-ID')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. NOMINAL CUSTOM SPLIT */}
          {splitMode === 'nominal' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-700 dark:text-slate-300">Daftar Nominal per Konsumen:</span>
                <button
                  onClick={() =>
                    setNominalPersons([
                      ...nominalPersons,
                      { name: customers[nominalPersons.length]?.name || `Konsumen ${nominalPersons.length + 1}`, amount: 0, isPaid: false },
                    ])
                  }
                  className="text-red-600 dark:text-red-400 font-bold hover:underline"
                >
                  + Tambah Orang
                </button>
              </div>

              {nominalPersons.map((p, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center space-x-2"
                >
                  <input
                    type="text"
                    value={p.name}
                    onChange={(e) => {
                      const copy = [...nominalPersons];
                      copy[idx].name = e.target.value;
                      setNominalPersons(copy);
                    }}
                    placeholder="Nama Konsumen"
                    className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200"
                  />
                  <div className="flex items-center space-x-1">
                    <span className="text-slate-400 text-xs">Rp</span>
                    <input
                      type="number"
                      value={p.amount}
                      onChange={(e) => {
                        const copy = [...nominalPersons];
                        copy[idx].amount = parseFloat(e.target.value) || 0;
                        setNominalPersons(copy);
                      }}
                      className="w-32 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold text-red-600 dark:text-red-400"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 3. BY ITEM SPLIT */}
          {splitMode === 'by_item' && (
            <div className="space-y-3">
              <span className="font-bold text-slate-700 dark:text-slate-300">Pilih Menu untuk Tiap Konsumen:</span>
              {itemPersons.map((p, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <input
                      type="text"
                      value={p.name}
                      onChange={(e) => {
                        const copy = [...itemPersons];
                        copy[idx].name = e.target.value;
                        setItemPersons(copy);
                      }}
                      className="font-bold bg-transparent text-slate-800 dark:text-slate-100 text-xs border-b border-dashed border-slate-400 focus:outline-none"
                    />
                    <span className="font-mono font-bold text-red-600 dark:text-red-400">
                      Subtotal: Rp {p.total.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    {items.map((it) => {
                      const isChecked = p.itemIds.includes(it.productId);
                      return (
                        <button
                          key={it.productId}
                          type="button"
                          onClick={() => {
                            const copy = [...itemPersons];
                            if (isChecked) {
                              copy[idx].itemIds = copy[idx].itemIds.filter((id) => id !== it.productId);
                              copy[idx].total -= it.subtotal;
                            } else {
                              copy[idx].itemIds.push(it.productId);
                              copy[idx].total += it.subtotal;
                            }
                            setItemPersons(copy);
                          }}
                          className={`p-2 rounded-xl text-left border text-[11px] transition-all ${
                            isChecked
                              ? 'bg-red-50 dark:bg-red-950/60 border-red-500 text-red-700 dark:text-red-300'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <div className="font-bold truncate">{it.productName}</div>
                          <div className="text-[10px] font-mono">Rp {it.subtotal.toLocaleString('id-ID')}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          >
            Batal
          </button>
          <button
            onClick={handleComplete}
            className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-2.5 rounded-2xl text-xs shadow-lg shadow-red-600/20 transition-all active:scale-95"
          >
            Selesaikan & Cetak Struk Terpisah
          </button>
        </div>
      </div>
    </div>
  );
};
