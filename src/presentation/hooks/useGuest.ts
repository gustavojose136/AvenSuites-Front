/**
 * Hook: useGuest
 * Custom hook para gerenciar hóspedes
 */

'use client';

import { useState, useCallback } from 'react';
import { IGuestService } from '@/domain/services/IGuestService';
import { Guest, GuestCreateRequest, GuestUpdateRequest } from '@/application/dto/Guest.dto';

export const useGuest = (guestService: IGuestService) => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGuests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await guestService.getGuests();
      setGuests(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar hóspedes';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [guestService]);

  const fetchGuestById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await guestService.getGuest(id);
      setSelectedGuest(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar hóspede';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [guestService]);

  const fetchGuestsByHotel = useCallback(async (hotelId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await guestService.getGuestsByHotel(hotelId);
      setGuests(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar hóspedes';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [guestService]);

  const createGuest = useCallback(async (data: GuestCreateRequest) => {
    setLoading(true);
    setError(null);
    try {
      const newGuest = await guestService.createGuest(data);
      setGuests(prev => [...prev, newGuest]);
      return newGuest;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar hóspede';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [guestService]);

  const updateGuest = useCallback(async (id: string, data: GuestUpdateRequest) => {
    setLoading(true);
    setError(null);
    try {
      const updatedGuest = await guestService.updateGuest(id, data);
      setGuests(prev => prev.map(g => g.id === id ? updatedGuest : g));
      if (selectedGuest?.id === id) {
        setSelectedGuest(updatedGuest);
      }
      return updatedGuest;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar hóspede';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [guestService, selectedGuest]);

  const deleteGuest = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await guestService.deleteGuest(id);
      setGuests(prev => prev.filter(g => g.id !== id));
      if (selectedGuest?.id === id) {
        setSelectedGuest(null);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao deletar hóspede';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [guestService, selectedGuest]);

  return {
    guests,
    selectedGuest,
    loading,
    error,
    fetchGuests,
    fetchGuestById,
    fetchGuestsByHotel,
    createGuest,
    updateGuest,
    deleteGuest,
  };
};

