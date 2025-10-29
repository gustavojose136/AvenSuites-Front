/**
 * Repository Implementation: AuthRepository
 * Implementação concreta da interface IAuthRepository
 * Princípio: Liskov Substitution - Implementa a interface sem quebrar o contrato
 * Princípio: Dependency Inversion - Implementa abstração do domínio
 */

import { IAuthRepository, LoginRequest, LoginResponse, RegisterRequest } from '@/domain/repositories/IAuthRepository';
import { User } from '@/domain/entities/User';
import { HttpClient } from '@/infrastructure/http/HttpClient';

export class AuthRepository implements IAuthRepository {
  private baseUrl = '/api/Auth';

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
}

