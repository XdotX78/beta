import React from 'react';

type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  color?: 'teal' | 'blue' | 'purple' | 'indigo';
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'teal', 
  text = 'Loading...' 
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const colorClasses = {
    teal: 'border-teal-500',
    blue: 'border-blue-500',
    purple: 'border-purple-500',
    indigo: 'border-indigo-500'
  };

  return (
    <div className="flex flex-col justify-center items-center h-full w-full">
      <div 
        className={`animate-spin rounded-full ${sizeClasses[size]} border-t-2 border-b-2 ${colorClasses[color]} mb-3`}
        aria-hidden="true"
      ></div>
      {text && <p className="text-gray-600">{text}</p>}
    </div>
  );
};

export default React.memo(LoadingSpinner); 