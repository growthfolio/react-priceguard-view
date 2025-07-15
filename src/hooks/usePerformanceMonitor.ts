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

// Performance monitoring component for development
export function PerformanceMonitor({ enabled = process.env.NODE_ENV === 'development' }: { enabled?: boolean }) {
  const [isVisible, setIsVisible] = useState(false);
  const [metrics, setMetrics] = useState<{ [key: string]: PerformanceData }>({});

  useEffect(() => {
    if (!enabled) return;

    const updateMetrics = () => {
      const allMetrics: { [key: string]: PerformanceData } = {};
      
      performanceStore.forEach((componentMetrics, componentName) => {
        if (componentMetrics.length === 0) return;
        
        const averageRenderTime = componentMetrics.reduce((sum, m) => sum + m.renderTime, 0) / componentMetrics.length;
        const slowRenders = componentMetrics.filter(m => m.renderTime > SLOW_RENDER_THRESHOLD);
        const memoryTrend = componentMetrics.slice(-10).map(m => m.memoryUsage || 0);
        
        allMetrics[componentName] = {
          averageRenderTime,
          slowRenders: slowRenders.slice(-5),
          memoryTrend,
          lastMeasurement: componentMetrics[componentMetrics.length - 1],
        };
      });
      
      setMetrics(allMetrics);
    };

    const interval = setInterval(updateMetrics, 1000);
    return () => clearInterval(interval);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 10,
        right: 10,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        fontFamily: 'monospace',
        maxWidth: '300px',
        maxHeight: '400px',
        overflow: 'auto',
        cursor: 'pointer',
      }}
      onClick={() => setIsVisible(!isVisible)}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
        Performance Monitor {isVisible ? '🔽' : '▶️'}
      </div>
      
      {isVisible && (
        <div>
          {Object.entries(metrics).map(([componentName, data]) => (
            <div key={componentName} style={{ marginBottom: '10px', borderBottom: '1px solid #444', paddingBottom: '5px' }}>
              <div style={{ fontWeight: 'bold' }}>{componentName}</div>
              <div>Avg Render: {data.averageRenderTime.toFixed(2)}ms</div>
              <div>Slow Renders: {data.slowRenders.length}</div>
              {data.lastMeasurement?.memoryUsage && (
                <div>Memory: {data.lastMeasurement.memoryUsage.toFixed(2)}MB</div>
              )}
            </div>
          ))}
          
          {Object.keys(metrics).length === 0 && (
            <div>No performance data available</div>
          )}
        </div>
      )}
    </div>
  );
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
