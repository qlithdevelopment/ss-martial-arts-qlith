import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, MapPin, Calendar, Hash, Medal, FileText } from 'lucide-react';

const DetailItem = ({ icon: Icon, label, value }) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 w-9 h-9 rounded-xl bg-[#f97316]/10 flex items-center justify-center flex-shrink-0">
        <Icon size={16} strokeWidth={2.5} className="text-[#f97316]" />
      </div>
      <div className="min-w-0">
        <span className="block text-[11px] font-bold uppercase tracking-wide text-gray-400 mb-0.5">
          {label}
        </span>
        <span className="block text-sm font-bold text-gray-900 break-words">
          {value}
        </span>
      </div>
    </div>
  );
};

const ViewAchievementModal = ({ isOpen, onClose, certificate }) => {
  if (!certificate) return null;

  const {
    title,
    tournament_played,
    medals,
    venue,
    date,
    certificate_number,
    certificated,
  } = certificate;

  const imageUrl = certificated?.[0] || null;

  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', duration: 0.5, bounce: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none"
          >
            <div className="bg-white w-full max-w-4xl rounded-[1.5rem] shadow-2xl flex flex-col max-h-[85dvh] pointer-events-auto overflow-hidden">

              {/* Header */}
              <div className="flex justify-between items-center p-5 sm:p-6 border-b border-gray-50 shrink-0 bg-white">
                <h3 className="text-xl font-black text-gray-900 tracking-tight">
                  Achievement Details
                </h3>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                >
                  <X size={20} strokeWidth={2.5} />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 sm:p-6 overflow-y-auto flex-1 scrollbar-thin custom-scrollbar">
                <div className="grid md:grid-cols-3 gap-6 md:gap-8">

                  {/* Left: Image */}
                  <div className="w-full">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-auto rounded-2xl border border-gray-100 object-contain shadow-sm"
                      />
                    ) : (
                      <div className="w-full aspect-[4/3] rounded-2xl border border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-2">
                        <FileText size={28} className="text-gray-300" />
                        <span className="text-xs font-semibold text-gray-400">
                          No certificate image
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right: Details (two columns) */}
                  <div className='col-span-2'>
                    <h2 className="text-lg font-black text-gray-900 tracking-tight mb-4">
                      {title}
                    </h2>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                      <DetailItem
                        icon={Trophy}
                        label="Tournament"
                        value={tournament_played}
                      />
                      <DetailItem
                        icon={Medal}
                        label="Medals"
                        value={medals}
                      />
                      <DetailItem
                        icon={MapPin}
                        label="Venue"
                        value={venue}
                      />
                      <DetailItem
                        icon={Calendar}
                        label="Date"
                        value={formattedDate}
                      />
                      <DetailItem
                        icon={Hash}
                        label="Certificate No."
                        value={certificate_number}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 p-4 sm:p-5 border-t border-gray-50 shrink-0 bg-white">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-sm font-bold shadow-sm text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ViewAchievementModal;