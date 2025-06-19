import React from 'react';

interface SpinnerProps {
  /** Diameter in pixels */
  size?: number;
  /** Tailwind color class or hex string (applied to border-top) */
  colorClass?: string;
  /** Optional text shown next to the spinner */
  label?: string;
  /** Extra classes */
  className?: string;
}

/**
 * Single, consistent circular spinner. Use:
 *   <Spinner size={24} />
 */
export default function Spinner({
  size = 32,
  colorClass = 'text-blue-600',
  label,
  className = '',
}: SpinnerProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`.trim()} role="status">
      <span
        className={`animate-spin rounded-full border-2 border-solid border-transparent border-t-current ${colorClass}`}
        style={{ width: size, height: size }}
      />
      {label && <span className="text-sm text-gray-600">{label}</span>}
    </span>
  );
} 