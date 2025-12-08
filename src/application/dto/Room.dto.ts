

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

export interface RoomTypeOccupancyPrice {
  id: string;
  occupancy: number;
  pricePerNight: number;
}

export interface RoomTypeSummary {
  id: string;
  code: string;
  name: string;
  description?: string;
  capacityAdults: number;
  capacityChildren: number;
  basePrice: number;
  occupancyPrices?: RoomTypeOccupancyPrice[];
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

