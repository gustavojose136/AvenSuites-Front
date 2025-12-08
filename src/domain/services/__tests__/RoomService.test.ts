import { RoomService, IRoomService } from '../IRoomService';
import { IRoomRepository } from '../../repositories/IRoomRepository';
import { Room, RoomCreateRequest, RoomUpdateRequest, RoomAvailabilityRequest } from '@/application/dto/Room.dto';

describe('RoomService', () => {
  let roomService: IRoomService;
  let mockRepository: jest.Mocked<IRoomRepository>;

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
    mockRepository = {
      getAll: jest.fn(),
      getById: jest.fn(),
      getByHotel: jest.fn(),
      checkAvailability: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<IRoomRepository>;

    roomService = new RoomService(mockRepository);
  });

  describe('getRooms', () => {
    it('deve retornar lista de quartos', async () => {
      const rooms = [mockRoom];
      mockRepository.getAll.mockResolvedValue(rooms);

      const result = await roomService.getRooms();

      expect(mockRepository.getAll).toHaveBeenCalled();
      expect(result).toEqual(rooms);
    });
  });

  describe('getRoom', () => {
    it('deve retornar quarto quando encontrado', async () => {
      mockRepository.getById.mockResolvedValue(mockRoom);

      const result = await roomService.getRoom('1');

      expect(mockRepository.getById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockRoom);
    });

    it('deve lançar erro quando quarto não encontrado', async () => {
      mockRepository.getById.mockResolvedValue(null as any);

      await expect(roomService.getRoom('999')).rejects.toThrow('Quarto não encontrado');
    });
  });

  describe('getRoomsByHotel', () => {
    it('deve retornar quartos do hotel', async () => {
      const rooms = [mockRoom];
      mockRepository.getByHotel.mockResolvedValue(rooms);

      const result = await roomService.getRoomsByHotel('hotel-1');

      expect(mockRepository.getByHotel).toHaveBeenCalledWith('hotel-1', undefined);
      expect(result).toEqual(rooms);
    });

    it('deve retornar quartos do hotel com filtro de status', async () => {
      const rooms = [mockRoom];
      mockRepository.getByHotel.mockResolvedValue(rooms);

      const result = await roomService.getRoomsByHotel('hotel-1', 'ACTIVE');

      expect(mockRepository.getByHotel).toHaveBeenCalledWith('hotel-1', 'ACTIVE');
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

      mockRepository.checkAvailability.mockResolvedValue(mockAvailability);

      const result = await roomService.checkAvailability(availabilityRequest);

      expect(mockRepository.checkAvailability).toHaveBeenCalledWith(availabilityRequest);
      expect(result).toEqual(mockAvailability);
    });
  });

  describe('createRoom', () => {
    it('deve criar quarto com sucesso', async () => {
      const createRequest: RoomCreateRequest = {
        hotelId: 'hotel-1',
        roomTypeId: 'type-1',
        roomNumber: '101',
        floor: '1',
        status: 'ACTIVE',
      };

      mockRepository.create.mockResolvedValue(mockRoom);

      const result = await roomService.createRoom(createRequest);

      expect(mockRepository.create).toHaveBeenCalledWith(createRequest);
      expect(result).toEqual(mockRoom);
    });
  });

  describe('updateRoom', () => {
    it('deve atualizar quarto com sucesso', async () => {
      const updateRequest: RoomUpdateRequest = {
        status: 'MAINTENANCE',
      };

      const updatedRoom = { ...mockRoom, status: 'MAINTENANCE' };
      mockRepository.update.mockResolvedValue(updatedRoom);

      const result = await roomService.updateRoom('1', updateRequest);

      expect(mockRepository.update).toHaveBeenCalledWith('1', updateRequest);
      expect(result).toEqual(updatedRoom);
    });
  });

  describe('deleteRoom', () => {
    it('deve deletar quarto com sucesso', async () => {
      mockRepository.delete.mockResolvedValue(true);

      await roomService.deleteRoom('1');

      expect(mockRepository.delete).toHaveBeenCalledWith('1');
    });

    it('deve lançar erro quando falha ao deletar', async () => {
      mockRepository.delete.mockResolvedValue(false);

      await expect(roomService.deleteRoom('1')).rejects.toThrow('Falha ao deletar quarto');
    });
  });
});

