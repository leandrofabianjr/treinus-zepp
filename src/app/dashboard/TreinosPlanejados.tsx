'use client';

import { useTreinusDataStore } from '@/store/useTreinusDataStore';
import { useTreinusSessionStore } from '@/store/useTreinusSessionStore';
import { TreinusExercise } from '@/types/treinus';
import { Activity, Calendar } from 'lucide-react';
import React from 'react';
import { TreinoCard } from './TreinoCard';

export function TreinosPlanejados() {
  const periodizationView = useTreinusDataStore(
    (state) => state.PeriodizationView,
  );

  const exercisesPlan = React.useMemo(() => {
    return periodizationView?.ExercisesPlan || [];
  }, [periodizationView]);

  // Usamos o lastSync do SessionStore para saber se já houve alguma carga
  const lastSync = useTreinusSessionStore((state) => state.lastSync);

  // Opcional: Ordenação por data caso a API mude a ordem
  const treinosOrdenados = React.useMemo(() => {
    return [...exercisesPlan].sort(
      (a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime(),
    );
  }, [exercisesPlan]);

  if (!lastSync) return null;

  return (
    <div className="mt-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
            Treinos Planejados
          </h3>
        </div>

        {treinosOrdenados.length > 0 && (
          <span className="text-[10px] font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-700 uppercase tracking-tighter">
            {treinosOrdenados.length} atividades
          </span>
        )}
      </div>

      {treinosOrdenados.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-1">
          {treinosOrdenados.map((treino: TreinusExercise) => (
            <TreinoCard key={treino.IdExercise} treino={treino} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl bg-zinc-50/50 dark:bg-zinc-900/20">
          <Calendar className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mb-4" />
          <div className="text-center">
            <p className="text-zinc-900 dark:text-zinc-100 font-bold">
              Planilha vazia
            </p>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">
              Nenhuma atividade planejada para este período.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
