import { renderHook, waitFor } from '@testing-library/react';
import { useDashboard, useInvoices } from '../useDashboard';
import { dashboardService } from '@/services/dashboard.service';
import toast from 'react-hot-toast';

jest.mock('@/services/dashboard.service');
jest.mock('react-hot-toast');

const mockDashboardService = dashboardService as jest.Mocked<typeof dashboardService>;

describe('useDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchStats', () => {
    it('deve carregar estatísticas com sucesso', async () => {
      const mockStats = {
        totalHotels: 1,
        totalRooms: 10,
        totalGuests: 5,
        totalBookings: 3,
        activeBookings: 2,
        availableRooms: 8,
        occupancyRate: 20,
        totalRevenue: 1000,
        monthlyRevenue: 500,
        pendingInvoices: 1,
        paidInvoices: 2,
        overdueInvoices: 0,
        checkInsToday: 1,
        checkOutsToday: 1,
        completedCheckOuts: 1,
        roomsByStatus: {
          available: 8,
          occupied: 2,
          maintenance: 0,
          cleaning: 0,
          inactive: 0,
        },
        topHotels: [],
      };

      mockDashboardService.getDashboardStats.mockResolvedValue(mockStats);

      const { result } = renderHook(() => useDashboard());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.stats).toEqual(mockStats);
      expect(result.current.error).toBeNull();
    });

    it('deve tratar erro ao carregar estatísticas', async () => {
      const error = new Error('Network error');
      mockDashboardService.getDashboardStats.mockRejectedValue(error);

      const { result } = renderHook(() => useDashboard());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.stats).toBeNull();
      expect(result.current.error).toBeTruthy();
      expect(toast.error).toHaveBeenCalled();
    });
  });

  describe('fetchWeekBookings', () => {
    it('deve filtrar reservas da semana corretamente', async () => {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const mockBookings = [
        {
          id: '1',
          checkInDate: startOfWeek.toISOString(),
          checkOutDate: new Date(startOfWeek.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'CONFIRMED',
        },
        {
          id: '2',
          checkInDate: new Date(startOfWeek.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          checkOutDate: new Date(startOfWeek.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'CANCELLED',
        },
      ];

      mockDashboardService.getBookings.mockResolvedValue(mockBookings as any);
      mockDashboardService.getDashboardStats.mockResolvedValue({
        totalHotels: 1,
        totalRooms: 10,
        totalGuests: 5,
        totalBookings: 2,
        activeBookings: 1,
        availableRooms: 8,
        occupancyRate: 20,
        totalRevenue: 1000,
        monthlyRevenue: 500,
        pendingInvoices: 1,
        paidInvoices: 2,
        overdueInvoices: 0,
        checkInsToday: 1,
        checkOutsToday: 1,
        completedCheckOuts: 1,
        roomsByStatus: {
          available: 8,
          occupied: 2,
          maintenance: 0,
          cleaning: 0,
          inactive: 0,
        },
        topHotels: [],
      });

      const { result } = renderHook(() => useDashboard());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      result.current.refetchWeekBookings();

      await waitFor(() => {
        expect(result.current.weekBookings.length).toBeGreaterThan(0);
      });

      expect(result.current.weekBookings.every(b => b.status !== 'CANCELLED')).toBe(true);
    });
  });
});

describe('useInvoices', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchInvoices', () => {
    it('deve carregar notas fiscais com sucesso', async () => {
      const mockInvoices = [
        {
          id: '1',
          number: 'INV001',
          guestId: 'guest-1',
          hotelId: 'hotel-1',
          bookingId: 'booking-1',
          amount: 1000,
          status: 'pending',
          issueDate: '2024-01-01',
          dueDate: '2024-01-31',
        },
      ];

      mockDashboardService.getInvoices.mockResolvedValue(mockInvoices as any);

      const { result } = renderHook(() => useInvoices());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.invoices).toEqual(mockInvoices);
      expect(result.current.error).toBeNull();
    });

    it('deve tratar erro ao carregar notas fiscais', async () => {
      const error = new Error('Network error');
      mockDashboardService.getInvoices.mockRejectedValue(error);

      const { result } = renderHook(() => useInvoices());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBeTruthy();
      expect(toast.error).toHaveBeenCalled();
    });
  });

  describe('createInvoice', () => {
    it('deve criar nota fiscal com sucesso', async () => {
      const mockInvoice = {
        id: '1',
        number: 'INV001',
        guestId: 'guest-1',
        hotelId: 'hotel-1',
        bookingId: 'booking-1',
        amount: 1000,
        status: 'pending',
        issueDate: '2024-01-01',
        dueDate: '2024-01-31',
      };

      mockDashboardService.createInvoice.mockResolvedValue(mockInvoice as any);
      mockDashboardService.getInvoices.mockResolvedValue([mockInvoice] as any);

      const { result } = renderHook(() => useInvoices());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.createInvoice('booking-1');

      expect(mockDashboardService.createInvoice).toHaveBeenCalledWith('booking-1');
      expect(toast.success).toHaveBeenCalled();
    });

    it('deve tratar erro ao criar nota fiscal', async () => {
      const error = { message: 'Error creating invoice' };
      mockDashboardService.createInvoice.mockRejectedValue(error);
      mockDashboardService.getInvoices.mockResolvedValue([]);

      const { result } = renderHook(() => useInvoices());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await expect(result.current.createInvoice('booking-1')).rejects.toEqual(error);
      expect(toast.error).toHaveBeenCalled();
    });
  });
});

