/**
 * Optimized components using React.memo and performance best practices
 */

import React, { memo, useMemo, useCallback } from 'react';
import { Button } from '../ui';

// Optimized table row component
interface OptimizedTableRowProps {
  id: string;
  data: Record<string, any>;
  columns: Array<{
    key: string;
    label: string;
    render?: (value: any, row: Record<string, any>) => React.ReactNode;
  }>;
  onRowClick?: (id: string) => void;
  onRowSelect?: (id: string, selected: boolean) => void;
  selected?: boolean;
  className?: string;
}

export const OptimizedTableRow = memo<OptimizedTableRowProps>(({
  id,
  data,
  columns,
  onRowClick,
  onRowSelect,
  selected = false,
  className = ''
}) => {
  const handleRowClick = useCallback(() => {
    onRowClick?.(id);
  }, [id, onRowClick]);

  const handleSelectChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    onRowSelect?.(id, event.target.checked);
  }, [id, onRowSelect]);

  const cells = useMemo(() => {
    return columns.map(column => {
      const value = data[column.key];
      const content = column.render ? column.render(value, data) : value;
      
      return (
        <td
          key={column.key}
          className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100"
        >
          {content}
        </td>
      );
    });
  }, [columns, data]);

  return (
    <tr
      className={`
        hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer
        ${selected ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
        ${className}
      `}
      onClick={handleRowClick}
    >
      {onRowSelect && (
        <td className="px-4 py-3">
          <input
            type="checkbox"
            checked={selected}
            onChange={handleSelectChange}
            onClick={(e) => e.stopPropagation()}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </td>
      )}
      {cells}
    </tr>
  );
}, (prevProps, nextProps) => {
  // Custom equality check for better performance
  return (
    prevProps.id === nextProps.id &&
    prevProps.selected === nextProps.selected &&
    prevProps.className === nextProps.className &&
    JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data) &&
    prevProps.columns.length === nextProps.columns.length
  );
});

OptimizedTableRow.displayName = 'OptimizedTableRow';

// Optimized card component
interface OptimizedCardProps {
  title: string;
  subtitle?: string;
  value: string | number;
  change?: {
    value: number;
    percentage: boolean;
  };
  icon?: React.ReactNode;
  loading?: boolean;
  className?: string;
  onClick?: () => void;
}

export const OptimizedCard = memo<OptimizedCardProps>(({
  title,
  subtitle,
  value,
  change,
  icon,
  loading = false,
  className = '',
  onClick
}) => {
  const changeColor = useMemo(() => {
    if (!change) return '';
    return change.value >= 0 ? 'text-green-600' : 'text-red-600';
  }, [change]);

  const formattedChange = useMemo(() => {
    if (!change) return null;
    
    const prefix = change.value >= 0 ? '+' : '';
    const suffix = change.percentage ? '%' : '';
    return `${prefix}${change.value.toFixed(2)}${suffix}`;
  }, [change]);

  return (
    <div
      className={`
        bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700
        ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            {icon}
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </h3>
          </div>
          
          {loading ? (
            <div className="mt-2 space-y-2">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              {subtitle && (
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
              )}
            </div>
          ) : (
            <>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                {typeof value === 'number' ? value.toLocaleString() : value}
              </p>
              
              {subtitle && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {subtitle}
                </p>
              )}
            </>
          )}
        </div>
        
        {change && !loading && (
          <div className={`text-sm font-medium ${changeColor}`}>
            {formattedChange}
          </div>
        )}
      </div>
    </div>
  );
});

OptimizedCard.displayName = 'OptimizedCard';

// Optimized list item component
interface OptimizedListItemProps {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  avatar?: string;
  badge?: {
    text: string;
    variant: 'success' | 'warning' | 'error' | 'info';
  };
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'error';
  }>;
  onClick?: () => void;
  className?: string;
}

export const OptimizedListItem = memo<OptimizedListItemProps>(({
  id,
  title,
  subtitle,
  description,
  avatar,
  badge,
  actions = [],
  onClick,
  className = ''
}) => {
  const badgeColors = useMemo(() => {
    if (!badge) return '';
    
    switch (badge.variant) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'info':
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    }
  }, [badge]);

  const handleClick = useCallback(() => {
    onClick?.();
  }, [onClick]);

  const actionButtons = useMemo(() => {
    return actions.map((action, index) => (
      <Button
        key={index}
        size="sm"
        variant={action.variant || 'secondary'}
        onClick={(e) => {
          e.stopPropagation();
          action.onClick();
        }}
      >
        {action.label}
      </Button>
    ));
  }, [actions]);

  return (
    <div
      className={`
        p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg
        ${onClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors' : ''}
        ${className}
      `}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          {avatar && (
            <img
              src={avatar}
              alt=""
              className="w-10 h-10 rounded-full object-cover"
            />
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {title}
              </h3>
              
              {badge && (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${badgeColors}`}>
                  {badge.text}
                </span>
              )}
            </div>
            
            {subtitle && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {subtitle}
              </p>
            )}
            
            {description && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-500 line-clamp-2">
                {description}
              </p>
            )}
          </div>
        </div>
        
        {actions.length > 0 && (
          <div className="flex items-center space-x-2">
            {actionButtons}
          </div>
        )}
      </div>
    </div>
  );
});

OptimizedListItem.displayName = 'OptimizedListItem';

// Virtualized list wrapper for large datasets
interface VirtualizedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight: number;
  containerHeight: number;
  className?: string;
}

export function VirtualizedList<T>({
  items,
  renderItem,
  itemHeight,
  containerHeight,
  className = ''
}: VirtualizedListProps<T>) {
  const [scrollTop, setScrollTop] = React.useState(0);

  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );

    return items.slice(startIndex, endIndex).map((item, index) => ({
      item,
      index: startIndex + index
    }));
  }, [items, scrollTop, itemHeight, containerHeight]);

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  return (
    <div
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        {visibleItems.map(({ item, index }) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: index * itemHeight,
              height: itemHeight,
              width: '100%'
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
}
