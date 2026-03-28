'use client';

import { logoutTreinusAction } from '@/actions/treinus';
import { useTreinusStore } from '@/store/useTreinusStore';

import React from 'react';

export function LogoutButton() {
  const clearSmartItems = useTreinusStore((state) => state.clearTreinusData);
  const [isPending, startTransition] = React.useTransition();

  const handleLogout = () => {
    // 1. Limpa o cache local (Zustand / LocalStorage)
    clearSmartItems();

    // 2. Chama a Server Action para limpar os cookies do servidor
    startTransition(async () => {
      await logoutTreinusAction();
    });
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 
                 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors
                 disabled:opacity-50"
    >
      {isPending ? 'Saindo...' : 'Sair do Treinus'}
    </button>
  );
}
