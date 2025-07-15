import { useState, useEffect, useCallback, useRef } from 'react';
import { cacheService } from '../services/cacheService';
import { apiClient } from '../services/apiClient';

interface UseCachedDataOptions {
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  refetchInterval?: number;
  cacheTime?: number;
  staleTime?: number;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

interface UseCachedDataResult<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  isStale: boolean;
  refetch: () => Promise<void>;
  invalidate: () => void;
}

/**
 * Custom hook for cached API data fetching
 */
export function useCachedData<T = any>(
  endpoint: string,
  params?: Record<string, any>,
  options: UseCachedDataOptions = {}
): UseCachedDataResult<T> {
  const {
    enabled = true,
    refetchOnWindowFocus = false,
    refetchInterval,
    cacheTime,
    staleTime = 30000, // 30 seconds
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStale, setIsStale] = useState(false);
  const [lastFetch, setLastFetch] = useState<number>(0);

  const intervalRef = useRef<NodeJS.Timeout>();
  const abortControllerRef = useRef<AbortController>();

  /**
   * Fetch data from API
   */
  const fetchData = useCallback(async (forceRefresh = false) => {
    if (!enabled) return;

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setIsLoading(true);
    setError(null);

    try {
      // Check cache first (unless forcing refresh)
      if (!forceRefresh && cacheService.shouldCache(endpoint)) {
        const cachedData = cacheService.get<T>(endpoint, params);
        if (cachedData) {
          setData(cachedData);
          setIsLoading(false);
          setLastFetch(Date.now());
          
          // Check if data is stale
          const isDataStale = Date.now() - lastFetch > staleTime;
          setIsStale(isDataStale);
          
          if (onSuccess) {
            onSuccess(cachedData);
          }
          
          // Still fetch fresh data in background if stale
          if (!isDataStale) {
            return;
          }
        }
      }

      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();

      // Fetch from API
      const response = await apiClient.get<T>(endpoint, {
        signal: abortControllerRef.current.signal,
        // Add params to query string if they exist
        ...(params && {
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      });

      if (response.success && response.data) {
        setData(response.data);
        setIsStale(false);
        setLastFetch(Date.now());

        // Cache the response
        if (cacheService.shouldCache(endpoint)) {
          cacheService.set(endpoint, response.data, params, cacheTime);
        }

        if (onSuccess) {
          onSuccess(response.data);
        }
      } else {
        throw new Error(response.error || 'Failed to fetch data');
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        
        if (onError) {
          onError(error);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, params, enabled, cacheTime, staleTime, onSuccess, onError, lastFetch]);

  /**
   * Invalidate cache and refetch
   */
  const invalidate = useCallback(() => {
    cacheService.remove(endpoint, params);
    fetchData(true);
  }, [endpoint, params, fetchData]);

  /**
   * Refetch data
   */
  const refetch = useCallback(async () => {
    await fetchData(true);
  }, [fetchData]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Setup polling interval
  useEffect(() => {
    if (refetchInterval && enabled) {
      intervalRef.current = setInterval(() => {
        fetchData();
      }, refetchInterval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [refetchInterval, enabled, fetchData]);

  // Setup window focus refetch
  useEffect(() => {
    if (!refetchOnWindowFocus) return;

    const handleFocus = () => {
      // Only refetch if data is stale
      if (Date.now() - lastFetch > staleTime) {
        fetchData();
      }
    };

    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [refetchOnWindowFocus, fetchData, lastFetch, staleTime]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    data,
    error,
    isLoading,
    isStale,
    refetch,
    invalidate,
  };
}

/**
 * Hook for mutations (POST, PUT, DELETE) with cache invalidation
 */
export function useMutation<TData = any, TVariables = any>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: {
    onSuccess?: (data: TData, variables: TVariables) => void;
    onError?: (error: Error, variables: TVariables) => void;
    invalidatePatterns?: RegExp[];
  } = {}
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (variables: TVariables) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await mutationFn(variables);
      
      // Invalidate related cache entries
      if (options.invalidatePatterns) {
        options.invalidatePatterns.forEach(pattern => {
          cacheService.clearByPattern(pattern);
        });
      }

      if (options.onSuccess) {
        options.onSuccess(data, variables);
      }

      return data;
    } catch (err: any) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      
      if (options.onError) {
        options.onError(error, variables);
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [mutationFn, options]);

  return {
    mutate,
    isLoading,
    error,
  };
}

export default useCachedData;
