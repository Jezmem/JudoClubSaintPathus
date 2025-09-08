import { useState, useEffect } from 'react';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
): UseApiState<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await apiCall();
      setState({ data: result, loading: false, error: null });
    } catch (error: any) {
      setState({ 
        data: null, 
        loading: false, 
        error: error.response?.data?.errors?.[0] || error.response?.data?.message || error.message || 'Une erreur est survenue' 
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return {
    ...state,
    refetch: fetchData,
  };
}

export function useApiMutation<T, P>(
  apiCall: (params: P) => Promise<T>
): {
  mutate: (params: P) => Promise<T | null>;
  loading: boolean;
  error: string | null;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (params: P): Promise<T | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall(params);
      setLoading(false);
      return result;
    } catch (error: any) {
      setError(error.response?.data?.message || error.message || 'Une erreur est survenue');
      setLoading(false);
      return null;
    }
  };

  return { mutate, loading, error };
}