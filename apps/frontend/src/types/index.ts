export type UserRole =
  | 'super_user'
  | 'owner'
  | 'general_manager'
  | 'branch_manager'
  | 'admin_brand'
  | 'admin_system'
  | 'warehouse_staff'
  | 'cashier'
  | 'staff'
  | 'staff_it';

export enum UserRoleEnum {
  SUPER_USER = 'super_user',
  OWNER = 'owner',
  GENERAL_MANAGER = 'general_manager',
  BRANCH_MANAGER = 'branch_manager',
  ADMIN_BRAND = 'admin_brand',
  ADMIN_SYSTEM = 'admin_system',
  WAREHOUSE_STAFF = 'warehouse_staff',
  CASHIER = 'cashier',
  STAFF = 'staff',
  STAFF_IT = 'staff_it',
}

export enum SalesChannelEnum {
  DINE_IN = 'DINE_IN',
  TAKE_AWAY = 'TAKE_AWAY',
  GRABFOOD = 'GRABFOOD',
  GOFOOD = 'GOFOOD',
  SHOPEEFOOD = 'SHOPEEFOOD',
  MAXIM = 'MAXIM',
}

export enum PaymentMethodEnum {
  CASH = 'CASH',
  QRIS = 'QRIS',
  EDC_BCA = 'EDC_BCA',
  EDC_MANDIRI = 'EDC_MANDIRI',
  TRANSFER_BANK = 'TRANSFER_BANK',
  CUSTOMER_CREDIT = 'CUSTOMER_CREDIT',
}

// REGEX CONSTANTS FOR VALIDATION
export const REGEX_PATTERNS = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE: /^(\+62|62|0)8[1-9][0-9]{6,10}$/,
  PIN: /^[0-9]{4,6}$/,
  SKU: /^[A-Z0-9-_]{3,20}$/,
};

export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  legalEntityType: 'PT' | 'CV' | 'PERORANGAN' | 'PT' | 'CV';
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
  industryType: 'fnb' | 'retail' | 'services' | 'fashion' | 'barbershop' | 'clinic' | 'other' | string;
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
  isTrial?: boolean;
}

export interface User {
  id: string;
  tenantId?: string;
  brandId?: string;
  branchId?: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  pin?: string;
  isDefaultPin?: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  sellingPrice: number;
  standardCost: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  sellingPrice: number;
  standardCost: number;
  currentStock: number;
  unit: string;
  barcode?: string;
  imageUrl?: string;
  variants?: ProductVariant[];
  hasVariants?: boolean;
  minStockAlert?: number;
  costingMethod?: 'moving_average' | 'fifo' | 'standard';
}

export interface ModuleLicense {
  id: string;
  code: string;
  name: string;
  description: string;
  category: 'core' | 'finance' | 'inventory' | 'enterprise';
  isUnlocked: boolean;
  priceMonthly?: number;
  priceAnnual?: number;
  featuresIncluded?: string[];
}
