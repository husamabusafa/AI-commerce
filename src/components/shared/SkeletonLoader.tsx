import React from 'react';

interface SkeletonLoaderProps {
  variant?: 'card' | 'list' | 'text' | 'image';
  className?: string;
}

export default function SkeletonLoader({ variant = 'card', className = '' }: SkeletonLoaderProps) {
  const baseClasses = 'animate-pulse bg-luxury-gray-200 dark:bg-luxury-gray-700 rounded-2xl';

  if (variant === 'card') {
    return (
      <div className={`p-0 overflow-hidden ${className}`}>
        <div className={`w-full h-64 ${baseClasses}`} />
        <div className="p-6 space-y-4">
          <div className={`h-6 w-3/4 ${baseClasses}`} />
          <div className={`h-4 w-full ${baseClasses}`} />
          <div className={`h-4 w-2/3 ${baseClasses}`} />
          <div className="flex items-center justify-between">
            <div className={`h-8 w-20 ${baseClasses}`} />
            <div className={`h-6 w-16 ${baseClasses}`} />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={`p-6 ${className}`}>
        <div className="flex items-center space-x-6 space-x-reverse">
          <div className={`w-24 h-24 ${baseClasses}`} />
          <div className="flex-1 space-y-3">
            <div className={`h-6 w-3/4 ${baseClasses}`} />
            <div className={`h-4 w-full ${baseClasses}`} />
            <div className={`h-4 w-2/3 ${baseClasses}`} />
            <div className="flex items-center gap-2">
              <div className={`h-6 w-16 ${baseClasses}`} />
              <div className={`h-6 w-12 ${baseClasses}`} />
            </div>
          </div>
          <div className="space-y-3">
            <div className={`h-10 w-24 ${baseClasses}`} />
            <div className={`h-8 w-8 ${baseClasses}`} />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className={`h-4 w-full ${baseClasses}`} />
        <div className={`h-4 w-5/6 ${baseClasses}`} />
        <div className={`h-4 w-4/6 ${baseClasses}`} />
      </div>
    );
  }

  if (variant === 'image') {
    return (
      <div className={`w-full h-full ${baseClasses} ${className}`} />
    );
  }

  return <div className={`h-4 w-full ${baseClasses} ${className}`} />;
}
