import { BookingRepository } from '../BookingRepository';
import { HttpClient } from '@/infrastructure/http/HttpClient';
import { Booking, BookingCreateRequest, BookingUpdateRequest } from '@/application/dto/Booking.dto';

jest.mock('@/infrastructure/http/HttpClient');

describe('BookingRepository', () => {
  let bookingRepository: BookingRepository;
  let mockHttpClient: jest.Mocked<HttpClient>;

  const mockBooking: Booking = {
    id: '1',
    hotelId: 'hotel-1',
    code: 'BK001',
    status: 'CONFIRMED',
    source: 'WEB',
    checkInDate: '2024-01-01',
    checkOutDate: '2024-01-05',
    adults: 2,
    children: 0,
    currency: 'BRL',
    totalAmount: 1000,
    mainGuestId: 'guest-1',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  };

  beforeEach(() => {
    mockHttpClient = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<HttpClient>;

    bookingRepository = new BookingRepository(mockHttpClient);
  });

  describe('getAll', () => {
    it('deve retornar lista de reservas', async () => {
      const bookings = [mockBooking];
      mockHttpClient.get.mockResolvedValue(bookings);

      const result = await bookingRepository.getAll();

      expect(mockHttpClient.get).toHaveBeenCalledWith('/Bookings');
      expect(result).toEqual(bookings);
    });
  });

  describe('getById', () => {
    it('deve retornar reserva quando encontrada', async () => {
      mockHttpClient.get.mockResolvedValue(mockBooking);

      const result = await bookingRepository.getById('1');

      expect(mockHttpClient.get).toHaveBeenCalledWith('/Bookings/1');
      expect(result).toEqual(mockBooking);
    });

    it('deve retornar null quando reserva não encontrada', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('Not found'));

      const result = await bookingRepository.getById('999');

      expect(result).toBeNull();
    });
  });

  describe('getByCode', () => {
    it('deve retornar reserva por código', async () => {
      mockHttpClient.get.mockResolvedValue(mockBooking);

      const result = await bookingRepository.getByCode('hotel-1', 'BK001');

      expect(mockHttpClient.get).toHaveBeenCalledWith('/Bookings/code/BK001?hotelId=hotel-1');
      expect(result).toEqual(mockBooking);
    });

    it('deve retornar null quando reserva não encontrada por código', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('Not found'));

      const result = await bookingRepository.getByCode('hotel-1', 'INVALID');

      expect(result).toBeNull();
    });
  });

  describe('getByHotel', () => {
    it('deve retornar reservas do hotel', async () => {
      const bookings = [mockBooking];
      mockHttpClient.get.mockResolvedValue(bookings);

      const result = await bookingRepository.getByHotel('hotel-1');

      expect(mockHttpClient.get).toHaveBeenCalledWith('/Bookings/hotel/hotel-1');
      expect(result).toEqual(bookings);
    });

    it('deve retornar reservas do hotel com filtro de data', async () => {
      const bookings = [mockBooking];
      mockHttpClient.get.mockResolvedValue(bookings);

      const result = await bookingRepository.getByHotel('hotel-1', '2024-01-01', '2024-01-31');

      expect(mockHttpClient.get).toHaveBeenCalledWith('/Bookings/hotel/hotel-1?startDate=2024-01-01&endDate=2024-01-31');
      expect(result).toEqual(bookings);
    });
  });

  describe('getByGuest', () => {
    it('deve retornar reservas do hóspede', async () => {
      const bookings = [mockBooking];
      mockHttpClient.get.mockResolvedValue(bookings);

      const result = await bookingRepository.getByGuest('guest-1');

      expect(mockHttpClient.get).toHaveBeenCalledWith('/Bookings/guest/guest-1');
      expect(result).toEqual(bookings);
    });
  });

  describe('create', () => {
    it('deve criar reserva com sucesso', async () => {
      const createRequest: BookingCreateRequest = {
        hotelId: 'hotel-1',
        checkInDate: '2024-01-01',
        checkOutDate: '2024-01-05',
        adults: 2,
        children: 0,
      };

      mockHttpClient.post.mockResolvedValue(mockBooking);

      const result = await bookingRepository.create(createRequest);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/Bookings', createRequest);
      expect(result).toEqual(mockBooking);
    });
  });

  describe('update', () => {
    it('deve atualizar reserva com sucesso', async () => {
      const updateRequest: BookingUpdateRequest = {
        notes: 'Updated notes',
      };

      const updatedBooking = { ...mockBooking, notes: 'Updated notes' };
      mockHttpClient.put.mockResolvedValue(updatedBooking);

      const result = await bookingRepository.update('1', updateRequest);

      expect(mockHttpClient.put).toHaveBeenCalledWith('/Bookings/1', updateRequest);
      expect(result).toEqual(updatedBooking);
    });
  });

  describe('cancel', () => {
    it('deve cancelar reserva com sucesso', async () => {
      mockHttpClient.post.mockResolvedValue({});

      const result = await bookingRepository.cancel('1');

      expect(mockHttpClient.post).toHaveBeenCalledWith('/Bookings/1/cancel', {});
      expect(result).toBe(true);
    });

    it('deve cancelar reserva com motivo', async () => {
      mockHttpClient.post.mockResolvedValue({});

      const result = await bookingRepository.cancel('1', 'Guest request');

      expect(mockHttpClient.post).toHaveBeenCalledWith('/Bookings/1/cancel?reason=Guest%20request', {});
      expect(result).toBe(true);
    });

    it('deve retornar false quando falha ao cancelar', async () => {
      mockHttpClient.post.mockRejectedValue(new Error('Cancel failed'));

      const result = await bookingRepository.cancel('1');

      expect(result).toBe(false);
    });
  });

  describe('confirm', () => {
    it('deve confirmar reserva com sucesso', async () => {
      mockHttpClient.post.mockResolvedValue({});

      const result = await bookingRepository.confirm('1');

      expect(mockHttpClient.post).toHaveBeenCalledWith('/Bookings/1/confirm', {});
      expect(result).toBe(true);
    });

    it('deve retornar false quando falha ao confirmar', async () => {
      mockHttpClient.post.mockRejectedValue(new Error('Confirm failed'));

      const result = await bookingRepository.confirm('1');

      expect(result).toBe(false);
    });
  });

  describe('checkIn', () => {
    it('deve fazer check-in com sucesso', async () => {
      const checkedInBooking = { ...mockBooking, status: 'CHECKED_IN' as const };
      mockHttpClient.post.mockResolvedValue(checkedInBooking);

      const result = await bookingRepository.checkIn('1');

      expect(mockHttpClient.post).toHaveBeenCalledWith('/Bookings/1/check-in', {});
      expect(result).toEqual(checkedInBooking);
    });
  });

  describe('checkOut', () => {
    it('deve fazer check-out com sucesso', async () => {
      const checkedOutBooking = { ...mockBooking, status: 'CHECKED_OUT' as const };
      mockHttpClient.post.mockResolvedValue(checkedOutBooking);

      const result = await bookingRepository.checkOut('1');

      expect(mockHttpClient.post).toHaveBeenCalledWith('/Bookings/1/check-out', {});
      expect(result).toEqual(checkedOutBooking);
    });
  });
});

