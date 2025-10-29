/**
 * Component: RoleGuard
 * Exibe conteúdo apenas se o usuário tiver as roles necessárias
 */

'use client';

import React, { ReactNode } from 'react';
import { usePermissions } from '@/presentation/hooks/usePermissions';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
  fallback?: ReactNode;
  requireAll?: boolean; // Se true, precisa ter todas as roles. Se false, precisa ter pelo menos uma
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ 
  children, 
  allowedRoles, 
  fallback = null,
  requireAll = false,
}) => {
  const { hasAnyRole, hasAllRoles, isLoading } = usePermissions();

  // Enquanto carrega, não mostra nada
  if (isLoading) {
    return null;
  }

  // Verifica permissões
  const hasPermission = requireAll 
    ? hasAllRoles(allowedRoles)
    : hasAnyRole(allowedRoles);

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

