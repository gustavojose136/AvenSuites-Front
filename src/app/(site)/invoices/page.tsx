/**
 * Página de Notas Fiscais
 * Acompanhamento e gestão de notas fiscais
 * Integrado com API externa
 */

'use client';

import { useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useInvoices } from '@/hooks/useDashboard';

export default function InvoicesPage() {
  const { data: session } = useSession();
  const { invoices, loading, error, refetch } = useInvoices();
  const [filter, setFilter] = useState('all'); // all, pending, paid, overdue
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInvoices = useMemo(() => {
    let result = invoices;

    // Filtro por status
    if (filter !== 'all') {
      result = result.filter(invoice => invoice.status === filter);
    }

    // Filtro por busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(invoice => 
        invoice.number.toLowerCase().includes(term) ||
        invoice.guestName.toLowerCase().includes(term) ||
        invoice.hotelName.toLowerCase().includes(term)
      );
    }

    return result;
  }, [invoices, filter, searchTerm]);

  const stats = useMemo(() => ({
    total: invoices.length,
    paid: invoices.filter(i => i.status === 'paid').length,
    pending: invoices.filter(i => i.status === 'pending').length,
    overdue: invoices.filter(i => i.status === 'overdue').length,
    totalAmount: invoices.reduce((sum, i) => sum + i.amount, 0),
    paidAmount: invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0),
    pendingAmount: invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0),
    overdueAmount: invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0),
  }), [invoices]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'overdue':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-dark-3 dark:text-dark-6';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Paga';
      case 'pending':
        return 'Pendente';
      case 'overdue':
        return 'Vencida';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-dark dark:to-dark-2 py-20">
        <div className="container mx-auto px-4">
          <div className="flex min-h-[600px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="text-body-color dark:text-dark-6">Carregando notas fiscais...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-dark dark:to-dark-2 py-20">
        <div className="container mx-auto px-4">
          <div className="flex min-h-[600px] items-center justify-center">
            <div className="max-w-md text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                <svg className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-dark dark:text-white">Erro ao carregar notas fiscais</h3>
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

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-dark dark:to-dark-2 py-20">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2 text-sm text-body-color dark:text-dark-6">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link href="/dashboard" className="hover:text-primary">Dashboard</Link>
            <span>/</span>
            <span>Notas Fiscais</span>
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-dark dark:text-white">
                Notas Fiscais
              </h1>
              <p className="mt-2 text-lg text-body-color dark:text-dark-6">
                Acompanhe e gerencie todas as notas fiscais do sistema
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => refetch()}
                className="flex items-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-primary hover:text-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Atualizar
              </button>
              <Link
                href="/invoices/new"
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl hover:scale-105"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Emitir Nota Fiscal
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards - Estilo Moderno com Gradientes */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total de NFs */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-6 shadow-xl transition hover:shadow-2xl hover:scale-105">
            <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 transform rounded-full bg-white opacity-10"></div>
            <div className="relative">
              <div className="mb-3 flex items-center justify-between">
                <div className="rounded-lg bg-white/20 p-3">
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-sm font-medium text-white/80">Total de NFs</h3>
              <p className="mt-1 text-3xl font-bold text-white">{stats.total}</p>
              <p className="mt-2 text-xs text-white/70">
                R$ {stats.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Pagas */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-6 shadow-xl transition hover:shadow-2xl hover:scale-105">
            <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 transform rounded-full bg-white opacity-10"></div>
            <div className="relative">
              <div className="mb-3 flex items-center justify-between">
                <div className="rounded-lg bg-white/20 p-3">
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-sm font-medium text-white/80">Pagas</h3>
              <p className="mt-1 text-3xl font-bold text-white">{stats.paid}</p>
              <p className="mt-2 text-xs text-white/70">
                R$ {stats.paidAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Pendentes */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 p-6 shadow-xl transition hover:shadow-2xl hover:scale-105">
            <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 transform rounded-full bg-white opacity-10"></div>
            <div className="relative">
              <div className="mb-3 flex items-center justify-between">
                <div className="rounded-lg bg-white/20 p-3">
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-sm font-medium text-white/80">Pendentes</h3>
              <p className="mt-1 text-3xl font-bold text-white">{stats.pending}</p>
              <p className="mt-2 text-xs text-white/70">
                R$ {stats.pendingAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Vencidas */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 p-6 shadow-xl transition hover:shadow-2xl hover:scale-105">
            <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 transform rounded-full bg-white opacity-10"></div>
            <div className="relative">
              <div className="mb-3 flex items-center justify-between">
                <div className="rounded-lg bg-white/20 p-3">
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-sm font-medium text-white/80">Vencidas</h3>
              <p className="mt-1 text-3xl font-bold text-white">{stats.overdue}</p>
              <p className="mt-2 text-xs text-white/70">
                R$ {stats.overdueAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        {/* Filtros e Tabela */}
        <div className="rounded-2xl border border-stroke bg-white shadow-lg dark:border-dark-3 dark:bg-dark-2">
          {/* Header com Filtros */}
          <div className="border-b border-stroke p-6 dark:border-dark-3">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    filter === 'all'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'bg-gray-100 text-body-color hover:bg-gray-200 dark:bg-dark-3 dark:text-dark-6 dark:hover:bg-dark-4'
                  }`}
                >
                  Todas ({stats.total})
                </button>
                <button
                  onClick={() => setFilter('paid')}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    filter === 'paid'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                      : 'bg-gray-100 text-body-color hover:bg-gray-200 dark:bg-dark-3 dark:text-dark-6 dark:hover:bg-dark-4'
                  }`}
                >
                  Pagas ({stats.paid})
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    filter === 'pending'
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-md'
                      : 'bg-gray-100 text-body-color hover:bg-gray-200 dark:bg-dark-3 dark:text-dark-6 dark:hover:bg-dark-4'
                  }`}
                >
                  Pendentes ({stats.pending})
                </button>
                <button
                  onClick={() => setFilter('overdue')}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    filter === 'overdue'
                      ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-md'
                      : 'bg-gray-100 text-body-color hover:bg-gray-200 dark:bg-dark-3 dark:text-dark-6 dark:hover:bg-dark-4'
                  }`}
                >
                  Vencidas ({stats.overdue})
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar nota fiscal..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border-2 border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2 dark:text-white md:w-64"
                />
                <svg className="absolute left-3 top-3 h-5 w-5 text-body-color dark:text-dark-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Tabela */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stroke bg-gradient-to-r from-gray-50 to-gray-100 dark:border-dark-3 dark:from-dark dark:to-dark-3">
                  <th className="px-6 py-4 text-left text-sm font-bold text-dark dark:text-white">
                    Número NF
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-dark dark:text-white">
                    Hóspede
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-dark dark:text-white">
                    Hotel
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-dark dark:text-white">
                    Valor
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-dark dark:text-white">
                    Vencimento
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-dark dark:text-white">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-dark dark:text-white">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-b border-stroke transition hover:bg-blue-50/50 dark:border-dark-3 dark:hover:bg-dark/50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/20">
                          <svg className="h-5 w-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-bold text-dark dark:text-white">{invoice.number}</p>
                          <p className="text-xs text-body-color dark:text-dark-6">
                            Emitida em {new Date(invoice.issueDate).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-dark dark:text-white">{invoice.guestName}</p>
                      <Link 
                        href={`/bookings/${invoice.bookingId}`}
                        className="text-xs text-primary hover:underline"
                      >
                        Ver reserva
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-dark dark:text-white">{invoice.hotelName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-lg font-bold text-dark dark:text-white">
                        R$ {invoice.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-dark dark:text-white">
                        {new Date(invoice.dueDate).toLocaleDateString('pt-BR')}
                      </p>
                      {invoice.paymentDate && (
                        <p className="text-xs text-green-600 dark:text-green-400">
                          ✓ Pago em {new Date(invoice.paymentDate).toLocaleDateString('pt-BR')}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${getStatusColor(invoice.status)}`}>
                        {getStatusText(invoice.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/invoices/${invoice.id}`}
                          className="rounded-lg bg-blue-100 p-2 text-blue-600 transition hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                          title="Ver detalhes"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        <button 
                          className="rounded-lg bg-green-100 p-2 text-green-600 transition hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
                          title="Baixar PDF"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredInvoices.length === 0 && (
            <div className="p-12 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-dark-3 dark:to-dark-4">
                <svg className="h-10 w-10 text-body-color dark:text-dark-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-dark dark:text-white">
                Nenhuma nota fiscal encontrada
              </h3>
              <p className="mb-4 text-body-color dark:text-dark-6">
                Não há notas fiscais com o filtro selecionado.
              </p>
              <Link
                href="/invoices/new"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl hover:scale-105"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Emitir Primeira Nota Fiscal
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

