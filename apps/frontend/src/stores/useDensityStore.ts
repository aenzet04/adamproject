import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DensityState {
  viewMode: 'simple' | 'detailed';
  toggleViewMode: () => void;
  setViewMode: (mode: 'simple' | 'detailed') => void;
}

export const useDensityStore = create<DensityState>()(
  persist(
    (set, get) => ({
      viewMode: 'simple',
      toggleViewMode: () => {
        set({ viewMode: get().viewMode === 'simple' ? 'detailed' : 'simple' });
      },
      setViewMode: (mode) => set({ viewMode: mode }),
    }),
    {
      name: 'adam_ui_density_preference',
    }
  )
);
