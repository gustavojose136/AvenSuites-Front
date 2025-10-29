/**
 * Repository Implementation: HotelRepository
 * Implementação concreta da interface IHotelRepository
 */

import { IHotelRepository } from '@/domain/repositories/IHotelRepository';
import { Hotel, HotelCreateRequest, HotelUpdateRequest } from '@/application/dto/Hotel.dto';
import { HttpClient } from '@/infrastructure/http/HttpClient';

export class HotelRepository implements IHotelRepository {
  private baseUrl = '/Hotels';

  constructor(private httpClient: HttpClient) {}

  async getAll(): Promise<Hotel[]> {
    return this.httpClient.get<Hotel[]>(this.baseUrl);
  }

  async getById(id: string): Promise<Hotel | null> {
    try {
      return await this.httpClient.get<Hotel>(`${this.baseUrl}/${id}`);
    } catch {
      return null;
    }
  }

  async getByCnpj(cnpj: string): Promise<Hotel | null> {
    try {
      return await this.httpClient.get<Hotel>(`${this.baseUrl}/cnpj/${cnpj}`);
    } catch {
      return null;
    }
  }

  async create(data: HotelCreateRequest): Promise<Hotel> {
    return this.httpClient.post<Hotel>(this.baseUrl, data);
  }

  async update(id: string, data: HotelUpdateRequest): Promise<Hotel> {
    return this.httpClient.put<Hotel>(`${this.baseUrl}/${id}`, data);
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

