

import React from 'react';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  className = ''
}) => {
  return (
    <div className={`rounded-lg bg-red-50 p-4 dark:bg-red-900/20 ${className}`}>
      <p className="text-red-800 dark:text-red-200">{message}</p>
    </div>
  );
};

