/**
 * Layout específico para rotas Guest
 * Não usa SessionProvider para evitar chamadas para /api/auth/session
 */

'use client';

import { ThemeProvider } from 'next-themes';

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}






