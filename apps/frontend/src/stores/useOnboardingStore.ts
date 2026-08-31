import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useTenantStore } from './useTenantStore';
import { useStaffStore, BrandEmployee } from './useStaffStore';
import { useInventoryStore } from './useInventoryStore';
import { toast } from './useToastStore';
import type { Brand, Branch, Warehouse } from '../types';

export interface OnboardingBranchInput {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  phone: string;
  operatingHours: string;
  createWarehouse: boolean;
}

export interface OnboardingEmployeeInput {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'branch_manager' | 'cashier' | 'warehouse_staff' | 'staff';
  roleTitle: string;
  branchIds: string[];
  posPin: string;
}

interface OnboardingState {
  isOnboardingOpen: boolean;
  currentStep: 1 | 2 | 3 | 4;
  isAiGenerating: boolean;

  // Step 1: Brand & Media
  brandName: string;
  businessSector: string;
  tagline: string;
  description: string;
  logoUrl: string;
  bannerUrl: string;
  socialLinks: {
    instagram: string;
    tiktok: string;
    whatsapp: string;
    website: string;
  };

  // Step 2: Branches
  branches: OnboardingBranchInput[];

  // Step 3: Employees
  employees: OnboardingEmployeeInput[];

  // Actions
  openOnboarding: () => void;
  closeOnboarding: () => void;
  setStep: (step: 1 | 2 | 3 | 4) => void;
  updateBrand: (data: Partial<OnboardingState>) => void;
  generateBrandAiSuggestion: () => Promise<void>;
  addBranch: () => void;
  updateBranch: (id: string, data: Partial<OnboardingBranchInput>) => void;
  removeBranch: (id: string) => void;
  addEmployee: () => void;
  updateEmployee: (id: string, data: Partial<OnboardingEmployeeInput>) => void;
  removeEmployee: (id: string) => void;
  completeOnboarding: () => Promise<boolean>;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      isOnboardingOpen: false,
      currentStep: 1,
      isAiGenerating: false,

      // Initial Brand Defaults
      brandName: 'Kopi Nusantara Roastery',
      businessSector: 'fnb',
      tagline: 'Cita Rasa Autentik Nusantara, Disajikan dengan Sepenuh Hati',
      description: 'Kopi Nusantara Roastery adalah kafe dan roastery artisanal yang menyajikan racikan kopi single origin terbaik nusantara dengan atmosfer modern dan elegan.',
      logoUrl: 'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?w=180&auto=format&fit=crop&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&auto=format&fit=crop&q=80',
      socialLinks: {
        instagram: '@kopinusantara.id',
        tiktok: '@kopinusantara',
        whatsapp: '081299001122',
        website: 'https://kopinusantara.id',
      },

      // Initial Branches
      branches: [
        {
          id: 'br-init-01',
          name: 'Outlet Flagship Grand Indonesia',
          code: 'GI-01',
          address: 'Grand Indonesia West Mall Lantai 3A, Jl. M.H. Thamrin No. 1',
          city: 'Jakarta Pusat',
          phone: '021-23580001',
          operatingHours: '08:00 - 22:00 WIB',
          createWarehouse: true,
        },
      ],

      // Initial Employees
      employees: [
        {
          id: 'emp-init-01',
          name: 'Siti Rahma',
          email: 'siti.rahma@kopinusantara.id',
          phone: '081987654321',
          role: 'cashier',
          roleTitle: 'Head Cashier & Frontliner',
          branchIds: ['br-init-01'],
          posPin: '1234',
        },
        {
          id: 'emp-init-02',
          name: 'Hendra Saputra',
          email: 'hendra.gudang@kopinusantara.id',
          phone: '081233445566',
          role: 'warehouse_staff',
          roleTitle: 'Staf Gudang & SCM Lead',
          branchIds: ['br-init-01'],
          posPin: '5678',
        },
      ],

      openOnboarding: () => set({ isOnboardingOpen: true, currentStep: 1 }),
      closeOnboarding: () => set({ isOnboardingOpen: false }),
      setStep: (step) => set({ currentStep: step }),

      updateBrand: (data) => set((state) => ({ ...state, ...data })),

      generateBrandAiSuggestion: async () => {
        set({ isAiGenerating: true });
        const { brandName, businessSector } = get();

        try {
          const res = await fetch('http://localhost:3001/api/v1/onboarding/ai_suggest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sector: businessSector, brandName }),
          });

          if (res.ok) {
            const data = await res.json();
            if (data.data) {
              const sug = data.data;
              set({
                tagline: sug.taglines[0] || get().tagline,
                description: sug.description || get().description,
              });

              // Add suggested categories to inventory store if available
              if (sug.recommendedCategories && sug.recommendedCategories.length > 0) {
                sug.recommendedCategories.forEach((cat: any) => {
                  useInventoryStore.getState().addCategory(cat);
                });
              }

              toast.success('AI Magic Generator Berhasil', 'Tagline, deskripsi & kategori produk telah disesuaikan.');
            }
          }
        } catch (err) {
          console.warn('[Onboarding AI] Fallback offline generation');
          // Offline fallback
          if (businessSector === 'fnb') {
            set({
              tagline: 'Sensasi Kuliner & Racikan Kopi Istimewa Setiap Hari',
              description: `${brandName} adalah surga kuliner F&B modern yang menyajikan racikan hidangan dan minuman artisanal pilihan untuk memanjakan lidah Anda.`,
            });
          } else if (businessSector === 'retail') {
            set({
              tagline: 'Belanja Lengkap, Cepat, dan Hemat Setiap Saat',
              description: `${brandName} adalah ritel modern terlengkap dengan harga bersahabat dan produk berkualitas tinggi untuk keluarga.`,
            });
          }
          toast.info('AI Offline Suggestion', 'Rekomendasi profil bisnis berhasil di-generate.');
        } finally {
          set({ isAiGenerating: false });
        }
      },

      addBranch: () => {
        const count = get().branches.length + 1;
        const newBranch: OnboardingBranchInput = {
          id: `br-init-${Date.now().toString().slice(-4)}`,
          name: `Cabang Outlet ${count}`,
          code: `CAB-0${count}`,
          address: '',
          city: 'Jakarta',
          phone: '',
          operatingHours: '08:00 - 22:00 WIB',
          createWarehouse: true,
        };
        set({ branches: [...get().branches, newBranch] });
      },

      updateBranch: (id, data) => {
        set({
          branches: get().branches.map((b) => (b.id === id ? { ...b, ...data } : b)),
        });
      },

      removeBranch: (id) => {
        if (get().branches.length <= 1) {
          toast.error('Gagal', 'Minimal harus ada 1 cabang utama!');
          return;
        }
        set({ branches: get().branches.filter((b) => b.id !== id) });
      },

      addEmployee: () => {
        const newEmp: OnboardingEmployeeInput = {
          id: `emp-init-${Date.now().toString().slice(-4)}`,
          name: '',
          email: '',
          phone: '',
          role: 'cashier',
          roleTitle: 'Kasir Frontliner',
          branchIds: [get().branches[0]?.id || 'br-01'],
          posPin: Math.floor(1000 + Math.random() * 9000).toString(),
        };
        set({ employees: [...get().employees, newEmp] });
      },

      updateEmployee: (id, data) => {
        set({
          employees: get().employees.map((e) => (e.id === id ? { ...e, ...data } : e)),
        });
      },

      removeEmployee: (id) => {
        set({ employees: get().employees.filter((e) => e.id !== id) });
      },

      completeOnboarding: async () => {
        const state = get();
        if (!state.brandName.trim()) {
          toast.error('Validasi Gagal', 'Nama brand tidak boleh kosong.');
          return false;
        }
        if (state.branches.length === 0) {
          toast.error('Validasi Gagal', 'Minimal harus ada 1 cabang utama.');
          return false;
        }

        const brandId = `b-${Date.now().toString().slice(-4)}`;
        const tenantId = 't-01';

        // 1. Build Brand Entity
        const newBrand: Brand = {
          id: brandId,
          tenantId,
          name: state.brandName,
          code: state.brandName.replace(/[^A-Z0-9]/gi, '').slice(0, 4).toUpperCase() || 'BRND',
          industryType: (state.businessSector as any) || 'fnb',
          businessSector: state.businessSector,
          tagline: state.tagline,
          description: state.description,
          logoUrl: state.logoUrl,
          bannerUrl: state.bannerUrl,
          socialLinks: state.socialLinks,
          status: 'active',
        };

        // 2. Build Branches & Warehouses
        const newBranches: Branch[] = state.branches.map((b) => ({
          id: b.id.startsWith('br-') ? b.id : `br-${b.code.toLowerCase()}`,
          tenantId,
          brandId,
          name: b.name,
          code: b.code,
          branchType: 'store',
          geofenceRadiusMeters: 100,
          address: b.address,
          city: b.city,
          phone: b.phone,
          operatingHours: b.operatingHours,
          isActive: true,
        }));

        const newWarehouses: Warehouse[] = state.branches
          .filter((b) => b.createWarehouse)
          .map((b) => ({
            id: `wh-${b.code.toLowerCase()}-main`,
            tenantId,
            branchId: b.id,
            name: `Gudang Utama ${b.name}`,
            code: `WH-${b.code}-01`,
            isPrimary: true,
            costingMethod: 'moving_average',
          }));

        // 3. Build Employees
        state.employees.forEach((emp) => {
          const matchedBranch = newBranches.find((br) => emp.branchIds.includes(br.id)) || newBranches[0];
          useStaffStore.getState().addEmployee({
            brandId,
            brandName: state.brandName,
            name: emp.name || 'Karyawan Baru',
            email: emp.email || `karyawan.${emp.posPin}@${state.brandName.toLowerCase().replace(/\s+/g, '')}.id`,
            phone: emp.phone || '081200000000',
            role: emp.role,
            roleTitle: emp.roleTitle,
            branchId: matchedBranch.id,
            branchName: matchedBranch.name,
            shift: 'Shift Operasional',
            status: 'active',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
            joinedDate: new Date().toISOString().split('T')[0],
          });
        });

        // 4. Update Tenant Store with Seeded Data
        useTenantStore.getState().setHierarchicalData({
          tenant: {
            id: tenantId,
            name: `PT ${state.brandName} Group`,
            subdomain: state.brandName.toLowerCase().replace(/[^a-z0-9]/g, ''),
            legalEntityType: 'PT',
            status: 'active',
            featureFlags: { pos: true, inventory: true, finance: true, hr: true, audit: true },
            onboarding_completed: true,
          },
          brands: [newBrand, ...useTenantStore.getState().availableBrands],
          branches: [...newBranches, ...useTenantStore.getState().availableBranches],
          warehouses: [...newWarehouses, ...useTenantStore.getState().availableWarehouses],
        });

        useTenantStore.getState().setBrand(newBrand);
        useTenantStore.getState().setBranch(newBranches[0]);

        // 5. Send to backend complete endpoint
        try {
          await fetch('http://localhost:3001/api/v1/onboarding/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              tenantId,
              brand: newBrand,
              branches: newBranches,
              employees: state.employees,
            }),
          });
        } catch (e) {
          console.log('[Onboarding Complete] Local state applied');
        }

        set({ isOnboardingOpen: false, currentStep: 1 });
        toast.success(
          'Bisnis Berhasil Diluncurkan! 🚀',
          `Selamat datang di Modula! Brand ${state.brandName} siap digunakan dengan ${newBranches.length} cabang.`
        );
        return true;
      },
    }),
    {
      name: 'modula_onboarding_wizard_store',
    }
  )
);
