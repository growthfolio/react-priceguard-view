import React from 'react';

interface NotificationBadgeProps {
  count: number;
  maxCount?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'danger' | 'warning' | 'success';
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  pulse?: boolean;
  invisible?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  maxCount = 99,
  size = 'md',
  variant = 'danger',
  position = 'top-right',
  pulse = false,
  invisible = false,
  children,
  className = ''
}) => {
  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();
  const shouldShow = count > 0 && !invisible;

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'h-4 w-4 text-xs min-w-[16px]';
      case 'lg':
        return 'h-7 w-7 text-sm min-w-[28px]';
      case 'md':
      default:
        return 'h-5 w-5 text-xs min-w-[20px]';
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary-600 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      case 'success':
        return 'bg-green-500 text-white';
      case 'danger':
      default:
        return 'bg-red-500 text-white';
    }
  };

  const getPositionStyles = () => {
    switch (position) {
      case 'top-left':
        return '-top-1 -left-1';
      case 'bottom-right':
        return '-bottom-1 -right-1';
      case 'bottom-left':
        return '-bottom-1 -left-1';
      case 'top-right':
      default:
        return '-top-1 -right-1';
    }
  };

  const getPulseStyles = () => {
    if (!pulse || !shouldShow) return '';
    
    return `
      before:absolute before:inset-0 before:rounded-full before:animate-ping
      before:${getVariantStyles().split(' ')[0]} before:opacity-75
    `;
  };

  if (!children) {
    // Standalone badge
    return shouldShow ? (
      <span
        className={`
          inline-flex items-center justify-center
          ${getSizeStyles()}
          ${getVariantStyles()}
          ${getPulseStyles()}
          rounded-full font-medium leading-none
          ${className}
        `}
      >
        {displayCount}
      </span>
    ) : null;
  }

  // Badge with children (wrapper)
  return (
    <div className={`relative inline-flex ${className}`}>
      {children}
      
      {shouldShow && (
        <span
          className={`
            absolute flex items-center justify-center
            ${getSizeStyles()}
            ${getVariantStyles()}
            ${getPositionStyles()}
            ${getPulseStyles()}
            rounded-full font-medium leading-none
            transform transition-all duration-200 ease-out
            ${shouldShow ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
          `}
        >
          {displayCount}
        </span>
      )}
    </div>
  );
};

export default NotificationBadge;
