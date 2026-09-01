import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CustomerMember {
  id: string;
  name: string;
  phone: string;
  email?: string;
  branchId: string;
  branchName: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'VIP';
  points: number;
  lifetimeSpend: number;
  visitCount: number;
  joinedDate: string;
  notes?: string;
  // Aliases for compatibility
  loyaltyPoints?: number;
  totalSpend?: number;
  totalTransactions?: number;
}

export type Customer = CustomerMember;

interface CustomerStoreState {
  customers: CustomerMember[];
  addCustomer: (data: Partial<CustomerMember> & { name: string; phone: string }) => CustomerMember;
  recordPurchase: (customerId: string, amount: number, pointsEarned?: number) => void;
  updateCustomerTier: (customerId: string, tier: CustomerMember['tier']) => void;
  getTopSpenders: (limit?: number) => CustomerMember[];
  searchCustomers: (query: string) => CustomerMember[];
}

const INITIAL_CUSTOMERS: CustomerMember[] = [
  {
    id: 'cst-01',
    name: 'Bpk. Irwan Hidayat',
    phone: '081234567890',
    email: 'irwan.hidayat@holdingcorp.id',
    branchId: 'br-01',
    branchName: 'Outlet Grand Indonesia',
    tier: 'VIP',
    points: 4850,
    loyaltyPoints: 4850,
    lifetimeSpend: 24500000,
    totalSpend: 24500000,
    visitCount: 68,
    joinedDate: '2025-11-10',
    notes: 'Kolektor beans Aceh Gayo & tamu reguler meja VIP',
  },
  {
    id: 'cst-02',
    name: 'Ibu Dian Permata',
    phone: '081398765432',
    email: 'dian.permata@gmail.com',
    branchId: 'br-01',
    branchName: 'Outlet Grand Indonesia',
    tier: 'Platinum',
    points: 3200,
    loyaltyPoints: 3200,
    lifetimeSpend: 16800000,
    totalSpend: 16800000,
    visitCount: 45,
    joinedDate: '2026-01-15',
    notes: 'Suka Kopi Aren Latte less sugar',
  },
  {
    id: 'cst-03',
    name: 'Kevin Sanjaya',
    phone: '081812345678',
    email: 'kevin.sanjaya@techstart.id',
    branchId: 'br-02',
    branchName: 'Outlet Senopati',
    tier: 'Gold',
    points: 1950,
    loyaltyPoints: 1950,
    lifetimeSpend: 9800000,
    totalSpend: 9800000,
    visitCount: 32,
    joinedDate: '2026-03-02',
    notes: 'Sering meeting tim sore hari',
  },
  {
    id: 'cst-04',
    name: 'Rian Kurnia',
    phone: '081922334455',
    email: 'rian.k@startup.id',
    branchId: 'br-03',
    branchName: 'Store Kelapa Gading',
    tier: 'Silver',
    points: 850,
    loyaltyPoints: 850,
    lifetimeSpend: 4200000,
    totalSpend: 4200000,
    visitCount: 14,
    joinedDate: '2026-04-12',
  },
];

export const useCustomerStore = create<CustomerStoreState>()(
  persist(
    (set, get) => ({
      customers: INITIAL_CUSTOMERS,

      addCustomer: (data) => {
        const newCustomer: CustomerMember = {
          id: `cst-${Date.now().toString().slice(-4)}`,
          name: data.name,
          phone: data.phone,
          email: data.email,
          branchId: data.branchId || 'br-01',
          branchName: data.branchName || 'Outlet Grand Indonesia',
          tier: data.tier || 'Silver',
          points: data.points || data.loyaltyPoints || 10,
          loyaltyPoints: data.loyaltyPoints || data.points || 10,
          lifetimeSpend: data.lifetimeSpend || data.totalSpend || 0,
          totalSpend: data.totalSpend || data.lifetimeSpend || 0,
          visitCount: data.visitCount || data.totalTransactions || 0,
          joinedDate: data.joinedDate || new Date().toISOString().split('T')[0],
          notes: data.notes,
        };

        set({ customers: [newCustomer, ...get().customers] });
        return newCustomer;
      },

      recordPurchase: (customerId, amount, pointsEarned = Math.floor(amount / 10000)) => {
        set({
          customers: get().customers.map((c) => {
            if (c.id === customerId) {
              const updatedPoints = (c.points || 0) + pointsEarned;
              const updatedSpend = (c.lifetimeSpend || 0) + amount;
              let newTier = c.tier;

              if (updatedSpend >= 20000000) newTier = 'VIP';
              else if (updatedSpend >= 10000000) newTier = 'Platinum';
              else if (updatedSpend >= 5000000) newTier = 'Gold';
              else if (updatedSpend >= 1000000) newTier = 'Silver';

              return {
                ...c,
                points: updatedPoints,
                loyaltyPoints: updatedPoints,
                lifetimeSpend: updatedSpend,
                totalSpend: updatedSpend,
                visitCount: (c.visitCount || 0) + 1,
                tier: newTier,
              };
            }
            return c;
          }),
        });
      },

      updateCustomerTier: (customerId, tier) => {
        set({
          customers: get().customers.map((c) => (c.id === customerId ? { ...c, tier } : c)),
        });
      },

      getTopSpenders: (limit = 10) => {
        return [...get().customers]
          .sort((a, b) => (b.lifetimeSpend || b.totalSpend || 0) - (a.lifetimeSpend || a.totalSpend || 0))
          .slice(0, limit);
      },

      searchCustomers: (query) => {
        const q = query.toLowerCase();
        return get().customers.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.phone.includes(q) ||
            (c.email && c.email.toLowerCase().includes(q))
        );
      },
    }),
    {
      name: 'modula_crm_customer_store',
    }
  )
);
