/**
 * Calendário de Reservas - AvenSuites
 * Visualização mensal de todas as reservas
 */

'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function BookingsCalendarPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Função para obter dias do mês
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  // Navegação do calendário
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Simulação de reservas (em produção, viria da API)
  const bookings = Array.from({ length: Math.floor(Math.random() * 20) + 10 }).map((_, i) => ({
    id: `booking-${i}`,
    day: Math.floor(Math.random() * daysInMonth) + 1,
    guestName: `Hóspede ${i + 1}`,
    roomNumber: `${Math.floor(Math.random() * 3) + 1}0${Math.floor(Math.random() * 9) + 1}`,
    checkIn: true,
    checkOut: Math.random() > 0.7,
  }));

  const getBookingsForDay = (day: number) => {
    return bookings.filter(b => b.day === day);
  };

  if (status === 'loading') {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-dark dark:to-dark-2 pt-20">
        <div className="container mx-auto px-4">
          <div className="flex min-h-[600px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="text-body-color dark:text-dark-6">Carregando calendário...</p>
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

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-dark dark:to-dark-2 py-20">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-2 text-sm text-body-color dark:text-dark-6">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link href="/dashboard" className="hover:text-primary">Dashboard</Link>
            <span>/</span>
            <span>Calendário de Reservas</span>
          </div>
          
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-dark dark:text-white lg:text-4xl">
                Calendário de Reservas
              </h1>
              <p className="mt-2 text-body-color dark:text-dark-6">
                Visualize todas as reservas do mês
              </p>
            </div>
            
            <div className="flex gap-3">
              <Link
                href="/bookings/new"
                className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nova Reserva
              </Link>
            </div>
          </div>
        </div>

        {/* Calendário */}
        <div className="rounded-2xl bg-white p-6 shadow-xl dark:bg-dark-2 lg:p-8">
          
          {/* Controles do Calendário */}
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={goToPreviousMonth}
                className="rounded-lg border border-gray-300 p-2 transition hover:bg-gray-100 dark:border-dark-3 dark:hover:bg-dark-3"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <h2 className="text-2xl font-bold text-dark dark:text-white">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              
              <button
                onClick={goToNextMonth}
                className="rounded-lg border border-gray-300 p-2 transition hover:bg-gray-100 dark:border-dark-3 dark:hover:bg-dark-3"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            <button
              onClick={goToToday}
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-dark transition hover:bg-gray-200 dark:bg-dark-3 dark:text-white dark:hover:bg-dark-4"
            >
              Hoje
            </button>
          </div>

          {/* Legenda */}
          <div className="mb-6 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500"></div>
              <span className="text-body-color dark:text-dark-6">Check-in</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-purple-500"></div>
              <span className="text-body-color dark:text-dark-6">Check-out</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span className="text-body-color dark:text-dark-6">Ocupado</span>
            </div>
          </div>

          {/* Grid do Calendário */}
          <div className="overflow-x-auto">
            <div className="min-w-[700px]">
              {/* Cabeçalho dos dias da semana */}
              <div className="mb-2 grid grid-cols-7 gap-2">
                {dayNames.map((day) => (
                  <div
                    key={day}
                    className="py-3 text-center text-sm font-bold text-body-color dark:text-dark-6"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Dias do mês */}
              <div className="grid grid-cols-7 gap-2">
                {/* Células vazias antes do primeiro dia do mês */}
                {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square rounded-lg"></div>
                ))}

                {/* Dias do mês */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dayBookings = getBookingsForDay(day);
                  const isToday = 
                    day === new Date().getDate() &&
                    currentDate.getMonth() === new Date().getMonth() &&
                    currentDate.getFullYear() === new Date().getFullYear();

                  return (
                    <div
                      key={day}
                      className={`
                        group relative aspect-square rounded-lg border-2 p-2 transition-all hover:shadow-lg
                        ${isToday ? 'border-primary bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 bg-white dark:border-dark-3 dark:bg-dark-2'}
                        ${dayBookings.length > 0 ? 'cursor-pointer hover:scale-105' : ''}
                      `}
                    >
                      <div className="flex h-full flex-col">
                        <div className={`
                          mb-1 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold
                          ${isToday ? 'bg-primary text-white' : 'text-dark dark:text-white'}
                        `}>
                          {day}
                        </div>
                        
                        {/* Indicadores de reservas */}
                        <div className="flex flex-1 flex-col gap-1 overflow-hidden">
                          {dayBookings.slice(0, 3).map((booking, idx) => (
                            <div
                              key={booking.id}
                              className={`
                                rounded px-1 py-0.5 text-xs font-medium text-white
                                ${booking.checkIn ? 'bg-blue-500' : ''}
                                ${booking.checkOut ? 'bg-purple-500' : ''}
                                ${!booking.checkIn && !booking.checkOut ? 'bg-green-500' : ''}
                              `}
                              title={`${booking.guestName} - Quarto ${booking.roomNumber}`}
                            >
                              {booking.roomNumber}
                            </div>
                          ))}
                          {dayBookings.length > 3 && (
                            <div className="text-xs font-medium text-body-color dark:text-dark-6">
                              +{dayBookings.length - 3}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Tooltip ao passar o mouse */}
                      {dayBookings.length > 0 && (
                        <div className="absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 rounded-lg bg-dark p-3 text-xs text-white shadow-xl group-hover:block dark:bg-white dark:text-dark">
                          <div className="font-bold mb-1">{dayBookings.length} reserva(s)</div>
                          {dayBookings.slice(0, 5).map((booking) => (
                            <div key={booking.id} className="whitespace-nowrap">
                              Quarto {booking.roomNumber} - {booking.guestName}
                            </div>
                          ))}
                          {dayBookings.length > 5 && (
                            <div className="mt-1 font-semibold">
                              E mais {dayBookings.length - 5}...
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Resumo do mês */}
          <div className="mt-8 grid grid-cols-1 gap-4 border-t border-gray-200 pt-6 dark:border-dark-3 md:grid-cols-3">
            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/10">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-500 p-2">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-dark dark:text-white">
                    {bookings.filter(b => b.checkIn).length}
                  </p>
                  <p className="text-sm text-body-color dark:text-dark-6">Check-ins este mês</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/10">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-purple-500 p-2">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-dark dark:text-white">
                    {bookings.filter(b => b.checkOut).length}
                  </p>
                  <p className="text-sm text-body-color dark:text-dark-6">Check-outs este mês</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/10">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-green-500 p-2">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-dark dark:text-white">
                    {bookings.length}
                  </p>
                  <p className="text-sm text-body-color dark:text-dark-6">Total de reservas</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}


