import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SmartItems {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface SmartItemsState {
  smartItems: SmartItems | null;
  lastUpdate: string | null;
  setSmartItems: (data: SmartItems) => void;
  clearSmartItems: () => void;
}

export const useSmartItemsStore = create<SmartItemsState>()(
  persist(
    (set) => ({
      smartItems: null,
      lastUpdate: null,
      setSmartItems: (data) => set({
        smartItems: data,
        lastUpdate: new Date().toISOString()
      }),
      clearSmartItems: () => set({ smartItems: null, lastUpdate: null }),
    }),
    {
      name: 'treinus-smart-items', // Chave no localStorage
    }
  )
);