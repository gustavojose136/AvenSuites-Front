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

  // Enquanto carrega, mostra um loading sutil (não deixa tela em branco)
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
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

