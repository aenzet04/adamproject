import { create } from 'zustand';
import { playWhatsAppChime } from '../lib/audioSound';

export type ToastType = 'success' | 'cart' | 'payment' | 'print' | 'warning' | 'info' | 'error';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  description?: string;
  icon?: string;
  duration?: number;
}

interface ToastState {
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  addToast: (newToast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const toastItem: ToastMessage = {
      ...newToast,
      id,
      description: newToast.description || newToast.message,
      duration: newToast.duration || 3500,
    };

    // Play crisp WhatsApp-style "ceting" chime
    playWhatsAppChime(0.25);

    set((state) => ({
      toasts: [...state.toasts, toastItem],
    }));

    setTimeout(() => {
      get().removeToast(id);
    }, toastItem.duration);
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));

// Quick helper triggers
export const toast = {
  success: (title: string, message?: string) =>
    useToastStore.getState().addToast({ type: 'success', icon: '✓', title, message, description: message }),
  cart: (productName: string) =>
    useToastStore.getState().addToast({
      type: 'cart',
      icon: '🛒',
      title: 'Item Ditambahkan',
      message: `${productName} masuk ke keranjang.`,
      description: `${productName} masuk ke keranjang.`,
    }),
  payment: (orderNo: string, amount: number) =>
    useToastStore.getState().addToast({
      type: 'payment',
      icon: '💳',
      title: 'Pembayaran Diterima',
      message: `${orderNo} • Rp ${amount.toLocaleString('id-ID')}`,
      description: `${orderNo} • Rp ${amount.toLocaleString('id-ID')}`,
    }),
  print: (title: string, message?: string) =>
    useToastStore.getState().addToast({ type: 'print', icon: '🖨️', title, message, description: message }),
  warning: (title: string, message?: string) =>
    useToastStore.getState().addToast({ type: 'warning', icon: '⚠️', title, message, description: message }),
  info: (title: string, message?: string) =>
    useToastStore.getState().addToast({ type: 'info', icon: 'ℹ️', title, message, description: message }),
  error: (title: string, message?: string) =>
    useToastStore.getState().addToast({ type: 'error', icon: '✕', title, message, description: message }),
};
