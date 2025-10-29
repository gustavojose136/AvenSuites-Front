/**
 * HttpClient
 * Cliente HTTP centralizado com configuração SSL
 * Princípio: Single Responsibility - Responsável apenas por requisições HTTP
 */

import { getSession } from 'next-auth/react';
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
      const session = await getSession();
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
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

