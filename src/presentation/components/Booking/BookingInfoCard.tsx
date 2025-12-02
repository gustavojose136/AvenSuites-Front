/**
 * Component: BookingInfoCard
 * Exibe informações resumidas da reserva
 * SOLID - Single Responsibility: Apenas exibição de informações
 */

'use client';

import React from 'react';
import { Booking } from '@/application/dto/Booking.dto';
import { formatDate, formatCurrency } from './utils/bookingFormatters';

interface BookingInfoCardProps {
  booking: Booking;
}

export const BookingInfoCard: React.FC<BookingInfoCardProps> = ({ booking }) => {
  const nights = React.useMemo(() => {
    const checkIn = new Date(booking.checkInDate);
    const checkOut = new Date(booking.checkOutDate);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [booking.checkInDate, booking.checkOutDate]);

  return (
    <div className="rounded-lg border border-stroke bg-white p-6 shadow-sm dark:border-dark-3 dark:bg-dark-2">
      <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
        Informações da Reserva
      </h3>
      
      <div className="space-y-4">
        {/* Código e Status */}
        <div className="flex items-center justify-between border-b border-stroke pb-4 dark:border-dark-3">
          <div>
            <p className="text-sm text-body-color dark:text-dark-6">Código da Reserva</p>
            <p className="text-lg font-bold text-dark dark:text-white">
              {booking.code || booking.id.substring(0, 8)}
            </p>
          </div>
        </div>

        {/* Datas */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-body-color dark:text-dark-6">Check-in</p>
            <p className="text-base font-medium text-dark dark:text-white">
              {formatDate(booking.checkInDate)}
            </p>
          </div>
          <div>
            <p className="text-sm text-body-color dark:text-dark-6">Check-out</p>
            <p className="text-base font-medium text-dark dark:text-white">
              {formatDate(booking.checkOutDate)}
            </p>
          </div>
        </div>

        {/* Noites */}
        <div>
          <p className="text-sm text-body-color dark:text-dark-6">Período</p>
          <p className="text-base font-medium text-dark dark:text-white">
            {nights} {nights === 1 ? 'noite' : 'noites'}
          </p>
        </div>

        {/* Hóspedes */}
        <div>
          <p className="text-sm text-body-color dark:text-dark-6">Hóspedes</p>
          <p className="text-base font-medium text-dark dark:text-white">
            {booking.adults + (booking.children || 0)} pessoa(s)
            {booking.children > 0 && (
              <span className="ml-2 text-sm text-body-color dark:text-dark-6">
                ({booking.adults} adultos, {booking.children} crianças)
              </span>
            )}
          </p>
        </div>

        {/* Hóspede Principal */}
        {booking.mainGuest && (
          <div>
            <p className="text-sm text-body-color dark:text-dark-6">Hóspede Principal</p>
            <p className="text-base font-medium text-dark dark:text-white">
              {booking.mainGuest.fullName || 'N/A'}
            </p>
            {booking.mainGuest.email && (
              <p className="text-sm text-body-color dark:text-dark-6">
                {booking.mainGuest.email}
              </p>
            )}
          </div>
        )}

        {/* Quartos */}
        {booking.bookingRooms && booking.bookingRooms.length > 0 && (
          <div>
            <p className="mb-2 text-sm text-body-color dark:text-dark-6">Quartos</p>
            <div className="flex flex-wrap gap-2">
              {booking.bookingRooms.map((room, idx) => (
                <span
                  key={idx}
                  className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary dark:bg-primary/20"
                >
                  {room.roomNumber} - {room.roomTypeName}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Valor Total */}
        {booking.totalAmount && (
          <div className="rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 p-4 dark:from-green-900/10 dark:to-emerald-900/10">
            <p className="text-sm text-body-color dark:text-dark-6">Valor Total</p>
            <p className="text-xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(booking.totalAmount, booking.currency || 'BRL')}
            </p>
          </div>
        )}

        {/* Observações */}
        {booking.notes && (
          <div className="rounded-lg border border-stroke bg-gray-50 p-4 dark:border-dark-3 dark:bg-dark-3">
            <p className="mb-2 text-sm font-medium text-body-color dark:text-dark-6">
              Observações
            </p>
            <p className="text-sm text-dark dark:text-white">{booking.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};




