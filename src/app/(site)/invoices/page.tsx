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
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-dark-3 dark:text-dark-6';
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
    <section className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-dark dark:to-dark-2 py-20">
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
              <h1 className="text-3xl font-bold text-dark dark:text-white lg:text-4xl">
                Notas Fiscais
              </h1>
              <p className="mt-2 text-body-color dark:text-dark-6">
                Acompanhe e gerencie todas as notas fiscais
              </p>
            </div>
            <Link
              href="/invoices/new"
              className="flex w-fit items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Emitir Nota Fiscal
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-stroke bg-white p-6 shadow-sm dark:border-dark-3 dark:bg-dark-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-body-color dark:text-dark-6">Total de NFs</p>
                <h3 className="mt-2 text-3xl font-bold text-dark dark:text-white">{stats.total}</h3>
                <p className="mt-2 text-sm font-medium text-primary">
                  R$ {stats.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <svg className="h-7 w-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-stroke bg-white p-6 shadow-sm dark:border-dark-3 dark:bg-dark-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-body-color dark:text-dark-6">Pagas</p>
                <h3 className="mt-2 text-3xl font-bold text-green-600">{stats.paid}</h3>
                <p className="mt-2 text-sm font-medium text-green-600">
                  R$ {stats.paidAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/20">
                <svg className="h-7 w-7 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-stroke bg-white p-6 shadow-sm dark:border-dark-3 dark:bg-dark-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-body-color dark:text-dark-6">Pendentes</p>
                <h3 className="mt-2 text-3xl font-bold text-yellow-600">{stats.pending}</h3>
                <p className="mt-2 text-sm font-medium text-yellow-600">
                  R$ {stats.pendingAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-yellow-100 dark:bg-yellow-900/20">
                <svg className="h-7 w-7 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-stroke bg-white p-6 shadow-sm dark:border-dark-3 dark:bg-dark-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-body-color dark:text-dark-6">Vencidas</p>
                <h3 className="mt-2 text-3xl font-bold text-red-600">{stats.overdue}</h3>
                <p className="mt-2 text-sm font-medium text-red-600">
                  R$ {stats.overdueAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/20">
                <svg className="h-7 w-7 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros e Tabela */}
        <div className="rounded-2xl border border-stroke bg-white shadow-sm dark:border-dark-3 dark:bg-dark-2">
          {/* Header com Filtros */}
          <div className="border-b border-stroke p-6 dark:border-dark-3">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    filter === 'all'
                      ? 'bg-primary text-white'
                      : 'bg-transparent text-body-color hover:bg-primary/10 dark:text-dark-6'
                  }`}
                >
                  Todas ({stats.total})
                </button>
                <button
                  onClick={() => setFilter('paid')}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    filter === 'paid'
                      ? 'bg-green-600 text-white'
                      : 'bg-transparent text-body-color hover:bg-green-100 dark:text-dark-6 dark:hover:bg-green-900/20'
                  }`}
                >
                  Pagas ({stats.paid})
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    filter === 'pending'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-transparent text-body-color hover:bg-yellow-100 dark:text-dark-6 dark:hover:bg-yellow-900/20'
                  }`}
                >
                  Pendentes ({stats.pending})
                </button>
                <button
                  onClick={() => setFilter('overdue')}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    filter === 'overdue'
                      ? 'bg-red-600 text-white'
                      : 'bg-transparent text-body-color hover:bg-red-100 dark:text-dark-6 dark:hover:bg-red-900/20'
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
                  className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-10 pr-4 text-sm outline-none focus:border-primary dark:border-dark-3 md:w-64"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-body-color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Tabela */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stroke bg-gray-50 dark:border-dark-3 dark:bg-dark">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-dark dark:text-white">
                    Número NF
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-dark dark:text-white">
                    Hóspede
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-dark dark:text-white">
                    Hotel
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-dark dark:text-white">
                    Valor
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-dark dark:text-white">
                    Vencimento
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-dark dark:text-white">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-dark dark:text-white">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-b border-stroke transition hover:bg-gray-50 dark:border-dark-3 dark:hover:bg-dark"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-dark dark:text-white">{invoice.number}</p>
                      <p className="text-sm text-body-color dark:text-dark-6">
                        Emitida em {new Date(invoice.issueDate).toLocaleDateString('pt-BR')}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-dark dark:text-white">{invoice.guestName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-dark dark:text-white">{invoice.hotelName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-dark dark:text-white">
                        R$ {invoice.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-dark dark:text-white">
                        {new Date(invoice.dueDate).toLocaleDateString('pt-BR')}
                      </p>
                      {invoice.paymentDate && (
                        <p className="text-sm text-green-600 dark:text-green-400">
                          Pago em {new Date(invoice.paymentDate).toLocaleDateString('pt-BR')}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(invoice.status)}`}>
                        {getStatusText(invoice.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="rounded-lg p-2 text-body-color transition hover:bg-gray-100 hover:text-primary dark:hover:bg-dark">
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button className="rounded-lg p-2 text-body-color transition hover:bg-gray-100 hover:text-primary dark:hover:bg-dark">
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
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-dark-3">
                <svg className="h-8 w-8 text-body-color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-dark dark:text-white">
                Nenhuma nota fiscal encontrada
              </h3>
              <p className="text-body-color dark:text-dark-6">
                Não há notas fiscais com o filtro selecionado.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

