/**
 * Component: WeekBookingsPagination
 * Componente de paginação específico para reservas da semana
 * SOLID - Single Responsibility: Apenas paginação de reservas da semana
 */

'use client';

import React from 'react';
import { Pagination } from '@/presentation/components/common/Pagination';

interface WeekBookingsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
  className?: string;
}

export const WeekBookingsPagination: React.FC<WeekBookingsPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {/* Informação de paginação */}
      <div className="text-sm text-body-color dark:text-dark-6">
        Mostrando <span className="font-semibold text-dark dark:text-white">{startItem}</span> até{' '}
        <span className="font-semibold text-dark dark:text-white">{endItem}</span> de{' '}
        <span className="font-semibold text-dark dark:text-white">{totalItems}</span> reservas
      </div>

      {/* Componente de paginação */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};




