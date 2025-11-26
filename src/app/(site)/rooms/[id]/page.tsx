/**
 * Página: Detalhes do Quarto
 */

'use client';

import { useEffect } from 'react';
import { useRoom } from '@/presentation/hooks/useRoom';
import { container } from '@/shared/di/Container';
import { RoleGuard } from '@/presentation/components/common/RoleGuard';
import Breadcrumb from '@/components/Common/Breadcrumb';
import Link from 'next/link';

export default function RoomDetailPage({ params }: { params: { id: string } }) {
  const { selectedRoom, loading, error, fetchRoomById } = useRoom(container.getRoomService());

  useEffect(() => {
    fetchRoomById(params.id);
  }, [params.id, fetchRoomById]);

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

  if (error || !selectedRoom) {
    return (
      <>
        <Breadcrumb pageName="Erro" />
        <section className="pb-10 pt-20 lg:pb-20 lg:pt-[120px]">
          <div className="container mx-auto">
            <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
              <p className="text-red-800 dark:text-red-200">
                {error || 'Quarto não encontrado'}
              </p>
            </div>
          </div>
        </section>
      </>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'OCCUPIED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'MAINTENANCE':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'CLEANING':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'INACTIVE':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'ACTIVE': 'Disponível',
      'OCCUPIED': 'Ocupado',
      'MAINTENANCE': 'Em Manutenção',
      'CLEANING': 'Em Limpeza',
      'INACTIVE': 'Inativo',
    };
    return statusMap[status] || status;
  };

  return (
    <>
      <Breadcrumb 
        pageName={`Quarto ${selectedRoom.roomNumber}`}
        pageDescription="Detalhes do quarto"
      />
      
      <section className="pb-10 pt-20 lg:pb-20 lg:pt-[120px]">
        <div className="container mx-auto max-w-4xl space-y-6">
          {/* Header com ações */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-dark dark:text-white">
                Quarto {selectedRoom.roomNumber}
              </h1>
              <span className={`inline-block rounded px-3 py-1 text-sm font-medium ${getStatusColor(selectedRoom.status)}`}>
                {getStatusText(selectedRoom.status)}
              </span>
            </div>

            <RoleGuard allowedRoles={['Manager', 'Admin']}>
              <Link
                href={`/rooms/${params.id}/edit`}
                className="rounded-lg bg-primary px-6 py-3 font-medium text-white hover:bg-primary/90"
              >
                Editar Quarto
              </Link>
            </RoleGuard>
          </div>

          {/* Informações do Quarto */}
          <div className="rounded-lg border border-stroke bg-white p-6 dark:border-dark-3 dark:bg-dark-2">
            <h2 className="mb-4 text-xl font-semibold text-dark dark:text-white">
              Informações
            </h2>
            
            <div className="grid gap-4 md:grid-cols-2">
              {selectedRoom.floor && (
                <div>
                  <p className="text-sm text-body-color dark:text-dark-6">Andar</p>
                  <p className="text-lg font-medium text-dark dark:text-white">{selectedRoom.floor}</p>
                </div>
              )}

              {selectedRoom.roomType && (
                <>
                  <div>
                    <p className="text-sm text-body-color dark:text-dark-6">Tipo de Quarto</p>
                    <p className="text-lg font-medium text-dark dark:text-white">
                      {selectedRoom.roomType.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-body-color dark:text-dark-6">Capacidade</p>
                    <p className="text-lg font-medium text-dark dark:text-white">
                      {selectedRoom.roomType.capacityAdults} adultos
                      {selectedRoom.roomType.capacityChildren > 0 && ` + ${selectedRoom.roomType.capacityChildren} crianças`}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-body-color dark:text-dark-6">Preço Base</p>
                    <p className="text-lg font-medium text-primary">
                      R$ {selectedRoom.roomType.basePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/noite
                    </p>
                  </div>
                </>
              )}
            </div>

            {selectedRoom.roomType?.description && (
              <div className="mt-4 pt-4 border-t border-stroke dark:border-dark-3">
                <p className="text-sm text-body-color dark:text-dark-6 mb-2">Descrição</p>
                <p className="text-dark dark:text-white">{selectedRoom.roomType.description}</p>
              </div>
            )}
          </div>

          {/* Ações Rápidas */}
          {selectedRoom.status === 'ACTIVE' && (
            <div className="rounded-lg border border-stroke bg-white p-6 dark:border-dark-3 dark:bg-dark-2">
              <h2 className="mb-4 text-xl font-semibold text-dark dark:text-white">
                Ações Rápidas
              </h2>
              
              <div className="flex gap-4">
                <Link
                  href={`/bookings/new?roomId=${params.id}`}
                  className="flex-1 rounded-lg border border-primary bg-primary/10 px-6 py-3 text-center font-medium text-primary hover:bg-primary/20"
                >
                  Fazer Reserva
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

