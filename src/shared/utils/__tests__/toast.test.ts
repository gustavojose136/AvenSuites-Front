/**
 * Testes: Toast Notifications
 * Testa sistema de notificações toast
 */

import { showToast } from '../toast';
import toast from 'react-hot-toast';

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
    promise: jest.fn(),
    dismiss: jest.fn(),
  },
}));

describe('Toast Notifications', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('showToast.success', () => {
    it('deve chamar toast.success com mensagem e opções corretas', () => {
      const message = 'Operação realizada com sucesso!';
      
      showToast.success(message);
      
      expect(toast.success).toHaveBeenCalledWith(message, {
        duration: 4000,
        position: 'top-right',
        icon: '✅',
        style: {
          borderRadius: '10px',
          background: '#10b981',
          color: '#fff',
        },
      });
    });
  });

  describe('showToast.error', () => {
    it('deve chamar toast.error com mensagem e opções corretas', () => {
      const message = 'Erro ao processar solicitação';
      
      showToast.error(message);
      
      expect(toast.error).toHaveBeenCalledWith(message, {
        duration: 5000,
        position: 'top-right',
        icon: '❌',
        style: {
          borderRadius: '10px',
          background: '#ef4444',
          color: '#fff',
        },
      });
    });
  });

  describe('showToast.loading', () => {
    it('deve chamar toast.loading com mensagem e opções corretas', () => {
      const message = 'Carregando...';
      
      showToast.loading(message);
      
      expect(toast.loading).toHaveBeenCalledWith(message, {
        duration: 4000,
        position: 'top-right',
        style: {
          borderRadius: '10px',
          background: '#3b82f6',
          color: '#fff',
        },
      });
    });

    it('deve retornar o ID do toast', () => {
      const mockToastId = 'toast-123';
      (toast.loading as jest.Mock).mockReturnValue(mockToastId);
      
      const result = showToast.loading('Carregando...');
      
      expect(result).toBe(mockToastId);
    });
  });

  describe('showToast.promise', () => {
    it('deve chamar toast.promise com promise e mensagens', async () => {
      const promise = Promise.resolve('success');
      const messages = {
        loading: 'Processando...',
        success: 'Sucesso!',
        error: 'Erro!',
      };
      
      showToast.promise(promise, messages);
      
      expect(toast.promise).toHaveBeenCalledWith(
        promise,
        messages,
        {
          duration: 4000,
          position: 'top-right',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }
      );
    });
  });

  describe('showToast.dismiss', () => {
    it('deve chamar toast.dismiss sem ID', () => {
      showToast.dismiss();
      
      expect(toast.dismiss).toHaveBeenCalledWith(undefined);
    });

    it('deve chamar toast.dismiss com ID específico', () => {
      const toastId = 'toast-123';
      
      showToast.dismiss(toastId);
      
      expect(toast.dismiss).toHaveBeenCalledWith(toastId);
    });
  });

  describe('showToast.info', () => {
    it('deve chamar toast com mensagem de informação', () => {
      const message = 'Informação importante';
      
      showToast.info(message);
      
      expect(toast).toHaveBeenCalledWith(message, {
        duration: 4000,
        position: 'top-right',
        icon: 'ℹ️',
        style: {
          borderRadius: '10px',
          background: '#3b82f6',
          color: '#fff',
        },
      });
    });
  });

  describe('showToast.warning', () => {
    it('deve chamar toast com mensagem de aviso', () => {
      const message = 'Atenção!';
      
      showToast.warning(message);
      
      expect(toast).toHaveBeenCalledWith(message, {
        duration: 5000,
        position: 'top-right',
        icon: '⚠️',
        style: {
          borderRadius: '10px',
          background: '#f59e0b',
          color: '#fff',
        },
      });
    });
  });
});

