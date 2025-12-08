import { InvoiceRepository } from '../InvoiceRepository';
import { HttpClient } from '@/infrastructure/http/HttpClient';
import { Invoice, InvoiceCreateRequest, InvoiceUpdateRequest, InvoicePayRequest } from '@/application/dto/Invoice.dto';

jest.mock('@/infrastructure/http/HttpClient');

describe('InvoiceRepository', () => {
  let invoiceRepository: InvoiceRepository;
  let mockHttpClient: jest.Mocked<HttpClient>;

  const mockInvoice: Invoice = {
    id: '1',
    number: 'INV001',
    guestId: 'guest-1',
    hotelId: 'hotel-1',
    bookingId: 'booking-1',
    amount: 1000,
    status: 'pending',
    issueDate: '2024-01-01',
    dueDate: '2024-01-31',
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

    invoiceRepository = new InvoiceRepository(mockHttpClient);
  });

  describe('getAll', () => {
    it('deve retornar lista de notas fiscais sem filtros', async () => {
      const invoices = [mockInvoice];
      mockHttpClient.get.mockResolvedValue(invoices);

      const result = await invoiceRepository.getAll();

      expect(mockHttpClient.get).toHaveBeenCalledWith('/Invoice');
      expect(result).toEqual(invoices);
    });

    it('deve retornar lista de notas fiscais com filtros', async () => {
      const invoices = [mockInvoice];
      mockHttpClient.get.mockResolvedValue(invoices);

      const result = await invoiceRepository.getAll({
        status: 'pending',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        guestId: 'guest-1',
      });

      expect(mockHttpClient.get).toHaveBeenCalledWith('/Invoice?status=pending&startDate=2024-01-01&endDate=2024-01-31&guestId=guest-1');
      expect(result).toEqual(invoices);
    });
  });

  describe('getById', () => {
    it('deve retornar nota fiscal quando encontrada', async () => {
      mockHttpClient.get.mockResolvedValue(mockInvoice);

      const result = await invoiceRepository.getById('1');

      expect(mockHttpClient.get).toHaveBeenCalledWith('/Invoice/1');
      expect(result).toEqual(mockInvoice);
    });

    it('deve retornar null quando nota fiscal não encontrada', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('Not found'));

      const result = await invoiceRepository.getById('999');

      expect(result).toBeNull();
    });
  });

  describe('getByBooking', () => {
    it('deve retornar notas fiscais da reserva', async () => {
      const invoices = [mockInvoice];
      mockHttpClient.get.mockResolvedValue(invoices);

      const result = await invoiceRepository.getByBooking('booking-1');

      expect(mockHttpClient.get).toHaveBeenCalledWith('/Invoice/booking/booking-1');
      expect(result).toEqual(invoices);
    });
  });

  describe('getByGuest', () => {
    it('deve retornar notas fiscais do hóspede', async () => {
      const invoices = [mockInvoice];
      mockHttpClient.get.mockResolvedValue(invoices);

      const result = await invoiceRepository.getByGuest('guest-1');

      expect(mockHttpClient.get).toHaveBeenCalledWith('/Invoice/guest/guest-1');
      expect(result).toEqual(invoices);
    });
  });

  describe('getByHotel', () => {
    it('deve retornar notas fiscais do hotel', async () => {
      const invoices = [mockInvoice];
      mockHttpClient.get.mockResolvedValue(invoices);

      const result = await invoiceRepository.getByHotel('hotel-1');

      expect(mockHttpClient.get).toHaveBeenCalledWith('/Invoice/hotel/hotel-1');
      expect(result).toEqual(invoices);
    });
  });

  describe('create', () => {
    it('deve criar nota fiscal com sucesso', async () => {
      const createRequest: InvoiceCreateRequest = {
        bookingId: 'booking-1',
        guestId: 'guest-1',
        hotelId: 'hotel-1',
        amount: 1000,
      };

      mockHttpClient.post.mockResolvedValue(mockInvoice);

      const result = await invoiceRepository.create(createRequest);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/Invoice', createRequest);
      expect(result).toEqual(mockInvoice);
    });
  });

  describe('update', () => {
    it('deve atualizar nota fiscal com sucesso', async () => {
      const updateRequest: InvoiceUpdateRequest = {
        status: 'paid',
      };

      const updatedInvoice = { ...mockInvoice, status: 'paid' };
      mockHttpClient.put.mockResolvedValue(updatedInvoice);

      const result = await invoiceRepository.update('1', updateRequest);

      expect(mockHttpClient.put).toHaveBeenCalledWith('/Invoice/1', updateRequest);
      expect(result).toEqual(updatedInvoice);
    });
  });

  describe('pay', () => {
    it('deve pagar nota fiscal com sucesso', async () => {
      const payRequest: InvoicePayRequest = {
        paymentMethod: 'credit_card',
        paidAmount: 1000,
      };

      const paidInvoice = { ...mockInvoice, status: 'paid' };
      mockHttpClient.post.mockResolvedValue(paidInvoice);

      const result = await invoiceRepository.pay('1', payRequest);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/Invoice/1/pay', payRequest);
      expect(result).toEqual(paidInvoice);
    });
  });

  describe('delete', () => {
    it('deve deletar nota fiscal com sucesso', async () => {
      mockHttpClient.delete.mockResolvedValue(undefined);

      const result = await invoiceRepository.delete('1');

      expect(mockHttpClient.delete).toHaveBeenCalledWith('/Invoice/1');
      expect(result).toBe(true);
    });

    it('deve retornar false quando falha ao deletar', async () => {
      mockHttpClient.delete.mockRejectedValue(new Error('Delete failed'));

      const result = await invoiceRepository.delete('1');

      expect(result).toBe(false);
    });
  });
});

