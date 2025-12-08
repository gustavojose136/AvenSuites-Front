import { InvoiceService, IInvoiceService } from '../IInvoiceService';
import { IInvoiceRepository } from '../../repositories/IInvoiceRepository';
import { Invoice, InvoiceCreateRequest, InvoiceUpdateRequest } from '@/application/dto/Invoice.dto';

describe('InvoiceService', () => {
  let invoiceService: IInvoiceService;
  let mockRepository: jest.Mocked<IInvoiceRepository>;

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
    mockRepository = {
      getAll: jest.fn(),
      getById: jest.fn(),
      getByBooking: jest.fn(),
      getByGuest: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<IInvoiceRepository>;

    invoiceService = new InvoiceService(mockRepository);
  });

  describe('getInvoices', () => {
    it('deve retornar lista de notas fiscais', async () => {
      const invoices = [mockInvoice];
      mockRepository.getAll.mockResolvedValue(invoices);

      const result = await invoiceService.getInvoices();

      expect(mockRepository.getAll).toHaveBeenCalled();
      expect(result).toEqual(invoices);
    });
  });

  describe('getInvoice', () => {
    it('deve retornar nota fiscal quando encontrada', async () => {
      mockRepository.getById.mockResolvedValue(mockInvoice);

      const result = await invoiceService.getInvoice('1');

      expect(mockRepository.getById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockInvoice);
    });

    it('deve lançar erro quando nota fiscal não encontrada', async () => {
      mockRepository.getById.mockResolvedValue(null as any);

      await expect(invoiceService.getInvoice('999')).rejects.toThrow('Nota fiscal não encontrada');
    });
  });

  describe('getInvoicesByBooking', () => {
    it('deve retornar notas fiscais da reserva', async () => {
      const invoices = [mockInvoice];
      mockRepository.getByBooking.mockResolvedValue(invoices);

      const result = await invoiceService.getInvoicesByBooking('booking-1');

      expect(mockRepository.getByBooking).toHaveBeenCalledWith('booking-1');
      expect(result).toEqual(invoices);
    });
  });

  describe('getInvoicesByGuest', () => {
    it('deve retornar notas fiscais do hóspede', async () => {
      const invoices = [mockInvoice];
      mockRepository.getByGuest.mockResolvedValue(invoices);

      const result = await invoiceService.getInvoicesByGuest('guest-1');

      expect(mockRepository.getByGuest).toHaveBeenCalledWith('guest-1');
      expect(result).toEqual(invoices);
    });
  });

  describe('createInvoice', () => {
    it('deve criar nota fiscal com sucesso', async () => {
      const createRequest: InvoiceCreateRequest = {
        bookingId: 'booking-1',
        guestId: 'guest-1',
        hotelId: 'hotel-1',
        amount: 1000,
      };

      mockRepository.create.mockResolvedValue(mockInvoice);

      const result = await invoiceService.createInvoice(createRequest);

      expect(mockRepository.create).toHaveBeenCalledWith(createRequest);
      expect(result).toEqual(mockInvoice);
    });
  });

  describe('updateInvoice', () => {
    it('deve atualizar nota fiscal com sucesso', async () => {
      const updateRequest: InvoiceUpdateRequest = {
        status: 'paid',
      };

      const updatedInvoice = { ...mockInvoice, status: 'paid' };
      mockRepository.update.mockResolvedValue(updatedInvoice);

      const result = await invoiceService.updateInvoice('1', updateRequest);

      expect(mockRepository.update).toHaveBeenCalledWith('1', updateRequest);
      expect(result).toEqual(updatedInvoice);
    });
  });

  describe('createInvoice', () => {
    it('deve validar valor maior que zero', async () => {
      const createRequest: InvoiceCreateRequest = {
        bookingId: 'booking-1',
        guestId: 'guest-1',
        hotelId: 'hotel-1',
        amount: 0,
      };

      await expect(invoiceService.createInvoice(createRequest)).rejects.toThrow('O valor da nota fiscal deve ser maior que zero');
    });

    it('deve validar valor total dos itens', async () => {
      const createRequest: InvoiceCreateRequest = {
        bookingId: 'booking-1',
        guestId: 'guest-1',
        hotelId: 'hotel-1',
        amount: 1000,
        items: [
          { description: 'Item 1', quantity: 1, unitPrice: 500, totalPrice: 500 },
        ],
      };

      await expect(invoiceService.createInvoice(createRequest)).rejects.toThrow('O valor total dos itens deve corresponder ao valor da nota fiscal');
    });
  });

  describe('getInvoicesByHotel', () => {
    it('deve retornar notas fiscais do hotel', async () => {
      const invoices = [mockInvoice];
      mockRepository.getByHotel = jest.fn().mockResolvedValue(invoices);

      const result = await invoiceService.getInvoicesByHotel('hotel-1');

      expect(mockRepository.getByHotel).toHaveBeenCalledWith('hotel-1');
      expect(result).toEqual(invoices);
    });
  });

  describe('payInvoice', () => {
    it('deve pagar nota fiscal com sucesso', async () => {
      const payRequest: InvoicePayRequest = {
        paymentMethod: 'credit_card',
        paidAmount: 1000,
      };

      const paidInvoice = { ...mockInvoice, status: 'paid' };
      mockRepository.pay = jest.fn().mockResolvedValue(paidInvoice);

      const result = await invoiceService.payInvoice('1', payRequest);

      expect(mockRepository.pay).toHaveBeenCalledWith('1', payRequest);
      expect(result).toEqual(paidInvoice);
    });
  });

  describe('deleteInvoice', () => {
    it('deve deletar nota fiscal com sucesso', async () => {
      mockRepository.delete.mockResolvedValue(true);

      await invoiceService.deleteInvoice('1');

      expect(mockRepository.delete).toHaveBeenCalledWith('1');
    });

    it('deve lançar erro quando falha ao deletar', async () => {
      mockRepository.delete.mockResolvedValue(false);

      await expect(invoiceService.deleteInvoice('1')).rejects.toThrow('Falha ao excluir nota fiscal');
    });
  });
});

