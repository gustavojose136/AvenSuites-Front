/**
 * Component: BookingList
 * Lista de reservas com filtros
 */

'use client';

import React, { useEffect } from 'react';
import { useBooking } from '@/presentation/hooks/useBooking';
import { container } from '@/shared/di/Container';
import { BookingCard } from './BookingCard';
import { useRouter } from 'next/navigation';

interface BookingListProps {
  hotelId?: string;
  guestId?: string;
}

export const BookingList: React.FC<BookingListProps> = ({ hotelId, guestId }) => {
  const router = useRouter();
  const { 
    bookings, 
    loading, 
    error, 
    fetchBookings, 
    fetchBookingsByHotel,
    fetchBookingsByGuest,
    cancelBooking,
    confirmBooking 
  } = useBooking(container.getBookingService());

  useEffect(() => {
    if (hotelId) {
      fetchBookingsByHotel(hotelId);
    } else if (guestId) {
      fetchBookingsByGuest(guestId);
    } else {
      fetchBookings();
    }
  }, [hotelId, guestId, fetchBookings, fetchBookingsByHotel, fetchBookingsByGuest]);

  const handleCancel = async (id: string) => {
    if (confirm('Deseja realmente cancelar esta reserva?')) {
      try {
        await cancelBooking(id, 'Cancelado pelo usuário');
        alert('Reserva cancelada com sucesso!');
      } catch (err) {
        alert('Erro ao cancelar reserva');
      }
    }
  };

  const handleConfirm = async (id: string) => {
    if (confirm('Deseja confirmar esta reserva?')) {
      try {
        await confirmBooking(id);
        alert('Reserva confirmada com sucesso!');
      } catch (err) {
        alert('Erro ao confirmar reserva');
      }
    }
  };

  const handleViewDetails = (id: string) => {
    router.push(`/bookings/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
        <p className="text-red-800 dark:text-red-200">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-dark dark:text-white">
          Reservas {bookings.length > 0 && `(${bookings.length})`}
        </h3>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-lg border border-stroke bg-white p-8 text-center dark:border-dark-3 dark:bg-dark-2">
          <p className="text-body-color dark:text-dark-6">Nenhuma reserva encontrada</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={handleCancel}
              onConfirm={handleConfirm}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
};

