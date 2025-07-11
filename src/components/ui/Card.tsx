import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
  glass?: boolean;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> & {
  Header: React.FC<CardHeaderProps>;
  Body: React.FC<CardBodyProps>;
  Footer: React.FC<CardFooterProps>;
} = ({ 
  children, 
  className = '', 
  hover = false,
  gradient = false,
  glass = false
}) => {
  const baseClasses = 'card';
  const hoverClasses = hover ? 'hover:shadow-strong hover:-translate-y-1' : '';
  const gradientClasses = gradient ? 'bg-gradient-to-br from-primary-500 to-secondary-500 text-white border-0' : '';
  const glassClasses = glass ? 'glass' : '';

  const classes = [
    baseClasses,
    hoverClasses,
    gradientClasses,
    glassClasses,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {children}
    </div>
  );
};

const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => (
  <div className={`card-header ${className}`}>
    {children}
  </div>
);

const CardBody: React.FC<CardBodyProps> = ({ children, className = '' }) => (
  <div className={`card-body ${className}`}>
    {children}
  </div>
);

const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => (
  <div className={`card-footer ${className}`}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
