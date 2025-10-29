/**
 * Service Interface: IBookingService
 * Define a lógica de negócio para reservas
 */

import { IBookingRepository } from '../repositories/IBookingRepository';
import { Booking, BookingCreateRequest, BookingUpdateRequest } from '@/application/dto/Booking.dto';

export interface IBookingService {
  getBookings(): Promise<Booking[]>;
  getBooking(id: string): Promise<Booking>;
  getBookingByCode(hotelId: string, code: string): Promise<Booking>;
  getBookingsByHotel(hotelId: string, startDate?: string, endDate?: string): Promise<Booking[]>;
  getBookingsByGuest(guestId: string): Promise<Booking[]>;
  createBooking(data: BookingCreateRequest): Promise<Booking>;
  updateBooking(id: string, data: BookingUpdateRequest): Promise<Booking>;
  cancelBooking(id: string, reason?: string): Promise<void>;
  confirmBooking(id: string): Promise<void>;
}

export class BookingService implements IBookingService {
  constructor(private bookingRepository: IBookingRepository) {}

  async getBookings(): Promise<Booking[]> {
    return this.bookingRepository.getAll();
  }

  async getBooking(id: string): Promise<Booking> {
    const booking = await this.bookingRepository.getById(id);
    if (!booking) {
      throw new Error('Reserva não encontrada');
    }
    return booking;
  }

  async getBookingByCode(hotelId: string, code: string): Promise<Booking> {
    const booking = await this.bookingRepository.getByCode(hotelId, code);
    if (!booking) {
      throw new Error('Reserva não encontrada');
    }
    return booking;
  }

  async getBookingsByHotel(hotelId: string, startDate?: string, endDate?: string): Promise<Booking[]> {
    return this.bookingRepository.getByHotel(hotelId, startDate, endDate);
  }

  async getBookingsByGuest(guestId: string): Promise<Booking[]> {
    return this.bookingRepository.getByGuest(guestId);
  }

  async createBooking(data: BookingCreateRequest): Promise<Booking> {
    return this.bookingRepository.create(data);
  }

  async updateBooking(id: string, data: BookingUpdateRequest): Promise<Booking> {
    return this.bookingRepository.update(id, data);
  }

  async cancelBooking(id: string, reason?: string): Promise<void> {
    const success = await this.bookingRepository.cancel(id, reason);
    if (!success) {
      throw new Error('Falha ao cancelar reserva');
    }
  }

  async confirmBooking(id: string): Promise<void> {
    const success = await this.bookingRepository.confirm(id);
    if (!success) {
      throw new Error('Falha ao confirmar reserva');
    }
  }
}

