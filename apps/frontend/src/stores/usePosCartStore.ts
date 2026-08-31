import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, PaymentAllocation, Product } from '../types';

export interface HeldOrder {
  id: string;
  heldAt: string;
  customerName?: string;
  tableNumber?: string;
  items: CartItem[];
  subtotal: number;
}

interface PosCartState {
  items: CartItem[];
  customerName: string;
  tableNumber: string;
  taxRate: number; // default 11%
  serviceChargeRate: number; // default 0%
  roundingEnabled: boolean;
  payments: PaymentAllocation[];
  heldOrders: HeldOrder[];

  // Actions
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  setItemDiscount: (productId: string, discountRate: number, discountAmount: number) => void;
  setCustomerInfo: (name: string, table?: string) => void;
  setTaxRate: (rate: number) => void;
  setServiceChargeRate: (rate: number) => void;
  addPayment: (payment: PaymentAllocation) => void;
  removePayment: (index: number) => void;
  clearCart: () => void;
  holdOrder: () => void;
  restoreHeldOrder: (heldOrderId: string) => void;

  // Computed Selectors
  getSubtotal: () => number;
  getTotalDiscount: () => number;
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
      taxRate: 11.0,
      serviceChargeRate: 0.0,
      roundingEnabled: true,
      payments: [],
      heldOrders: [],

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex((i) => i.productId === product.id);
          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            const item = updatedItems[existingIndex];
            const newQty = item.quantity + quantity;
            const subtotal = item.unitPrice * newQty - item.discountAmount;
            updatedItems[existingIndex] = { ...item, quantity: newQty, subtotal };
            return { items: updatedItems };
          }

          const newItem: CartItem = {
            productId: product.id,
            productName: product.name,
            sku: product.sku,
            unitPrice: product.sellingPrice,
            quantity,
            discountRate: 0,
            discountAmount: 0,
            subtotal: product.sellingPrice * quantity,
            unitCogs: product.averageCost || product.standardCost,
          };
          return { items: [...state.items, newItem] };
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) => {
            if (item.productId !== productId) return item;
            const subtotal = item.unitPrice * quantity - item.discountAmount;
            return { ...item, quantity, subtotal };
          }),
        }));
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      setItemDiscount: (productId, discountRate, discountAmount) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.productId !== productId) return item;
            const subtotal = item.unitPrice * item.quantity - discountAmount;
            return { ...item, discountRate, discountAmount, subtotal };
          }),
        }));
      },

      setCustomerInfo: (customerName, tableNumber = '') => {
        set({ customerName, tableNumber });
      },

      setTaxRate: (taxRate) => set({ taxRate }),
      setServiceChargeRate: (serviceChargeRate) => set({ serviceChargeRate }),

      addPayment: (payment) => {
        set((state) => ({ payments: [...state.payments, payment] }));
      },

      removePayment: (index) => {
        set((state) => ({
          payments: state.payments.filter((_, i) => i !== index),
        }));
      },

      clearCart: () => {
        set({
          items: [],
          customerName: '',
          tableNumber: '',
          payments: [],
        });
      },

      holdOrder: () => {
        const { items, customerName, tableNumber, getSubtotal } = get();
        if (items.length === 0) return;

        const held: HeldOrder = {
          id: `HOLD-${Date.now()}`,
          heldAt: new Date().toISOString(),
          customerName,
          tableNumber,
          items,
          subtotal: getSubtotal(),
        };

        set((state) => ({
          heldOrders: [held, ...state.heldOrders],
          items: [],
          customerName: '',
          tableNumber: '',
          payments: [],
        }));
      },

      restoreHeldOrder: (heldOrderId) => {
        const { heldOrders } = get();
        const target = heldOrders.find((h) => h.id === heldOrderId);
        if (!target) return;

        set((state) => ({
          items: target.items,
          customerName: target.customerName || '',
          tableNumber: target.tableNumber || '',
          heldOrders: state.heldOrders.filter((h) => h.id !== heldOrderId),
          payments: [],
        }));
      },

      // Calculations
      getSubtotal: () => {
        return get().items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
      },

      getTotalDiscount: () => {
        return get().items.reduce((acc, item) => acc + item.discountAmount, 0);
      },

      getTaxAmount: () => {
        const netBase = get().getSubtotal() - get().getTotalDiscount();
        return Math.round(netBase * (get().taxRate / 100));
      },

      getServiceChargeAmount: () => {
        const netBase = get().getSubtotal() - get().getTotalDiscount();
        return Math.round(netBase * (get().serviceChargeRate / 100));
      },

      getRoundingAmount: () => {
        if (!get().roundingEnabled) return 0;
        const rawTotal =
          get().getSubtotal() -
          get().getTotalDiscount() +
          get().getTaxAmount() +
          get().getServiceChargeAmount();
        const rounded = Math.round(rawTotal / 100) * 100;
        return rounded - rawTotal;
      },

      getGrandTotal: () => {
        return (
          get().getSubtotal() -
          get().getTotalDiscount() +
          get().getTaxAmount() +
          get().getServiceChargeAmount() +
          get().getRoundingAmount()
        );
      },

      getTotalPaid: () => {
        return get().payments.reduce((acc, p) => acc + (p.amount - p.changeGiven), 0);
      },

      getRemainingBalance: () => {
        const grandTotal = get().getGrandTotal();
        const totalPaid = get().getTotalPaid();
        return Math.max(0, grandTotal - totalPaid);
      },
    }),
    {
      name: 'adam_pos_cart_state',
    }
  )
);
