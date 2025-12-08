'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NotFoundPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-dark dark:to-dark-2 flex items-center justify-center py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          {}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-indigo-500/20 mb-6">
              <svg
                className="w-20 h-20 text-primary dark:text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          {}
          <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600 mb-4">
            404
          </h1>

          {}
          <h2 className="text-2xl md:text-3xl font-bold text-dark dark:text-white mb-4">
            Página não encontrada
          </h2>

          {}
          <p className="text-lg text-body-color dark:text-dark-6 mb-8">
            Não foi possível encontrar a página solicitada, e estaremos te redirecionando para a tela inicial do sistema em{' '}
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-primary to-indigo-600 text-white font-bold text-xl mx-2">
              {countdown}
            </span>
            {countdown === 1 ? ' segundo' : ' segundos'}
          </p>

          {}
          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-dark-3">
              <div
                className="bg-gradient-to-r from-primary to-indigo-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${((5 - countdown) / 5) * 100}%` }}
              ></div>
            </div>
          </div>

          {}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 text-base font-semibold text-white shadow-lg transition hover:shadow-xl hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Ir para o Início
            </Link>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-8 py-3 text-base font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-dark-3 dark:bg-dark-2 dark:text-gray-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Voltar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
