import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  change?: {
    value: string;
    isPositive: boolean;
  };
  iconColor?: 'blue' | 'green' | 'orange' | 'purple';
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  value,
  label,
  change,
  iconColor = 'blue',
  onClick
}) => {
  const iconColorClasses = {
    blue: 'stat-icon-blue',
    green: 'stat-icon-green', 
    orange: 'stat-icon-orange',
    purple: 'stat-icon-purple'
  };

  return (
    <div 
      className={`market-stat-card ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className={`market-stat-icon ${iconColorClasses[iconColor]}`}>
        {icon}
      </div>
      <div className="market-stat-value">{value}</div>
      <div className="market-stat-label">{label}</div>
      {change && (
        <div className={`market-stat-change ${change.isPositive ? 'change-positive' : 'change-negative'}`}>
          {change.value}
        </div>
      )}
    </div>
  );
};

export default StatCard;
