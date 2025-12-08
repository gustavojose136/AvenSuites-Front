

'use client';

import { useEffect } from 'react';
import { useHotel } from '@/presentation/hooks/useHotel';
import { container } from '@/shared/di/Container';
import { RoomList } from '@/presentation/components/Room/RoomList';
import Breadcrumb from '@/components/Common/Breadcrumb';

export default function HotelDetailPage({ params }: { params: { id: string } }) {
  const { selectedHotel, loading, error, fetchHotelById } = useHotel(container.getHotelService());

  useEffect(() => {
    fetchHotelById(params.id);
  }, [params.id, fetchHotelById]);

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

  if (error || !selectedHotel) {
    return (
      <>
        <Breadcrumb pageName="Erro" />
        <section className="pb-10 pt-20 lg:pb-20 lg:pt-[120px]">
          <div className="container mx-auto">
            <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
              <p className="text-red-800 dark:text-red-200">
                {error || 'Hotel não encontrado'}
              </p>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Breadcrumb pageName={selectedHotel.name} />

      <section className="pb-10 pt-20 lg:pb-20 lg:pt-[120px]">
        <div className="container mx-auto space-y-8">
          {}
          <div className="rounded-lg border border-stroke bg-white p-8 dark:border-dark-3 dark:bg-dark-2">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h1 className="mb-2 text-3xl font-bold text-dark dark:text-white">
                  {selectedHotel.name}
                </h1>
                {selectedHotel.tradeName && (
                  <p className="text-lg text-body-color dark:text-dark-6">
                    {selectedHotel.tradeName}
                  </p>
                )}
              </div>
              <span
                className={`inline-block rounded px-4 py-2 text-sm font-medium ${
                  selectedHotel.status === 'Active'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                }`}
              >
                {selectedHotel.status}
              </span>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-dark dark:text-white">
                  Informações Gerais
                </h3>
                {selectedHotel.cnpj && (
                  <p className="text-body-color dark:text-dark-6">
                    <span className="font-medium">CNPJ:</span> {selectedHotel.cnpj}
                  </p>
                )}
                {selectedHotel.email && (
                  <p className="text-body-color dark:text-dark-6">
                    <span className="font-medium">E-mail:</span> {selectedHotel.email}
                  </p>
                )}
                {selectedHotel.phoneE164 && (
                  <p className="text-body-color dark:text-dark-6">
                    <span className="font-medium">Telefone:</span> {selectedHotel.phoneE164}
                  </p>
                )}
                {selectedHotel.timezone && (
                  <p className="text-body-color dark:text-dark-6">
                    <span className="font-medium">Fuso Horário:</span> {selectedHotel.timezone}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-dark dark:text-white">
                  Endereço
                </h3>
                {selectedHotel.addressLine1 && (
                  <p className="text-body-color dark:text-dark-6">
                    {selectedHotel.addressLine1}
                  </p>
                )}
                {selectedHotel.addressLine2 && (
                  <p className="text-body-color dark:text-dark-6">
                    {selectedHotel.addressLine2}
                  </p>
                )}
                {(selectedHotel.city || selectedHotel.state) && (
                  <p className="text-body-color dark:text-dark-6">
                    {selectedHotel.city && selectedHotel.city}
                    {selectedHotel.city && selectedHotel.state && ' / '}
                    {selectedHotel.state && selectedHotel.state}
                  </p>
                )}
                {selectedHotel.postalCode && (
                  <p className="text-body-color dark:text-dark-6">
                    CEP: {selectedHotel.postalCode}
                  </p>
                )}
              </div>
            </div>
          </div>

          {}
          <RoomList hotelId={params.id} />
        </div>
      </section>
    </>
  );
}

