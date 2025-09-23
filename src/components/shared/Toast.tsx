import React, { useEffect } from 'react';
import { CheckCircle, X, ShoppingCart } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
  show: boolean;
}

export default function Toast({ 
  message, 
  type = 'success', 
  duration = 3000, 
  onClose, 
  show 
}: ToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  const typeStyles = {
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
  };

  const icons = {
    success: <CheckCircle className="h-5 w-5" />,
    error: <X className="h-5 w-5" />,
    info: <ShoppingCart className="h-5 w-5" />
  };

  return (
    <div className="fixed top-4 right-4 left-4 sm:left-auto sm:right-4 z-50 animate-slideIn">
      <div className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl border shadow-luxury backdrop-blur-sm ${typeStyles[type]}`}>
        {icons[type]}
        <span className="arabic-text font-medium text-sm sm:text-base flex-1">{message}</span>
        <button
          onClick={onClose}
          className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors flex-shrink-0"
        >
          <X className="h-3 w-3 sm:h-4 sm:w-4" />
        </button>
      </div>
    </div>
  );
}
