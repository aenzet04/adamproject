import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile, UserRole } from '../types';

export const INITIAL_PROFILES: Record<UserRole, UserProfile> = {
  super_user: {
    id: 'usr-su-01',
    name: 'Parikesit (Master Super User)',
    email: 'superuser@modula.id',
    role: 'super_user',
    roleTitle: 'Master Platform Architect & SaaS Director',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    tenantId: 't-all',
    phoneNumber: '081299887766',
  },
  owner: {
    id: 'usr-own-01',
    name: 'Parikesit (Brand Owner)',
    email: 'owner@holding.id',
    role: 'owner',
    roleTitle: 'Group CEO & Holding Owner',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    tenantId: 't-01',
    brandId: 'b-01',
    phoneNumber: '081808080808',
  },
  general_manager: {
    id: 'usr-gm-01',
    name: 'Bambang Supriyadi (GM)',
    email: 'bambang.gm@kopinusantara.id',
    role: 'general_manager',
    roleTitle: 'General Manager Operasional Group',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    tenantId: 't-01',
    brandId: 'b-01',
    phoneNumber: '081288776655',
  },
  branch_manager: {
    id: 'usr-bm-01',
    name: 'Rian Kurniawan (Branch Manager)',
    email: 'rian.manager@kopinusantara.id',
    role: 'branch_manager',
    roleTitle: 'Manajer Outlet Grand Indonesia',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    tenantId: 't-01',
    brandId: 'b-01',
    branchId: 'br-01',
    phoneNumber: '081377889900',
  },
  admin_brand: {
    id: 'usr-adm-01',
    name: 'Budi Santoso (Admin Brand)',
    email: 'admin@kopinusantara.id',
    role: 'admin_brand',
    roleTitle: 'Brand Manager & Staff Lead',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    tenantId: 't-01',
    brandId: 'b-01',
    branchId: 'br-01',
    phoneNumber: '081311223344',
  },
  admin_system: {
    id: 'usr-sys-01',
    name: 'Dimas Wicaksono (Admin IT)',
    email: 'dimas.it@kopinusantara.id',
    role: 'admin_system',
    roleTitle: 'Admin Sistem & Infrastruktur IT',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    tenantId: 't-01',
    brandId: 'b-01',
    phoneNumber: '081277889900',
  },
  warehouse_staff: {
    id: 'usr-wh-01',
    name: 'Hadi Gunawan (Staf Gudang)',
    email: 'hadi.gudang@kopinusantara.id',
    role: 'warehouse_staff',
    roleTitle: 'Staf Gudang & SCM',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    tenantId: 't-01',
    brandId: 'b-01',
    branchId: 'br-01',
    phoneNumber: '081266554433',
  },
  cashier: {
    id: 'usr-csh-01',
    name: 'Siti Rahma (Kasir Shift Pagi)',
    email: 'kasir.gi@kopinusantara.id',
    role: 'cashier',
    roleTitle: 'Head Barista & Senior Cashier',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    tenantId: 't-01',
    brandId: 'b-01',
    branchId: 'br-01',
    phoneNumber: '081987654321',
  },
  staff: {
    id: 'usr-stf-01',
    name: 'Andi Saputra (Barista)',
    email: 'andi.barista@kopinusantara.id',
    role: 'staff',
    roleTitle: 'Head Barista & Roaster',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    tenantId: 't-01',
    brandId: 'b-01',
    branchId: 'br-01',
    phoneNumber: '081399001122',
  },
  staff_it: {
    id: 'usr-it-01',
    name: 'Dimas Wicaksono (Staff IT)',
    email: 'dimas.staffit@kopinusantara.id',
    role: 'staff_it',
    roleTitle: 'Staff IT & Network Engineer',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    tenantId: 't-01',
    brandId: 'b-01',
    phoneNumber: '081277889900',
  },
};

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  currentUser: UserProfile;
  login: (email: string, passwordOrRole?: string | UserRole) => boolean;
  loginWithOAuth: (provider: 'google' | 'github' | 'apple' | 'microsoft') => boolean;
  register: (profile: Partial<UserProfile> & { password?: string }) => boolean;
  quickLoginAs: (role: UserRole) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: true,
      token: 'jwt-mock-enterprise-parikesit-session-token-999',
      currentUser: INITIAL_PROFILES.owner,

      login: (email, passwordOrRole) => {
        // Match profile by email or fallback to role
        let foundRole: UserRole = 'owner';

        if (passwordOrRole && Object.keys(INITIAL_PROFILES).includes(passwordOrRole as UserRole)) {
          foundRole = passwordOrRole as UserRole;
        } else {
          const matched = (Object.keys(INITIAL_PROFILES) as UserRole[]).find(
            (r) => INITIAL_PROFILES[r].email.toLowerCase() === email.toLowerCase()
          );
          if (matched) foundRole = matched;
        }

        const profile = INITIAL_PROFILES[foundRole];
        set({
          isAuthenticated: true,
          token: `jwt-${Date.now()}-${foundRole}`,
          currentUser: {
            ...profile,
            email,
          },
        });
        return true;
      },

      loginWithOAuth: (provider) => {
        set({
          isAuthenticated: true,
          token: `oauth-${provider}-${Date.now()}`,
          currentUser: {
            ...INITIAL_PROFILES.owner,
            name: `Parikesit (${provider.toUpperCase()} Enterprise)`,
            email: `parikesit.${provider}@modula.id`,
          },
        });
        return true;
      },

      register: (data) => {
        const role = data.role || 'owner';
        const newProfile: UserProfile = {
          id: `usr-reg-${Date.now().toString().slice(-4)}`,
          name: data.name || 'Pengguna Baru',
          email: data.email || 'user@modula.id',
          role,
          roleTitle: data.roleTitle || 'Owner Brand',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          tenantId: data.tenantId || 't-01',
          brandId: data.brandId || 'b-01',
          phoneNumber: data.phoneNumber || '081200000000',
        };

        set({
          isAuthenticated: true,
          token: `jwt-reg-${Date.now()}`,
          currentUser: newProfile,
        });
        return true;
      },

      quickLoginAs: (role) => {
        const profile = INITIAL_PROFILES[role] || INITIAL_PROFILES.owner;
        set({
          isAuthenticated: true,
          token: `quick-${role}-${Date.now()}`,
          currentUser: profile,
        });
      },

      logout: () => {
        set({
          isAuthenticated: false,
          token: null,
          currentUser: INITIAL_PROFILES.cashier,
        });
      },
    }),
    {
      name: 'modula_auth_session_store',
    }
  )
);
