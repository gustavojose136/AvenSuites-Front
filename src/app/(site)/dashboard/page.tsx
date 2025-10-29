/**
 * Dashboard Completo - AvenSuites
 * Protegido por autenticação via middleware
 * Integrado com API externa
 */

'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDashboard } from '@/hooks/useDashboard';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { stats, loading, error, refetch } = useDashboard();

  if (status === 'loading' || loading) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-dark dark:to-dark-2 pt-20">
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
      <section className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-dark dark:to-dark-2 pt-20">
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

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-dark dark:to-dark-2 py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2 text-sm text-body-color dark:text-dark-6">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <span>Dashboard</span>
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-dark dark:text-white lg:text-4xl">
                Dashboard
              </h1>
              <p className="mt-2 text-body-color dark:text-dark-6">
                Olá, <span className="font-semibold text-dark dark:text-white">{session?.user?.name || session?.user?.email}</span>! 
                Aqui está a visão geral do seu sistema.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/bookings/new"
                className="flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nova Reserva
              </Link>
            </div>
          </div>
        </div>

        {/* KPI Cards principais */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Hotéis */}
          <Link href="/hotels">
            <div className="group relative overflow-hidden rounded-2xl border border-stroke bg-white p-6 shadow-sm transition-all hover:shadow-xl dark:border-dark-3 dark:bg-dark-2">
              <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-primary/5 transition-transform group-hover:scale-110" />
              <div className="relative">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-600 shadow-lg">
                  <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-body-color dark:text-dark-6">Total de Hotéis</p>
                  <h3 className="mt-1 text-4xl font-bold text-dark dark:text-white">{stats.totalHotels}</h3>
                  <p className="mt-2 text-xs text-green-600 dark:text-green-400">
                    <span className="font-semibold">↑ 12%</span> vs mês anterior
                  </p>
                </div>
              </div>
            </div>
          </Link>

          {/* Total Quartos */}
          <Link href="/rooms">
            <div className="group relative overflow-hidden rounded-2xl border border-stroke bg-white p-6 shadow-sm transition-all hover:shadow-xl dark:border-dark-3 dark:bg-dark-2">
              <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-blue-500/5 transition-transform group-hover:scale-110" />
              <div className="relative">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg">
                  <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-body-color dark:text-dark-6">Total de Quartos</p>
                  <h3 className="mt-1 text-4xl font-bold text-dark dark:text-white">{stats.totalRooms}</h3>
                  <p className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                    <span className="font-semibold">{stats.availableRooms}</span> disponíveis agora
                  </p>
                </div>
              </div>
            </div>
          </Link>

          {/* Total Hóspedes */}
          <Link href="/guests">
            <div className="group relative overflow-hidden rounded-2xl border border-stroke bg-white p-6 shadow-sm transition-all hover:shadow-xl dark:border-dark-3 dark:bg-dark-2">
              <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-purple-500/5 transition-transform group-hover:scale-110" />
              <div className="relative">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 shadow-lg">
                  <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-body-color dark:text-dark-6">Total de Hóspedes</p>
                  <h3 className="mt-1 text-4xl font-bold text-dark dark:text-white">{stats.totalGuests.toLocaleString()}</h3>
                  <p className="mt-2 text-xs text-purple-600 dark:text-purple-400">
                    <span className="font-semibold">↑ 28%</span> este ano
                  </p>
                </div>
              </div>
            </div>
          </Link>

          {/* Reservas Ativas */}
          <Link href="/bookings">
            <div className="group relative overflow-hidden rounded-2xl border border-stroke bg-white p-6 shadow-sm transition-all hover:shadow-xl dark:border-dark-3 dark:bg-dark-2">
              <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-green-500/5 transition-transform group-hover:scale-110" />
              <div className="relative">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-700 shadow-lg">
                  <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-body-color dark:text-dark-6">Reservas Ativas</p>
                  <h3 className="mt-1 text-4xl font-bold text-dark dark:text-white">{stats.activeBookings}</h3>
                  <p className="mt-2 text-xs text-green-600 dark:text-green-400">
                    <span className="font-semibold">{stats.totalBookings}</span> total este mês
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Linha 2: Ocupação e Receita */}
        <div className="mb-8 grid gap-6 lg:grid-cols-3">
          {/* Taxa de Ocupação */}
          <div className="rounded-2xl border border-stroke bg-white p-6 shadow-sm dark:border-dark-3 dark:bg-dark-2">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-dark dark:text-white">Taxa de Ocupação</h3>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
                <svg className="h-5 w-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="text-center">
              <div className="relative mx-auto mb-4 h-40 w-40">
                <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-stroke dark:text-dark-3"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={`${stats.occupancyRate * 2.51} 251`}
                    strokeLinecap="round"
                    className="text-yellow-600 transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-dark dark:text-white">{stats.occupancyRate}%</span>
                  <span className="text-xs text-body-color dark:text-dark-6">ocupado</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-body-color dark:text-dark-6">Ocupados</p>
                  <p className="font-semibold text-dark dark:text-white">{stats.totalRooms - stats.availableRooms}</p>
                </div>
                <div>
                  <p className="text-body-color dark:text-dark-6">Disponíveis</p>
                  <p className="font-semibold text-dark dark:text-white">{stats.availableRooms}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Receita */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-stroke bg-white p-6 shadow-sm dark:border-dark-3 dark:bg-dark-2">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-dark dark:text-white">Receita</h3>
                <select className="rounded-lg border border-stroke bg-transparent px-3 py-1.5 text-sm text-dark outline-none dark:border-dark-3 dark:text-white">
                  <option>Este mês</option>
                  <option>Último mês</option>
                  <option>Este ano</option>
                </select>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20">
                      <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-body-color dark:text-dark-6">Receita Mensal</p>
                      <p className="text-2xl font-bold text-dark dark:text-white">
                        R$ {stats.monthlyRevenue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-sm">
                    <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                      <span className="font-semibold">+15.3%</span>
                    </span>
                    <span className="text-body-color dark:text-dark-6">vs mês anterior</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-body-color dark:text-dark-6">Receita Total</p>
                      <p className="text-2xl font-bold text-dark dark:text-white">
                        R$ {stats.totalRevenue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-sm">
                    <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                      <span className="font-semibold">+32.1%</span>
                    </span>
                    <span className="text-body-color dark:text-dark-6">este ano</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Linha 3: Notas Fiscais e Ações Rápidas */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
              {/* Notas Fiscais */}
          <div className="rounded-2xl border border-stroke bg-white p-6 shadow-sm dark:border-dark-3 dark:bg-dark-2">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-dark dark:text-white">Notas Fiscais</h3>
              <Link href="/invoices" className="text-sm font-medium text-primary hover:underline">
                Ver todas
              </Link>
            </div>
            <div className="space-y-4">
              {/* Pendentes */}
              <div className="flex items-center justify-between rounded-lg border border-stroke p-4 dark:border-dark-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
                    <svg className="h-5 w-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-dark dark:text-white">{stats.pendingInvoices} Pendentes</p>
                    <p className="text-sm text-body-color dark:text-dark-6">Aguardando pagamento</p>
                  </div>
                </div>
              </div>

              {/* Pagas */}
              <div className="flex items-center justify-between rounded-lg border border-stroke p-4 dark:border-dark-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20">
                    <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-dark dark:text-white">{stats.paidInvoices} Pagas</p>
                    <p className="text-sm text-body-color dark:text-dark-6">Receita confirmada</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-green-600">
                  R$ {stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              {/* Vencidas */}
              <div className="flex items-center justify-between rounded-lg border border-stroke p-4 dark:border-dark-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/20">
                    <svg className="h-5 w-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-dark dark:text-white">{stats.overdueInvoices} Vencidas</p>
                    <p className="text-sm text-body-color dark:text-dark-6">Requer atenção</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ações Rápidas */}
          <div className="rounded-2xl border border-stroke bg-white p-6 shadow-sm dark:border-dark-3 dark:bg-dark-2">
            <h3 className="mb-6 text-lg font-semibold text-dark dark:text-white">Ações Rápidas</h3>
            <div className="grid gap-3">
              <Link
                href="/bookings/new"
                className="flex items-center gap-4 rounded-lg border border-stroke p-4 transition-all hover:border-primary hover:bg-primary/5 dark:border-dark-3"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-dark dark:text-white">Nova Reserva</p>
                  <p className="text-sm text-body-color dark:text-dark-6">Criar nova reserva</p>
                </div>
                <svg className="h-5 w-5 text-body-color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              <Link
                href="/guests/new"
                className="flex items-center gap-4 rounded-lg border border-stroke p-4 transition-all hover:border-primary hover:bg-primary/5 dark:border-dark-3"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20">
                  <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-dark dark:text-white">Novo Hóspede</p>
                  <p className="text-sm text-body-color dark:text-dark-6">Cadastrar hóspede</p>
                </div>
                <svg className="h-5 w-5 text-body-color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              <Link
                href="/hotels/new"
                className="flex items-center gap-4 rounded-lg border border-stroke p-4 transition-all hover:border-primary hover:bg-primary/5 dark:border-dark-3"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-dark dark:text-white">Novo Hotel</p>
                  <p className="text-sm text-body-color dark:text-dark-6">Adicionar hotel</p>
                </div>
                <svg className="h-5 w-5 text-body-color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              <Link
                href="/invoices/new"
                className="flex items-center gap-4 rounded-lg border border-stroke p-4 transition-all hover:border-primary hover:bg-primary/5 dark:border-dark-3"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20">
                  <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-dark dark:text-white">Nova Nota Fiscal</p>
                  <p className="text-sm text-body-color dark:text-dark-6">Emitir NF</p>
                </div>
                <svg className="h-5 w-5 text-body-color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Linha 4: Estatísticas Detalhadas */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Status dos Quartos */}
          <div className="rounded-2xl border border-stroke bg-white p-6 shadow-sm dark:border-dark-3 dark:bg-dark-2">
            <h3 className="mb-6 text-lg font-semibold text-dark dark:text-white">Status dos Quartos</h3>
            <div className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-body-color dark:text-dark-6">Disponíveis</span>
                  <span className="font-semibold text-dark dark:text-white">{stats.roomsByStatus.available}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-stroke dark:bg-dark-3">
                  <div
                    className="h-full rounded-full bg-green-600"
                    style={{ width: `${(stats.roomsByStatus.available / stats.totalRooms) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-body-color dark:text-dark-6">Ocupados</span>
                  <span className="font-semibold text-dark dark:text-white">{stats.roomsByStatus.occupied}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-stroke dark:bg-dark-3">
                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{ width: `${(stats.roomsByStatus.occupied / stats.totalRooms) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-body-color dark:text-dark-6">Manutenção</span>
                  <span className="font-semibold text-dark dark:text-white">{stats.roomsByStatus.maintenance}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-stroke dark:bg-dark-3">
                  <div
                    className="h-full rounded-full bg-yellow-600"
                    style={{ width: `${(stats.roomsByStatus.maintenance / stats.totalRooms) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-body-color dark:text-dark-6">Limpeza</span>
                  <span className="font-semibold text-dark dark:text-white">{stats.roomsByStatus.cleaning}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-stroke dark:bg-dark-3">
                  <div
                    className="h-full rounded-full bg-orange-600"
                    style={{ width: `${(stats.roomsByStatus.cleaning / stats.totalRooms) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Check-ins e Check-outs Hoje */}
          <div className="rounded-2xl border border-stroke bg-white p-6 shadow-sm dark:border-dark-3 dark:bg-dark-2">
            <h3 className="mb-6 text-lg font-semibold text-dark dark:text-white">Hoje</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/10">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-dark dark:text-white">{stats.checkInsToday} Check-ins</p>
                  <p className="text-sm text-body-color dark:text-dark-6">Previstos para hoje</p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-lg bg-purple-50 p-4 dark:bg-purple-900/10">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20">
                  <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-dark dark:text-white">{stats.checkOutsToday} Check-outs</p>
                  <p className="text-sm text-body-color dark:text-dark-6">Previstos para hoje</p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-lg bg-green-50 p-4 dark:bg-green-900/10">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20">
                  <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-dark dark:text-white">{stats.completedCheckOuts} Concluídos</p>
                  <p className="text-sm text-body-color dark:text-dark-6">Check-outs realizados</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hotéis mais reservados */}
          <div className="rounded-2xl border border-stroke bg-white p-6 shadow-sm dark:border-dark-3 dark:bg-dark-2">
            <h3 className="mb-6 text-lg font-semibold text-dark dark:text-white">Top Hotéis</h3>
            <div className="space-y-4">
              {stats.topHotels.map((hotel, index) => (
                <div key={hotel.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg font-bold ${
                      index === 0 
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                        : index === 1
                        ? 'bg-gray-200 text-gray-700 dark:bg-dark-3 dark:text-dark-6'
                        : 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-dark dark:text-white">{hotel.name}</p>
                      <p className="text-sm text-body-color dark:text-dark-6">{hotel.occupancyRate}% ocupação</p>
                    </div>
                  </div>
                  <span className="font-semibold text-primary">{hotel.totalBookings}</span>
                </div>
              ))}

              {stats.topHotels.length === 0 && (
                <p className="text-center text-body-color dark:text-dark-6">Nenhum hotel cadastrado</p>
              )}

              <Link
                href="/hotels"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-stroke py-2.5 text-sm font-medium text-primary transition hover:bg-primary/5 dark:border-dark-3"
              >
                Ver todos os hotéis
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
