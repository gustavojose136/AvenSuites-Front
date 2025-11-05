'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { httpClient } from '@/infrastructure/http/HttpClient';
import toast from 'react-hot-toast';
import Link from 'next/link';

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

  useEffect(() => {
    // CRÍTICO: Validação SÍNCRONA antes de tudo
    if (typeof window !== 'undefined') {
      const guestToken = localStorage.getItem('guestToken');
      
      console.group('🔍 Portal Guest - Validação Síncrona (BLOQUEANTE)');
      console.log('📍 Rota:', window.location.pathname);
      console.log('🔑 Token existe?', !!guestToken);
      
      if (!guestToken) {
        console.error('❌ Nenhum token encontrado');
        toast.error('Faça login para acessar o portal');
        router.push('/guest/login');
        console.groupEnd();
        return;
      }
      
      try {
        const payload = JSON.parse(atob(guestToken.split('.')[1]));
        const isGuest = payload.role === 'Guest' || payload.GuestId;
        
        console.log('📋 Token decodificado:', {
          role: payload.role,
          GuestId: payload.GuestId,
          HotelId: payload.HotelId,
          email: payload.email,
          name: payload.name,
        });
        
        // VALIDAÇÃO CRÍTICA: Se não é Guest, BLOQUEIA TUDO
        if (!isGuest) {
          console.error('❌❌❌ TOKEN ADMIN DETECTADO - BLOQUEANDO TUDO! ❌❌❌');
          console.error('🧹 Limpando token Admin do localStorage IMEDIATAMENTE...');
          
          // LIMPA IMEDIATAMENTE
          localStorage.removeItem('guestToken');
          localStorage.removeItem('guestUser');
          
          console.error('🚫 NENHUMA REQUISIÇÃO SERÁ FEITA!');
          console.error('🔄 Redirecionando para login Guest...');
          
          toast.error('Token inválido. Você precisa fazer login como hóspede.');
          router.push('/guest/login');
          console.groupEnd();
          setIsValidated(true);
          setIsGuestToken(false);
          return;
        }
        
        console.log('✅✅✅ Token VALIDADO como Guest - PERMITINDO REQUISIÇÕES');
        setIsValidated(true);
        setIsGuestToken(true);
        console.groupEnd();
      } catch (e) {
        console.error('❌ Erro ao decodificar token:', e);
        localStorage.removeItem('guestToken');
        localStorage.removeItem('guestUser');
        toast.error('Token inválido. Faça login novamente.');
        router.push('/guest/login');
        console.groupEnd();
        setIsValidated(true);
        setIsGuestToken(false);
        return;
      }
    }
  }, [router]);

  // useEffect SEPARADO: Só faz requisições quando token foi validado como Guest
  useEffect(() => {
    if (isValidated && isGuestToken) {
      console.log('🎯 Estados validados - executando checkAuth...');
      checkAuth();
    } else if (isValidated && !isGuestToken) {
      console.log('🚫 Token não é Guest - requisições bloqueadas');
    }
  }, [isValidated, isGuestToken]);

  const checkAuth = () => {
    // Proteção: só executa se token foi validado como Guest
    if (!isGuestToken) {
      console.error('🚫 checkAuth bloqueado - token não é Guest');
      return;
    }
    
    const token = localStorage.getItem('guestToken');
    if (!token) {
      console.error('❌ Token não encontrado no checkAuth');
      toast.error('Faça login para acessar o portal');
      router.push('/guest/login');
      return;
    }

    console.log('✅ checkAuth: Token Guest validado, fazendo requisições...');
    
    // Configura o token no httpClient
    fetchProfile();
    fetchBookings();
  };

  const fetchProfile = async () => {
    try {
      const data = await httpClient.get<GuestProfile>('/GuestPortal/profile');
      setProfile(data);
    } catch (error: any) {
      console.error('❌ Erro ao buscar perfil:', error);
      
      // Verifica se é erro de token inválido ou 401
      if (error.response?.status === 401 || error.message?.includes('Token inválido')) {
        console.error('🔐 Token inválido ou ausente - redirecionando para login');
        toast.error('Sessão expirada ou token inválido. Faça login como hóspede.');
        localStorage.removeItem('guestToken');
        localStorage.removeItem('guestUser');
        router.push('/guest/login');
        return;
      }
      
      // Outros erros
      toast.error('Erro ao carregar perfil. Tente novamente.');
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await httpClient.get<Booking[]>('/GuestPortal/bookings');
      setBookings(data);
    } catch (error: any) {
      console.error('❌ Erro ao buscar reservas:', error);
      
      // Verifica se é erro de token inválido ou 401
      if (error.response?.status === 401 || error.message?.includes('Token inválido')) {
        console.error('🔐 Token inválido ou ausente - redirecionando para login');
        toast.error('Sessão expirada ou token inválido. Faça login como hóspede.');
        localStorage.removeItem('guestToken');
        localStorage.removeItem('guestUser');
        router.push('/guest/login');
        return;
      }
      
      // Outros erros
      toast.error('Erro ao carregar reservas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

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
      fetchBookings();
    } catch (error: any) {
      console.error('❌ Erro ao cancelar reserva:', error);
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

  // Bloqueia renderização até validação completa
  if (!isValidated) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-dark dark:via-dark-2 dark:to-dark">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-body-color dark:text-dark-6">Validando autenticação...</p>
        </div>
      </section>
    );
  }

  // Se validado mas token não é Guest, não renderiza (já foi redirecionado)
  if (isValidated && !isGuestToken) {
    return null;
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-dark dark:via-dark-2 dark:to-dark py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="mb-2 text-4xl font-black text-dark dark:text-white">
              Olá, <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                {profile?.name.split(' ')[0] || 'Hóspede'}
              </span>! 👋
            </h1>
            <p className="text-lg text-body-color dark:text-dark-6">
              Bem-vindo ao seu portal
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/guest/search"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-blue-600 px-6 py-3 font-bold text-white shadow-lg transition-all hover:scale-105"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nova Reserva
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl border-2 border-stroke px-6 py-3 font-bold text-body-color transition-all hover:border-primary hover:text-primary dark:border-dark-3 dark:text-dark-6"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sair
            </button>
          </div>
        </div>

        {/* Perfil Card */}
        {profile && (
          <div className="mb-8 rounded-2xl bg-gradient-to-r from-primary to-blue-600 p-8 text-white shadow-xl">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="mb-1 text-sm text-white/80">Nome Completo</p>
                <p className="text-lg font-bold">{profile.name}</p>
              </div>
              <div>
                <p className="mb-1 text-sm text-white/80">E-mail</p>
                <p className="text-lg font-bold">{profile.email}</p>
              </div>
              <div>
                <p className="mb-1 text-sm text-white/80">Telefone</p>
                <p className="text-lg font-bold">{profile.phone}</p>
              </div>
              <div>
                <p className="mb-1 text-sm text-white/80">Hotel Cadastrado</p>
                <p className="text-lg font-bold">{profile.hotelName}</p>
              </div>
            </div>
          </div>
        )}

        {/* Reservas */}
        <div className="rounded-2xl bg-white p-8 shadow-xl dark:bg-dark-2">
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-dark dark:text-white">
            <svg className="h-7 w-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Minhas Reservas
          </h2>

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="text-body-color dark:text-dark-6">Carregando reservas...</p>
              </div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="rounded-xl bg-gray-50 p-12 text-center dark:bg-dark-3">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-dark dark:text-white">
                Nenhuma reserva encontrada
              </h3>
              <p className="mb-6 text-body-color dark:text-dark-6">
                Você ainda não possui reservas. Faça sua primeira reserva agora!
              </p>
              <Link
                href="/guest/search"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-blue-600 px-6 py-3 font-bold text-white shadow-lg transition-all hover:scale-105"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Buscar Hotéis
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="group overflow-hidden rounded-xl border-2 border-stroke bg-gray-50 transition-all hover:border-primary hover:shadow-lg dark:border-dark-3 dark:bg-dark-3"
                >
                  <div className="p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      {/* Info Principal */}
                      <div className="flex-1">
                        <div className="mb-3 flex items-center gap-3">
                          <h3 className="text-xl font-bold text-dark dark:text-white">
                            {booking.code}
                          </h3>
                          <span className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusColor(booking.status)}`}>
                            {getStatusLabel(booking.status)}
                          </span>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                          <div className="flex items-center gap-2 text-sm text-body-color dark:text-dark-6">
                            <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Check-in: {new Date(booking.checkInDate).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-body-color dark:text-dark-6">
                            <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Check-out: {new Date(booking.checkOutDate).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-body-color dark:text-dark-6">
                            <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {booking.adults} adultos{booking.children > 0 && `, ${booking.children} crianças`}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-body-color dark:text-dark-6">
                            <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                            </svg>
                            {calculateNights(booking.checkInDate, booking.checkOutDate)} {calculateNights(booking.checkInDate, booking.checkOutDate) === 1 ? 'noite' : 'noites'}
                          </div>
                        </div>
                      </div>

                      {/* Valor e Ações */}
                      <div className="flex items-center gap-4">
                        <div className="rounded-lg bg-white p-4 text-center dark:bg-dark-2">
                          <p className="text-xs text-body-color dark:text-dark-6">Total</p>
                          <p className="text-2xl font-bold text-primary">
                            {booking.currency === 'BRL' ? 'R$' : booking.currency} {booking.totalAmount.toFixed(2)}
                          </p>
                        </div>

                        {booking.status.toUpperCase() === 'CONFIRMED' && (
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowCancelModal(true);
                            }}
                            className="rounded-xl border-2 border-red-200 bg-red-50 px-6 py-3 font-bold text-red-600 transition-all hover:border-red-600 hover:bg-red-600 hover:text-white dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400"
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Link de Volta */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-body-color transition-colors hover:text-primary dark:text-dark-6 dark:hover:text-primary"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Voltar para home
          </Link>
        </div>
      </div>

      {/* Modal de Cancelamento */}
      {showCancelModal && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl dark:bg-dark-2">
            <h3 className="mb-4 text-2xl font-bold text-dark dark:text-white">
              Cancelar Reserva
            </h3>
            <p className="mb-6 text-body-color dark:text-dark-6">
              Tem certeza que deseja cancelar a reserva <strong>{selectedBooking.code}</strong>?
            </p>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Motivo do cancelamento (opcional)
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={4}
                className="w-full rounded-lg border-2 border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:text-white"
                placeholder="Digite o motivo do cancelamento..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedBooking(null);
                  setCancelReason('');
                }}
                disabled={cancelling}
                className="flex-1 rounded-xl border-2 border-stroke px-6 py-3 font-bold text-body-color transition-all hover:border-primary hover:text-primary dark:border-dark-3 dark:text-dark-6"
              >
                Não, manter
              </button>
              <button
                onClick={handleCancelBooking}
                disabled={cancelling}
                className="flex-1 rounded-xl bg-red-600 px-6 py-3 font-bold text-white transition-all hover:bg-red-700 disabled:opacity-50"
              >
                {cancelling ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Cancelando...
                  </span>
                ) : (
                  'Sim, cancelar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

