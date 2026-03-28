'use client';

import { useTreinusStore } from '@/store/useTreinusStore';
import { TreinusExercise } from '@/types/treinus';
import { Activity, Calendar } from 'lucide-react';
import { TreinoCard } from './TreinoCard';

export function TreinosPlanejados() {
  const { exerciseSheet, lastUpdate } = useTreinusStore();
  const treinos = exerciseSheet?.PeriodizationView?.ExercisesPlan || [];

  if (!lastUpdate) return null;

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
            Treinos Planejados
          </h3>
        </div>
        <span className="text-xs font-medium text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-full">
          {treinos.length} treinos na planilha
        </span>
      </div>

      {treinos.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-1">
          {treinos.map((treino: TreinusExercise, index: number) => (
            <TreinoCard key={treino.IdExercise || index} treino={treino} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
          <Calendar className="w-10 h-10 text-zinc-300 mb-4" />
          <p className="text-zinc-500 dark:text-zinc-400 font-medium text-center">
            Nenhuma atividade planejada encontrada.
          </p>
        </div>
      )}
    </div>
  );
}
