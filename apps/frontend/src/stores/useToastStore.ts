import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { playWhatsAppChime, playErrorBuzzerSound } from '../lib/audioSound';

export type ToastType = 'success' | 'cart' | 'payment' | 'print' | 'warning' | 'info' | 'error';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  description?: string;
  icon?: string;
  duration?: number;
  playSound?: boolean;
  createdAt: string;
  read?: boolean;
}

interface ToastState {
  toasts: ToastMessage[];
  notificationHistory: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id' | 'createdAt'>) => void;
  removeToast: (id: string) => void;
  markAllAsRead: () => void;
  clearHistory: () => void;
}

export const useToastStore = create<ToastState>()(
  persist(
    (set, get) => ({
      toasts: [],
      notificationHistory: [],

      addToast: (newToast) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        const toastItem: ToastMessage = {
          ...newToast,
          id,
          description: newToast.description || newToast.message,
          duration: newToast.duration || (newToast.type === 'error' ? 5000 : 3500),
          createdAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          read: false,
        };

        // Sound trigger logic
        if (newToast.playSound && newToast.type !== 'cart') {
          if (newToast.type === 'error' || newToast.type === 'warning') {
            playErrorBuzzerSound(0.4);
          } else {
            playWhatsAppChime(0.25);
          }
        }

        set((state) => ({
          toasts: [...state.toasts, toastItem],
          notificationHistory: [toastItem, ...state.notificationHistory.slice(0, 49)],
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

      markAllAsRead: () => {
        set((state) => ({
          notificationHistory: state.notificationHistory.map((n) => ({ ...n, read: true })),
        }));
      },

      clearHistory: () => {
        set({ notificationHistory: [] });
      },
    }),
    {
      name: 'modula_toast_notifications_store',
    }
  )
);

// Helper shortcuts
export const toast = {
  success: (title: string, message?: string) =>
    useToastStore.getState().addToast({ type: 'success', icon: '✓', title, message, description: message, playSound: true }),
  cart: (productName: string) =>
    useToastStore.getState().addToast({
      type: 'cart',
      icon: '🛒',
      title: 'Item Ditambahkan',
      message: `${productName} masuk ke keranjang.`,
      description: `${productName} masuk ke keranjang.`,
      playSound: false,
    }),
  payment: (orderNo: string, amount: number) =>
    useToastStore.getState().addToast({
      type: 'payment',
      icon: '💳',
      title: 'Pembayaran Diterima',
      message: `${orderNo} • Rp ${amount.toLocaleString('id-ID')}`,
      description: `${orderNo} • Rp ${amount.toLocaleString('id-ID')}`,
      playSound: true,
    }),
  print: (title: string, message?: string) =>
    useToastStore.getState().addToast({ type: 'print', icon: '🖨️', title, message, description: message, playSound: false }),
  warning: (title: string, message?: string) =>
    useToastStore.getState().addToast({ type: 'warning', icon: '⚠️', title, message, description: message, playSound: true }),
  info: (title: string, message?: string) =>
    useToastStore.getState().addToast({ type: 'info', icon: 'ℹ️', title, message, description: message, playSound: true }),
  error: (title: string, message?: string) =>
    useToastStore.getState().addToast({ type: 'error', icon: '🚨', title, message, description: message, playSound: true }),
};
