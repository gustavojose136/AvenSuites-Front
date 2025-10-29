/**
 * Repository Interface: IAuthRepository
 * Define o contrato para operações de autenticação
 * Princípio: Interface Segregation - Interface específica para auth
 * Princípio: Dependency Inversion - Dependência de abstração
 */

import { User } from '../entities/User';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresAt: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role?: string;
}

export interface IAuthRepository {
  login(data: LoginRequest): Promise<LoginResponse>;
  register(data: RegisterRequest): Promise<User>;
  validatePassword(data: LoginRequest): Promise<boolean>;
}

