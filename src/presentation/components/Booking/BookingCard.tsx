/**
 * Component: BookingCard
 * Card de reserva com ações
 * SOLID - Single Responsibility: Apenas exibição de card
 */

'use client';

import React from 'react';
import { Booking } from '@/application/dto/Booking.dto';
import { formatDate, formatCurrency, getStatusColor, getStatusLabel } from './utils/bookingFormatters';

interface BookingCardProps {
  booking: Booking;
  onCancel?: (id: string) => void;
  onConfirm?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({ 
  booking, 
  onCancel, 
  onConfirm,
  onViewDetails 
}) => {

  return (
    <div className="rounded-lg border border-stroke bg-white p-6 shadow-sm dark:border-dark-3 dark:bg-dark-2">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-dark dark:text-white">
            Reserva #{booking.code || booking.id.substring(0, 8)}
          </h4>
          <p className="text-sm text-body-color dark:text-dark-6">
            ID: {booking.id.substring(0, 8)}...
          </p>
          {/* Informações do Hóspede */}
          {booking.mainGuest && (
            <div className="mt-2 space-y-1 border-t border-stroke pt-2 dark:border-dark-3">
              <div className="text-sm font-medium text-dark dark:text-white">
                {booking.mainGuest.fullName || 'Hóspede não informado'}
              </div>
              {booking.mainGuest.email && (
                <div className="flex items-center gap-1 text-xs text-body-color dark:text-dark-6">
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="truncate">{booking.mainGuest.email}</span>
                </div>
              )}
              {booking.mainGuest.phone && (
                <div className="flex items-center gap-1 text-xs text-body-color dark:text-dark-6">
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{booking.mainGuest.phone}</span>
                </div>
              )}
            </div>
          )}
        </div>
        <span className={`inline-block rounded px-3 py-1 text-xs font-medium ${getStatusColor(booking.status)}`}>
          {getStatusLabel(booking.status)}
        </span>
      </div>

      <div className="mb-4 space-y-2 border-t border-stroke pt-4 dark:border-dark-3">
        <div className="flex justify-between text-sm">
          <span className="text-body-color dark:text-dark-6">Check-in:</span>
          <span className="font-medium text-dark dark:text-white">
            {formatDate(booking.checkInDate)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-body-color dark:text-dark-6">Check-out:</span>
          <span className="font-medium text-dark dark:text-white">
            {formatDate(booking.checkOutDate)}
          </span>
        </div>
        {booking.totalAmount && (
          <div className="flex justify-between text-sm">
            <span className="text-body-color dark:text-dark-6">Total:</span>
            <span className="font-semibold text-primary">
              {formatCurrency(booking.totalAmount, booking.currency || 'BRL')}
            </span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-body-color dark:text-dark-6">Hóspedes:</span>
          <span className="font-medium text-dark dark:text-white">
            {booking.adults + (booking.children || 0)} pessoa(s)
            {booking.children > 0 && (
              <span className="text-xs text-body-color dark:text-dark-6 ml-1">
                ({booking.adults} adultos, {booking.children} crianças)
              </span>
            )}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        {onViewDetails && (
          <button
            onClick={() => onViewDetails(booking.id)}
            className="flex-1 rounded bg-primary/10 px-4 py-2 text-center text-sm font-medium text-primary hover:bg-primary/20"
          >
            Ver Detalhes
          </button>
        )}
        
        {booking.status.toUpperCase() === 'PENDING' && onConfirm && (
          <button
            onClick={() => onConfirm(booking.id)}
            className="rounded bg-green-100 px-4 py-2 text-sm font-medium text-green-600 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
          >
            Confirmar
          </button>
        )}
        
        {['PENDING', 'CONFIRMED'].includes(booking.status.toUpperCase()) && onCancel && (
          <button
            onClick={() => onCancel(booking.id)}
            className="rounded bg-red-100 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
          >
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
};

