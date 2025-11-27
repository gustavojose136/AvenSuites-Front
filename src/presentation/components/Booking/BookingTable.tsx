/**
 * Component: BookingTable
 * Tabela de reservas
 * SOLID - Single Responsibility: Apenas exibição em tabela
 */

'use client';

import React from 'react';
import { Booking } from '@/application/dto/Booking.dto';
import { formatDate, formatCurrency, getStatusColor, getStatusLabel } from './utils/bookingFormatters';

interface BookingTableProps {
  bookings: Booking[];
  onViewDetails: (id: string) => void;
  onConfirm?: (id: string) => void;
  onCancel?: (id: string) => void;
}

export const BookingTable: React.FC<BookingTableProps> = ({
  bookings,
  onViewDetails,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-stroke bg-white shadow-sm dark:border-dark-3 dark:bg-dark-2">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-dark-3">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Código
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Hóspede
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Contato
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Check-in
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Check-out
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Hóspedes
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Valor
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Status
            </th>
            <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white dark:divide-dark-3 dark:bg-dark-2">
          {bookings.map((booking) => (
            <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-dark-3">
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-dark dark:text-white">
                {booking.code || booking.id.substring(0, 8)}
              </td>
              <td className="px-6 py-4 text-sm text-body-color dark:text-dark-6">
                <div className="font-medium text-dark dark:text-white">
                  {booking.mainGuest?.fullName || 'N/A'}
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-body-color dark:text-dark-6">
                <div className="space-y-1">
                  {booking.mainGuest?.email && (
                    <div className="flex items-center gap-1 text-xs">
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="truncate">{booking.mainGuest.email}</span>
                    </div>
                  )}
                  {booking.mainGuest?.phone && (
                    <div className="flex items-center gap-1 text-xs">
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{booking.mainGuest.phone}</span>
                    </div>
                  )}
                  {!booking.mainGuest?.email && !booking.mainGuest?.phone && (
                    <span className="text-xs text-gray-400 dark:text-gray-500">Sem contato</span>
                  )}
                </div>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-body-color dark:text-dark-6">
                {formatDate(booking.checkInDate)}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-body-color dark:text-dark-6">
                {formatDate(booking.checkOutDate)}
              </td>
              <td className="px-6 py-4 text-sm text-body-color dark:text-dark-6">
                {booking.adults + (booking.children || 0)} ({booking.adults} adultos
                {booking.children > 0 && `, ${booking.children} crianças`})
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-primary">
                {formatCurrency(booking.totalAmount || 0, booking.currency || 'BRL')}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm">
                <span
                  className={`inline-block rounded px-3 py-1 text-xs font-medium ${getStatusColor(booking.status)}`}
                >
                  {getStatusLabel(booking.status)}
                </span>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onViewDetails(booking.id)}
                    className="text-primary hover:text-primary/80"
                  >
                    Ver
                  </button>
                  {booking.status.toUpperCase() === 'PENDING' && onConfirm && (
                    <button
                      onClick={() => onConfirm(booking.id)}
                      className="text-green-600 hover:text-green-800 dark:text-green-400"
                    >
                      Confirmar
                    </button>
                  )}
                  {['PENDING', 'CONFIRMED'].includes(booking.status.toUpperCase()) && onCancel && (
                    <button
                      onClick={() => onCancel(booking.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

