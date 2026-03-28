'use client';

import { TreinusExercise } from '@/types/treinus';
import { Eye, EyeOff, Map, Clock, CheckCircle2 } from 'lucide-react';
import React, { useState } from 'react';

/**
 * Componente de Card Individual Melhorado (UI Corrigida)
 */
export function TreinoCard({ treino }: { treino: TreinusExercise }) {
  const [isOpen, setIsOpen] = useState(false);

  const dataTreino = new Date(treino.Date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  });

  const [dia, mes] = dataTreino.split(' de ');

  return (
    <div className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all hover:border-blue-400 dark:hover:border-blue-700">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        
        {/* Lado Esquerdo: Data e Info Principal */}
        <div className="flex items-start gap-4 flex-grow w-full">
          {/* Badge de Data */}
          <div className="flex flex-col items-center justify-center min-w-[60px] p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700">
            <span className="text-[10px] uppercase font-bold text-zinc-400">{mes}</span>
            <span className="text-xl font-black text-blue-600 dark:text-blue-400">{dia}</span>
          </div>

          <div className="flex-grow">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {/* Tag de Tipo */}
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 uppercase">
                {treino.TypeName || 'Treino'}
              </span>
              
              {/* NOVA TAG DE STATUS (Não sobrepõe mais) */}
              {treino.Done > 0 && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-green-700 dark:text-green-500 bg-green-100 dark:bg-green-950 px-2 py-0.5 rounded-full uppercase">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Concluído
                </span>
              )}

              {treino.GenreName && (
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest hidden md:inline">
                  • {treino.GenreName}
                </span>
              )}
            </div>

            <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-lg leading-tight">
              {treino.CourseTypeName
                ? `${treino.TypeName}: ${treino.CourseTypeName}`
                : treino.TypeName}
            </h4>

            <div className="flex flex-wrap gap-3 mt-3">
              {treino.Distance > 0 && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                  <Map className="w-3.5 h-3.5" />
                  {treino.Distance} {treino.DistanceUnit}
                </span>
              )}

              {(treino.TimeMinAsString || treino.TimeMaxAsString) && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                  <Clock className="w-3.5 h-3.5" />
                  {treino.TimeMinAsString || '00:00'} - {treino.TimeMaxAsString || 'N/A'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Lado Direito / Botão de Expansão (Mobile Friendly) */}
        <div className="w-full sm:w-auto flex justify-end sm:self-center mt-2 sm:mt-0">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-tighter rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm active:scale-95"
          >
            {isOpen ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{isOpen ? 'Ocultar' : 'Ver Treino'}</span>
          </button>
        </div>
      </div>

      {/* Seção Expansível (Briefing) */}
      <div 
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100 mt-5 pt-5 border-t border-zinc-100 dark:border-zinc-800' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          {treino.Briefing ? (
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 shadow-inner">
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line font-medium">
                {treino.Briefing}
              </p>
            </div>
          ) : (
            <p className="text-xs italic text-zinc-400 text-center py-4">Nenhuma orientação detalhada para este treino.</p>
          )}
        </div>
      </div>
    </div>
  );
}