import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ProductCategory {
  id: string;
  name: string;
  code: string;
  icon: string;
  description?: string;
}

export interface InventoryItem {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  sku: string;
  barcode: string;
  uom: string;
  sellingPrice: number;
  standardCost: number;
  stockOnHand: number;
  minStockLevel: number;
  imageEmoji: string;
  photoUrl?: string;
}

export interface VendorAgent {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email?: string;
  address?: string;
  category: 'Green Beans & Kopi' | 'Dairy & Susu' | 'Sirup & Flavor' | 'Packaging & Cup' | 'Pastry & Bakery';
  paymentTerms: 'CASH' | 'TOP_14' | 'TOP_30' | 'TOP_60';
  totalPurchases: number;
}

export interface PurchaseInboundItem {
  productId: string;
  productName: string;
  quantity: number;
  unitCost: number;
  subtotalCost: number;
}

export interface PurchaseInbound {
  id: string;
  invoiceNumber: string;
  vendorId: string;
  vendorName: string;
  warehouseId: string;
  warehouseName: string;
  productId: string;
  productName: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  items?: PurchaseInboundItem[];
  photoUrl?: string;
  invoicePdfName?: string;
  invoicePdfDataUrl?: string;
  notes?: string;
  receivedAt: string;
}

export interface StockTransfer {
  id: string;
  transferNumber: string;
  transferType: 'TRANSFER_BIASA' | 'TUKAR_GULING_BARTER';
  sourceWarehouseId: string;
  sourceWarehouseName: string;
  targetWarehouseId: string;
  targetWarehouseName: string;
  productId: string;
  productName: string;
  quantity: number;
  exchangedProductId?: string;
  exchangedProductName?: string;
  exchangedQuantity?: number;
  status: 'COMPLETED' | 'IN_TRANSIT' | 'PENDING';
  transferredAt: string;
  notes?: string;
}

interface InventoryState {
  categories: ProductCategory[];
  products: InventoryItem[];
  vendors: VendorAgent[];
  inbounds: PurchaseInbound[];
  transfers: StockTransfer[];

  // Actions
  addCategory: (category: Omit<ProductCategory, 'id'>) => ProductCategory;
  addProductWithStock: (
    productData: Omit<InventoryItem, 'id'>,
    inboundData?: {
      vendorId: string;
      vendorName: string;
      warehouseId: string;
      warehouseName: string;
      invoiceNumber: string;
      photoUrl?: string;
      invoicePdfName?: string;
      invoicePdfDataUrl?: string;
      notes?: string;
    }
  ) => InventoryItem;
  addVendor: (vendor: Omit<VendorAgent, 'id' | 'totalPurchases'>) => void;
  addPurchaseInbound: (inbound: Omit<PurchaseInbound, 'id' | 'receivedAt'>) => void;
  addBatchPurchaseInbound: (
    invoiceNumber: string,
    vendorId: string,
    vendorName: string,
    warehouseId: string,
    warehouseName: string,
    items: PurchaseInboundItem[],
    invoicePdfName?: string,
    invoicePdfDataUrl?: string,
    notes?: string
  ) => void;
  createStockTransfer: (transfer: Omit<StockTransfer, 'id' | 'transferredAt'>) => void;
}

const INITIAL_CATEGORIES: ProductCategory[] = [
  { id: 'cat-01', name: 'Kopi & Espresso', code: 'BEV-COF', icon: '☕', description: 'Menu minuman kopi panas dan dingin' },
  { id: 'cat-02', name: 'Makanan & Pastry', code: 'FNB-BAK', icon: '🥐', description: 'Menu makanan utama dan pastry' },
  { id: 'cat-03', name: 'Teh & Non-Coffee', code: 'BEV-TEA', icon: '🍵', description: 'Matcha, tea, lemonade, dan minuman non-kopi' },
  { id: 'cat-04', name: 'Retail & Merchandise', code: 'RET-MER', icon: '🛍️', description: 'Biji kopi sangrai, tumbler, dan tote bag' },
  { id: 'cat-05', name: 'Bahan Baku & Packaging', code: 'RAW-MAT', icon: '📦', description: 'Biji kopi mentah, sirup, susu, cup kertas' },
];

const INITIAL_PRODUCTS: InventoryItem[] = [
  {
    id: 'prod-001',
    categoryId: 'cat-01',
    categoryName: 'Kopi & Espresso',
    name: 'Espresso Single Origin Gayo',
    sku: 'BEV-ESP-01',
    barcode: '8991001001',
    uom: 'CUP',
    sellingPrice: 28000,
    standardCost: 8500,
    stockOnHand: 145,
    minStockLevel: 20,
    imageEmoji: '☕',
  },
  {
    id: 'prod-002',
    categoryId: 'cat-01',
    categoryName: 'Kopi & Espresso',
    name: 'Iced Caramel Macchiato',
    sku: 'BEV-ICM-02',
    barcode: '8991001002',
    uom: 'CUP',
    sellingPrice: 42000,
    standardCost: 14000,
    stockOnHand: 88,
    minStockLevel: 15,
    imageEmoji: '🧊',
  },
  {
    id: 'prod-005',
    categoryId: 'cat-01',
    categoryName: 'Kopi & Espresso',
    name: 'Kopi Aren Nusantara Latte',
    sku: 'BEV-KAL-05',
    barcode: '8991001005',
    uom: 'CUP',
    sellingPrice: 35000,
    standardCost: 11000,
    stockOnHand: 120,
    minStockLevel: 25,
    imageEmoji: '🥥',
  },
  {
    id: 'prod-003',
    categoryId: 'cat-02',
    categoryName: 'Makanan & Pastry',
    name: 'Croissant Butter Paris',
    sku: 'BAK-CRP-03',
    barcode: '8991001003',
    uom: 'PCS',
    sellingPrice: 32000,
    standardCost: 12000,
    stockOnHand: 24,
    minStockLevel: 10,
    imageEmoji: '🥐',
  },
  {
    id: 'prod-004',
    categoryId: 'cat-02',
    categoryName: 'Makanan & Pastry',
    name: 'Nasi Goreng Wagyu Spesial',
    sku: 'FNB-NGW-04',
    barcode: '8991001004',
    uom: 'PORTION',
    sellingPrice: 68000,
    standardCost: 28000,
    stockOnHand: 40,
    minStockLevel: 10,
    imageEmoji: '🍛',
  },
  {
    id: 'prod-012',
    categoryId: 'cat-04',
    categoryName: 'Retail & Merchandise',
    name: 'Roasted Beans Aceh Gayo 250g',
    sku: 'RET-RBG-12',
    barcode: '8991001012',
    uom: 'BAG',
    sellingPrice: 95000,
    standardCost: 45000,
    stockOnHand: 35,
    minStockLevel: 10,
    imageEmoji: '🫘',
  },
  {
    id: 'prod-013',
    categoryId: 'cat-04',
    categoryName: 'Retail & Merchandise',
    name: 'Stainless Tumbler 500ml Emerald',
    sku: 'RET-STE-13',
    barcode: '8991001013',
    uom: 'PCS',
    sellingPrice: 185000,
    standardCost: 85000,
    stockOnHand: 15,
    minStockLevel: 5,
    imageEmoji: '🥤',
  },
];

const INITIAL_VENDORS: VendorAgent[] = [
  {
    id: 'vnd-01',
    name: 'PT Gayo Mandiri Perkasa (Roastery)',
    contactPerson: 'Bpk. Faisal Gayo',
    phone: '081288990011',
    email: 'sales@gayomandiri.co.id',
    address: 'Takengon, Aceh Tengah',
    category: 'Green Beans & Kopi',
    paymentTerms: 'TOP_14',
    totalPurchases: 48500000,
  },
  {
    id: 'vnd-02',
    name: 'CV Greenfield Dairy Fresh',
    contactPerson: 'Ibu Ratna',
    phone: '081344556677',
    email: 'order@greenfieldfresh.id',
    address: 'Malang, Jawa Timur',
    category: 'Dairy & Susu',
    paymentTerms: 'CASH',
    totalPurchases: 22400000,
  },
  {
    id: 'vnd-03',
    name: 'PT Monin Syrup Indonesia',
    contactPerson: 'David Kurnia',
    phone: '081877665544',
    email: 'jakarta@monin.id',
    address: 'Jakarta Barat',
    category: 'Sirup & Flavor',
    paymentTerms: 'TOP_30',
    totalPurchases: 15600000,
  },
  {
    id: 'vnd-04',
    name: 'CV Nusantara Eco Packaging',
    contactPerson: 'Siti Aminah',
    phone: '081911223344',
    address: 'Tangerang',
    category: 'Packaging & Cup',
    paymentTerms: 'TOP_14',
    totalPurchases: 8900000,
  },
];

const INITIAL_INBOUNDS: PurchaseInbound[] = [
  {
    id: 'INB-001',
    invoiceNumber: 'INV-GYO-8821',
    vendorId: 'vnd-01',
    vendorName: 'PT Gayo Mandiri Perkasa (Roastery)',
    warehouseId: 'wh-01',
    warehouseName: 'Gudang Utama Barista GI',
    productId: 'prod-012',
    productName: 'Roasted Beans Aceh Gayo 250g',
    quantity: 50,
    unitCost: 45000,
    totalCost: 2250000,
    photoUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200&auto=format&fit=crop&q=80',
    invoicePdfName: 'Faktur_Pembelian_Gayo_INV8821.pdf',
    notes: 'Biji kopi batch sangrai medium roast terbaik',
    receivedAt: '2026-08-28T09:30:00Z',
  },
  {
    id: 'INB-002',
    invoiceNumber: 'INV-GFD-1029',
    vendorId: 'vnd-02',
    vendorName: 'CV Greenfield Dairy Fresh',
    warehouseId: 'wh-01',
    warehouseName: 'Gudang Utama Barista GI',
    productId: 'prod-005',
    productName: 'Fresh Milk Pasteurisasi 1 Liter',
    quantity: 80,
    unitCost: 18500,
    totalCost: 1480000,
    notes: 'Susu segar tanggal kedaluwarsa 20 hari',
    receivedAt: '2026-08-30T08:15:00Z',
  },
];

const INITIAL_TRANSFERS: StockTransfer[] = [
  {
    id: 'TRF-001',
    transferNumber: 'TRF-GI-SNP-01',
    transferType: 'TRANSFER_BIASA',
    sourceWarehouseId: 'wh-01',
    sourceWarehouseName: 'Gudang Utama Barista GI',
    targetWarehouseId: 'wh-02',
    targetWarehouseName: 'Gudang Outlet Senopati',
    productId: 'prod-012',
    productName: 'Roasted Beans Aceh Gayo 250g',
    quantity: 15,
    status: 'COMPLETED',
    transferredAt: '2026-08-29T11:00:00Z',
    notes: 'Bantuan stok outlet senopati untuk event weekend',
  },
  {
    id: 'TRF-002',
    transferNumber: 'BARTER-GI-KG-02',
    transferType: 'TUKAR_GULING_BARTER',
    sourceWarehouseId: 'wh-01',
    sourceWarehouseName: 'Gudang Utama Barista GI',
    targetWarehouseId: 'wh-02',
    targetWarehouseName: 'Gudang Outlet Senopati',
    productId: 'prod-006',
    productName: 'Cold Brew Bottle 250ml',
    quantity: 20,
    exchangedProductId: 'prod-003',
    exchangedProductName: 'Croissant Butter Paris',
    exchangedQuantity: 20,
    status: 'COMPLETED',
    transferredAt: '2026-08-31T14:30:00Z',
    notes: 'Tukar guling antar unit bisnis F&B 1 brand',
  },
];

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      categories: INITIAL_CATEGORIES,
      products: INITIAL_PRODUCTS,
      vendors: INITIAL_VENDORS,
      inbounds: INITIAL_INBOUNDS,
      transfers: INITIAL_TRANSFERS,

      addCategory: (data) => {
        const newCat: ProductCategory = {
          ...data,
          id: `cat-${Date.now().toString().slice(-4)}`,
        };
        set({ categories: [...get().categories, newCat] });
        return newCat;
      },

      addProductWithStock: (productData, inboundData) => {
        const newId = `prod-${Date.now().toString().slice(-6)}`;
        const newProd: InventoryItem = {
          ...productData,
          id: newId,
        };

        let updatedInbounds = get().inbounds;

        if (inboundData && productData.stockOnHand > 0) {
          const newInbound: PurchaseInbound = {
            id: `INB-${Date.now().toString().slice(-5)}`,
            invoiceNumber: inboundData.invoiceNumber || `INV-NEW-${Date.now().toString().slice(-4)}`,
            vendorId: inboundData.vendorId,
            vendorName: inboundData.vendorName,
            warehouseId: inboundData.warehouseId,
            warehouseName: inboundData.warehouseName,
            productId: newId,
            productName: newProd.name,
            quantity: productData.stockOnHand,
            unitCost: productData.standardCost,
            totalCost: productData.stockOnHand * productData.standardCost,
            photoUrl: inboundData.photoUrl,
            invoicePdfName: inboundData.invoicePdfName,
            invoicePdfDataUrl: inboundData.invoicePdfDataUrl,
            notes: inboundData.notes || 'Inbound stok awal pembuatan produk',
            receivedAt: new Date().toISOString(),
          };
          updatedInbounds = [newInbound, ...updatedInbounds];
        }

        set({
          products: [newProd, ...get().products],
          inbounds: updatedInbounds,
        });

        return newProd;
      },

      addVendor: (vendor) => {
        const newVendor: VendorAgent = {
          ...vendor,
          id: `vnd-${Date.now().toString().slice(-4)}`,
          totalPurchases: 0,
        };
        set({ vendors: [...get().vendors, newVendor] });
      },

      addPurchaseInbound: (inbound) => {
        const newInbound: PurchaseInbound = {
          ...inbound,
          id: `INB-${Date.now().toString().slice(-5)}`,
          receivedAt: new Date().toISOString(),
        };

        // Increase product stockOnHand
        const updatedProducts = get().products.map((p) => {
          if (p.id === inbound.productId || p.name === inbound.productName) {
            return {
              ...p,
              stockOnHand: p.stockOnHand + inbound.quantity,
              standardCost: inbound.unitCost, // Update latest standard cost
            };
          }
          return p;
        });

        set({
          inbounds: [newInbound, ...get().inbounds],
          products: updatedProducts,
        });
      },

      addBatchPurchaseInbound: (
        invoiceNumber,
        vendorId,
        vendorName,
        warehouseId,
        warehouseName,
        items,
        invoicePdfName,
        invoicePdfDataUrl,
        notes
      ) => {
        const totalCostSum = items.reduce((s, i) => s + i.subtotalCost, 0);
        const newInbound: PurchaseInbound = {
          id: `INB-BATCH-${Date.now().toString().slice(-5)}`,
          invoiceNumber,
          vendorId,
          vendorName,
          warehouseId,
          warehouseName,
          productId: items[0]?.productId || 'multi-item',
          productName: items.map((i) => `${i.quantity}x ${i.productName}`).join(', '),
          quantity: items.reduce((s, i) => s + i.quantity, 0),
          unitCost: Math.round(totalCostSum / (items.reduce((s, i) => s + i.quantity, 0) || 1)),
          totalCost: totalCostSum,
          items,
          invoicePdfName,
          invoicePdfDataUrl,
          notes,
          receivedAt: new Date().toISOString(),
        };

        // Update each product's stockOnHand
        const updatedProducts = get().products.map((p) => {
          const found = items.find((it) => it.productId === p.id || it.productName === p.name);
          if (found) {
            return {
              ...p,
              stockOnHand: p.stockOnHand + found.quantity,
              standardCost: found.unitCost,
            };
          }
          return p;
        });

        set({
          inbounds: [newInbound, ...get().inbounds],
          products: updatedProducts,
        });
      },

      createStockTransfer: (transfer) => {
        const newTransfer: StockTransfer = {
          ...transfer,
          id: `TRF-${Date.now().toString().slice(-5)}`,
          transferredAt: new Date().toISOString(),
        };
        set({ transfers: [newTransfer, ...get().transfers] });
      },
    }),
    {
      name: 'modula_inventory_management_store',
    }
  )
);
