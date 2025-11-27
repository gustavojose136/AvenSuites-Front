/**
 * Testes: BookingService
 * Testa a lógica de negócio para reservas
 * SOLID - Dependency Inversion: Testa através de interface mockada
 */

import { BookingService, IBookingService } from '../IBookingService';
import { IBookingRepository } from '../../repositories/IBookingRepository';
import { Booking, BookingCreateRequest, BookingUpdateRequest } from '@/application/dto/Booking.dto';

describe('BookingService', () => {
  let bookingService: IBookingService;
  let mockRepository: jest.Mocked<IBookingRepository>;

  const mockBooking: Booking = {
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

  beforeEach(() => {
    mockRepository = {
      getAll: jest.fn(),
      getById: jest.fn(),
      getByCode: jest.fn(),
      getByHotel: jest.fn(),
      getByGuest: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      cancel: jest.fn(),
      confirm: jest.fn(),
      checkIn: jest.fn(),
      checkOut: jest.fn(),
    } as unknown as jest.Mocked<IBookingRepository>;

    bookingService = new BookingService(mockRepository);
  });

  describe('getBookings', () => {
    it('deve retornar lista de reservas', async () => {
      const bookings = [mockBooking];
      mockRepository.getAll.mockResolvedValue(bookings);

      const result = await bookingService.getBookings();

      expect(mockRepository.getAll).toHaveBeenCalled();
      expect(result).toEqual(bookings);
    });
  });

  describe('getBooking', () => {
    it('deve retornar reserva quando encontrada', async () => {
      mockRepository.getById.mockResolvedValue(mockBooking);

      const result = await bookingService.getBooking('1');

      expect(mockRepository.getById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockBooking);
    });

    it('deve lançar erro quando reserva não encontrada', async () => {
      mockRepository.getById.mockResolvedValue(null as any);

      await expect(bookingService.getBooking('999')).rejects.toThrow('Reserva não encontrada');
    });
  });

  describe('getBookingByCode', () => {
    it('deve retornar reserva quando encontrada por código', async () => {
      mockRepository.getByCode.mockResolvedValue(mockBooking);

      const result = await bookingService.getBookingByCode('hotel-1', 'BK001');

      expect(mockRepository.getByCode).toHaveBeenCalledWith('hotel-1', 'BK001');
      expect(result).toEqual(mockBooking);
    });

    it('deve lançar erro quando reserva não encontrada por código', async () => {
      mockRepository.getByCode.mockResolvedValue(null as any);

      await expect(bookingService.getBookingByCode('hotel-1', 'INVALID')).rejects.toThrow('Reserva não encontrada');
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

      mockRepository.create.mockResolvedValue(mockBooking);

      const result = await bookingService.createBooking(createRequest);

      expect(mockRepository.create).toHaveBeenCalledWith(createRequest);
      expect(result).toEqual(mockBooking);
    });
  });

  describe('cancelBooking', () => {
    it('deve cancelar reserva com sucesso', async () => {
      mockRepository.cancel.mockResolvedValue(true);

      await bookingService.cancelBooking('1', 'Cancelado pelo cliente');

      expect(mockRepository.cancel).toHaveBeenCalledWith('1', 'Cancelado pelo cliente');
    });

    it('deve lançar erro quando falha ao cancelar', async () => {
      mockRepository.cancel.mockResolvedValue(false);

      await expect(bookingService.cancelBooking('1')).rejects.toThrow('Falha ao cancelar reserva');
    });
  });

  describe('confirmBooking', () => {
    it('deve confirmar reserva com sucesso', async () => {
      mockRepository.confirm.mockResolvedValue(true);

      await bookingService.confirmBooking('1');

      expect(mockRepository.confirm).toHaveBeenCalledWith('1');
    });

    it('deve lançar erro quando falha ao confirmar', async () => {
      mockRepository.confirm.mockResolvedValue(false);

      await expect(bookingService.confirmBooking('1')).rejects.toThrow('Falha ao confirmar reserva');
    });
  });

  describe('checkIn', () => {
    it('deve realizar check-in com sucesso', async () => {
      const checkedInBooking = { ...mockBooking, status: 'CHECKED_IN' };
      mockRepository.checkIn.mockResolvedValue(checkedInBooking);

      const result = await bookingService.checkIn('1');

      expect(mockRepository.checkIn).toHaveBeenCalledWith('1');
      expect(result).toEqual(checkedInBooking);
    });
  });

  describe('checkOut', () => {
    it('deve realizar check-out com sucesso', async () => {
      const checkedOutBooking = { ...mockBooking, status: 'CHECKED_OUT' };
      mockRepository.checkOut.mockResolvedValue(checkedOutBooking);

      const result = await bookingService.checkOut('1');

      expect(mockRepository.checkOut).toHaveBeenCalledWith('1');
      expect(result).toEqual(checkedOutBooking);
    });
  });
});

