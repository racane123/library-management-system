import React from 'react';

const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative animate-fade-in">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>
        {title && <h2 className="text-lg font-bold mb-4 text-gray-900">{title}</h2>}
        {children}
      </div>
    </div>
  );
};

export { Modal }; 