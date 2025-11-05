'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { httpClient } from '@/infrastructure/http/HttpClient';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  documentType: string;
  document: string;
  birthDate: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  neighborhood?: string;
  state: string;
  postalCode: string;
  countryCode: string;
  marketingConsent: boolean;
}

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [hotelName, setHotelName] = useState('');
  
  const hotelId = searchParams.get('hotelId') || '';
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guests = searchParams.get('guests') || '2';

  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    documentType: 'CPF',
    document: '',
    birthDate: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    neighborhood: '',
    state: '',
    postalCode: '',
    countryCode: 'BR',
    marketingConsent: false,
  });

  useEffect(() => {
    if (hotelId) {
      fetchHotelName(hotelId);
    }
  }, [hotelId]);

  const fetchHotelName = async (id: string) => {
    try {
      const hotel = await httpClient.get<any>(`/Hotels/${id}`);
      setHotelName(hotel.name);
    } catch (error) {
      console.error('Erro ao buscar hotel:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações
    if (formData.password !== formData.confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    try {
      setLoading(true);
      console.log('📝 Registrando novo hóspede...');

      // Prepara dados para API
      const registerData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        documentType: formData.documentType,
        document: formData.document,
        birthDate: formData.birthDate,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        neighborhood: formData.neighborhood,
        state: formData.state,
        postalCode: formData.postalCode,
        countryCode: formData.countryCode,
        marketingConsent: formData.marketingConsent,
        hotelId: hotelId,
      };

      console.log('📤 Dados do registro:', registerData);

      const response = await httpClient.post<any>('/Auth/register-guest', registerData);
      console.log('✅ Registro bem-sucedido:', response);

      toast.success('Cadastro realizado com sucesso!');

      // Salva o token
      if (response.token) {
        localStorage.setItem('guestToken', response.token);
        localStorage.setItem('guestUser', JSON.stringify(response.user));
      }

      // Redireciona para o portal ou para criar reserva
      if (checkIn && checkOut) {
        router.push(`/guest/booking?hotelId=${hotelId}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
      } else {
        router.push('/guest/portal');
      }
    } catch (error: any) {
      console.error('❌ Erro ao registrar:', error);
      const message = error.response?.data?.message || error.message || 'Erro ao realizar cadastro';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diff = checkOutDate.getTime() - checkInDate.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-dark dark:via-dark-2 dark:to-dark py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-black text-dark dark:text-white">
              Complete seu <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Cadastro</span>
            </h1>
            <p className="text-lg text-body-color dark:text-dark-6">
              Preencha seus dados para finalizar a reserva
            </p>
          </div>

          {/* Resumo da Reserva */}
          {hotelName && checkIn && checkOut && (
            <div className="mb-8 rounded-2xl border-2 border-primary/20 bg-gradient-to-r from-primary/10 to-blue-600/10 p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="mb-2 text-xl font-bold text-dark dark:text-white">
                    {hotelName}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-sm text-body-color dark:text-dark-6">
                    <span className="flex items-center gap-1">
                      <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Check-in: {new Date(checkIn).toLocaleDateString('pt-BR')}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Check-out: {new Date(checkOut).toLocaleDateString('pt-BR')}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {guests} {Number(guests) === 1 ? 'pessoa' : 'pessoas'}
                    </span>
                  </div>
                </div>
                <div className="rounded-lg bg-white px-4 py-2 dark:bg-dark-2">
                  <p className="text-xs text-body-color dark:text-dark-6">Total</p>
                  <p className="text-2xl font-bold text-primary">
                    {calculateNights()} {calculateNights() === 1 ? 'noite' : 'noites'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-8 shadow-xl dark:bg-dark-2">
            <div className="space-y-6">
              {/* Dados Pessoais */}
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-dark dark:text-white">
                  <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Dados Pessoais
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      maxLength={100}
                      className="w-full rounded-lg border-2 border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:text-white"
                      placeholder="João Silva Santos"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                      Data de Nascimento *
                    </label>
                    <input
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border-2 border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                      Tipo de Documento *
                    </label>
                    <select
                      name="documentType"
                      value={formData.documentType}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border-2 border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:text-white"
                    >
                      <option value="CPF">CPF</option>
                      <option value="RG">RG</option>
                      <option value="CNH">CNH</option>
                      <option value="Passport">Passaporte</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                      Número do Documento *
                    </label>
                    <input
                      type="text"
                      name="document"
                      value={formData.document}
                      onChange={handleChange}
                      required
                      maxLength={20}
                      className="w-full rounded-lg border-2 border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:text-white"
                      placeholder="000.000.000-00"
                    />
                  </div>
                </div>
              </div>

              {/* Contato */}
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-dark dark:text-white">
                  <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contato
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      maxLength={100}
                      className="w-full rounded-lg border-2 border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:text-white"
                      placeholder="seu@email.com"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border-2 border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:text-white"
                      placeholder="+55 11 99999-9999"
                    />
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-dark dark:text-white">
                  <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Endereço
                </h3>
                <div className="grid gap-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                        Logradouro *
                      </label>
                      <input
                        type="text"
                        name="addressLine1"
                        value={formData.addressLine1}
                        onChange={handleChange}
                        required
                        maxLength={200}
                        className="w-full rounded-lg border-2 border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:text-white"
                        placeholder="Rua Exemplo, 123"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                        Complemento
                      </label>
                      <input
                        type="text"
                        name="addressLine2"
                        value={formData.addressLine2}
                        onChange={handleChange}
                        maxLength={200}
                        className="w-full rounded-lg border-2 border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:text-white"
                        placeholder="Apto 45"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                        Bairro
                      </label>
                      <input
                        type="text"
                        name="neighborhood"
                        value={formData.neighborhood}
                        onChange={handleChange}
                        maxLength={100}
                        className="w-full rounded-lg border-2 border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:text-white"
                        placeholder="Centro"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                        Cidade *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        maxLength={100}
                        className="w-full rounded-lg border-2 border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:text-white"
                        placeholder="São Paulo"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                        Estado *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        maxLength={2}
                        className="w-full rounded-lg border-2 border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:text-white"
                        placeholder="SP"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                        CEP *
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        required
                        maxLength={10}
                        className="w-full rounded-lg border-2 border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:text-white"
                        placeholder="01234-567"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Senha */}
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-dark dark:text-white">
                  <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Segurança
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                      Senha *
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                      className="w-full rounded-lg border-2 border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:text-white"
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                      Confirmar Senha *
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      minLength={6}
                      className="w-full rounded-lg border-2 border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:text-white"
                      placeholder="Digite a senha novamente"
                    />
                  </div>
                </div>
              </div>

              {/* Consentimento */}
              <div className="rounded-lg border-2 border-stroke bg-gray-50 p-4 dark:border-dark-3 dark:bg-dark-3">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    name="marketingConsent"
                    checked={formData.marketingConsent}
                    onChange={handleChange}
                    className="mt-1 h-5 w-5 rounded border-stroke text-primary focus:ring-2 focus:ring-primary dark:border-dark-3"
                  />
                  <span className="text-sm text-dark dark:text-white">
                    Aceito receber comunicações de marketing, ofertas especiais e novidades.
                  </span>
                </label>
              </div>

              {/* Botões */}
              <div className="flex gap-4">
                <Link
                  href="/guest/search"
                  className="flex-1 rounded-xl border-2 border-stroke px-6 py-4 text-center font-bold text-body-color transition-all hover:border-primary hover:text-primary dark:border-dark-3 dark:text-dark-6"
                >
                  Voltar
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-xl bg-gradient-to-r from-primary to-blue-600 px-6 py-4 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Processando...
                    </span>
                  ) : (
                    'Criar Conta e Continuar'
                  )}
                </button>
              </div>

              {/* Link para Login */}
              <div className="text-center">
                <p className="text-sm text-body-color dark:text-dark-6">
                  Já tem uma conta?{' '}
                  <Link
                    href={`/guest/login?hotelId=${hotelId}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`}
                    className="font-semibold text-primary hover:underline"
                  >
                    Fazer Login
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-body-color dark:text-dark-6">Carregando...</p>
        </div>
      </div>
    }>
      <RegisterContent />
    </Suspense>
  );
}

