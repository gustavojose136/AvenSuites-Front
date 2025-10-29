/**
 * Utilidade: Toast Notifications
 * Sistema centralizado de notificações
 */

import toast, { Toaster } from 'react-hot-toast';

// Configurações padrão
const defaultOptions = {
  duration: 4000,
  position: 'top-right' as const,
  style: {
    borderRadius: '10px',
    background: '#333',
    color: '#fff',
  },
};

export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      ...defaultOptions,
      icon: '✅',
      style: {
        ...defaultOptions.style,
        background: '#10b981',
      },
    });
  },

  error: (message: string) => {
    toast.error(message, {
      ...defaultOptions,
      icon: '❌',
      duration: 5000,
      style: {
        ...defaultOptions.style,
        background: '#ef4444',
      },
    });
  },

  loading: (message: string) => {
    return toast.loading(message, {
      ...defaultOptions,
      style: {
        ...defaultOptions.style,
        background: '#3b82f6',
      },
    });
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
      },
      defaultOptions
    );
  },

  dismiss: (toastId?: string) => {
    toast.dismiss(toastId);
  },

  info: (message: string) => {
    toast(message, {
      ...defaultOptions,
      icon: 'ℹ️',
      style: {
        ...defaultOptions.style,
        background: '#3b82f6',
      },
    });
  },

  warning: (message: string) => {
    toast(message, {
      ...defaultOptions,
      icon: '⚠️',
      duration: 5000,
      style: {
        ...defaultOptions.style,
        background: '#f59e0b',
      },
    });
  },
};

export { Toaster };

