/**
 * Testes: HotelService
 * Testa a lógica de negócio para hotéis
 * SOLID - Dependency Inversion: Testa através de interface mockada
 */

import { HotelService, IHotelService } from '../IHotelService';
import { IHotelRepository } from '../../repositories/IHotelRepository';
import { Hotel, HotelCreateRequest, HotelUpdateRequest } from '@/application/dto/Hotel.dto';

describe('HotelService', () => {
  let hotelService: IHotelService;
  let mockRepository: jest.Mocked<IHotelRepository>;

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
    mockRepository = {
      getAll: jest.fn(),
      getById: jest.fn(),
      getByCnpj: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<IHotelRepository>;

    hotelService = new HotelService(mockRepository);
  });

  describe('getHotels', () => {
    it('deve retornar lista de hotéis', async () => {
      const hotels = [mockHotel];
      mockRepository.getAll.mockResolvedValue(hotels);

      const result = await hotelService.getHotels();

      expect(mockRepository.getAll).toHaveBeenCalled();
      expect(result).toEqual(hotels);
    });
  });

  describe('getHotel', () => {
    it('deve retornar hotel quando encontrado', async () => {
      mockRepository.getById.mockResolvedValue(mockHotel);

      const result = await hotelService.getHotel('1');

      expect(mockRepository.getById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockHotel);
    });

    it('deve lançar erro quando hotel não encontrado', async () => {
      mockRepository.getById.mockResolvedValue(null as any);

      await expect(hotelService.getHotel('999')).rejects.toThrow('Hotel não encontrado');
    });
  });

  describe('getHotelByCnpj', () => {
    it('deve retornar hotel quando encontrado por CNPJ', async () => {
      mockRepository.getByCnpj.mockResolvedValue(mockHotel);

      const result = await hotelService.getHotelByCnpj('12345678000190');

      expect(mockRepository.getByCnpj).toHaveBeenCalledWith('12345678000190');
      expect(result).toEqual(mockHotel);
    });

    it('deve lançar erro quando hotel não encontrado por CNPJ', async () => {
      mockRepository.getByCnpj.mockResolvedValue(null as any);

      await expect(hotelService.getHotelByCnpj('99999999999999')).rejects.toThrow('Hotel não encontrado');
    });
  });

  describe('createHotel', () => {
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

      mockRepository.create.mockResolvedValue(mockHotel);

      const result = await hotelService.createHotel(createRequest);

      expect(mockRepository.create).toHaveBeenCalledWith(createRequest);
      expect(result).toEqual(mockHotel);
    });
  });

  describe('updateHotel', () => {
    it('deve atualizar hotel com sucesso', async () => {
      const updateRequest: HotelUpdateRequest = {
        tradingName: 'Updated Hotel',
      };

      const updatedHotel = { ...mockHotel, tradingName: 'Updated Hotel' };
      mockRepository.update.mockResolvedValue(updatedHotel);

      const result = await hotelService.updateHotel('1', updateRequest);

      expect(mockRepository.update).toHaveBeenCalledWith('1', updateRequest);
      expect(result).toEqual(updatedHotel);
    });
  });

  describe('deleteHotel', () => {
    it('deve deletar hotel com sucesso', async () => {
      mockRepository.delete.mockResolvedValue(true);

      await hotelService.deleteHotel('1');

      expect(mockRepository.delete).toHaveBeenCalledWith('1');
    });

    it('deve lançar erro quando falha ao deletar', async () => {
      mockRepository.delete.mockResolvedValue(false);

      await expect(hotelService.deleteHotel('1')).rejects.toThrow('Falha ao deletar hotel');
    });
  });
});

