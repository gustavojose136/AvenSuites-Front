'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { httpClient } from '@/infrastructure/http/HttpClient';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { usePagination } from '@/shared/hooks/usePagination';

interface GuestProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  hotelName: string;
  city?: string;
  state?: string;
}

interface Booking {
  id: string;
  code: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  status: string;
  totalAmount: number;
  currency: string;
  notes?: string;
}

export default function GuestPortalPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isValidated, setIsValidated] = useState(false);
  const [isGuestToken, setIsGuestToken] = useState(false);
  const [profile, setProfile] = useState<GuestProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const {
    items: paginatedBookings,
    currentPage,
    totalPages,
    goToPage,
    hasNextPage,
    hasPreviousPage,
  } = usePagination({
    items: bookings,
    itemsPerPage: 5,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const guestToken = localStorage.getItem('guestToken');
      
      if (!guestToken) {
        toast.error('Faça login para acessar o portal');
        router.push('/guest/login');
        return;
      }
      
      try {
        const payload = JSON.parse(atob(guestToken.split('.')[1]));
        const isGuest = payload.role === 'Guest' || payload.GuestId;
        
        if (!isGuest) {
          localStorage.removeItem('guestToken');
          localStorage.removeItem('guestUser');
          
          toast.error('Token inválido. Você precisa fazer login como hóspede.');
          router.push('/guest/login');
          setIsValidated(true);
          setIsGuestToken(false);
          return;
        }
        
        setIsValidated(true);
        setIsGuestToken(true);
      } catch (e) {
        localStorage.removeItem('guestToken');
        localStorage.removeItem('guestUser');
        toast.error('Token inválido. Faça login novamente.');
        router.push('/guest/login');
        setIsValidated(true);
        setIsGuestToken(false);
        return;
      }
    }
  }, [router]);

  const fetchProfile = useCallback(async () => {
    try {
      const data = await httpClient.get<GuestProfile>('/GuestPortal/profile');
      setProfile(data);
    } catch (error: any) {
      if (error.response?.status === 401 || error.message?.includes('Token inválido')) {
        toast.error('Sessão expirada ou token inválido. Faça login como hóspede.');
        localStorage.removeItem('guestToken');
        localStorage.removeItem('guestUser');
        router.push('/guest/login');
        return;
      }
      
      toast.error('Erro ao carregar perfil. Tente novamente.');
    }
  }, [router]);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await httpClient.get<Booking[]>('/GuestPortal/bookings');
      setBookings(data);
    } catch (error: any) {
      if (error.response?.status === 401 || error.message?.includes('Token inválido')) {
        toast.error('Sessão expirada ou token inválido. Faça login como hóspede.');
        localStorage.removeItem('guestToken');
        localStorage.removeItem('guestUser');
        router.push('/guest/login');
        return;
      }
      
      toast.error('Erro ao carregar reservas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const checkAuth = useCallback(() => {
    if (!isGuestToken) {
      return;
    }
    
    const token = localStorage.getItem('guestToken');
    if (!token) {
      toast.error('Faça login para acessar o portal');
      router.push('/guest/login');
      return;
    }
    
    fetchProfile();
    fetchBookings();
  }, [isGuestToken, router, fetchProfile, fetchBookings]);

  useEffect(() => {
    if (isValidated && isGuestToken) {
      checkAuth();
    }
  }, [isValidated, isGuestToken, checkAuth]);

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;

    try {
      setCancelling(true);
      await httpClient.post(
        `/GuestPortal/bookings/${selectedBooking.id}/cancel`,
        JSON.stringify(cancelReason)
      );
      
      toast.success('Reserva cancelada com sucesso!');
      setShowCancelModal(false);
      setSelectedBooking(null);
      setCancelReason('');
      await fetchBookings();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao cancelar reserva');
    } finally {
      setCancelling(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('guestToken');
    localStorage.removeItem('guestUser');
    toast.success('Logout realizado com sucesso!');
    router.push('/guest/login');
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'CHECKED_IN':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'CHECKED_OUT':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toUpperCase()) {
      case 'CONFIRMED':
        return 'Confirmada';
      case 'CANCELLED':
        return 'Cancelada';
      case 'PENDING':
        return 'Pendente';
      case 'CHECKED_IN':
        return 'Check-in Feito';
      case 'CHECKED_OUT':
        return 'Check-out Feito';
      default:
        return status;
    }
  };

  const calculateNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = end.getTime() - start.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const formatPhone = (phone: string): string => {
    if (!phone) return '';
    
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }
    
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    }
    
    if (cleaned.length > 11 && cleaned.startsWith('55')) {
      const ddd = cleaned.slice(2, 4);
      const number = cleaned.slice(4);
      if (number.length === 9) {
        return `(${ddd}) ${number.slice(0, 5)}-${number.slice(5)}`;
      }
      if (number.length === 8) {
        return `(${ddd}) ${number.slice(0, 4)}-${number.slice(4)}`;
      }
    }
    
    return phone;
  };

  if (!isValidated) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-slate-600 dark:text-slate-400">Validando autenticação...</p>
        </div>
      </section>
    );
  }

  if (isValidated && !isGuestToken) {
    return null;
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 py-8 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Olá, {profile?.name?.split(' ')[0] || 'Hóspede'}! 👋
            </h1>
              <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
                Gerencie suas reservas e tenha controle total da sua estadia
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/guest/search"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/90 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/30"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nova Reserva
            </Link>
            <button
              onClick={handleLogout}
                className="flex items-center gap-2 rounded-xl border-2 border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-50 hover:shadow-md dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sair
            </button>
          </div>
        </div>

        {profile && (
            <div className="mb-8 rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
                  <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
              </div>
              <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Meu Perfil</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Informações da sua conta</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-slate-50/50 p-4 dark:bg-slate-800/50">
                  <div className="mb-2 flex items-center gap-2">
                    <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Nome</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{profile.name || '-'}</p>
                </div>
                <div className="rounded-lg bg-slate-50/50 p-4 dark:bg-slate-800/50">
                  <div className="mb-2 flex items-center gap-2">
                    <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">E-mail</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{profile.email || '-'}</p>
                </div>
                <div className="rounded-lg bg-slate-50/50 p-4 dark:bg-slate-800/50">
                  <div className="mb-2 flex items-center gap-2">
                    <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Telefone</p>
              </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{formatPhone(profile.phone || '')}</p>
              </div>
            </div>
          </div>
        )}

          <div className="rounded-2xl border border-slate-200/80 bg-white/80 shadow-xl backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
            <div className="border-b border-slate-200/80 bg-gradient-to-r from-slate-50 to-slate-100/50 p-6 dark:border-slate-800 dark:from-slate-800 dark:to-slate-800/50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Minhas Reservas
          </h2>
                  {bookings.length > 0 && (
                    <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
                      {bookings.length} {bookings.length === 1 ? 'reserva encontrada' : 'reservas encontradas'}
                    </p>
                  )}
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="p-6">
          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Carregando reservas...</p>
              </div>
            </div>
          ) : bookings.length === 0 ? (
                <div className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 p-16 text-center dark:from-slate-800/50 dark:to-slate-900/50">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
                <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
                  <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                Nenhuma reserva encontrada
              </h3>
                  <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
                    Você ainda não possui reservas. Que tal fazer sua primeira reserva?
              </p>
              <Link
                href="/guest/search"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/90 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/30"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Buscar Hotéis
              </Link>
            </div>
          ) : (
                <>
            <div className="space-y-4">
                    {paginatedBookings.map((booking) => (
                <div
                  key={booking.id}
                        className="group relative overflow-hidden rounded-xl border border-slate-200/80 bg-white p-6 shadow-md transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 dark:border-slate-800 dark:bg-slate-900"
                >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                        <div className="relative">
                          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                            <div className="flex-1 space-y-4">
                              <div className="flex flex-wrap items-center gap-3">
                                <div className="flex items-center gap-2">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                    <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                  </div>
                                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            {booking.code}
                          </h3>
                                </div>
                                <span className={`rounded-full px-3 py-1.5 text-xs font-bold shadow-sm ${getStatusColor(booking.status)}`}>
                            {getStatusLabel(booking.status)}
                          </span>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                <div className="flex items-center gap-3 rounded-lg bg-slate-50/50 p-3 dark:bg-slate-800/30">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                    <svg className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Entrada</p>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{new Date(booking.checkInDate).toLocaleDateString('pt-BR')}</p>
                                  </div>
                          </div>
                                <div className="flex items-center gap-3 rounded-lg bg-slate-50/50 p-3 dark:bg-slate-800/30">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                                    <svg className="h-4 w-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Saída</p>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{new Date(booking.checkOutDate).toLocaleDateString('pt-BR')}</p>
                                  </div>
                          </div>
                                <div className="flex items-center gap-3 rounded-lg bg-slate-50/50 p-3 dark:bg-slate-800/30">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                                    <svg className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Hóspedes</p>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                      {booking.adults} {booking.adults === 1 ? 'adulto' : 'adultos'}
                                      {booking.children > 0 && `, ${booking.children} ${booking.children === 1 ? 'criança' : 'crianças'}`}
                                    </p>
                                  </div>
                          </div>
                                <div className="flex items-center gap-3 rounded-lg bg-slate-50/50 p-3 dark:bg-slate-800/30">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
                                    <svg className="h-4 w-4 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Duração</p>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {calculateNights(booking.checkInDate, booking.checkOutDate)} {calculateNights(booking.checkInDate, booking.checkOutDate) === 1 ? 'noite' : 'noites'}
                                    </p>
                                  </div>
                          </div>
                        </div>
                      </div>

                            <div className="flex flex-col gap-4 lg:items-end">
                              <div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 px-6 py-4 text-center shadow-md">
                                <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Total</p>
                                <p className="mt-1.5 text-2xl font-bold text-primary">
                            {booking.currency === 'BRL' ? 'R$' : booking.currency} {booking.totalAmount.toFixed(2)}
                          </p>
                        </div>

                        {booking.status.toUpperCase() === 'CONFIRMED' && (
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowCancelModal(true);
                            }}
                                  className="rounded-xl border-2 border-red-300 bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-700 transition-all hover:scale-105 hover:border-red-400 hover:bg-red-100 hover:shadow-md dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                          >
                                  Cancelar Reserva
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

                  {bookings.length > 5 && (
                    <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-slate-200/80 pt-6 sm:flex-row dark:border-slate-800">
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Mostrando <span className="font-semibold text-slate-900 dark:text-white">{((currentPage - 1) * 5) + 1}</span> a <span className="font-semibold text-slate-900 dark:text-white">{Math.min(currentPage * 5, bookings.length)}</span> de <span className="font-semibold text-slate-900 dark:text-white">{bookings.length}</span> reservas
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => goToPage(currentPage - 1)}
                          disabled={!hasPreviousPage}
                          className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-300 bg-white text-slate-700 transition-all hover:scale-105 hover:border-primary hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                              key={page}
                              onClick={() => goToPage(page)}
                              className={`h-10 w-10 rounded-xl border-2 text-sm font-semibold transition-all hover:scale-105 ${
                                currentPage === page
                                  ? 'border-primary bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg shadow-primary/25'
                                  : 'border-slate-300 bg-white text-slate-700 hover:border-primary hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                              }`}
                            >
                              {page}
                            </button>
                          ))}
        </div>
                        <button
                          onClick={() => goToPage(currentPage + 1)}
                          disabled={!hasNextPage}
                          className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-300 bg-white text-slate-700 transition-all hover:scale-105 hover:border-primary hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {showCancelModal && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <h3 className="mb-3 text-lg font-bold text-slate-900 dark:text-white">
              Cancelar Reserva
            </h3>
            <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
              Tem certeza que deseja cancelar a reserva <strong className="text-slate-900 dark:text-white">{selectedBooking.code}</strong>?
            </p>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Motivo do cancelamento (opcional)
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                placeholder="Digite o motivo do cancelamento..."
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedBooking(null);
                  setCancelReason('');
                }}
                disabled={cancelling}
                className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Manter
              </button>
              <button
                onClick={handleCancelBooking}
                disabled={cancelling}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {cancelling ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Cancelando...
                  </span>
                ) : (
                  'Cancelar Reserva'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
