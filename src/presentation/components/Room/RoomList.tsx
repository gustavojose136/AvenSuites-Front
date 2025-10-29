/**
 * Component: RoomList
 * Lista de quartos com filtros
 */

'use client';

import React, { useEffect } from 'react';
import { useRoom } from '@/presentation/hooks/useRoom';
import { container } from '@/shared/di/Container';

interface RoomListProps {
  hotelId: string;
}

export const RoomList: React.FC<RoomListProps> = ({ hotelId }) => {
  const { rooms, loading, error, fetchRoomsByHotel, deleteRoom } = useRoom(container.getRoomService());

  useEffect(() => {
    fetchRoomsByHotel(hotelId);
  }, [hotelId, fetchRoomsByHotel]);

  const handleDelete = async (id: string, number: string) => {
    if (confirm(`Deseja realmente deletar o quarto "${number}"?`)) {
      try {
        await deleteRoom(id);
        alert('Quarto deletado com sucesso!');
      } catch (err) {
        alert('Erro ao deletar quarto');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'Occupied':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'Maintenance':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'OutOfOrder':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
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
        <h3 className="text-xl font-bold text-dark dark:text-white">Quartos</h3>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
          + Novo Quarto
        </button>
      </div>

      {rooms.length === 0 ? (
        <div className="rounded-lg border border-stroke bg-white p-8 text-center dark:border-dark-3 dark:bg-dark-2">
          <p className="text-body-color dark:text-dark-6">Nenhum quarto encontrado</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="rounded-lg border border-stroke bg-white p-6 shadow-sm dark:border-dark-3 dark:bg-dark-2"
            >
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-lg font-semibold text-dark dark:text-white">
                  Quarto {room.roomNumber}
                </h4>
                <span className={`inline-block rounded px-2 py-1 text-xs font-medium ${getStatusColor(room.status)}`}>
                  {room.status}
                </span>
              </div>

              <div className="mb-4 space-y-2 text-sm">
                {room.floor && (
                  <p className="text-body-color dark:text-dark-6">
                    <span className="font-medium">Andar:</span> {room.floor}
                  </p>
                )}
                {room.maxOccupancy && (
                  <p className="text-body-color dark:text-dark-6">
                    <span className="font-medium">Capacidade:</span> {room.maxOccupancy} pessoa(s)
                  </p>
                )}
                {room.bedType && (
                  <p className="text-body-color dark:text-dark-6">
                    <span className="font-medium">Tipo de Cama:</span> {room.bedType}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button className="flex-1 rounded bg-primary/10 px-4 py-2 text-center text-sm font-medium text-primary hover:bg-primary/20">
                  Ver Detalhes
                </button>
                <button
                  onClick={() => handleDelete(room.id, room.roomNumber)}
                  className="rounded bg-red-100 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                >
                  Deletar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

