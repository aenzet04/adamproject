export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  legalEntityType: 'PT' | 'CV' | 'PERORANGAN';
  taxId?: string;
  status: 'active' | 'suspended';
  featureFlags: Record<string, boolean>;
  onboarding_completed?: boolean;
}

export interface Brand {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  industryType: 'fnb' | 'retail' | 'services' | 'fashion' | 'barbershop' | 'clinic' | 'other';
  businessSector?: string;
  tagline?: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  socialLinks?: {
    instagram?: string;
    tiktok?: string;
    whatsapp?: string;
    website?: string;
  };
  status: 'active' | 'inactive';
}

export interface Branch {
  id: string;
  tenantId: string;
  brandId: string;
  name: string;
  code: string;
  branchType: 'store' | 'kiosk' | 'central_kitchen' | 'warehouse';
  geofenceRadiusMeters: number;
  latitude?: number;
  longitude?: number;
  address?: string;
  city?: string;
  phone?: string;
  operatingHours?: string;
  isActive: boolean;
}

export interface Warehouse {
  id: string;
  tenantId: string;
  branchId: string;
  name: string;
  code: string;
  isPrimary: boolean;
  costingMethod: 'moving_average' | 'fifo' | 'standard';
}

export type UserRole = 'super_user' | 'owner' | 'admin_brand' | 'cashier';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  avatarUrl: string;
  tenantId: string;
  brandId?: string;
  branchId?: string;
  phoneNumber?: string;
  posPin?: string;
}

export interface Product {
  id: string;
  tenantId: string;
  brandId: string;
  categoryId: string;
  sku: string;
  barcode: string;
  name: string;
  sellingPrice: number;
  standardCost: number;
  taxRate: number;
  uom: string;
  isActive: boolean;
  requiresKitchenPrint: boolean;
  stock?: number;
}
