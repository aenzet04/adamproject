import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, PaymentAllocation, Product } from '../types';

export type DiscountMode = 'percent' | 'nominal';
export type TaxMode = 'percent' | 'nominal';
export type OrderSalesChannel = 'DINE_IN' | 'TAKE_AWAY' | 'GRABFOOD' | 'GOFOOD' | 'SHOPEEFOOD' | 'MAXIM';

export interface HeldOrder {
  id: string;
  timestamp: string;
  items: CartItem[];
  customerId?: string;
  customerName: string;
  customerTier?: string;
  tableNumber: string;
  orderChannel: OrderSalesChannel;
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
  orderChannel: OrderSalesChannel;
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
  setOrderChannel: (channel: OrderSalesChannel) => void;
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
  getChangeGiven: () => number;
}

export const usePosCartStore = create<PosCartState>()(
  persist(
    (set, get) => ({
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
          productName: 'Matcha Green Tea Fusion',
          quantity: 1,
          unitPrice: 38000,
          discountAmount: 0,
          subtotal: 38000,
        },
      ],
      customerName: 'Bpk. Irwan (Meja 04)',
      customerId: 'crm-01',
      customerTier: 'Gold',
      tableNumber: 'Table 04',
      orderChannel: 'DINE_IN',
      notes: '',
      discountMode: 'percent',
      discountValue: 0,
      taxMode: 'percent',
      taxValue: 11, // PPN 11%
      serviceChargeRate: 0,
      roundingMethod: 'round_100',
      payments: [],
      heldOrders: [
        {
          id: 'hold-sample-01',
          timestamp: '2026-08-31 14:15',
          customerName: 'Ibu Dian Sastro (VIP)',
          customerTier: 'VIP',
          tableNumber: 'Meja VIP 01',
          orderChannel: 'DINE_IN',
          items: [
            { productId: 'prod-002', productName: 'Signature Palm Sugar Latte', quantity: 2, unitPrice: 35000, discountAmount: 0, subtotal: 70000 },
            { productId: 'prod-008', productName: 'Smoked Beef Croissant', quantity: 2, unitPrice: 42000, discountAmount: 0, subtotal: 84000 },
          ],
          subtotal: 154000,
          discount: 0,
          tax: 16940,
          grandTotal: 171000,
          notes: 'Open table menunggu tamu rekan bisnis',
        },
      ],

      addItem: (product, quantity = 1) => {
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex((item) => item.productId === product.id);

        if (existingIndex > -1) {
          const updatedItems = [...currentItems];
          const newQty = updatedItems[existingIndex].quantity + quantity;
          const unitPrice = updatedItems[existingIndex].unitPrice;
          const discountAmt = updatedItems[existingIndex].discountAmount || 0;
          updatedItems[existingIndex] = {
            ...updatedItems[existingIndex],
            quantity: newQty,
            subtotal: newQty * unitPrice - discountAmt,
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
            const discountAmt = item.discountAmount || 0;
            return {
              ...item,
              quantity,
              subtotal: quantity * item.unitPrice - discountAmt,
            };
          }
          return item;
        });
        set({ items: updatedItems });
      },

      setItemNotes: (productId, notes) => {
        set({
          items: get().items.map((item) => (item.productId === productId ? { ...item, notes } : item)),
        });
      },

      setCustomerInfo: (name, table, customerId, customerTier) => {
        set({
          customerName: name,
          tableNumber: table || get().tableNumber,
          customerId: customerId || get().customerId,
          customerTier: customerTier || get().customerTier,
        });
      },

      setOrderChannel: (channel) => {
        set({ orderChannel: channel });
      },

      setDiscount: (mode, value) => {
        set({ discountMode: mode, discountValue: Math.max(0, value) });
      },

      setTax: (mode, value) => {
        set({ taxMode: mode, taxValue: Math.max(0, value) });
      },

      setServiceChargeRate: (rate) => {
        set({ serviceChargeRate: Math.max(0, rate) });
      },

      setRoundingMethod: (method) => {
        set({ roundingMethod: method });
      },

      addPayment: (payment) => {
        set({ payments: [...get().payments, payment] });
      },

      removePayment: (index) => {
        set({ payments: get().payments.filter((_, idx) => idx !== index) });
      },

      clearCart: () => {
        set({
          items: [],
          payments: [],
          customerName: 'Walk-in Guest',
          customerId: undefined,
          customerTier: undefined,
          tableNumber: 'Take Away',
          notes: '',
          discountValue: 0,
        });
      },

      holdCurrentOrder: (customParams) => {
        const subtotal = get().getSubtotal();
        const discount = get().getTotalDiscount();
        const tax = get().getTaxAmount();
        const grandTotal = get().getGrandTotal();

        const held: HeldOrder = {
          id: `hold-${Date.now().toString().slice(-4)}`,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          items: [...get().items],
          customerId: customParams?.customerId || get().customerId,
          customerName: customParams?.name || get().customerName || 'Walk-in Guest',
          customerTier: customParams?.customerTier || get().customerTier,
          tableNumber: customParams?.table || get().tableNumber || 'Table 01',
          orderChannel: get().orderChannel,
          subtotal,
          discount,
          tax,
          grandTotal,
          notes: customParams?.notes || get().notes,
        };

        set({
          heldOrders: [held, ...get().heldOrders],
          items: [],
          payments: [],
          customerName: 'Walk-in Guest',
          customerId: undefined,
          customerTier: undefined,
          tableNumber: 'Table 01',
          notes: '',
          discountValue: 0,
        });

        return held;
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
          orderChannel: held.orderChannel || 'DINE_IN',
          notes: held.notes || '',
          payments: [],
          heldOrders: get().heldOrders.filter((h) => h.id !== heldId),
        });
      },

      deleteHeldOrder: (heldId) => {
        set({ heldOrders: get().heldOrders.filter((h) => h.id !== heldId) });
      },

      // Calculations
      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
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
        return taxValue;
      },

      getServiceChargeAmount: () => {
        const taxable = get().getTaxableAmount();
        return Math.round((taxable * get().serviceChargeRate) / 100);
      },

      getRoundingAmount: () => {
        const rawTotal = get().getTaxableAmount() + get().getTaxAmount() + get().getServiceChargeAmount();
        const { roundingMethod } = get();

        if (roundingMethod === 'round_100') {
          const remainder = rawTotal % 100;
          return remainder === 0 ? 0 : 100 - remainder;
        }
        if (roundingMethod === 'round_50') {
          const remainder = rawTotal % 50;
          return remainder === 0 ? 0 : 50 - remainder;
        }
        return 0;
      },

      getGrandTotal: () => {
        return (
          get().getTaxableAmount() +
          get().getTaxAmount() +
          get().getServiceChargeAmount() +
          get().getRoundingAmount()
        );
      },

      getTotalPaid: () => {
        return get().payments.reduce((sum, p) => sum + p.amount, 0);
      },

      getRemainingBalance: () => {
        return Math.max(0, get().getGrandTotal() - get().getTotalPaid());
      },

      getChangeGiven: () => {
        const grandTotal = get().getGrandTotal();
        const totalPaid = get().getTotalPaid();
        return Math.max(0, totalPaid - grandTotal);
      },
    }),
    {
      name: 'modula_pos_cart_store',
    }
  )
);
