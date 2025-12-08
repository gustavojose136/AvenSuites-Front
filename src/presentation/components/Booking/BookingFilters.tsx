

'use client';

import React from 'react';

interface Hotel {
  id: string;
  tradingName: string;
  city: string;
  state: string;
}

interface BookingFiltersProps {
  hotels: Hotel[];
  selectedHotelId: string;
  statusFilter: string;
  searchTerm: string;
  viewMode: 'cards' | 'table';
  onHotelChange: (hotelId: string) => void;
  onStatusChange: (status: string) => void;
  onSearchChange: (term: string) => void;
  onViewModeChange: (mode: 'cards' | 'table') => void;
}

export const BookingFilters: React.FC<BookingFiltersProps> = ({
  hotels,
  selectedHotelId,
  statusFilter,
  searchTerm,
  viewMode,
  onHotelChange,
  onStatusChange,
  onSearchChange,
  onViewModeChange,
}) => {
  return (
    <div className="mb-6 rounded-lg border border-stroke bg-white p-6 shadow-sm dark:border-dark-3 dark:bg-dark-2">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {}
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por código, hóspede ou ID..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-lg border-2 border-gray-300 bg-white py-3 pl-12 pr-4 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
            <svg
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-body-color"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {}
        <div>
          <select
            value={selectedHotelId}
            onChange={(e) => onHotelChange(e.target.value)}
            className="rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          >
            <option value="all">Todos os Hotéis</option>
            {hotels.map((hotel) => (
              <option key={hotel.id} value={hotel.id}>
                {hotel.tradingName}
              </option>
            ))}
          </select>
        </div>

        {}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          >
            <option value="all">Todos os Status</option>
            <option value="PENDING">Pendente</option>
            <option value="CONFIRMED">Confirmada</option>
            <option value="CHECKED_IN">Check-in Realizado</option>
            <option value="CHECKED_OUT">Check-out Realizado</option>
            <option value="CANCELLED">Cancelada</option>
            <option value="NO_SHOW">Não Compareceu</option>
          </select>
        </div>

        {}
        <div className="flex gap-2 rounded-lg border-2 border-gray-300 p-1 dark:border-dark-3">
          <button
            onClick={() => onViewModeChange('cards')}
            className={`rounded px-3 py-2 text-sm font-medium transition ${
              viewMode === 'cards'
                ? 'bg-primary text-white'
                : 'text-body-color hover:bg-gray-100 dark:hover:bg-dark-3'
            }`}
          >
            Cards
          </button>
          <button
            onClick={() => onViewModeChange('table')}
            className={`rounded px-3 py-2 text-sm font-medium transition ${
              viewMode === 'table'
                ? 'bg-primary text-white'
                : 'text-body-color hover:bg-gray-100 dark:hover:bg-dark-3'
            }`}
          >
            Tabela
          </button>
        </div>
      </div>
    </div>
  );
};


