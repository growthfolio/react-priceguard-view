import React from 'react';

interface QuickActionCardProps {
  icon: React.ReactNode | string;
  label: string;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  icon,
  label,
  onClick,
  variant = 'default',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  const iconSizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-xl'
  };

  const variantClasses = {
    default: 'hover:border-blue-500',
    primary: 'border-blue-200 hover:border-blue-500 hover:bg-blue-50',
    success: 'border-green-200 hover:border-green-500 hover:bg-green-50',
    warning: 'border-orange-200 hover:border-orange-500 hover:bg-orange-50'
  };

  return (
    <div 
      className={`quick-action-card ${sizeClasses[size]} ${variantClasses[variant]}`}
      onClick={onClick}
    >
      <div className={`quick-action-icon ${iconSizeClasses[size]}`}>
        {typeof icon === 'string' ? icon : icon}
      </div>
      <div className="quick-action-label text-sm md:text-base">
        {label}
      </div>
    </div>
  );
};

export default QuickActionCard;
