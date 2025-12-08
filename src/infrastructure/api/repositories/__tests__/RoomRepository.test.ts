import { RoomRepository } from '../RoomRepository';
import { HttpClient } from '@/infrastructure/http/HttpClient';
import { Room, RoomCreateRequest, RoomUpdateRequest, RoomAvailabilityRequest } from '@/application/dto/Room.dto';

jest.mock('@/infrastructure/http/HttpClient');

describe('RoomRepository', () => {
  let roomRepository: RoomRepository;
  let mockHttpClient: jest.Mocked<HttpClient>;

  const mockRoom: Room = {
    id: '1',
    hotelId: 'hotel-1',
    roomTypeId: 'type-1',
    roomNumber: '101',
    floor: '1',
    status: 'ACTIVE',
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

    roomRepository = new RoomRepository(mockHttpClient);
  });

  describe('getAll', () => {
    it('deve retornar lista de quartos', async () => {
      const rooms = [mockRoom];
      mockHttpClient.get.mockResolvedValue(rooms);

      const result = await roomRepository.getAll();

      expect(mockHttpClient.get).toHaveBeenCalledWith('/Rooms');
      expect(result).toEqual(rooms);
    });
  });

  describe('getById', () => {
    it('deve retornar quarto quando encontrado', async () => {
      mockHttpClient.get.mockResolvedValue(mockRoom);

      const result = await roomRepository.getById('1');

      expect(mockHttpClient.get).toHaveBeenCalledWith('/Rooms/1');
      expect(result).toEqual(mockRoom);
    });

    it('deve retornar null quando quarto não encontrado', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('Not found'));

      const result = await roomRepository.getById('999');

      expect(result).toBeNull();
    });
  });

  describe('getByHotel', () => {
    it('deve retornar quartos do hotel', async () => {
      const rooms = [mockRoom];
      mockHttpClient.get.mockResolvedValue(rooms);

      const result = await roomRepository.getByHotel('hotel-1');

      expect(mockHttpClient.get).toHaveBeenCalledWith('/Rooms/hotels/hotel-1');
      expect(result).toEqual(rooms);
    });

    it('deve retornar quartos do hotel com filtro de status', async () => {
      const rooms = [mockRoom];
      mockHttpClient.get.mockResolvedValue(rooms);

      const result = await roomRepository.getByHotel('hotel-1', 'ACTIVE');

      expect(mockHttpClient.get).toHaveBeenCalledWith('/Rooms/hotels/hotel-1?status=ACTIVE');
      expect(result).toEqual(rooms);
    });
  });

  describe('checkAvailability', () => {
    it('deve verificar disponibilidade de quartos', async () => {
      const availabilityRequest: RoomAvailabilityRequest = {
        hotelId: 'hotel-1',
        checkInDate: '2024-01-01',
        checkOutDate: '2024-01-05',
        adults: 2,
        children: 0,
      };

      const mockAvailability = [{
        roomId: '1',
        roomNumber: '101',
        available: true,
        pricePerNight: 200,
      }];

      mockHttpClient.get.mockResolvedValue(mockAvailability);

      const result = await roomRepository.checkAvailability(availabilityRequest);

      expect(mockHttpClient.get).toHaveBeenCalled();
      expect(result).toEqual(mockAvailability);
    });
  });

  describe('create', () => {
    it('deve criar quarto com sucesso', async () => {
      const createRequest: RoomCreateRequest = {
        hotelId: 'hotel-1',
        roomTypeId: 'type-1',
        roomNumber: '101',
        floor: '1',
        status: 'ACTIVE',
      };

      mockHttpClient.post.mockResolvedValue(mockRoom);

      const result = await roomRepository.create(createRequest);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/Rooms', createRequest);
      expect(result).toEqual(mockRoom);
    });
  });

  describe('update', () => {
    it('deve atualizar quarto com sucesso', async () => {
      const updateRequest: RoomUpdateRequest = {
        status: 'MAINTENANCE',
      };

      const updatedRoom = { ...mockRoom, status: 'MAINTENANCE' };
      mockHttpClient.put.mockResolvedValue(updatedRoom);

      const result = await roomRepository.update('1', updateRequest);

      expect(mockHttpClient.put).toHaveBeenCalledWith('/Rooms/1', updateRequest);
      expect(result).toEqual(updatedRoom);
    });
  });

  describe('delete', () => {
    it('deve deletar quarto com sucesso', async () => {
      mockHttpClient.delete.mockResolvedValue(undefined);

      const result = await roomRepository.delete('1');

      expect(mockHttpClient.delete).toHaveBeenCalledWith('/Rooms/1');
      expect(result).toBe(true);
    });

    it('deve retornar false quando falha ao deletar', async () => {
      mockHttpClient.delete.mockRejectedValue(new Error('Delete failed'));

      const result = await roomRepository.delete('1');

      expect(result).toBe(false);
    });
  });
});

