import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Edit2, Phone, MapPin, AlignLeft, Clock, Building2 } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, "");

const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  if (path.startsWith("/storage/")) return `${BASE_URL}${path}`;
  return `${BASE_URL}/storage/${path}`;
};

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

const ViewAffiliationModal = ({ isOpen, onClose, affiliation, onDelete, onEdit }) => {
  const initial = (affiliation?.name || "U").charAt(0).toUpperCase();

  return (
    <AnimatePresence>
      {isOpen && affiliation && (
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
                  {affiliation.image ? (
                    <img
                      src={getImageUrl(affiliation.image)}
                      alt={affiliation.name}
                      className="w-full h-full object-contain p-1"
                    />
                  ) : (
                    initial
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 leading-tight truncate">
                    {affiliation.name || "Unknown"}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium truncate">
                    Added on {formatDate(affiliation.created_at)}
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
              {/* Logo preview */}
              {/* <div className="w-full h-36 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden mb-6">
                {affiliation.image ? (
                  <img
                    src={getImageUrl(affiliation.image)}
                    alt={affiliation.name}
                    className="max-h-full max-w-full object-contain p-4"
                  />
                ) : (
                  <Building2 className="text-gray-300" size={40} />
                )}
              </div> */}

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Phone size={12} /> Phone
                  </p>
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {affiliation.phone ? (
                      <a
                        href={`tel:${affiliation.phone}`}
                        className="hover:text-orange-500 transition-colors"
                      >
                        {affiliation.phone}
                      </a>
                    ) : (
                      "Not provided"
                    )}
                  </p>
                </div>
                <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/50">
                  <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <MapPin size={12} /> Location
                  </p>
                  <p className="text-sm font-semibold text-indigo-900 truncate">
                    {affiliation.location || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mb-6">
                <Clock size={12} />
                {formatDate(affiliation.created_at)}
              </div>

              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <AlignLeft size={12} /> Description
                </p>
                <div className="bg-gray-50 p-4 scrollbar-thin rounded-2xl border border-gray-100 max-h-48 overflow-y-auto">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {affiliation.description || "No description provided."}
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
              {onEdit && (
                <button
                  onClick={() => onEdit(affiliation)}
                  className="px-5 py-2.5 bg-primary2 text-white font-bold rounded-xl hover:bg-primary2 transition-colors text-sm flex items-center gap-2"
                >
                  <Edit2 size={16} /> Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(affiliation)}
                  className="px-5 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors text-sm flex items-center gap-2"
                >
                  <Trash2 size={16} /> Delete Affiliation
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ViewAffiliationModal;