/**
 * Component: BookingCard
 * Card de reserva com ações
 */

'use client';

import React from 'react';
import { Booking } from '@/application/dto/Booking.dto';

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
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'CheckedIn':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'CheckedOut':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="rounded-lg border border-stroke bg-white p-6 shadow-sm dark:border-dark-3 dark:bg-dark-2">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h4 className="text-lg font-semibold text-dark dark:text-white">
            Reserva #{booking.bookingCode}
          </h4>
          <p className="text-sm text-body-color dark:text-dark-6">
            ID: {booking.id.substring(0, 8)}...
          </p>
        </div>
        <span className={`inline-block rounded px-3 py-1 text-xs font-medium ${getStatusColor(booking.status)}`}>
          {booking.status}
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
              {formatCurrency(booking.totalAmount)}
            </span>
          </div>
        )}
        {booking.guestCount && (
          <div className="flex justify-between text-sm">
            <span className="text-body-color dark:text-dark-6">Hóspedes:</span>
            <span className="font-medium text-dark dark:text-white">
              {booking.guestCount} pessoa(s)
            </span>
          </div>
        )}
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
        
        {booking.status === 'Pending' && onConfirm && (
          <button
            onClick={() => onConfirm(booking.id)}
            className="rounded bg-green-100 px-4 py-2 text-sm font-medium text-green-600 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
          >
            Confirmar
          </button>
        )}
        
        {['Pending', 'Confirmed'].includes(booking.status) && onCancel && (
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

