'use client';

import { loginTreinusAction } from '@/actions/treinus';
import { AlertCircle, Loader2, Lock, Mail } from 'lucide-react';
import React from 'react';

export function LoginForm() {
  const [isPending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email') as string;
    const password = data.get('password') as string;

    startTransition(async () => {
      setError(null);
      try {
        await loginTreinusAction({ email, password });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Credenciais inválidas ou erro de conexão.',
        );
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl transition-all">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Bem-vindo
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Acesse sua conta do Treinus para sincronizar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Campo de Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
              <Mail className="w-4 h-4" /> Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="exemplo@gmail.com"
              required
              disabled={isPending}
              className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all
                         disabled:opacity-50 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
            />
          </div>

          {/* Campo de Senha */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
              <Lock className="w-4 h-4" /> Senha
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              required
              disabled={isPending}
              className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all
                         disabled:opacity-50 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
            />
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          {/* Botão de Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg
                       transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 shadow-md shadow-blue-500/20"
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Autenticando...
              </>
            ) : (
              'Entrar no Treinus'
            )}
          </button>
        </form>

        <p className="text-center text-xs text-zinc-500 dark:text-zinc-500 pt-4">
          Suas credenciais são enviadas diretamente ao Treinus.
        </p>
      </div>
    </div>
  );
}
