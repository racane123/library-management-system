import React, { createContext, useContext, useState, useCallback } from 'react';
import Notification from '../components/Notification';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback(({ message, type = 'info', duration = 5000, position = 'top-right' }) => {
    const id = Date.now() + Math.random();
    const notification = { id, message, type, duration, position };
    
    setNotifications(prev => [...prev, notification]);
    
    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const showSuccess = useCallback((message, options = {}) => {
    addNotification({ message, type: 'success', ...options });
  }, [addNotification]);

  const showError = useCallback((message, options = {}) => {
    addNotification({ message, type: 'error', ...options });
  }, [addNotification]);

  const showWarning = useCallback((message, options = {}) => {
    addNotification({ message, type: 'warning', ...options });
  }, [addNotification]);

  const showInfo = useCallback((message, options = {}) => {
    addNotification({ message, type: 'info', ...options });
  }, [addNotification]);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    clearAll
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div className="fixed inset-0 pointer-events-none z-50">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            message={notification.message}
            type={notification.type}
            duration={notification.duration}
            position={notification.position}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
}; 