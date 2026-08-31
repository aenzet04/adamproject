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
    code: 'hr',
    name: 'SDM, Presisi Absensi & Payroll',
    description: 'Radius geofence outlet, split shift kasir/barista, dan slip gaji terintegrasi kas.',
    category: 'hr',
    isUnlocked: false,
    priceMonthly: 199000,
    featuresIncluded: ['Geofencing GPS', 'Shift Management', 'Payroll Slip'],
  },
  {
    id: 'mod-06',
    code: 'ai_advisor',
    name: 'AI Executive Strategic Advisor',
    description: 'Matriks produk Stars vs Deadstock dan rekomendasi margin profit otomatis.',
    category: 'analytics',
    isUnlocked: true,
    priceMonthly: 349000,
    featuresIncluded: ['Matrix Bintang vs Mati', 'Rekomendasi Bundling', 'Prediksi Penjualan'],
  },
];

export const useModuleLicenseStore = create<ModuleLicenseState>()(
  persist(
    (set, get) => ({
      subscriptionTier: 'enterprise',
      remainingMonths: 8,
      expiryDate: '01 Mei 2027',
      customReceiptFooter: 'Terima Kasih Atas Kunjungan Anda • IG: @kopinusantara.id',
      modules: DEFAULT_MODULES,

      setSubscriptionTier: (tier) => {
        let updatedModules = [...get().modules];
        if (tier === 'starter') {
          updatedModules = updatedModules.map((m) => ({
            ...m,
            isUnlocked: m.code === 'pos' || m.code === 'crm',
          }));
        } else if (tier === 'business') {
          updatedModules = updatedModules.map((m) => ({
            ...m,
            isUnlocked: m.code === 'pos' || m.code === 'crm' || m.code === 'finance' || m.code === 'inventory',
          }));
        } else if (tier === 'enterprise') {
          updatedModules = updatedModules.map((m) => ({
            ...m,
            isUnlocked: true,
          }));
        }
        set({ subscriptionTier: tier, modules: updatedModules });
      },

      setCustomReceiptFooter: (footer) => set({ customReceiptFooter: footer }),

      toggleModuleLock: (code) => {
        set({
          modules: get().modules.map((m) =>
            m.code === code ? { ...m, isUnlocked: !m.isUnlocked } : m
          ),
        });
      },

      unlockModule: (code) => {
        set({
          modules: get().modules.map((m) =>
            m.code === code ? { ...m, isUnlocked: true } : m
          ),
        });
      },

      lockModule: (code) => {
        set({
          modules: get().modules.map((m) =>
            m.code === code ? { ...m, isUnlocked: false } : m
          ),
        });
      },

      resetToDefault: () => {
        set({
          subscriptionTier: 'enterprise',
          remainingMonths: 8,
          expiryDate: '01 Mei 2027',
          modules: DEFAULT_MODULES,
        });
      },
    }),
    {
      name: 'modula_saas_module_licenses',
    }
  )
);
