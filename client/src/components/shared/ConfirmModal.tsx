import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  isDangerous = false,
  isLoading = false,
}: ConfirmModalProps) {
  const { t } = useLanguage();

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  const modalContent = (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
        style={{ zIndex: 9999 }}
        onClick={onClose}
      />

      {/* Modal */}
      <div 
        className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none"
        style={{ zIndex: 10000 }}
      >
        <div
          className="glass rounded-3xl shadow-luxury border border-luxury-gray-200 dark:border-luxury-gray-700 max-w-md w-full pointer-events-auto animate-slideIn"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-luxury-gray-200 dark:border-luxury-gray-700">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-2xl ${isDangerous ? 'bg-red-100 dark:bg-red-900/20' : 'bg-luxury-gold-primary/10'}`}>
                <AlertTriangle className={`h-5 w-5 ${isDangerous ? 'text-red-600 dark:text-red-400' : 'text-luxury-gold-primary'}`} />
              </div>
              <h3 className="text-lg font-semibold text-luxury-text-light dark:text-luxury-text-dark arabic-heading">
                {title}
              </h3>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-2 hover:bg-luxury-gray-100 dark:hover:bg-luxury-gray-700 rounded-xl transition-colors disabled:opacity-50"
            >
              <X className="h-5 w-5 text-luxury-gray-600 dark:text-luxury-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-luxury-gray-600 dark:text-luxury-gray-400 arabic-text leading-relaxed">
              {message}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-3 p-6 border-t border-luxury-gray-200 dark:border-luxury-gray-700">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-luxury-gray-100 dark:bg-luxury-gray-700 hover:bg-luxury-gray-200 dark:hover:bg-luxury-gray-600 text-luxury-text-light dark:text-luxury-text-dark font-medium rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed arabic-text"
            >
              {cancelText || t('common.cancel')}
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className={`flex-1 px-6 py-3 font-medium rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed arabic-text ${
                isDangerous
                  ? 'bg-red-600 hover:bg-red-700 text-white hover:shadow-glow'
                  : 'bg-luxury-gold-primary hover:bg-luxury-gold-secondary text-white hover:shadow-glow'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{t('common.loading')}</span>
                </div>
              ) : (
                confirmText || t('common.confirm')
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );

  // Render modal at the root level using portal
  return createPortal(modalContent, document.body);
}
