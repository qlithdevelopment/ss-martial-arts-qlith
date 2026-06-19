import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

const CustomDialog = ({ config, onClose }) => {
  const { isOpen, type, title, message, onConfirm, onCancel, confirmText, cancelText } = config;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        if (onCancel) onCancel();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onCancel]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    onClose();
  };

  const icons = {
    success: <CheckCircle className="text-green-500 w-12 h-12 mb-4" />,
    error: <XCircle className="text-red-500 w-12 h-12 mb-4" />,
    warning: <AlertTriangle className="text-yellow-500 w-12 h-12 mb-4" />,
    confirm: <AlertTriangle className="text-red-500 w-12 h-12 mb-4" />,
    info: <Info className="text-blue-500 w-12 h-12 mb-4" />
  };

  const confirmBtnColors = {
    success: 'bg-green-500 hover:bg-green-600',
    error: 'bg-red-500 hover:bg-red-600',
    warning: 'bg-yellow-500 hover:bg-yellow-600',
    confirm: 'bg-red-500 hover:bg-red-600',
    info: 'bg-blue-500 hover:bg-blue-600'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={handleCancel}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-sm w-full relative flex flex-col items-center text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCancel}
              className="absolute top-4 right-4 text-gray-400 hover:bg-gray-100 p-2 rounded-full transition-colors"
            >
              <X size={20} />
            </button>

            {icons[type]}

            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">
              {title}
            </h3>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              {message}
            </p>

            <div className="flex w-full gap-3">
              {(type === 'confirm' || type === 'warning') && (
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-xl transition-colors text-sm uppercase tracking-wider"
                >
                  {cancelText}
                </button>
              )}
              <button
                onClick={handleConfirm}
                className={`flex-1 text-white font-bold py-3 rounded-xl transition-colors text-sm uppercase tracking-wider shadow-lg ${confirmBtnColors[type]}`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CustomDialog;
