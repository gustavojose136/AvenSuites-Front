/**
 * Service Interface: IAuthService
 * Define a lógica de negócio de autenticação
 * Princípio: Open/Closed - Aberto para extensão
 */

import { IAuthRepository, LoginRequest, LoginResponse, RegisterRequest } from '../repositories/IAuthRepository';
import { User } from '../entities/User';

export interface IAuthService {
  login(data: LoginRequest): Promise<LoginResponse>;
  register(data: RegisterRequest): Promise<User>;
  validatePassword(data: LoginRequest): Promise<boolean>;
  logout(): Promise<void>;
}

/**
 * Implementação do serviço de autenticação
 * Princípio: Liskov Substitution - Pode ser substituído por qualquer implementação
 */
export class AuthService implements IAuthService {
  constructor(private authRepository: IAuthRepository) {}

  async login(data: LoginRequest): Promise<LoginResponse> {
    return this.authRepository.login(data);
  }

  async register(data: RegisterRequest): Promise<User> {
    return this.authRepository.register(data);
  }

  async validatePassword(data: LoginRequest): Promise<boolean> {
    return this.authRepository.validatePassword(data);
  }

  async logout(): Promise<void> {
    // Lógica de logout
  }
}

