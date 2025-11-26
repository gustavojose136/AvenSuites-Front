/**
 * Repository Interface: IInvoiceRepository
 * Define o contrato para operações de notas fiscais
 */

import { Invoice, InvoiceCreateRequest, InvoiceUpdateRequest, InvoicePayRequest } from '@/application/dto/Invoice.dto';

export interface IInvoiceRepository {
  getAll(params?: { status?: string; startDate?: string; endDate?: string; guestId?: string }): Promise<Invoice[]>;
  getById(id: string): Promise<Invoice | null>;
  getByBooking(bookingId: string): Promise<Invoice[]>;
  getByGuest(guestId: string): Promise<Invoice[]>;
  getByHotel(hotelId: string): Promise<Invoice[]>;
  create(data: InvoiceCreateRequest): Promise<Invoice>;
  update(id: string, data: InvoiceUpdateRequest): Promise<Invoice>;
  pay(id: string, data: InvoicePayRequest): Promise<Invoice>;
  delete(id: string): Promise<boolean>;
}

