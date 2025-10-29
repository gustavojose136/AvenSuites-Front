/**
 * Component: HotelList
 * Lista de hotéis com ações
 */

'use client';

import React, { useEffect } from 'react';
import { useHotel } from '@/presentation/hooks/useHotel';
import { usePermissions } from '@/presentation/hooks/usePermissions';
import { RoleGuard } from '@/presentation/components/common/RoleGuard';
import { container } from '@/shared/di/Container';
import Link from 'next/link';

export const HotelList: React.FC = () => {
  const { hotels, loading, error, fetchHotels, deleteHotel } = useHotel(container.getHotelService());
  const { canManage, canDelete } = usePermissions();

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Deseja realmente deletar o hotel "${name}"?`)) {
      try {
        await deleteHotel(id);
        alert('Hotel deletado com sucesso!');
      } catch (err) {
        alert('Erro ao deletar hotel');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
        <p className="text-red-800 dark:text-red-200">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-dark dark:text-white">Hotéis</h2>
        
        {/* Botão visível apenas para Manager e Admin */}
        <RoleGuard allowedRoles={['Manager', 'Admin']}>
          <Link
            href="/hotels/new"
            className="rounded-lg bg-primary px-6 py-3 text-base font-medium text-white hover:bg-primary/90"
          >
            + Novo Hotel
          </Link>
        </RoleGuard>
      </div>

      {hotels.length === 0 ? (
        <div className="rounded-lg border border-stroke bg-white p-8 text-center dark:border-dark-3 dark:bg-dark-2">
          <p className="text-body-color dark:text-dark-6">Nenhum hotel encontrado</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {hotels.map((hotel) => (
            <div
              key={hotel.id}
              className="rounded-lg border border-stroke bg-white p-6 shadow-sm dark:border-dark-3 dark:bg-dark-2"
            >
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-dark dark:text-white">
                  {hotel.name}
                </h3>
                {hotel.tradeName && (
                  <p className="text-sm text-body-color dark:text-dark-6">
                    {hotel.tradeName}
                  </p>
                )}
              </div>

              <div className="mb-4 space-y-2 text-sm">
                {hotel.cnpj && (
                  <p className="text-body-color dark:text-dark-6">
                    <span className="font-medium">CNPJ:</span> {hotel.cnpj}
                  </p>
                )}
                {hotel.city && hotel.state && (
                  <p className="text-body-color dark:text-dark-6">
                    <span className="font-medium">Localização:</span> {hotel.city}/{hotel.state}
                  </p>
                )}
                {hotel.email && (
                  <p className="text-body-color dark:text-dark-6">
                    <span className="font-medium">E-mail:</span> {hotel.email}
                  </p>
                )}
                <p className="text-body-color dark:text-dark-6">
                  <span className="font-medium">Status:</span>{' '}
                  <span
                    className={`inline-block rounded px-2 py-1 text-xs ${
                      hotel.status === 'Active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                    }`}
                  >
                    {hotel.status}
                  </span>
                </p>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/hotels/${hotel.id}`}
                  className="flex-1 rounded bg-primary/10 px-4 py-2 text-center text-sm font-medium text-primary hover:bg-primary/20"
                >
                  Ver Detalhes
                </Link>
                
                {/* Botão visível apenas para Admin */}
                <RoleGuard allowedRoles={['Admin']}>
                  <button
                    onClick={() => handleDelete(hotel.id, hotel.name)}
                    className="rounded bg-red-100 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                  >
                    Deletar
                  </button>
                </RoleGuard>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

