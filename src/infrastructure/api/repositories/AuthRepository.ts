

import { IAuthRepository, LoginRequest, LoginResponse, RegisterRequest, ForgotPasswordRequest, ForgotPasswordResponse, ResetPasswordRequest, ResetPasswordResponse } from '@/domain/repositories/IAuthRepository';
import { User } from '@/domain/entities/User';
import { HttpClient } from '@/infrastructure/http/HttpClient';

export class AuthRepository implements IAuthRepository {
  private baseUrl = '/Auth';

  constructor(private httpClient: HttpClient) {}

  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await this.httpClient.post<LoginResponse>(`${this.baseUrl}/login`, data);
    return response;
  }

  async register(data: RegisterRequest): Promise<User> {
    const response = await this.httpClient.post<User>(`${this.baseUrl}/register`, data);
    return response;
  }

  async validatePassword(data: LoginRequest): Promise<boolean> {
    try {
      await this.httpClient.post(`${this.baseUrl}/validate`, data);
      return true;
    } catch {
      return false;
    }
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    const response = await this.httpClient.post<ForgotPasswordResponse>(`${this.baseUrl}/forgot-password`, data);
    return response;
  }

  async resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    const response = await this.httpClient.post<ResetPasswordResponse>(`${this.baseUrl}/reset-password`, data);
    return response;
  }
}

