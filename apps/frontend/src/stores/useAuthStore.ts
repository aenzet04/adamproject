import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile, UserRole } from '../types';

const INITIAL_PROFILES: Record<UserRole, UserProfile> = {
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
  currentUser: UserProfile;
  switchRole: (role: UserRole) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updateAvatar: (base64OrUrl: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: INITIAL_PROFILES['owner'], // default as owner
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
