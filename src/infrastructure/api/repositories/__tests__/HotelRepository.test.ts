/**
 * Testes: HotelRepository
 * Testa a implementação do repositório de hotéis
 * SOLID - Dependency Inversion: Testa através de HttpClient mockado
 */

import { HotelRepository } from '../HotelRepository';
import { HttpClient } from '@/infrastructure/http/HttpClient';
import { Hotel, HotelCreateRequest, HotelUpdateRequest } from '@/application/dto/Hotel.dto';

// Mock do HttpClient
jest.mock('@/infrastructure/http/HttpClient');

describe('HotelRepository', () => {
  let hotelRepository: HotelRepository;
  let mockHttpClient: jest.Mocked<HttpClient>;

  const mockHotel: Hotel = {
    id: '1',
    tradingName: 'Hotel Test',
    legalName: 'Hotel Test LTDA',
    cnpj: '12345678000190',
    email: 'test@hotel.com',
    phone: '+5511999999999',
    addressLine1: 'Rua Test',
    city: 'São Paulo',
    state: 'SP',
    postalCode: '01234567',
    countryCode: 'BR',
    active: true,
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

    hotelRepository = new HotelRepository(mockHttpClient);
  });

  describe('getAll', () => {
    it('deve retornar lista de hotéis', async () => {
      const hotels = [mockHotel];
      mockHttpClient.get.mockResolvedValue(hotels);

      const result = await hotelRepository.getAll();

      expect(mockHttpClient.get).toHaveBeenCalledWith('/Hotels');
      expect(result).toEqual(hotels);
    });
  });

  describe('getById', () => {
    it('deve retornar hotel quando encontrado', async () => {
      mockHttpClient.get.mockResolvedValue(mockHotel);

      const result = await hotelRepository.getById('1');

      expect(mockHttpClient.get).toHaveBeenCalledWith('/Hotels/1');
      expect(result).toEqual(mockHotel);
    });

    it('deve retornar null quando hotel não encontrado', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('Not found'));

      const result = await hotelRepository.getById('999');

      expect(result).toBeNull();
    });
  });

  describe('getByCnpj', () => {
    it('deve retornar hotel quando encontrado por CNPJ', async () => {
      mockHttpClient.get.mockResolvedValue(mockHotel);

      const result = await hotelRepository.getByCnpj('12345678000190');

      expect(mockHttpClient.get).toHaveBeenCalledWith('/Hotels/cnpj/12345678000190');
      expect(result).toEqual(mockHotel);
    });

    it('deve retornar null quando hotel não encontrado por CNPJ', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('Not found'));

      const result = await hotelRepository.getByCnpj('99999999999999');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('deve criar hotel com sucesso', async () => {
      const createRequest: HotelCreateRequest = {
        tradingName: 'New Hotel',
        legalName: 'New Hotel LTDA',
        cnpj: '98765432000100',
        email: 'new@hotel.com',
        phone: '+5511888888888',
        addressLine1: 'Rua New',
        city: 'Rio de Janeiro',
        state: 'RJ',
        postalCode: '20000000',
        countryCode: 'BR',
      };

      mockHttpClient.post.mockResolvedValue(mockHotel);

      const result = await hotelRepository.create(createRequest);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/Hotels', createRequest);
      expect(result).toEqual(mockHotel);
    });
  });

  describe('update', () => {
    it('deve atualizar hotel com sucesso', async () => {
      const updateRequest: HotelUpdateRequest = {
        tradingName: 'Updated Hotel',
      };

      const updatedHotel = { ...mockHotel, tradingName: 'Updated Hotel' };
      mockHttpClient.put.mockResolvedValue(updatedHotel);

      const result = await hotelRepository.update('1', updateRequest);

      expect(mockHttpClient.put).toHaveBeenCalledWith('/Hotels/1', updateRequest);
      expect(result).toEqual(updatedHotel);
    });
  });

  describe('delete', () => {
    it('deve deletar hotel com sucesso', async () => {
      mockHttpClient.delete.mockResolvedValue(undefined);

      const result = await hotelRepository.delete('1');

      expect(mockHttpClient.delete).toHaveBeenCalledWith('/Hotels/1');
      expect(result).toBe(true);
    });

    it('deve retornar false quando falha ao deletar', async () => {
      mockHttpClient.delete.mockRejectedValue(new Error('Delete failed'));

      const result = await hotelRepository.delete('1');

      expect(result).toBe(false);
    });
  });
});

