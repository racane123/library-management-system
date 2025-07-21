import React from 'react';

const LoadingSpinner = ({ 
  size = 'md', 
  text = 'Loading...', 
  variant = 'spinner',
  className = '',
  fullScreen = false 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const variants = {
    spinner: (
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-200 border-t-blue-600`}></div>
    ),
    dots: (
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    ),
    pulse: (
      <div className={`${sizeClasses[size]} bg-blue-600 rounded-full animate-pulse`}></div>
    ),
    bars: (
      <div className="flex space-x-1">
        <div className="w-1 h-4 bg-blue-600 rounded animate-pulse"></div>
        <div className="w-1 h-4 bg-blue-600 rounded animate-pulse" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-1 h-4 bg-blue-600 rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-1 h-4 bg-blue-600 rounded animate-pulse" style={{ animationDelay: '0.3s' }}></div>
      </div>
    )
  };

  const containerClasses = fullScreen 
    ? "fixed inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-50"
    : "flex flex-col items-center justify-center p-8";

  return (
    <div className={`${containerClasses} ${className}`}>
      {variants[variant]}
      {text && (
        <p className="mt-4 text-gray-600 text-sm font-medium text-center max-w-xs">
          {text}
        </p>
      )}
    </div>
  );
};

// Skeleton loader for content
export const SkeletonLoader = ({ lines = 3, className = '' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="h-4 bg-gray-200 rounded mb-2"
          style={{ 
            width: `${Math.random() * 40 + 60}%`,
            animationDelay: `${index * 0.1}s`
          }}
        ></div>
      ))}
    </div>
  );
};

// Button loading state
export const ButtonLoader = ({ size = 'sm' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  return (
    <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-white border-t-transparent`}></div>
  );
};

export default LoadingSpinner; 