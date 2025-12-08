'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isGuestRoute = useMemo(() => {

    if (pathname) {
      return pathname.startsWith('/guest');
    }

    if (typeof window !== 'undefined') {
      return window.location.pathname.startsWith('/guest');
    }

    return false;
  }, [pathname]);

  if (isGuestRoute) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    );
  }

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

