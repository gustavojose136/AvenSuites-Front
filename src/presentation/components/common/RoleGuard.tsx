

'use client';

import React, { ReactNode } from 'react';
import { usePermissions } from '@/presentation/hooks/usePermissions';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
  fallback?: ReactNode;
  requireAll?: boolean;

}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  fallback = null,
  requireAll = false,
}) => {
  const { hasAnyRole, hasAllRoles, isLoading } = usePermissions();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const hasPermission = requireAll
    ? hasAllRoles(allowedRoles)
    : hasAnyRole(allowedRoles);

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

