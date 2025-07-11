import React from 'react';
import { TrendUp } from '@phosphor-icons/react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = 'Carregando...', 
  fullScreen = false 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const Component = (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Animated logo */}
      <div className="relative">
        <div className={`${sizeClasses[size]} bg-gradient-primary rounded-lg flex items-center justify-center animate-pulse`}>
          <TrendUp className="text-white" size={size === 'sm' ? 16 : size === 'md' ? 20 : 28} />
        </div>
        
        {/* Pulse rings */}
        <div className={`absolute inset-0 ${sizeClasses[size]} rounded-lg border-2 border-primary-400 animate-ping opacity-20`}></div>
        <div className={`absolute inset-0 ${sizeClasses[size]} rounded-lg border-2 border-primary-400 animate-ping opacity-10`} style={{ animationDelay: '0.5s' }}></div>
      </div>
      
      {/* Loading text */}
      <div className={`${textSizeClasses[size]} text-gray-600 font-medium animate-pulse`}>
        {text}
      </div>
      
      {/* Progress dots */}
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {Component}
      </div>
    );
  }

  return Component;
};

export default LoadingSpinner;
