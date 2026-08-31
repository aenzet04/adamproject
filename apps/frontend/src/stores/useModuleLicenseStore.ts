import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ModuleLicense } from '../types';

const DEFAULT_MODULES: ModuleLicense[] = [
  {
    id: 'mod-pos',
    name: 'Point of Sale (POS) Enterprise',
    code: 'pos',
    icon: '🛒',
    description: 'Kasir kilat, split bill, bluetooth thermal 58mm, dan optical barcode scanner.',
    pricePerMonth: 199000,
    isUnlocked: true,
  },
  {
    id: 'mod-finance',
    name: 'Financial Core & General Ledger (PSAK)',
    code: 'finance',
    icon: '📊',
    description: 'Auto double-entry posting, laporan laba rugi, neraca, dan buku besar real-time.',
    pricePerMonth: 349000,
    isUnlocked: true,
  },
  {
    id: 'mod-inventory',
    name: 'Multi-Warehouse & Dead Stock SCM',
    code: 'inventory',
    icon: '📦',
    description: 'Analisis stok mati N hari, moving average valuation, dan transfer antar cabang.',
    pricePerMonth: 249000,
    isUnlocked: true,
  },
  {
    id: 'mod-hr',
    name: 'HR, Geofence Attendance & Payroll',
    code: 'hr',
    icon: '👥',
    description: 'Presensi radius geofence GPS, lembur Depnaker, dan auto slip gaji PPh 21 TER.',
    pricePerMonth: 299000,
    isUnlocked: false, // Locked for demoing Accurate/Jurnal pay-per-module model
  },
  {
    id: 'mod-audit',
    name: 'Immutable Audit Trail & Anti-Fraud',
    code: 'audit',
    icon: '🛡️',
    description: 'Deteksi kecurangan spike void transaksi kasir dan log audit tak terhapus.',
    pricePerMonth: 199000,
    isUnlocked: false, // Locked
  },
  {
    id: 'mod-ai',
    name: 'AI Executive Strategic Advisor',
    code: 'ai_insights',
    icon: '🧠',
    description: 'Analisis cerdas produk bintang (Stars vs Deadstock) & prediksi restock.',
    pricePerMonth: 399000,
    isUnlocked: true,
  },
];

interface ModuleLicenseState {
  modules: ModuleLicense[];
  toggleModuleLock: (code: ModuleLicense['code']) => void;
  unlockAll: () => void;
  lockAllNonCore: () => void;
}

export const useModuleLicenseStore = create<ModuleLicenseState>()(
  persist(
    (set, get) => ({
      modules: DEFAULT_MODULES,
      toggleModuleLock: (code) => {
        set({
          modules: get().modules.map((m) =>
            m.code === code ? { ...m, isUnlocked: !m.isUnlocked } : m
          ),
        });
      },
      unlockAll: () => {
        set({
          modules: get().modules.map((m) => ({ ...m, isUnlocked: true })),
        });
      },
      lockAllNonCore: () => {
        set({
          modules: get().modules.map((m) =>
            m.code === 'pos' || m.code === 'finance'
              ? { ...m, isUnlocked: true }
              : { ...m, isUnlocked: false }
          ),
        });
      },
    }),
    {
      name: 'adam_module_licenses',
    }
  )
);
