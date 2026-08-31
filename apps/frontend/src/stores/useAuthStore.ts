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
};

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  currentUser: UserProfile;
  login: (email: string, passwordOrRole?: string | UserRole) => boolean;
  loginWithOAuth: (provider: 'google' | 'github' | 'apple' | 'microsoft') => boolean;
  register: (profile: Partial<UserProfile> & { password?: string }) => boolean;
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
      isAuthenticated: true,
      token: 'jwt_secure_session_token_2026',
      currentUser: INITIAL_PROFILES['owner'],

      login: (email: string, passwordOrRole?: string | UserRole) => {
        let targetRole: UserRole = 'owner';
        if (passwordOrRole === 'super_user' || passwordOrRole === 'admin_brand' || passwordOrRole === 'cashier' || passwordOrRole === 'owner') {
          targetRole = passwordOrRole;
        } else if (email.includes('super')) {
          targetRole = 'super_user';
        } else if (email.includes('admin')) {
          targetRole = 'admin_brand';
        } else if (email.includes('kasir')) {
          targetRole = 'cashier';
        }

        const profile = { ...INITIAL_PROFILES[targetRole], email };
        set({
          isAuthenticated: true,
          token: `jwt_session_${Date.now()}_${targetRole}`,
          currentUser: profile,
        });
        return true;
      },

      loginWithOAuth: (provider) => {
        const oauthName = provider === 'github' ? 'Parikesit (GitHub OAuth)' : provider === 'google' ? 'Parikesit (Google SSO)' : 'Parikesit (Enterprise SSO)';
        const oauthEmail = provider === 'github' ? 'parikesitad-pm@github.com' : 'parikesit@modula.id';

        const profile: UserProfile = {
          id: `usr-oauth-${provider}-${Date.now().toString().slice(-4)}`,
          name: oauthName,
          email: oauthEmail,
          role: 'owner',
          roleTitle: `Verified ${provider.toUpperCase()} Enterprise User`,
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          tenantId: 't-01',
          brandId: 'b-01',
          phoneNumber: '081234567890',
        };

        set({
          isAuthenticated: true,
          token: `oauth_${provider}_jwt_${Date.now()}`,
          currentUser: profile,
        });
        return true;
      },

      register: (params) => {
        const newRole: UserRole = params.role || 'owner';
        const newProfile: UserProfile = {
          id: `usr-${Date.now().toString().slice(-6)}`,
          name: params.name || 'User Baru Modula',
          email: params.email || 'user@modula.id',
          role: newRole,
          roleTitle: params.roleTitle || (newRole === 'owner' ? 'Business Owner' : 'Staff Member'),
          avatarUrl: params.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          tenantId: params.tenantId || 't-01',
          brandId: params.brandId || 'b-01',
          branchId: params.branchId || 'br-01',
          phoneNumber: params.phoneNumber || '081234567890',
        };

        set({
          isAuthenticated: true,
          token: `jwt_session_${Date.now()}_${newRole}`,
          currentUser: newProfile,
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
        get().register({ name, email, role });
      },

      logout: () => {
        set({
          isAuthenticated: false,
          token: null,
        });
      },

      switchRole: (role: UserRole) => {
        set({
          currentUser: { ...INITIAL_PROFILES[role], email: get().currentUser.email },
        });
      },

      updateProfile: (updates) => {
        set({
          currentUser: { ...get().currentUser, ...updates },
        });
      },

      updateAvatar: (base64OrUrl) => {
        set({
          currentUser: { ...get().currentUser, avatarUrl: base64OrUrl },
        });
      },
    }),
    {
      name: 'modula_auth_store',
    }
  )
);
