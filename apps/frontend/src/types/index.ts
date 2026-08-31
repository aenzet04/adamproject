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
  name: string;
  sku: string;
  barcode?: string;
  productType: 'inventory' | 'non_inventory' | 'composite' | 'service';
  uomBase: string;
  sellingPrice: number;
  standardCost: number;
  trackInventory: boolean;
  isActive: boolean;
  stockOnHand?: number;
  averageCost?: number;
}

export interface CategorizedProduct extends Product {
  imageEmoji: string;
  categoryName: string;
}

export interface CartItem {
  productId: string;
  productName: string;
  sku?: string;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  discountRate?: number;
  taxAmount?: number;
  unitCogs?: number;
  subtotal: number;
  notes?: string;
}

export interface PaymentAllocation {
  chartOfAccountId: string;
  paymentMethod: 'cash' | 'edc_bca' | 'edc_mandiri' | 'qris' | 'transfer_bank' | 'customer_credit' | string;
  amount: number;
  changeGiven: number;
  referenceNumber?: string;
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

export interface CustomerReview {
  id: string;
  branchId: string;
  branchName: string;
  customerName: string;
  rating: number;
  menuItemId?: string;
  menuItemName?: string;
  menuRating?: number;
  comment: string;
  createdAt: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface ModuleLicense {
  id: string;
  name: string;
  code: 'pos' | 'crm' | 'finance' | 'inventory' | 'hr' | 'audit' | 'ai_insights' | 'ai_advisor' | string;
  icon?: string;
  category?: string;
  description: string;
  pricePerMonth?: number;
  priceMonthly?: number;
  isUnlocked: boolean;
  featuresIncluded?: string[];
  expiresAt?: string;
}

export interface SplitBillPerson {
  personId: string;
  personName: string;
  assignedItems: Array<{ productId: string; quantity: number; amount: number }>;
  customAmount: number;
  isPaid: boolean;
  paymentMethod?: string;
  paidAmount?: number;
  changeGiven?: number;
}
