import React, { useEffect, useState } from 'react';
import { X, Check, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number; // in milliseconds, 0 = persistent
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
}

interface NotificationToastProps {
  notification: ToastNotification;
  onClose: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onClose,
  position = 'top-right'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 10);
    
    // Auto-close after duration
    let autoCloseTimer: NodeJS.Timeout;
    if (notification.duration && notification.duration > 0) {
      autoCloseTimer = setTimeout(() => {
        handleClose();
      }, notification.duration);
    }

    return () => {
      clearTimeout(timer);
      if (autoCloseTimer) clearTimeout(autoCloseTimer);
    };
  }, [notification.duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(notification.id);
      notification.onClose?.();
    }, 300); // Animation duration
  };

  const getIcon = () => {
    const iconProps = { size: 20, className: "flex-shrink-0" };
    
    switch (notification.type) {
      case 'success':
        return <Check {...iconProps} className="flex-shrink-0 text-green-600" />;
      case 'error':
        return <AlertCircle {...iconProps} className="flex-shrink-0 text-red-600" />;
      case 'warning':
        return <AlertTriangle {...iconProps} className="flex-shrink-0 text-yellow-600" />;
      case 'info':
      default:
        return <Info {...iconProps} className="flex-shrink-0 text-blue-600" />;
    }
  };

  const getTypeStyles = () => {
    switch (notification.type) {
      case 'success':
        return 'border-green-200 bg-green-50 text-green-800';
      case 'error':
        return 'border-red-200 bg-red-50 text-red-800';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'info':
      default:
        return 'border-blue-200 bg-blue-50 text-blue-800';
    }
  };

  const getPositionStyles = () => {
    const base = 'fixed z-50 max-w-md w-full mx-auto';
    
    switch (position) {
      case 'top-right':
        return `${base} top-4 right-4`;
      case 'top-left':
        return `${base} top-4 left-4`;
      case 'bottom-right':
        return `${base} bottom-4 right-4`;
      case 'bottom-left':
        return `${base} bottom-4 left-4`;
      case 'top-center':
        return `${base} top-4 left-1/2 transform -translate-x-1/2`;
      case 'bottom-center':
        return `${base} bottom-4 left-1/2 transform -translate-x-1/2`;
      default:
        return `${base} top-4 right-4`;
    }
  };

  const getAnimationStyles = () => {
    if (isExiting) {
      return 'opacity-0 scale-95 transform translate-x-2';
    }
    if (isVisible) {
      return 'opacity-100 scale-100 transform translate-x-0';
    }
    return 'opacity-0 scale-95 transform translate-x-2';
  };

  return (
    <div
      className={`
        ${getPositionStyles()}
        ${getAnimationStyles()}
        transition-all duration-300 ease-in-out
      `}
    >
      <div
        className={`
          border border-l-4 rounded-lg shadow-lg p-4
          ${getTypeStyles()}
        `}
      >
        <div className="flex items-start space-x-3">
          {getIcon()}
          
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm">{notification.title}</h4>
            <p className="text-sm mt-1 opacity-90">{notification.message}</p>
            
            {notification.action && (
              <button
                onClick={notification.action.onClick}
                className="mt-2 text-sm font-medium underline hover:no-underline transition-all"
              >
                {notification.action.label}
              </button>
            )}
          </div>
          
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 rounded-full hover:bg-black/10 transition-colors"
            aria-label="Fechar notificação"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationToast;
