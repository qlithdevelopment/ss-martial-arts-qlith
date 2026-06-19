import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Image as ImageIcon, ChevronRight, Send, Calendar, Clock, MapPin, User } from 'lucide-react'
import Button from '../../ui/Button'
import { getImageUrl } from '../../../utils/imageUtils'

const EventDetailModal = ({
  selectedEventId,
  selectedEvent,
  setSelectedEventId,
  isRegisterOpen,
  setIsRegisterOpen,
  handleRegisterSubmit,
  registerData,
  setRegisterData,
  isRegistering,
}) => {
  return (
    <>
      {/* Detail Modal Overlay */}
      <AnimatePresence>
        {selectedEventId && selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEventId(null)}
            className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md overflow-y-auto"
            data-lenis-prevent="true"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[800px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh] my-auto"
            >
              <button
                onClick={() => setSelectedEventId(null)}
                className="absolute top-4 right-4 z-50 w-8 h-8 bg-white shadow-md hover:bg-[var(--color-primary2)] text-[#0b1b24] hover:text-white rounded-full flex items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>

              {/* Modal Banner */}
              <div className="relative w-full h-[250px] md:h-[350px] shrink-0 bg-gray-900 flex items-center justify-center">
                {getImageUrl(selectedEvent.image) ? (
                  <motion.img
                    layoutId={`event-image-${selectedEvent.id}`}
                    src={getImageUrl(selectedEvent.image)}
                    alt={selectedEvent.name}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon size={64} className="text-gray-300" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1b24] via-transparent to-transparent p-6 md:p-12 flex flex-col justify-end pointer-events-none">
                  <div className="inline-block px-3 py-1 bg-[var(--color-primary2)] w-fit text-white font-black text-xs tracking-widest uppercase rounded shadow-lg mb-3">
                    {selectedEvent.date}
                  </div>
                  <motion.h2
                    layoutId={`event-title-${selectedEvent.id}`}
                    className="text-3xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-tight max-w-4xl"
                  >
                    {selectedEvent.name}
                  </motion.h2>
                </div>
              </div>

              {/* Modal Content Grid */}
              <div className="flex-1 flex flex-col p-6 md:p-10 gap-6 overflow-y-auto custom-scrollbar bg-white">
                {/* Left: Event Details */}
                <div className="flex flex-col gap-4 md:gap-5">
                  {/* Quick Info Bar */}
                  <div className="flex flex-wrap gap-3 bg-[#26c0ff] p-3 rounded-xl border border-[#26c0ff] text-xs">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-[#f97316]" />
                      <span className="text-[#0b1b24] font-bold">
                        {selectedEvent.date}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} className="text-[#f97316]" />
                      <span className="text-[#0b1b24] font-bold">
                        {selectedEvent.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-[#f97316]" />
                      <span className="text-[#0b1b24] font-bold">
                        {selectedEvent.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User size={14} className="text-[#f97316]" />
                      <span className="text-[#0b1b24] font-bold">
                        {selectedEvent.speaker || 'TBA'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[#26c0ff] text-base font-black uppercase tracking-wider border-b border-gray-200 pb-1 mb-2">
                      About The Event
                    </h3>
                    <p className="text-gray-600 leading-relaxed font-medium text-xs md:text-sm whitespace-pre-wrap">
                      {selectedEvent.description || selectedEvent.fullDesc || 'No description provided for this event.'}
                    </p>
                  </div>

                  {selectedEvent.schedule && selectedEvent.schedule.length > 0 && (
                    <div>
                      <h3 className="text-[#26c0ff] text-base font-black uppercase tracking-wider border-b border-gray-200 pb-1 mb-2">
                        Event Schedule
                      </h3>
                      <div className="flex flex-col gap-1.5">
                        {selectedEvent.schedule.map((slot, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                          >
                            <div className="bg-[#f97316]/10 text-[#f97316] font-bold text-[10px] md:text-xs px-2 py-1 rounded-md shrink-0 w-[80px] md:w-[90px] text-center border border-[#f97316]/20">
                              {slot.time}
                            </div>
                            <p className="text-[#0b1b24] font-bold text-xs md:text-sm">
                              {slot.activity}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100 flex justify-center shrink-0">
                  <Button
                    onClick={() => setIsRegisterOpen(true)}
                    variant="accent"
                    className="w-full md:w-auto px-12 py-4 text-sm uppercase tracking-widest rounded-xl flex items-center justify-center gap-2"
                  >
                    Register Now <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Registration Modal Overlay */}
      <AnimatePresence>
        {isRegisterOpen && selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md bg-white rounded-[24px] shadow-2xl p-6 md:p-8 relative"
            >
              <button
                onClick={() => setIsRegisterOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>

              <h3 className="text-xl md:text-2xl font-black text-[#0b1b24] uppercase tracking-tighter mb-1">
                Register for
              </h3>
              <h4 className="text-[var(--color-primary2)] font-bold text-sm mb-6 line-clamp-2">
                {selectedEvent.name}
              </h4>

              <form
                onSubmit={handleRegisterSubmit}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-1.5">
                  <label className="text-[#0b1b24]/70 text-[10px] font-bold uppercase tracking-widest">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={registerData.name}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, name: e.target.value })
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[var(--color-primary2)] focus:ring-2 focus:ring-[var(--color-primary2)]/20 transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[#0b1b24]/70 text-[10px] font-bold uppercase tracking-widest">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={registerData.email}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        email: e.target.value,
                      })
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[var(--color-primary2)] focus:ring-2 focus:ring-[var(--color-primary2)]/20 transition-all"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[#0b1b24]/70 text-[10px] font-bold uppercase tracking-widest">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={registerData.phone}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        phone: e.target.value,
                      })
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[var(--color-primary2)] focus:ring-2 focus:ring-[var(--color-primary2)]/20 transition-all"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isRegistering}
                  variant="primary"
                  className="mt-4 w-full disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest py-3.5 text-sm flex items-center justify-center gap-2"
                >
                  {isRegistering ? 'Registering...' : 'Confirm Registration'}{' '}
                  <Send size={16} className="text-[var(--color-primary2)]" />
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default EventDetailModal
