/**
 * Component: GuestList
 * Lista de hóspedes com ações
 */

'use client';

import React, { useEffect } from 'react';
import { useGuest } from '@/presentation/hooks/useGuest';
import { container } from '@/shared/di/Container';
import { RoleGuard } from '@/presentation/components/common/RoleGuard';
import Link from 'next/link';

interface GuestListProps {
  hotelId?: string;
}

export const GuestList: React.FC<GuestListProps> = ({ hotelId }) => {
  const { guests, loading, error, fetchGuests, fetchGuestsByHotel, deleteGuest } = 
    useGuest(container.getGuestService());

  useEffect(() => {
    if (hotelId) {
      fetchGuestsByHotel(hotelId);
    } else {
      fetchGuests();
    }
  }, [hotelId]);

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Deseja realmente deletar o hóspede "${name}"?`)) {
      try {
        await deleteGuest(id);
        alert('Hóspede deletado com sucesso!');
      } catch (err) {
        alert('Erro ao deletar hóspede');
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
        <h2 className="text-2xl font-bold text-dark dark:text-white">
          Hóspedes {guests.length > 0 && `(${guests.length})`}
        </h2>
        
        <RoleGuard allowedRoles={['Manager', 'Admin']}>
          <Link
            href="/guests/new"
            className="rounded-lg bg-primary px-6 py-3 text-base font-medium text-white hover:bg-primary/90"
          >
            + Novo Hóspede
          </Link>
        </RoleGuard>
      </div>

      {guests.length === 0 ? (
        <div className="rounded-lg border border-stroke bg-white p-8 text-center dark:border-dark-3 dark:bg-dark-2">
          <p className="text-body-color dark:text-dark-6">Nenhum hóspede encontrado</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {guests.map((guest) => (
            <div
              key={guest.id}
              className="rounded-lg border border-stroke bg-white p-6 shadow-sm dark:border-dark-3 dark:bg-dark-2"
            >
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-dark dark:text-white">
                  {guest.fullName}
                </h3>
              </div>

              <div className="mb-4 space-y-2 text-sm">
                <p className="text-body-color dark:text-dark-6">
                  <span className="font-medium">E-mail:</span> {guest.email}
                </p>
                <p className="text-body-color dark:text-dark-6">
                  <span className="font-medium">Telefone:</span> {guest.phoneE164}
                </p>
                {guest.documentType && guest.documentPlain && (
                  <p className="text-body-color dark:text-dark-6">
                    <span className="font-medium">{guest.documentType}:</span> {guest.documentPlain}
                  </p>
                )}
                {guest.countryCode && (
                  <p className="text-body-color dark:text-dark-6">
                    <span className="font-medium">País:</span> {guest.countryCode}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/guests/${guest.id}`}
                  className="flex-1 rounded bg-primary/10 px-4 py-2 text-center text-sm font-medium text-primary hover:bg-primary/20"
                >
                  Ver Detalhes
                </Link>
                
                <RoleGuard allowedRoles={['Admin']}>
                  <button
                    onClick={() => handleDelete(guest.id, guest.fullName)}
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

