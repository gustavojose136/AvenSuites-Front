/**
 * Context: AuthContext
 * Contexto global para autenticação
 * Princípio: Single Responsibility - Gerencia apenas estado de autenticação
 */

'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { IAuthService } from '@/domain/services/IAuthService';
import { useAuth } from '../hooks/useAuth';

interface AuthContextType {
  session: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: any) => Promise<any>;
  register: (data: any) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
  authService: IAuthService;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, authService }) => {
  const auth = useAuth(authService);

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};

