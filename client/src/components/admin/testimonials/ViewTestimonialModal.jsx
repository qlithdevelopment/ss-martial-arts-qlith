import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Edit2, User } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, "")

const ViewTestimonialModal = ({ isOpen, onClose, testimonial, onEdit }) => {
  if (!testimonial) return null;
  const profile = BASE_URL +'/storage'+ `/${testimonial.image}`
  

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-lg bg-white rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
              <h3 className="text-lg font-bold text-gray-900">Testimonial Details</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-14 h-14 rounded-full bg-orange-50 text-[#f97316] flex items-center justify-center shrink-0 overflow-hidden">
                  {testimonial.image ? (
                    <img
                      src={profile}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <User size={24} />
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="text-lg font-bold text-gray-900 truncate">
                    {testimonial.name || "Unnamed"}
                  </h4>
                  {testimonial.role && (
                    <p className="text-sm text-orange-500 font-bold">{testimonial.role}</p>
                  )}
                  {testimonial.stars ? (
                    <div className="flex items-center gap-0.5 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < testimonial.stars
                              ? "text-orange-400 fill-orange-400"
                              : "text-gray-200 fill-gray-200"
                          }
                        />
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>

              {testimonial.title && (
                <div className="mb-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Title
                  </p>
                  <p className="font-bold text-gray-900">{testimonial.title}</p>
                </div>
              )}

              <div className="mb-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Text
                </p>
                <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl">
                  {testimonial.text}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Type
                </p>
                <span className="inline-block text-xs font-bold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full uppercase tracking-wide">
                  {testimonial.type || "N/A"}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-5 border-t border-gray-100 shrink-0 bg-white">
              <button
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-200 rounded-xl transition-colors shadow-sm"
              >
                Close
              </button>
              <button
                onClick={() => onEdit?.(testimonial)}
                className="px-5 py-2.5 text-sm font-bold text-white bg-[#f97316] hover:bg-orange-600 rounded-xl transition-all shadow-md shadow-orange-500/20 flex items-center gap-2"
              >
                <Edit2 size={14} /> Edit
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ViewTestimonialModal;