import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, DollarSign, Users, Target, Zap } from 'lucide-react';

interface ModernCardProps {
  variant?: 'glass' | 'gradient' | 'neon' | 'minimal';
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const ModernCard: React.FC<ModernCardProps> = ({ 
  variant = 'glass',
  children,
  className = '',
  hover = true
}) => {
  const variants = {
    glass: `
      backdrop-blur-xl bg-white/20 border border-white/30 
      shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
      hover:bg-white/30 hover:shadow-[0_16px_40px_0_rgba(31,38,135,0.5)]
    `,
    gradient: `
      bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500
      text-white shadow-[0_20px_50px_-12px_rgba(59,130,246,0.5)]
      hover:shadow-[0_25px_60px_-12px_rgba(59,130,246,0.7)]
    `,
    neon: `
      bg-gray-900/90 border border-cyan-400/30 
      shadow-[0_0_20px_rgba(34,211,238,0.4)]
      hover:shadow-[0_0_30px_rgba(34,211,238,0.6)]
      relative overflow-hidden
    `,
    minimal: `
      bg-white border border-gray-200 shadow-lg
      hover:shadow-xl hover:border-gray-300
    `
  };

  const hoverClass = hover ? 'transition-all duration-500 hover:scale-[1.02] cursor-pointer' : '';

  return (
    <div className={`
      ${variants[variant]}
      rounded-2xl p-6 ${hoverClass}
      ${className}
    `}>
      {variant === 'neon' && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent animate-pulse" />
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
        </>
      )}
      {children}
    </div>
  );
};

interface AnimatedMetricProps {
  title: string;
  value: number | string;
  change?: number;
  icon: React.ComponentType<any>;
  color: 'success' | 'warning' | 'error' | 'info' | 'purple';
  loading?: boolean;
  prefix?: string;
  suffix?: string;
}

const AnimatedMetric: React.FC<AnimatedMetricProps> = ({
  title, 
  value, 
  change, 
  icon: Icon, 
  color,
  loading = false,
  prefix = '',
  suffix = ''
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Animated counter effect
  useEffect(() => {
    if (typeof value === 'number' && !loading) {
      setIsAnimating(true);
      let start = 0;
      const increment = value / 60; // 60 frames for smooth animation
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= value) {
          setDisplayValue(value);
          setIsAnimating(false);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(start));
        }
      }, 16); // ~60fps
      
      return () => clearInterval(timer);
    }
  }, [value, loading]);

  const colorClasses = {
    success: {
      gradient: 'from-emerald-400 to-emerald-600',
      text: 'text-emerald-600',
      bg: 'bg-emerald-50',
      glow: 'shadow-emerald-500/25'
    },
    warning: {
      gradient: 'from-amber-400 to-amber-600',
      text: 'text-amber-600', 
      bg: 'bg-amber-50',
      glow: 'shadow-amber-500/25'
    },
    error: {
      gradient: 'from-red-400 to-red-600',
      text: 'text-red-600',
      bg: 'bg-red-50',
      glow: 'shadow-red-500/25'
    },
    info: {
      gradient: 'from-blue-400 to-blue-600',
      text: 'text-blue-600',
      bg: 'bg-blue-50',
      glow: 'shadow-blue-500/25'
    },
    purple: {
      gradient: 'from-purple-400 to-purple-600',
      text: 'text-purple-600',
      bg: 'bg-purple-50',
      glow: 'shadow-purple-500/25'
    }
  };

  const currentColor = colorClasses[color];

  if (loading) {
    return (
      <ModernCard variant="glass" className="animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-3 flex-1">
            <div className="h-4 bg-gray-300/50 rounded-full w-3/4"></div>
            <div className="h-8 bg-gray-300/50 rounded-full w-1/2"></div>
            <div className="h-3 bg-gray-300/50 rounded-full w-1/3"></div>
          </div>
          <div className="w-16 h-16 bg-gray-300/50 rounded-full"></div>
        </div>
      </ModernCard>
    );
  }

  return (
    <ModernCard variant="glass" className="group">
      <div className="flex items-center justify-between">
        <div className="space-y-2 flex-1">
          <p className="text-gray-600 text-sm font-medium group-hover:text-gray-700 transition-colors">
            {title}
          </p>
          
          <div className="relative">
            <p className={`
              text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent
              ${isAnimating ? 'animate-pulse' : ''}
            `}>
              {prefix}
              {typeof value === 'number' ? displayValue.toLocaleString() : value}
              {suffix}
            </p>
            
            {isAnimating && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded animate-pulse" />
            )}
          </div>
          
          {change !== undefined && (
            <div className={`
              flex items-center space-x-1 transition-all duration-300
              ${change >= 0 ? 'text-emerald-600' : 'text-red-600'}
            `}>
              {change >= 0 ? (
                <TrendingUp size={16} className="animate-bounce" />
              ) : (
                <TrendingDown size={16} className="animate-bounce" />
              )}
              <span className="text-sm font-semibold">
                {change >= 0 ? '+' : ''}{change.toFixed(1)}%
              </span>
            </div>
          )}
        </div>
        
        <div className={`
          w-16 h-16 rounded-full bg-gradient-to-br ${currentColor.gradient}
          flex items-center justify-center shadow-lg ${currentColor.glow}
          transform transition-all duration-300 
          group-hover:scale-110 group-hover:rotate-12
          relative overflow-hidden
        `}>
          <Icon size={24} className="text-white relative z-10" />
          
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </div>
      </div>
    </ModernCard>
  );
};

interface DashboardStatsProps {
  stats: {
    totalAlerts: number;
    activeAlerts: number;
    triggeredToday: number;
    unreadNotifications: number;
    portfolioValue: number;
    dailyPnL: number;
  };
  loading?: boolean;
}

const ModernDashboardStats: React.FC<DashboardStatsProps> = ({ stats, loading = false }) => {
  const metrics = [
    {
      title: "Portfolio Total",
      value: stats.portfolioValue,
      change: stats.dailyPnL,
      icon: DollarSign,
      color: 'success' as const,
      prefix: '$',
    },
    {
      title: "Alertas Ativos", 
      value: stats.activeAlerts,
      change: 8.2,
      icon: Target,
      color: 'info' as const,
    },
    {
      title: "Disparados Hoje",
      value: stats.triggeredToday,
      change: -2.1,
      icon: Zap,
      color: 'warning' as const,
    },
    {
      title: "Notificações",
      value: stats.unreadNotifications,
      icon: Activity,
      color: 'purple' as const,
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => (
        <div 
          key={metric.title}
          style={{ animationDelay: `${index * 100}ms` }}
          className="animate-fade-in"
        >
          <AnimatedMetric {...metric} loading={loading} />
        </div>
      ))}
    </div>
  );
};

interface HeroMetricProps {
  title: string;
  value: string;
  subtitle: string;
  change: number;
  chartData?: number[];
}

const HeroMetric: React.FC<HeroMetricProps> = ({ 
  title, 
  value, 
  subtitle, 
  change,
  chartData = []
}) => {
  return (
    <ModernCard variant="gradient" className="col-span-full mb-8">
      <div className="flex flex-col lg:flex-row items-center justify-between">
        <div className="text-center lg:text-left mb-6 lg:mb-0">
          <h2 className="text-lg font-medium text-white/80 mb-2">{title}</h2>
          <div className="text-5xl font-bold text-white mb-2 tracking-tight">
            {value}
          </div>
          <p className="text-white/70 text-lg">{subtitle}</p>
          
          <div className={`
            inline-flex items-center space-x-2 mt-4 px-4 py-2 rounded-full
            ${change >= 0 ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100'}
          `}>
            {change >= 0 ? (
              <TrendingUp size={20} />
            ) : (
              <TrendingDown size={20} />
            )}
            <span className="font-semibold">
              {change >= 0 ? '+' : ''}{change.toFixed(2)}% today
            </span>
          </div>
        </div>
        
        {chartData.length > 0 && (
          <div className="w-full lg:w-1/2 h-32">
            <div className="flex items-end space-x-1 h-full">
              {chartData.map((value, index) => (
                <div
                  key={index}
                  className="flex-1 bg-white/20 rounded-t-sm transition-all duration-500 hover:bg-white/30"
                  style={{ 
                    height: `${(value / Math.max(...chartData)) * 100}%`,
                    animationDelay: `${index * 50}ms`
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </ModernCard>
  );
};

// Export components
export {
  ModernCard,
  AnimatedMetric, 
  ModernDashboardStats,
  HeroMetric
};

export default {
  ModernCard,
  AnimatedMetric,
  ModernDashboardStats, 
  HeroMetric
};
