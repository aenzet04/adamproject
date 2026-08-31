import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, PaymentAllocation, Product } from '../types';

export type DiscountMode = 'percent' | 'nominal';
export type TaxMode = 'percent' | 'nominal';

export interface HeldOrder {
  id: string;
  timestamp: string;
  items: CartItem[];
  customerId?: string;
  customerName: string;
  customerTier?: string;
  tableNumber: string;
  subtotal: number;
  discount: number;
  tax: number;
  grandTotal: number;
  notes?: string;
}

interface PosCartState {
  items: CartItem[];
  customerName: string;
  customerId?: string;
  customerTier?: string;
  tableNumber: string;
  notes: string;
  discountMode: DiscountMode;
  discountValue: number;
  taxMode: TaxMode;
  taxValue: number;
  serviceChargeRate: number;
  roundingMethod: 'none' | 'round_50' | 'round_100' | 'round_up_100';
  payments: PaymentAllocation[];
  heldOrders: HeldOrder[];

  // Actions
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setItemNotes: (productId: string, notes: string) => void;
  setCustomerInfo: (name: string, table?: string, customerId?: string, customerTier?: string) => void;
  setDiscount: (mode: DiscountMode, value: number) => void;
  setTax: (mode: TaxMode, value: number) => void;
  setServiceChargeRate: (rate: number) => void;
  setRoundingMethod: (method: 'none' | 'round_50' | 'round_100' | 'round_up_100') => void;
  addPayment: (payment: PaymentAllocation) => void;
  removePayment: (index: number) => void;
  clearCart: () => void;
  holdCurrentOrder: (customParams?: { name?: string; table?: string; customerId?: string; customerTier?: string; notes?: string }) => HeldOrder;
  restoreHeldOrder: (heldId: string) => void;
  deleteHeldOrder: (heldId: string) => void;

  // Computed Selectors
  getSubtotal: () => number;
  getTotalDiscount: () => number;
  getTaxableAmount: () => number;
  getTaxAmount: () => number;
  getServiceChargeAmount: () => number;
  getRoundingAmount: () => number;
  getGrandTotal: () => number;
  getTotalPaid: () => number;
  getRemainingBalance: () => number;
}

const INITIAL_HELD_ORDERS: HeldOrder[] = [
  {
    id: 'TAB-MEJA-03',
    timestamp: '2026-09-01T02:40:00Z',
    customerName: 'Bpk. Irwan Hidayat',
    customerId: 'cst-01',
    customerTier: 'VIP',
    tableNumber: 'Meja 03 (Indoor)',
    subtotal: 138000,
    discount: 13800,
    tax: 13662,
    grandTotal: 137900,
    notes: 'Tamu VIP, minta bill dipending sampai selesai meeting',
    items: [
      {
        productId: 'prod-001',
        productName: 'Espresso Single Origin Gayo',
        quantity: 2,
        unitPrice: 28000,
        discountAmount: 0,
        subtotal: 56000,
      },
      {
        productId: 'prod-004',
        productName: 'Nasi Goreng Wagyu Spesial',
        quantity: 1,
        unitPrice: 68000,
        discountAmount: 0,
        subtotal: 68000,
      },
      {
        productId: 'prod-003',
        productName: 'Croissant Butter Paris',
        quantity: 1,
        unitPrice: 32000,
        discountAmount: 0,
        subtotal: 32000,
      },
    ],
  },
  {
    id: 'TAB-MEJA-07',
    timestamp: '2026-09-01T03:10:00Z',
    customerName: 'Ibu Dian Permata',
    customerId: 'cst-02',
    customerTier: 'Platinum',
    tableNumber: 'Meja 07 (Outdoor)',
    subtotal: 77000,
    discount: 0,
    tax: 8470,
    grandTotal: 85500,
    notes: 'Kopi Aren Latte less sugar',
    items: [
      {
        productId: 'prod-005',
        productName: 'Kopi Aren Nusantara Latte',
        quantity: 1,
        unitPrice: 35000,
        discountAmount: 0,
        subtotal: 35000,
      },
      {
        productId: 'prod-002',
        productName: 'Iced Caramel Macchiato',
        quantity: 1,
        unitPrice: 42000,
        discountAmount: 0,
        subtotal: 42000,
      },
    ],
  },
];

export const usePosCartStore = create<PosCartState>()(
  persist(
    (set, get) => ({
      items: [],
      customerName: '',
      customerId: undefined,
      customerTier: undefined,
      tableNumber: '',
      notes: '',
      discountMode: 'nominal',
      discountValue: 0,
      taxMode: 'percent',
      taxValue: 11,
      serviceChargeRate: 0,
      roundingMethod: 'round_100',
      payments: [],
      heldOrders: INITIAL_HELD_ORDERS,

      addItem: (product, quantity = 1) => {
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex((item) => item.productId === product.id);

        if (existingIndex > -1) {
          const updatedItems = [...currentItems];
          const newQty = updatedItems[existingIndex].quantity + quantity;
          updatedItems[existingIndex] = {
            ...updatedItems[existingIndex],
            quantity: newQty,
            subtotal: newQty * updatedItems[existingIndex].unitPrice,
          };
          set({ items: updatedItems });
        } else {
          const newItem: CartItem = {
            productId: product.id,
            productName: product.name,
            sku: product.sku,
            quantity,
            unitPrice: product.sellingPrice,
            discountAmount: 0,
            unitCogs: product.standardCost,
            subtotal: quantity * product.sellingPrice,
          };
          set({ items: [...currentItems, newItem] });
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.productId !== productId) });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        const updatedItems = get().items.map((item) => {
          if (item.productId === productId) {
            return {
              ...item,
              quantity,
              subtotal: quantity * item.unitPrice,
            };
          }
          return item;
        });
        set({ items: updatedItems });
      },

      setItemNotes: (productId, notes) => {
        set({
          items: get().items.map((item) =>
            item.productId === productId ? { ...item, notes } : item
          ),
        });
      },

      setCustomerInfo: (name, table = '', customerId, customerTier) => {
        set({ customerName: name, tableNumber: table, customerId, customerTier });
      },

      setDiscount: (mode, value) => {
        set({ discountMode: mode, discountValue: Math.max(0, value) });
      },

      setTax: (mode, value) => {
        set({ taxMode: mode, taxValue: Math.max(0, value) });
      },

      setServiceChargeRate: (rate) => set({ serviceChargeRate: Math.max(0, rate) }),
      setRoundingMethod: (method) => set({ roundingMethod: method }),

      addPayment: (payment) => {
        set({ payments: [...get().payments, payment] });
      },

      removePayment: (index) => {
        set({ payments: get().payments.filter((_, idx) => idx !== index) });
      },

      clearCart: () => {
        set({
          items: [],
          customerName: '',
          customerId: undefined,
          customerTier: undefined,
          tableNumber: '',
          notes: '',
          discountValue: 0,
          payments: [],
        });
      },

      holdCurrentOrder: (customParams) => {
        const { items, customerName, tableNumber, customerId, customerTier } = get();
        if (items.length === 0) throw new Error('Keranjang kosong.');

        const finalName = customParams?.name || customerName || 'Pelanggan Walk-in';
        const finalTable = customParams?.table || tableNumber || `Meja ${Date.now().toString().slice(-2)}`;
        const finalCustId = customParams?.customerId || customerId;
        const finalTier = customParams?.customerTier || customerTier;

        const heldOrder: HeldOrder = {
          id: `HOLD-${finalTable.replace(/\s+/g, '-').toUpperCase()}-${Date.now().toString().slice(-4)}`,
          timestamp: new Date().toISOString(),
          items: [...items],
          customerId: finalCustId,
          customerName: finalName,
          customerTier: finalTier,
          tableNumber: finalTable,
          subtotal: get().getSubtotal(),
          discount: get().getTotalDiscount(),
          tax: get().getTaxAmount(),
          grandTotal: get().getGrandTotal(),
          notes: customParams?.notes || get().notes,
        };

        set({
          heldOrders: [heldOrder, ...get().heldOrders],
          items: [],
          customerName: '',
          customerId: undefined,
          customerTier: undefined,
          tableNumber: '',
          notes: '',
          discountValue: 0,
          payments: [],
        });

        return heldOrder;
      },

      restoreHeldOrder: (heldId) => {
        const held = get().heldOrders.find((h) => h.id === heldId);
        if (!held) return;

        set({
          items: held.items,
          customerName: held.customerName,
          customerId: held.customerId,
          customerTier: held.customerTier,
          tableNumber: held.tableNumber,
          notes: held.notes || '',
          heldOrders: get().heldOrders.filter((h) => h.id !== heldId),
        });
      },

      deleteHeldOrder: (heldId) => {
        set({ heldOrders: get().heldOrders.filter((h) => h.id !== heldId) });
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.subtotal, 0);
      },

      getTotalDiscount: () => {
        const subtotal = get().getSubtotal();
        const { discountMode, discountValue } = get();
        if (discountMode === 'percent') {
          return Math.round((subtotal * Math.min(100, discountValue)) / 100);
        }
        return Math.min(subtotal, discountValue);
      },

      getTaxableAmount: () => {
        return Math.max(0, get().getSubtotal() - get().getTotalDiscount());
      },

      getTaxAmount: () => {
        const taxable = get().getTaxableAmount();
        const { taxMode, taxValue } = get();
        if (taxMode === 'percent') {
          return Math.round((taxable * taxValue) / 100);
        }
        return Math.min(taxable, taxValue);
      },

      getServiceChargeAmount: () => {
        const taxable = get().getTaxableAmount();
        return Math.round((taxable * get().serviceChargeRate) / 100);
      },

      getRoundingAmount: () => {
        const rawTotal =
          get().getTaxableAmount() + get().getTaxAmount() + get().getServiceChargeAmount();
        const method = get().roundingMethod;

        if (method === 'round_100') {
          const rem = rawTotal % 100;
          if (rem === 0) return 0;
          return rem < 50 ? -rem : 100 - rem;
        } else if (method === 'round_up_100') {
          const rem = rawTotal % 100;
          return rem === 0 ? 0 : 100 - rem;
        }
        return 0;
      },

      getGrandTotal: () => {
        const rawTotal =
          get().getTaxableAmount() + get().getTaxAmount() + get().getServiceChargeAmount();
        return rawTotal + get().getRoundingAmount();
      },

      getTotalPaid: () => {
        return get().payments.reduce((sum, p) => sum + p.amount, 0);
      },

      getRemainingBalance: () => {
        const remaining = get().getGrandTotal() - get().getTotalPaid();
        return Math.max(0, remaining);
      },
    }),
    {
      name: 'modula_pos_cart_store',
    }
  )
);
