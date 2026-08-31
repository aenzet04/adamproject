import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

const INITIAL_TRANSFERS: StockTransfer[] = [
  {
    id: 'trf-01',
    transferNumber: 'TRF-20260901-001',
    transferType: 'TRANSFER_BIASA',
    sourceWarehouseId: 'wh-01',
    sourceWarehouseName: 'Gudang Utama Barista GI',
    targetWarehouseId: 'wh-02',
    targetWarehouseName: 'Gudang Outlet Senopati',
    productId: 'prod-012',
    productName: 'Roasted Beans Aceh Gayo 250g',
    quantity: 10,
    status: 'COMPLETED',
    transferredAt: '2026-09-01T03:15:00Z',
    notes: 'Pemindahan stok darurat untuk lonjakan akhir pekan di Senopati',
  },
  {
    id: 'trf-02',
    transferNumber: 'TRF-20260901-002',
    transferType: 'TUKAR_GULING_BARTER',
    sourceWarehouseId: 'wh-02',
    sourceWarehouseName: 'Gudang Outlet Senopati',
    targetWarehouseId: 'wh-01',
    targetWarehouseName: 'Gudang Utama Barista GI',
    productId: 'prod-009',
    productName: 'Japanese Uji Matcha Latte (10 Cup Pack)',
    quantity: 5,
    exchangedProductId: 'prod-006',
    exchangedProductName: 'Cold Brew Bottle 250ml',
    exchangedQuantity: 5,
    status: 'COMPLETED',
    transferredAt: '2026-09-01T04:40:00Z',
    notes: 'Tukar guling persediaan matcha dengan cold brew botol antar outlet',
  },
];

interface InventoryState {
  vendors: VendorAgent[];
  inbounds: PurchaseInbound[];
  transfers: StockTransfer[];
  addVendor: (vendor: Omit<VendorAgent, 'id' | 'totalPurchases'>) => VendorAgent;
  addPurchaseInbound: (inbound: Omit<PurchaseInbound, 'id' | 'receivedAt'>) => PurchaseInbound;
  createStockTransfer: (transfer: Omit<StockTransfer, 'id' | 'transferredAt'>) => StockTransfer;
}

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      vendors: INITIAL_VENDORS,
      inbounds: [],
      transfers: INITIAL_TRANSFERS,

      addVendor: (data) => {
        const newVendor: VendorAgent = {
          ...data,
          id: `vnd-${Date.now().toString().slice(-6)}`,
          totalPurchases: 0,
        };
        set({ vendors: [newVendor, ...get().vendors] });
        return newVendor;
      },

      addPurchaseInbound: (data) => {
        const newInbound: PurchaseInbound = {
          ...data,
          id: `inb-${Date.now().toString().slice(-6)}`,
          receivedAt: new Date().toISOString(),
        };

        // Update vendor total purchases
        const updatedVendors = get().vendors.map((v) =>
          v.id === data.vendorId
            ? { ...v, totalPurchases: v.totalPurchases + data.totalCost }
            : v
        );

        set({
          inbounds: [newInbound, ...get().inbounds],
          vendors: updatedVendors,
        });

        return newInbound;
      },

      createStockTransfer: (data) => {
        const newTransfer: StockTransfer = {
          ...data,
          id: `trf-${Date.now().toString().slice(-6)}`,
          transferredAt: new Date().toISOString(),
        };
        set({ transfers: [newTransfer, ...get().transfers] });
        return newTransfer;
      },
    }),
    {
      name: 'modula_inventory_scm_store',
    }
  )
);
