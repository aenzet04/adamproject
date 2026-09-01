import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile, UserRole } from '../types';

export const INITIAL_PROFILES: Record<UserRole, UserProfile> = {
  super_user: {
    id: 'usr-su-01',
    name: 'Parikesit (Master Super User)',
    username: 'parikesit_su',
    email: 'superuser@modula.id',
    role: 'super_user',
    roleTitle: 'Master Platform Architect & SaaS Director',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    tenantId: 't-all',
    phoneNumber: '+6281299887766',
  },
  owner: {
    id: 'usr-own-01',
    name: 'Parikesit (Brand Owner)',
    username: 'parikesit_owner',
    email: 'owner@holding.id',
    role: 'owner',
    roleTitle: 'Group CEO & Holding Owner',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    tenantId: 't-01',
    brandId: 'b-01',
    phoneNumber: '+6281808080808',
  },
  general_manager: {
    id: 'usr-gm-01',
    name: 'Bambang Supriyadi (GM)',
    username: 'bambang_gm',
    email: 'bambang.gm@kopinusantara.id',
    role: 'general_manager',
    roleTitle: 'General Manager Operasional Group',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    tenantId: 't-01',
    brandId: 'b-01',
    phoneNumber: '+6281288776655',
  },
  branch_manager: {
    id: 'usr-bm-01',
    name: 'Rian Kurniawan (Branch Manager)',
    username: 'rian_bm',
    email: 'rian.manager@kopinusantara.id',
    role: 'branch_manager',
    roleTitle: 'Manajer Outlet Grand Indonesia',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    tenantId: 't-01',
    brandId: 'b-01',
    branchId: 'br-01',
    phoneNumber: '+6281377889900',
  },
  admin_brand: {
    id: 'usr-adm-01',
    name: 'Budi Santoso (Admin Brand)',
    username: 'budi_admin',
    email: 'admin@kopinusantara.id',
    role: 'admin_brand',
    roleTitle: 'Brand Manager & Staff Lead',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    tenantId: 't-01',
    brandId: 'b-01',
    branchId: 'br-01',
    phoneNumber: '+6281311223344',
  },
  admin_system: {
    id: 'usr-sys-01',
    name: 'Dimas Wicaksono (Admin IT)',
    username: 'dimas_it',
    email: 'dimas.it@kopinusantara.id',
    role: 'admin_system',
    roleTitle: 'Admin Sistem & Infrastruktur IT',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    tenantId: 't-01',
    brandId: 'b-01',
    phoneNumber: '+6281277889900',
  },
  warehouse_staff: {
    id: 'usr-wh-01',
    name: 'Hadi Gunawan (Staf Gudang)',
    username: 'hadi_gudang',
    email: 'hadi.gudang@kopinusantara.id',
    role: 'warehouse_staff',
    roleTitle: 'Staf Gudang & SCM',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    tenantId: 't-01',
    brandId: 'b-01',
    branchId: 'br-01',
    phoneNumber: '+6281266554433',
  },
  cashier: {
    id: 'usr-csh-01',
    name: 'Siti Rahma (Kasir Shift Pagi)',
    username: 'siti_kasir',
    email: 'kasir.gi@kopinusantara.id',
    role: 'cashier',
    roleTitle: 'Head Barista & Senior Cashier',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    tenantId: 't-01',
    brandId: 'b-01',
    branchId: 'br-01',
    phoneNumber: '+6281987654321',
  },
  staff: {
    id: 'usr-stf-01',
    name: 'Andi Saputra (Barista)',
    username: 'andi_barista',
    email: 'andi.barista@kopinusantara.id',
    role: 'staff',
    roleTitle: 'Head Barista & Roaster',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    tenantId: 't-01',
    brandId: 'b-01',
    branchId: 'br-01',
    phoneNumber: '+6281399001122',
  },
  staff_it: {
    id: 'usr-it-01',
    name: 'Dimas Wicaksono (Staff IT)',
    username: 'dimas_staffit',
    email: 'dimas.staffit@kopinusantara.id',
    role: 'staff_it',
    roleTitle: 'Staff IT & Network Engineer',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    tenantId: 't-01',
    brandId: 'b-01',
    phoneNumber: '+6281277889900',
  },
};

// Helper normalize phone for comparison
function cleanPhone(phone: string = ''): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('62')) return '0' + digits.slice(2);
  return digits;
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  currentUser: UserProfile;
  registeredUsers: UserProfile[];
  login: (identifier: string, passwordOrRole?: string | UserRole) => boolean;
  loginWithOAuth: (provider: 'google' | 'github' | 'apple' | 'microsoft') => boolean;
  register: (profile: Partial<UserProfile> & { password?: string }) => boolean;
  findUserByIdentifier: (identifier: string) => UserProfile | null;
  updatePassword: (emailOrId: string, newPass: string) => boolean;
  quickLoginAs: (role: UserRole) => void;
  switchRole: (role: UserRole) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updateAvatar: (avatarUrl: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: true,
      token: 'jwt-mock-enterprise-parikesit-session-token-999',
      currentUser: INITIAL_PROFILES.owner,
      registeredUsers: Object.values(INITIAL_PROFILES),

      findUserByIdentifier: (identifier: string) => {
        const cleanId = identifier.trim().toLowerCase();
        const cleanIdPhone = cleanPhone(identifier);
        const allUsers = get().registeredUsers;

        return (
          allUsers.find((u) => {
            const matchEmail = u.email && u.email.toLowerCase() === cleanId;
            const matchUsername = u.username && u.username.toLowerCase() === cleanId;
            const matchPhone = u.phoneNumber && cleanPhone(u.phoneNumber) === cleanIdPhone;
            return matchEmail || matchUsername || matchPhone;
          }) || null
        );
      },

      login: (identifier, passwordOrRole) => {
        const found = get().findUserByIdentifier(identifier);
        if (found) {
          set({
            isAuthenticated: true,
            token: `jwt-${Date.now()}-${found.role}`,
            currentUser: found,
          });
          return true;
        }

        // Fallback role check
        let foundRole: UserRole = 'owner';
        if (passwordOrRole && Object.keys(INITIAL_PROFILES).includes(passwordOrRole as UserRole)) {
          foundRole = passwordOrRole as UserRole;
        }
        const profile = INITIAL_PROFILES[foundRole];
        set({
          isAuthenticated: true,
          token: `jwt-${Date.now()}-${foundRole}`,
          currentUser: {
            ...profile,
            email: identifier.includes('@') ? identifier : profile.email,
          },
        });
        return true;
      },

      loginWithOAuth: (provider) => {
        const profile: UserProfile = {
          ...INITIAL_PROFILES.owner,
          name: `Parikesit (${provider.toUpperCase()} Enterprise)`,
          username: `parikesit_${provider}`,
          email: `parikesit.${provider}@modula.id`,
        };
        set({
          isAuthenticated: true,
          token: `oauth-${provider}-${Date.now()}`,
          currentUser: profile,
        });
        return true;
      },

      register: (data) => {
        const role = data.role || 'owner';
        const newProfile: UserProfile = {
          id: `usr-reg-${Date.now().toString().slice(-4)}`,
          name: data.name || 'Pengguna Baru',
          username: data.username || `user_${Date.now().toString().slice(-4)}`,
          email: data.email || 'user@modula.id',
          role,
          roleTitle: data.roleTitle || 'Holding Owner',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          tenantId: data.tenantId || 't-01',
          brandId: data.brandId || 'b-01',
          phoneNumber: data.phoneNumber || '+6281200000000',
          password: data.password || 'Modula#2026Secure!',
        };

        const updatedUsers = [...get().registeredUsers, newProfile];

        set({
          isAuthenticated: true,
          token: `jwt-reg-${Date.now()}`,
          currentUser: newProfile,
          registeredUsers: updatedUsers,
        });
        return true;
      },

      updatePassword: (emailOrId, newPass) => {
        const users = get().registeredUsers.map((u) => {
          if (
            u.id === emailOrId ||
            u.email.toLowerCase() === emailOrId.toLowerCase() ||
            (u.username && u.username.toLowerCase() === emailOrId.toLowerCase())
          ) {
            return { ...u, password: newPass };
          }
          return u;
        });

        const current = get().currentUser;
        const updatedCurrent =
          current.id === emailOrId || current.email.toLowerCase() === emailOrId.toLowerCase()
            ? { ...current, password: newPass }
            : current;

        set({ registeredUsers: users, currentUser: updatedCurrent });
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

      switchRole: (role) => {
        const profile = INITIAL_PROFILES[role] || INITIAL_PROFILES.owner;
        set({ currentUser: profile });
      },

      updateProfile: (updates) => {
        const updatedCurrent = { ...get().currentUser, ...updates };
        const updatedUsers = get().registeredUsers.map((u) =>
          u.id === updatedCurrent.id ? { ...u, ...updates } : u
        );
        set({ currentUser: updatedCurrent, registeredUsers: updatedUsers });
      },

      updateAvatar: (avatarUrl) => {
        const updatedCurrent = { ...get().currentUser, avatarUrl };
        set({ currentUser: updatedCurrent });
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
