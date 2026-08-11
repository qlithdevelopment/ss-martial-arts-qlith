import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Calendar, Tag, Image as ImageIcon, Clock, MapPin } from "lucide-react";

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

const formatEventDate = (dateStr) => {
  if (!dateStr) return "Not set";
  try {
    return new Date(dateStr).toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const timingStyles = {
  upcoming: "bg-emerald-50 text-emerald-600 border-emerald-100",
  ongoing: "bg-blue-50 text-blue-600 border-blue-100",
  past: "bg-gray-100 text-gray-500 border-gray-200",
};

const ViewEventModal = ({ isOpen, onClose, event, onDelete, imageBaseUrl = "" }) => {
  const initial = (event?.name || "E").charAt(0).toUpperCase();
  const timingClass =
    timingStyles[event?.timing] || "bg-orange-50 text-[#f97316] border-orange-100";
  const imageUrl = event?.image ? `${imageBaseUrl}${event.image}` : null;

  return (
    <AnimatePresence>
      {isOpen && event && (
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
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-xl z-50 overflow-hidden flex flex-col md:flex-row"
          >
            {/* LEFT: Image */}
            <div className="relative w-full md:w-2/4 h-56 md:h-auto shrink-0 bg-gray-100 border-b md:border-b-0 md:border-r border-gray-100">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={event.name || "Event image"}
                  className="w-full h-full object-contain object-center"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                  <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-[#f97316] font-bold text-2xl">
                    {initial}
                  </div>
                </div>
              )}
              <div
                className={`absolute top-3 left-3 inline-block text-xs font-bold capitalize px-2.5 py-1 rounded-full border shadow-sm ${timingClass}`}
              >
                {event.timing || "Unknown"}
              </div>
            </div>

            {/* RIGHT: Details */}
            <div className="w-full md:w-3/5 flex flex-col min-w-0 max-h-[90vh]">
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50 shrink-0">
                <div className="min-w-0 pr-3">
                  <h3 className="text-lg font-bold text-gray-900 leading-tight truncate max-w-full">
                    {event.name || "Untitled Event"}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium truncate max-w-full">
                    Created on {formatDate(event.created_at)}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="shrink-0 text-gray-400 hover:text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 p-2 rounded-full transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 overflow-y-auto scrollbar-thin min-w-0">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 min-w-0">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Calendar size={12} /> Event Date
                    </p>
                    <p className="text-sm font-semibold text-gray-900 truncate max-w-full">
                      {formatEventDate(event.date)}
                    </p>
                  </div>
                  <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/50 min-w-0">
                    <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Tag size={12} /> Status
                    </p>
                    <p
                      className={`inline-block max-w-full truncate text-xs font-bold capitalize px-2.5 py-1 rounded-full border ${timingClass}`}
                    >
                      {event.timing || "Unknown"}
                    </p>
                  </div>
                </div>

                <div className="bg-orange-50/60 p-3 rounded-xl border border-orange-100 mb-6 min-w-0">
                  <p className="text-[11px] font-bold text-orange-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <MapPin size={12} /> Location
                  </p>
                  <p className="text-sm font-semibold text-orange-900 break-words max-w-full">
                    {event.location || "Not set"}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mb-6 min-w-0">
                  <Clock size={12} className="shrink-0" />
                  <span className="truncate max-w-full">Last updated {formatDate(event.updated_at)}</span>
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <ImageIcon size={12} /> Description
                  </p>
                  <div className="bg-gray-50 p-2 scrollbar-thin rounded-2xl border border-gray-100 h-auto overflow-y-auto max-w-full">
                    <p className="text-sm text-gray-700 max-h-32 overflow-y-auto whitespace-pre-wrap break-words leading-relaxed max-w-full">
                      {event.description || "No description provided."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50 shrink-0">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors text-sm shadow-sm"
                >
                  Close
                </button>
                {onDelete && (
                  <button
                    onClick={() => onDelete(event)}
                    className="px-5 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors text-sm flex items-center gap-2"
                  >
                    <Trash2 size={16} /> Delete Event
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ViewEventModal;