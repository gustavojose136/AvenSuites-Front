

export const AuthHelper = {

  isGuestLoggedIn(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('guestToken');
  },

  getGuestUser(): any | null {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('guestUser');
    return user ? JSON.parse(user) : null;
  },

  getGuestToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('guestToken');
  },

  getGuestIdFromToken(): string | null {
    if (typeof window === 'undefined') return null;

    const token = this.getGuestToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

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

  clearGuestSession(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('guestToken');
    localStorage.removeItem('guestUser');
  },

  saveGuestSession(token: string, user: any): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('guestToken', token);
    localStorage.setItem('guestUser', JSON.stringify(user));
  },

  isGuestRoute(): boolean {
    if (typeof window === 'undefined') return false;
    return window.location.pathname.startsWith('/guest');
  },

  debugSession(): void {
    if (typeof window === 'undefined') return;

  }
};

