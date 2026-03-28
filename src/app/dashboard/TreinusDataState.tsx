'use client';

import { fetchTreinusData } from '@/actions/treinus';
import { useTreinusDataStore } from '@/store/useTreinusDataStore';
import { useTreinusSessionStore } from '@/store/useTreinusSessionStore';
import { CheckCircle, Database, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

export function TreinusDataState() {
  // Session Store (idTeam, idAthlete, smartItems)
  const { idAthlete, lastSync, setSession, clearSession } =
    useTreinusSessionStore();

  // Data Store (athlete, exercisesPlan, rawSheet)
  const { setData, clearData, ...treinusData } = useTreinusDataStore();

  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();

  const handleUpdate = () => {
    startTransition(async () => {
      const result = await fetchTreinusData();

      if (result.success && result.data) {
        // 1. Distribui para o Store de Sessão
        setSession({
          idTeam: result.data.idTeam,
          idAthlete: result.data.idAthlete,
          smartItems: result.data.smartItems,
        });

        // 2. Distribui para o Store de Dados (Planilha)
        setData(result.data.exerciseSheet);
      } else {
        clearSession();
        clearData();
        router.push('/login');
      }
    });
  };

  // Carrega automaticamente se o ID do atleta não estiver presente
  React.useEffect(() => {
    if (!idAthlete) {
      handleUpdate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idAthlete]);

  // Cálculo de tamanho total dos dados para o debug visual
  const totalPayloadKB = (
    (JSON.stringify(treinusData || {}).length +
      JSON.stringify(idAthlete || {}).length) /
    1024
  ).toFixed(2);

  return (
    <div className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm bg-white dark:bg-zinc-950 transition-all">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <Database className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Sincronização Treinus
            </h2>
            {lastSync && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Última atualização: {new Date(lastSync).toLocaleString('pt-BR')}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={handleUpdate}
          disabled={isPending}
          className="w-full sm:w-auto px-6 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold rounded-xl
                     hover:bg-zinc-800 dark:hover:bg-zinc-200 
                     active:scale-95 disabled:opacity-50 disabled:pointer-events-none
                     transition-all duration-200 shadow-lg shadow-zinc-200 dark:shadow-none flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Sincronizando...
            </>
          ) : (
            'Atualizar Dados'
          )}
        </button>
      </div>

      <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-4 border border-zinc-100 dark:border-zinc-800">
        {idAthlete ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Sessão ativa para o atleta ID:{' '}
                <span className="font-mono text-blue-600 dark:text-blue-400">
                  {idAthlete}
                </span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-zinc-400">
                  Armazenamento
                </span>
                <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400">
                  {totalPayloadKB} KB
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-zinc-400">
                  Status Cache
                </span>
                <span className="text-xs font-semibold text-green-600 dark:text-green-500">
                  Otimizado
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center">
            <p className="text-sm text-zinc-500 dark:text-zinc-400 italic">
              Nenhum dado local encontrado. Clique em atualizar para carregar
              sua planilha.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
