/**
 * Component: Pagination
 * Componente de paginação reutilizável
 */

'use client';

import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  className = '',
}) => {
  const pages: (number | string)[] = [];
  const maxVisible = 5;

  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push('...');
      for (let i = totalPages - 3; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(totalPages);
    }
  }

  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {/* Botão Anterior */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-stroke bg-white text-dark transition hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-3 dark:bg-dark-2 dark:text-white"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Números das páginas */}
      {pages.map((page, index) => (
        typeof page === 'number' ? (
          <button
            key={index}
            onClick={() => onPageChange(page)}
            className={`flex h-10 w-10 items-center justify-center rounded-lg border transition ${
              currentPage === page
                ? 'border-primary bg-primary text-white'
                : 'border-stroke bg-white text-dark hover:bg-primary hover:text-white dark:border-dark-3 dark:bg-dark-2 dark:text-white'
            }`}
          >
            {page}
          </button>
        ) : (
          <span key={index} className="flex h-10 w-10 items-center justify-center text-body-color dark:text-dark-6">
            {page}
          </span>
        )
      ))}

      {/* Botão Próximo */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-stroke bg-white text-dark transition hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-3 dark:bg-dark-2 dark:text-white"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

