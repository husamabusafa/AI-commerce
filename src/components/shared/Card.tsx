import type { CSSProperties, ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  style?: CSSProperties;
}

export default function Card({ 
  children, 
  className = '', 
  padding = 'md',
  hover = false,
  style
}: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  } as const;

  const baseClasses = `relative overflow-hidden glass rounded-2xl shadow-luxury ring-1 ring-luxury-gray-200/50 dark:ring-luxury-gray-700/50 ${paddingClasses[padding]}`;
  const hoverClasses = hover 
    ? 'cursor-pointer transition-all duration-200 transition-luxury hover:-translate-y-1 hover:shadow-glow'
    : 'transition-all duration-200';

  return (
    <div style={style} className={`group ${baseClasses} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
}
