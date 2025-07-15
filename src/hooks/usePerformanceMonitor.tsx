/**
 * Performance monitoring hook for tracking and reporting app performance metrics
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage?: number;
  componentName: string;
  timestamp: number;
}

interface PerformanceData {
  averageRenderTime: number;
  slowRenders: PerformanceMetrics[];
  memoryTrend: number[];
  lastMeasurement: PerformanceMetrics | null;
}

const SLOW_RENDER_THRESHOLD = 16; // 16ms for 60fps
const MAX_STORED_METRICS = 100;

// Global store for performance data
const performanceStore = new Map<string, PerformanceMetrics[]>();

export function usePerformanceMonitor(componentName: string) {
  const renderStartTime = useRef<number>(Date.now());
  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    averageRenderTime: 0,
    slowRenders: [],
    memoryTrend: [],
    lastMeasurement: null,
  });

  // Measure render time
  const measureRenderTime = useCallback(() => {
    const renderTime = Date.now() - renderStartTime.current;
    
    const metric: PerformanceMetrics = {
      renderTime,
      memoryUsage: getMemoryUsage(),
      componentName,
      timestamp: Date.now(),
    };

    // Store metrics
    const metrics = performanceStore.get(componentName) || [];
    metrics.push(metric);
    
    // Keep only recent metrics
    if (metrics.length > MAX_STORED_METRICS) {
      metrics.shift();
    }
    
    performanceStore.set(componentName, metrics);

    // Update state with computed data
    const averageRenderTime = metrics.reduce((sum, m) => sum + m.renderTime, 0) / metrics.length;
    const slowRenders = metrics.filter(m => m.renderTime > SLOW_RENDER_THRESHOLD);
    const memoryTrend = metrics.slice(-10).map(m => m.memoryUsage || 0);

    setPerformanceData({
      averageRenderTime,
      slowRenders: slowRenders.slice(-10), // Keep last 10 slow renders
      memoryTrend,
      lastMeasurement: metric,
    });

    // Log slow renders in development
    if (process.env.NODE_ENV === 'development' && renderTime > SLOW_RENDER_THRESHOLD) {
      console.warn(`Slow render detected in ${componentName}: ${renderTime}ms`);
    }
  }, [componentName]);

  // Track render start
  useEffect(() => {
    renderStartTime.current = Date.now();
  });

  // Measure render completion
  useEffect(() => {
    measureRenderTime();
  });

  return {
    performanceData,
    markRenderStart: () => {
      renderStartTime.current = Date.now();
    },
    getAllMetrics: () => performanceStore.get(componentName) || [],
    clearMetrics: () => {
      performanceStore.delete(componentName);
      setPerformanceData({
        averageRenderTime: 0,
        slowRenders: [],
        memoryTrend: [],
        lastMeasurement: null,
      });
    },
  };
}

// Get memory usage if available (Chrome/Edge)
function getMemoryUsage(): number | undefined {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    return memory.usedJSHeapSize / 1024 / 1024; // Convert to MB
  }
  return undefined;
}

// Hook for tracking specific operations
export function useOperationTimer(operationName: string) {
  const startTime = useRef<number>();

  const startTimer = useCallback(() => {
    startTime.current = performance.now();
  }, []);

  const endTimer = useCallback(() => {
    if (!startTime.current) return 0;
    
    const duration = performance.now() - startTime.current;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`${operationName} took ${duration.toFixed(2)}ms`);
    }
    
    return duration;
  }, [operationName]);

  return { startTimer, endTimer };
}
