import React from 'react';

interface SpinnerProps {
  /**
   * Size of the spinner.
   * sm => 1rem (16px)
   * md => 1.5rem (24px)
   * lg => 2rem (32px)
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Tailwind colour utility class (e.g. 'border-blue-600').
   * The top border will automatically be set to transparent to create the spinning gap effect.
   */
  colorClass?: string;
}

const sizeClassMap: Record<Required<SpinnerProps>['size'], string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-4',
};

export default function Spinner({ size = 'md', colorClass = 'border-blue-600' }: SpinnerProps) {
  const classes = `rounded-full animate-spin ${sizeClassMap[size]} ${colorClass} border-t-transparent`;
  return <div role="status" className={classes} />;
} 