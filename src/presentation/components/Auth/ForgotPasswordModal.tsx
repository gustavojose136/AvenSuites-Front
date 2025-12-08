'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, resetPasswordSchema, ForgotPasswordFormData, ResetPasswordFormData } from '@/shared/validators/passwordResetSchema';
import { container } from '@/shared/di/Container';
import toast from 'react-hot-toast';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [emailOrCpf, setEmailOrCpf] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const authService = container.getAuthService();

  const forgotPasswordForm = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      emailOrCpf: '',
    },
  });

  const resetPasswordForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      code: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const handleRequestCode = async (data: ForgotPasswordFormData) => {
    try {
      setLoading(true);
      await authService.forgotPassword({ emailOrCpf: data.emailOrCpf });
      setEmailOrCpf(data.emailOrCpf);
      setStep('reset');
      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      toast.success('Se o e-mail ou CPF estiver cadastrado, você receberá um código por e-mail.');
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Erro ao solicitar código';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0 || !emailOrCpf) return;

    try {
      setLoading(true);
      await authService.forgotPassword({ emailOrCpf });
      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      toast.success('Código reenviado com sucesso!');
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Erro ao reenviar código';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (data: ResetPasswordFormData) => {
    try {
      setLoading(true);
      await authService.resetPassword({
        code: data.code,
        newPassword: data.newPassword,
      });
      toast.success('Senha redefinida com sucesso!');
      onClose();
      setStep('request');
      forgotPasswordForm.reset();
      resetPasswordForm.reset();
      setEmailOrCpf('');
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Erro ao redefinir senha';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setStep('request');
    forgotPasswordForm.reset();
    resetPasswordForm.reset();
    setEmailOrCpf('');
    setResendCooldown(0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl dark:bg-dark-2">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-body-color transition-colors hover:text-primary dark:text-dark-6 dark:hover:text-primary"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {step === 'request' ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-dark dark:text-white">Recuperar Senha</h2>
              <p className="mt-2 text-sm text-body-color dark:text-dark-6">
                Digite seu e-mail ou CPF para receber um código de redefinição
              </p>
            </div>

            <form onSubmit={forgotPasswordForm.handleSubmit(handleRequestCode)} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  E-mail ou CPF
                </label>
                <input
                  type="text"
                  {...forgotPasswordForm.register('emailOrCpf')}
                  className="w-full rounded-lg border-2 border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:text-white"
                  placeholder="seu@email.com ou 123.456.789-00"
                />
                {forgotPasswordForm.formState.errors.emailOrCpf && (
                  <p className="mt-1 text-sm text-red-500">
                    {forgotPasswordForm.formState.errors.emailOrCpf.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Enviando...
                  </span>
                ) : (
                  'Enviar Código'
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-dark dark:text-white">Redefinir Senha</h2>
              <p className="mt-2 text-sm text-body-color dark:text-dark-6">
                Digite o código recebido por e-mail e sua nova senha
              </p>
            </div>

            <form onSubmit={resetPasswordForm.handleSubmit(handleResetPassword)} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Código (6 dígitos)
                </label>
                <input
                  type="text"
                  maxLength={10}
                  {...resetPasswordForm.register('code')}
                  className="w-full rounded-lg border-2 border-stroke bg-transparent px-4 py-3 text-center text-2xl font-bold tracking-widest text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:text-white"
                  placeholder="000000"
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    resetPasswordForm.setValue('code', value);
                  }}
                />
                {resetPasswordForm.formState.errors.code && (
                  <p className="mt-1 text-sm text-red-500">
                    {resetPasswordForm.formState.errors.code.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Nova Senha
                </label>
                <input
                  type="password"
                  {...resetPasswordForm.register('newPassword')}
                  className="w-full rounded-lg border-2 border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:text-white"
                  placeholder="Mínimo 6 caracteres"
                />
                {resetPasswordForm.formState.errors.newPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {resetPasswordForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Confirmar Senha
                </label>
                <input
                  type="password"
                  {...resetPasswordForm.register('confirmPassword')}
                  className="w-full rounded-lg border-2 border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:text-white"
                  placeholder="Digite a senha novamente"
                />
                {resetPasswordForm.formState.errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {resetPasswordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setStep('request');
                    resetPasswordForm.reset();
                  }}
                  className="flex-1 rounded-lg border-2 border-stroke bg-transparent px-6 py-3 font-semibold text-dark transition hover:border-primary hover:text-primary dark:border-dark-3 dark:text-white"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Redefinindo...
                    </span>
                  ) : (
                    'Redefinir Senha'
                  )}
                </button>
              </div>

              {resendCooldown > 0 ? (
                <p className="text-center text-sm text-body-color dark:text-dark-6">
                  Reenviar código em {resendCooldown}s
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={loading}
                  className="w-full text-center text-sm font-semibold text-primary hover:underline disabled:opacity-50"
                >
                  Não recebeu o código? Reenviar
                </button>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

