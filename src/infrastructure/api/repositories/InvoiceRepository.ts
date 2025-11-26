/**
 * Repository Implementation: InvoiceRepository
 * Implementação concreta da interface IInvoiceRepository
 */

import { IInvoiceRepository } from '@/domain/repositories/IInvoiceRepository';
import { Invoice, InvoiceCreateRequest, InvoiceUpdateRequest, InvoicePayRequest } from '@/application/dto/Invoice.dto';
import { HttpClient } from '@/infrastructure/http/HttpClient';

export class InvoiceRepository implements IInvoiceRepository {
  private baseUrl = '/Invoice';

  constructor(private httpClient: HttpClient) {}

  async getAll(params?: { status?: string; startDate?: string; endDate?: string; guestId?: string }): Promise<Invoice[]> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.guestId) queryParams.append('guestId', params.guestId);
    
    const query = queryParams.toString() ? `?${queryParams}` : '';
    return this.httpClient.get<Invoice[]>(`${this.baseUrl}${query}`);
  }

  async getById(id: string): Promise<Invoice | null> {
    try {
      return await this.httpClient.get<Invoice>(`${this.baseUrl}/${id}`);
    } catch {
      return null;
    }
  }

  async getByBooking(bookingId: string): Promise<Invoice[]> {
    return this.httpClient.get<Invoice[]>(`${this.baseUrl}/booking/${bookingId}`);
  }

  async getByGuest(guestId: string): Promise<Invoice[]> {
    return this.httpClient.get<Invoice[]>(`${this.baseUrl}/guest/${guestId}`);
  }

  async getByHotel(hotelId: string): Promise<Invoice[]> {
    return this.httpClient.get<Invoice[]>(`${this.baseUrl}/hotel/${hotelId}`);
  }

  async create(data: InvoiceCreateRequest): Promise<Invoice> {
    return this.httpClient.post<Invoice>(this.baseUrl, data);
  }

  async update(id: string, data: InvoiceUpdateRequest): Promise<Invoice> {
    return this.httpClient.put<Invoice>(`${this.baseUrl}/${id}`, data);
  }

  async pay(id: string, data: InvoicePayRequest): Promise<Invoice> {
    return this.httpClient.post<Invoice>(`${this.baseUrl}/${id}/pay`, data);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.httpClient.delete(`${this.baseUrl}/${id}`);
      return true;
    } catch {
      return false;
    }
  }
}

