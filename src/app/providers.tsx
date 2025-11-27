'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Verifica se é rota guest de forma síncrona (funciona tanto no servidor quanto no cliente)
  const isGuestRoute = useMemo(() => {
    // Prioriza pathname (mais confiável no Next.js)
    if (pathname) {
      return pathname.startsWith('/guest');
    }
    // Fallback para window.location se pathname não estiver disponível (apenas no cliente)
    if (typeof window !== 'undefined') {
      return window.location.pathname.startsWith('/guest');
    }
    // Durante SSR sem pathname, assume que não é rota guest
    // (mas isso não deve acontecer, pois pathname sempre está disponível)
    return false;
  }, [pathname]);

  // Para rotas guest, NUNCA usa SessionProvider (evita chamadas para /api/auth/session)
  // Isso garante que nenhuma chamada para /api/auth/session seja feita
  if (isGuestRoute) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    );
  }

  // Para outras rotas, usa SessionProvider mas com refetch desabilitado
  return (
    <SessionProvider 
      refetchInterval={0} 
      refetchOnWindowFocus={false}
      refetchWhenOffline={false}
    >
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}

