

import { IRoomRepository } from '../repositories/IRoomRepository';
import {
  Room,
  RoomCreateRequest,
  RoomUpdateRequest,
  RoomAvailabilityRequest,
  RoomAvailabilityResponse
} from '@/application/dto/Room.dto';

export interface IRoomService {
  getRooms(): Promise<Room[]>;
  getRoom(id: string): Promise<Room>;
  getRoomsByHotel(hotelId: string, status?: string): Promise<Room[]>;
  checkAvailability(request: RoomAvailabilityRequest): Promise<RoomAvailabilityResponse[]>;
  createRoom(data: RoomCreateRequest): Promise<Room>;
  updateRoom(id: string, data: RoomUpdateRequest): Promise<Room>;
  deleteRoom(id: string): Promise<void>;
}

export class RoomService implements IRoomService {
  constructor(private roomRepository: IRoomRepository) {}

  async getRooms(): Promise<Room[]> {
    return this.roomRepository.getAll();
  }

  async getRoom(id: string): Promise<Room> {
    const room = await this.roomRepository.getById(id);
    if (!room) {
      throw new Error('Quarto não encontrado');
    }
    return room;
  }

  async getRoomsByHotel(hotelId: string, status?: string): Promise<Room[]> {
    return this.roomRepository.getByHotel(hotelId, status);
  }

  async checkAvailability(request: RoomAvailabilityRequest): Promise<RoomAvailabilityResponse[]> {
    return this.roomRepository.checkAvailability(request);
  }

  async createRoom(data: RoomCreateRequest): Promise<Room> {
    return this.roomRepository.create(data);
  }

  async updateRoom(id: string, data: RoomUpdateRequest): Promise<Room> {
    return this.roomRepository.update(id, data);
  }

  async deleteRoom(id: string): Promise<void> {
    const success = await this.roomRepository.delete(id);
    if (!success) {
      throw new Error('Falha ao deletar quarto');
    }
  }
}

