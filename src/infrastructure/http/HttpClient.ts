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
          
          // Debug: verifica se há múltiplos tokens
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
              
              // Validação mais flexível: verifica diferentes formatos de token Guest
              const role = payload.role || payload.Role || payload.roles?.[0];
              const guestId = payload.GuestId || payload.guestId || payload.sub || payload.userId;
              const hasGuestClaim = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === 'Guest';
              
              const isGuestToken = 
                role === 'Guest' || 
                role === 'guest' || 
                role?.toLowerCase() === 'guest' ||
                !!guestId ||
                hasGuestClaim ||
                payload.email || // Se tem email, provavelmente é guest
                (payload.name && !payload.roles); // Guest geralmente não tem array de roles
              
              console.group(`🔐 HttpClient - Rota Guest (APENAS localStorage)`);
              console.log('📍 Rota:', window.location.pathname);
              console.log('🔑 Token do localStorage:', guestToken.substring(0, 30) + '...');
              console.log('📋 Payload completo:', payload);
              console.log('🔍 Validação:', {
                role,
                guestId,
                hasGuestClaim,
                isGuestToken,
              });
              
              // Validação: token DEVE ser Guest
              if (!isGuestToken) {
                console.error('❌ BLOQUEADO: Token não é Guest!');
                console.error('📋 Payload:', payload);
                console.error('🧹 Limpando token inválido...');
                localStorage.removeItem('guestToken');
                localStorage.removeItem('guestUser');
                console.groupEnd();
                return config; // Não adiciona header
              }
              
              config.headers.Authorization = `Bearer ${guestToken}`;
              
              // Log detalhado do token e guestId (para debug)
              console.log('🔑 Token completo (primeiros 50 chars):', guestToken.substring(0, 50) + '...');
              if (guestId) {
                console.log('👤 GuestId extraído do token:', guestId);
                console.log('📋 Payload completo do token:', payload);
              } else {
                console.warn('⚠️ GuestId não encontrado no token!');
                console.warn('📋 Payload completo:', payload);
              }
              
              console.log('✅ Header Authorization adicionado (localStorage)');
              console.log('📤 URL da requisição:', config.url);
              console.log('📤 Método:', config.method);
              console.groupEnd();
            } catch (e) {
              console.error('❌ Erro ao decodificar token:', e);
              // Em caso de erro ao decodificar, ainda tenta usar o token
              // (pode ser um formato diferente ou token válido mas com estrutura diferente)
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

