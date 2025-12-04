/**
 * Middleware: Proteção de Rotas
 * Valida autenticação e permissões baseadas em roles
 * 
 * NOTA: Rotas /guest/* (incluindo /guest/portal) NÃO passam por este middleware
 * e usam APENAS localStorage para autenticação, sem Next Auth
 */

import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Se for rota guest, permite acesso sem verificar Next Auth
    // Essas rotas usam apenas localStorage
    if (req.nextUrl.pathname.startsWith('/guest')) {
      return NextResponse.next();
    }

    const token = req.nextauth.token;
    const roles = (token?.roles as string[]) || [];
    
    const isAdmin = roles.includes('Admin');
    const isManager = roles.includes('Manager');
    const isEmployee = roles.includes('Employee');

    // Proteger rotas admin
    if (req.nextUrl.pathname.startsWith('/admin')) {
      if (!isAdmin) {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    }

    // Proteger criação/edição (requer Manager ou Admin)
    const managementPaths = ['/new', '/edit'];
    const isManagementPath = managementPaths.some(path => 
      req.nextUrl.pathname.includes(path)
    );

    if (isManagementPath && !isManager && !isAdmin) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    // Permitir acesso
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Rotas guest não passam por autorização do Next Auth
        if (req.nextUrl.pathname.startsWith('/guest')) {
          return true;
        }

        // Verificar se está autenticado para outras rotas
        const isAuthenticated = !!token;
        return isAuthenticated;
      },
    },
  }
);

// Configurar quais rotas devem passar pelo middleware
// NOTA: /guest/* NÃO está incluído aqui, então não passa pelo middleware Next Auth
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/hotels/:path*',
    '/rooms/:path*',
    '/bookings/:path*',
    '/guests/:path*',
    '/admin/:path*',
    // Explicitamente EXCLUÍDO: '/guest/:path*' - usa apenas localStorage
  ],
};

