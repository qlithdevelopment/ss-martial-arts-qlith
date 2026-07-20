import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, LogOut, AlertTriangle, X, Check } from "lucide-react";

const iconMap = {
  delete: Trash2,
  logout: LogOut,
  warning: AlertTriangle,
};

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, type = "warning", isLoading }) => {
  const Icon = iconMap[type] || AlertTriangle;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl p-6 w-full max-w-sm relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col items-center text-center gap-3">
              <div className={`p-3 rounded-full ${
                type === "delete" ? "bg-red-50 text-[#F54900]" : "bg-orange-50 text-orange-500"
              }`}>
                <Icon size={22} />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
              <p className="text-sm text-gray-500">{message}</p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={onClose}
                className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className={`flex-1 py-2 rounded-lg text-white font-semibold flex items-center justify-center gap-2 ${
                  type === "delete" ? "bg-[#F54900] hover:bg-red-600" : "bg-orange-500 hover:bg-orange-600"
                }`}
              >
                {isLoading ? "Processing..." : (
                  <>
                    <Check size={16} /> Confirm
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;