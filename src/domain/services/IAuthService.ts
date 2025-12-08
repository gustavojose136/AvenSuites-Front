

import { IAuthRepository, LoginRequest, LoginResponse, RegisterRequest, ForgotPasswordRequest, ForgotPasswordResponse, ResetPasswordRequest, ResetPasswordResponse } from '../repositories/IAuthRepository';
import { User } from '../entities/User';

export interface IAuthService {
  login(data: LoginRequest): Promise<LoginResponse>;
  register(data: RegisterRequest): Promise<User>;
  validatePassword(data: LoginRequest): Promise<boolean>;
  logout(): Promise<void>;
  forgotPassword(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse>;
  resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse>;
}

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

  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    return this.authRepository.forgotPassword(data);
  }

  async resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    return this.authRepository.resetPassword(data);
  }
}

