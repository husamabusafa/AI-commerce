import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  type = 'button'
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 transition-spring focus:outline-none focus:ring-4 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 hover-lift';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-600/90 focus:ring-blue-500/40 shadow-none hover:shadow-soft dark:bg-blue-500 dark:hover:bg-blue-500/90',
    secondary: 'bg-white/50 hover:bg-white/70 text-slate-900 shadow-none hover:shadow-soft dark:bg-white/5 dark:hover:bg-white/10 dark:text-gray-100',
    outline: 'ring-1 ring-slate-300/60 hover:ring-slate-400/60 text-slate-700 hover:text-slate-900 bg-transparent hover:bg-black/5 dark:ring-gray-600/60 dark:hover:ring-gray-500/60 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-white/5',
    ghost: 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-black/5 focus:ring-slate-500/30 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-white/5',
    danger: 'bg-red-600 text-white hover:bg-red-600/90 focus:ring-red-500/40 shadow-none hover:shadow-soft dark:bg-red-500 dark:hover:bg-red-500/90'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm min-h-[36px]',
    md: 'px-4 py-2.5 text-sm min-h-[44px]',
    lg: 'px-6 py-3 text-base min-h-[48px]'
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
}