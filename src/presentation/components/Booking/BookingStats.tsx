/**
 * Component: BookingStats
 * Exibe estatísticas de reservas
 * SOLID - Single Responsibility: Apenas exibição de estatísticas
 */

'use client';

import React from 'react';
import { Booking } from '@/application/dto/Booking.dto';
import { formatCurrency } from './utils/bookingFormatters';

interface BookingStatsProps {
  bookings: Booking[];
}

export const BookingStats: React.FC<BookingStatsProps> = ({ bookings }) => {
  const stats = React.useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter(b => b.status.toUpperCase() === 'PENDING').length;
    const confirmed = bookings.filter(b => b.status.toUpperCase() === 'CONFIRMED').length;
    const cancelled = bookings.filter(b => b.status.toUpperCase() === 'CANCELLED').length;
    const checkedIn = bookings.filter(b => b.status.toUpperCase() === 'CHECKED_IN').length;
    const totalAmount = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const confirmedAmount = bookings
      .filter(b => b.status.toUpperCase() === 'CONFIRMED')
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    return {
      total,
      pending,
      confirmed,
      cancelled,
      checkedIn,
      totalAmount,
      confirmedAmount,
    };
  }, [bookings]);

  return (
    <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-lg">
        <div className="mb-2 text-sm opacity-90">Total de Reservas</div>
        <div className="text-3xl font-bold">{stats.total}</div>
      </div>
      <div className="rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 text-white shadow-lg">
        <div className="mb-2 text-sm opacity-90">Pendentes</div>
        <div className="text-3xl font-bold">{stats.pending}</div>
      </div>
      <div className="rounded-lg bg-gradient-to-br from-green-500 to-green-600 p-6 text-white shadow-lg">
        <div className="mb-2 text-sm opacity-90">Confirmadas</div>
        <div className="text-3xl font-bold">{stats.confirmed}</div>
      </div>
      <div className="rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 text-white shadow-lg">
        <div className="mb-2 text-sm opacity-90">Valor Total Confirmado</div>
        <div className="text-2xl font-bold">
          {formatCurrency(stats.confirmedAmount)}
        </div>
      </div>
    </div>
  );
};








