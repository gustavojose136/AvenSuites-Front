/**
 * Repository Interface: IGuestRepository
 * Define o contrato para operações de hóspedes
 */

import { Guest, GuestCreateRequest, GuestUpdateRequest } from '@/application/dto/Guest.dto';

export interface IGuestRepository {
  getAll(): Promise<Guest[]>;
  getById(id: string): Promise<Guest | null>;
  getByHotel(hotelId: string): Promise<Guest[]>;
  create(data: GuestCreateRequest): Promise<Guest>;
  update(id: string, data: GuestUpdateRequest): Promise<Guest>;
  delete(id: string): Promise<boolean>;
}

