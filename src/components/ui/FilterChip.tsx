import React from 'react';

interface FilterChipProps {
  label: string;
  icon?: string;
  isActive?: boolean;
  onClick: () => void;
  variant?: 'primary' | 'success' | 'warning' | 'info';
}

const FilterChip: React.FC<FilterChipProps> = ({
  label,
  icon,
  isActive = false,
  onClick,
  variant = 'primary'
}) => {
  const variantClasses = {
    primary: isActive ? 'active' : '',
    success: isActive ? 'bg-gradient-to-r from-green-500 to-green-600' : 'hover:from-green-400 hover:to-green-500',
    warning: isActive ? 'bg-gradient-to-r from-orange-500 to-orange-600' : 'hover:from-orange-400 hover:to-orange-500',
    info: isActive ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'hover:from-blue-400 hover:to-blue-500'
  };

  return (
    <button 
      className={`filter-chip ${variantClasses[variant]}`}
      onClick={onClick}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {label}
    </button>
  );
};

export default FilterChip;
