import { create } from 'zustand';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  description?: string;
  icon?: string;
}

interface ToastState {
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newToast = { ...toast, id };
    set((state) => ({ toasts: [...state.toasts, newToast] }));

    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 3800);
  },
  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },
}));

// Quick helpers for actions
export const toast = {
  success: (title: string, description?: string, icon = '✓') =>
    useToastStore.getState().addToast({ type: 'success', title, description, icon }),
  info: (title: string, description?: string, icon = 'ℹ️') =>
    useToastStore.getState().addToast({ type: 'info', title, description, icon }),
  warning: (title: string, description?: string, icon = '⚠️') =>
    useToastStore.getState().addToast({ type: 'warning', title, description, icon }),
  error: (title: string, description?: string, icon = '✕') =>
    useToastStore.getState().addToast({ type: 'error', title, description, icon }),
  cart: (productName: string) =>
    useToastStore.getState().addToast({
      type: 'success',
      title: 'Ditambahkan ke Keranjang',
      description: `${productName} siap diproses.`,
      icon: '🛒',
    }),
  payment: (orderNo: string, amount: number) =>
    useToastStore.getState().addToast({
      type: 'success',
      title: 'Pembayaran Sukses (Lunas)',
      description: `Nota: ${orderNo} • Rp ${amount.toLocaleString('id-ID')}`,
      icon: '💳',
    }),
  print: (type: string) =>
    useToastStore.getState().addToast({
      type: 'info',
      title: `Mencetak ${type}...`,
      description: 'Perintah dikirim ke printer thermal 58mm.',
      icon: '🖨️',
    }),
};
