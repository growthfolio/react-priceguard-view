import React from 'react';
import { X, AlertCircle, Info, AlertTriangle, CheckCircle } from 'lucide-react';

export interface BannerNotification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
}

interface NotificationBannerProps {
  notification: BannerNotification;
  onClose: (id: string) => void;
  position?: 'top' | 'bottom';
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({
  notification,
  onClose,
  position = 'top'
}) => {
  const handleClose = () => {
    onClose(notification.id);
    notification.onClose?.();
  };

  const getIcon = () => {
    const iconProps = { size: 20 };
    
    switch (notification.type) {
      case 'success':
        return <CheckCircle {...iconProps} className="text-green-600" />;
      case 'error':
        return <AlertCircle {...iconProps} className="text-red-600" />;
      case 'warning':
        return <AlertTriangle {...iconProps} className="text-yellow-600" />;
      case 'info':
      default:
        return <Info {...iconProps} className="text-blue-600" />;
    }
  };

  const getTypeStyles = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getPositionStyles = () => {
    switch (position) {
      case 'top':
        return 'top-0';
      case 'bottom':
        return 'bottom-0';
      default:
        return 'top-0';
    }
  };

  return (
    <div className={`fixed left-0 right-0 z-40 ${getPositionStyles()}`}>
      <div className={`border-b px-4 py-3 ${getTypeStyles()}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getIcon()}
              
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-semibold text-sm">{notification.title}</h4>
                  <span className="text-sm opacity-75">•</span>
                  <p className="text-sm opacity-90">{notification.message}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {notification.action && (
                <button
                  onClick={notification.action.onClick}
                  className="text-sm font-medium px-3 py-1 rounded border border-current hover:bg-black/10 transition-colors"
                >
                  {notification.action.label}
                </button>
              )}
              
              {!notification.persistent && (
                <button
                  onClick={handleClose}
                  className="p-1 rounded-full hover:bg-black/10 transition-colors"
                  aria-label="Fechar banner"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationBanner;
