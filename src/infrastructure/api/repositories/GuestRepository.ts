/**
 * Repository Implementation: GuestRepository
 * Implementação concreta da interface IGuestRepository
 */

import { IGuestRepository } from '@/domain/repositories/IGuestRepository';
import { Guest, GuestCreateRequest, GuestUpdateRequest } from '@/application/dto/Guest.dto';
import { HttpClient } from '@/infrastructure/http/HttpClient';

export class GuestRepository implements IGuestRepository {
  private baseUrl = '/Guests';

  constructor(private httpClient: HttpClient) {}

  async getAll(): Promise<Guest[]> {
    return this.httpClient.get<Guest[]>(this.baseUrl);
  }

  async getById(id: string): Promise<Guest | null> {
    try {
      return await this.httpClient.get<Guest>(`${this.baseUrl}/${id}`);
    } catch {
      return null;
    }
  }

  async getByHotel(hotelId: string): Promise<Guest[]> {
    return this.httpClient.get<Guest[]>(`${this.baseUrl}/hotels/${hotelId}`);
  }

  async create(data: GuestCreateRequest): Promise<Guest> {
    return this.httpClient.post<Guest>(this.baseUrl, data);
  }

  async update(id: string, data: GuestUpdateRequest): Promise<Guest> {
    return this.httpClient.put<Guest>(`${this.baseUrl}/${id}`, data);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.httpClient.delete(`${this.baseUrl}/${id}`);
      return true;
    } catch {
      return false;
    }
  }
}

