import { GuestRepository } from '../GuestRepository';
import { HttpClient } from '@/infrastructure/http/HttpClient';
import { Guest, GuestCreateRequest, GuestUpdateRequest } from '@/application/dto/Guest.dto';

jest.mock('@/infrastructure/http/HttpClient');

describe('GuestRepository', () => {
  let guestRepository: GuestRepository;
  let mockHttpClient: jest.Mocked<HttpClient>;

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
    mockHttpClient = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<HttpClient>;

    guestRepository = new GuestRepository(mockHttpClient);
  });

  describe('getAll', () => {
    it('deve retornar lista de hóspedes', async () => {
      const guests = [mockGuest];
      mockHttpClient.get.mockResolvedValue(guests);

      const result = await guestRepository.getAll();

      expect(mockHttpClient.get).toHaveBeenCalledWith('/Guests');
      expect(result).toEqual(guests);
    });
  });

  describe('getById', () => {
    it('deve retornar hóspede quando encontrado', async () => {
      mockHttpClient.get.mockResolvedValue(mockGuest);

      const result = await guestRepository.getById('1');

      expect(mockHttpClient.get).toHaveBeenCalledWith('/Guests/1');
      expect(result).toEqual(mockGuest);
    });

    it('deve retornar null quando hóspede não encontrado', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('Not found'));

      const result = await guestRepository.getById('999');

      expect(result).toBeNull();
    });
  });

  describe('getByHotel', () => {
    it('deve retornar hóspedes do hotel', async () => {
      const guests = [mockGuest];
      mockHttpClient.get.mockResolvedValue(guests);

      const result = await guestRepository.getByHotel('hotel-1');

      expect(mockHttpClient.get).toHaveBeenCalledWith('/Guests/hotels/hotel-1');
      expect(result).toEqual(guests);
    });
  });

  describe('create', () => {
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

      mockHttpClient.post.mockResolvedValue(mockGuest);

      const result = await guestRepository.create(createRequest);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/Guests', createRequest);
      expect(result).toEqual(mockGuest);
    });
  });

  describe('update', () => {
    it('deve atualizar hóspede com sucesso', async () => {
      const updateRequest: GuestUpdateRequest = {
        email: 'newemail@example.com',
      };

      const updatedGuest = { ...mockGuest, email: 'newemail@example.com' };
      mockHttpClient.put.mockResolvedValue(updatedGuest);

      const result = await guestRepository.update('1', updateRequest);

      expect(mockHttpClient.put).toHaveBeenCalledWith('/Guests/1', updateRequest);
      expect(result).toEqual(updatedGuest);
    });
  });

  describe('delete', () => {
    it('deve deletar hóspede com sucesso', async () => {
      mockHttpClient.delete.mockResolvedValue(undefined);

      const result = await guestRepository.delete('1');

      expect(mockHttpClient.delete).toHaveBeenCalledWith('/Guests/1');
      expect(result).toBe(true);
    });

    it('deve retornar false quando falha ao deletar', async () => {
      mockHttpClient.delete.mockRejectedValue(new Error('Delete failed'));

      const result = await guestRepository.delete('1');

      expect(result).toBe(false);
    });
  });
});

