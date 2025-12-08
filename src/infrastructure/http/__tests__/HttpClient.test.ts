import { HttpClient } from '../HttpClient';
import axios from 'axios';
import { getSession } from 'next-auth/react';

jest.mock('axios');
jest.mock('next-auth/react');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedGetSession = getSession as jest.MockedFunction<typeof getSession>;

describe('HttpClient', () => {
  let httpClient: HttpClient;
  let mockAxiosInstance: any;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();

    mockAxiosInstance = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      interceptors: {
        request: {
          use: jest.fn(),
        },
        response: {
          use: jest.fn(),
        },
      },
    };

    mockedAxios.create.mockReturnValue(mockAxiosInstance as any);

    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/dashboard',
        href: '',
      },
      writable: true,
    });

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });

    httpClient = new HttpClient();
  });

  describe('get', () => {
    it('deve fazer requisição GET', async () => {
      const mockData = { id: '1', name: 'Test' };
      mockAxiosInstance.get.mockResolvedValue({ data: mockData });

      const result = await httpClient.get('/test');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test', undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('post', () => {
    it('deve fazer requisição POST', async () => {
      const mockData = { id: '1', name: 'Test' };
      const postData = { name: 'Test' };
      mockAxiosInstance.post.mockResolvedValue({ data: mockData });

      const result = await httpClient.post('/test', postData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/test', postData, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('put', () => {
    it('deve fazer requisição PUT', async () => {
      const mockData = { id: '1', name: 'Updated' };
      const putData = { name: 'Updated' };
      mockAxiosInstance.put.mockResolvedValue({ data: mockData });

      const result = await httpClient.put('/test/1', putData);

      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/test/1', putData, undefined);
      expect(result).toEqual(mockData);
    });
  });

  describe('delete', () => {
    it('deve fazer requisição DELETE', async () => {
      mockAxiosInstance.delete.mockResolvedValue({ data: {} });

      const result = await httpClient.delete('/test/1');

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/test/1', undefined);
      expect(result).toEqual({});
    });
  });

  describe('request interceptor', () => {
    it('deve adicionar token de autenticação para rotas não-guest', async () => {
      const mockConfig = { headers: {} };
      const mockSession = { accessToken: 'session-token' };
      mockedGetSession.mockResolvedValue(mockSession as any);

      Object.defineProperty(window, 'location', {
        value: { pathname: '/dashboard' },
        writable: true,
      });

      const interceptor = mockAxiosInstance.interceptors.request.use.mock.calls[0][0];
      const result = await interceptor(mockConfig);

      expect(result.headers.Authorization).toBe('Bearer session-token');
    });

    it('deve usar localStorage token como fallback', async () => {
      const mockConfig = { headers: {} };
      mockedGetSession.mockResolvedValue(null);
      (window.localStorage.getItem as jest.Mock).mockReturnValue('local-token');

      Object.defineProperty(window, 'location', {
        value: { pathname: '/dashboard' },
        writable: true,
      });

      const interceptor = mockAxiosInstance.interceptors.request.use.mock.calls[0][0];
      const result = await interceptor(mockConfig);

      expect(result.headers.Authorization).toBe('Bearer local-token');
    });

    it('não deve adicionar token para página de registro', async () => {
      const mockConfig = { headers: {} };

      Object.defineProperty(window, 'location', {
        value: { pathname: '/guest/register' },
        writable: true,
      });

      const interceptor = mockAxiosInstance.interceptors.request.use.mock.calls[0][0];
      const result = await interceptor(mockConfig);

      expect(result.headers.Authorization).toBeUndefined();
    });
  });

  describe('response interceptor', () => {
    it('deve retornar data da resposta', () => {
      const mockResponse = { data: { id: '1' } };
      const interceptor = mockAxiosInstance.interceptors.response.use.mock.calls[0][0];

      const result = interceptor(mockResponse);

      expect(result).toEqual({ id: '1' });
    });

    it('não deve redirecionar em 401 para página de registro', () => {
      const mockError = {
        response: { status: 401 },
      };

      Object.defineProperty(window, 'location', {
        value: { pathname: '/guest/register', href: '' },
        writable: true,
      });

      const errorInterceptor = mockAxiosInstance.interceptors.response.use.mock.calls[0][1];
      
      expect(() => errorInterceptor(mockError)).toThrow();
      expect(window.location.href).toBe('');
    });

    it('deve redirecionar para /signin em 401 para rotas não-guest', () => {
      const mockError = {
        response: { status: 401 },
      };

      Object.defineProperty(window, 'location', {
        value: { pathname: '/dashboard', href: '' },
        writable: true,
      });

      (window.localStorage.removeItem as jest.Mock).mockClear();

      const errorInterceptor = mockAxiosInstance.interceptors.response.use.mock.calls[0][1];
      
      expect(() => errorInterceptor(mockError)).toThrow();
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('authToken');
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('guestToken');
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('guestUser');
      expect(window.location.href).toBe('/signin');
    });

    it('deve redirecionar para /guest/login em 401 para rotas guest', () => {
      const mockError = {
        response: { status: 401 },
      };

      Object.defineProperty(window, 'location', {
        value: { pathname: '/guest/portal', href: '' },
        writable: true,
      });

      (window.localStorage.removeItem as jest.Mock).mockClear();

      const errorInterceptor = mockAxiosInstance.interceptors.response.use.mock.calls[0][1];
      
      expect(() => errorInterceptor(mockError)).toThrow();
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('guestToken');
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('guestUser');
      expect(window.location.href).toBe('/guest/login');
    });

    it('não deve redirecionar se já estiver na página de login', () => {
      const mockError = {
        response: { status: 401 },
      };

      Object.defineProperty(window, 'location', {
        value: { pathname: '/guest/login', href: '' },
        writable: true,
      });

      const errorInterceptor = mockAxiosInstance.interceptors.response.use.mock.calls[0][1];
      
      expect(() => errorInterceptor(mockError)).toThrow();
      expect(window.location.href).toBe('');
    });
  });

  describe('request interceptor - guest routes', () => {
    it('deve adicionar guestToken para rotas guest', async () => {
      const mockConfig = { headers: {} };
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiR3Vlc3QifQ.test';
      (window.localStorage.getItem as jest.Mock).mockReturnValue(mockToken);

      Object.defineProperty(window, 'location', {
        value: { pathname: '/guest/portal' },
        writable: true,
      });

      const interceptor = mockAxiosInstance.interceptors.request.use.mock.calls[0][0];
      const result = await interceptor(mockConfig);

      expect(result.headers.Authorization).toBe(`Bearer ${mockToken}`);
    });

    it('deve limpar authToken quando diferente de guestToken', async () => {
      const mockConfig = { headers: {} };
      const guestToken = 'guest-token';
      const authToken = 'auth-token';
      (window.localStorage.getItem as jest.Mock)
        .mockReturnValueOnce(guestToken)
        .mockReturnValueOnce(authToken);

      Object.defineProperty(window, 'location', {
        value: { pathname: '/guest/portal' },
        writable: true,
      });

      const interceptor = mockAxiosInstance.interceptors.request.use.mock.calls[0][0];
      await interceptor(mockConfig);

      expect(window.localStorage.removeItem).toHaveBeenCalledWith('authToken');
    });

    it('deve rejeitar token não-guest em rotas guest', async () => {
      const mockConfig = { headers: {} };
      const nonGuestToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiQWRtaW4ifQ.test';
      (window.localStorage.getItem as jest.Mock).mockReturnValue(nonGuestToken);

      Object.defineProperty(window, 'location', {
        value: { pathname: '/guest/portal' },
        writable: true,
      });

      const interceptor = mockAxiosInstance.interceptors.request.use.mock.calls[0][0];
      const result = await interceptor(mockConfig);

      expect(result.headers.Authorization).toBeUndefined();
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('guestToken');
    });
  });
});

