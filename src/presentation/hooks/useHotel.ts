/**
 * Hook: useHotel
 * Custom hook para gerenciar hotéis
 * Princípio: Single Responsibility - Responsável apenas por lógica de hotéis
 */

'use client';

import { useState, useCallback } from 'react';
import { IHotelService } from '@/domain/services/IHotelService';
import { Hotel, HotelCreateRequest, HotelUpdateRequest } from '@/application/dto/Hotel.dto';

export const useHotel = (hotelService: IHotelService) => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHotels = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await hotelService.getHotels();
      setHotels(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar hotéis';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [hotelService]);

  const fetchHotelById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await hotelService.getHotel(id);
      setSelectedHotel(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar hotel';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [hotelService]);

  const createHotel = useCallback(async (data: HotelCreateRequest) => {
    setLoading(true);
    setError(null);
    try {
      const newHotel = await hotelService.createHotel(data);
      setHotels(prev => [...prev, newHotel]);
      return newHotel;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar hotel';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [hotelService]);

  const updateHotel = useCallback(async (id: string, data: HotelUpdateRequest) => {
    setLoading(true);
    setError(null);
    try {
      const updatedHotel = await hotelService.updateHotel(id, data);
      setHotels(prev => prev.map(h => h.id === id ? updatedHotel : h));
      if (selectedHotel?.id === id) {
        setSelectedHotel(updatedHotel);
      }
      return updatedHotel;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar hotel';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [hotelService, selectedHotel]);

  const deleteHotel = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await hotelService.deleteHotel(id);
      setHotels(prev => prev.filter(h => h.id !== id));
      if (selectedHotel?.id === id) {
        setSelectedHotel(null);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao deletar hotel';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [hotelService, selectedHotel]);

  return {
    hotels,
    selectedHotel,
    loading,
    error,
    fetchHotels,
    fetchHotelById,
    createHotel,
    updateHotel,
    deleteHotel,
  };
};

