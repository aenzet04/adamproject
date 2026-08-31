import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile, UserRole } from '../types';

export const INITIAL_PROFILES: Record<UserRole, UserProfile> = {
  super_user: {
    id: 'usr-su-01',
    name: 'Adam Pratama (Platform Admin)',
    email: 'superadmin@adamcorp.id',
    role: 'super_user',
    roleTitle: 'Super User / SaaS Platform Director',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    tenantId: 't-all',
    phoneNumber: '081299887766',
  },
  owner: {
    id: 'usr-own-01',
    name: 'Bpk. Hendra Gunawan (Owner)',
    email: 'hendra.gunawan@nusantara.id',
    role: 'owner',
    roleTitle: 'Business Owner & Group CEO',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    tenantId: 't-01',
    brandId: 'b-01',
    phoneNumber: '081808080808',
  },
  admin_brand: {
    id: 'usr-adm-01',
    name: 'Rian Setyadi (Branch Manager)',
    email: 'rian.manager@kopinusantara.id',
    role: 'admin_brand',
    roleTitle: 'Branch & Store Admin',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    tenantId: 't-01',
    brandId: 'b-01',
    branchId: 'br-01',
    phoneNumber: '081311223344',
  },
  cashier: {
    id: 'usr-csh-01',
    name: 'Siti Rahma (Kasir Shift 1)',
    email: 'siti.rahma@outlet.kopinusantara.id',
    role: 'cashier',
    roleTitle: 'Head Barista & Senior Cashier',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    tenantId: 't-01',
    brandId: 'b-01',
    branchId: 'br-01',
    phoneNumber: '081987654321',
  },
};

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  currentUser: UserProfile;
  login: (email: string, role?: UserRole) => boolean;
  quickLoginAs: (role: UserRole) => void;
  signup: (name: string, email: string, role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updateAvatar: (base64OrUrl: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: true, // initial demo logged in
      token: 'jwt_secure_session_token_2026',
      currentUser: INITIAL_PROFILES['owner'],
      login: (email: string, role?: UserRole) => {
        const targetRole = role || 'owner';
        const profile = { ...INITIAL_PROFILES[targetRole], email };
        set({
          isAuthenticated: true,
          token: `jwt_session_${Date.now()}_${targetRole}`,
          currentUser: profile,
        });
        return true;
      },
      quickLoginAs: (role: UserRole) => {
        set({
          isAuthenticated: true,
          token: `jwt_session_${Date.now()}_${role}`,
          currentUser: INITIAL_PROFILES[role],
        });
      },
      signup: (name: string, email: string, role: UserRole) => {
        const newProfile: UserProfile = {
          id: `usr-${Date.now().toString().slice(-6)}`,
          name,
          email,
          role,
          roleTitle: role === 'owner' ? 'Business Owner' : role === 'admin_brand' ? 'Branch Admin' : 'Outlet Cashier',
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          tenantId: 't-01',
          phoneNumber: '081234567890',
        };
        set({
          isAuthenticated: true,
          token: `jwt_session_${Date.now()}_${role}`,
          currentUser: newProfile,
        });
      },
      logout: () => {
        set({
          isAuthenticated: false,
          token: null,
        });
      },
      switchRole: (role: UserRole) => {
        set({ currentUser: INITIAL_PROFILES[role] });
      },
      updateProfile: (updates) => {
        set({ currentUser: { ...get().currentUser, ...updates } });
      },
      updateAvatar: (avatarUrl) => {
        set({ currentUser: { ...get().currentUser, avatarUrl } });
      },
    }),
    {
      name: 'adam_auth_user_session',
    }
  )
);
