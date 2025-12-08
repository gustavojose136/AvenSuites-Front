import { AuthRepository } from '../AuthRepository';
import { HttpClient } from '@/infrastructure/http/HttpClient';
import { LoginRequest, RegisterRequest, ForgotPasswordRequest, ResetPasswordRequest } from '@/domain/repositories/IAuthRepository';
import { User } from '@/domain/entities/User';

jest.mock('@/infrastructure/http/HttpClient');

describe('AuthRepository', () => {
  let authRepository: AuthRepository;
  let mockHttpClient: jest.Mocked<HttpClient>;

  const mockLoginResponse = {
    token: 'mock-token',
    expiresAt: '2024-12-31T23:59:59Z',
    user: {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
    } as User,
  };

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
  };

  beforeEach(() => {
    mockHttpClient = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<HttpClient>;

    authRepository = new AuthRepository(mockHttpClient);
  });

  describe('login', () => {
    it('deve fazer login com sucesso', async () => {
      const loginData: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockHttpClient.post.mockResolvedValue(mockLoginResponse);

      const result = await authRepository.login(loginData);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/Auth/login', loginData);
      expect(result).toEqual(mockLoginResponse);
    });
  });

  describe('register', () => {
    it('deve registrar usuário com sucesso', async () => {
      const registerData: RegisterRequest = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      mockHttpClient.post.mockResolvedValue(mockUser);

      const result = await authRepository.register(registerData);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/Auth/register', registerData);
      expect(result).toEqual(mockUser);
    });
  });

  describe('validatePassword', () => {
    it('deve retornar true quando senha é válida', async () => {
      const loginData: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockHttpClient.post.mockResolvedValue({});

      const result = await authRepository.validatePassword(loginData);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/Auth/validate', loginData);
      expect(result).toBe(true);
    });

    it('deve retornar false quando senha é inválida', async () => {
      const loginData: LoginRequest = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      mockHttpClient.post.mockRejectedValue(new Error('Invalid password'));

      const result = await authRepository.validatePassword(loginData);

      expect(result).toBe(false);
    });
  });

  describe('forgotPassword', () => {
    it('deve solicitar redefinição de senha com sucesso', async () => {
      const forgotPasswordData: ForgotPasswordRequest = {
        emailOrCpf: 'test@example.com',
      };

      const mockResponse = {
        message: 'Se o email ou CPF estiver cadastrado, você receberá um código de redefinição de senha por e-mail.',
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      const result = await authRepository.forgotPassword(forgotPasswordData);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/Auth/forgot-password', forgotPasswordData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('resetPassword', () => {
    it('deve redefinir senha com sucesso', async () => {
      const resetPasswordData: ResetPasswordRequest = {
        code: '123456',
        newPassword: 'NewPassword123!',
      };

      const mockResponse = {
        message: 'Senha redefinida com sucesso!',
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      const result = await authRepository.resetPassword(resetPasswordData);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/Auth/reset-password', resetPasswordData);
      expect(result).toEqual(mockResponse);
    });
  });
});

