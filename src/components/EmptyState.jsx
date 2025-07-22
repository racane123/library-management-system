import React from 'react';

const EmptyState = ({ icon, title, message, actionText, onAction }) => {
  const IconComponent = icon;

  return (
    <div className="text-center py-12 px-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
      {IconComponent && <IconComponent className="mx-auto h-12 w-12 text-gray-400" />}
      <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-500">{message}</p>
      {onAction && actionText && (
        <div className="mt-6">
          <button
            type="button"
            onClick={onAction}
            className="btn-primary"
          >
            {actionText}
          </button>
        </div>
      )}
    </div>
  );
};

export default EmptyState; 