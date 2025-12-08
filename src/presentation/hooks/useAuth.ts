

'use client';

import { useState, useCallback } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { IAuthService } from '@/domain/services/IAuthService';
import { LoginRequest, RegisterRequest } from '@/domain/repositories/IAuthRepository';

export const useAuth = (authService: IAuthService) => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (credentials: LoginRequest) => {
    setLoading(true);
    setError(null);

    try {
      const result = await authService.login(credentials);
      await signIn('credentials', {
        ...credentials,
        redirect: false
      });
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao fazer login';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [authService]);

  const register = useCallback(async (data: RegisterRequest) => {
    setLoading(true);
    setError(null);

    try {
      return await authService.register(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao registrar';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [authService]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authService.logout();
      await signOut({ redirect: false });
    } finally {
      setLoading(false);
    }
  }, [authService]);

  return {
    session,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading' || loading,
    error,
    login,
    register,
    logout,
  };
};

