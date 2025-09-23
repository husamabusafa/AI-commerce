import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import Button from './Button';

export default function LanguageToggle() {
  const { state, dispatch } = useLanguage();

  const toggleLanguage = () => {
    const newLanguage = state.currentLanguage === 'ar' ? 'en' : 'ar';
    dispatch({ type: 'SET_LANGUAGE', payload: newLanguage });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="p-2 hover:bg-luxury-gray-100 dark:hover:bg-luxury-gray-700 transition-colors group"
      title={state.currentLanguage === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
    >
      <div className="flex items-center gap-1.5">
        <Globe className="h-4 w-4 text-luxury-gray-600 dark:text-luxury-gray-400 group-hover:text-luxury-gold-primary transition-colors" />
        <span className="text-xs font-medium text-luxury-gray-600 dark:text-luxury-gray-400 group-hover:text-luxury-gold-primary transition-colors">
          {state.currentLanguage === 'ar' ? 'EN' : 'عر'}
        </span>
      </div>
    </Button>
  );
}
