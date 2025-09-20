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

  const baseClasses = `relative overflow-hidden glass rounded-2xl shadow-soft ring-1 ring-white/60 dark:ring-white/10 ${paddingClasses[padding]}`;
  const hoverClasses = hover 
    ? 'cursor-pointer transition-all duration-500 transition-spring hover:-translate-y-0.5 hover:shadow-soft'
    : 'transition-all duration-300';

  return (
    <div style={style} className={`group ${baseClasses} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
}
