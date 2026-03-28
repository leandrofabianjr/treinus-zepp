import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  // Substitua pelo nome real do cookie que o Treinus retorna 
  // (Geralmente .ASPXAUTH ou ASP.NET_SessionId)
  const sessionCookie = request.cookies.get('.ASPXAUTH');
  const { pathname } = request.nextUrl;

  // 1. Se o usuário está na raiz "/"
  if (pathname === '/') {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 2. Proteção da rota /dashboard e sub-rotas
  if (pathname.startsWith('/dashboard') && !sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Configura em quais rotas o middleware deve rodar
export const config = {
  matcher: ['/', '/dashboard/:path*'],
};