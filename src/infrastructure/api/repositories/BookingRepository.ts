/**
 * Repository Implementation: BookingRepository
 * Implementação concreta da interface IBookingRepository
 */

import { IBookingRepository } from '@/domain/repositories/IBookingRepository';
import { Booking, BookingCreateRequest, BookingUpdateRequest } from '@/application/dto/Booking.dto';
import { HttpClient } from '@/infrastructure/http/HttpClient';

export class BookingRepository implements IBookingRepository {
  private baseUrl = '/Bookings';

  constructor(private httpClient: HttpClient) {}

  async getAll(): Promise<Booking[]> {
    return this.httpClient.get<Booking[]>(this.baseUrl);
  }

  async getById(id: string): Promise<Booking | null> {
    try {
      return await this.httpClient.get<Booking>(`${this.baseUrl}/${id}`);
    } catch {
      return null;
    }
  }

  async getByCode(hotelId: string, code: string): Promise<Booking | null> {
    try {
      // A API espera: GET /Booking/code/{code} com hotelId como query param opcional
      return await this.httpClient.get<Booking>(`${this.baseUrl}/code/${code}?hotelId=${hotelId}`);
    } catch {
      return null;
    }
  }

  async getByHotel(hotelId: string, startDate?: string, endDate?: string): Promise<Booking[]> {
    // A API espera: GET /Booking/hotel/{hotelId}
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const query = params.toString() ? `?${params}` : '';
    return this.httpClient.get<Booking[]>(`${this.baseUrl}/hotel/${hotelId}${query}`);
  }

  async getByGuest(guestId: string): Promise<Booking[]> {
    return this.httpClient.get<Booking[]>(`${this.baseUrl}/guest/${guestId}`);
  }

  async create(data: BookingCreateRequest): Promise<Booking> {
    return this.httpClient.post<Booking>(this.baseUrl, data);
  }

  async update(id: string, data: BookingUpdateRequest): Promise<Booking> {
    return this.httpClient.put<Booking>(`${this.baseUrl}/${id}`, data);
  }

  async cancel(id: string, reason?: string): Promise<boolean> {
    try {
      const query = reason ? `?reason=${encodeURIComponent(reason)}` : '';
      await this.httpClient.post(`${this.baseUrl}/${id}/cancel${query}`, {});
      return true;
    } catch {
      return false;
    }
  }

  async confirm(id: string): Promise<boolean> {
    try {
      await this.httpClient.post(`${this.baseUrl}/${id}/confirm`, {});
      return true;
    } catch {
      return false;
    }
  }

  async checkIn(id: string): Promise<Booking> {
    return this.httpClient.post<Booking>(`${this.baseUrl}/${id}/check-in`, {});
  }

  async checkOut(id: string): Promise<Booking> {
    return this.httpClient.post<Booking>(`${this.baseUrl}/${id}/check-out`, {});
  }
}

