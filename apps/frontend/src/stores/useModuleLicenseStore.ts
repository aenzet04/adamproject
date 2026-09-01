import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ModuleLicense } from '../types';

export type SubscriptionTier = 'starter' | 'business' | 'enterprise';

interface ModuleLicenseState {
  subscriptionTier: SubscriptionTier;
  remainingMonths: number;
  expiryDate: string;
  customReceiptFooter: string;
  modules: ModuleLicense[];
  isModuleUnlocked: (moduleCode: string) => boolean;
  setSubscriptionTier: (tier: SubscriptionTier) => void;
  setCustomReceiptFooter: (footer: string) => void;
  toggleModuleLock: (moduleCode: string) => void;
  unlockModule: (moduleCode: string) => void;
  lockModule: (moduleCode: string) => void;
  resetToDefault: () => void;
}

const DEFAULT_MODULES: ModuleLicense[] = [
  {
    id: 'mod-01',
    code: 'pos',
    name: 'POS & Kasir Omnichannel',
    description: 'Kasir kilat, split bill 3-mode, tiket dapur 58mm, dan Bluetooth thermal printer.',
    category: 'core',
    isUnlocked: true,
    priceMonthly: 149000,
    featuresIncluded: ['Kasir POS', 'Tiket Dapur', 'WhatsApp E-Struk', 'Split Bill'],
  },
  {
    id: 'mod-02',
    code: 'crm',
    name: 'CRM, Loyalitas & Top Spender',
    description: 'Manajemen database member, poin reward, tier pelanggan, & rekap belanja.',
    category: 'core',
    isUnlocked: true,
    priceMonthly: 199000,
    featuresIncluded: ['Database Member', 'Tiering Otomatis', 'Poin Reward', 'Top Spender CRM'],
  },
  {
    id: 'mod-03',
    code: 'finance',
    name: 'Akuntansi & General Ledger (PSAK)',
    description: 'Auto-posting Debit/Kredit POS ke Buku Besar, Laba Rugi, & Neraca real-time.',
    category: 'finance',
    isUnlocked: true,
    priceMonthly: 299000,
    featuresIncluded: ['Chart of Accounts', 'General Ledger', 'Laba Rugi', 'Neraca'],
  },
  {
    id: 'mod-04',
    code: 'inventory',
    name: 'Manajemen Gudang & Dead Stock SCM',
    description: 'Moving average costing, transfer antar outlet, multi-warehouse, dan AI deadstock alerts.',
    category: 'inventory',
    isUnlocked: true,
    priceMonthly: 249000,
    featuresIncluded: ['Multi-Warehouse', 'Stock Opname', 'Dead Stock Advisor', 'Purchase Order'],
  },
  {
    id: 'mod-05',
    code: 'chat',
    name: 'Realtime Team Chat & DM',
    description: 'Chat grup brand & cabang, direct personal message, polling live, dan emoji suite.',
    category: 'core',
    isUnlocked: true,
    priceMonthly: 49000,
    featuresIncluded: ['Brand Chat', 'Branch Chat', 'Personal DM', 'Polling & Lampiran Foto'],
  },
  {
    id: 'mod-06',
    code: 'hr',
    name: 'Payroll, KPI & Mutasi Karyawan',
    description: 'Manajemen hierarki karyawan, slip gaji, mutasi penugasan antar outlet, & shift check-in.',
    category: 'enterprise',
    isUnlocked: true,
    priceMonthly: 179000,
    featuresIncluded: ['Mutasi Cabang', 'Shift Planner', 'Gaji & Insentif', 'Log Disiplin'],
  },
  {
    id: 'mod-07',
    code: 'analytics',
    name: 'Executive AI Advisor & Forecaster',
    description: 'Prediksi omzet, analisa margin COGS, deteksi kebocoran kas, & rekomendasi restock.',
    category: 'enterprise',
    isUnlocked: true,
    priceMonthly: 349000,
    featuresIncluded: ['AI Restock Prediction', 'Loss Detection', 'Margin Analysis', 'Weekly Forecast'],
  },
];

export const useModuleLicenseStore = create<ModuleLicenseState>()(
  persist(
    (set, get) => ({
      subscriptionTier: 'enterprise',
      remainingMonths: 12,
      expiryDate: '2027-08-31',
      customReceiptFooter: 'Terima kasih atas kunjungan Anda! Ikuti Instagram kami @kopinusantara.id',
      modules: DEFAULT_MODULES,

      isModuleUnlocked: (moduleCode) => {
        const mod = get().modules.find((m) => m.code === moduleCode);
        return mod ? mod.isUnlocked : true;
      },

      setSubscriptionTier: (tier) => set({ subscriptionTier: tier }),

      setCustomReceiptFooter: (footer) => set({ customReceiptFooter: footer }),

      toggleModuleLock: (moduleCode) => {
        set({
          modules: get().modules.map((m) =>
            m.code === moduleCode ? { ...m, isUnlocked: !m.isUnlocked } : m
          ),
        });
      },

      unlockModule: (moduleCode) => {
        set({
          modules: get().modules.map((m) =>
            m.code === moduleCode ? { ...m, isUnlocked: true } : m
          ),
        });
      },

      lockModule: (moduleCode) => {
        set({
          modules: get().modules.map((m) =>
            m.code === moduleCode ? { ...m, isUnlocked: false } : m
          ),
        });
      },

      resetToDefault: () => {
        set({
          modules: DEFAULT_MODULES,
          subscriptionTier: 'enterprise',
          remainingMonths: 12,
          expiryDate: '2027-08-31',
        });
      },
    }),
    {
      name: 'modula_module_license_store',
    }
  )
);
