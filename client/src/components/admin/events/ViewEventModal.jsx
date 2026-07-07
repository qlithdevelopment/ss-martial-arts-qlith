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
                    {event.name || "Untitled Event"}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium truncate">
                    Created on {formatDate(event.created_at)}
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
            <div className="p-6 max-h-[65vh] scrollbar-thin overflow-y-auto">
              {/* Event image */}
              {imageUrl && (
                <div className="mb-6 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
                  <img
                    src={imageUrl}
                    alt={event.name || "Event image"}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Calendar size={12} /> Event Date
                  </p>
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {formatEventDate(event.date)}
                  </p>
                </div>
                <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/50">
                  <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Tag size={12} /> Status
                  </p>
                  <p
                    className={`inline-block text-xs font-bold capitalize px-2.5 py-1 rounded-full border ${timingClass}`}
                  >
                    {event.timing || "Unknown"}
                  </p>
                </div>
              </div>

              <div className="bg-orange-50/60 p-3 rounded-xl border border-orange-100 mb-6">
                <p className="text-[11px] font-bold text-orange-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <MapPin size={12} /> Location
                </p>
                <p className="text-sm font-semibold text-orange-900 break-words">
                  {event.location || "Not set"}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mb-6">
                <Clock size={12} />
                Last updated {formatDate(event.updated_at)}
              </div>

              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <ImageIcon size={12} /> Description
                </p>
                <div className="bg-gray-50 p-2  scrollbar-thin rounded-2xl border border-gray-100 h-auto overflow-y-auto">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap break-words leading-relaxed">
                    {event.description || "No description provided."}
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
                  onClick={() => onDelete(event)}
                  className="px-5 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors text-sm flex items-center gap-2"
                >
                  <Trash2 size={16} /> Delete Event
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ViewEventModal;