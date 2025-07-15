/**
 * Cache Service
 * Manages caching of API responses to improve performance and reduce network requests
 */

import { CACHE_CONFIG } from '../constants';

interface CacheItem<T = any> {
  data: T;
  timestamp: number;
  ttl: number; // time to live in milliseconds
}

interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  hitRate: number;
}

class CacheService {
  private cache = new Map<string, CacheItem>();
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    size: 0,
    hitRate: 0,
  };

  /**
   * Generate cache key from endpoint and parameters
   */
  private generateKey(endpoint: string, params?: Record<string, any>): string {
    const paramString = params ? JSON.stringify(params) : '';
    return `${endpoint}:${paramString}`;
  }

  /**
   * Check if cache item is still valid
   */
  private isValid(item: CacheItem): boolean {
    return Date.now() - item.timestamp < item.ttl;
  }

  /**
   * Update cache statistics
   */
  private updateStats(): void {
    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0;
    this.stats.size = this.cache.size;
  }

  /**
   * Cleanup expired items
   */
  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp >= item.ttl) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
    this.updateStats();
  }

  /**
   * Enforce cache size limit
   */
  private enforceSizeLimit(): void {
    if (this.cache.size <= CACHE_CONFIG.MAX_CACHE_SIZE) return;

    // Remove oldest items first (LRU strategy)
    const sortedEntries = Array.from(this.cache.entries())
      .sort(([, a], [, b]) => a.timestamp - b.timestamp);

    const itemsToRemove = this.cache.size - CACHE_CONFIG.MAX_CACHE_SIZE;
    
    for (let i = 0; i < itemsToRemove; i++) {
      this.cache.delete(sortedEntries[i][0]);
    }

    this.updateStats();
  }

  /**
   * Get cached data
   */
  public get<T = any>(endpoint: string, params?: Record<string, any>): T | null {
    this.cleanup(); // Clean expired items first

    const key = this.generateKey(endpoint, params);
    const item = this.cache.get(key);

    if (item && this.isValid(item)) {
      this.stats.hits++;
      this.updateStats();
      return item.data;
    }

    this.stats.misses++;
    this.updateStats();
    return null;
  }

  /**
   * Set cached data
   */
  public set<T = any>(
    endpoint: string, 
    data: T, 
    params?: Record<string, any>,
    customTtl?: number
  ): void {
    const key = this.generateKey(endpoint, params);
    
    // Determine TTL based on endpoint type
    let ttl = customTtl;
    if (!ttl) {
      if (endpoint.includes('/crypto')) {
        ttl = CACHE_CONFIG.CRYPTO_DATA_TTL;
      } else if (endpoint.includes('/alerts')) {
        ttl = CACHE_CONFIG.ALERTS_TTL;
      } else if (endpoint.includes('/user')) {
        ttl = CACHE_CONFIG.USER_DATA_TTL;
      } else {
        ttl = CACHE_CONFIG.CRYPTO_DATA_TTL; // Default
      }
    }

    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl,
    };

    this.cache.set(key, item);
    this.enforceSizeLimit();
    this.updateStats();
  }

  /**
   * Remove specific cache entry
   */
  public remove(endpoint: string, params?: Record<string, any>): void {
    const key = this.generateKey(endpoint, params);
    this.cache.delete(key);
    this.updateStats();
  }

  /**
   * Clear all cache entries
   */
  public clear(): void {
    this.cache.clear();
    this.stats = {
      hits: 0,
      misses: 0,
      size: 0,
      hitRate: 0,
    };
  }

  /**
   * Clear cache entries by pattern
   */
  public clearByPattern(pattern: RegExp): void {
    const keysToDelete: string[] = [];

    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
    this.updateStats();
  }

  /**
   * Get cache statistics
   */
  public getStats(): CacheStats {
    this.updateStats();
    return { ...this.stats };
  }

  /**
   * Check if endpoint should be cached
   */
  public shouldCache(endpoint: string): boolean {
    // Don't cache POST, PUT, DELETE requests
    const writeOperations = ['/create', '/update', '/delete'];
    if (writeOperations.some(op => endpoint.includes(op))) {
      return false;
    }

    // Don't cache authentication endpoints
    if (endpoint.includes('/auth/')) {
      return false;
    }

    // Don't cache real-time data endpoints
    if (endpoint.includes('/live') || endpoint.includes('/stream')) {
      return false;
    }

    return true;
  }

  /**
   * Invalidate related cache entries when data changes
   */
  public invalidateRelated(endpoint: string): void {
    if (endpoint.includes('/alerts')) {
      this.clearByPattern(/\/alerts/);
      this.clearByPattern(/\/dashboard/); // Dashboard might show alert stats
    } else if (endpoint.includes('/notifications')) {
      this.clearByPattern(/\/notifications/);
    } else if (endpoint.includes('/user')) {
      this.clearByPattern(/\/user/);
    } else if (endpoint.includes('/crypto')) {
      this.clearByPattern(/\/crypto/);
    }
  }

  /**
   * Prefetch data for common endpoints
   */
  public async prefetch(
    fetcher: (endpoint: string) => Promise<any>,
    endpoints: string[]
  ): Promise<void> {
    const prefetchPromises = endpoints
      .filter(endpoint => this.shouldCache(endpoint))
      .map(async endpoint => {
        try {
          const data = await fetcher(endpoint);
          this.set(endpoint, data);
        } catch (error) {
          console.warn(`Failed to prefetch ${endpoint}:`, error);
        }
      });

    await Promise.allSettled(prefetchPromises);
  }

  /**
   * Get memory usage information
   */
  public getMemoryUsage(): { approximateSize: string; itemCount: number } {
    let approximateSize = 0;
    
    for (const item of this.cache.values()) {
      // Rough estimation of memory usage
      approximateSize += JSON.stringify(item.data).length * 2; // UTF-16 encoding
    }

    return {
      approximateSize: `${(approximateSize / 1024).toFixed(2)} KB`,
      itemCount: this.cache.size,
    };
  }
}

// Export singleton instance
export const cacheService = new CacheService();
export default cacheService;
