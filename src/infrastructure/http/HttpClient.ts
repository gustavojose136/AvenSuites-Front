/**
 * HttpClient
 * Cliente HTTP centralizado com configuração SSL
 * Princípio: Single Responsibility - Responsável apenas por requisições HTTP
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import https from 'https';

export class HttpClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7000/api',
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para adicionar token de autenticação
    this.client.interceptors.request.use(async (config) => {
      // Verifica se já tem Authorization no header (manual override)
      if (config.headers?.Authorization) {
        return config;
      }

      // Para rotas guest (especialmente /guest/portal), usa APENAS localStorage
      // NÃO usa Next Auth session
      if (typeof window !== 'undefined') {
        const isGuestRoute = window.location.pathname.startsWith('/guest') || config.url?.includes('GuestPortal');
        
        if (isGuestRoute) {
          // Rotas guest usam APENAS localStorage - nunca Next Auth
          const guestToken = localStorage.getItem('guestToken');
          
          if (guestToken) {
            try {
              const payload = JSON.parse(atob(guestToken.split('.')[1]));
              const isGuestToken = payload.role === 'Guest' || payload.GuestId;
              
              console.group(`🔐 HttpClient - Rota Guest (APENAS localStorage)`);
              console.log('📍 Rota: aa', window.location.pathname);
              console.log('🔑 Token do localStorage:', guestToken.substring(0, 30) + '...');
              console.log('📋 Payload:', {
                role: payload.role,
                name: payload.name,
                email: payload.email,
                GuestId: payload.GuestId,
              });
              
              // Validação: token DEVE ser Guest
              if (!isGuestToken) {
                console.error('❌ BLOQUEADO: Token não é Guest!');
                console.error('🧹 Limpando token inválido...');
                localStorage.removeItem('guestToken');
                localStorage.removeItem('guestUser');
                console.groupEnd();
                return config; // Não adiciona header
              }
              
              config.headers.Authorization = `Bearer ${guestToken}`;
              console.log('✅ Header Authorization adicionado (localStorage)');
              console.groupEnd();
            } catch (e) {
              console.error('❌ Erro ao decodificar token:', e);
              config.headers.Authorization = `Bearer ${guestToken}`;
            }
          } else {
            console.warn('⚠️ Nenhum guestToken encontrado no localStorage para rota guest');
          }
        } else {
          // Outras rotas podem usar localStorage ou Next Auth
          const token = localStorage.getItem('authToken') || localStorage.getItem('guestToken');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
      }

      return config;
    });

    // Interceptor para tratamento de erros
    this.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
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

// Singleton instance
export const httpClient = new HttpClient();

