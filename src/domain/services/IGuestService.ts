

import { IGuestRepository } from '../repositories/IGuestRepository';
import { Guest, GuestCreateRequest, GuestUpdateRequest } from '@/application/dto/Guest.dto';

export interface IGuestService {
  getGuests(): Promise<Guest[]>;
  getGuest(id: string): Promise<Guest>;
  getGuestsByHotel(hotelId: string): Promise<Guest[]>;
  createGuest(data: GuestCreateRequest): Promise<Guest>;
  updateGuest(id: string, data: GuestUpdateRequest): Promise<Guest>;
  deleteGuest(id: string): Promise<void>;
}

export class GuestService implements IGuestService {
  constructor(private guestRepository: IGuestRepository) {}

  async getGuests(): Promise<Guest[]> {
    return this.guestRepository.getAll();
  }

  async getGuest(id: string): Promise<Guest> {
    const guest = await this.guestRepository.getById(id);
    if (!guest) {
      throw new Error('Hóspede não encontrado');
    }
    return guest;
  }

  async getGuestsByHotel(hotelId: string): Promise<Guest[]> {
    return this.guestRepository.getByHotel(hotelId);
  }

  async createGuest(data: GuestCreateRequest): Promise<Guest> {
    return this.guestRepository.create(data);
  }

  async updateGuest(id: string, data: GuestUpdateRequest): Promise<Guest> {
    return this.guestRepository.update(id, data);
  }

  async deleteGuest(id: string): Promise<void> {
    const success = await this.guestRepository.delete(id);
    if (!success) {
      throw new Error('Falha ao deletar hóspede');
    }
  }
}

