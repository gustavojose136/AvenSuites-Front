/**
 * Testes: useBooking Hook
 * Testa o hook customizado de reservas
 * SOLID - Dependency Inversion: Testa através de service mockado
 */

import { renderHook, waitFor } from '@testing-library/react';
import { useBooking } from '../useBooking';
import { IBookingService } from '@/domain/services/IBookingService';
import { Booking, BookingCreateRequest } from '@/application/dto/Booking.dto';

describe('useBooking', () => {
  let mockService: jest.Mocked<IBookingService>;
  let mockBooking: Booking;

  beforeEach(() => {
    mockBooking = {
      id: '1',
      code: 'BK001',
      status: 'PENDING',
      source: 'WEB',
      checkInDate: '2024-12-01',
      checkOutDate: '2024-12-05',
      adults: 2,
      children: 0,
      currency: 'BRL',
      totalAmount: 600,
      mainGuestId: 'guest-1',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      bookingRooms: [],
      payments: [],
    };

    mockService = {
      getBookings: jest.fn(),
      getBooking: jest.fn(),
      getBookingByCode: jest.fn(),
      getBookingsByHotel: jest.fn(),
      getBookingsByGuest: jest.fn(),
      createBooking: jest.fn(),
      updateBooking: jest.fn(),
      cancelBooking: jest.fn(),
      confirmBooking: jest.fn(),
      checkIn: jest.fn(),
      checkOut: jest.fn(),
    } as unknown as jest.Mocked<IBookingService>;
  });

  describe('fetchBookings', () => {
    it('deve buscar reservas com sucesso', async () => {
      const bookings = [mockBooking];
      mockService.getBookings.mockResolvedValue(bookings);

      const { result } = renderHook(() => useBooking(mockService));

      await result.current.fetchBookings();

      await waitFor(() => {
        expect(result.current.bookings).toEqual(bookings);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
      });
    });

    it('deve tratar erro ao buscar reservas', async () => {
      const error = new Error('Erro ao buscar');
      mockService.getBookings.mockRejectedValue(error);

      const { result } = renderHook(() => useBooking(mockService));

      await result.current.fetchBookings();

      await waitFor(() => {
        expect(result.current.error).toBe('Erro ao buscar reservas');
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('fetchBookingById', () => {
    it('deve buscar reserva por ID com sucesso', async () => {
      mockService.getBooking.mockResolvedValue(mockBooking);

      const { result } = renderHook(() => useBooking(mockService));

      await result.current.fetchBookingById('1');

      await waitFor(() => {
        expect(result.current.selectedBooking).toEqual(mockBooking);
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('createBooking', () => {
    it('deve criar reserva com sucesso', async () => {
      const createRequest: BookingCreateRequest = {
        hotelId: 'hotel-1',
        mainGuestId: 'guest-1',
        checkInDate: '2024-12-01',
        checkOutDate: '2024-12-05',
        adults: 2,
        roomIds: ['room-1'],
      };

      mockService.createBooking.mockResolvedValue(mockBooking);

      const { result } = renderHook(() => useBooking(mockService));

      await result.current.createBooking(createRequest);

      await waitFor(() => {
        expect(result.current.bookings).toContainEqual(mockBooking);
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('cancelBooking', () => {
    it('deve cancelar reserva e atualizar status local', async () => {
      const confirmedBooking = { ...mockBooking, status: 'CONFIRMED' };
      mockService.getBookings.mockResolvedValue([confirmedBooking]);
      mockService.cancelBooking.mockResolvedValue(undefined);

      const { result } = renderHook(() => useBooking(mockService));

      // Primeiro busca as reservas
      await result.current.fetchBookings();

      // Depois cancela
      await result.current.cancelBooking('1', 'Cancelado pelo cliente');

      await waitFor(() => {
        const cancelledBooking = result.current.bookings.find(b => b.id === '1');
        expect(cancelledBooking?.status).toBe('CANCELLED');
      });
    });
  });

  describe('confirmBooking', () => {
    it('deve confirmar reserva e atualizar status local', async () => {
      mockService.getBookings.mockResolvedValue([mockBooking]);
      mockService.confirmBooking.mockResolvedValue(undefined);

      const { result } = renderHook(() => useBooking(mockService));

      await result.current.fetchBookings();
      await result.current.confirmBooking('1');

      await waitFor(() => {
        const confirmedBooking = result.current.bookings.find(b => b.id === '1');
        expect(confirmedBooking?.status).toBe('CONFIRMED');
      });
    });
  });
});

