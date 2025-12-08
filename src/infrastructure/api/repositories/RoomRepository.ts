

import { IRoomRepository } from '@/domain/repositories/IRoomRepository';
import {
  Room,
  RoomCreateRequest,
  RoomUpdateRequest,
  RoomAvailabilityRequest,
  RoomAvailabilityResponse
} from '@/application/dto/Room.dto';
import { HttpClient } from '@/infrastructure/http/HttpClient';

export class RoomRepository implements IRoomRepository {
  private baseUrl = '/Rooms';

  constructor(private httpClient: HttpClient) {}

  async getAll(): Promise<Room[]> {
    return this.httpClient.get<Room[]>(this.baseUrl);
  }

  async getById(id: string): Promise<Room | null> {
    try {
      return await this.httpClient.get<Room>(`${this.baseUrl}/${id}`);
    } catch {
      return null;
    }
  }

  async getByHotel(hotelId: string, status?: string): Promise<Room[]> {
    const params = status ? `?status=${status}` : '';
    return this.httpClient.get<Room[]>(`${this.baseUrl}/hotels/${hotelId}${params}`);
  }

  async checkAvailability(request: RoomAvailabilityRequest): Promise<RoomAvailabilityResponse[]> {
    const params = new URLSearchParams({
      hotelId: request.hotelId,
      checkInDate: request.checkInDate,
      checkOutDate: request.checkOutDate,
      ...(request.adults && { adults: request.adults.toString() }),
      ...(request.children && { children: request.children.toString() }),
    });
    return this.httpClient.get<RoomAvailabilityResponse[]>(`${this.baseUrl}/availability?${params}`);
  }

  async create(data: RoomCreateRequest): Promise<Room> {
    return this.httpClient.post<Room>(this.baseUrl, data);
  }

  async update(id: string, data: RoomUpdateRequest): Promise<Room> {
    return this.httpClient.put<Room>(`${this.baseUrl}/${id}`, data);
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

