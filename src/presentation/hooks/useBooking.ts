

'use client';

import { useState, useCallback } from 'react';
import { IBookingService } from '@/domain/services/IBookingService';
import { Booking, BookingCreateRequest, BookingUpdateRequest } from '@/application/dto/Booking.dto';

export const useBooking = (bookingService: IBookingService) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingService.getBookings();
      setBookings(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar reservas';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [bookingService]);

  const fetchBookingById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingService.getBooking(id);
      setSelectedBooking(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar reserva';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [bookingService]);

  const fetchBookingByCode = useCallback(async (hotelId: string, code: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingService.getBookingByCode(hotelId, code);
      setSelectedBooking(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar reserva';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [bookingService]);

  const fetchBookingsByHotel = useCallback(async (hotelId: string, startDate?: string, endDate?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingService.getBookingsByHotel(hotelId, startDate, endDate);
      setBookings(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar reservas';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [bookingService]);

  const fetchBookingsByGuest = useCallback(async (guestId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingService.getBookingsByGuest(guestId);
      setBookings(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar reservas';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [bookingService]);

  const createBooking = useCallback(async (data: BookingCreateRequest) => {
    setLoading(true);
    setError(null);
    try {
      const newBooking = await bookingService.createBooking(data);
      setBookings(prev => [...prev, newBooking]);
      return newBooking;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar reserva';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [bookingService]);

  const updateBooking = useCallback(async (id: string, data: BookingUpdateRequest) => {
    setLoading(true);
    setError(null);
    try {
      const updatedBooking = await bookingService.updateBooking(id, data);
      setBookings(prev => prev.map(b => b.id === id ? updatedBooking : b));
      if (selectedBooking?.id === id) {
        setSelectedBooking(updatedBooking);
      }
      return updatedBooking;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar reserva';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [bookingService, selectedBooking]);

  const cancelBooking = useCallback(async (id: string, reason?: string) => {
    setLoading(true);
    setError(null);
    try {
      await bookingService.cancelBooking(id, reason);

      setBookings(prev => prev.map(b =>
        b.id === id ? { ...b, status: 'CANCELLED' } : b
      ));
      if (selectedBooking?.id === id) {
        setSelectedBooking({ ...selectedBooking, status: 'CANCELLED' });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao cancelar reserva';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [bookingService, selectedBooking]);

  const confirmBooking = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await bookingService.confirmBooking(id);

      setBookings(prev => prev.map(b =>
        b.id === id ? { ...b, status: 'CONFIRMED' } : b
      ));
      if (selectedBooking?.id === id) {
        setSelectedBooking({ ...selectedBooking, status: 'CONFIRMED' });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao confirmar reserva';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [bookingService, selectedBooking]);

  const checkIn = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const updatedBooking = await bookingService.checkIn(id);

      setBookings(prev => prev.map(b =>
        b.id === id ? updatedBooking : b
      ));
      if (selectedBooking?.id === id) {
        setSelectedBooking(updatedBooking);
      }
      return updatedBooking;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao realizar check-in';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [bookingService, selectedBooking]);

  const checkOut = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const updatedBooking = await bookingService.checkOut(id);

      setBookings(prev => prev.map(b =>
        b.id === id ? updatedBooking : b
      ));
      if (selectedBooking?.id === id) {
        setSelectedBooking(updatedBooking);
      }
      return updatedBooking;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao realizar check-out';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [bookingService, selectedBooking]);

  return {
    bookings,
    selectedBooking,
    loading,
    error,
    fetchBookings,
    fetchBookingById,
    fetchBookingByCode,
    fetchBookingsByHotel,
    fetchBookingsByGuest,
    createBooking,
    updateBooking,
    cancelBooking,
    confirmBooking,
    checkIn,
    checkOut,
  };
};

