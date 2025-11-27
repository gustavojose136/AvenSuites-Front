/**
 * Repository Interface: IBookingRepository
 * Define o contrato para operações de reservas
 */

import { Booking, BookingCreateRequest, BookingUpdateRequest } from '@/application/dto/Booking.dto';

export interface IBookingRepository {
  getAll(): Promise<Booking[]>;
  getById(id: string): Promise<Booking | null>;
  getByCode(hotelId: string, code: string): Promise<Booking | null>;
  getByHotel(hotelId: string, startDate?: string, endDate?: string): Promise<Booking[]>;
  getByGuest(guestId: string): Promise<Booking[]>;
  create(data: BookingCreateRequest): Promise<Booking>;
  update(id: string, data: BookingUpdateRequest): Promise<Booking>;
  cancel(id: string, reason?: string): Promise<boolean>;
  confirm(id: string): Promise<boolean>;
  checkIn(id: string): Promise<Booking>;
  checkOut(id: string): Promise<Booking>;
}

