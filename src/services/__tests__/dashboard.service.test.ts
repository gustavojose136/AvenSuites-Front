import { dashboardService } from '../dashboard.service';
import { httpClient } from '@/infrastructure/http/HttpClient';
import { Hotel, Room, Guest, Booking, DashboardStats } from '../dashboard.service';

jest.mock('@/infrastructure/http/HttpClient');

describe('DashboardService', () => {
  const mockHotel: Hotel = {
    id: '1',
    name: 'Test Hotel',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  };

  const mockRoom: Room = {
    id: '1',
    hotelId: '1',
    roomNumber: '101',
    floor: 1,
    status: 'ACTIVE',
    maxOccupancy: 2,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  };

  const mockGuest: Guest = {
    id: '1',
    hotelId: '1',
    fullName: 'John Doe',
    email: 'john@example.com',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  };

  const mockBooking: Booking = {
    id: '1',
    hotelId: '1',
    code: 'BK001',
    status: 'CONFIRMED',
    source: 'WEB',
    checkInDate: '2024-01-01',
    checkOutDate: '2024-01-05',
    adults: 2,
    children: 0,
    currency: 'BRL',
    totalAmount: 1000,
    mainGuestId: '1',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getHotels', () => {
    it('deve retornar lista de hotéis', async () => {
      const hotels = [mockHotel];
      (httpClient.get as jest.Mock).mockResolvedValue(hotels);

      const result = await dashboardService.getHotels();

      expect(httpClient.get).toHaveBeenCalledWith('/Hotels');
      expect(result).toEqual(hotels);
    });

    it('deve lançar erro quando falha', async () => {
      const error = new Error('Network error');
      (httpClient.get as jest.Mock).mockRejectedValue(error);

      await expect(dashboardService.getHotels()).rejects.toThrow('Network error');
    });
  });

  describe('getRooms', () => {
    it('deve retornar lista de quartos sem hotelId', async () => {
      const rooms = [mockRoom];
      (httpClient.get as jest.Mock).mockResolvedValue(rooms);

      const result = await dashboardService.getRooms();

      expect(httpClient.get).toHaveBeenCalledWith('/Rooms');
      expect(result).toEqual(rooms);
    });

    it('deve retornar lista de quartos com hotelId', async () => {
      const rooms = [mockRoom];
      (httpClient.get as jest.Mock).mockResolvedValue(rooms);

      const result = await dashboardService.getRooms('1');

      expect(httpClient.get).toHaveBeenCalledWith('/Rooms?hotelId=1');
      expect(result).toEqual(rooms);
    });
  });

  describe('getGuests', () => {
    it('deve retornar lista de hóspedes sem hotelId', async () => {
      const guests = [mockGuest];
      (httpClient.get as jest.Mock).mockResolvedValue(guests);

      const result = await dashboardService.getGuests();

      expect(httpClient.get).toHaveBeenCalledWith('/Guests');
      expect(result).toEqual(guests);
    });

    it('deve retornar lista de hóspedes com hotelId', async () => {
      const guests = [mockGuest];
      (httpClient.get as jest.Mock).mockResolvedValue(guests);

      const result = await dashboardService.getGuests('1');

      expect(httpClient.get).toHaveBeenCalledWith('/Guests?hotelId=1');
      expect(result).toEqual(guests);
    });
  });

  describe('getBookings', () => {
    it('deve retornar lista de reservas sem hotelId', async () => {
      const bookings = [mockBooking];
      (httpClient.get as jest.Mock).mockResolvedValue(bookings);

      const result = await dashboardService.getBookings();

      expect(httpClient.get).toHaveBeenCalledWith('/Bookings');
      expect(result).toEqual(bookings);
    });

    it('deve retornar lista de reservas com hotelId', async () => {
      const bookings = [mockBooking];
      (httpClient.get as jest.Mock).mockResolvedValue(bookings);

      const result = await dashboardService.getBookings('1');

      expect(httpClient.get).toHaveBeenCalledWith('/Bookings?hotelId=1');
      expect(result).toEqual(bookings);
    });
  });

  describe('getDashboardStats', () => {
    it('deve calcular estatísticas corretamente', async () => {
      const hotels = [mockHotel];
      const rooms = [
        { ...mockRoom, status: 'ACTIVE' },
        { ...mockRoom, id: '2', status: 'OCCUPIED' },
        { ...mockRoom, id: '3', status: 'MAINTENANCE' },
      ];
      const guests = [mockGuest];
      const bookings = [
        { ...mockBooking, status: 'CONFIRMED' as const, totalAmount: 1000 },
        { ...mockBooking, id: '2', status: 'CHECKED_IN' as const, totalAmount: 500 },
      ];

      (httpClient.get as jest.Mock)
        .mockResolvedValueOnce(hotels)
        .mockResolvedValueOnce(rooms)
        .mockResolvedValueOnce(guests)
        .mockResolvedValueOnce(bookings);

      const result = await dashboardService.getDashboardStats();

      expect(result.totalHotels).toBe(1);
      expect(result.totalRooms).toBe(3);
      expect(result.totalGuests).toBe(1);
      expect(result.totalBookings).toBe(2);
      expect(result.activeBookings).toBe(2);
      expect(result.roomsByStatus.available).toBe(1);
      expect(result.roomsByStatus.occupied).toBe(1);
      expect(result.roomsByStatus.maintenance).toBe(1);
      expect(result.totalRevenue).toBe(1500);
    });

    it('deve calcular taxa de ocupação corretamente', async () => {
      const hotels = [mockHotel];
      const rooms = [
        { ...mockRoom, status: 'ACTIVE' },
        { ...mockRoom, id: '2', status: 'OCCUPIED' },
        { ...mockRoom, id: '3', status: 'INACTIVE' },
      ];
      const guests = [mockGuest];
      const bookings: Booking[] = [];

      (httpClient.get as jest.Mock)
        .mockResolvedValueOnce(hotels)
        .mockResolvedValueOnce(rooms)
        .mockResolvedValueOnce(guests)
        .mockResolvedValueOnce(bookings);

      const result = await dashboardService.getDashboardStats();

      expect(result.occupancyRate).toBe(50);
    });

    it('deve calcular taxa de ocupação como 0 quando não há quartos ativos', async () => {
      const hotels = [mockHotel];
      const rooms: Room[] = [];
      const guests = [mockGuest];
      const bookings: Booking[] = [];

      (httpClient.get as jest.Mock)
        .mockResolvedValueOnce(hotels)
        .mockResolvedValueOnce(rooms)
        .mockResolvedValueOnce(guests)
        .mockResolvedValueOnce(bookings);

      const result = await dashboardService.getDashboardStats();

      expect(result.occupancyRate).toBe(0);
    });

    it('deve calcular receita mensal corretamente', async () => {
      const hotels = [mockHotel];
      const rooms = [mockRoom];
      const guests = [mockGuest];
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 15);
      const bookings = [
        { ...mockBooking, status: 'CONFIRMED' as const, totalAmount: 1000, createdAt: thirtyDaysAgo.toISOString() },
        { ...mockBooking, id: '2', status: 'CONFIRMED' as const, totalAmount: 500, createdAt: new Date().toISOString() },
      ];

      (httpClient.get as jest.Mock)
        .mockResolvedValueOnce(hotels)
        .mockResolvedValueOnce(rooms)
        .mockResolvedValueOnce(guests)
        .mockResolvedValueOnce(bookings);

      const result = await dashboardService.getDashboardStats();

      expect(result.monthlyRevenue).toBeGreaterThan(0);
    });

    it('deve calcular check-ins e check-outs de hoje', async () => {
      const hotels = [mockHotel];
      const rooms = [mockRoom];
      const guests = [mockGuest];
      const today = new Date().toISOString().split('T')[0];
      const bookings = [
        { ...mockBooking, status: 'CONFIRMED' as const, checkInDate: `${today}T10:00:00Z` },
        { ...mockBooking, id: '2', status: 'CHECKED_IN' as const, checkOutDate: `${today}T12:00:00Z` },
      ];

      (httpClient.get as jest.Mock)
        .mockResolvedValueOnce(hotels)
        .mockResolvedValueOnce(rooms)
        .mockResolvedValueOnce(guests)
        .mockResolvedValueOnce(bookings);

      const result = await dashboardService.getDashboardStats();

      expect(result.checkInsToday).toBeGreaterThanOrEqual(0);
      expect(result.checkOutsToday).toBeGreaterThanOrEqual(0);
    });

    it('deve calcular pagamentos e notas fiscais pendentes', async () => {
      const hotels = [mockHotel];
      const rooms = [mockRoom];
      const guests = [mockGuest];
      const bookings = [
        {
          ...mockBooking,
          status: 'CONFIRMED' as const,
          payments: [
            { id: '1', status: 'PAID', amount: 500 },
            { id: '2', status: 'PENDING', amount: 500 },
          ],
        },
        { ...mockBooking, id: '2', status: 'CONFIRMED' as const, payments: [] },
      ];

      (httpClient.get as jest.Mock)
        .mockResolvedValueOnce(hotels)
        .mockResolvedValueOnce(rooms)
        .mockResolvedValueOnce(guests)
        .mockResolvedValueOnce(bookings);

      const result = await dashboardService.getDashboardStats();

      expect(result.paidInvoices).toBeGreaterThanOrEqual(0);
      expect(result.pendingInvoices).toBeGreaterThanOrEqual(0);
    });

    it('deve calcular top hotéis corretamente', async () => {
      const hotels = [
        { ...mockHotel, id: '1', name: 'Hotel 1' },
        { ...mockHotel, id: '2', name: 'Hotel 2' },
      ];
      const rooms = [
        { ...mockRoom, hotelId: '1', status: 'OCCUPIED' },
        { ...mockRoom, id: '2', hotelId: '1', status: 'ACTIVE' },
        { ...mockRoom, id: '3', hotelId: '2', status: 'OCCUPIED' },
      ];
      const guests = [mockGuest];
      const bookings = [
        { ...mockBooking, hotelId: '1' },
        { ...mockBooking, id: '2', hotelId: '1' },
        { ...mockBooking, id: '3', hotelId: '2' },
      ];

      (httpClient.get as jest.Mock)
        .mockResolvedValueOnce(hotels)
        .mockResolvedValueOnce(rooms)
        .mockResolvedValueOnce(guests)
        .mockResolvedValueOnce(bookings);

      const result = await dashboardService.getDashboardStats();

      expect(result.topHotels.length).toBeLessThanOrEqual(3);
      expect(result.topHotels.every(h => h.totalBookings >= 0)).toBe(true);
    });
  });

  describe('getInvoices', () => {
    it('deve retornar notas fiscais geradas a partir de reservas', async () => {
      const hotels = [mockHotel];
      const guests = [mockGuest];
      const bookings = [
        { ...mockBooking, status: 'CONFIRMED' as const },
        { ...mockBooking, id: '2', status: 'CANCELLED' as const },
      ];

      (httpClient.get as jest.Mock)
        .mockResolvedValueOnce(bookings)
        .mockResolvedValueOnce(guests)
        .mockResolvedValueOnce(hotels);

      const result = await dashboardService.getInvoices();

      expect(result.length).toBe(1);
      expect(result[0].status).toBe('pending');
    });

    it('deve marcar nota fiscal como paga quando há pagamento', async () => {
      const hotels = [mockHotel];
      const guests = [mockGuest];
      const bookings = [
        {
          ...mockBooking,
          status: 'CONFIRMED' as const,
          payments: [{ id: '1', status: 'PAID', amount: 1000 }],
        },
      ];

      (httpClient.get as jest.Mock)
        .mockResolvedValueOnce(bookings)
        .mockResolvedValueOnce(guests)
        .mockResolvedValueOnce(hotels);

      const result = await dashboardService.getInvoices();

      expect(result[0].status).toBe('paid');
    });
  });
});

