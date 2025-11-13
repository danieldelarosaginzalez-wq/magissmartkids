import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'magic';
  text?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'default',
  text,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  if (variant === 'magic') {
    return (
      <div className={cn('flex flex-col items-center justify-center', className)}>
        <div className="relative">
          <Sparkles className={cn(
            sizeClasses[size],
            'text-primary animate-magic-sparkle'
          )} />
          <div className="absolute inset-0 animate-magic-pulse">
            <Sparkles className={cn(
              sizeClasses[size],
              'text-secondary opacity-50'
            )} />
          </div>
        </div>
        {text && (
          <p className={cn(
            'mt-3 text-magic-gray-600 font-magic',
            textSizeClasses[size]
          )}>
            {text}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <Loader2 className={cn(
        sizeClasses[size],
        'text-primary animate-spin'
      )} />
      {text && (
        <p className={cn(
          'mt-3 text-magic-gray-600',
          textSizeClasses[size]
        )}>
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;