'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { httpClient } from '@/infrastructure/http/HttpClient';
import { AuthHelper } from '@/shared/utils/authHelper';
import toast from 'react-hot-toast';
import Link from 'next/link';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const hotelId = searchParams.get('hotelId') || '';
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guests = searchParams.get('guests') || '2';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Preencha todos os campos');
      return;
    }

    try {
      setLoading(true);
      console.log('🔐 Fazendo login como Guest...');

      // IMPORTANTE: Limpa TODOS os tokens anteriores antes de fazer login Guest
      if (typeof window !== 'undefined') {
        console.log('🧹 Limpando TODOS os tokens anteriores...');
        localStorage.removeItem('guestToken');
        localStorage.removeItem('guestUser');
        localStorage.removeItem('authToken'); // Limpa token Admin também
        // Limpa qualquer cookie de sessão do NextAuth
        document.cookie.split(";").forEach((c) => {
          if (c.trim().startsWith('next-auth')) {
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
          }
        });
      }

      const response = await httpClient.post<any>('/Auth/login', {
        email,
        password,
      });

      console.log('✅ Resposta completa do login:', response);
      console.log('📦 Tipo da resposta:', typeof response);
      console.log('📦 Estrutura da resposta:', Object.keys(response || {}));
      
      // Verifica se a resposta tem token (pode estar em response.data ou diretamente)
      const token = response?.token || response?.data?.token;
      const user = response?.user || response?.data?.user;
      
      console.log('🔑 Token encontrado?', !!token);
      console.log('👤 User encontrado?', !!user);
      
      if (!token) {
        console.error('❌ Token não encontrado na resposta:', response);
        toast.error('Erro: Token não recebido do servidor. Verifique as credenciais.');
        return;
      }
      
      // Salva o token Guest usando o helper
      console.log('💾 Salvando token Guest no localStorage...');
      AuthHelper.saveGuestSession(token, user || { email, name: email });
      
      // Verifica se o token foi salvo corretamente
      const savedToken = localStorage.getItem('guestToken');
      if (savedToken !== token) {
        console.error('❌ ERRO: Token salvo é diferente do token recebido!');
        console.error('Token recebido:', token.substring(0, 50));
        console.error('Token salvo:', savedToken?.substring(0, 50));
        // Força a salvar o token correto
        localStorage.setItem('guestToken', token);
      }
      
      // Debug: mostra o payload do token Guest
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const guestId = payload.GuestId || payload.guestId || payload.sub || payload.userId || payload.id;
        console.log('📋 Token Guest decodificado (COMPLETO):', {
          role: payload.role,
          GuestId: guestId,
          HotelId: payload.HotelId,
          name: payload.name,
          email: payload.email,
          fullPayload: payload,
        });
        
        // Verifica se o guestId está presente
        if (!guestId) {
          console.error('⚠️ ATENÇÃO: GuestId não encontrado no token!');
          console.error('📋 Payload completo:', payload);
        } else {
          console.log('✅ GuestId encontrado no token:', guestId);
        }
      } catch (e) {
        console.error('⚠️ Erro ao decodificar token Guest:', e);
      }
      
      AuthHelper.debugSession();
      
      // Verifica novamente após salvar
      const finalToken = localStorage.getItem('guestToken');
      console.log('🔍 Verificação final - Token no localStorage:', finalToken ? '✅ Presente' : '❌ Ausente');
      if (finalToken) {
        try {
          const finalPayload = JSON.parse(atob(finalToken.split('.')[1]));
          console.log('🔍 Verificação final - GuestId no token:', finalPayload.GuestId || finalPayload.guestId || finalPayload.sub || finalPayload.userId || finalPayload.id);
        } catch (e) {
          console.error('❌ Erro ao verificar token final:', e);
        }
      }
      
      toast.success('Login realizado com sucesso!');

      // Pequeno delay para garantir que o token foi salvo
      await new Promise(resolve => setTimeout(resolve, 100));

      // Redireciona
      if (hotelId && checkIn && checkOut) {
        router.push(`/guest/booking?hotelId=${hotelId}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
      } else {
        router.push('/guest/portal');
      }
    } catch (error: any) {
      console.error('❌ Erro completo ao fazer login:', error);
      console.error('❌ Stack trace:', error.stack);
      console.error('❌ Response data:', error.response?.data);
      console.error('❌ Response status:', error.response?.status);
      
      // Tenta extrair mensagem de erro de diferentes formatos
      let message = 'Email ou senha inválidos';
      
      if (error.response?.data) {
        message = error.response.data.message || 
                  error.response.data.title || 
                  error.response.data.error ||
                  JSON.stringify(error.response.data);
      } else if (error.message) {
        message = error.message;
      }
      
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-dark dark:via-dark-2 dark:to-dark py-20 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-black text-dark dark:text-white">
            Bem-vindo de <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Volta</span>
          </h1>
          <p className="text-lg text-body-color dark:text-dark-6">
            Entre com sua conta para continuar
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-8 shadow-xl dark:bg-dark-2">
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                E-mail
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <svg className="h-5 w-5 text-body-color dark:text-dark-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border-2 border-stroke bg-transparent pl-12 pr-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:text-white"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Senha
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <svg className="h-5 w-5 text-body-color dark:text-dark-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border-2 border-stroke bg-transparent pl-12 pr-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:text-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-primary to-blue-600 px-6 py-4 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Entrando...
                </span>
              ) : (
                'Entrar'
              )}
            </button>

            <div className="text-center">
              <p className="text-sm text-body-color dark:text-dark-6">
                Não tem uma conta?{' '}
                <Link
                  href={`/guest/register?hotelId=${hotelId}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`}
                  className="font-semibold text-primary hover:underline"
                >
                  Cadastre-se
                </Link>
              </p>
            </div>
          </div>
        </form>

        {/* Link de Volta */}
        <div className="mt-8 text-center">
          <Link
            href="/guest/search"
            className="inline-flex items-center gap-2 text-body-color transition-colors hover:text-primary dark:text-dark-6 dark:hover:text-primary"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar para busca
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-body-color dark:text-dark-6">Carregando...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}

