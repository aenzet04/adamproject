import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type BrandStaffRole =
  | 'owner'
  | 'general_manager'
  | 'branch_manager'
  | 'admin_system'
  | 'warehouse_staff'
  | 'cashier'
  | 'staff'
  | 'staff_it';

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
  pin?: string;
  isDefaultPin?: boolean;
  transferHistory: TransferHistoryLog[];
}

interface StaffState {
  employees: BrandEmployee[];
  addEmployee: (data: Omit<BrandEmployee, 'id' | 'transferHistory'>) => void;
  updateEmployee: (id: string, updates: Partial<BrandEmployee>) => void;
  changePin: (id: string, newPin: string) => void;
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
    joinedDate: '2026-01-01',
    transferHistory: [],
  },
  {
    id: 'emp-02',
    brandId: 'b-01',
    brandName: 'Kopi Nusantara Roastery',
    name: 'Bambang Supriyadi (GM)',
    email: 'bambang.gm@kopinusantara.id',
    phone: '081288776655',
    role: 'general_manager',
    roleTitle: 'General Manager Operasional',
    branchId: 'br-all',
    branchName: 'Headquarters / All Branches',
    shift: 'Shift Reguler Pagi (08:00 - 17:00)',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    joinedDate: '2026-01-15',
    transferHistory: [],
  },
  {
    id: 'emp-03',
    brandId: 'b-01',
    brandName: 'Kopi Nusantara Roastery',
    name: 'Rian Kurniawan',
    email: 'rian.manager@kopinusantara.id',
    phone: '081377889900',
    role: 'branch_manager',
    roleTitle: 'Manajer Outlet Grand Indonesia',
    branchId: 'br-01',
    branchName: 'Outlet Grand Indonesia',
    shift: 'Shift Middle (11:00 - 19:00)',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
    joinedDate: '2026-02-01',
    transferHistory: [],
  },
  {
    id: 'emp-04',
    brandId: 'b-01',
    brandName: 'Kopi Nusantara Roastery',
    name: 'Siti Rahma',
    email: 'siti.kasir@kopinusantara.id',
    phone: '081234567890',
    role: 'cashier',
    roleTitle: 'Kasir POS Senior',
    branchId: 'br-01',
    branchName: 'Outlet Grand Indonesia',
    shift: 'Shift Pagi (07:00 - 15:00)',
    status: 'active',
    pin: '0000',
    isDefaultPin: true,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    joinedDate: '2026-03-01',
    transferHistory: [
      {
        id: 'tf-01',
        fromBranchId: 'br-02',
        fromBranchName: 'Outlet Senopati',
        toBranchId: 'br-01',
        toBranchName: 'Outlet Grand Indonesia',
        transferDate: '2026-08-15',
        reason: 'Rotasi kebutuhan kasir senior di GI',
        approvedBy: 'Parikesit (Owner)',
      },
    ],
  },
  {
    id: 'emp-05',
    brandId: 'b-01',
    brandName: 'Kopi Nusantara Roastery',
    name: 'Andi Saputra',
    email: 'andi.barista@kopinusantara.id',
    phone: '081399001122',
    role: 'staff',
    roleTitle: 'Head Barista & Roaster',
    branchId: 'br-01',
    branchName: 'Outlet Grand Indonesia',
    shift: 'Shift Pagi (07:00 - 15:00)',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    joinedDate: '2026-03-15',
    transferHistory: [],
  },
  {
    id: 'emp-06',
    brandId: 'b-01',
    brandName: 'Kopi Nusantara Roastery',
    name: 'Hadi Gunawan',
    email: 'hadi.gudang@kopinusantara.id',
    phone: '081266554433',
    role: 'warehouse_staff',
    roleTitle: 'Staf Gudang & SCM',
    branchId: 'br-01',
    branchName: 'Outlet Grand Indonesia',
    shift: 'Shift Pagi (08:00 - 17:00)',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
    joinedDate: '2026-04-01',
    transferHistory: [],
  },
  {
    id: 'emp-07',
    brandId: 'b-01',
    brandName: 'Kopi Nusantara Roastery',
    name: 'Dimas Wicaksono',
    email: 'dimas.it@kopinusantara.id',
    phone: '081277889900',
    role: 'admin_system',
    roleTitle: 'Admin Sistem & Infrastruktur IT',
    branchId: 'br-all',
    branchName: 'Headquarters / All Branches',
    shift: 'Shift Reguler IT (09:00 - 18:00)',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120&auto=format&fit=crop&q=80',
    joinedDate: '2026-01-20',
    transferHistory: [],
  },
];

export const useStaffStore = create<StaffState>()(
  persist(
    (set, get) => ({
      employees: INITIAL_EMPLOYEES,

      addEmployee: (data) => {
        const isCashier = data.role === 'cashier';
        const newEmp: BrandEmployee = {
          ...data,
          id: `emp-${Date.now().toString().slice(-4)}`,
          pin: isCashier ? (data.pin || '0000') : undefined,
          isDefaultPin: isCashier ? true : undefined,
          transferHistory: [],
        };
        set({ employees: [...get().employees, newEmp] });
      },

      updateEmployee: (id, updates) => {
        set({
          employees: get().employees.map((emp) => (emp.id === id ? { ...emp, ...updates } : emp)),
        });
      },

      changePin: (id, newPin) => {
        set({
          employees: get().employees.map((emp) =>
            emp.id === id ? { ...emp, pin: newPin, isDefaultPin: false } : emp
          ),
        });
      },

      transferStaffBranch: (staffId, toBranchId, toBranchName, reason, approvedBy = 'Owner Approved') => {
        const employee = get().employees.find((e) => e.id === staffId);
        if (!employee) return;

        const newLog: TransferHistoryLog = {
          id: `tf-${Date.now().toString().slice(-4)}`,
          fromBranchId: employee.branchId,
          fromBranchName: employee.branchName,
          toBranchId,
          toBranchName,
          transferDate: new Date().toISOString().split('T')[0],
          reason,
          approvedBy,
        };

        const updated = get().employees.map((emp) => {
          if (emp.id === staffId) {
            return {
              ...emp,
              branchId: toBranchId,
              branchName: toBranchName,
              transferHistory: [newLog, ...emp.transferHistory],
            };
          }
          return emp;
        });

        set({ employees: updated });
      },

      removeEmployee: (id) => {
        set({ employees: get().employees.filter((e) => e.id !== id) });
      },
    }),
    {
      name: 'modula_staff_store',
    }
  )
);
