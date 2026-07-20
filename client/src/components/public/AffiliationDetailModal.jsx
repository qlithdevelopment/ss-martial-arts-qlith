import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, MapPin, Building2 } from 'lucide-react';

const AffiliationDetailModal = ({ affiliation, onClose, getImageUrl }) => {
  return (
    <AnimatePresence>
      {affiliation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-white rounded-[24px] overflow-hidden shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
            >
              <X size={18} />
            </button>

            {/* Logo */}
            <div className="w-full h-56 md:h-64 bg-gray-100 flex items-center justify-center p-8">
              {affiliation.image ? (
                <img
                  src={getImageUrl(affiliation.image)}
                  alt={affiliation.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <Building2 className="text-gray-300" size={64} />
              )}
            </div>

            {/* Details */}
            <div className="p-6 md:p-8">
              <h4 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-black mb-3">
                {affiliation.name}
              </h4>

              {affiliation.description && (
                <p className="text-sm md:text-base max-h-28 scrollbar-thin overflow-y-auto text-gray-600 leading-relaxed mb-5">
                  {affiliation.description}
                </p>
              )}

              <div className="flex flex-col gap-3">
                {affiliation.phone && (
                  <a
                    href={`tel:${affiliation.phone}`}
                    className="flex items-center gap-2.5 text-sm font-medium text-gray-800 hover:text-[#f97316] transition-colors"
                  >
                    <Phone size={16} className="shrink-0" />
                    <span>{affiliation.phone}</span>
                  </a>
                )}
                {affiliation.location && (
                  <div className="flex items-center gap-2.5 text-sm font-medium text-gray-800">
                    <MapPin size={16} className="shrink-0" />
                    <span>{affiliation.location}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AffiliationDetailModal;