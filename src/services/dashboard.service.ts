/**
 * Dashboard Service - Atualizado para API AvenSuites v2.0
 * Serviço para buscar estatísticas e dados do dashboard
 */

import { httpClient } from '@/infrastructure/http/HttpClient';

// ==================== INTERFACES DA API ====================

export interface Hotel {
  id: string;
  name: string;
  legalName?: string;
  cnpj?: string;
  stateRegistration?: string;
  municipalRegistration?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  id: string;
  hotelId: string;
  roomNumber: string;
  floor: number;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'OCCUPIED' | 'CLEANING';
  maxOccupancy: number;
  createdAt: string;
  updatedAt: string;
}

export interface Guest {
  id: string;
  hotelId: string;
  fullName: string;
  email: string;
  phone?: string;
  documentNumber?: string;
  birthDate?: string;
  address?: string;
  city?: string;
  state?: string;
  neighborhood?: string;
  postalCode?: string;
  country?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingRoom {
  id: string;
  roomId: string;
  roomNumber: string;
  roomTypeName?: string;
  priceTotal: number;
  notes?: string;
}

export interface Payment {
  id: string;
  method: string;
  status: string;
  amount: number;
  currency: string;
  paidAt?: string;
}

export interface MainGuest {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
}

export interface Booking {
  id: string;
  hotelId: string;
  code: string;
  status: 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED' | 'NO_SHOW';
  source: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  currency: string;
  totalAmount: number;
  mainGuestId: string;
  channelRef?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  mainGuest?: MainGuest;
  bookingRooms?: BookingRoom[];
  payments?: Payment[];
}

export interface Invoice {
  id: string;
  number: string;
  guestId: string;
  guestName: string;
  hotelId: string;
  hotelName: string;
  bookingId: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  issueDate: string;
  dueDate: string;
  paymentDate?: string;
  description?: string;
}

export interface DashboardStats {
  totalHotels: number;
  totalRooms: number;
  totalGuests: number;
  totalBookings: number;
  activeBookings: number;
  availableRooms: number;
  occupancyRate: number;
  totalRevenue: number;
  monthlyRevenue: number;
  pendingInvoices: number;
  paidInvoices: number;
  overdueInvoices: number;
  checkInsToday: number;
  checkOutsToday: number;
  completedCheckOuts: number;
  roomsByStatus: {
    available: number;
    occupied: number;
    maintenance: number;
    cleaning: number;
    inactive: number;
  };
  topHotels: Array<{
    id: string;
    name: string;
    occupancyRate: number;
    totalBookings: number;
  }>;
}

// ==================== SERVICE CLASS ====================

class DashboardService {
  /**
   * Busca todos os hotéis
   */
  async getHotels(): Promise<Hotel[]> {
    try {
      const hotels = await httpClient.get<Hotel[]>('/Hotels');
      return hotels;
    } catch (error: any) {
      console.error('❌ Erro ao buscar hotéis:', error);
      throw error;
    }
  }

  /**
   * Busca todos os quartos
   */
  async getRooms(hotelId?: string): Promise<Room[]> {
    try {
      const endpoint = hotelId ? `/Rooms?hotelId=${hotelId}` : '/Rooms';
      const rooms = await httpClient.get<Room[]>(endpoint);
      return rooms;
    } catch (error: any) {
      console.error('❌ Erro ao buscar quartos:', error);
      throw error;
    }
  }

  /**
   * Busca todos os hóspedes
   */
  async getGuests(hotelId?: string): Promise<Guest[]> {
    try {
      const endpoint = hotelId ? `/Guests?hotelId=${hotelId}` : '/Guests';
      const guests = await httpClient.get<Guest[]>(endpoint);
      return guests;
    } catch (error: any) {
      console.error('❌ Erro ao buscar hóspedes:', error);
      throw error;
    }
  }

  /**
   * Busca todas as reservas
   */
  async getBookings(hotelId?: string): Promise<Booking[]> {
    try {
      const endpoint = hotelId ? `/Bookings?hotelId=${hotelId}` : '/Bookings';
      const bookings = await httpClient.get<Booking[]>(endpoint);
      return bookings;
    } catch (error: any) {
      console.error('❌ Erro ao buscar reservas:', error);
      throw error;
    }
  }

  /**
   * Busca estatísticas gerais do dashboard
   */
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      // Buscar todos os dados em paralelo
      const [hotels, rooms, guests, bookings] = await Promise.all([
        this.getHotels(),
        this.getRooms(),
        this.getGuests(),
        this.getBookings(),
      ]);

      // ============ CÁLCULOS DE ESTATÍSTICAS ============

      // Status dos quartos
      const roomsByStatus = {
        available: rooms.filter(r => r.status === 'ACTIVE').length,
        occupied: rooms.filter(r => r.status === 'OCCUPIED').length,
        maintenance: rooms.filter(r => r.status === 'MAINTENANCE').length,
        cleaning: rooms.filter(r => r.status === 'CLEANING').length,
        inactive: rooms.filter(r => r.status === 'INACTIVE').length,
      };

      // Taxa de ocupação
      const totalRooms = rooms.length;
      const occupiedRooms = roomsByStatus.occupied;
      const availableRooms = roomsByStatus.available;
      // Taxa de ocupação considera apenas quartos ativos (exclui inativos)
      const activeRooms = totalRooms - roomsByStatus.inactive;
      const occupancyRate = activeRooms > 0 
        ? (occupiedRooms / activeRooms) * 100 
        : 0;

      // Reservas ativas (confirmadas e em andamento)
      const activeBookings = bookings.filter(b => 
        b.status === 'CONFIRMED' || b.status === 'CHECKED_IN'
      ).length;

      // Check-ins e check-outs hoje
      const today = new Date().toISOString().split('T')[0];
      const checkInsToday = bookings.filter(b => 
        b.checkInDate.startsWith(today) && b.status === 'CONFIRMED'
      ).length;
      const checkOutsToday = bookings.filter(b => 
        b.checkOutDate.startsWith(today) && b.status === 'CHECKED_IN'
      ).length;
      const completedCheckOuts = bookings.filter(b => 
        b.status === 'CHECKED_OUT'
      ).length;

      // Receita total (baseado no totalAmount das reservas confirmadas e com check-in)
      // Mesmo cálculo usado na tela de bookings - "Valor Total Confirmado"
      const confirmedBookings = bookings.filter(b => 
        b.status === 'CONFIRMED' || b.status === 'CHECKED_IN'
      );
      
      const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
      
      // Receita mensal (reservas confirmadas criadas nos últimos 30 dias)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const monthlyRevenue = confirmedBookings
        .filter(b => {
          const bookingDate = new Date(b.createdAt);
          return bookingDate >= thirtyDaysAgo;
        })
        .reduce((sum, b) => sum + (b.totalAmount || 0), 0);
      
      // Contagem de invoices (para compatibilidade)
      let paidInvoicesCount = 0;
      let pendingInvoicesCount = 0;
      
      bookings.forEach(booking => {
        if (booking.payments && booking.payments.length > 0) {
          booking.payments.forEach(payment => {
            if (payment.status === 'PAID') {
              paidInvoicesCount++;
            } else {
              pendingInvoicesCount++;
            }
          });
        } else {
          if (booking.status !== 'CANCELLED') {
            pendingInvoicesCount++;
          }
        }
      });

      // Top hotéis (hotéis com mais reservas)
      const hotelBookingCount: Record<string, number> = {};
      bookings.forEach(booking => {
        hotelBookingCount[booking.hotelId] = (hotelBookingCount[booking.hotelId] || 0) + 1;
      });

      const topHotels = hotels
        .map(hotel => {
          const hotelRooms = rooms.filter(r => r.hotelId === hotel.id);
          const hotelOccupiedRooms = hotelRooms.filter(r => r.status === 'OCCUPIED').length;
          const hotelOccupancyRate = hotelRooms.length > 0
            ? (hotelOccupiedRooms / hotelRooms.length) * 100
            : 0;

          return {
            id: hotel.id,
            name: hotel.name,
            occupancyRate: Math.round(hotelOccupancyRate * 10) / 10,
            totalBookings: hotelBookingCount[hotel.id] || 0,
          };
        })
        .sort((a, b) => b.totalBookings - a.totalBookings)
        .slice(0, 3);

      return {
        totalHotels: hotels.length,
        totalRooms,
        totalGuests: guests.length,
        totalBookings: bookings.length,
        activeBookings,
        availableRooms,
        occupancyRate: Math.round(occupancyRate * 10) / 10,
        totalRevenue,
        monthlyRevenue,
        pendingInvoices: pendingInvoicesCount,
        paidInvoices: paidInvoicesCount,
        overdueInvoices: 0, // Não temos informação de vencimento nas reservas
        checkInsToday,
        checkOutsToday,
        completedCheckOuts,
        roomsByStatus,
        topHotels,
      };
    } catch (error) {
      console.error('❌ Erro ao buscar estatísticas do dashboard:', error);
      throw error;
    }
  }

  /**
   * Busca todas as notas fiscais
   * Nota: Por enquanto, vamos simular com base nas reservas
   */
  async getInvoices(): Promise<Invoice[]> {
    try {
      // Buscar reservas e hóspedes para simular invoices
      const [bookings, guests, hotels] = await Promise.all([
        this.getBookings(),
        this.getGuests(),
        this.getHotels(),
      ]);

      // Mapear reservas para invoices
      const invoices: Invoice[] = bookings
        .filter(b => b.status !== 'CANCELLED')
        .map(booking => {
          const guest = guests.find(g => g.id === booking.mainGuestId);
          const hotel = hotels.find(h => h.id === booking.hotelId);
          
          // Determinar status
          let status: 'paid' | 'pending' | 'overdue' | 'cancelled' = 'pending';
          if (booking.payments && booking.payments.length > 0) {
            const hasPaidPayment = booking.payments.some(p => p.status === 'PAID');
            status = hasPaidPayment ? 'paid' : 'pending';
          }

          return {
            id: `INV-${booking.id.substring(0, 8)}`,
            number: booking.code || `BKG-${booking.id.substring(0, 8)}`,
            guestId: booking.mainGuestId,
            guestName: guest?.fullName || booking.mainGuest?.fullName || 'N/A',
            hotelId: booking.hotelId,
            hotelName: hotel?.name || 'N/A',
            bookingId: booking.id,
            amount: booking.totalAmount,
            status,
            issueDate: booking.createdAt,
            dueDate: booking.checkInDate,
            paymentDate: booking.payments?.[0]?.paidAt,
            description: `Reserva ${booking.code} - ${booking.adults + booking.children} pessoas`,
          };
        });

      return invoices;
    } catch (error) {
      console.error('❌ Erro ao buscar notas fiscais:', error);
      throw error;
    }
  }

  /**
   * Busca uma nota fiscal específica
   */
  async getInvoiceById(id: string): Promise<Invoice> {
    try {
      const invoices = await this.getInvoices();
      const invoice = invoices.find(inv => inv.id === id || inv.bookingId === id);
      
      if (!invoice) {
        throw new Error('Nota fiscal não encontrada');
      }

      return invoice;
    } catch (error) {
      console.error('❌ Erro ao buscar nota fiscal:', error);
      throw error;
    }
  }

  /**
   * Cria uma nova nota fiscal para uma reserva
   */
  async createInvoice(bookingId: string): Promise<Invoice> {
    try {
      // Buscar dados da reserva
      const bookings = await this.getBookings();
      const booking = bookings.find(b => b.id === bookingId);
      
      if (!booking) {
        throw new Error('Reserva não encontrada');
      }

      // Verificar se já existe invoice para esta reserva
      const existingInvoices = await this.getInvoices();
      const existingInvoice = existingInvoices.find(inv => inv.bookingId === bookingId);
      if (existingInvoice) {
        throw new Error('Já existe uma nota fiscal para esta reserva');
      }

      // Calcular taxAmount (10% de imposto - exemplo)
      const taxAmount = booking.totalAmount * 0.1;
      const totalAmount = booking.totalAmount + taxAmount;

      // Criar invoice via API
      const invoiceData = {
        bookingId: booking.id,
        guestId: booking.mainGuestId,
        hotelId: booking.hotelId,
        amount: booking.totalAmount,
        taxAmount: taxAmount,
        totalAmount: totalAmount,
        dueDate: booking.checkInDate,
        description: `Hospedagem - Reserva ${booking.code}`,
        items: booking.bookingRooms?.map(room => ({
          description: `Quarto ${room.roomNumber}${room.roomTypeName ? ` - ${room.roomTypeName}` : ''}`,
          quantity: 1,
          unitPrice: room.priceTotal,
          totalPrice: room.priceTotal,
        })) || [],
      };

      const invoice = await httpClient.post<Invoice>('/Invoice', invoiceData);
      
      // Se a resposta não tiver todos os campos, completar com dados da reserva
      const completeInvoice: Invoice = {
        id: invoice.id || `INV-${booking.id.substring(0, 8)}`,
        number: invoice.number || `NF-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`,
        guestId: invoice.guestId || booking.mainGuestId,
        guestName: invoice.guestName || booking.mainGuest?.fullName || 'N/A',
        hotelId: invoice.hotelId || booking.hotelId,
        hotelName: invoice.hotelName || 'N/A',
        bookingId: invoice.bookingId || booking.id,
        amount: invoice.amount || booking.totalAmount,
        status: invoice.status || 'pending',
        issueDate: invoice.issueDate || new Date().toISOString(),
        dueDate: invoice.dueDate || booking.checkInDate,
        paymentDate: invoice.paymentDate,
        description: invoice.description || `Hospedagem - Reserva ${booking.code}`,
      };
      
      return completeInvoice;
    } catch (error: any) {
      let errorMessage = 'Erro ao criar nota fiscal';
      
      if (error.response?.data) {
        if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.errors) {
          errorMessage = Object.values(error.response.data.errors).flat().join(', ');
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Realiza check-in de uma reserva
   */
  async checkIn(bookingId: string): Promise<Booking> {
    try {
      const booking = await httpClient.post<Booking>(`/Booking/${bookingId}/check-in`, {});
      return booking;
    } catch (error) {
      console.error('❌ Erro ao realizar check-in:', error);
      throw error;
    }
  }

  /**
   * Realiza check-out de uma reserva
   */
  async checkOut(bookingId: string): Promise<Booking> {
    try {
      const booking = await httpClient.post<Booking>(`/Booking/${bookingId}/check-out`, {});
      return booking;
    } catch (error) {
      console.error('❌ Erro ao realizar check-out:', error);
      throw error;
    }
  }
}

// Singleton
export const dashboardService = new DashboardService();
