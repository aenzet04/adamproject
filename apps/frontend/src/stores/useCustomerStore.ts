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
    lifetimeSpend: 24500000,
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
    lifetimeSpend: 16800000,
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
    lifetimeSpend: 9800000,
    visitCount: 32,
    joinedDate: '2026-03-02',
    notes: 'Sering meeting tim sore hari',
  },
  {
    id: 'cst-04',
    name: 'Amanda Putri',
    phone: '081700112233',
    email: 'amanda.putri@designstudio.co',
    branchId: 'br-02',
    branchName: 'Outlet Senopati',
    tier: 'Silver',
    points: 920,
    lifetimeSpend: 4600000,
    visitCount: 18,
    joinedDate: '2026-05-20',
  },
  {
    id: 'cst-05',
    name: 'Rudi Hartono',
    phone: '081944556677',
    branchId: 'br-03',
    branchName: 'Store Kelapa Gading',
    tier: 'Bronze',
    points: 380,
    lifetimeSpend: 1900000,
    visitCount: 7,
    joinedDate: '2026-07-04',
  },
];

interface CustomerState {
  customers: CustomerMember[];
  selectedCustomerId: string | null;
  addCustomer: (customer: Omit<CustomerMember, 'id' | 'joinedDate' | 'points' | 'lifetimeSpend' | 'visitCount'>) => CustomerMember;
  selectCustomer: (id: string | null) => void;
  recordPurchase: (customerId: string, amount: number) => void;
  getTopSpenders: (limit?: number, branchId?: string) => CustomerMember[];
  searchCustomers: (query: string, branchId?: string) => CustomerMember[];
  getBranchReport: () => Array<{
    branchId: string;
    branchName: string;
    memberCount: number;
    totalSpend: number;
    avgSpend: number;
    totalPoints: number;
  }>;
}

export const useCustomerStore = create<CustomerState>()(
  persist(
    (set, get) => ({
      customers: INITIAL_CUSTOMERS,
      selectedCustomerId: null,

      addCustomer: (data) => {
        const newCustomer: CustomerMember = {
          ...data,
          id: `cst-${Date.now().toString().slice(-6)}`,
          joinedDate: new Date().toISOString().split('T')[0],
          points: 100, // bonus initial points
          lifetimeSpend: 0,
          visitCount: 1,
        };
        set({ customers: [newCustomer, ...get().customers], selectedCustomerId: newCustomer.id });
        return newCustomer;
      },

      selectCustomer: (id) => set({ selectedCustomerId: id }),

      recordPurchase: (customerId, amount) => {
        const earnedPoints = Math.floor(amount / 10000);
        set({
          customers: get().customers.map((c) => {
            if (c.id !== customerId) return c;
            const newSpend = c.lifetimeSpend + amount;
            const newTier =
              newSpend >= 20000000 ? 'VIP' :
              newSpend >= 10000000 ? 'Platinum' :
              newSpend >= 5000000  ? 'Gold' :
              newSpend >= 2000000  ? 'Silver' : 'Bronze';

            return {
              ...c,
              lifetimeSpend: newSpend,
              points: c.points + earnedPoints,
              visitCount: c.visitCount + 1,
              tier: newTier,
            };
          }),
        });
      },

      getTopSpenders: (limit = 5, branchId = 'all') => {
        let list = [...get().customers];
        if (branchId !== 'all') {
          list = list.filter((c) => c.branchId === branchId);
        }
        return list.sort((a, b) => b.lifetimeSpend - a.lifetimeSpend).slice(0, limit);
      },

      searchCustomers: (query, branchId = 'all') => {
        let list = get().customers;
        if (branchId !== 'all') {
          list = list.filter((c) => c.branchId === branchId);
        }
        if (!query.trim()) return list;
        const q = query.toLowerCase();
        return list.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.phone.includes(q) ||
            (c.email && c.email.toLowerCase().includes(q))
        );
      },

      getBranchReport: () => {
        const branches = [
          { id: 'br-01', name: 'Outlet Grand Indonesia' },
          { id: 'br-02', name: 'Outlet Senopati' },
          { id: 'br-03', name: 'Store Kelapa Gading' },
        ];

        return branches.map((b) => {
          const members = get().customers.filter((c) => c.branchId === b.id);
          const totalSpend = members.reduce((sum, c) => sum + c.lifetimeSpend, 0);
          const totalPoints = members.reduce((sum, c) => sum + c.points, 0);
          const avgSpend = members.length > 0 ? Math.round(totalSpend / members.length) : 0;

          return {
            branchId: b.id,
            branchName: b.name,
            memberCount: members.length,
            totalSpend,
            avgSpend,
            totalPoints,
          };
        });
      },
    }),
    {
      name: 'modula_customer_members',
    }
  )
);
