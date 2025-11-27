/**
 * Página: Lista de Reservas
 * Gestão completa de reservas com filtros, busca e estatísticas
 * Seguindo princípios SOLID
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Breadcrumb from '@/components/Common/Breadcrumb';
import { useBooking } from '@/presentation/hooks/useBooking';
import { container } from '@/shared/di/Container';
import { BookingCard } from '@/presentation/components/Booking/BookingCard';
import { BookingStats } from '@/presentation/components/Booking/BookingStats';
import { BookingFilters } from '@/presentation/components/Booking/BookingFilters';
import { BookingTable } from '@/presentation/components/Booking/BookingTable';
import { showToast } from '@/shared/utils/toast';
import { httpClient } from '@/infrastructure/http/HttpClient';
import type { Booking } from '@/application/dto/Booking.dto';

interface Hotel {
  id: string;
  tradingName: string;
  city: string;
  state: string;
}

export default function BookingsPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  
  const { 
    bookings, 
    loading, 
    error, 
    fetchBookings,
    fetchBookingsByHotel,
    cancelBooking,
    confirmBooking 
  } = useBooking(container.getBookingService());

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedHotelId, setSelectedHotelId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Carrega dados iniciais
  useEffect(() => {
    if (sessionStatus === 'authenticated') {
      fetchHotels();
      fetchBookings();
    }
  }, [sessionStatus, fetchBookings]);

  // Atualiza reservas quando hotel é alterado
  useEffect(() => {
    if (selectedHotelId && selectedHotelId !== 'all') {
      fetchBookingsByHotel(selectedHotelId);
    } else {
      fetchBookings();
    }
  }, [selectedHotelId, fetchBookings, fetchBookingsByHotel]);

  /**
   * Busca hotéis (SOLID - Single Responsibility)
   */
  const fetchHotels = async () => {
    try {
      console.log('🏨 Buscando hotéis...');
      const data = await httpClient.get<Hotel[]>('/Hotels');
      console.log('✅ Hotéis recebidos:', data);
      setHotels(data);
    } catch (error) {
      console.error('❌ Erro ao buscar hotéis:', error);
      showToast.error('Erro ao carregar hotéis');
    }
  };

  /**
   * Filtra reservas (SOLID - Single Responsibility)
   */
  const filteredBookings = useMemo(() => {
    let result = bookings;

    // Filtro por status
    if (statusFilter !== 'all') {
      result = result.filter(booking => 
        booking.status.toUpperCase() === statusFilter.toUpperCase()
      );
    }

    // Filtro por busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(booking => 
        booking.code?.toLowerCase().includes(term) ||
        booking.mainGuest?.fullName?.toLowerCase().includes(term) ||
        booking.mainGuest?.email?.toLowerCase().includes(term) ||
        booking.id.toLowerCase().includes(term)
      );
    }

    return result;
  }, [bookings, statusFilter, searchTerm]);

  /**
   * Handlers de ações (SOLID - Single Responsibility)
   */
  const handleCancel = async (id: string) => {
    if (!confirm('Deseja realmente cancelar esta reserva?')) {
      return;
    }

    try {
      await cancelBooking(id, 'Cancelado pelo usuário');
      showToast.success('Reserva cancelada com sucesso!');
      // Recarrega a lista
      if (selectedHotelId !== 'all') {
        fetchBookingsByHotel(selectedHotelId);
      } else {
        fetchBookings();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao cancelar reserva';
      showToast.error(message);
    }
  };

  const handleConfirm = async (id: string) => {
    if (!confirm('Deseja confirmar esta reserva?')) {
      return;
    }

    try {
      await confirmBooking(id);
      showToast.success('Reserva confirmada com sucesso!');
      // Recarrega a lista
      if (selectedHotelId !== 'all') {
        fetchBookingsByHotel(selectedHotelId);
      } else {
        fetchBookings();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao confirmar reserva';
      showToast.error(message);
    }
  };

  const handleViewDetails = (id: string) => {
    router.push(`/bookings/${id}`);
  };

  // Estados de loading e erro
  if (sessionStatus === 'loading') {
    return (
      <>
        <Breadcrumb pageName="Carregando..." />
        <section className="pb-10 pt-20 lg:pb-20 lg:pt-[120px]">
          <div className="container mx-auto">
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (sessionStatus === 'unauthenticated') {
    router.push('/signin');
    return null;
  }

  return (
    <>
      <Breadcrumb pageName="Reservas" />
      
      <section className="pb-10 pt-20 lg:pb-20 lg:pt-[120px]">
        <div className="container mx-auto">
          {/* Cabeçalho */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-dark dark:text-white">
                Reservas
              </h1>
              <p className="text-body-color dark:text-dark-6">
                Gerencie todas as reservas do sistema
              </p>
            </div>
            <Link
              href="/bookings/new"
              className="rounded-lg bg-primary px-6 py-3 text-base font-medium text-white transition hover:bg-primary/90"
            >
              + Nova Reserva
            </Link>
          </div>

          {/* Estatísticas */}
          <BookingStats bookings={bookings} />

          {/* Filtros */}
          <BookingFilters
            hotels={hotels}
            selectedHotelId={selectedHotelId}
            statusFilter={statusFilter}
            searchTerm={searchTerm}
            viewMode={viewMode}
            onHotelChange={setSelectedHotelId}
            onStatusChange={setStatusFilter}
            onSearchChange={setSearchTerm}
            onViewModeChange={setViewMode}
          />

          {/* Conteúdo */}
          {loading ? (
            <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-stroke bg-white dark:border-dark-3 dark:bg-dark-2">
              <div className="text-center">
                <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="text-body-color dark:text-dark-6">Carregando reservas...</p>
              </div>
            </div>
          ) : error ? (
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
                  <p className="font-semibold text-red-800 dark:text-red-300">Erro ao carregar reservas</p>
                  <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                </div>
              </div>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="rounded-lg border border-stroke bg-white p-12 text-center dark:border-dark-3 dark:bg-dark-2">
              <svg
                className="mx-auto mb-4 h-16 w-16 text-body-color dark:text-dark-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="mb-2 text-xl font-semibold text-dark dark:text-white">
                Nenhuma reserva encontrada
              </h3>
              <p className="mb-6 text-body-color dark:text-dark-6">
                {searchTerm || statusFilter !== 'all' || selectedHotelId !== 'all'
                  ? 'Tente ajustar os filtros de busca'
                  : 'Comece criando uma nova reserva'}
              </p>
              {!searchTerm && statusFilter === 'all' && selectedHotelId === 'all' && (
                <Link
                  href="/bookings/new"
                  className="inline-block rounded-lg bg-primary px-6 py-3 text-base font-medium text-white transition hover:bg-primary/90"
                >
                  Criar Primeira Reserva
                </Link>
              )}
            </div>
          ) : viewMode === 'cards' ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onCancel={handleCancel}
                  onConfirm={handleConfirm}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          ) : (
            <BookingTable
              bookings={filteredBookings}
              onViewDetails={handleViewDetails}
              onConfirm={handleConfirm}
              onCancel={handleCancel}
            />
          )}
        </div>
      </section>
    </>
  );
}
