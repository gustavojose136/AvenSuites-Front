/**
 * Hook: usePermissions
 * Gerencia permissões e roles do usuário
 */

'use client';

import { useSession } from 'next-auth/react';

export const usePermissions = () => {
  const { data: session, status } = useSession();
  const roles = (session?.roles as string[]) || [];

  const isAuthenticated = status === 'authenticated';
  const isAdmin = roles.includes('Admin');
  const isManager = roles.includes('Manager');
  const isEmployee = roles.includes('Employee');

  /**
   * Verifica se o usuário tem uma role específica
   */
  const hasRole = (role: string): boolean => {
    return roles.includes(role);
  };

  /**
   * Verifica se o usuário tem pelo menos uma das roles especificadas
   */
  const hasAnyRole = (requiredRoles: string[]): boolean => {
    return requiredRoles.some(role => roles.includes(role));
  };

  /**
   * Verifica se o usuário tem todas as roles especificadas
   */
  const hasAllRoles = (requiredRoles: string[]): boolean => {
    return requiredRoles.every(role => roles.includes(role));
  };

  /**
   * Verifica se o usuário pode criar/editar
   */
  const canManage = (): boolean => {
    return isAdmin || isManager;
  };

  /**
   * Verifica se o usuário pode deletar
   */
  const canDelete = (): boolean => {
    return isAdmin;
  };

  /**
   * Verifica se o usuário pode acessar área admin
   */
  const canAccessAdmin = (): boolean => {
    return isAdmin;
  };

  return {
    // Status
    isAuthenticated,
    isLoading: status === 'loading',
    
    // Roles
    roles,
    isAdmin,
    isManager,
    isEmployee,
    
    // Verificações
    hasRole,
    hasAnyRole,
    hasAllRoles,
    
    // Permissões específicas
    canManage,
    canDelete,
    canAccessAdmin,
    
    // Dados do usuário
    user: session?.user,
  };
};

