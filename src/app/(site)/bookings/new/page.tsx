/**
 * Página: Nova Reserva
 */

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useBooking } from '@/presentation/hooks/useBooking';
import { container } from '@/shared/di/Container';
import { BookingForm } from '@/presentation/components/Booking/BookingForm';
import { showToast } from '@/shared/utils/toast';
import Breadcrumb from '@/components/Common/Breadcrumb';
import type { BookingCreateRequest } from '@/application/dto/Booking.dto';

export default function NewBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { createBooking, loading } = useBooking(container.getBookingService());

  // Pegar hotelId da query string ou usar temporário
  const hotelId = searchParams.get('hotelId') || 'temp-hotel-id';

  const handleSubmit = async (data: BookingCreateRequest) => {
    try {
      const booking = await createBooking(data);
      showToast.success(`Reserva #${booking.bookingCode} criada com sucesso!`);
      router.push(`/bookings/${booking.id}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao criar reserva';
      showToast.error(message);
      throw error;
    }
  };

  return (
    <>
      <Breadcrumb 
        pageName="Nova Reserva"
        pages={[
          { name: 'Reservas', href: '/bookings' },
          { name: 'Nova Reserva', href: '/bookings/new' },
        ]}
      />
      
      <section className="pb-10 pt-20 lg:pb-20 lg:pt-[120px]">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-dark dark:text-white">
              Criar Nova Reserva
            </h1>
            <p className="text-body-color dark:text-dark-6">
              Preencha os dados abaixo para criar uma nova reserva no sistema.
            </p>
          </div>

          <BookingForm hotelId={hotelId} onSubmit={handleSubmit} loading={loading} />
        </div>
      </section>
    </>
  );
}

