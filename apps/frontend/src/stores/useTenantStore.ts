import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Tenant, Brand, Branch, Warehouse } from '../types';

interface TenantState {
  currentTenant: Tenant | null;
  currentBrand: Brand | null;
  currentBranch: Branch | null;
  currentWarehouse: Warehouse | null;
  availableBrands: Brand[];
  availableBranches: Branch[];
  availableWarehouses: Warehouse[];
  setTenant: (tenant: Tenant) => void;
  setBrand: (brand: Brand) => void;
  setBranch: (branch: Branch) => void;
  setWarehouse: (warehouse: Warehouse) => void;
  setHierarchicalData: (data: {
    tenant: Tenant;
    brands: Brand[];
    branches: Branch[];
    warehouses: Warehouse[];
  }) => void;
}

export const useTenantStore = create<TenantState>()(
  persist(
    (set, get) => ({
      currentTenant: null,
      currentBrand: null,
      currentBranch: null,
      currentWarehouse: null,
      availableBrands: [],
      availableBranches: [],
      availableWarehouses: [],

      setTenant: (tenant) => set({ currentTenant: tenant }),
      setBrand: (brand) => {
        const filteredBranches = get().availableBranches.filter((b) => b.brandId === brand.id);
        set({
          currentBrand: brand,
          currentBranch: filteredBranches[0] || null,
        });
      },
      setBranch: (branch) => {
        const filteredWarehouses = get().availableWarehouses.filter((w) => w.branchId === branch.id);
        set({
          currentBranch: branch,
          currentWarehouse: filteredWarehouses[0] || null,
        });
      },
      setWarehouse: (warehouse) => set({ currentWarehouse: warehouse }),
      setHierarchicalData: ({ tenant, brands, branches, warehouses }) => {
        const initialBrand = brands[0] || null;
        const initialBranch = branches.find((b) => b.brandId === initialBrand?.id) || null;
        const initialWarehouse = warehouses.find((w) => w.branchId === initialBranch?.id) || null;

        set({
          currentTenant: tenant,
          availableBrands: brands,
          availableBranches: branches,
          availableWarehouses: warehouses,
          currentBrand: initialBrand,
          currentBranch: initialBranch,
          currentWarehouse: initialWarehouse,
        });
      },
    }),
    {
      name: 'adam_tenant_context',
    }
  )
);
