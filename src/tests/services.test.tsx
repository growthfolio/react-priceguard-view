/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '../services/authService';
import { cacheService } from '../services/cacheService';
import { alertService } from '../services/alertService';
import { audioService } from '../services/audioService';
import { userPreferencesService } from '../services/userPreferencesService';

// Mock API responses
const mockApiResponse = {
  success: true,
  data: { id: '1', name: 'Test User', email: 'test@example.com' },
};

// Mock fetch globally
global.fetch = vi.fn();

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should login with Google token', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse,
    } as Response);

    const result = await authService.loginWithGoogle('mock-token');

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/auth/google'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({ id_token: 'mock-token' }),
      })
    );

    expect(result).toEqual(mockApiResponse);
  });

  it('should handle login failure', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ success: false, error: 'Invalid token' }),
    } as Response);

    await expect(authService.loginWithGoogle('invalid-token')).rejects.toThrow();
  });

  it('should refresh tokens', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          access_token: 'new-access-token',
          refresh_token: 'new-refresh-token',
        },
      }),
    } as Response);

    localStorage.setItem('refresh_token', 'existing-refresh-token');

    const result = await authService.refreshToken();

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/auth/refresh'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({ refresh_token: 'existing-refresh-token' }),
      })
    );

    expect(result.access_token).toBe('new-access-token');
  });
});

describe('CacheService', () => {
  beforeEach(() => {
    cacheService.clear();
  });

  it('should cache and retrieve data', () => {
    const testData = { id: 1, name: 'Test' };
    const endpoint = '/api/test';

    cacheService.set(endpoint, testData);
    const cachedData = cacheService.get(endpoint);

    expect(cachedData).toEqual(testData);
  });

  it('should return null for expired data', async () => {
    const testData = { id: 1, name: 'Test' };
    const endpoint = '/api/test';

    // Set with very short TTL
    cacheService.set(endpoint, testData, undefined, 1);

    // Wait for expiration
    await new Promise(resolve => setTimeout(resolve, 2));

    const cachedData = cacheService.get(endpoint);
    expect(cachedData).toBeNull();
  });

  it('should clear cache by pattern', () => {
    cacheService.set('/api/alerts/1', { id: 1 });
    cacheService.set('/api/alerts/2', { id: 2 });
    cacheService.set('/api/users/1', { id: 1 });

    cacheService.clearByPattern(/\/alerts/);

    expect(cacheService.get('/api/alerts/1')).toBeNull();
    expect(cacheService.get('/api/alerts/2')).toBeNull();
    expect(cacheService.get('/api/users/1')).toEqual({ id: 1 });
  });

  it('should enforce cache size limit', () => {
    // Fill cache beyond limit
    for (let i = 0; i < 150; i++) {
      cacheService.set(`/api/test/${i}`, { id: i });
    }

    const stats = cacheService.getStats();
    expect(stats.size).toBeLessThanOrEqual(100); // MAX_CACHE_SIZE from constants
  });

  it('should provide cache statistics', () => {
    cacheService.set('/api/test', { id: 1 });
    cacheService.get('/api/test'); // Hit
    cacheService.get('/api/nonexistent'); // Miss

    const stats = cacheService.getStats();

    expect(stats.hits).toBe(1);
    expect(stats.misses).toBe(1);
    expect(stats.hitRate).toBe(50);
    expect(stats.size).toBe(1);
  });
});

describe('AlertService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch alerts with filters', async () => {
    const mockAlerts = [
      {
        id: '1',
        user_id: '1',
        symbol: 'BTC',
        condition_type: 'price_above',
        condition_value: '50000',
        is_active: true,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      },
    ];

    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: { alerts: mockAlerts, total: 1, page: 1, limit: 10 },
      }),
    } as Response);

    const result = await alertService.getAlerts({
      page: 1,
      limit: 10,
      symbol: 'BTC',
    });

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/alerts'),
      expect.objectContaining({
        method: 'GET',
      })
    );

    expect(result.data.alerts).toHaveLength(1);
    expect(result.data.alerts[0].symbol).toBe('BTC');
  });

  it('should create new alert', async () => {
    const newAlert: import("../models/Alert").CreateAlertPayload = {
      symbol: 'ETH',
      alert_type: 'price',
      condition_type: 'below',
      target_value: 3000,
      timeframe: '1h',
      notify_via: ['app'],
    };

    const mockResponse = {
      id: '2',
      user_id: '1',
      ...newAlert,
      enabled: true,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
    };

    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockResponse }),
    } as Response);

    const result = await alertService.createAlert(newAlert);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/alerts'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(newAlert),
      })
    );

    expect(result.symbol).toBe('ETH');
    expect(result.alert_type).toBe('price');
  });

  it('should handle API errors gracefully', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({
        success: false,
        error: 'Internal server error',
      }),
    } as Response);

    await expect(alertService.getAlerts()).rejects.toThrow();
  });
});

// Mock React component for testing hooks
const TestComponent = ({ endpoint }: { endpoint: string }) => {
  const { useCachedData } = require('../hooks/useCachedData');
  const { data, isLoading, error } = useCachedData(endpoint);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (data) return <div>Data: {JSON.stringify(data)}</div>;
  return <div>No data</div>;
};

describe('useCachedData Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cacheService.clear();
  });

  it('should show loading state initially', () => {
    render(<TestComponent endpoint="/api/test" />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should fetch and display data', async () => {
    const mockData = { id: 1, name: 'Test Data' };
    
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockData }),
    } as Response);

    render(<TestComponent endpoint="/api/test" />);

    await waitFor(() => {
      expect(screen.getByText(`Data: ${JSON.stringify(mockData)}`)).toBeInTheDocument();
    });
  });

  it('should show error state on fetch failure', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    render(<TestComponent endpoint="/api/test" />);

    await waitFor(() => {
      expect(screen.getByText('Error: Network error')).toBeInTheDocument();
    });
  });
});

describe('AudioService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock Audio constructor
    global.Audio = vi.fn().mockImplementation(() => ({
      play: vi.fn().mockResolvedValue(undefined),
      volume: 0.5
    }));
    
    // Mock AudioContext
    global.AudioContext = vi.fn().mockImplementation(() => ({
      createOscillator: vi.fn().mockReturnValue({
        connect: vi.fn(),
        frequency: { value: 0 },
        type: 'sine',
        start: vi.fn(),
        stop: vi.fn()
      }),
      createGain: vi.fn().mockReturnValue({
        connect: vi.fn(),
        gain: {
          setValueAtTime: vi.fn(),
          linearRampToValueAtTime: vi.fn(),
          exponentialRampToValueAtTime: vi.fn()
        }
      }),
      destination: {},
      currentTime: 0
    }));

    // Mock navigator.vibrate
    Object.defineProperty(navigator, 'vibrate', {
      value: vi.fn(),
      writable: true
    });
  });

  it('should initialize audio service', async () => {
    await expect(audioService.initialize()).resolves.not.toThrow();
  });

  it('should play notification sound', async () => {
    await audioService.playNotificationSound('info');
    expect(global.Audio).toHaveBeenCalled();
  });

  it('should trigger vibration', () => {
    audioService.vibrate([100, 50, 100]);
    expect(navigator.vibrate).toHaveBeenCalledWith([100, 50, 100]);
  });

  it('should update configuration', () => {
    audioService.updateConfig({ volume: 0.8, enabled: false });
    const config = audioService.getConfig();
    
    expect(config.volume).toBe(0.8);
    expect(config.enabled).toBe(false);
  });
});

describe('UserPreferencesService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should return default preferences', () => {
    const preferences = userPreferencesService.getPreferences();
    
    expect(preferences).toHaveProperty('theme');
    expect(preferences).toHaveProperty('language');
    expect(preferences).toHaveProperty('notifications');
    expect(preferences).toHaveProperty('dashboard');
    expect(preferences).toHaveProperty('trading');
  });

  it('should update theme preference', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true, data: {} })
    } as Response);

    await expect(userPreferencesService.updateTheme('dark')).resolves.not.toThrow();
  });

  it('should handle API errors gracefully', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(userPreferencesService.updateTheme('light')).rejects.toThrow();
  });
});

describe('Performance Tests', () => {
  it('should handle cache operations efficiently', () => {
    const startTime = performance.now();
    
    for (let i = 0; i < 100; i++) {
      cacheService.set(`key-${i}`, { id: i, data: `data-${i}` });
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    expect(duration).toBeLessThan(50); // Should be fast
  });

  it('should retrieve cached items quickly', () => {
    // Pre-populate cache
    for (let i = 0; i < 50; i++) {
      cacheService.set(`key-${i}`, { id: i, data: `data-${i}` });
    }

    const startTime = performance.now();
    
    for (let i = 0; i < 50; i++) {
      cacheService.get(`key-${i}`);
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    expect(duration).toBeLessThan(10);
  });
});

export {};
