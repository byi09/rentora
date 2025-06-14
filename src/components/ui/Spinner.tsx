import React from 'react';

interface SpinnerProps {
  /** Diameter in pixels */
  size?: number;
  /** Tailwind color class or hex string (applied to border-t color) */
  colorClass?: string;
  /** Additional classes */
  className?: string;
}

/**
 * Reusable loading spinner built purely with CSS so it needs no extra assets.
 * Defaults to a 32 px blue spinner but can be resized / recoloured.
 */
const Spinner: React.FC<SpinnerProps> = ({ size = 32, colorClass = 'border-blue-600', className = '' }) => {
  return (
    <div
      role="status"
      className={`inline-block animate-spin rounded-full border-2 border-solid border-transparent border-t-current ${colorClass} ${className}`.trim()}
      style={{ width: size, height: size, color: 'currentColor' }}
    />
  );
};

export default Spinner; 