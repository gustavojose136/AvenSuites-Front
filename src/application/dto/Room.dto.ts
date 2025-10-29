/**
 * DTO: Room
 * Data Transfer Object para Quartos
 */

export interface Room {
  id: string;
  hotelId: string;
  roomTypeId: string;
  roomNumber: string;
  floor?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  roomType?: RoomTypeSummary;
}

export interface RoomTypeSummary {
  id: string;
  code: string;
  name: string;
  description?: string;
  capacityAdults: number;
  capacityChildren: number;
  basePrice: number;
  active: boolean;
}

export interface RoomCreateRequest {
  hotelId: string;
  roomTypeId: string;
  roomNumber: string;
  floor?: string;
  status?: string;
}

export interface RoomUpdateRequest {
  roomTypeId?: string;
  roomNumber?: string;
  floor?: string;
  status?: string;
}

export interface RoomAvailabilityRequest {
  hotelId: string;
  checkInDate: string;
  checkOutDate: string;
  adults?: number;
  children?: number;
}

export interface RoomAvailabilityResponse {
  roomId: string;
  roomNumber: string;
  roomType: RoomTypeSummary;
  available: boolean;
  price: number;
}

