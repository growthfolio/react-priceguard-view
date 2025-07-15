import React from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import NotificationToast from './NotificationToast';
import NotificationBanner from './NotificationBanner';

const NotificationContainer: React.FC = () => {
  const { 
    toasts, 
    removeToast, 
    banners, 
    removeBanner, 
    settings 
  } = useNotifications();

  return (
    <>
      {/* Banners */}
      {banners.map(banner => (
        <NotificationBanner
          key={banner.id}
          notification={banner}
          onClose={removeBanner}
          position="top"
        />
      ))}

      {/* Toasts */}
      <div className="fixed inset-0 pointer-events-none z-50">
        <div className={`
          absolute space-y-2 p-4
          ${settings.position.includes('top') ? 'top-0' : 'bottom-0'}
          ${settings.position.includes('right') ? 'right-0' : ''}
          ${settings.position.includes('left') ? 'left-0' : ''}
          ${settings.position.includes('center') ? 'left-1/2 transform -translate-x-1/2' : ''}
        `}>
          {toasts.map(toast => (
            <div key={toast.id} className="pointer-events-auto">
              <NotificationToast
                notification={toast}
                onClose={removeToast}
                position={settings.position}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default NotificationContainer;
