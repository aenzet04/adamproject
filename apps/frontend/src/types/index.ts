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
  stockOnHand?: number;
  productType?: 'goods' | 'raw_material' | 'service';
}

export interface CategorizedProduct extends Product {
  imageEmoji: string;
  categoryName: string;
  stockOnHand: number;
  productType?: 'goods' | 'raw_material' | 'service';
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  discountPercent?: number;
  discountAmount?: number;
  note?: string;
  taxRate?: number;
  imageEmoji?: string;
}

export interface PaymentAllocation {
  id: string;
  method: 'cash' | 'qris' | 'edc_bca' | 'edc_mandiri' | 'transfer' | 'member_points';
  amount: number;
  referenceNumber?: string;
}

export interface SplitBillPerson {
  id: string;
  name: string;
  items: CartItem[];
  allocatedAmount: number;
  paid: boolean;
  paymentMethod?: string;
}

export interface ModuleLicense {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  requiredTier: 'starter' | 'business' | 'enterprise';
  priceMonthly: number;
}

export interface CustomerReview {
  id: string;
  customerName: string;
  rating: number;
  feedback: string;
  category: 'Pelayanan' | 'Rasa' | 'Kebersihan' | 'Kecepatan';
  createdAt: string;
}

export interface ProfitLossReport {
  periodStart: string;
  periodEnd: string;
  revenues: Array<{ code: string; name: string; amount: number }>;
  totalRevenue: number;
  cogs: Array<{ code: string; name: string; amount: number }>;
  totalCogs: number;
  grossProfit: number;
  operatingExpenses: Array<{ code: string; name: string; amount: number }>;
  totalOperatingExpense: number;
  netIncome: number;
}
