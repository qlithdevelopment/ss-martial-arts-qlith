import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Trash2,
  HelpCircle,
  MessageSquare,
  Hash,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const formatDate = (dateStr) => {
  if (!dateStr) return "Unknown";
  try {
    return new Date(dateStr).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return dateStr;
  }
};

const ViewFaqModal = ({ isOpen, onClose, faq, onDelete }) => {
  const initial = "Q";

  return (
    <AnimatePresence>
      {isOpen && faq && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-3xl shadow-xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 shrink-0 rounded-full bg-orange-100 flex items-center justify-center text-[#f97316] font-bold overflow-hidden">
                  {initial}
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 leading-tight truncate">
                    {faq.question || "Untitled Question"}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium truncate">
                    Created on {formatDate(faq.created_at)}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="shrink-0 text-gray-400 hover:text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 p-2 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 max-h-[65vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div
                  className={`p-3 rounded-xl border ${
                    faq.isPublish
                      ? "bg-emerald-50/50 border-emerald-100/50"
                      : "bg-amber-50/50 border-amber-100/50"
                  }`}
                >
                  <p
                    className={`text-[11px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1 ${
                      faq.isPublish ? "text-emerald-400" : "text-amber-500"
                    }`}
                  >
                    {faq.isPublish ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    Status
                  </p>
                  <p
                    className={`text-sm font-semibold ${
                      faq.isPublish ? "text-emerald-900" : "text-amber-900"
                    }`}
                  >
                    {faq.isPublish ? "Published" : "Draft"}
                  </p>
                </div>
                <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/50">
                  <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Hash size={12} /> Order
                  </p>
                  <p className="text-sm font-semibold text-indigo-900 truncate">
                    {faq.order ?? "Not set"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mb-6">
                <Clock size={12} />
                Last updated {formatDate(faq.updated_at)}
              </div>

              <div className="mb-6">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <HelpCircle size={12} /> Question
                </p>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-sm font-semibold text-gray-900 whitespace-pre-wrap leading-relaxed">
                    {faq.question || "No question provided."}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <MessageSquare size={12} /> Answer
                </p>
                <div className="bg-gray-50 p-4 scrollbar-thin rounded-2xl border border-gray-100 max-h-48 overflow-y-auto">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {faq.answer || "No answer provided."}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors text-sm shadow-sm"
              >
                Close
              </button>
              {onDelete && (
                <button
                  onClick={() => onDelete(faq)}
                  className="px-5 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors text-sm flex items-center gap-2"
                >
                  <Trash2 size={16} /> Delete FAQ
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ViewFaqModal;