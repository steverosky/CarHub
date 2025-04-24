import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiX, FiHeart } from 'react-icons/fi';
import { useFocusTrap } from '../../hooks/useFocusTrap';

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginPromptModal: React.FC<LoginPromptModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useFocusTrap(isOpen);
  const loginButtonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (isOpen) {
      loginButtonRef.current?.focus();
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div 
        ref={modalRef}
        className="relative bg-white rounded-lg p-8 max-w-md w-full mx-4 z-10"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Close modal"
        >
          <FiX className="h-6 w-6" />
        </button>

        <div className="text-center">
          <FiHeart className="mx-auto h-12 w-12 text-blue-500" aria-hidden="true" />
          <h3 
            id="modal-title"
            className="mt-4 text-xl font-semibold text-gray-900"
          >
            Sign in to save favorites
          </h3>
          <p className="mt-2 text-gray-600">
            Create an account or sign in to save your favorite cars and access them from any device.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <Link
            ref={loginButtonRef}
            to="/login"
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={onClose}
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={onClose}
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPromptModal;