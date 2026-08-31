// ============================================================================
// 1. TENANCY & HIERARCHICAL ENTITIES
// ============================================================================
export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  taxId?: string;
  legalEntityType: 'PT' | 'CV' | 'Perorangan';
  status: 'active' | 'suspended' | 'trial';
  featureFlags: {
    pos: boolean;
    inventory: boolean;
    finance: boolean;
    hr: boolean;
    audit: boolean;
  };
}

export interface Brand {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  industryType: 'fnb' | 'retail' | 'services' | 'wholesale';
  logoUrl?: string;
  status: 'active' | 'inactive';
}

export interface Branch {
  id: string;
  tenantId: string;
  brandId: string;
  name: string;
  code: string;
  branchType: 'store' | 'warehouse_only' | 'central_kitchen' | 'hq';
  address?: string;
  phone?: string;
  latitude?: number;
  longitude?: number;
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
  costingMethod: 'moving_average' | 'fifo';
}

// ============================================================================
// 2. USERS, ROLES & AUTH
// ============================================================================
export type RoleCode =
  | 'super_admin'
  | 'brand_director'
  | 'branch_manager'
  | 'head_cashier'
  | 'cashier'
  | 'warehouse_officer'
  | 'chief_accountant'
  | 'hr_officer'
  | 'internal_auditor';

export interface User {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  status: 'active' | 'suspended';
  currentRole?: {
    code: RoleCode;
    name: string;
    scopeLevel: 'tenant' | 'brand' | 'branch';
    permissions: Record<string, boolean>;
  };
}

// ============================================================================
// 3. PRODUCT & INVENTORY
// ============================================================================
export interface Product {
  id: string;
  tenantId: string;
  brandId: string;
  categoryId?: string;
  name: string;
  sku: string;
  barcode?: string;
  productType: 'inventory' | 'service' | 'bundle' | 'raw_material';
  uomBase: string;
  sellingPrice: number;
  standardCost: number;
  trackInventory: boolean;
  isActive: boolean;
  stockOnHand?: number;
  averageCost?: number;
}

export interface StockLevel {
  id: string;
  warehouseId: string;
  productId: string;
  quantityOnHand: number;
  quantityReserved: number;
  averageCost: number;
  safetyStock: number;
  reorderPoint: number;
}

// ============================================================================
// 4. POS ORDER & CART
// ============================================================================
export interface CartItem {
  productId: string;
  productName: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  discountRate: number; // in percent e.g. 10 for 10%
  discountAmount: number;
  subtotal: number;
  unitCogs?: number;
  notes?: string;
}

export interface PaymentAllocation {
  chartOfAccountId: string;
  paymentMethod: 'cash' | 'qris' | 'edc_bca' | 'edc_mandiri' | 'transfer' | 'customer_credit';
  amount: number;
  changeGiven: number;
  referenceNumber?: string;
}

export interface PosOrderPayload {
  customerName?: string;
  tableNumber?: string;
  items: CartItem[];
  subtotalAmount: number;
  discountAmount: number;
  taxRate: number;
  taxAmount: number;
  serviceChargeAmount: number;
  roundingAmount: number;
  grandTotal: number;
  payments: PaymentAllocation[];
}

// ============================================================================
// 5. FINANCE & ACCOUNTING
// ============================================================================
export interface ChartOfAccount {
  id: string;
  tenantId: string;
  accountCode: string;
  accountName: string;
  accountType: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  normalBalance: 'debit' | 'credit';
  category: string;
  isReconcilable: boolean;
  isActive: boolean;
}

export interface JournalEntryLine {
  id?: string;
  chartOfAccountId: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  description?: string;
}

export interface JournalEntry {
  id: string;
  entryNumber: string;
  entryDate: string;
  sourceType: string;
  sourceId: string;
  narration: string;
  totalDebit: number;
  totalCredit: number;
  status: 'draft' | 'posted' | 'reversed';
  lines: JournalEntryLine[];
}

export interface ProfitLossReport {
  periodStart: string;
  periodEnd: string;
  brandId?: string;
  branchId?: string;
  revenues: { code: string; name: string; amount: number }[];
  totalRevenue: number;
  cogs: { code: string; name: string; amount: number }[];
  totalCogs: number;
  grossProfit: number;
  operatingExpenses: { code: string; name: string; amount: number }[];
  totalOperatingExpense: number;
  netIncome: number;
}
