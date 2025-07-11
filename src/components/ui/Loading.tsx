import React from 'react';
import { Sparkle } from '@phosphor-icons/react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ 
  size = 'md', 
  message = 'Carregando...', 
  fullScreen = false 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center'
    : 'flex items-center justify-center p-8';

  return (
    <div className={containerClasses}>
      <div className="text-center">
        {/* Logo animado */}
        <div className="relative mb-4">
          <div className={`${sizeClasses[size]} bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mx-auto`}>
            <Sparkle size={size === 'sm' ? 16 : size === 'md' ? 24 : 32} className="text-white animate-pulse" />
          </div>
          
          {/* Anel de loading */}
          <div className={`absolute inset-0 ${sizeClasses[size]} mx-auto`}>
            <div className="w-full h-full border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          </div>
        </div>

        {/* Texto */}
        <p className="text-neutral-600 font-medium">{message}</p>
        
        {/* Pontos animados */}
        <div className="flex justify-center space-x-1 mt-2">
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

// Componente específico para loading de página completa
export const PageLoading: React.FC<{ message?: string }> = ({ message }) => (
  <Loading size="lg" message={message} fullScreen />
);

// Componente para loading inline/pequeno
export const InlineLoading: React.FC<{ message?: string }> = ({ message }) => (
  <Loading size="sm" message={message} />
);

export default Loading;
