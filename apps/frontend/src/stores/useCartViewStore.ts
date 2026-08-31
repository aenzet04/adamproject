import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartLayoutStyle =
  | 'card' // Modern Sleek Cards
  | 'compact_list' // High-Density Supermarket / Retail List
  | 'visual_grid' // Media / Icon Grid View
  | 'kitchen_kds' // Kitchen / Barista Ticket Mode (Emphasis on cooking notes)
  | 'accounting_detail'; // Audit & Tax Detailed Breakdown (SKU, Unit Cost, Tax)

export type CartPosition = 'right_sidebar' | 'bottom_drawer' | 'split_equal';
export type CartDensity = 'comfortable' | 'compact' | 'touch_large';

interface CartViewState {
  layoutStyle: CartLayoutStyle;
  position: CartPosition;
  density: CartDensity;
  groupByCategory: boolean;
  alwaysShowNotes: boolean;
  showSkuBarcode: boolean;
  showCogsMargin: boolean;

  // Actions
  setLayoutStyle: (style: CartLayoutStyle) => void;
  setPosition: (pos: CartPosition) => void;
  setDensity: (density: CartDensity) => void;
  toggleGroupByCategory: () => void;
  toggleAlwaysShowNotes: () => void;
  toggleShowSkuBarcode: () => void;
  toggleShowCogsMargin: () => void;
}

export const useCartViewStore = create<CartViewState>()(
  persist(
    (set, get) => ({
      layoutStyle: 'card',
      position: 'right_sidebar',
      density: 'comfortable',
      groupByCategory: false,
      alwaysShowNotes: true,
      showSkuBarcode: false,
      showCogsMargin: false,

      setLayoutStyle: (style) => set({ layoutStyle: style }),
      setPosition: (pos) => set({ position: pos }),
      setDensity: (density) => set({ density }),
      toggleGroupByCategory: () => set({ groupByCategory: !get().groupByCategory }),
      toggleAlwaysShowNotes: () => set({ alwaysShowNotes: !get().alwaysShowNotes }),
      toggleShowSkuBarcode: () => set({ showSkuBarcode: !get().showSkuBarcode }),
      toggleShowCogsMargin: () => set({ showCogsMargin: !get().showCogsMargin }),
    }),
    {
      name: 'modula_cart_view_preferences',
    }
  )
);
