import { TreinusData } from '@/types/treinus';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TreinusDataState extends TreinusData {
  setData: (sheet: TreinusData | null) => void;
  clearData: () => void;
}

export const useTreinusDataStore = create<TreinusDataState>()(
  persist(
    (set) => ({
      Athlete: null,
      PeriodizationView: null,
      setData: (sheet) => set({
        Athlete: sheet?.Athlete,
        PeriodizationView: sheet?.PeriodizationView,
      }),
      clearData: () => set({ Athlete: null, PeriodizationView: null }),
    }),
    { name: 'treinus-sheet-data' }
  )
);