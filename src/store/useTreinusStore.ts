import { TreinusData } from '@/types/treinus';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TreinusState extends TreinusData {
  lastUpdate: string | null;

  setTreinusData: (data: TreinusData) => void;

  clearTreinusData: () => void;
}

export const useTreinusStore = create<TreinusState>()(
  persist(
    (set) => ({
      idTeam: null,
      idAthlete: null,
      exerciseSheet: null,
      smartItems: null,
      lastUpdate: null,

      setTreinusData: (data) => set({
        idTeam: data.idTeam,
        idAthlete: data.idAthlete,
        exerciseSheet: data.exerciseSheet,
        smartItems: data.smartItems,
        lastUpdate: new Date().toISOString()
      }),

      clearTreinusData: () => set({
        idTeam: null,
        idAthlete: null,
        exerciseSheet: null,
        smartItems: null,
        lastUpdate: null
      }),
    }),
    {
      name: 'treinus-data-storage',
    }
  )
);