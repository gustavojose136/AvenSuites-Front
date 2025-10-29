/**
 * Hook: useRoom
 * Custom hook para gerenciar quartos
 */

'use client';

import { useState, useCallback } from 'react';
import { IRoomService } from '@/domain/services/IRoomService';
import { 
  Room, 
  RoomCreateRequest, 
  RoomUpdateRequest, 
  RoomAvailabilityRequest, 
  RoomAvailabilityResponse 
} from '@/application/dto/Room.dto';

export const useRoom = (roomService: IRoomService) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [availableRooms, setAvailableRooms] = useState<RoomAvailabilityResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await roomService.getRooms();
      setRooms(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar quartos';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [roomService]);

  const fetchRoomById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await roomService.getRoom(id);
      setSelectedRoom(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar quarto';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [roomService]);

  const fetchRoomsByHotel = useCallback(async (hotelId: string, status?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await roomService.getRoomsByHotel(hotelId, status);
      setRooms(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar quartos';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [roomService]);

  const checkAvailability = useCallback(async (request: RoomAvailabilityRequest) => {
    setLoading(true);
    setError(null);
    try {
      const data = await roomService.checkAvailability(request);
      setAvailableRooms(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao verificar disponibilidade';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [roomService]);

  const createRoom = useCallback(async (data: RoomCreateRequest) => {
    setLoading(true);
    setError(null);
    try {
      const newRoom = await roomService.createRoom(data);
      setRooms(prev => [...prev, newRoom]);
      return newRoom;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar quarto';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [roomService]);

  const updateRoom = useCallback(async (id: string, data: RoomUpdateRequest) => {
    setLoading(true);
    setError(null);
    try {
      const updatedRoom = await roomService.updateRoom(id, data);
      setRooms(prev => prev.map(r => r.id === id ? updatedRoom : r));
      if (selectedRoom?.id === id) {
        setSelectedRoom(updatedRoom);
      }
      return updatedRoom;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar quarto';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [roomService, selectedRoom]);

  const deleteRoom = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await roomService.deleteRoom(id);
      setRooms(prev => prev.filter(r => r.id !== id));
      if (selectedRoom?.id === id) {
        setSelectedRoom(null);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao deletar quarto';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [roomService, selectedRoom]);

  return {
    rooms,
    selectedRoom,
    availableRooms,
    loading,
    error,
    fetchRooms,
    fetchRoomById,
    fetchRoomsByHotel,
    checkAvailability,
    createRoom,
    updateRoom,
    deleteRoom,
  };
};

