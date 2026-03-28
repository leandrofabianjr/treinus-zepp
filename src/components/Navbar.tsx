'use client';

import Link from 'next/link';
import { LogoutButton } from './LogoutButton'; // O componente que criamos antes

interface NavbarProps {
  isAuthenticated: boolean;
}

export function Navbar({ isAuthenticated }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold text-blue-600 dark:text-blue-400"
        >
          Treinus <span className="text-zinc-400">/</span> Zepp
        </Link>

        <nav className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-blue-600"
              >
                Dashboard
              </Link>
              <LogoutButton />
            </>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg"
            >
              Entrar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
