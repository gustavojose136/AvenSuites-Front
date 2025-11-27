/**
 * Helper para gerenciar autenticação de Admin e Guest
 */

export const AuthHelper = {
  /**
   * Verifica se há um Guest logado
   */
  isGuestLoggedIn(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('guestToken');
  },

  /**
   * Obtém os dados do Guest logado
   */
  getGuestUser(): any | null {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('guestUser');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Obtém o token do Guest
   */
  getGuestToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('guestToken');
  },

  /**
   * Extrai o GuestId do token JWT
   */
  getGuestIdFromToken(): string | null {
    if (typeof window === 'undefined') return null;
    
    const token = this.getGuestToken();
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // Tenta diferentes formatos de guestId no token
      return payload.GuestId || 
             payload.guestId || 
             payload.sub || 
             payload.userId ||
             payload.id ||
             null;
    } catch (e) {
      console.error('❌ Erro ao extrair GuestId do token:', e);
      return null;
    }
  },

  /**
   * Limpa a sessão do Guest
   */
  clearGuestSession(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('guestToken');
    localStorage.removeItem('guestUser');
    console.log('🔓 Sessão Guest limpa');
  },

  /**
   * Salva a sessão do Guest
   */
  saveGuestSession(token: string, user: any): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('guestToken', token);
    localStorage.setItem('guestUser', JSON.stringify(user));
    console.log('✅ Sessão Guest salva');
  },

  /**
   * Verifica se estamos em uma rota de Guest
   */
  isGuestRoute(): boolean {
    if (typeof window === 'undefined') return false;
    return window.location.pathname.startsWith('/guest');
  },

  /**
   * Debug: mostra informações da sessão atual
   */
  debugSession(): void {
    if (typeof window === 'undefined') return;
    
    console.group('🔍 Auth Debug');
    console.log('Rota atual:', window.location.pathname);
    console.log('É rota Guest?', this.isGuestRoute());
    console.log('Guest logado?', this.isGuestLoggedIn());
    
    if (this.isGuestLoggedIn()) {
      const user = this.getGuestUser();
      console.log('Guest User:', {
        id: user?.id,
        name: user?.name,
        email: user?.email,
      });
    }
    
    console.groupEnd();
  }
};

