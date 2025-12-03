/**
 * Utilitários de formatação para reservas
 * SOLID - Single Responsibility: Apenas formatação
 */

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatCurrency = (value: number, currency: string = 'BRL'): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency,
  }).format(value);
};

export const getStatusColor = (status: string): string => {
  const statusMap: Record<string, string> = {
    'PENDING': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
    'CONFIRMED': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
    'CANCELLED': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
    'CHECKED_IN': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
    'CHECKED_OUT': 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300',
    'NO_SHOW': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
  };
  return statusMap[status.toUpperCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
};

export const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    'PENDING': 'Pendente',
    'CONFIRMED': 'Confirmada',
    'CANCELLED': 'Cancelada',
    'CHECKED_IN': 'Check-in Realizado',
    'CHECKED_OUT': 'Check-out Realizado',
    'NO_SHOW': 'Não Compareceu',
  };
  return labels[status.toUpperCase()] || status;
};






