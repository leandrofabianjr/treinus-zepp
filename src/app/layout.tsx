import { Navbar } from '@/components/Navbar';
import { isTreinusAuthenticated } from '@/lib/treinus-login';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Treinus - Zepp',
  description: 'Dashboard de Treinos',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hasSession = await isTreinusAuthenticated();
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.className} antialiased min-h-screen flex flex-col`}
      >
        <Navbar isAuthenticated={hasSession} />

        <main className="grow max-w-7xl w-full mx-auto px-4 py-6">
          {children}
        </main>

        <footer className="py-6 border-t border-zinc-100 dark:border-zinc-900 text-center text-sm text-zinc-500">
          leandrofabianjr - {new Date().getFullYear()}
        </footer>
      </body>
    </html>
  );
}
