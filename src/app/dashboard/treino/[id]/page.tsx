// app/dashboard/treino/[id]/page.tsx
'use client';

import { useTreinusDataStore } from '@/store/useTreinusDataStore';
import { ChevronLeft, Clock, Dumbbell, Map } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

export default function TreinoDetalhesPage() {
  const params = useParams();
  const router = useRouter();
  const exercisesPlan = useTreinusDataStore(
    (state) => state.PeriodizationView?.ExercisesPlan || [],
  );

  // Busca o treino específico dentro do store pelo ID da URL
  const treino = exercisesPlan.find(
    (t) => t.IdExercise.toString() === params.id,
  );

  if (!treino) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-zinc-500">Treino não encontrado no cache.</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-blue-600 font-bold"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Cabeçalho de Navegação */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Voltar para Planilha
      </button>

      {/* Card Principal de Detalhes */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-8 space-y-6">
          {/* Título e Tags */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] font-black uppercase rounded-full">
                {treino.TypeName}
              </span>
              <span className="text-zinc-400 text-xs font-medium uppercase tracking-widest">
                •{' '}
                {new Date(treino.Date).toLocaleDateString('pt-BR', {
                  dateStyle: 'full',
                })}
              </span>
            </div>

            <h1 className="text-4xl font-black text-zinc-900 dark:text-zinc-50 leading-tight">
              {treino.CourseTypeName
                ? `${treino.TypeName}: ${treino.CourseTypeName}`
                : treino.TypeName}
            </h1>
          </div>

          {/* Grid de Métricas */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
              <Map className="w-5 h-5 text-blue-500 mb-2" />
              <p className="text-[10px] uppercase font-bold text-zinc-400">
                Distância
              </p>
              <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {treino.Distance} {treino.DistanceUnit}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
              <Clock className="w-5 h-5 text-purple-500 mb-2" />
              <p className="text-[10px] uppercase font-bold text-zinc-400">
                Duração
              </p>
              <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {treino.TimeMinAsString || 'N/A'}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 col-span-2 md:col-span-1">
              <Dumbbell className="w-5 h-5 text-green-500 mb-2" />
              <p className="text-[10px] uppercase font-bold text-zinc-400">
                Intensidade
              </p>
              <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {treino.Intensity || 'Moderada'}
              </p>
            </div>
          </div>

          {/* Briefing Detalhado */}
          <div className="space-y-4 pt-4">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Instruções do Treinador
            </h2>
            <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 shadow-inner">
              <p className="text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                {treino.Briefing || 'Sem instruções adicionais.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
