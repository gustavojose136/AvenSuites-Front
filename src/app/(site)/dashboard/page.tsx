/**
 * Dashboard Completo - AvenSuites
 * Design moderno e completo para gestão hoteleira
 */

'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDashboard, useInvoices } from '@/hooks/useDashboard';
import { useState, useMemo, useEffect } from 'react';
import { getHotelIdFromToken } from '@/shared/utils/jwtHelper';
import toast from 'react-hot-toast';
import { usePagination } from '@/shared/hooks/usePagination';
import { useResponsiveItemsPerPage } from '@/shared/hooks/useResponsiveItemsPerPage';
import { WeekBookingsPagination } from '@/presentation/components/Booking/WeekBookingsPagination';
import { dashboardService, Room } from '@/services/dashboard.service';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { stats, weekBookings, loading, error, refetch, refetchWeekBookings } = useDashboard();
  const { createInvoice } = useInvoices();
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'year'>('today');
  const [generatingInvoice, setGeneratingInvoice] = useState<string | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);

  // Paginação responsiva para reservas da semana
  const itemsPerPage = useResponsiveItemsPerPage({
    mobile: 1,
    tablet: 2,
    desktop: 3,
  });

  const {
    items: paginatedWeekBookings,
    currentPage,
    totalPages,
    goToPage,
    setCurrentPage,
  } = usePagination({
    items: weekBookings,
    itemsPerPage,
  });

  // Resetar para primeira página quando os items mudarem ou itemsPerPage mudar
  useEffect(() => {
    setCurrentPage(1);
  }, [weekBookings.length, itemsPerPage, setCurrentPage]);
  

  // Extrai hotelId do token JWT
  const hotelId = useMemo(() => {
    if (session?.accessToken) {
      return getHotelIdFromToken(session.accessToken as string);
    }
    return null;
  }, [session]);

  // Função para gerar nota fiscal
  const handleGenerateInvoice = async (bookingId: string) => {
    if (!confirm('Deseja gerar uma nota fiscal para esta reserva?')) {
      return;
    }

    setGeneratingInvoice(bookingId);
    try {
      await createInvoice(bookingId);
      toast.success('Nota fiscal gerada com sucesso!');
      router.push('/invoices');
    } catch (err) {
      // Erro já é tratado no hook
    } finally {
      setGeneratingInvoice(null);
    }
  };

  // Buscar reservas da semana quando o hotelId estiver disponível
  useEffect(() => {
    if (hotelId && status === 'authenticated') {
      refetchWeekBookings(hotelId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotelId, status]);

  // Buscar quartos para o resumo visual
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomsData = await dashboardService.getRooms(hotelId || undefined);
        setRooms(roomsData);
      } catch (err) {
        console.error('Erro ao buscar quartos:', err);
      }
    };

    if (status === 'authenticated') {
      fetchRooms();
    }
  }, [hotelId, status]);

  if (status === 'loading' || loading) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-dark dark:to-dark-2 pt-20">
        <div className="container mx-auto px-4">
          <div className="flex min-h-[600px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="text-body-color dark:text-dark-6">
                {status === 'loading' ? 'Verificando autenticação...' : 'Carregando dados da API...'}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/signin');
    return null;
  }

  if (error) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-dark dark:to-dark-2 pt-20">
        <div className="container mx-auto px-4">
          <div className="flex min-h-[600px] items-center justify-center">
            <div className="max-w-md text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                <svg className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-dark dark:text-white">Erro ao carregar dashboard</h3>
              <p className="mb-4 text-body-color dark:text-dark-6">{error}</p>
              <button
                onClick={() => refetch()}
                className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
              >
                Tentar Novamente
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!stats) {
    return null;
  }

  // Calcular crescimento (simulado - em produção viria da API)
  const growth = {
    revenue: 12.5,
    bookings: 8.3,
    occupancy: 5.2,
    guests: 15.7,
  };

  // Função para obter cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'CHECKED_IN':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'CHECKED_OUT':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  // Função para formatar status
  const formatStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      'CONFIRMED': 'Confirmada',
      'CHECKED_IN': 'Check-in Realizado',
      'CHECKED_OUT': 'Check-out Realizado',
      'PENDING': 'Pendente',
      'CANCELLED': 'Cancelada',
      'NO_SHOW': 'Não Compareceu',
    };
    return statusMap[status] || status;
  };

  // Função para calcular número de noites
  const calculateNights = (checkIn: string, checkOut: string) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-dark dark:to-dark-2 py-20">
      <div className="container mx-auto px-4">
        
        {/* Header com Saudação */}
        <div className="mb-8">
          <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-dark dark:text-white">
                Olá, {session?.user?.name?.split(' ')[0] || 'Gestor'}! 👋
              </h1>
              <p className="mt-2 text-lg text-body-color dark:text-dark-6">
                Aqui está um resumo do seu hotel hoje, {new Date().toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/bookings/new"
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl hover:scale-105"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nova Reserva
              </Link>
              <button
                onClick={() => refetch()}
                className="flex items-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-primary hover:text-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Atualizar
              </button>
            </div>
          </div>
        </div>

        {/* KPIs Principais - Cards Grandes e Atrativos */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Receita Total */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-6 shadow-xl transition hover:shadow-2xl hover:scale-105">
            <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 transform rounded-full bg-white opacity-10"></div>
            <div className="relative">
              <div className="mb-3 flex items-center justify-between">
                <div className="rounded-lg bg-white/20 p-3">
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="flex items-center gap-1 text-sm font-semibold text-white">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  +{growth.revenue}%
                </span>
              </div>
              <h3 className="text-sm font-medium text-white/80">Receita Total</h3>
              <p className="mt-1 text-3xl font-bold text-white">
                R$ {stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="mt-2 text-xs text-white/70">
                Mensal: R$ {stats.monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Taxa de Ocupação */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-6 shadow-xl transition hover:shadow-2xl hover:scale-105">
            <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 transform rounded-full bg-white opacity-10"></div>
            <div className="relative">
              <div className="mb-3 flex items-center justify-between">
                <div className="rounded-lg bg-white/20 p-3">
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="flex items-center gap-1 text-sm font-semibold text-white">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  +{growth.occupancy}%
                </span>
              </div>
              <h3 className="text-sm font-medium text-white/80">Taxa de Ocupação</h3>
              <p className="mt-1 text-3xl font-bold text-white">
                {stats.occupancyRate.toFixed(1)}%
              </p>
              <p className="mt-2 text-xs text-white/70">
                {stats.roomsByStatus.occupied} de {stats.totalRooms} quartos ocupados
              </p>
            </div>
          </div>

          {/* Reservas Ativas */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 p-6 shadow-xl transition hover:shadow-2xl hover:scale-105">
            <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 transform rounded-full bg-white opacity-10"></div>
            <div className="relative">
              <div className="mb-3 flex items-center justify-between">
                <div className="rounded-lg bg-white/20 p-3">
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="flex items-center gap-1 text-sm font-semibold text-white">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  +{growth.bookings}%
                </span>
              </div>
              <h3 className="text-sm font-medium text-white/80">Reservas Ativas</h3>
              <p className="mt-1 text-3xl font-bold text-white">
                {stats.activeBookings}
              </p>
              <p className="mt-2 text-xs text-white/70">
                Total de {stats.totalBookings} reservas registradas
              </p>
            </div>
          </div>

          {/* Hóspedes Ativos */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 p-6 shadow-xl transition hover:shadow-2xl hover:scale-105">
            <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 transform rounded-full bg-white opacity-10"></div>
            <div className="relative">
              <div className="mb-3 flex items-center justify-between">
                <div className="rounded-lg bg-white/20 p-3">
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className="flex items-center gap-1 text-sm font-semibold text-white">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  +{growth.guests}%
                </span>
              </div>
              <h3 className="text-sm font-medium text-white/80">Hóspedes Cadastrados</h3>
              <p className="mt-1 text-3xl font-bold text-white">
                {stats.totalGuests}
              </p>
              <p className="mt-2 text-xs text-white/70">
                {stats.checkInsToday} check-ins hoje
              </p>
            </div>
          </div>
        </div>

        {/* Operações do Dia */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Check-ins Hoje */}
          <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-dark-2">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/20">
                <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </div>
              <Link 
                href="/bookings?filter=checkin-today"
                className="text-sm font-semibold text-primary hover:underline"
              >
                Ver todos →
              </Link>
            </div>
            <h3 className="text-sm font-medium text-body-color dark:text-dark-6">Check-ins Hoje</h3>
            <p className="mt-2 text-3xl font-bold text-dark dark:text-white">{stats.checkInsToday}</p>
            <p className="mt-2 text-xs text-body-color dark:text-dark-6">
              Chegadas previstas para hoje
            </p>
          </div>

          {/* Check-outs Hoje */}
          <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-dark-2">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900/20">
                <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <Link 
                href="/bookings?filter=checkout-today"
                className="text-sm font-semibold text-primary hover:underline"
              >
                Ver todos →
              </Link>
            </div>
            <h3 className="text-sm font-medium text-body-color dark:text-dark-6">Check-outs Hoje</h3>
            <p className="mt-2 text-3xl font-bold text-dark dark:text-white">{stats.checkOutsToday}</p>
            <p className="mt-2 text-xs text-body-color dark:text-dark-6">
              Saídas previstas para hoje
            </p>
          </div>

          {/* Quartos Disponíveis */}
          <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-dark-2">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900/20">
                <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <Link 
                href="/rooms?status=available"
                className="text-sm font-semibold text-primary hover:underline"
              >
                Ver quartos →
              </Link>
            </div>
            <h3 className="text-sm font-medium text-body-color dark:text-dark-6">Quartos Disponíveis</h3>
            <p className="mt-2 text-3xl font-bold text-dark dark:text-white">{stats.availableRooms}</p>
            <p className="mt-2 text-xs text-body-color dark:text-dark-6">
              De {stats.totalRooms} quartos totais
            </p>
          </div>
        </div>

        {/* Reservas da Semana */}
        <div className="mb-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-dark dark:text-white">Reservas da Semana</h2>
              <p className="mt-1 text-sm text-body-color dark:text-dark-6">
                {(() => {
                  const today = new Date();
                  const startOfWeek = new Date(today);
                  startOfWeek.setDate(today.getDate() - today.getDay());
                  const endOfWeek = new Date(startOfWeek);
                  endOfWeek.setDate(startOfWeek.getDate() + 6);
                  return `${startOfWeek.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })} - ${endOfWeek.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}`;
                })()}
              </p>
            </div>
            <Link
              href="/bookings"
              className="flex items-center gap-2 rounded-lg border-2 border-primary bg-white px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white dark:border-primary dark:bg-dark-2 dark:text-primary dark:hover:bg-primary"
            >
              Ver Todas
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {weekBookings.length === 0 ? (
            <div className="rounded-xl bg-white p-12 text-center shadow-lg dark:bg-dark-2">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-dark-3">
                <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-dark dark:text-white">Nenhuma reserva esta semana</h3>
              <p className="text-body-color dark:text-dark-6">Não há reservas agendadas para esta semana.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {paginatedWeekBookings.map((booking) => {
                const nights = calculateNights(booking.checkInDate, booking.checkOutDate);
                const checkInDate = new Date(booking.checkInDate);
                const checkOutDate = new Date(booking.checkOutDate);
                const isToday = new Date().toISOString().split('T')[0] === booking.checkInDate.split('T')[0];
                const isCheckInToday = isToday && booking.status === 'CONFIRMED';
                const isCheckOutToday = new Date().toISOString().split('T')[0] === booking.checkOutDate.split('T')[0];

                return (
                  <div
                    key={booking.id}
                    className={`group relative overflow-hidden rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] dark:bg-dark-2 ${
                      isCheckInToday ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                    }`}
                  >
                    {/* Badge de Check-in Hoje */}
                    {isCheckInToday && (
                      <div className="absolute right-0 top-0 rounded-bl-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-3 py-1 text-xs font-bold text-white">
                        Check-in Hoje!
                      </div>
                    )}

                    {/* Header com Código e Status */}
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-dark dark:text-white">
                          {booking.code}
                        </h3>
                        <p className="mt-1 text-xs text-body-color dark:text-dark-6">
                          {booking.mainGuest?.fullName || 'Hóspede não informado'}
                        </p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(booking.status)}`}>
                        {formatStatus(booking.status)}
                      </span>
                    </div>

                    {/* Informações da Reserva */}
                    <div className="space-y-3">
                      {/* Datas */}
                      <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-dark-3">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-dark dark:text-white">
                              {checkInDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                            </span>
                            <svg className="h-4 w-4 text-body-color dark:text-dark-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <span className="text-sm font-medium text-dark dark:text-white">
                              {checkOutDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                            </span>
                          </div>
                          <p className="text-xs text-body-color dark:text-dark-6">
                            {nights} {nights === 1 ? 'noite' : 'noites'}
                          </p>
                        </div>
                      </div>

                      {/* Hóspedes e Quartos */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/10">
                          <div className="flex items-center gap-2">
                            <svg className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <div>
                              <p className="text-xs text-body-color dark:text-dark-6">Hóspedes</p>
                              <p className="text-sm font-semibold text-dark dark:text-white">
                                {booking.adults + booking.children}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="rounded-lg bg-purple-50 p-3 dark:bg-purple-900/10">
                          <div className="flex items-center gap-2">
                            <svg className="h-4 w-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <div>
                              <p className="text-xs text-body-color dark:text-dark-6">Quartos</p>
                              <p className="text-sm font-semibold text-dark dark:text-white">
                                {booking.bookingRooms?.length || 1}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Valor Total */}
                      <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 p-3 dark:from-green-900/10 dark:to-emerald-900/10">
                        <span className="text-sm font-medium text-body-color dark:text-dark-6">Total</span>
                        <span className="text-lg font-bold text-green-600 dark:text-green-400">
                          R$ {booking.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      {/* Quartos */}
                      {booking.bookingRooms && booking.bookingRooms.length > 0 && (
                        <div className="rounded-lg border border-gray-200 p-3 dark:border-dark-3">
                          <p className="mb-2 text-xs font-semibold text-body-color dark:text-dark-6">Quartos:</p>
                          <div className="flex flex-wrap gap-2">
                            {booking.bookingRooms.map((room, idx) => (
                              <span
                                key={idx}
                                className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary dark:bg-primary/20"
                              >
                                {room.roomNumber}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Ações */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        <Link
                          href={`/bookings/${booking.id}`}
                          className="flex-1 rounded-lg bg-primary px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-primary/90"
                        >
                          Ver Detalhes
                        </Link>
                        {booking.status === 'CONFIRMED' && (
                          <button
                            onClick={() => router.push(`/bookings/${booking.id}/checkin`)}
                            className="rounded-lg border-2 border-green-500 bg-white px-4 py-2 text-sm font-semibold text-green-600 transition hover:bg-green-50 dark:border-green-500 dark:bg-dark-2 dark:text-green-400 dark:hover:bg-green-900/20"
                          >
                            Check-in
                          </button>
                        )}
                        {booking.status !== 'CANCELLED' && (
                          <button
                            onClick={() => handleGenerateInvoice(booking.id)}
                            disabled={generatingInvoice === booking.id}
                            className="flex items-center gap-2 rounded-lg border-2 border-indigo-500 bg-white px-4 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50 dark:border-indigo-500 dark:bg-dark-2 dark:text-indigo-400 dark:hover:bg-indigo-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Gerar Nota Fiscal"
                          >
                            {generatingInvoice === booking.id ? (
                              <>
                                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Gerando...
                              </>
                            ) : (
                              <>
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                NF
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>

              {/* Paginação */}
              {weekBookings.length > itemsPerPage && (
                <div className="mt-6">
                  <WeekBookingsPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={goToPage}
                    totalItems={weekBookings.length}
                    itemsPerPage={itemsPerPage}
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Gráficos */}
        <div className="mb-8">
          
          {/* Status dos Quartos - Gráfico Visual */}
          <div>
            <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-dark-2">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-bold text-dark dark:text-white">Status dos Quartos</h3>
                <Link href="/rooms" className="text-sm font-semibold text-primary hover:underline">
                  Gerenciar →
                </Link>
              </div>
              
              {/* Gráfico de Barras Horizontal */}
              {stats.totalRooms > 0 ? (
                <>
                  <div className="space-y-4">
                    {/* Disponíveis */}
                    {stats.roomsByStatus.available > 0 && (
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-green-500"></div>
                            <span className="text-sm font-medium text-dark dark:text-white">Disponíveis</span>
                          </div>
                          <span className="text-sm font-bold text-dark dark:text-white">
                            {stats.roomsByStatus.available} ({((stats.roomsByStatus.available / stats.totalRooms) * 100).toFixed(1)}%)
                          </span>
                        </div>
                        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-dark-3">
                          <div 
                            className="h-full rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
                            style={{ width: `${Math.min((stats.roomsByStatus.available / stats.totalRooms) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Ocupados */}
                    {stats.roomsByStatus.occupied > 0 && (
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                            <span className="text-sm font-medium text-dark dark:text-white">Ocupados</span>
                          </div>
                          <span className="text-sm font-bold text-dark dark:text-white">
                            {stats.roomsByStatus.occupied} ({((stats.roomsByStatus.occupied / stats.totalRooms) * 100).toFixed(1)}%)
                          </span>
                        </div>
                        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-dark-3">
                          <div 
                            className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
                            style={{ width: `${Math.min((stats.roomsByStatus.occupied / stats.totalRooms) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Em Limpeza */}
                    {stats.roomsByStatus.cleaning > 0 && (
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                            <span className="text-sm font-medium text-dark dark:text-white">Em Limpeza</span>
                          </div>
                          <span className="text-sm font-bold text-dark dark:text-white">
                            {stats.roomsByStatus.cleaning} ({((stats.roomsByStatus.cleaning / stats.totalRooms) * 100).toFixed(1)}%)
                          </span>
                        </div>
                        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-dark-3">
                          <div 
                            className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-500"
                            style={{ width: `${Math.min((stats.roomsByStatus.cleaning / stats.totalRooms) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Em Manutenção */}
                    {stats.roomsByStatus.maintenance > 0 && (
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                            <span className="text-sm font-medium text-dark dark:text-white">Em Manutenção</span>
                          </div>
                          <span className="text-sm font-bold text-dark dark:text-white">
                            {stats.roomsByStatus.maintenance} ({((stats.roomsByStatus.maintenance / stats.totalRooms) * 100).toFixed(1)}%)
                          </span>
                        </div>
                        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-dark-3">
                          <div 
                            className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-500"
                            style={{ width: `${Math.min((stats.roomsByStatus.maintenance / stats.totalRooms) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Inativos */}
                    {stats.roomsByStatus.inactive > 0 && (
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-gray-500"></div>
                            <span className="text-sm font-medium text-dark dark:text-white">Inativos</span>
                          </div>
                          <span className="text-sm font-bold text-dark dark:text-white">
                            {stats.roomsByStatus.inactive} ({((stats.roomsByStatus.inactive / stats.totalRooms) * 100).toFixed(1)}%)
                          </span>
                        </div>
                        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-dark-3">
                          <div 
                            className="h-full rounded-full bg-gradient-to-r from-gray-400 to-gray-600 transition-all duration-500"
                            style={{ width: `${Math.min((stats.roomsByStatus.inactive / stats.totalRooms) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Resumo Visual - Grid Responsivo */}
                  {stats.totalRooms > 0 && rooms.length > 0 && (
                    <div className="mt-6">
                      <p className="mb-3 text-sm font-medium text-body-color dark:text-dark-6">
                        Distribuição Visual ({stats.totalRooms} quartos)
                      </p>
                      <div className="grid grid-cols-5 gap-2 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-16 xl:grid-cols-20">
                        {rooms.slice(0, Math.min(stats.totalRooms, 100)).map((room) => {
                          let color = 'bg-gray-300';
                          let textColor = 'text-gray-800';
                          let tooltip = `Quarto ${room.roomNumber}`;
                          
                          switch (room.status) {
                            case 'ACTIVE':
                              color = 'bg-green-500';
                              textColor = 'text-white';
                              tooltip = `Quarto ${room.roomNumber} - Disponível`;
                              break;
                            case 'OCCUPIED':
                              color = 'bg-blue-500';
                              textColor = 'text-white';
                              tooltip = `Quarto ${room.roomNumber} - Ocupado`;
                              break;
                            case 'CLEANING':
                              color = 'bg-yellow-500';
                              textColor = 'text-gray-800';
                              tooltip = `Quarto ${room.roomNumber} - Em Limpeza`;
                              break;
                            case 'MAINTENANCE':
                              color = 'bg-orange-500';
                              textColor = 'text-white';
                              tooltip = `Quarto ${room.roomNumber} - Em Manutenção`;
                              break;
                            case 'INACTIVE':
                              color = 'bg-gray-500';
                              textColor = 'text-white';
                              tooltip = `Quarto ${room.roomNumber} - Inativo`;
                              break;
                            default:
                              color = 'bg-gray-300';
                              textColor = 'text-gray-800';
                              tooltip = `Quarto ${room.roomNumber}`;
                          }
                          
                          return (
                            <div 
                              key={room.id} 
                              className={`h-12 rounded transition-all hover:scale-110 hover:shadow-lg flex items-center justify-center ${color}`}
                              title={tooltip}
                            >
                              <span className={`text-xs font-semibold ${textColor} truncate px-1`}>
                                {room.roomNumber}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      {stats.totalRooms > 100 && (
                        <p className="mt-2 text-xs text-body-color dark:text-dark-6">
                          Mostrando os primeiros 100 quartos de {stats.totalRooms} totais
                        </p>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="py-8 text-center text-body-color dark:text-dark-6">
                  <p>Nenhum quarto cadastrado ainda</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Relatórios Detalhados */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          
          {/* Top Hotéis */}
          <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-dark-2">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-dark dark:text-white">Top Hotéis</h3>
              <Link href="/hotels" className="text-sm font-semibold text-primary hover:underline">
                Ver todos →
              </Link>
            </div>
            <div className="space-y-4">
              {stats.topHotels.length > 0 ? (
                stats.topHotels.map((hotel, index) => (
                  <div key={hotel.id} className="flex items-center gap-4 rounded-lg border border-gray-200 p-4 transition hover:shadow-md dark:border-dark-3">
                    <div className={`
                      flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full font-bold text-white
                      ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : ''}
                      ${index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-500' : ''}
                      ${index === 2 ? 'bg-gradient-to-br from-orange-400 to-red-500' : ''}
                    `}>
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-dark dark:text-white">{hotel.name}</h4>
                      <p className="text-sm text-body-color dark:text-dark-6">
                        {hotel.totalBookings} reservas • {hotel.occupancyRate}% ocupação
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{hotel.occupancyRate}%</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-body-color dark:text-dark-6">
                  Nenhum hotel cadastrado ainda
                </div>
              )}
            </div>
          </div>

          {/* Estatísticas Financeiras */}
          <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-dark-2">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-dark dark:text-white">Financeiro</h3>
              <Link href="/invoices" className="text-sm font-semibold text-primary hover:underline">
                Ver relatório →
              </Link>
            </div>
            <div className="space-y-4">
              {/* Notas Pagas */}
              <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900/50 dark:bg-green-900/10">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-green-500 p-2">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-dark dark:text-white">Notas Pagas</p>
                    <p className="text-xs text-body-color dark:text-dark-6">{stats.paidInvoices} pagamentos</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                    R$ {stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              {/* Notas Pendentes */}
              <div className="flex items-center justify-between rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900/50 dark:bg-yellow-900/10">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-yellow-500 p-2">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-dark dark:text-white">Notas Pendentes</p>
                    <p className="text-xs text-body-color dark:text-dark-6">{stats.pendingInvoices} aguardando</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                    {stats.pendingInvoices}
                  </p>
                </div>
              </div>

              {/* Notas Vencidas */}
              <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/10">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-red-500 p-2">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-dark dark:text-white">Notas Vencidas</p>
                    <p className="text-xs text-body-color dark:text-dark-6">Requer atenção</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-red-600 dark:text-red-400">
                    {stats.overdueInvoices}
                  </p>
                </div>
              </div>

              {/* Receita Mensal */}
              <div className="rounded-lg border border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 dark:border-dark-3 dark:from-blue-900/10 dark:to-indigo-900/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-dark dark:text-white">Receita Mensal</p>
                    <p className="text-xs text-body-color dark:text-dark-6">Últimos 30 dias</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      R$ {stats.monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      

      </div>
    </section>
  );
}


