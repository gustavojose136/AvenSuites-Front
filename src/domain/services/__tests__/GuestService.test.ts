import { GuestService, IGuestService } from '../IGuestService';
import { IGuestRepository } from '../../repositories/IGuestRepository';
import { Guest, GuestCreateRequest, GuestUpdateRequest } from '@/application/dto/Guest.dto';

describe('GuestService', () => {
  let guestService: IGuestService;
  let mockRepository: jest.Mocked<IGuestRepository>;

  const mockGuest: Guest = {
    id: '1',
    hotelId: 'hotel-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phoneE164: '+5511999999999',
    documentType: 'CPF',
    documentNumber: '12345678900',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  };

  beforeEach(() => {
    mockRepository = {
      getAll: jest.fn(),
      getById: jest.fn(),
      getByHotel: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<IGuestRepository>;

    guestService = new GuestService(mockRepository);
  });

  describe('getGuests', () => {
    it('deve retornar lista de hóspedes', async () => {
      const guests = [mockGuest];
      mockRepository.getAll.mockResolvedValue(guests);

      const result = await guestService.getGuests();

      expect(mockRepository.getAll).toHaveBeenCalled();
      expect(result).toEqual(guests);
    });
  });

  describe('getGuest', () => {
    it('deve retornar hóspede quando encontrado', async () => {
      mockRepository.getById.mockResolvedValue(mockGuest);

      const result = await guestService.getGuest('1');

      expect(mockRepository.getById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockGuest);
    });

    it('deve lançar erro quando hóspede não encontrado', async () => {
      mockRepository.getById.mockResolvedValue(null as any);

      await expect(guestService.getGuest('999')).rejects.toThrow('Hóspede não encontrado');
    });
  });

  describe('getGuestsByHotel', () => {
    it('deve retornar hóspedes do hotel', async () => {
      const guests = [mockGuest];
      mockRepository.getByHotel.mockResolvedValue(guests);

      const result = await guestService.getGuestsByHotel('hotel-1');

      expect(mockRepository.getByHotel).toHaveBeenCalledWith('hotel-1');
      expect(result).toEqual(guests);
    });
  });

  describe('createGuest', () => {
    it('deve criar hóspede com sucesso', async () => {
      const createRequest: GuestCreateRequest = {
        hotelId: 'hotel-1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phoneE164: '+5511999999999',
        documentType: 'CPF',
        documentNumber: '12345678900',
      };

      mockRepository.create.mockResolvedValue(mockGuest);

      const result = await guestService.createGuest(createRequest);

      expect(mockRepository.create).toHaveBeenCalledWith(createRequest);
      expect(result).toEqual(mockGuest);
    });
  });

  describe('updateGuest', () => {
    it('deve atualizar hóspede com sucesso', async () => {
      const updateRequest: GuestUpdateRequest = {
        email: 'newemail@example.com',
      };

      const updatedGuest = { ...mockGuest, email: 'newemail@example.com' };
      mockRepository.update.mockResolvedValue(updatedGuest);

      const result = await guestService.updateGuest('1', updateRequest);

      expect(mockRepository.update).toHaveBeenCalledWith('1', updateRequest);
      expect(result).toEqual(updatedGuest);
    });
  });

  describe('deleteGuest', () => {
    it('deve deletar hóspede com sucesso', async () => {
      mockRepository.delete.mockResolvedValue(true);

      await guestService.deleteGuest('1');

      expect(mockRepository.delete).toHaveBeenCalledWith('1');
    });

    it('deve lançar erro quando falha ao deletar', async () => {
      mockRepository.delete.mockResolvedValue(false);

      await expect(guestService.deleteGuest('1')).rejects.toThrow('Falha ao deletar hóspede');
    });
  });
});

