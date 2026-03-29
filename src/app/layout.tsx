import { Navbar } from '@/components/Navbar';
import { isTreinusAuthenticated } from '@/lib/treinus-login';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Treinus - Zepp',
  description:
    'Sincronize seus treinos da Treinus com relógios Amazfit de forma automática.',
  keywords: ['Treinus', 'Zepp', 'Amazfit', 'Corrida', 'Treino Estruturado'],
  authors: [{ name: 'Leandro Fabian Jr.' }],

  openGraph: {
    title: 'Treinus - Zepp',
    description:
      'Converta sua planilha Treinus em treinos estruturados para o app Zepp.',
    url: 'https://treinus-zepp.vercel.app',
    siteName: 'Treinus Zepp Sync',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Treinus - Zepp',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },

  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'Treinus - Zepp',
    description: 'Sincronize sua planilha Treinus com seu Amazfit em segundos.',
    images: ['/logo.png'],
  },

  // Ícones do Navegador
  icons: {
    icon: '/favicon.ico',
    apple: '/logo.png',
  },
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
