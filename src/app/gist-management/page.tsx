'use client';

import {
  deleteGistAction,
  listMyAppGistsAction,
} from '@/actions/zepp-management';
import {
  Calendar,
  ExternalLink,
  Inbox,
  Loader2,
  RefreshCcw,
  Share,
  Trash2,
} from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';

export default function GistManagement() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
            <Share className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            Integração GitHub
          </h1>
        </div>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl">
          Gerencie os arquivos temporários criados no seu GitHub Gist. Estes
          arquivos são usados pelo App Zepp para importar seus treinos.
        </p>
      </header>

      <ZeppGistManager />
    </div>
  );
}

export function ZeppGistManager() {
  const [gists, setGists] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const load = () => {
    startTransition(async () => {
      const res = await listMyAppGistsAction();
      if (res.success) {
        setGists(res.data);
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (
      confirm(
        'Tem certeza que deseja remover este treino? O link de importação no Zepp deixará de funcionar.',
      )
    ) {
      setIsDeleting(id);
      const res = await deleteGistAction(id);
      if (res.success) {
        setGists((prev) => prev.filter((g) => g.id !== id));
      } else {
        alert('Erro ao excluir Gist.');
      }
      setIsDeleting(null);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-zinc-50/50 dark:bg-zinc-900/20 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
        <p className="text-zinc-500 font-medium">
          Buscando treinos no GitHub...
        </p>
      </div>
    );
  }

  if (gists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-zinc-50/50 dark:bg-zinc-900/20 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
        <Inbox className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mb-4" />
        <p className="text-zinc-500 font-medium text-center">
          Nenhum treino exportado encontrado.
          <br />
          <span className="text-sm text-zinc-400 font-normal">
            Os treinos que você enviar para o Zepp aparecerão aqui.
          </span>
        </p>
        <button
          onClick={load}
          className="mt-6 flex items-center gap-2 text-sm font-bold text-blue-600"
        >
          <RefreshCcw className="w-4 h-4" /> Atualizar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">
          Treinos Ativos ({gists.length})
        </h3>
        <button
          onClick={load}
          className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-zinc-900"
        >
          <RefreshCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid gap-3">
        {gists.map((gist) => (
          <div
            key={gist.id}
            className="group flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900/50 transition-all"
          >
            <div className="flex flex-col gap-1 min-w-0 pr-4">
              <span className="text-sm font-bold text-zinc-800 dark:text-zinc-100 truncate">
                {gist.description}
              </span>
              <div className="flex items-center gap-3 text-[10px] text-zinc-400 font-medium uppercase tracking-tighter">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(gist.createdAt).toLocaleDateString('pt-BR')}
                </span>
                <span>•</span>
                <span className="font-mono text-[9px]">
                  {gist.id.substring(0, 8)}...
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={gist.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 text-zinc-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
                title="Ver no GitHub"
              >
                <ExternalLink size={18} />
              </a>
              <button
                disabled={isDeleting === gist.id}
                onClick={() => handleDelete(gist.id)}
                className="p-2.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all disabled:opacity-50"
                title="Excluir Gist"
              >
                {isDeleting === gist.id ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Trash2 size={18} />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-[10px] text-zinc-400 pt-4 italic">
        Apenas Gists iniciados com [Treinus-Zepp-App] na descrição são listados
        aqui.
      </p>
    </div>
  );
}
