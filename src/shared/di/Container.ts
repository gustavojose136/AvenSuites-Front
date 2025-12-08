

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
import { IInvoiceRepository } from '@/domain/repositories/IInvoiceRepository';
import { IInvoiceService, InvoiceService } from '@/domain/services/IInvoiceService';

import { AuthRepository } from '@/infrastructure/api/repositories/AuthRepository';
import { HotelRepository } from '@/infrastructure/api/repositories/HotelRepository';
import { RoomRepository } from '@/infrastructure/api/repositories/RoomRepository';
import { BookingRepository } from '@/infrastructure/api/repositories/BookingRepository';
import { GuestRepository } from '@/infrastructure/api/repositories/GuestRepository';
import { InvoiceRepository } from '@/infrastructure/api/repositories/InvoiceRepository';
import { httpClient } from '@/infrastructure/http/HttpClient';

class Container {
  private static instance: Container;

  private authRepository: IAuthRepository;
  private hotelRepository: IHotelRepository;
  private roomRepository: IRoomRepository;
  private bookingRepository: IBookingRepository;
  private guestRepository: IGuestRepository;
  private invoiceRepository: IInvoiceRepository;

  private authService: IAuthService;
  private hotelService: IHotelService;
  private roomService: IRoomService;
  private bookingService: IBookingService;
  private guestService: IGuestService;
  private invoiceService: IInvoiceService;

  private constructor() {

    this.authRepository = new AuthRepository(httpClient);
    this.hotelRepository = new HotelRepository(httpClient);
    this.roomRepository = new RoomRepository(httpClient);
    this.bookingRepository = new BookingRepository(httpClient);
    this.guestRepository = new GuestRepository(httpClient);
    this.invoiceRepository = new InvoiceRepository(httpClient);

    this.authService = new AuthService(this.authRepository);
    this.hotelService = new HotelService(this.hotelRepository);
    this.roomService = new RoomService(this.roomRepository);
    this.bookingService = new BookingService(this.bookingRepository);
    this.guestService = new GuestService(this.guestRepository);
    this.invoiceService = new InvoiceService(this.invoiceRepository);
  }

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  getAuthService(): IAuthService {
    return this.authService;
  }

  getAuthRepository(): IAuthRepository {
    return this.authRepository;
  }

  getHotelService(): IHotelService {
    return this.hotelService;
  }

  getHotelRepository(): IHotelRepository {
    return this.hotelRepository;
  }

  getRoomService(): IRoomService {
    return this.roomService;
  }

  getRoomRepository(): IRoomRepository {
    return this.roomRepository;
  }

  getBookingService(): IBookingService {
    return this.bookingService;
  }

  getBookingRepository(): IBookingRepository {
    return this.bookingRepository;
  }

  getGuestService(): IGuestService {
    return this.guestService;
  }

  getGuestRepository(): IGuestRepository {
    return this.guestRepository;
  }

  getInvoiceService(): IInvoiceService {
    return this.invoiceService;
  }

  getInvoiceRepository(): IInvoiceRepository {
    return this.invoiceRepository;
  }
}

export const container = Container.getInstance();

