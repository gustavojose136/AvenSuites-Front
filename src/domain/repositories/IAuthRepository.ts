

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

export interface ForgotPasswordRequest {
  emailOrCpf: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordRequest {
  code: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface IAuthRepository {
  login(data: LoginRequest): Promise<LoginResponse>;
  register(data: RegisterRequest): Promise<User>;
  validatePassword(data: LoginRequest): Promise<boolean>;
  forgotPassword(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse>;
  resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse>;
}

