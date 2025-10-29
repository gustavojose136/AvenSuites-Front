/**
 * Repository Interface: IRoomRepository
 * Define o contrato para operações de quartos
 */

import { 
  Room, 
  RoomCreateRequest, 
  RoomUpdateRequest, 
  RoomAvailabilityRequest, 
  RoomAvailabilityResponse 
} from '@/application/dto/Room.dto';

export interface IRoomRepository {
  getAll(): Promise<Room[]>;
  getById(id: string): Promise<Room | null>;
  getByHotel(hotelId: string, status?: string): Promise<Room[]>;
  checkAvailability(request: RoomAvailabilityRequest): Promise<RoomAvailabilityResponse[]>;
  create(data: RoomCreateRequest): Promise<Room>;
  update(id: string, data: RoomUpdateRequest): Promise<Room>;
  delete(id: string): Promise<boolean>;
}

