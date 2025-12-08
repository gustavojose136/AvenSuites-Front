/**
 * Testes: AuthService
 * Testa a lógica de negócio de autenticação
 * SOLID - Dependency Inversion: Testa através de interface mockada
 */

import { AuthService, IAuthService } from '../IAuthService';
import { IAuthRepository, LoginRequest, LoginResponse, RegisterRequest, ForgotPasswordRequest, ResetPasswordRequest } from '../../repositories/IAuthRepository';
import { User } from '../../entities/User';

describe('AuthService', () => {
  let authService: IAuthService;
  let mockRepository: jest.Mocked<IAuthRepository>;

  beforeEach(() => {
    mockRepository = {
      login: jest.fn(),
      register: jest.fn(),
      validatePassword: jest.fn(),
      forgotPassword: jest.fn(),
      resetPassword: jest.fn(),
    } as unknown as jest.Mocked<IAuthRepository>;

    authService = new AuthService(mockRepository);
  });

  describe('login', () => {
    it('deve chamar o repositório com os dados corretos', async () => {
      const loginRequest: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
      };

      const expectedResponse: LoginResponse = {
        token: 'jwt-token',
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
        } as User,
      };

      mockRepository.login.mockResolvedValue(expectedResponse);

      const result = await authService.login(loginRequest);

      expect(mockRepository.login).toHaveBeenCalledWith(loginRequest);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('register', () => {
    it('deve chamar o repositório com os dados corretos', async () => {
      const registerRequest: RegisterRequest = {
        email: 'new@example.com',
        password: 'password123',
        name: 'New User',
      };

      const expectedUser: User = {
        id: '2',
        email: 'new@example.com',
        name: 'New User',
      } as User;

      mockRepository.register.mockResolvedValue(expectedUser);

      const result = await authService.register(registerRequest);

      expect(mockRepository.register).toHaveBeenCalledWith(registerRequest);
      expect(result).toEqual(expectedUser);
    });
  });

  describe('validatePassword', () => {
    it('deve retornar true quando senha é válida', async () => {
      const loginRequest: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockRepository.validatePassword.mockResolvedValue(true);

      const result = await authService.validatePassword(loginRequest);

      expect(mockRepository.validatePassword).toHaveBeenCalledWith(loginRequest);
      expect(result).toBe(true);
    });

    it('deve retornar false quando senha é inválida', async () => {
      const loginRequest: LoginRequest = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      mockRepository.validatePassword.mockResolvedValue(false);

      const result = await authService.validatePassword(loginRequest);

      expect(result).toBe(false);
    });
  });

  describe('logout', () => {
    it('deve executar logout sem erros', async () => {
      await expect(authService.logout()).resolves.not.toThrow();
    });
  });

  describe('forgotPassword', () => {
    it('deve solicitar redefinição de senha com sucesso', async () => {
      const forgotPasswordRequest: ForgotPasswordRequest = {
        emailOrCpf: 'test@example.com',
      };

      const expectedResponse = {
        message: 'Se o email ou CPF estiver cadastrado, você receberá um código de redefinição de senha por e-mail.',
      };

      mockRepository.forgotPassword.mockResolvedValue(expectedResponse);

      const result = await authService.forgotPassword(forgotPasswordRequest);

      expect(mockRepository.forgotPassword).toHaveBeenCalledWith(forgotPasswordRequest);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('resetPassword', () => {
    it('deve redefinir senha com sucesso', async () => {
      const resetPasswordRequest: ResetPasswordRequest = {
        code: '123456',
        newPassword: 'NewPassword123!',
      };

      const expectedResponse = {
        message: 'Senha redefinida com sucesso!',
      };

      mockRepository.resetPassword.mockResolvedValue(expectedResponse);

      const result = await authService.resetPassword(resetPasswordRequest);

      expect(mockRepository.resetPassword).toHaveBeenCalledWith(resetPasswordRequest);
      expect(result).toEqual(expectedResponse);
    });
  });
});

