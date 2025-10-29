/**
 * Repository Interface: IHotelRepository
 * Define o contrato para operações de hotéis
 * Princípio: Interface Segregation - Interface específica para hotéis
 */

import { Hotel, HotelCreateRequest, HotelUpdateRequest } from '@/application/dto/Hotel.dto';

export interface IHotelRepository {
  getAll(): Promise<Hotel[]>;
  getById(id: string): Promise<Hotel | null>;
  getByCnpj(cnpj: string): Promise<Hotel | null>;
  create(data: HotelCreateRequest): Promise<Hotel>;
  update(id: string, data: HotelUpdateRequest): Promise<Hotel>;
  delete(id: string): Promise<boolean>;
}

