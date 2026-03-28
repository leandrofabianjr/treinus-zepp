import { TreinusSession } from '@/types/treinus';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TreinusSessionState extends TreinusSession {
  lastSync: string | null;
  setSession: (data: TreinusSession) => void;
  clearSession: () => void;
}

export const useTreinusSessionStore = create<TreinusSessionState>()(
  persist(
    (set) => ({
      idTeam: null,
      idAthlete: null,
      smartItems: null,
      lastSync: null,
      setSession: (data) => set({ ...data, lastSync: new Date().toISOString() }),
      clearSession: () => set({ idTeam: null, idAthlete: null, smartItems: null, lastSync: null }),
    }),
    { name: 'treinus-session' }
  )
);