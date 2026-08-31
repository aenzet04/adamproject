import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type BrandStaffRole =
  | 'owner'
  | 'general_manager'
  | 'branch_manager'
  | 'admin_system'
  | 'cashier'
  | 'staff';

export interface TransferHistoryLog {
  id: string;
  fromBranchId: string;
  fromBranchName: string;
  toBranchId: string;
  toBranchName: string;
  transferDate: string;
  reason: string;
  approvedBy: string;
}

export interface BrandEmployee {
  id: string;
  brandId: string;
  brandName: string;
  name: string;
  email: string;
  phone: string;
  role: BrandStaffRole;
  roleTitle: string;
  branchId: string;
  branchName: string;
  shift: string;
  status: 'active' | 'on_duty' | 'on_break' | 'off';
  avatar: string;
  joinedDate: string;
  transferHistory: TransferHistoryLog[];
}

interface StaffState {
  employees: BrandEmployee[];
  addEmployee: (data: Omit<BrandEmployee, 'id' | 'transferHistory'>) => void;
  updateEmployee: (id: string, updates: Partial<BrandEmployee>) => void;
  transferStaffBranch: (
    staffId: string,
    toBranchId: string,
    toBranchName: string,
    reason: string,
    approvedBy?: string
  ) => void;
  removeEmployee: (id: string) => void;
}

const INITIAL_EMPLOYEES: BrandEmployee[] = [
  {
    id: 'emp-01',
    brandId: 'b-01',
    brandName: 'Kopi Nusantara Roastery',
    name: 'Parikesit (Owner)',
    email: 'owner@kopinusantara.id',
    phone: '081299001122',
    role: 'owner',
    roleTitle: 'Brand Owner & Group CEO',
    branchId: 'br-all',
    branchName: 'Headquarters / All Branches',
    shift: 'Flexible Executive Shift',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    joinedDate: '2025-01-10',
    transferHistory: [],
  },
  {
    id: 'emp-02',
    brandId: 'b-01',
    brandName: 'Kopi Nusantara Roastery',
    name: 'Bambang Wijaya',
    email: 'bambang.gm@kopinusantara.id',
    phone: '081388776655',
    role: 'general_manager',
    roleTitle: 'General Manager Operasional',
    branchId: 'br-all',
    branchName: 'Headquarters / All Branches',
    shift: 'General Shift (08:00 - 17:00)',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    joinedDate: '2025-02-01',
    transferHistory: [],
  },
  {
    id: 'emp-03',
    brandId: 'b-01',
    brandName: 'Kopi Nusantara Roastery',
    name: 'Rian Setyadi',
    email: 'rian.manager@kopinusantara.id',
    phone: '081311223344',
    role: 'branch_manager',
    roleTitle: 'Branch Manager Outlet GI',
    branchId: 'br-01',
    branchName: 'Outlet Grand Indonesia',
    shift: 'Shift Pagi (07:00 - 15:30)',
    status: 'on_duty',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    joinedDate: '2025-03-15',
    transferHistory: [
      {
        id: 'tf-001',
        fromBranchId: 'br-02',
        fromBranchName: 'Outlet Senopati',
        toBranchId: 'br-01',
        toBranchName: 'Outlet Grand Indonesia',
        transferDate: '2026-06-01',
        reason: 'Promosi jabatan Manajer Outlet Flagship GI',
        approvedBy: 'Parikesit (Owner)',
      },
    ],
  },
  {
    id: 'emp-04',
    brandId: 'b-01',
    brandName: 'Kopi Nusantara Roastery',
    name: 'Ahmad Fauzi',
    email: 'ahmad.it@kopinusantara.id',
    phone: '081744332211',
    role: 'admin_system',
    roleTitle: 'Admin IT & POS System Specialist',
    branchId: 'br-01',
    branchName: 'Outlet Grand Indonesia',
    shift: 'General Shift (09:00 - 18:00)',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
    joinedDate: '2025-04-10',
    transferHistory: [],
  },
  {
    id: 'emp-05',
    brandId: 'b-01',
    brandName: 'Kopi Nusantara Roastery',
    name: 'Siti Rahma',
    email: 'siti.rahma@outlet.kopinusantara.id',
    phone: '081987654321',
    role: 'cashier',
    roleTitle: 'Senior Cashier & Head Barista',
    branchId: 'br-01',
    branchName: 'Outlet Grand Indonesia',
    shift: 'Shift Pagi (07:00 - 15:00)',
    status: 'on_duty',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    joinedDate: '2025-05-12',
    transferHistory: [],
  },
  {
    id: 'emp-06',
    brandId: 'b-01',
    brandName: 'Kopi Nusantara Roastery',
    name: 'Nadia Safitri',
    email: 'nadia.csh@outlet.kopinusantara.id',
    phone: '081822334455',
    role: 'cashier',
    roleTitle: 'Kasir Frontliner',
    branchId: 'br-02',
    branchName: 'Outlet Senopati',
    shift: 'Shift Siang (14:00 - 22:00)',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    joinedDate: '2025-07-20',
    transferHistory: [],
  },
  {
    id: 'emp-07',
    brandId: 'b-01',
    brandName: 'Kopi Nusantara Roastery',
    name: 'Dimas Pratama',
    email: 'dimas.pastry@outlet.kopinusantara.id',
    phone: '081566778899',
    role: 'staff',
    roleTitle: 'Kitchen Pastry Cook',
    branchId: 'br-01',
    branchName: 'Outlet Grand Indonesia',
    shift: 'Shift Pagi (06:00 - 14:00)',
    status: 'on_break',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
    joinedDate: '2025-08-01',
    transferHistory: [],
  },
  {
    id: 'emp-08',
    brandId: 'b-01',
    brandName: 'Kopi Nusantara Roastery',
    name: 'Yoga Saputra',
    email: 'yoga.barista@outlet.kopinusantara.id',
    phone: '081699887766',
    role: 'staff',
    roleTitle: 'Barista Espresso Specialist',
    branchId: 'br-03',
    branchName: 'Store Kelapa Gading',
    shift: 'Shift Siang (14:00 - 22:00)',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
    joinedDate: '2025-09-15',
    transferHistory: [],
  },
];

export const useStaffStore = create<StaffState>()(
  persist(
    (set, get) => ({
      employees: INITIAL_EMPLOYEES,

      addEmployee: (data) => {
        const newEmp: BrandEmployee = {
          ...data,
          id: `emp-${Date.now().toString().slice(-6)}`,
          transferHistory: [],
        };
        set({ employees: [newEmp, ...get().employees] });
      },

      updateEmployee: (id, updates) => {
        set({
          employees: get().employees.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        });
      },

      transferStaffBranch: (staffId, toBranchId, toBranchName, reason, approvedBy = 'Owner / General Manager') => {
        const current = get().employees.find((e) => e.id === staffId);
        if (!current) return;

        const newLog: TransferHistoryLog = {
          id: `tf-${Date.now().toString().slice(-6)}`,
          fromBranchId: current.branchId,
          fromBranchName: current.branchName,
          toBranchId,
          toBranchName,
          transferDate: new Date().toISOString().split('T')[0],
          reason,
          approvedBy,
        };

        set({
          employees: get().employees.map((e) =>
            e.id === staffId
              ? {
                  ...e,
                  branchId: toBranchId,
                  branchName: toBranchName,
                  transferHistory: [newLog, ...e.transferHistory],
                }
              : e
          ),
        });
      },

      removeEmployee: (id) => {
        set({ employees: get().employees.filter((e) => e.id !== id) });
      },
    }),
    {
      name: 'modula_staff_employees_store',
    }
  )
);
