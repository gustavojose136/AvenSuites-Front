/**
 * Página: Detalhes do Hóspede
 */

'use client';

import { useEffect } from 'react';
import { useGuest } from '@/presentation/hooks/useGuest';
import { container } from '@/shared/di/Container';
import { RoleGuard } from '@/presentation/components/common/RoleGuard';
import Breadcrumb from '@/components/Common/Breadcrumb';
import Link from 'next/link';

export default function GuestDetailPage({ params }: { params: { id: string } }) {
  const { selectedGuest, loading, error, fetchGuestById } = useGuest(container.getGuestService());

  useEffect(() => {
    fetchGuestById(params.id);
  }, [params.id, fetchGuestById]);

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

  if (error || !selectedGuest) {
    return (
      <>
        <Breadcrumb pageName="Erro" />
        <section className="pb-10 pt-20 lg:pb-20 lg:pt-[120px]">
          <div className="container mx-auto">
            <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
              <p className="text-red-800 dark:text-red-200">
                {error || 'Hóspede não encontrado'}
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
        pageName={`${selectedGuest.firstName} ${selectedGuest.lastName}`}
        pages={[
          { name: 'Hóspedes', href: '/guests' },
          { name: `${selectedGuest.firstName} ${selectedGuest.lastName}`, href: `/guests/${params.id}` },
        ]}
      />
      
      <section className="pb-10 pt-20 lg:pb-20 lg:pt-[120px]">
        <div className="container mx-auto max-w-4xl space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-dark dark:text-white">
              {selectedGuest.firstName} {selectedGuest.lastName}
            </h1>

            <RoleGuard allowedRoles={['Manager', 'Admin']}>
              <Link
                href={`/guests/${params.id}/edit`}
                className="rounded-lg bg-primary px-6 py-3 font-medium text-white hover:bg-primary/90"
              >
                Editar Hóspede
              </Link>
            </RoleGuard>
          </div>

          {/* Dados Pessoais */}
          <div className="rounded-lg border border-stroke bg-white p-6 dark:border-dark-3 dark:bg-dark-2">
            <h2 className="mb-4 text-xl font-semibold text-dark dark:text-white">
              Dados Pessoais
            </h2>
            
            <div className="grid gap-4 md:grid-cols-2">
              {selectedGuest.birthDate && (
                <div>
                  <p className="text-sm text-body-color dark:text-dark-6">Data de Nascimento</p>
                  <p className="text-lg font-medium text-dark dark:text-white">
                    {new Date(selectedGuest.birthDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              )}

              {selectedGuest.nationality && (
                <div>
                  <p className="text-sm text-body-color dark:text-dark-6">Nacionalidade</p>
                  <p className="text-lg font-medium text-dark dark:text-white">
                    {selectedGuest.nationality}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Documentação */}
          <div className="rounded-lg border border-stroke bg-white p-6 dark:border-dark-3 dark:bg-dark-2">
            <h2 className="mb-4 text-xl font-semibold text-dark dark:text-white">
              Documentação
            </h2>
            
            <div className="grid gap-4 md:grid-cols-2">
              {selectedGuest.documentType && (
                <div>
                  <p className="text-sm text-body-color dark:text-dark-6">Tipo de Documento</p>
                  <p className="text-lg font-medium text-dark dark:text-white">
                    {selectedGuest.documentType}
                  </p>
                </div>
              )}

              {selectedGuest.documentNumber && (
                <div>
                  <p className="text-sm text-body-color dark:text-dark-6">Número do Documento</p>
                  <p className="text-lg font-medium text-dark dark:text-white">
                    {selectedGuest.documentNumber}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Contato */}
          <div className="rounded-lg border border-stroke bg-white p-6 dark:border-dark-3 dark:bg-dark-2">
            <h2 className="mb-4 text-xl font-semibold text-dark dark:text-white">
              Informações de Contato
            </h2>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-body-color dark:text-dark-6">E-mail</p>
                <p className="text-lg font-medium text-dark dark:text-white">
                  <a href={`mailto:${selectedGuest.email}`} className="text-primary hover:underline">
                    {selectedGuest.email}
                  </a>
                </p>
              </div>

              <div>
                <p className="text-sm text-body-color dark:text-dark-6">Telefone</p>
                <p className="text-lg font-medium text-dark dark:text-white">
                  <a href={`tel:${selectedGuest.phoneE164}`} className="text-primary hover:underline">
                    {selectedGuest.phoneE164}
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Endereço */}
          {(selectedGuest.address || selectedGuest.city || selectedGuest.state) && (
            <div className="rounded-lg border border-stroke bg-white p-6 dark:border-dark-3 dark:bg-dark-2">
              <h2 className="mb-4 text-xl font-semibold text-dark dark:text-white">
                Endereço
              </h2>
              
              <div className="space-y-2">
                {selectedGuest.address && (
                  <p className="text-dark dark:text-white">{selectedGuest.address}</p>
                )}
                {(selectedGuest.city || selectedGuest.state) && (
                  <p className="text-body-color dark:text-dark-6">
                    {selectedGuest.city && selectedGuest.city}
                    {selectedGuest.city && selectedGuest.state && ' - '}
                    {selectedGuest.state && selectedGuest.state}
                  </p>
                )}
                {selectedGuest.postalCode && (
                  <p className="text-body-color dark:text-dark-6">
                    CEP: {selectedGuest.postalCode}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Ações Rápidas */}
          <div className="rounded-lg border border-stroke bg-white p-6 dark:border-dark-3 dark:bg-dark-2">
            <h2 className="mb-4 text-xl font-semibold text-dark dark:text-white">
              Ações Rápidas
            </h2>
            
            <div className="flex gap-4">
              <Link
                href={`/bookings/new?guestId=${params.id}`}
                className="flex-1 rounded-lg border border-primary bg-primary/10 px-6 py-3 text-center font-medium text-primary hover:bg-primary/20"
              >
                Fazer Reserva
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

