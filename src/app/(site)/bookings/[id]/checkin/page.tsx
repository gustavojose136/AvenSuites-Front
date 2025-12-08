

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBooking } from '@/presentation/hooks/useBooking';
import { container } from '@/shared/di/Container';
import { BookingInfoCard } from '@/presentation/components/Booking/BookingInfoCard';
import { showToast } from '@/shared/utils/toast';
import Breadcrumb from '@/components/Common/Breadcrumb';
import Link from 'next/link';
import { getStatusColor, getStatusLabel } from '@/presentation/components/Booking/utils/bookingFormatters';

export default function CheckInPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const {
    selectedBooking,
    loading,
    error,
    fetchBookingById,
    checkIn,
  } = useBooking(container.getBookingService());

  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  useEffect(() => {
    const id = typeof params.id === 'string' ? params.id : params.id?.[0] || null;
    if (id) {
      setBookingId(id);
      fetchBookingById(id).catch((err) => {
        console.error('❌ Erro ao buscar reserva:', err);
      });
    }
  }, [params, fetchBookingById]);

  const handleCheckIn = async () => {
    if (!selectedBooking) return;

    if (selectedBooking.status !== 'CONFIRMED') {
      showToast.error('Apenas reservas confirmadas podem realizar check-in');
      return;
    }

    const checkInDate = new Date(selectedBooking.checkInDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    checkInDate.setHours(0, 0, 0, 0);

    if (checkInDate > today) {
      const confirmed = confirm(
        `O check-in está previsto para ${checkInDate.toLocaleDateString('pt-BR')}. Deseja realizar o check-in antecipado?`
      );
      if (!confirmed) return;
    }

    if (!confirm('Deseja realizar o check-in desta reserva?')) {
      return;
    }

    setIsProcessing(true);
    try {
      const id = bookingId || (typeof params.id === 'string' ? params.id : params.id?.[0]);
      if (!id) {
        throw new Error('ID da reserva não encontrado');
      }
      await checkIn(id);
      showToast.success('Check-in realizado com sucesso!');
      router.push(`/bookings/${id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao realizar check-in';
      showToast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!bookingId) {
    return (
      <>
        <Breadcrumb pageName="Carregando..." />
        <section className="pb-10 pt-20 lg:pb-20 lg:pt-[120px]">
          <div className="container mx-auto">
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="text-body-color dark:text-dark-6">Carregando informações da reserva...</p>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Breadcrumb pageName="Carregando..." />
        <section className="pb-10 pt-20 lg:pb-20 lg:pt-[120px]">
          <div className="container mx-auto">
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="text-body-color dark:text-dark-6">Carregando informações da reserva...</p>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (error || !selectedBooking) {
    return (
      <>
        <Breadcrumb pageName="Erro" />
        <section className="pb-10 pt-20 lg:pb-20 lg:pt-[120px]">
          <div className="container mx-auto max-w-4xl">
            <div className="rounded-lg border border-red-300 bg-red-50 p-6 dark:border-red-900/30 dark:bg-red-900/20">
              <div className="flex items-center gap-3">
                <svg
                  className="h-6 w-6 text-red-600 dark:text-red-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="font-semibold text-red-800 dark:text-red-300">
                    Erro ao carregar reserva
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-400">
                    {error || 'Reserva não encontrada'}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <Link
                  href="/bookings"
                  className="text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400"
                >
                  ← Voltar para lista de reservas
                </Link>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  const canCheckIn = selectedBooking.status === 'CONFIRMED';
  const isAlreadyCheckedIn = selectedBooking.status === 'CHECKED_IN';
  const finalBookingId = bookingId || (typeof params.id === 'string' ? params.id : params.id?.[0] || '');

  return (
    <>
      <Breadcrumb
        pageName={`Check-in - Reserva #${selectedBooking.code || selectedBooking.id.substring(0, 8)}`}
        pageDescription="Realizar check-in da reserva"
      />

      <section className="pb-10 pt-20 lg:pb-20 lg:pt-[120px]">
        <div className="container mx-auto max-w-4xl">
            {}
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h1 className="mb-2 text-3xl font-bold text-dark dark:text-white">
                  Check-in da Reserva
                </h1>
                <p className="text-body-color dark:text-dark-6">
                  Realize o check-in do hóspede na reserva
                </p>
              </div>
              <Link
                href={`/bookings/${finalBookingId}`}
                className="flex items-center gap-2 rounded-lg border border-stroke bg-white px-4 py-2 text-sm font-medium text-dark transition hover:bg-gray-50 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Voltar
              </Link>
            </div>

            {}
            <div className="mb-6 rounded-lg border border-stroke bg-white p-4 dark:border-dark-3 dark:bg-dark-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-body-color dark:text-dark-6">Status Atual</p>
                  <span
                    className={`mt-1 inline-block rounded px-3 py-1 text-sm font-medium ${getStatusColor(selectedBooking.status)}`}
                  >
                    {getStatusLabel(selectedBooking.status)}
                  </span>
                </div>
                {!canCheckIn && !isAlreadyCheckedIn && (
                  <div className="rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20">
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                      {selectedBooking.status === 'PENDING'
                        ? 'A reserva precisa ser confirmada antes do check-in'
                        : 'Esta reserva não pode realizar check-in no momento'}
                    </p>
                  </div>
                )}
                {isAlreadyCheckedIn && (
                  <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                      Check-in já realizado
                    </p>
                  </div>
                )}
              </div>
            </div>

            {}
            <div className="mb-6">
              <BookingInfoCard booking={selectedBooking} />
            </div>

            {}
            <div className="rounded-lg border border-stroke bg-white p-6 dark:border-dark-3 dark:bg-dark-2">
              <h2 className="mb-4 text-xl font-semibold text-dark dark:text-white">
                Ações
              </h2>

              {canCheckIn ? (
                <div className="space-y-4">
                  <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                    <p className="mb-2 text-sm font-medium text-blue-800 dark:text-blue-300">
                      Confirmação de Check-in
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      Ao confirmar o check-in, o status da reserva será alterado para &quot;Check-in Realizado&quot; e os quartos serão marcados como ocupados.
                    </p>
                  </div>

                  <button
                    onClick={handleCheckIn}
                    disabled={isProcessing}
                    className="w-full rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:shadow-xl hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {isProcessing ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="h-5 w-5 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processando...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Confirmar Check-in
                      </span>
                    )}
                  </button>
                </div>
              ) : isAlreadyCheckedIn ? (
                <div className="space-y-4">
                  <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                    <p className="text-sm font-medium text-green-800 dark:text-green-300">
                      ✓ Check-in já foi realizado para esta reserva
                    </p>
                  </div>
                  <Link
                    href={`/bookings/${finalBookingId}`}
                    className="block w-full rounded-lg bg-primary px-6 py-3 text-center text-base font-semibold text-white transition hover:bg-primary/90"
                  >
                    Ver Detalhes da Reserva
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                      Esta reserva não pode realizar check-in no momento
                    </p>
                  </div>
                  <Link
                    href={`/bookings/${finalBookingId}`}
                    className="block w-full rounded-lg bg-primary px-6 py-3 text-center text-base font-semibold text-white transition hover:bg-primary/90"
                  >
                    Voltar para Detalhes
                  </Link>
                </div>
              )}
            </div>
        </div>
      </section>
    </>
  );
}
