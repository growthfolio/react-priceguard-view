import React from 'react';
import { CircleNotch } from '@phosphor-icons/react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'btn focus-ring transition-all duration-200 font-medium';
  
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline-primary',
    ghost: 'btn-ghost',
    success: 'bg-success hover:bg-green-600 text-white border-success',
    warning: 'bg-warning hover:bg-yellow-600 text-white border-warning',
    error: 'bg-error hover:bg-red-600 text-white border-error'
  };

  const sizeClasses = {
    sm: 'btn-sm',
    md: 'btn-md', 
    lg: 'btn-lg',
    xl: 'btn-xl'
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = (disabled || loading) ? 'opacity-50 cursor-not-allowed' : '';

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    widthClass,
    disabledClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <CircleNotch size={16} className="animate-spin mr-2" />
          Carregando...
        </>
      ) : (
        <>
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;
