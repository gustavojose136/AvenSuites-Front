

import React from 'react';

interface EmptyStateProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div className={`rounded-lg border border-stroke bg-white p-8 text-center dark:border-dark-3 dark:bg-dark-2 ${className}`}>
      <p className="text-body-color dark:text-dark-6 mb-4">{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="rounded-lg bg-primary px-6 py-3 text-base font-medium text-white hover:bg-primary/90"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

