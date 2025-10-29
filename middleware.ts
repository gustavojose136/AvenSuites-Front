/**
 * Middleware: Proteção de Rotas
 * Valida autenticação e permissões baseadas em roles
 */

import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const roles = (token?.roles as string[]) || [];
    
    const isAdmin = roles.includes('Admin');
    const isManager = roles.includes('Manager');
    const isEmployee = roles.includes('Employee');

    console.log('🔐 Middleware:', {
      path: req.nextUrl.pathname,
      roles,
      isAdmin,
      isManager,
    });

    // Proteger rotas admin
    if (req.nextUrl.pathname.startsWith('/admin')) {
      if (!isAdmin) {
        console.log('❌ Acesso negado: Admin required');
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    }

    // Proteger criação/edição (requer Manager ou Admin)
    const managementPaths = ['/new', '/edit'];
    const isManagementPath = managementPaths.some(path => 
      req.nextUrl.pathname.includes(path)
    );

    if (isManagementPath && !isManager && !isAdmin) {
      console.log('❌ Acesso negado: Manager ou Admin required');
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    // Permitir acesso
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Verificar se está autenticado
        const isAuthenticated = !!token;
        console.log('🔑 Autorização:', { isAuthenticated });
        return isAuthenticated;
      },
    },
  }
);

// Configurar quais rotas devem passar pelo middleware
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/hotels/:path*',
    '/rooms/:path*',
    '/bookings/:path*',
    '/guests/:path*',
    '/admin/:path*',
  ],
};

