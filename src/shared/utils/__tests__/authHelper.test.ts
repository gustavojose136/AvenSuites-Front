/**
 * Testes: Auth Helper
 * Testa funções utilitárias de autenticação
 * SOLID - Single Responsibility: Testa apenas funções de autenticação
 */

import { AuthHelper } from '../authHelper';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('AuthHelper', () => {
  beforeEach(() => {
    localStorage.clear();
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/',
      },
      writable: true,
    });
  });

  describe('isGuestLoggedIn', () => {
    it('deve retornar false quando não há token', () => {
      expect(AuthHelper.isGuestLoggedIn()).toBe(false);
    });

    it('deve retornar true quando há token', () => {
      localStorage.setItem('guestToken', 'test-token');
      expect(AuthHelper.isGuestLoggedIn()).toBe(true);
    });
  });

  describe('getGuestToken', () => {
    it('deve retornar null quando não há token', () => {
      expect(AuthHelper.getGuestToken()).toBeNull();
    });

    it('deve retornar o token quando existe', () => {
      localStorage.setItem('guestToken', 'test-token-123');
      expect(AuthHelper.getGuestToken()).toBe('test-token-123');
    });
  });

  describe('getGuestUser', () => {
    it('deve retornar null quando não há usuário', () => {
      expect(AuthHelper.getGuestUser()).toBeNull();
    });

    it('deve retornar o usuário quando existe', () => {
      const user = { id: '1', name: 'Test User', email: 'test@example.com' };
      localStorage.setItem('guestUser', JSON.stringify(user));
      expect(AuthHelper.getGuestUser()).toEqual(user);
    });
  });

  describe('getGuestIdFromToken', () => {
    it('deve retornar null quando não há token', () => {
      expect(AuthHelper.getGuestIdFromToken()).toBeNull();
    });

    it('deve extrair GuestId do token JWT', () => {
      const payload = { GuestId: 'guest-123', role: 'Guest' };
      const token = `header.${btoa(JSON.stringify(payload))}.signature`;
      localStorage.setItem('guestToken', token);
      expect(AuthHelper.getGuestIdFromToken()).toBe('guest-123');
    });

    it('deve tentar diferentes chaves para guestId', () => {
      const payload = { guestId: 'guest-456', role: 'Guest' };
      const token = `header.${btoa(JSON.stringify(payload))}.signature`;
      localStorage.setItem('guestToken', token);
      expect(AuthHelper.getGuestIdFromToken()).toBe('guest-456');
    });
  });

  describe('saveGuestSession', () => {
    it('deve salvar token e usuário no localStorage', () => {
      const user = { id: '1', name: 'Test' };
      AuthHelper.saveGuestSession('test-token', user);
      expect(localStorage.getItem('guestToken')).toBe('test-token');
      expect(localStorage.getItem('guestUser')).toBe(JSON.stringify(user));
    });
  });

  describe('clearGuestSession', () => {
    it('deve limpar token e usuário do localStorage', () => {
      localStorage.setItem('guestToken', 'test-token');
      localStorage.setItem('guestUser', '{}');
      AuthHelper.clearGuestSession();
      expect(localStorage.getItem('guestToken')).toBeNull();
      expect(localStorage.getItem('guestUser')).toBeNull();
    });
  });

  describe('isGuestRoute', () => {
    it('deve retornar true para rotas /guest', () => {
      window.location.pathname = '/guest/portal';
      expect(AuthHelper.isGuestRoute()).toBe(true);
    });

    it('deve retornar false para outras rotas', () => {
      window.location.pathname = '/dashboard';
      expect(AuthHelper.isGuestRoute()).toBe(false);
    });
  });
});

