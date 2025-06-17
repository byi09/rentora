import React from 'react';

interface SpinnerProps {
  /** Diameter in pixels */
  size?: number;
  /** Spinner variant */
  variant?: 'default' | 'dots' | 'progress';
  /** Tailwind color class or hex string (applied to border-top) */
  colorClass?: string;
  /** Optional text shown next to the spinner */
  label?: string;
  /** Extra classes */
  className?: string;
  /** Progress percentage (0-100) for progress variant */
  progress?: number;
}

/**
 * Re-usable spinner component with multiple variants.
 * Use <Spinner /> for default spinning circle
 * Use <Spinner variant="dots" /> for three bouncing dots
 * Use <Spinner variant="progress" progress={50} /> for progress bar
 */
export default function Spinner({
  size = 32,
  variant = 'default',
  colorClass = 'border-blue-600',
  label,
  className = '',
  progress = 0,
}: SpinnerProps) {
  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="flex space-x-1" style={{ width: size, height: size / 2 }}>
            <div 
              className={`rounded-full bg-current animate-bounce ${colorClass.replace('border-', 'text-')}`}
              style={{ 
                width: size / 4, 
                height: size / 4,
                animationDelay: '0ms'
              }}
            />
            <div 
              className={`rounded-full bg-current animate-bounce ${colorClass.replace('border-', 'text-')}`}
              style={{ 
                width: size / 4, 
                height: size / 4,
                animationDelay: '150ms'
              }}
            />
            <div 
              className={`rounded-full bg-current animate-bounce ${colorClass.replace('border-', 'text-')}`}
              style={{ 
                width: size / 4, 
                height: size / 4,
                animationDelay: '300ms'
              }}
            />
          </div>
        );
      
      case 'progress':
        return (
          <div className="w-full">
            <div className="w-full bg-gray-200 rounded-full" style={{ height: size / 4 }}>
              <div 
                className={`h-full rounded-full transition-all duration-300 ${colorClass.replace('border-', 'bg-')}`}
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
          </div>
        );
      
      default:
        return (
          <span
            className={`animate-spin rounded-full border-2 border-solid border-transparent border-t-current ${colorClass}`}
            style={{ width: size, height: size }}
          />
        );
    }
  };

  return (
    <span className={`inline-flex items-center gap-2 ${className}`.trim()} role="status">
      {renderSpinner()}
      {label && <span className="text-sm text-gray-600">{label}</span>}
    </span>
  );
} 