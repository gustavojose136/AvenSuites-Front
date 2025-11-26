/**
 * Service Interface: IInvoiceService
 * Define a lógica de negócio para notas fiscais
 */

import { IInvoiceRepository } from '../repositories/IInvoiceRepository';
import { Invoice, InvoiceCreateRequest, InvoiceUpdateRequest, InvoicePayRequest } from '@/application/dto/Invoice.dto';

export interface IInvoiceService {
  getInvoices(params?: { status?: string; startDate?: string; endDate?: string; guestId?: string }): Promise<Invoice[]>;
  getInvoice(id: string): Promise<Invoice>;
  getInvoicesByBooking(bookingId: string): Promise<Invoice[]>;
  getInvoicesByGuest(guestId: string): Promise<Invoice[]>;
  getInvoicesByHotel(hotelId: string): Promise<Invoice[]>;
  createInvoice(data: InvoiceCreateRequest): Promise<Invoice>;
  updateInvoice(id: string, data: InvoiceUpdateRequest): Promise<Invoice>;
  payInvoice(id: string, data: InvoicePayRequest): Promise<Invoice>;
  deleteInvoice(id: string): Promise<void>;
}

export class InvoiceService implements IInvoiceService {
  constructor(private invoiceRepository: IInvoiceRepository) {}

  async getInvoices(params?: { status?: string; startDate?: string; endDate?: string; guestId?: string }): Promise<Invoice[]> {
    return this.invoiceRepository.getAll(params);
  }

  async getInvoice(id: string): Promise<Invoice> {
    const invoice = await this.invoiceRepository.getById(id);
    if (!invoice) {
      throw new Error('Nota fiscal não encontrada');
    }
    return invoice;
  }

  async getInvoicesByBooking(bookingId: string): Promise<Invoice[]> {
    return this.invoiceRepository.getByBooking(bookingId);
  }

  async getInvoicesByGuest(guestId: string): Promise<Invoice[]> {
    return this.invoiceRepository.getByGuest(guestId);
  }

  async getInvoicesByHotel(hotelId: string): Promise<Invoice[]> {
    return this.invoiceRepository.getByHotel(hotelId);
  }

  async createInvoice(data: InvoiceCreateRequest): Promise<Invoice> {
    // Validações de negócio
    if (data.amount <= 0) {
      throw new Error('O valor da nota fiscal deve ser maior que zero');
    }
    
    // Calcular totalAmount se não fornecido
    const taxAmount = data.taxAmount || 0;
    const totalAmount = data.amount + taxAmount;
    
    // Calcular totalPrice dos items se fornecido
    if (data.items && data.items.length > 0) {
      const itemsTotal = data.items.reduce((sum, item) => sum + item.totalPrice, 0);
      if (Math.abs(itemsTotal - data.amount) > 0.01) {
        throw new Error('O valor total dos itens deve corresponder ao valor da nota fiscal');
      }
    }

    return this.invoiceRepository.create({
      ...data,
      taxAmount,
    });
  }

  async updateInvoice(id: string, data: InvoiceUpdateRequest): Promise<Invoice> {
    return this.invoiceRepository.update(id, data);
  }

  async payInvoice(id: string, data: InvoicePayRequest): Promise<Invoice> {
    return this.invoiceRepository.pay(id, data);
  }

  async deleteInvoice(id: string): Promise<void> {
    const success = await this.invoiceRepository.delete(id);
    if (!success) {
      throw new Error('Falha ao excluir nota fiscal');
    }
  }
}

