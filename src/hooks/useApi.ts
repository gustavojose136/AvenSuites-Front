import { useSession } from "next-auth/react";
import { apiClient } from "@/utils/apiClient";
import { useState, useCallback } from "react";

export const useApi = () => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const makeRequest = useCallback(async <T>(
    requestFn: () => Promise<T>
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await requestFn();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('API Error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserProfile = useCallback(async () => {
    if (!session?.accessToken) return null;

    return makeRequest(() => apiClient.get('/user/profile'));
  }, [session, makeRequest]);

  const updateUserProfile = useCallback(async (data: any) => {
    if (!session?.accessToken) return null;

    return makeRequest(() => apiClient.put('/user/profile', data));
  }, [session, makeRequest]);

  const getProtectedData = useCallback(async (endpoint: string) => {
    if (!session?.accessToken) return null;

    return makeRequest(() => apiClient.get(endpoint));
  }, [session, makeRequest]);

  return {
    session,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    loading,
    error,
    makeRequest,
    getUserProfile,
    updateUserProfile,
    getProtectedData,
    apiClient,
  };
};
