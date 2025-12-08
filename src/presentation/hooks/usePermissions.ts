

'use client';

import { useSession } from 'next-auth/react';

export const usePermissions = () => {
  const { data: session, status } = useSession();
  const roles = (session?.roles as string[]) || [];

  const isAuthenticated = status === 'authenticated';
  const isAdmin = roles.includes('Admin');
  const isManager = roles.includes('Manager');
  const isEmployee = roles.includes('Employee');

  const hasRole = (role: string): boolean => {
    return roles.includes(role);
  };

  const hasAnyRole = (requiredRoles: string[]): boolean => {
    return requiredRoles.some(role => roles.includes(role));
  };

  const hasAllRoles = (requiredRoles: string[]): boolean => {
    return requiredRoles.every(role => roles.includes(role));
  };

  const canManage = (): boolean => {
    return isAdmin || isManager;
  };

  const canDelete = (): boolean => {
    return isAdmin;
  };

  const canAccessAdmin = (): boolean => {
    return isAdmin;
  };

  return {

    isAuthenticated,
    isLoading: status === 'loading',

    roles,
    isAdmin,
    isManager,
    isEmployee,

    hasRole,
    hasAnyRole,
    hasAllRoles,

    canManage,
    canDelete,
    canAccessAdmin,

    user: session?.user,
  };
};

