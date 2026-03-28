'use client';

import { logoutTreinusAction } from '@/actions/treinus';
import { useTreinusDataStore } from '@/store/useTreinusDataStore';
import { useTreinusSessionStore } from '@/store/useTreinusSessionStore';
import { LogOut } from 'lucide-react';
import React from 'react';

export function LogoutButton() {
  // Pegamos as funções de limpeza dos dois novos stores
  const clearSession = useTreinusSessionStore((state) => state.clearSession);
  const clearSheet = useTreinusDataStore((state) => state.clearData);

  const [isPending, startTransition] = React.useTransition();

  const handleLogout = () => {
    // 1. Limpa os caches locais (Zustand / LocalStorage) imediatamente
    clearSession();
    clearSheet();

    // 2. Chama a Server Action para limpar os cookies no servidor e redirecionar
    startTransition(async () => {
      try {
        await logoutTreinusAction();
      } catch (error) {
        // O redirect do Next.js às vezes é interpretado como erro no catch,
        // mas a ação de limpeza no servidor já terá ocorrido.
        console.error('Erro ao processar logout:', error);
      }
    });
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 dark:text-red-400 
                 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all
                 active:scale-95 disabled:opacity-50"
      aria-label="Sair da conta"
    >
      {isPending ? (
        <span className="h-4 w-4 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin" />
      ) : (
        <LogOut className="w-4 h-4" />
      )}
      <span>{isPending ? 'Saindo...' : 'Sair'}</span>
    </button>
  );
}
