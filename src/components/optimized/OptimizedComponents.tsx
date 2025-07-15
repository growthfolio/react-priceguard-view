/**
 * Performance Optimized Components
 * Collection of components optimized with React.memo and other performance techniques
 */

import React, { memo, useMemo, useCallback } from 'react';
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

// Optimized Alert Component
interface OptimizedAlertProps {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  onClose?: (id: string) => void;
  autoClose?: boolean;
  duration?: number;
}

export const OptimizedAlert = memo<OptimizedAlertProps>(({
  id,
  type,
  title,
  message,
  onClose,
  autoClose = false,
  duration = 5000,
}) => {
  const handleClose = useCallback(() => {
    if (onClose) {
      onClose(id);
    }
  }, [id, onClose]);

  const { icon, bgColor, textColor, borderColor } = useMemo(() => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          bgColor: 'bg-green-50',
          textColor: 'text-green-800',
          borderColor: 'border-green-200',
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-200',
        };
      case 'error':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-red-50',
          textColor: 'text-red-800',
          borderColor: 'border-red-200',
        };
      default:
        return {
          icon: Info,
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-200',
        };
    }
  }, [type]);

  const IconComponent = icon;

  // Auto close effect
  React.useEffect(() => {
    if (autoClose && duration > 0) {
      const timer = setTimeout(handleClose, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, handleClose]);

  return (
    <div className={`p-4 rounded-lg border ${bgColor} ${borderColor}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <IconComponent className={`h-5 w-5 ${textColor}`} />
        </div>
        <div className="ml-3 flex-1">
          <h3 className={`text-sm font-medium ${textColor}`}>
            {title}
          </h3>
          <div className={`mt-1 text-sm ${textColor}`}>
            {message}
          </div>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <button
              onClick={handleClose}
              className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${textColor} hover:bg-opacity-20`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

OptimizedAlert.displayName = 'OptimizedAlert';

// Optimized List Item Component
interface OptimizedListItemProps {
  id: string;
  title: string;
  subtitle?: string;
  avatar?: string;
  badge?: {
    text: string;
    variant: 'default' | 'success' | 'warning' | 'error';
  };
  actions?: Array<{
    label: string;
    onClick: (id: string) => void;
    variant?: 'primary' | 'secondary' | 'danger';
  }>;
  onClick?: (id: string) => void;
  isSelected?: boolean;
}

export const OptimizedListItem = memo<OptimizedListItemProps>(({
  id,
  title,
  subtitle,
  avatar,
  badge,
  actions,
  onClick,
  isSelected = false,
}) => {
  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(id);
    }
  }, [id, onClick]);

  const handleActionClick = useCallback((actionIndex: number) => {
    if (actions && actions[actionIndex]) {
      actions[actionIndex].onClick(id);
    }
  }, [actions, id]);

  const badgeClasses = useMemo(() => {
    if (!badge) return '';
    
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    
    switch (badge.variant) {
      case 'success':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'warning':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'error':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  }, [badge]);

  return (
    <div
      onClick={handleClick}
      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
        isSelected 
          ? 'border-primary-500 bg-primary-50' 
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {avatar && (
            <img
              src={avatar}
              alt=""
              className="h-10 w-10 rounded-full object-cover"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {title}
            </p>
            {subtitle && (
              <p className="text-sm text-gray-500 truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {badge && (
            <span className={badgeClasses}>
              {badge.text}
            </span>
          )}
          
          {actions && actions.length > 0 && (
            <div className="flex space-x-1">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleActionClick(index);
                  }}
                  className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                    action.variant === 'primary'
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : action.variant === 'danger'
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

OptimizedListItem.displayName = 'OptimizedListItem';

// Optimized Data Table Row
interface OptimizedTableRowProps {
  id: string;
  cells: Array<{
    content: React.ReactNode;
    className?: string;
  }>;
  onClick?: (id: string) => void;
  isSelected?: boolean;
  isLoading?: boolean;
}

export const OptimizedTableRow = memo<OptimizedTableRowProps>(({
  id,
  cells,
  onClick,
  isSelected = false,
  isLoading = false,
}) => {
  const handleClick = useCallback(() => {
    if (onClick && !isLoading) {
      onClick(id);
    }
  }, [id, onClick, isLoading]);

  if (isLoading) {
    return (
      <tr className="animate-pulse">
        {cells.map((_, index) => (
          <td key={index} className="px-6 py-4 whitespace-nowrap">
            <div className="h-4 bg-gray-200 rounded"></div>
          </td>
        ))}
      </tr>
    );
  }

  return (
    <tr
      onClick={handleClick}
      className={`transition-colors ${
        onClick ? 'cursor-pointer hover:bg-gray-50' : ''
      } ${isSelected ? 'bg-primary-50' : ''}`}
    >
      {cells.map((cell, index) => (
        <td
          key={index}
          className={`px-6 py-4 whitespace-nowrap text-sm ${
            cell.className || 'text-gray-900'
          }`}
        >
          {cell.content}
        </td>
      ))}
    </tr>
  );
});

OptimizedTableRow.displayName = 'OptimizedTableRow';

// Optimized Card Component
interface OptimizedCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  loading?: boolean;
  className?: string;
}

export const OptimizedCard = memo<OptimizedCardProps>(({
  title,
  subtitle,
  children,
  actions,
  loading = false,
  className = '',
}) => {
  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
          {subtitle && <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>}
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow border border-gray-200 ${className}`}>
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            {subtitle && (
              <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
          {actions && (
            <div className="flex space-x-2">
              {actions}
            </div>
          )}
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
});

OptimizedCard.displayName = 'OptimizedCard';

export default {
  OptimizedAlert,
  OptimizedListItem,
  OptimizedTableRow,
  OptimizedCard,
};
