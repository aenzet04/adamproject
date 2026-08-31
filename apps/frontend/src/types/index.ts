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
}

export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  legalEntityType: 'PT' | 'CV' | 'PERORANGAN';
  taxIdentificationNumber?: string;
  status: 'active' | 'suspended' | 'trial';
  featureFlags: Record<string, boolean>;
}

export interface Brand {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  industryType: 'fnb' | 'retail' | 'services' | 'manufacturing';
  status: 'active' | 'inactive';
}

export interface Branch {
  id: string;
  tenantId: string;
  brandId: string;
  name: string;
  code: string;
  branchType: 'store' | 'kiosk' | 'cloud_kitchen' | 'central_kitchen' | 'warehouse';
  geofenceRadiusMeters: number;
  isActive: boolean;
}

export interface Warehouse {
  id: string;
  tenantId: string;
  branchId: string;
  name: string;
  code: string;
  isPrimary: boolean;
  costingMethod: 'fifo' | 'moving_average';
}

export interface Product {
  id: string;
  tenantId: string;
  brandId: string;
  name: string;
  sku: string;
  barcode?: string;
  productType: 'inventory' | 'non_inventory' | 'service' | 'composite';
  uomBase: string;
  sellingPrice: number;
  standardCost: number;
  trackInventory: boolean;
  isActive: boolean;
  stockOnHand?: number;
  averageCost?: number;
}

export interface CartItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  taxAmount: number;
  subtotal: number;
  notes?: string;
}

export interface PaymentAllocation {
  chartOfAccountId: string;
  paymentMethod: 'cash' | 'edc_bca' | 'edc_mandiri' | 'qris' | 'transfer_bank' | 'customer_credit';
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
  rating: number; // 1 - 5
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
  code: 'pos' | 'finance' | 'inventory' | 'hr' | 'audit' | 'ai_insights';
  icon: string;
  description: string;
  pricePerMonth: number;
  isUnlocked: boolean;
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
