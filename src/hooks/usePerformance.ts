/**
 * Custom hooks for performance optimization and caching
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { cacheService } from '../services/cacheService';
import { CACHE_CONFIG } from '../constants';

/**
 * Hook for caching API calls with automatic refresh
 */
export function useApiCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  options: {
    ttl?: number;
    enabled?: boolean;
    refreshInterval?: number;
    staleWhileRevalidate?: boolean;
  } = {}
) {
  const {
    ttl = CACHE_CONFIG.CRYPTO_DATA_TTL,
    enabled = true,
    refreshInterval,
    staleWhileRevalidate = true
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetch = useCallback(async (forceRefresh = false) => {
    if (!enabled) return;

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      // Check cache first
      if (!forceRefresh) {
        const cached = cacheService.get<T>(key);
        if (cached) {
          setData(cached);
          setError(null);
          
          // If stale-while-revalidate is enabled, fetch in background
          if (staleWhileRevalidate) {
            setLoading(false);
            // Continue to fetch fresh data in background
          } else {
            setLoading(false);
            return;
          }
        }
      }

      if (!staleWhileRevalidate || !data) {
        setLoading(true);
      }

      const result = await fetchFn();
      
      // Cache the result
      cacheService.set(key, result, { ttl });
      
      setData(result);
      setError(null);
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  }, [key, fetchFn, enabled, ttl, staleWhileRevalidate, data]);

  // Initial fetch
  useEffect(() => {
    fetch();
  }, [fetch]);

  // Set up refresh interval
  useEffect(() => {
    if (!refreshInterval || !enabled) return;

    const interval = setInterval(() => {
      fetch(true);
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [fetch, refreshInterval, enabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const refresh = useCallback(() => fetch(true), [fetch]);
  const invalidate = useCallback(() => {
    cacheService.remove(key);
    fetch(true);
  }, [key, fetch]);

  return {
    data,
    loading,
    error,
    refresh,
    invalidate
  };
}

/**
 * Hook for debouncing values to prevent excessive API calls
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for memoizing expensive calculations
 */
export function useDeepMemo<T>(factory: () => T, deps: React.DependencyList): T {
  const ref = useRef<{
    deps: React.DependencyList;
    value: T;
  }>();

  if (!ref.current || !areEqual(ref.current.deps, deps)) {
    ref.current = {
      deps,
      value: factory()
    };
  }

  return ref.current.value;
}

/**
 * Hook for tracking component mount/unmount
 */
export function useIsMounted(): () => boolean {
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return useCallback(() => isMountedRef.current, []);
}

/**
 * Hook for previous value tracking
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
}

/**
 * Hook for optimized search with debouncing and caching
 */
export function useOptimizedSearch<T>(
  searchFn: (query: string) => Promise<T[]>,
  debounceMs = 300,
  cacheSize = 50
) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const debouncedQuery = useDebounce(query, debounceMs);
  const searchCache = useRef(new Map<string, T[]>());
  const abortControllerRef = useRef<AbortController | null>(null);

  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    // Check cache first
    if (searchCache.current.has(searchQuery)) {
      setResults(searchCache.current.get(searchQuery)!);
      setLoading(false);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);

    try {
      const searchResults = await searchFn(searchQuery);
      
      // Cache results
      if (searchCache.current.size >= cacheSize) {
        // Remove oldest entry
        const firstKey = searchCache.current.keys().next().value;
        if (firstKey) {
          searchCache.current.delete(firstKey);
        }
      }
      searchCache.current.set(searchQuery, searchResults);
      
      setResults(searchResults);
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err);
        setResults([]);
      }
    } finally {
      setLoading(false);
    }
  }, [searchFn, cacheSize]);

  useEffect(() => {
    search(debouncedQuery);
  }, [debouncedQuery, search]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
  }, []);

  const clearCache = useCallback(() => {
    searchCache.current.clear();
  }, []);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    clearSearch,
    clearCache
  };
}

/**
 * Hook for intersection observer (for lazy loading)
 */
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      { threshold: 0.1, ...options }
    );

    observer.observe(element);
    
    return () => observer.disconnect();
  }, [elementRef, options]);

  return isIntersecting;
}

/**
 * Utility function for deep equality check
 */
function areEqual(a: React.DependencyList, b: React.DependencyList): boolean {
  if (a.length !== b.length) return false;
  
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  
  return true;
}

// Performance monitoring exports
export { usePerformanceMonitor, useOperationTimer } from './usePerformanceMonitor.tsx';
