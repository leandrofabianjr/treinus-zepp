'use client';

import { fetchTreinusData } from '@/actions/treinus';
import { useTreinusStore } from '@/store/useTreinusStore';
import { useRouter } from 'next/navigation';
import React from 'react';

export function TreinusDataState() {
  const { setTreinusData, clearTreinusData, lastUpdate, ...treinusData } =
    useTreinusStore();
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();

  const handleUpdate = () => {
    startTransition(async () => {
      const result = await fetchTreinusData();

      if (result.success) {
        setTreinusData(result.data!);
      } else {
        clearTreinusData();
        router.push('/login');
      }
    });
  };

  React.useEffect(() => {
    if (!treinusData) {
      handleUpdate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [treinusData]);

  return (
    <div className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm bg-white dark:bg-zinc-950 transition-colors">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Dados do Treinus
          </h2>
          {lastUpdate && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Sincronizado em: {new Date(lastUpdate).toLocaleString('pt-BR')}
            </p>
          )}
        </div>

        <button
          onClick={handleUpdate}
          disabled={isPending}
          className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-lg 
                     hover:bg-blue-700 dark:hover:bg-blue-600 
                     active:scale-95 disabled:opacity-50 disabled:pointer-events-none
                     transition-all duration-200 shadow-sm"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sincronizando...
            </span>
          ) : (
            'Atualizar SmartItems'
          )}
        </button>
      </div>

      <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-lg p-4 border border-zinc-100 dark:border-zinc-800">
        {treinusData ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Dados carregados com sucesso
              </span>
            </div>
            <p className="text-xs font-mono text-zinc-500 dark:text-zinc-500">
              Payload: {(JSON.stringify(treinusData).length / 1024).toFixed(2)}{' '}
              KB
            </p>
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-zinc-500 dark:text-zinc-400 italic">
              Nenhum dado em cache. Aguardando sincronização...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
