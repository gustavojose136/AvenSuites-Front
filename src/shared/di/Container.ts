/**
 * Dependency Injection Container
 * Gerencia a inversão de dependências
 * Princípio: Dependency Inversion - Dependências de abstrações
 */

import { IAuthRepository } from '@/domain/repositories/IAuthRepository';
import { IAuthService, AuthService } from '@/domain/services/IAuthService';
import { IHotelRepository } from '@/domain/repositories/IHotelRepository';
import { IHotelService, HotelService } from '@/domain/services/IHotelService';
import { IRoomRepository } from '@/domain/repositories/IRoomRepository';
import { IRoomService, RoomService } from '@/domain/services/IRoomService';
import { IBookingRepository } from '@/domain/repositories/IBookingRepository';
import { IBookingService, BookingService } from '@/domain/services/IBookingService';
import { IGuestRepository } from '@/domain/repositories/IGuestRepository';
import { IGuestService, GuestService } from '@/domain/services/IGuestService';

import { AuthRepository } from '@/infrastructure/api/repositories/AuthRepository';
import { HotelRepository } from '@/infrastructure/api/repositories/HotelRepository';
import { RoomRepository } from '@/infrastructure/api/repositories/RoomRepository';
import { BookingRepository } from '@/infrastructure/api/repositories/BookingRepository';
import { GuestRepository } from '@/infrastructure/api/repositories/GuestRepository';
import { httpClient } from '@/infrastructure/http/HttpClient';

class Container {
  private static instance: Container;
  
  // Repositories
  private authRepository: IAuthRepository;
  private hotelRepository: IHotelRepository;
  private roomRepository: IRoomRepository;
  private bookingRepository: IBookingRepository;
  private guestRepository: IGuestRepository;
  
  // Services
  private authService: IAuthService;
  private hotelService: IHotelService;
  private roomService: IRoomService;
  private bookingService: IBookingService;
  private guestService: IGuestService;

  private constructor() {
    // Configuração de repositórios
    this.authRepository = new AuthRepository(httpClient);
    this.hotelRepository = new HotelRepository(httpClient);
    this.roomRepository = new RoomRepository(httpClient);
    this.bookingRepository = new BookingRepository(httpClient);
    this.guestRepository = new GuestRepository(httpClient);
    
    // Configuração de serviços
    this.authService = new AuthService(this.authRepository);
    this.hotelService = new HotelService(this.hotelRepository);
    this.roomService = new RoomService(this.roomRepository);
    this.bookingService = new BookingService(this.bookingRepository);
    this.guestService = new GuestService(this.guestRepository);
  }

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  // Auth
  getAuthService(): IAuthService {
    return this.authService;
  }

  getAuthRepository(): IAuthRepository {
    return this.authRepository;
  }

  // Hotel
  getHotelService(): IHotelService {
    return this.hotelService;
  }

  getHotelRepository(): IHotelRepository {
    return this.hotelRepository;
  }

  // Room
  getRoomService(): IRoomService {
    return this.roomService;
  }

  getRoomRepository(): IRoomRepository {
    return this.roomRepository;
  }

  // Booking
  getBookingService(): IBookingService {
    return this.bookingService;
  }

  getBookingRepository(): IBookingRepository {
    return this.bookingRepository;
  }

  // Guest
  getGuestService(): IGuestService {
    return this.guestService;
  }

  getGuestRepository(): IGuestRepository {
    return this.guestRepository;
  }
}

export const container = Container.getInstance();

