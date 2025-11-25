/**
 * Página: Detalhes da Reserva
 */

'use client';

import { useEffect } from 'react';
import { useBooking } from '@/presentation/hooks/useBooking';
import { container } from '@/shared/di/Container';
import { RoleGuard } from '@/presentation/components/common/RoleGuard';
import { showToast } from '@/shared/utils/toast';
import Breadcrumb from '@/components/Common/Breadcrumb';
import Link from 'next/link';

export default function BookingDetailPage({ params }: { params: { id: string } }) {
  const { 
    selectedBooking, 
    loading, 
    error, 
    fetchBookingById,
    cancelBooking,
    confirmBooking 
  } = useBooking(container.getBookingService());

  useEffect(() => {
    fetchBookingById(params.id);
  }, [params.id, fetchBookingById]);

  const handleConfirm = async () => {
    if (confirm('Deseja confirmar esta reserva?')) {
      try {
        await confirmBooking(params.id);
        showToast.success('Reserva confirmada com sucesso!');
        fetchBookingById(params.id);
      } catch (error) {
        showToast.error('Erro ao confirmar reserva');
      }
    }
  };

  const handleCancel = async () => {
    const reason = prompt('Motivo do cancelamento:');
    if (reason) {
      try {
        await cancelBooking(params.id, reason);
        showToast.success('Reserva cancelada com sucesso!');
        fetchBookingById(params.id);
      } catch (error) {
        showToast.error('Erro ao cancelar reserva');
      }
    }
  };

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

  if (loading) {
    return (
      <>
        <Breadcrumb pageName="Carregando..." />
        <section className="pb-10 pt-20 lg:pb-20 lg:pt-[120px]">
          <div className="container mx-auto">
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
          <div className="container mx-auto">
            <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
              <p className="text-red-800 dark:text-red-200">
                {error || 'Reserva não encontrada'}
              </p>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Breadcrumb 
        pageName={`Reserva #${selectedBooking.code || selectedBooking.id.substring(0, 8)}`}
        pages={[
          { name: 'Reservas', href: '/bookings' },
          { name: `#${selectedBooking.code || selectedBooking.id.substring(0, 8)}`, href: `/bookings/${params.id}` },
        ]}
      />
      
      <section className="pb-10 pt-20 lg:pb-20 lg:pt-[120px]">
        <div className="container mx-auto max-w-4xl space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-dark dark:text-white">
                Reserva #{selectedBooking.code || selectedBooking.id.substring(0, 8)}
              </h1>
              <span className={`inline-block rounded px-3 py-1 text-sm font-medium ${getStatusColor(selectedBooking.status)}`}>
                {selectedBooking.status}
              </span>
            </div>

            <div className="flex gap-2">
              {selectedBooking.status === 'Pending' && (
                <>
                  <button
                    onClick={handleConfirm}
                    className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                  >
                    Confirmar
                  </button>
                  <button
                    onClick={handleCancel}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                  >
                    Cancelar
                  </button>
                </>
              )}
              
              {selectedBooking.status === 'Confirmed' && (
                <button
                  onClick={handleCancel}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Cancelar Reserva
                </button>
              )}
            </div>
          </div>

          {/* Informações da Reserva */}
          <div className="rounded-lg border border-stroke bg-white p-6 dark:border-dark-3 dark:bg-dark-2">
            <h2 className="mb-4 text-xl font-semibold text-dark dark:text-white">
              Informações da Reserva
            </h2>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-body-color dark:text-dark-6">Check-in</p>
                <p className="text-lg font-medium text-dark dark:text-white">
                  {new Date(selectedBooking.checkInDate).toLocaleDateString('pt-BR')}
                </p>
              </div>

              <div>
                <p className="text-sm text-body-color dark:text-dark-6">Check-out</p>
                <p className="text-lg font-medium text-dark dark:text-white">
                  {new Date(selectedBooking.checkOutDate).toLocaleDateString('pt-BR')}
                </p>
              </div>

              {selectedBooking.guestCount && (
                <div>
                  <p className="text-sm text-body-color dark:text-dark-6">Número de Hóspedes</p>
                  <p className="text-lg font-medium text-dark dark:text-white">
                    {selectedBooking.guestCount} pessoa(s)
                  </p>
                </div>
              )}

              {selectedBooking.totalAmount && (
                <div>
                  <p className="text-sm text-body-color dark:text-dark-6">Valor Total</p>
                  <p className="text-lg font-semibold text-primary">
                    R$ {selectedBooking.totalAmount.toFixed(2)}
                  </p>
                </div>
              )}
            </div>

            {selectedBooking.specialRequests && (
              <div className="mt-4 pt-4 border-t border-stroke dark:border-dark-3">
                <p className="text-sm text-body-color dark:text-dark-6 mb-2">Solicitações Especiais</p>
                <p className="text-dark dark:text-white">{selectedBooking.specialRequests}</p>
              </div>
            )}
          </div>

          {/* Datas Importantes */}
          <div className="rounded-lg border border-stroke bg-white p-6 dark:border-dark-3 dark:bg-dark-2">
            <h2 className="mb-4 text-xl font-semibold text-dark dark:text-white">
              Datas Importantes
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-body-color dark:text-dark-6">Data da Reserva</span>
                <span className="font-medium text-dark dark:text-white">
                  {new Date(selectedBooking.createdAt).toLocaleString('pt-BR')}
                </span>
              </div>
              
              {selectedBooking.confirmedAt && (
                <div className="flex justify-between items-center">
                  <span className="text-body-color dark:text-dark-6">Data de Confirmação</span>
                  <span className="font-medium text-dark dark:text-white">
                    {new Date(selectedBooking.confirmedAt).toLocaleString('pt-BR')}
                  </span>
                </div>
              )}

              {selectedBooking.cancelledAt && (
                <div className="flex justify-between items-center">
                  <span className="text-body-color dark:text-dark-6">Data de Cancelamento</span>
                  <span className="font-medium text-red-600">
                    {new Date(selectedBooking.cancelledAt).toLocaleString('pt-BR')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

