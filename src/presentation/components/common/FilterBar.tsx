

'use client';

import React from 'react';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterBarProps {
  filters: {
    name: string;
    label: string;
    options: FilterOption[];
    value: string;
  }[];
  onFilterChange: (filterName: string, value: string) => void;
  onClearFilters?: () => void;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  className = '',
}) => {
  const hasActiveFilters = filters.some(f => f.value !== '');

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-dark dark:text-white">Filtros</h3>
        {hasActiveFilters && onClearFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-primary hover:underline"
          >
            Limpar filtros
          </button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filters.map((filter) => (
          <div key={filter.name}>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              {filter.label}
            </label>
            <select
              value={filter.value}
              onChange={(e) => onFilterChange(filter.name, e.target.value)}
              className="w-full rounded-lg border border-stroke bg-white px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            >
              <option value="">Todos</option>
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

