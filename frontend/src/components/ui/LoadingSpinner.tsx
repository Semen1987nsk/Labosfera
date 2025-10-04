'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner = ({ size = 'md', className = '' }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={`inline-block ${className}`}>
      <div
        className={`${sizeClasses[size]} border-electric-blue border-t-transparent rounded-full animate-spin`}
      />
    </div>
  );
};

interface LoadingOverlayProps {
  message?: string;
}

export const LoadingOverlay = ({ message = 'Загрузка...' }: LoadingOverlayProps) => {
  return (
    <div className="fixed inset-0 bg-dark-blue/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-lg text-light-grey">{message}</p>
      </div>
    </div>
  );
};
