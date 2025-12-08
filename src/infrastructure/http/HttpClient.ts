import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import https from 'https';
import { getSession } from 'next-auth/react';

export class HttpClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api-avensuits.azurewebsites.net/api',
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use(async (config) => {
      if (config.headers?.Authorization) {
        return config;
      }

      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        const isGuestRoute = currentPath.startsWith('/guest') || config.url?.includes('GuestPortal');
        const isRegisterPage = currentPath === '/guest/register';
        
        if (isGuestRoute && !isRegisterPage) {
          const guestToken = localStorage.getItem('guestToken');

          const authToken = localStorage.getItem('authToken');
          if (authToken && authToken !== guestToken) {
            console.warn('⚠️ ATENÇÃO: Há um authToken diferente do guestToken no localStorage!');
            console.warn('🔑 authToken:', authToken.substring(0, 30) + '...');
            console.warn('🔑 guestToken:', guestToken?.substring(0, 30) + '...');
            console.warn('🧹 Removendo authToken para evitar conflito...');
            localStorage.removeItem('authToken');
          }

          if (guestToken) {
            try {
              const payload = JSON.parse(atob(guestToken.split('.')[1]));

              const role = payload.role || payload.Role || payload.roles?.[0];
              const guestId = payload.GuestId || payload.guestId || payload.sub || payload.userId;
              const hasGuestClaim = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === 'Guest';

              const isGuestToken =
                role === 'Guest' ||
                role === 'guest' ||
                role?.toLowerCase() === 'guest' ||
                !!guestId ||
                hasGuestClaim ||
                payload.email ||
                (payload.name && !payload.roles);

              if (!isGuestToken) {
                console.error('❌ BLOQUEADO: Token não é Guest!');
                console.error('📋 Payload:', payload);
                console.error('🧹 Limpando token inválido...');
                localStorage.removeItem('guestToken');
                localStorage.removeItem('guestUser');
                return config;
              }

              config.headers.Authorization = `Bearer ${guestToken}`;
            } catch (e) {
              console.error('❌ Erro ao decodificar token:', e);
              config.headers.Authorization = `Bearer ${guestToken}`;
            }
          } else {
            console.warn('⚠️ Nenhum guestToken encontrado no localStorage para rota guest');
          }
        } else {
          try {
            const session = await getSession();
            if (session?.accessToken) {
              config.headers.Authorization = `Bearer ${session.accessToken}`;
            } else {
              const token = localStorage.getItem('authToken');
              if (token) {
                config.headers.Authorization = `Bearer ${token}`;
              }
            }
          } catch (error) {
            const token = localStorage.getItem('authToken');
            if (token) {
              config.headers.Authorization = `Bearer ${token}`;
            }
          }
        }
      }

      return config;
    });

    this.client.interceptors.response.use(
      (response) => response.data,
      async (error) => {
        if (error.response?.status === 401) {
          if (typeof window !== 'undefined') {
            const currentPath = window.location.pathname;
            const isGuestRoute = currentPath.startsWith('/guest');
            const isRegisterPage = currentPath === '/guest/register';
            const isLoginPage = currentPath === '/guest/login';

            if (!isGuestRoute) {
              localStorage.removeItem('authToken');
              localStorage.removeItem('guestToken');
              localStorage.removeItem('guestUser');

              if (!currentPath.includes('/signin')) {
                window.location.href = '/signin';
              }
            } else if (!isRegisterPage && !isLoginPage) {
              localStorage.removeItem('guestToken');
              localStorage.removeItem('guestUser');

              if (!isLoginPage) {
                window.location.href = '/guest/login';
              }
            }
          }
        }

        throw error;
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.get(url, config) as any;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.client.post(url, data, config) as any;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.client.put(url, data, config) as any;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.delete(url, config) as any;
  }
}

export const httpClient = new HttpClient();

