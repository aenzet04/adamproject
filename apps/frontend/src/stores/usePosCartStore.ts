import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, PaymentAllocation, Product } from '../types';

export type DiscountMode = 'percent' | 'nominal';
export type TaxMode = 'percent' | 'nominal';

interface PosCartState {
  items: CartItem[];
  customerName: string;
  tableNumber: string;
  notes: string;
  discountMode: DiscountMode;
  discountValue: number; // percentage (e.g. 10) or nominal amount (e.g. 15000)
  taxMode: TaxMode;
  taxValue: number; // percentage (e.g. 11) or nominal amount (e.g. 5000)
  serviceChargeRate: number; // percentage, e.g., 5.0
  roundingMethod: 'none' | 'round_50' | 'round_100' | 'round_up_100';
  payments: PaymentAllocation[];
  heldOrders: Array<{
    id: string;
    timestamp: string;
    items: CartItem[];
    customerName: string;
    tableNumber: string;
    grandTotal: number;
  }>;

  // Actions
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setItemNotes: (productId: string, notes: string) => void;
  setCustomerInfo: (name: string, table?: string) => void;
  setDiscount: (mode: DiscountMode, value: number) => void;
  setTax: (mode: TaxMode, value: number) => void;
  setServiceChargeRate: (rate: number) => void;
  setRoundingMethod: (method: 'none' | 'round_50' | 'round_100' | 'round_up_100') => void;
  addPayment: (payment: PaymentAllocation) => void;
  removePayment: (index: number) => void;
  clearCart: () => void;
  holdOrder: () => void;
  restoreHeldOrder: (heldId: string) => void;

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

export const usePosCartStore = create<PosCartState>()(
  persist(
    (set, get) => ({
      items: [],
      customerName: '',
      tableNumber: '',
      notes: '',
      discountMode: 'nominal',
      discountValue: 0,
      taxMode: 'percent',
      taxValue: 11, // default PPN 11%
      serviceChargeRate: 0,
      roundingMethod: 'round_100',
      payments: [],
      heldOrders: [],

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

      setCustomerInfo: (name, table = '') => {
        set({ customerName: name, tableNumber: table });
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
          tableNumber: '',
          notes: '',
          discountValue: 0,
          payments: [],
        });
      },

      holdOrder: () => {
        const { items, customerName, tableNumber } = get();
        if (items.length === 0) return;

        const heldOrder = {
          id: `HOLD-${Date.now().toString().slice(-4)}`,
          timestamp: new Date().toISOString(),
          items: [...items],
          customerName: customerName || 'Walk-in',
          tableNumber: tableNumber || 'Take Away',
          grandTotal: get().getGrandTotal(),
        };

        set({
          heldOrders: [heldOrder, ...get().heldOrders],
          items: [],
          customerName: '',
          tableNumber: '',
          discountValue: 0,
          payments: [],
        });
      },

      restoreHeldOrder: (heldId) => {
        const held = get().heldOrders.find((h) => h.id === heldId);
        if (!held) return;

        set({
          items: held.items,
          customerName: held.customerName,
          tableNumber: held.tableNumber,
          heldOrders: get().heldOrders.filter((h) => h.id !== heldId),
        });
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
