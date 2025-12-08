

import { IHotelRepository } from '../repositories/IHotelRepository';
import { Hotel, HotelCreateRequest, HotelUpdateRequest } from '@/application/dto/Hotel.dto';

export interface IHotelService {
  getHotels(): Promise<Hotel[]>;
  getHotel(id: string): Promise<Hotel>;
  getHotelByCnpj(cnpj: string): Promise<Hotel>;
  createHotel(data: HotelCreateRequest): Promise<Hotel>;
  updateHotel(id: string, data: HotelUpdateRequest): Promise<Hotel>;
  deleteHotel(id: string): Promise<void>;
}

export class HotelService implements IHotelService {
  constructor(private hotelRepository: IHotelRepository) {}

  async getHotels(): Promise<Hotel[]> {
    return this.hotelRepository.getAll();
  }

  async getHotel(id: string): Promise<Hotel> {
    const hotel = await this.hotelRepository.getById(id);
    if (!hotel) {
      throw new Error('Hotel não encontrado');
    }
    return hotel;
  }

  async getHotelByCnpj(cnpj: string): Promise<Hotel> {
    const hotel = await this.hotelRepository.getByCnpj(cnpj);
    if (!hotel) {
      throw new Error('Hotel não encontrado');
    }
    return hotel;
  }

  async createHotel(data: HotelCreateRequest): Promise<Hotel> {
    return this.hotelRepository.create(data);
  }

  async updateHotel(id: string, data: HotelUpdateRequest): Promise<Hotel> {
    return this.hotelRepository.update(id, data);
  }

  async deleteHotel(id: string): Promise<void> {
    const success = await this.hotelRepository.delete(id);
    if (!success) {
      throw new Error('Falha ao deletar hotel');
    }
  }
}

